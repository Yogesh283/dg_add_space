<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GamePurchase extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'game_name',
        'game_category',
        'amount',
        'status',
        'payment_method',
        'utr_number',
        'paid_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function levelIncomes(): HasMany
    {
        return $this->hasMany(LevelIncome::class);
    }
}
