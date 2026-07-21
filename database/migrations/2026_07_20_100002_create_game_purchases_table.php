<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_purchases', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('game_name');
            $table->string('game_category')->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('status')->default('paid');
            $table->string('payment_method')->default('manual');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_purchases');
    }
};
