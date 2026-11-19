import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
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
  Image as ImageIcon,
  Eye,
  ExternalLink,
  Upload,
  Layout,
  Save,
} from 'lucide-react';
import { InvitationTemplateModal } from '../components/invitation/InvitationTemplateModal';

export const TemplatesPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'landing-cms'
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states (Template Add/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [uploadingCardId, setUploadingCardId] = useState(null);
  const modalFileInputRef = useRef(null);

  // Form states (Template)
  const [templateCode, setTemplateCode] = useState('');
  const [name, setName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [defaultContent, setDefaultContent] = useState({});
  const [isUploadingTemplateVideo, setIsUploadingTemplateVideo] = useState(false);
  const [isUploadingTemplatePrewedVideo, setIsUploadingTemplatePrewedVideo] = useState(false);
  const modalBgVideoRef = useRef(null);
  const modalPrewedVideoRef = useRef(null);

  // Landing Page CMS states
  const [cmsConfig, setCmsConfig] = useState({
    heroTagline: 'ETERNAL ☾ MEMORIES',
    heroSubtitle:
      'Undangan pernikahan digital. Mandiri, terkoneksi QR Check-In sistem luar, atau dirancang custom.',
    systemModes: [
      {
        id: 'standalone',
        num: '01',
        label: 'Hanya Undangan',
        title: 'Undangan Digital Murni.',
        caption: 'Tanpa tampilan QR Check-In. Bersih, intim, siap sebar via WhatsApp.',
        tags: ['Tamu Tak Terbatas', 'RSVP & Doa', 'Amplop Digital', 'Mode Tanpa QR'],
        image:
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80',
      },
      {
        id: 'qrsync',
        num: '02',
        label: 'Konek QR Luar',
        title: 'Sinkronisasi QR Sistem Eksternal.',
        caption:
          'Impor link/kode QR dari vendor buku tamu luar via Excel. Otomatis menjadi kartu akses tiap tamu.',
        tags: [
          'Sync QR Vendor Luar',
          'VVIP • VIP • Reguler',
          'Grup Otomatis Tanpa QR',
          'Guest Lock',
        ],
        image:
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80',
      },
      {
        id: 'custom',
        num: '03',
        label: 'Custom Atelier',
        title: 'Desain & Alur Eksklusif.',
        caption:
          'Dirancang khusus mengikuti moodboard pernikahan, ornamen adat, atau sistem WO Anda.',
        tags: ['Custom Layout', 'Ilustrasi Adat', 'Format Vendor WO', 'Full Support'],
        image:
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=80',
      },
    ],
    pricelist: [
      {
        tier: '01 / Intimate',
        name: 'Undangan Saja',
        price: '149K',
        note: 'Tanpa sistem QR Check-In',
        items: [
          'Semua tema katalog',
          'Tamu tanpa batas (Excel)',
          'RSVP & ucapan real-time',
          'Amplop & kado (hide/show)',
        ],
        featured: false,
      },
      {
        tier: '02 / Signature',
        name: 'Undangan + QR Sync',
        price: '299K',
        note: 'Konek QR sistem luar / mandiri',
        items: [
          'Semua fitur Intimate',
          'Sync Link/ID QR sistem luar',
          'Kategori VVIP, VIP, Reguler & Grup',
          'Private Guest Lock (Aktif 12 bln)',
        ],
        featured: true,
      },
      {
        tier: '03 / Bespoke',
        name: 'Custom Atelier',
        price: '599K+',
        note: 'Desain & sistem sesuai request',
        items: [
          'Custom layout & warna',
          'Custom ornamen / ilustrasi',
          'Adaptasi format vendor WO',
          'Pendampingan penuh tim',
        ],
        featured: false,
      },
    ],
  });
  const [isSavingCms, setIsSavingCms] = useState(false);
  const [uploadingModeIdx, setUploadingModeIdx] = useState(null);

  // Live Template Preview state
  const [previewModalData, setPreviewModalData] = useState(null);

  const handleModalThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingThumb(true);
    try {
      const res = await templateService.uploadThumbnail(file);
      const uploadedUrl = res?.data?.url || res?.data?.relativeUrl;
      if (uploadedUrl) {
        setThumbnailUrl(uploadedUrl);
        toast.success('Foto showcase Landing Page berhasil diunggah!');
      }
    } catch (err) {
      console.error('Error upload thumbnail:', err);
      toast.error(err.message || 'Gagal mengunggah foto showcase.');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleQuickCardThumbnailUpload = async (tmpl, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadingCardId(tmpl.id);
    try {
      const res = await templateService.uploadThumbnail(file, tmpl.id);
      const uploadedUrl = res?.data?.url;
      if (uploadedUrl) {
        setTemplates((prev) =>
          prev.map((item) =>
            item.id === tmpl.id ? { ...item, thumbnail_url: uploadedUrl } : item
          )
        );
        toast.success(
          `Foto showcase Landing Page untuk "${tmpl.name}" berhasil diperbarui!`
        );
      }
    } catch (err) {
      console.error('Error replace card thumbnail:', err);
      toast.error(err.message || 'Gagal mengganti foto template.');
    } finally {
      setUploadingCardId(null);
    }
  };

  const handleModePhotoUpload = async (idx, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadingModeIdx(idx);
    try {
      const res = await templateService.uploadThumbnail(file);
      const uploadedUrl = res?.data?.url;
      if (uploadedUrl) {
        const nextModes = [...(cmsConfig.systemModes || [])];
        nextModes[idx] = { ...nextModes[idx], image: uploadedUrl };
        const nextConfig = { ...cmsConfig, systemModes: nextModes };
        setCmsConfig(nextConfig);
        await templateService.updateLandingCms(nextConfig);
        toast.success(`Foto Mode "${nextModes[idx].label}" berhasil diperbarui!`);
      }
    } catch (err) {
      toast.error(err.message || 'Gagal mengunggah foto mode.');
    } finally {
      setUploadingModeIdx(null);
    }
  };

  const handleSaveLandingCms = async (e) => {
    if (e) e.preventDefault();
    setIsSavingCms(true);
    try {
      await templateService.updateLandingCms(cmsConfig);
      toast.success('Perubahan CMS Landing Page berhasil disimpan!');
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan CMS Landing Page.');
    } finally {
      setIsSavingCms(false);
    }
  };

  const handlePreviewTemplate = (tmpl) => {
    setPreviewModalData({
      template: tmpl,
      template_code: tmpl.template_code,
      client_name: `Demo: ${tmpl.name}`,
      content_json: {
        ...(tmpl.default_content_json || {}),
        mempelaiPria: 'Arya Bimantara, S.T.',
        panggilanPria: 'Arya',
        ayahPria: 'Bpk. H. Suryo Kusumo',
        ibuPria: 'Ibu Hj. Endang Rahayu',
        mempelaiWanita: 'Bella Maharani, S.Ds.',
        panggilanWanita: 'Bella',
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
        alamatKado:
          'Jl. Dharmahusada Indah Barat VI No. 24, Mulyorejo, Surabaya (0812-3456-7890)',
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
    loadLandingCms();
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

  const loadLandingCms = async () => {
    try {
      const res = await templateService.getLandingCms();
      if (res?.data) {
        setCmsConfig((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Error load landing cms:', err);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setTemplateCode('');
    setName('');
    setThumbnailUrl('');
    setIsActive(true);
    setDefaultContent({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tmpl) => {
    setIsEditing(true);
    setEditId(tmpl.id);
    setTemplateCode(tmpl.template_code);
    setName(tmpl.name);
    setThumbnailUrl(tmpl.thumbnail_url || '');
    setIsActive(tmpl.is_active);
    setDefaultContent(tmpl.default_content_json || {});
    setIsModalOpen(true);
  };

  const handleUploadTemplateVideo = async (e, field) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (field === 'backgroundVideoUrl') setIsUploadingTemplateVideo(true);
    if (field === 'preweddingVideoUrl') setIsUploadingTemplatePrewedVideo(true);
    try {
      const res = await templateService.uploadVideo(file, isEditing ? editId : null);
      const uploadedUrl = res?.data?.url;
      if (uploadedUrl) {
        setDefaultContent((prev) => ({ ...prev, [field]: uploadedUrl }));
        toast.success('Video bawaan template berhasil diunggah!');
      }
    } catch (err) {
      toast.error(err.message || 'Gagal mengunggah video template.');
    } finally {
      if (field === 'backgroundVideoUrl') setIsUploadingTemplateVideo(false);
      if (field === 'preweddingVideoUrl') setIsUploadingTemplatePrewedVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!templateCode || !name) {
      toast.error('Kode template dan nama template wajib diisi.');
      return;
    }

    // Bersihkan key kosong di default_content_json
    const cleanedDefaults = {};
    Object.entries(defaultContent || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        cleanedDefaults[k] = v;
      }
    });

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await templateService.update(editId, {
          template_code: templateCode,
          name,
          thumbnail_url: thumbnailUrl,
          is_active: isActive,
          default_content_json: Object.keys(cleanedDefaults).length > 0 ? cleanedDefaults : null,
        });
        toast.success('Template & data bawaan berhasil diperbarui!');
      } else {
        await templateService.create({
          template_code: templateCode,
          name,
          thumbnail_url: thumbnailUrl,
          is_active: isActive,
          default_content_json: Object.keys(cleanedDefaults).length > 0 ? cleanedDefaults : null,
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
            Master Templates &amp; CMS Landing Page
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola foto showcase tiap tema yang tampil di Landing Page (<code>/</code>)
            serta konten visual halaman depan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
            <span>Lihat Landing Page</span>
          </a>
          {activeTab === 'templates' && (
            <Button variant="primary" leftIcon={Plus} onClick={handleOpenCreate}>
              Tambah Template Baru
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'templates'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Katalog Template &amp; Foto Showcase ({templates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('landing-cms')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'landing-cms'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>CMS Konten &amp; Mode Landing Page</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MASTER TEMPLATES & LANDING SHOWCASE PHOTO UPLOAD        */}
      {/* ============================================================== */}
      {activeTab === 'templates' && (
        <>
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Spinner size="lg" label="Memuat template..." />
            </div>
          ) : templates.length === 0 ? (
            <Card className="p-12 text-center text-slate-400">
              <Palette className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                Belum ada template yang terdaftar.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((tmpl) => (
                <Card
                  key={tmpl.id}
                  className="group overflow-hidden flex flex-col hover:shadow-xl transition-all border-slate-200/90"
                >
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
                        <span className="text-xs">Belum ada foto showcase</span>
                      </div>
                    )}

                    {/* Hover overlay preview button */}
                    <div className="absolute inset-0 bg-slate-950/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={Eye}
                        onClick={() => handlePreviewTemplate(tmpl)}
                        className="shadow-lg"
                      >
                        Live Preview Tema
                      </Button>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant={tmpl.is_active ? 'success' : 'default'} dot>
                        {tmpl.is_active ? 'Tampil di Landing' : 'Disembunyikan'}
                      </Badge>
                    </div>
                  </div>

                  {/* Template Info + Always-Visible Upload Showcase Photo Button */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-indigo-600 font-mono mt-0.5">
                        code: {tmpl.template_code}
                      </p>
                    </div>

                    {/* Prominent Upload Showcase Photo Button */}
                    <div className="pt-1">
                      <label className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingCardId === tmpl.id
                            ? 'Mengunggah Foto...'
                            : 'Upload / Ganti Foto Showcase'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          className="hidden"
                          disabled={uploadingCardId === tmpl.id}
                          onChange={(e) => handleQuickCardThumbnailUpload(tmpl, e)}
                        />
                      </label>
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
                          href={`/preview/${tmpl.template_code}`}
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
                          title="Edit Template & Foto"
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
        </>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CMS KONTEN & VISUAL LANDING PAGE                        */}
      {/* ============================================================== */}
      {activeTab === 'landing-cms' && (
        <form onSubmit={handleSaveLandingCms} className="space-y-6">
          {/* Hero Section CMS */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  1. Teks Pembuka Hero Landing Page
                </h2>
                <p className="text-xs text-slate-500">
                  Sub-label dan deskripsi singkat di bawah judul utama SAMSKARA
                </p>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={Save}
                isLoading={isSavingCms}
              >
                Simpan CMS
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tagline Atas (Hero)"
                value={cmsConfig.heroTagline || ''}
                onChange={(e) =>
                  setCmsConfig({ ...cmsConfig, heroTagline: e.target.value })
                }
                placeholder="ETERNAL ☾ MEMORIES"
              />
              <Input
                label="Sub-kalimat Deskripsi Hero"
                value={cmsConfig.heroSubtitle || ''}
                onChange={(e) =>
                  setCmsConfig({ ...cmsConfig, heroSubtitle: e.target.value })
                }
              />
            </div>
          </Card>

          {/* 3 System Modes Showcase Photos CMS */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                2. Foto Showcase &amp; Teks 3 Mode Sistem
              </h2>
              <p className="text-xs text-slate-500">
                Ganti foto visual dan keterangan pada tab interaktif (01. Hanya
                Undangan, 02. Konek QR Luar, 03. Custom Atelier) di Landing Page.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {(cmsConfig.systemModes || []).map((mode, idx) => (
                <div
                  key={mode.id || idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase">
                      Mode {mode.num} — {mode.label}
                    </span>
                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold cursor-pointer transition">
                      <Upload className="w-3 h-3" />
                      <span>
                        {uploadingModeIdx === idx ? 'Upload...' : 'Ganti Foto'}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        disabled={uploadingModeIdx === idx}
                        onChange={(e) => handleModePhotoUpload(idx, e)}
                      />
                    </label>
                  </div>

                  <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                    <img
                      src={mode.image}
                      alt={mode.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <Input
                    label="Nama Tab"
                    value={mode.label}
                    onChange={(e) => {
                      const next = [...cmsConfig.systemModes];
                      next[idx] = { ...next[idx], label: e.target.value };
                      setCmsConfig({ ...cmsConfig, systemModes: next });
                    }}
                  />
                  <Input
                    label="Judul Mode"
                    value={mode.title}
                    onChange={(e) => {
                      const next = [...cmsConfig.systemModes];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setCmsConfig({ ...cmsConfig, systemModes: next });
                    }}
                  />
                  <Input
                    label="Deskripsi Singkat"
                    value={mode.caption}
                    onChange={(e) => {
                      const next = [...cmsConfig.systemModes];
                      next[idx] = { ...next[idx], caption: e.target.value };
                      setCmsConfig({ ...cmsConfig, systemModes: next });
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* 3 Pricelist Tiers CMS */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  3. Pricelist &amp; Paket Landing Page
                </h2>
                <p className="text-xs text-slate-500">
                  Atur nama paket, harga, dan catatan singkat yang tampil pada seksi
                  Pricelist.
                </p>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={Save}
                isLoading={isSavingCms}
              >
                Simpan Semua Perubahan CMS
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {(cmsConfig.pricelist || []).map((pkg, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                >
                  <Input
                    label="Label Tier"
                    value={pkg.tier}
                    onChange={(e) => {
                      const next = [...cmsConfig.pricelist];
                      next[idx] = { ...next[idx], tier: e.target.value };
                      setCmsConfig({ ...cmsConfig, pricelist: next });
                    }}
                  />
                  <Input
                    label="Nama Paket"
                    value={pkg.name}
                    onChange={(e) => {
                      const next = [...cmsConfig.pricelist];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setCmsConfig({ ...cmsConfig, pricelist: next });
                    }}
                  />
                  <Input
                    label="Harga (IDR)"
                    value={pkg.price}
                    onChange={(e) => {
                      const next = [...cmsConfig.pricelist];
                      next[idx] = { ...next[idx], price: e.target.value };
                      setCmsConfig({ ...cmsConfig, pricelist: next });
                    }}
                  />
                  <Input
                    label="Catatan Singkat"
                    value={pkg.note}
                    onChange={(e) => {
                      const next = [...cmsConfig.pricelist];
                      next[idx] = { ...next[idx], note: e.target.value };
                      setCmsConfig({ ...cmsConfig, pricelist: next });
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </form>
      )}

      {/* Modal Add / Edit Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing
                  ? 'Edit Template, Video & Data Bawaan Tema'
                  : 'Tambah Template Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <Input
                label="Kode Template (Unique Code)"
                required
                placeholder="rustic-wood"
                value={templateCode}
                onChange={(e) => setTemplateCode(e.target.value)}
                helperText="Kode unik pengenal template (huruf kecil & tanda hubung)"
              />

              <Input
                label="Nama Tampilan Template (Di Landing Page & Katalog)"
                required
                placeholder="Rustic Wood & Vintage"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Foto Showcase (Ditampilkan di Landing Page)
                  </label>
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    disabled={isUploadingThumb}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {isUploadingThumb ? 'Mengunggah...' : 'Upload Foto Baru'}
                    </span>
                  </button>
                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    onChange={handleModalThumbnailUpload}
                  />
                </div>

                {thumbnailUrl && (
                  <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={thumbnailUrl}
                      alt="Preview Showcase"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <Input
                  placeholder="Atau tempel URL gambar (https://...)"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  helperText="Unggah foto dari komputer Anda atau masukkan URL gambar"
                />
              </div>

              <div className="pt-2">
                <Switch
                  checked={isActive}
                  onChange={setIsActive}
                  label="Tampilkan di Landing Page & Pembuatan Undangan"
                  helperText="Jika aktif, template ini akan tampil di katalog Landing Page depan"
                />
              </div>

              {/* Data & Video Bawaan Khusus Template Ini */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Data &amp; Video Bawaan Khusus Template Ini
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Setiap template bisa memiliki video background, kutipan, musik, dan label teks bawaan yang berbeda satu sama lain.
                  </p>
                </div>

                <input
                  ref={modalBgVideoRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/*"
                  className="hidden"
                  onChange={(e) => handleUploadTemplateVideo(e, 'backgroundVideoUrl')}
                />
                <input
                  ref={modalPrewedVideoRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/*"
                  className="hidden"
                  onChange={(e) => handleUploadTemplateVideo(e, 'preweddingVideoUrl')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">
                        Video Background Default (.mp4)
                      </label>
                      <button
                        type="button"
                        onClick={() => modalBgVideoRef.current?.click()}
                        disabled={isUploadingTemplateVideo}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{isUploadingTemplateVideo ? 'Uploading...' : 'Upload'}</span>
                      </button>
                    </div>
                    <Input
                      placeholder="https://.../bg-video.mp4"
                      value={defaultContent.backgroundVideoUrl || ''}
                      onChange={(e) =>
                        setDefaultContent((prev) => ({
                          ...prev,
                          backgroundVideoUrl: e.target.value,
                        }))
                      }
                    />
                    {defaultContent.backgroundVideoUrl && defaultContent.backgroundVideoUrl !== 'none' && (
                      <video
                        src={defaultContent.backgroundVideoUrl}
                        controls
                        muted
                        className="w-full h-24 rounded-lg bg-black object-cover"
                      />
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">
                        Video Prewedding Default
                      </label>
                      <button
                        type="button"
                        onClick={() => modalPrewedVideoRef.current?.click()}
                        disabled={isUploadingTemplatePrewedVideo}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{isUploadingTemplatePrewedVideo ? 'Uploading...' : 'Upload'}</span>
                      </button>
                    </div>
                    <Input
                      placeholder="URL .mp4 atau YouTube Shorts"
                      value={defaultContent.preweddingVideoUrl || ''}
                      onChange={(e) =>
                        setDefaultContent((prev) => ({
                          ...prev,
                          preweddingVideoUrl: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Foto Cover Default"
                    placeholder="https://.../cover.webp"
                    value={defaultContent.fotoCover || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, fotoCover: e.target.value }))
                    }
                  />
                  <Input
                    label="URL Musik Default (.mp3)"
                    placeholder="https://.../music.mp3"
                    value={defaultContent.musicUrl || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, musicUrl: e.target.value }))
                    }
                  />
                  <Input
                    label="Subjudul Cover Default"
                    placeholder="The Wedding of"
                    value={defaultContent.judulPembuka || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, judulPembuka: e.target.value }))
                    }
                  />
                  <Input
                    label="Judul Galeri / Momen Default"
                    placeholder="OUR MOMENTS"
                    value={defaultContent.judulGaleri || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, judulGaleri: e.target.value }))
                    }
                  />
                  <Input
                    label="Judul Kisah Cinta Default"
                    placeholder="OUR STORIES"
                    value={defaultContent.judulKisah || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, judulKisah: e.target.value }))
                    }
                  />
                  <Input
                    label="Judul Wedding Gift Default"
                    placeholder="Wedding Gift"
                    value={defaultContent.judulKado || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, judulKado: e.target.value }))
                    }
                  />
                </div>

                <Input
                  label="Kutipan Pembuka / Ayat Default"
                  placeholder="Setiap pertemuan memiliki maknanya..."
                  value={defaultContent.kutipanPembuka || ''}
                  onChange={(e) =>
                    setDefaultContent((prev) => ({ ...prev, kutipanPembuka: e.target.value }))
                  }
                />
                <Input
                  label="Teks Sambutan Pembuka Default"
                  placeholder="Dengan penuh rasa syukur dan bahagia..."
                  value={defaultContent.salamPembuka || ''}
                  onChange={(e) =>
                    setDefaultContent((prev) => ({ ...prev, salamPembuka: e.target.value }))
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <Input
                    label="Deskripsi Dress Code Default"
                    placeholder="Kami dengan hormat menganjurkan para tamu..."
                    value={defaultContent.dresscodeText || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, dresscodeText: e.target.value }))
                    }
                  />
                  <Input
                    label="Teks Pengantar Kado Fisik Default"
                    placeholder="Apabila Bapak/Ibu/Saudara/i berkenan mengirimkan..."
                    value={defaultContent.giftConfirmText || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, giftConfirmText: e.target.value }))
                    }
                  />
                  <Input
                    label="Nama Kontak WA Kado 1 Default"
                    placeholder="Contoh: Chusni Nurlaili"
                    value={defaultContent.giftWa1Name || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, giftWa1Name: e.target.value }))
                    }
                  />
                  <Input
                    label="Nomor WA Kado 1 Default"
                    placeholder="Contoh: 0857-1234-5678"
                    value={defaultContent.giftWa1Phone || ''}
                    onChange={(e) =>
                      setDefaultContent((prev) => ({ ...prev, giftWa1Phone: e.target.value }))
                    }
                  />
                </div>
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
