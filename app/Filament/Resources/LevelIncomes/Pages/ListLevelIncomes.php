<?php

namespace App\Filament\Resources\LevelIncomes\Pages;

use App\Filament\Resources\LevelIncomes\LevelIncomeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLevelIncomes extends ListRecords
{
    protected static string $resource = LevelIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Add Level Income'),
        ];
    }
}
