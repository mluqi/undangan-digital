import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav className={`flex items-center text-xs sm:text-sm text-slate-500 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        <li className="inline-flex items-center">
          <a
            href="/"
            className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Beranda</span>
          </a>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-slate-900 truncate max-w-[160px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-indigo-600 transition-colors truncate max-w-[120px] sm:max-w-none"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
