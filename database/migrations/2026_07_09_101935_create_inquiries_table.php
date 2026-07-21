<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('inquiries')) {
            return;
        }

        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('inquiry_name');
            $table->string('phone', 20);
            $table->string('email');
            $table->string('project_budget')->nullable();
            $table->string('project_type')->nullable();
            $table->text('message');
            $table->string('attachment_path')->nullable();
            $table->string('status')->default('new');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
