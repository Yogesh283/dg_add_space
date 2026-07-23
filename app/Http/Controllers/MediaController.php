<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MediaController extends Controller
{
    public function show(string $path): BinaryFileResponse
    {
        $path = str_replace('\\', '/', $path);
        $path = ltrim($path, '/');

        if ($path === '' || str_contains($path, '..')) {
            abort(404);
        }

        $candidates = [
            storage_path('app/public/'.$path),
            public_path('uploads/'.$path),
            public_path('img/'.$path),
            public_path('storage/'.$path),
        ];

        // Also accept bare filenames stored as games/xxx.png
        $basename = basename($path);
        if (str_starts_with($path, 'games/') || ! str_contains($path, '/')) {
            $file = str_starts_with($path, 'games/') ? $basename : $basename;
            $candidates[] = storage_path('app/public/games/'.$file);
            $candidates[] = public_path('uploads/games/'.$file);
            $candidates[] = public_path('img/games/'.$file);
            $candidates[] = public_path('storage/games/'.$file);
        }

        foreach (array_unique($candidates) as $fullPath) {
            if (is_file($fullPath)) {
                return response()->file($fullPath, [
                    'Cache-Control' => 'public, max-age=604800',
                ]);
            }
        }

        // Last resort: Storage disks
        foreach (['uploads', 'public'] as $disk) {
            if (Storage::disk($disk)->exists($path)) {
                return response()->file(Storage::disk($disk)->path($path), [
                    'Cache-Control' => 'public, max-age=604800',
                ]);
            }
        }

        abort(404);
    }
}
