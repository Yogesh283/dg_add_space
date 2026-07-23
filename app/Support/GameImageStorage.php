<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class GameImageStorage
{
    /**
     * @return list<string>
     */
    public static function webRoots(): array
    {
        $roots = [
            public_path('img'),
            base_path('img'),
            base_path('public/img'),
        ];

        // Dual deploy folders: .../dgadspace.com and .../dgadspace.com/dgadspace.com
        $parentImg = dirname(base_path()).'/img';
        $parentPublicImg = dirname(base_path()).'/public/img';
        $childImg = base_path('dgadspace.com/img');
        $childPublicImg = base_path('dgadspace.com/public/img');

        foreach ([$parentImg, $parentPublicImg, $childImg, $childPublicImg] as $extra) {
            $roots[] = $extra;
        }

        return array_values(array_unique(array_filter($roots)));
    }

    /**
     * Store uploaded file into every likely nginx /img root. Returns relative games/xxx path.
     */
    public static function storeUploaded(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'png');
        $filename = Str::lower((string) Str::ulid()).'.'.$extension;
        $relative = 'games/'.$filename;
        $binary = file_get_contents($file->getRealPath());

        if ($binary === false) {
            throw new \RuntimeException('Could not read uploaded game image.');
        }

        self::writeEverywhere($relative, $binary);

        // Keep a storage copy too (admin recovery / sync)
        $storagePath = storage_path('app/public/'.$relative);
        File::ensureDirectoryExists(dirname($storagePath));
        File::put($storagePath, $binary);

        return $relative;
    }

    public static function writeEverywhere(string $relativeGamesPath, string $binary): void
    {
        $relativeGamesPath = ltrim(str_replace('\\', '/', $relativeGamesPath), '/');
        if (! str_starts_with($relativeGamesPath, 'games/')) {
            $relativeGamesPath = 'games/'.basename($relativeGamesPath);
        }

        foreach (self::webRoots() as $root) {
            $dest = rtrim($root, '/\\').DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relativeGamesPath);
            try {
                File::ensureDirectoryExists(dirname($dest));
                File::put($dest, $binary);
            } catch (\Throwable) {
                // try next root
            }
        }
    }

    public static function syncExisting(string $relativeOrBasename): bool
    {
        $basename = basename($relativeOrBasename);
        $relative = 'games/'.$basename;

        $sources = [
            public_path('img/'.$relative),
            base_path('img/'.$relative),
            base_path('public/img/'.$relative),
            storage_path('app/public/'.$relative),
            storage_path('app/public/games/'.$basename),
            public_path('uploads/games/'.$basename),
            public_path('storage/games/'.$basename),
            dirname(base_path()).'/public/img/'.$relative,
            dirname(base_path()).'/img/'.$relative,
            dirname(base_path()).'/storage/app/public/games/'.$basename,
            base_path('dgadspace.com/public/img/'.$relative),
            base_path('dgadspace.com/storage/app/public/games/'.$basename),
        ];

        $binary = null;
        foreach ($sources as $source) {
            if (is_file($source)) {
                $binary = file_get_contents($source);
                if ($binary !== false) {
                    break;
                }
            }
        }

        if ($binary === null || $binary === false) {
            return false;
        }

        self::writeEverywhere($relative, $binary);

        return true;
    }

    public static function publicUrl(string $relativeOrBasename): string
    {
        $basename = basename($relativeOrBasename);

        return '/img/games/'.$basename;
    }
}
