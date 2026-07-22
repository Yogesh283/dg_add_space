<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\GamePurchases\GamePurchaseResource;
use App\Models\GamePurchase;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestPaidOrders extends TableWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    protected static ?string $heading = 'Latest product purchases (paid)';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                fn (): Builder => GamePurchase::query()
                    ->with('user')
                    ->where('status', 'paid')
                    ->latest('paid_at')
                    ->latest('id')
            )
            ->columns([
                TextColumn::make('order_id')->label('Order')->searchable(),
                TextColumn::make('user.id')->label('User ID'),
                TextColumn::make('user.name')->label('Buyer')->searchable(),
                TextColumn::make('user.email')->label('Email')->toggleable(),
                TextColumn::make('game_name')->label('Product'),
                TextColumn::make('amount')->money('INR')->sortable(),
                TextColumn::make('payment_method')->label('Method'),
                TextColumn::make('paid_at')->dateTime()->placeholder('—'),
            ])
            ->recordActions([
                ViewAction::make()
                    ->url(fn (GamePurchase $record): string => GamePurchaseResource::getUrl('view', ['record' => $record])),
            ])
            ->paginated([5, 10])
            ->defaultPaginationPageOption(5);
    }
}
