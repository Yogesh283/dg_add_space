<?php

namespace App\Models;

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
                return $this->publicGameImageUrl($m[1]);
            }

            return $relative;
        }

        if (Str::startsWith($path, '/img/') && ! str_contains($path, '/img/games/')) {
            return $path;
        }

        if (preg_match('#(?:^|/)(games/.+)$#', $path, $m)) {
            return $this->publicGameImageUrl($m[1]);
        }

        if (Str::startsWith($path, '/')) {
            return $path;
        }

        // Relative: games/xxx.png
        if (str_starts_with($path, 'games/')) {
            return $this->publicGameImageUrl($path);
        }

        return '/img/'.$path;
    }

    /**
     * Ensure file is available under public/img/games (nginx static) and return URL.
     */
    private function publicGameImageUrl(string $relativeGamesPath): string
    {
        $relativeGamesPath = ltrim($relativeGamesPath, '/');
        $basename = basename($relativeGamesPath);
        $publicRelative = 'games/'.$basename;
        $publicFull = public_path('img/'.$publicRelative);

        if (! is_file($publicFull)) {
            $sources = [
                storage_path('app/public/games/'.$basename),
                storage_path('app/public/'.$relativeGamesPath),
                public_path('uploads/games/'.$basename),
                public_path('storage/games/'.$basename),
            ];

            foreach ($sources as $source) {
                if (is_file($source)) {
                    if (! is_dir(dirname($publicFull))) {
                        @mkdir(dirname($publicFull), 0755, true);
                    }
                    @copy($source, $publicFull);
                    break;
                }
            }
        }

        return '/img/'.$publicRelative;
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
