import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Heart,
  Sparkles,
  Trees,
  Crown,
  Camera,
  Flame,
} from 'lucide-react';

/**
 * Konfigurasi Gaya & Aksen per Tema
 */
const THEME_STYLES = {
  forest: {
    bgGradient: 'from-[#04120B] via-[#082216] to-[#04120B]',
    accentColor: '#A6D854',
    secondaryColor: '#E8D27A',
    badgeBg: 'bg-[#A6D854]/15 text-[#A6D854] border-[#A6D854]/30',
    glass: 'bg-[#04120B]/75 border-[#A6D854]/25',
    titleFont: 'font-serif-theme',
    icon: Trees,
    eyebrow: 'Lush Botanical Wedding',
  },
  crimson: {
    bgGradient: 'from-[#2D0407] via-[#4A070A] to-[#1F0204]',
    accentColor: '#E5989B',
    secondaryColor: '#FAD2D4',
    badgeBg: 'bg-[#E5989B]/20 text-[#FAD2D4] border-[#E5989B]/40',
    glass: 'bg-[#2D0407]/75 border-[#E5989B]/25',
    titleFont: 'font-serif-theme',
    icon: Heart,
    eyebrow: 'Pure Romance & Elegance',
  },
  'royal-gold': {
    bgGradient: 'from-[#080A0E] via-[#111622] to-[#050608]',
    accentColor: '#DFB76C',
    secondaryColor: '#F5DE9C',
    badgeBg: 'bg-[#DFB76C]/20 text-[#F5DE9C] border-[#DFB76C]/40',
    glass: 'bg-[#080A0E]/80 border-[#DFB76C]/30',
    titleFont: 'font-serif-theme',
    icon: Crown,
    eyebrow: 'The Royal Celebration',
  },
  sunda: {
    bgGradient: 'from-[#0A2216] via-[#103824] to-[#06180F]',
    accentColor: '#D4AF37',
    secondaryColor: '#BFD8C5',
    badgeBg: 'bg-[#D4AF37]/20 text-[#F4E3A8] border-[#D4AF37]/30',
    glass: 'bg-[#0A2216]/80 border-[#D4AF37]/25',
    titleFont: 'font-fraunces',
    icon: Trees,
    eyebrow: 'Pernikahan Adat Sunda Priangan',
  },
  jawa: {
    bgGradient: 'from-[#1A0E08] via-[#2A180E] to-[#120804]',
    accentColor: '#C9A24B',
    secondaryColor: '#E8D5B7',
    badgeBg: 'bg-[#C9A24B]/20 text-[#F5E6C8] border-[#C9A24B]/35',
    glass: 'bg-[#1A0E08]/80 border-[#C9A24B]/30',
    titleFont: 'font-editorial',
    icon: Sparkles,
    eyebrow: 'Pawiwahan Ageng Keraton Jawa',
  },
  rustic: {
    bgGradient: 'from-[#1C120A] via-[#2E1D11] to-[#140C06]',
    accentColor: '#D8C3A5',
    secondaryColor: '#F3D9B8',
    badgeBg: 'bg-[#8C6239]/25 text-[#F3D9B8] border-[#D8C3A5]/30',
    glass: 'bg-[#1C120A]/80 border-[#D8C3A5]/25',
    titleFont: 'font-cursive',
    icon: Heart,
    eyebrow: 'Rustic Wood & Botanical Memories',
  },
  mildness: {
    bgGradient: 'from-[#1A1A18] via-[#2A2A26] to-[#121210]',
    accentColor: '#D6A24B',
    secondaryColor: '#E8D5A8',
    badgeBg: 'bg-[#D6A24B]/20 text-[#E8D5A8] border-[#D6A24B]/35',
    glass: 'bg-[#1A1A18]/80 border-[#D6A24B]/30',
    titleFont: 'font-cursive',
    icon: Heart,
    eyebrow: 'Earthy Sage & Luxury Ivory',
  },
  'snap-photo': {
    bgGradient: 'from-[#0A0B0E] via-[#14171F] to-[#07080A]',
    accentColor: '#F59E0B',
    secondaryColor: '#FCD34D',
    badgeBg: 'bg-[#F59E0B]/20 text-[#FCD34D] border-[#F59E0B]/35',
    glass: 'bg-[#0A0B0E]/85 border-[#F59E0B]/25',
    titleFont: 'font-cinzel',
    icon: Camera,
    eyebrow: 'Cinematic Dark Photography',
  },
  serein: {
    bgGradient: 'from-[#141312] via-[#22201D] to-[#0E0D0C]',
    accentColor: '#C8B79B',
    secondaryColor: '#E8E2D8',
    badgeBg: 'bg-[#C8B79B]/20 text-[#E8E2D8] border-[#C8B79B]/35',
    glass: 'bg-[#141312]/80 border-[#C8B79B]/30',
    titleFont: 'font-serif',
    icon: Sparkles,
    eyebrow: 'Minimalist French Editorial',
  },
  timeless: {
    bgGradient: 'from-[#191512] via-[#2D241E] to-[#120F0D]',
    accentColor: '#D8C3A5',
    secondaryColor: '#EADBC8',
    badgeBg: 'bg-[#D8C3A5]/20 text-[#EADBC8] border-[#D8C3A5]/35',
    glass: 'bg-[#191512]/80 border-[#D8C3A5]/30',
    titleFont: 'font-serif-theme',
    icon: Camera,
    eyebrow: 'Timeless Monochromatic Story',
  },
};

// Aliases agar cocok dengan kode template di database/registry
THEME_STYLES['forest-tropical'] = THEME_STYLES.forest;
THEME_STYLES['crimson-rose'] = THEME_STYLES.crimson;
THEME_STYLES['simple-rustic-4'] = THEME_STYLES.crimson;
THEME_STYLES['elegant-gold'] = THEME_STYLES['royal-gold'];
THEME_STYLES['sunda-priangan'] = THEME_STYLES.sunda;
THEME_STYLES['jawa-keraton'] = THEME_STYLES.jawa;
THEME_STYLES['rustic-wood'] = THEME_STYLES.rustic;
THEME_STYLES['timeless-snapshot'] = THEME_STYLES.timeless;

/**
 * Desktop Side Panel Component
 * Menampilkan panel sisi kiri di monitor desktop yang berisi:
 * - Slideshow foto prewedding beresolusi tinggi dengan kontrol slide
 * - Tombol collapse foto / expand panel
 * - Nama mempelai, countdown pernikahan, tanggal, dan lokasi
 */
export const DesktopSidePanel = ({
  theme = 'forest',
  invitationData = {},
  isOpened = false,
  isModalView = false,
}) => {
  // Jangan tampilkan jika di dalam modal preview sempit
  if (isModalView) return null;

  const style = THEME_STYLES[theme] || THEME_STYLES.forest;
  const Icon = style.icon || Trees;

  const data = invitationData || {};
  const {
    groomShort,
    brideShort,
    groom,
    bride,
    photoCover = '',
    photoGroom = '',
    photoBride = '',
    gallery = [],
    akad = {},
    timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 },
    ayatQuote = 'QS. Ar-Rum: 21',
  } = data;

  // Nama panggilan aman dari split error
  const safeGroomShort =
    groomShort ||
    (groom ? String(groom).split(',')[0].trim().split(' ')[0] : '') ||
    'Ahmad';
  const safeBrideShort =
    brideShort ||
    (bride ? String(bride).split(',')[0].trim().split(' ')[0] : '') ||
    'Aminah';

  const safeTimeLeft = timeLeft || { days: 0, hours: 0, minutes: 0, seconds: 0 };

  // Kumpulan foto prewedding untuk slider sisi kiri
  const photos = React.useMemo(() => {
    const list = [];
    if (photoCover && typeof photoCover === 'string') list.push(photoCover);
    if (photoGroom && typeof photoGroom === 'string' && !list.includes(photoGroom)) list.push(photoGroom);
    if (photoBride && typeof photoBride === 'string' && !list.includes(photoBride)) list.push(photoBride);
    if (Array.isArray(gallery) && gallery.length > 0) {
      gallery.forEach((p) => {
        const src = typeof p === 'string' ? p : p?.url || p?.src;
        if (src && !list.includes(src)) list.push(src);
      });
    }
    return list.length > 0
      ? list
      : [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
        ];
  }, [photoCover, photoGroom, photoBride, gallery]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPhotoCollapsed, setIsPhotoCollapsed] = useState(false);

  // Auto rotate foto setiap 6 detik
  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  return (
    <aside
      aria-label="Informasi Mempelai Desktop"
      className={`fixed inset-y-0 left-0 lg:right-[480px] xl:right-[520px] z-10 hidden lg:flex flex-col justify-between overflow-hidden transition-all duration-700 ease-out ${
        isOpened ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
      }`}
    >
      {/* Background Slideshow Foto Prewedding */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {photos.map((src, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={src}
                alt={`Prewedding ${idx + 1}`}
                className={`h-full w-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Dynamic Dark Gradient Overlay */}
        <div
          className={`absolute inset-0 z-20 bg-gradient-to-t ${style.bgGradient} opacity-85 backdrop-blur-[2px] transition-opacity duration-500 ${
            isPhotoCollapsed ? 'opacity-35' : 'opacity-80'
          }`}
        />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-black/85 pointer-events-none" />
      </div>

      {/* Top Bar: Eyebrow & Toggle Collapse Foto */}
      <div className="relative z-30 flex items-center justify-between p-8 sm:p-10">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border shadow-lg backdrop-blur-md"
            style={{
              borderColor: `${style.accentColor}55`,
              background: 'rgba(0,0,0,0.5)',
            }}
          >
            <Icon className="h-4 w-4" style={{ color: style.accentColor }} />
          </div>
          <span
            className="text-[11px] font-sans font-semibold uppercase tracking-[0.3em]"
            style={{ color: style.secondaryColor }}
          >
            {style.eyebrow}
          </span>
        </div>

        {/* Tombol Collapse / Expand Info Foto */}
        <button
          type="button"
          onClick={() => setIsPhotoCollapsed(!isPhotoCollapsed)}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/75 hover:border-white/40 active:scale-95 cursor-pointer"
          title={isPhotoCollapsed ? 'Tampilkan Informasi Lengkap' : 'Lihat Foto Penuh (Collapse Info)'}
        >
          {isPhotoCollapsed ? (
            <>
              <Minimize2 className="h-3.5 w-3.5 text-amber-300" />
              <span>Tampilkan Info</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5 text-amber-300" />
              <span>Lihat Foto Penuh</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Area (Bisa di-collapse untuk melihat foto prewedding secara penuh) */}
      <div
        className={`relative z-30 my-auto px-8 sm:px-12 lg:px-16 py-6 transition-all duration-700 ease-in-out ${
          isPhotoCollapsed
            ? 'opacity-0 translate-y-8 pointer-events-none'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="max-w-2xl space-y-6">
          <div className="space-y-3">
            <p
              className="text-xs uppercase tracking-[0.4em] font-medium"
              style={{ color: style.secondaryColor }}
            >
              The Wedding Of
            </p>
            <h1
              className={`${style.titleFont} text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]`}
            >
              {safeGroomShort}
              <span
                className="font-cursive mx-3 text-4xl sm:text-5xl xl:text-6xl font-normal"
                style={{ color: style.accentColor }}
              >
                &amp;
              </span>
              {safeBrideShort}
            </h1>
          </div>

          {/* Tanggal & Lokasi Utama */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-stone-200">
            {akad?.tanggal && (
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-1.5 border border-white/10 backdrop-blur-md">
                <Calendar className="h-3.5 w-3.5" style={{ color: style.accentColor }} />
                <span>{akad.tanggal}</span>
              </div>
            )}
            {akad?.lokasi && (
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-1.5 border border-white/10 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5" style={{ color: style.accentColor }} />
                <span className="truncate max-w-[220px]">{akad.lokasi}</span>
              </div>
            )}
          </div>

          {/* Countdown Pernikahan Desktop */}
          <div className="pt-2">
            <p
              className="mb-3 text-[11px] font-sans uppercase tracking-[0.3em] font-medium"
              style={{ color: style.secondaryColor }}
            >
              Menghitung Hari Bahagia
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: 'HARI', val: safeTimeLeft.days },
                { label: 'JAM', val: safeTimeLeft.hours },
                { label: 'MENIT', val: safeTimeLeft.minutes },
                { label: 'DETIK', val: safeTimeLeft.seconds },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-2xl border px-4 py-3 min-w-[70px] shadow-2xl backdrop-blur-md"
                  style={{
                    borderColor: `${style.accentColor}35`,
                    background: 'rgba(0,0,0,0.55)',
                  }}
                >
                  <span
                    className="text-2xl font-bold font-serif-theme leading-none"
                    style={{ color: style.accentColor }}
                  >
                    {String(item.val || 0).padStart(2, '0')}
                  </span>
                  <span className="mt-1 text-[9px] font-sans tracking-widest text-stone-300 font-semibold">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kutipan Ayat */}
          {ayatQuote && (
            <p className="max-w-md text-xs italic leading-relaxed text-stone-300/90 pt-2 border-l-2 pl-4" style={{ borderColor: style.accentColor }}>
              &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.&rdquo;
              <span className="block mt-1 text-[10px] not-italic font-semibold text-stone-400">
                — {ayatQuote}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Bottom Bar: Slider Navigation & Thumbnails */}
      <div className="relative z-30 flex items-center justify-between p-8 sm:p-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        {/* Indikator Slider & Thumbnail Foto */}
        <div className="flex items-center gap-2">
          {photos.slice(0, 5).map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-11 w-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'border-white scale-110 shadow-lg'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="Thumb" className="h-full w-full object-cover" />
            </button>
          ))}
          {photos.length > 5 && (
            <span className="text-[10px] text-stone-400 font-sans pl-1">
              +{photos.length - 5}
            </span>
          )}
        </div>

        {/* Panah Navigasi Slider */}
        {photos.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto Sebelumnya"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-md transition-all hover:bg-white hover:text-black active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-sans text-stone-300 font-medium px-1">
              {currentSlide + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto Selanjutnya"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-md transition-all hover:bg-white hover:text-black active:scale-90 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
