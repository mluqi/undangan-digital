import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      required = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-medium text-slate-700"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
              LeftIcon ? 'pl-10' : ''
            } ${RightIcon || error ? 'pr-10' : ''} ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-400'
            } ${className}`}
            {...props}
          />
          {error ? (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            RightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <RightIcon className="w-4 h-4" />
              </div>
            )
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      required = false,
      rows = 3,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-medium text-slate-700"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-400'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export const Checkbox = forwardRef(
  ({ label, helperText, error, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-2.5">
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          className={`mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-offset-0 transition-colors cursor-pointer disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {(label || helperText) && (
          <label htmlFor={inputId} className="cursor-pointer select-none text-xs sm:text-sm">
            {label && <span className="font-medium text-slate-700 block">{label}</span>}
            {helperText && <span className="text-slate-500 block text-xs">{helperText}</span>}
            {error && <span className="text-rose-500 block text-xs font-medium">{error}</span>}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export const Switch = ({
  checked = false,
  onChange,
  label,
  helperText,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ${
            checked ? 'bg-indigo-600' : 'bg-slate-200'
          }`}
        />
        <div
          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-xs ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      {(label || helperText) && (
        <div>
          {label && <span className="text-xs sm:text-sm font-medium text-slate-700 block">{label}</span>}
          {helperText && <span className="text-slate-500 block text-xs">{helperText}</span>}
        </div>
      )}
    </label>
  );
};
