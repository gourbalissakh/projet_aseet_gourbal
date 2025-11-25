export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'enseignant' | 'etudiant';
  matricule?: string;
  telephone?: string;
  adresse?: string;
  statut?: string;
  sexe?: string;
  classe_id?: number;
  classe?: {
    id: number;
    nom: string;
    code: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Filiere {
  id: number;
  nom: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Niveau {
  id: number;
  nom: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Classe {
  id: number;
  nom: string;
  filiere_id: number;
  niveau_id: number;
  filiere?: Filiere;
  niveau?: Niveau;
  created_at?: string;
  updated_at?: string;
}

export interface Cours {
  id: number;
  nom: string;
  description?: string;
  code?: string;
  credits?: number;
  professeur_id?: number;
  professeur?: User;
  created_at?: string;
  updated_at?: string;
}

export interface CoursFormData {
  nom: string;
  description?: string;
  code?: string;
  credits?: number;
  professeur_id?: number;
}

export interface EmploiTemps {
  id: number;
  classe_id: number;
  cours_id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle?: string;
  classe?: Classe;
  cours?: Cours;
  created_at?: string;
  updated_at?: string;
}

export interface EmploiTempsFormData {
  classe_id: number;
  cours_id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
