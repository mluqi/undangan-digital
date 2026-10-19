import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, title, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = 'Berhasil') =>
      addToast({ type: 'success', message, title }),
    error: (message, title = 'Terjadi Kesalahan') =>
      addToast({ type: 'error', message, title }),
    warning: (message, title = 'Peringatan') =>
      addToast({ type: 'warning', message, title }),
    info: (message, title = 'Informasi') =>
      addToast({ type: 'info', message, title }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((item) => (
          <ToastItem key={item.id} {...item} onClose={() => removeToast(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ title, message, type, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white shadow-emerald-500/10',
    error: 'border-rose-200 bg-white shadow-rose-500/10',
    warning: 'border-amber-200 bg-white shadow-amber-500/10',
    info: 'border-sky-200 bg-white shadow-sky-500/10',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${
        borders[type] || borders.info
      }`}
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        {title && <h5 className="text-xs sm:text-sm font-semibold text-slate-900">{title}</h5>}
        {message && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{message}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
