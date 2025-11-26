import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import axiosInstance from '../../services/api';
import toast from 'react-hot-toast';

interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
  classe_id: number;
  classe?: {
    id: number;
    nom: string;
    code: string;
  };
}

interface Cours {
  id: number;
  nom: string;
  code: string;
  credits: number;
  classe_id: number;
  classe?: {
    id: number;
    nom: string;
    code: string;
  };
}

interface Note {
  id?: number;
  etudiant_id: number;
  cours_id: number;
  note: number;
  type: string;
  coefficient: number;
  semestre: string;
  date_evaluation: string;
  observation?: string;
}

interface EtudiantWithNotes extends Etudiant {
  notes: Note[];
}

export const GestionNotesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [cours, setCours] = useState<Cours[]>([]);
  const [etudiants, setEtudiants] = useState<EtudiantWithNotes[]>([]);
  const [selectedCours, setSelectedCours] = useState<number | null>(null);
  const [selectedClasse, setSelectedClasse] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    note: 0,
    type: 'Examen',
    coefficient: 1,
    semestre: 'S1',
    date_evaluation: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCours && selectedClasse) {
      fetchEtudiants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCours, selectedClasse]);

  const fetchCours = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cours');
      
      // Filtrer les cours de l'enseignant connecté
      const mesCours = response.data.data.filter(
        (c: Cours & { enseignant_id?: number }) => c.enseignant_id === user?.id
      );
      
      setCours(mesCours);
      
      // Si aucun cours sélectionné et qu'il y a des cours, sélectionner le premier
      if (mesCours.length > 0 && !selectedCours) {
        setSelectedCours(mesCours[0].id);
        setSelectedClasse(mesCours[0].classe_id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      toast.error('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les utilisateurs et toutes les notes (avec limite élevée pour récupérer tous les étudiants)
      const [usersRes, notesRes] = await Promise.all([
        axiosInstance.get('/users?per_page=1000'),
        axiosInstance.get('/notes?per_page=1000')
      ]);

      // Filtrer uniquement les étudiants de la classe du cours sélectionné
      const etudiantsDeClasse = usersRes.data.data.filter(
        (u: Etudiant & { role?: string }) => u.role === 'etudiant' && u.classe_id === selectedClasse
      );

      // Associer les notes de ce cours spécifique à chaque étudiant
      const etudiantsWithNotes = etudiantsDeClasse.map((etudiant: Etudiant) => ({
        ...etudiant,
        notes: notesRes.data.data.filter(
          (n: Note) => n.etudiant_id === etudiant.id && n.cours_id === selectedCours
        )
      }));

      setEtudiants(etudiantsWithNotes);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
      toast.error('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (etudiantId: number) => {
    try {
      if (!newNote.note || newNote.note < 0 || newNote.note > 20) {
        toast.error('La note doit être entre 0 et 20');
        return;
      }

      const noteData = {
        ...newNote,
        etudiant_id: etudiantId,
        cours_id: selectedCours
      };

      await axiosInstance.post('/notes', noteData);
      toast.success('Note ajoutée avec succès');
      setShowAddModal(false);
      setNewNote({
        note: 0,
        type: 'Examen',
        coefficient: 1,
        semestre: 'S1',
        date_evaluation: new Date().toISOString().split('T')[0]
      });
      fetchEtudiants();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
      toast.error('Erreur lors de l\'ajout de la note');
    }
  };

  const handleUpdateNote = async (noteId: number) => {
    try {
      if (!editingNote?.note || editingNote.note < 0 || editingNote.note > 20) {
        toast.error('La note doit être entre 0 et 20');
        return;
      }

      await axiosInstance.put(`/notes/${noteId}`, editingNote);
      toast.success('Note modifiée avec succès');
      setEditingNote(null);
      fetchEtudiants();
    } catch (error) {
      console.error('Erreur lors de la modification de la note:', error);
      toast.error('Erreur lors de la modification de la note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

    try {
      await axiosInstance.delete(`/notes/${noteId}`);
      toast.success('Note supprimée avec succès');
      fetchEtudiants();
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      toast.error('Erreur lors de la suppression de la note');
    }
  };

  const filteredEtudiants = etudiants.filter(etudiant =>
    `${etudiant.prenom} ${etudiant.nom} ${etudiant.matricule}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const selectedCoursData = cours.find(c => c.id === selectedCours);

  const calculateMoyenne = (notes: Note[]): number => {
    if (notes.length === 0) return 0;
    
    const totalCoef = notes.reduce((sum, n) => sum + n.coefficient, 0);
    const totalNote = notes.reduce((sum, n) => sum + (n.note * n.coefficient), 0);
    
    return totalCoef > 0 ? totalNote / totalCoef : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 rounded-2xl shadow-xl p-8 relative overflow-hidden"
      >
        {/* Animated background elements */}
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
        
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion des Notes</h1>
            <p className="text-purple-100 mt-1">
              Attribuez et gérez les notes de vos étudiants
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sélection du cours et de la classe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sélection du cours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un cours
            </label>
            <select
              value={selectedCours || ''}
              onChange={(e) => {
                const coursId = Number(e.target.value);
                setSelectedCours(coursId);
                const coursSelectionne = cours.find(c => c.id === coursId);
                if (coursSelectionne) {
                  setSelectedClasse(coursSelectionne.classe_id);
                }
                setSearchTerm(''); // Réinitialiser la recherche
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choisir un cours...</option>
              {cours.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.nom} ({c.classe?.nom})
                </option>
              ))}
            </select>
          </div>

          {/* Info cours sélectionné */}
          {selectedCoursData && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 shadow-sm overflow-hidden relative group"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md relative z-10"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <GraduationCap className="text-white" size={24} />
              </motion.div>
              <div className="relative z-10">
                <p className="font-semibold text-gray-900">{selectedCoursData.nom}</p>
                <p className="text-sm text-gray-600">
                  {selectedCoursData.credits} crédits • Classe: {selectedCoursData.classe?.nom}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Liste des étudiants */}
      {selectedCours && selectedClasse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Barre de recherche */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tableau des étudiants et notes */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Matricule
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Moyenne
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        Chargement...
                      </div>
                    </td>
                  </tr>
                ) : filteredEtudiants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
                      <p className="text-gray-500 font-medium">
                        {searchTerm 
                          ? 'Aucun étudiant trouvé avec ce critère de recherche'
                          : 'Aucun étudiant inscrit dans cette classe'
                        }
                      </p>
                      {selectedCoursData && (
                        <p className="text-sm text-gray-400 mt-2">
                          Cours: {selectedCoursData.nom} • Classe: {selectedCoursData.classe?.nom}
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredEtudiants.map((etudiant) => {
                    const moyenne = calculateMoyenne(etudiant.notes);
                    
                    return (
                      <motion.tr
                        key={etudiant.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-gray-100 hover:bg-purple-50/50 transition-all duration-200 hover:shadow-sm"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-semibold text-purple-900 bg-purple-50 px-3 py-1 rounded-md">
                            {etudiant.matricule}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {etudiant.prenom.charAt(0)}{etudiant.nom.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {etudiant.prenom} {etudiant.nom}
                              </p>
                              <p className="text-xs text-gray-500">{etudiant.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {etudiant.notes.length === 0 ? (
                              <span className="text-sm text-gray-400 italic">Aucune note</span>
                            ) : (
                              etudiant.notes.map((note) => (
                                <div
                                  key={note.id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  {editingNote?.id === note.id ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        step="0.5"
                                        value={editingNote?.note ?? 0}
                                        onChange={(e) => editingNote && setEditingNote({
                                          ...editingNote,
                                          note: parseFloat(e.target.value)
                                        })}
                                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                                      />
                                      <span className="text-gray-500">/ 20</span>
                                      <button
                                        onClick={() => handleUpdateNote(note.id!)}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                      >
                                        <Save size={16} />
                                      </button>
                                      <button
                                        onClick={() => setEditingNote(null)}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <span className={`font-semibold ${
                                        note.note >= 10 ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {note.note.toFixed(2)}
                                      </span>
                                      <span className="text-gray-500">/ 20</span>
                                      <span className="text-xs text-gray-400">
                                        ({note.type}, coef: {note.coefficient})
                                      </span>
                                      <button
                                        onClick={() => setEditingNote(note)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteNote(note.id!)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {etudiant.notes.length > 0 ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-md ${
                              moyenne >= 10
                                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                                : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                            }`}>
                              {moyenne >= 10 ? (
                                <CheckCircle size={16} />
                              ) : (
                                <AlertCircle size={16} />
                              )}
                              {moyenne.toFixed(2)}
                            </motion.div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setNewNote({
                                  ...newNote,
                                  etudiant_id: etudiant.id,
                                  cours_id: selectedCours
                                });
                                setShowAddModal(true);
                              }}
                              className="p-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all shadow-md hover:shadow-lg"
                              title="Ajouter une note"
                            >
                              <Plus size={20} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Modal d'ajout de note */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Ajouter une note</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (sur 20)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={newNote.note}
                  onChange={(e) => setNewNote({ ...newNote, note: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'évaluation
                </label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Examen">Examen</option>
                  <option value="Contrôle">Contrôle</option>
                  <option value="TP">Travaux Pratiques</option>
                  <option value="TD">Travaux Dirigés</option>
                  <option value="Projet">Projet</option>
                  <option value="Oral">Oral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coefficient
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={newNote.coefficient}
                  onChange={(e) => setNewNote({ ...newNote, coefficient: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semestre
                </label>
                <select
                  value={newNote.semestre}
                  onChange={(e) => setNewNote({ ...newNote, semestre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="S1">Semestre 1</option>
                  <option value="S2">Semestre 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'évaluation
                </label>
                <input
                  type="date"
                  value={newNote.date_evaluation}
                  onChange={(e) => setNewNote({ ...newNote, date_evaluation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observation (optionnelle)
                </label>
                <textarea
                  value={newNote.observation || ''}
                  onChange={(e) => setNewNote({ ...newNote, observation: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Remarques, commentaires..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAddNote(newNote.etudiant_id!)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
