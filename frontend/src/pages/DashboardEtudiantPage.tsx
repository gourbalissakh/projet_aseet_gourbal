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
  FileText,
  ChevronDown,
  ChevronUp,
  BarChart3
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
  
  // États pour les menus déroulants
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [showAllEmploi, setShowAllEmploi] = useState(false);
  const [showAllCours, setShowAllCours] = useState(false);

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
    <div className="space-y-8 pb-8">
      {/* Header avec informations étudiant - Design amélioré */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-8 overflow-hidden"
      >
        {/* Decorative background elements avec animation */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-5">
            <motion.div 
              className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <User size={36} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Bienvenue, {user?.prenom} {user?.nom}
              </h1>
              <div className="flex items-center gap-5 text-sm text-blue-100">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                  <GraduationCap size={16} className="text-blue-200" />
                  <span className="font-medium">{user?.classe?.nom || 'Non assigné'}</span>
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

      {/* Statistiques - Design moderne avec gradients */}
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
            {/* Card avec gradient et glassmorphism */}
            <div className={`relative bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl p-6 overflow-hidden h-full hover:shadow-2xl transition-shadow duration-300`}>
              {/* Decorative elements avec animation */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
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
                <p className="text-4xl font-bold text-white mb-1 tracking-tight relative">
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.span>
                </p>
                <motion.div
                  className="h-1 w-16 bg-white/30 rounded-full mt-3"
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emploi du temps du jour - Design amélioré avec menu déroulant */}
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
                className="relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium text-xs shadow-md overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 6px 12px rgba(99, 102, 241, 0.3)' }}
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
                      <ChevronUp size={16} />
                      Réduire
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Voir tout
                    </>
                  )}
                </span>
              </motion.button>
            )}
          </div>

          <div className="space-y-1">
            {getEmploiDuJour().length > 0 ? (
              <>
                {getEmploiDuJour().slice(0, showAllEmploi ? undefined : 3).map((emploi, index) => (
                  <motion.div
                    key={emploi.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ x: 2, scale: 1.01 }}
                    className="relative p-1.5 bg-gradient-to-r from-white via-indigo-50/20 to-purple-50/20 rounded-md border border-gray-200 hover:border-indigo-300 hover:shadow-md shadow-sm transition-all overflow-hidden group"
                  >
                    {/* Animated decorative bar */}
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-600 rounded-r"
                      animate={{ scaleY: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    
                    {/* Hover gradient overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    
                    <div className="ml-2.5 relative z-10">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-gray-900 text-[11px] leading-tight">{emploi.cours?.nom}</h4>
                        {emploi.salle && (
                          <motion.span 
                            className="px-1.5 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded text-[8px] font-semibold shadow-sm"
                            whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            {emploi.salle}
                          </motion.span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-600">
                        <motion.span 
                          className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Clock size={9} className="text-indigo-600" />
                          <span className="font-semibold">{emploi.heure_debut.substring(0, 5)}-{emploi.heure_fin.substring(0, 5)}</span>
                        </motion.span>
                        {emploi.enseignant && (
                          <span className="flex items-center gap-0.5">
                            <User size={9} className="text-gray-400" />
                            <span className="font-medium">{emploi.enseignant.prenom} {emploi.enseignant.nom}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-10 h-10 mx-auto mb-2 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Aucun cours aujourd'hui</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Profitez de votre journée libre !</p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Notes récentes - Design simple et efficace */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Award size={24} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notes Récentes</h2>
                <p className="text-sm text-gray-500">Dernières évaluations ({notes.length})</p>
              </div>
            </div>
            {notes.length > 3 && (
              <motion.button
                onClick={() => setShowAllNotes(!showAllNotes)}
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium text-sm shadow-md overflow-hidden group"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {showAllNotes ? (
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

          <div className="space-y-3">
            {notes.length > 0 ? (
              <>
                {notes.slice(0, showAllNotes ? undefined : 3).map((note, index) => {
                  const noteValue = Number(note.note);
                  
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ x: -4, scale: 1.01 }}
                      className="relative p-5 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg shadow-sm transition-all overflow-hidden group"
                    >
                      {/* Animated background gradient */}
                      <motion.div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: noteValue >= 16 ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))' :
                                      noteValue >= 14 ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(79, 70, 229, 0.05))' :
                                      noteValue >= 10 ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(251, 146, 60, 0.05))' :
                                      'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))'
                        }}
                      />
                      
                      {/* Barre colorée à droite avec animation */}
                      <motion.div 
                        className={`absolute right-0 top-0 bottom-0 w-1.5 ${
                          noteValue >= 16 ? 'bg-gradient-to-b from-green-500 to-emerald-600' :
                          noteValue >= 14 ? 'bg-gradient-to-b from-blue-500 to-blue-600' :
                          noteValue >= 10 ? 'bg-gradient-to-b from-orange-500 to-orange-600' :
                          'bg-gradient-to-b from-red-500 to-red-600'
                        }`}
                        animate={{ scaleY: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <div className="flex items-center justify-between pr-4 relative z-10">
                        <div className="flex-1">
                          {/* Nom du cours */}
                          <h4 className="font-bold text-gray-900 mb-2 text-base">{note.cours?.nom}</h4>
                          
                          {/* Badges avec animations */}
                          <div className="flex items-center gap-2 mb-2">
                            <motion.span 
                              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg font-semibold text-xs shadow-sm"
                              whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
                              transition={{ duration: 0.3 }}
                            >
                              {note.type_evaluation}
                            </motion.span>
                            <motion.span 
                              className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg font-semibold text-xs shadow-sm"
                              whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0] }}
                              transition={{ duration: 0.3 }}
                            >
                              Coef. {note.coefficient}
                            </motion.span>
                          </div>
                          
                          {/* Date */}
                          <span className="text-xs text-gray-500">
                            {new Date(note.date_evaluation).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        {/* Badge de note avec animations */}
                        <motion.div 
                          className="ml-4 relative"
                          whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className={`w-16 h-16 rounded-xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden ${
                              noteValue >= 16 ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                              noteValue >= 14 ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                              noteValue >= 10 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                              'bg-gradient-to-br from-red-400 to-red-600'
                            }`}
                            animate={{ boxShadow: ['0 4px 6px rgba(0,0,0,0.1)', '0 8px 15px rgba(0,0,0,0.2)', '0 4px 6px rgba(0,0,0,0.1)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {/* Effet de brillance */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-transparent opacity-30"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="text-2xl font-bold text-white relative z-10">
                              {noteValue.toFixed(1)}
                            </div>
                            <div className="text-[10px] text-white/90 font-medium relative z-10">/20</div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Award size={32} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Aucune note disponible</p>
                  <p className="text-xs text-gray-400 mt-1">Vos notes apparaîtront ici</p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Mes cours - Design modernisé avec menu déroulant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen size={24} className="text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mes Cours</h2>
              <p className="text-sm text-gray-500">Liste des cours inscrits ({cours.length})</p>
            </div>
          </div>
          {cours.length > 3 && (
            <motion.button
              onClick={() => setShowAllCours(!showAllCours)}
              className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium text-sm shadow-md overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cours.slice(0, showAllCours ? undefined : 3).map((coursItem, index) => (
            <motion.div
              key={coursItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.03 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative p-5 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xl shadow-md transition-all overflow-hidden h-full">
                {/* Animated gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Decorative animated corner */}
                <motion.div 
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-bl-[3rem]"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-2">
                      <h4 className="font-bold text-gray-900 mb-1.5 text-base leading-tight">{coursItem.nom}</h4>
                      <motion.p 
                        className="text-xs text-gray-600 font-mono bg-gradient-to-r from-gray-100 to-blue-50 px-2 py-1 rounded inline-block"
                        whileHover={{ scale: 1.05 }}
                      >
                        {coursItem.code}
                      </motion.p>
                    </div>
                    <motion.div 
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg relative overflow-hidden"
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      animate={{
                        boxShadow: [
                          '0 4px 6px rgba(59, 130, 246, 0.4)',
                          '0 6px 12px rgba(79, 70, 229, 0.5)',
                          '0 4px 6px rgba(59, 130, 246, 0.4)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <span className="relative z-10">{coursItem.credits}</span>
                    </motion.div>
                  </div>
                  
                  <div className="mt-auto">
                    {coursItem.enseignant && (
                      <div className="pt-3 border-t border-gray-200/50 flex items-center gap-2">
                        <motion.div 
                          className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <User size={16} className="text-white" />
                        </motion.div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            {coursItem.enseignant.prenom} {coursItem.enseignant.nom}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {cours.length === 0 && (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <BookOpen size={32} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Aucun cours inscrit</p>
              <p className="text-xs text-gray-400 mt-1">Vos cours apparaîtront ici</p>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Courbe statistiques - Graphique des notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div 
            className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <BarChart3 size={24} className="text-white" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Statistiques de Performance</h2>
            <p className="text-sm text-gray-500">Évolution de vos notes</p>
          </div>
        </div>

        {notes.length > 0 ? (
          <div className="space-y-6">
            {/* Barre de progression pour chaque cours avec note */}
            {Array.from(new Set(notes.map(n => n.cours?.nom))).slice(0, 6).map((coursNom, index) => {
              const coursNotes = notes.filter(n => n.cours?.nom === coursNom);
              const moyenneCours = coursNotes.reduce((sum, n) => sum + Number(n.note), 0) / coursNotes.length;
              const pourcentage = (moyenneCours / 20) * 100;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{coursNom}</h4>
                      <p className="text-xs text-gray-500">{coursNotes.length} évaluation{coursNotes.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        moyenneCours >= 16 ? 'text-green-600' :
                        moyenneCours >= 14 ? 'text-blue-600' :
                        moyenneCours >= 10 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {moyenneCours.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">/20</span>
                    </div>
                  </div>
                  
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pourcentage}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${
                        moyenneCours >= 16 ? 'from-green-500 to-emerald-600' :
                        moyenneCours >= 14 ? 'from-blue-500 to-blue-600' :
                        moyenneCours >= 10 ? 'from-orange-500 to-orange-600' :
                        'from-red-500 to-red-600'
                      } shadow-md`}
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* Résumé global */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
            >
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Moyenne Générale</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.moyenneGenerale.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">/20</p>
                </div>
                <div className="text-center border-x border-purple-200">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Total Notes</p>
                  <p className="text-3xl font-bold text-indigo-600">{notes.length}</p>
                  <p className="text-xs text-gray-500 mt-1">évaluations</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Mention</p>
                  <p className={`text-2xl font-bold ${
                    stats.moyenneGenerale >= 16 ? 'text-green-600' :
                    stats.moyenneGenerale >= 14 ? 'text-blue-600' :
                    stats.moyenneGenerale >= 12 ? 'text-orange-600' :
                    stats.moyenneGenerale >= 10 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {stats.moyenneGenerale >= 16 ? 'Excellent' :
                     stats.moyenneGenerale >= 14 ? 'Bien' :
                     stats.moyenneGenerale >= 12 ? 'Assez Bien' :
                     stats.moyenneGenerale >= 10 ? 'Passable' :
                     'Insuffisant'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <BarChart3 size={32} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Aucune donnée statistique</p>
              <p className="text-xs text-gray-400 mt-1">Les statistiques apparaîtront avec vos notes</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
