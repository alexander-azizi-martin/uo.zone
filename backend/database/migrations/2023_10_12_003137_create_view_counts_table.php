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
        Schema::create('view_counts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('views');
            $table->unsignedBigInteger('viewable_id');
            $table->string('viewable_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('view_counts');
    }
};
