<?php

namespace App\Services;

use App\Mail\LoginOtpMail;
use App\Models\EmailOtp;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class OtpService
{
    /**
     * Create and send OTP via email.
     */
    public function send(string $email, string $purpose = 'login'): void
    {
        $otp = (string) random_int(100000, 999999);

        EmailOtp::where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->delete();

        EmailOtp::create([
            'email' => $email,
            'otp' => $otp,
            'purpose' => $purpose,
            'expires_at' => now()->addMinutes(10),
        ]);

        try {
            Mail::to($email)->send(new LoginOtpMail($otp, $purpose));
        } catch (Throwable $e) {
            Log::error('OTP mail failed', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'email' => 'Could not send OTP email. Check MAIL_PASSWORD in .env (Hostinger mailbox password), or set MAIL_MAILER=log for local testing.',
            ]);
        }

    }

    public function verify(string $email, string $otp, string $purpose = 'login'): bool
    {
        $record = EmailOtp::query()
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (! $record || $record->expires_at->isPast() || $record->otp !== $otp) {
            throw ValidationException::withMessages([
                'otp' => 'Invalid or expired OTP.',
            ]);
        }

        $record->update(['verified_at' => now()]);

        return true;
    }

    public function ensureUserExists(string $email): User
    {
        $user = User::where('email', $email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'No account found with this email. Please register first.',
            ]);
        }

        return $user;
    }
}
