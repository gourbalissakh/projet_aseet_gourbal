<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classe;
use App\Models\Niveau;
use App\Models\Filiere;

class ClasseSeeder extends Seeder
{
    public function run(): void
    {
        $niveaux = Niveau::all();
        $filieres = Filiere::all();

        $groupes = ['A', 'B', 'C'];
        $salles = ['S101', 'S102', 'S103', 'S201', 'S202', 'S203', 'S301', 'S302', 'S303', 'AMPHI-A', 'AMPHI-B'];

        $codeCounter = 1;

        foreach ($niveaux as $niveau) {
            foreach ($filieres->take(3) as $filiere) {
                foreach ($groupes as $groupe) {
                    // Génération d'un code unique basé sur un compteur
                    $code = 'CL-' . date('Y') . '-' . str_pad($codeCounter++, 3, '0', STR_PAD_LEFT);
                    
                    Classe::create([
                        'nom' => $niveau->nom . ' ' . $filiere->nom . ' - Groupe ' . $groupe,
                        'code' => $code,
                        'filiere_id' => $filiere->id,
                        'niveau_id' => $niveau->id,
                        'capacite' => rand(40, 60),
                        'effectif' => rand(25, 50),
                        'salle_principale' => $salles[array_rand($salles)],
                        'statut' => 'active'
                    ]);
                }
            }
        }
    }
}