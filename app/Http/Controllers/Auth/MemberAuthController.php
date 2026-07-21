<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class MemberAuthController extends Controller
{
    public function showRegister(Request $request): Response
    {
        return Inertia::render('Auth/MemberRegister', [
            'referral' => $request->query('ref'),
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'referral_code' => ['nullable', 'string', 'max:20'],
        ]);

        $sponsorId = null;
        if (! empty($data['referral_code'])) {
            $sponsor = User::where('referral_code', strtoupper($data['referral_code']))->first();
            if (! $sponsor) {
                return back()->withErrors(['referral_code' => 'Invalid referral code.']);
            }
            $sponsorId = $sponsor->id;
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
            'referred_by' => $sponsorId,
            'email_verified_at' => now(),
            'is_admin' => false,
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('game-store');
    }

    public function showLogin(): Response
    {
        return Inertia::render('Auth/MemberLogin');
    }

    public function sendOtp(Request $request, OtpService $otpService): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $otpService->ensureUserExists($data['email']);
        $otpService->send($data['email'], 'login');

        return back()->with([
            'otp_sent' => true,
            'otp_email' => $data['email'],
            'success' => 'OTP sent to your email inbox. Please check your Gmail.',
        ]);
    }

    public function verifyOtp(Request $request, OtpService $otpService): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $otpService->verify($data['email'], $data['otp'], 'login');
        $user = $otpService->ensureUserExists($data['email']);

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->intended(route('game-store'));
    }
}
