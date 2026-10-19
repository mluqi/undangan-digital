import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

/**
 * Standard / Searchable Single Select
 */
export const Select = ({
  options = [], // [{ value: '1', label: 'Option 1', description?: '' }]
  value,
  onChange,
  placeholder = 'Pilih salah satu...',
  searchable = false,
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (val) => {
    onChange && onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between rounded-xl border bg-white px-3.5 py-2 text-sm text-left transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-400'
          }`}
        >
          <span className={selectedOption ? 'text-slate-800 font-medium' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
            {searchable && (
              <div className="p-2 border-b border-slate-100">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Cari pilihan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                  />
                </div>
              </div>
            )}

            <div className="max-h-56 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-3 px-3 text-center text-xs text-slate-400">
                  Tidak ada hasil ditemukan
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div>{opt.label}</div>
                        {opt.description && (
                          <div className="text-[11px] text-slate-400">{opt.description}</div>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

/**
 * MultiSelect component with tag pills and search
 */
export const MultiSelect = ({
  options = [],
  value = [], // Array of values: ['1', '2']
  onChange,
  placeholder = 'Pilih beberapa opsi...',
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (val) => {
    if (value.includes(val)) {
      onChange && onChange(value.filter((v) => v !== val));
    } else {
      onChange && onChange([...value, val]);
    }
  };

  const removeTag = (e, val) => {
    e.stopPropagation();
    onChange && onChange(value.filter((v) => v !== val));
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`min-h-[40px] w-full flex items-center justify-between rounded-xl border bg-white px-3 py-1.5 text-sm cursor-pointer transition-all duration-200 focus-within:ring-2 ${
            disabled ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''
          } ${
            error
              ? 'border-rose-300 focus-within:ring-rose-200'
              : 'border-slate-300 focus-within:border-indigo-500 focus-within:ring-indigo-100 hover:border-slate-400'
          }`}
        >
          <div className="flex flex-wrap gap-1.5 items-center flex-1">
            {selectedOptions.length === 0 ? (
              <span className="text-slate-400 text-sm px-0.5">{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-lg px-2 py-0.5 text-xs font-medium"
                >
                  {opt.label}
                  <button
                    type="button"
                    onClick={(e) => removeTag(e, opt.value)}
                    className="hover:text-indigo-900 rounded focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="relative flex items-center flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Cari opsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange && onChange([])}
                  className="text-[11px] text-slate-500 hover:text-rose-600 font-medium px-1"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="max-h-56 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-3 px-3 text-center text-xs text-slate-400">
                  Tidak ada hasil
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleOption(opt.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
