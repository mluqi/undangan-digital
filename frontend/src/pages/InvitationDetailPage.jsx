import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Upload,
  Download,
  QrCode,
  Plus,
  Edit3,
  Trash2,
  X,
  Share2,
  Copy,
  Link2,
  Lock,
  ShieldCheck,
  Crown,
  FileSpreadsheet,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Mail,
  Palette,
  MessageSquareHeart,
  Settings,
  Calendar,
  Clock,
  MapPin,
  Save,
  Check,
  Heart,
  ChevronRight,
  Send,
  MessageSquare,
  Music,
  Volume2,
  Image as ImageIcon,
  Disc,
  FolderArchive,
  CheckCircle2,
  CreditCard,
  Gift,
} from 'lucide-react';
import {
  DataTable,
  Button,
  Badge,
  Card,
  Select,
  Input,
  Textarea,
  Spinner,
  Switch,
} from '../components/ui';
import { invitationService } from '../services/invitationService';
import { guestService } from '../services/guestService';
import { rsvpService } from '../services/rsvpService';
import { templateService } from '../services/templateService';
import { useToast } from '../components/ui/Toast';
import * as XLSX from 'xlsx';
import {
  exportInvitationExcelTemplate,
  parseInvitationExcel,
} from '../utils/invitationExcel';
import { QRCodeSVG } from 'qrcode.react';
import { InvitationTemplateModal } from '../components/invitation/InvitationTemplateModal';
import { getTemplateComponent } from '../components/invitation/templateRegistry';

export const MUSIC_PRESETS = [
  {
    title: 'Acoustic Wedding - Romantic Bliss',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=wedding-acoustic-112199.mp3',
  },
  {
    title: 'Canon in D Piano Solo',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=canon-in-d-piano-solo-14545.mp3',
  },
  {
    title: 'Warm Emotional Acoustic Love',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=acoustic-guitar-love-123276.mp3',
  },
  {
    title: 'Gentle Piano Love Story',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=gentle-piano-love-story-10330.mp3',
  },
];

export const InvitationDetailPage = ({
  invitationId,
  activeTab: activeTabProp,
  onTabChange,
  onBack,
  onInvitationLoaded,
  onNavigateToTemplates,
}) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const excelSettingsFileInputRef = useRef(null);

  // Core invitation state
  const [invitation, setInvitation] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(activeTabProp || 'guests'); // 'guests' | 'rsvps' | 'settings' | 'preview'

  useEffect(() => {
    if (activeTabProp && activeTabProp !== activeTab) {
      setActiveTab(activeTabProp);
    }
  }, [activeTabProp]);

  const handleSwitchTab = (nextTab) => {
    setActiveTab(nextTab);
    if (onTabChange) {
      onTabChange(nextTab);
    }
  };

  // Guests state
  const [guests, setGuests] = useState([]);
  const [guestStats, setGuestStats] = useState({ total: 0, vip: 0, reguler: 0, totalPax: 0 });
  const [isGuestsLoading, setIsGuestsLoading] = useState(false);
  const [filterGuestCategory, setFilterGuestCategory] = useState('');
  const [selectedGuestIds, setSelectedGuestIds] = useState([]);
  const [isDeletingGuests, setIsDeletingGuests] = useState(false);

  // RSVPs state
  const [rsvps, setRsvps] = useState([]);
  const [filterRsvpStatus, setFilterRsvpStatus] = useState('');
  const [isRsvpsLoading, setIsRsvpsLoading] = useState(false);
  const [selectedRsvpIds, setSelectedRsvpIds] = useState([]);
  const [isDeletingRsvps, setIsDeletingRsvps] = useState(false);

  // Modals
  const [selectedGuestQr, setSelectedGuestQr] = useState(null);
  const [previewGuestInModal, setPreviewGuestInModal] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedPreview, setImportedPreview] = useState([]);
  const [importFileName, setImportFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Single Guest Add/Edit Modal
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [editGuestId, setEditGuestId] = useState(null);
  const [guestFormData, setGuestFormData] = useState({
    name: '',
    category: 'Reguler',
    pax: 1,
    phone_number: '',
    qr_code: '',
    qr_link: '',
  });

  // Settings / Content Form
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    eventType: 'wedding',
    showSecondEvent: true,
    client_name: '',
    template_id: '',
    slug: '',
    expired_at: '',
    showQrCheckin: true,
    lockGuestList: false,
    showDonation: true,
    showGift: true,
    mempelaiPria: '',
    panggilanPria: '',
    anakKePria: '',
    instagramPria: '',
    ayahPria: '',
    ibuPria: '',
    mempelaiWanita: '',
    panggilanWanita: '',
    anakKeWanita: '',
    instagramWanita: '',
    ayahWanita: '',
    ibuWanita: '',
    akadJudul: 'Akad Nikah',
    akadTanggal: '',
    akadWaktu: '',
    akadLokasi: '',
    akadAlamat: '',
    akadMapUrl: '',
    resepsiJudul: 'Resepsi',
    resepsiTanggal: '',
    resepsiWaktu: '',
    resepsiLokasi: '',
    resepsiAlamat: '',
    resepsiMapUrl: '',
    penerimaKado: '',
    alamatKado: '',
    ayat: '',
    salamPembuka: '',
    teksPenutup: '',
    salamPenutup: '',
    backgroundVideoUrl: '',
    preweddingVideoUrl: '',
    fotoPenutup: '',
    tanggalAkadISO: '',
    judulPembuka: '',
    catatanCover: '',
    monogram: '',
    kutipanPembuka: '',
    judulCountdown: '',
    judulGaleri: '',
    judulKisah: '',
    judulKado: '',
    subjudulKado: '',
    judulRsvp: '',
    subjudulRsvp: '',
    judulPenutup: '',
    subjudulPenutup: '',
    tandaTanganPenutup: '',
    footerText: '',
    showDresscode: true,
    judulDresscode: '',
    dresscodeText: '',
    dresscodeColors: ['#fdf9f6', '#a96d79', '#68333e'],
    giftConfirmText: '',
    giftWa1Name: '',
    giftWa1Phone: '',
    giftWa2Name: '',
    giftWa2Phone: '',
    seatPlanImage: '',
    seatPlanTitle: '',
    seatPlanCaption: '',
  });

  // Media & Assets States
  const [musicUrl, setMusicUrl] = useState('');
  const [musicTitle, setMusicTitle] = useState('Acoustic Wedding - Romantic Bliss');
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [fotoCover, setFotoCover] = useState('');
  const [fotoWhatsapp, setFotoWhatsapp] = useState('');
  const [fotoPria, setFotoPria] = useState('');
  const [fotoWanita, setFotoWanita] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingWhatsapp, setIsUploadingWhatsapp] = useState(false);
  const [isUploadingGroom, setIsUploadingGroom] = useState(false);
  const [isUploadingBride, setIsUploadingBride] = useState(false);
  const [isUploadingClosing, setIsUploadingClosing] = useState(false);
  const [isUploadingSeatPlan, setIsUploadingSeatPlan] = useState(false);
  const [isUploadingBgVideo, setIsUploadingBgVideo] = useState(false);
  const [isUploadingPrewedVideo, setIsUploadingPrewedVideo] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // File Input Refs
  const musicFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);
  const whatsappFileInputRef = useRef(null);
  const groomFileInputRef = useRef(null);
  const brideFileInputRef = useRef(null);
  const closingFileInputRef = useRef(null);
  const seatPlanFileInputRef = useRef(null);
  const bgVideoFileInputRef = useRef(null);
  const prewedVideoFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  // Bank Accounts / Rekening state
  const [bankAccounts, setBankAccounts] = useState([]);

  const handleAddBankAccount = () => {
    setBankAccounts([...bankAccounts, { bank: '', nomor: '', nama: '' }]);
  };

  const handleBankAccountChange = (index, field, value) => {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setBankAccounts(updated);
  };

  const handleRemoveBankAccount = (index) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== index));
  };

  // Love stories / kisah state
  const [loveStories, setLoveStories] = useState([]);

  const handleAddStory = () => {
    setLoveStories([
      ...loveStories,
      {
        tahun: new Date().getFullYear().toString(),
        judul: '',
        cerita: '',
      },
    ]);
  };

  const handleUpdateStory = (index, field, value) => {
    const updated = [...loveStories];
    updated[index] = { ...updated[index], [field]: value };
    setLoveStories(updated);
  };

  const handleRemoveStory = (index) => {
    setLoveStories(loveStories.filter((_, i) => i !== index));
  };

  // Upload Handlers (Saved to backend slug-based folder)
  const handleUploadMusicFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMusic(true);
    try {
      const res = await invitationService.uploadMusic(invitationId, file);
      if (res?.data?.url) {
        setMusicUrl(res.data.url);
        setMusicTitle(file.name.replace(/\.[^/.]+$/, ''));
        toast.success(`Lagu "${file.name}" berhasil diupload ke /uploads/${invitation?.slug}/music/`);
      }
    } catch (err) {
      console.error('Error upload music:', err);
      toast.error(err.message || 'Gagal mengupload lagu.');
    } finally {
      setIsUploadingMusic(false);
      e.target.value = '';
    }
  };

  const handleUploadSinglePhoto = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'cover') setIsUploadingCover(true);
    if (type === 'whatsapp') setIsUploadingWhatsapp(true);
    if (type === 'groom') setIsUploadingGroom(true);
    if (type === 'bride') setIsUploadingBride(true);
    if (type === 'closing') setIsUploadingClosing(true);
    if (type === 'seatplan') setIsUploadingSeatPlan(true);

    try {
      const res = await invitationService.uploadPhoto(invitationId, file, type);
      if (res?.data?.url) {
        if (type === 'cover') setFotoCover(res.data.url);
        if (type === 'whatsapp') setFotoWhatsapp(res.data.url);
        if (type === 'groom') setFotoPria(res.data.url);
        if (type === 'bride') setFotoWanita(res.data.url);
        if (type === 'closing') {
          setSettingsForm((prev) => ({ ...prev, fotoPenutup: res.data.url }));
        }
        if (type === 'seatplan') {
          setSettingsForm((prev) => ({ ...prev, seatPlanImage: res.data.url }));
        }
        toast.success(`Foto ${type} berhasil diupload ke /uploads/${invitation?.slug}/covers/`);
      }
    } catch (err) {
      console.error('Error upload photo:', err);
      toast.error(err.message || 'Gagal mengupload foto.');
    } finally {
      if (type === 'cover') setIsUploadingCover(false);
      if (type === 'whatsapp') setIsUploadingWhatsapp(false);
      if (type === 'groom') setIsUploadingGroom(false);
      if (type === 'bride') setIsUploadingBride(false);
      if (type === 'closing') setIsUploadingClosing(false);
      if (type === 'seatplan') setIsUploadingSeatPlan(false);
      e.target.value = '';
    }
  };

  const handleUploadVideoFile = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'background') setIsUploadingBgVideo(true);
    if (type === 'prewedding') setIsUploadingPrewedVideo(true);

    try {
      const res = await invitationService.uploadVideo(invitationId, file, type);
      if (res?.data?.url) {
        if (type === 'background') {
          setSettingsForm((prev) => ({ ...prev, backgroundVideoUrl: res.data.url }));
        }
        if (type === 'prewedding') {
          setSettingsForm((prev) => ({ ...prev, preweddingVideoUrl: res.data.url }));
        }
        toast.success(`Video berhasil diupload ke /uploads/${invitation?.slug}/video/`);
      }
    } catch (err) {
      console.error('Error upload video:', err);
      toast.error(err.message || 'Gagal mengupload video.');
    } finally {
      if (type === 'background') setIsUploadingBgVideo(false);
      if (type === 'prewedding') setIsUploadingPrewedVideo(false);
      e.target.value = '';
    }
  };

  const handleUploadGalleryFiles = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);

    try {
      const res = await invitationService.uploadGallery(invitationId, files);
      if (res?.data && Array.isArray(res.data)) {
        const newUrls = res.data.map((item) => item.url);
        setGalleryPhotos([...galleryPhotos, ...newUrls]);
        toast.success(`${newUrls.length} foto galeri berhasil diupload ke /uploads/${invitation?.slug}/gallery/`);
      }
    } catch (err) {
      console.error('Error upload gallery:', err);
      toast.error(err.message || 'Gagal mengupload foto galeri.');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryPhoto = (index) => {
    setGalleryPhotos(galleryPhotos.filter((_, i) => i !== index));
    toast.info('Foto galeri dihapus.');
  };

  // Preview tab selected guest
  const [selectedPreviewGuestId, setSelectedPreviewGuestId] = useState('');

  useEffect(() => {
    loadAllData();
  }, [invitationId]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [invRes, tmplRes] = await Promise.all([
        invitationService.getById(invitationId),
        templateService.getAll({ is_active: true }),
      ]);

      const invData = invRes?.data;
      setInvitation(invData);
      if (invData && onInvitationLoaded) {
        onInvitationLoaded(invData);
      }
      setTemplates(tmplRes?.data || []);

      // Populate settings form
      const c = invData?.content_json || {};
      const loadedEventType = c.eventType || 'wedding';
      setSettingsForm({
        eventType: loadedEventType,
        showSecondEvent:
          c.showSecondEvent !== undefined
            ? Boolean(c.showSecondEvent)
            : loadedEventType === 'wedding',
        client_name: invData.client_name || '',
        template_id: invData.template_id?.toString() || '',
        slug: invData.slug || '',
        expired_at: invData.expired_at ? invData.expired_at.substring(0, 10) : '',
        showQrCheckin:
          c.showQr !== undefined
            ? Boolean(c.showQr)
            : c.showQrCheckin !== undefined
            ? Boolean(c.showQrCheckin)
            : true,
        lockGuestList: Boolean(c.lockGuestList),
        showDonation: c.showDonation !== undefined ? Boolean(c.showDonation) : true,
        showGift: c.showGift !== undefined ? Boolean(c.showGift) : true,
        mempelaiPria: c.mempelaiPria || '',
        panggilanPria:
          c.panggilanPria || (c.mempelaiPria ? c.mempelaiPria.split(',')[0].trim().split(' ')[0] : ''),
        anakKePria: c.anakKePria || 'Putra Pertama',
        instagramPria: c.instagramPria || '',
        ayahPria: c.ayahPria || '',
        ibuPria: c.ibuPria || '',
        mempelaiWanita: c.mempelaiWanita || '',
        panggilanWanita:
          c.panggilanWanita ||
          (c.mempelaiWanita ? c.mempelaiWanita.split(',')[0].trim().split(' ')[0] : ''),
        anakKeWanita: c.anakKeWanita || 'Putri Pertama',
        instagramWanita: c.instagramWanita || '',
        ayahWanita: c.ayahWanita || '',
        ibuWanita: c.ibuWanita || '',
        akadJudul: c.akad?.judul || 'Akad Nikah',
        akadTanggal: c.akad?.tanggal || '',
        akadWaktu: c.akad?.waktu || '',
        akadLokasi: c.akad?.lokasi || '',
        akadAlamat: c.akad?.alamat || '',
        akadMapUrl: c.akad?.mapUrl || '',
        resepsiJudul: c.resepsi?.judul || 'Resepsi',
        resepsiTanggal: c.resepsi?.tanggal || '',
        resepsiWaktu: c.resepsi?.waktu || '',
        resepsiLokasi: c.resepsi?.lokasi || '',
        resepsiAlamat: c.resepsi?.alamat || '',
        resepsiMapUrl: c.resepsi?.mapUrl || '',
        penerimaKado: c.penerimaKado || '',
        alamatKado: c.alamatKado || '',
        ayat: c.ayat || 'QS. Ar-Rum: 21',
        salamPembuka: c.salamPembuka || '',
        teksPenutup:
          c.teksPenutup ||
          'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.',
        salamPenutup:
          c.salamPenutup !== undefined
            ? c.salamPenutup
            : "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
        backgroundVideoUrl: c.backgroundVideoUrl || '',
        preweddingVideoUrl: c.preweddingVideoUrl || '',
        fotoPenutup: c.fotoPenutup || '',
        tanggalAkadISO: c.tanggalAkadISO ? String(c.tanggalAkadISO).slice(0, 16) : '',
        judulPembuka: c.judulPembuka || '',
        catatanCover: c.catatanCover || '',
        monogram: c.monogram || '',
        kutipanPembuka: c.kutipanPembuka || '',
        judulCountdown: c.judulCountdown || '',
        judulGaleri: c.judulGaleri || '',
        judulKisah: c.judulKisah || '',
        judulKado: c.judulKado || '',
        subjudulKado: c.subjudulKado || '',
        judulRsvp: c.judulRsvp || '',
        subjudulRsvp: c.subjudulRsvp || '',
        judulPenutup: c.judulPenutup || '',
        subjudulPenutup: c.subjudulPenutup || '',
        tandaTanganPenutup: c.tandaTanganPenutup || '',
        footerText: c.footerText || '',
        showDresscode: c.showDresscode !== undefined ? Boolean(c.showDresscode) : true,
        judulDresscode: c.judulDresscode || '',
        dresscodeText: c.dresscodeText || '',
        dresscodeColors:
          Array.isArray(c.dresscodeColors) && c.dresscodeColors.length > 0
            ? c.dresscodeColors
            : ['#fdf9f6', '#a96d79', '#68333e'],
        giftConfirmText: c.giftConfirmText || '',
        giftWa1Name: c.giftWa1Name || '',
        giftWa1Phone: c.giftWa1Phone || '',
        giftWa2Name: c.giftWa2Name || '',
        giftWa2Phone: c.giftWa2Phone || '',
        seatPlanImage: c.seatPlanImage || '',
        seatPlanTitle: c.seatPlanTitle || '',
        seatPlanCaption: c.seatPlanCaption || '',
      });

      // Populate bank accounts
      if (c.rekening && Array.isArray(c.rekening) && c.rekening.length > 0) {
        setBankAccounts(c.rekening);
      } else {
        setBankAccounts([
          { bank: 'BCA', nomor: '0182938192', nama: c.mempelaiPria ? c.mempelaiPria.split(',')[0].trim() : 'Ahmad' },
          { bank: 'BSI', nomor: '7192830192', nama: c.mempelaiWanita ? c.mempelaiWanita.split(',')[0].trim() : 'Aminah' },
        ]);
      }

      // Populate love stories
      if (c.kisah && Array.isArray(c.kisah) && c.kisah.length > 0) {
        setLoveStories(c.kisah);
      } else {
        setLoveStories([
          {
            tahun: '2021',
            judul: 'Awal Pertemuan',
            cerita:
              'Takdir mempertemukan kami pertama kali di Surabaya dalam sebuah acara edukasi. Dari sekadar obrolan santai, tumbuh ketertarikan dan kekaguman satu sama lain.',
          },
          {
            tahun: '2023',
            judul: 'Menjalin Komitmen',
            cerita:
              'Seiring berjalannya waktu, saling memahami visi hidup dan nilai-nilai kebaikan membawa kami pada keputusan untuk melangkah lebih serius bersama dalam ridho Allah.',
          },
          {
            tahun: '2026',
            judul: 'Lamaran Menuju Akad',
            cerita:
              'Dengan restu kedua orang tua dan keluarga tercinta, kami memantapkan niat suci ini untuk menyempurnakan separuh agama menuju ikatan pernikahan yang berkah.',
          },
        ]);
      }

      // Populate media states
      setMusicUrl(c.musicUrl || 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-wedding-113063.mp3');
      setMusicTitle(c.musicTitle || 'Acoustic Wedding - Romantic Bliss');
      setFotoCover(c.fotoCover || '/images/defaults/couple-cover.jpg');
      setFotoWhatsapp(c.fotoWhatsapp && c.fotoWhatsapp !== c.fotoCover ? c.fotoWhatsapp : '');
      setFotoPria(c.fotoPria || '/images/defaults/groom.jpg');
      setFotoWanita(c.fotoWanita || '/images/defaults/bride.jpg');
      setGalleryPhotos(
        c.galeri && Array.isArray(c.galeri) && c.galeri.length > 0
          ? c.galeri
          : [
              '/images/defaults/couple-cover.jpg',
              '/images/defaults/gallery-hands.jpg',
              '/images/defaults/gallery-bouquet.jpg',
              '/images/defaults/bride.jpg',
              '/images/defaults/groom.jpg',
            ]
      );

      // Load guests & RSVPs
      await Promise.all([loadGuests(), loadRsvps()]);
    } catch (err) {
      console.error('Error loading invitation details:', err);
      toast.error('Gagal memuat detail undangan client.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGuests = async () => {
    setIsGuestsLoading(true);
    try {
      const res = await guestService.getByInvitation(invitationId, {
        category: filterGuestCategory,
        limit: 'all',
      });
      setGuests(res?.data?.guests || []);
      setGuestStats(res?.data?.stats || { total: 0, vip: 0, reguler: 0, totalPax: 0 });
      setSelectedGuestIds([]);
    } catch (err) {
      console.error('Error load guests:', err);
    } finally {
      setIsGuestsLoading(false);
    }
  };

  const loadRsvps = async () => {
    setIsRsvpsLoading(true);
    try {
      const res = await rsvpService.getAll({
        invitation_id: invitationId,
        status: filterRsvpStatus,
        attendance_status: filterRsvpStatus,
        limit: 100,
      });
      setRsvps(res?.data?.rsvps || []);
      setSelectedRsvpIds([]);
    } catch (err) {
      console.error('Error load rsvps:', err);
    } finally {
      setIsRsvpsLoading(false);
    }
  };

  useEffect(() => {
    if (invitationId) {
      loadGuests();
    }
  }, [filterGuestCategory]);

  useEffect(() => {
    if (invitationId) {
      loadRsvps();
    }
  }, [filterRsvpStatus]);

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
    XLSX.writeFile(wb, `Template_Tamu_${invitation?.slug || 'undangan'}.xlsx`);
    toast.success('Template Excel tamu berhasil diunduh!');
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

        const mapped = data.map((row, idx) => {
          const name =
            row['Nama Tamu'] ||
            row['nama tamu'] ||
            row['nama'] ||
            row['Nama'] ||
            row['name'] ||
            row['NAMA'] ||
            `Tamu ${idx + 1}`;

          const rawCat = (
            row['Kategori'] ||
            row['kategori'] ||
            row['kategori(vip/reguler)'] ||
            row['Kategori (VIP/Reguler)'] ||
            row['Kategori (VIP/Reguler/Grup)'] ||
            row['category'] ||
            ''
          ).toUpperCase();
          const category = rawCat.includes('VVIP')
            ? 'VVIP'
            : rawCat.includes('VIP')
            ? 'VIP'
            : rawCat.includes('GRUP') || rawCat.includes('GROUP')
            ? 'Grup'
            : 'Reguler';

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
            ''
          ).trim();

          let guestId = '';
          if (link) {
            const m = link.match(/guestId=([a-zA-Z0-9\-]+)/i);
            if (m) guestId = m[1];
          }

          const hasExplicitQr = Boolean(guestId || row['qr_code'] || link);
          const qrCode =
            guestId ||
            row['qr_code'] ||
            `CHK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

          return {
            name: String(name).trim(),
            category,
            qr_code: qrCode,
            has_explicit_qr: hasExplicitQr,
            qr_link: link || `${window.location.origin}/invitation/${invitation?.slug}?to=${encodeURIComponent(name)}&code=${qrCode}`,
          };
        });

        setImportedPreview(mapped);
        setIsImportModalOpen(true);
        toast.info(`Berhasil membaca ${mapped.length} data tamu dari Excel.`);
      } catch (err) {
        console.error('Error parsing excel:', err);
        toast.error('Gagal membaca file Excel. Pastikan format file sesuai.');
      }
    };

    reader.readAsBinaryString(file);
    e.target.value = null;
  };

  const handleConfirmImport = async () => {
    if (!importedPreview.length) return;

    setIsImporting(true);
    try {
      const res = await guestService.importGuests(invitationId, importedPreview);
      toast.success(res.message || `Berhasil mengimpor ${res.count} tamu.`);
      setIsImportModalOpen(false);
      setImportedPreview([]);
      loadGuests();
    } catch (err) {
      console.error('Error importing guests:', err);
      toast.error(err.message || 'Gagal menyimpan data tamu.');
    } finally {
      setIsImporting(false);
    }
  };

  // --- SINGLE GUEST CRUD ---
  const handleOpenCreateGuest = () => {
    setIsEditingGuest(false);
    setEditGuestId(null);
    setGuestFormData({
      name: '',
      category: 'Reguler',
      pax: 1,
      phone_number: '',
      qr_code: '',
      qr_link: '',
    });
    setIsGuestFormOpen(true);
  };

  const handleOpenEditGuest = (g) => {
    setIsEditingGuest(true);
    setEditGuestId(g.id);
    setGuestFormData({
      name: g.name,
      category: g.category,
      pax: g.pax,
      phone_number: g.phone_number || '',
      qr_code: g.qr_code,
      qr_link: g.qr_link || '',
    });
    setIsGuestFormOpen(true);
  };

  const handleSaveGuestForm = async (e) => {
    e.preventDefault();
    if (!guestFormData.name) {
      toast.error('Nama tamu wajib diisi.');
      return;
    }

    try {
      if (isEditingGuest) {
        await guestService.update(editGuestId, guestFormData);
        toast.success('Data tamu berhasil diperbarui!');
      } else {
        await guestService.create(invitationId, guestFormData);
        toast.success('Tamu baru berhasil ditambahkan!');
      }

      setIsGuestFormOpen(false);
      loadGuests();
    } catch (err) {
      console.error('Error save guest:', err);
      toast.error(err.message || 'Gagal menyimpan data tamu.');
    }
  };

  const handleDeleteGuest = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus tamu "${name}"?`)) return;

    try {
      await guestService.delete(id);
      toast.success(`Tamu "${name}" berhasil dihapus.`);
      loadGuests();
    } catch (err) {
      console.error('Error delete guest:', err);
      toast.error(err.message || 'Gagal menghapus data tamu.');
    }
  };

  const handleBulkDeleteGuests = async () => {
    if (selectedGuestIds.length === 0) return;
    if (
      !window.confirm(
        `Yakin ingin menghapus ${selectedGuestIds.length} data tamu yang dipilih?`
      )
    ) {
      return;
    }

    setIsDeletingGuests(true);
    try {
      const res = await guestService.bulkDelete(invitationId, selectedGuestIds);
      toast.success(res.message || `${selectedGuestIds.length} tamu berhasil dihapus.`);
      setSelectedGuestIds([]);
      loadGuests();
    } catch (err) {
      console.error('Error bulk delete guests:', err);
      toast.error(err.message || 'Gagal menghapus tamu terpilih.');
    } finally {
      setIsDeletingGuests(false);
    }
  };

  const handleDeleteAllGuests = async () => {
    if (guests.length === 0) return;
    if (
      !window.confirm(
        `PERINGATAN: Yakin ingin menghapus SELURUH (${guestStats.total || guests.length}) daftar tamu pada undangan ini? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setIsDeletingGuests(true);
    try {
      const res = await guestService.deleteAll(invitationId);
      toast.success(res.message || 'Seluruh data tamu berhasil dihapus.');
      setSelectedGuestIds([]);
      loadGuests();
    } catch (err) {
      console.error('Error delete all guests:', err);
      toast.error(err.message || 'Gagal menghapus seluruh tamu.');
    } finally {
      setIsDeletingGuests(false);
    }
  };

  const handleBulkDeleteRsvps = async () => {
    if (selectedRsvpIds.length === 0) return;
    if (
      !window.confirm(
        `Yakin ingin menghapus ${selectedRsvpIds.length} ucapan buku tamu yang dipilih?`
      )
    ) {
      return;
    }

    setIsDeletingRsvps(true);
    try {
      const res = await rsvpService.bulkDelete(invitationId, selectedRsvpIds);
      toast.success(res.message || `${selectedRsvpIds.length} ucapan berhasil dihapus.`);
      setSelectedRsvpIds([]);
      loadRsvps();
    } catch (err) {
      console.error('Error bulk delete rsvps:', err);
      toast.error(err.message || 'Gagal menghapus ucapan terpilih.');
    } finally {
      setIsDeletingRsvps(false);
    }
  };

  const handleDeleteAllRsvps = async () => {
    if (rsvps.length === 0) return;
    if (
      !window.confirm(
        `PERINGATAN: Yakin ingin menghapus SELURUH (${rsvps.length}) ucapan buku tamu & RSVP pada undangan ini? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setIsDeletingRsvps(true);
    try {
      const res = await rsvpService.deleteAll(invitationId);
      toast.success(res.message || 'Seluruh ucapan buku tamu berhasil dihapus.');
      setSelectedRsvpIds([]);
      loadRsvps();
    } catch (err) {
      console.error('Error delete all rsvps:', err);
      toast.error(err.message || 'Gagal menghapus seluruh ucapan.');
    } finally {
      setIsDeletingRsvps(false);
    }
  };

  const handleCopyShareText = (guest) => {
    const publicUrl = `${window.location.origin}/invitation/${invitation.slug}?to=${encodeURIComponent(guest.name)}`;
    const evType = settingsForm.eventType || invitation?.content_json?.eventType || 'wedding';
    const eventPhrase =
      evType === 'engagement'
        ? 'acara lamaran kami'
        : evType === 'birthday'
        ? 'acara ulang tahun'
        : evType === 'event'
        ? `acara ${settingsForm.mempelaiPria || invitation?.client_name || 'kami'}`
        : 'acara pernikahan kami';
    const text = `Kepada Yth. *${guest.name}*,\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di ${eventPhrase}:\n\n${publicUrl}`;
    navigator.clipboard.writeText(text);
    toast.success('Teks undangan personal tamu berhasil disalin untuk WhatsApp!');
  };

  const handleCopyOnlyLink = (guest) => {
    const publicUrl = `${window.location.origin}/invitation/${invitation.slug}?to=${encodeURIComponent(guest.name)}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success(`Link undangan untuk ${guest.name} berhasil disalin!`);
  };

  // ==============================================================
  // EXCEL EXPORT & IMPORT FOR INVITATION SETTINGS
  // ==============================================================
  const handleExportInvitationExcel = () => {
    try {
      const selectedTmpl = templates.find((t) => t.id.toString() === settingsForm.template_id?.toString());
      const c = invitation?.content_json || {};
      const dataToExport = {
        client_name: settingsForm.client_name,
        slug: settingsForm.slug,
        template_code: selectedTmpl?.template_code || 'forest-tropical',
        show_qr_checkin: settingsForm.showQrCheckin ? 'YA' : 'TIDAK',
        expired_at: settingsForm.expired_at,
        mempelai_pria: settingsForm.mempelaiPria,
        panggilan_pria: settingsForm.panggilanPria,
        ayah_pria: settingsForm.ayahPria,
        ibu_pria: settingsForm.ibuPria,
        mempelai_wanita: settingsForm.mempelaiWanita,
        panggilan_wanita: settingsForm.panggilanWanita,
        ayah_wanita: settingsForm.ayahWanita,
        ibu_wanita: settingsForm.ibuWanita,
        ayat: settingsForm.ayat,
        teks_penutup: settingsForm.teksPenutup,
        salam_penutup: settingsForm.salamPenutup,
        akad_tanggal: settingsForm.akadTanggal,
        akad_waktu: settingsForm.akadWaktu,
        akad_lokasi: settingsForm.akadLokasi,
        akad_alamat: settingsForm.akadAlamat || c.akad?.alamat || '',
        akad_map_url: settingsForm.akadMapUrl || c.akad?.mapUrl || '',
        resepsi_tanggal: settingsForm.resepsiTanggal,
        resepsi_waktu: settingsForm.resepsiWaktu,
        resepsi_lokasi: settingsForm.resepsiLokasi,
        resepsi_alamat: settingsForm.resepsiAlamat || c.resepsi?.alamat || '',
        resepsi_map_url: settingsForm.resepsiMapUrl || c.resepsi?.mapUrl || '',
        bank_1_nama: c.rekening?.[0]?.bank || '',
        bank_1_nomor: c.rekening?.[0]?.nomor || '',
        bank_1_pemilik: c.rekening?.[0]?.nama || '',
        bank_2_nama: c.rekening?.[1]?.bank || '',
        bank_2_nomor: c.rekening?.[1]?.nomor || '',
        bank_2_pemilik: c.rekening?.[1]?.nama || '',
        alamat_kado: settingsForm.alamatKado || c.alamatKado || '',
      };

      const filename = `Data_Undangan_${settingsForm.slug || 'client'}.xlsx`;
      exportInvitationExcelTemplate(dataToExport, filename);
      toast.success('File Excel formulir berhasil diunduh!');
    } catch (err) {
      console.error('Error export invitation excel:', err);
      toast.error('Gagal mengekspor data formulir ke Excel.');
    }
  };

  const handleImportInvitationExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseInvitationExcel(file);

      setSettingsForm((prev) => {
        const next = { ...prev };
        if (parsed.clientName) next.client_name = parsed.clientName;
        if (parsed.slug) next.slug = parsed.slug;
        if (parsed.expiredAt !== undefined && parsed.expiredAt !== '') next.expired_at = parsed.expiredAt;
        if (parsed.showQrCheckin !== undefined) next.showQrCheckin = Boolean(parsed.showQrCheckin);

        // Cocokkan template
        if (parsed.templateCode && templates.length > 0) {
          const target = parsed.templateCode.toLowerCase().trim();
          const matched = templates.find(
            (t) =>
              t.template_code?.toLowerCase() === target ||
              t.name?.toLowerCase().includes(target)
          );
          if (matched) {
            next.template_id = matched.id.toString();
          }
        }

        if (parsed.mempelaiPria) next.mempelaiPria = parsed.mempelaiPria;
        if (parsed.panggilanPria) next.panggilanPria = parsed.panggilanPria;
        if (parsed.ayahPria) next.ayahPria = parsed.ayahPria;
        if (parsed.ibuPria) next.ibuPria = parsed.ibuPria;
        if (parsed.mempelaiWanita) next.mempelaiWanita = parsed.mempelaiWanita;
        if (parsed.panggilanWanita) next.panggilanWanita = parsed.panggilanWanita;
        if (parsed.ayahWanita) next.ayahWanita = parsed.ayahWanita;
        if (parsed.ibuWanita) next.ibuWanita = parsed.ibuWanita;
        if (parsed.ayat) next.ayat = parsed.ayat;
        if (parsed.teksPenutup) next.teksPenutup = parsed.teksPenutup;
        if (parsed.salamPenutup !== undefined && parsed.salamPenutup !== '') {
          next.salamPenutup = parsed.salamPenutup;
        }
        if (parsed.akadTanggal) next.akadTanggal = parsed.akadTanggal;
        if (parsed.akadWaktu) next.akadWaktu = parsed.akadWaktu;
        if (parsed.akadLokasi) next.akadLokasi = parsed.akadLokasi;
        if (parsed.akadAlamat) next.akadAlamat = parsed.akadAlamat;
        if (parsed.akadMapUrl) next.akadMapUrl = parsed.akadMapUrl;
        if (parsed.resepsiTanggal) next.resepsiTanggal = parsed.resepsiTanggal;
        if (parsed.resepsiWaktu) next.resepsiWaktu = parsed.resepsiWaktu;
        if (parsed.resepsiLokasi) next.resepsiLokasi = parsed.resepsiLokasi;
        if (parsed.resepsiAlamat) next.resepsiAlamat = parsed.resepsiAlamat;
        if (parsed.resepsiMapUrl) next.resepsiMapUrl = parsed.resepsiMapUrl;
        if (parsed.alamatKado) next.alamatKado = parsed.alamatKado;

        return next;
      });

      // Update rekening jika ada di Excel
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
        setInvitation((prev) => ({
          ...prev,
          content_json: {
            ...(prev?.content_json || {}),
            rekening: importedBanks,
          },
        }));
      }

      toast.success(`Data dari file "${file.name}" berhasil diterapkan ke form! Jangan lupa klik 'Simpan Pengaturan'.`);
    } catch (err) {
      console.error('Error import excel:', err);
      toast.error(err.message || 'Gagal membaca file Excel.');
    } finally {
      if (excelSettingsFileInputRef.current) {
        excelSettingsFileInputRef.current.value = '';
      }
    }
  };

  // --- SETTINGS FORM SAVE ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);

    try {
      const selectedTmpl = templates.find(
        (t) => t.id.toString() === settingsForm.template_id?.toString()
      );
      const activeTemplateCode =
        selectedTmpl?.template_code || invitation?.template?.template_code || 'default';
      const existingOverrides = invitation?.content_json?.templateOverrides || {};
      const currentTemplateOverride = {
        backgroundVideoUrl: settingsForm.backgroundVideoUrl || undefined,
        preweddingVideoUrl: settingsForm.preweddingVideoUrl || undefined,
        fotoPenutup: settingsForm.fotoPenutup || undefined,
        judulPembuka: settingsForm.judulPembuka || undefined,
        catatanCover: settingsForm.catatanCover || undefined,
        monogram: settingsForm.monogram || undefined,
        kutipanPembuka: settingsForm.kutipanPembuka || undefined,
        salamPembuka: settingsForm.salamPembuka || undefined,
        judulCountdown: settingsForm.judulCountdown || undefined,
        judulGaleri: settingsForm.judulGaleri || undefined,
        judulKisah: settingsForm.judulKisah || undefined,
        judulKado: settingsForm.judulKado || undefined,
        subjudulKado: settingsForm.subjudulKado || undefined,
        judulRsvp: settingsForm.judulRsvp || undefined,
        subjudulRsvp: settingsForm.subjudulRsvp || undefined,
        judulPenutup: settingsForm.judulPenutup || undefined,
        subjudulPenutup: settingsForm.subjudulPenutup || undefined,
        tandaTanganPenutup: settingsForm.tandaTanganPenutup || undefined,
        footerText: settingsForm.footerText || undefined,
        showDresscode: Boolean(settingsForm.showDresscode),
        judulDresscode: settingsForm.judulDresscode || undefined,
        dresscodeText: settingsForm.dresscodeText || undefined,
        dresscodeColors:
          Array.isArray(settingsForm.dresscodeColors) && settingsForm.dresscodeColors.length > 0
            ? settingsForm.dresscodeColors
            : undefined,
        giftConfirmText: settingsForm.giftConfirmText || undefined,
        giftWa1Name: settingsForm.giftWa1Name || undefined,
        giftWa1Phone: settingsForm.giftWa1Phone || undefined,
        giftWa2Name: settingsForm.giftWa2Name || undefined,
        giftWa2Phone: settingsForm.giftWa2Phone || undefined,
      };

      const payload = {
        client_name: settingsForm.client_name,
        template_id: parseInt(settingsForm.template_id, 10),
        slug: settingsForm.slug,
        expired_at: settingsForm.expired_at || null,
        content_json: {
          eventType: settingsForm.eventType || 'wedding',
          showSecondEvent: Boolean(settingsForm.showSecondEvent),
          showQrCheckin: Boolean(settingsForm.showQrCheckin),
          showQr: Boolean(settingsForm.showQrCheckin),
          lockGuestList: Boolean(settingsForm.lockGuestList),
          showDonation: Boolean(settingsForm.showDonation),
          showGift: Boolean(settingsForm.showGift),
          mempelaiPria: settingsForm.mempelaiPria,
          panggilanPria: settingsForm.panggilanPria,
          anakKePria: settingsForm.anakKePria || undefined,
          instagramPria: settingsForm.instagramPria || undefined,
          ayahPria: settingsForm.ayahPria,
          ibuPria: settingsForm.ibuPria,
          mempelaiWanita: settingsForm.mempelaiWanita,
          panggilanWanita: settingsForm.panggilanWanita,
          anakKeWanita: settingsForm.anakKeWanita || undefined,
          instagramWanita: settingsForm.instagramWanita || undefined,
          ayahWanita: settingsForm.ayahWanita,
          ibuWanita: settingsForm.ibuWanita,
          ayat: settingsForm.ayat,
          salamPembuka: settingsForm.salamPembuka || undefined,
          teksPenutup: settingsForm.teksPenutup,
          salamPenutup: settingsForm.salamPenutup,
          akad: {
            judul: settingsForm.akadJudul || 'Akad Nikah',
            tanggal: settingsForm.akadTanggal,
            waktu: settingsForm.akadWaktu,
            lokasi: settingsForm.akadLokasi,
            alamat: settingsForm.akadAlamat || invitation?.content_json?.akad?.alamat || '',
            mapUrl: settingsForm.akadMapUrl || invitation?.content_json?.akad?.mapUrl || '',
          },
          resepsi: {
            judul: settingsForm.resepsiJudul || 'Resepsi',
            tanggal: settingsForm.resepsiTanggal,
            waktu: settingsForm.resepsiWaktu,
            lokasi: settingsForm.resepsiLokasi,
            alamat: settingsForm.resepsiAlamat || invitation?.content_json?.resepsi?.alamat || '',
            mapUrl: settingsForm.resepsiMapUrl || invitation?.content_json?.resepsi?.mapUrl || '',
          },
          kisah: loveStories.filter((s) => s.judul?.trim() || s.cerita?.trim()),
          galeri: galleryPhotos,
          musicUrl: musicUrl,
          musicTitle: musicTitle,
          rekening: bankAccounts.filter((b) => b.bank?.trim() || b.nomor?.trim() || b.nama?.trim()),
          penerimaKado: settingsForm.penerimaKado || undefined,
          alamatKado: settingsForm.alamatKado || undefined,
          backgroundVideoUrl: settingsForm.backgroundVideoUrl || undefined,
          preweddingVideoUrl: settingsForm.preweddingVideoUrl || undefined,
          fotoPenutup: settingsForm.fotoPenutup || undefined,
          tanggalAkadISO: settingsForm.tanggalAkadISO
            ? settingsForm.tanggalAkadISO.length === 16
              ? `${settingsForm.tanggalAkadISO}:00+07:00`
              : settingsForm.tanggalAkadISO
            : undefined,
          judulPembuka: settingsForm.judulPembuka || undefined,
          catatanCover: settingsForm.catatanCover || undefined,
          monogram: settingsForm.monogram || undefined,
          kutipanPembuka: settingsForm.kutipanPembuka || undefined,
          judulCountdown: settingsForm.judulCountdown || undefined,
          judulGaleri: settingsForm.judulGaleri || undefined,
          judulKisah: settingsForm.judulKisah || undefined,
          judulKado: settingsForm.judulKado || undefined,
          subjudulKado: settingsForm.subjudulKado || undefined,
          judulRsvp: settingsForm.judulRsvp || undefined,
          subjudulRsvp: settingsForm.subjudulRsvp || undefined,
          judulPenutup: settingsForm.judulPenutup || undefined,
          subjudulPenutup: settingsForm.subjudulPenutup || undefined,
          tandaTanganPenutup: settingsForm.tandaTanganPenutup || undefined,
          footerText: settingsForm.footerText || undefined,
          showDresscode: Boolean(settingsForm.showDresscode),
          judulDresscode: settingsForm.judulDresscode || undefined,
          dresscodeText: settingsForm.dresscodeText || undefined,
          dresscodeColors:
            Array.isArray(settingsForm.dresscodeColors) && settingsForm.dresscodeColors.length > 0
              ? settingsForm.dresscodeColors
              : undefined,
          giftConfirmText: settingsForm.giftConfirmText || undefined,
          giftWa1Name: settingsForm.giftWa1Name || undefined,
          giftWa1Phone: settingsForm.giftWa1Phone || undefined,
          giftWa2Name: settingsForm.giftWa2Name || undefined,
          giftWa2Phone: settingsForm.giftWa2Phone || undefined,
          seatPlanImage: settingsForm.seatPlanImage || undefined,
          seatPlanTitle: settingsForm.seatPlanTitle || undefined,
          seatPlanCaption: settingsForm.seatPlanCaption || undefined,
          fotoPria: fotoPria || undefined,
          fotoWanita: fotoWanita || undefined,
          fotoCover: fotoCover || undefined,
          fotoWhatsapp: fotoWhatsapp || fotoCover || undefined,
          templateOverrides: {
            ...existingOverrides,
            [activeTemplateCode]: currentTemplateOverride,
          },
        },
      };

      await invitationService.update(invitationId, payload);
      toast.success('Pengaturan & konten undangan berhasil disimpan!');
      const updated = await invitationService.getById(invitationId);
      setInvitation(updated.data);
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error(err.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Spinner size="lg" label="Memuat data undangan client..." />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500">Undangan client tidak ditemukan.</p>
        <Button variant="outline" onClick={onBack}>
          Kembali ke Daftar Undangan
        </Button>
      </div>
    );
  }

  const selectedGuestForPreview =
    guests.find((g) => g.id.toString() === selectedPreviewGuestId) ||
    (guests.length > 0 ? guests[0] : null);

  // Table columns for Guests
  const guestColumns = [
    {
      key: 'name',
      header: 'Nama Tamu',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{val}</span>
            <Badge variant={row.category === 'VIP' ? 'primary' : 'default'} size="sm" dot>
              {row.category}
            </Badge>
          </div>
          <span className="text-xs text-slate-400 block mt-0.5">
            {row.pax} Kursi (Pax) {row.phone_number ? `• WA: ${row.phone_number}` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'qr_link',
      header: 'Link QR Code Check-In (Eksternal / Tamuva)',
      render: (link) => (
        <div className="flex items-center gap-1.5 max-w-sm">
          <span className="text-xs font-mono text-slate-600 truncate max-w-[220px]" title={link}>
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
                className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka Link Check-In"
                className="p-1 text-indigo-600 hover:text-indigo-800 rounded transition-colors"
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
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          className="text-xs py-1 px-2.5 gap-1.5"
          onClick={() => setSelectedGuestQr(row)}
        >
          <QrCode className="w-3.5 h-3.5 text-indigo-600" />
          <span>Lihat QR</span>
        </Button>
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
            onClick={() => setPreviewGuestInModal(row)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Salin Pesan Undangan WhatsApp"
            onClick={() => handleCopyShareText(row)}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            <Share2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Salin Link Undangan Saja"
            onClick={() => handleCopyOnlyLink(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Link2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Edit Data Tamu"
            onClick={() => handleOpenEditGuest(row)}
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
      {/* Top Breadcrumb & Return Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={onBack}
            className="text-slate-600"
          >
            Semua Undangan
          </Button>
          <div className="h-4 w-px bg-slate-300" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {invitation.client_name}
              </h1>
              <Badge variant="primary" size="sm">
                {invitation.template?.name || 'Template'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Link Publik:</span>
              <a
                href={`${window.location.origin}/invitation/${invitation.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                /invitation/{invitation.slug}
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/invitation/${invitation.slug}`);
                  toast.success('Link undangan publik berhasil disalin!');
                }}
                className="text-slate-400 hover:text-slate-600"
                title="Salin Link Publik"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={Sparkles}
            className="bg-amber-600 hover:bg-amber-700 text-white border-0"
            onClick={() => handleSwitchTab('preview')}
          >
            Live Preview Undangan
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          type="button"
          onClick={() => handleSwitchTab('guests')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'guests'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Tamu & QR Code</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-100 text-slate-700 font-semibold">
            {guests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('rsvps')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'rsvps'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Buku Tamu & RSVP</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-100 text-slate-700 font-semibold">
            {rsvps.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan & Konten Template</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('preview')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'preview'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Live Preview Undangan</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: DAFTAR TAMU & QR CODE
         ======================================================== */}
      {activeTab === 'guests' && (
        <div className="space-y-6 animate-in fade-in-0 duration-150">
          {/* Guest Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Tamu</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{guestStats.total}</p>
            </Card>
            <Card className="p-4 border-amber-200 bg-amber-50/30">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-amber-800 uppercase">Tamu VIP</p>
                <Crown className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-900 mt-1">{guestStats.vip}</p>
            </Card>
            <Card className="p-4 border-indigo-200 bg-indigo-50/30">
              <p className="text-[11px] font-semibold text-indigo-800 uppercase">Tamu Reguler</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{guestStats.reguler}</p>
            </Card>
            <Card className="p-4 border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Kursi (Pax)</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{guestStats.totalPax}</p>
            </Card>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Select
                placeholder="Semua Kategori Tamu"
                options={[
                  { value: '', label: 'Semua Kategori' },
                  { value: 'VVIP', label: 'Tamu VVIP' },
                  { value: 'VIP', label: 'Tamu VIP' },
                  { value: 'Reguler', label: 'Tamu Reguler' },
                  { value: 'Grup', label: 'Tamu Grup' },
                ]}
                value={filterGuestCategory}
                onChange={setFilterGuestCategory}
                className="w-44"
              />

              {selectedGuestIds.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-semibold text-rose-700">
                    {selectedGuestIds.length} dipilih
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={Trash2}
                    isLoading={isDeletingGuests}
                    onClick={handleBulkDeleteGuests}
                    className="text-xs py-1 px-2.5"
                  >
                    Hapus Terpilih
                  </Button>
                  <button
                    type="button"
                    onClick={() => setSelectedGuestIds([])}
                    className="text-xs text-slate-500 hover:text-slate-700 px-1"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {guests.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={Trash2}
                  isLoading={isDeletingGuests}
                  onClick={handleDeleteAllGuests}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Hapus Semua ({guestStats.total || guests.length})
                </Button>
              )}

              {/* Download Excel Template */}
              <Button
                variant="outline"
                size="sm"
                leftIcon={Download}
                onClick={handleDownloadTemplate}
              >
                Unduh Format Excel
              </Button>

              {/* Upload Excel */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                leftIcon={Upload}
                onClick={() => fileInputRef.current?.click()}
              >
                Import dari Excel
              </Button>

              {/* Add Single Guest */}
              <Button
                variant="primary"
                size="sm"
                leftIcon={Plus}
                onClick={handleOpenCreateGuest}
              >
                Tambah Tamu
              </Button>
            </div>
          </div>

          {/* Guests DataTable */}
          <DataTable
            columns={guestColumns}
            data={guests}
            isLoading={isGuestsLoading}
            selectable={true}
            selectedRows={selectedGuestIds}
            onSelectRows={setSelectedGuestIds}
            searchPlaceholder="Cari nama tamu undangan..."
            emptyMessage="Belum ada data tamu pada undangan client ini. Silakan import dari file Excel atau tambah manual."
          />
        </div>
      )}

      {/* ========================================================
          TAB 2: BUKU TAMU & RSVP
         ======================================================== */}
      {activeTab === 'rsvps' && (
        <div className="space-y-6 animate-in fade-in-0 duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Ucapan</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{rsvps.length}</p>
            </Card>
            <Card className="p-4 border-emerald-200 bg-emerald-50/30">
              <p className="text-[11px] font-semibold text-emerald-800 uppercase">Konfirmasi Hadir</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">
                {rsvps.filter((r) => r.attendance_status === 'Hadir').length}
              </p>
            </Card>
            <Card className="p-4 border-rose-200 bg-rose-50/30">
              <p className="text-[11px] font-semibold text-rose-800 uppercase">Berhalangan</p>
              <p className="text-2xl font-bold text-rose-900 mt-1">
                {rsvps.filter((r) => r.attendance_status === 'Tidak Hadir').length}
              </p>
            </Card>
            <Card className="p-4 border-amber-200 bg-amber-50/30">
              <p className="text-[11px] font-semibold text-amber-800 uppercase">Ragu-ragu</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">
                {rsvps.filter((r) => r.attendance_status === 'Ragu-ragu').length}
              </p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Select
                placeholder="Filter Status Kehadiran"
                options={[
                  { value: '', label: 'Semua Status' },
                  { value: 'Hadir', label: 'Pasti Hadir' },
                  { value: 'Tidak Hadir', label: 'Berhalangan' },
                  { value: 'Ragu-ragu', label: 'Ragu-ragu' },
                ]}
                value={filterRsvpStatus}
                onChange={setFilterRsvpStatus}
                className="w-48"
              />

              {selectedRsvpIds.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-semibold text-rose-700">
                    {selectedRsvpIds.length} ucapan dipilih
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={Trash2}
                    isLoading={isDeletingRsvps}
                    onClick={handleBulkDeleteRsvps}
                    className="text-xs py-1 px-2.5"
                  >
                    Hapus Terpilih
                  </Button>
                  <button
                    type="button"
                    onClick={() => setSelectedRsvpIds([])}
                    className="text-xs text-slate-500 hover:text-slate-700 px-1"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>

            {rsvps.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={Trash2}
                  isLoading={isDeletingRsvps}
                  onClick={handleDeleteAllRsvps}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Hapus Semua Ucapan ({rsvps.length})
                </Button>
              </div>
            )}
          </div>

          {/* RSVPs Table */}
          <DataTable
            columns={[
              {
                key: 'guest_name',
                header: 'Nama Tamu',
                sortable: true,
                render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
              },
              {
                key: 'attendance_status',
                header: 'Konfirmasi',
                sortable: true,
                render: (status) => (
                  <Badge
                    variant={
                      status === 'Hadir'
                        ? 'success'
                        : status === 'Tidak Hadir'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {status}
                  </Badge>
                ),
              },
              {
                key: 'message',
                header: 'Pesan & Doa Restu',
                render: (msg) => (
                  <p className="text-xs text-slate-600 italic line-clamp-2">"{msg || '-'}"</p>
                ),
              },
              {
                key: 'created_at',
                header: 'Waktu Kirim',
                sortable: true,
                render: (dt) => (
                  <span className="text-xs text-slate-400">
                    {new Date(dt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: 'Aksi',
                align: 'right',
                render: (_, row) => (
                  <Button
                    size="sm"
                    variant="ghost"
                    title="Hapus Ucapan"
                    onClick={async () => {
                      if (!window.confirm('Hapus ucapan ini?')) return;
                      await rsvpService.delete(row.id);
                      toast.success('Ucapan berhasil dihapus.');
                      loadRsvps();
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  </Button>
                ),
              },
            ]}
            data={rsvps}
            isLoading={isRsvpsLoading}
            selectable={true}
            selectedRows={selectedRsvpIds}
            onSelectRows={setSelectedRsvpIds}
            searchPlaceholder="Cari nama tamu atau ucapan..."
            emptyMessage="Belum ada ucapan doa restu dari tamu untuk undangan ini."
          />
        </div>
      )}

      {/* ========================================================
          TAB 3: PENGATURAN & KONTEN TEMPLATE
         ======================================================== */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in-0 duration-150">
          {/* Excel Quick Synchronization Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-slate-50 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Sinkronisasi Data Undangan lewat Excel
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Ekspor data undangan client saat ini ke file Excel, atau impor file Excel client yang telah terisi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="file"
                ref={excelSettingsFileInputRef}
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleImportInvitationExcel}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={Download}
                onClick={handleExportInvitationExcel}
                className="border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50 shadow-2xs text-xs font-semibold"
                title="Download data undangan ini ke file Excel"
              >
                Export Excel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                leftIcon={Upload}
                onClick={() => excelSettingsFileInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs text-xs font-semibold"
                title="Unggah file Excel yang telah diisi client untuk mengisi form"
              >
                Import Excel
              </Button>
            </div>
          </div>

          {/* Template & Slug Card */}
          <Card className="p-6 border-slate-200 space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Template &amp; Akses Undangan
            </h3>

            {/* Jenis Acara Dinamis */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Jenis Acara Undangan
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { id: 'wedding', label: 'Pernikahan', sub: '2 Mempelai • Akad & Resepsi', defaultAkad: 'Akad Nikah' },
                  { id: 'engagement', label: 'Lamaran / Tunangan', sub: '2 Pasangan • Acara Lamaran', defaultAkad: 'Acara Lamaran' },
                  { id: 'birthday', label: 'Ulang Tahun', sub: '1 Tokoh • Birthday Party', defaultAkad: 'Birthday Party' },
                  { id: 'event', label: 'Acara Umum / Event', sub: 'Gathering / Syukuran / Aqiqah', defaultAkad: 'Acara Utama' },
                ].map((opt) => {
                  const active = (settingsForm.eventType || 'wedding') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        const defaultTitles = ['Akad Nikah', 'Acara Lamaran', 'Birthday Party', 'Acara Utama', ''];
                        setSettingsForm((prev) => ({
                          ...prev,
                          eventType: opt.id,
                          showSecondEvent: opt.id === 'wedding',
                          akadJudul: defaultTitles.includes(prev.akadJudul)
                            ? opt.defaultAkad
                            : prev.akadJudul,
                        }));
                      }}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600 text-indigo-950'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10.5px] text-slate-500 mt-0.5">{opt.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
                const catLabels = {
                  wedding: 'Wedding',
                  engagement: 'Lamaran',
                  birthday: 'Ulang Tahun',
                  event: 'Acara Umum',
                  all: 'Multi-Acara',
                };
                const activeEventType = settingsForm.eventType || 'wedding';
                const getTmplCat = (t) =>
                  (
                    t?.default_content_json?.templateEventType ||
                    t?.default_content_json?.eventType ||
                    'wedding'
                  ).toLowerCase();

                const matchingTemplates = templates.filter((t) => {
                  const c = getTmplCat(t);
                  return c === activeEventType || c === 'all';
                });
                const hasDedicated = matchingTemplates.length > 0;
                const filteredPool =
                  showAllTemplates || !hasDedicated
                    ? templates
                    : templates.filter((t) => {
                        const c = getTmplCat(t);
                        return (
                          c === activeEventType ||
                          c === 'all' ||
                          t.id.toString() === settingsForm.template_id?.toString()
                        );
                      });

                const currentTmpl = templates.find(
                  (t) => t.id.toString() === settingsForm.template_id?.toString()
                );
                const currentTmplCat = currentTmpl ? getTmplCat(currentTmpl) : activeEventType;
                const isMismatch =
                  currentTmpl &&
                  currentTmplCat !== activeEventType &&
                  currentTmplCat !== 'all';

                return (
                  <div className="space-y-1.5">
                    <Select
                      label="Template Undangan"
                      required
                      options={filteredPool.map((t) => ({
                        value: t.id.toString(),
                        label: `[${catLabels[getTmplCat(t)] || 'Wedding'}] ${t.name} (${t.template_code})`,
                      }))}
                      value={settingsForm.template_id}
                      onChange={(val) => {
                        const nextTmpl = templates.find((t) => t.id.toString() === val?.toString());
                        const nextCode = nextTmpl?.template_code;
                        const savedOverrides = nextCode
                          ? invitation?.content_json?.templateOverrides?.[nextCode] || {}
                          : {};
                        const tmplDefaults = nextTmpl?.default_content_json || {};
                        const merged = { ...tmplDefaults, ...savedOverrides };

                        setSettingsForm((prev) => ({
                          ...prev,
                          template_id: val,
                          backgroundVideoUrl: merged.backgroundVideoUrl || '',
                          preweddingVideoUrl: merged.preweddingVideoUrl || '',
                          fotoPenutup: merged.fotoPenutup || '',
                          judulPembuka: merged.judulPembuka || '',
                          catatanCover: merged.catatanCover || '',
                          monogram: merged.monogram || '',
                          kutipanPembuka: merged.kutipanPembuka || '',
                          salamPembuka: merged.salamPembuka || '',
                          judulCountdown: merged.judulCountdown || '',
                          judulGaleri: merged.judulGaleri || '',
                          judulKisah: merged.judulKisah || '',
                          judulKado: merged.judulKado || '',
                          subjudulKado: merged.subjudulKado || '',
                          judulRsvp: merged.judulRsvp || '',
                          subjudulRsvp: merged.subjudulRsvp || '',
                          judulPenutup: merged.judulPenutup || '',
                          subjudulPenutup: merged.subjudulPenutup || '',
                          tandaTanganPenutup: merged.tandaTanganPenutup || '',
                          footerText: merged.footerText || '',
                          showDresscode:
                            merged.showDresscode !== undefined ? Boolean(merged.showDresscode) : true,
                          judulDresscode: merged.judulDresscode || '',
                          dresscodeText: merged.dresscodeText || '',
                          dresscodeColors:
                            Array.isArray(merged.dresscodeColors) && merged.dresscodeColors.length > 0
                              ? merged.dresscodeColors
                              : ['#fdf9f6', '#a96d79', '#68333e'],
                          giftConfirmText: merged.giftConfirmText || '',
                          giftWa1Name: merged.giftWa1Name || '',
                          giftWa1Phone: merged.giftWa1Phone || '',
                          giftWa2Name: merged.giftWa2Name || '',
                          giftWa2Phone: merged.giftWa2Phone || '',
                        }));
                      }}
                      helperText={
                        isMismatch && hasDedicated
                          ? `Template saat ini dikategorikan [${catLabels[currentTmplCat] || currentTmplCat}]. Tersedia template khusus [${catLabels[activeEventType] || activeEventType}] yang dapat dipilih.`
                          : !hasDedicated
                            ? `Belum ada template khusus kategori [${catLabels[activeEventType] || activeEventType}] — menampilkan semua template.`
                            : undefined
                      }
                    />
                    {hasDedicated && templates.length > matchingTemplates.length && (
                      <button
                        type="button"
                        onClick={() => setShowAllTemplates((prev) => !prev)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        {showAllTemplates
                          ? `Filter khusus [${catLabels[activeEventType] || activeEventType}] saja`
                          : `Tampilkan semua kategori template (${templates.length})`}
                      </button>
                    )}
                  </div>
                );
              })()}

              <Input
                label="Nama Catatan Client (Internal)"
                required
                value={settingsForm.client_name}
                onChange={(e) => setSettingsForm({ ...settingsForm, client_name: e.target.value })}
              />

              <Input
                label="Slug URL Undangan"
                required
                helperText="Akan diakses di /invitation/[slug]"
                value={settingsForm.slug}
                onChange={(e) => setSettingsForm({ ...settingsForm, slug: e.target.value })}
              />

              <Input
                label="Masa Aktif Undangan (Opsional)"
                type="date"
                helperText="Biarkan kosong jika undangan aktif selamanya"
                value={settingsForm.expired_at}
                onChange={(e) => setSettingsForm({ ...settingsForm, expired_at: e.target.value })}
              />
            </div>
          </Card>

          {/* Pengaturan Fitur & Keamanan Undangan */}
          <Card className="p-5 border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Fitur & Keamanan Undangan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi interaktivitas dan tingkat privasi akses untuk tamu undangan Anda.
              </p>
            </div>

            <div className="space-y-3">
              {/* Floater QR Check-In */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-orange-50/30 to-slate-50 border border-amber-200/70">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/25 mt-0.5 shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        Barcode / QR Code Check-In Tamu
                      </h4>
                      <Badge variant={settingsForm.showQrCheckin ? 'success' : 'neutral'} size="sm" dot>
                        {settingsForm.showQrCheckin ? 'Aktif' : 'Disembunyikan'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                      Jika diaktifkan, undangan akan menampilkan Barcode / QR Code Check-In (baik kartu QR di dalam halaman, tombol QR, maupun floater bookmark di samping layar). Jika dinonaktifkan, seluruh elemen QR Code di semua template akan disembunyikan.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 pt-1 sm:pt-0 pl-11 sm:pl-0">
                  <Switch
                    checked={settingsForm.showQrCheckin}
                    onChange={(val) => setSettingsForm({ ...settingsForm, showQrCheckin: val })}
                    label={settingsForm.showQrCheckin ? 'Aktif' : 'Nonaktif'}
                  />
                </div>
              </div>

              {/* Lock Guest List / Kunci Akses Undangan */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/30 to-slate-50 border border-emerald-200/70">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 mt-0.5 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        Kunci Akses Undangan (Hanya Tamu Terdaftar)
                      </h4>
                      <Badge variant={settingsForm.lockGuestList ? 'success' : 'neutral'} size="sm" dot>
                        {settingsForm.lockGuestList ? 'Terkunci / Privat' : 'Terbuka'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                      Jika diaktifkan, hanya tamu yang terdaftar di daftar tamu resmi yang dapat membuka undangan. Ini mencegah siapapun mengubah parameter tautan (<code className="text-[11px] bg-slate-200/80 px-1 py-0.5 rounded text-slate-800 font-mono">?to=NamaLain</code>) dengan nama yang tidak diundang.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 pt-1 sm:pt-0 pl-11 sm:pl-0">
                  <Switch
                    checked={settingsForm.lockGuestList}
                    onChange={(val) => setSettingsForm({ ...settingsForm, lockGuestList: val })}
                    label={settingsForm.lockGuestList ? 'Terkunci' : 'Terbuka'}
                  />
                </div>
              </div>

              {/* Tampilkan Section Amplop Digital / Transfer Rekening */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/30 to-slate-50 border border-indigo-200/70">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-700 border border-indigo-500/25 mt-0.5 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        Section Amplop Digital / Transfer Rekening
                      </h4>
                      <Badge variant={settingsForm.showDonation ? 'success' : 'neutral'} size="sm" dot>
                        {settingsForm.showDonation ? 'Ditampilkan' : 'Disembunyikan'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                      Aktifkan untuk menampilkan bagian transfer rekening bank (amplop digital) bagi tamu yang ingin memberi kado secara cashless.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 pt-1 sm:pt-0 pl-11 sm:pl-0">
                  <Switch
                    checked={settingsForm.showDonation}
                    onChange={(val) => setSettingsForm({ ...settingsForm, showDonation: val })}
                    label={settingsForm.showDonation ? 'Tampil' : 'Sembunyi'}
                  />
                </div>
              </div>

              {/* Tampilkan Section Kirim Kado Fisik */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 via-pink-50/30 to-slate-50 border border-rose-200/70">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-700 border border-rose-500/25 mt-0.5 shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        Section Pengiriman Kado Fisik
                      </h4>
                      <Badge variant={settingsForm.showGift ? 'success' : 'neutral'} size="sm" dot>
                        {settingsForm.showGift ? 'Ditampilkan' : 'Disembunyikan'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                      Aktifkan untuk menampilkan alamat rumah / tujuan kirim kado fisik beserta tombol salin alamat untuk tamu undangan.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 pt-1 sm:pt-0 pl-11 sm:pl-0">
                  <Switch
                    checked={settingsForm.showGift}
                    onChange={(val) => setSettingsForm({ ...settingsForm, showGift: val })}
                    label={settingsForm.showGift ? 'Tampil' : 'Sembunyi'}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Mempelai / Subjek Acara Information */}
          {(() => {
            const evType = settingsForm.eventType || 'wedding';
            const isCouple = evType === 'wedding' || evType === 'engagement';
            const isBirthday = evType === 'birthday';
            const isEvent = evType === 'event';

            return (
              <Card className="p-6 border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                  {evType === 'wedding'
                    ? 'Informasi Pasangan Mempelai'
                    : evType === 'engagement'
                    ? 'Informasi Pasangan Lamaran'
                    : isBirthday
                    ? 'Informasi Tokoh yang Berulang Tahun'
                    : 'Informasi & Penyelenggara Acara'}
                </h3>

                {isCouple ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pria */}
                    <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-indigo-700">
                        {evType === 'engagement' ? 'Calon Mempelai Pria' : 'Mempelai Pria'}
                      </h4>
                      <Input
                        label="Nama Lengkap & Gelar Pria"
                        placeholder="Nama lengkap beserta gelar"
                        value={settingsForm.mempelaiPria}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mempelaiPria: e.target.value })}
                      />
                      <Input
                        label="Nama Panggilan / Singkat Pria (Tampil di Cover & Judul)"
                        placeholder="Contoh: Fajar"
                        value={settingsForm.panggilanPria}
                        onChange={(e) => setSettingsForm({ ...settingsForm, panggilanPria: e.target.value })}
                        helperText="Jika dikosongkan, otomatis menggunakan kata pertama dari nama lengkap"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Anak Ke- (Pria)"
                          placeholder="Contoh: Putra Pertama"
                          value={settingsForm.anakKePria}
                          onChange={(e) => setSettingsForm({ ...settingsForm, anakKePria: e.target.value })}
                        />
                        <Input
                          label="Username Instagram Pria"
                          placeholder="Contoh: pratamabril"
                          value={settingsForm.instagramPria}
                          onChange={(e) => setSettingsForm({ ...settingsForm, instagramPria: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Nama Ayah"
                          placeholder="Nama ayah"
                          value={settingsForm.ayahPria}
                          onChange={(e) => setSettingsForm({ ...settingsForm, ayahPria: e.target.value })}
                        />
                        <Input
                          label="Nama Ibu"
                          placeholder="Nama ibu"
                          value={settingsForm.ibuPria}
                          onChange={(e) => setSettingsForm({ ...settingsForm, ibuPria: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Wanita */}
                    <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-rose-700">
                        {evType === 'engagement' ? 'Calon Mempelai Wanita' : 'Mempelai Wanita'}
                      </h4>
                      <Input
                        label="Nama Lengkap & Gelar Wanita"
                        placeholder="Nama lengkap beserta gelar"
                        value={settingsForm.mempelaiWanita}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mempelaiWanita: e.target.value })}
                      />
                      <Input
                        label="Nama Panggilan / Singkat Wanita (Tampil di Cover & Judul)"
                        placeholder="Contoh: Aminah"
                        value={settingsForm.panggilanWanita}
                        onChange={(e) => setSettingsForm({ ...settingsForm, panggilanWanita: e.target.value })}
                        helperText="Jika dikosongkan, otomatis menggunakan kata pertama dari nama lengkap"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Anak Ke- (Wanita)"
                          placeholder="Contoh: Putri Ketiga"
                          value={settingsForm.anakKeWanita}
                          onChange={(e) => setSettingsForm({ ...settingsForm, anakKeWanita: e.target.value })}
                        />
                        <Input
                          label="Username Instagram Wanita"
                          placeholder="Contoh: chusniilaili"
                          value={settingsForm.instagramWanita}
                          onChange={(e) => setSettingsForm({ ...settingsForm, instagramWanita: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Nama Ayah"
                          placeholder="Nama ayah"
                          value={settingsForm.ayahWanita}
                          onChange={(e) => setSettingsForm({ ...settingsForm, ayahWanita: e.target.value })}
                        />
                        <Input
                          label="Nama Ibu"
                          placeholder="Nama ibu"
                          value={settingsForm.ibuWanita}
                          onChange={(e) => setSettingsForm({ ...settingsForm, ibuWanita: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-indigo-700">
                      {isBirthday ? 'Profil Ulang Tahun' : 'Detail Acara & Penyelenggara'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label={isBirthday ? 'Nama Lengkap yang Berulang Tahun' : 'Nama Lengkap Acara'}
                        placeholder={isBirthday ? 'Contoh: Clara Putri Maharani' : 'Contoh: Annual Gala Dinner 2026'}
                        value={settingsForm.mempelaiPria}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mempelaiPria: e.target.value })}
                      />
                      <Input
                        label={
                          isBirthday
                            ? 'Nama Panggilan / Tampil di Cover'
                            : 'Judul Singkat di Cover (Misal: Gala Dinner 2026)'
                        }
                        placeholder={isBirthday ? 'Contoh: Clara' : 'Contoh: Gala Dinner 2026'}
                        value={settingsForm.panggilanPria}
                        onChange={(e) => setSettingsForm({ ...settingsForm, panggilanPria: e.target.value })}
                        helperText="Jika dikosongkan, otomatis menggunakan kata pertama dari nama lengkap"
                      />
                      <Input
                        label={
                          isBirthday
                            ? 'Ulang Tahun Ke- / Tema Usia (Misal: Sweet 17th / 1st Birthday)'
                            : 'Kategori / Subjudul Acara (Misal: Corporate Gathering / Aqiqah)'
                        }
                        placeholder={isBirthday ? 'Contoh: Sweet 17th Birthday' : 'Contoh: Corporate Gathering'}
                        value={settingsForm.anakKePria}
                        onChange={(e) => setSettingsForm({ ...settingsForm, anakKePria: e.target.value })}
                      />
                      <Input
                        label={isBirthday ? 'Username Instagram' : 'Username Instagram Acara / Host'}
                        placeholder="Contoh: claraputri"
                        value={settingsForm.instagramPria}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramPria: e.target.value })}
                      />
                      <Input
                        label={isBirthday ? 'Nama Ayah / Host 1' : 'Penyelenggara Utama / Host 1'}
                        placeholder={isBirthday ? 'Nama ayah / orang tua 1' : 'Nama penyelenggara / lembaga'}
                        value={settingsForm.ayahPria}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ayahPria: e.target.value })}
                      />
                      <Input
                        label={isBirthday ? 'Nama Ibu / Host 2' : 'Co-Host / Penyelenggara 2 (Opsional)'}
                        placeholder={isBirthday ? 'Nama ibu / orang tua 2' : 'Panitia / Co-Host'}
                        value={settingsForm.ibuPria}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ibuPria: e.target.value })}
                      />
                    </div>
                  </div>
                )}

            <div className="space-y-4 pt-2 border-t border-slate-100">
              <Input
                label="Ayat Suci / Kutipan Pembuka"
                value={settingsForm.ayat}
                onChange={(e) => setSettingsForm({ ...settingsForm, ayat: e.target.value })}
              />

              <Textarea
                label="Teks Sambutan / Salam Pembuka (Opsional)"
                rows={2}
                placeholder="Dengan penuh rasa syukur dan bahagia, kami mengundang Bapak/Ibu/Saudara/i untuk hadir..."
                value={settingsForm.salamPembuka}
                onChange={(e) => setSettingsForm({ ...settingsForm, salamPembuka: e.target.value })}
                helperText="Ditampilkan pada bagian pembuka setelah cover undangan (misal pada tema Noir Velvet Motion)"
              />

              <Textarea
                label="Kutipan Pembuka / Quote Filosofis (Opsional)"
                rows={2}
                placeholder='"Setiap pertemuan memiliki maknanya dan setiap perjalanan memiliki tujuannya..."'
                value={settingsForm.kutipanPembuka}
                onChange={(e) => setSettingsForm({ ...settingsForm, kutipanPembuka: e.target.value })}
                helperText="Jika diisi, akan menggantikan kutipan default di section pembuka"
              />

              <Textarea
                label="Teks Ucapan Penutup (Bagian Paling Bawah Undangan)"
                rows={3}
                placeholder="Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu..."
                value={settingsForm.teksPenutup}
                onChange={(e) => setSettingsForm({ ...settingsForm, teksPenutup: e.target.value })}
                helperText="Ditampilkan pada bagian penutup (closing) di bagian paling bawah undangan"
              />

              <Input
                label="Salam Penutup (Opsional)"
                placeholder="Wassalamu'alaikum Warahmatullahi Wabarakatuh"
                value={settingsForm.salamPenutup}
                onChange={(e) => setSettingsForm({ ...settingsForm, salamPenutup: e.target.value })}
                helperText="Kosongkan jika tidak ingin menampilkan kalimat salam penutup"
              />
            </div>
          </Card>
            );
          })()}

          {/* Agenda Acara */}
          <Card className="p-6 border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Rangkaian Acara
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Acara 1 */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-700">
                  Acara Pertama / Utama
                </h4>
                <Input
                  label="Judul Acara 1"
                  placeholder="Contoh: Akad Nikah / Acara Lamaran / Birthday Party"
                  value={settingsForm.akadJudul}
                  onChange={(e) => setSettingsForm({ ...settingsForm, akadJudul: e.target.value })}
                />
                <Input
                  label="Tanggal Acara 1"
                  placeholder="Minggu, 15 November 2026"
                  value={settingsForm.akadTanggal}
                  onChange={(e) => setSettingsForm({ ...settingsForm, akadTanggal: e.target.value })}
                />
                <Input
                  label="Waktu Acara 1"
                  placeholder="08:00 - 10:00 WIB"
                  value={settingsForm.akadWaktu}
                  onChange={(e) => setSettingsForm({ ...settingsForm, akadWaktu: e.target.value })}
                />
                <Input
                  label="Nama Tempat / Gedung Acara 1"
                  placeholder="Masjid Agung Al-Akbar Surabaya"
                  value={settingsForm.akadLokasi}
                  onChange={(e) => setSettingsForm({ ...settingsForm, akadLokasi: e.target.value })}
                />
                <Textarea
                  label="Alamat Lengkap Acara 1"
                  rows={2}
                  placeholder="Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya"
                  value={settingsForm.akadAlamat}
                  onChange={(e) => setSettingsForm({ ...settingsForm, akadAlamat: e.target.value })}
                />
                <Input
                  label="Link Google Maps Acara 1"
                  placeholder="https://maps.google.com/?q=..."
                  value={settingsForm.akadMapUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, akadMapUrl: e.target.value })}
                />
              </div>

              {/* Acara 2 (Opsional) */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-700">
                    Acara Kedua (Opsional)
                  </h4>
                  <Switch
                    checked={settingsForm.showSecondEvent}
                    onChange={(val) => setSettingsForm({ ...settingsForm, showSecondEvent: val })}
                    label={settingsForm.showSecondEvent ? 'Tampilkan Sesi / Acara Kedua' : 'Disembunyikan'}
                  />
                </div>
                {!settingsForm.showSecondEvent ? (
                  <div className="p-4 rounded-xl bg-white border border-dashed border-slate-300 text-xs text-slate-600 leading-relaxed">
                    Sesi/acara kedua sedang <strong>disembunyikan</strong>. Undangan hanya akan menampilkan 1 acara utama saja (cocok untuk Lamaran, Ulang Tahun, atau Event tunggal). Aktifkan switch di atas jika ingin menambahkan sesi kedua.
                  </div>
                ) : (
                  <>
                    <Input
                      label="Judul Acara 2"
                      placeholder="Contoh: Resepsi / Ramah Tamah / After Party"
                      value={settingsForm.resepsiJudul}
                      onChange={(e) => setSettingsForm({ ...settingsForm, resepsiJudul: e.target.value })}
                    />
                    <Input
                      label="Tanggal Acara 2"
                      placeholder="Minggu, 15 November 2026"
                      value={settingsForm.resepsiTanggal}
                      onChange={(e) => setSettingsForm({ ...settingsForm, resepsiTanggal: e.target.value })}
                    />
                    <Input
                      label="Waktu Acara 2"
                      placeholder="11:00 - 14:00 WIB"
                      value={settingsForm.resepsiWaktu}
                      onChange={(e) => setSettingsForm({ ...settingsForm, resepsiWaktu: e.target.value })}
                    />
                    <Input
                      label="Nama Tempat / Gedung Acara 2"
                      placeholder="Grand Ballroom Hotel Majapahit, Surabaya"
                      value={settingsForm.resepsiLokasi}
                      onChange={(e) => setSettingsForm({ ...settingsForm, resepsiLokasi: e.target.value })}
                    />
                    <Textarea
                      label="Alamat Lengkap Acara 2"
                      rows={2}
                      placeholder="Jl. Tunjungan No.65, Genteng, Surabaya"
                      value={settingsForm.resepsiAlamat}
                      onChange={(e) => setSettingsForm({ ...settingsForm, resepsiAlamat: e.target.value })}
                    />
                    <Input
                      label="Link Google Maps Acara 2"
                      placeholder="https://maps.google.com/?q=..."
                      value={settingsForm.resepsiMapUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, resepsiMapUrl: e.target.value })}
                    />
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Pengaturan Amplop Digital & Kado Fisik */}
          <Card className="p-6 border-slate-200 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-600" />
                Amplop Digital & Pengiriman Kado Fisik
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola nomor rekening bank untuk amplop digital serta alamat rumah untuk pengiriman kado fisik dari tamu undangan.
              </p>
            </div>

            {/* Amplop Digital (Rekening Bank) */}
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Daftar Rekening Bank (Amplop Digital)
                  </span>
                  <Badge variant={settingsForm.showDonation ? 'success' : 'neutral'} size="sm" dot>
                    {settingsForm.showDonation ? 'Section Aktif' : 'Disembunyikan'}
                  </Badge>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={Plus}
                  onClick={handleAddBankAccount}
                  className="text-xs self-start sm:self-auto"
                >
                  Tambah Rekening
                </Button>
              </div>

              {bankAccounts.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Belum ada rekening bank yang ditambahkan.
                </p>
              ) : (
                <div className="space-y-3">
                  {bankAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white rounded-xl border border-slate-200"
                    >
                      <div className="w-full sm:w-1/4">
                        <Input
                          placeholder="Bank (BCA/BSI/Mandiri)"
                          value={account.bank || ''}
                          onChange={(e) =>
                            handleBankAccountChange(index, 'bank', e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full sm:w-2/5">
                        <Input
                          placeholder="Nomor Rekening"
                          value={account.nomor || ''}
                          onChange={(e) =>
                            handleBankAccountChange(index, 'nomor', e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full sm:w-2/5">
                        <Input
                          placeholder="Atas Nama Pemilik"
                          value={account.nama || ''}
                          onChange={(e) =>
                            handleBankAccountChange(index, 'nama', e.target.value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBankAccount(index)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg self-end sm:self-center"
                        title="Hapus baris rekening ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alamat Pengiriman Kado Fisik */}
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Alamat Kirim Kado Fisik
                  </span>
                  <Badge variant={settingsForm.showGift ? 'success' : 'neutral'} size="sm" dot>
                    {settingsForm.showGift ? 'Section Aktif' : 'Disembunyikan'}
                  </Badge>
                </div>
              </div>

              <Input
                label="Nama Penerima Kado (Opsional)"
                placeholder="Contoh: Chusni Nurlaili"
                value={settingsForm.penerimaKado || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, penerimaKado: e.target.value })
                }
              />

              <Textarea
                rows={3}
                placeholder="Contoh: Perumahan Graha Asri Blok C No. 12, Jambangan, Surabaya (Penerima: Fajar / 081234567890)"
                value={settingsForm.alamatKado || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, alamatKado: e.target.value })
                }
                helperText="Alamat ini akan ditampilkan di section kado fisik template agar tamu dapat mengirim hadiah langsung ke lokasi pengantin."
              />

              {/* Kontak Konfirmasi WhatsApp Kado Fisik (Drapery Pink & Template lainnya) */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <p className="text-xs font-semibold text-slate-700">
                  Kontak Konfirmasi Kado via WhatsApp (Opsional / Khusus Tema Drapery Pink):
                </p>
                <Textarea
                  label="Teks Pengantar Konfirmasi Kado Fisik"
                  rows={2}
                  placeholder="Apabila Bapak/Ibu/Saudara/i berkenan mengirimkan tanda kasih berupa kado fisik, silakan melakukan konfirmasi pengiriman melalui kontak mempelai di bawah ini:"
                  value={settingsForm.giftConfirmText || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, giftConfirmText: e.target.value })
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Nama Kontak WA 1 (Mempelai Wanita)"
                    placeholder="Contoh: Chusni Nurlaili"
                    value={settingsForm.giftWa1Name || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, giftWa1Name: e.target.value })
                    }
                  />
                  <Input
                    label="Nomor WhatsApp 1"
                    placeholder="Contoh: 0857-1234-5678"
                    value={settingsForm.giftWa1Phone || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, giftWa1Phone: e.target.value })
                    }
                  />
                  <Input
                    label="Nama Kontak WA 2 (Mempelai Pria)"
                    placeholder="Contoh: Brilian Pratama"
                    value={settingsForm.giftWa2Name || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, giftWa2Name: e.target.value })
                    }
                  />
                  <Input
                    label="Nomor WhatsApp 2"
                    placeholder="Contoh: 0812-3456-7890"
                    value={settingsForm.giftWa2Phone || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, giftWa2Phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Pengaturan Dress Code & Palet Warna (Khusus Tema Drapery Pink & Tema Pendukung) */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-rose-600" />
                  Dress Code &amp; Palet Warna Tamu (Opsional)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur panduan busana dan warna pakaian untuk tamu undangan (tampil otomatis di template seperti Drapery Pink).
                </p>
              </div>
              <Switch
                checked={settingsForm.showDresscode}
                onChange={(val) => setSettingsForm({ ...settingsForm, showDresscode: val })}
                label={settingsForm.showDresscode ? 'Ditampilkan' : 'Disembunyikan'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Judul Section Dress Code"
                placeholder="Dress Code"
                value={settingsForm.judulDresscode || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, judulDresscode: e.target.value })
                }
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  3 Palet Warna Busana (Color Swatches)
                </label>
                <div className="flex items-center gap-3">
                  {[0, 1, 2].map((idx) => {
                    const currentColors = Array.isArray(settingsForm.dresscodeColors)
                      ? settingsForm.dresscodeColors
                      : ['#fdf9f6', '#a96d79', '#68333e'];
                    const colorVal = currentColors[idx] || '#a96d79';
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <input
                          type="color"
                          value={colorVal}
                          onChange={(e) => {
                            const next = [...currentColors];
                            next[idx] = e.target.value;
                            setSettingsForm({ ...settingsForm, dresscodeColors: next });
                          }}
                          className="w-7 h-7 rounded-full border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={colorVal}
                          onChange={(e) => {
                            const next = [...currentColors];
                            next[idx] = e.target.value;
                            setSettingsForm({ ...settingsForm, dresscodeColors: next });
                          }}
                          className="w-18 text-xs font-mono text-slate-700 bg-transparent focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <Textarea
              label="Deskripsi Panduan Dress Code"
              rows={2}
              placeholder="Kami dengan hormat menganjurkan para tamu kami untuk mengenakan warna-warna ini untuk hari istimewa kami."
              value={settingsForm.dresscodeText || ''}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, dresscodeText: e.target.value })
              }
            />
          </Card>

          {/* Kisah Kasih / Love Story Timeline (Customizable) */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  Kisah Kasih / Love Story (Timeline Cerita)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesuaikan kisah perjalanan cinta kedua mempelai. Hapus semua jika tidak ingin menampilkan bagian kisah di undangan.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={Plus}
                onClick={handleAddStory}
                className="self-start sm:self-auto text-xs"
              >
                Tambah Momen
              </Button>
            </div>

            {loveStories.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-500">
                  Belum ada kisah cinta yang ditambahkan. Bagian ini akan disembunyikan di template undangan.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={Plus}
                  onClick={handleAddStory}
                >
                  Tambah Cerita Pertama
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {loveStories.map((story, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                        Momen #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStory(index)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Momen Cerita Ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-1">
                        <Input
                          label="Tahun / Periode"
                          placeholder="Contoh: 2021"
                          value={story.tahun || ''}
                          onChange={(e) => handleUpdateStory(index, 'tahun', e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Input
                          label="Judul Momen"
                          placeholder="Contoh: Awal Pertemuan"
                          value={story.judul || ''}
                          onChange={(e) => handleUpdateStory(index, 'judul', e.target.value)}
                        />
                      </div>
                    </div>

                    <Textarea
                      label="Isi Cerita"
                      rows={2}
                      placeholder="Tuliskan kisah perjalanan cinta Anda..."
                      value={story.cerita || ''}
                      onChange={(e) => handleUpdateStory(index, 'cerita', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Musik Latar Belakang (Customizable & Uploadable) */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Music className="w-4 h-4 text-indigo-600" />
                  Musik Latar Belakang (Background Music)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih lagu pilihan pernikahan romantis atau upload lagu impian Anda sendiri (format .mp3 / .m4a / .wav).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={musicFileInputRef}
                  accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/*"
                  onChange={handleUploadMusicFile}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={Upload}
                  isLoading={isUploadingMusic}
                  onClick={() => musicFileInputRef.current?.click()}
                  className="text-xs"
                >
                  Upload Musik Sendiri
                </Button>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Pilihan Lagu Preset:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MUSIC_PRESETS.map((p, idx) => {
                  const isSelected = musicUrl === p.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setMusicUrl(p.url);
                        setMusicTitle(p.title);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Disc className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-600 animate-spin-slow' : 'text-slate-400'}`} />
                        <span className="truncate">{p.title}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Music Player Preview */}
            {musicUrl ? (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wider">Lagu Terpilih</p>
                    <p className="text-sm font-bold text-slate-900">{musicTitle || 'Custom Audio'}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{musicUrl}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <audio controls src={musicUrl} className="h-8 max-w-[220px]" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMusicUrl('');
                      setMusicTitle('');
                    }}
                    className="text-xs text-rose-600 hover:bg-rose-50"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <Volume2 className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>Belum ada musik latar yang dipilih. Undangan akan dibuka tanpa pemutaran musik otomatis.</span>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
              <FolderArchive className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                File lagu yang diupload otomatis disimpan di direktori server:{' '}
                <code className="px-1.5 py-0.5 bg-white border rounded font-mono text-indigo-600">
                  uploads/{invitation?.slug || 'slug'}/music/
                </code>
              </span>
            </div>
          </Card>

          {/* Foto Sampul & Pasangan Mempelai */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-600" />
                Foto Sampul, Share WhatsApp & Foto Pasangan Mempelai
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload foto cover pembuka, thumbnail khusus share WhatsApp (otomatis mengikuti Foto Cover jika tidak diupload terpisah), serta foto sendiri-sendiri mempelai pria dan wanita.
              </p>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={coverFileInputRef}
              accept="image/*"
              onChange={(e) => handleUploadSinglePhoto(e, 'cover')}
              className="hidden"
            />
            <input
              type="file"
              ref={whatsappFileInputRef}
              accept="image/*"
              onChange={(e) => handleUploadSinglePhoto(e, 'whatsapp')}
              className="hidden"
            />
            <input
              type="file"
              ref={groomFileInputRef}
              accept="image/*"
              onChange={(e) => handleUploadSinglePhoto(e, 'groom')}
              className="hidden"
            />
            <input
              type="file"
              ref={brideFileInputRef}
              accept="image/*"
              onChange={(e) => handleUploadSinglePhoto(e, 'bride')}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Cover Photo */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Foto Cover / Hero
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Tampil di layar pembuka, slide hero atas, dan default share WhatsApp.
                  </p>
                  <div className="w-full h-44 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden relative group">
                    <img
                      src={fotoCover || '/images/defaults/couple-cover.jpg'}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    {fotoCover && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] rounded-full font-medium">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    isLoading={isUploadingCover}
                    leftIcon={Upload}
                    onClick={() => coverFileInputRef.current?.click()}
                  >
                    {fotoCover ? 'Ganti Foto' : 'Upload Foto'}
                  </Button>
                  {fotoCover && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-rose-600"
                      onClick={() => setFotoCover('')}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* WhatsApp Share Thumbnail Photo */}
              <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/80 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Foto Share WhatsApp
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Thumbnail saat link dibagikan di WA (otomatis ambil dari Foto Cover atau custom).
                  </p>
                  <div className="w-full h-44 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden relative group">
                    <img
                      src={
                        fotoWhatsapp ||
                        fotoCover ||
                        '/images/defaults/couple-cover.jpg'
                      }
                      alt="WhatsApp Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 text-white text-[10px] rounded-full font-medium ${
                        fotoWhatsapp ? 'bg-emerald-600' : 'bg-slate-700/85'
                      }`}
                    >
                      {fotoWhatsapp ? 'Custom WA' : 'Dari Foto Cover'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    isLoading={isUploadingWhatsapp}
                    leftIcon={Upload}
                    onClick={() => whatsappFileInputRef.current?.click()}
                  >
                    {fotoWhatsapp ? 'Ganti Foto WA' : 'Custom Foto WA'}
                  </Button>
                  {fotoWhatsapp && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-emerald-700"
                      onClick={() => setFotoWhatsapp('')}
                      title="Gunakan Foto Cover untuk Share WhatsApp"
                    >
                      Pakai Cover
                    </Button>
                  )}
                </div>
              </div>

              {/* Groom Photo */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                    Foto Mempelai Pria
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Tampil khusus di bagian Bride & Groom (foto sendiri).
                  </p>
                  <div className="w-full h-44 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden relative group">
                    <img
                      src={fotoPria || '/images/defaults/groom.jpg'}
                      alt="Groom"
                      className="w-full h-full object-cover"
                    />
                    {fotoPria && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] rounded-full font-medium">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    isLoading={isUploadingGroom}
                    leftIcon={Upload}
                    onClick={() => groomFileInputRef.current?.click()}
                  >
                    {fotoPria ? 'Ganti Foto' : 'Upload Foto'}
                  </Button>
                  {fotoPria && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-rose-600"
                      onClick={() => setFotoPria('')}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Bride Photo */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                    Foto Mempelai Wanita
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Tampil khusus di bagian Bride & Groom (foto sendiri).
                  </p>
                  <div className="w-full h-44 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden relative group">
                    <img
                      src={fotoWanita || '/images/defaults/bride.jpg'}
                      alt="Bride"
                      className="w-full h-full object-cover"
                    />
                    {fotoWanita && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] rounded-full font-medium">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    isLoading={isUploadingBride}
                    leftIcon={Upload}
                    onClick={() => brideFileInputRef.current?.click()}
                  >
                    {fotoWanita ? 'Ganti Foto' : 'Upload Foto'}
                  </Button>
                  {fotoWanita && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-rose-600"
                      onClick={() => setFotoWanita('')}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
              <FolderArchive className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                Foto cover dan mempelai tersimpan di server:{' '}
                <code className="px-1.5 py-0.5 bg-white border rounded font-mono text-indigo-600">
                  uploads/{invitation?.slug || 'slug'}/covers/
                </code>
              </span>
            </div>

            {/* Video Latar, Video Prewedding & Foto Penutup (Custom Upload & URL) */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Media Video &amp; Foto Penutup (Bisa Upload Langsung atau Tempel URL)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload video `.mp4`/`.webm`/`.mov` (maks 100MB) atau tempel tautan YouTube/MP4. Kosongkan untuk menggunakan aset bawaan tema.
                </p>
              </div>

              <input
                type="file"
                ref={bgVideoFileInputRef}
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={(e) => handleUploadVideoFile(e, 'background')}
                className="hidden"
              />
              <input
                type="file"
                ref={prewedVideoFileInputRef}
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={(e) => handleUploadVideoFile(e, 'prewedding')}
                className="hidden"
              />
              <input
                type="file"
                ref={closingFileInputRef}
                accept="image/*"
                onChange={(e) => handleUploadSinglePhoto(e, 'closing')}
                className="hidden"
              />
              <input
                type="file"
                ref={seatPlanFileInputRef}
                accept="image/*"
                onChange={(e) => handleUploadSinglePhoto(e, 'seatplan')}
                className="hidden"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Video Background */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Video Background
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                        {settingsForm.backgroundVideoUrl === 'none'
                          ? 'Nonaktif'
                          : settingsForm.backgroundVideoUrl
                          ? 'Custom'
                          : 'Bawaan'}
                      </span>
                    </div>
                    <Input
                      placeholder="https://.../video-bg.mp4 atau 'none'"
                      value={settingsForm.backgroundVideoUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, backgroundVideoUrl: e.target.value })
                      }
                    />
                    {settingsForm.backgroundVideoUrl && settingsForm.backgroundVideoUrl !== 'none' && (
                      <video
                        src={settingsForm.backgroundVideoUrl}
                        controls
                        muted
                        className="w-full h-28 rounded-xl bg-black object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      isLoading={isUploadingBgVideo}
                      leftIcon={Upload}
                      onClick={() => bgVideoFileInputRef.current?.click()}
                    >
                      Upload Video
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-slate-600"
                      onClick={() =>
                        setSettingsForm({
                          ...settingsForm,
                          backgroundVideoUrl:
                            settingsForm.backgroundVideoUrl === 'none' ? '' : 'none',
                        })
                      }
                    >
                      {settingsForm.backgroundVideoUrl === 'none' ? 'Pakai Bawaan' : 'Matikan Video'}
                    </Button>
                    {settingsForm.backgroundVideoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-rose-600"
                        onClick={() => setSettingsForm({ ...settingsForm, backgroundVideoUrl: '' })}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>

                {/* Video Prewedding (Our Moments) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Video Prewedding (Moments)
                    </h5>
                    <Input
                      placeholder="Upload .mp4 atau link YouTube/Shorts"
                      value={settingsForm.preweddingVideoUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, preweddingVideoUrl: e.target.value })
                      }
                    />
                    {settingsForm.preweddingVideoUrl &&
                      !settingsForm.preweddingVideoUrl.includes('youtube') &&
                      !settingsForm.preweddingVideoUrl.includes('youtu.be') && (
                        <video
                          src={settingsForm.preweddingVideoUrl}
                          controls
                          muted
                          className="w-full h-28 rounded-xl bg-black object-cover"
                        />
                      )}
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      isLoading={isUploadingPrewedVideo}
                      leftIcon={Upload}
                      onClick={() => prewedVideoFileInputRef.current?.click()}
                    >
                      Upload Video
                    </Button>
                    {settingsForm.preweddingVideoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-rose-600"
                        onClick={() => setSettingsForm({ ...settingsForm, preweddingVideoUrl: '' })}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                </div>

                {/* Foto Penutup (Closing) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Foto Penutup (Closing)
                    </h5>
                    <Input
                      placeholder="URL foto penutup atau upload di bawah"
                      value={settingsForm.fotoPenutup || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, fotoPenutup: e.target.value })
                      }
                    />
                    {settingsForm.fotoPenutup && (
                      <div className="w-full h-28 rounded-xl overflow-hidden border border-slate-300 bg-slate-200">
                        <img
                          src={settingsForm.fotoPenutup}
                          alt="Foto Penutup"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      isLoading={isUploadingClosing}
                      leftIcon={Upload}
                      onClick={() => closingFileInputRef.current?.click()}
                    >
                      {settingsForm.fotoPenutup ? 'Ganti Foto' : 'Upload Foto'}
                    </Button>
                    {settingsForm.fotoPenutup && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-rose-600"
                        onClick={() => setSettingsForm({ ...settingsForm, fotoPenutup: '' })}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Denah Tempat Duduk / Seat Plan (Acara Umum / Gala) */}
              <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Denah Tempat Duduk / Seat Plan (Gambar)
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload gambar denah meja atau kursi (PNG/JPG) — tampil di slide bawah setelah informasi acara (misal template Burgundy Gala Envelope).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      isLoading={isUploadingSeatPlan}
                      leftIcon={Upload}
                      onClick={() => seatPlanFileInputRef.current?.click()}
                    >
                      {settingsForm.seatPlanImage ? 'Ganti Gambar Seat Plan' : 'Upload Seat Plan'}
                    </Button>
                    {settingsForm.seatPlanImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-rose-600"
                        onClick={() =>
                          setSettingsForm({ ...settingsForm, seatPlanImage: '' })
                        }
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Judul Bagian Seat Plan (Opsional)"
                    placeholder="Contoh: Seat Plan & Denah Ruangan"
                    value={settingsForm.seatPlanTitle || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, seatPlanTitle: e.target.value })
                    }
                  />
                  <Input
                    label="Keterangan Singkat Seat Plan (Opsional)"
                    placeholder="Contoh: Ketuk gambar untuk memperbesar posisi meja Anda."
                    value={settingsForm.seatPlanCaption || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, seatPlanCaption: e.target.value })
                    }
                  />
                </div>

                {settingsForm.seatPlanImage && (
                  <div className="w-full max-w-md rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                    <img
                      src={settingsForm.seatPlanImage}
                      alt="Preview Seat Plan"
                      className="w-full max-h-56 object-contain mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Kustomisasi Label, Judul Bagian & Countdown Undangan */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                Kustomisasi Judul Bagian, Countdown &amp; Label Tema (Opsional)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ubah seluruh teks judul section, monogram, catatan cover, hingga target waktu countdown. Biarkan kosong untuk memakai teks bawaan tema.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Target Waktu Countdown"
                type="datetime-local"
                value={settingsForm.tanggalAkadISO || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, tanggalAkadISO: e.target.value })
                }
              />
              <Input
                label="Subjudul Cover"
                placeholder="The Wedding of"
                value={settingsForm.judulPembuka || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, judulPembuka: e.target.value })
                }
              />
              <Input
                label="Monogram Inisial"
                placeholder="Otomatis misal: B | C"
                value={settingsForm.monogram || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, monogram: e.target.value })
                }
              />
              <Input
                label="Catatan Bawah Cover"
                placeholder="*Mohon maaf jika terdapat kesalahan penulisan..."
                value={settingsForm.catatanCover || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, catatanCover: e.target.value })
                }
              />
              <Input
                label="Judul Countdown"
                placeholder="Menuju Hari Bahagia Kami"
                value={settingsForm.judulCountdown || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, judulCountdown: e.target.value })
                }
              />
              <Input
                label="Judul Galeri / Momen"
                placeholder="OUR MOMENTS"
                value={settingsForm.judulGaleri || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, judulGaleri: e.target.value })
                }
              />
              <Input
                label="Judul Kisah Cinta"
                placeholder="OUR STORIES"
                value={settingsForm.judulKisah || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, judulKisah: e.target.value })
                }
              />
              <Input
                label="Judul Wedding Gift"
                placeholder="Wedding Gift"
                value={settingsForm.judulKado || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, judulKado: e.target.value })
                }
              />
              <Input
                label="Subjudul Wedding Gift"
                placeholder="Tanpa mengurangi rasa hormat..."
                value={settingsForm.subjudulKado || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, subjudulKado: e.target.value })
                }
              />
              <Input
                label="Judul Besar RSVP"
                placeholder="RSVP"
                value={settingsForm.judulRsvp || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, judulRsvp: e.target.value })
                }
              />
              <Input
                label="Subjudul RSVP"
                placeholder="Ucapan & doa"
                value={settingsForm.subjudulRsvp || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, subjudulRsvp: e.target.value })
                }
              />
              <Input
                label="Judul Penutup (Closing)"
                placeholder="Terima Kasih"
                value={settingsForm.judulPenutup || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, judulPenutup: e.target.value })
                }
              />
              <Input
                label="Subjudul Penutup"
                placeholder="Sampai bertemu di hari bahagia kami!"
                value={settingsForm.subjudulPenutup || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, subjudulPenutup: e.target.value })
                }
              />
              <Input
                label="Kalimat Sebelum Nama Pasangan"
                placeholder="Kami yang berbahagia,"
                value={settingsForm.tandaTanganPenutup || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, tandaTanganPenutup: e.target.value })
                }
              />
              <Input
                label="Teks Brand Footer"
                placeholder="SAMSKARA"
                value={settingsForm.footerText || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, footerText: e.target.value })
                }
              />
            </div>
          </Card>

          {/* Galeri Foto Prewedding (Custom & Multi-Upload) */}
          <Card className="p-6 border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Galeri Foto Prewedding ({galleryPhotos.length} Foto)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload banyak foto sekaligus. Foto akan tersimpan rapi berdasarkan slug undangan di backend.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={galleryFileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleUploadGalleryFiles}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  leftIcon={Plus}
                  isLoading={isUploadingGallery}
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="text-xs"
                >
                  Upload Foto Galeri
                </Button>
              </div>
            </div>

            {galleryPhotos.length === 0 ? (
              <div
                onClick={() => galleryFileInputRef.current?.click()}
                className="p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Belum ada foto di galeri</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Klik di sini atau tombol upload untuk memilih foto prewedding (bisa multiple select).
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {galleryPhotos.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100 border border-slate-200 shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(idx)}
                        className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
              <FolderArchive className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                File foto galeri tersimpan di server:{' '}
                <code className="px-1.5 py-0.5 bg-white border rounded font-mono text-indigo-600">
                  uploads/{invitation?.slug || 'slug'}/gallery/
                </code>
              </span>
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              leftIcon={Save}
              isLoading={isSavingSettings}
              className="gap-2 px-8"
            >
              Simpan Semua Perubahan
            </Button>
          </div>
        </form>
      )}

      {/* ========================================================
          TAB 4: LIVE PREVIEW UNDANGAN & QR TAMU
         ======================================================== */}
      {activeTab === 'preview' && (
        <div className="space-y-6 animate-in fade-in-0 duration-150">
          {/* Guest Selector for Preview */}
          <Card className="p-4 border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Simulasi Preview Sebagai Tamu Tertentu:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Select
                placeholder="Pilih Tamu..."
                options={[
                  { value: '', label: 'Tamu Umum (Tanpa QR Khusus)' },
                  ...guests.map((g) => ({
                    value: g.id.toString(),
                    label: `${g.name} (${g.category})`,
                  })),
                ]}
                value={selectedPreviewGuestId}
                onChange={setSelectedPreviewGuestId}
                className="w-64"
              />

              {selectedGuestForPreview && (
                <Badge variant={selectedGuestForPreview.category === 'VIP' ? 'primary' : 'default'}>
                  {selectedGuestForPreview.category}
                </Badge>
              )}
            </div>
          </Card>

          {/* Embedded Interactive Preview Frame (Dynamic Theme Component) */}
          {(() => {
            const selectedTemplate = templates.find((t) => t.id.toString() === settingsForm.template_id);
            const templateCode = selectedTemplate?.template_code || invitation?.template?.template_code || 'mildness';
            const TemplatePreviewComponent = getTemplateComponent(templateCode, {
              ...invitation,
              template: selectedTemplate || invitation?.template,
            });

            return (
              <div className="flex justify-center">
                <div className="max-w-md w-full bg-stone-900 rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden text-stone-100 max-h-[85vh] overflow-y-auto">
                  <TemplatePreviewComponent
                    invitation={{
                      ...invitation,
                      template: selectedTemplate || invitation?.template,
                      content_json: {
                        ...(invitation?.content_json || {}),
                        eventType: settingsForm.eventType || 'wedding',
                        showSecondEvent: Boolean(settingsForm.showSecondEvent),
                        showQrCheckin: Boolean(settingsForm.showQrCheckin),
                        showQr: Boolean(settingsForm.showQrCheckin),
                        lockGuestList: Boolean(settingsForm.lockGuestList),
                        showDonation: Boolean(settingsForm.showDonation),
                        showGift: Boolean(settingsForm.showGift),
                        rekening: bankAccounts,
                        penerimaKado: settingsForm.penerimaKado,
                        alamatKado: settingsForm.alamatKado,
                        mempelaiPria: settingsForm.mempelaiPria,
                        panggilanPria: settingsForm.panggilanPria,
                        anakKePria: settingsForm.anakKePria || undefined,
                        instagramPria: settingsForm.instagramPria || undefined,
                        ayahPria: settingsForm.ayahPria,
                        ibuPria: settingsForm.ibuPria,
                        mempelaiWanita: settingsForm.mempelaiWanita,
                        panggilanWanita: settingsForm.panggilanWanita,
                        anakKeWanita: settingsForm.anakKeWanita || undefined,
                        instagramWanita: settingsForm.instagramWanita || undefined,
                        ayahWanita: settingsForm.ayahWanita,
                        ibuWanita: settingsForm.ibuWanita,
                        ayat: settingsForm.ayat,
                        salamPembuka: settingsForm.salamPembuka || undefined,
                        kutipanPembuka: settingsForm.kutipanPembuka || undefined,
                        teksPenutup: settingsForm.teksPenutup,
                        salamPenutup: settingsForm.salamPenutup,
                        akad: {
                          judul: settingsForm.akadJudul || undefined,
                          tanggal: settingsForm.akadTanggal,
                          waktu: settingsForm.akadWaktu,
                          lokasi: settingsForm.akadLokasi,
                          alamat: settingsForm.akadAlamat,
                          mapUrl: settingsForm.akadMapUrl,
                        },
                        resepsi: {
                          judul: settingsForm.resepsiJudul || undefined,
                          tanggal: settingsForm.resepsiTanggal,
                          waktu: settingsForm.resepsiWaktu,
                          lokasi: settingsForm.resepsiLokasi,
                          alamat: settingsForm.resepsiAlamat,
                          mapUrl: settingsForm.resepsiMapUrl,
                        },
                        judulPembuka: settingsForm.judulPembuka || undefined,
                        judulCountdown: settingsForm.judulCountdown || undefined,
                        judulGaleri: settingsForm.judulGaleri || undefined,
                        judulKisah: settingsForm.judulKisah || undefined,
                        judulKado: settingsForm.judulKado || undefined,
                        subjudulKado: settingsForm.subjudulKado || undefined,
                        judulRsvp: settingsForm.judulRsvp || undefined,
                        subjudulRsvp: settingsForm.subjudulRsvp || undefined,
                        judulPenutup: settingsForm.judulPenutup || undefined,
                        subjudulPenutup: settingsForm.subjudulPenutup || undefined,
                        tandaTanganPenutup: settingsForm.tandaTanganPenutup || undefined,
                        footerText: settingsForm.footerText || undefined,
                        kisah: loveStories,
                        galeri: galleryPhotos,
                        musicUrl: musicUrl,
                        musicTitle: musicTitle,
                        fotoCover: fotoCover,
                        fotoWhatsapp: fotoWhatsapp || fotoCover,
                        fotoPria: fotoPria,
                        fotoWanita: fotoWanita,
                        showDresscode: settingsForm.showDresscode,
                        judulDresscode: settingsForm.judulDresscode,
                        dresscodeText: settingsForm.dresscodeText,
                        dresscodeColors: settingsForm.dresscodeColors,
                        giftConfirmText: settingsForm.giftConfirmText,
                        giftWa1Name: settingsForm.giftWa1Name,
                        giftWa1Phone: settingsForm.giftWa1Phone,
                        giftWa2Name: settingsForm.giftWa2Name,
                        giftWa2Phone: settingsForm.giftWa2Phone,
                        seatPlanImage: settingsForm.seatPlanImage || undefined,
                        seatPlanTitle: settingsForm.seatPlanTitle || undefined,
                        seatPlanCaption: settingsForm.seatPlanCaption || undefined,
                      },
                    }}
                    guest={selectedGuestForPreview}
                    rsvps={rsvps}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================
          MODALS
         ======================================================== */}

      {/* MODAL 1: VIEW QR CODE MODAL */}
      {selectedGuestQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
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
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {selectedGuestQr.pax} Pax
                </span>
              </div>
            </div>

            {/* QR SVG Render */}
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
                *Tamu cukup menunjukkan QR Code ini kepada panitia resepsionis untuk discan.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => handleCopyShareText(selectedGuestQr)}
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Salin WA Tamu</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => handleCopyOnlyLink(selectedGuestQr)}
              >
                <Link2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Salin Link Saja</span>
              </Button>

              {selectedGuestQr.qr_link && (
                <a
                  href={selectedGuestQr.qr_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50"
                  title="Buka Link Undangan"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EXCEL IMPORT PREVIEW */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {(() => {
                // Map tamu yang sudah ada di DB: nama -> Set(qr_code)
                const existingGuestsByName = new Map();
                const existingQrSet = new Set();
                guests.forEach((g) => {
                  const lowerName = (g.name || '').trim().toLowerCase();
                  const lowerQr = (g.qr_code || '').trim().toLowerCase();
                  if (!existingGuestsByName.has(lowerName)) {
                    existingGuestsByName.set(lowerName, new Set());
                  }
                  if (lowerQr) {
                    existingGuestsByName.get(lowerName).add(lowerQr);
                    existingQrSet.add(lowerQr);
                  }
                });

                const seenInModalByName = new Map();
                const seenInModalQr = new Set();
                let duplicateCount = 0;
                let duplicateInternalCount = 0;

                importedPreview.forEach((item) => {
                  const lowerName = (item.name || '').trim().toLowerCase();
                  const lowerQr = (item.qr_code || '').trim().toLowerCase();
                  const hasExplicit = Boolean(item.has_explicit_qr);

                  const isQrAlreadyInDb = hasExplicit && Boolean(lowerQr && existingQrSet.has(lowerQr));
                  const isQrAlreadyInBatch = hasExplicit && Boolean(lowerQr && seenInModalQr.has(lowerQr));

                  const isNameInDb = existingGuestsByName.has(lowerName);
                  const isNameInBatch = seenInModalByName.has(lowerName);

                  let isDupeDb = false;
                  let isDupeBatch = false;

                  if (isQrAlreadyInDb) {
                    isDupeDb = true;
                  } else if (isQrAlreadyInBatch) {
                    isDupeBatch = true;
                  } else if (isNameInDb || isNameInBatch) {
                    // Sesudah cek nama sama: cek apakah QR Code-nya sama atau tidak
                    if (hasExplicit) {
                      const prevQrsInDb = existingGuestsByName.get(lowerName) || new Set();
                      const prevQrsInBatch = seenInModalByName.get(lowerName) || new Set();
                      if (prevQrsInDb.has(lowerQr)) {
                        isDupeDb = true;
                      } else if (prevQrsInBatch.has(lowerQr)) {
                        isDupeBatch = true;
                      }
                    } else {
                      if (isNameInDb) isDupeDb = true;
                      else if (isNameInBatch) isDupeBatch = true;
                    }
                  }

                  if (isDupeDb) {
                    duplicateCount++;
                  } else if (isDupeBatch) {
                    duplicateInternalCount++;
                  } else {
                    if (!seenInModalByName.has(lowerName)) {
                      seenInModalByName.set(lowerName, new Set());
                    }
                    if (lowerQr) {
                      seenInModalByName.get(lowerName).add(lowerQr);
                      if (hasExplicit) seenInModalQr.add(lowerQr);
                    }
                  }
                });

                const totalSkipped = duplicateCount + duplicateInternalCount;
                const newCount = importedPreview.length - totalSkipped;

                return (
                  <>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        File: <strong>{importFileName}</strong>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          Total di Excel: <strong>{importedPreview.length}</strong> baris tamu
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800">
                          +{newCount} Tamu Unik (Akan Masuk)
                        </span>
                        {totalSkipped > 0 && (
                          <span className="px-2 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-800">
                            {totalSkipped} Dilewati ({duplicateCount} sudah di DB, {duplicateInternalCount} duplikat di Excel)
                          </span>
                        )}
                      </div>
                    </div>

                    {totalSkipped > 0 && (
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                        <span className="text-amber-500 font-bold">ℹ</span>
                        <span>
                          Sistem mendeteksi <strong>{totalSkipped} tamu</strong> yang duplikat ({duplicateCount > 0 ? `${duplicateCount} sudah ada di database, ` : ''}{duplicateInternalCount > 0 ? `${duplicateInternalCount} nama & QR code sama di dalam file Excel` : ''}). Tamu ganda otomatis <strong>dilewati (skip)</strong> agar data tetap unik.
                        </span>
                      </div>
                    )}

                    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                          <tr>
                            <th className="p-2.5">No</th>
                            <th className="p-2.5">Nama Tamu</th>
                            <th className="p-2.5">Kategori</th>
                            <th className="p-2.5">Status Impor</th>
                            <th className="p-2.5">Link QR Check-In</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(() => {
                            const seenRowsByName = new Map();
                            const seenRowsQr = new Set();
                            return importedPreview.map((item, i) => {
                              const lowerName = (item.name || '').trim().toLowerCase();
                              const lowerQr = (item.qr_code || '').trim().toLowerCase();
                              const hasExplicit = Boolean(item.has_explicit_qr);

                              const isQrAlreadyInDb = hasExplicit && Boolean(lowerQr && existingQrSet.has(lowerQr));
                              const isQrAlreadyInBatch = hasExplicit && Boolean(lowerQr && seenRowsQr.has(lowerQr));

                              const isNameInDb = existingGuestsByName.has(lowerName);
                              const isNameInBatch = seenRowsByName.has(lowerName);

                              let isAlreadyInDb = false;
                              let isDupeInFile = false;

                              if (isQrAlreadyInDb) {
                                isAlreadyInDb = true;
                              } else if (isQrAlreadyInBatch) {
                                isDupeInFile = true;
                              } else if (isNameInDb || isNameInBatch) {
                                // Sesudah cek nama sama: cek kondisi QR Code
                                if (hasExplicit) {
                                  const prevQrsInDb = existingGuestsByName.get(lowerName) || new Set();
                                  const prevQrsInBatch = seenRowsByName.get(lowerName) || new Set();
                                  if (prevQrsInDb.has(lowerQr)) {
                                    isAlreadyInDb = true;
                                  } else if (prevQrsInBatch.has(lowerQr)) {
                                    isDupeInFile = true;
                                  }
                                } else {
                                  if (isNameInDb) isAlreadyInDb = true;
                                  else if (isNameInBatch) isDupeInFile = true;
                                }
                              }

                              if (!isAlreadyInDb && !isDupeInFile) {
                                if (!seenRowsByName.has(lowerName)) {
                                  seenRowsByName.set(lowerName, new Set());
                                }
                                if (lowerQr) {
                                  seenRowsByName.get(lowerName).add(lowerQr);
                                  if (hasExplicit) seenRowsQr.add(lowerQr);
                                }
                              }

                              const isSkipped = isAlreadyInDb || isDupeInFile;

                              return (
                                <tr
                                  key={i}
                                  className={isSkipped ? 'bg-amber-50/40 opacity-70' : 'hover:bg-slate-50'}
                                >
                                  <td className="p-2.5 text-slate-400">{i + 1}</td>
                                  <td className="p-2.5 font-medium text-slate-900">
                                    {item.name}
                                  </td>
                                  <td className="p-2.5">
                                    <Badge
                                      variant={item.category === 'VIP' ? 'primary' : 'default'}
                                      size="sm"
                                    >
                                      {item.category}
                                    </Badge>
                                  </td>
                                  <td className="p-2.5">
                                    {isAlreadyInDb ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                        Sudah Ada di DB (Skip)
                                      </span>
                                    ) : isDupeInFile ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                                        Duplikat di Excel (Skip)
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        Baru (Akan Diimpor)
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2.5 font-mono text-[11px] text-slate-500 truncate max-w-xs">
                                    {item.qr_link}
                                  </td>
                                </tr>
                              );
                            });
                          })()}
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
                        disabled={newCount === 0}
                      >
                        {newCount > 0
                          ? `Simpan ${newCount} Tamu Baru ke Undangan Ini`
                          : 'Semua Tamu Sudah Ada (Tidak Ada Data Baru)'}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT SINGLE GUEST */}
      {isGuestFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isEditingGuest ? 'Edit Data Tamu' : 'Tambah Tamu Undangan'}
              </h3>
              <button
                type="button"
                onClick={() => setIsGuestFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuestForm} className="p-6 space-y-4">
              <Input
                label="Nama Tamu"
                required
                placeholder="Masukkan nama lengkap tamu..."
                value={guestFormData.name}
                onChange={(e) => setGuestFormData({ ...guestFormData, name: e.target.value })}
              />

              <Select
                label="Kategori Tamu"
                options={[
                  { value: 'Reguler', label: 'Tamu Reguler' },
                  { value: 'VIP', label: 'Tamu VIP (Prioritas)' },
                  { value: 'VVIP', label: 'Tamu VVIP (Utama)' },
                  { value: 'Grup', label: 'Tamu Grup (Tanpa QR Check-In)' },
                ]}
                value={guestFormData.category}
                onChange={(cat) => setGuestFormData({ ...guestFormData, category: cat })}
              />

              {guestFormData.category === 'Grup' ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  Untuk kategori <strong>Grup</strong>, QR Code Check-In tidak akan ditampilkan pada halaman undangan tamu.
                </div>
              ) : (
                <Input
                  label="Link QR Code Check-In (Eksternal / Tamuva)"
                  placeholder="https://app.tamuva.com/events/.../checkin?guestId=..."
                  value={guestFormData.qr_link}
                  onChange={(e) => setGuestFormData({ ...guestFormData, qr_link: e.target.value })}
                  helperText="Link yang tertanam ke dalam QR code dan discan oleh resepsionis"
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Jumlah Kursi (Pax)"
                  type="number"
                  min="1"
                  max="10"
                  value={guestFormData.pax}
                  onChange={(e) => setGuestFormData({ ...guestFormData, pax: e.target.value })}
                />
                <Input
                  label="No. WhatsApp / HP"
                  placeholder="08123456789"
                  value={guestFormData.phone_number}
                  onChange={(e) => setGuestFormData({ ...guestFormData, phone_number: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsGuestFormOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  {isEditingGuest ? 'Simpan Perubahan' : 'Tambah Tamu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: TEMPLATE INVITATION LIVE PREVIEW MODAL */}
      <InvitationTemplateModal
        isOpen={Boolean(previewGuestInModal)}
        onClose={() => setPreviewGuestInModal(null)}
        invitation={invitation}
        guest={previewGuestInModal}
      />
    </div>
  );
};
