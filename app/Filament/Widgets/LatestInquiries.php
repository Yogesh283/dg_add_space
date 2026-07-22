<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Inquiries\InquiryResource;
use App\Models\Inquiry;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestInquiries extends TableWidget
{
    protected static bool $isLazy = false;

    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    protected static ?string $heading = 'Latest website inquiries (with IP)';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                fn (): Builder => Inquiry::query()->latest('id')
            )
            ->columns([
                TextColumn::make('created_at')->dateTime('d M Y, h:i A')->label('When'),
                TextColumn::make('inquiry_name')->label('Name')->searchable(),
                TextColumn::make('phone')->searchable(),
                TextColumn::make('email')->searchable(),
                TextColumn::make('ip_address')->label('IP')->copyable()->placeholder('—'),
                TextColumn::make('project_type')->placeholder('—')->toggleable(),
                TextColumn::make('status')->badge(),
            ])
            ->recordActions([
                EditAction::make()
                    ->url(fn (Inquiry $record): string => InquiryResource::getUrl('edit', ['record' => $record])),
            ])
            ->paginated([5, 10])
            ->defaultPaginationPageOption(5);
    }
}
