import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export const SearchBar = ({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSearch,
  placeholder = 'Cari data...',
  isLoading = false,
  debounceMs = 300,
  showShortcut = false,
  className = '',
  size = 'md',
  autoFocus = false,
}) => {
  const [value, setValue] = useState(controlledValue !== undefined ? controlledValue : defaultValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) {
        onChange(value);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, debounceMs, onChange]);

  // Keyboard shortcut '/' or 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k') || (e.metaKey && e.key.toLowerCase() === 'k')) &&
        document.activeElement !== inputRef.current &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setValue('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const sizes = {
    sm: 'py-1.5 pl-8 pr-8 text-xs',
    md: 'py-2 pl-9 pr-9 text-sm',
    lg: 'py-2.5 pl-10 pr-10 text-base',
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3 pointer-events-none text-slate-400 flex items-center">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-slate-400 ${
          sizes[size] || sizes.md
        }`}
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Hapus pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : showShortcut ? (
        <div className="absolute right-2.5 pointer-events-none hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
          <span>/</span>
        </div>
      ) : null}
    </div>
  );
};
