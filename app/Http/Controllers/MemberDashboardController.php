<?php

namespace App\Http\Controllers;

use App\Models\GamePurchase;
use App\Models\SupportTicket;
use App\Models\TicketReply;
use App\Services\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MemberDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->loadCount(['purchases', 'payments', 'tickets', 'referrals']);

        return Inertia::render('Member/Dashboard', [
            'stats' => [
                'purchases' => $user->purchases_count,
                'payments' => $user->payments_count,
                'tickets' => $user->tickets_count,
                'referrals' => $user->referrals_count,
                'wallet' => (float) $user->wallet_balance,
                'referral_code' => $user->referral_code,
                'referral_link' => url('/register?ref='.$user->referral_code),
            ],
            'recentPurchases' => $user->purchases()->latest()->take(5)->get(),
            'recentIncomes' => $user->levelIncomes()->with('fromUser:id,name,email')->latest()->take(5)->get(),
        ]);
    }

    public function purchases(Request $request): Response
    {
        return Inertia::render('Member/Purchases', [
            'purchases' => $request->user()->purchases()->latest()->paginate(10),
        ]);
    }

    public function payments(Request $request): Response
    {
        return Inertia::render('Member/Payments', [
            'payments' => $request->user()->payments()->with('gamePurchase:id,game_name,order_id')->latest()->paginate(10),
        ]);
    }

    public function incomes(Request $request): Response
    {
        return Inertia::render('Member/Incomes', [
            'incomes' => $request->user()
                ->levelIncomes()
                ->with(['fromUser:id,name,email', 'gamePurchase:id,game_name,order_id'])
                ->latest()
                ->paginate(15),
            'levels' => PurchaseService::LEVEL_PERCENTS,
        ]);
    }

    public function tickets(Request $request): Response
    {
        return Inertia::render('Member/Tickets', [
            'tickets' => $request->user()->tickets()->withCount('replies')->latest()->paginate(10),
            'purchases' => $request->user()->purchases()->latest()->get(['id', 'game_name', 'order_id']),
        ]);
    }

    public function storeTicket(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'game_purchase_id' => ['nullable', 'exists:game_purchases,id'],
            'priority' => ['nullable', 'in:low,medium,high'],
        ]);

        if (! empty($data['game_purchase_id'])) {
            $owns = $request->user()->purchases()->where('id', $data['game_purchase_id'])->exists();
            if (! $owns) {
                return back()->withErrors(['game_purchase_id' => 'Invalid purchase selected.']);
            }
        }

        SupportTicket::create([
            'ticket_no' => 'TKT-'.strtoupper(Str::random(8)),
            'user_id' => $request->user()->id,
            'game_purchase_id' => $data['game_purchase_id'] ?? null,
            'subject' => $data['subject'],
            'message' => $data['message'],
            'priority' => $data['priority'] ?? 'medium',
            'status' => 'open',
        ]);

        return back()->with('success', 'Ticket generated successfully. Admin will reply soon.');
    }

    public function showTicket(Request $request, SupportTicket $ticket): Response
    {
        abort_unless($ticket->user_id === $request->user()->id, 403);

        $ticket->load(['replies.user:id,name', 'gamePurchase:id,game_name,order_id']);

        return Inertia::render('Member/TicketShow', [
            'ticket' => $ticket,
        ]);
    }

    public function replyTicket(Request $request, SupportTicket $ticket): RedirectResponse
    {
        abort_unless($ticket->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        TicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'is_admin' => false,
            'message' => $data['message'],
        ]);

        if ($ticket->status === 'resolved') {
            $ticket->update(['status' => 'open']);
        }

        return back()->with('success', 'Reply sent.');
    }

    public function buyGame(Request $request, PurchaseService $purchaseService): RedirectResponse
    {
        $data = $request->validate([
            'game_id' => ['nullable', 'exists:games,id'],
            'game_name' => ['required', 'string', 'max:255'],
            'game_category' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'addon_ids' => ['nullable', 'array'],
            'addon_ids.*' => ['integer', 'exists:game_addons,id'],
        ]);

        $addonIds = collect($data['addon_ids'] ?? [])->unique()->values();
        $addons = \App\Models\GameAddon::query()
            ->whereIn('id', $addonIds)
            ->where('is_active', true)
            ->get();

        $addonTotal = (float) $addons->sum('price');
        $addonNotes = $addons->map(fn ($addon) => $addon->name.' (₹'.number_format((float) $addon->price, 0, '.', ',').')')->implode(', ');

        if (! empty($data['game_id'])) {
            $game = \App\Models\Game::query()
                ->where('id', $data['game_id'])
                ->where('is_active', true)
                ->firstOrFail();

            $data['game_name'] = $game->name;
            $data['game_category'] = $game->category;
            $data['amount'] = (float) $game->price + $addonTotal;
        } else {
            $data['amount'] = (float) $data['amount'] + $addonTotal;
        }

        try {
            $result = $purchaseService->createPendingRazorpayOrder(
                $request->user(),
                $data['game_name'],
                (float) $data['amount'],
                $data['game_category'] ?? null,
                $addonNotes ?: null
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Throwable $e) {
            return back()->withErrors([
                'payment' => $e->getMessage() ?: 'Unable to start Razorpay payment.',
            ]);
        }

        return redirect()
            ->route('member.pay', $result['purchase'])
            ->with('success', 'Order created. Complete payment with Razorpay — UPI / Card / NetBanking.');
    }

    public function showPay(Request $request, GamePurchase $purchase): Response
    {
        abort_unless($purchase->user_id === $request->user()->id, 403);

        $razorpayOrderId = data_get($purchase->payment?->meta, 'razorpay_order_id')
            ?: $purchase->payment?->transaction_id;

        return Inertia::render('Member/PayRazorpay', [
            'purchase' => $purchase->load('payment'),
            'razorpay' => [
                'key' => config('razorpay.key'),
                'order_id' => $razorpayOrderId,
                'amount' => (int) round(((float) $purchase->amount) * 100),
                'currency' => config('razorpay.currency', 'INR'),
                'name' => 'DG Ad Space',
                'description' => $purchase->game_name.' — '.$purchase->order_id,
                'prefill' => [
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'contact' => $request->user()->phone,
                ],
            ],
        ]);
    }

    public function verifyRazorpay(Request $request, GamePurchase $purchase, PurchaseService $purchaseService): RedirectResponse
    {
        abort_unless($purchase->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
        ]);

        try {
            $purchaseService->verifyRazorpayPayment(
                $purchase,
                $data['razorpay_order_id'],
                $data['razorpay_payment_id'],
                $data['razorpay_signature']
            );
        } catch (\Throwable $e) {
            return redirect()
                ->route('member.pay', $purchase)
                ->withErrors(['payment' => $e->getMessage() ?: 'Payment verification failed.']);
        }

        return redirect()
            ->route('member.purchases')
            ->with('success', 'Payment successful! Order '.$purchase->order_id.' is paid automatically.');
    }
}
