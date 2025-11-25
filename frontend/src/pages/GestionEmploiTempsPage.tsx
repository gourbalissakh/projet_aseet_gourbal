import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Calendar, Clock } from 'lucide-react';
import api from '../services/api';

interface EmploiTemps {
  id: number;
  code: string;
  classe_id: number;
  cours_id: number;
  enseignant_id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  salle?: string;
  type: string;
  statut: string;
  date_debut?: string;
  date_fin?: string;
  observations?: string;
  classe?: {
    nom: string;
    code: string;
  };
  cours?: {
    nom: string;
    code: string;
  };
  enseignant?: {
    nom: string;
    prenom: string;
  };
}

interface Classe {
  id: number;
  nom: string;
  code: string;
}

interface Cours {
  id: number;
  nom: string;
  code: string;
}

interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const GestionEmploiTempsPage: React.FC = () => {
  const [emplois, setEmplois] = useState<EmploiTemps[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [cours, setCours] = useState<Cours[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [selectedClasseId, setSelectedClasseId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const [formData, setFormData] = useState({
    code: '',
    classe_id: '',
    cours_id: '',
    enseignant_id: '',
    jour: '',
    heure_debut: '',
    heure_fin: '',
    salle: '',
    type: 'CM',
    statut: 'planifie',
    date_debut: '',
    date_fin: '',
    observations: '',
  });

  const fetchEmplois = useCallback(async () => {
    if (!selectedClasseId) return;
    try {
      const response = await api.get(`/emplois-temps?classe_id=${selectedClasseId}`);
      setEmplois(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des emplois du temps:', error);
    }
  }, [selectedClasseId]);

  useEffect(() => {
    fetchClasses();
    fetchCours();
    fetchEnseignants();
  }, []);

  useEffect(() => {
    if (selectedClasseId) {
      fetchEmplois();
    }
  }, [selectedClasseId, fetchEmplois]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        code: formData.code,
        classe_id: parseInt(formData.classe_id),
        cours_id: parseInt(formData.cours_id),
        enseignant_id: parseInt(formData.enseignant_id),
        jour: formData.jour,
        heure_debut: formData.heure_debut,
        heure_fin: formData.heure_fin,
        salle: formData.salle || null,
        type: formData.type,
        statut: formData.statut,
        date_debut: formData.date_debut || null,
        date_fin: formData.date_fin || null,
        observations: formData.observations || null,
      };

      if (editingId) {
        await api.put(`/emplois-temps/${editingId}`, dataToSend);
      } else {
        await api.post('/emplois-temps', dataToSend);
      }

      fetchEmplois();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'emploi du temps');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emploi: EmploiTemps) => {
    setEditingId(emploi.id);
    setFormData({
      code: emploi.code,
      classe_id: emploi.classe_id.toString(),
      cours_id: emploi.cours_id.toString(),
      enseignant_id: emploi.enseignant_id.toString(),
      jour: emploi.jour,
      heure_debut: emploi.heure_debut,
      heure_fin: emploi.heure_fin,
      salle: emploi.salle || '',
      type: emploi.type,
      statut: emploi.statut,
      date_debut: emploi.date_debut || '',
      date_fin: emploi.date_fin || '',
      observations: emploi.observations || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet emploi du temps ?')) return;

    try {
      await api.delete(`/emplois-temps/${id}`);
      fetchEmplois();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'emploi du temps');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      classe_id: '',
      cours_id: '',
      enseignant_id: '',
      jour: '',
      heure_debut: '',
      heure_fin: '',
      salle: '',
      type: 'CM',
      statut: 'planifie',
      date_debut: '',
      date_fin: '',
      observations: '',
    });
    setEditingId(null);
  };

  const getEmploiForSlot = (jour: string, heure: string) => {
    return emplois.find(e => {
      if (e.jour !== jour) return false;
      const debut = e.heure_debut.substring(0, 5);
      return debut === heure;
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CM': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'TD': return 'bg-green-100 border-green-500 text-green-800';
      case 'TP': return 'bg-purple-100 border-purple-500 text-purple-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="text-teal-600" />
              Gestion des Emplois du Temps
            </h1>
            <p className="text-gray-600 mt-2">Planifiez et visualisez les emplois du temps par classe</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Ajouter un créneau
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner une classe <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClasseId}
                onChange={(e) => setSelectedClasseId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">-- Choisir une classe --</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.code} - {classe.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-6 py-3 rounded-lg transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Calendar size={20} className="inline mr-2" />
                Calendrier
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-3 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {!selectedClasseId ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg">Veuillez sélectionner une classe pour voir son emploi du temps</p>
          </div>
        ) : viewMode === 'calendar' ? (
          /* Calendar View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left min-w-[100px]">
                      <Clock size={18} className="inline mr-2" />
                      Horaire
                    </th>
                    {JOURS.map((jour) => (
                      <th key={jour} className="border border-gray-300 px-4 py-3 text-center min-w-[180px]">
                        {jour}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HEURES.map((heure) => (
                    <tr key={heure} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-700 bg-gray-50">
                        {heure}
                      </td>
                      {JOURS.map((jour) => {
                        const emploi = getEmploiForSlot(jour, heure);
                        return (
                          <td key={`${jour}-${heure}`} className="border border-gray-300 p-2">
                            {emploi ? (
                              <div
                                className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all ${getTypeColor(
                                  emploi.type
                                )}`}
                                onClick={() => handleEdit(emploi)}
                              >
                                <div className="font-semibold text-sm mb-1">{emploi.cours?.code}</div>
                                <div className="text-xs mb-1">{emploi.cours?.nom}</div>
                                <div className="text-xs text-gray-600">
                                  {emploi.heure_debut.substring(0, 5)} - {emploi.heure_fin.substring(0, 5)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {emploi.enseignant?.prenom} {emploi.enseignant?.nom}
                                </div>
                                {emploi.salle && (
                                  <div className="text-xs font-semibold mt-1">📍 {emploi.salle}</div>
                                )}
                                <div className="text-xs font-semibold mt-1 inline-block px-2 py-1 bg-white rounded">
                                  {emploi.type}
                                </div>
                              </div>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800">
                    <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Jour</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Horaire</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Cours</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Enseignant</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Salle</th>
                    <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Type</th>
                    <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {emplois.map((emploi, index) => (
                    <motion.tr
                      key={emploi.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gradient-to-r hover:from-teal-50 hover:to-transparent transition-all duration-200 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="font-bold text-gray-900">{emploi.jour}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-600 font-mono text-sm">
                        {emploi.heure_debut.substring(0, 5)} - {emploi.heure_fin.substring(0, 5)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-semibold text-gray-900">{emploi.cours?.code}</div>
                        <div className="text-sm text-gray-600">{emploi.cours?.nom}</div>
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {emploi.enseignant?.prenom} {emploi.enseignant?.nom}
                      </td>
                      <td className="px-6 py-5 text-gray-600">{emploi.salle || '-'}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getTypeColor(emploi.type)}`}>
                          {emploi.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(emploi)}
                            className="p-2.5 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(emploi.id)}
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

            {emplois.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block p-6 bg-teal-50 rounded-full mb-4">
                  <Calendar size={48} className="text-teal-300" />
                </div>
                <p className="text-gray-500 text-lg font-medium">Aucun emploi du temps pour cette classe</p>
                <p className="text-gray-400 text-sm mt-1">Commencez par ajouter un nouveau créneau</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Modifier' : 'Ajouter'} un créneau
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Ex: EDT-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classe <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.classe_id}
                    onChange={(e) => setFormData({ ...formData, classe_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.code} - {classe.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cours <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.cours_id}
                    onChange={(e) => setFormData({ ...formData, cours_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un cours</option>
                    {cours.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enseignant <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.enseignant_id}
                    onChange={(e) => setFormData({ ...formData, enseignant_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un enseignant</option>
                    {enseignants.map((ens) => (
                      <option key={ens.id} value={ens.id}>
                        {ens.prenom} {ens.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jour <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.jour}
                    onChange={(e) => setFormData({ ...formData, jour: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un jour</option>
                    {JOURS.map((jour) => (
                      <option key={jour} value={jour}>
                        {jour}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="CM">CM (Cours Magistral)</option>
                    <option value="TD">TD (Travaux Dirigés)</option>
                    <option value="TP">TP (Travaux Pratiques)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure début <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.heure_debut}
                    onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.heure_fin}
                    onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salle
                  </label>
                  <input
                    type="text"
                    value={formData.salle}
                    onChange={(e) => setFormData({ ...formData, salle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Ex: A101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="CM">CM - Cours Magistral</option>
                    <option value="TD">TD - Travaux Dirigés</option>
                    <option value="TP">TP - Travaux Pratiques</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="planifie">Planifié</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date début
                  </label>
                  <input
                    type="date"
                    value={formData.date_debut}
                    onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date fin
                  </label>
                  <input
                    type="date"
                    value={formData.date_fin}
                    onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observations
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Remarques ou notes supplémentaires"
                  rows={3}
                />
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
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
