import api from './api';
import type { 
  User, 
  RegisterData 
} from '../types';

export const userService = {
  // Récupérer tous les utilisateurs
  async getAll(): Promise<User[]> {
    const response = await api.get<{success: boolean, data: User[]}>('/users');
    return response.data.data || [];
  },

  // Récupérer un utilisateur par ID
  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Récupérer les utilisateurs par rôle
  async getByRole(role: string): Promise<User[]> {
    const response = await api.get<{success: boolean, data: User[]}>(`/users/role/${role}`);
    return response.data.data || [];
  },

  // Créer un utilisateur
  async create(data: RegisterData): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  // Modifier un utilisateur
  async update(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // Supprimer un utilisateur
  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Récupérer tous les enseignants
  async getEnseignants(): Promise<User[]> {
    return this.getByRole('enseignant');
  },

  // Récupérer tous les étudiants
  async getEtudiants(): Promise<User[]> {
    return this.getByRole('etudiant');
  },
};
