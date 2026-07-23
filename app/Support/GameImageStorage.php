<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

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
            dirname(base_path()).'/img',
            dirname(base_path()).'/public/img',
            base_path('dgadspace.com/img'),
            base_path('dgadspace.com/public/img'),
        ];

        return array_values(array_unique(array_filter($roots)));
    }

    /**
     * Store uploaded file. Always persists to storage/app/public/games (required).
     * Also mirrors into possible nginx /img roots. Returns games/{ulid}.ext
     */
    public static function storeUploaded(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'png');
        if (! in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
            $extension = 'png';
        }

        $filename = Str::lower((string) Str::ulid()).'.'.$extension;
        $relative = 'games/'.$filename;
        $binary = file_get_contents($file->getRealPath());

        if ($binary === false || $binary === '') {
            throw new RuntimeException('Could not read uploaded game image.');
        }

        $storagePath = storage_path('app/public/'.$relative);
        File::ensureDirectoryExists(dirname($storagePath));
        File::put($storagePath, $binary);

        if (! is_file($storagePath) || filesize($storagePath) < 1) {
            throw new RuntimeException('Game image failed to save to storage: '.$storagePath);
        }

        self::writeEverywhere($relative, $binary);

        Log::info('Game image stored', [
            'relative' => $relative,
            'storage' => $storagePath,
            'bytes' => filesize($storagePath),
        ]);

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
            } catch (\Throwable $e) {
                Log::warning('Game image mirror failed', [
                    'dest' => $dest,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    public static function syncExisting(string $relativeOrBasename): bool
    {
        $basename = basename($relativeOrBasename);
        $relative = 'games/'.$basename;
        $token = strtolower(pathinfo($basename, PATHINFO_FILENAME));

        $sources = [
            storage_path('app/public/'.$relative),
            storage_path('app/public/games/'.$basename),
            public_path('img/'.$relative),
            base_path('img/'.$relative),
            base_path('public/img/'.$relative),
            public_path('uploads/games/'.$basename),
            public_path('storage/games/'.$basename),
            dirname(base_path()).'/storage/app/public/games/'.$basename,
            dirname(base_path()).'/public/img/'.$relative,
            dirname(base_path()).'/img/'.$relative,
            base_path('dgadspace.com/storage/app/public/games/'.$basename),
            base_path('dgadspace.com/public/img/'.$relative),
        ];

        // Case-insensitive scan of storage games dir
        $storageGames = storage_path('app/public/games');
        if (is_dir($storageGames)) {
            foreach (scandir($storageGames) ?: [] as $name) {
                if ($name === '.' || $name === '..') {
                    continue;
                }
                if (strtolower(pathinfo($name, PATHINFO_FILENAME)) === $token) {
                    $sources[] = $storageGames.DIRECTORY_SEPARATOR.$name;
                }
            }
        }

        $binary = null;
        foreach (array_unique($sources) as $source) {
            if (is_file($source)) {
                $binary = file_get_contents($source);
                if ($binary !== false && $binary !== '') {
                    break;
                }
            }
        }

        if ($binary === null || $binary === false || $binary === '') {
            return false;
        }

        // Ensure canonical storage copy
        $storagePath = storage_path('app/public/'.$relative);
        File::ensureDirectoryExists(dirname($storagePath));
        if (! is_file($storagePath)) {
            File::put($storagePath, $binary);
        }

        self::writeEverywhere($relative, $binary);

        return true;
    }

    /**
     * Extension-free public URL (nginx-safe).
     */
    public static function publicUrl(string $relativeOrBasename): string
    {
        $token = strtolower(pathinfo(basename($relativeOrBasename), PATHINFO_FILENAME));

        return '/gi/'.$token;
    }
}
