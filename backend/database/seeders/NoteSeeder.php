<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;
use App\Models\User;
use App\Models\Cours;
use Illuminate\Support\Facades\DB;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        $etudiants = User::where('role', 'etudiant')->get();
        $anneeAcademique = 2024;
        
        foreach ($etudiants as $etudiant) {
            // Récupérer les cours de la classe de l'étudiant via la table pivot
            if ($etudiant->classe_id) {
                $coursIds = DB::table('classe_cours')
                    ->where('classe_id', $etudiant->classe_id)
                    ->pluck('cours_id');
                
                $cours = Cours::whereIn('id', $coursIds)->get();
                
                foreach ($cours as $c) {
                    // Session normale
                    $noteCC = rand(8, 20);
                    $noteTP = rand(8, 20);
                    $noteExamen = rand(8, 20);
                    $noteFinal = round(($noteCC * 0.3) + ($noteTP * 0.2) + ($noteExamen * 0.5), 2);
                    
                    $estValide = $noteFinal >= 10;
                    $mention = $this->getMention($noteFinal);
                    
                    Note::create([
                        'etudiant_id' => $etudiant->id,
                        'cours_id' => $c->id,
                        'session' => 'Normale',
                        'semestre' => $c->semestre,
                        'annee_academique' => $anneeAcademique,
                        'note_cc' => $noteCC,
                        'note_tp' => $noteTP,
                        'note_examen' => $noteExamen,
                        'note_finale' => $noteFinal,
                        'est_valide' => $estValide,
                        'mention' => $mention,
                        'saisi_par' => $c->enseignant_id,
                        'date_saisie' => now()->subDays(rand(1, 30))
                    ]);
                    
                    // Rattrapage pour ceux qui ont échoué (20% des cas)
                    if (!$estValide && rand(1, 5) == 1) {
                        $noteExamenRat = rand(10, 18);
                        $noteFinalRat = round(($noteCC * 0.3) + ($noteTP * 0.2) + ($noteExamenRat * 0.5), 2);
                        $estValideRat = $noteFinalRat >= 10;
                        $mentionRat = $this->getMention($noteFinalRat);
                        
                        Note::create([
                            'etudiant_id' => $etudiant->id,
                            'cours_id' => $c->id,
                            'session' => 'Rattrapage',
                            'semestre' => $c->semestre,
                            'annee_academique' => $anneeAcademique,
                            'note_cc' => $noteCC,
                            'note_tp' => $noteTP,
                            'note_examen' => $noteExamenRat,
                            'note_finale' => $noteFinalRat,
                            'est_valide' => $estValideRat,
                            'mention' => $mentionRat,
                            'commentaire' => 'Session de rattrapage',
                            'saisi_par' => $c->enseignant_id,
                            'date_saisie' => now()->subDays(rand(1, 15))
                        ]);
                    }
                }
            }
        }
    }
    
    private function getMention($note): string
    {
        if ($note >= 16) return 'Excellent';
        if ($note >= 14) return 'Très Bien';
        if ($note >= 12) return 'Bien';
        if ($note >= 10) return 'Assez Bien';
        if ($note >= 8) return 'Passable';
        return 'Ajourné';
    }
}
