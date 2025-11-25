<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FiliereController extends Controller
{
/**
 * Afficher toutes les filières
 */
public function index(): JsonResponse
{
    $filieres = Filiere::all();
    
    return response()->json([
        'success' => true,
        'data' => $filieres
    ], 200);
}

    /**
     * Créer une nouvelle filière
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:filieres,code',
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $filiere = Filiere::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Filière créée avec succès',
            'data' => $filiere
        ], 201);
    }

    /**
     * Afficher une filière spécifique
     */
    public function show(string $id): JsonResponse
    {
        $filiere = Filiere::with('niveaux')->find($id);

        if (!$filiere) {
            return response()->json([
                'success' => false,
                'message' => 'Filière non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $filiere
        ], 200);
    }

    /**
     * Mettre à jour une filière
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $filiere = Filiere::find($id);

        if (!$filiere) {
            return response()->json([
                'success' => false,
                'message' => 'Filière non trouvée'
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:filieres,nom,' . $id
        ]);

        $filiere->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Filière mise à jour avec succès',
            'data' => $filiere
        ], 200);
    }

    /**
     * Supprimer une filière
     */
    public function destroy(string $id): JsonResponse
    {
        $filiere = Filiere::find($id);

        if (!$filiere) {
            return response()->json([
                'success' => false,
                'message' => 'Filière non trouvée'
            ], 404);
        }

        $filiere->delete();

        return response()->json([
            'success' => true,
            'message' => 'Filière supprimée avec succès'
        ], 200);
    }
}