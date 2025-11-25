# 📊 Nouvelle Structure de Base de Données Normalisée - AKHOUYE ACADEMIE

## 🎯 Objectif
Cette structure suit les standards d'un vrai SIGU (Système Intégré de Gestion Universitaire) comme **Kairos ESTM**, avec une normalisation complète et des données réalistes.

---

## 📋 Tables et Champs

### 1. **users** - Utilisateurs (Étudiants, Enseignants, Admins)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt | Identifiant unique |
| `nom` | String | Nom de famille |
| `prenom` | String | Prénom |
| `email` | String | Email unique |
| `password` | String | Mot de passe hashé |
| `role` | Enum | etudiant, enseignant, admin |
| `classe_id` | Foreign | Classe de l'étudiant (nullable) |
| `matricule` | String | Matricule unique (ETU-2025-0001, ENS-2024-001, ADM-2024-001) |
| `telephone` | String | Numéro de téléphone |
| `date_naissance` | Date | Date de naissance |
| `lieu_naissance` | String | Lieu de naissance |
| `sexe` | Enum | M ou F |
| `adresse` | Text | Adresse complète |
| `statut` | Enum | actif, inactif, suspendu |
| `photo` | String | URL de la photo (nullable) |
| `tuteur_nom` | String | Nom du tuteur (pour étudiants) |
| `tuteur_telephone` | String | Téléphone du tuteur (pour étudiants) |
| `specialite` | String | Spécialité (pour enseignants) |
| `diplome` | String | Diplôme (pour enseignants) |

**Relations:**
- `classe` → belongsTo Classe
- `coursEnseignes` → hasMany Cours
- `classesResponsable` → hasMany Classe
- `notes` → hasMany Note
- `emplois` → hasMany EmploiTemps

---

### 2. **filieres** - Filières d'études

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt | Identifiant unique |
| `nom` | String | Nom de la filière (Informatique, Mathématiques, etc.) |

**Relations:**
- `classes` → hasMany Classe

---

### 3. **niveaux** - Niveaux d'études

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt | Identifiant unique |
| `nom` | String | Nom du niveau (Licence 1, Licence 2, etc.) |

**Relations:**
- `classes` → hasMany Classe
- `cours` → hasMany Cours

---

### 4. **classes** - Classes

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt | Identifiant unique |
| `nom` | String | Nom complet (Licence 3 Informatique - Groupe A) |
| `code` | String | Code unique (CL-2025-001) |
| `filiere_id` | Foreign | Filière de la classe |
| `niveau_id` | Foreign | Niveau de la classe |
| `capacite` | Integer | Capacité maximale (40-60) |
| `effectif` | Integer | Nombre actuel d'étudiants |
| `responsable_id` | Foreign | Enseignant responsable (nullable) |
| `salle_principale` | String | Salle attitrée (nullable) |
| `statut` | Enum | active, inactive |

**Relations:**
- `niveau` → belongsTo Niveau
- `filiere` → belongsTo Filiere
- `responsable` → belongsTo User
- `cours` → belongsToMany Cours (via classe_cours)
- `etudiants` → hasMany User
- `emplois` → hasMany EmploiTemps

---

### 5. **cours** - Cours

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt | Identifiant unique |
| `nom` | String | Nom du cours |
| `code` | String | Code unique (PWEB-N1, BDD-N2) |
| `description` | Text | Description complète |
| `coefficient` | Integer | Coefficient (1-4) |
| `credits` | Integer | Crédits ECTS (2-6) |
| `heures_cm` | Integer | Heures de Cours Magistral |
| `heures_td` | Integer | Heures de Travaux Dirigés |
| `heures_tp` | Integer | Heures de Travaux Pratiques |
| `niveau_id` | Foreign | Niveau du cours |
| `semestre` | String | Semestre (S1, S2) |
| `type` | Enum | obligatoire, optionnel |
| `enseignant_id` | Foreign | Enseignant responsable |
| `statut` | Enum | actif, inactif |

**Relations:**
- `enseignant` → belongsTo User
- `niveau` → belongsTo Niveau
- `classes` → belongsToMany Classe (via classe_cours)
- `emplois` → hasMany EmploiTemps
- `notes` → hasMany Note

---

### 6. **classe_cours** - Table pivot Classe-Cours (N:N)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt | Identifiant unique |
| `classe_id` | Foreign | Référence à la classe |
| `cours_id` | Foreign | Référence au cours |

**But:** Un cours peut être enseigné à plusieurs classes, et une classe peut avoir plusieurs cours.

---

### 7. **emplois_temps** - Emplois du temps

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt | Identifiant unique |
| `code` | String | Code unique de la séance (ET-2025-0001) |
| `cours_id` | Foreign | Cours concerné |
| `classe_id` | Foreign | Classe concernée |
| `enseignant_id` | Foreign | Enseignant assigné |
| `salle` | String | Salle où se déroule le cours (nullable) |
| `jour` | String | Jour de la semaine |
| `heure_debut` | Time | Heure de début |
| `heure_fin` | Time | Heure de fin |
| `type` | Enum | CM, TD, TP |
| `statut` | Enum | planifie, en_cours, termine, annule |
| `date_debut` | Date | Date de début de la période |
| `date_fin` | Date | Date de fin de la période |
| `observations` | Text | Observations (nullable) |

**Relations:**
- `cours` → belongsTo Cours
- `classe` → belongsTo Classe
- `enseignant` → belongsTo User

**Index:** `(jour, heure_debut)`, `(classe_id, jour)`, `(enseignant_id, jour)`

---

### 8. **notes** - Notes des étudiants

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt | Identifiant unique |
| `etudiant_id` | Foreign | Étudiant concerné |
| `cours_id` | Foreign | Cours concerné |
| `session` | String | Session (Normale, Rattrapage) |
| `semestre` | String | Semestre (S1, S2) |
| `annee_academique` | Integer | Année académique (2024, 2025) |
| `note_cc` | Decimal(5,2) | Note de Contrôle Continu (nullable) |
| `note_tp` | Decimal(5,2) | Note de Travaux Pratiques (nullable) |
| `note_examen` | Decimal(5,2) | Note d'Examen (nullable) |
| `note_finale` | Decimal(5,2) | Moyenne finale calculée (nullable) |
| `est_valide` | Boolean | Si l'étudiant a validé (default: false) |
| `mention` | Enum | Excellent, Très Bien, Bien, Assez Bien, Passable, Ajourné (nullable) |
| `commentaire` | Text | Commentaire (nullable) |
| `saisi_par` | Foreign | Enseignant qui a saisi la note (nullable) |
| `date_saisie` | Timestamp | Date de saisie (nullable) |

**Relations:**
- `etudiant` → belongsTo User
- `cours` → belongsTo Cours
- `saisie_par` → belongsTo User

**Index:** `(etudiant_id, cours_id, session)`, `annee_academique`

**Contrainte:** UNIQUE `(etudiant_id, cours_id, session, annee_academique)`

---

## 🎓 Données Générées par les Seeders

### Statistiques
- **5 Filières:** Informatique, Mathématiques, Physique, Chimie, Biologie
- **3 Niveaux:** Licence 1, Licence 2, Licence 3
- **27 Classes:** 3 groupes × 3 filières × 3 niveaux
- **59 Utilisateurs:**
  - 1 Admin (admin@akhouye.com)
  - 8 Enseignants avec spécialités
  - 50 Étudiants répartis dans les classes
- **30 Cours:** 10 matières × 3 niveaux
- **40 Séances d'emploi du temps**

### Exemples de Cours
- Programmation Web (4 coef, 6 crédits, 30h CM + 20h TD + 20h TP)
- Base de Données (4 coef, 6 crédits)
- Intelligence Artificielle (4 coef, 6 crédits)
- Génie Logiciel (3 coef, 5 crédits)
- Sécurité Informatique (2 coef, 4 crédits - optionnel)

### Matricules Générés
- **Étudiants:** ETU-2025-0001 → ETU-2025-0050
- **Enseignants:** ENS-2024-001 → ENS-2024-008
- **Admin:** ADM-2024-001

---

## 🔄 Changements Majeurs par Rapport à l'Ancienne Structure

### 1. **Table Users**
**Avant:** nom, prenom, email, password, role, classe_id
**Après:** + matricule, telephone, date_naissance, lieu_naissance, sexe, adresse, statut, photo, tuteur_nom, tuteur_telephone, specialite, diplome

### 2. **Table Classes**
**Avant:** nom, niveau_id
**Après:** + code, filiere_id, capacite, effectif, responsable_id, salle_principale, statut

### 3. **Table Cours**
**Avant:** nom, description, classe_id, enseignant_id
**Après:** + code, coefficient, credits, heures_cm, heures_td, heures_tp, niveau_id, semestre, type, statut
**Changement majeur:** Relation N:N avec classes (plus de classe_id direct)

### 4. **Table EmploiTemps**
**Avant:** jour, heure_debut, heure_fin, cours_id, classe_id
**Après:** + code, enseignant_id, salle, type, statut, date_debut, date_fin, observations + index optimisés

### 5. **Table Notes**
**Avant:** etudiant_id, cours_id, note, type, commentaire
**Après:** + session, semestre, annee_academique, note_cc, note_tp, note_examen, note_finale, est_valide, mention, saisi_par, date_saisie + contrainte unique

---

## ✅ Avantages de la Nouvelle Structure

1. **Conformité SIGU:** Structure identique aux vrais systèmes universitaires
2. **Normalisation:** Séparation claire des entités, pas de redondance
3. **Flexibilité:** Relation N:N pour cours-classes
4. **Traçabilité:** Matricules uniques, dates de saisie, historique
5. **Réalisme:** Données sénégalaises authentiques
6. **Extensibilité:** Facile d'ajouter de nouvelles fonctionnalités
7. **Performance:** Index optimisés sur les recherches fréquentes

---

## 🚀 Commandes pour Réinitialiser

```bash
# Recréer toute la base de données avec données
php artisan migrate:fresh --seed

# Seulement les migrations
php artisan migrate:fresh

# Ajouter seulement les seeders
php artisan db:seed
```

---

**Date de création:** 24 Novembre 2025  
**Auteur:** AKHOUYE ACADEMIE - Projet Asset Gourbal  
**Version:** 2.0 - Structure Normalisée
