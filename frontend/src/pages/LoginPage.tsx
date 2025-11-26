import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, GraduationCap, BookOpen, Users, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16 text-white">
          
          {/* Logo & Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl">
              <GraduationCap className="w-14 h-14" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Akhouye Académie</h1>
            <p className="text-xl text-blue-100">Votre plateforme de gestion académique</p>
          </motion.div>

          {/* Illustration - Student with laptop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full max-w-md mb-12"
          >
            <svg viewBox="0 0 400 300" className="w-full h-auto">
              {/* Desk */}
              <rect x="50" y="200" width="300" height="8" fill="rgba(255,255,255,0.2)" rx="4"/>
              
              {/* Laptop base */}
              <rect x="120" y="190" width="160" height="10" fill="rgba(255,255,255,0.3)" rx="2"/>
              
              {/* Laptop screen */}
              <rect x="130" y="100" width="140" height="90" fill="rgba(255,255,255,0.9)" rx="4"/>
              <rect x="140" y="110" width="120" height="70" fill="#3B82F6" rx="2"/>
              
              {/* Screen content - dashboard */}
              <rect x="145" y="115" width="35" height="25" fill="rgba(255,255,255,0.3)" rx="2"/>
              <rect x="185" y="115" width="35" height="25" fill="rgba(255,255,255,0.3)" rx="2"/>
              <rect x="225" y="115" width="35" height="25" fill="rgba(255,255,255,0.3)" rx="2"/>
              <rect x="145" y="145" width="115" height="30" fill="rgba(255,255,255,0.2)" rx="2"/>
              
              {/* Person */}
              <motion.g
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Head */}
                <circle cx="200" cy="150" r="25" fill="rgba(255,255,255,0.9)"/>
                {/* Body */}
                <rect x="185" y="175" width="30" height="40" fill="rgba(255,255,255,0.8)" rx="15"/>
                {/* Arms */}
                <rect x="165" y="185" width="20" height="6" fill="rgba(255,255,255,0.8)" rx="3" transform="rotate(-20 175 188)"/>
                <rect x="215" y="185" width="20" height="6" fill="rgba(255,255,255,0.8)" rx="3" transform="rotate(20 225 188)"/>
              </motion.g>
              
              {/* Books stack */}
              <rect x="280" y="175" width="35" height="8" fill="rgba(255,255,255,0.3)" rx="1"/>
              <rect x="280" y="183" width="35" height="8" fill="rgba(255,255,255,0.4)" rx="1"/>
              <rect x="280" y="191" width="35" height="8" fill="rgba(255,255,255,0.35)" rx="1"/>
              
              {/* Coffee cup */}
              <ellipse cx="85" cy="195" rx="8" ry="6" fill="rgba(255,255,255,0.3)"/>
              <rect x="77" y="185" width="16" height="10" fill="rgba(255,255,255,0.4)" rx="2"/>
            </svg>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 w-full max-w-lg"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Cours en ligne</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Communauté</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Suivi des notes</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Akhouye Académie</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue !</h2>
            <p className="text-gray-600">Connectez-vous pour accéder à votre espace</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-gray-900"
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium" onClick={(e) => e.preventDefault()}>
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            © 2025 Akhouye Académie. Tous droits réservés.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
