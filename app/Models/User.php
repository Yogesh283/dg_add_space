<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'referral_code',
        'referred_by',
        'wallet_balance',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'wallet_balance' => 'decimal:2',
            'is_admin' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (empty($user->referral_code)) {
                $user->referral_code = static::generateUniqueReferralCode();
            }
        });
    }

    public static function generateUniqueReferralCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (static::where('referral_code', $code)->exists());

        return $code;
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return (bool) $this->is_admin;
    }

    public function sponsor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(GamePurchase::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function levelIncomes(): HasMany
    {
        return $this->hasMany(LevelIncome::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }
}
