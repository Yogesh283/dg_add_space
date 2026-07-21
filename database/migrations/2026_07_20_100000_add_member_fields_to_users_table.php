<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('referral_code', 20)->unique()->nullable()->after('phone');
            $table->foreignId('referred_by')->nullable()->after('referral_code')->constrained('users')->nullOnDelete();
            $table->decimal('wallet_balance', 12, 2)->default(0)->after('referred_by');
            $table->boolean('is_admin')->default(false)->after('wallet_balance');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('referred_by');
            $table->dropColumn(['phone', 'referral_code', 'wallet_balance', 'is_admin']);
        });
    }
};
