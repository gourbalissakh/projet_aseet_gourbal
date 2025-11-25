import api from './api';
import type { 
  EmploiTemps, 
  EmploiTempsFormData 
} from '../types';

export const emploiTempsService = {
  // Récupérer tous les emplois du temps
  async getAll(): Promise<EmploiTemps[]> {
    const response = await api.get<{success: boolean, data: EmploiTemps[]}>('/emplois-temps');
    return response.data.data || [];
  },

  // Récupérer un emploi du temps par ID
  async getById(id: number): Promise<EmploiTemps> {
    const response = await api.get<EmploiTemps>(`/emplois-temps/${id}`);
    return response.data;
  },

  // Récupérer les emplois du temps par classe
  async getByClasse(classeId: number): Promise<EmploiTemps[]> {
    const response = await api.get<EmploiTemps[]>(`/classes/${classeId}/emplois-temps`);
    return response.data;
  },

  // Récupérer les emplois du temps d'un enseignant
  async getByEnseignant(enseignantId: number): Promise<EmploiTemps[]> {
    const response = await api.get<EmploiTemps[]>(`/enseignants/${enseignantId}/emplois-temps`);
    return response.data;
  },

  // Créer un emploi du temps
  async create(data: EmploiTempsFormData): Promise<EmploiTemps> {
    const response = await api.post<EmploiTemps>('/emplois-temps', data);
    return response.data;
  },

  // Modifier un emploi du temps
  async update(id: number, data: EmploiTempsFormData): Promise<EmploiTemps> {
    const response = await api.put<EmploiTemps>(`/emplois-temps/${id}`, data);
    return response.data;
  },

  // Supprimer un emploi du temps
  async delete(id: number): Promise<void> {
    await api.delete(`/emplois-temps/${id}`);
  },
};
