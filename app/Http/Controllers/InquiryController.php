<?php

namespace App\Http\Controllers;

use App\Mail\InquirySubmittedMail;
use App\Models\Inquiry;
use App\Services\GeoIpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class InquiryController extends Controller
{
    public function store(Request $request, GeoIpService $geoIp)
    {
        $validated = $request->validate([
            'inquiry_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255'],
            'project_budget' => ['nullable', 'string', 'max:255'],
            'project_type' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'attachment' => [
                'nullable',
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,webp,pdf,doc,docx,zip,rar,txt',
            ],
        ]);

        $attachmentPath = $request->hasFile('attachment')
            ? $request->file('attachment')->store('inquiries', 'public')
            : null;

        $ip = $request->ip();
        $location = $geoIp->resolve($request, $ip);

        $inquiry = Inquiry::create([
            'inquiry_name' => $validated['inquiry_name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'project_budget' => $validated['project_budget'] ?? null,
            'project_type' => $validated['project_type'] ?? null,
            'message' => $validated['message'],
            'attachment_path' => $attachmentPath,
            'status' => 'new',
            'ip_address' => $ip,
            'country' => $location['country'],
            'country_code' => $location['country_code'],
            'user_agent' => substr((string) $request->userAgent(), 0, 500),
        ]);

        try {
            Mail::to('support@dgadspace.com')->send(new InquirySubmittedMail($inquiry));
        } catch (Throwable $e) {
            Log::error('Inquiry mail to support failed', [
                'inquiry_id' => $inquiry->id,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with(
            'success',
            'Query sent to support@dgadspace.com. Our team will contact you soon.'
        );
    }
}
