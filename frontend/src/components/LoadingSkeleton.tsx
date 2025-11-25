import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-base-300 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-base-300 rounded"></div>
        <div className="h-4 bg-base-300 rounded w-5/6"></div>
        <div className="h-4 bg-base-300 rounded w-4/6"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-base-300 rounded"></div>
        <div className="h-32 bg-base-300 rounded"></div>
        <div className="h-32 bg-base-300 rounded"></div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card bg-base-100 shadow-lg animate-pulse">
      <div className="card-body">
        <div className="h-6 bg-base-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-base-300 rounded"></div>
          <div className="h-4 bg-base-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-12 bg-base-300 rounded"></div>
      <div className="h-16 bg-base-300 rounded"></div>
      <div className="h-16 bg-base-300 rounded"></div>
      <div className="h-16 bg-base-300 rounded"></div>
      <div className="h-16 bg-base-300 rounded"></div>
    </div>
  );
};
