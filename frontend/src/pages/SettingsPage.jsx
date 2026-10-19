import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Switch } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { User, Lock, Server, ShieldCheck, Save } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  // Profile form
  const [name, setName] = useState(user?.name || 'Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@undangan.id');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // System settings
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoApproveRsvp, setAutoApproveRsvp] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setTimeout(() => {
      setIsUpdatingProfile(false);
      toast.success('Profil akun berhasil diperbarui!');
    }, 600);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Kata sandi saat ini dan kata sandi baru wajib diisi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Kata sandi Anda berhasil diperbarui!');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pengaturan Sistem & Profil
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola informasi akun personal Anda, preferensi sistem, dan konfigurasi platform.
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Informasi Profil Pengguna</CardTitle>
            <CardDescription>Perbarui nama akun dan alamat email yang digunakan untuk masuk.</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSaveProfile}>
          <CardContent className="space-y-4">
            <Input
              label="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={User}
              required
            />
            <Input
              label="Alamat Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Email ini digunakan sebagai akun login Anda."
              required
            />
          </CardContent>
          <CardFooter>
            <div />
            <Button type="submit" variant="primary" leftIcon={Save} isLoading={isUpdatingProfile}>
              Simpan Profil
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Ubah Kata Sandi</CardTitle>
            <CardDescription>Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSavePassword}>
          <CardContent className="space-y-4">
            <Input
              label="Kata Sandi Saat Ini"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              leftIcon={Lock}
              placeholder="Masukkan kata sandi lama"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kata Sandi Baru"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={Lock}
                placeholder="Minimal 6 karakter"
              />
              <Input
                label="Konfirmasi Kata Sandi Baru"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={Lock}
                placeholder="Ulangi kata sandi baru"
              />
            </div>
          </CardContent>
          <CardFooter>
            <div />
            <Button type="submit" variant="primary" leftIcon={Lock} isLoading={isUpdatingPassword}>
              Perbarui Kata Sandi
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Preferensi Sistem & Notifikasi</CardTitle>
            <CardDescription>Atur alur otomatisasi konfirmasi RSVP dan informasi server.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Switch
            checked={emailNotif}
            onChange={setEmailNotif}
            label="Notifikasi Email untuk RSVP Baru"
            helperText="Kirim pemberitahuan setiap kali ada tamu yang mengirim ucapan atau konfirmasi."
          />
          <div className="pt-2">
            <Switch
              checked={autoApproveRsvp}
              onChange={setAutoApproveRsvp}
              label="Tampilkan Buku Tamu Secara Langsung"
              helperText="Pesan ucapan tamu langsung muncul tanpa perlu persetujuan manual admin."
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Status Server: <strong>Online</strong> (MySQL: `db_invitation`)</span>
            </div>
            <span className="font-mono text-slate-400">API Port: 8000</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
