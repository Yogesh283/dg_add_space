<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('level_incomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('game_purchase_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('level');
            $table->decimal('percent', 5, 2);
            $table->decimal('purchase_amount', 12, 2);
            $table->decimal('income_amount', 12, 2);
            $table->string('status')->default('credited');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_incomes');
    }
};
