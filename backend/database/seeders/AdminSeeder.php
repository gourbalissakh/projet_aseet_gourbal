<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Créer uniquement le compte admin
        User::create([
            'nom' => 'GOURBAL',
            'prenom' => 'Admin',
            'email' => 'admin@akhouye.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'matricule' => 'ADM-2024-001',
            'telephone' => '+221 77 123 45 67',
            'sexe' => 'M',
            'statut' => 'actif'
        ]);
    }
}
