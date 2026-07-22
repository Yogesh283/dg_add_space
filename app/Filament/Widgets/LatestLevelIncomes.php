<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\LevelIncomes\LevelIncomeResource;
use App\Models\LevelIncome;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestLevelIncomes extends TableWidget
{
    protected static bool $isLazy = false;

    protected static ?int $sort = 3;

    protected int | string | array $columnSpan = 'full';

    protected static ?string $heading = 'Latest level income credits';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                fn (): Builder => LevelIncome::query()
                    ->with(['user', 'fromUser', 'gamePurchase'])
                    ->latest('id')
            )
            ->columns([
                TextColumn::make('created_at')->dateTime()->label('When'),
                TextColumn::make('user.name')->label('Income To'),
                TextColumn::make('fromUser.name')->label('From Buyer'),
                TextColumn::make('level')->label('L'),
                TextColumn::make('percent')->suffix('%'),
                TextColumn::make('purchase_amount')->money('INR'),
                TextColumn::make('income_amount')->money('INR'),
                TextColumn::make('gamePurchase.order_id')->label('Order'),
            ])
            ->recordActions([
                ViewAction::make()
                    ->url(fn (LevelIncome $record): string => LevelIncomeResource::getUrl('view', ['record' => $record])),
            ])
            ->paginated([5, 10])
            ->defaultPaginationPageOption(5);
    }
}
