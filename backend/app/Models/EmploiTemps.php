<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmploiTemps extends Model
{
    protected $table = 'emplois_temps';
    
    protected $fillable = [
        'cours_id',
        'classe_id',
        'jour',
        'heure_debut',
        'heure_fin',
        'salle',
        'statut'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }
}