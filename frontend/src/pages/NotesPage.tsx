import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Calendar, FileText } from 'lucide-react';
import api from '../services/api';

interface Note {
  id: number;
  note: number;
  coefficient: number;
  type_evaluation: string;
  date_evaluation: string;
  semestre: number;
  cours?: {
    nom: string;
    code: string;
    credits: number;
  };
}

interface Statistiques {
  moyenne_generale: number;
  total_notes: number;
  notes_par_semestre: {
    [key: string]: {
      moyenne: number;
      nombre_notes: number;
    };
  };
}

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemestre, setSelectedSemestre] = useState<number | 'all'>('all');

  useEffect(() => {
    fetchNotes();
    fetchStatistiques();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistiques = async () => {
    try {
      const response = await api.get('/notes/statistiques');
      setStatistiques(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const filteredNotes = selectedSemestre === 'all'
    ? notes
    : notes.filter(note => note.semestre === selectedSemestre);

  const getNoteColor = (note: number) => {
    if (note >= 16) return 'text-green-600 bg-green-50';
    if (note >= 14) return 'text-blue-600 bg-blue-50';
    if (note >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getMention = (moyenne: number) => {
    if (moyenne >= 16) return { text: 'Très Bien', color: 'text-green-600' };
    if (moyenne >= 14) return { text: 'Bien', color: 'text-blue-600' };
    if (moyenne >= 12) return { text: 'Assez Bien', color: 'text-purple-600' };
    if (moyenne >= 10) return { text: 'Passable', color: 'text-orange-600' };
    return { text: 'Insuffisant', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const mention = statistiques ? getMention(statistiques.moyenne_generale) : null;

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
              <Award className="text-blue-600" size={28} />
              Mes Notes
            </h1>
            <p className="text-sm text-gray-600">Consultez vos résultats et statistiques</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSemestre('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSemestre === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedSemestre(1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSemestre === 1
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semestre 1
            </button>
            <button
              onClick={() => setSelectedSemestre(2)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSemestre === 2
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semestre 2
            </button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      {statistiques && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Moyenne Générale</p>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {statistiques.moyenne_generale.toFixed(2)}
            </p>
            {mention && (
              <p className={`text-sm font-semibold ${mention.color}`}>
                {mention.text}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <FileText size={20} className="text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Total Notes</p>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {statistiques.total_notes}
            </p>
            <p className="text-xs text-gray-500">Évaluations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-green-100 rounded-lg">
                <Calendar size={20} className="text-green-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Semestres</p>
            </div>
            <div className="space-y-2">
              {Object.entries(statistiques.notes_par_semestre).map(([sem, data]) => (
                <div key={sem} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-xs font-medium text-gray-600">Semestre {sem}</span>
                  <span className="text-lg font-bold text-green-600">{data.moyenne.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Table des notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">\n                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cours</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Note</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Coef.</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Semestre</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotes.map((note, index) => (
                <motion.tr
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.02 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{note.cours?.nom}</div>
                      <div className="text-xs text-gray-500 font-mono">{note.cours?.code}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      {note.type_evaluation}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-lg font-bold ${getNoteColor(Number(note.note))}`}>
                      {Number(note.note).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-700">{note.coefficient}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      S{note.semestre}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <Calendar size={14} />
                      <span className="text-xs">
                        {new Date(note.date_evaluation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
              <Award size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Aucune note disponible</p>
            <p className="text-gray-500 text-sm mt-1">
              {selectedSemestre === 'all' 
                ? 'Vos notes apparaîtront ici une fois saisies'
                : `Aucune note pour le semestre ${selectedSemestre}`
              }
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
