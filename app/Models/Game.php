<?php

namespace App\Models;

use App\Support\GameImageStorage;
use Illuminate\Database\Eloquent\Model;
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

        static::saved(function (Game $game) {
            $path = $game->normalizeImagePath($game->image_path);
            if ($path) {
                GameImageStorage::syncExisting($path);
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
            if (preg_match('#/(?:storage|uploads|media|img)/(games/.+)$#', $relative, $m)) {
                GameImageStorage::syncExisting($m[1]);

                return GameImageStorage::publicUrl($m[1]);
            }

            return $relative;
        }

        if (Str::startsWith($path, '/img/') && ! str_contains($path, '/img/games/')) {
            return $path;
        }

        if (preg_match('#(?:^|/)(games/.+)$#', $path, $m) || str_starts_with($path, 'games/')) {
            $relative = $m[1] ?? $path;
            GameImageStorage::syncExisting($relative);

            return GameImageStorage::publicUrl($relative);
        }

        if (Str::startsWith($path, '/')) {
            return $path;
        }

        return '/img/'.$path;
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
