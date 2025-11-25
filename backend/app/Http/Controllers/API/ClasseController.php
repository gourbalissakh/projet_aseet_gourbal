<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClasseController extends Controller
{
    /**
     * Afficher toutes les classes
     */
public function index(): JsonResponse
{
    $classes = Classe::with(['niveau', 'filiere'])->get();
    
    return response()->json([
        'success' => true,
        'data' => $classes
    ], 200);
}
    /**
     * Créer une nouvelle classe
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|unique:classes',
            'filiere_id' => 'required|exists:filieres,id',
            'niveau_id' => 'required|exists:niveaux,id',
            'annee_academique' => 'nullable|string',
            'capacite_max' => 'nullable|integer'
        ]);

        $classe = Classe::create($validated);
        $classe->load(['niveau', 'filiere', 'responsable']);

        return response()->json([
            'success' => true,
            'message' => 'Classe créée avec succès',
            'data' => $classe
        ], 201);
    }

    /**
     * Afficher une classe spécifique
     */
    public function show(string $id): JsonResponse
    {
        $classe = Classe::with(['niveau', 'filiere', 'responsable', 'cours', 'emplois', 'etudiants'])->find($id);

        if (!$classe) {
            return response()->json([
                'success' => false,
                'message' => 'Classe non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $classe
        ], 200);
    }

    /**
     * Mettre à jour une classe
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json([
                'success' => false,
                'message' => 'Classe non trouvée'
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|unique:classes,code,' . $id,
            'filiere_id' => 'sometimes|required|exists:filieres,id',
            'niveau_id' => 'sometimes|required|exists:niveaux,id',
            'capacite' => 'nullable|integer',
            'effectif' => 'nullable|integer',
            'responsable_id' => 'nullable|exists:users,id',
            'salle_principale' => 'nullable|string',
            'statut' => 'nullable|in:active,inactive'
        ]);

        $classe->update($validated);
        $classe->load(['niveau', 'filiere', 'responsable']);

        return response()->json([
            'success' => true,
            'message' => 'Classe mise à jour avec succès',
            'data' => $classe
        ], 200);
    }

    /**
     * Supprimer une classe
     */
    public function destroy(string $id): JsonResponse
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json([
                'success' => false,
                'message' => 'Classe non trouvée'
            ], 404);
        }

        $classe->delete();

        return response()->json([
            'success' => true,
            'message' => 'Classe supprimée avec succès'
        ], 200);
    }
}