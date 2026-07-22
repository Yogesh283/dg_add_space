<?php

namespace App\Filament\Resources\GameAddons\Pages;

use App\Filament\Resources\GameAddons\GameAddonResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditGameAddon extends EditRecord
{
    protected static string $resource = GameAddonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
