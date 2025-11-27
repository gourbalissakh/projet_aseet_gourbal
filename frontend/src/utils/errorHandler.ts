import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

/**
 * Gestionnaire centralisé des erreurs pour une meilleure gestion et cohérence
 */
export class ErrorHandler {
  /**
   * Gère les erreurs API et affiche des notifications appropriées
   */
  static handleApiError(error: unknown, customMessage?: string): void {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      switch (status) {
        case 400:
          toast.error(customMessage || `Requête invalide: ${message}`);
          break;
        case 401:
          toast.error('Session expirée. Veuillez vous reconnecter.');
          break;
        case 403:
          toast.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
          break;
        case 404:
          toast.error(customMessage || 'Ressource non trouvée');
          break;
        case 422: {
          // Erreurs de validation
          const errors = error.response?.data?.errors;
          if (errors && typeof errors === 'object') {
            Object.values(errors).forEach((errorArray) => {
              if (Array.isArray(errorArray)) {
                errorArray.forEach((err) => toast.error(err as string));
              }
            });
          } else {
            toast.error(message || 'Erreur de validation');
          }
          break;
        }
        case 500:
          toast.error('Erreur serveur. Veuillez réessayer plus tard.');
          break;
        case 503:
          toast.error('Service temporairement indisponible');
          break;
        default:
          toast.error(customMessage || 'Une erreur est survenue');
      }

      // Log l'erreur en développement
      if (import.meta.env.DEV) {
        console.error('API Error:', {
          status,
          message,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response?.data
        });
      }
    } else if (error instanceof Error) {
      toast.error(customMessage || error.message);
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
    } else {
      toast.error(customMessage || 'Une erreur inattendue est survenue');
      if (import.meta.env.DEV) {
        console.error('Unknown error:', error);
      }
    }
  }

  /**
   * Gère les erreurs de chargement de données
   */
  static handleLoadError(resource: string, error: unknown): void {
    this.handleApiError(error, `Erreur lors du chargement ${resource}`);
  }

  /**
   * Gère les erreurs de sauvegarde de données
   */
  static handleSaveError(resource: string, error: unknown): void {
    this.handleApiError(error, `Erreur lors de la sauvegarde ${resource}`);
  }

  /**
   * Gère les erreurs de suppression de données
   */
  static handleDeleteError(resource: string, error: unknown): void {
    this.handleApiError(error, `Erreur lors de la suppression ${resource}`);
  }

  /**
   * Affiche un message de succès
   */
  static showSuccess(message: string): void {
    toast.success(message);
  }

  /**
   * Affiche un message d'information
   */
  static showInfo(message: string): void {
    toast(message, {
      icon: 'ℹ️',
    });
  }

  /**
   * Affiche un message d'avertissement
   */
  static showWarning(message: string): void {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
      },
    });
  }
}

/**
 * Messages d'erreur constants pour la cohérence
 */
export const ERROR_MESSAGES = {
  // Généraux
  UNEXPECTED_ERROR: 'Une erreur inattendue est survenue',
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SESSION_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter.',
  
  // Authentification
  LOGIN_FAILED: 'Identifiants incorrects',
  LOGOUT_FAILED: 'Erreur lors de la déconnexion',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette ressource',
  
  // Chargement
  LOAD_COURS: 'des cours',
  LOAD_ETUDIANTS: 'des étudiants',
  LOAD_NOTES: 'des notes',
  LOAD_EMPLOIS: 'des emplois du temps',
  LOAD_CLASSES: 'des classes',
  LOAD_FILIERES: 'des filières',
  LOAD_NIVEAUX: 'des niveaux',
  
  // Sauvegarde
  SAVE_NOTE: 'de la note',
  SAVE_COURS: 'du cours',
  SAVE_ETUDIANT: "de l'étudiant",
  SAVE_ENSEIGNANT: "de l'enseignant",
  SAVE_CLASSE: 'de la classe',
  
  // Suppression
  DELETE_NOTE: 'de la note',
  DELETE_COURS: 'du cours',
  DELETE_ETUDIANT: "de l'étudiant",
  DELETE_ENSEIGNANT: "de l'enseignant",
  DELETE_CLASSE: 'de la classe',
  
  // Validation
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Adresse email invalide',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas',
  INVALID_MATRICULE: 'Matricule invalide',
  INVALID_NOTE: 'La note doit être comprise entre 0 et 20',
} as const;

/**
 * Messages de succès constants
 */
export const SUCCESS_MESSAGES = {
  // Authentification
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  
  // Sauvegarde
  SAVE_SUCCESS: 'Enregistrement effectué avec succès',
  NOTE_ADDED: 'Note ajoutée avec succès',
  NOTE_UPDATED: 'Note modifiée avec succès',
  
  // Suppression
  DELETE_SUCCESS: 'Suppression effectuée avec succès',
  NOTE_DELETED: 'Note supprimée avec succès',
  
  // Profil
  PROFILE_UPDATED: 'Profil mis à jour avec succès',
  PASSWORD_UPDATED: 'Mot de passe modifié avec succès',
} as const;
