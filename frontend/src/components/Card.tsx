import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  actions,
}) => {
  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && (
              <p className="text-base-content/60 text-sm">{subtitle}</p>
            )}
          </div>
        )}
        <div>{children}</div>
        {actions && <div className="card-actions justify-end mt-4">{actions}</div>}
      </div>
    </div>
  );
};
