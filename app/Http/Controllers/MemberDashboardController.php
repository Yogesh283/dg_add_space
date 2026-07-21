<?php

namespace App\Http\Controllers;

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
        ]);

        if (! empty($data['game_id'])) {
            $game = \App\Models\Game::query()
                ->where('id', $data['game_id'])
                ->where('is_active', true)
                ->firstOrFail();

            $data['game_name'] = $game->name;
            $data['game_category'] = $game->category;
            $data['amount'] = (float) $game->price;
        }

        $purchase = $purchaseService->purchase(
            $request->user(),
            $data['game_name'],
            (float) $data['amount'],
            $data['game_category'] ?? null,
            $data['payment_method'] ?? 'UPI'
        );

        return redirect()
            ->route('member.purchases')
            ->with('success', 'Purchase successful! Order '.$purchase->order_id.' created. Level income distributed.');
    }
}
