<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InquirySubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_inquiry_form_data_is_saved_in_database(): void
    {
        $payload = [
            'inquiry_name' => 'Test User',
            'phone' => '8817788185',
            'email' => 'test@example.com',
            'project_budget' => '50000',
            'project_type' => 'Android Game',
            'message' => 'Need a ready-made racing game with branding.',
        ];

        $response = $this->post(route('inquiries.store'), $payload);

        $response->assertStatus(302);
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('inquiries', [
            'inquiry_name' => 'Test User',
            'phone' => '8817788185',
            'email' => 'test@example.com',
            'project_budget' => '50000',
            'project_type' => 'Android Game',
            'message' => 'Need a ready-made racing game with branding.',
            'status' => 'new',
        ]);
    }
}

