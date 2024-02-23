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
        Schema::create('rate_my_professor_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professor_id')->constrained();
            $table->float('rating');
            $table->float('difficulty');
            $table->integer('num_ratings')->unsigned();
            $table->string('department')->nullable();
            $table->string('link');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rate_my_professor_reviews');
    }
};
