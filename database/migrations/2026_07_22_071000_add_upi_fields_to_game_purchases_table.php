<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('game_purchases', function (Blueprint $table) {
            $table->string('utr_number')->nullable()->after('payment_method');
            $table->timestamp('paid_at')->nullable()->after('utr_number');
        });
    }

    public function down(): void
    {
        Schema::table('game_purchases', function (Blueprint $table) {
            $table->dropColumn(['utr_number', 'paid_at']);
        });
    }
};
