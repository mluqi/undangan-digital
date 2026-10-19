import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, DataTable, Spinner } from '../components/ui';
import { invitationService } from '../services/invitationService';
import { templateService } from '../services/templateService';
import { userService } from '../services/userService';
import { rsvpService } from '../services/rsvpService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import {
  Mail,
  MessageSquareHeart,
  Palette,
  Users,
  Plus,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    invitationsCount: 0,
    rsvpsCount: 0,
    templatesCount: 0,
    usersCount: 0,
  });
  const [recentInvitations, setRecentInvitations] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [invRes, tmplRes, rsvpRes] = await Promise.all([
        invitationService.getAll({ limit: 5 }),
        templateService.getAll(),
        rsvpService.getTotalStats().catch(() => ({ data: { total: 0 } })),
      ]);

      const invList = invRes?.data?.invitations || [];
      setRecentInvitations(invList);

      const tmplList = tmplRes?.data || [];

      let usersCount = 0;
      if (isAdmin) {
        try {
          const userRes = await userService.getAll();
          usersCount = userRes?.data?.length || 0;
        } catch (e) {
          console.warn('Could not load users count', e);
        }
      }

      setStats({
        invitationsCount: invRes?.data?.total || invList.length,
        templatesCount: tmplList.length,
        usersCount: usersCount,
        rsvpsCount: rsvpRes?.data?.total || 0,
      });
    } catch (error) {
      console.error('Error load dashboard:', error);
      toast.error('Gagal memuat data ringkasan dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'client_name',
      header: 'Nama Undangan / Client',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{val}</span>
          <span className="text-xs text-slate-400 font-mono">/{row.slug}</span>
        </div>
      ),
    },
    {
      key: 'template',
      header: 'Template',
      render: (tmpl) => (
        <Badge variant="primary" dot>
          {tmpl?.name || 'Rustic Wood'}
        </Badge>
      ),
    },
    {
      key: 'expired_at',
      header: 'Masa Aktif',
      render: (val) => {
        if (!val) return <span className="text-slate-400">-</span>;
        const isExp = new Date() > new Date(val);
        return (
          <Badge variant={isExp ? 'danger' : 'success'} size="sm" dot>
            {isExp ? 'Kedaluwarsa' : 'Aktif'}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      align: 'right',
      render: (_, row) => (
        <Button
          size="sm"
          variant="secondary"
          className="text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
          onClick={() => onNavigate('/invitations')}
        >
          Kelola Undangan
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Platform Undangan Pernikahan Digital v1.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat datang kembali, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Pantau seluruh aktivitas pembuatan undangan client, kehadiran buku tamu RSVP, serta master katalog template Anda dari dashboard ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              className="bg-white text-indigo-900 hover:bg-indigo-50 border-0 font-semibold shadow-md"
              leftIcon={Plus}
              onClick={() => onNavigate('/invitations')}
            >
              Buat Undangan Baru
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="p-5 flex items-center gap-4 hover:border-indigo-200 transition-all cursor-pointer" onClick={() => onNavigate('/invitations')}>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Undangan</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{stats.invitationsCount}</span>
              <Badge variant="primary" size="sm">Aktif</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 hover:border-emerald-200 transition-all cursor-pointer" onClick={() => onNavigate('/invitations')}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Konfirmasi RSVP</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{stats.rsvpsCount}</span>
              <Badge variant="success" size="sm">Hadir</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 hover:border-amber-200 transition-all cursor-pointer" onClick={() => onNavigate('/templates')}>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Master Templates</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{stats.templatesCount}</span>
              <Badge variant="warning" size="sm">Katalog</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 hover:border-purple-200 transition-all cursor-pointer" onClick={() => onNavigate(isAdmin ? '/users' : '/settings')}>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengguna Sistem</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{stats.usersCount}</span>
              <Badge variant="info" size="sm">Terdaftar</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Sections: Recent Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invitations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Undangan Client Terbaru
            </h2>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={ArrowRight}
              onClick={() => onNavigate('/invitations')}
            >
              Lihat Semua
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={recentInvitations}
            isLoading={isLoading}
            pagination={false}
            searchable={false}
            emptyMessage="Belum ada undangan yang dibuat."
          />
        </div>

        {/* Quick Tips & Short Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alur Kerja Undangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Pilih Template</h4>
                  <p className="text-slate-500 text-xs">Pilih desain dari katalog template master.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Buat Undangan & Slug</h4>
                  <p className="text-slate-500 text-xs">Tentukan nama client dan link unik (misal: /nama-pasangan).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Bagikan & Pantau RSVP</h4>
                  <p className="text-slate-500 text-xs">Tamu membuka link dan mengirim konfirmasi kehadiran serta doa.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
