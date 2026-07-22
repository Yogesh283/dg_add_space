<?php

namespace App\Filament\Resources\LevelIncomes\Pages;

use App\Filament\Resources\LevelIncomes\LevelIncomeResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditLevelIncome extends EditRecord
{
    protected static string $resource = LevelIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): ?string
    {
        return $this->getResource()::getUrl('index');
    }
}
