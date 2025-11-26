import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Award, 
  Clock,
  User,
  GraduationCap,
  FileText,
  ChevronDown,
  ChevronUp,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

interface DashboardStats {
  totalCours: number;
  totalEtudiants: number;
  coursAujourdhui: number;
  classesAssignees: number;
}

interface Cours {
  id: number;
  nom: string;
  code: string;
  credits: number;
  volume_horaire: number;
  classe?: {
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
  classe?: {
    nom: string;
  };
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export const DashboardEnseignantPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalCours: 0,
    totalEtudiants: 0,
    coursAujourdhui: 0,
    classesAssignees: 0
  });
  const [cours, setCours] = useState<Cours[]>([]);
  const [emploiTemps, setEmploiTemps] = useState<EmploiTemps[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les menus déroulants
  const [showAllEmploi, setShowAllEmploi] = useState(false);
  const [showAllCours, setShowAllCours] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les cours de l'enseignant
      const coursRes = await api.get('/cours');
      const mesCours = (coursRes.data.data || []).filter(
        (c: Cours) => c.enseignant_id === user?.id || c.professeur_id === user?.id
      );
      setCours(mesCours);

      // Récupérer l'emploi du temps
      const emploiRes = await api.get('/emplois-temps');
      const emploiData = emploiRes.data.data || [];
      setEmploiTemps(emploiData);

      // Jour actuel
      const jourActuel = JOURS[new Date().getDay() - 1];
      const coursAujourdhui = emploiData.filter((e: EmploiTemps) => e.jour === jourActuel).length;

      // Classes uniques
      const classesUniques = new Set(mesCours.map(c => c.classe?.nom).filter(Boolean));

      setStats({
        totalCours: mesCours.length,
        totalEtudiants: 0, // À calculer depuis le backend si nécessaire
        coursAujourdhui,
        classesAssignees: classesUniques.size
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Mes Cours',
      value: stats.totalCours,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Classes',
      value: stats.classesAssignees,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: "Cours Aujourd'hui",
      value: stats.coursAujourdhui,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Volume Total',
      value: cours.reduce((sum, c) => sum + (c.volume_horaire || 0), 0) + 'h',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
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
    <div className="space-y-8 pb-8">
      {/* Header avec informations enseignant */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 rounded-2xl shadow-xl p-8 overflow-hidden"
      >
        {/* Decorative animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-5">
            <motion.div 
              className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GraduationCap size={36} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Bienvenue, Prof. {user?.prenom} {user?.nom}
              </h1>
              <div className="flex items-center gap-5 text-sm text-blue-100">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                  <BookOpen size={16} className="text-blue-200" />
                  <span className="font-medium">Enseignant</span>
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                  <FileText size={16} className="text-blue-200" />
                  <span className="font-mono font-medium">{user?.matricule}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="text-right bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20">
            <p className="text-xs text-blue-200 mb-1 font-medium">Aujourd'hui</p>
            <p className="text-sm font-bold text-white">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative group"
          >
            <div className={`relative bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl p-6 overflow-hidden h-full transition-shadow hover:shadow-2xl`}>
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon size={24} className="text-white" />
                  </motion.div>
                  <div className="w-10 h-10 bg-white/10 rounded-lg blur-sm"></div>
                </div>
                <h3 className="text-white/90 text-sm font-semibold mb-2 tracking-wide uppercase">
                  {stat.title}
                </h3>
                <motion.p 
                  className="text-4xl font-bold text-white mb-1 tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.p>
                <motion.div 
                  className="h-1 bg-white/30 rounded-full mt-3"
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emploi du temps du jour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Calendar size={24} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Emploi du Temps</h2>
                <p className="text-sm text-gray-500">Cours d'aujourd'hui ({getEmploiDuJour().length})</p>
              </div>
            </div>
            {getEmploiDuJour().length > 3 && (
              <motion.button
                onClick={() => setShowAllEmploi(!showAllEmploi)}
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium text-sm shadow-md overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {showAllEmploi ? (
                    <>
                      <ChevronUp size={18} />
                      Réduire
                    </>
                  ) : (
                    <>
                      <ChevronDown size={18} />
                      Voir tout
                    </>
                  )}
                </span>
              </motion.button>
            )}
          </div>

          <div className="space-y-1.5">
            {getEmploiDuJour().length > 0 ? (
              <>
                {getEmploiDuJour().slice(0, showAllEmploi ? undefined : 3).map((emploi, index) => (
                  <motion.div
                    key={emploi.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ x: 2, scale: 1.01 }}
                    className="relative p-2 bg-gradient-to-r from-white via-indigo-50/20 to-purple-50/20 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md shadow-sm transition-all overflow-hidden group"
                  >
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-600 rounded-r"
                      animate={{ scaleY: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    
                    <div className="ml-2.5 relative z-10">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900 text-xs leading-tight">{emploi.cours?.nom}</h4>
                        {emploi.salle && (
                          <motion.span 
                            className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded text-[9px] font-semibold shadow-sm"
                            whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            {emploi.salle}
                          </motion.span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <motion.span 
                          className="flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Clock size={10} className="text-indigo-600" />
                          <span className="font-semibold">{emploi.heure_debut.substring(0, 5)}-{emploi.heure_fin.substring(0, 5)}</span>
                        </motion.span>
                        {emploi.classe && (
                          <span className="flex items-center gap-1">
                            <Users size={10} className="text-gray-400" />
                            <span className="font-medium">{emploi.classe.nom}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Aucun cours aujourd'hui</p>
                  <p className="text-xs text-gray-400 mt-1">Profitez de votre journée libre !</p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Mes cours */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <BookOpen size={24} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mes Cours</h2>
                <p className="text-sm text-gray-500">Cours assignés ({cours.length})</p>
              </div>
            </div>
            {cours.length > 3 && (
              <motion.button
                onClick={() => setShowAllCours(!showAllCours)}
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium text-sm shadow-md overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(147, 51, 234, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {showAllCours ? (
                    <>
                      <ChevronUp size={18} />
                      Réduire
                    </>
                  ) : (
                    <>
                      <ChevronDown size={18} />
                      Voir tout
                    </>
                  )}
                </span>
              </motion.button>
            )}
          </div>

          <div className="space-y-2.5">
            {cours.length > 0 ? (
              <>
                {cours.slice(0, showAllCours ? undefined : 3).map((coursItem, index) => (
                  <motion.div
                    key={coursItem.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ x: -2, scale: 1.01 }}
                    className="relative p-3 bg-gradient-to-r from-white via-purple-50/20 to-indigo-50/20 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-lg shadow-sm transition-all overflow-hidden group"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900 text-sm">{coursItem.nom}</h4>
                        <motion.span 
                          className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded text-[9px] font-semibold shadow-sm"
                          whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                          transition={{ duration: 0.3 }}
                        >
                          {coursItem.credits} ECTS
                        </motion.span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <motion.span 
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold"
                          whileHover={{ scale: 1.05 }}
                        >
                          {coursItem.code}
                        </motion.span>
                        {coursItem.classe && (
                          <span className="flex items-center gap-1">
                            <Users size={10} className="text-gray-400" />
                            <span className="font-medium">{coursItem.classe.nom}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 ml-auto">
                          <Clock size={10} className="text-orange-500" />
                          <span className="font-medium">{coursItem.volume_horaire}h</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-xl flex items-center justify-center">
                    <BookOpen size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Aucun cours assigné</p>
                  <p className="text-xs text-gray-400 mt-1">Vos cours apparaîtront ici</p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};