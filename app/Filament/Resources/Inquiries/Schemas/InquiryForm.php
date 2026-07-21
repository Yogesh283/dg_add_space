<?php

namespace App\Filament\Resources\Inquiries\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class InquiryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('inquiry_name')
                    ->label('Inquiry Name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('phone')
                    ->required()
                    ->maxLength(20),
                TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                TextInput::make('project_budget')
                    ->maxLength(255),
                TextInput::make('project_type')
                    ->maxLength(255),
                Textarea::make('message')
                    ->required()
                    ->rows(4)
                    ->columnSpanFull(),
                FileUpload::make('attachment_path')
                    ->label('Attachment')
                    ->directory('inquiries')
                    ->disk('public')
                    ->columnSpanFull(),
                Select::make('status')
                    ->options([
                        'new' => 'New',
                        'contacted' => 'Contacted',
                        'in_progress' => 'In Progress',
                        'closed' => 'Closed',
                    ])
                    ->default('new')
                    ->required(),
            ]);
    }
}
