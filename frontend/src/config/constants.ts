/**
 * Configuration centralisée de l'application
 */

// URLs de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 seconde
} as const;

// Configuration de l'authentification
export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  SESSION_TIMEOUT: 3600000, // 1 heure en millisecondes
} as const;

// Configuration de pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Configuration des notes
export const NOTES_CONFIG = {
  MIN_NOTE: 0,
  MAX_NOTE: 20,
  SEUIL_REUSSITE: 10,
  TYPES: ['Examen', 'Devoir', 'TP', 'TD', 'Projet', 'Participation'] as const,
  SEMESTRES: ['S1', 'S2'] as const,
  COEFFICIENTS: [1, 2, 3, 4, 5],
} as const;

// Configuration des emplois du temps
export const EMPLOI_TEMPS_CONFIG = {
  JOURS: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const,
  HEURE_DEBUT_MIN: '07:00',
  HEURE_FIN_MAX: '19:00',
  DUREE_COURS_MIN: 30, // minutes
  DUREE_COURS_MAX: 240, // minutes
} as const;

// Configuration des rôles
export const ROLES = {
  ADMIN: 'admin',
  ENSEIGNANT: 'enseignant',
  ETUDIANT: 'etudiant',
} as const;

// Configuration des statuts
export const STATUTS = {
  ACTIF: 'actif',
  INACTIF: 'inactif',
  SUSPENDU: 'suspendu',
} as const;

// Configuration des formats
export const FORMATS = {
  DATE: 'DD/MM/YYYY',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
  MATRICULE_PATTERN: /^[A-Z]{3}-\d{4}-\d{4}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^(77|78|76|70|75)\d{7}$/,
} as const;

// Configuration de l'interface utilisateur
export const UI_CONFIG = {
  ANIMATION_DURATION: 0.3, // secondes
  TOAST_DURATION: 3000, // millisecondes
  DEBOUNCE_DELAY: 300, // millisecondes
  ITEMS_PER_PAGE_DASHBOARD: 5,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
} as const;

// Configuration des couleurs (thèmes)
export const THEME_COLORS = {
  ADMIN: {
    primary: 'blue',
    gradient: 'from-blue-600 to-indigo-600',
  },
  ENSEIGNANT: {
    primary: 'purple',
    gradient: 'from-purple-600 to-indigo-600',
  },
  ETUDIANT: {
    primary: 'blue',
    gradient: 'from-blue-600 to-indigo-600',
  },
} as const;

// Chemins de routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Routes Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ETUDIANTS: '/admin/etudiants',
  ADMIN_ENSEIGNANTS: '/admin/enseignants',
  ADMIN_ADMINS: '/admin/admins',
  ADMIN_FILIERES: '/admin/filieres',
  ADMIN_NIVEAUX: '/admin/niveaux',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_COURS: '/admin/cours',
  ADMIN_EMPLOI_TEMPS: '/admin/emplois-temps',
  
  // Routes Enseignant
  ENSEIGNANT_DASHBOARD: '/enseignant/dashboard',
  ENSEIGNANT_NOTES: '/enseignant/notes',
  ENSEIGNANT_EMPLOI_TEMPS: '/enseignant/emploi-temps',
  
  // Routes Étudiant
  ETUDIANT_DASHBOARD: '/etudiant/dashboard',
  ETUDIANT_NOTES: '/etudiant/notes',
  ETUDIANT_COURS: '/etudiant/cours',
  ETUDIANT_EMPLOI_TEMPS: '/etudiant/emploi-temps',
  
  // Routes communes
  PROFIL: '/profil',
  PARAMETRES: '/parametres',
  
  // Routes d'erreur
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
} as const;

// Configuration des messages de validation
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  EMAIL_INVALID: 'Adresse email invalide',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas',
  MATRICULE_INVALID: 'Format de matricule invalide (XXX-YYYY-ZZZZ)',
  PHONE_INVALID: 'Numéro de téléphone invalide',
  NOTE_OUT_OF_RANGE: 'La note doit être comprise entre 0 et 20',
  TIME_INVALID: 'Format d\'heure invalide (HH:MM)',
  DATE_INVALID: 'Date invalide',
} as const;

// Limites de l'application
export const APP_LIMITS = {
  MAX_COURS_PER_ENSEIGNANT: 10,
  MAX_ETUDIANTS_PER_CLASSE: 50,
  MAX_NOTES_PER_ETUDIANT: 100,
  MAX_EMPLOI_TEMPS_PER_WEEK: 40,
} as const;

// Environnement
export const ENV = {
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const;
