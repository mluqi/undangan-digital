import React from 'react';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { Breadcrumb } from '../ui/Breadcrumb';
import { SearchBar } from '../ui/SearchBar';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';

export const Header = ({
  onOpenMobileSidebar,
  breadcrumbItems = [],
  title,
  user = { name: 'Admin Undangan', role: 'admin' },
  onLogout,
  onSearch,
}) => {
  return (
    <header className="shrink-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Breadcrumbs / Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {breadcrumbItems.length > 0 ? (
              <Breadcrumb items={breadcrumbItems} />
            ) : title ? (
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                {title}
              </h2>
            ) : null}
          </div>
        </div>

        {/* Right Side: Search, Notifications, User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* SearchBar */}
          <div className="hidden md:block w-48 lg:w-64">
            <SearchBar
              size="sm"
              placeholder="Cari sesuatu... ( / )"
              showShortcut={true}
              onChange={onSearch}
            />
          </div>

          {/* Notification Button */}
          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* User Profile Dropdown */}
          <Dropdown
            align="right"
            trigger={
              <div className="flex items-center gap-2.5 p-1 pl-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-400 capitalize">
                    {user.role || 'Admin'}
                  </p>
                </div>
              </div>
            }
          >
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-800">{user.name}</p>
              <p className="text-[11px] text-slate-400">{user.email || 'admin@undangan.id'}</p>
            </div>
            <DropdownItem icon={User}>Profil Saya</DropdownItem>
            <DropdownItem icon={Settings}>Pengaturan Akun</DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={LogOut} danger onClick={onLogout}>
              Keluar
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
