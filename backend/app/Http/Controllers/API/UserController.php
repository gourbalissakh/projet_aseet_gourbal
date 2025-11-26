<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Afficher tous les utilisateurs
     */
public function index(Request $request): JsonResponse
{
    $query = User::with(['classe.niveau', 'classe.filiere', 'coursEnseignes']);
    
    // Filtrer par rôle si le paramètre est fourni
    if ($request->has('role')) {
        $query->where('role', $request->role);
    }
    
    $users = $query->paginate($request->input('per_page', 10));
    
    return response()->json([
        'success' => true,
        'data' => $users->items(),
        'pagination' => [
            'current_page' => $users->currentPage(),
            'total' => $users->total(),
            'per_page' => $users->perPage(),
            'last_page' => $users->lastPage()
        ]
    ], 200);
}

    /**
     * Créer un nouvel utilisateur
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,enseignant,etudiant',
            'classe_id' => 'nullable|exists:classes,id',
            'matricule' => 'nullable|string|unique:users',
            'telephone' => 'nullable|string',
            'date_naissance' => 'nullable|date',
            'lieu_naissance' => 'nullable|string',
            'sexe' => 'nullable|in:M,F',
            'adresse' => 'nullable|string',
            'statut' => 'nullable|in:actif,inactif,suspendu',
            'photo' => 'nullable|string',
            'tuteur_nom' => 'nullable|string',
            'tuteur_telephone' => 'nullable|string',
            'specialite' => 'nullable|string',
            'diplome' => 'nullable|string'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        $user->load(['classe.niveau', 'classe.filiere']);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès',
            'data' => $user
        ], 201);
    }

    /**
     * Afficher un utilisateur spécifique
     */
    public function show(string $id): JsonResponse
    {
        $user = User::with(['classe.niveau', 'classe.filiere', 'coursEnseignes', 'classesResponsable'])->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ], 200);
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'role' => 'sometimes|required|in:admin,enseignant,etudiant',
            'classe_id' => 'nullable|exists:classes,id',
            'matricule' => 'sometimes|string|unique:users,matricule,' . $id,
            'telephone' => 'nullable|string',
            'date_naissance' => 'nullable|date',
            'lieu_naissance' => 'nullable|string',
            'sexe' => 'nullable|in:M,F',
            'adresse' => 'nullable|string',
            'statut' => 'nullable|in:actif,inactif,suspendu',
            'photo' => 'nullable|string',
            'tuteur_nom' => 'nullable|string',
            'tuteur_telephone' => 'nullable|string',
            'specialite' => 'nullable|string',
            'diplome' => 'nullable|string'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        $user->load(['classe.niveau', 'classe.filiere']);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'data' => $user
        ], 200);
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy(string $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ], 200);
    }

    /**
     * Récupérer les utilisateurs par rôle
     */
    public function getByRole(string $role): JsonResponse
    {
        $users = User::where('role', $role)->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ], 200);
    }
}
