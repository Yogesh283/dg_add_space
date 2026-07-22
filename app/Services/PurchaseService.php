<?php

namespace App\Services;

use App\Models\GamePurchase;
use App\Models\LevelIncome;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class PurchaseService
{
    /** Level 1 = 10%, Level 2-6 = 2% each */
    public const LEVEL_PERCENTS = [
        1 => 10,
        2 => 2,
        3 => 2,
        4 => 2,
        5 => 2,
        6 => 2,
    ];

    /**
     * Create pending order + Razorpay order (auto verify on payment success).
     */
    public function createPendingRazorpayOrder(
        User $user,
        string $gameName,
        float $amount,
        ?string $category = null,
        ?string $notes = null
    ): array {
        if (! config('razorpay.key') || ! config('razorpay.secret')) {
            throw ValidationException::withMessages([
                'payment' => 'Razorpay is not configured. Add RAZORPAY_KEY and RAZORPAY_SECRET in .env.',
            ]);
        }

        return DB::transaction(function () use ($user, $gameName, $amount, $category, $notes) {
            $purchase = GamePurchase::create([
                'order_id' => 'ORD-'.strtoupper(Str::random(10)),
                'user_id' => $user->id,
                'game_name' => $gameName,
                'game_category' => $category,
                'amount' => $amount,
                'status' => 'pending_payment',
                'payment_method' => 'Razorpay',
                'notes' => $notes,
            ]);

            $razorpayOrder = $this->createRazorpayOrder($purchase);

            Payment::create([
                'user_id' => $user->id,
                'game_purchase_id' => $purchase->id,
                'transaction_id' => $razorpayOrder['id'],
                'amount' => $amount,
                'method' => 'Razorpay',
                'status' => 'pending',
                'meta' => [
                    'game' => $gameName,
                    'addons' => $notes,
                    'gateway' => 'razorpay',
                    'razorpay_order_id' => $razorpayOrder['id'],
                ],
            ]);

            return [
                'purchase' => $purchase->fresh(['payment']),
                'razorpay_order_id' => $razorpayOrder['id'],
            ];
        });
    }

    public function createRazorpayOrder(GamePurchase $purchase): array
    {
        $amountPaise = (int) round(((float) $purchase->amount) * 100);

        $response = Http::withBasicAuth((string) config('razorpay.key'), (string) config('razorpay.secret'))
            ->asForm()
            ->post('https://api.razorpay.com/v1/orders', [
                'amount' => $amountPaise,
                'currency' => config('razorpay.currency', 'INR'),
                'receipt' => $purchase->order_id,
                'notes' => [
                    'purchase_id' => (string) $purchase->id,
                    'game' => $purchase->game_name,
                    'user_id' => (string) $purchase->user_id,
                ],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Razorpay order failed: '.$response->body());
        }

        return $response->json();
    }

    /**
     * Verify Razorpay signature and mark paid automatically (no admin).
     */
    public function verifyRazorpayPayment(
        GamePurchase $purchase,
        string $razorpayOrderId,
        string $razorpayPaymentId,
        string $razorpaySignature
    ): GamePurchase {
        if ($purchase->status === 'paid') {
            return $purchase;
        }

        $expected = hash_hmac(
            'sha256',
            $razorpayOrderId.'|'.$razorpayPaymentId,
            (string) config('razorpay.secret')
        );

        if (! hash_equals($expected, $razorpaySignature)) {
            throw ValidationException::withMessages([
                'payment' => 'Invalid Razorpay payment signature.',
            ]);
        }

        $storedOrderId = data_get($purchase->payment?->meta, 'razorpay_order_id');
        if ($storedOrderId && $storedOrderId !== $razorpayOrderId) {
            throw ValidationException::withMessages([
                'payment' => 'Razorpay order mismatch.',
            ]);
        }

        return DB::transaction(function () use ($purchase, $razorpayOrderId, $razorpayPaymentId, $razorpaySignature) {
            $purchase->update([
                'status' => 'paid',
                'paid_at' => now(),
                'utr_number' => $razorpayPaymentId,
                'payment_method' => 'Razorpay',
            ]);

            if ($purchase->payment) {
                $purchase->payment->update([
                    'transaction_id' => $razorpayPaymentId,
                    'status' => 'success',
                    'method' => 'Razorpay',
                    'meta' => array_merge($purchase->payment->meta ?? [], [
                        'razorpay_order_id' => $razorpayOrderId,
                        'razorpay_payment_id' => $razorpayPaymentId,
                        'razorpay_signature' => $razorpaySignature,
                        'verified_at' => now()->toDateTimeString(),
                        'auto' => true,
                    ]),
                ]);
            }

            if (! $purchase->levelIncomes()->exists()) {
                $this->distributeLevelIncome($purchase->user, $purchase);
            }

            return $purchase->fresh(['payment', 'user']);
        });
    }

    /**
     * Admin: company / offline sale — create paid order and run 6-level income.
     * If buyer has no referral (referred_by), purchase is saved but no income is paid.
     *
     * @return array{purchase: GamePurchase, incomes_count: int, skipped_no_referral: bool}
     */
    public function runCompanySaleLevelIncome(
        User $buyer,
        float $amount,
        ?string $productName = null,
        ?string $notes = null
    ): array {
        return DB::transaction(function () use ($buyer, $amount, $productName, $notes) {
            $buyer->loadMissing('sponsor');

            $purchase = GamePurchase::create([
                'order_id' => 'CMP-'.strtoupper(Str::random(10)),
                'user_id' => $buyer->id,
                'game_name' => $productName ?: 'Company Product Sale',
                'game_category' => 'Company Sale',
                'amount' => $amount,
                'status' => 'paid',
                'payment_method' => 'Company / Admin',
                'paid_at' => now(),
                'notes' => $notes ?: 'Admin manually ran level income for company sale.',
            ]);

            Payment::create([
                'user_id' => $buyer->id,
                'game_purchase_id' => $purchase->id,
                'transaction_id' => 'ADMIN-'.strtoupper(Str::random(12)),
                'amount' => $amount,
                'method' => 'Company / Admin',
                'status' => 'success',
                'meta' => [
                    'source' => 'admin_level_income_run',
                    'run_at' => now()->toDateTimeString(),
                ],
            ]);

            if (! $buyer->referred_by || ! $buyer->sponsor) {
                return [
                    'purchase' => $purchase->fresh(['payment', 'user']),
                    'incomes_count' => 0,
                    'skipped_no_referral' => true,
                ];
            }

            $this->distributeLevelIncome($buyer, $purchase);

            return [
                'purchase' => $purchase->fresh(['payment', 'user', 'levelIncomes']),
                'incomes_count' => $purchase->levelIncomes()->count(),
                'skipped_no_referral' => false,
            ];
        });
    }

    public function distributeLevelIncome(User $buyer, GamePurchase $purchase): void
    {
        $current = $buyer->sponsor;
        $level = 1;

        while ($current && $level <= 6) {
            $percent = self::LEVEL_PERCENTS[$level];
            $income = round(((float) $purchase->amount * $percent) / 100, 2);

            LevelIncome::create([
                'user_id' => $current->id,
                'from_user_id' => $buyer->id,
                'game_purchase_id' => $purchase->id,
                'level' => $level,
                'percent' => $percent,
                'purchase_amount' => $purchase->amount,
                'income_amount' => $income,
                'status' => 'credited',
            ]);

            $current->increment('wallet_balance', $income);

            $current = $current->sponsor;
            $level++;
        }
    }
}
