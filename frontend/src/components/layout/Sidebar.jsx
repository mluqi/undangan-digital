import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Mail,
  Palette,
  Settings,
  ChevronLeft,
  X,
  Sparkles,
  LogOut,
  Users,
} from 'lucide-react';

export const Sidebar = ({
  isOpen = true,
  isMobileOpen = false,
  onToggleCollapse,
  onCloseMobile,
  currentPath = '/dashboard',
  onNavigate,
  user = { name: 'Admin Undangan', email: 'admin@undangan.id' },
  onLogout,
}) => {
  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'Undangan Client',
      icon: Mail,
      path: '/invitations',
    },
    {
      label: 'Master Templates',
      icon: Palette,
      path: '/templates',
    },
    ...(user.role === 'admin'
      ? [
          {
            label: 'Kelola Pengguna',
            icon: Users,
            path: '/users',
          },
        ]
      : []),
    {
      label: 'Pengaturan',
      icon: Settings,
      path: '/settings',
    },
  ];

  // Tutup drawer mobile dengan tombol Escape & kunci scroll body saat drawer terbuka
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseMobile && onCloseMobile();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileOpen, onCloseMobile]);

  const handleNavClick = (e, path) => {
    if (e) e.preventDefault();
    onNavigate && onNavigate(path);
    onCloseMobile && onCloseMobile();
  };

  const renderSidebarContent = (expanded) => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div
        className={`flex items-center border-b border-slate-800/80 py-4 ${
          expanded ? 'justify-between px-5' : 'justify-center px-2'
        }`}
      >
        <a
          href="/dashboard"
          onClick={(e) => handleNavClick(e, '/dashboard')}
          className="flex items-center gap-3 overflow-hidden focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          {expanded && (
            <div className="truncate">
              <h1 className="text-sm font-bold text-white tracking-wide">NikahDigital</h1>
              <p className="text-[11px] text-slate-400">Admin Platform</p>
            </div>
          )}
        </a>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Tutup Menu Navigasi"
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Desktop collapse toggle */}
        {expanded && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Ciutkan Sidebar"
          >
            <ChevronLeft className="w-4 h-4 transition-transform duration-300" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed on desktop */}
      {!expanded && (
        <div className="hidden lg:flex justify-center py-2 border-b border-slate-800/60">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Perluas Sidebar"
          >
            <ChevronLeft className="w-4 h-4 rotate-180 transition-transform duration-300" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav
        aria-label="Navigasi Utama Admin"
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-1.5"
      >
        {navItems.map((item) => {
          const isActive =
            currentPath === item.path ||
            (item.path !== '/dashboard' && currentPath.startsWith(item.path + '/'));
          const Icon = item.icon;

          return (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group relative cursor-pointer ${
                !expanded ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={!expanded ? item.label : undefined}
            >
              <Icon
                aria-hidden="true"
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {expanded && <span className="flex-1 text-left truncate">{item.label}</span>}

              {expanded && item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Bottom User Preview */}
      <div className="p-3 border-t border-slate-800/80">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 ${
            !expanded ? 'flex-col justify-center gap-2' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Keluar dari Aplikasi"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out h-full z-30 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {renderSidebarContent(isOpen)}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer — always expanded so labels & user profile are visible */}
      <aside
        aria-label="Menu Navigasi Mobile"
        aria-hidden={!isMobileOpen}
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[82dvw] h-dvh transition-transform duration-300 ease-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
};
