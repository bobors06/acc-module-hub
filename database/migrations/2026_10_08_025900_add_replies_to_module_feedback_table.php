<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('module_feedback', function (Blueprint $table) {
            $table->foreignId('parent_id')
                ->nullable()
                ->after('module_id')
                ->constrained('module_feedback')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('rating')
                ->nullable()
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('module_feedback', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn('parent_id');

            $table->unsignedTinyInteger('rating')
                ->nullable(false)
                ->change();
        });
    }
};
