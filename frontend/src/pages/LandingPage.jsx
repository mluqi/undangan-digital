import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react';
import { DelleaLogo } from '../components/ui/DelleaLogo';
import { templateService } from '../services/templateService';

const TEMPLATE_META_BY_CODE = {
  mildness: { category: 'modern', tag: 'Earthy Sage' },
  'snap-photo': { category: 'modern', tag: 'Darkroom' },
  'timeless-snapshot': { category: 'rustic', tag: 'Archival' },
  serein: { category: 'modern', tag: 'Editorial' },
  'rustic-wood': { category: 'rustic', tag: 'Wood & Leaf' },
  'elegant-gold': { category: 'modern', tag: 'Royal Gold' },
  'royal-gold': { category: 'modern', tag: 'Royal Gold' },
  'jawa-keraton': { category: 'tradisional', tag: 'Adat Jawa' },
  'sunda-priangan': { category: 'tradisional', tag: 'Adat Sunda' },
  'crimson-rose': { category: 'modern', tag: 'Signature' },
  'forest-tropical': { category: 'rustic', tag: 'Botanical' },
  'jawa-kembar-mayang': { category: 'tradisional', tag: 'Heritage' },
  'noir-velvet': { category: 'modern', tag: 'Cinematic Video' },
  'drapery-pink': { category: 'modern', tag: 'Romantic Lace' },
};

const DEFAULT_DB_TEMPLATES = [
  {
    id: 1,
    no: '01',
    code: 'mildness',
    name: 'Mildness Earthy Sage & Luxury Ivory',
    category: 'modern',
    tag: 'Earthy Sage',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    no: '02',
    code: 'snap-photo',
    name: 'Snap Photo Cinematic Dark',
    category: 'modern',
    tag: 'Darkroom',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    no: '03',
    code: 'timeless-snapshot',
    name: 'Timeless Snapshot Vintage Polaroid',
    category: 'rustic',
    tag: 'Archival',
    image:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    no: '04',
    code: 'serein',
    name: 'Serein Minimalist Luxury',
    category: 'modern',
    tag: 'Editorial',
    image:
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    no: '05',
    code: 'rustic-wood',
    name: 'Rustic Wood & Botanical',
    category: 'rustic',
    tag: 'Wood & Leaf',
    image:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    no: '06',
    code: 'elegant-gold',
    name: 'Royal Gold & Black Velvet',
    category: 'modern',
    tag: 'Royal Gold',
    image:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    no: '07',
    code: 'jawa-keraton',
    name: 'Keraton Jawa Sogan & Emas',
    category: 'tradisional',
    tag: 'Adat Jawa',
    image:
      'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    no: '08',
    code: 'sunda-priangan',
    name: 'Priangan Hijau Sunda',
    category: 'tradisional',
    tag: 'Adat Sunda',
    image:
      'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 9,
    no: '09',
    code: 'crimson-rose',
    name: 'Crimson Rose & Pure Elegance',
    category: 'modern',
    tag: 'Signature',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 10,
    no: '10',
    code: 'forest-tropical',
    name: 'Forest Tropical & Botanical Luxury',
    category: 'rustic',
    tag: 'Botanical',
    image:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 11,
    no: '11',
    code: 'jawa-kembar-mayang',
    name: 'Kembar Mayang Javanese Heritage',
    category: 'tradisional',
    tag: 'Heritage',
    image: '/images/templates/kembar-mayang-thumb.png',
  },
  {
    id: 12,
    no: '12',
    code: 'noir-velvet',
    name: 'Noir Velvet Motion',
    category: 'modern',
    tag: 'Cinematic Video',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 13,
    no: '13',
    code: 'drapery-pink',
    name: 'Drapery Pink & Vintage Lace',
    category: 'modern',
    tag: 'Romantic Lace',
    image: '/images/drapery-pink/demo-couple-1.jpg',
  },
];

const SYSTEM_MODES = [
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
];

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.14 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={visible ? 'visible' : 'hidden'}
      style={{ transitionDelay: `${delay}ms` }}
      className={`dellea-reveal ${className}`}
    >
      {children}
    </div>
  );
}

export const LandingPage = ({ isAuthenticated = false, onNavigate }) => {
  const [templates, setTemplates] = useState(DEFAULT_DB_TEMPLATES);
  const [cms, setCms] = useState({
    heroSubtitle:
      'Undangan pernikahan digital. Mandiri, terkoneksi QR Check-In sistem luar, atau dirancang custom.',
    systemModes: SYSTEM_MODES,
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMode, setActiveMode] = useState('qrsync');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    templateService
      .getAll(true)
      .then((res) => {
        const dbList = res?.data;
        if (mounted && Array.isArray(dbList) && dbList.length > 0) {
          const sorted = [...dbList].sort((a, b) => a.id - b.id);
          const mapped = sorted.map((t, idx) => {
            const meta = TEMPLATE_META_BY_CODE[t.template_code] || {
              category:
                t.template_code.includes('jawa') ||
                t.template_code.includes('sunda')
                  ? 'tradisional'
                  : t.template_code.includes('rustic') ||
                    t.template_code.includes('forest')
                  ? 'rustic'
                  : 'modern',
              tag: 'Atelier',
            };
            const fallbackImg =
              DEFAULT_DB_TEMPLATES.find((d) => d.code === t.template_code)
                ?.image ||
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80';
            return {
              id: t.id,
              no: String(idx + 1).padStart(2, '0'),
              code: t.template_code,
              name: t.name,
              category: meta.category,
              tag: meta.tag,
              image: t.thumbnail_url || fallbackImg,
            };
          });
          setTemplates(mapped);
        }
      })
      .catch(() => {});

    templateService
      .getLandingCms()
      .then((res) => {
        if (mounted && res?.data) {
          setCms((prev) => ({
            ...prev,
            ...res.data,
            systemModes:
              Array.isArray(res.data.systemModes) &&
              res.data.systemModes.length > 0
                ? res.data.systemModes
                : prev.systemModes,
            pricelist:
              Array.isArray(res.data.pricelist) && res.data.pricelist.length > 0
                ? res.data.pricelist
                : prev.pricelist,
          }));
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const filteredTemplates =
    activeCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const modesList = cms.systemModes || SYSTEM_MODES;
  const currentMode =
    modesList.find((m) => m.id === activeMode) || modesList[1] || SYSTEM_MODES[1];

  const handleGoAuth = () => {
    if (onNavigate) {
      onNavigate(isAuthenticated ? '/dashboard' : '/login');
    } else {
      window.location.href = isAuthenticated ? '/dashboard' : '/login';
    }
  };

  return (
    <div
      className="min-h-screen bg-[#E6D2BE] text-[#2B0C0C] selection:bg-[#4A1515] selection:text-[#E6D2BE]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ============================================================== */}
      {/* FLOATING MINIMAL HEADER                                        */}
      {/* ============================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
          scrolled
            ? 'bg-[#2B0C0C]/95 backdrop-blur-md border-b border-[#633A2C]/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="focus:outline-none"
          >
            <DelleaLogo
              variant="horizontal"
              theme="light"
              size="sm"
              showTagline={false}
            />
          </a>

          <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.26em] text-[#D8BFA6]">
            <a href="#koleksi" className="hover:text-[#E6D2BE] transition-colors">
              Katalog
            </a>
            <a href="#sistem" className="hover:text-[#E6D2BE] transition-colors">
              Sistem
            </a>
            <a href="#pricelist" className="hover:text-[#E6D2BE] transition-colors">
              Pricelist
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <button
              type="button"
              onClick={handleGoAuth}
              className="px-5 py-2 border border-[#C9A98B]/60 hover:border-[#E6D2BE] hover:bg-[#E6D2BE] hover:text-[#2B0C0C] text-[#E6D2BE] text-[10px] uppercase tracking-[0.24em] font-semibold transition-all duration-300 cursor-pointer"
            >
              {isAuthenticated ? 'Dashboard' : 'Masuk'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#E6D2BE]"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2B0C0C] border-b border-[#633A2C] px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3 text-xs uppercase tracking-[0.24em] text-[#E6D2BE]">
              <a href="#koleksi" onClick={() => setMobileMenuOpen(false)}>
                Katalog
              </a>
              <a href="#sistem" onClick={() => setMobileMenuOpen(false)}>
                Sistem
              </a>
              <a href="#pricelist" onClick={() => setMobileMenuOpen(false)}>
                Pricelist
              </a>
            </div>
            <button
              type="button"
              onClick={handleGoAuth}
              className="w-full py-3 bg-[#E6D2BE] text-[#2B0C0C] text-xs uppercase tracking-[0.22em] font-semibold"
            >
              {isAuthenticated ? 'Dashboard' : 'Masuk'}
            </button>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* FULL-SCREEN ATELIER HERO (#4A1515 MULBERRY BURGUNDY)           */}
      {/* ============================================================== */}
      <section className="relative min-h-dvh bg-[#4A1515] text-[#E6D2BE] flex flex-col justify-between px-6 sm:px-10 pt-28 pb-10 border-b border-[#633A2C] overflow-hidden">
        {/* Subtle radial vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(99,58,44,0.28) 0%, rgba(43,12,12,0.65) 100%)',
          }}
        />

        <div className="relative z-10 my-auto max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="dellea-float inline-block mb-6">
              <DelleaLogo variant="mark" theme="light" size="xl" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1
              className="text-5xl sm:text-7xl lg:text-[96px] font-normal uppercase leading-[0.95] tracking-[0.08em] text-[#E6D2BE]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              SAMSKARA
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <div className="flex items-center justify-center gap-5 mt-5 text-[10px] sm:text-xs uppercase tracking-[0.38em] text-[#D8BFA6]">
              <span>ETERNAL</span>
              <span className="text-sm text-[#E6D2BE]">☾</span>
              <span>MEMORIES</span>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 text-xs sm:text-sm text-[#D8BFA6]/90 max-w-md mx-auto leading-relaxed font-light tracking-wide">
              {cms.heroSubtitle}
            </p>
          </Reveal>

          <Reveal delay={420}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#koleksi"
                className="px-8 py-3.5 bg-[#E6D2BE] hover:bg-[#D8BFA6] text-[#2B0C0C] text-[11px] uppercase tracking-[0.24em] font-semibold transition-all duration-300"
              >
                Lihat Koleksi
              </a>
              <a
                href="#pricelist"
                className="px-8 py-3.5 border border-[#C9A98B]/60 hover:border-[#E6D2BE] text-[#E6D2BE] text-[11px] uppercase tracking-[0.24em] transition-all duration-300"
              >
                Pricelist &amp; Custom
              </a>
            </div>
          </Reveal>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.34em] text-[#C9A98B]">
            Scroll
          </span>
          <div className="w-px h-10 bg-[#633A2C] overflow-hidden">
            <div className="w-full h-full bg-[#E6D2BE] dellea-scroll-indicator" />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE SYSTEM SWITCHER (MINIMAL WORDS, KINETIC STAGE)     */}
      {/* ============================================================== */}
      <section id="sistem" className="bg-[#E6D2BE] border-b border-[#C9A98B] py-20 sm:py-28 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-[#C9A98B]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#633A2C] mb-2">
                  Fleksibilitas Sistem
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-normal text-[#2B0C0C]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Tiga Mode <span className="italic text-[#4A1515]">Penggunaan</span>
                </h2>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex border border-[#3B1010]">
                {modesList.map((m) => {
                  const active = activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveMode(m.id)}
                      className={`px-4 sm:px-6 py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-pointer ${
                        active
                          ? 'bg-[#3B1010] text-[#E6D2BE]'
                          : 'bg-transparent text-[#3B1010] hover:bg-[#D8BFA6]'
                      }`}
                    >
                      <span className="hidden sm:inline mr-1.5 opacity-60">
                        {m.num}.
                      </span>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Animated Stage */}
          <div
            key={currentMode.id}
            className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-500"
          >
            <div className="lg:col-span-6 space-y-6">
              <span
                className="text-6xl sm:text-7xl italic font-light text-[#633A2C]/45 block leading-none"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {currentMode.num}
              </span>
              <h3
                className="text-3xl sm:text-5xl font-normal text-[#2B0C0C] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {currentMode.title}
              </h3>
              <p className="text-sm text-[#3B1010] max-w-md leading-relaxed">
                {currentMode.caption}
              </p>

              <div className="pt-4 flex flex-wrap gap-2">
                {currentMode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 border border-[#633A2C]/50 bg-[#E0D6B8] text-[10px] uppercase tracking-[0.18em] text-[#2B0C0C] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/11] overflow-hidden border border-[#633A2C] bg-[#2B0C0C] group">
                <img
                  src={currentMode.image}
                  alt={currentMode.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B0C0C]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[#E6D2BE]">
                  <span className="text-[10px] uppercase tracking-[0.28em]">
                    {currentMode.label}
                  </span>
                  <DelleaLogo variant="wreath" theme="light" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* VISUAL LOOKBOOK GALLERY (MINIMAL TEXT, STAGGERED MOTION)       */}
      {/* ============================================================== */}
      <section id="koleksi" className="bg-[#E0D6B8] border-b border-[#C9A98B] py-20 sm:py-28 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-[#C9A98B]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#633A2C] mb-2">
                  Kurasi Katalog
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-normal text-[#2B0C0C]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Pilih <span className="italic text-[#4A1515]">Tema</span>
                </h2>
              </div>

              <div className="flex gap-6 text-[11px] uppercase tracking-[0.22em]">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'modern', label: 'Modern' },
                  { id: 'tradisional', label: 'Adat' },
                  { id: 'rustic', label: 'Botanical' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`pb-1 transition-all cursor-pointer ${
                      activeCategory === tab.id
                        ? 'text-[#2B0C0C] font-bold border-b-2 border-[#3B1010]'
                        : 'text-[#633A2C] hover:text-[#2B0C0C]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl, idx) => (
              <Reveal key={tpl.code} delay={idx * 70}>
                <a href={`/preview/${tpl.code}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#2B0C0C] border border-[#C9A98B]">
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108 opacity-92"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B0C0C]/85 via-transparent to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />

                    <span className="absolute top-4 left-4 text-[10px] font-mono tracking-widest text-[#E6D2BE]">
                      /{tpl.no}
                    </span>
                    <span className="absolute top-4 right-4 px-2.5 py-1 bg-[#2B0C0C]/70 backdrop-blur-xs text-[9px] uppercase tracking-[0.22em] text-[#E6D2BE]">
                      {tpl.tag}
                    </span>

                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-[#E6D2BE]">
                      <h3
                        className="text-2xl sm:text-3xl italic font-normal leading-tight"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}
                      >
                        {tpl.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-[#C9A98B] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                        <span>Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* ULTRA-CONCISE PRICELIST & CUSTOM (#3B1010 OXBLOOD)             */}
      {/* ============================================================== */}
      <section
        id="pricelist"
        className="bg-[#3B1010] text-[#E6D2BE] border-b border-[#633A2C] py-20 sm:py-28 px-6 sm:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10 border-b border-[#633A2C]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#C9A98B] mb-2">
                  Investasi
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-normal text-[#E6D2BE]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Pricelist &amp; <span className="italic text-[#C9A98B]">Custom</span>
                </h2>
              </div>
              <p className="text-xs text-[#D8BFA6] tracking-wide">
                Pilih mode mandiri, integrasi QR luar, atau custom penuh.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#633A2C] border-b border-[#633A2C]">
            {(cms.pricelist || []).map((pkg, idx) => (
              <Reveal
                key={pkg.tier}
                delay={idx * 120}
                className={`py-10 ${
                  idx === 0
                    ? 'lg:pr-10'
                    : idx === 1
                    ? 'lg:px-10 bg-[#4A1515]/70'
                    : 'lg:pl-10'
                } flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-[#C9A98B] block mb-2">
                    {pkg.tier}
                  </span>
                  <h3
                    className="text-3xl font-normal text-[#E6D2BE]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-[#D8BFA6] mt-1">{pkg.note}</p>

                  <div className="my-7 py-5 border-y border-[#633A2C] flex items-baseline gap-1.5">
                    <span className="text-xs uppercase tracking-widest text-[#C9A98B]">
                      IDR
                    </span>
                    <span
                      className="text-5xl font-normal text-[#E6D2BE]"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {pkg.price}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#D8BFA6]">
                    {pkg.items.map((it) => (
                      <li key={it} className="flex items-center gap-2.5">
                        <span className="text-[#C9A98B]">—</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleGoAuth}
                  className={`mt-9 w-full py-3.5 text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-300 cursor-pointer ${
                    pkg.featured
                      ? 'bg-[#E6D2BE] hover:bg-[#D8BFA6] text-[#2B0C0C]'
                      : 'border border-[#C9A98B] hover:bg-[#E6D2BE] hover:text-[#2B0C0C] text-[#E6D2BE]'
                  }`}
                >
                  Pilih Paket
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MINIMALIST FOOTER (#2B0C0C)                                    */}
      {/* ============================================================== */}
      <footer className="bg-[#2B0C0C] text-[#E6D2BE] py-16 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <Reveal>
            <DelleaLogo variant="stacked" theme="light" size="md" />
          </Reveal>

          <div className="mt-10 pt-8 border-t border-[#4A1515] w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-[#C9A98B]">
            <span>© {new Date().getFullYear()} SAMSKARA</span>
            <button
              type="button"
              onClick={handleGoAuth}
              className="inline-flex items-center gap-2 text-[#E6D2BE] hover:text-[#C9A98B] transition-colors cursor-pointer"
            >
              <span>{isAuthenticated ? 'Buka Dashboard' : 'Masuk Panel Akun'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
