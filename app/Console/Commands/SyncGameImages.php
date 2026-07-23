<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncGameImages extends Command
{
    protected $signature = 'games:sync-images';

    protected $description = 'Copy game images from storage/uploads into public/img/games for nginx static serving';

    public function handle(): int
    {
        $destDir = public_path('img/games');
        File::ensureDirectoryExists($destDir);

        $sources = [
            storage_path('app/public/games'),
            public_path('uploads/games'),
            public_path('storage/games'),
        ];

        $copied = 0;

        foreach ($sources as $dir) {
            if (! is_dir($dir)) {
                continue;
            }

            foreach (File::files($dir) as $file) {
                $dest = $destDir.DIRECTORY_SEPARATOR.$file->getFilename();
                if (! is_file($dest)) {
                    File::copy($file->getPathname(), $dest);
                    $this->line('Copied '.$file->getFilename());
                    $copied++;
                }
            }
        }

        $this->info("Done. Copied {$copied} file(s) to public/img/games");

        return self::SUCCESS;
    }
}
