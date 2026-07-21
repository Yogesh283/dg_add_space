<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LevelIncome extends Model
{
    protected $fillable = [
        'user_id',
        'from_user_id',
        'game_purchase_id',
        'level',
        'percent',
        'purchase_amount',
        'income_amount',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'percent' => 'decimal:2',
            'purchase_amount' => 'decimal:2',
            'income_amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function gamePurchase(): BelongsTo
    {
        return $this->belongsTo(GamePurchase::class);
    }
}
