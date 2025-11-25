# Structure Relationnelle - AKHOUYE ACADEMIE

## Modèle de Données

### Relations Principales

#### 1. **Filière → Niveaux** (1..N)
- Une filière contient plusieurs niveaux
- Exemple : Filière "Informatique" → Niveaux: L1, L2, L3, M1, M2

#### 2. **Niveau → Classes** (1..N)
- Un niveau contient plusieurs classes
- Exemple : Niveau "L3" → Classes: L3-Info-A, L3-Info-B

#### 3. **Classe → Étudiants** (1..N)
- Une classe contient plusieurs étudiants
- Un étudiant appartient à une seule classe (N..1)
- Exemple : Classe "L3-Info-A" → 30 étudiants

#### 4. **Enseignant → Cours** (1..N)
- Un enseignant dispense plusieurs cours
- Exemple : Prof. Diop → Mathématiques, Statistiques

#### 5. **Classe ↔ Cours** (N..N)
- Une classe suit plusieurs cours
- Un cours est suivi par plusieurs classes
- Exemple : 
  - Classe "L3-Info-A" → Cours: Math, BDD, Algo
  - Cours "Math" → Classes: L3-Info-A, L3-Info-B

#### 6. **Emploi du Temps**
- Une classe possède plusieurs séances EDT (1..N)
- Un cours peut apparaître dans plusieurs séances (1..N)
- Chaque séance comprend : Cours, Classe, Enseignant, Horaire, Salle

## Structure des Formulaires

### 1. **Inscription Étudiant**
```
Champs requis:
- Nom
- Prénom
- Email
- Mot de passe
- Classe (sélection depuis la liste des classes disponibles)
  └─ Affiche automatiquement la filière et le niveau
```

### 2. **Création Enseignant**
```
Champs requis:
- Nom
- Prénom
- Email
- Mot de passe
- Spécialité (optionnel)
```

### 3. **Création Cours**
```
Champs requis:
- Nom du cours
- Code du cours
- Description
- Crédits
- Enseignant (liste déroulante des enseignants)
- Classes concernées (sélection multiple)
```

### 4. **Création Classe**
```
Champs requis:
- Nom de la classe
- Filière (liste déroulante)
- Niveau (liste déroulante filtrée par filière)
- Capacité maximale
```

### 5. **Emploi du Temps**
```
Champs requis:
- Classe
- Cours (depuis les cours assignés à cette classe)
- Jour
- Heure début
- Heure fin
- Salle
- Enseignant (automatique selon le cours)
```

## Règles de Gestion

1. **Suppression en cascade** :
   - Supprimer une filière → affecte ses niveaux
   - Supprimer un niveau → affecte ses classes
   - Supprimer une classe → libère les étudiants
   - Supprimer un enseignant → réassigner ses cours

2. **Validation** :
   - Un étudiant doit avoir une classe
   - Un cours doit avoir un enseignant
   - Une classe doit avoir une filière ET un niveau
   - Un emploi du temps ne peut pas avoir de chevauchement

3. **Affichage** :
   - Filières : Afficher le nombre de niveaux
   - Niveaux : Afficher le nombre de classes
   - Classes : Afficher filière, niveau et nombre d'étudiants
   - Cours : Afficher l'enseignant responsable
   - Enseignants : Afficher le nombre de cours
