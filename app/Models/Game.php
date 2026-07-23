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
        'market_price',
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
            'market_price' => 'decimal:2',
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
        $path = $this->normalizeImagePath($this->image_path);

        if (! $path) {
            return '/img/landing-game-hero.png';
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            $relative = parse_url($path, PHP_URL_PATH) ?: $path;
            // Old absolute storage/uploads URLs → media route
            if (preg_match('#/(?:storage|uploads)/(games/.+)$#', $relative, $m)) {
                return '/media/'.$m[1];
            }

            return $relative;
        }

        if (Str::startsWith($path, '/img/')) {
            return $path;
        }

        if (Str::startsWith($path, '/storage/') || Str::startsWith($path, '/uploads/') || Str::startsWith($path, '/media/')) {
            $trimmed = preg_replace('#^/(?:storage|uploads|media)/#', '', $path);

            return '/media/'.ltrim((string) $trimmed, '/');
        }

        if (Str::startsWith($path, '/')) {
            return $path;
        }

        // Relative disk path e.g. games/xxx.png — always via Laravel media route
        // so nginx docroot mismatch cannot break images.
        return '/media/'.$path;
    }

    private function normalizeImagePath(mixed $path): ?string
    {
        if (is_array($path)) {
            $path = $path[0] ?? null;
        }

        if (! is_string($path) || trim($path) === '') {
            return null;
        }

        $path = trim($path);

        if (str_starts_with($path, '[')) {
            $decoded = json_decode($path, true);
            if (is_array($decoded)) {
                $path = $decoded[0] ?? null;
            }
        }

        return is_string($path) && $path !== '' ? ltrim($path) : null;
    }

    public function toStoreArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => (float) $this->price,
            'market_price' => $this->market_price !== null ? (float) $this->market_price : null,
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
