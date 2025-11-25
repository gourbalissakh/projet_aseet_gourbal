import api from './api';
import type { 
  Filiere, 
  FiliereFormData, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

export const filiereService = {
  // Récupérer toutes les filières
  async getAll(): Promise<Filiere[]> {
    const response = await api.get<{success: boolean, data: Filiere[]}>('/filieres');
    return response.data.data || [];
  },

  // Récupérer une filière par ID
  async getById(id: number): Promise<Filiere> {
    const response = await api.get<Filiere>(`/filieres/${id}`);
    return response.data;
  },

  // Créer une filière
  async create(data: FiliereFormData): Promise<Filiere> {
    const response = await api.post<Filiere>('/filieres', data);
    return response.data;
  },

  // Modifier une filière
  async update(id: number, data: FiliereFormData): Promise<Filiere> {
    const response = await api.put<Filiere>(`/filieres/${id}`, data);
    return response.data;
  },

  // Supprimer une filière
  async delete(id: number): Promise<void> {
    await api.delete(`/filieres/${id}`);
  },
};
