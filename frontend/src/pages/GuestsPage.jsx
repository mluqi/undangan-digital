import React, { useState, useEffect, useRef } from 'react';
import {
  DataTable,
  Button,
  Badge,
  Card,
  Select,
  Input,
  Spinner,
} from '../components/ui';
import { guestService } from '../services/guestService';
import { invitationService } from '../services/invitationService';
import { useToast } from '../components/ui/Toast';
import * as XLSX from 'xlsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users,
  Upload,
  Download,
  QrCode,
  CheckCircle2,
  Clock,
  Plus,
  Edit3,
  Trash2,
  X,
  Share2,
  Copy,
  ScanLine,
  Crown,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { InvitationTemplateModal } from '../components/invitation/InvitationTemplateModal';

export const GuestsPage = ({ defaultInvitationId }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [invitations, setInvitations] = useState([]);
  const [selectedInvId, setSelectedInvId] = useState(defaultInvitationId || '');
  const [currentInvitation, setCurrentInvitation] = useState(null);

  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState({ total: 0, vip: 0, reguler: 0, checkedIn: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Reguler',
    pax: 1,
    phone_number: '',
    qr_code: '',
    qr_link: '',
  });

  // QR Modal
  const [selectedGuestQr, setSelectedGuestQr] = useState(null);

  // Template Preview Modal for a Guest
  const [previewGuest, setPreviewGuest] = useState(null);

  // Excel Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedPreview, setImportedPreview] = useState([]);
  const [importFileName, setImportFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Check-In Scanner Simulation Modal
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

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
          slug: inv.slug,
          raw: inv,
        }))
      );

      if (list.length > 0 && !selectedInvId) {
        setSelectedInvId(list[0].id.toString());
        setCurrentInvitation(list[0]);
      } else if (selectedInvId) {
        const found = list.find((i) => i.id.toString() === selectedInvId.toString());
        if (found) setCurrentInvitation(found);
      }
    } catch (err) {
      console.error('Error load invitations for guests:', err);
      toast.error('Gagal memuat daftar undangan.');
    }
  };

  useEffect(() => {
    if (selectedInvId) {
      const found = invitations.find((i) => i.value === selectedInvId);
      if (found) setCurrentInvitation(found.raw);
      loadGuests(selectedInvId);
    }
  }, [selectedInvId, filterCategory, filterCheckIn]);

  const loadGuests = async (invId) => {
    setIsLoading(true);
    try {
      const res = await guestService.getByInvitation(invId, {
        category: filterCategory,
        isCheckedIn: filterCheckIn,
      });

      setGuests(res?.data?.guests || []);
      setStats(res?.data?.stats || { total: 0, vip: 0, reguler: 0, checkedIn: 0, pending: 0 });
    } catch (err) {
      console.error('Error load guests:', err);
      toast.error('Gagal memuat daftar tamu.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- EXCEL IMPORT / EXPORT LOGIC ---
  const handleDownloadTemplate = () => {
    const wsData = [
      ['No', 'Nama Tamu', 'Kategori', 'Link QR Code Check-In'],
      [
        1,
        'Bpk. Bambang & Keluarga',
        'Reguler',
        'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin?guestId=51486111-99f6-4606-ba81-ef3afadc618b',
      ],
      [
        2,
        'Ibu Siti Rahmawati',
        'Reguler',
        'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin?guestId=23703a37-22b6-4723-93bf-6841dbf613e1',
      ],
      [
        3,
        'Rekan Kerja Kantor',
        'Reguler',
        'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin?guestId=704566b8-c201-4f99-a6e8-ccb860e16a0e',
      ],
      [
        4,
        'Sahabat Mempelai',
        'Reguler',
        'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin?guestId=86500624-ca08-418f-a33f-9399d851753b',
      ],
      [
        5,
        'Tamu Kehormatan VIP',
        'VIP',
        'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin?guestId=99001122-11aa-22bb-33cc-44dd55ee66ff',
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Tamu');
    XLSX.writeFile(wb, `Template_Import_Tamu_${currentInvitation?.slug || 'undangan'}.xlsx`);
    toast.success('Template Excel berhasil diunduh!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          toast.error('File Excel tidak berisi data tamu.');
          return;
        }

        // Map column variations to clean schema
        const mapped = data.map((row, idx) => {
          // Cari nama
          const name =
            row['Nama Tamu'] ||
            row['nama tamu'] ||
            row['nama'] ||
            row['Nama'] ||
            row['name'] ||
            row['NAMA'] ||
            `Tamu ${idx + 1}`;

          // Cari kategori
          const rawCat = (
            row['Kategori'] ||
            row['kategori'] ||
            row['kategori(vip/reguler)'] ||
            row['Kategori (VIP/Reguler)'] ||
            row['category'] ||
            ''
          ).toUpperCase();
          const category = rawCat.includes('VIP') ? 'VIP' : 'Reguler';

          // Cari link qr code check-in eksternal (misal: Tamuva)
          const link = (
            row['Link QR Code Check-In'] ||
            row['link qr code check-in'] ||
            row['Link QR Code'] ||
            row['link qr code'] ||
            row['Link QR'] ||
            row['link qr'] ||
            row['qr_link'] ||
            row['Link'] ||
            row['link'] ||
            row['url'] ||
            row['URL'] ||
            ''
          ).trim();

          // Ekstraksi guestId dari URL jika ada
          let guestId = '';
          if (link) {
            const m = link.match(/guestId=([a-zA-Z0-9\-]+)/i);
            if (m) guestId = m[1];
          }

          const qrCode =
            guestId ||
            row['qr_code'] ||
            `CHK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

          return {
            name: String(name).trim(),
            category,
            qr_code: qrCode,
            qr_link: link || `http://localhost:8001/api/invitations/slug/${currentInvitation?.slug}?to=${encodeURIComponent(name)}&code=${qrCode}`,
          };
        });

        setImportedPreview(mapped);
        setIsImportModalOpen(true);
        toast.info(`Berhasil membaca ${mapped.length} baris data dari Excel.`);
      } catch (err) {
        console.error('Error parsing excel:', err);
        toast.error('Gagal membaca file Excel. Pastikan format file sesuai.');
      }
    };

    reader.readAsBinaryString(file);
    e.target.value = null; // Reset input
  };

  const handleConfirmImport = async () => {
    if (!importedPreview.length) return;

    setIsImporting(true);
    try {
      const res = await guestService.importGuests(selectedInvId, importedPreview);
      toast.success(res.message || `Berhasil mengimpor ${res.count} tamu.`);
      setIsImportModalOpen(false);
      setImportedPreview([]);
      loadGuests(selectedInvId);
    } catch (err) {
      console.error('Error importing guests:', err);
      toast.error(err.message || 'Gagal menyimpan data tamu ke database.');
    } finally {
      setIsImporting(false);
    }
  };

  // --- SINGLE GUEST CRUD ---
  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: '',
      category: 'Reguler',
      pax: 1,
      phone_number: '',
      qr_code: '',
      qr_link: '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (g) => {
    setIsEditing(true);
    setEditId(g.id);
    setFormData({
      name: g.name,
      category: g.category,
      pax: g.pax,
      phone_number: g.phone_number || '',
      qr_code: g.qr_code,
      qr_link: g.qr_link || '',
    });
    setIsFormModalOpen(true);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Nama tamu wajib diisi.');
      return;
    }

    try {
      if (isEditing) {
        await guestService.update(editId, formData);
        toast.success('Data tamu berhasil diperbarui!');
      } else {
        await guestService.create(selectedInvId, formData);
        toast.success('Tamu baru berhasil ditambahkan!');
      }

      setIsFormModalOpen(false);
      loadGuests(selectedInvId);
    } catch (err) {
      console.error('Error save guest:', err);
      toast.error(err.message || 'Gagal menyimpan data tamu.');
    }
  };

  const handleDeleteGuest = async (id, name) => {
    if (!window.confirm(`Hapus tamu "${name}" dari daftar?`)) return;

    try {
      await guestService.delete(id);
      toast.success(`Tamu "${name}" berhasil dihapus.`);
      loadGuests(selectedInvId);
    } catch (err) {
      console.error('Error deleting guest:', err);
      toast.error(err.message || 'Gagal menghapus tamu.');
    }
  };

  // --- CHECK-IN SCANNER SIMULATION ---
  const handlePerformCheckIn = async (codeToScan) => {
    const code = codeToScan || scanCodeInput.trim();
    if (!code) {
      toast.error('Masukkan kode QR check-in.');
      return;
    }

    setIsScanning(true);
    setScanResult(null);
    try {
      const res = await guestService.checkIn(code);
      setScanResult(res);
      if (res.alreadyCheckedIn) {
        toast.warning(res.message);
      } else {
        toast.success(res.message);
      }
      loadGuests(selectedInvId);
    } catch (err) {
      console.error('Scan error:', err);
      setScanResult({ error: true, message: err.message });
      toast.error(err.message || 'Check-in gagal.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyShareText = (guest) => {
    const text = `Kepada Yth. ${guest.name},\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara kami:\n${guest.qr_link}\n\n*Simpan QR Code check-in Anda: ${guest.qr_code}*`;
    navigator.clipboard.writeText(text);
    toast.success('Teks undangan personal disalin untuk dibagikan via WhatsApp!');
  };

  const columns = [
    {
      key: 'name',
      header: 'Nama Tamu',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{val}</span>
            {row.category === 'VIP' && (
              <Badge variant="primary" size="sm" dot>
                VIP
              </Badge>
            )}
          </div>
          {row.phone_number && (
            <span className="text-xs text-slate-400 block mt-0.5">
              WA: {row.phone_number} | {row.pax} Pax
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'qr_link',
      header: 'Link QR Code Check-In (Eksternal)',
      render: (link, row) => (
        <div className="flex items-center gap-1.5 max-w-xs">
          <span className="text-xs font-mono text-slate-500 truncate max-w-[200px]" title={link}>
            {link || '-'}
          </span>
          {link && (
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast.success('Link QR Code Check-In disalin!');
                }}
                title="Salin Link"
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka Link Check-In Eksternal"
                className="p-1 text-indigo-600 hover:text-indigo-800 rounded"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'qr_code',
      header: 'QR Code',
      render: (code, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs py-1 px-2.5 gap-1.5"
            onClick={() => setSelectedGuestQr(row)}
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>Lihat QR</span>
          </Button>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[120px]">
            {code}
          </span>
        </div>
      ),
    },
    {
      key: 'is_checked_in',
      header: 'Status Hadir (Check-In)',
      sortable: true,
      render: (checkedIn, row) => (
        <div className="space-y-0.5">
          <Badge variant={checkedIn ? 'success' : 'default'} dot>
            {checkedIn ? 'Sudah Check-In' : 'Belum Hadir'}
          </Badge>
          {checkedIn && row.check_in_time && (
            <span className="block text-[11px] text-slate-400">
              {new Date(row.check_in_time).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })} WIB
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            title="Lihat Tampilan Template Undangan Tamu Ini"
            onClick={() => setPreviewGuest(row)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Bagikan Teks Undangan"
            onClick={() => handleCopyShareText(row)}
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Simulasi Scan Check-In Tamu Ini"
            onClick={() => {
              setScanCodeInput(row.qr_link || row.qr_code);
              setIsScannerOpen(true);
              handlePerformCheckIn(row.qr_link || row.qr_code);
            }}
          >
            <ScanLine className="w-3.5 h-3.5 text-indigo-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Edit Tamu"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Hapus Tamu"
            onClick={() => handleDeleteGuest(row.id, row.name)}
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Database Tamu & QR Code Check-In
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola daftar tamu undangan, import data dari Excel, dan sediakan QR code untuk verifikasi resepsionis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download Template Excel */}
          <Button
            variant="outline"
            leftIcon={Download}
            onClick={handleDownloadTemplate}
          >
            Download Format Excel
          </Button>

          {/* Hidden File Input for Excel Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          {/* Import Button */}
          <Button
            variant="secondary"
            leftIcon={Upload}
            onClick={() => fileInputRef.current?.click()}
          >
            Import dari Excel
          </Button>

          {/* Scanner Simulation Button */}
          <Button
            variant="primary"
            leftIcon={ScanLine}
            onClick={() => {
              setScanResult(null);
              setScanCodeInput('');
              setIsScannerOpen(true);
            }}
          >
            Scan Check-In
          </Button>

          {/* Add Guest Button */}
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={handleOpenCreate}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Tambah Tamu
          </Button>
        </div>
      </div>

      {/* Select Invitation & Filter Bar */}
      <Card className="p-4 sm:p-5 border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <Select
              label="Pilih Undangan Client"
              options={invitations}
              value={selectedInvId}
              onChange={setSelectedInvId}
              placeholder="Pilih undangan..."
            />
          </div>

          <div>
            <Select
              label="Filter Kategori"
              options={[
                { value: '', label: 'Semua Kategori (VIP & Reguler)' },
                { value: 'VIP', label: 'Hanya Tamu VIP' },
                { value: 'Reguler', label: 'Hanya Tamu Reguler' },
              ]}
              value={filterCategory}
              onChange={setFilterCategory}
            />
          </div>

          <div>
            <Select
              label="Filter Status Hadir"
              options={[
                { value: '', label: 'Semua Status Check-In' },
                { value: 'true', label: 'Sudah Check-In' },
                { value: 'false', label: 'Belum Check-In' },
              ]}
              value={filterCheckIn}
              onChange={setFilterCheckIn}
            />
          </div>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="p-4 border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Tamu</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </Card>

        <Card className="p-4 border-indigo-100 bg-indigo-50/20">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-indigo-700 uppercase">Tamu VIP</p>
            <Crown className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.vip}</p>
        </Card>

        <Card className="p-4 border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Tamu Reguler</p>
          <p className="text-2xl font-bold text-slate-700 mt-1">{stats.reguler}</p>
        </Card>

        <Card className="p-4 border-emerald-100 bg-emerald-50/25">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase">Sudah Check-In</p>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.checkedIn}</p>
        </Card>

        <Card className="p-4 border-amber-100 bg-amber-50/20">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-amber-700 uppercase">Belum Hadir</p>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 mt-1">{stats.pending}</p>
        </Card>
      </div>

      {/* Guest DataTable */}
      <DataTable
        columns={columns}
        data={guests}
        isLoading={isLoading}
        searchPlaceholder="Cari nama tamu undangan..."
        emptyMessage="Belum ada data tamu pada undangan ini. Anda dapat mengimpor dari file Excel atau menambah manual."
      />

      {/* MODAL 1: EXCEL IMPORT PREVIEW */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Konfirmasi Import Tamu dari Excel
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>File: <strong>{importFileName}</strong></span>
                <span className="font-semibold text-indigo-700">{importedPreview.length} Tamu Ditemukan</span>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                    <tr>
                      <th className="p-2.5">No</th>
                      <th className="p-2.5">Nama Tamu</th>
                      <th className="p-2.5">Kategori</th>
                      <th className="p-2.5">Link / Kode QR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importedPreview.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-400">{i + 1}</td>
                        <td className="p-2.5 font-medium text-slate-900">{item.name}</td>
                        <td className="p-2.5">
                          <Badge variant={item.category === 'VIP' ? 'primary' : 'default'} size="sm">
                            {item.category}
                          </Badge>
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-500 truncate max-w-xs">
                          {item.qr_code}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsImportModalOpen(false)}
                  disabled={isImporting}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  isLoading={isImporting}
                  onClick={handleConfirmImport}
                >
                  Simpan {importedPreview.length} Tamu ke Database
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW QR CODE */}
      {selectedGuestQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm sm:max-w-md w-full p-6 text-center space-y-4 animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                QR Code Check-In Tamu
              </span>
              <button
                type="button"
                onClick={() => setSelectedGuestQr(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{selectedGuestQr.name}</h3>
              <div className="mt-1 flex items-center justify-center gap-2">
                <Badge variant={selectedGuestQr.category === 'VIP' ? 'primary' : 'default'} dot>
                  {selectedGuestQr.category}
                </Badge>
                <Badge variant={selectedGuestQr.is_checked_in ? 'success' : 'warning'}>
                  {selectedGuestQr.is_checked_in ? 'Sudah Hadir' : 'Belum Check-In'}
                </Badge>
              </div>
            </div>

            {/* QR SVG Render using exact external QR link */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-md">
              <QRCodeSVG
                value={selectedGuestQr.qr_link || selectedGuestQr.qr_code}
                size={190}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase">
                <span>Link Check-In (Eksternal / Tamuva):</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedGuestQr.qr_link || selectedGuestQr.qr_code);
                    toast.success('Link QR Code disalin!');
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-normal inline-flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin</span>
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-700 break-all bg-white p-2 rounded border border-slate-200">
                {selectedGuestQr.qr_link || selectedGuestQr.qr_code}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                *Nilai di atas adalah data yang tertanam di dalam QR Code saat discan oleh panitia resepsionis.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white border-0 shadow-sm"
                onClick={() => {
                  setPreviewGuest(selectedGuestQr);
                  setSelectedGuestQr(null);
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lihat di Template Undangan Tamu</span>
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => handleCopyShareText(selectedGuestQr)}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin WA Tamu</span>
                </Button>

                {selectedGuestQr.qr_link && (
                  <a
                    href={selectedGuestQr.qr_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Tes Link</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SCANNER SIMULATION */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Simulasi Scan Resepsionis Check-In
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScannerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Di meja penerima tamu / resepsionis, scanner barcode akan membaca QR Code tamu dan otomatis menandai status kehadiran.
              </p>

              <div className="space-y-2">
                <Input
                  label="Kode QR / Link Check-In"
                  placeholder="Paste link Tamuva atau kode tamu..."
                  value={scanCodeInput}
                  onChange={(e) => setScanCodeInput(e.target.value)}
                  leftIcon={QrCode}
                  autoFocus
                />
                <Button
                  variant="primary"
                  className="w-full"
                  isLoading={isScanning}
                  onClick={() => handlePerformCheckIn()}
                >
                  Proses Check-In Tamu
                </Button>
              </div>

              {/* Scan Feedback Result Card */}
              {scanResult && (
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    scanResult.error
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : scanResult.alreadyCheckedIn
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {scanResult.error ? (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    ) : scanResult.alreadyCheckedIn ? (
                      <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}

                    <div className="text-xs sm:text-sm">
                      <p className="font-bold">{scanResult.message}</p>
                      {scanResult.data && (
                        <div className="mt-1 text-xs opacity-90 space-y-0.5">
                          <p>Tamu: <strong>{scanResult.data.name}</strong></p>
                          <p>Kategori: <strong>{scanResult.data.category}</strong> ({scanResult.data.pax} Pax)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT GUEST */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Data Tamu' : 'Tambah Tamu Undangan'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <Input
                label="Nama Tamu"
                required
                placeholder="Masukkan nama tamu lengkap..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Select
                label="Kategori Tamu"
                options={[
                  { value: 'Reguler', label: 'Tamu Reguler' },
                  { value: 'VIP', label: 'Tamu VIP (Prioritas)' },
                ]}
                value={formData.category}
                onChange={(cat) => setFormData({ ...formData, category: cat })}
              />

              <Input
                label="Link QR Code Check-In (Eksternal / Tamuva)"
                placeholder="https://app.tamuva.com/events/.../checkin?guestId=..."
                value={formData.qr_link}
                onChange={(e) => setFormData({ ...formData, qr_link: e.target.value })}
                helperText="Link check-in eksternal yang akan disematkan ke dalam QR Code dan discan di meja resepsionis"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Jumlah Kursi (Pax)"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.pax}
                  onChange={(e) => setFormData({ ...formData, pax: e.target.value })}
                />
                <Input
                  label="No. WhatsApp / HP"
                  placeholder="08123456789"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>

              <Input
                label="Kode QR / ID Tamu (Opsional)"
                placeholder="Kosongkan untuk generate otomatis dari link"
                value={formData.qr_code}
                onChange={(e) => setFormData({ ...formData, qr_code: e.target.value })}
                helperText="ID unik tamu untuk identifikasi check-in"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Tamu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: TEMPLATE INVITATION & QR LIVE PREVIEW */}
      <InvitationTemplateModal
        isOpen={Boolean(previewGuest)}
        onClose={() => setPreviewGuest(null)}
        invitation={currentInvitation}
        guest={previewGuest}
      />
    </div>
  );
};
