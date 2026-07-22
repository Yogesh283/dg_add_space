<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            if (! Schema::hasColumn('inquiries', 'country')) {
                $table->string('country', 100)->nullable()->after('ip_address');
            }
            if (! Schema::hasColumn('inquiries', 'country_code')) {
                $table->string('country_code', 2)->nullable()->after('country');
            }
        });
    }

    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            if (Schema::hasColumn('inquiries', 'country_code')) {
                $table->dropColumn('country_code');
            }
            if (Schema::hasColumn('inquiries', 'country')) {
                $table->dropColumn('country');
            }
        });
    }
};
