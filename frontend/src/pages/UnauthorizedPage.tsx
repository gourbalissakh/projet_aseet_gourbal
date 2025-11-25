import React from 'react';
import { motion } from 'framer-motion';
import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-error/10 p-8 rounded-full">
            <ShieldOff className="text-error" size={80} />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-bold text-error mb-4">403</h1>
        <h2 className="text-3xl font-semibold mb-4">Accès interdit</h2>
        <p className="text-base-content/60 mb-8 max-w-md">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        
        <Link to="/dashboard">
          <Button variant="primary">
            Retour au tableau de bord
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
