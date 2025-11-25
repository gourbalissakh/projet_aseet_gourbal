<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cours;
use App\Models\Classe;
use App\Models\Niveau;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CoursSeeder extends Seeder
{
    public function run(): void
    {
        $classes = Classe::all();
        $niveaux = Niveau::all();
        $enseignants = User::where('role', 'enseignant')->get();

        $coursData = [
            ['nom' => 'Programmation Web', 'code' => 'PWEB', 'coefficient' => 4, 'credits' => 6, 'heures_cm' => 30, 'heures_td' => 20, 'heures_tp' => 20, 'type' => 'obligatoire', 'semestre' => 'S1'],
            ['nom' => 'Base de Données', 'code' => 'BDD', 'coefficient' => 4, 'credits' => 6, 'heures_cm' => 30, 'heures_td' => 15, 'heures_tp' => 25, 'type' => 'obligatoire', 'semestre' => 'S1'],
            ['nom' => 'Algorithmique', 'code' => 'ALGO', 'coefficient' => 3, 'credits' => 5, 'heures_cm' => 25, 'heures_td' => 25, 'heures_tp' => 15, 'type' => 'obligatoire', 'semestre' => 'S1'],
            ['nom' => 'Réseaux Informatiques', 'code' => 'RESEAU', 'coefficient' => 3, 'credits' => 5, 'heures_cm' => 25, 'heures_td' => 15, 'heures_tp' => 20, 'type' => 'obligatoire', 'semestre' => 'S2'],
            ['nom' => 'Systèmes d\'Exploitation', 'code' => 'SE', 'coefficient' => 3, 'credits' => 5, 'heures_cm' => 25, 'heures_td' => 20, 'heures_tp' => 15, 'type' => 'obligatoire', 'semestre' => 'S1'],
            ['nom' => 'Intelligence Artificielle', 'code' => 'IA', 'coefficient' => 4, 'credits' => 6, 'heures_cm' => 30, 'heures_td' => 20, 'heures_tp' => 20, 'type' => 'obligatoire', 'semestre' => 'S2'],
            ['nom' => 'Génie Logiciel', 'code' => 'GL', 'coefficient' => 3, 'credits' => 5, 'heures_cm' => 25, 'heures_td' => 20, 'heures_tp' => 15, 'type' => 'obligatoire', 'semestre' => 'S2'],
            ['nom' => 'Sécurité Informatique', 'code' => 'SECU', 'coefficient' => 2, 'credits' => 4, 'heures_cm' => 20, 'heures_td' => 15, 'heures_tp' => 15, 'type' => 'optionnel', 'semestre' => 'S2'],
            ['nom' => 'Mathématiques Appliquées', 'code' => 'MATH', 'coefficient' => 2, 'credits' => 4, 'heures_cm' => 25, 'heures_td' => 20, 'heures_tp' => 0, 'type' => 'obligatoire', 'semestre' => 'S1'],
            ['nom' => 'Anglais Technique', 'code' => 'ANG', 'coefficient' => 1, 'credits' => 2, 'heures_cm' => 15, 'heures_td' => 15, 'heures_tp' => 0, 'type' => 'obligatoire', 'semestre' => 'S1'],
        ];

        foreach ($niveaux as $niveau) {
            foreach ($coursData as $index => $data) {
                // Code unique basé sur le cours + niveau ID
                $code = $data['code'] . '-N' . $niveau->id;
                
                $cours = Cours::create([
                    'nom' => $data['nom'],
                    'code' => $code,
                    'description' => 'Description du cours de ' . $data['nom'] . ' pour le niveau ' . $niveau->nom,
                    'coefficient' => $data['coefficient'],
                    'credits' => $data['credits'],
                    'heures_cm' => $data['heures_cm'],
                    'heures_td' => $data['heures_td'],
                    'heures_tp' => $data['heures_tp'],
                    'niveau_id' => $niveau->id,
                    'semestre' => $data['semestre'],
                    'type' => $data['type'],
                    'enseignant_id' => $enseignants[$index % $enseignants->count()]->id,
                    'statut' => 'actif'
                ]);

                // Attribuer le cours à plusieurs classes du même niveau
                $classesNiveau = $classes->where('niveau_id', $niveau->id);
                foreach ($classesNiveau->take(3) as $classe) {
                    DB::table('classe_cours')->insert([
                        'classe_id' => $classe->id,
                        'cours_id' => $cours->id,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }
    }
}