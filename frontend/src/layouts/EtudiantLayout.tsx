import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const EtudiantLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      label: 'Tableau de Bord',
      path: '/etudiant/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Mes Cours',
      path: '/etudiant/cours',
      icon: BookOpen,
    },
    {
      label: 'Emploi du Temps',
      path: '/etudiant/emplois-temps',
      icon: Calendar,
    },
    {
      label: 'Mes Notes',
      path: '/etudiant/notes',
      icon: FileText,
    },
    {
      label: 'Mon Profil',
      path: '/etudiant/profil',
      icon: User,
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm"
          >
            <div className="flex-1 overflow-y-auto">
              {/* Logo */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <GraduationCap className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">ASEET</h1>
                    <p className="text-xs text-gray-500">Espace Étudiant</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="p-4 mx-4 my-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">
                      {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user?.matricule || user?.email}
                    </p>
                    {user?.classe && (
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {user.classe.nom}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="text-gray-600" size={24} />
              ) : (
                <Menu className="text-gray-600" size={24} />
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
