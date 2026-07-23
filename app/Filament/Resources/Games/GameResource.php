<?php

namespace App\Filament\Resources\Games;

use App\Filament\Resources\Games\Pages\CreateGame;
use App\Filament\Resources\Games\Pages\EditGame;
use App\Filament\Resources\Games\Pages\ListGames;
use App\Models\Game;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class GameResource extends Resource
{
    protected static ?string $model = Game::class;

    protected static ?string $navigationLabel = 'Games Store';

    protected static ?string $modelLabel = 'Game';

    protected static ?string $pluralModelLabel = 'Games';

    protected static ?string $recordTitleAttribute = 'name';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPuzzlePiece;

    protected static string|UnitEnum|null $navigationGroup = 'Main Data';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')
                ->required()
                ->maxLength(255)
                ->columnSpanFull(),
            TextInput::make('market_price')
                ->label('Market Price (₹)')
                ->numeric()
                ->minValue(0)
                ->prefix('₹')
                ->helperText('Show only — strikethrough compare price (e.g. 100000)'),
            TextInput::make('price')
                ->label('DG Adspace Price (₹)')
                ->numeric()
                ->required()
                ->minValue(1)
                ->prefix('₹')
                ->helperText('Actual selling price on website'),
            Select::make('category')
                ->options([
                    'Racing Games' => 'Racing Games',
                    'Puzzle Games' => 'Puzzle Games',
                    'Arcade Games' => 'Arcade Games',
                    'Quiz Games' => 'Quiz Games',
                    'Multiplayer Games' => 'Multiplayer Games',
                    'Sports Games' => 'Sports Games',
                    'Casual Games' => 'Casual Games',
                    'Card Games' => 'Card Games',
                    'Board Games' => 'Board Games',
                    'Action Games' => 'Action Games',
                    'Adventure Games' => 'Adventure Games',
                    'Simulation Games' => 'Simulation Games',
                    'Hyper Casual Games' => 'Hyper Casual Games',
                ])
                ->searchable()
                ->required(),
            FileUpload::make('image_path')
                ->label('Game Image')
                ->image()
                ->disk('game_images')
                ->directory('games')
                ->visibility('public')
                ->imageEditor()
                ->maxSize(4096)
                ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                ->helperText('Upload / change game image (max 4MB)')
                ->columnSpanFull(),
            Select::make('tech')
                ->options([
                    'Unity' => 'Unity',
                    'Flutter' => 'Flutter',
                    'Android Studio' => 'Android Studio',
                    'Other' => 'Other',
                ])
                ->default('Unity'),
            Select::make('mode')
                ->options([
                    'Single Player' => 'Single Player',
                    'Multiplayer' => 'Multiplayer',
                ])
                ->default('Single Player'),
            TextInput::make('rating')
                ->numeric()
                ->minValue(1)
                ->maxValue(5)
                ->default(5),
            TextInput::make('downloads')
                ->placeholder('12k+')
                ->maxLength(50),
            TextInput::make('delivery')
                ->placeholder('7-10 days')
                ->maxLength(100),
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
                ImageColumn::make('image_path')
                    ->label('Image')
                    ->getStateUsing(fn (Game $record) => $record->image_url)
                    ->height(50)
                    ->width(70),
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('category')->badge()->sortable(),
                TextColumn::make('market_price')
                    ->label('Market')
                    ->money('INR')
                    ->placeholder('—')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('price')
                    ->label('DG Price')
                    ->money('INR')
                    ->sortable(),
                TextColumn::make('tech'),
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
            'index' => ListGames::route('/'),
            'create' => CreateGame::route('/create'),
            'edit' => EditGame::route('/{record}/edit'),
        ];
    }
}
