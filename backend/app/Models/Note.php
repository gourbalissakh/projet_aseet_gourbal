<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'etudiant_id',
        'cours_id',
        'session',
        'semestre',
        'annee_academique',
        'note_cc',
        'note_tp',
        'note_examen',
        'note_finale',
        'est_valide',
        'mention',
        'commentaire',
        'saisi_par',
        'date_saisie'
    ];

    protected $casts = [
        'est_valide' => 'boolean',
        'date_saisie' => 'datetime',
    ];

    public function etudiant()
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function saisieParEnseignant()
    {
        return $this->belongsTo(User::class, 'saisi_par');
    }
}
