import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Input,
  Switch,
  Spinner,
} from '../components/ui';
import { templateService } from '../services/templateService';
import { useToast } from '../components/ui/Toast';
import {
  Plus,
  Palette,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Image as ImageIcon,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { InvitationTemplateModal } from '../components/invitation/InvitationTemplateModal';

export const TemplatesPage = () => {
  const toast = useToast();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [templateCode, setTemplateCode] = useState('');
  const [name, setName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Live Template Preview state
  const [previewModalData, setPreviewModalData] = useState(null);

  const handlePreviewTemplate = (tmpl) => {
    setPreviewModalData({
      template: tmpl,
      template_code: tmpl.template_code,
      client_name: `Demo: ${tmpl.name}`,
      content_json: {
        mempelaiPria: 'Arya Bimantara, S.T.',
        ayahPria: 'Bpk. H. Suryo Kusumo',
        ibuPria: 'Ibu Hj. Endang Rahayu',
        mempelaiWanita: 'Bella Maharani, S.Ds.',
        ayahWanita: 'Bpk. H. Hendra Wijaya',
        ibuWanita: 'Ibu Hj. Ratna Juwita',
        ayat: 'QS. Ar-Rum: 21',
        akad: {
          tanggal: 'Minggu, 15 November 2026',
          waktu: '08:00 - 10:00 WIB',
          lokasi: 'Masjid Agung Al-Akbar Surabaya',
          alamat: 'Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya',
          mapUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya',
        },
        resepsi: {
          tanggal: 'Minggu, 15 November 2026',
          waktu: '11:00 - 14:00 WIB',
          lokasi: 'Grand Ballroom Hotel Majapahit, Surabaya',
          alamat: 'Jl. Tunjungan No.65, Genteng, Surabaya',
          mapUrl: 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
        },
        rekening: [
          { bank: 'BCA', nomor: '8291038192', nama: 'Arya Bimantara' },
          { bank: 'Mandiri', nomor: '1420019283019', nama: 'Bella Maharani' },
        ],
        alamatKado: 'Jl. Dharmahusada Indah Barat VI No. 24, Mulyorejo, Surabaya (0812-3456-7890)',
      },
      rsvps: [
        {
          id: 1,
          guest_name: 'Drs. H. Bambang Soemantri',
          attendance_status: 'Hadir',
          message: 'Selamat menempuh hidup baru untuk kedua mempelai.',
          created_at: new Date().toISOString(),
        },
      ],
    });
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await templateService.getAll();
      setTemplates(res?.data || []);
    } catch (err) {
      console.error('Error load templates:', err);
      toast.error('Gagal memuat katalog template.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setTemplateCode('');
    setName('');
    setThumbnailUrl('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tmpl) => {
    setIsEditing(true);
    setEditId(tmpl.id);
    setTemplateCode(tmpl.template_code);
    setName(tmpl.name);
    setThumbnailUrl(tmpl.thumbnail_url || '');
    setIsActive(tmpl.is_active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!templateCode || !name) {
      toast.error('Kode template dan nama template wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await templateService.update(editId, {
          template_code: templateCode,
          name,
          thumbnail_url: thumbnailUrl,
          is_active: isActive,
        });
        toast.success('Template berhasil diperbarui!');
      } else {
        await templateService.create({
          template_code: templateCode,
          name,
          thumbnail_url: thumbnailUrl,
          is_active: isActive,
        });
        toast.success('Template baru berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      loadTemplates();
    } catch (err) {
      console.error('Error saving template:', err);
      toast.error(err.message || 'Gagal menyimpan template.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, tmplName) => {
    if (!window.confirm(`Yakin ingin menghapus template "${tmplName}"?`)) return;

    try {
      await templateService.delete(id);
      toast.success(`Template "${tmplName}" berhasil dihapus.`);
      loadTemplates();
    } catch (err) {
      console.error('Error deleting template:', err);
      toast.error(err.message || 'Gagal menghapus template.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Katalog Master Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Master desain undangan digital yang dapat dipilih saat membuat undangan baru.
          </p>
        </div>

        <Button variant="primary" leftIcon={Plus} onClick={handleOpenCreate}>
          Tambah Template Baru
        </Button>
      </div>

      {/* Grid of Templates */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Spinner size="lg" label="Memuat template..." />
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <Palette className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">Belum ada template yang terdaftar.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((tmpl) => (
            <Card key={tmpl.id} className="group overflow-hidden flex flex-col hover:shadow-xl transition-all border-slate-200/90">
              {/* Thumbnail Image with Live Preview Hover */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                {tmpl.thumbnail_url ? (
                  <img
                    src={tmpl.thumbnail_url}
                    alt={tmpl.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">Tidak ada preview</span>
                  </div>
                )}

                {/* Hover overlay preview button */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={Eye}
                    onClick={() => handlePreviewTemplate(tmpl)}
                    className="shadow-lg"
                  >
                    Live Preview
                  </Button>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <Badge variant={tmpl.is_active ? 'success' : 'default'} dot>
                    {tmpl.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-indigo-600 font-mono mt-0.5">
                    code: {tmpl.template_code}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    ID: #{tmpl.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewTemplate(tmpl)}
                      title="Lihat Preview Langsung"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <a
                      href={`/invitation/${tmpl.template_code}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Buka di Tab Baru"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(tmpl)}
                      title="Edit Template"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(tmpl.id, tmpl.name)}
                      title="Hapus Template"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Template' : 'Tambah Template Baru'}
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
                label="Kode Template (Unique Code)"
                required
                placeholder="rustic-wood"
                value={templateCode}
                onChange={(e) => setTemplateCode(e.target.value)}
                helperText="Kode unik pengenal template (huruf kecil & tanda hubung)"
              />

              <Input
                label="Nama Tampilan Template"
                required
                placeholder="Rustic Wood & Vintage"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="URL Gambar Thumbnail"
                placeholder="https://example.com/preview.jpg"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                helperText="Link gambar preview tampilan template"
              />

              <div className="pt-2">
                <Switch
                  checked={isActive}
                  onChange={setIsActive}
                  label="Status Aktif"
                  helperText="Template aktif dapat dipilih pada pembuatan undangan baru"
                />
              </div>

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
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Template'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Template Modal */}
      {previewModalData && (
        <InvitationTemplateModal
          isOpen={Boolean(previewModalData)}
          onClose={() => setPreviewModalData(null)}
          invitation={previewModalData}
          guest={{ name: 'Tamu Undangan Terhormat', category: 'VIP', pax: 2 }}
        />
      )}
    </div>
  );
};
