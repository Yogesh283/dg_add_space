<?php

namespace App\Services;

use App\Models\GamePurchase;
use App\Models\LevelIncome;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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

    public function purchase(User $user, string $gameName, float $amount, ?string $category = null, string $method = 'UPI'): GamePurchase
    {
        return DB::transaction(function () use ($user, $gameName, $amount, $category, $method) {
            $purchase = GamePurchase::create([
                'order_id' => 'ORD-'.strtoupper(Str::random(10)),
                'user_id' => $user->id,
                'game_name' => $gameName,
                'game_category' => $category,
                'amount' => $amount,
                'status' => 'paid',
                'payment_method' => $method,
            ]);

            Payment::create([
                'user_id' => $user->id,
                'game_purchase_id' => $purchase->id,
                'transaction_id' => 'TXN-'.strtoupper(Str::random(12)),
                'amount' => $amount,
                'method' => $method,
                'status' => 'success',
                'meta' => ['game' => $gameName],
            ]);

            $this->distributeLevelIncome($user, $purchase);

            return $purchase->fresh(['payment']);
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
