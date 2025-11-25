<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    protected $fillable = ['code', 'nom', 'ordre'];

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }

    public function etudiants()
    {
        return $this->hasMany(User::class)->where('role', 'etudiant');
    }
}

