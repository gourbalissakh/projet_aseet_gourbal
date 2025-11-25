# Guide de Démarrage - Backend Laravel

## 📋 Prérequis
- MySQL/XAMPP en cours d'exécution
- Base de données `projet_asset` créée

## 🚀 Instructions de Démarrage

### 1. Démarrer MySQL (XAMPP)
- Ouvrir XAMPP Control Panel
- Cliquer sur "Start" pour MySQL
- Vérifier que le port 3306 est actif

### 2. Exécuter les Migrations
```powershell
cd backend
php artisan migrate:fresh --seed
```

Cette commande va :
- ✅ Créer toutes les tables (users, filieres, niveaux, classes, cours, emplois_temps)
- ✅ Insérer des données de test
- ✅ Créer les utilisateurs suivants :

**Admin:**
- Email: `admin@sigu.com`
- Mot de passe: `password`

**Enseignants:**
- Email: `diop@sigu.com`, `ndiaye@sigu.com`, `fall@sigu.com`, `sow@sigu.com`, `ba@sigu.com`
- Mot de passe: `password` (pour tous)

**Étudiants:**
- Email: `etudiant1@sigu.com` à `etudiant20@sigu.com`
- Mot de passe: `password` (pour tous)

### 3. Démarrer le Serveur Laravel
```powershell
php artisan serve
```

Le backend sera accessible sur : **http://localhost:8000**

### 4. Vérifier l'API
Ouvrez votre navigateur et testez :
- http://localhost:8000/api/user (devrait renvoyer une erreur 401 - normal, pas authentifié)

## ✅ Configuration CORS
- ✅ Fichier `config/cors.php` créé
- ✅ Middleware CORS activé pour `http://localhost:5173`
- ✅ Support des credentials activé (cookies Sanctum)

## 🔐 Endpoints API Disponibles

### Public
- `POST /api/register` - Inscription (désactivée côté frontend)
- `POST /api/login` - Connexion

### Protégés (Sanctum)
- `POST /api/logout` - Déconnexion
- `GET /api/user` - Utilisateur authentifié
- `GET|POST /api/filieres` - CRUD Filières
- `GET|POST /api/niveaux` - CRUD Niveaux
- `GET|POST /api/classes` - CRUD Classes
- `GET|POST /api/cours` - CRUD Cours
- `GET|POST /api/emplois-temps` - CRUD Emplois du temps
- `GET|POST /api/users` - CRUD Utilisateurs (admin seulement)

## 🧪 Test de Connexion

Une fois le serveur démarré :

1. Frontend : http://localhost:5173
2. Connexion avec `admin@sigu.com` / `password`
3. Vous devriez être redirigé vers le dashboard

## 🛠️ Commandes Utiles

```powershell
# Voir l'état des migrations
php artisan migrate:status

# Réinitialiser la base de données
php artisan migrate:fresh --seed

# Vider le cache
php artisan cache:clear
php artisan config:clear

# Créer un nouvel utilisateur manuellement
php artisan tinker
>>> User::create(['nom' => 'Test', 'email' => 'test@sigu.com', 'password' => Hash::make('password'), 'role' => 'admin'])
```

## 🔄 Prochaines Étapes

Une fois le backend démarré et testé :
1. ✅ Test de connexion depuis le frontend
2. ⏳ Développement des pages CRUD (Phase 4)
3. ⏳ Dashboard par rôle (Phase 5)
