<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EmploiTemps;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EmploiTempsController extends Controller
{
    /**
     * Afficher tous les emplois du temps
     */
public function index(Request $request): JsonResponse
{
    $user = $request->user();
    $query = EmploiTemps::with(['cours', 'classe']);
    
    // Si l'utilisateur est un étudiant, filtrer automatiquement par sa classe
    if ($user->role === 'etudiant' && $user->classe_id) {
        $query->where('classe_id', $user->classe_id);
    }
    // Si l'utilisateur est un enseignant, filtrer par ses cours
    elseif ($user->role === 'enseignant') {
        $query->whereHas('cours', function($q) use ($user) {
            $q->where('enseignant_id', $user->id);
        });
    }
    // Si admin, vérifier s'il y a un filtre de classe demandé
    elseif ($request->has('classe_id')) {
        $query->where('classe_id', $request->classe_id);
    }
    
    $emplois = $query->orderBy('jour')->orderBy('heure_debut')->get();
    
    return response()->json([
        'success' => true,
        'data' => $emplois
    ], 200);
}

    /**
     * Créer un nouvel emploi du temps
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'jour' => 'required|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'cours_id' => 'required|exists:cours,id',
            'classe_id' => 'required|exists:classes,id',
            'salle' => 'nullable|string',
            'statut' => 'nullable|in:planifie,en_cours,termine,annule',
        ]);

        $emploi = EmploiTemps::create($validated);
        $emploi->load(['cours', 'classe']);

        return response()->json([
            'success' => true,
            'message' => 'Emploi du temps créé avec succès',
            'data' => $emploi
        ], 201);
    }

    /**
     * Afficher un emploi du temps spécifique
     */
    public function show(string $id): JsonResponse
    {
        $emploi = EmploiTemps::with(['cours.enseignant', 'classe'])->find($id);

        if (!$emploi) {
            return response()->json([
                'success' => false,
                'message' => 'Emploi du temps non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $emploi
        ], 200);
    }

    /**
     * Mettre à jour un emploi du temps
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $emploi = EmploiTemps::find($id);

        if (!$emploi) {
            return response()->json([
                'success' => false,
                'message' => 'Emploi du temps non trouvé'
            ], 404);
        }

        $validated = $request->validate([
            'code' => 'sometimes|required|string|unique:emplois_temps,code,' . $id,
            'jour' => 'sometimes|required|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'heure_debut' => 'sometimes|required|date_format:H:i',
            'heure_fin' => 'sometimes|required|date_format:H:i|after:heure_debut',
            'cours_id' => 'sometimes|required|exists:cours,id',
            'classe_id' => 'sometimes|required|exists:classes,id',
            'enseignant_id' => 'sometimes|required|exists:users,id',
            'salle' => 'nullable|string',
            'type' => 'sometimes|required|in:CM,TD,TP',
            'statut' => 'nullable|in:planifie,en_cours,termine,annule',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'observations' => 'nullable|string',
        ]);

        $emploi->update($validated);
        $emploi->load(['cours', 'classe', 'enseignant']);

        return response()->json([
            'success' => true,
            'message' => 'Emploi du temps mis à jour avec succès',
            'data' => $emploi
        ], 200);
    }

    /**
     * Supprimer un emploi du temps
     */
    public function destroy(string $id): JsonResponse
    {
        $emploi = EmploiTemps::find($id);

        if (!$emploi) {
            return response()->json([
                'success' => false,
                'message' => 'Emploi du temps non trouvé'
            ], 404);
        }

        $emploi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Emploi du temps supprimé avec succès'
        ], 200);
    }
}