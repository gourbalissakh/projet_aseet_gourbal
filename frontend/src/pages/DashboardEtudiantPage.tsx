import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock,
  User,
  GraduationCap,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

interface DashboardStats {
  totalCours: number;
  moyenneGenerale: number;
  coursAujourdhui: number;
  notesRecentes: number;
}

interface Cours {
  id: number;
  nom: string;
  code: string;
  credits: number;
  enseignant?: {
    nom: string;
    prenom: string;
  };
}

interface Note {
  id: number;
  note: number;
  coefficient: number;
  type_evaluation: string;
  date_evaluation: string;
  cours?: {
    nom: string;
    code: string;
  };
}

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

export const DashboardEtudiantPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalCours: 0,
    moyenneGenerale: 0,
    coursAujourdhui: 0,
    notesRecentes: 0
  });
  const [cours, setCours] = useState<Cours[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [emploiTemps, setEmploiTemps] = useState<EmploiTemps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les cours de l'étudiant
      const coursRes = await api.get('/cours');
      const mesCours = coursRes.data.data || [];
      setCours(mesCours);

      // Récupérer les notes
      const notesRes = await api.get('/notes');
      const mesNotes = notesRes.data.data || [];
      setNotes(mesNotes);

      // Récupérer l'emploi du temps (filtré automatiquement côté backend)
      const emploiRes = await api.get('/emplois-temps');
      const emploiData = emploiRes.data.data || [];
      setEmploiTemps(emploiData);

      // Calculer la moyenne générale
      const moyenne = mesNotes.length > 0
        ? mesNotes.reduce((sum: number, note: Note) => sum + (Number(note.note) * Number(note.coefficient)), 0) /
          mesNotes.reduce((sum: number, note: Note) => sum + Number(note.coefficient), 0)
        : 0;

      // Jour actuel
      const jourActuel = JOURS[new Date().getDay() - 1];
      const coursAujourdhui = emploiData.filter((e: EmploiTemps) => e.jour === jourActuel).length;

      setStats({
        totalCours: mesCours.length,
        moyenneGenerale: Math.round(moyenne * 100) / 100,
        coursAujourdhui,
        notesRecentes: mesNotes.slice(0, 5).length
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Cours',
      value: stats.totalCours,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Moyenne Générale',
      value: stats.moyenneGenerale.toFixed(2),
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: "Cours Aujourd'hui",
      value: stats.coursAujourdhui,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Notes Récentes',
      value: stats.notesRecentes,
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const getEmploiDuJour = () => {
    const jourActuel = JOURS[new Date().getDay() - 1];
    return emploiTemps
      .filter(e => e.jour === jourActuel)
      .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));
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
      {/* Header avec informations étudiant */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Bienvenue, {user?.prenom} {user?.nom}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-blue-600" />
                  <span>{user?.classe?.nom || 'Non assigné'}</span>
                </span>
                <span className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="font-mono">{user?.matricule}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Aujourd'hui</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 ${stat.bgColor} rounded-lg`}>
                <stat.icon size={20} className={stat.textColor} />
              </div>
            </div>
            <h3 className="text-gray-600 text-xs font-medium mb-1">{stat.title}</h3>
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emploi du temps du jour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Emploi du Temps</h2>
              <p className="text-xs text-gray-500">Cours d'aujourd'hui</p>
            </div>
          </div>

          <div className="space-y-2">
            {getEmploiDuJour().length > 0 ? (
              getEmploiDuJour().map((emploi, index) => (
                <motion.div
                  key={emploi.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{emploi.cours?.nom}</h4>
                      <p className="text-xs text-gray-500 mb-2">{emploi.cours?.code}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {emploi.heure_debut.substring(0, 5)} - {emploi.heure_fin.substring(0, 5)}
                        </span>
                        {emploi.salle && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                            Salle {emploi.salle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {emploi.enseignant && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        Prof. {emploi.enseignant.prenom} {emploi.enseignant.nom}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">Aucun cours aujourd'hui</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Notes récentes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Award size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Notes Récentes</h2>
              <p className="text-xs text-gray-500">Dernières évaluations</p>
            </div>
          </div>

          <div className="space-y-2">
            {notes.slice(0, 5).length > 0 ? (
              notes.slice(0, 5).map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{note.cours?.nom}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                          {note.type_evaluation}
                        </span>
                        <span>Coef. {note.coefficient}</span>
                        <span>{new Date(note.date_evaluation).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`text-2xl font-bold ${
                        Number(note.note) >= 16 ? 'text-green-600' :
                        Number(note.note) >= 14 ? 'text-blue-600' :
                        Number(note.note) >= 10 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {Number(note.note).toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 text-center">/20</div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Award size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">Aucune note disponible</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Mes cours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BookOpen size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Mes Cours</h2>
            <p className="text-xs text-gray-500">Liste des cours inscrits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cours.map((coursItem, index) => (
            <motion.div
              key={coursItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.03 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">{coursItem.nom}</h4>
                  <p className="text-xs text-gray-500 font-mono">{coursItem.code}</p>
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  {coursItem.credits} ECTS
                </div>
              </div>
              {coursItem.enseignant && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Prof. {coursItem.enseignant.prenom} {coursItem.enseignant.nom}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {cours.length === 0 && (
          <div className="text-center py-8">
            <BookOpen size={40} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500">Aucun cours inscrit</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
