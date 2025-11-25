<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== TEST TYPE DES NOTES ===\n\n";

$note = App\Models\Note::with('cours')->first();

if ($note) {
    echo "Note brute: ";
    var_dump($note->note);
    echo "\nType: " . gettype($note->note) . "\n";
    echo "\nCoefficient brute: ";
    var_dump($note->coefficient);
    echo "\nType: " . gettype($note->coefficient) . "\n";
    echo "\nJSON:\n";
    echo json_encode($note, JSON_PRETTY_PRINT) . "\n";
} else {
    echo "Aucune note trouvée\n";
}
