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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained();
            $table->string('code')->unique();
            $table->jsonb('title');
            $table->jsonb('description');
            $table->jsonb('components')->nullable();
            $table->jsonb('requirements')->nullable();
            $table->jsonb('languages')->default('[]');
            $table->float('units')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
