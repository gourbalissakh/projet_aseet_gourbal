<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CoursController extends Controller
{
    /**
     * Afficher tous les cours
     */
 public function index(): JsonResponse
{
    $cours = Cours::with(['classe', 'enseignant'])->get();
    
    return response()->json([
        'success' => true,
        'data' => $cours
    ], 200);
}

    /**
     * Créer un nouveau cours
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|unique:cours',
            'description' => 'nullable|string',
            'credits' => 'required|integer',
            'volume_horaire' => 'required|integer',
            'classe_id' => 'required|exists:classes,id',
            'enseignant_id' => 'required|exists:users,id'
        ]);

        $cours = Cours::create($validated);
        $cours->load(['classe', 'enseignant']);

        return response()->json([
            'success' => true,
            'message' => 'Cours créé avec succès',
            'data' => $cours
        ], 201);
    }

    /**
     * Afficher un cours spécifique
     */
    public function show(string $id): JsonResponse
    {
        $cours = Cours::with(['classe', 'enseignant'])->find($id);

        if (!$cours) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $cours
        ], 200);
    }

    /**
     * Mettre à jour un cours
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $cours = Cours::find($id);

        if (!$cours) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|unique:cours,code,' . $id,
            'description' => 'nullable|string',
            'coefficient' => 'sometimes|required|integer',
            'credits' => 'sometimes|required|integer',
            'heures_cm' => 'sometimes|required|integer',
            'heures_td' => 'sometimes|required|integer',
            'heures_tp' => 'sometimes|required|integer',
            'niveau_id' => 'sometimes|required|exists:niveaux,id',
            'semestre' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:obligatoire,optionnel',
            'enseignant_id' => 'sometimes|required|exists:users,id',
            'statut' => 'nullable|in:actif,inactif',
            'classes' => 'nullable|array',
            'classes.*' => 'exists:classes,id'
        ]);

        $classesIds = $validated['classes'] ?? null;
        unset($validated['classes']);

        $cours->update($validated);
        
        if ($classesIds !== null) {
            $cours->classes()->sync($classesIds);
        }
        
        $cours->load(['classes', 'enseignant', 'niveau']);

        return response()->json([
            'success' => true,
            'message' => 'Cours mis à jour avec succès',
            'data' => $cours
        ], 200);
    }

    /**
     * Supprimer un cours
     */
    public function destroy(string $id): JsonResponse
    {
        $cours = Cours::find($id);

        if (!$cours) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé'
            ], 404);
        }

        $cours->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cours supprimé avec succès'
        ], 200);
    }
}