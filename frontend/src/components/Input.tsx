import React, { InputHTMLAttributes, forwardRef } from 'react';
import type { LucideProps } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<LucideProps>;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
              <Icon size={20} />
            </div>
          )}
          <input
            ref={ref}
            className={`input input-bordered w-full ${Icon ? 'pl-10' : ''} ${
              error ? 'input-error' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
