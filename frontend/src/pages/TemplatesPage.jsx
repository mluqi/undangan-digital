import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Badge,
  Input,
  Select,
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
import { getTemplateComponent } from '../components/invitation/templateRegistry';
import {
  Palette as BuilderPaletteIcon,
  Sparkles as BuilderSparklesIcon,
  Image as BuilderImageIcon,
  Video as BuilderVideoIcon,
  Eye as BuilderEyeIcon,
  Upload as BuilderUploadIcon,
  RotateCcw as BuilderResetIcon,
  Layers as BuilderLayersIcon,
  Smartphone as BuilderPhoneIcon,
  RefreshCw as BuilderRefreshIcon,
  Settings as BuilderSettingsIcon,
  Music as BuilderMusicIcon,
} from 'lucide-react';
import {
  DEFAULT_CUSTOM_THEME,
  CUSTOM_THEME_PRESETS,
} from '../components/invitation/templates/CustomThemeBuilder';

const BUILTIN_ENGINE_CODES = [
  'mildness',
  'botanical-elegance',
  'crimson-gold',
  'lavender-mist',
  'sage-garden',
  'luxury-gold',
  'floral-pastel',
  'minimalist-white',
  'classic-serif',
  'emerald-royal',
  'kembar-mayang',
  'noir-velvet',
  'drapery-pink',
  'sundanese-classic',
];

const ENGINE_LAYOUT_OPTIONS = [
  {
    value: 'custom-builder',
    label: 'Custom Dynamic Builder (Ubah Warna, PNG, Frame, Video & Animasi)',
  },
  { value: '__builtin__', label: 'Kerangka JSX Asli Kode Template (Khusus Template Bawaan)' },
  { value: 'drapery-pink', label: 'Kerangka Bawaan: Drapery Pink & Amplop' },
  { value: 'noir-velvet', label: 'Kerangka Bawaan: Noir Velvet Sinematik' },
  { value: 'mildness', label: 'Kerangka Bawaan: Mildness Classic' },
  { value: 'kembar-mayang', label: 'Kerangka Bawaan: Kembar Mayang Jawa' },
  { value: 'sundanese-classic', label: 'Kerangka Bawaan: Sundanese Emerald' },
];

const CUSTOM_STUDIO_TABS = [
  { id: 'general', label: 'Info & Kerangka', icon: BuilderSettingsIcon },
  { id: 'style', label: 'Gaya & Warna', icon: BuilderPaletteIcon },
  { id: 'assets', label: 'Ornamen PNG', icon: BuilderImageIcon },
  { id: 'animations', label: 'Animasi', icon: BuilderSparklesIcon },
  { id: 'media', label: 'Video & Teks', icon: BuilderVideoIcon },
];

const CUSTOM_COVER_STYLES = [
  { value: 'envelope', label: 'Amplop Vintage Interaktif (Tap to Open)' },
  { value: 'arch-curtain', label: 'Tirai / Gerbang Arch Romantis' },
  { value: 'cinematic', label: 'Full Screen Sinematik (Foto / Video)' },
];

const CUSTOM_FRAME_SHAPES = [
  { value: 'cameo-overlay', label: 'Cameo Oval + Frame Overlay PNG' },
  { value: 'arch', label: 'Lengkungan Kubah (Arch)' },
  { value: 'oval', label: 'Oval Lembut (Soft Oval)' },
  { value: 'circle', label: 'Lingkaran Klasik (Circle)' },
  { value: 'polaroid', label: 'Bingkai Polaroid' },
  { value: 'rounded', label: 'Kotak Sudut Melengkung (Rounded)' },
];

const CUSTOM_FONT_OPTIONS = {
  scriptFont: [
    { value: 'font-sloop', label: 'Sloop Script (Kaligrafi Klasik)' },
    { value: 'font-slight', label: 'Slight Script (Elegan Modern)' },
    { value: 'font-amoresa', label: 'Amoresa (Romantis Mewah)' },
    { value: 'font-romantic', label: 'Great Vibes / Romantic' },
    { value: 'font-sugar', label: 'Brown Sugar (Editorial Serif)' },
    { value: 'font-cursive', label: 'Cursive Script Halus' },
  ],
  headingFont: [
    { value: 'font-cardo', label: 'Cardo Serif (Editorial Klasik)' },
    { value: 'font-cinzel', label: 'Cinzel (Monogram / Royal)' },
    { value: 'font-editorial', label: 'Playfair Display (Mewah)' },
    { value: 'font-serif-theme', label: 'Cormorant Garamond' },
    { value: 'font-quattrocento', label: 'Quattrocento Serif' },
    { value: 'font-fraunces', label: 'Fraunces Display' },
  ],
  bodyFont: [
    { value: 'font-public-sans', label: 'Public Sans (Bersih & Mudah Dibaca)' },
    { value: 'font-quicksand', label: 'Quicksand (Lembut & Modern)' },
    { value: 'font-ysabeau', label: 'Ysabeau Infant (Puitis)' },
    { value: 'font-montserrat', label: 'Montserrat (Formal & Rapi)' },
    { value: 'font-lato', label: 'Lato (Minimalis)' },
    { value: 'font-nunito', label: 'Nunito (Ramah & Santai)' },
  ],
};

const CUSTOM_COLOR_FIELDS = [
  { key: 'bgPrimary', label: 'Background Utama' },
  { key: 'bgSecondary', label: 'Background Kartu / Seksi' },
  { key: 'textPrimary', label: 'Warna Teks Utama' },
  { key: 'textMuted', label: 'Warna Teks Sekunder' },
  { key: 'accent', label: 'Warna Aksen & Garis' },
  { key: 'buttonBg', label: 'Warna Tombol' },
  { key: 'buttonText', label: 'Teks Tombol' },
];

const CUSTOM_PARTICLE_OPTIONS = [
  { value: 'petals', label: 'Kelopak Bunga Jatuh (Petals)' },
  { value: 'sparkles', label: 'Kilau Bintang Berkedip (Sparkles)' },
  { value: 'leaves', label: 'Dedaunan Melayang (Botanical)' },
  { value: 'snow', label: 'Salju / Cahaya Lembut (Soft Bokeh)' },
  { value: 'none', label: 'Nonaktif (Tanpa Partikel)' },
];

const CUSTOM_COVER_TRANSITIONS = [
  { value: 'slide-up', label: 'Tirai Terangkat ke Atas (Slide Up)' },
  { value: 'fade-zoom', label: 'Halus + Zoom In Sinematik' },
  { value: 'blur-fade', label: 'Blur Dissolve Elegan' },
];

const CUSTOM_ORNAMENT_MOTIONS = [
  { value: 'sway-float', label: 'Bergoyang & Melayang Halus' },
  { value: 'subtle', label: 'Gerak Bernapas Pelan (Subtle Pulse)' },
  { value: 'static', label: 'Diam Statis' },
];

const CUSTOM_SCROLL_REVEALS = [
  { value: 'fade-up', label: 'Muncul dari Bawah (Fade Up)' },
  { value: 'zoom-in', label: 'Perbesaran Lembut (Zoom In)' },
  { value: 'slide-side', label: 'Geser dari Samping (Slide Side)' },
];

const CUSTOM_REVEAL_DURATIONS = [
  { value: '550', label: 'Cepat (550 ms)' },
  { value: '850', label: 'Normal Romantis (850 ms)' },
  { value: '1250', label: 'Lambat Sinematik (1250 ms)' },
];

const CUSTOM_ASSET_SLOTS = [
  {
    key: 'coverBgImage',
    label: 'Background Layar Cover (PNG/JPG)',
    hint: 'Melapisi halaman depan sebelum tamu menekan Buka Undangan.',
    positions: [
      { value: 'center', label: 'Tengah Penuh (Center)' },
      { value: 'top', label: 'Fokus Atas (Top)' },
      { value: 'bottom', label: 'Fokus Bawah (Bottom)' },
      { value: 'contain-center', label: 'Utuh Tanpa Terpotong' },
    ],
    presets: [
      { label: 'Drapery Pink Satin', url: '/images/drapery-pink/bg-drapery-main.png' },
      { label: 'Kertas Cream Hangat', url: '/images/drapery-pink/bg-paper-cream.jpg' },
      { label: 'Cover Klasik Jawa', url: '/images/kembar-cover.jpg' },
      { label: 'Gerbang Botani Hijau', url: '/images/forest-gate-frame.jpg' },
    ],
  },
  {
    key: 'bodyBgImage',
    label: 'Tekstur Background Halaman Isi',
    hint: 'Tekstur kertas/marble halus pada keseluruhan isi undangan.',
    positions: [
      { value: 'repeat-y', label: 'Berulang Vertikal' },
      { value: 'cover-fixed', label: 'Penuh Tetap (Fixed)' },
      { value: 'top-banner', label: 'Banner Bagian Atas' },
      { value: 'tile-all', label: 'Pola Keramik (Tile)' },
    ],
    presets: [
      { label: 'Tekstur Kertas Panjang', url: '/images/drapery-pink/bg-paper-long.jpg' },
      { label: 'Kertas Cream Hangat', url: '/images/drapery-pink/bg-paper-cream.jpg' },
      { label: 'Perkamen Klasik Jawa', url: '/images/kembar-paper-bg.jpg' },
    ],
  },
  {
    key: 'envelopeClosedImage',
    label: 'Gambar Amplop / Tirai Cover Depan',
    hint: 'Digunakan saat Gaya Cover diatur ke Amplop atau posisi tirai cover.',
    positions: [
      { value: 'center', label: 'Tengah Cover (Amplop)' },
      { value: 'top-curtain', label: 'Tirai / Gantungan Atas' },
      { value: 'bottom-stage', label: 'Dasar / Bawah Cover' },
      { value: 'full-frame', label: 'Bingkai Penuh Cover' },
    ],
    presets: [
      { label: 'Amplop Satin Vintage', url: '/images/drapery-pink/envelope-body.png' },
      { label: 'Tirai Drapery Satin', url: '/images/drapery-pink/drapery-curtain.png' },
    ],
  },
  {
    key: 'coupleFrameImage',
    label: 'Bingkai Overlay PNG Foto Utama / Mempelai',
    hint: 'PNG transparan bingkai Cameo / Arch di foto.',
    positions: [
      { value: 'couple-only', label: 'Foto Profil / Mempelai' },
      { value: 'couple-and-hero', label: 'Profil + Foto Utama Atas' },
      { value: 'couple-and-cover', label: 'Profil + Foto Cover Arch' },
      { value: 'all-photos', label: 'Semua Foto Undangan' },
    ],
    presets: [
      { label: 'Bingkai Oval Cameo Pink', url: '/images/drapery-pink/oval-frame-border.png' },
      { label: 'Bingkai Arch Emas', url: '/images/drapery-pink/arch-gold-frame.png' },
      { label: 'Bingkai Polaroid', url: '/images/drapery-pink/polaroid-frame.png' },
    ],
  },
  {
    key: 'cornerTopLeftImage',
    label: 'Ornamen Sudut Atas (PNG Transparan)',
    hint: 'Hiasan pojok bagian atas pada Cover & seksi pembuka.',
    positions: [
      { value: 'top-corners', label: 'Cover Kiri & Hero Kanan' },
      { value: 'top-both', label: 'Kiri & Kanan Atas (Pair)' },
      { value: 'top-left-only', label: 'Pojok Kiri Atas Saja' },
      { value: 'top-right-only', label: 'Pojok Kanan Atas Saja' },
    ],
    presets: [
      { label: 'Swirl Mawar Pink', url: '/images/drapery-pink/floral-swirl.png' },
      { label: 'Sulur Kanopi Hijau', url: '/images/forest-canopy-vines.png' },
      { label: 'Tirai Satin Pink', url: '/images/drapery-pink/drapery-curtain.png' },
    ],
  },
  {
    key: 'bottomPillarImage',
    label: 'Ornamen Bunga / Pilar Sudut Bawah (PNG)',
    hint: 'Hiasan bagian bawah penutup & sudut bawah layar.',
    positions: [
      { value: 'bottom-center', label: 'Tengah Bagian Penutup' },
      { value: 'bottom-corners', label: 'Kiri & Kanan Bawah (Pair)' },
      { value: 'bottom-left', label: 'Pojok Kiri Bawah' },
      { value: 'bottom-right', label: 'Pojok Kanan Bawah' },
    ],
    presets: [
      { label: 'Rangkaian Mawar Sudut', url: '/images/drapery-pink/corner-roses.png' },
      { label: 'Buket Bunga Samping', url: '/images/drapery-pink/floral-bouquet-left.png' },
      { label: 'Buket Bunga Overlay', url: '/images/drapery-pink/floral-bouquet-overlay.png' },
      { label: 'Klaster Botani Hijau', url: '/images/forest-botanical-cluster.png' },
      { label: 'Klaster Bunga Kembar', url: '/images/kembar-flower-cluster.png' },
    ],
  },
  {
    key: 'floatingAccentImage',
    label: 'Aksen Melayang Animasi (PNG / GIF)',
    hint: 'Kupu-kupu GIF atau daun di sudut foto & cover.',
    positions: [
      { value: 'bottom-right', label: 'Pojok Kanan Bawah' },
      { value: 'top-right', label: 'Pojok Kanan Atas' },
      { value: 'top-left', label: 'Pojok Kiri Atas' },
      { value: 'bottom-left', label: 'Pojok Kiri Bawah' },
    ],
    presets: [
      { label: 'Kupu-Kupu Animasi', url: '/images/drapery-pink/butterfly.gif' },
      { label: 'Dedaunan Kiri', url: '/images/forest-foliage-left.png' },
      { label: 'Dedaunan Kanan', url: '/images/forest-foliage-right.png' },
    ],
  },
  {
    key: 'headerCalligraphyImage',
    label: 'Kaligrafi / Lambang Atas Acara (SVG / PNG)',
    hint: 'Misal: Bismillah, Gunungan Jawa, atau monogram acara.',
    positions: [
      { value: 'above-greeting', label: 'Di Atas Sambutan Pembuka' },
      { value: 'above-hero-photo', label: 'Di Atas Foto Utama (Hero)' },
      { value: 'cover-top', label: 'Bagian Atas Cover + Pembuka' },
      { value: 'above-couple', label: 'Kepala Seksi Profil' },
    ],
    presets: [
      { label: 'Kaligrafi Bismillah', url: '/images/drapery-pink/bismillah.svg' },
      { label: 'Gunungan Emas Jawa', url: '/images/kembar-gunungan-gold.png' },
    ],
  },
  {
    key: 'dividerImage',
    label: 'Ornamen Pembatas Seksi (Divider PNG)',
    hint: 'Garis dekoratif pemisah antar bab undangan.',
    positions: [
      { value: 'between-events', label: 'Antara Acara 1 & Acara 2' },
      { value: 'all-sections', label: 'Semua Pembatas Seksi' },
      { value: 'couple-and-events', label: 'Antara Pasangan & Acara' },
      { value: 'top-and-bottom', label: 'Atas Hero & Penutup Bawah' },
    ],
    presets: [
      { label: 'Pembatas Bunga Minimalis', url: '/images/drapery-pink/divider-flower.png' },
      { label: 'Ornamen Pembatas Klasik', url: '/images/drapery-pink/divider-ornament.png' },
      { label: 'Pembatas Kembar Emas', url: '/images/kembar-divider.png' },
    ],
  },
  {
    key: 'venueIllustrationImage',
    label: 'Strip Tanggal / Ilustrasi Lokasi (PNG)',
    hint: 'Hiasan dekoratif di sekitar seksi Tanggal & Lokasi.',
    positions: [
      { value: 'above-title', label: 'Di Atas Judul Tanggal' },
      { value: 'below-countdown', label: 'Di Bawah Hitung Mundur' },
      { value: 'inside-event-card', label: 'Di Dalam Kartu Acara 1' },
      { value: 'below-events', label: 'Di Bawah Daftar Acara' },
    ],
    presets: [
      { label: 'Strip Tanggal Vintage', url: '/images/drapery-pink/date-strip-1.png' },
      { label: 'Bingkai Semak Hijau', url: '/images/forest-bush-border.png' },
    ],
  },
];

const TEMPLATE_EVENT_CATEGORIES = [
  {
    value: 'wedding',
    label: 'Khusus Pernikahan (Wedding)',
    shortLabel: 'Wedding',
    badgeClass: 'bg-rose-600/90 text-white',
  },
  {
    value: 'engagement',
    label: 'Khusus Lamaran / Tunangan (Engagement)',
    shortLabel: 'Lamaran',
    badgeClass: 'bg-amber-500/90 text-white',
  },
  {
    value: 'birthday',
    label: 'Khusus Ulang Tahun (Birthday)',
    shortLabel: 'Ulang Tahun',
    badgeClass: 'bg-purple-600/90 text-white',
  },
  {
    value: 'event',
    label: 'Khusus Acara Umum (Gathering / Aqiqah / Wisuda / Corporate)',
    shortLabel: 'Acara Umum',
    badgeClass: 'bg-emerald-600/90 text-white',
  },
  {
    value: 'all',
    label: 'Universal (Bisa Semua Jenis Acara)',
    shortLabel: 'Multi-Acara',
    badgeClass: 'bg-indigo-600/90 text-white',
  },
];

const TEMPLATE_STYLE_OPTIONS = [
  { value: 'modern', label: 'Modern & Editorial' },
  { value: 'tradisional', label: 'Adat & Tradisional' },
  { value: 'rustic', label: 'Rustic & Botanical' },
];

const getTemplateEventCategory = (tmpl) =>
  (
    tmpl?.default_content_json?.templateEventType ||
    tmpl?.default_content_json?.eventType ||
    'wedding'
  ).toLowerCase();

const getTemplateCategoryMeta = (cat) =>
  TEMPLATE_EVENT_CATEGORIES.find((c) => c.value === cat) || TEMPLATE_EVENT_CATEGORIES[0];

export const TemplatesPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'landing-cms'
  const [filterEventCategory, setFilterEventCategory] = useState('all_filter');
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
  const [studioTab, setStudioTab] = useState('general');
  const [previewIsOpened, setPreviewIsOpened] = useState(false);
  const [previewRenderKey, setPreviewRenderKey] = useState(0);
  const [mobileBuilderPane, setMobileBuilderPane] = useState('editor');
  const [uploadingCustomAssetKey, setUploadingCustomAssetKey] = useState(null);
  const [isUploadingTemplateVideo, setIsUploadingTemplateVideo] = useState(false);
  const [isUploadingTemplatePrewedVideo, setIsUploadingTemplatePrewedVideo] = useState(false);
  const [isUploadingTemplateMusic, setIsUploadingTemplateMusic] = useState(false);
  const modalBgVideoRef = useRef(null);
  const modalPrewedVideoRef = useRef(null);
  const modalMusicRef = useRef(null);

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

  const buildTemplatePreviewData = (tmpl) => {
    const rawCat = getTemplateEventCategory(tmpl);
    const demoEventType = rawCat === 'all' ? 'wedding' : rawCat;
    const tmplDefaults = tmpl.default_content_json || {};

    const demoByType = {
      engagement: {
        eventType: 'engagement',
        showSecondEvent: false,
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
          judul: 'Acara Lamaran & Tukar Cincin',
          tanggal: 'Minggu, 15 November 2026',
          waktu: '09:00 - 12:00 WIB',
          lokasi: 'Kediaman Keluarga Maharani',
          alamat: 'Jl. Dharmahusada Indah Barat No. 24, Surabaya',
          mapUrl: 'https://maps.google.com/?q=Surabaya',
        },
        resepsi: {
          judul: 'Ramah Tamah Keluarga',
          tanggal: 'Minggu, 15 November 2026',
          waktu: '12:00 - 14:00 WIB',
          lokasi: 'Kediaman Keluarga Maharani',
          alamat: 'Jl. Dharmahusada Indah Barat No. 24, Surabaya',
          mapUrl: 'https://maps.google.com/?q=Surabaya',
        },
        rekening: [
          { bank: 'BCA', nomor: '8291038192', nama: 'Arya Bimantara' },
          { bank: 'Mandiri', nomor: '1420019283019', nama: 'Bella Maharani' },
        ],
        alamatKado:
          'Jl. Dharmahusada Indah Barat VI No. 24, Mulyorejo, Surabaya (0812-3456-7890)',
      },
      birthday: {
        eventType: 'birthday',
        showSecondEvent: false,
        mempelaiPria: 'Clara Putri Maharani',
        panggilanPria: 'Clara',
        anakKePria: 'Sweet 17th Birthday Celebration',
        ayahPria: 'Bpk. Hendra Wijaya',
        ibuPria: 'Ibu Ratna Juwita',
        mempelaiWanita: '',
        panggilanWanita: '',
        ayahWanita: '',
        ibuWanita: '',
        ayat: 'With Gratitude & Joy',
        akad: {
          judul: 'Birthday Party & Dinner',
          tanggal: 'Sabtu, 21 November 2026',
          waktu: '18:30 - 21:30 WIB',
          lokasi: 'Pavilion Garden, Hotel Majapahit Surabaya',
          alamat: 'Jl. Tunjungan No.65, Genteng, Surabaya',
          mapUrl: 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
        },
        resepsi: {
          judul: 'After Party',
          tanggal: 'Sabtu, 21 November 2026',
          waktu: '21:30 - 23:00 WIB',
          lokasi: 'Pavilion Garden, Hotel Majapahit Surabaya',
          alamat: 'Jl. Tunjungan No.65, Genteng, Surabaya',
          mapUrl: 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
        },
        rekening: [
          { bank: 'BCA', nomor: '8291038192', nama: 'Clara Putri Maharani' },
        ],
        alamatKado:
          'Jl. Dharmahusada Indah Barat VI No. 24, Mulyorejo, Surabaya (0812-3456-7890)',
      },
      event: {
        eventType: 'event',
        showSecondEvent: false,
        mempelaiPria: 'Annual Gala Dinner & Awarding Night 2026',
        panggilanPria: 'Gala Dinner 2026',
        anakKePria: 'PT Samudera Karya Nusantara',
        ayahPria: 'Board of Directors',
        ibuPria: 'Executive Committee',
        mempelaiWanita: '',
        panggilanWanita: '',
        ayahWanita: '',
        ibuWanita: '',
        ayat: 'Collaborate, Celebrate & Inspire',
        akad: {
          judul: 'Registrasi & Gala Dinner',
          tanggal: 'Jumat, 27 November 2026',
          waktu: '18:00 - 22:00 WIB',
          lokasi: 'Grand Ballroom Shangri-La Surabaya',
          alamat: 'Jl. Mayjen Sungkono No.120, Surabaya',
          mapUrl: 'https://maps.google.com/?q=Shangri-La+Surabaya',
        },
        resepsi: {
          judul: 'Networking Session',
          tanggal: 'Jumat, 27 November 2026',
          waktu: '21:00 - 22:30 WIB',
          lokasi: 'Grand Ballroom Shangri-La Surabaya',
          alamat: 'Jl. Mayjen Sungkono No.120, Surabaya',
          mapUrl: 'https://maps.google.com/?q=Shangri-La+Surabaya',
        },
        rekening: [
          { bank: 'Mandiri', nomor: '1420019283019', nama: 'Panitia Gala Dinner' },
        ],
        alamatKado: 'Gedung Graha Nusantara Lt. 5, Jl. Basuki Rahmat, Surabaya',
      },
      wedding: {
        eventType: 'wedding',
        showSecondEvent: true,
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
    };

    const rsvpsByType = {
      engagement: [
        {
          id: 1,
          guest_name: 'Drs. H. Bambang Soemantri',
          attendance_status: 'Hadir',
          message: 'Selamat atas pertunangannya, semoga dilancarkan hingga hari pernikahan.',
          created_at: new Date().toISOString(),
        },
      ],
      birthday: [
        {
          id: 1,
          guest_name: 'Nadia Kusuma',
          attendance_status: 'Hadir',
          message: 'Happy Sweet 17th Clara! Semoga sehat dan semua impiannya tercapai!',
          created_at: new Date().toISOString(),
        },
      ],
      event: [
        {
          id: 1,
          guest_name: 'Ir. Hendro Wibowo',
          attendance_status: 'Hadir',
          message: 'Terima kasih atas undangannya, sukses untuk seluruh rangkaian acara!',
          created_at: new Date().toISOString(),
        },
      ],
      wedding: [
        {
          id: 1,
          guest_name: 'Drs. H. Bambang Soemantri',
          attendance_status: 'Hadir',
          message: 'Selamat menempuh hidup baru untuk kedua mempelai.',
          created_at: new Date().toISOString(),
        },
      ],
    };

    return {
      template: tmpl,
      template_code: tmpl.template_code,
      client_name: `Demo: ${tmpl.name}`,
      content_json: {
        ...(demoByType[demoEventType] || demoByType.wedding),
        ...tmplDefaults,
        eventType: demoEventType,
      },
      rsvps: rsvpsByType[demoEventType] || rsvpsByType.wedding,
    };
  };

  const handlePreviewTemplate = (tmpl) => {
    setPreviewModalData(buildTemplatePreviewData(tmpl));
  };

  const normalizedCodeLower = (templateCode || '').toLowerCase().trim();
  const effectiveBaseLayout =
    defaultContent.baseLayout !== undefined
      ? defaultContent.baseLayout
      : isEditing && BUILTIN_ENGINE_CODES.includes(normalizedCodeLower)
        ? ''
        : 'custom-builder';
  const isCustomBuilderActive = effectiveBaseLayout === 'custom-builder';

  const currentCustomTheme = {
    ...DEFAULT_CUSTOM_THEME,
    ...(defaultContent.customTheme || {}),
    colors: {
      ...DEFAULT_CUSTOM_THEME.colors,
      ...(defaultContent.customTheme?.colors || {}),
    },
    typography: {
      ...DEFAULT_CUSTOM_THEME.typography,
      ...(defaultContent.customTheme?.typography || {}),
    },
    assets: {
      ...DEFAULT_CUSTOM_THEME.assets,
      ...(defaultContent.customTheme?.assets || {}),
    },
    assetPositions: {
      ...DEFAULT_CUSTOM_THEME.assetPositions,
      ...(defaultContent.customTheme?.assetPositions || {}),
    },
    animations: {
      ...DEFAULT_CUSTOM_THEME.animations,
      ...(defaultContent.customTheme?.animations || {}),
    },
  };

  const updateCustomThemeField = (key, value) => {
    setDefaultContent((prev) => ({
      ...prev,
      baseLayout: prev.baseLayout || 'custom-builder',
      customTheme: {
        ...DEFAULT_CUSTOM_THEME,
        ...(prev.customTheme || {}),
        [key]: value,
      },
    }));
  };

  const updateCustomThemeSection = (section, patch) => {
    setDefaultContent((prev) => ({
      ...prev,
      baseLayout: prev.baseLayout || 'custom-builder',
      customTheme: {
        ...DEFAULT_CUSTOM_THEME,
        ...(prev.customTheme || {}),
        [section]: {
          ...DEFAULT_CUSTOM_THEME[section],
          ...(prev.customTheme?.[section] || {}),
          ...patch,
        },
      },
    }));
  };

  const applyCustomPreset = (presetKey) => {
    const preset = CUSTOM_THEME_PRESETS[presetKey];
    if (!preset) return;
    setDefaultContent((prev) => ({
      ...prev,
      baseLayout: 'custom-builder',
      customTheme: JSON.parse(JSON.stringify(preset.theme)),
    }));
    toast.success(`Preset "${preset.label}" diterapkan ke draft template`);
  };

  const handleUploadCustomAsset = async (e, assetKey) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCustomAssetKey(assetKey);
    try {
      const res = await templateService.uploadThumbnail(file, editId);
      const assetUrl = res?.data?.data?.url || res?.data?.url || res?.url || '';
      if (!assetUrl) throw new Error('URL upload tidak ditemukan');
      updateCustomThemeSection('assets', { [assetKey]: assetUrl });
      toast.success('Gambar/ornamen PNG berhasil diupload!');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Gagal mengupload gambar ornamen'
      );
    } finally {
      setUploadingCustomAssetKey(null);
      e.target.value = '';
    }
  };

  const liveDraftInvitation = isModalOpen
    ? buildTemplatePreviewData({
        id: editId || 'draft',
        template_code: (templateCode || 'custom-builder').trim().toLowerCase(),
        name: name || 'Draft Custom Template',
        thumbnail_url: thumbnailUrl,
        is_active: isActive,
        default_content_json: {
          ...defaultContent,
          baseLayout: effectiveBaseLayout || undefined,
        },
      })
    : null;

  const LivePreviewComponent = liveDraftInvitation
    ? getTemplateComponent(liveDraftInvitation.template_code, liveDraftInvitation)
    : null;

  const handlePreviewDraft = () => {
    if (liveDraftInvitation) {
      setPreviewModalData(liveDraftInvitation);
    }
  };

  const switchPreviewOpened = (nextOpened) => {
    if (previewIsOpened === nextOpened) {
      setPreviewRenderKey((k) => k + 1);
    } else {
      setPreviewIsOpened(nextOpened);
    }
  };

  const handleCloseBuilder = () => {
    document.querySelectorAll('audio').forEach((el) => {
      try {
        el.pause();
      } catch {}
    });
    setIsModalOpen(false);
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
    setDefaultContent({
      baseLayout: 'custom-builder',
      templateEventType: 'wedding',
      eventType: 'wedding',
      showSecondEvent: true,
      styleCategory: 'modern',
      customTheme: JSON.parse(JSON.stringify(DEFAULT_CUSTOM_THEME)),
    });
    setStudioTab('general');
    setPreviewIsOpened(false);
    setPreviewRenderKey((k) => k + 1);
    setMobileBuilderPane('editor');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tmpl) => {
    setIsEditing(true);
    setEditId(tmpl.id);
    setTemplateCode(tmpl.template_code);
    setName(tmpl.name);
    setThumbnailUrl(tmpl.thumbnail_url || '');
    setIsActive(tmpl.is_active);
    let parsedDefaults = tmpl.default_content_json || {};
    if (typeof parsedDefaults === 'string') {
      try {
        parsedDefaults = JSON.parse(parsedDefaults);
      } catch {
        parsedDefaults = {};
      }
    }
    setDefaultContent(parsedDefaults);
    setStudioTab('general');
    setPreviewIsOpened(false);
    setPreviewRenderKey((k) => k + 1);
    setMobileBuilderPane('editor');
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

  const handleUploadTemplateMusic = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsUploadingTemplateMusic(true);
    try {
      const res = await templateService.uploadMusic(file, isEditing ? editId : null);
      const uploadedUrl = res?.data?.url || res?.url;
      if (!uploadedUrl) throw new Error('URL musik tidak ditemukan');
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
      setDefaultContent((prev) => ({
        ...prev,
        musicUrl: uploadedUrl,
        musicTitle: cleanTitle,
      }));
      toast.success(`Musik "${cleanTitle}" berhasil diunggah!`);
    } catch (err) {
      toast.error(err.message || 'Gagal mengunggah file musik (.mp3).');
    } finally {
      setIsUploadingTemplateMusic(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!templateCode?.trim() || !name?.trim()) {
      setStudioTab('general');
      setMobileBuilderPane('editor');
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
      {activeTab === 'templates' && (() => {
        const visibleTemplates =
          filterEventCategory === 'all_filter'
            ? templates
            : templates.filter(
                (t) => getTemplateEventCategory(t) === filterEventCategory
              );

        return (
        <>
          {/* Filter Kategori Acara Template */}
          {!isLoading && templates.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all_filter', label: 'Semua Kategori' },
                ...TEMPLATE_EVENT_CATEGORIES.map((c) => ({
                  id: c.value,
                  label: c.shortLabel,
                })),
              ].map((tab) => {
                const count =
                  tab.id === 'all_filter'
                    ? templates.length
                    : templates.filter(
                        (t) => getTemplateEventCategory(t) === tab.id
                      ).length;
                const active = filterEventCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterEventCategory(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

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
          ) : visibleTemplates.length === 0 ? (
            <Card className="p-10 text-center space-y-3 text-slate-500">
              <Palette className="w-9 h-9 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-700">
                Belum ada template khusus untuk kategori ini.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Anda dapat mengedit salah satu template atau menambah template baru lalu memilih peruntukan kategori acara di pengaturannya.
              </p>
              <div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFilterEventCategory('all_filter')}
                >
                  Tampilkan Semua Kategori
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleTemplates.map((tmpl) => {
                const catMeta = getTemplateCategoryMeta(
                  getTemplateEventCategory(tmpl)
                );
                return (
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

                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-xs ${catMeta.badgeClass}`}
                      >
                        {catMeta.shortLabel}
                      </span>
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
                );
              })}
            </div>
          )}
        </>
        );
      })()}

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

      {/* Modal Add / Edit Template — Elementor-Style Split Builder */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 bg-slate-900 overflow-hidden ${
            previewModalData ? 'hidden' : 'flex flex-col'
          }`}
        >
          {/* Studio Top Bar */}
          <header className="h-14 shrink-0 bg-slate-900 border-b border-slate-800 px-3 sm:px-5 flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <BuilderLayersIcon className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold truncate">
                    {isEditing ? 'Template Studio Editor' : 'Template Studio Builder'}
                  </h3>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 truncate max-w-[160px]">
                    {(templateCode || 'custom-builder').trim().toLowerCase()}
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {defaultContent.templateEventType || 'wedding'}
                  </span>
                </div>
              </div>
            </div>

            {/* Responsive Toggle for < lg screens */}
            <div className="flex lg:hidden items-center bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setMobileBuilderPane('editor')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  mobileBuilderPane === 'editor'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Editor Sidebar
              </button>
              <button
                type="button"
                onClick={() => setMobileBuilderPane('preview')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  mobileBuilderPane === 'preview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BuilderPhoneIcon className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCloseBuilder}
                disabled={isSubmitting}
                className="!text-slate-300 hover:!text-white hover:!bg-slate-800"
              >
                Batal
              </Button>
              <Button
                type="submit"
                form="template-builder-form"
                variant="primary"
                size="sm"
                leftIcon={Save}
                isLoading={isSubmitting}
              >
                {isEditing ? 'Simpan' : 'Buat Template'}
              </Button>
            </div>
          </header>

          {/* Split Body: Left Sidebar Editor + Right Mobile Preview Stage */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* LEFT SIDEBAR: ELEMENTOR INSPECTOR */}
            <form
              id="template-builder-form"
              onSubmit={handleSubmit}
              className={`${
                mobileBuilderPane === 'editor' ? 'flex' : 'hidden'
              } lg:flex w-full lg:w-[460px] xl:w-[500px] shrink-0 bg-white border-r border-slate-200 flex-col h-full overflow-hidden`}
            >
              {/* Sticky Sidebar Tabs */}
              <div className="shrink-0 bg-slate-50 border-b border-slate-200 px-3 py-2.5">
                <div className="flex flex-wrap gap-1">
                  {CUSTOM_STUDIO_TABS.filter(
                    (tab) =>
                      isCustomBuilderActive ||
                      tab.id === 'general' ||
                      tab.id === 'media'
                  ).map((tab) => {
                    const TabIcon = tab.icon;
                    const active = studioTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStudioTab(tab.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                        }`}
                      >
                        <TabIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {!isCustomBuilderActive && (
                  <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between gap-2">
                    <span>
                      Engine memakai kerangka JSX bawaan. Pilih{' '}
                      <strong>Custom Dynamic Builder</strong> di tab Info &amp; Kerangka untuk membuka kustomisasi warna, PNG &amp; animasi.
                    </span>
                  </div>
                )}
              </div>

              {/* Scrollable Inspector Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* TAB 0: INFO & KERANGKA */}
                {studioTab === 'general' && (
                  <div className="space-y-4">
                    <Input
                      label="Kode Template (Unique Code)"
                      required
                      placeholder="wedding-pearl-custom"
                      value={templateCode}
                      onChange={(e) => setTemplateCode(e.target.value)}
                      helperText="Kode unik pengenal template (huruf kecil & tanda hubung)"
                    />

                    <Input
                      label="Nama Tampilan Template (Landing Page & Katalog)"
                      required
                      placeholder="Rustic Wood & Vintage"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />

                    <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                      <Select
                        label="Peruntukan Kategori Acara Template"
                        required
                        options={TEMPLATE_EVENT_CATEGORIES}
                        value={
                          defaultContent.templateEventType ||
                          defaultContent.eventType ||
                          'wedding'
                        }
                        onChange={(val) =>
                          setDefaultContent((prev) => ({
                            ...prev,
                            templateEventType: val,
                            eventType: val === 'all' ? 'wedding' : val,
                            showSecondEvent: val === 'wedding' || val === 'all',
                          }))
                        }
                        helperText="Menentukan jenis acara yang cocok & muncul di filter pembuatan undangan"
                      />

                      <Select
                        label="Kategori Gaya Desain (Landing Page)"
                        options={TEMPLATE_STYLE_OPTIONS}
                        value={defaultContent.styleCategory || 'modern'}
                        onChange={(val) =>
                          setDefaultContent((prev) => ({
                            ...prev,
                            styleCategory: val,
                          }))
                        }
                        helperText="Grup filter visual di halaman katalog Landing Page"
                      />

                      <Input
                        label="Label Tag Singkat (Landing Page, Opsional)"
                        placeholder="Contoh: Sweet 17th / Royal Gold / Corporate / Ethnic"
                        value={defaultContent.tag || ''}
                        onChange={(e) =>
                          setDefaultContent((prev) => ({
                            ...prev,
                            tag: e.target.value,
                          }))
                        }
                        helperText="Ditampilkan sebagai badge kecil di pojok kanan atas kartu katalog Landing Page"
                      />

                      <Select
                        label="Engine / Mode Kerangka Template"
                        options={ENGINE_LAYOUT_OPTIONS}
                        value={effectiveBaseLayout || '__builtin__'}
                        onChange={(val) => {
                          const nextLayout = val === '__builtin__' ? '' : val;
                          setDefaultContent((prev) => ({
                            ...prev,
                            baseLayout: nextLayout,
                            ...(nextLayout === 'custom-builder' && !prev.customTheme
                              ? {
                                  customTheme: JSON.parse(
                                    JSON.stringify(DEFAULT_CUSTOM_THEME)
                                  ),
                                }
                              : {}),
                          }));
                        }}
                        helperText="Gunakan Custom Dynamic Builder untuk bebas mengatur PNG/GIF, bingkai, warna, font, video & animasi dari sidebar."
                      />
                    </div>

                    <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between gap-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Foto Showcase (Landing Page)
                        </label>
                        <button
                          type="button"
                          onClick={() => modalFileInputRef.current?.click()}
                          disabled={isUploadingThumb}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isUploadingThumb ? 'Mengunggah...' : 'Upload Foto'}
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
                        <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
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
                      />
                    </div>

                    <div className="pt-1">
                      <Switch
                        checked={isActive}
                        onChange={setIsActive}
                        label="Tampilkan di Landing Page & Pembuatan Undangan"
                        helperText="Jika aktif, template ini tampil di katalog depan"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 1: GAYA, WARNA & FONT */}
                {isCustomBuilderActive && studioTab === 'style' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Starter Preset Cepat (Klik untuk terapkan)
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(CUSTOM_THEME_PRESETS).map(
                          ([presetKey, preset]) => (
                            <button
                              key={presetKey}
                              type="button"
                              onClick={() => applyCustomPreset(presetKey)}
                              className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs text-left transition-all cursor-pointer"
                            >
                              <div className="flex -space-x-1.5 shrink-0 pt-0.5">
                                <span
                                  className="w-5 h-5 rounded-full border border-white shadow-xs"
                                  style={{ backgroundColor: preset.theme.colors.bgPrimary }}
                                />
                                <span
                                  className="w-5 h-5 rounded-full border border-white shadow-xs"
                                  style={{ backgroundColor: preset.theme.colors.accent }}
                                />
                                <span
                                  className="w-5 h-5 rounded-full border border-white shadow-xs"
                                  style={{ backgroundColor: preset.theme.colors.buttonBg }}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">
                                  {preset.label}
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                  {preset.description}
                                </div>
                              </div>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <Select
                        label="Gaya Halaman Cover Pembuka"
                        options={CUSTOM_COVER_STYLES}
                        value={currentCustomTheme.coverStyle}
                        onChange={(val) => {
                          updateCustomThemeField('coverStyle', val);
                          switchPreviewOpened(false);
                        }}
                      />
                      <Select
                        label="Bentuk Bingkai Foto Utama / Mempelai"
                        options={CUSTOM_FRAME_SHAPES}
                        value={currentCustomTheme.photoFrameShape}
                        onChange={(val) =>
                          updateCustomThemeField('photoFrameShape', val)
                        }
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          Palet Warna Tema
                        </span>
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium"
                          style={{
                            backgroundColor: currentCustomTheme.colors.bgPrimary,
                            color: currentCustomTheme.colors.textPrimary,
                            borderColor: currentCustomTheme.colors.accent,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: currentCustomTheme.colors.accent }}
                          />
                          <span>Teks</span>
                          <span
                            className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                            style={{
                              backgroundColor: currentCustomTheme.colors.buttonBg,
                              color: currentCustomTheme.colors.buttonText,
                            }}
                          >
                            Tombol
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {CUSTOM_COLOR_FIELDS.map((field) => {
                          const val =
                            currentCustomTheme.colors[field.key] || '#ffffff';
                          return (
                            <div
                              key={field.key}
                              className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1"
                            >
                              <span className="block text-[11px] font-medium text-slate-600 truncate">
                                {field.label}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="color"
                                  value={val}
                                  onChange={(e) =>
                                    updateCustomThemeSection('colors', {
                                      [field.key]: e.target.value,
                                    })
                                  }
                                  className="w-7 h-7 rounded cursor-pointer border border-slate-300 bg-transparent p-0 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) =>
                                    updateCustomThemeSection('colors', {
                                      [field.key]: e.target.value,
                                    })
                                  }
                                  className="w-full text-[11px] font-mono px-1.5 py-1 rounded border border-slate-200 bg-white text-slate-700"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                      <Select
                        label="Font Kaligrafi / Script Nama"
                        options={CUSTOM_FONT_OPTIONS.scriptFont}
                        value={currentCustomTheme.typography.scriptFont}
                        onChange={(val) =>
                          updateCustomThemeSection('typography', {
                            scriptFont: val,
                          })
                        }
                      />
                      <Select
                        label="Font Judul / Heading Seksi"
                        options={CUSTOM_FONT_OPTIONS.headingFont}
                        value={currentCustomTheme.typography.headingFont}
                        onChange={(val) =>
                          updateCustomThemeSection('typography', {
                            headingFont: val,
                          })
                        }
                      />
                      <Select
                        label="Font Teks Isi (Body)"
                        options={CUSTOM_FONT_OPTIONS.bodyFont}
                        value={currentCustomTheme.typography.bodyFont}
                        onChange={(val) =>
                          updateCustomThemeSection('typography', {
                            bodyFont: val,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: GAMBAR & ORNAMEN PNG */}
                {isCustomBuilderActive && studioTab === 'assets' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-slate-700">
                      Upload <strong>PNG transparan, GIF animasi, SVG, atau JPG</strong>, tempel URL, atau pilih cepat ornamen bawaan. Setiap perubahan langsung terlihat di layar HP sebelah kanan.
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {CUSTOM_ASSET_SLOTS.map((slot) => {
                        const assetUrl =
                          currentCustomTheme.assets[slot.key] || '';
                        const isUploadingThis =
                          uploadingCustomAssetKey === slot.key;
                        return (
                          <div
                            key={slot.key}
                            className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <label className="block text-xs font-bold text-slate-800">
                                  {slot.label}
                                </label>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {slot.hint}
                                </p>
                              </div>
                              {assetUrl ? (
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <img
                                    src={assetUrl}
                                    alt={slot.label}
                                    className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-slate-100 p-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateCustomThemeSection('assets', {
                                        [slot.key]: '',
                                      })
                                    }
                                    className="text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
                                  >
                                    Kosongkan
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-400 shrink-0">
                                  Kosong
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                placeholder="/images/... atau https://..."
                                value={assetUrl}
                                onChange={(e) =>
                                  updateCustomThemeSection('assets', {
                                    [slot.key]: e.target.value,
                                  })
                                }
                                className="flex-1 min-w-0 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:outline-hidden text-slate-700"
                              />
                              <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 cursor-pointer shrink-0 transition-colors">
                                <BuilderUploadIcon className="w-3 h-3" />
                                <span>
                                  {isUploadingThis ? 'Uploading...' : 'Upload'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                                  className="hidden"
                                  disabled={isUploadingThis}
                                  onChange={(e) =>
                                    handleUploadCustomAsset(e, slot.key)
                                  }
                                />
                              </label>
                            </div>

                            {slot.presets?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {slot.presets.map((preset) => {
                                  const selected = assetUrl === preset.url;
                                  return (
                                    <button
                                      key={preset.url}
                                      type="button"
                                      onClick={() =>
                                        updateCustomThemeSection('assets', {
                                          [slot.key]: preset.url,
                                        })
                                      }
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors cursor-pointer ${
                                        selected
                                          ? 'bg-indigo-600 text-white border-indigo-600'
                                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                                      }`}
                                    >
                                      {preset.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {slot.positions?.length > 0 && (
                              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                  Posisi Ornamen (4 Pilihan)
                                </span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {slot.positions.map((posOpt) => {
                                    const activePos =
                                      (currentCustomTheme.assetPositions?.[slot.key] ||
                                        DEFAULT_CUSTOM_THEME.assetPositions[slot.key]) ===
                                      posOpt.value;
                                    return (
                                      <button
                                        key={posOpt.value}
                                        type="button"
                                        onClick={() =>
                                          updateCustomThemeSection('assetPositions', {
                                            [slot.key]: posOpt.value,
                                          })
                                        }
                                        className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold border text-left transition-all cursor-pointer truncate ${
                                          activePos
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                                        }`}
                                        title={posOpt.label}
                                      >
                                        {posOpt.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: ANIMASI & PARTIKEL */}
                {isCustomBuilderActive && studioTab === 'animations' && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                    <Select
                      label="Efek Transisi Pembukaan Cover"
                      options={CUSTOM_COVER_TRANSITIONS}
                      value={currentCustomTheme.animations.coverTransition}
                      onChange={(val) =>
                        updateCustomThemeSection('animations', {
                          coverTransition: val,
                        })
                      }
                    />

                    <Select
                      label="Partikel Melayang di Layar"
                      options={CUSTOM_PARTICLE_OPTIONS}
                      value={currentCustomTheme.animations.particleType}
                      onChange={(val) =>
                        updateCustomThemeSection('animations', {
                          particleType: val,
                        })
                      }
                    />

                    {currentCustomTheme.animations.particleType !== 'none' && (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <span className="block text-xs font-semibold text-slate-700">
                          Warna Partikel Melayang
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={
                              currentCustomTheme.animations.particleColor ||
                              '#eab8c2'
                            }
                            onChange={(e) =>
                              updateCustomThemeSection('animations', {
                                particleColor: e.target.value,
                              })
                            }
                            className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0 shrink-0"
                          />
                          <input
                            type="text"
                            value={
                              currentCustomTheme.animations.particleColor ||
                              '#eab8c2'
                            }
                            onChange={(e) =>
                              updateCustomThemeSection('animations', {
                                particleColor: e.target.value,
                              })
                            }
                            className="flex-1 text-xs font-mono px-2 py-1.5 rounded border border-slate-200 bg-white text-slate-700"
                          />
                        </div>
                      </div>
                    )}

                    <Select
                      label="Animasi Ornamen Bunga / Sudut PNG"
                      options={CUSTOM_ORNAMENT_MOTIONS}
                      value={currentCustomTheme.animations.ornamentMotion}
                      onChange={(val) =>
                        updateCustomThemeSection('animations', {
                          ornamentMotion: val,
                        })
                      }
                    />

                    <Select
                      label="Efek Muncul Seksi Saat Scroll"
                      options={CUSTOM_SCROLL_REVEALS}
                      value={currentCustomTheme.animations.scrollReveal}
                      onChange={(val) =>
                        updateCustomThemeSection('animations', {
                          scrollReveal: val,
                        })
                      }
                    />

                    <Select
                      label="Kecepatan Durasi Animasi Scroll"
                      options={CUSTOM_REVEAL_DURATIONS}
                      value={String(
                        currentCustomTheme.animations.revealDuration || '850'
                      )}
                      onChange={(val) =>
                        updateCustomThemeSection('animations', {
                          revealDuration: val,
                        })
                      }
                    />
                  </div>
                )}

                {/* TAB 4: VIDEO, AUDIO & DATA TEKS */}
                {studioTab === 'media' && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Video Latar, Musik &amp; Data Teks Bawaan
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Upload video background looping (.mp4), video prewedding, musik latar default, dan teks pembuka/lokasi bawaan tema ini.
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
                    <input
                      ref={modalMusicRef}
                      type="file"
                      accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/*"
                      className="hidden"
                      onChange={handleUploadTemplateMusic}
                    />

                    <div className="space-y-3">
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
                        {defaultContent.backgroundVideoUrl &&
                          defaultContent.backgroundVideoUrl !== 'none' && (
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

                    <div className="space-y-3">
                      <Input
                        label="Foto Cover Default"
                        placeholder="https://.../cover.webp"
                        value={defaultContent.fotoCover || ''}
                        onChange={(e) =>
                          setDefaultContent((prev) => ({ ...prev, fotoCover: e.target.value }))
                        }
                      />

                      {/* Musik Latar Default (.mp3 Upload Langsung) */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <BuilderMusicIcon className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Musik Latar Default (.mp3)</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => modalMusicRef.current?.click()}
                            disabled={isUploadingTemplateMusic}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold cursor-pointer disabled:opacity-60 transition-colors"
                          >
                            <Upload className="w-3 h-3" />
                            <span>
                              {isUploadingTemplateMusic
                                ? 'Mengunggah...'
                                : defaultContent.musicUrl
                                  ? 'Ganti MP3'
                                  : 'Upload MP3'}
                            </span>
                          </button>
                        </div>

                        {defaultContent.musicUrl ? (
                          <div className="p-2.5 rounded-xl bg-white border border-indigo-100 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {defaultContent.musicTitle ||
                                    defaultContent.musicUrl
                                      .split('/')
                                      .pop()
                                      ?.split('?')[0] ||
                                    'Audio Template'}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {defaultContent.musicUrl}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setDefaultContent((prev) => ({
                                    ...prev,
                                    musicUrl: '',
                                    musicTitle: '',
                                  }))
                                }
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Hapus</span>
                              </button>
                            </div>
                            <audio
                              controls
                              src={defaultContent.musicUrl}
                              className="w-full h-9"
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => modalMusicRef.current?.click()}
                            disabled={isUploadingTemplateMusic}
                            className="w-full py-4 px-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 flex flex-col items-center justify-center gap-1 text-center transition-colors cursor-pointer disabled:opacity-60"
                          >
                            <BuilderMusicIcon className="w-5 h-5 text-indigo-500" />
                            <span className="text-xs font-semibold text-slate-700">
                              {isUploadingTemplateMusic
                                ? 'Sedang mengunggah file MP3...'
                                : 'Klik untuk Upload File MP3 dari Komputer'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Mendukung format .mp3, .m4a, .wav (maks. 20 MB)
                            </span>
                          </button>
                        )}
                      </div>
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
                )}
              </div>

              {/* Sticky Sidebar Footer */}
              <div className="shrink-0 px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                {isCustomBuilderActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDefaultContent((prev) => ({
                        ...prev,
                        baseLayout: 'custom-builder',
                        customTheme: JSON.parse(
                          JSON.stringify(DEFAULT_CUSTOM_THEME)
                        ),
                      }));
                      toast.success('Desain Studio direset ke tema bawaan awal');
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <BuilderResetIcon className="w-3.5 h-3.5" />
                    <span>Reset Tema Default</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    Mode Kerangka JSX
                  </span>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={Save}
                  isLoading={isSubmitting}
                >
                  {isEditing ? 'Simpan Template' : 'Tambah Template'}
                </Button>
              </div>
            </form>

            {/* RIGHT CANVAS: LIVE MOBILE PHONE PREVIEW */}
            <section
              aria-label="Mobile Preview Canvas"
              className={`${
                mobileBuilderPane === 'preview' ? 'flex' : 'hidden'
              } lg:flex flex-1 bg-slate-950 relative flex-col items-center justify-center p-3 sm:p-5 overflow-hidden`}
            >
              <style>{`
                .builder-phone-viewport {
                  transform: translateZ(0);
                  contain: layout paint;
                }
                .builder-phone-viewport .builder-phone-scroll > *,
                .builder-phone-viewport .builder-phone-scroll > * > main,
                .builder-phone-viewport .builder-phone-scroll .fixed {
                  max-width: 100% !important;
                }
                .builder-phone-viewport .builder-phone-scroll > *,
                .builder-phone-viewport .builder-phone-scroll > * > main {
                  width: 100% !important;
                  margin-left: auto !important;
                  margin-right: auto !important;
                }
              `}</style>

              {/* Floating Preview Controls */}
              <div className="mb-3 flex flex-wrap items-center justify-center gap-2 z-20 shrink-0">
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
                  <button
                    type="button"
                    onClick={() => switchPreviewOpened(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      !previewIsOpened
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Sampul Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => switchPreviewOpened(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      previewIsOpened
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Isi Undangan
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewRenderKey((k) => k + 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors shadow-lg cursor-pointer"
                >
                  <BuilderRefreshIcon className="w-3.5 h-3.5" />
                  <span>Ulangi Animasi</span>
                </button>

                <button
                  type="button"
                  onClick={handlePreviewDraft}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-indigo-300 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-200 transition-colors shadow-lg cursor-pointer"
                >
                  <BuilderEyeIcon className="w-3.5 h-3.5" />
                  <span>Layar Penuh</span>
                </button>
              </div>

              {/* Smartphone Mockup Container */}
              <div className="w-[375px] sm:w-[390px] max-w-full flex-1 min-h-0 max-h-[780px] rounded-[44px] border-[10px] border-slate-800 bg-stone-950 shadow-2xl ring-1 ring-white/10 relative overflow-hidden flex flex-col">
                {/* Phone Top Bezel / Dynamic Island */}
                <div className="h-7 shrink-0 bg-slate-900 flex items-center justify-center relative z-30 pointer-events-none border-b border-white/5">
                  <div className="w-24 h-4 rounded-full bg-black flex items-center justify-end px-2 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-indigo-950 border border-indigo-400/30" />
                  </div>
                </div>

                {/* Constrained Fixed-Position Viewport */}
                <div className="builder-phone-viewport relative flex-1 w-full overflow-hidden bg-stone-950">
                  <div className="builder-phone-scroll w-full h-full overflow-y-auto overflow-x-hidden">
                    {LivePreviewComponent && liveDraftInvitation && (
                      <LivePreviewComponent
                        key={`${previewRenderKey}-${liveDraftInvitation.template_code}-${effectiveBaseLayout}`}
                        invitation={liveDraftInvitation}
                        guest={{
                          name: 'Tamu Undangan Terhormat',
                          category: 'VIP',
                          pax: 2,
                        }}
                        rsvps={liveDraftInvitation.rsvps || []}
                        isModalView={true}
                        defaultOpened={previewIsOpened}
                      />
                    )}
                  </div>
                </div>

                {/* Phone Home Indicator Bezel */}
                <div className="h-4 shrink-0 bg-slate-900 flex items-center justify-center pointer-events-none border-t border-white/5">
                  <div className="w-24 h-1 rounded-full bg-slate-700" />
                </div>
              </div>
            </section>
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
