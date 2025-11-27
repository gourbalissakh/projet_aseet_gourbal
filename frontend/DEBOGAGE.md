# 🐛 Guide de Débogage et Résolution de Problèmes

Ce document aide à identifier et résoudre les problèmes courants dans l'application.

## 📋 Table des matières
1. [Problèmes d'Authentification](#problèmes-dauthentification)
2. [Erreurs API](#erreurs-api)
3. [Problèmes de Navigation](#problèmes-de-navigation)
4. [Erreurs de Chargement](#erreurs-de-chargement)
5. [Problèmes d'Interface](#problèmes-dinterface)
6. [Outils de Débogage](#outils-de-débogage)

---

## 🔐 Problèmes d'Authentification

### Symptôme : Déconnexion automatique
**Cause :** Token JWT expiré ou invalide

**Solution :**
1. Vérifier la console pour les erreurs 401
2. Vérifier le localStorage : `localStorage.getItem('token')`
3. Reconnecter l'utilisateur
4. Vérifier la durée de vie du token côté backend

```typescript
// Dans api.ts, l'intercepteur gère automatiquement
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

### Symptôme : Boucle de redirection
**Cause :** Route mal configurée ou rôle incorrect

**Solution :**
```typescript
// Vérifier dans App.tsx
const getDefaultRoute = () => {
  if (!user) return '/login';
  switch (user.role) {
    case 'etudiant': return '/etudiant/dashboard';
    case 'enseignant': return '/enseignant/dashboard';
    case 'admin': return '/admin/dashboard';
    default: return '/login';
  }
};
```

---

## 🌐 Erreurs API

### Symptôme : Erreur 404
**Cause :** Endpoint inexistant ou URL mal formée

**Débogage :**
```typescript
// Dans la console navigateur
if (import.meta.env.DEV) {
  console.log('URL demandée:', error.config?.url);
  console.log('Méthode:', error.config?.method);
}
```

**Solutions :**
- Vérifier l'URL dans `config/constants.ts`
- Vérifier que le backend est lancé
- Vérifier les routes dans `backend/routes/api.php`

### Symptôme : Erreur 422 (Validation)
**Cause :** Données envoyées invalides

**Débogage :**
```typescript
// Les erreurs de validation sont automatiquement affichées
// Vérifier la console pour les détails
case 422: {
  const errors = error.response?.data?.errors;
  // Affiche chaque erreur individuellement
}
```

**Solutions :**
- Utiliser les validators avant l'envoi
- Vérifier les champs requis
- Vérifier les formats (email, matricule, etc.)

### Symptôme : Erreur 500
**Cause :** Erreur serveur backend

**Solutions :**
1. Vérifier les logs Laravel : `backend/storage/logs/laravel.log`
2. Vérifier la console du serveur PHP
3. Vérifier les migrations de base de données
4. Vérifier les relations Eloquent

---

## 🧭 Problèmes de Navigation

### Symptôme : Page blanche
**Cause :** Erreur de rendu React

**Débogage :**
1. Ouvrir la console (F12)
2. Chercher les erreurs JavaScript
3. Vérifier le composant incriminé

**Solutions courantes :**
```typescript
// ❌ Mauvais - peut causer undefined
{user.classe.nom}

// ✅ Bon - safe avec optional chaining
{user?.classe?.nom || 'N/A'}

// ✅ Encore mieux - avec validation
{isDefined(user?.classe) ? user.classe.nom : 'N/A'}
```

### Symptôme : Route non protégée
**Cause :** ProtectedRoute mal configuré

**Vérifier :**
```typescript
// Dans App.tsx
<Route
  path="/enseignant/*"
  element={
    <ProtectedRoute allowedRoles={['enseignant']}>
      <EnseignantLayout />
    </ProtectedRoute>
  }
/>
```

---

## 📊 Erreurs de Chargement

### Symptôme : Liste vide malgré des données
**Cause :** Filtrage incorrect ou mauvaise extraction

**Débogage :**
```typescript
// Ajouter des logs temporaires
console.log('Données brutes:', response.data);
console.log('Données extraites:', response.data.data);
console.log('Données filtrées:', filteredData);
```

**Solutions :**
```typescript
// Utiliser extractPaginatedData
import { extractPaginatedData } from '@/utils/validators';
const data = extractPaginatedData<User>(response);

// Vérifier que les données existent
if (!isArrayWithItems(data)) {
  console.warn('Aucune donnée trouvée');
  return;
}
```

### Symptôme : Chargement infini
**Cause :** useEffect avec dépendances manquantes ou incorrectes

**Solutions :**
```typescript
// ❌ Mauvais - fetchData change à chaque render
useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData n'est pas mémoïsé

// ✅ Bon - fonction mémoïsée
const fetchData = useCallback(async () => {
  // ...
}, [dependencies]);

useEffect(() => {
  fetchData();
}, [fetchData]);

// ✅ Ou ignorer avec raison valable
useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Explicitement appelé une fois
```

---

## 🎨 Problèmes d'Interface

### Symptôme : Animation saccadée
**Cause :** Trop de re-renders

**Solutions :**
```typescript
// Mémoïser les composants lourds
const MemoizedCard = React.memo(ExpensiveCard);

// Mémoïser les valeurs calculées
const filteredList = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);
```

### Symptôme : Styles non appliqués
**Cause :** Classes Tailwind purgées ou conflits

**Vérifier :**
1. `tailwind.config.js` - content paths
2. Classes dynamiques (utiliser safelist)
3. Ordre des imports CSS

```typescript
// ❌ Mauvais - purge peut supprimer
const bgColor = `bg-${color}-500`;

// ✅ Bon - classe complète
const bgColor = color === 'blue' ? 'bg-blue-500' : 'bg-purple-500';
```

---

## 🔧 Outils de Débogage

### 1. React DevTools
- Installer l'extension Chrome/Firefox
- Inspecter les composants et leur état
- Voir les re-renders

### 2. Console Navigateur
```typescript
// Logs conditionnels (seulement en dev)
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

### 3. Network Tab
- Voir toutes les requêtes API
- Vérifier les headers (Authorization)
- Voir les réponses et codes d'erreur

### 4. localStorage Inspector
```typescript
// Dans la console
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### 5. Vite Server Logs
```bash
# Terminal où tourne le frontend
# Voir les erreurs de build et hot reload
```

### 6. Laravel Logs
```bash
# Windows PowerShell
Get-Content backend/storage/logs/laravel.log -Tail 50

# Voir les erreurs SQL, validation, etc.
```

---

## 🔍 Checklist de Débogage

Quand quelque chose ne fonctionne pas :

1. **Console navigateur**
   - [ ] Pas d'erreurs JavaScript ?
   - [ ] Pas d'erreurs réseau (Network tab) ?
   - [ ] Token présent dans localStorage ?

2. **Backend**
   - [ ] Serveur PHP lancé ?
   - [ ] Base de données connectée ?
   - [ ] Logs Laravel sans erreurs ?
   - [ ] Migrations à jour ?

3. **Code**
   - [ ] Imports corrects ?
   - [ ] Props typées correctement ?
   - [ ] Dépendances useEffect correctes ?
   - [ ] Validation des données ?

4. **Configuration**
   - [ ] `.env` correctement configuré ?
   - [ ] Variables d'environnement chargées ?
   - [ ] Routes correctement définies ?
   - [ ] CORS configuré côté backend ?

---

## 💡 Problèmes Courants et Solutions Rapides

### "Cannot read property 'X' of undefined"
```typescript
// Utiliser optional chaining et valeurs par défaut
const name = user?.classe?.nom ?? 'Non défini';
```

### "Hook call invalid"
```typescript
// Les hooks doivent être au top-level du composant
// ❌ Pas dans des conditions ou boucles
if (condition) {
  useEffect(() => {}, []);
}

// ✅ Conditions à l'intérieur
useEffect(() => {
  if (condition) {
    // ...
  }
}, [condition]);
```

### "Module not found"
```typescript
// Vérifier les imports relatifs vs absolus
// ❌ import { X } from '../../../utils/X';
// ✅ import { X } from '@/utils/X';

// Vérifier tsconfig.json pour les paths
```

### "Token expired"
```typescript
// Vérifier la durée de vie du token
// Backend: config/sanctum.php ou config/jwt.php
// Frontend: AUTH_CONFIG.SESSION_TIMEOUT dans constants.ts
```

---

## 📞 Obtenir de l'Aide

Si le problème persiste :

1. **Vérifier SECURITE.md** pour les bonnes pratiques
2. **Chercher dans les issues GitHub** (si projet public)
3. **Consulter la documentation Laravel** pour le backend
4. **Consulter la documentation React** pour le frontend

---

## 🚨 Erreurs Critiques

### Backend ne démarre pas
```bash
# Vérifier les dépendances
cd backend
composer install

# Vérifier les permissions
# Sur Windows, vérifier que storage/ et bootstrap/cache/ sont accessibles

# Régénérer l'autoload
composer dump-autoload

# Vérifier la config
php artisan config:clear
php artisan cache:clear
```

### Frontend ne compile pas
```bash
# Nettoyer et réinstaller
cd frontend
rm -rf node_modules package-lock.json
npm install

# Vérifier les versions Node/npm
node -v  # >= 18
npm -v   # >= 9
```

### Base de données corrompue
```bash
# Reset complet (ATTENTION : perte de données)
cd backend
php artisan migrate:fresh --seed
```

---

**Dernière mise à jour :** 27 novembre 2025
