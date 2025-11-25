<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NoteController extends Controller
{
    /**
     * Afficher toutes les notes
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Si l'utilisateur est un étudiant, afficher uniquement ses notes
        if ($user->role === 'etudiant') {
            $notes = Note::with(['cours'])
                ->where('etudiant_id', $user->id)
                ->orderBy('date_evaluation', 'desc')
                ->get();
        } 
        // Si l'utilisateur est un enseignant, afficher les notes de ses cours
        elseif ($user->role === 'enseignant') {
            $notes = Note::with(['cours', 'etudiant'])
                ->whereHas('cours', function($query) use ($user) {
                    $query->where('enseignant_id', $user->id);
                })
                ->orderBy('date_evaluation', 'desc')
                ->get();
        }
        // Si l'utilisateur est un admin, afficher toutes les notes
        else {
            $notes = Note::with(['cours', 'etudiant'])
                ->orderBy('date_evaluation', 'desc')
                ->get();
        }
        
        return response()->json([
            'success' => true,
            'data' => $notes
        ], 200);
    }

    /**
     * Créer une nouvelle note
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'etudiant_id' => 'required|exists:users,id',
            'cours_id' => 'required|exists:cours,id',
            'note' => 'required|numeric|min:0|max:20',
            'coefficient' => 'required|numeric|min:1',
            'type_evaluation' => 'required|string|in:Devoir,Examen,TP,TD,Contrôle Continu,Projet',
            'date_evaluation' => 'required|date',
            'semestre' => 'required|integer|in:1,2'
        ]);

        $note = Note::create($validated);
        $note->load(['cours', 'etudiant']);

        return response()->json([
            'success' => true,
            'message' => 'Note créée avec succès',
            'data' => $note
        ], 201);
    }

    /**
     * Afficher une note spécifique
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $note = Note::with(['cours', 'etudiant'])->findOrFail($id);
        
        // Vérifier les permissions
        if ($user->role === 'etudiant' && $note->etudiant_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }
        
        return response()->json([
            'success' => true,
            'data' => $note
        ], 200);
    }

    /**
     * Mettre à jour une note
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $note = Note::findOrFail($id);

        $validated = $request->validate([
            'note' => 'sometimes|numeric|min:0|max:20',
            'coefficient' => 'sometimes|numeric|min:1',
            'type_evaluation' => 'sometimes|string|in:Devoir,Examen,TP,TD,Contrôle Continu,Projet',
            'date_evaluation' => 'sometimes|date',
            'semestre' => 'sometimes|integer|in:1,2'
        ]);

        $note->update($validated);
        $note->load(['cours', 'etudiant']);

        return response()->json([
            'success' => true,
            'message' => 'Note mise à jour avec succès',
            'data' => $note
        ], 200);
    }

    /**
     * Supprimer une note
     */
    public function destroy(string $id): JsonResponse
    {
        $note = Note::findOrFail($id);
        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Note supprimée avec succès'
        ], 200);
    }

    /**
     * Obtenir les statistiques de notes d'un étudiant
     */
    public function statistiques(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if ($user->role !== 'etudiant') {
            return response()->json([
                'success' => false,
                'message' => 'Cette fonctionnalité est réservée aux étudiants'
            ], 403);
        }

        $notes = Note::where('etudiant_id', $user->id)->get();

        if ($notes->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [
                    'moyenne_generale' => 0,
                    'total_notes' => 0,
                    'notes_par_semestre' => []
                ]
            ], 200);
        }

        // Calculer la moyenne générale
        $moyenneGenerale = $notes->sum(function($note) {
            return $note->note * $note->coefficient;
        }) / $notes->sum('coefficient');

        // Notes par semestre
        $notesParSemestre = $notes->groupBy('semestre')->map(function($notesSemestre) {
            $moyenne = $notesSemestre->sum(function($note) {
                return $note->note * $note->coefficient;
            }) / $notesSemestre->sum('coefficient');
            
            return [
                'moyenne' => round($moyenne, 2),
                'nombre_notes' => $notesSemestre->count()
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'moyenne_generale' => round($moyenneGenerale, 2),
                'total_notes' => $notes->count(),
                'notes_par_semestre' => $notesParSemestre
            ]
        ], 200);
    }
}
