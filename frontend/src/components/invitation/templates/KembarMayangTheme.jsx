import { useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Send,
  Navigation,
  Bell,
  Leaf,
  Gift,
  ChevronDown,
  Heart,
  Sparkles,
} from 'lucide-react';

const InstagramIcon = ({ className = 'w-3.5 h-3.5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { GalleryLightbox } from '../GalleryLightbox';
import { useScrollMotion, useParallax } from '../useScrollMotion';
import { ScrollProgress, Burst } from '../MotionKit';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { DesktopSidePanel } from '../DesktopSidePanel';

/**
 * TEMA KEMBAR MAYANG — "Javanese Heritage & Warm Parchment"
 * Terinspirasi dari estetika pernikahan adat Jawa Leafitation (Invi / Ifa & Zaki):
 * - Latar kertas perkamen buatan tangan (warm handmade watercolor paper texture)
 * - Ilustrasi megah Pendopo Joglo tradisional di perbukitan berkabut (watercolor sepia)
 * - Ornamen wayang Gunungan / Kayon emas & pembatas kaligrafi sulur filigree
 * - Tipografi klasik: Vidaloka (serif formal), Imperial/Pinyon Script (nama panggilan kuratif),
 *   Cinzel & Aboreto (aksen huruf kapital berjarak renggang)
 * - Palet warna: Cokelat sogan tua (#3D2517), emas antik (#C59B3F), krem perkamen (#F8F4ED)
 * Kode template di database: `jawa-kembar-mayang`
 */

const ASSETS = {
  paperBg: '/images/kembar-paper-bg.jpg',
  divider: '/images/kembar-divider.png',
  gununganGold: '/images/kembar-gunungan-gold.png',
  flowerCluster: '/images/kembar-flower-cluster.png',
  watermark: '/images/kembar-watermark.jpg',
  jogloMempelai: '/images/kembar-joglo-mempelai.png',
  jogloGunungan: '/images/kembar-joglo-gunungan.jpg',
  coverIllustration: '/images/kembar-cover.jpg',
};

/* Kelopak bunga melati & mawar melayang lembut (Animasi CSS) */
const PetalRain = ({ count = 12 }) => {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 89) % 100}%`,
        duration: `${8 + ((i * 5) % 7)}s`,
        delay: `${(i * 1.1) % 6}s`,
        scale: 0.7 + ((i * 11) % 5) / 10,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="km-petal"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  );
};

/* Ornamen pembatas kaligrafi sulur khas Jawa */
const FiligreeDivider = ({ className = '', maxWidth = 260 }) => (
  <div className={`flex items-center justify-center my-3 ${className}`} aria-hidden="true">
    <img
      src={ASSETS.divider}
      alt=""
      className="h-auto pointer-events-none select-none opacity-90"
      style={{ maxWidth, width: '75%' }}
      loading="lazy"
    />
  </div>
);

/* Gunungan Kayon Emas */
const GununganEmblem = ({ size = 64, className = '' }) => (
  <div className={`flex justify-center items-center ${className}`} aria-hidden="true">
    <img
      src={ASSETS.gununganGold}
      alt="Gunungan Wayang"
      className="h-auto pointer-events-none select-none drop-shadow-sm"
      style={{ width: size }}
      loading="lazy"
    />
  </div>
);

/* Kluster Bunga Pojok (Botanical Watercolor Accent) */
const FlowerCorner = ({ position = 'bottom-right', size = 180, className = '' }) => {
  const posStyles = {
    'bottom-right': 'bottom-0 right-0 transform translate-x-4 translate-y-4',
    'bottom-left': 'bottom-0 left-0 transform -scale-x-100 -translate-x-4 translate-y-4',
    'top-right': 'top-0 right-0 transform -scale-y-100 translate-x-4 -translate-y-4',
    'top-left': 'top-0 left-0 transform -scale-100 -translate-x-4 -translate-y-4',
  }[position];

  return (
    <img
      src={ASSETS.flowerCluster}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`absolute pointer-events-none select-none opacity-85 z-10 ${posStyles} ${className}`}
      style={{ width: size }}
    />
  );
};

/* Judul Section Terpadu */
const SectionHeader = ({ eyebrow, title, subtitle, dark = false }) => (
  <div className="text-center relative z-10 px-4">
    {eyebrow && (
      <p
        className={`text-[11px] tracking-[0.35em] uppercase font-cinzel font-semibold ${
          dark ? 'text-[#D9BE86]' : 'text-[#8E6334]'
        }`}
      >
        {eyebrow}
      </p>
    )}
    <h3
      className={`text-4xl sm:text-5xl leading-tight mt-1 ${
        dark ? 'text-[#FBF7ED]' : 'text-[#3D2517]'
      } font-imperial`}
    >
      {title}
    </h3>
    <FiligreeDivider maxWidth={220} className={dark ? 'filter invert brightness-125 opacity-70' : ''} />
    {subtitle && (
      <p
        className={`text-xs sm:text-sm max-w-sm mx-auto leading-relaxed mt-2 ${
          dark ? 'text-[#EFE5D3]' : 'text-[#5C4533]'
        } font-poppins`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export const KembarMayangTheme = (props) => {
  const d = useInvitationData(props);
  const motionRef = useRef(null);
  const [giftOpen, setGiftOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [coverGone, setCoverGone] = useState(Boolean(props?.defaultOpened) || d.isOpened);

  useScrollMotion(motionRef, d.isOpened);
  useParallax(motionRef, d.isOpened, 0.12);

  const handleOpen = () => {
    setOpening(true);
    d.openInvitation();
    window.setTimeout(() => {
      setCoverGone(true);
      setOpening(false);
    }, 1200);
  };

  const countdownItems = [
    { label: 'Hari', val: d.timeLeft?.days ?? 0 },
    { label: 'Jam', val: d.timeLeft?.hours ?? 0 },
    { label: 'Menit', val: d.timeLeft?.minutes ?? 0 },
    { label: 'Detik', val: d.timeLeft?.seconds ?? 0 },
  ];

  const eventsList = [
    {
      title: d.akad?.judul || (d.eventType === 'wedding' ? 'Akad Nikah' : 'Acara Utama'),
      date: d.akad?.tanggal,
      time: d.akad?.waktu,
      location: d.akad?.lokasi,
      address: d.akad?.alamat,
      mapUrl: d.akad?.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(d.akad?.lokasi || '')}`,
    },
    ...(d.showSecondEvent !== false
      ? [
          {
            title: d.resepsi?.judul || (d.eventType === 'wedding' ? 'Resepsi' : 'Sesi 2'),
            date: d.resepsi?.tanggal,
            time: d.resepsi?.waktu,
            location: d.resepsi?.lokasi,
            address: d.resepsi?.alamat,
            mapUrl:
              d.resepsi?.mapUrl ||
              `https://maps.google.com/?q=${encodeURIComponent(d.resepsi?.lokasi || '')}`,
          },
        ]
      : []),
  ];

  const couple = [
    ...(d.showSecondPerson !== false
      ? [
          {
            key: 'bride',
            role: d.person2Role || 'Mempelai Wanita',
            photo: d.photoBride,
            short: d.brideShort,
            full: d.bride,
            label: 'Putri Pertama dari',
            father: d.brideFather,
            mother: d.brideMother,
            ig: d.brideInstagram || 'faifaak',
          },
        ]
      : []),
    {
      key: 'groom',
      role: d.person1Role || 'Mempelai Pria',
      photo: d.photoGroom,
      short: d.groomShort,
      full: d.groom,
      label: d.showSecondPerson !== false ? 'Putra Kedua dari' : (d.person1Subline || ''),
      father: d.groomFather,
      mother: d.groomMother,
      ig: d.showSecondPerson !== false ? (d.groomInstagram || 'ghulamzki') : d.groomInstagram,
    },
  ];

  // Ekstrak hari, bulan, tahun dari tanggal akad
  const rawDateParts = (d.akad?.tanggal || '').replace(/^[A-Za-z']+,\s*/, '').split(' ');
  const [dayNum, monthName, yearNum] = [rawDateParts[0], rawDateParts[1], rawDateParts[2]];

  const primaryBtn =
    'inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-[#FBF7ED] shadow-[0_8px_20px_rgba(61,37,23,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-[#4A2C1A] via-[#5C3923] to-[#4A2C1A] hover:brightness-110';

  return (
    <div
      ref={motionRef}
      className={`relative w-full max-w-lg md:max-w-none md:w-full lg:max-w-none lg:w-[480px] xl:w-[520px] ${
        d.isOpened
          ? 'min-h-screen md:w-full lg:w-[480px] xl:w-[520px] lg:ml-auto lg:mr-0'
          : 'h-screen max-h-screen mx-auto md:w-full lg:w-[480px] xl:w-[520px]'
      } shadow-2xl overflow-hidden border-x border-[#D8C7A5]/60 selection:bg-[#5C3923] selection:text-white scroll-smooth km-paper`}
    >
      {/* Desktop Panel Sisi Kiri */}
      <DesktopSidePanel
        theme="jawa-sage"
        invitationData={d}
        isOpened={d.isOpened}
        isModalView={props?.isModalView}
      />

      <ScrollProgress color="#C59B3F" active={d.isOpened} />
      {d.isOpened && <Burst colors={['#C59B3F', '#E6C875', '#8E6334', '#F5E6C8', '#4A2C1A']} />}

      {d.isOpened && (
        <MusicVinylPlayer
          musicUrl={d.musicUrl}
          musicTitle={d.musicTitle}
          isPlaying={d.isPlayingMusic}
          onToggle={d.toggleMusic}
          position="bottom-right"
          theme="wood"
          accentColor="#C59B3F"
        />
      )}

      <InvitationFloatingControls
        qrValue={d.qrValue}
        guestName={d.guestName}
        guestCategory={d.guestCategory}
        guestPax={d.guestPax}
        isOpened={d.isOpened}
        showQr={d.showQr}
        theme="wood"
        accentColor="#C59B3F"
      />

      {/* ============================================================== */}
      {/* 1. COVER / WELCOME SCREEN (GERBANG JOGLO TRADISIONAL)          */}
      {/* ============================================================== */}
      {!coverGone && (
        <div
          className={`fixed inset-0 z-50 overflow-hidden flex items-center justify-center transition-all duration-1000 ease-in-out ${
            opening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
          style={{ backgroundColor: '#EDE4D4' }}
        >
          {/* Latar Belakang Cover: Ilustrasi Joglo Pendopo & Perbukitan Kabut */}
          <div
            className="absolute inset-0 bg-cover bg-bottom pointer-events-none km-kenburns"
            style={{ backgroundImage: `url(${ASSETS.jogloMempelai})` }}
          />

          {/* Partikel Kelopak Melayang */}
          <PetalRain count={14} />

          {/* Ornamen Gunungan Kiri dan Kanan Bawah */}
          <div className="absolute left-1 bottom-4 z-20 pointer-events-none opacity-85">
            <GununganEmblem size={90} className="km-float" />
          </div>
          <div className="absolute right-1 bottom-4 z-20 pointer-events-none opacity-85">
            <GununganEmblem size={90} className="km-float transform -scale-x-100" />
          </div>

          {/* Kotak Konten Cover di Langit Bagian Atas */}
          <div className="relative z-30 w-full max-w-sm px-6 pt-16 pb-32 text-center flex flex-col items-center">
            <p className="text-[10px] sm:text-[11px] font-cinzel font-semibold tracking-[0.4em] uppercase text-[#6E4B29] km-rise">
              {d.eventType === 'wedding' ? 'Wedding Invitation' : d.coverSubtitle}
            </p>

            <h1
              className="mt-3 text-5xl sm:text-6xl font-vidaloka text-[#3D2517] leading-tight drop-shadow-sm km-rise"
              style={{ animationDelay: '0.2s' }}
            >
              {d.showSecondPerson !== false ? `${d.brideShort} & ${d.groomShort}` : d.groomShort}
            </h1>

            <FiligreeDivider maxWidth={200} className="my-2 km-rise" />

            <div className="mt-8 space-y-1.5 km-rise" style={{ animationDelay: '0.4s' }}>
              <p className="text-[11px] font-aboreto font-bold tracking-[0.25em] text-[#7A5A3B] uppercase">
                Kepada Yth.
              </p>
              <p className="text-lg sm:text-xl font-bold font-poppins text-[#2B180E] tracking-wide">
                {d.guestName}
              </p>
              {d.guestCategory && d.guestCategory !== 'Reguler' && (
                <span className="inline-block text-[10px] font-poppins px-3 py-0.5 rounded-full bg-[#C59B3F]/20 text-[#6B491E] border border-[#C59B3F]/40 font-semibold tracking-wide">
                  {d.guestCategory}
                </span>
              )}
            </div>

            <div className="mt-8 km-rise" style={{ animationDelay: '0.6s' }}>
              <button
                type="button"
                onClick={handleOpen}
                className={`${primaryBtn} group`}
              >
                <Leaf className="w-4 h-4 text-[#C59B3F] group-hover:rotate-12 transition-transform" />
                <span>Buka Undangan</span>
                <Sparkles className="w-3.5 h-3.5 text-[#E6C875] animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. HERO SECTION                                                 */}
      {/* ============================================================== */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-start text-center overflow-hidden">
        {/* Latar Belakang Ilustrasi Joglo */}
        <div
          data-parallax
          className="absolute inset-0 bg-cover bg-bottom km-kenburns"
          style={{ backgroundImage: `url(${ASSETS.jogloMempelai})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F4ED]/40 via-transparent to-[#F8F4ED]/80 pointer-events-none" />

        <PetalRain count={8} />

        <div className="relative z-20 pt-[14vh] px-6 space-y-2">
          <p className="text-[11px] font-cinzel font-semibold tracking-[0.4em] uppercase text-[#6E4B29]">
            {d.coverSubtitle || 'The Wedding Of'}
          </p>

          <h2 className="text-5xl sm:text-6xl font-vidaloka text-[#3D2517] leading-tight drop-shadow-sm">
            {d.showSecondPerson !== false ? `${d.brideShort} & ${d.groomShort}` : d.groomShort}
          </h2>

          <p className="text-sm font-aboreto font-bold tracking-[0.3em] text-[#5C3E24] pt-2">
            {[dayNum, monthName, yearNum].filter(Boolean).join(' . ') || d.akad?.tanggal}
          </p>
        </div>

        <div className="absolute bottom-6 z-20 flex flex-col items-center text-[#5C3E24]/80">
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. AYAT SUCI (WE FOUND LOVE)                                   */}
      {/* ============================================================== */}
      <section data-reveal className="relative px-6 py-16 text-center overflow-hidden km-paper">
        {/* Watermark Landscape Tipis di Latar Belakang */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center km-multiply"
          style={{ backgroundImage: `url(${ASSETS.watermark})` }}
        />

        <div className="relative z-10 max-w-md mx-auto space-y-4">
          <GununganEmblem size={56} className="mx-auto" />

          <p className="text-[11px] font-cinzel font-semibold tracking-[0.35em] uppercase text-[#8E6334]">
            We Found Love
          </p>

          <FiligreeDivider maxWidth={200} />

          <p className="text-xs sm:text-[13px] italic font-poppins leading-[2] text-[#4A3222] px-3">
            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu
            dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di
            antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda
            bagi kaum yang berpikir.&rdquo;
          </p>

          <p className="text-[11px] font-cinzel font-bold tracking-widest text-[#7A5A3B] pt-1">
            ({d.ayatQuote || 'Qs. Ar-Rum (30) : 21'})
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. BRIDE & GROOM (SANG MEMPELAI)                               */}
      {/* ============================================================== */}
      <section data-reveal className="relative px-5 py-16 overflow-hidden km-paper">
        <FlowerCorner position="top-right" size={170} />
        <FlowerCorner position="bottom-left" size={180} />

        <SectionHeader
          eyebrow={d.showSecondPerson !== false ? 'Bride & Groom' : d.person1Role || 'Profil Utama'}
          title={d.showSecondPerson !== false ? 'Mempelai' : d.groomShort}
          subtitle={
            d.eventType === 'wedding' &&
            (!d.openingGreeting || d.openingGreeting.includes('Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami'))
              ? 'Dengan memohon Rahmat & Ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:'
              : d.openingGreeting
          }
        />

        <div
          className={`relative z-10 mt-12 space-y-16 max-w-sm ${
            d.showSecondPerson !== false ? 'md:max-w-3xl lg:max-w-sm md:grid md:grid-cols-2 md:gap-8 md:space-y-0 lg:block lg:space-y-16' : ''
          } mx-auto`}
        >
          {couple.map((p, idx) => (
            <div key={p.key} className="text-center flex flex-col items-center">
              {/* Bingkai Foto Lengkung Khas (Arch Frame) */}
              <div
                className="relative w-56 h-72 p-2 rounded-t-[110px] rounded-b-2xl shadow-[0_12px_28px_rgba(61,37,23,0.22)]"
                style={{
                  background: 'linear-gradient(180deg, #FDFBF7 0%, #F5EDE0 100%)',
                  border: '1.5px solid #C59B3F',
                }}
              >
                <div className="w-full h-full overflow-hidden rounded-t-[102px] rounded-b-xl border border-[#D8C7A5]">
                  <img
                    src={p.photo}
                    alt={p.full}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Panggilan Nama Cursive Menonjol */}
              <h4 className="mt-5 text-6xl sm:text-7xl font-imperial text-[#4A2424] leading-tight drop-shadow-sm">
                {p.short}
              </h4>

              {/* Nama Lengkap & Gelar */}
              <p className="mt-1 text-lg sm:text-xl font-vidaloka font-semibold text-[#2E190E]">
                {p.full}
              </p>

              {/* Keterangan Orang Tua / Penyelenggara */}
              {(p.label || p.father || p.mother) && (
                <p className="mt-2 text-xs font-poppins leading-relaxed text-[#5C4533] max-w-xs">
                  {p.label}
                  {(p.father || p.mother) && (
                    <>
                      {p.label ? ' ' : ''}
                      {p.father && (
                        <>
                          {d.showSecondPerson !== false ? 'Bapak ' : ''}
                          <strong>{p.father}</strong>
                        </>
                      )}
                      {p.father && p.mother && (
                        <>
                          {' '}&amp;
                          <br />
                        </>
                      )}
                      {p.mother && (
                        <>
                          {d.showSecondPerson !== false ? 'Ibu ' : ''}
                          <strong>{p.mother}</strong>
                        </>
                      )}
                    </>
                  )}
                </p>
              )}

              {/* Instagram Handle Button */}
              {p.ig && (
                <a
                  href={`https://instagram.com/${p.ig.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-poppins text-[#7A5A3B] hover:text-[#3D2517] transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#C59B3F]" />
                  <span>@{p.ig.replace(/^@/, '')}</span>
                </a>
              )}

              {/* Simbol Dan (&) Pemisah di antara Mempelai */}
              {idx === 0 && d.showSecondPerson !== false && (
                <div className="mt-10 flex flex-col items-center md:hidden lg:flex">
                  <span className="text-4xl font-imperial text-[#C59B3F]">&amp;</span>
                  <FiligreeDivider maxWidth={140} className="my-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SAVE THE DATE & COUNTDOWN                                   */}
      {/* ============================================================== */}
      <section data-reveal className="relative px-6 py-16 text-center overflow-hidden km-dark-rich text-[#FBF7ED]">
        <div className="relative z-10 max-w-sm mx-auto space-y-6">
          <p className="text-[11px] font-cinzel font-semibold tracking-[0.4em] uppercase text-[#D9BE86]">
            {d.countdownTitle || 'Save The Date'}
          </p>

          {/* Kalender Tipografi Besar: 27 Oktober 2026 */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 py-2">
            <span className="text-lg sm:text-xl font-aboreto font-bold tracking-[0.2em] uppercase text-[#EAD8B5]">
              {monthName || 'Oktober'}
            </span>
            <span className="text-7xl sm:text-8xl font-vidaloka font-bold text-[#FDFBF7] drop-shadow-md leading-none">
              {dayNum || '27'}
            </span>
            <span className="text-lg sm:text-xl font-aboreto font-bold tracking-[0.2em] text-[#EAD8B5]">
              {yearNum || '2026'}
            </span>
          </div>

          <FiligreeDivider maxWidth={200} className="filter invert brightness-125 opacity-70 my-2" />

          {/* 4 Lingkaran Penghitung Mundur */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 pt-2">
            {countdownItems.map((c) => (
              <div key={c.label} className="flex flex-col items-center">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-vidaloka font-bold text-[#FDFBF7] shadow-inner"
                  style={{
                    border: '1.5px solid #C59B3F',
                    background: 'rgba(255,255,255,0.06)',
                  }}
                >
                  {c.val}
                </div>
                <span className="mt-2 text-[10px] font-aboreto tracking-wider uppercase text-[#D9BE86]">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. RANGKAIAN ACARA                                             */}
      {/* ============================================================== */}
      <section data-reveal className="relative px-5 py-16 overflow-hidden km-paper">
        <FlowerCorner position="top-left" size={170} />
        <FlowerCorner position="bottom-right" size={180} />

        <SectionHeader
          eyebrow="Rangkaian Acara"
          title={d.eventType === 'wedding' ? 'Acara Pernikahan' : 'Waktu & Tempat'}
          subtitle={d.openingGreeting}
        />

        <div
          className={`relative z-10 mt-10 grid ${
            eventsList.length > 1 ? 'md:grid-cols-2 lg:grid-cols-1 max-w-sm md:max-w-3xl lg:max-w-sm' : 'max-w-sm'
          } gap-8 mx-auto`}
        >
          {eventsList.map((evt, idx) => (
            <div
              key={idx}
              className="relative text-center px-6 pt-12 pb-8 rounded-t-[90px] rounded-b-3xl shadow-[0_10px_30px_rgba(61,37,23,0.18)]"
              style={{
                background: 'linear-gradient(180deg, #FDFBF7 0%, #F5ECE0 100%)',
                border: '1.5px solid #C59B3F',
              }}
            >
              <h4 className="text-4xl sm:text-5xl font-imperial text-[#3D2517]">
                {evt.title}
              </h4>

              <FiligreeDivider maxWidth={180} className="my-2" />

              <div className="space-y-2 font-poppins text-xs sm:text-sm text-[#4A3222] mt-3">
                <p className="flex items-center justify-center gap-2 font-semibold text-[#2E190E]">
                  <Calendar className="w-4 h-4 text-[#8E6334]" />
                  <span>{evt.date}</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#8E6334]" />
                  <span>{evt.time}</span>
                </p>

                <p className="text-[10px] font-cinzel font-semibold tracking-[0.3em] uppercase text-[#8E6334] pt-4">
                  Bertempat di:
                </p>
                <p className="text-base font-vidaloka font-bold text-[#2E190E] flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#8E6334] shrink-0" />
                  <span>{evt.location}</span>
                </p>
                {evt.address && (
                  <p className="text-xs leading-relaxed text-[#5C4533] max-w-xs mx-auto">
                    {evt.address}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col items-center gap-2.5">
                {evt.mapUrl && (
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={primaryBtn}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open Maps</span>
                  </a>
                )}
                {d.googleCalUrl && (
                  <a
                    href={d.googleCalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-cinzel font-bold tracking-widest uppercase text-[#7A5A3B] hover:text-[#3D2517] pt-1"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#8E6334]" />
                    <span>Simpan Kalender</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. LOVE STORY (KISAH CINTA)                                     */}
      {/* ============================================================== */}
      {d.loveStories?.length > 0 && (
        <section data-reveal className="relative px-6 py-16 overflow-hidden km-paper">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center km-multiply"
            style={{ backgroundImage: `url(${ASSETS.watermark})` }}
          />

          <SectionHeader
            eyebrow="Love Story"
            title="Kisah Kami"
            subtitle='"Every love story is beautiful, but ours is my favorite."'
          />

          <div className="relative z-10 mt-10 max-w-sm mx-auto space-y-8">
            {d.loveStories.map((st, idx) => (
              <div
                key={idx}
                className="relative text-center p-6 rounded-2xl shadow-sm border border-[#D8C7A5]/80"
                style={{ background: 'rgba(253,251,247,0.85)' }}
              >
                <span className="text-[11px] font-cinzel font-bold tracking-[0.3em] uppercase text-[#8E6334] block">
                  {st.tahun || `Bab ${idx + 1}`}
                </span>
                <h5 className="mt-1 text-xl font-vidaloka font-semibold text-[#3D2517]">
                  {st.judul}
                </h5>
                <p className="mt-2 text-xs sm:text-[13px] font-poppins leading-[1.9] text-[#5C4533] whitespace-pre-line">
                  {st.cerita}
                </p>
                {idx < d.loveStories.length - 1 && (
                  <FiligreeDivider maxWidth={140} className="mt-4 opacity-50" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 8. OUR MOMENT (GALERI FOTO)                                     */}
      {/* ============================================================== */}
      {d.gallery?.length > 0 && (
        <section data-reveal className="relative px-5 py-16 overflow-hidden km-paper">
          <SectionHeader
            eyebrow="Our Moment"
            title="Galeri"
            subtitle='"A moment is better when shared with you."'
          />

          <div className="relative z-10 mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 max-w-sm md:max-w-3xl lg:max-w-sm mx-auto">
            {d.gallery.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => d.openLightbox(i)}
                className={`group relative overflow-hidden cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-[1.02] ${
                  i % 3 === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/5]'
                }`}
                style={{
                  border: '1.5px solid #C59B3F',
                  padding: 4,
                  background: '#FDFBF7',
                  borderRadius: i % 3 === 0 ? '16px' : '80px 80px 12px 12px',
                  boxShadow: '0 8px 20px rgba(61,37,23,0.15)',
                }}
              >
                <img
                  src={photo.url || photo}
                  alt={photo.caption || `Galeri Foto ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    borderRadius: i % 3 === 0 ? '12px' : '76px 76px 8px 8px',
                  }}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 9. WEDDING GIFT (TANDA KASIH / CASHLESS)                        */}
      {/* ============================================================== */}
      <section data-reveal className="relative px-6 py-16 overflow-hidden km-dark-rich text-[#FBF7ED]">
        <SectionHeader
          dark
          eyebrow="Wedding Gift"
          title="Tanda Kasih"
          subtitle="Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless."
        />

        <div className="relative z-10 mt-8 text-center">
          <button
            type="button"
            onClick={() => setGiftOpen((v) => !v)}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-[#3D2517] shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-[#D9BE86] via-[#EED8A7] to-[#D9BE86]"
          >
            <Gift className="w-4 h-4 text-[#4A2C1A]" />
            <span>{giftOpen ? 'Tutup Amplop' : 'Klik di sini'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${giftOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Tampilan Akun Bank & Alamat Kado yang Dibuka */}
        {giftOpen && (
          <div className="relative z-10 mt-8 space-y-4 max-w-sm md:max-w-3xl lg:max-w-sm mx-auto km-rise">
            {d.bankAccounts?.map((g, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl shadow-xl border border-[#D9BE86]/60 text-[#3D2517]"
                style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F5ECE0 100%)' }}
              >
                <p className="text-3xl font-imperial text-[#8E6334]">
                  {g.bank || 'Bank'}
                </p>
                <p className="mt-1 text-[10px] font-cinzel tracking-[0.25em] uppercase text-[#7A5A3B]">
                  No. Rekening
                </p>
                <p className="text-xl font-poppins font-bold tracking-wider text-[#2E190E] mt-0.5">
                  {g.nomor}
                </p>
                <p className="text-xs font-poppins text-[#5C4533]">
                  a.n {g.nama}
                </p>

                <button
                  type="button"
                  onClick={() => d.copyBank(g.nomor, idx)}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs font-semibold tracking-wide uppercase text-white bg-[#4A2C1A] hover:bg-[#5C3923] transition-colors"
                >
                  {d.copiedBankIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D9BE86]" />
                      <span>Salin Nomor</span>
                    </>
                  )}
                </button>
              </div>
            ))}

            {d.giftAddress && (
              <div
                className="text-center p-6 rounded-2xl shadow-xl border border-[#D9BE86]/60 text-[#3D2517]"
                style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F5ECE0 100%)' }}
              >
                <MapPin className="w-5 h-5 mx-auto text-[#8E6334]" />
                <p className="text-3xl font-imperial text-[#8E6334] mt-1">
                  Kirim Kado
                </p>
                <p className="mt-2 text-xs font-poppins leading-relaxed text-[#5C4533] max-w-xs mx-auto">
                  {d.giftAddress}
                </p>
                <button
                  type="button"
                  onClick={d.copyAddress}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs font-semibold tracking-wide uppercase text-white bg-[#4A2C1A] hover:bg-[#5C3923] transition-colors"
                >
                  {d.copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Alamat Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D9BE86]" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 10. RSVP (KONFIRMASI KEHADIRAN)                                */}
      {/* ============================================================== */}
      <section data-reveal className="relative px-6 py-16 overflow-hidden km-paper">
        <FlowerCorner position="top-right" size={170} />

        <SectionHeader
          eyebrow="RSVP"
          title="Konfirmasi"
          subtitle="Konfirmasi kehadiran Anda dengan mengisi form berikut:"
        />

        <form
          onSubmit={d.rsvp?.send}
          className="relative z-10 mt-8 max-w-sm mx-auto space-y-4 p-6 sm:p-7 rounded-3xl shadow-[0_10px_30px_rgba(61,37,23,0.15)] border border-[#C59B3F]"
          style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F6EDE0 100%)' }}
        >
          <div>
            <label className="block text-[11px] font-cinzel font-semibold tracking-[0.25em] uppercase text-[#6E4B29] mb-1">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={d.rsvp?.name || ''}
              onChange={(e) => d.rsvp?.setName(e.target.value)}
              required
              placeholder="Nama lengkap"
              className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#D8C7A5] text-[#2E190E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel font-semibold tracking-[0.25em] uppercase text-[#6E4B29] mb-2">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: 'Hadir', label: 'Hadir' },
                { v: 'Berhalangan', label: 'Tidak Hadir' },
              ].map((o) => {
                const active = d.rsvp?.status === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => d.rsvp?.setStatus(o.v)}
                    className="py-2.5 rounded-full text-xs font-poppins font-medium border transition cursor-pointer"
                    style={{
                      backgroundColor: active ? '#4A2C1A' : 'transparent',
                      color: active ? '#FBF7ED' : '#4A2C1A',
                      borderColor: active ? '#4A2C1A' : '#C59B3F',
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          {d.rsvp?.status === 'Hadir' && (
            <div>
              <label className="block text-[11px] font-cinzel font-semibold tracking-[0.25em] uppercase text-[#6E4B29] mb-1">
                Jumlah Kehadiran
              </label>
              <select
                name="pax"
                value={d.rsvp?.pax || '1 Orang'}
                onChange={(e) => d.rsvp?.setPax(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#D8C7A5] text-[#2E190E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={`${n} Orang`}>
                    {n} Orang
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-cinzel font-semibold tracking-[0.25em] uppercase text-[#6E4B29] mb-1">
              Ucapan &amp; Doa
            </label>
            <textarea
              name="message"
              value={d.rsvp?.message || ''}
              onChange={(e) => d.rsvp?.setMessage(e.target.value)}
              rows={3}
              placeholder="Sampaikan doa dan ucapan terbaik Anda..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#D8C7A5] text-[#2E190E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
            />
          </div>

          <button type="submit" className={`${primaryBtn} w-full mt-2`}>
            <Send className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span>Submit</span>
          </button>
        </form>
      </section>

      {/* ============================================================== */}
      {/* 11. BEST WISHES (BUKU TAMU & UCAPAN)                           */}
      {/* ============================================================== */}
      {d.rsvp?.list?.length > 0 && (
        <section data-reveal className="relative px-6 pb-16 overflow-hidden km-paper">
          <SectionHeader
            eyebrow="Best Wishes"
            title="Doa &amp; Ucapan"
            subtitle={`${d.rsvp.list.length} ucapan dari keluarga dan sahabat tercinta:`}
          />

          <div className="relative z-10 mt-8 max-w-sm mx-auto space-y-3 max-h-96 overflow-y-auto pr-1">
            {d.rsvp.list.map((w, idx) => {
              const hadir = (w.attendance_status || '').toLowerCase() === 'hadir';
              return (
                <div
                  key={w.id || idx}
                  className="rounded-2xl p-4 shadow-sm border border-[#D8C7A5]/80 space-y-1.5"
                  style={{ background: 'rgba(253,251,247,0.92)' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-vidaloka font-semibold text-[#2E190E]">
                      {w.guest_name || w.name || 'Tamu Undangan'}
                    </span>
                    <span className="text-[10px] font-poppins text-[#8E6334]">
                      {formatRsvpDate(w.created_at || w.createdAt)}
                    </span>
                  </div>
                  {w.attendance_status && (
                    <span
                      className={`inline-block text-[10px] font-poppins px-2 py-0.5 rounded-full font-medium ${
                        hadir
                          ? 'bg-[#C59B3F]/20 text-[#6B491E] border border-[#C59B3F]/40'
                          : 'bg-[#4A2C1A]/10 text-[#4A2C1A]'
                      }`}
                    >
                      {hadir ? '✓ Hadir' : 'Berhalangan'}
                    </span>
                  )}
                  <p className="text-xs font-poppins leading-relaxed text-[#4A3222] pt-1">
                    {w.message || w.wishes}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 12. CLOSING & SIGNATURE                                        */}
      {/* ============================================================== */}
      <section className="relative min-h-[85vh] flex flex-col justify-end text-center overflow-hidden">
        {/* Latar Belakang Ilustrasi Joglo Penutup */}
        <div
          data-parallax
          className="absolute inset-0 bg-cover bg-bottom km-kenburns"
          style={{ backgroundImage: `url(${ASSETS.jogloMempelai})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F4ED] via-transparent to-[#2E190E]/90 pointer-events-none" />

        <PetalRain count={10} />

        <div data-reveal className="relative z-20 px-8 pb-16 pt-28 space-y-3">
          <GununganEmblem size={56} className="mx-auto" />

          <p className="text-xs sm:text-[13px] font-poppins leading-[2] max-w-sm mx-auto italic whitespace-pre-line text-[#2E190E]">
            {d.closingText}
          </p>

          {d.closingGreeting && (
            <p className="text-[11px] font-cinzel font-bold tracking-widest uppercase text-[#6E4B29] pt-2">
              {d.closingGreeting}
            </p>
          )}

          <div className="pt-8 space-y-1">
            <p className="text-[11px] font-cinzel font-semibold tracking-[0.35em] uppercase text-[#EAD8B5]">
              Kami yang berbahagia
            </p>
            <p className="text-6xl sm:text-7xl font-imperial text-[#FDFBF7] drop-shadow-md">
              {d.showSecondPerson !== false ? `${d.brideShort} & ${d.groomShort}` : d.groomShort}
            </p>
            {(d.groomFather || (d.showSecondPerson !== false && d.brideFather)) && (
              <p className="text-xs font-poppins text-[#D9BE86] pt-1 inline-flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C59B3F] fill-current" />
                <span>
                  {d.showSecondPerson !== false
                    ? `Keluarga Besar ${d.groomFather} & ${d.brideFather}`
                    : `Keluarga Besar ${[d.groomFather, d.groomMother].filter(Boolean).join(' & ')}`}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <GalleryLightbox
        photos={d.gallery}
        activeIndex={d.gallerySelected}
        isOpen={d.isLightboxOpen}
        onClose={() => d.setIsLightboxOpen(false)}
        onIndexChange={d.setGallerySelected}
      />
    </div>
  );
};
