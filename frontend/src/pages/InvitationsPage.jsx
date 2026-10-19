import React, { useState, useEffect, useRef } from 'react';
import {
  DataTable,
  Button,
  Badge,
  Card,
  Input,
  Textarea,
  Select,
  Switch,
} from '../components/ui';
import { invitationService } from '../services/invitationService';
import { templateService } from '../services/templateService';
import { useToast } from '../components/ui/Toast';
import {
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Calendar,
  X,
  Mail,
  Check,
  Users,
  Eye,
  Sparkles,
  Settings,
  QrCode,
  Heart,
  Clock,
  MapPin,
  CreditCard,
  Code,
  FileText,
  ChevronRight,
  ChevronLeft,
  Gift,
  FileSpreadsheet,
  Upload,
  Download,
} from 'lucide-react';
import {
  exportInvitationExcelTemplate,
  parseInvitationExcel,
} from '../utils/invitationExcel';
import { InvitationTemplateModal } from '../components/invitation/InvitationTemplateModal';
import { InvitationDetailPage } from './InvitationDetailPage';

export const InvitationsPage = ({ onManageGuests, initialSelectedId }) => {
  const toast = useToast();
  const [invitations, setInvitations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetailId, setSelectedDetailId] = useState(initialSelectedId || null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreviewInv, setSelectedPreviewInv] = useState(null);

  // Modal Tabs: 'basic' | 'couple' | 'events' | 'gifts' | 'raw'
  const [activeModalTab, setActiveModalTab] = useState('basic');

  // Core Form states
  const [clientName, setClientName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [slug, setSlug] = useState('');
  const [expiredAt, setExpiredAt] = useState('');

  // Structured Content Form states
  const [showQrCheckin, setShowQrCheckin] = useState(true);

  // Mempelai Pria & Orang Tua
  const [groomName, setGroomName] = useState('');
  const [groomFather, setGroomFather] = useState('');
  const [groomMother, setGroomMother] = useState('');

  // Mempelai Wanita & Orang Tua
  const [brideName, setBrideName] = useState('');
  const [brideFather, setBrideFather] = useState('');
  const [brideMother, setBrideMother] = useState('');

  // Kutipan & Ayat
  const [ayatQuote, setAyatQuote] = useState('QS. Ar-Rum: 21');

  // Akad Nikah
  const [akadTanggal, setAkadTanggal] = useState('');
  const [akadWaktu, setAkadWaktu] = useState('');
  const [akadLokasi, setAkadLokasi] = useState('');
  const [akadAlamat, setAkadAlamat] = useState('');
  const [akadMapUrl, setAkadMapUrl] = useState('');

  // Resepsi
  const [resepsiTanggal, setResepsiTanggal] = useState('');
  const [resepsiWaktu, setResepsiWaktu] = useState('');
  const [resepsiLokasi, setResepsiLokasi] = useState('');
  const [resepsiAlamat, setResepsiAlamat] = useState('');
  const [resepsiMapUrl, setResepsiMapUrl] = useState('');

  // Amplop & Kado
  const [bankAccounts, setBankAccounts] = useState([
    { bank: 'BCA', nomor: '', nama: '' },
  ]);
  const [giftAddress, setGiftAddress] = useState('');

  // Raw JSON String (untuk mode lanjutan)
  const [rawJsonString, setRawJsonString] = useState('');
  const [existingExtraContent, setExistingExtraContent] = useState({});

  // Refs
  const excelFileInputRef = useRef(null);
  const quickExcelFileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [invRes, tmplRes] = await Promise.all([
        invitationService.getAll({ limit: 50 }),
        templateService.getAll(),
      ]);

      setInvitations(invRes?.data?.invitations || []);
      setTemplates(
        (tmplRes?.data || []).map((t) => ({
          value: t.id.toString(),
          label: `${t.name} (${t.template_code})`,
          template_code: t.template_code,
          name: t.name,
        }))
      );
    } catch (err) {
      console.error('Error load invitations:', err);
      toast.error('Gagal memuat data undangan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compile current form fields into a unified object
  const buildContentObject = () => {
    return {
      ...existingExtraContent,
      showQrCheckin: Boolean(showQrCheckin),
      showQr: Boolean(showQrCheckin),
      mempelaiPria: groomName,
      ayahPria: groomFather,
      ibuPria: groomMother,
      mempelaiWanita: brideName,
      ayahWanita: brideFather,
      ibuWanita: brideMother,
      ayat: ayatQuote,
      akad: {
        ...(existingExtraContent.akad || {}),
        tanggal: akadTanggal,
        waktu: akadWaktu,
        lokasi: akadLokasi,
        alamat: akadAlamat,
        mapUrl: akadMapUrl,
      },
      resepsi: {
        ...(existingExtraContent.resepsi || {}),
        tanggal: resepsiTanggal,
        waktu: resepsiWaktu,
        lokasi: resepsiLokasi,
        alamat: resepsiAlamat,
        mapUrl: resepsiMapUrl,
      },
      rekening: bankAccounts.filter((b) => b.bank?.trim() || b.nomor?.trim() || b.nama?.trim()),
      alamatKado: giftAddress,
    };
  };

  // Sync JSON string into individual form states when user switches from RAW to visual tabs
  const syncRawJsonToForm = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.showQr !== undefined || parsed.showQrCheckin !== undefined) {
          setShowQrCheckin(
            parsed.showQr !== undefined ? Boolean(parsed.showQr) : Boolean(parsed.showQrCheckin)
          );
        }
        if (parsed.mempelaiPria !== undefined) setGroomName(parsed.mempelaiPria);
        if (parsed.ayahPria !== undefined) setGroomFather(parsed.ayahPria);
        if (parsed.ibuPria !== undefined) setGroomMother(parsed.ibuPria);
        if (parsed.mempelaiWanita !== undefined) setBrideName(parsed.mempelaiWanita);
        if (parsed.ayahWanita !== undefined) setBrideFather(parsed.ayahWanita);
        if (parsed.ibuWanita !== undefined) setBrideMother(parsed.ibuWanita);
        if (parsed.ayat !== undefined) setAyatQuote(parsed.ayat);

        if (parsed.akad) {
          setAkadTanggal(parsed.akad.tanggal || '');
          setAkadWaktu(parsed.akad.waktu || '');
          setAkadLokasi(parsed.akad.lokasi || '');
          setAkadAlamat(parsed.akad.alamat || '');
          setAkadMapUrl(parsed.akad.mapUrl || '');
        }

        if (parsed.resepsi) {
          setResepsiTanggal(parsed.resepsi.tanggal || '');
          setResepsiWaktu(parsed.resepsi.waktu || '');
          setResepsiLokasi(parsed.resepsi.lokasi || '');
          setResepsiAlamat(parsed.resepsi.alamat || '');
          setResepsiMapUrl(parsed.resepsi.mapUrl || '');
        }

        if (Array.isArray(parsed.rekening) && parsed.rekening.length > 0) {
          setBankAccounts(parsed.rekening);
        }

        if (parsed.alamatKado !== undefined) {
          setGiftAddress(parsed.alamatKado);
        }

        setExistingExtraContent(parsed);
      }
    } catch {
      // Biarkan jika masih proses mengetik JSON
    }
  };

  const handleTabChange = (newTab) => {
    if (activeModalTab === 'raw' && newTab !== 'raw') {
      // Sync from raw JSON to structured form
      syncRawJsonToForm(rawJsonString);
    } else if (newTab === 'raw' && activeModalTab !== 'raw') {
      // Sync from structured form to raw JSON
      const compiled = buildContentObject();
      setRawJsonString(JSON.stringify(compiled, null, 2));
    }
    setActiveModalTab(newTab);
  };

  // ==============================================================
  // EXCEL IMPORT & EXPORT HANDLERS
  // ==============================================================
  const applyParsedExcelData = (parsed, fileName = '') => {
    if (parsed.clientName) setClientName(parsed.clientName);
    if (parsed.slug) setSlug(parsed.slug);
    if (parsed.expiredAt !== undefined && parsed.expiredAt !== '') setExpiredAt(parsed.expiredAt);
    if (parsed.showQrCheckin !== undefined) setShowQrCheckin(Boolean(parsed.showQrCheckin));

    // Cocokkan template
    if (parsed.templateCode && templates.length > 0) {
      const target = parsed.templateCode.toLowerCase().trim();
      const matched = templates.find(
        (t) =>
          t.template_code?.toLowerCase() === target ||
          t.label?.toLowerCase().includes(target) ||
          t.name?.toLowerCase().includes(target)
      );
      if (matched) {
        setTemplateId(matched.value);
      }
    }

    // Mempelai
    if (parsed.mempelaiPria) setGroomName(parsed.mempelaiPria);
    if (parsed.ayahPria) setGroomFather(parsed.ayahPria);
    if (parsed.ibuPria) setGroomMother(parsed.ibuPria);
    if (parsed.mempelaiWanita) setBrideName(parsed.mempelaiWanita);
    if (parsed.ayahWanita) setBrideFather(parsed.ayahWanita);
    if (parsed.ibuWanita) setBrideMother(parsed.ibuWanita);
    if (parsed.ayat) setAyatQuote(parsed.ayat);

    // Akad
    if (parsed.akadTanggal) setAkadTanggal(parsed.akadTanggal);
    if (parsed.akadWaktu) setAkadWaktu(parsed.akadWaktu);
    if (parsed.akadLokasi) setAkadLokasi(parsed.akadLokasi);
    if (parsed.akadAlamat) setAkadAlamat(parsed.akadAlamat);
    if (parsed.akadMapUrl) setAkadMapUrl(parsed.akadMapUrl);

    // Resepsi
    if (parsed.resepsiTanggal) setResepsiTanggal(parsed.resepsiTanggal);
    if (parsed.resepsiWaktu) setResepsiWaktu(parsed.resepsiWaktu);
    if (parsed.resepsiLokasi) setResepsiLokasi(parsed.resepsiLokasi);
    if (parsed.resepsiAlamat) setResepsiAlamat(parsed.resepsiAlamat);
    if (parsed.resepsiMapUrl) setResepsiMapUrl(parsed.resepsiMapUrl);

    // Rekening
    const importedBanks = [];
    if (parsed.bank1Nama || parsed.bank1Nomor || parsed.bank1Pemilik) {
      importedBanks.push({
        bank: parsed.bank1Nama || 'BCA',
        nomor: parsed.bank1Nomor || '',
        nama: parsed.bank1Pemilik || '',
      });
    }
    if (parsed.bank2Nama || parsed.bank2Nomor || parsed.bank2Pemilik) {
      importedBanks.push({
        bank: parsed.bank2Nama || 'BSI',
        nomor: parsed.bank2Nomor || '',
        nama: parsed.bank2Pemilik || '',
      });
    }
    if (importedBanks.length > 0) {
      setBankAccounts(importedBanks);
    }

    // Alamat Kado
    if (parsed.alamatKado) setGiftAddress(parsed.alamatKado);

    toast.success(`Berhasil mengimpor formulir dari Excel${fileName ? ` (${fileName})` : ''}!`);
  };

  const handleExportExcel = () => {
    try {
      const selectedTmpl = templates.find((t) => t.value === templateId);
      const dataToExport = {
        client_name: clientName,
        slug: slug,
        template_code: selectedTmpl?.template_code || 'forest-tropical',
        show_qr_checkin: showQrCheckin ? 'YA' : 'TIDAK',
        expired_at: expiredAt,
        mempelai_pria: groomName,
        ayah_pria: groomFather,
        ibu_pria: groomMother,
        mempelai_wanita: brideName,
        ayah_wanita: brideFather,
        ibu_wanita: brideMother,
        ayat: ayatQuote,
        akad_tanggal: akadTanggal,
        akad_waktu: akadWaktu,
        akad_lokasi: akadLokasi,
        akad_alamat: akadAlamat,
        akad_map_url: akadMapUrl,
        resepsi_tanggal: resepsiTanggal,
        resepsi_waktu: resepsiWaktu,
        resepsi_lokasi: resepsiLokasi,
        resepsi_alamat: resepsiAlamat,
        resepsi_map_url: resepsiMapUrl,
        bank_1_nama: bankAccounts[0]?.bank || '',
        bank_1_nomor: bankAccounts[0]?.nomor || '',
        bank_1_pemilik: bankAccounts[0]?.nama || '',
        bank_2_nama: bankAccounts[1]?.bank || '',
        bank_2_nomor: bankAccounts[1]?.nomor || '',
        bank_2_pemilik: bankAccounts[1]?.nama || '',
        alamat_kado: giftAddress,
      };

      const filename = `Form_Undangan_${slug || (clientName ? clientName.replace(/\s+/g, '_') : 'Client')}.xlsx`;
      exportInvitationExcelTemplate(dataToExport, filename);
      toast.success('Template Excel berhasil diunduh! Silakan isi/bagikan ke client.');
    } catch (err) {
      console.error('Error export excel:', err);
      toast.error('Gagal mengekspor template Excel.');
    }
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseInvitationExcel(file);
      applyParsedExcelData(parsed, file.name);
    } catch (err) {
      console.error('Error import excel:', err);
      toast.error(err.message || 'Gagal membaca file Excel.');
    } finally {
      if (excelFileInputRef.current) {
        excelFileInputRef.current.value = '';
      }
    }
  };

  // Handler untuk membuat undangan baru langsung dari file Excel dari luar modal
  const handleQuickCreateFromExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      handleOpenCreateModal();
      const parsed = await parseInvitationExcel(file);
      applyParsedExcelData(parsed, file.name);
    } catch (err) {
      console.error('Error quick create from excel:', err);
      toast.error(err.message || 'Gagal membaca file Excel.');
    } finally {
      if (quickExcelFileInputRef.current) {
        quickExcelFileInputRef.current.value = '';
      }
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setClientName('');
    setTemplateId(templates[0]?.value || '1');
    setSlug('');
    setExpiredAt('');
    setActiveModalTab('basic');

    // Default values for standard new invitation
    setShowQrCheckin(true);
    setGroomName('Ahmad Fajar, S.T.');
    setGroomFather('Bpk. H. Abdurrahman');
    setGroomMother('Ibu Hj. Maryam');
    setBrideName('Siti Aminah, S.Pd.');
    setBrideFather('Bpk. H. Ahmad Dahlan');
    setBrideMother('Ibu Hj. Fatimah');
    setAyatQuote('QS. Ar-Rum: 21');

    setAkadTanggal('Minggu, 15 November 2026');
    setAkadWaktu('08:00 - 10:00 WIB');
    setAkadLokasi('Masjid Agung Al-Akbar Surabaya');
    setAkadAlamat('Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya');
    setAkadMapUrl('https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya');

    setResepsiTanggal('Minggu, 15 November 2026');
    setResepsiWaktu('11:00 - 14:00 WIB');
    setResepsiLokasi('Grand Ballroom Hotel Majapahit, Surabaya');
    setResepsiAlamat('Jl. Tunjungan No.65, Genteng, Surabaya');
    setResepsiMapUrl('https://maps.google.com/?q=Hotel+Majapahit+Surabaya');

    setBankAccounts([
      { bank: 'BCA', nomor: '0182938192', nama: 'Ahmad Fajar' },
      { bank: 'BSI', nomor: '7192830192', nama: 'Siti Aminah' },
    ]);
    setGiftAddress('Perumahan Graha Asri Blok C No. 12, Jambangan, Surabaya (0812-3456-7890)');
    setExistingExtraContent({});

    const initialObj = {
      showQrCheckin: true,
      showQr: true,
      mempelaiPria: 'Ahmad Fajar, S.T.',
      ayahPria: 'Bpk. H. Abdurrahman',
      ibuPria: 'Ibu Hj. Maryam',
      mempelaiWanita: 'Siti Aminah, S.Pd.',
      ayahWanita: 'Bpk. H. Ahmad Dahlan',
      ibuWanita: 'Ibu Hj. Fatimah',
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
        { bank: 'BCA', nomor: '0182938192', nama: 'Ahmad Fajar' },
        { bank: 'BSI', nomor: '7192830192', nama: 'Siti Aminah' },
      ],
      alamatKado: 'Perumahan Graha Asri Blok C No. 12, Jambangan, Surabaya (0812-3456-7890)',
    };
    setRawJsonString(JSON.stringify(initialObj, null, 2));

    setIsModalOpen(true);
  };

  const handleOpenEditModal = (inv) => {
    setIsEditing(true);
    setEditId(inv.id);
    setClientName(inv.client_name || '');
    setTemplateId(inv.template_id?.toString() || '1');
    setSlug(inv.slug || '');
    setExpiredAt(inv.expired_at ? inv.expired_at.split('T')[0] : '');
    setActiveModalTab('basic');

    const c =
      typeof inv.content_json === 'object' && inv.content_json !== null ? inv.content_json : {};

    setExistingExtraContent(c);
    setShowQrCheckin(
      c.showQr !== undefined ? Boolean(c.showQr) : c.showQrCheckin !== undefined ? Boolean(c.showQrCheckin) : true
    );
    setGroomName(c.mempelaiPria || '');
    setGroomFather(c.ayahPria || '');
    setGroomMother(c.ibuPria || '');
    setBrideName(c.mempelaiWanita || '');
    setBrideFather(c.ayahWanita || '');
    setBrideMother(c.ibuWanita || '');
    setAyatQuote(c.ayat || 'QS. Ar-Rum: 21');

    setAkadTanggal(c.akad?.tanggal || '');
    setAkadWaktu(c.akad?.waktu || '');
    setAkadLokasi(c.akad?.lokasi || '');
    setAkadAlamat(c.akad?.alamat || '');
    setAkadMapUrl(c.akad?.mapUrl || '');

    setResepsiTanggal(c.resepsi?.tanggal || '');
    setResepsiWaktu(c.resepsi?.waktu || '');
    setResepsiLokasi(c.resepsi?.lokasi || '');
    setResepsiAlamat(c.resepsi?.alamat || '');
    setResepsiMapUrl(c.resepsi?.mapUrl || '');

    setBankAccounts(
      Array.isArray(c.rekening) && c.rekening.length > 0
        ? c.rekening
        : [{ bank: 'BCA', nomor: '', nama: '' }]
    );
    setGiftAddress(c.alamatKado || '');
    setRawJsonString(JSON.stringify(c, null, 2));

    setIsModalOpen(true);
  };

  const handleAutoSlug = (name) => {
    setClientName(name);
    if (!isEditing) {
      const autoSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  };

  const handleAddBankAccount = () => {
    setBankAccounts([...bankAccounts, { bank: 'BCA', nomor: '', nama: '' }]);
  };

  const handleRemoveBankAccount = (index) => {
    if (bankAccounts.length <= 1) {
      setBankAccounts([{ bank: '', nomor: '', nama: '' }]);
      return;
    }
    setBankAccounts(bankAccounts.filter((_, i) => i !== index));
  };

  const handleBankAccountChange = (index, field, value) => {
    const updated = [...bankAccounts];
    updated[index][field] = value;
    setBankAccounts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !templateId || !slug) {
      toast.error('Nama client, template, dan slug wajib diisi.');
      return;
    }

    let parsedContent = {};
    if (activeModalTab === 'raw') {
      try {
        parsedContent = JSON.parse(rawJsonString);
      } catch {
        toast.error('Format JSON tidak valid. Silakan periksa kembali tanda kurung atau koma.');
        return;
      }
    } else {
      parsedContent = buildContentObject();
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await invitationService.update(editId, {
          client_name: clientName,
          template_id: parseInt(templateId, 10),
          slug,
          expired_at: expiredAt || null,
          content_json: parsedContent,
        });
        toast.success('Undangan berhasil diperbarui!');
      } else {
        await invitationService.create({
          client_name: clientName,
          template_id: parseInt(templateId, 10),
          slug,
          expired_at: expiredAt || null,
          content_json: parsedContent,
        });
        toast.success('Undangan baru berhasil dibuat!');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error saving invitation:', err);
      toast.error(err.message || 'Gagal menyimpan undangan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus undangan "${name}"?`)) return;

    try {
      await invitationService.delete(id);
      toast.success(`Undangan "${name}" berhasil dihapus.`);
      loadData();
    } catch (err) {
      console.error('Error deleting invitation:', err);
      toast.error(err.message || 'Gagal menghapus undangan.');
    }
  };

  const handleCopyLink = (invSlug) => {
    const url = `${window.location.origin}/invitation/${invSlug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link undangan berhasil disalin ke clipboard!');
  };

  const columns = [
    {
      key: 'client_name',
      header: 'Nama Undangan / Client',
      sortable: true,
      render: (val, row) => (
        <div>
          <button
            type="button"
            onClick={() => setSelectedDetailId(row.id)}
            className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors block text-left"
          >
            {val}
          </button>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-indigo-600 font-mono">/{row.slug}</span>
            <button
              type="button"
              onClick={() => handleCopyLink(row.slug)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
              title="Salin Link"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'template',
      header: 'Template',
      sortable: true,
      render: (tmpl) => (
        <Badge variant="primary" dot>
          {tmpl?.name || 'Default'}
        </Badge>
      ),
    },
    {
      key: 'expired_at',
      header: 'Status & Masa Aktif',
      sortable: true,
      render: (val) => {
        if (!val) {
          return (
            <Badge variant="success" size="sm" dot>
              Aktif Selamanya
            </Badge>
          );
        }
        const isExp = new Date() > new Date(val);
        return (
          <div className="space-y-0.5">
            <Badge variant={isExp ? 'danger' : 'success'} size="sm" dot>
              {isExp ? 'Kedaluwarsa' : 'Aktif'}
            </Badge>
            <span className="block text-[11px] text-slate-400">
              {new Date(val).toLocaleDateString('id-ID')}
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            className="text-xs gap-1.5 font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
            onClick={() => setSelectedDetailId(row.id)}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Kelola Undangan</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Lihat Tampilan Template Undangan & QR Tamu"
            onClick={() => setSelectedPreviewInv(row)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Edit Data Undangan"
            onClick={() => handleOpenEditModal(row)}
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Hapus"
            onClick={() => handleDelete(row.id, row.client_name)}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (selectedDetailId) {
    return (
      <InvitationDetailPage
        invitationId={selectedDetailId}
        onBack={() => {
          setSelectedDetailId(null);
          loadData();
        }}
      />
    );
  }

  // Helper untuk tombol tab selanjutnya
  const TAB_ORDER = ['basic', 'couple', 'events', 'gifts', 'raw'];
  const currentTabIndex = TAB_ORDER.indexOf(activeModalTab);
  const handleNextTab = () => {
    if (currentTabIndex < TAB_ORDER.length - 1) {
      handleTabChange(TAB_ORDER[currentTabIndex + 1]);
    }
  };
  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      handleTabChange(TAB_ORDER[currentTabIndex - 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for quick create from Excel */}
      <input
        type="file"
        ref={quickExcelFileInputRef}
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleQuickCreateFromExcel}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Undangan Client
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar seluruh undangan digital yang telah Anda buatkan untuk client.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            leftIcon={FileSpreadsheet}
            className="border-emerald-200 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100"
            onClick={() => exportInvitationExcelTemplate({}, 'Template_Form_Undangan_Client.xlsx')}
            title="Download formulir Excel kosong untuk dikirimkan ke calon pengantin"
          >
            Template Excel
          </Button>

          <Button
            variant="secondary"
            leftIcon={Upload}
            className="border-slate-200 text-slate-700 hover:bg-slate-100"
            onClick={() => quickExcelFileInputRef.current?.click()}
            title="Buka form undangan baru dan isi otomatis dari file Excel client"
          >
            Buat dari Excel
          </Button>

          <Button variant="primary" leftIcon={Plus} onClick={handleOpenCreateModal}>
            Buat Undangan Baru
          </Button>
        </div>
      </div>

      {/* Invitations Table */}
      <DataTable
        columns={columns}
        data={invitations}
        isLoading={isLoading}
        searchPlaceholder="Cari nama client atau slug..."
        emptyMessage="Belum ada undangan yang dibuat. Silakan klik 'Buat Undangan Baru'."
      />

      {/* Create / Edit Modal with Structured Form Builder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {isEditing ? 'Edit Formulir Undangan' : 'Buat Undangan Baru'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lengkapi data mempelai, jadwal acara, dan kustomisasi floater QR
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Excel Quick Bar inside Modal */}
            <div className="px-6 py-2.5 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-emerald-50/30 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-900">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Pengisian Formulir via Excel: Ekspor template untuk diisi client, atau impor kembali file Excel client.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="file"
                  ref={excelFileInputRef}
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleImportExcel}
                />
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 font-semibold hover:bg-emerald-50 hover:border-emerald-400 transition-all shadow-2xs active:scale-95"
                  title="Unduh data formulir ini ke dalam format Excel"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Template Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => excelFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-xs active:scale-95"
                  title="Unggah file Excel yang sudah diisi client untuk otomatis mengisi formulir"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Excel Client</span>
                </button>
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto text-xs font-medium no-scrollbar">
              <button
                type="button"
                onClick={() => handleTabChange('basic')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeModalTab === 'basic'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <QrCode className="w-4 h-4 text-amber-500" />
                <span>Info Utama & Floater QR</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('couple')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeModalTab === 'couple'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Data Mempelai</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('events')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeModalTab === 'events'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Jadwal & Lokasi</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('gifts')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeModalTab === 'gifts'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Gift className="w-4 h-4 text-purple-500" />
                <span>Amplop & Kado</span>
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

              <button
                type="button"
                onClick={() => handleTabChange('raw')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeModalTab === 'raw'
                    ? 'bg-slate-900 text-white shadow-xs font-mono font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 font-mono'
                }`}
                title="Buka format raw JSON jika ingin mengedit langsung"
              >
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>Raw JSON</span>
              </button>
            </div>

            {/* Modal Body / Form Container */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* ============================================================== */}
              {/* TAB 1: INFORMASI UTAMA & FLOATER QR PASS                      */}
              {/* ============================================================== */}
              {activeModalTab === 'basic' && (
                <div className="space-y-5 animate-in fade-in-0 duration-150">
                  {/* FLOATING QR CODE TOGGLE HIGHLIGHT CARD */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50/30 border border-amber-200/90 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-700 border border-amber-500/25 mt-0.5 shrink-0">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              Tampilkan Floater QR Code Check-In
                            </h4>
                            <Badge variant={showQrCheckin ? 'success' : 'neutral'} size="sm" dot>
                              {showQrCheckin ? 'Floater Aktif' : 'Disembunyikan'}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
                            Aktifkan fitur ini untuk menampilkan floater penanda buku QR Code di samping layar undangan publik. Tamu dapat mengkliknya kapan saja untuk menampilkan modal kartu akses QR untuk check-in presensi di lokasi acara.
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 pt-1 sm:pt-0 pl-11 sm:pl-0">
                        <Switch
                          checked={showQrCheckin}
                          onChange={setShowQrCheckin}
                          label={showQrCheckin ? 'Tampilkan Floater' : 'Sembunyikan'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM FIELDS DATA UTAMA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Nama Undangan / Client"
                        required
                        placeholder="Contoh: The Wedding of Fajar & Aminah"
                        value={clientName}
                        onChange={(e) => handleAutoSlug(e.target.value)}
                        helperText="Nama pengenal internal undangan client"
                      />
                    </div>

                    <Input
                      label="Slug URL Kustom"
                      required
                      placeholder="wedding"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      helperText={`Alamat publik: /api/invitations/slug/${slug || 'contoh-slug'}`}
                    />

                    <Select
                      label="Pilihan Master Template"
                      required
                      options={templates}
                      value={templateId}
                      onChange={setTemplateId}
                      placeholder="Pilih template..."
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="Masa Aktif Undangan (Opsional)"
                        type="date"
                        value={expiredAt}
                        onChange={(e) => setExpiredAt(e.target.value)}
                        helperText="Kosongkan jika undangan ingin diaktifkan selamanya"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: DATA PASANGAN MEMPELAI & ORANG TUA                     */}
              {/* ============================================================== */}
              {activeModalTab === 'couple' && (
                <div className="space-y-5 animate-in fade-in-0 duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Mempelai Pria */}
                    <div className="p-4.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/90 space-y-3.5">
                      <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                        <Heart className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                        <span>Mempelai Pria</span>
                      </div>

                      <Input
                        label="Nama Lengkap & Gelar Pria"
                        required
                        placeholder="Ahmad Fajar, S.T."
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <Input
                          label="Nama Ayah Pria"
                          placeholder="Bpk. H. Abdurrahman"
                          value={groomFather}
                          onChange={(e) => setGroomFather(e.target.value)}
                        />
                        <Input
                          label="Nama Ibu Pria"
                          placeholder="Ibu Hj. Maryam"
                          value={groomMother}
                          onChange={(e) => setGroomMother(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Mempelai Wanita */}
                    <div className="p-4.5 rounded-2xl bg-rose-50/50 border border-rose-100/90 space-y-3.5">
                      <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                        <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                        <span>Mempelai Wanita</span>
                      </div>

                      <Input
                        label="Nama Lengkap & Gelar Wanita"
                        required
                        placeholder="Siti Aminah, S.Pd."
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <Input
                          label="Nama Ayah Wanita"
                          placeholder="Bpk. H. Ahmad Dahlan"
                          value={brideFather}
                          onChange={(e) => setBrideFather(e.target.value)}
                        />
                        <Input
                          label="Nama Ibu Wanita"
                          placeholder="Ibu Hj. Fatimah"
                          value={brideMother}
                          onChange={(e) => setBrideMother(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ayat / Kutipan */}
                  <Input
                    label="Kutipan / Ayat Suci Pernikahan"
                    placeholder="QS. Ar-Rum: 21 atau kutipan romantis"
                    value={ayatQuote}
                    onChange={(e) => setAyatQuote(e.target.value)}
                    helperText="Akan ditampilkan pada bagian pembuka / quote dalam template"
                  />
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: JADWAL & LOKASI ACARA (AKAD & RESEPSI)                  */}
              {/* ============================================================== */}
              {activeModalTab === 'events' && (
                <div className="space-y-5 animate-in fade-in-0 duration-150">
                  {/* Akad Nikah */}
                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Akad Nikah / Pemberkatan</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Tanggal Akad"
                        placeholder="Minggu, 15 November 2026"
                        value={akadTanggal}
                        onChange={(e) => setAkadTanggal(e.target.value)}
                      />
                      <Input
                        label="Waktu Akad"
                        placeholder="08:00 - 10:00 WIB"
                        value={akadWaktu}
                        onChange={(e) => setAkadWaktu(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Tempat / Lokasi Akad"
                      placeholder="Masjid Agung Al-Akbar Surabaya"
                      value={akadLokasi}
                      onChange={(e) => setAkadLokasi(e.target.value)}
                    />

                    <Textarea
                      label="Alamat Lengkap Akad"
                      rows={2}
                      placeholder="Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya"
                      value={akadAlamat}
                      onChange={(e) => setAkadAlamat(e.target.value)}
                    />

                    <Input
                      label="Link Google Maps Akad"
                      placeholder="https://maps.google.com/?q=..."
                      value={akadMapUrl}
                      onChange={(e) => setAkadMapUrl(e.target.value)}
                    />
                  </div>

                  {/* Resepsi Pernikahan */}
                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>Resepsi Pernikahan</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Tanggal Resepsi"
                        placeholder="Minggu, 15 November 2026"
                        value={resepsiTanggal}
                        onChange={(e) => setResepsiTanggal(e.target.value)}
                      />
                      <Input
                        label="Waktu Resepsi"
                        placeholder="11:00 - 14:00 WIB"
                        value={resepsiWaktu}
                        onChange={(e) => setResepsiWaktu(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Tempat / Lokasi Resepsi"
                      placeholder="Grand Ballroom Hotel Majapahit, Surabaya"
                      value={resepsiLokasi}
                      onChange={(e) => setResepsiLokasi(e.target.value)}
                    />

                    <Textarea
                      label="Alamat Lengkap Resepsi"
                      rows={2}
                      placeholder="Jl. Tunjungan No.65, Genteng, Surabaya"
                      value={resepsiAlamat}
                      onChange={(e) => setResepsiAlamat(e.target.value)}
                    />

                    <Input
                      label="Link Google Maps Resepsi"
                      placeholder="https://maps.google.com/?q=..."
                      value={resepsiMapUrl}
                      onChange={(e) => setResepsiMapUrl(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: AMPLOP DIGITAL & PENGIRIMAN KADO                       */}
              {/* ============================================================== */}
              {activeModalTab === 'gifts' && (
                <div className="space-y-5 animate-in fade-in-0 duration-150">
                  {/* Rekening Bank */}
                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        <span>Rekening Amplop Digital</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        leftIcon={Plus}
                        onClick={handleAddBankAccount}
                        className="text-xs text-indigo-600 hover:text-indigo-700"
                      >
                        Tambah Rekening
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {bankAccounts.map((account, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white rounded-xl border border-slate-200"
                        >
                          <div className="w-full sm:w-1/4">
                            <Input
                              placeholder="Bank (BCA/BSI/dll)"
                              value={account.bank}
                              onChange={(e) =>
                                handleBankAccountChange(index, 'bank', e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full sm:w-2/5">
                            <Input
                              placeholder="Nomor Rekening"
                              value={account.nomor}
                              onChange={(e) =>
                                handleBankAccountChange(index, 'nomor', e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full sm:w-2/5">
                            <Input
                              placeholder="Atas Nama"
                              value={account.nama}
                              onChange={(e) =>
                                handleBankAccountChange(index, 'nama', e.target.value)
                              }
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBankAccount(index)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                            title="Hapus baris rekening"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alamat Pengiriman Kado Fisik */}
                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                      <Gift className="w-4 h-4 text-rose-500" />
                      <span>Alamat Kirim Kado Fisik</span>
                    </div>

                    <Textarea
                      rows={3}
                      placeholder="Contoh: Perumahan Graha Asri Blok C No. 12, Surabaya (Penerima: Fajar - 081234567890)"
                      value={giftAddress}
                      onChange={(e) => setGiftAddress(e.target.value)}
                      helperText="Alamat ini akan ditampilkan di seksi amplop/kado template agar tamu dapat mengirim hadiah fisik"
                    />
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 5: RAW JSON CODE EDITOR (UNTUK PENGGUNA TEKNIS)           */}
              {/* ============================================================== */}
              {activeModalTab === 'raw' && (
                <div className="space-y-3 animate-in fade-in-0 duration-150">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Mode JSON Lanjutan: Seluruh perubahan di tab visual otomatis tersinkronisasi di sini. Anda juga dapat langsung mengedit string JSON ini untuk penyesuaian spesifik.
                    </span>
                  </div>

                  <Textarea
                    rows={14}
                    className="font-mono text-xs bg-slate-900 text-emerald-400 border-slate-800 rounded-xl p-4 leading-relaxed"
                    value={rawJsonString}
                    onChange={(e) => setRawJsonString(e.target.value)}
                    placeholder='{"showQrCheckin": true, "mempelaiPria": "..."}'
                  />
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-2">
                  {currentTabIndex > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      leftIcon={ChevronLeft}
                      onClick={handlePrevTab}
                    >
                      Sebelumnya
                    </Button>
                  )}

                  {currentTabIndex < TAB_ORDER.length - 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      rightIcon={ChevronRight}
                      onClick={handleNextTab}
                    >
                      Lanjut
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    {isEditing ? 'Simpan Perubahan' : 'Buat Undangan'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE TEMPLATE & QR CHECK-IN PREVIEW MODAL */}
      <InvitationTemplateModal
        isOpen={Boolean(selectedPreviewInv)}
        onClose={() => setSelectedPreviewInv(null)}
        invitation={selectedPreviewInv}
        guest={{
          name: 'Tamu Undangan (Contoh)',
          category: 'Reguler',
          pax: 1,
          qr_link:
            'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin?guestId=51486111-99f6-4606-ba81-ef3afadc618b',
          qr_code: '51486111-99f6-4606-ba81-ef3afadc618b',
          is_checked_in: false,
        }}
      />
    </div>
  );
};
