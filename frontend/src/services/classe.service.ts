import api from './api';
import type { 
  Classe, 
  ClasseFormData 
} from '../types';

export const classeService = {
  // Récupérer toutes les classes
  async getAll(): Promise<Classe[]> {
    const response = await api.get<{success: boolean, data: Classe[]}>('/classes');
    return response.data.data || [];
  },

  // Récupérer une classe par ID
  async getById(id: number): Promise<Classe> {
    const response = await api.get<Classe>(`/classes/${id}`);
    return response.data;
  },

  // Récupérer les classes par niveau
  async getByNiveau(niveauId: number): Promise<Classe[]> {
    const response = await api.get<Classe[]>(`/niveaux/${niveauId}/classes`);
    return response.data;
  },

  // Créer une classe
  async create(data: ClasseFormData): Promise<Classe> {
    const response = await api.post<Classe>('/classes', data);
    return response.data;
  },

  // Modifier une classe
  async update(id: number, data: ClasseFormData): Promise<Classe> {
    const response = await api.put<Classe>(`/classes/${id}`, data);
    return response.data;
  },

  // Supprimer une classe
  async delete(id: number): Promise<void> {
    await api.delete(`/classes/${id}`);
  },
};
