import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Grid } from 'lucide-react';
import api from '../services/api';

interface Classe {
  id: number;
  nom: string;
  code: string;
  niveau_id: number;
  filiere_id: number;
  capacite?: number;
  effectif?: number;
  salle_principale?: string;
  statut?: string;
  niveau?: {
    nom: string;
  };
  filiere?: {
    nom: string;
    code: string;
  };
}

interface Niveau {
  id: number;
  nom: string;
  filiere_id: number;
  filiere?: {
    nom: string;
    code: string;
  };
}

interface Filiere {
  id: number;
  nom: string;
  code: string;
}

export const GestionClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    niveau_id: '',
    filiere_id: '',
    capacite: '',
    salle_principale: '',
    statut: 'active',
  });

  useEffect(() => {
    fetchClasses();
    fetchFilieres();
    fetchNiveaux();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    }
  };

  const fetchFilieres = async () => {
    try {
      const response = await api.get('/filieres');
      setFilieres(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des filières:', error);
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

  const handleFiliereChange = (filiereId: string) => {
    setFormData({ ...formData, filiere_id: filiereId, niveau_id: '' });
  };

  const filteredNiveaux = niveaux.filter(n => n.filiere_id?.toString() === formData.filiere_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        capacite: formData.capacite ? parseInt(formData.capacite) : null,
        niveau_id: parseInt(formData.niveau_id),
        filiere_id: parseInt(formData.filiere_id),
      };

      if (editingId) {
        await api.put(`/classes/${editingId}`, dataToSend);
      } else {
        await api.post('/classes', dataToSend);
      }

      fetchClasses();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la classe');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classe: Classe) => {
    setEditingId(classe.id);
    setFormData({
      nom: classe.nom,
      code: classe.code,
      niveau_id: classe.niveau_id.toString(),
      filiere_id: classe.filiere_id.toString(),
      capacite: classe.capacite?.toString() || '',
      salle_principale: classe.salle_principale || '',
      statut: classe.statut || 'active',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) return;

    try {
      await api.delete(`/classes/${id}`);
      fetchClasses();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la classe');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      code: '',
      niveau_id: '',
      filiere_id: '',
      capacite: '',
      salle_principale: '',
      statut: 'active',
    });
    setEditingId(null);
  };

  const filteredClasses = classes.filter(classe =>
    classe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.filiere?.nom.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Grid className="text-green-600" />
              Gestion des Classes
            </h1>
            <p className="text-gray-600 mt-2">Gérez les classes de l'établissement</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Ajouter une classe
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <tr className="bg-gradient-to-r from-green-600 via-green-700 to-green-800">
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Code</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Filière</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Effectif</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Salle</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClasses.map((classe, index) => (
                  <motion.tr
                    key={classe.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-all duration-200 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-mono text-green-700 font-bold text-sm">{classe.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-gray-900">{classe.nom}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                        {classe.filiere?.code}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600">{classe.niveau?.nom}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-bold text-gray-900">{classe.effectif || 0}</span>
                      {classe.capacite && <span className="text-gray-500"> / {classe.capacite}</span>}
                    </td>
                    <td className="px-6 py-5 text-gray-600">{classe.salle_principale || '-'}</td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(classe)}
                          className="p-2.5 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(classe.id)}
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

          {filteredClasses.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-green-50 rounded-full mb-4">
                <Grid size={48} className="text-green-300" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Aucune classe trouvée</p>
              <p className="text-gray-400 text-sm mt-1">Commencez par ajouter une nouvelle classe</p>
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
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Modifier' : 'Ajouter'} une classe
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: INFO-L1-A"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Licence 1 Info A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filière <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.filiere_id}
                    onChange={(e) => handleFiliereChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((filiere) => (
                      <option key={filiere.id} value={filiere.id}>
                        {filiere.code} - {filiere.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.niveau_id}
                    onChange={(e) => setFormData({ ...formData, niveau_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={!formData.filiere_id}
                  >
                    <option value="">Sélectionner un niveau</option>
                    {filteredNiveaux.map((niveau) => (
                      <option key={niveau.id} value={niveau.id}>
                        {niveau.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacité
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacite}
                    onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salle principale
                  </label>
                  <input
                    type="text"
                    value={formData.salle_principale}
                    onChange={(e) => setFormData({ ...formData, salle_principale: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Salle A101"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
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
