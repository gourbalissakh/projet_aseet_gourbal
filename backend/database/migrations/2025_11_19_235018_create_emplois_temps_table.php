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
    Schema::create('emplois_temps', function (Blueprint $table) {
        $table->id();
        $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
        $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
        $table->string('jour');
        $table->time('heure_debut');
        $table->time('heure_fin');
        $table->string('salle')->nullable();
        $table->enum('statut', ['planifie', 'en_cours', 'termine', 'annule'])->default('planifie');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emplois_temps');
    }
};
