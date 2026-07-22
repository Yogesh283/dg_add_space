<?php

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class InquirySubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Inquiry $inquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('support@dgadspace.com', 'DG Ad Space Website'),
            replyTo: [
                new Address($this->inquiry->email, $this->inquiry->inquiry_name),
            ],
            subject: 'New Support Query — '.$this->inquiry->inquiry_name,
        );
    }

    public function content(): Content
    {
        $i = $this->inquiry;
        $html = '<div style="font-family:Arial,sans-serif;padding:24px;background:#0a0a0a;color:#f5f5f5">'
            .'<div style="max-width:560px;margin:0 auto;background:#141414;border:1px solid #333;border-radius:12px;padding:24px">'
            .'<h2 style="color:#ff5c1a;margin:0 0 16px">New Website Inquiry</h2>'
            .'<p style="color:#ddd;margin:6px 0"><strong>Name:</strong> '.e($i->inquiry_name).'</p>'
            .'<p style="color:#ddd;margin:6px 0"><strong>Email:</strong> '.e($i->email).'</p>'
            .'<p style="color:#ddd;margin:6px 0"><strong>Phone:</strong> '.e($i->phone).'</p>'
            .'<p style="color:#ddd;margin:6px 0"><strong>Project Type:</strong> '.e($i->project_type ?: '—').'</p>'
            .'<p style="color:#ddd;margin:6px 0"><strong>Budget:</strong> '.e($i->project_budget ?: '—').'</p>'
            .'<p style="color:#ddd;margin:6px 0"><strong>IP:</strong> '.e($i->ip_address ?: '—').'</p>'
            .'<p style="color:#ddd;margin:6px 0"><strong>Country:</strong> '.e(
                $i->country
                    ? $i->country.($i->country_code ? ' ('.$i->country_code.')' : '')
                    : '—'
            ).'</p>'
            .'<hr style="border:none;border-top:1px solid #333;margin:16px 0">'
            .'<p style="color:#aaa;margin:0 0 8px"><strong>Query / Message:</strong></p>'
            .'<p style="color:#fff;white-space:pre-wrap;line-height:1.5">'.e($i->message).'</p>'
            .($i->attachment_path
                ? '<p style="color:#ff9a66;margin-top:16px">📎 Attachment included with this email.</p>'
                : '')
            .'<p style="color:#777;font-size:12px;margin-top:20px">Sent to support@dgadspace.com from DG Ad Space website contact form.</p>'
            .'</div></div>';

        return new Content(htmlString: $html);
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        if (! $this->inquiry->attachment_path) {
            return [];
        }

        $path = $this->inquiry->attachment_path;
        if (! Storage::disk('public')->exists($path)) {
            return [];
        }

        return [
            Attachment::fromStorageDisk('public', $path)
                ->as(basename($path)),
        ];
    }
}
