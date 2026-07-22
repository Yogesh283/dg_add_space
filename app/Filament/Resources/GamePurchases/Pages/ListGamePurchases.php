<?php

namespace App\Filament\Resources\GamePurchases\Pages;

use App\Filament\Resources\GamePurchases\GamePurchaseResource;
use Filament\Resources\Pages\ListRecords;

class ListGamePurchases extends ListRecords
{
    protected static string $resource = GamePurchaseResource::class;
}
