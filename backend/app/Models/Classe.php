<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    protected $fillable = [
        'nom',
        'code',
        'filiere_id',
        'niveau_id',
        'annee_academique',
        'capacite_max'
    ];

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }

    public function etudiants()
    {
        return $this->hasMany(User::class)->where('role', 'etudiant');
    }

    public function emplois()
    {
        return $this->hasMany(EmploiTemps::class);
    }
}

