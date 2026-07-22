<?php

namespace App\Filament\Resources\GamePurchases\Pages;

use App\Filament\Resources\GamePurchases\GamePurchaseResource;
use Filament\Resources\Pages\CreateRecord;

class CreateGamePurchase extends CreateRecord
{
    protected static string $resource = GamePurchaseResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
