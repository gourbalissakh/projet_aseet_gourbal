import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Bell, Shield, Globe, Check } from 'lucide-react';

const THEMES = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe',
  'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business',
  'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset'
];

export const ParametresPage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-base-content/70 mt-2">Personnalisez votre expérience SIGU</p>
        </motion.div>

        <div className="space-y-6">
          {/* Thème Section avec boutons DaisyUI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="card-title text-base-content">Apparence</h2>
                  <p className="text-sm text-base-content/60">Choisissez votre thème préféré</p>
                </div>
              </div>

              {/* Badge indicateur du thème actif */}
              <div className="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Thème actuel : <strong className="badge badge-primary ml-2">{currentTheme}</strong></span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {THEMES.map((theme) => {
                  const isActive = currentTheme === theme;
                  
                  return (
                    <button
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'} relative`}
                    >
                      {isActive && (
                        <Check className="w-4 h-4 absolute -top-1 -right-1 text-success" />
                      )}
                      <span className="capitalize">{theme}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Notifications Section avec composants DaisyUI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h2 className="card-title text-base-content">Notifications</h2>
                  <p className="text-sm text-base-content/60">Gérez vos préférences de notification</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <span className="label-text font-medium">Notifications par email</span>
                      <p className="text-xs text-base-content/60">Recevoir des notifications par email</p>
                    </div>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <span className="label-text font-medium">Notifications push</span>
                      <p className="text-xs text-base-content/60">Recevoir des notifications dans le navigateur</p>
                    </div>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      checked={notifications.updates}
                      onChange={(e) => setNotifications({ ...notifications, updates: e.target.checked })}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <span className="label-text font-medium">Mises à jour</span>
                      <p className="text-xs text-base-content/60">Recevoir les informations sur les mises à jour</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sécurité Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-error" />
                </div>
                <div>
                  <h2 className="card-title text-base-content">Sécurité</h2>
                  <p className="text-sm text-base-content/60">Paramètres de sécurité et confidentialité</p>
                </div>
              </div>

              <div className="space-y-2">
                <button className="btn btn-block btn-ghost justify-start">
                  <span>Changer le mot de passe</span>
                </button>
                <button className="btn btn-block btn-ghost justify-start">
                  <span>Authentification à deux facteurs</span>
                </button>
                <button className="btn btn-block btn-ghost justify-start">
                  <span>Sessions actives</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Langue Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="card-title text-base-content">Langue et région</h2>
                  <p className="text-sm text-base-content/60">Préférences linguistiques</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-base-200">
                <div>
                  <h3 className="font-medium text-base-content">Langue</h3>
                  <p className="text-sm text-base-content/60">Français (France)</p>
                </div>
                <button className="btn btn-primary btn-sm">Modifier</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
