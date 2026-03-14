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
        Schema::table('contacts', function (Blueprint $table) {
            if (!Schema::hasColumn('contacts', 'whatsapp_number')) {
                $table->string('whatsapp_number')->nullable()->after('email');
            }
            if (!Schema::hasColumn('contacts', 'company_name')) {
                $table->string('company_name')->nullable()->after('whatsapp_number');
            }
            if (!Schema::hasColumn('contacts', 'service_type')) {
                $table->string('service_type')->nullable()->after('company_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn(['whatsapp_number', 'company_name', 'service_type']);
        });
    }
};
