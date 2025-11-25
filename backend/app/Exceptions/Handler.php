<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Auth\AuthenticationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // Gérer les erreurs d'authentification
        $this->renderable(function (AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non authentifié. Veuillez vous connecter.'
                ], 401);
            }
        });

        // Gérer les erreurs de validation
        $this->renderable(function (ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $e->errors()
                ], 422);
            }
        });

        // Gérer les erreurs 404 (modèle non trouvé)
        $this->renderable(function (ModelNotFoundException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ressource non trouvée'
                ], 404);
            }
        });

        // Gérer les erreurs 404 (route non trouvée)
        $this->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Route non trouvée'
                ], 404);
            }
        });

        // Gérer les erreurs de méthode non autorisée (405)
        $this->renderable(function (MethodNotAllowedHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Méthode HTTP non autorisée'
                ], 405);
            }
        });

        // Gérer toutes les autres erreurs serveur
        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*') && !($e instanceof AuthenticationException) 
                && !($e instanceof ValidationException) 
                && !($e instanceof ModelNotFoundException) 
                && !($e instanceof NotFoundHttpException) 
                && !($e instanceof MethodNotAllowedHttpException)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur serveur',
                    'error' => config('app.debug') ? $e->getMessage() : 'Une erreur est survenue'
                ], 500);
            }
        });
    }
}