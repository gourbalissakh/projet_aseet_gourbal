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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('matricule')->unique()->nullable();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('telephone')->nullable();
            $table->date('date_naissance')->nullable();
            $table->string('lieu_naissance')->nullable();
            $table->enum('sexe', ['M', 'F'])->nullable();
            $table->string('adresse')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'enseignant', 'etudiant'])->default('etudiant');
            $table->enum('statut', ['actif', 'inactif', 'suspendu'])->default('actif');
            $table->string('photo')->nullable();
            
            // Relations pour les étudiants
            $table->foreignId('filiere_id')->nullable()->constrained('filieres')->onDelete('set null');
            $table->foreignId('niveau_id')->nullable()->constrained('niveaux')->onDelete('set null');
            $table->foreignId('classe_id')->nullable()->constrained('classes')->onDelete('set null');
            
            // Informations tuteur (étudiants)
            $table->string('tuteur_nom')->nullable();
            $table->string('tuteur_telephone')->nullable();
            
            // Informations professionnelles (enseignants)
            $table->string('specialite')->nullable();
            $table->string('diplome')->nullable();
            
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
