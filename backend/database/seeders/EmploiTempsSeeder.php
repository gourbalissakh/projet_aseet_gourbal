<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmploiTemps;
use App\Models\Cours;
use App\Models\Classe;
use Illuminate\Support\Facades\DB;

class EmploiTempsSeeder extends Seeder
{
    public function run(): void
    {
        $jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
        $horaires = [
            ['08:00', '10:00'],
            ['10:00', '12:00'],
            ['14:00', '16:00'],
            ['16:00', '18:00']
        ];
        $salles = ['S101', 'S102', 'S103', 'S201', 'S202', 'S203', 'AMPHI-A', 'AMPHI-B', 'LAB-INFO-1', 'LAB-INFO-2'];
        $types = ['CM', 'TD', 'TP'];

        // Récupérer les relations cours-classe depuis la table pivot
        $classesCours = DB::table('classe_cours')->limit(100)->get();

        foreach ($classesCours as $index => $relation) {
            $cours = Cours::find($relation->cours_id);
            $classe = Classe::find($relation->classe_id);
            
            if ($cours && $classe) {
                $jour = $jours[$index % count($jours)];
                $horaire = $horaires[$index % count($horaires)];
                $type = $types[$index % count($types)];

                EmploiTemps::create([
                    'code' => 'ET-' . date('Y') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                    'cours_id' => $cours->id,
                    'classe_id' => $classe->id,
                    'enseignant_id' => $cours->enseignant_id,
                    'salle' => $salles[array_rand($salles)],
                    'jour' => $jour,
                    'heure_debut' => $horaire[0],
                    'heure_fin' => $horaire[1],
                    'type' => $type,
                    'statut' => 'planifie',
                    'date_debut' => now()->startOfMonth(),
                    'date_fin' => now()->endOfMonth(),
                    'observations' => null
                ]);
            }
        }
    }
}