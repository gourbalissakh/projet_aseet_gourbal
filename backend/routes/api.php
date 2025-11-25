<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ClasseController;
use App\Http\Controllers\API\CoursController;
use App\Http\Controllers\API\EmploiTempsController;
use App\Http\Controllers\API\FiliereController;
use App\Http\Controllers\API\NiveauController;

/*
|--------------------------------------------------------------------------
| Routes publiques (sans authentification)
|--------------------------------------------------------------------------
*/

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Route de test (À SUPPRIMER EN PRODUCTION)
Route::get('test/users', function() {
    return response()->json([
        'total' => \App\Models\User::count(),
        'etudiants' => \App\Models\User::where('role', 'etudiant')->count(),
        'enseignants' => \App\Models\User::where('role', 'enseignant')->count(),
        'admins' => \App\Models\User::where('role', 'admin')->count(),
        'sample_etudiant' => \App\Models\User::where('role', 'etudiant')->first(),
        'sample_enseignant' => \App\Models\User::where('role', 'enseignant')->first(),
    ]);
});

/*
|--------------------------------------------------------------------------
| Routes protégées (nécessitent authentification)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
    
    // Dashboard stats
    Route::get('dashboard/stats', function() {
        return response()->json([
            'etudiants' => \App\Models\User::where('role', 'etudiant')->count(),
            'enseignants' => \App\Models\User::where('role', 'enseignant')->count(),
            'cours' => \App\Models\Cours::count(),
            'classes' => \App\Models\Classe::count(),
        ]);
    });
    
    // Resources
    Route::apiResource('users', UserController::class);
    Route::get('users/role/{role}', [UserController::class, 'getByRole']);
    Route::apiResource('classes', ClasseController::class);
    Route::apiResource('cours', CoursController::class);
    Route::apiResource('emplois-temps', EmploiTempsController::class);
    Route::apiResource('filieres', FiliereController::class);
    Route::apiResource('niveaux', NiveauController::class);
});