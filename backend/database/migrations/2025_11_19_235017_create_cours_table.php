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
    Schema::create('cours', function (Blueprint $table) {
        $table->id();
        $table->string('code')->unique();
        $table->string('nom');
        $table->text('description')->nullable();
        $table->integer('credits')->default(3);
        $table->integer('volume_horaire')->default(30);
        $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
        $table->foreignId('enseignant_id')->constrained('users')->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
