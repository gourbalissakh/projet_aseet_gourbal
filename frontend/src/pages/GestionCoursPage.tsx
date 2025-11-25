import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, BookOpen } from 'lucide-react';
import api from '../services/api';

interface Cours {
  id: number;
  nom: string;
  code: string;
  description?: string;
  credits: number;
  coefficient: number;
  heures_cm?: number;
  heures_td?: number;
  heures_tp?: number;
  semestre: string;
  type: string;
  statut: string;
  enseignant_id?: number;
  niveau_id?: number;
  enseignant?: {
    id: number;
    nom: string;
    prenom: string;
  };
  niveau?: {
    nom: string;
  };
  classes?: Array<{
    id: number;
    nom: string;
    code: string;
  }>;
}

interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
}

interface Classe {
  id: number;
  nom: string;
  code: string;
  niveau_id: number;
}

interface Niveau {
  id: number;
  nom: string;
}

export const GestionCoursPage: React.FC = () => {
  const [cours, setCours] = useState<Cours[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    description: '',
    credits: '',
    coefficient: '',
    heures_cm: '',
    heures_td: '',
    heures_tp: '',
    semestre: '',
    type: 'obligatoire',
    statut: 'actif',
    enseignant_id: '',
    niveau_id: '',
    classes: [] as number[],
  });

  useEffect(() => {
    fetchCours();
    fetchEnseignants();
    fetchClasses();
    fetchNiveaux();
  }, []);

  const fetchCours = async () => {
    try {
      const response = await api.get('/cours');
      setCours(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
    }
  };

  const fetchEnseignants = async () => {
    try {
      const response = await api.get('/users?role=enseignant');
      setEnseignants(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    }
  };

  const fetchNiveaux = async () => {
    try {
      const response = await api.get('/niveaux');
      setNiveaux(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
    }
  };

  const handleClasseToggle = (classeId: number) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(classeId)
        ? prev.classes.filter(id => id !== classeId)
        : [...prev.classes, classeId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        nom: formData.nom,
        code: formData.code,
        description: formData.description || null,
        credits: parseInt(formData.credits),
        coefficient: parseFloat(formData.coefficient),
        heures_cm: formData.heures_cm ? parseInt(formData.heures_cm) : null,
        heures_td: formData.heures_td ? parseInt(formData.heures_td) : null,
        heures_tp: formData.heures_tp ? parseInt(formData.heures_tp) : null,
        semestre: formData.semestre,
        type: formData.type,
        statut: formData.statut,
        enseignant_id: formData.enseignant_id ? parseInt(formData.enseignant_id) : null,
        niveau_id: formData.niveau_id ? parseInt(formData.niveau_id) : null,
        classes: formData.classes,
      };

      if (editingId) {
        await api.put(`/cours/${editingId}`, dataToSend);
      } else {
        await api.post('/cours', dataToSend);
      }

      fetchCours();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        alert(axiosError.response?.data?.message || 'Erreur lors de la sauvegarde du cours');
      } else {
        alert('Erreur lors de la sauvegarde du cours');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coursItem: Cours) => {
    setEditingId(coursItem.id);
    setFormData({
      nom: coursItem.nom,
      code: coursItem.code,
      description: coursItem.description || '',
      credits: coursItem.credits.toString(),
      coefficient: coursItem.coefficient.toString(),
      heures_cm: coursItem.heures_cm?.toString() || '',
      heures_td: coursItem.heures_td?.toString() || '',
      heures_tp: coursItem.heures_tp?.toString() || '',
      semestre: coursItem.semestre,
      type: coursItem.type,
      statut: coursItem.statut,
      enseignant_id: coursItem.enseignant_id?.toString() || '',
      niveau_id: coursItem.niveau_id?.toString() || '',
      classes: coursItem.classes?.map(c => c.id) || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    try {
      await api.delete(`/cours/${id}`);
      fetchCours();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du cours');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      code: '',
      description: '',
      credits: '',
      coefficient: '',
      heures_cm: '',
      heures_td: '',
      heures_tp: '',
      semestre: '',
      type: 'obligatoire',
      statut: 'actif',
      enseignant_id: '',
      niveau_id: '',
      classes: [],
    });
    setEditingId(null);
  };

  const filteredCours = cours.filter(coursItem =>
    coursItem.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coursItem.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <BookOpen className="text-orange-600" />
              Gestion des Cours
            </h1>
            <p className="text-gray-600 mt-2">Gérez les cours et leurs affectations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Ajouter un cours
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800">
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Code</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Crédits</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Coef.</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Semestre</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Enseignant</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Classes</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCours.map((coursItem, index) => (
                  <motion.tr
                    key={coursItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-200 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="font-mono text-orange-700 font-bold text-sm">{coursItem.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-gray-900">{coursItem.nom}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                        {coursItem.credits}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-gray-900">{coursItem.coefficient}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                        {coursItem.semestre}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600">
                      {coursItem.enseignant ? `${coursItem.enseignant.prenom} ${coursItem.enseignant.nom}` : '-'}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {coursItem.classes?.slice(0, 2).map(classe => (
                          <span key={classe.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                            {classe.code}
                          </span>
                        ))}
                        {coursItem.classes && coursItem.classes.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            +{coursItem.classes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(coursItem)}
                          className="p-2.5 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(coursItem.id)}
                          className="p-2.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCours.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-orange-50 rounded-full mb-4">
                <BookOpen size={48} className="text-orange-300" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Aucun cours trouvé</p>
              <p className="text-gray-400 text-sm mt-1">Commencez par ajouter un nouveau cours</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Modifier' : 'Ajouter'} un cours
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informations de base */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Informations de base</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: PWEB-L1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: Programmation Web"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Description du cours"
                    rows={3}
                  />
                </div>
              </div>

              {/* Crédits et coefficient */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Crédits et évaluation</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crédits <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coefficient <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      step="0.5"
                      min="0.5"
                      value={formData.coefficient}
                      onChange={(e) => setFormData({ ...formData, coefficient: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semestre <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.semestre}
                      onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      <option value="S1">Semestre 1</option>
                      <option value="S2">Semestre 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="obligatoire">Obligatoire</option>
                      <option value="optionnel">Optionnel</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Volume horaire */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Volume horaire</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heures CM
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.heures_cm}
                      onChange={(e) => setFormData({ ...formData, heures_cm: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heures TD
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.heures_td}
                      onChange={(e) => setFormData({ ...formData, heures_td: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heures TP
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.heures_tp}
                      onChange={(e) => setFormData({ ...formData, heures_tp: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Affectations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Affectations</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enseignant
                    </label>
                    <select
                      value={formData.enseignant_id}
                      onChange={(e) => setFormData({ ...formData, enseignant_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un enseignant</option>
                      {enseignants.map((enseignant) => (
                        <option key={enseignant.id} value={enseignant.id}>
                          {enseignant.prenom} {enseignant.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau
                    </label>
                    <select
                      value={formData.niveau_id}
                      onChange={(e) => setFormData({ ...formData, niveau_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un niveau</option>
                      {niveaux.map((niveau) => (
                        <option key={niveau.id} value={niveau.id}>
                          {niveau.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classes <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {classes.length === 0 ? (
                      <p className="text-gray-500 text-sm">Aucune classe disponible</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {classes.map((classe) => (
                          <label
                            key={classe.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={formData.classes.includes(classe.id)}
                              onChange={() => handleClasseToggle(classe.id)}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">{classe.code}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
