import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ErrorHandler } from '../utils/errorHandler';

// Configuration de base d'Axios
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Gérer les erreurs d'authentification
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (import.meta.env.DEV) {
        console.error('Authentification requise - redirection vers /login');
      }
      window.location.href = '/login';
    }

    // Gérer les erreurs 403 (Forbidden)
    if (error.response?.status === 403) {
      if (import.meta.env.DEV) {
        console.error('Accès interdit:', error.response.data);
      }
    }

    // Gérer les erreurs 404
    if (error.response?.status === 404) {
      if (import.meta.env.DEV) {
        console.error('Ressource non trouvée:', error.config?.url);
      }
    }

    // Gérer les erreurs 500
    if (error.response?.status === 500) {
      if (import.meta.env.DEV) {
        console.error('Erreur serveur:', error.response.data);
      }
    }

    // Gérer les erreurs de timeout
    if (error.code === 'ECONNABORTED') {
      ErrorHandler.showWarning('La requête a pris trop de temps. Veuillez réessayer.');
    }

    // Gérer les erreurs réseau
    if (error.message === 'Network Error') {
      ErrorHandler.showWarning('Erreur de connexion. Vérifiez votre connexion internet.');
    }

    return Promise.reject(error);
  }
);

export default api;
