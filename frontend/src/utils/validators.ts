/**
 * Utilitaires de validation pour améliorer la robustesse de l'application
 */

/**
 * Vérifie si une valeur est définie et non nulle
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Vérifie si un tableau est défini et non vide
 */
export const isArrayWithItems = <T>(arr: T[] | null | undefined): arr is T[] => {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * Vérifie si un objet est défini et non vide
 */
export const isObjectWithKeys = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;
};

/**
 * Validation d'email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validation de matricule (format: XXX-YYYY-ZZZZ)
 */
export const isValidMatricule = (matricule: string): boolean => {
  const matriculeRegex = /^[A-Z]{3}-\d{4}-\d{4}$/;
  return matriculeRegex.test(matricule);
};

/**
 * Validation de note (entre 0 et 20)
 */
export const isValidNote = (note: number): boolean => {
  return note >= 0 && note <= 20;
};

/**
 * Validation de mot de passe (minimum 8 caractères)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validation de numéro de téléphone sénégalais
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Format: 77/78/76/70/75 suivi de 7 chiffres
  const phoneRegex = /^(77|78|76|70|75)\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Nettoie et valide les données API
 */
export const sanitizeApiResponse = <T>(data: unknown, defaultValue: T): T => {
  if (!isDefined(data)) {
    return defaultValue;
  }
  return data as T;
};

/**
 * Extrait les données d'une réponse API paginée en toute sécurité
 */
export const extractPaginatedData = <T>(response: unknown): T[] => {
  if (
    isObjectWithKeys(response) &&
    'data' in response &&
    isObjectWithKeys(response.data) &&
    'data' in response.data &&
    Array.isArray(response.data.data)
  ) {
    return response.data.data as T[];
  }
  return [];
};

/**
 * Vérifie si une réponse API est valide
 */
export const isValidApiResponse = (response: unknown): boolean => {
  return (
    isObjectWithKeys(response) &&
    'data' in response &&
    isDefined(response.data)
  );
};

/**
 * Valide les horaires (format HH:MM)
 */
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Vérifie si une date est valide
 */
export const isValidDate = (date: string): boolean => {
  const timestamp = Date.parse(date);
  return !isNaN(timestamp);
};

/**
 * Vérifie si un nombre est dans une plage donnée
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Nettoie une chaîne de caractères (trim et suppression des espaces multiples)
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Capitalise la première lettre de chaque mot
 */
export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
