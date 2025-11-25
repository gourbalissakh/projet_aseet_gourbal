<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Filiere;
use App\Models\Niveau;
use App\Models\Classe;
use App\Models\Cours;
use App\Models\EmploiTemps;
use App\Models\Note;

class CompleteDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Créer l'administrateur
        $admin = User::create([
            'nom' => 'GOURBAL',
            'prenom' => 'Administrateur',
            'email' => 'admin@akhouye.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'matricule' => 'ADM-2024-001',
            'telephone' => '+221771234567',
            'adresse' => 'Dakar, Sénégal',
            'statut' => 'actif',
            'sexe' => 'M',
        ]);

        // 2. Créer les filières
        $filieres = [
            ['code' => 'INFO', 'nom' => 'Informatique et Réseaux', 'description' => 'Formation en développement logiciel, réseaux et systèmes'],
            ['code' => 'GC', 'nom' => 'Génie Civil', 'description' => 'Formation en construction, BTP et infrastructures'],
            ['code' => 'ELEC', 'nom' => 'Électrotechnique', 'description' => 'Formation en systèmes électriques et automatisation'],
            ['code' => 'MECA', 'nom' => 'Génie Mécanique', 'description' => 'Formation en mécanique industrielle et maintenance'],
            ['code' => 'GCOM', 'nom' => 'Gestion Commerciale', 'description' => 'Formation en commerce, marketing et vente'],
        ];

        $filieresCreated = [];
        foreach ($filieres as $filiereData) {
            $filieresCreated[$filiereData['code']] = Filiere::create($filiereData);
        }

        // 3. Créer les niveaux
        $niveaux = [
            ['code' => 'L1', 'nom' => 'Licence 1', 'ordre' => 1],
            ['code' => 'L2', 'nom' => 'Licence 2', 'ordre' => 2],
            ['code' => 'L3', 'nom' => 'Licence 3', 'ordre' => 3],
        ];

        $niveauxCreated = [];
        foreach ($niveaux as $niveauData) {
            $niveauxCreated[$niveauData['code']] = Niveau::create($niveauData);
        }

        // 4. Créer les classes
        $classes = [];
        foreach ($filieresCreated as $codeFiliere => $filiere) {
            foreach ($niveauxCreated as $codeNiveau => $niveau) {
                $classe = Classe::create([
                    'code' => $codeFiliere . '-' . $codeNiveau,
                    'nom' => $filiere->nom . ' - ' . $niveau->nom,
                    'filiere_id' => $filiere->id,
                    'niveau_id' => $niveau->id,
                    'annee_academique' => '2024-2025',
                    'capacite_max' => 30,
                ]);
                $classes[$codeFiliere . '-' . $codeNiveau] = $classe;
            }
        }

        // 5. Créer les enseignants
        $enseignants = [
            ['nom' => 'DIOP', 'prenom' => 'Amadou', 'email' => 'amadou.diop@akhouye.com', 'specialite' => 'Programmation'],
            ['nom' => 'NDIAYE', 'prenom' => 'Fatou', 'email' => 'fatou.ndiaye@akhouye.com', 'specialite' => 'Base de données'],
            ['nom' => 'SARR', 'prenom' => 'Moussa', 'email' => 'moussa.sarr@akhouye.com', 'specialite' => 'Réseaux'],
            ['nom' => 'FALL', 'prenom' => 'Aissatou', 'email' => 'aissatou.fall@akhouye.com', 'specialite' => 'Mathématiques'],
            ['nom' => 'SECK', 'prenom' => 'Ousmane', 'email' => 'ousmane.seck@akhouye.com', 'specialite' => 'Physique'],
            ['nom' => 'BA', 'prenom' => 'Mariama', 'email' => 'mariama.ba@akhouye.com', 'specialite' => 'Électronique'],
            ['nom' => 'GUEYE', 'prenom' => 'Ibrahima', 'email' => 'ibrahima.gueye@akhouye.com', 'specialite' => 'Mécanique'],
            ['nom' => 'SY', 'prenom' => 'Khady', 'email' => 'khady.sy@akhouye.com', 'specialite' => 'Gestion'],
            ['nom' => 'DIALLO', 'prenom' => 'Mamadou', 'email' => 'mamadou.diallo@akhouye.com', 'specialite' => 'Marketing'],
            ['nom' => 'KANE', 'prenom' => 'Aminata', 'email' => 'aminata.kane@akhouye.com', 'specialite' => 'Comptabilité'],
            ['nom' => 'TOURE', 'prenom' => 'Abdoulaye', 'email' => 'abdoulaye.toure@akhouye.com', 'specialite' => 'Anglais'],
            ['nom' => 'CISSE', 'prenom' => 'Binta', 'email' => 'binta.cisse@akhouye.com', 'specialite' => 'Français'],
        ];

        $enseignantsCreated = [];
        foreach ($enseignants as $index => $enseignantData) {
            $enseignantsCreated[] = User::create([
                'nom' => $enseignantData['nom'],
                'prenom' => $enseignantData['prenom'],
                'email' => $enseignantData['email'],
                'password' => Hash::make('password'),
                'role' => 'enseignant',
                'matricule' => 'ENS-2024-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'telephone' => '+2217' . rand(70000000, 79999999),
                'adresse' => 'Dakar, Sénégal',
                'statut' => 'actif',
                'sexe' => in_array($enseignantData['prenom'], ['Fatou', 'Aissatou', 'Mariama', 'Khady', 'Aminata', 'Binta']) ? 'F' : 'M',
            ]);
        }

        // 6. Créer les étudiants (20 par classe)
        $prenoms_masculins = ['Ibrahima', 'Moussa', 'Abdoulaye', 'Mamadou', 'Ousmane', 'Cheikh', 'Babacar', 'Saliou', 'Modou', 'Lamine'];
        $prenoms_feminins = ['Fatou', 'Aissatou', 'Mariama', 'Khady', 'Aminata', 'Binta', 'Coumba', 'Daba', 'Ndeye', 'Rokhaya'];
        $noms = ['DIOP', 'NDIAYE', 'SARR', 'FALL', 'SECK', 'BA', 'GUEYE', 'SY', 'DIALLO', 'KANE', 'TOURE', 'CISSE', 'LO', 'DIOUF', 'FAYE'];

        $etudiantCounter = 1;
        foreach ($classes as $codeClasse => $classe) {
            for ($i = 1; $i <= 20; $i++) {
                $sexe = rand(0, 1) ? 'M' : 'F';
                $prenom = $sexe === 'M' ? $prenoms_masculins[array_rand($prenoms_masculins)] : $prenoms_feminins[array_rand($prenoms_feminins)];
                $nom = $noms[array_rand($noms)];

                User::create([
                    'nom' => $nom,
                    'prenom' => $prenom,
                    'email' => strtolower($prenom . '.' . $nom . $etudiantCounter . '@etudiant.akhouye.com'),
                    'password' => Hash::make('password'),
                    'role' => 'etudiant',
                    'matricule' => 'ETU-2024-' . str_pad($etudiantCounter, 4, '0', STR_PAD_LEFT),
                    'telephone' => '+2217' . rand(70000000, 79999999),
                    'adresse' => 'Dakar, Sénégal',
                    'statut' => 'actif',
                    'sexe' => $sexe,
                    'filiere_id' => $classe->filiere_id,
                    'niveau_id' => $classe->niveau_id,
                    'classe_id' => $classe->id,
                    'date_naissance' => now()->subYears(rand(18, 25))->format('Y-m-d'),
                ]);

                $etudiantCounter++;
            }
        }

        // 7. Créer les cours
        $coursData = [
            // Informatique
            'INFO' => [
                'L1' => ['Algorithmique', 'Mathématiques 1', 'Introduction à la programmation', 'Architecture des ordinateurs', 'Anglais technique 1'],
                'L2' => ['Programmation orientée objet', 'Base de données', 'Réseaux informatiques', 'Systèmes d\'exploitation', 'Anglais technique 2'],
                'L3' => ['Développement web', 'Génie logiciel', 'Sécurité informatique', 'Intelligence artificielle', 'Projet de fin d\'études'],
            ],
            // Génie Civil
            'GC' => [
                'L1' => ['Mathématiques pour ingénieurs', 'Mécanique générale', 'Dessin technique', 'Matériaux de construction', 'Topographie'],
                'L2' => ['Résistance des matériaux', 'Béton armé', 'Hydraulique', 'Routes et voiries', 'Gestion de projet'],
                'L3' => ['Construction métallique', 'Ouvrages d\'art', 'Bâtiment', 'Étude de prix', 'Stage professionnel'],
            ],
            // Électrotechnique
            'ELEC' => [
                'L1' => ['Électricité générale', 'Électronique de base', 'Mathématiques appliquées', 'Physique électrique', 'Dessin électrique'],
                'L2' => ['Machines électriques', 'Électronique de puissance', 'Automatisme', 'Mesures électriques', 'Installations électriques'],
                'L3' => ['Énergies renouvelables', 'Régulation industrielle', 'Automates programmables', 'Maintenance industrielle', 'Projet technique'],
            ],
            // Génie Mécanique
            'MECA' => [
                'L1' => ['Mécanique générale', 'Technologie de fabrication', 'Dessin industriel', 'Matériaux', 'Métrologie'],
                'L2' => ['Thermodynamique', 'Mécanique des fluides', 'Construction mécanique', 'Procédés de fabrication', 'CAO/DAO'],
                'L3' => ['Maintenance industrielle', 'Automatisme', 'Gestion de production', 'Qualité industrielle', 'Projet industriel'],
            ],
            // Gestion Commerciale
            'GCOM' => [
                'L1' => ['Principes de gestion', 'Comptabilité générale', 'Marketing de base', 'Économie générale', 'Informatique bureautique'],
                'L2' => ['Comptabilité analytique', 'Marketing opérationnel', 'Gestion financière', 'Droit commercial', 'Statistiques'],
                'L3' => ['Management stratégique', 'Commerce international', 'E-commerce', 'Entrepreneuriat', 'Stage en entreprise'],
            ],
        ];

        $coursCreated = [];
        foreach ($coursData as $codeFiliere => $niveauxCours) {
            foreach ($niveauxCours as $codeNiveau => $coursList) {
                $classe = $classes[$codeFiliere . '-' . $codeNiveau];
                foreach ($coursList as $nomCours) {
                    $enseignant = $enseignantsCreated[array_rand($enseignantsCreated)];
                    
                    $cours = Cours::create([
                        'code' => strtoupper(substr($nomCours, 0, 3)) . '-' . $codeNiveau . '-' . rand(100, 999),
                        'nom' => $nomCours,
                        'description' => 'Cours de ' . $nomCours . ' pour ' . $classe->nom,
                        'credits' => rand(3, 6),
                        'volume_horaire' => rand(30, 60),
                        'classe_id' => $classe->id,
                        'enseignant_id' => $enseignant->id,
                    ]);

                    $coursCreated[] = $cours;
                }
            }
        }

        // 8. Créer les emplois du temps (2 par cours)
        $jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
        $heures = ['08:00', '10:00', '14:00', '16:00'];
        $salles = ['A101', 'A102', 'A201', 'A202', 'B101', 'B102', 'B201', 'B202', 'C101', 'C102'];

        foreach ($coursCreated as $cours) {
            for ($i = 0; $i < 2; $i++) {
                $heureDebut = $heures[array_rand($heures)];
                $heureDebutObj = \Carbon\Carbon::parse($heureDebut);
                $heureFin = $heureDebutObj->addHours(2)->format('H:i');

                EmploiTemps::create([
                    'cours_id' => $cours->id,
                    'classe_id' => $cours->classe_id,
                    'jour' => $jours[array_rand($jours)],
                    'heure_debut' => $heureDebut,
                    'heure_fin' => $heureFin,
                    'salle' => $salles[array_rand($salles)],
                    'statut' => rand(0, 1) ? 'planifie' : 'en_cours',
                ]);
            }
        }

        // 9. Créer quelques notes pour les étudiants de L3
        $etudiants = User::where('role', 'etudiant')
            ->whereHas('niveau', function ($query) {
                $query->where('code', 'L3');
            })
            ->get();

        foreach ($etudiants as $etudiant) {
            $coursClasse = Cours::where('classe_id', $etudiant->classe_id)->get();
            
            foreach ($coursClasse->random(min(3, $coursClasse->count())) as $cours) {
                Note::create([
                    'etudiant_id' => $etudiant->id,
                    'cours_id' => $cours->id,
                    'note' => rand(8, 20),
                    'coefficient' => rand(1, 3),
                    'type_evaluation' => ['Devoir', 'Examen', 'TP'][array_rand(['Devoir', 'Examen', 'TP'])],
                    'date_evaluation' => now()->subDays(rand(1, 60)),
                    'semestre' => 'S' . rand(1, 2),
                ]);
            }
        }

        $this->command->info('🎉 Base de données remplie avec succès !');
        $this->command->info('📊 Statistiques :');
        $this->command->info('   - Filières : ' . Filiere::count());
        $this->command->info('   - Niveaux : ' . Niveau::count());
        $this->command->info('   - Classes : ' . Classe::count());
        $this->command->info('   - Enseignants : ' . User::where('role', 'enseignant')->count());
        $this->command->info('   - Étudiants : ' . User::where('role', 'etudiant')->count());
        $this->command->info('   - Cours : ' . Cours::count());
        $this->command->info('   - Emplois du temps : ' . EmploiTemps::count());
        $this->command->info('   - Notes : ' . Note::count());
    }
}
