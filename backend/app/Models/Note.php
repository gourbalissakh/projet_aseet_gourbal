<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'etudiant_id',
        'cours_id',
        'note',
        'coefficient',
        'type_evaluation',
        'date_evaluation',
        'semestre'
    ];

    protected $casts = [
        'note' => 'float',
        'coefficient' => 'float',
        'date_evaluation' => 'date',
        'semestre' => 'integer',
    ];

    public function etudiant()
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }
}
