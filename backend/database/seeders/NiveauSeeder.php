<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Niveau;
use App\Models\Filiere;

class NiveauSeeder extends Seeder
{
    public function run(): void
    {
        $filieres = Filiere::all();

        $niveaux = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'];

        foreach ($filieres as $filiere) {
            foreach ($niveaux as $niveau) {
                Niveau::create([
                    'nom' => $niveau,
                    'filiere_id' => $filiere->id
                ]);
            }
        }
    }
}