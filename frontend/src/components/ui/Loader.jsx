import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  label,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colors = {
    primary: 'text-indigo-600',
    white: 'text-white',
    slate: 'text-slate-500',
    rose: 'text-rose-600',
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2
        className={`animate-spin ${sizes[size] || sizes.md} ${
          colors[color] || colors.primary
        }`}
      />
      {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
    </div>
  );
};

export const Skeleton = ({ className = '', rounded = 'rounded-lg' }) => {
  return (
    <div className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`} />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="w-1/3 h-5" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-full h-16" />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="w-20 h-8 rounded-xl" />
        <Skeleton className="w-20 h-8 rounded-xl" />
      </div>
    </div>
  );
};

export const FullPageLoader = ({ text = 'Memuat data...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-700">{text}</p>
      </div>
    </div>
  );
};
