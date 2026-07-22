<?php

namespace App\Filament\Resources\LevelIncomes;

use App\Filament\Resources\LevelIncomes\Pages\CreateLevelIncome;
use App\Filament\Resources\LevelIncomes\Pages\EditLevelIncome;
use App\Filament\Resources\LevelIncomes\Pages\ListLevelIncomes;
use App\Filament\Resources\LevelIncomes\Pages\ViewLevelIncome;
use App\Models\LevelIncome;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
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
use UnitEnum;

class LevelIncomeResource extends Resource
{
    protected static ?string $model = LevelIncome::class;

    protected static ?string $navigationLabel = 'Level Incomes';

    protected static ?string $modelLabel = 'Level Income';

    protected static ?string $pluralModelLabel = 'Level Incomes';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChartBar;

    protected static string|UnitEnum|null $navigationGroup = 'Income';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('user_id')
                ->label('Income To (Upline)')
                ->relationship('user', 'name')
                ->searchable()
                ->preload()
                ->required(),
            Select::make('from_user_id')
                ->label('From Buyer')
                ->relationship('fromUser', 'name')
                ->searchable()
                ->preload()
                ->required(),
            Select::make('game_purchase_id')
                ->label('Order')
                ->relationship('gamePurchase', 'order_id')
                ->searchable()
                ->preload()
                ->required(),
            Select::make('level')
                ->options([
                    1 => 'Level 1 (10%)',
                    2 => 'Level 2 (2%)',
                    3 => 'Level 3 (2%)',
                    4 => 'Level 4 (2%)',
                    5 => 'Level 5 (2%)',
                    6 => 'Level 6 (2%)',
                ])
                ->required(),
            TextInput::make('percent')->numeric()->required()->suffix('%'),
            TextInput::make('purchase_amount')->numeric()->required()->prefix('₹'),
            TextInput::make('income_amount')->numeric()->required()->prefix('₹'),
            Select::make('status')
                ->options([
                    'credited' => 'Credited',
                    'pending' => 'Pending',
                    'cancelled' => 'Cancelled',
                ])
                ->default('credited')
                ->required(),
        ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            TextEntry::make('id')->label('ID'),
            TextEntry::make('user.name')->label('Income To (Upline)'),
            TextEntry::make('user.email')->label('Upline Email'),
            TextEntry::make('fromUser.name')->label('From Buyer'),
            TextEntry::make('fromUser.id')->label('Buyer User ID'),
            TextEntry::make('gamePurchase.order_id')->label('Order'),
            TextEntry::make('gamePurchase.game_name')->label('Product'),
            TextEntry::make('level'),
            TextEntry::make('percent')->suffix('%'),
            TextEntry::make('purchase_amount')->money('INR'),
            TextEntry::make('income_amount')->money('INR'),
            TextEntry::make('status')->badge(),
            TextEntry::make('created_at')->dateTime(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                TextColumn::make('user.name')->label('Income To')->searchable(),
                TextColumn::make('fromUser.name')->label('From Buyer')->searchable(),
                TextColumn::make('from_user_id')->label('Buyer ID')->sortable(),
                TextColumn::make('level')->label('L')->sortable(),
                TextColumn::make('percent')->suffix('%'),
                TextColumn::make('purchase_amount')->money('INR')->sortable(),
                TextColumn::make('income_amount')->money('INR')->sortable(),
                TextColumn::make('gamePurchase.order_id')->label('Order')->searchable(),
                TextColumn::make('status')->badge(),
                TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('level')->options([
                    1 => 'Level 1 (10%)',
                    2 => 'Level 2 (2%)',
                    3 => 'Level 3 (2%)',
                    4 => 'Level 4 (2%)',
                    5 => 'Level 5 (2%)',
                    6 => 'Level 6 (2%)',
                ]),
                SelectFilter::make('status')->options([
                    'credited' => 'Credited',
                    'pending' => 'Pending',
                    'cancelled' => 'Cancelled',
                ]),
                Filter::make('today')
                    ->label('Today')
                    ->query(fn (Builder $query): Builder => $query->whereDate('created_at', today())),
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
            'index' => ListLevelIncomes::route('/'),
            'create' => CreateLevelIncome::route('/create'),
            'view' => ViewLevelIncome::route('/{record}'),
            'edit' => EditLevelIncome::route('/{record}/edit'),
        ];
    }
}
