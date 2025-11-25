<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Classe;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $classes = Classe::all();
        
        // Admin
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

        // Enseignants avec spécialités
        $enseignants = [
            ['nom' => 'DIOP', 'prenom' => 'Amadou', 'email' => 'amadou.diop@akhouye.com', 'specialite' => 'Programmation Web', 'diplome' => 'Doctorat en Informatique'],
            ['nom' => 'NDIAYE', 'prenom' => 'Fatou', 'email' => 'fatou.ndiaye@akhouye.com', 'specialite' => 'Base de Données', 'diplome' => 'Master en Informatique'],
            ['nom' => 'FALL', 'prenom' => 'Moussa', 'email' => 'moussa.fall@akhouye.com', 'specialite' => 'Réseaux Informatiques', 'diplome' => 'Doctorat en Réseaux'],
            ['nom' => 'SOW', 'prenom' => 'Aissatou', 'email' => 'aissatou.sow@akhouye.com', 'specialite' => 'Intelligence Artificielle', 'diplome' => 'Doctorat en IA'],
            ['nom' => 'BA', 'prenom' => 'Ousmane', 'email' => 'ousmane.ba@akhouye.com', 'specialite' => 'Génie Logiciel', 'diplome' => 'Master en GL'],
            ['nom' => 'SARR', 'prenom' => 'Khady', 'email' => 'khady.sarr@akhouye.com', 'specialite' => 'Mathématiques Appliquées', 'diplome' => 'Doctorat en Maths'],
            ['nom' => 'TOURE', 'prenom' => 'Mamadou', 'email' => 'mamadou.toure@akhouye.com', 'specialite' => 'Sécurité Informatique', 'diplome' => 'Master en Cybersécurité'],
            ['nom' => 'SY', 'prenom' => 'Mariama', 'email' => 'mariama.sy@akhouye.com', 'specialite' => 'Algorithmes', 'diplome' => 'Doctorat en Informatique'],
            ['nom' => 'GUEYE', 'prenom' => 'Ibrahima', 'email' => 'ibrahima.gueye@akhouye.com', 'specialite' => 'Systèmes d\'Exploitation', 'diplome' => 'Master en Informatique'],
            ['nom' => 'MBAYE', 'prenom' => 'Awa', 'email' => 'awa.mbaye@akhouye.com', 'specialite' => 'Développement Mobile', 'diplome' => 'Master en Informatique'],
            ['nom' => 'DIOUF', 'prenom' => 'Cheikh', 'email' => 'cheikh.diouf@akhouye.com', 'specialite' => 'Cloud Computing', 'diplome' => 'Doctorat en Informatique'],
            ['nom' => 'SECK', 'prenom' => 'Aminata', 'email' => 'aminata.seck@akhouye.com', 'specialite' => 'Data Science', 'diplome' => 'Doctorat en Data Science'],
            ['nom' => 'CISSE', 'prenom' => 'Malick', 'email' => 'malick.cisse@akhouye.com', 'specialite' => 'Architecture Logicielle', 'diplome' => 'Master en GL'],
            ['nom' => 'DIALLO', 'prenom' => 'Bineta', 'email' => 'bineta.diallo@akhouye.com', 'specialite' => 'Blockchain', 'diplome' => 'Master en Informatique'],
            ['nom' => 'WADE', 'prenom' => 'Alioune', 'email' => 'alioune.wade@akhouye.com', 'specialite' => 'Internet des Objets', 'diplome' => 'Doctorat en Informatique'],
        ];

        foreach ($enseignants as $index => $ens) {
            User::create([
                'nom' => $ens['nom'],
                'prenom' => $ens['prenom'],
                'email' => $ens['email'],
                'password' => Hash::make('password'),
                'role' => 'enseignant',
                'matricule' => 'ENS-2024-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'telephone' => '+221 77 ' . rand(100, 999) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                'date_naissance' => rand(1970, 1990) . '-' . rand(1, 12) . '-' . rand(1, 28),
                'lieu_naissance' => ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor'][array_rand(['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor'])],
                'sexe' => ['M', 'F'][array_rand(['M', 'F'])],
                'adresse' => ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès'][array_rand(['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès'])],
                'specialite' => $ens['specialite'],
                'diplome' => $ens['diplome'],
                'statut' => 'actif'
            ]);
        }

        // Étudiants réalistes
        $prenoms_m = ['Ibrahima', 'Moussa', 'Omar', 'Abdoulaye', 'Mamadou', 'Cheikh', 'Alioune', 'Saliou', 'Babacar', 'Modou'];
        $prenoms_f = ['Fatou', 'Aissatou', 'Mariama', 'Khady', 'Aminata', 'Ndeye', 'Awa', 'Maimouna', 'Bineta', 'Astou'];
        $noms = ['DIOP', 'NDIAYE', 'FALL', 'SOW', 'BA', 'SY', 'SARR', 'DIOUF', 'MBAYE', 'GUEYE', 'DIALLO', 'SECK', 'CISSE', 'WADE', 'SALL'];
        
        for ($i = 1; $i <= 150; $i++) {
            $sexe = rand(0, 1) ? 'M' : 'F';
            $prenom = $sexe === 'M' ? $prenoms_m[array_rand($prenoms_m)] : $prenoms_f[array_rand($prenoms_f)];
            $nom = $noms[array_rand($noms)];
            $classe = $classes->random();
            $annee = rand(2000, 2005);
            
            User::create([
                'nom' => $nom,
                'prenom' => $prenom,
                'email' => strtolower($prenom) . '.' . strtolower($nom) . $i . '@akhouye.com',
                'password' => Hash::make('password'),
                'role' => 'etudiant',
                'classe_id' => $classe->id,
                'matricule' => 'ETU-' . date('Y') . '-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'telephone' => '+221 77 ' . rand(100, 999) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                'date_naissance' => $annee . '-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
                'lieu_naissance' => ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Tambacounda', 'Louga', 'Mbour', 'Diourbel'][array_rand(['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Tambacounda', 'Louga', 'Mbour', 'Diourbel'])],
                'sexe' => $sexe,
                'adresse' => ['Dakar-Plateau', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès', 'Parcelles Assainies', 'Grand Yoff', 'Ouakam', 'Médina'][array_rand(['Dakar-Plateau', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès', 'Parcelles Assainies', 'Grand Yoff', 'Ouakam', 'Médina'])],
                'tuteur_nom' => $noms[array_rand($noms)] . ' ' . ($sexe === 'M' ? $prenoms_m : $prenoms_f)[array_rand($sexe === 'M' ? $prenoms_m : $prenoms_f)],
                'tuteur_telephone' => '+221 77 ' . rand(100, 999) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                'statut' => 'actif'
            ]);
        }
    }
}