<?php

namespace App\Filament\Resources\GameAddons;

use App\Filament\Resources\GameAddons\Pages\CreateGameAddon;
use App\Filament\Resources\GameAddons\Pages\EditGameAddon;
use App\Filament\Resources\GameAddons\Pages\ListGameAddons;
use App\Models\GameAddon;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class GameAddonResource extends Resource
{
    protected static ?string $model = GameAddon::class;

    protected static ?string $navigationLabel = 'Game Options';

    protected static ?string $modelLabel = 'Game Option';

    protected static ?string $pluralModelLabel = 'Game Options';

    protected static ?string $recordTitleAttribute = 'name';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquaresPlus;

    protected static string|UnitEnum|null $navigationGroup = 'Main Data';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')
                ->required()
                ->maxLength(255)
                ->columnSpanFull(),
            TextInput::make('price')
                ->label('Price (₹)')
                ->numeric()
                ->required()
                ->minValue(0)
                ->prefix('₹'),
            TextInput::make('sort_order')
                ->numeric()
                ->default(0)
                ->helperText('Lower number shows first'),
            Toggle::make('is_active')
                ->label('Show on Game Store')
                ->default(true),
            Textarea::make('description')
                ->rows(3)
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('price')->money('INR')->sortable(),
                IconColumn::make('is_active')->boolean()->label('Active'),
                TextColumn::make('sort_order')->sortable(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->defaultSort('sort_order')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListGameAddons::route('/'),
            'create' => CreateGameAddon::route('/create'),
            'edit' => EditGameAddon::route('/{record}/edit'),
        ];
    }
}
