import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar, Header } from './components/layout';
import { ToastProvider, useToast, Spinner } from './components/ui';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';

// Import Pages
import { DashboardPage } from './pages/DashboardPage';
import { InvitationsPage } from './pages/InvitationsPage';
import { InvitationDetailPage } from './pages/InvitationDetailPage';
import { GuestsPage } from './pages/GuestsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { RsvpsPage } from './pages/RsvpsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicInvitationPage } from './pages/PublicInvitationPage';

const PUBLIC_PREFIXES = [
  '/invitation/',
  '/preview/',
  '/template/',
  '/templates/preview/',
  '/u/',
  '/p/',
];

const VALID_DETAIL_TABS = ['guests', 'rsvps', 'settings', 'preview'];

const TAB_LABELS = {
  guests: 'Daftar Tamu',
  rsvps: 'Ucapan & RSVP',
  settings: 'Edit Konten & Tema',
  preview: 'Live Preview',
};

function normalizePath(rawPath) {
  if (!rawPath) return '/dashboard';
  const [pathname] = rawPath.split('?');
  const cleaned = pathname.replace(/\/+$/, '');
  return cleaned || '/';
}

function parseAdminRoute(pathname) {
  const clean = normalizePath(pathname);

  // Match /invitations/:id or /invitations/:id/:tab
  const invDetailMatch = clean.match(/^\/invitations\/([^/]+)(?:\/([^/]+))?$/);
  if (invDetailMatch) {
    const invitationId = invDetailMatch[1];
    const rawTab = invDetailMatch[2] || 'guests';
    const tab = VALID_DETAIL_TABS.includes(rawTab) ? rawTab : 'guests';
    return {
      section: '/invitations',
      type: 'invitation-detail',
      invitationId,
      tab,
      canonicalPath: invDetailMatch[2] && VALID_DETAIL_TABS.includes(rawTab)
        ? `/invitations/${invitationId}/${tab}`
        : `/invitations/${invitationId}`,
    };
  }

  switch (clean) {
    case '/dashboard':
    case '/invitations':
    case '/templates':
    case '/users':
    case '/settings':
    case '/guests':
    case '/rsvps':
      return {
        section: clean,
        type: 'page',
        canonicalPath: clean,
      };
    default:
      return {
        section: '/dashboard',
        type: 'redirect',
        canonicalPath: '/dashboard',
      };
  }
}

function DashboardLayout({ currentPath, onNavigate }) {
  const toast = useToast();
  const { user, logout } = useAuth();
  const mainScrollRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeInvitationTitle, setActiveInvitationTitle] = useState('');

  const route = parseAdminRoute(currentPath);

  // Redirect unknown paths or non-admin from /users to /dashboard
  useEffect(() => {
    if (route.type === 'redirect') {
      onNavigate('/dashboard', { replace: true });
      return;
    }
    if (route.section === '/users' && user?.role && user.role !== 'admin') {
      onNavigate('/dashboard', { replace: true });
    }
  }, [route.type, route.section, user?.role, onNavigate]);

  // Reset scroll position when switching top-level route or invitation ID
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [route.section, route.invitationId]);

  // Update browser tab title dynamically
  useEffect(() => {
    const titles = {
      '/dashboard': 'Dashboard — UndanganKita Admin',
      '/invitations': route.type === 'invitation-detail'
        ? `${activeInvitationTitle || `Undangan #${route.invitationId}`} (${TAB_LABELS[route.tab] || 'Detail'}) — UndanganKita Admin`
        : 'Undangan Client — UndanganKita Admin',
      '/templates': 'Master Templates — UndanganKita Admin',
      '/users': 'Kelola Pengguna — UndanganKita Admin',
      '/settings': 'Pengaturan — UndanganKita Admin',
      '/guests': 'Daftar Tamu — UndanganKita Admin',
      '/rsvps': 'Ucapan & RSVP — UndanganKita Admin',
    };
    document.title = titles[route.section] || 'UndanganKita Admin';
  }, [route.section, route.type, route.invitationId, route.tab, activeInvitationTitle]);

  const handleLogout = async () => {
    await logout();
    onNavigate('/login', { replace: true });
    toast.info('Anda telah keluar dari aplikasi.');
  };

  const getBreadcrumbs = () => {
    if (route.type === 'invitation-detail') {
      const items = [
        { label: 'Undangan Client', href: '/invitations' },
        {
          label: activeInvitationTitle || `Undangan #${route.invitationId}`,
          href: `/invitations/${route.invitationId}`,
        },
      ];
      if (route.tab && TAB_LABELS[route.tab]) {
        items.push({ label: TAB_LABELS[route.tab] });
      }
      return items;
    }

    const pageBreadcrumbs = {
      '/dashboard': [{ label: 'Dashboard' }],
      '/invitations': [{ label: 'Undangan Client' }],
      '/templates': [{ label: 'Master Templates' }],
      '/users': [{ label: 'Kelola Pengguna' }],
      '/settings': [{ label: 'Pengaturan' }],
      '/guests': [{ label: 'Daftar Tamu' }],
      '/rsvps': [{ label: 'Ucapan & RSVP' }],
    };

    return pageBreadcrumbs[route.section] || [{ label: 'Dashboard' }];
  };

  const renderCurrentPage = () => {
    if (route.type === 'invitation-detail') {
      return (
        <InvitationDetailPage
          invitationId={route.invitationId}
          activeTab={route.tab}
          onTabChange={(nextTab) => {
            onNavigate(`/invitations/${route.invitationId}/${nextTab}`);
          }}
          onBack={() => {
            setActiveInvitationTitle('');
            onNavigate('/invitations');
          }}
          onInvitationLoaded={(inv) => {
            if (inv?.title || (inv?.groom_nickname && inv?.bride_nickname)) {
              setActiveInvitationTitle(
                inv.groom_nickname && inv.bride_nickname
                  ? `${inv.groom_nickname} & ${inv.bride_nickname}`
                  : inv.title
              );
            }
          }}
        />
      );
    }

    switch (route.section) {
      case '/dashboard':
        return <DashboardPage onNavigate={onNavigate} />;
      case '/invitations':
        return (
          <InvitationsPage
            onNavigate={onNavigate}
            onSelectInvitation={(id, tab) => {
              setActiveInvitationTitle('');
              onNavigate(tab ? `/invitations/${id}/${tab}` : `/invitations/${id}`);
            }}
          />
        );
      case '/guests':
        return <GuestsPage />;
      case '/rsvps':
        return <RsvpsPage />;
      case '/templates':
        return <TemplatesPage />;
      case '/users':
        return <UsersPage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="h-dvh flex overflow-hidden bg-slate-50/70 font-sans text-slate-800">
      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isMobileOpen={mobileSidebarOpen}
        onToggleCollapse={() => setSidebarOpen(!sidebarOpen)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        currentPath={route.canonicalPath}
        onNavigate={(path) => onNavigate(path)}
        user={{
          name: user?.name || 'Administrator',
          email: user?.email || 'admin@undangan.id',
          role: user?.role || 'admin',
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-dvh min-w-0 overflow-hidden">
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          breadcrumbItems={getBreadcrumbs()}
          onNavigate={(path) => onNavigate(path)}
          user={{
            name: user?.name || 'Administrator',
            email: user?.email || 'admin@undangan.id',
            role: user?.role || 'admin',
          }}
          onLogout={handleLogout}
        />

        <main
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl w-full mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

function MainApp() {
  const [locationPath, setLocationPath] = useState(() => window.location.pathname);
  const intendedPathRef = useRef(null);

  const navigate = useCallback((to, options = {}) => {
    const target = normalizePath(to);
    const current = normalizePath(window.location.pathname);

    if (options.replace) {
      window.history.replaceState({ path: target }, '', target);
    } else if (target !== current) {
      window.history.pushState({ path: target }, '', target);
    }
    setLocationPath(target);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setLocationPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Support berbagai prefix URL publik & live preview template
  const matchedPrefix = PUBLIC_PREFIXES.find((p) => locationPath.startsWith(p));
  if (matchedPrefix) {
    const slug = locationPath.replace(matchedPrefix, '').split('/')[0].split('?')[0];
    if (slug) {
      return <PublicInvitationPage slug={slug} />;
    }
  }

  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (matchedPrefix) return;

    const cleanPath = normalizePath(locationPath);

    if (!isAuthenticated) {
      if (cleanPath !== '/login' && cleanPath !== '/') {
        intendedPathRef.current = cleanPath;
      }
      if (cleanPath !== '/login') {
        navigate('/login', { replace: true });
      }
      document.title = 'Masuk — UndanganKita Admin';
    } else {
      if (cleanPath === '/login' || cleanPath === '/') {
        const destination = intendedPathRef.current || '/dashboard';
        intendedPathRef.current = null;
        navigate(destination, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, locationPath, matchedPrefix, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50">
        <Spinner size="lg" label="Memeriksa sesi login..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <DashboardLayout currentPath={locationPath} onNavigate={navigate} />;
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
