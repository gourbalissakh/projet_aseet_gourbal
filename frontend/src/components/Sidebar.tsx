import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  Settings,
  LogOut,
  Layers,
  Grid
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      path: '/dashboard', 
      label: 'Dashboard',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: Layers, 
      path: '/filieres', 
      label: 'Filières',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    { 
      icon: Grid, 
      path: '/niveaux', 
      label: 'Niveaux',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    { 
      icon: Users, 
      path: '/classes', 
      label: 'Classes',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      icon: BookOpen, 
      path: '/cours', 
      label: 'Cours',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    { 
      icon: Calendar, 
      path: '/emplois-temps', 
      label: 'Emplois du temps',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ 
      icon: GraduationCap, 
      path: '/utilisateurs', 
      label: 'Utilisateurs',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50'
    });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: isOpen ? 0 : -100 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`
          fixed top-0 left-0 h-full w-20 bg-white border-r border-gray-200 z-50
          lg:translate-x-0 shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-2 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative w-14 h-14 mx-auto rounded-2xl flex items-center justify-center
                    transition-all duration-300 
                    ${isActive 
                      ? `${item.bgColor} shadow-lg ${item.color}` 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-700'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"
                    />
                  )}
                  <item.icon className="w-6 h-6 relative z-10" />
                </motion.div>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="py-4 px-2 space-y-2 border-t border-gray-200">
          <Link to="/settings" className="group relative">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-14 h-14 mx-auto rounded-2xl flex items-center justify-center
                transition-all duration-300
                ${location.pathname === '/settings'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-700'}
              `}
            >
              <Settings className="w-6 h-6" />
            </motion.div>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
              Paramètres
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="group relative w-full"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors duration-300"
            >
              <LogOut className="w-6 h-6" />
            </motion.div>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
              Déconnexion
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          </button>
        </div>
      </motion.aside>
    </>
  );
};
