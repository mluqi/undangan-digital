import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [], onNavigate, className = '' }) => {
  // Hindari duplikasi item "Beranda" jika sudah ada di awal array items
  const filteredItems = items.filter(
    (item, index) => !(index === 0 && item.label?.toLowerCase() === 'beranda')
  );

  const handleLinkClick = (e, href, onClick) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }
    if (href && onNavigate && href.startsWith('/')) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav
      className={`flex items-center text-xs sm:text-sm text-slate-500 min-w-0 overflow-x-auto no-scrollbar ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-nowrap gap-1 sm:gap-2 min-w-0">
        <li className="inline-flex items-center shrink-0">
          <a
            href="/dashboard"
            onClick={(e) => handleLinkClick(e, '/dashboard')}
            className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors py-0.5"
            title="Beranda Dashboard"
          >
            <Home className="w-3.5 h-3.5 sm:mr-1 shrink-0" />
            <span className="hidden sm:inline">Beranda</span>
          </a>
        </li>

        {filteredItems.map((item, index) => {
          const isLast = index === filteredItems.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1 sm:gap-2 min-w-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast || (!item.href && !item.onClick) ? (
                <span className="font-semibold text-slate-900 truncate max-w-[140px] xs:max-w-[200px] sm:max-w-[280px] md:max-w-none">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  onClick={(e) => handleLinkClick(e, item.href, item.onClick)}
                  className="hover:text-indigo-600 transition-colors truncate max-w-[100px] sm:max-w-[180px] md:max-w-none"
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
