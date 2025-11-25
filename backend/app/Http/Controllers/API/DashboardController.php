<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Classe;
use App\Models\Cours;
use App\Models\EmploiTemps;
use App\Models\Filiere;
use App\Models\Niveau;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Statistiques générales pour le dashboard admin
     */
    public function getAdminStats(): JsonResponse
    {
        try {
            $stats = [
                'etudiants' => [
                    'total' => User::where('role', 'etudiant')->count(),
                    'actifs' => User::where('role', 'etudiant')
                        ->whereNotNull('classe_id')
                        ->count(),
                    'change' => $this->calculateGrowth('users', 'etudiant'),
                ],
                'enseignants' => [
                    'total' => User::where('role', 'enseignant')->count(),
                    'actifs' => User::where('role', 'enseignant')
                        ->whereHas('coursEnseignes')
                        ->count(),
                    'change' => $this->calculateGrowth('users', 'enseignant'),
                ],
                'cours' => [
                    'total' => Cours::count(),
                    'actifs' => Cours::whereHas('emploisTemps')->distinct()->count(),
                    'change' => $this->calculateGrowth('cours'),
                ],
                'classes' => [
                    'total' => Classe::count(),
                    'actives' => Classe::whereHas('etudiants')->count(),
                    'change' => $this->calculateGrowth('classes'),
                ],
                'filieres' => Filiere::count(),
                'niveaux' => Niveau::count(),
                'emplois_temps' => EmploiTemps::count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activités récentes
     */
    public function getRecentActivities(): JsonResponse
    {
        try {
            $activities = [];

            // Derniers utilisateurs créés
            $recentUsers = User::latest()
                ->take(5)
                ->get(['id', 'nom', 'prenom', 'role', 'created_at']);

            foreach ($recentUsers as $user) {
                $activities[] = [
                    'id' => 'user-' . $user->id,
                    'type' => 'user_created',
                    'title' => ($user->prenom ? $user->prenom . ' ' : '') . $user->nom . ' s\'est inscrit(e)',
                    'user' => $this->getRoleLabel($user->role),
                    'avatar' => $this->getRoleAvatar($user->role),
                    'time' => $this->getTimeAgo($user->created_at),
                    'timestamp' => $user->created_at->timestamp,
                ];
            }

            // Derniers cours créés
            $recentCours = Cours::with('professeur')
                ->latest()
                ->take(3)
                ->get();

            foreach ($recentCours as $cours) {
                $activities[] = [
                    'id' => 'cours-' . $cours->id,
                    'type' => 'cours_created',
                    'title' => 'Nouveau cours de ' . $cours->nom . ' ajouté',
                    'user' => $cours->professeur ? ($cours->professeur->prenom ? 'Prof. ' . $cours->professeur->nom : $cours->professeur->nom) : 'Admin',
                    'avatar' => '👨‍🏫',
                    'time' => $this->getTimeAgo($cours->created_at),
                    'timestamp' => $cours->created_at->timestamp,
                ];
            }

            // Dernières classes créées
            $recentClasses = Classe::latest()
                ->take(2)
                ->get();

            foreach ($recentClasses as $classe) {
                $activities[] = [
                    'id' => 'classe-' . $classe->id,
                    'type' => 'classe_created',
                    'title' => 'Classe ' . $classe->nom . ' créée',
                    'user' => 'Admin',
                    'avatar' => '⚙️',
                    'time' => $this->getTimeAgo($classe->created_at),
                    'timestamp' => $classe->created_at->timestamp,
                ];
            }

            // Trier par date décroissante et limiter à 10
            usort($activities, function($a, $b) {
                return $b['timestamp'] - $a['timestamp'];
            });

            $activities = array_slice($activities, 0, 10);

            // Supprimer le timestamp (utilisé uniquement pour le tri)
            foreach ($activities as &$activity) {
                unset($activity['timestamp']);
            }

            return response()->json($activities);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des activités',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Statistiques de performance
     */
    public function getPerformanceStats(): JsonResponse
    {
        try {
            $totalEtudiants = User::where('role', 'etudiant')->count();
            $etudiantsAvecClasse = User::where('role', 'etudiant')
                ->whereNotNull('classe_id')
                ->count();

            $totalCours = Cours::count();
            $coursActifs = Cours::whereHas('emploisTemps')->distinct()->count();

            $stats = [
                'taux_inscription' => $totalEtudiants > 0 
                    ? round(($etudiantsAvecClasse / $totalEtudiants) * 100) 
                    : 0,
                'taux_cours_actifs' => $totalCours > 0 
                    ? round(($coursActifs / $totalCours) * 100) 
                    : 0,
                'moyenne_etudiants_par_classe' => Classe::count() > 0
                    ? round(User::where('role', 'etudiant')->whereNotNull('classe_id')->count() / Classe::count())
                    : 0,
                'moyenne_cours_par_enseignant' => User::where('role', 'enseignant')->count() > 0
                    ? round(Cours::count() / User::where('role', 'enseignant')->count(), 1)
                    : 0,
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des statistiques de performance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Statistiques pour le dashboard enseignant
     */
    public function getTeacherStats(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || $user->role !== 'enseignant') {
                return response()->json([
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Récupérer les cours de l'enseignant
            $mesCours = Cours::where('enseignant_id', $user->id)->get();
            $coursIds = $mesCours->pluck('id');

            // Compter les emplois du temps actifs
            $emploisActifs = EmploiTemps::whereIn('cours_id', $coursIds)
                ->count();

            // Compter les étudiants dans les classes où l'enseignant enseigne
            $classesIds = EmploiTemps::whereIn('cours_id', $coursIds)
                ->distinct()
                ->pluck('classe_id');

            $totalEtudiants = User::where('role', 'etudiant')
                ->whereIn('classe_id', $classesIds)
                ->count();

            $stats = [
                'mes_cours' => [
                    'total' => $mesCours->count(),
                    'actifs' => $emploisActifs,
                ],
                'mes_etudiants' => [
                    'total' => $totalEtudiants,
                    'classes' => $classesIds->count(),
                ],
                'emplois_temps' => [
                    'total' => EmploiTemps::whereIn('cours_id', $coursIds)->count(),
                    'cette_semaine' => EmploiTemps::whereIn('cours_id', $coursIds)
                        ->where('jour', now()->locale('fr')->dayName)
                        ->count(),
                ],
                'mes_classes' => $classesIds->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prochains cours pour l'enseignant
     */
    public function getTeacherSchedule(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || $user->role !== 'enseignant') {
                return response()->json([
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            $mesCours = Cours::where('enseignant_id', $user->id)->pluck('id');

            $prochainsCours = EmploiTemps::with(['cours', 'classe'])
                ->whereIn('cours_id', $mesCours)
                ->orderBy('jour')
                ->orderBy('heure_debut')
                ->take(10)
                ->get()
                ->map(function ($emploi) {
                    return [
                        'id' => $emploi->id,
                        'cours' => $emploi->cours->nom,
                        'classe' => $emploi->classe->nom,
                        'jour' => $emploi->jour,
                        'heure_debut' => $emploi->heure_debut,
                        'heure_fin' => $emploi->heure_fin,
                    ];
                });

            return response()->json($prochainsCours);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération de l\'emploi du temps',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mes classes et étudiants
     */
    public function getTeacherClasses(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || $user->role !== 'enseignant') {
                return response()->json([
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            $mesCours = Cours::where('enseignant_id', $user->id)->pluck('id');

            $classesIds = EmploiTemps::whereIn('cours_id', $mesCours)
                ->distinct()
                ->pluck('classe_id');

            $mesClasses = Classe::with(['filiere', 'niveau', 'etudiants'])
                ->whereIn('id', $classesIds)
                ->get()
                ->map(function ($classe) {
                    return [
                        'id' => $classe->id,
                        'nom' => $classe->nom,
                        'filiere' => $classe->filiere->nom ?? null,
                        'niveau' => $classe->niveau->nom ?? null,
                        'effectif' => $classe->etudiants->count(),
                    ];
                });

            return response()->json($mesClasses);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des classes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Statistiques pour le dashboard étudiant
     */
    public function getStudentStats(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || $user->role !== 'etudiant') {
                return response()->json([
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Récupérer la classe de l'étudiant
            $classe = $user->classe;

            if (!$classe) {
                return response()->json([
                    'mes_cours' => ['total' => 0, 'cette_semaine' => 0],
                    'ma_classe' => null,
                    'emplois_temps' => ['total' => 0, 'cette_semaine' => 0, 'aujourd_hui' => 0],
                    'mes_camarades' => 0,
                ]);
            }

            // Compter les emplois du temps de la classe
            $emploisTemps = EmploiTemps::where('classe_id', $classe->id);
            $emploisCetteSemaine = EmploiTemps::where('classe_id', $classe->id)
                ->whereBetween('date_debut', [now()->startOfWeek(), now()->endOfWeek()]);
            $emploisAujourdhui = EmploiTemps::where('classe_id', $classe->id)
                ->whereDate('date_debut', now());

            // Compter les cours distincts
            $coursIds = $emploisTemps->distinct()->pluck('cours_id');

            $stats = [
                'mes_cours' => [
                    'total' => $coursIds->count(),
                    'cette_semaine' => $emploisCetteSemaine->distinct('cours_id')->count(),
                ],
                'ma_classe' => [
                    'nom' => $classe->nom,
                    'filiere' => $classe->filiere->nom ?? null,
                    'niveau' => $classe->niveau->nom ?? null,
                ],
                'emplois_temps' => [
                    'total' => $emploisTemps->count(),
                    'cette_semaine' => $emploisCetteSemaine->count(),
                    'aujourd_hui' => $emploisAujourdhui->count(),
                ],
                'mes_camarades' => User::where('role', 'etudiant')
                    ->where('classe_id', $classe->id)
                    ->where('id', '!=', $user->id)
                    ->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Emploi du temps de l'étudiant
     */
    public function getStudentSchedule(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || $user->role !== 'etudiant') {
                return response()->json([
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            if (!$user->classe_id) {
                return response()->json([]);
            }

            $prochainsCours = EmploiTemps::with(['cours.enseignant', 'classe'])
                ->where('classe_id', $user->classe_id)
                ->whereDate('date_debut', '>=', now())
                ->orderBy('date_debut')
                ->take(10)
                ->get()
                ->map(function ($emploi) {
                    return [
                        'id' => $emploi->id,
                        'cours' => $emploi->cours->nom,
                        'enseignant' => $emploi->cours->enseignant 
                            ? ($emploi->cours->enseignant->prenom 
                                ? $emploi->cours->enseignant->prenom . ' ' . $emploi->cours->enseignant->nom 
                                : $emploi->cours->enseignant->nom)
                            : null,
                        'salle' => $emploi->salle,
                        'date_debut' => $emploi->date_debut,
                        'date_fin' => $emploi->date_fin,
                        'jour_semaine' => $emploi->jour_semaine,
                    ];
                });

            return response()->json($prochainsCours);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération de l\'emploi du temps',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste des cours de l'étudiant
     */
    public function getStudentCourses(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || $user->role !== 'etudiant') {
                return response()->json([
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            if (!$user->classe_id) {
                return response()->json([]);
            }

            // Récupérer les cours via les emplois du temps de la classe
            $coursIds = EmploiTemps::where('classe_id', $user->classe_id)
                ->distinct()
                ->pluck('cours_id');

            $mesCours = Cours::with(['enseignant'])
                ->whereIn('id', $coursIds)
                ->get()
                ->map(function ($cours) {
                    return [
                        'id' => $cours->id,
                        'nom' => $cours->nom,
                        'code' => $cours->code ?? 'N/A',
                        'description' => $cours->description,
                        'credits' => $cours->credits ?? 0,
                        'heures' => $cours->heures ?? 0,
                        'enseignant' => $cours->enseignant 
                            ? ($cours->enseignant->prenom 
                                ? $cours->enseignant->prenom . ' ' . $cours->enseignant->nom 
                                : $cours->enseignant->nom)
                            : null,
                    ];
                });

            return response()->json($mesCours);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculer la croissance par rapport au mois précédent
     */
    private function calculateGrowth(string $table, ?string $role = null): string
    {
        try {
            $currentMonth = now()->startOfMonth();
            $previousMonth = now()->subMonth()->startOfMonth();

            $query = DB::table($table)
                ->where('created_at', '>=', $currentMonth);

            if ($role) {
                $query->where('role', $role);
            }

            $currentCount = $query->count();

            $prevQuery = DB::table($table)
                ->whereBetween('created_at', [$previousMonth, $currentMonth]);

            if ($role) {
                $prevQuery->where('role', $role);
            }

            $previousCount = $prevQuery->count();

            if ($previousCount == 0) {
                return $currentCount > 0 ? '+100%' : '0%';
            }

            $growth = (($currentCount - $previousCount) / $previousCount) * 100;
            $sign = $growth >= 0 ? '+' : '';
            
            return $sign . round($growth) . '%';
        } catch (\Exception $e) {
            return '0%';
        }
    }

    /**
     * Obtenir le temps écoulé depuis une date
     */
    private function getTimeAgo($date): string
    {
        $diff = now()->diffInMinutes($date);

        if ($diff < 1) return "À l'instant";
        if ($diff < 60) return $diff . ' min';
        if ($diff < 1440) return round($diff / 60) . 'h';
        if ($diff < 10080) return round($diff / 1440) . 'j';
        
        return $date->format('d/m/Y');
    }

    /**
     * Obtenir le label du rôle
     */
    private function getRoleLabel(string $role): string
    {
        $labels = [
            'etudiant' => 'Étudiant',
            'enseignant' => 'Enseignant',
            'admin' => 'Administrateur',
        ];

        return $labels[$role] ?? $role;
    }

    /**
     * Obtenir l'avatar du rôle
     */
    private function getRoleAvatar(string $role): string
    {
        $avatars = [
            'etudiant' => '👩‍🎓',
            'enseignant' => '👨‍🏫',
            'admin' => '⚙️',
        ];

        return $avatars[$role] ?? '👤';
    }
}
