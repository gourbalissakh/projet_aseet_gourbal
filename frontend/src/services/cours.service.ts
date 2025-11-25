import api from './api';
import type { Cours, CoursFormData } from '../types';

export const coursService = {
  // Récupérer tous les cours
  async getAll(): Promise<Cours[]> {
    const response = await api.get<{success: boolean, data: Cours[]}>('/cours');
    return response.data.data || [];
  },

  // Récupérer un cours par ID
  async getById(id: number): Promise<Cours> {
    const response = await api.get<Cours>(`/cours/${id}`);
    return response.data;
  },

  // Récupérer les cours par classe
  async getByClasse(classeId: number): Promise<Cours[]> {
    const response = await api.get<Cours[]>(`/classes/${classeId}/cours`);
    return response.data;
  },

  // Récupérer les cours d'un enseignant
  async getByEnseignant(enseignantId: number): Promise<Cours[]> {
    const response = await api.get<Cours[]>(`/enseignants/${enseignantId}/cours`);
    return response.data;
  },

  // Créer un cours
  async create(data: CoursFormData): Promise<Cours> {
    const response = await api.post<Cours>('/cours', data);
    return response.data;
  },

  // Modifier un cours
  async update(id: number, data: CoursFormData): Promise<Cours> {
    const response = await api.put<Cours>(`/cours/${id}`, data);
    return response.data;
  },

  // Supprimer un cours
  async delete(id: number): Promise<void> {
    await api.delete(`/cours/${id}`);
  },
};
