<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NiveauController extends Controller
{
    /**
     * Afficher tous les niveaux
     */
 public function index(): JsonResponse
{
    $niveaux = Niveau::orderBy('ordre')->get();
    
    return response()->json([
        'success' => true,
        'data' => $niveaux
    ], 200);
}

    /**
     * Créer un nouveau niveau
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:niveaux,code',
            'nom' => 'required|string|max:255',
            'ordre' => 'required|integer'
        ]);

        $niveau = Niveau::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Niveau créé avec succès',
            'data' => $niveau
        ], 201);
    }

    /**
     * Afficher un niveau spécifique
     */
    public function show(string $id): JsonResponse
    {
        $niveau = Niveau::with('classes')->find($id);

        if (!$niveau) {
            return response()->json([
                'success' => false,
                'message' => 'Niveau non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $niveau
        ], 200);
    }

    /**
     * Mettre à jour un niveau
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $niveau = Niveau::find($id);

        if (!$niveau) {
            return response()->json([
                'success' => false,
                'message' => 'Niveau non trouvé'
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'filiere_id' => 'sometimes|required|exists:filieres,id'
        ]);

        $niveau->update($validated);
        $niveau->load('filiere');

        return response()->json([
            'success' => true,
            'message' => 'Niveau mis à jour avec succès',
            'data' => $niveau
        ], 200);
    }

    /**
     * Supprimer un niveau
     */
    public function destroy(string $id): JsonResponse
    {
        $niveau = Niveau::find($id);

        if (!$niveau) {
            return response()->json([
                'success' => false,
                'message' => 'Niveau non trouvé'
            ], 404);
        }

        $niveau->delete();

        return response()->json([
            'success' => true,
            'message' => 'Niveau supprimé avec succès'
        ], 200);
    }
}