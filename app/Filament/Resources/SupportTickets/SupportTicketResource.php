<?php

namespace App\Filament\Resources\SupportTickets;

use App\Filament\Resources\SupportTickets\Pages\EditSupportTicket;
use App\Filament\Resources\SupportTickets\Pages\ListSupportTickets;
use App\Models\SupportTicket;
use App\Models\TicketReply;
use BackedEnum;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Illuminate\Support\Facades\Auth;
use UnitEnum;

class SupportTicketResource extends Resource
{
    protected static ?string $model = SupportTicket::class;

    protected static ?string $navigationLabel = 'Support Tickets';

    protected static ?string $recordTitleAttribute = 'ticket_no';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static string|UnitEnum|null $navigationGroup = 'Support';

    protected static ?int $navigationSort = 10;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('ticket_no')->disabled(),
            TextInput::make('subject')->disabled(),
            Textarea::make('message')->disabled()->rows(4),
            Select::make('status')->options([
                'open' => 'Open',
                'answered' => 'Answered',
                'resolved' => 'Resolved',
                'closed' => 'Closed',
            ])->required(),
            Select::make('priority')->options([
                'low' => 'Low',
                'medium' => 'Medium',
                'high' => 'High',
            ]),
            Textarea::make('admin_reply')
                ->label('Admin Reply')
                ->rows(4)
                ->helperText('Write a reply and save to send it to the user.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('ticket_no')->searchable()->sortable(),
                TextColumn::make('user.name')->label('User')->searchable(),
                TextColumn::make('subject')->limit(40)->searchable(),
                TextColumn::make('status')->badge(),
                TextColumn::make('priority')->badge(),
                TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSupportTickets::route('/'),
            'edit' => EditSupportTicket::route('/{record}/edit'),
        ];
    }
}
