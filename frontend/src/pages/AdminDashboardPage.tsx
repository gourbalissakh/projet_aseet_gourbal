import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp, Grid, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Stats {
  etudiants: number;
  enseignants: number;
  cours: number;
  classes: number;
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    etudiants: 0,
    enseignants: 0,
    cours: 0,
    classes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Étudiants',
      value: loading ? '...' : stats.etudiants.toString(),
      change: '+12%',
      icon: Users,
      color: 'blue',
      path: '/admin/etudiants'
    },
    {
      title: 'Enseignants',
      value: loading ? '...' : stats.enseignants.toString(),
      change: '+5%',
      icon: GraduationCap,
      color: 'purple',
      path: '/admin/enseignants'
    },
    {
      title: 'Cours',
      value: loading ? '...' : stats.cours.toString(),
      change: '+8%',
      icon: BookOpen,
      color: 'green',
      path: '/admin/cours'
    },
    {
      title: 'Classes',
      value: loading ? '...' : stats.classes.toString(),
      change: '+3%',
      icon: Grid,
      color: 'orange',
      path: '/admin/classes'
    },
  ];

  const quickActions = [
    {
      title: 'Gestion Étudiants',
      description: 'Inscrire et gérer les étudiants',
      icon: Users,
      color: 'blue',
      path: '/admin/etudiants'
    },
    {
      title: 'Gestion Enseignants',
      description: 'Gérer le corps enseignant',
      icon: GraduationCap,
      color: 'purple',
      path: '/admin/enseignants'
    },
    {
      title: 'Gestion Filières',
      description: 'Organiser les filières',
      icon: Layers,
      color: 'green',
      path: '/admin/filieres'
    },
    {
      title: 'Emploi du Temps',
      description: 'Planifier les cours',
      icon: Calendar,
      color: 'orange',
      path: '/admin/emplois-temps'
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600',
      hover: 'hover:from-purple-600 hover:to-purple-700'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      gradient: 'from-green-500 to-green-600',
      hover: 'hover:from-green-600 hover:to-green-700'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      gradient: 'from-orange-500 to-orange-600',
      hover: 'hover:from-orange-600 hover:to-orange-700'
    },
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-blue-100">Bienvenue sur l'interface d'administration</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const colors = colorClasses[stat.color as keyof typeof colorClasses];
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(stat.path)}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const colors = colorClasses[action.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(action.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${colors.gradient} ${colors.hover} p-6 rounded-xl text-white cursor-pointer shadow-md hover:shadow-lg transition-all`}
              >
                <action.icon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold mb-1">{action.title}</h3>
                <p className="text-sm text-white/80">{action.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
        <div className="space-y-4">
          {[
            { action: 'Nouvel étudiant inscrit', detail: 'Marie Ndiaye - Licence 3 Informatique', time: '5 min' },
            { action: 'Cours ajouté', detail: 'Mathématiques Appliquées - Prof. Diop', time: '15 min' },
            { action: 'Emploi du temps mis à jour', detail: 'Master 1 - Semestre 2', time: '1h' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.detail}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
