import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'warning',
  loading = false,
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'text-error',
    warning: 'text-warning',
    info: 'text-info',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="card bg-base-100 shadow-2xl w-full max-w-md"
      >
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 ${variantClasses[variant]}`}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-base-content/70">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X size={20} />
            </button>
          </div>

          <div className="card-actions justify-end mt-4">
            <button onClick={onClose} className="btn btn-ghost" disabled={loading}>
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`btn ${
                variant === 'danger' ? 'btn-error' : 'btn-primary'
              }`}
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              {confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
