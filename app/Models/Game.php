<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Game extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category',
        'price',
        'image_path',
        'tech',
        'mode',
        'rating',
        'downloads',
        'delivery',
        'description',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
            'rating' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Game $game) {
            if (empty($game->slug)) {
                $game->slug = static::uniqueSlug($game->name);
            }
        });

        static::updating(function (Game $game) {
            if ($game->isDirty('name') && empty($game->slug)) {
                $game->slug = static::uniqueSlug($game->name);
            }
        });
    }

    public static function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'game';
        $slug = $base;
        $i = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }

    public function getImageUrlAttribute(): string
    {
        if ($this->image_path) {
            if (Str::startsWith($this->image_path, ['http://', 'https://', '/'])) {
                return $this->image_path;
            }

            return Storage::disk('public')->url($this->image_path);
        }

        return '/img/landing-game-hero.png';
    }

    public function toStoreArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'category' => $this->category,
            'tech' => $this->tech,
            'mode' => $this->mode,
            'rating' => $this->rating,
            'downloads' => $this->downloads,
            'delivery' => $this->delivery,
            'description' => $this->description,
            'image' => $this->image_url,
        ];
    }
}
