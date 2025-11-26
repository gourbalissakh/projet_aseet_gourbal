import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

interface EmploiTemps {
  id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle?: string;
  cours?: {
    nom: string;
    code: string;
  };
  classe?: {
    nom: string;
  };
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export const MonEmploiTempsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [emplois, setEmplois] = useState<EmploiTemps[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmplois = async () => {
      try {
        setLoading(true);
        const response = await api.get('/emplois-temps');
        const allEmplois = response.data.data || [];
        
        // Filtrer les emplois de l'enseignant connecté
        const mesEmplois = allEmplois.filter((e: EmploiTemps & { enseignant_id?: number; cours?: { professeur_id?: number } }) => 
          e.enseignant_id === user?.id || e.cours?.professeur_id === user?.id
        );
        
        setEmplois(mesEmplois);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'emploi du temps:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmplois();
  }, [user?.id]);

  const getEmploiForSlot = (jour: string, heure: string) => {
    return emplois.find(e => {
      const heureDebut = e.heure_debut.substring(0, 5);
      return e.jour === jour && heureDebut === heure;
    });
  };

  const getEmploisByDay = (jour: string) => {
    return emplois
      .filter(e => e.jour === jour)
      .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));
  };

  const toggleDay = (jour: string) => {
    setExpandedDay(expandedDay === jour ? null : jour);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 rounded-2xl shadow-xl p-8 overflow-hidden"
      >
        {/* Animated background */}
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Calendar size={32} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Mon Emploi du Temps</h1>
              <p className="text-purple-100">
                Votre planning de la semaine • {emplois.length} cours programmés
              </p>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 via-indigo-700 to-purple-800">
                  <th className="sticky left-0 z-20 px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider bg-purple-700 border-r border-purple-500">
                    Horaire
                  </th>
                  {JOURS.map((jour, index) => (
                    <th
                      key={jour}
                      className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-purple-500 last:border-r-0"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {jour}
                      </motion.div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEURES.map((heure, heureIndex) => (
                  <tr key={heure} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="sticky left-0 z-10 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50 border-r border-gray-200">
                      {heure}
                    </td>
                    {JOURS.map((jour, jourIndex) => {
                      const emploi = getEmploiForSlot(jour, heure);
                      return (
                        <td
                          key={`${jour}-${heure}`}
                          className="px-3 py-3 border-r border-gray-200 last:border-r-0 align-top"
                        >
                          {emploi ? (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: (heureIndex * JOURS.length + jourIndex) * 0.01 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              className="relative p-3 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
                            >
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                              
                              <div className="relative z-10">
                                <div className="font-bold text-sm mb-1 text-purple-900 line-clamp-2">
                                  {emploi.cours?.nom}
                                </div>
                                <div className="text-xs text-purple-700 font-mono mb-2">
                                  {emploi.cours?.code}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-xs text-gray-700">
                                    <Clock size={12} className="text-purple-600" />
                                    <span className="font-medium">
                                      {emploi.heure_debut.substring(0, 5)} - {emploi.heure_fin.substring(0, 5)}
                                    </span>
                                  </div>
                                  {emploi.salle && (
                                    <div className="flex items-center gap-1 text-xs text-gray-700">
                                      <MapPin size={12} className="text-purple-600" />
                                      <span className="font-medium">Salle {emploi.salle}</span>
                                    </div>
                                  )}
                                  {emploi.classe && (
                                    <div className="flex items-center gap-1 text-xs text-gray-700">
                                      <Users size={12} className="text-purple-600" />
                                      <span className="font-medium">{emploi.classe.nom}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {JOURS.map((jour, jourIndex) => {
            const coursJour = getEmploisByDay(jour);
            const isExpanded = expandedDay === jour;
            
            return (
              <motion.div
                key={jour}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: jourIndex * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(jour)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={20} />
                    <span className="font-bold text-lg">{jour}</span>
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                      {coursJour.length} cours
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                {/* Day Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-6"
                  >
                    {coursJour.length > 0 ? (
                      <div className="space-y-4">
                        {coursJour.map((emploi, index) => (
                          <motion.div
                            key={emploi.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 4, scale: 1.01 }}
                            className="relative p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                          >
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                            
                            <div className="relative z-10 flex items-start gap-4">
                              {/* Time Badge */}
                              <motion.div 
                                className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex flex-col items-center justify-center text-white shadow-md"
                                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.3 }}
                              >
                                <Clock size={16} className="mb-1" />
                                <div className="text-xs font-bold">
                                  {emploi.heure_debut.substring(0, 5)}
                                </div>
                                <div className="text-[10px] opacity-75">-</div>
                                <div className="text-xs font-bold">
                                  {emploi.heure_fin.substring(0, 5)}
                                </div>
                              </motion.div>

                              {/* Course Info */}
                              <div className="flex-1">
                                <h3 className="font-bold text-lg text-purple-900 mb-1">
                                  {emploi.cours?.nom}
                                </h3>
                                <p className="text-sm text-purple-700 font-mono mb-3">
                                  {emploi.cours?.code}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {emploi.classe && (
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                      <Users size={16} className="text-purple-600" />
                                      <span className="font-medium">{emploi.classe.nom}</span>
                                    </div>
                                  )}
                                  {emploi.salle && (
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                      <MapPin size={16} className="text-purple-600" />
                                      <span className="font-medium">Salle {emploi.salle}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">Aucun cours ce jour</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {emplois.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-lg"
        >
          <div className="inline-block p-6 bg-purple-50 rounded-full mb-4">
            <Calendar size={48} className="text-purple-300" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Aucun emploi du temps disponible</p>
          <p className="text-gray-400 text-sm mt-1">
            Votre planning sera affiché ici une fois configuré
          </p>
        </motion.div>
      )}
    </div>
  );
};
