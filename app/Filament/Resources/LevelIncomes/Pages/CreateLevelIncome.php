<?php

namespace App\Filament\Resources\LevelIncomes\Pages;

use App\Filament\Resources\LevelIncomes\LevelIncomeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLevelIncome extends CreateRecord
{
    protected static string $resource = LevelIncomeResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
