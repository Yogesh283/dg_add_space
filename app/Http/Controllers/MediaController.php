<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MediaController extends Controller
{
    /**
     * Extension-free URL so nginx static *.png rules do not bypass Laravel.
     * Example: /gi/01ky6q12123zawa775rw2z1w56
     */
    public function gameImage(string $token): BinaryFileResponse
    {
        $token = strtolower($token);

        if ($token === '' || ! preg_match('/^[a-z0-9]+$/', $token)) {
            abort(404);
        }

        $dirs = array_values(array_unique(array_filter([
            storage_path('app/public/games'),
            public_path('img/games'),
            public_path('uploads/games'),
            public_path('storage/games'),
            base_path('img/games'),
            base_path('public/img/games'),
            dirname(base_path()).'/storage/app/public/games',
            dirname(base_path()).'/public/img/games',
            dirname(base_path()).'/img/games',
            base_path('dgadspace.com/storage/app/public/games'),
            base_path('dgadspace.com/public/img/games'),
        ])));

        foreach ($dirs as $dir) {
            if (! is_dir($dir)) {
                continue;
            }

            $match = $this->findFileByToken($dir, $token);
            if ($match) {
                return response()->file($match, [
                    'Cache-Control' => 'public, max-age=604800',
                    'Content-Type' => mime_content_type($match) ?: 'image/png',
                ]);
            }
        }

        abort(404);
    }

    private function findFileByToken(string $dir, string $token): ?string
    {
        foreach (glob($dir.DIRECTORY_SEPARATOR.$token.'.*') ?: [] as $file) {
            if (is_file($file)) {
                return $file;
            }
        }

        // Case-insensitive fallback (older ULID filenames)
        foreach (scandir($dir) ?: [] as $name) {
            if ($name === '.' || $name === '..') {
                continue;
            }
            $full = $dir.DIRECTORY_SEPARATOR.$name;
            if (! is_file($full)) {
                continue;
            }
            if (strtolower(pathinfo($name, PATHINFO_FILENAME)) === $token) {
                return $full;
            }
        }

        return null;
    }
}
