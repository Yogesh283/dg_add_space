<?php

namespace App\Console\Commands;

use App\Models\Game;
use App\Support\GameImageStorage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncGameImages extends Command
{
    protected $signature = 'games:sync-images';

    protected $description = 'Copy/sync game images into all /img/games web roots for nginx';

    public function handle(): int
    {
        foreach (GameImageStorage::webRoots() as $root) {
            File::ensureDirectoryExists($root.'/games');
            $this->line('Root: '.$root);
        }

        $synced = 0;
        $missing = 0;

        Game::query()->whereNotNull('image_path')->orderBy('id')->each(function (Game $game) use (&$synced, &$missing) {
            $ok = GameImageStorage::syncExisting((string) $game->image_path);
            if ($ok) {
                $this->info('OK #'.$game->id.' '.$game->name.' → '.basename((string) $game->image_path));
                $synced++;
            } else {
                $this->warn('MISSING #'.$game->id.' '.$game->name.' → '.$game->image_path);
                $missing++;
            }
        });

        $dirs = [
            storage_path('app/public/games'),
            public_path('uploads/games'),
        ];
        foreach ($dirs as $dir) {
            if (! is_dir($dir)) {
                continue;
            }
            foreach (File::files($dir) as $file) {
                GameImageStorage::syncExisting($file->getFilename());
            }
        }

        $this->newLine();
        $this->info("Synced: {$synced} | Missing files (re-upload needed): {$missing}");

        return self::SUCCESS;
    }
}
