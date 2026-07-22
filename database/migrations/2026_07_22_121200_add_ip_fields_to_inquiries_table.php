<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            if (! Schema::hasColumn('inquiries', 'ip_address')) {
                $table->string('ip_address', 45)->nullable()->after('status');
            }
            if (! Schema::hasColumn('inquiries', 'user_agent')) {
                $table->string('user_agent', 500)->nullable()->after('ip_address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            if (Schema::hasColumn('inquiries', 'user_agent')) {
                $table->dropColumn('user_agent');
            }
            if (Schema::hasColumn('inquiries', 'ip_address')) {
                $table->dropColumn('ip_address');
            }
        });
    }
};
