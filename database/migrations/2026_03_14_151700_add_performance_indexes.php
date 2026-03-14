<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->index('status');
            $table->index('published_at');
            $table->index('category');
        });

        Schema::table('portfolios', function (Blueprint $table) {
            $table->index('status');
            $table->index('category');
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
        });

        Schema::table('visitors', function (Blueprint $table) {
            // Composite index for LogVisitor middleware: WHERE ip_address = ? AND visited_date = ?
            $table->index(['ip_address', 'visited_date'], 'visitors_ip_date_composite');
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->index('group');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['published_at']);
            $table->dropIndex(['category']);
        });

        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['category']);
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('visitors', function (Blueprint $table) {
            $table->dropIndex('visitors_ip_date_composite');
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->dropIndex(['group']);
        });
    }
};
