<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    protected $fillable = ['code', 'nom', 'description'];

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }

    public function etudiants()
    {
        return $this->hasMany(User::class)->where('role', 'etudiant');
    }
}

