<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== CREDENTIALS ÉTUDIANTS ===\n\n";

$etudiants = App\Models\User::where('role', 'etudiant')
    ->with('classe')
    ->take(5)
    ->get();

foreach ($etudiants as $etudiant) {
    echo "Email: " . $etudiant->email . "\n";
    echo "Matricule: " . $etudiant->matricule . "\n";
    echo "Nom: " . $etudiant->prenom . " " . $etudiant->nom . "\n";
    echo "Classe: " . ($etudiant->classe ? $etudiant->classe->nom : 'N/A') . "\n";
    echo "Mot de passe: password\n";
    echo "---\n\n";
}
