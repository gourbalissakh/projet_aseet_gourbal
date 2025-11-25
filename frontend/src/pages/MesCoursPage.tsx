import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface Cours {
  id: number;
  nom: string;
  code: string;
  description: string;
  heures: number;
  credits: number;
  professeur_id?: number;
  enseignant_id?: number;
  professeur?: {
    id: number;
    nom: string;
    prenom: string;
  };
  created_at: string;
  updated_at: string;
}

export const MesCoursPage: React.FC = () => {
  const { user } = useAuthStore();
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCours = useCallback(async () => {
    try {
      const response = await api.get('/cours');
      // Filtrer uniquement les cours de l'enseignant connecté
      const mesCours = response.data.data.filter(
        (c: Cours) => c.professeur_id === user?.id || c.enseignant_id === user?.id
      );
      setCours(mesCours);
    } catch (error) {
      toast.error('Erreur lors du chargement des cours');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCours();
  }, [loadCours]);

  const filteredCours = cours.filter(c =>
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Cours</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos cours et consultez les informations
          </p>
        </div>
      </div>

      {/* Barre de recherche et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un cours par nom ou code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Cours</p>
              <p className="text-3xl font-bold">{cours.length}</p>
            </div>
            <BookOpen className="w-12 h-12 opacity-50" />
          </div>
        </div>
      </div>

      {/* Liste des cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCours.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun cours trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Aucun cours n\'est assigné pour le moment'}
            </p>
          </div>
        ) : (
          filteredCours.map((cours, index) => (
            <motion.div
              key={cours.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {cours.nom}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      Code: {cours.code}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Description */}
                {cours.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {cours.description}
                  </p>
                )}

                {/* Informations */}
                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Heures</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {cours.heures}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Crédits</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {cours.credits}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date de création */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Créé le {new Date(cours.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
