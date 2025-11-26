import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, Search, Clock, User, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface Cours {
  id: number;
  nom: string;
  code: string;
  description: string;
  volume_horaire: number;
  credits: number;
  classe_id: number;
  enseignant_id: number;
  professeur_id?: number;
  classe?: {
    id: number;
    nom: string;
    code: string;
  };
  enseignant?: {
    id: number;
    nom: string;
    prenom: string;
  };
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
      // Pour un étudiant, on charge tous les cours (filtrage côté backend par classe)
      // Pour un enseignant, on filtre par professeur_id
      if (user?.role === 'etudiant') {
        setCours(response.data.data || []);
      } else {
        const mesCours = response.data.data.filter(
          (c: Cours) => c.professeur_id === user?.id || c.enseignant_id === user?.id
        );
        setCours(mesCours);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des cours');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.role]);

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
    <div className="space-y-8 pb-8">
      {/* En-tête modernisé */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-xl p-8 overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-2">
            <motion.div 
              className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen size={32} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Mes Cours</h1>
              <p className="text-blue-100 mt-1">
                Découvrez tous vos cours et leurs détails
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Barre de recherche et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un cours par nom ou code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
            />
          </motion.div>
        </div>

        <motion.div 
          className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Cours</p>
              <p className="text-4xl font-bold">{cours.length}</p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="w-12 h-12 opacity-30" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Liste des cours - Design modernisé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCours.length === 0 ? (
          <motion.div 
            className="col-span-full text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun cours trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Aucun cours n\'est assigné pour le moment'}
            </p>
          </motion.div>
        ) : (
          filteredCours.map((cours, index) => (
            <motion.div
              key={cours.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative h-full bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all overflow-hidden">
                {/* Decorative corner gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-[4rem] transition-all group-hover:scale-110"></div>
                
                {/* Decorative left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"></div>

                <div className="relative p-6 h-full flex flex-col">
                  {/* En-tête de la carte */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {cours.nom}
                      </h3>
                      <p className="text-sm font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-lg inline-block font-semibold">
                        {cours.code}
                      </p>
                    </div>
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <BookOpen className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>

                  {/* Description */}
                  {cours.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {cours.description}
                    </p>
                  )}

                  {/* Informations avec icônes */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Volume</p>
                        <p className="text-sm font-bold text-gray-900">
                          {cours.volume_horaire}h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Crédits</p>
                        <p className="text-sm font-bold text-gray-900">
                          {cours.credits} ECTS
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enseignant */}
                  {cours.enseignant && (
                    <div className="pt-4 border-t border-gray-200 mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-medium">Enseignant</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {cours.enseignant.prenom} {cours.enseignant.nom}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date de création - Spacer pour aligner en bas */}
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Créé le {new Date(cours.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
