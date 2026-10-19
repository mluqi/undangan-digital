import React from 'react';
import {
  LayoutDashboard,
  Mail,
  Palette,
  MessageSquareHeart,
  Settings,
  ChevronLeft,
  X,
  Sparkles,
  LogOut,
  Users,
  QrCode,
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

  const handleNavClick = (path) => {
    onNavigate && onNavigate(path);
    onCloseMobile && onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          {isOpen && (
            <div className="truncate">
              <h1 className="text-sm font-bold text-white tracking-wide">NikahDigital</h1>
              <p className="text-[11px] text-slate-400">Admin Platform</p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isOpen ? 'Ciutkan Sidebar' : 'Perluas Sidebar'}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${
              !isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {isOpen && <span className="flex-1 text-left truncate">{item.label}</span>}

              {isOpen && item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User Preview */}
      <div className="p-3 border-t border-slate-800/80">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 ${
            !isOpen ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user.name.charAt(0)}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          )}
          {isOpen && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
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
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] transition-transform duration-300 ease-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
