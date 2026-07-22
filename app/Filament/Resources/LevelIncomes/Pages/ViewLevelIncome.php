<?php

namespace App\Filament\Resources\LevelIncomes\Pages;

use App\Filament\Resources\LevelIncomes\LevelIncomeResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewLevelIncome extends ViewRecord
{
    protected static string $resource = LevelIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
