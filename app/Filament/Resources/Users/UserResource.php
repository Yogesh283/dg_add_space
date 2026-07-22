<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationLabel = 'Users';

    protected static ?string $modelLabel = 'User';

    protected static ?string $pluralModelLabel = 'Users';

    protected static ?string $recordTitleAttribute = 'name';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|UnitEnum|null $navigationGroup = 'Main Data';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
            TextInput::make('phone')->tel()->maxLength(20),
            TextInput::make('password')
                ->password()
                ->dehydrated(fn ($state) => filled($state))
                ->required(fn (string $operation) => $operation === 'create'),
            TextInput::make('referral_code')->disabled()->dehydrated(false),
            Select::make('referred_by')
                ->label('Sponsor / Referral Parent')
                ->relationship('sponsor', 'name')
                ->searchable()
                ->preload()
                ->nullable(),
            TextInput::make('wallet_balance')->numeric()->prefix('₹')->default(0),
            Toggle::make('is_admin')->label('Admin Access'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('email')->searchable()->sortable(),
                TextColumn::make('phone')->searchable(),
                TextColumn::make('referral_code')->label('Ref Code')->searchable(),
                TextColumn::make('sponsor.name')->label('Referred By')->placeholder('-'),
                TextColumn::make('wallet_balance')->money('INR')->sortable(),
                IconColumn::make('is_admin')->boolean()->label('Admin'),
                TextColumn::make('created_at')->dateTime()->sortable()->label('Registered'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Filter::make('bought_product')
                    ->label('Bought product')
                    ->query(fn (Builder $query): Builder => $query->whereHas(
                        'purchases',
                        fn (Builder $q): Builder => $q->where('status', 'paid')
                    )),
                Filter::make('has_referral')
                    ->label('Has referral')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('referred_by')),
                Filter::make('no_referral')
                    ->label('No referral')
                    ->query(fn (Builder $query): Builder => $query->whereNull('referred_by')),
                TernaryFilter::make('is_admin')->label('Admin'),
                Filter::make('registered_today')
                    ->label('Registered today')
                    ->query(fn (Builder $query): Builder => $query->whereDate('created_at', today())),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
