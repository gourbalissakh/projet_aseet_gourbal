import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';
import api from '../services/api';

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
  enseignant?: {
    nom: string;
    prenom: string;
  };
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export const MesEmploisTempsPage: React.FC = () => {
  const [emplois, setEmplois] = useState<EmploiTemps[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchEmplois();
  }, []);

  const fetchEmplois = async () => {
    try {
      const response = await api.get('/emplois-temps');
      setEmplois(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmploiForSlot = (jour: string, heure: string) => {
    return emplois.find(e => {
      const heureDebut = e.heure_debut.substring(0, 5);
      return e.jour === jour && heureDebut === heure;
    });
  };

  const getColorForCours = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              <Calendar className="text-blue-600" size={28} />
              Mon Emploi du Temps
            </h1>
            <p className="text-sm text-gray-600">Consultez votre planning hebdomadaire</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
      </motion.div>

      {viewMode === 'grid' ? (
        /* Vue Grille */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 border-r border-gray-200">
                    Heure
                  </th>
                  {JOURS.map(jour => (
                    <th
                      key={jour}
                      className="px-3 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
                    >
                      {jour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEURES.map((heure, heureIndex) => (
                  <tr key={heure} className="border-b border-gray-200">
                    <td className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 border-r border-gray-200">
                      {heure}
                    </td>
                    {JOURS.map((jour, jourIndex) => {
                      const emploi = getEmploiForSlot(jour, heure);
                      return (
                        <td
                          key={`${jour}-${heure}`}
                          className="px-2 py-2 border-r border-gray-200 last:border-r-0 align-top"
                        >
                          {emploi ? (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: (heureIndex * JOURS.length + jourIndex) * 0.01 }}
                              className={`p-2 rounded-lg bg-blue-50 border border-blue-200 text-gray-900 shadow-sm hover:shadow transition-all cursor-pointer`}
                            >
                              <div className="font-bold text-sm mb-1 line-clamp-2">
                                {emploi.cours?.nom}
                              </div>
                              <div className="text-xs opacity-90 mb-2">
                                {emploi.cours?.code}
                              </div>
                              <div className="flex items-center gap-1 text-xs opacity-90 mb-1">
                                <Clock size={12} />
                                <span>
                                  {emploi.heure_debut.substring(0, 5)} - {emploi.heure_fin.substring(0, 5)}
                                </span>
                              </div>
                              {emploi.salle && (
                                <div className="flex items-center gap-1 text-xs opacity-90 mb-1">
                                  <MapPin size={12} />
                                  <span>Salle {emploi.salle}</span>
                                </div>
                              )}
                              {emploi.enseignant && (
                                <div className="flex items-center gap-1 text-xs opacity-90">
                                  <User size={12} />
                                  <span className="truncate">
                                    {emploi.enseignant.prenom} {emploi.enseignant.nom}
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          ) : (
                            <div className="h-full min-h-[80px]"></div>
                          )}
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
        /* Vue Liste */
        <div className="space-y-6">
          {JOURS.map((jour, jourIndex) => {
            const coursJour = emplois
              .filter(e => e.jour === jour)
              .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));

            return (
              <motion.div
                key={jour}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: jourIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getColorForCours(jourIndex)}`}></div>
                  {jour}
                </h2>

                {coursJour.length > 0 ? (
                  <div className="space-y-3">
                    {coursJour.map((emploi, index) => (
                      <motion.div
                        key={emploi.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className={`p-4 rounded-xl bg-gradient-to-r ${getColorForCours(emploi.id)} bg-opacity-10 border-l-4 hover:shadow-md transition-all`}
                        style={{ borderColor: `var(--tw-gradient-from)` }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <BookOpen size={20} className="text-purple-600" />
                              <h3 className="font-bold text-lg text-gray-900">
                                {emploi.cours?.nom}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 font-mono mb-3">
                              {emploi.cours?.code}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock size={16} className="text-purple-600" />
                                <span>
                                  {emploi.heure_debut.substring(0, 5)} - {emploi.heure_fin.substring(0, 5)}
                                </span>
                              </div>
                              {emploi.salle && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin size={16} className="text-purple-600" />
                                  <span>Salle {emploi.salle}</span>
                                </div>
                              )}
                              {emploi.enseignant && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <User size={16} className="text-purple-600" />
                                  <span>
                                    Prof. {emploi.enseignant.prenom} {emploi.enseignant.nom}
                                  </span>
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
                    <p className="text-sm">Aucun cours ce jour</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {emplois.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
