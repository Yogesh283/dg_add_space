<?php

namespace App\Filament\Resources\GameAddons\Pages;

use App\Filament\Resources\GameAddons\GameAddonResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListGameAddons extends ListRecords
{
    protected static string $resource = GameAddonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
