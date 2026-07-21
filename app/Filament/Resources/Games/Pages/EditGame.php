<?php

namespace App\Filament\Resources\Games\Pages;

use App\Filament\Resources\Games\GameResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditGame extends EditRecord
{
    protected static string $resource = GameResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): ?string
    {
        return $this->getResource()::getUrl('index');
    }
}
