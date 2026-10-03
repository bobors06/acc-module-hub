<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->boolean('is_active')
                ->default(true)
                ->after('file_path');

            $table->timestamp('disabled_at')
                ->nullable()
                ->after('is_active');

            $table->foreignId('disabled_by')
                ->nullable()
                ->after('disabled_at')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropForeign(['disabled_by']);
            $table->dropColumn([
                'is_active',
                'disabled_at',
                'disabled_by',
            ]);
        });
    }
};
