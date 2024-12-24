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
        Schema::create('professors', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('name')->index();
            $table->unsignedBigInteger('public_id')->unique()->nullable();
        });

        Schema::create('rate_my_professor_reviews', function (Blueprint $table) {
            $table->foreignId('professor_id')->constrained();
            $table->float('rating');
            $table->float('difficulty');
            $table->unsignedInteger('num_ratings');
            $table->string('department')->nullable();
            $table->string('link');
            $table->timestamps();

            $table->primary('professor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professors');
        Schema::dropIfExists('rate_my_professor_reviews');
    }
};
