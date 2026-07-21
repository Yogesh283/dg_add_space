<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $otp,
        public string $purpose = 'login'
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('support@dgadspace.com', 'DG Ad Space'),
            subject: 'DG Ad Space Login OTP',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: '<div style="font-family:Arial,sans-serif;padding:24px;background:#0a0a0a;color:#f5f5f5">'
                .'<div style="max-width:480px;margin:0 auto;background:#141414;border:1px solid #333;border-radius:12px;padding:24px">'
                .'<h2 style="color:#ff5c1a;margin:0 0 12px">DG Ad Space</h2>'
                .'<p style="color:#ddd">Your login OTP is:</p>'
                .'<p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#fff;margin:16px 0">'.$this->otp.'</p>'
                .'<p style="color:#aaa">This OTP is valid for 10 minutes.</p>'
                .'<p style="color:#777;font-size:12px">If you did not request this, ignore this email.</p>'
                .'<p style="color:#777;font-size:12px;margin-top:20px">From: support@dgadspace.com</p>'
                .'</div></div>',
        );
    }
}
