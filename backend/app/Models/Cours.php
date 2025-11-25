<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $fillable = [
        'nom',
        'code',
        'description',
        'credits',
        'volume_horaire',
        'classe_id',
        'enseignant_id'
    ];

    public function enseignant()
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function emplois()
    {
        return $this->hasMany(EmploiTemps::class);
    }
    
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}