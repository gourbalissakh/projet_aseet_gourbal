# 🛡️ Sécurité et Bonnes Pratiques

Ce document liste les mesures de sécurité et les bonnes pratiques implémentées dans le projet.

## 📋 Table des matières
1. [Gestion des Erreurs](#gestion-des-erreurs)
2. [Validation des Données](#validation-des-données)
3. [Configuration Centralisée](#configuration-centralisée)
4. [Sécurité API](#sécurité-api)
5. [Bonnes Pratiques React](#bonnes-pratiques-react)

---

## 🔧 Gestion des Erreurs

### ErrorHandler
Un service centralisé pour gérer toutes les erreurs de l'application :

```typescript
import { ErrorHandler } from '@/utils/errorHandler';

// Gestion des erreurs API
try {
  await api.get('/endpoint');
} catch (error) {
  ErrorHandler.handleApiError(error, 'Message personnalisé');
}

// Gestion spécifique
ErrorHandler.handleLoadError('des cours', error);
ErrorHandler.handleSaveError('de la note', error);
ErrorHandler.handleDeleteError('de l\'étudiant', error);
```

### Avantages
- ✅ Messages d'erreur cohérents
- ✅ Logs en développement uniquement
- ✅ Notifications utilisateur automatiques
- ✅ Gestion des codes HTTP standardisée

---

## ✔️ Validation des Données

### Utilitaires de Validation
Fichier : `utils/validators.ts`

```typescript
import { isValidEmail, isValidNote, isValidMatricule } from '@/utils/validators';

// Validation d'email
if (!isValidEmail(email)) {
  // Afficher erreur
}

// Validation de note
if (!isValidNote(note)) {
  // Note invalide
}

// Extraction sécurisée des données API
const data = extractPaginatedData<User>(response);
```

### Types de Validations Disponibles
- ✅ Email (format standard)
- ✅ Matricule (XXX-YYYY-ZZZZ)
- ✅ Note (0-20)
- ✅ Mot de passe (min 8 caractères)
- ✅ Téléphone sénégalais (77/78/76/70/75 + 7 chiffres)
- ✅ Horaires (HH:MM)
- ✅ Dates
- ✅ Plages de valeurs

---

## ⚙️ Configuration Centralisée

### Constantes de l'Application
Fichier : `config/constants.ts`

Toutes les configurations sont centralisées :

```typescript
import { NOTES_CONFIG, ROUTES, API_CONFIG } from '@/config/constants';

// Notes
const maxNote = NOTES_CONFIG.MAX_NOTE; // 20
const typesNote = NOTES_CONFIG.TYPES; // ['Examen', 'Devoir', ...]

// Routes
navigate(ROUTES.ENSEIGNANT_DASHBOARD);

// API
const timeout = API_CONFIG.TIMEOUT; // 10000ms
```

### Configurations Disponibles
- 📌 API (URLs, timeout, retry)
- 📌 Authentification (clés storage, timeout session)
- 📌 Pagination (tailles de page)
- 📌 Notes (min/max, types, semestres)
- 📌 Emplois du temps (jours, horaires)
- 📌 Rôles et statuts
- 📌 Formats (date, regex)
- 📌 UI (animations, toasts, debounce)
- 📌 Thèmes (couleurs par rôle)
- 📌 Routes (toutes les URLs)
- 📌 Messages de validation
- 📌 Limites applicatives

---

## 🔒 Sécurité API

### Intercepteurs Axios
Fichier : `services/api.ts`

#### Requêtes (Request Interceptor)
- Ajout automatique du token JWT
- Headers standardisés

#### Réponses (Response Interceptor)
- Gestion automatique des 401 (déconnexion)
- Gestion des 403, 404, 500
- Gestion des timeouts et erreurs réseau
- Logs en développement seulement

### Bonnes Pratiques Implémentées
- ✅ Token stocké en localStorage (considérer httpOnly cookies en production)
- ✅ Timeout configuré (10s)
- ✅ Retry logic disponible
- ✅ Redirection automatique sur 401
- ✅ Messages d'erreur contextuels

---

## ⚛️ Bonnes Pratiques React

### 1. TypeScript Strict
- Pas de `any` (sauf cas exceptionnels)
- Interfaces pour toutes les entités
- Types d'export cohérents

### 2. Hooks
```typescript
// ✅ Bon - Dépendances spécifiées
useEffect(() => {
  fetchData();
}, [fetchData]);

// ❌ Mauvais - Dépendances manquantes
useEffect(() => {
  fetchData();
}, []);
```

### 3. Gestion d'État
- Zustand pour l'état global (auth)
- useState pour l'état local
- Pas de prop drilling excessif

### 4. Performance
```typescript
// Mémoïsation des fonctions
const fetchData = useCallback(async () => {
  // ...
}, [dependencies]);

// Mémoïsation des valeurs
const filteredData = useMemo(() => {
  return data.filter(/* ... */);
}, [data]);
```

### 5. Composants
- Composants purs quand possible
- Props typées avec interfaces
- Décomposition en petits composants réutilisables

---

## 🔐 Checklist de Sécurité

### Frontend
- [x] Validation des inputs côté client
- [x] Gestion des erreurs centralisée
- [x] Pas de données sensibles dans le code
- [x] Variables d'environnement pour configs
- [x] Logs de débogage uniquement en dev
- [x] Timeout sur les requêtes API
- [x] Gestion des tokens JWT
- [x] Protection contre XSS (React par défaut)
- [x] CORS géré côté backend

### Backend (à vérifier)
- [ ] Validation des inputs côté serveur
- [ ] Sanitisation des données
- [ ] Protection CSRF
- [ ] Rate limiting
- [ ] Logs d'audit
- [ ] Mots de passe hashés (bcrypt)
- [ ] Tokens JWT avec expiration
- [ ] HTTPS en production
- [ ] Headers de sécurité (Helmet.js)

---

## 📝 Messages d'Erreur Standardisés

### Structure
```typescript
export const ERROR_MESSAGES = {
  LOAD_COURS: 'des cours',
  SAVE_NOTE: 'de la note',
  // ...
};
```

### Utilisation
```typescript
ErrorHandler.handleLoadError(ERROR_MESSAGES.LOAD_COURS, error);
// Affiche : "Erreur lors du chargement des cours"
```

---

## 🚀 Améliorations Futures

### Court Terme
1. [ ] Implémenter le retry logic dans l'API
2. [ ] Ajouter des tests unitaires pour validators
3. [ ] Créer des custom hooks pour les opérations CRUD
4. [ ] Ajouter des boundary errors React

### Moyen Terme
1. [ ] Migration vers React Query pour le cache
2. [ ] Implémenter un système de permissions granulaire
3. [ ] Ajouter l'internationalisation (i18n)
4. [ ] Logs centralisés (Sentry, LogRocket)

### Long Terme
1. [ ] Migration vers httpOnly cookies pour les tokens
2. [ ] Implémenter OAuth2 / SSO
3. [ ] Chiffrement end-to-end des données sensibles
4. [ ] Audit de sécurité complet

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

## 👥 Contribution

Pour ajouter de nouvelles validations ou gérer de nouveaux types d'erreurs :

1. Ajouter les fonctions dans `utils/validators.ts`
2. Ajouter les constantes dans `config/constants.ts`
3. Mettre à jour `ErrorHandler` si nécessaire
4. Documenter ici

---

**Dernière mise à jour :** 27 novembre 2025
