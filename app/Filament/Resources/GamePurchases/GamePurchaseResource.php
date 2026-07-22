<?php

namespace App\Filament\Resources\GamePurchases;

use App\Filament\Resources\GamePurchases\Pages\ListGamePurchases;
use App\Filament\Resources\GamePurchases\Pages\ViewGamePurchase;
use App\Models\GamePurchase;
use BackedEnum;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class GamePurchaseResource extends Resource
{
    protected static ?string $model = GamePurchase::class;

    protected static ?string $navigationLabel = 'Orders';

    protected static ?string $modelLabel = 'Order';

    protected static ?string $pluralModelLabel = 'Orders';

    protected static ?string $recordTitleAttribute = 'order_id';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBanknotes;

    protected static ?int $navigationSort = 3;

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            TextEntry::make('order_id')->label('Order ID'),
            TextEntry::make('user.name')->label('Member'),
            TextEntry::make('user.email')->label('Email'),
            TextEntry::make('game_name'),
            TextEntry::make('game_category'),
            TextEntry::make('amount')->money('INR'),
            TextEntry::make('status')->badge(),
            TextEntry::make('payment_method'),
            TextEntry::make('utr_number')->label('Payment ID'),
            TextEntry::make('notes')->columnSpanFull(),
            TextEntry::make('created_at')->dateTime(),
            TextEntry::make('paid_at')->dateTime(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_id')->searchable()->sortable(),
                TextColumn::make('user.name')->label('Member')->searchable(),
                TextColumn::make('game_name')->searchable(),
                TextColumn::make('amount')->money('INR')->sortable(),
                TextColumn::make('payment_method')->label('Gateway'),
                TextColumn::make('utr_number')->label('Payment ID')->placeholder('—'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'pending_payment' => 'warning',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')->options([
                    'pending_payment' => 'Pending Payment',
                    'paid' => 'Paid',
                    'rejected' => 'Rejected',
                ]),
            ])
            ->recordActions([
                ViewAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListGamePurchases::route('/'),
            'view' => ViewGamePurchase::route('/{record}'),
        ];
    }
}
