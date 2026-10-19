import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div
    className={`p-6 pb-4 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-base sm:text-lg font-semibold text-slate-900 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs sm:text-sm text-slate-500 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`p-6 pt-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex items-center justify-between gap-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);
