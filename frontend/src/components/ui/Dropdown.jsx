import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

/**
 * Generic Action Dropdown (e.g. for table row actions, user menu, etc.)
 */
export const Dropdown = ({
  trigger,
  children,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute z-50 mt-1.5 min-w-[180px] rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100 ${
            alignments[align] || alignments.right
          } ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  icon: Icon,
  danger = false,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm rounded-lg text-left transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        danger
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
      } ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600" />}
      <span className="flex-1">{children}</span>
    </button>
  );
};

export const DropdownDivider = () => (
  <div className="my-1 border-t border-slate-100" />
);
