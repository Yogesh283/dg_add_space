<?php

namespace App\Filament\Resources\SupportTickets\Pages;

use App\Filament\Resources\SupportTickets\SupportTicketResource;
use App\Models\TicketReply;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Auth;

class EditSupportTicket extends EditRecord
{
    protected static string $resource = SupportTicketResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        unset($data['admin_reply']);

        return $data;
    }

    protected function afterSave(): void
    {
        $reply = $this->form->getRawState()['admin_reply'] ?? null;

        if (! filled($reply)) {
            return;
        }

        TicketReply::create([
            'support_ticket_id' => $this->record->id,
            'user_id' => Auth::id(),
            'is_admin' => true,
            'message' => $reply,
        ]);

        if ($this->record->status === 'open') {
            $this->record->update(['status' => 'answered']);
        }
    }
}
