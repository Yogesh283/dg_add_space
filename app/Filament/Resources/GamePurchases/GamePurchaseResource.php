<?php

namespace App\Filament\Resources\GamePurchases;

use App\Filament\Resources\GamePurchases\Pages\CreateGamePurchase;
use App\Filament\Resources\GamePurchases\Pages\EditGamePurchase;
use App\Filament\Resources\GamePurchases\Pages\ListGamePurchases;
use App\Filament\Resources\GamePurchases\Pages\ViewGamePurchase;
use App\Models\GamePurchase;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use UnitEnum;

class GamePurchaseResource extends Resource
{
    protected static ?string $model = GamePurchase::class;

    protected static ?string $navigationLabel = 'Orders';

    protected static ?string $modelLabel = 'Order';

    protected static ?string $pluralModelLabel = 'Orders';

    protected static ?string $recordTitleAttribute = 'order_id';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBanknotes;

    protected static string|UnitEnum|null $navigationGroup = 'Main Data';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('order_id')
                ->label('Order ID')
                ->default(fn () => 'ORD-'.strtoupper(Str::random(10)))
                ->required()
                ->maxLength(50),
            Select::make('user_id')
                ->label('Buyer User')
                ->relationship('user', 'name')
                ->searchable()
                ->preload()
                ->required(),
            TextInput::make('game_name')->required()->maxLength(255),
            TextInput::make('game_category')->maxLength(100),
            TextInput::make('amount')->label('Amount (₹)')->numeric()->required()->prefix('₹')->minValue(0),
            Select::make('status')
                ->options([
                    'pending_payment' => 'Pending Payment',
                    'paid' => 'Paid',
                    'rejected' => 'Rejected',
                ])
                ->required()
                ->default('pending_payment'),
            TextInput::make('payment_method')->maxLength(50)->placeholder('Razorpay / Company / Admin'),
            TextInput::make('utr_number')->label('Payment / UTR ID')->maxLength(100),
            DateTimePicker::make('paid_at')->seconds(false),
            Textarea::make('notes')->rows(3)->columnSpanFull(),
        ]);
    }

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
                Filter::make('today')
                    ->label('Paid / created today')
                    ->query(fn (Builder $query): Builder => $query->where(function (Builder $q): void {
                        $q->whereDate('paid_at', today())
                            ->orWhere(function (Builder $q2): void {
                                $q2->whereNull('paid_at')->whereDate('created_at', today());
                            });
                    })),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListGamePurchases::route('/'),
            'create' => CreateGamePurchase::route('/create'),
            'view' => ViewGamePurchase::route('/{record}'),
            'edit' => EditGamePurchase::route('/{record}/edit'),
        ];
    }
}
