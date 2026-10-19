import React, { useState, useEffect } from 'react';
import {
  DataTable,
  Button,
  Badge,
  Input,
  Select,
} from '../components/ui';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  UserCheck,
  Shield,
  User as UserIcon,
} from 'lucide-react';

export const UsersPage = () => {
  const toast = useToast();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getAll();
      setUsers(res?.data || []);
    } catch (err) {
      console.error('Error load users:', err);
      toast.error('Gagal memuat data pengguna.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setIsEditing(true);
    setEditId(u.id);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setRole(u.role || 'user');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Nama dan email wajib diisi.');
      return;
    }

    if (!isEditing && !password) {
      toast.error('Password wajib diisi untuk pengguna baru.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await userService.update(editId, {
          name,
          email,
          ...(password ? { password } : {}),
          role,
        });
        toast.success('Data pengguna berhasil diperbarui!');
      } else {
        await userService.create({
          name,
          email,
          password,
          role,
        });
        toast.success('Pengguna baru berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error(err.message || 'Gagal menyimpan data pengguna.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, userName) => {
    if (parseInt(id, 10) === parseInt(currentUser?.id, 10)) {
      toast.warning('Anda tidak dapat menghapus akun Anda sendiri.');
      return;
    }

    if (!window.confirm(`Yakin ingin menghapus pengguna "${userName}"?`)) return;

    try {
      await userService.delete(id);
      toast.success(`Pengguna "${userName}" berhasil dihapus.`);
      loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.message || 'Gagal menghapus pengguna.');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Nama Pengguna',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
            {val.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{val}</span>
            <span className="text-xs text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Hak Akses (Role)',
      sortable: true,
      render: (val) => (
        <Badge variant={val === 'admin' ? 'primary' : 'default'} dot>
          {val === 'admin' ? 'Administrator' : 'User / Client'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Tanggal Didaftarkan',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-slate-500">
          {val ? new Date(val).toLocaleDateString('id-ID') : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            title="Edit Pengguna"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Hapus Pengguna"
            disabled={parseInt(row.id, 10) === parseInt(currentUser?.id, 10)}
            onClick={() => handleDelete(row.id, row.name)}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Pengguna & Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola daftar akun administrator dan user yang memiliki akses ke sistem.
          </p>
        </div>

        <Button variant="primary" leftIcon={Plus} onClick={handleOpenCreate}>
          Tambah Pengguna Baru
        </Button>
      </div>

      {/* Users DataTable */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Cari pengguna berdasarkan nama atau email..."
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Nama Lengkap"
                required
                placeholder="Masukkan nama pengguna..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Alamat Email"
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label={isEditing ? 'Password Baru (Kosongkan jika tidak diganti)' : 'Password'}
                type="password"
                required={!isEditing}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Select
                label="Peran / Hak Akses (Role)"
                options={[
                  { value: 'user', label: 'User / Client' },
                  { value: 'admin', label: 'Administrator' },
                ]}
                value={role}
                onChange={setRole}
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
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
