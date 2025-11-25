# 📊 Données de Test Complètes - AKHOUYE ACADEMIE

## 🎯 Vue d'Ensemble

Voici un récapitulatif complet des données générées dans la base de données normalisée.

---

## 📈 Statistiques Globales

| Entité | Nombre | Détails |
|--------|--------|---------|
| **Étudiants** | 150 | ETU-2025-0001 → ETU-2025-0150 |
| **Enseignants** | 15 | ENS-2024-001 → ENS-2024-015 |
| **Administrateurs** | 1 | ADM-2024-001 |
| **Filières** | 5 | Informatique, Mathématiques, Physique, Chimie, Biologie |
| **Niveaux** | 3 | Licence 1, Licence 2, Licence 3 |
| **Classes** | 27 | 3 groupes × 3 filières × 3 niveaux |
| **Cours** | 30 | 10 matières × 3 niveaux |
| **Emplois du Temps** | 100 | Séances réparties sur la semaine |
| **Notes** | ~1500+ | Notes complètes avec CC, TP, Examen |

---

## 👥 Utilisateurs

### Admin
- **Email:** admin@akhouye.com
- **Mot de passe:** password
- **Matricule:** ADM-2024-001
- **Nom:** GOURBAL Admin

### Enseignants (15 au total)

| Nom Complet | Email | Spécialité | Diplôme |
|-------------|-------|------------|---------|
| Amadou DIOP | amadou.diop@akhouye.com | Programmation Web | Doctorat en Informatique |
| Fatou NDIAYE | fatou.ndiaye@akhouye.com | Base de Données | Master en Informatique |
| Moussa FALL | moussa.fall@akhouye.com | Réseaux Informatiques | Doctorat en Réseaux |
| Aissatou SOW | aissatou.sow@akhouye.com | Intelligence Artificielle | Doctorat en IA |
| Ousmane BA | ousmane.ba@akhouye.com | Génie Logiciel | Master en GL |
| Khady SARR | khady.sarr@akhouye.com | Mathématiques Appliquées | Doctorat en Maths |
| Mamadou TOURE | mamadou.toure@akhouye.com | Sécurité Informatique | Master en Cybersécurité |
| Mariama SY | mariama.sy@akhouye.com | Algorithmes | Doctorat en Informatique |
| Ibrahima GUEYE | ibrahima.gueye@akhouye.com | Systèmes d'Exploitation | Master en Informatique |
| Awa MBAYE | awa.mbaye@akhouye.com | Développement Mobile | Master en Informatique |
| Cheikh DIOUF | cheikh.diouf@akhouye.com | Cloud Computing | Doctorat en Informatique |
| Aminata SECK | aminata.seck@akhouye.com | Data Science | Doctorat en Data Science |
| Malick CISSE | malick.cisse@akhouye.com | Architecture Logicielle | Master en GL |
| Bineta DIALLO | bineta.diallo@akhouye.com | Blockchain | Master en Informatique |
| Alioune WADE | alioune.wade@akhouye.com | Internet des Objets | Doctorat en Informatique |

**Mot de passe pour tous:** password

### Étudiants (150 au total)

**Format des emails:** `prenom.nom[numero]@akhouye.com`  
**Exemples:**
- ibrahima.diop1@akhouye.com
- fatou.ndiaye2@akhouye.com
- moussa.fall3@akhouye.com

**Caractéristiques:**
- Répartis équitablement dans les 27 classes
- Noms et prénoms sénégalais authentiques
- Dates de naissance: 2000-2005
- Lieux de naissance: Villes du Sénégal
- Informations de tuteur complètes
- Numéros de téléphone au format sénégalais (+221)

**Mot de passe pour tous:** password

---

## 🎓 Structure Académique

### Filières (5)
1. **Informatique** - Principal focus
2. **Mathématiques**
3. **Physique**
4. **Chimie**
5. **Biologie**

### Niveaux (3)
1. **Licence 1** (L1)
2. **Licence 2** (L2)
3. **Licence 3** (L3)

### Classes (27)

**Format:** `[Niveau] [Filière] - Groupe [A/B/C]`  
**Codes:** CL-2025-001 → CL-2025-027

**Exemples:**
- Licence 1 Informatique - Groupe A (Code: CL-2025-001)
- Licence 2 Mathématiques - Groupe B (Code: CL-2025-011)
- Licence 3 Physique - Groupe C (Code: CL-2025-021)

**Attributs de chaque classe:**
- Capacité: 40-60 étudiants
- Effectif actuel: 25-50 étudiants
- Salle principale: S101-S303, AMPHI-A/B
- Statut: Active

---

## 📚 Cours (30 au total - 10 matières × 3 niveaux)

### Liste des Matières

| Matière | Code Base | Coefficient | Crédits | Type | Semestre |
|---------|-----------|-------------|---------|------|----------|
| Programmation Web | PWEB | 4 | 6 | Obligatoire | S1 |
| Base de Données | BDD | 4 | 6 | Obligatoire | S1 |
| Algorithmique | ALGO | 3 | 5 | Obligatoire | S1 |
| Réseaux Informatiques | RESEAU | 3 | 5 | Obligatoire | S2 |
| Systèmes d'Exploitation | SE | 3 | 5 | Obligatoire | S1 |
| Intelligence Artificielle | IA | 4 | 6 | Obligatoire | S2 |
| Génie Logiciel | GL | 3 | 5 | Obligatoire | S2 |
| Sécurité Informatique | SECU | 2 | 4 | Optionnel | S2 |
| Mathématiques Appliquées | MATH | 2 | 4 | Obligatoire | S1 |
| Anglais Technique | ANG | 1 | 2 | Obligatoire | S1 |

**Format des codes:** `[CODE_BASE]-N[ID_NIVEAU]`  
**Exemples:**
- PWEB-N1 (Programmation Web - Licence 1)
- BDD-N2 (Base de Données - Licence 2)
- IA-N3 (Intelligence Artificielle - Licence 3)

**Répartition des heures:**
- **CM** (Cours Magistral): 15-30h
- **TD** (Travaux Dirigés): 15-25h
- **TP** (Travaux Pratiques): 0-25h

**Relation N:N avec Classes:**
- Chaque cours est enseigné à plusieurs classes du même niveau
- Table pivot `classe_cours` pour la liaison

---

## 📅 Emplois du Temps (100 séances)

**Jours:** Lundi, Mardi, Mercredi, Jeudi, Vendredi

**Horaires:**
- 08:00 - 10:00
- 10:00 - 12:00
- 14:00 - 16:00
- 16:00 - 18:00

**Salles:** S101, S102, S103, S201, S202, S203, AMPHI-A, AMPHI-B, LAB-INFO-1, LAB-INFO-2

**Types de séances:**
- **CM** - Cours Magistral
- **TD** - Travaux Dirigés
- **TP** - Travaux Pratiques

**Codes:** ET-2025-0001 → ET-2025-0100

**Attributs:**
- Enseignant assigné
- Période: Du 1er au 30 du mois en cours
- Statut: Planifié

---

## 📝 Notes (~1500+ notes)

### Structure de Notation

Pour chaque étudiant et chaque cours de sa classe:

**Session Normale:**
- **Note CC** (Contrôle Continu): 8-20
- **Note TP** (Travaux Pratiques): 8-20
- **Note Examen**: 8-20
- **Note Finale**: Calculée → (CC × 0.3) + (TP × 0.2) + (Examen × 0.5)

**Session Rattrapage** (20% des échecs):
- Mêmes composantes avec nouvel examen
- Commentaire: "Session de rattrapage"

### Mentions

| Note Finale | Mention |
|-------------|---------|
| ≥ 16 | Excellent |
| ≥ 14 | Très Bien |
| ≥ 12 | Bien |
| ≥ 10 | Assez Bien |
| ≥ 8 | Passable |
| < 8 | Ajourné |

**Validation:** `est_valide = true` si note_finale ≥ 10

**Traçabilité:**
- Saisi par: ID de l'enseignant du cours
- Date de saisie: Entre 1-30 jours avant aujourd'hui

**Année académique:** 2024

---

## 🔑 Accès au Système

### Dashboard Admin
- **URL:** http://localhost:5174/admin/dashboard
- **Login:** admin@akhouye.com
- **Password:** password

### Statistiques Affichées (API)
- **Endpoint:** `GET /api/dashboard/stats`
- **Authentification:** Bearer Token requis
- **Réponse:**
  ```json
  {
    "etudiants": 150,
    "enseignants": 15,
    "cours": 30,
    "classes": 27
  }
  ```

---

## 🚀 Commandes Utiles

### Réinitialiser les données
```bash
cd backend
php artisan migrate:fresh --seed
```

### Démarrer les serveurs
```bash
# Backend (Laravel)
cd backend
php artisan serve

# Frontend (React)
cd frontend
npm run dev
```

### Accéder à la base de données
```bash
cd backend
php artisan tinker

# Exemples de requêtes
User::count()
User::where('role', 'etudiant')->count()
Cours::with('enseignant')->first()
Note::where('est_valide', true)->count()
```

---

## 📊 Analyses Possibles

### Statistiques Étudiants
- Répartition par classe
- Taux de réussite par cours
- Moyennes générales
- Mentions obtenues

### Statistiques Enseignants
- Nombre de cours enseignés
- Nombre d'étudiants par enseignant
- Répartition des heures CM/TD/TP

### Statistiques Cours
- Taux de réussite par cours
- Moyennes par matière
- Cours les plus/moins réussis

### Emploi du Temps
- Occupation des salles
- Charge de travail enseignants
- Conflits d'horaires

---

## ✅ Validation des Données

**Tous les champs requis sont remplis:**
- ✅ Matricules uniques pour tous les utilisateurs
- ✅ Emails uniques
- ✅ Codes uniques pour classes, cours, emplois du temps
- ✅ Relations cohérentes (foreign keys)
- ✅ Dates valides
- ✅ Téléphones au format sénégalais
- ✅ Notes dans les plages valides (0-20)
- ✅ Contraintes d'unicité respectées

**Intégrité référentielle:**
- ✅ Tous les étudiants ont une classe
- ✅ Toutes les notes ont un étudiant et un cours valides
- ✅ Tous les cours ont un enseignant
- ✅ Tous les emplois du temps ont cours, classe, enseignant

---

**Date de génération:** 24 Novembre 2025  
**Base de données:** projet_asset (MySQL)  
**Version:** 2.0 - Données Complètes et Normalisées  
**Auteur:** AKHOUYE ACADEMIE
