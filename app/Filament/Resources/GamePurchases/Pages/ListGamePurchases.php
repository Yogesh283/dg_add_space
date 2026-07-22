<?php

namespace App\Filament\Resources\GamePurchases\Pages;

use App\Filament\Resources\GamePurchases\GamePurchaseResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListGamePurchases extends ListRecords
{
    protected static string $resource = GamePurchaseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Add Order'),
        ];
    }
}
