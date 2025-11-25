import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Calendar, Clock } from 'lucide-react';
import { emploiTempsService } from '../services/emploiTemps.service';
import { classeService } from '../services/classe.service';
import { coursService } from '../services/cours.service';
import type { EmploiTemps, Classe, Cours } from '../types';
import toast from 'react-hot-toast';

export const EmploisTempsPage: React.FC = () => {
  const [emploisTemps, setEmploisTemps] = useState<EmploiTemps[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmploi, setEditingEmploi] = useState<EmploiTemps | null>(null);
  const [formData, setFormData] = useState({
    classe_id: 0,
    cours_id: 0,
    jour: 'Lundi',
    heure_debut: '',
    heure_fin: '',
    salle: ''
  });

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [emploisData, classesData, coursData] = await Promise.all([
        emploiTempsService.getAll(),
        classeService.getAll(),
        coursService.getAll(),
      ]);
      setEmploisTemps(Array.isArray(emploisData) ? emploisData : []);
      setClasses(Array.isArray(classesData) ? classesData : []);
      setCours(Array.isArray(coursData) ? coursData : []);
    } catch {
      toast.error('Erreur lors du chargement des données');
      setEmploisTemps([]);
      setClasses([]);
      setCours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmploi) {
        await emploiTempsService.update(editingEmploi.id, formData);
        toast.success('Emploi du temps modifié avec succès');
      } else {
        await emploiTempsService.create(formData);
        toast.success('Emploi du temps créé avec succès');
      }
      loadData();
      closeModal();
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet emploi du temps ?')) {
      try {
        await emploiTempsService.delete(id);
        toast.success('Emploi du temps supprimé avec succès');
        loadData();
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (emploi?: EmploiTemps) => {
    if (emploi) {
      setEditingEmploi(emploi);
      setFormData({
        classe_id: emploi.classe_id,
        cours_id: emploi.cours_id,
        jour: emploi.jour,
        heure_debut: emploi.heure_debut,
        heure_fin: emploi.heure_fin,
        salle: emploi.salle || ''
      });
    } else {
      setEditingEmploi(null);
      setFormData({
        classe_id: classes[0]?.id || 0,
        cours_id: cours[0]?.id || 0,
        jour: 'Lundi',
        heure_debut: '',
        heure_fin: '',
        salle: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmploi(null);
  };

  const filteredEmplois = emploisTemps.filter(e =>
    e.classe?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cours?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.jour.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getJourColor = (jour: string) => {
    const colors: Record<string, string> = {
      'Lundi': 'from-blue-500 to-cyan-500',
      'Mardi': 'from-purple-500 to-pink-500',
      'Mercredi': 'from-green-500 to-emerald-500',
      'Jeudi': 'from-orange-500 to-red-500',
      'Vendredi': 'from-indigo-500 to-purple-500',
      'Samedi': 'from-pink-500 to-rose-500'
    };
    return colors[jour] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-rose-50/20 p-8">
      <div className="max-w-7xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Emplois du temps</h1>
              <p className="text-gray-600">Planifiez les cours pour chaque classe</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Nouveau Planning
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par classe, cours ou jour..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmplois.map((emploi, index) => (
            <motion.div
              key={emploi.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getJourColor(emploi.jour)} rounded-xl flex items-center justify-center`}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal(emploi)}
                    className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(emploi.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500">Jour</span>
                  <h3 className="text-lg font-bold text-gray-900">{emploi.jour}</h3>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 font-medium">
                    {emploi.heure_debut} - {emploi.heure_fin}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Classe</span>
                    <p className="font-semibold text-gray-900">{emploi.classe?.nom || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Cours</span>
                    <p className="font-semibold text-gray-900">{emploi.cours?.nom || 'N/A'}</p>
                  </div>
                  {emploi.salle && (
                    <div>
                      <span className="text-xs text-gray-500">Salle</span>
                      <p className="font-semibold text-gray-900">{emploi.salle}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEmplois.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
            <p className="text-gray-500 text-lg">Aucun emploi du temps trouvé</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEmploi ? 'Modifier l\'Emploi du temps' : 'Nouvel Emploi du temps'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Classe *
                </label>
                <select
                  value={formData.classe_id}
                  onChange={(e) => setFormData({ ...formData, classe_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cours *
                </label>
                <select
                  value={formData.cours_id}
                  onChange={(e) => setFormData({ ...formData, cours_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Sélectionner un cours</option>
                  {cours.map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jour *
                </label>
                <select
                  value={formData.jour}
                  onChange={(e) => setFormData({ ...formData, jour: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  {jours.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Heure début *
                  </label>
                  <input
                    type="time"
                    value={formData.heure_debut}
                    onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Heure fin *
                  </label>
                  <input
                    type="time"
                    value={formData.heure_fin}
                    onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salle
                </label>
                <input
                  type="text"
                  value={formData.salle}
                  onChange={(e) => setFormData({ ...formData, salle: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Ex: Salle A101"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {editingEmploi ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
