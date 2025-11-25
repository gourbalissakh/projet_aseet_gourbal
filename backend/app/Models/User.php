<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
        'filiere_id',
        'niveau_id',
        'classe_id',
        'matricule',
        'telephone',
        'date_naissance',
        'lieu_naissance',
        'sexe',
        'adresse',
        'statut',
        'photo',
        'tuteur_nom',
        'tuteur_telephone',
        'specialite',
        'diplome'
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function coursEnseignes()
    {
        return $this->hasMany(Cours::class, 'enseignant_id');
    }

    public function classesResponsable()
    {
        return $this->hasMany(Classe::class, 'responsable_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'etudiant_id');
    }

    public function emplois()
    {
        return $this->hasMany(EmploiTemps::class, 'enseignant_id');
    }
}