import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 0, -10] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-warning/10 p-8 rounded-full">
            <FileQuestion className="text-warning" size={80} />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-bold text-warning mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page introuvable</h2>
        <p className="text-base-content/60 mb-8 max-w-md">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <Link to="/">
          <Button variant="primary">
            Retour à l'accueil
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
