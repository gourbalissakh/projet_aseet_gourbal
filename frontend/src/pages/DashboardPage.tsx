import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  TrendingUp,
  Sparkles,
  Layers,
  Grid,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    etudiants: 0,
    enseignants: 0,
    cours: 0,
    classes: 0,
    filieres: 0,
    niveaux: 0,
    emplois: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, cours, classes, filieres, niveaux, emplois] = await Promise.all([
          api.get('/users'),
          api.get('/cours'),
          api.get('/classes'),
          api.get('/filieres'),
          api.get('/niveaux'),
          api.get('/emplois-temps')
        ]);

        const etudiants = users.data.data.filter((u: any) => u.role === 'etudiant').length;
        const enseignants = users.data.data.filter((u: any) => u.role === 'enseignant').length;

        setStats({
          etudiants,
          enseignants,
          cours: cours.data.data.length,
          classes: classes.data.data.length,
          filieres: filieres.data.data.length,
          niveaux: niveaux.data.data.length,
          emplois: emplois.data.data.length
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  const adminMenuItems = [
    {
      title: 'Gestion Filières',
      description: 'Gérer les filières académiques',
      icon: Layers,
      path: '/filieres',
      gradient: 'from-blue-500 to-cyan-500',
      stats: `${stats.filieres} filières`
    },
    {
      title: 'Gestion Niveaux',
      description: 'Gérer les niveaux d\'études',
      icon: Grid,
      path: '/niveaux',
      gradient: 'from-purple-500 to-pink-500',
      stats: `${stats.niveaux} niveaux`
    },
    {
      title: 'Gestion Classes',
      description: 'Organiser les classes',
      icon: Users,
      path: '/classes',
      gradient: 'from-green-500 to-emerald-500',
      stats: `${stats.classes} classes`
    },
    {
      title: 'Gestion Cours',
      description: 'Gérer le catalogue de cours',
      icon: BookOpen,
      path: '/cours',
      gradient: 'from-orange-500 to-red-500',
      stats: `${stats.cours} cours`
    },
    {
      title: 'Gestion Enseignants',
      description: 'Gérer le corps enseignant',
      icon: GraduationCap,
      path: '/utilisateurs',
      gradient: 'from-indigo-500 to-purple-500',
      stats: `${stats.enseignants} enseignants`
    },
    {
      title: 'Gestion Emploi du temps',
      description: 'Planifier les emplois du temps',
      icon: Calendar,
      path: '/emplois-temps',
      gradient: 'from-pink-500 to-rose-500',
      stats: `${stats.emplois} plannings`
    },
  ];

  const statsCards = [
    {
      title: 'Étudiants',
      value: stats.etudiants.toString(),
      change: '+12%',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Enseignants',
      value: stats.enseignants.toString(),
      change: '+5%',
      icon: GraduationCap,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Cours Actifs',
      value: stats.cours.toString(),
      change: '+8%',
      icon: BookOpen,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Classes',
      value: stats.classes.toString(),
      change: '+3%',
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  // Données pour les graphiques
  const chartData = {
    etudiantsParFiliere: [
      { name: 'Informatique', value: Math.floor(stats.etudiants * 0.3) },
      { name: 'Génie Civil', value: Math.floor(stats.etudiants * 0.25) },
      { name: 'Électrotechnique', value: Math.floor(stats.etudiants * 0.2) },
      { name: 'Génie Mécanique', value: Math.floor(stats.etudiants * 0.15) },
      { name: 'Gestion Comm.', value: Math.floor(stats.etudiants * 0.1) },
    ],
    coursParNiveau: [
      { name: 'L1', value: Math.floor(stats.cours * 0.35) },
      { name: 'L2', value: Math.floor(stats.cours * 0.35) },
      { name: 'L3', value: Math.floor(stats.cours * 0.3) },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -ml-40 -mb-40 blur-3xl" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">Bienvenue dans SIGU</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">
                Bonjour, {user?.nom} ! 👋
              </h1>
              <p className="text-lg opacity-90 max-w-xl">
                {user?.role === 'admin' 
                  ? 'Gérez votre université avec efficacité et simplicité' 
                  : user?.role === 'enseignant'
                  ? 'Vos cours et étudiants vous attendent'
                  : 'Découvrez vos cours et votre emploi du temps'}
              </p>
            </div>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="hidden lg:block"
            >
              <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center">
                <GraduationCap className="w-16 h-16" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {user?.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10`} />
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-xl`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Admin Menu - Left Side */}
          {user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Menu de Gestion</h2>
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminMenuItems.map((item, index) => (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(item.path)}
                      className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 rounded-2xl p-5 border border-gray-200 hover:border-gray-300 transition-all duration-300 text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="text-xs font-semibold text-gray-400">{item.stats}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Graphiques Statistiques */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Statistiques</h2>
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                
                <div className="space-y-6">
                  {/* Étudiants par Filière */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Étudiants par Filière</h3>
                    <div className="space-y-3">
                      {chartData.etudiantsParFiliere.map((item, index) => {
                        const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
                        const percentage = ((item.value / stats.etudiants) * 100).toFixed(0);
                        
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">{item.name}</span>
                              <span className="font-semibold text-gray-900">{item.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                className={`${colors[index]} h-2.5 rounded-full`}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cours par Niveau */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Cours par Niveau</h3>
                    <div className="flex items-end justify-around gap-4 h-40">
                      {chartData.coursParNiveau.map((item, index) => {
                        const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-pink-500 to-pink-600'];
                        const height = ((item.value / Math.max(...chartData.coursParNiveau.map(d => d.value))) * 100);
                        
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div className={`w-full bg-gradient-to-t ${colors[index]} rounded-t-lg flex items-center justify-center`}>
                              <span className="text-white font-bold">{item.value}</span>
                            </div>
                            <span className="text-xs text-gray-600 mt-2 font-medium">{item.name}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Répartition Globale */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Répartition Globale</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.3 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center"
                      >
                        <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-900">{stats.filieres}</div>
                        <div className="text-xs text-blue-600 font-medium">Filières</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.6, duration: 0.3 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center"
                      >
                        <PieChart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-900">{stats.niveaux}</div>
                        <div className="text-xs text-purple-600 font-medium">Niveaux</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.7, duration: 0.3 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center"
                      >
                        <Calendar className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-pink-900">{stats.emplois}</div>
                        <div className="text-xs text-pink-600 font-medium">Emplois</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
            </div>
            </motion.div>
          )}

          {/* Side Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Calendar Widget */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Aujourd'hui</h3>
                <Calendar className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </div>
              <div className="space-y-3 mt-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Cours de Math</span>
                    <span className="opacity-80">10:00</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">TP Physique</span>
                    <span className="opacity-80">14:30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Performance</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Taux de réussite</span>
                    <span className="font-semibold text-gray-900">92%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Assiduité</span>
                    <span className="font-semibold text-gray-900">87%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="font-bold mb-4">Cette Semaine</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs opacity-90">Cours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs opacity-90">Devoirs</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
