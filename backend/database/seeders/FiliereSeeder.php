<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;

class FiliereSeeder extends Seeder
{
    public function run(): void
    {
        $filieres = [
            ['nom' => 'Informatique'],
            ['nom' => 'Mathématiques'],
            ['nom' => 'Physique'],
            ['nom' => 'Chimie'],
            ['nom' => 'Biologie'],
        ];

        foreach ($filieres as $filiere) {
            Filiere::create($filiere);
        }
    }
}