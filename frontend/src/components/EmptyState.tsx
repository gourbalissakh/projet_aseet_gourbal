import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion, Inbox, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'file' | 'inbox' | 'search';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  action,
}) => {
  const icons = {
    file: FileQuestion,
    inbox: Inbox,
    search: Search,
  };

  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="bg-base-300/50 p-6 rounded-full mb-4">
        <Icon className="text-base-content/40" size={48} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-base-content/60 mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  );
};
