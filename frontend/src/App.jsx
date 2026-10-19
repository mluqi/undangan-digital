import React, { useState } from 'react';
import { Sidebar, Header } from './components/layout';
import { ToastProvider, useToast, Spinner } from './components/ui';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';

// Import Pages
import { DashboardPage } from './pages/DashboardPage';
import { InvitationsPage } from './pages/InvitationsPage';
import { GuestsPage } from './pages/GuestsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { RsvpsPage } from './pages/RsvpsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicInvitationPage } from './pages/PublicInvitationPage';

function DashboardLayout() {
  const toast = useToast();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const handleLogout = async () => {
    await logout();
    toast.info('Anda telah keluar dari aplikasi.');
  };

  const pageBreadcrumbs = {
    '/dashboard': [{ label: 'Dashboard' }],
    '/invitations': [{ label: 'Beranda', href: '#' }, { label: 'Undangan Client' }],
    '/templates': [{ label: 'Beranda', href: '#' }, { label: 'Master Templates' }],
    '/users': [{ label: 'Beranda', href: '#' }, { label: 'Kelola Pengguna' }],
    '/settings': [{ label: 'Beranda', href: '#' }, { label: 'Pengaturan' }],
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage onNavigate={setCurrentPath} />;
      case '/invitations':
        return <InvitationsPage />;
      case '/guests':
      case '/rsvps':
        return <InvitationsPage />;
      case '/templates':
        return <TemplatesPage />;
      case '/users':
        return <UsersPage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPath} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50/70 font-sans text-slate-800">
      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isMobileOpen={mobileSidebarOpen}
        onToggleCollapse={() => setSidebarOpen(!sidebarOpen)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        user={{
          name: user?.name || 'Administrator',
          email: user?.email || 'admin@undangan.id',
          role: user?.role || 'admin',
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          breadcrumbItems={pageBreadcrumbs[currentPath] || [{ label: 'Dashboard' }]}
          user={{
            name: user?.name || 'Administrator',
            email: user?.email || 'admin@undangan.id',
            role: user?.role || 'admin',
          }}
          onLogout={handleLogout}
          onSearch={(val) => console.log('Search query:', val)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

function MainApp() {
  const path = window.location.pathname;

  // Support berbagai prefix URL publik & live preview template
  const publicPrefixes = [
    '/invitation/',
    '/preview/',
    '/template/',
    '/templates/preview/',
    '/u/',
    '/p/',
  ];

  const matchedPrefix = publicPrefixes.find((p) => path.startsWith(p));
  if (matchedPrefix) {
    const slug = path.replace(matchedPrefix, '').split('/')[0].split('?')[0];
    if (slug) {
      return <PublicInvitationPage slug={slug} />;
    }
  }

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Spinner size="lg" label="Memeriksa sesi login..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <DashboardLayout />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
