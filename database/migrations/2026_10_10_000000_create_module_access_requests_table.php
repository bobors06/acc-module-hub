<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('module_access_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('pending');
            $table->text('access_code')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->unique(['module_id', 'student_id']);
            $table->index(['module_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_access_requests');
    }
};
