import React, { useState, useEffect } from 'react';
import {
  DataTable,
  Button,
  Badge,
  Card,
  Select,
  Input,
  Textarea,
} from '../components/ui';
import { rsvpService } from '../services/rsvpService';
import { invitationService } from '../services/invitationService';
import { useToast } from '../components/ui/Toast';
import {
  MessageSquareHeart,
  UserCheck,
  UserX,
  HelpCircle,
  Plus,
  Trash2,
  X,
  Send,
} from 'lucide-react';

export const RsvpsPage = () => {
  const toast = useToast();
  const [invitations, setInvitations] = useState([]);
  const [selectedInvId, setSelectedInvId] = useState('');
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState({ total: 0, hadir: 0, tidakHadir: 0, raguRagu: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate guest RSVP submission modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('Hadir');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const res = await invitationService.getAll({ limit: 50 });
      const list = res?.data?.invitations || [];
      setInvitations(
        list.map((inv) => ({
          value: inv.id.toString(),
          label: `${inv.client_name} (/${inv.slug})`,
        }))
      );

      if (list.length > 0) {
        setSelectedInvId(list[0].id.toString());
      }
    } catch (err) {
      console.error('Error load invitations for RSVP:', err);
      toast.error('Gagal memuat daftar undangan.');
    }
  };

  useEffect(() => {
    if (selectedInvId) {
      loadRsvps(selectedInvId);
    }
  }, [selectedInvId]);

  const loadRsvps = async (invId) => {
    setIsLoading(true);
    try {
      const res = await rsvpService.getByInvitation(invId);
      setRsvps(res?.data?.rsvps || []);
      setStats(
        res?.data?.stats || { total: 0, hadir: 0, tidakHadir: 0, raguRagu: 0 }
      );
    } catch (err) {
      console.error('Error load rsvps:', err);
      toast.error('Gagal memuat data RSVP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRsvp = async (id, name) => {
    if (!window.confirm(`Hapus ucapan dan konfirmasi dari "${name}"?`)) return;

    try {
      await rsvpService.delete(id);
      toast.success('Pesan RSVP berhasil dihapus.');
      loadRsvps(selectedInvId);
    } catch (err) {
      console.error('Error deleting RSVP:', err);
      toast.error(err.message || 'Gagal menghapus pesan RSVP.');
    }
  };

  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    if (!guestName) {
      toast.error('Nama tamu wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await rsvpService.submit({
        invitation_id: parseInt(selectedInvId, 10),
        guest_name: guestName,
        attendance_status: attendanceStatus,
        message,
      });

      toast.success('Konfirmasi kehadiran & ucapan tamu berhasil disimpan!');
      setIsModalOpen(false);
      setGuestName('');
      setMessage('');
      loadRsvps(selectedInvId);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      toast.error(err.message || 'Gagal mengirim RSVP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'guest_name',
      header: 'Nama Tamu',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'attendance_status',
      header: 'Konfirmasi Kehadiran',
      sortable: true,
      render: (val) => {
        const variants = {
          Hadir: 'success',
          'Tidak Hadir': 'danger',
          'Ragu-ragu': 'warning',
        };
        return (
          <Badge variant={variants[val] || 'default'} dot>
            {val}
          </Badge>
        );
      },
    },
    {
      key: 'message',
      header: 'Ucapan & Doa',
      render: (val) => (
        <span className="text-xs sm:text-sm text-slate-600 italic leading-relaxed line-clamp-2 max-w-md">
          "{val || '-'}"
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Waktu Pengiriman',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-slate-400">
          {new Date(val).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Moderasi',
      align: 'right',
      render: (_, row) => (
        <Button
          size="sm"
          variant="ghost"
          title="Hapus Ucapan"
          onClick={() => handleDeleteRsvp(row.id, row.guest_name)}
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Buku Tamu & RSVP
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekap konfirmasi kehadiran tamu undangan serta ucapan doa dari para kerabat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={Plus}
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedInvId}
          >
            Simulasi Kirim RSVP
          </Button>
        </div>
      </div>

      {/* Select Invitation Filter */}
      <Card className="p-4 sm:p-5 border-slate-200/90">
        <div className="max-w-md">
          <Select
            label="Pilih Undangan untuk Ditinjau"
            options={invitations}
            value={selectedInvId}
            onChange={setSelectedInvId}
            placeholder="Pilih undangan..."
          />
        </div>
      </Card>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Konfirmasi</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </Card>

        <Card className="p-4 border-emerald-100 bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-700 uppercase">Hadir</p>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.hadir}</p>
        </Card>

        <Card className="p-4 border-rose-100 bg-rose-50/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-rose-700 uppercase">Tidak Hadir</p>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-800 mt-1">{stats.tidakHadir}</p>
        </Card>

        <Card className="p-4 border-amber-100 bg-amber-50/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-700 uppercase">Ragu-ragu</p>
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 mt-1">{stats.raguRagu}</p>
        </Card>
      </div>

      {/* RSVPs Table */}
      <DataTable
        columns={columns}
        data={rsvps}
        isLoading={isLoading}
        searchPlaceholder="Cari nama tamu..."
        emptyMessage="Belum ada ucapan RSVP pada undangan yang dipilih."
      />

      {/* Modal Simulasi Kirim RSVP Tamu */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Simulasi Kirim RSVP Tamu
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="p-6 space-y-4">
              <Input
                label="Nama Tamu Undangan"
                required
                placeholder="Masukkan nama tamu / keluarga..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />

              <Select
                label="Konfirmasi Kehadiran"
                options={[
                  { value: 'Hadir', label: 'Ya, Saya akan Hadir' },
                  { value: 'Tidak Hadir', label: 'Maaf, Tidak Bisa Hadir' },
                  { value: 'Ragu-ragu', label: 'Masih Ragu-ragu' },
                ]}
                value={attendanceStatus}
                onChange={setAttendanceStatus}
              />

              <Textarea
                label="Ucapan & Doa Restu"
                rows={3}
                placeholder="Selamat menempuh hidup baru..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" rightIcon={Send} isLoading={isSubmitting}>
                  Kirim RSVP
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
