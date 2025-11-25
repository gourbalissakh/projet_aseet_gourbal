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
    Schema::create('classes', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->string('code')->unique();
        $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
        $table->foreignId('niveau_id')->constrained('niveaux')->onDelete('cascade');
        $table->string('annee_academique')->default('2024-2025');
        $table->integer('capacite_max')->default(50);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
