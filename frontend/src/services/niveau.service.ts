import api from './api';
import type { 
  Niveau, 
  NiveauFormData 
} from '../types';

export const niveauService = {
  // Récupérer tous les niveaux
  async getAll(): Promise<Niveau[]> {
    const response = await api.get<{success: boolean, data: Niveau[]}>('/niveaux');
    return response.data.data || [];
  },

  // Récupérer un niveau par ID
  async getById(id: number): Promise<Niveau> {
    const response = await api.get<Niveau>(`/niveaux/${id}`);
    return response.data;
  },

  // Récupérer les niveaux par filière
  async getByFiliere(filiereId: number): Promise<Niveau[]> {
    const response = await api.get<Niveau[]>(`/filieres/${filiereId}/niveaux`);
    return response.data;
  },

  // Créer un niveau
  async create(data: NiveauFormData): Promise<Niveau> {
    const response = await api.post<Niveau>('/niveaux', data);
    return response.data;
  },

  // Modifier un niveau
  async update(id: number, data: NiveauFormData): Promise<Niveau> {
    const response = await api.put<Niveau>(`/niveaux/${id}`, data);
    return response.data;
  },

  // Supprimer un niveau
  async delete(id: number): Promise<void> {
    await api.delete(`/niveaux/${id}`);
  },
};
