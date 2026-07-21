<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SupportTicket extends Model
{
    protected $fillable = [
        'ticket_no',
        'user_id',
        'game_purchase_id',
        'subject',
        'message',
        'status',
        'priority',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function gamePurchase(): BelongsTo
    {
        return $this->belongsTo(GamePurchase::class);
    }

    public function replies(): HasMany
    {
        return $this->hasMany(TicketReply::class)->latest();
    }
}
