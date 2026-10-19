import { useRef, useMemo } from 'react';
import {
  Clock,
  MapPin,
  Copy,
  Check,
  Heart,
  Sparkles,
  Send,
  Gift,
  Bell,
  Navigation,
  Camera,
  Share2,
} from 'lucide-react';
import { Badge } from '../../ui';
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { GalleryLightbox } from '../GalleryLightbox';
import { FallingPetals } from '../FallingPetals';
import { useScrollMotion, useParallax } from '../useScrollMotion';
import { ScrollProgress, Burst } from '../MotionKit';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { DesktopSidePanel } from '../DesktopSidePanel';

/**
 * TEMA CRIMSON ROSE & PURE ELEGANCE
 * 
 * Terinspirasi dari tema Wevitation "Simple Rustic 4" (Deep Maroon Red & Crisp White):
 * - Perpaduan warna mewah: Deep Wine Crimson (#52080D / #6E0F17), Blush Rose (#E5989B / #FAD2D4),
 *   dan Pure White (#FFFFFF / #FCF9F9).
 * - Cover intim dengan overlay gradasi crimson, efek partikel kunang-kunang (fireflies),
 *   tipografi asimetris modern, dan tombol interaktif beranimasi.
 * - Section Hero asimetris dengan tanggal vertikal ("Kamis / 31 • 12 / 2026"), foto potret fade-to-white,
 *   dan countdown timer hitung mundur minimalis.
 * - Blockquote kutipan cinta berlatar deep crimson kontras.
 * - Foto mempelai dengan frame border merah tebal khas, ampersand '&' raksasa artistik,
 *   dan tombol media sosial lingkaran.
 * - Desain blok tanggal acara unik (Bulan | Hari & Tanggal Besar | Tahun), navigasi maps,
 *   simpan kalender, serta kotak Live Streaming.
 * - Timeline kisah cinta (Our Story) dengan foto fade to white dan icon hati.
 * - Galeri prewedding terhubung dengan Lightbox.
 * - Kartu tanda kasih digital (amplop bank deep crimson & kado fisik).
 * - Buku tamu RSVP interaktif.
 * - Floating controls: Bookmark E-Pass QR Check-in di kiri & Scroll-to-Top di kanan bawah.
 */

/* ------------------------------------------------------------------ */
/* DECORATIVE SVG ORNAMENTS                                            */
/* ------------------------------------------------------------------ */

/** Ornamen Bunga Mawar Line-Art Minimalis khas Wevitation Simple Rustic 4 */
const RoseBotanicalOrnament = ({ className = '', color = '#8A151F' }) => (
  <div className={`flex items-center justify-center gap-3 my-3 select-none ${className}`} aria-hidden="true">
    <svg viewBox="0 0 70 20" className="w-16 h-5 stroke-current opacity-70 -scale-x-100" style={{ color }} fill="none" strokeWidth="1.2">
      <path d="M2 10 C 25 10, 35 3, 68 10" strokeLinecap="round" />
      <path d="M25 9 C 30 2, 42 2, 46 8" strokeLinecap="round" />
      <path d="M35 10 C 40 17, 52 17, 56 11" strokeLinecap="round" />
      <circle cx="68" cy="10" r="1.5" fill="currentColor" />
    </svg>
    <div className="flex items-center gap-1.5" style={{ color }}>
      <span className="w-1.5 h-1.5 rotate-45 border border-current bg-transparent" />
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current opacity-90">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="w-1.5 h-1.5 rotate-45 border border-current bg-transparent" />
    </div>
    <svg viewBox="0 0 70 20" className="w-16 h-5 stroke-current opacity-70" style={{ color }} fill="none" strokeWidth="1.2">
      <path d="M2 10 C 25 10, 35 3, 68 10" strokeLinecap="round" />
      <path d="M25 9 C 30 2, 42 2, 46 8" strokeLinecap="round" />
      <path d="M35 10 C 40 17, 52 17, 56 11" strokeLinecap="round" />
      <circle cx="68" cy="10" r="1.5" fill="currentColor" />
    </svg>
  </div>
);

/** Ornamen Kunang-kunang (Fireflies) Bercahaya Halus */
const FirefliesOverlay = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    {[
      { top: '15%', left: '12%', size: 'w-1.5 h-1.5', delay: '0s', dur: '4s' },
      { top: '25%', left: '85%', size: 'w-2 h-2', delay: '1.2s', dur: '5s' },
      { top: '45%', left: '20%', size: 'w-1 h-1', delay: '2.4s', dur: '3.8s' },
      { top: '60%', left: '78%', size: 'w-2 h-2', delay: '0.8s', dur: '4.5s' },
      { top: '75%', left: '30%', size: 'w-1.5 h-1.5', delay: '1.8s', dur: '5.2s' },
      { top: '88%', left: '82%', size: 'w-1 h-1', delay: '2.9s', dur: '4.1s' },
    ].map((f, i) => (
      <span
        key={i}
        className={`absolute rounded-full bg-[#FFE3E5] shadow-[0_0_8px_#FF9EA6] animate-pulse ${f.size}`}
        style={{
          top: f.top,
          left: f.left,
          animationDelay: f.delay,
          animationDuration: f.dur,
          opacity: 0.7,
        }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* SOCIAL MEDIA BUTTONS                                                */
/* ------------------------------------------------------------------ */
const SocialIconBtn = ({ href = '#', label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="w-8 h-8 rounded-full bg-[#6E0F17] hover:bg-[#8A151F] text-[#FFF5F5] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
  >
    {children}
  </a>
);

export const CrimsonRoseTheme = (props) => {
  const d = useInvitationData(props);
  const motionRef = useRef(null);

  // Scroll animations & Parallax
  useScrollMotion(motionRef, d.isOpened);
  useParallax(motionRef, d.isOpened, 0.12);

  const countdownItems = [
    { label: 'HARI', val: d.timeLeft.days },
    { label: 'JAM', val: d.timeLeft.hours },
    { label: 'MENIT', val: d.timeLeft.minutes },
    { label: 'DETIK', val: d.timeLeft.seconds },
  ];

  // Ekstrak hari, tanggal, bulan, tahun dari d.akad.tanggal jika tersedia
  const dateSplit = useMemo(() => {
    const raw = d.akad?.tanggal || 'Minggu, 15 November 2026';
    const parts = raw.split(',');
    const dayName = parts[0]?.trim() || 'Minggu';
    const rest = (parts[1] || '15 November 2026').trim().split(' ');
    return {
      day: dayName,
      dateNum: rest[0] || '15',
      month: rest[1] || 'November',
      shortMonth: (rest[1] || 'Nov').substring(0, 3),
      year: rest[2] || '2026',
    };
  }, [d.akad?.tanggal]);

  return (
    <div
      ref={motionRef}
      className={`relative w-full max-w-lg lg:max-w-none lg:w-[480px] xl:w-[520px] ${d.isOpened ? 'min-h-screen lg:ml-auto lg:mr-0' : 'h-screen max-h-screen mx-auto'} bg-[#FFFFFF] text-[#2E0507] shadow-2xl overflow-hidden font-sans border-x border-[#EED7D9] selection:bg-[#FAD2D4] scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="crimson"
        invitationData={d}
        isOpened={d.isOpened}
        isModalView={props?.isModalView}
      />
      {/* Scroll indicator & Burst effect */}
      <ScrollProgress color="#8A151F" active={d.isOpened} />
      {d.isOpened && (
        <Burst colors={['#8A151F', '#B32430', '#E5989B', '#FFFFFF', '#4A070A']} />
      )}

      {/* Floating Vinyl Player */}
      {d.isOpened && (
        <MusicVinylPlayer
          musicUrl={d.musicUrl}
          musicTitle={d.musicTitle}
          isPlaying={d.isPlayingMusic}
          onToggle={d.toggleMusic}
          position="bottom-right"
          theme="crimson"
          accentColor="#B32430"
        />
      )}

      {/* Floating Bookmark QR Pass & Floating Scroll To Top */}
      <InvitationFloatingControls
        qrValue={d.qrValue}
        guestName={d.guestName}
        guestCategory={d.guestCategory}
        guestPax={d.guestPax}
        isOpened={d.isOpened}
        showQr={d.showQr}
        theme="crimson"
        accentColor="#B32430"
      />

      {/* Ambient Falling Crimson Petals */}
      {d.isOpened && <FallingPetals count={8} />}

      {/* ============================================================== */}
      {/* COVER FULLSCREEN: DEEP CRIMSON WINE & CRISP WHITE              */}
      {/* ============================================================== */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto bg-[#4A070A] text-[#FFF5F5] transition-all duration-1000 ease-in-out ${
          d.isOpened
            ? 'opacity-0 pointer-events-none -translate-y-full scale-105'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Latar Belakang Foto Pasangan + Overlay Crimson Menawan */}
        <div
          className="fixed inset-0 bg-cover bg-center pointer-events-none filter contrast-110"
          style={{ backgroundImage: `url(${d.photoCover})` }}
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(69,0,0,0.72) 0%, rgba(69,0,0,0.92) 55%, rgba(45,2,5,0.98) 100%)',
          }}
        />

        {/* Partikel Kunang-kunang di Cover */}
        <FirefliesOverlay />

        {/* Konten Utama Cover */}
        <div className="relative z-10 flex min-h-full flex-col justify-between p-6 sm:p-8">
          {/* Header Cover: Judul Undangan & Nama Pasangan */}
          <div className="cover-stagger text-right pt-6 space-y-1">
            <span className="text-[11px] font-sans tracking-[0.35em] uppercase text-[#E5989B] font-semibold block">
              Undangan Pernikahan
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif-theme font-bold text-[#FFF5F5] leading-tight">
              {d.groomShort} &amp; {d.brideShort}
            </h1>
          </div>

          {/* Tengah Cover: Kotak Nama Penerima Tamu */}
          <div className="cover-stagger my-auto py-8 text-left space-y-2">
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#E5989B] block">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </span>
            <div className="inline-block p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#E5989B]/40 shadow-2xl space-y-1.5 max-w-sm">
              <h3 className="text-2xl font-serif-theme font-bold text-white flex items-center gap-2">
                {d.guestName}
                {d.isVip && (
                  <Badge variant="warning" size="sm" className="font-sans font-bold text-[10px]">
                    VIP
                  </Badge>
                )}
              </h3>
              <p className="text-[11px] text-[#F7D6D8] font-sans italic">
                *Di Tempat / Mohon maaf bila ada kesalahan penulisan nama &amp; gelar
              </p>
            </div>
          </div>

          {/* Bawah Cover: Tanggal, Garis Aksen & Tombol Buka Undangan */}
          <div className="cover-stagger text-right space-y-4 pb-4">
            <div className="space-y-1">
              <p className="text-xs font-sans tracking-[0.25em] text-[#F7D6D8] uppercase">
                {d.akad.tanggal}
              </p>
              <div className="flex justify-end">
                <div className="w-2/3 h-px bg-gradient-to-l from-[#E5989B] to-transparent" />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={d.openInvitation}
                className="btn-sheen py-3.5 px-8 rounded-full bg-white text-[#6E0F17] hover:bg-[#FFF5F5] font-sans font-bold text-xs uppercase tracking-[0.25em] shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer border border-[#E5989B]/40"
              >
                <Heart className="w-4 h-4 text-[#8A151F] fill-[#8A151F]" />
                <span>Buka Undangan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. BODY UNDANGAN: GAYA SIMPLE RUSTIC 4 (MERAH & PUTIH)          */}
      {/* ============================================================== */}
      <div className="relative pb-24">
        {/* SECTION 1: HERO ASIMETRIS MODERN */}
        <section className="relative bg-[#FFFFFF] pt-10 pb-8 px-6 border-b border-[#EED7D9] space-y-6">
          {/* Header Asimetris Khas Simple Rustic 4 */}
          <div className="flex items-start justify-between gap-4">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8A151F] font-bold block">
                Undangan Pernikahan
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-theme font-bold text-[#4A070A] leading-tight">
                {d.groomShort} &amp; {d.brideShort}
              </h2>
            </div>
            {/* Format Tanggal Vertikal */}
            <div className="text-right text-xs font-sans text-[#8A151F] border-l-2 border-[#8A151F] pl-3 py-0.5">
              <span className="font-bold block tracking-wider uppercase text-[11px] text-[#4A070A]">
                {dateSplit.day}
              </span>
              <span className="text-base font-serif-theme font-bold text-[#6E0F17] block leading-none my-0.5">
                {dateSplit.dateNum} • {dateSplit.month.substring(0, 2)}
              </span>
              <span className="text-[10px] text-stone-500 block tracking-widest">
                {dateSplit.year}
              </span>
            </div>
          </div>

          {/* Foto Besar Mempelai dengan Fade-to-White */}
          <div className="relative w-full h-[460px] rounded-3xl overflow-hidden border border-[#EED7D9] shadow-lg">
            <img
              src={d.photoCover}
              alt="Mempelai"
              data-parallax
              className="w-full h-full object-cover scale-105"
            />
            {/* Gradient Overlay Fade To White */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 20%, rgba(255,255,255,0.15) 60%, transparent 100%)',
              }}
            />

            {/* Kotak Nama Tamu di atas foto bagian bawah */}
            <div className="absolute inset-x-6 bottom-6 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-stone-500 font-semibold block">
                  Kepada Yth:
                </span>
                <h3 className="text-xl font-serif-theme font-bold text-[#4A070A]">
                  {d.guestName}
                </h3>
                <div className="w-16 h-1 bg-[#8A151F] rounded-full" />
              </div>
            </div>
          </div>

          {/* Countdown Timer Hitung Mundur */}
          <div className="pt-2">
            <div className="text-center space-y-1 mb-3">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#8A151F] font-bold">
                Hitung Mundur Hari Bahagia
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto text-center font-sans">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="py-2.5 px-1 rounded-2xl bg-[#FCF8F8] border border-[#EED7D9] shadow-xs"
                >
                  <span className="block text-2xl font-bold font-serif-theme text-[#6E0F17]">
                    <span key={item.val} className="inline-block animate-tick">
                      {item.val}
                    </span>
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-[#8A151F] font-bold mt-0.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: QUOTE KASIH & AYAT SUCI (BLOCKQUOTE DEEP CRIMSON) */}
        <section className="py-14 px-6 bg-[#6E0F17] text-[#FFF5F5] text-center space-y-5 shadow-inner">
          <Sparkles className="w-5 h-5 mx-auto text-[#E5989B] animate-pulse" />
          <div className="max-w-md mx-auto space-y-3 font-serif-theme">
            <p className="text-sm sm:text-base italic leading-relaxed text-[#FFFDFD] px-2">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu
              dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di
              antaramu rasa kasih dan sayang.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="w-8 h-px bg-[#E5989B]/50" />
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#E5989B] font-bold">
                {d.ayatQuote}
              </span>
              <span className="w-8 h-px bg-[#E5989B]/50" />
            </div>
          </div>
        </section>

        {/* SECTION 3: KEDUA MEMPELAI (THE BRIDE & GROOM) */}
        <section className="py-16 px-6 bg-[#FFFFFF] space-y-10">
          <div className="text-center space-y-1">
            <RoseBotanicalOrnament />
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8A151F] font-bold block">
              Kedua Mempelai
            </span>
            <h3 className="text-3xl font-serif-theme font-bold text-[#4A070A]">
              Mempelai Pengantin
            </h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed pt-1">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud melangsungkan pernikahan:
            </p>
          </div>

          <div className="relative max-w-md mx-auto space-y-12">
            {/* Mempelai Wanita */}
            <div className="relative text-left space-y-4">
              <div
                className="w-48 h-60 rounded-3xl overflow-hidden border-4 border-[#8A151F] shadow-xl relative bg-stone-100"
                style={{
                  backgroundImage: `url(${d.photoBride})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8A151F] font-bold">
                  Mempelai Wanita
                </span>
                <h4 className="text-2xl font-serif-theme font-bold text-[#4A070A]">
                  {d.bride}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Putri tercinta dari:
                  <br />
                  <span className="font-semibold text-stone-800">{d.brideFather}</span> &amp;{' '}
                  <span className="font-semibold text-stone-800">{d.brideMother}</span>
                </p>
                {/* Social Media Link Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <SocialIconBtn label="Instagram">
                    <Share2 className="w-3.5 h-3.5" />
                  </SocialIconBtn>
                </div>
              </div>
            </div>

            {/* Ampersand '&' Raksasa Artistik di Latar Belakang */}
            <div
              className="text-center font-serif-theme select-none pointer-events-none -my-14"
              aria-hidden="true"
            >
              <span className="text-8xl sm:text-9xl font-light text-[#E5989B]/40 italic block leading-none">
                &amp;
              </span>
            </div>

            {/* Mempelai Pria (Aligned Right) */}
            <div className="relative text-right space-y-4 flex flex-col items-end">
              <div
                className="w-48 h-60 rounded-3xl overflow-hidden border-4 border-[#8A151F] shadow-xl relative bg-stone-100"
                style={{
                  backgroundImage: `url(${d.photoGroom})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8A151F] font-bold">
                  Mempelai Pria
                </span>
                <h4 className="text-2xl font-serif-theme font-bold text-[#4A070A]">
                  {d.groom}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Putra tercinta dari:
                  <br />
                  <span className="font-semibold text-stone-800">{d.groomFather}</span> &amp;{' '}
                  <span className="font-semibold text-stone-800">{d.groomMother}</span>
                </p>
                {/* Social Media Link Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <SocialIconBtn label="Instagram">
                    <Share2 className="w-3.5 h-3.5" />
                  </SocialIconBtn>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: RANGKAIAN ACARA (SAVE THE DATE) */}
        <section className="py-16 px-6 bg-[#FCF8F8] border-y border-[#EED7D9] space-y-10">
          <div className="text-center space-y-1">
            <RoseBotanicalOrnament />
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8A151F] font-bold block">
              Save The Date
            </span>
            <h3 className="text-3xl font-serif-theme font-bold text-[#4A070A]">
              Rangkaian Acara
            </h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed pt-1">
              Kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada rangkaian acara kami:
            </p>
          </div>

          <div className="space-y-8 max-w-md mx-auto">
            {/* Card Akad Nikah */}
            <div className="bg-white rounded-3xl p-6 border border-[#EED7D9] shadow-sm text-center space-y-4">
              <span className="inline-block px-4 py-1 rounded-full bg-[#6E0F17] text-white text-xs font-bold uppercase tracking-wider font-sans">
                Akad Nikah
              </span>

              {/* Tanggal Split Blok Khas Simple Rustic 4 */}
              <div className="flex items-center justify-center gap-4 py-2 font-sans">
                <span className="text-right text-xs font-semibold text-stone-500 w-16 uppercase">
                  {dateSplit.shortMonth}
                </span>
                <div className="border-x-2 border-[#8A151F] px-5 py-0.5 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-stone-600 font-medium block">
                    {dateSplit.day}
                  </span>
                  <span className="text-3xl font-serif-theme font-bold text-[#6E0F17] block leading-none">
                    {dateSplit.dateNum}
                  </span>
                </div>
                <span className="text-left text-xs font-semibold text-stone-500 w-16">
                  {dateSplit.year}
                </span>
              </div>

              {/* Jam & Lokasi */}
              <div className="space-y-1 font-sans">
                <p className="text-xs font-bold text-[#8A151F] flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{d.akad.waktu}</span>
                </p>
                <p className="text-sm font-bold text-[#2E0507] pt-1 flex items-center justify-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8A151F]" />
                  <span>{d.akad.lokasi}</span>
                </p>
                {d.akad.alamat && (
                  <p className="text-[11px] text-stone-600 max-w-xs mx-auto leading-relaxed">
                    {d.akad.alamat}
                  </p>
                )}
              </div>

              {/* Tombol Simpan Tanggal & Maps */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center font-sans">
                <a
                  href={d.googleCalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-full bg-[#6E0F17] hover:bg-[#8A151F] text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Simpan Tanggal</span>
                </a>
                <a
                  href={
                    d.akad.mapUrl ||
                    `https://maps.google.com/?q=${encodeURIComponent(d.akad.lokasi)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-full bg-[#FCF8F8] hover:bg-[#F2E4E6] text-[#6E0F17] text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-[#EED7D9]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigasi Map</span>
                </a>
              </div>
            </div>

            {/* Card Resepsi Pernikahan */}
            <div className="bg-white rounded-3xl p-6 border border-[#EED7D9] shadow-sm text-center space-y-4">
              <span className="inline-block px-4 py-1 rounded-full bg-[#8A151F] text-white text-xs font-bold uppercase tracking-wider font-sans">
                Resepsi Pernikahan
              </span>

              {/* Tanggal Split Blok Khas Simple Rustic 4 */}
              <div className="flex items-center justify-center gap-4 py-2 font-sans">
                <span className="text-right text-xs font-semibold text-stone-500 w-16 uppercase">
                  {dateSplit.shortMonth}
                </span>
                <div className="border-x-2 border-[#8A151F] px-5 py-0.5 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-stone-600 font-medium block">
                    {dateSplit.day}
                  </span>
                  <span className="text-3xl font-serif-theme font-bold text-[#6E0F17] block leading-none">
                    {dateSplit.dateNum}
                  </span>
                </div>
                <span className="text-left text-xs font-semibold text-stone-500 w-16">
                  {dateSplit.year}
                </span>
              </div>

              {/* Jam & Lokasi */}
              <div className="space-y-1 font-sans">
                <p className="text-xs font-bold text-[#8A151F] flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{d.resepsi.waktu}</span>
                </p>
                <p className="text-sm font-bold text-[#2E0507] pt-1 flex items-center justify-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8A151F]" />
                  <span>{d.resepsi.lokasi}</span>
                </p>
                {d.resepsi.alamat && (
                  <p className="text-[11px] text-stone-600 max-w-xs mx-auto leading-relaxed">
                    {d.resepsi.alamat}
                  </p>
                )}
              </div>

              {/* Tombol Simpan Tanggal & Maps */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center font-sans">
                <a
                  href={d.googleCalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-full bg-[#6E0F17] hover:bg-[#8A151F] text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Simpan Tanggal</span>
                </a>
                <a
                  href={
                    d.resepsi.mapUrl ||
                    `https://maps.google.com/?q=${encodeURIComponent(d.resepsi.lokasi)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-full bg-[#FCF8F8] hover:bg-[#F2E4E6] text-[#6E0F17] text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-[#EED7D9]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigasi Map</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: KISAH CINTA (OUR STORY TIMELINE) */}
        {d.loveStories.length > 0 && (
          <section className="py-16 px-6 bg-white space-y-10">
            <div className="text-center space-y-1">
              <RoseBotanicalOrnament />
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8A151F] font-bold block">
                Our Journey
              </span>
              <h3 className="text-3xl font-serif-theme font-bold text-[#4A070A]">
                Kisah Cinta Kami
              </h3>
            </div>

            <div className="relative max-w-md mx-auto space-y-8">
              {/* Garis Vertikal Timeline */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-[#EED7D9]" />

              {d.loveStories.map((story, idx) => (
                <div key={idx} className="relative flex items-start gap-5">
                  {/* Badge Ikon Hati Merah */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#6E0F17] border-4 border-white shadow-md flex items-center justify-center shrink-0 text-white">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>

                  {/* Kartu Cerita dengan Thumbnail Foto */}
                  <div className="flex-1 bg-[#FCF8F8] rounded-3xl border border-[#EED7D9] overflow-hidden shadow-xs space-y-3 pb-4">
                    {/* Header Image dengan Gradient Fade */}
                    <div className="relative h-36 bg-stone-200 overflow-hidden">
                      <img
                        src={
                          d.gallery[idx % d.gallery.length] ||
                          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80'
                        }
                        alt={story.judul}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top, #FCF8F8 0%, rgba(252,248,248,0.7) 40%, transparent 100%)',
                        }}
                      />
                      <span className="absolute top-3 right-3 px-3 py-0.5 rounded-full bg-[#6E0F17] text-white text-[10px] font-bold font-sans tracking-wider">
                        {story.tahun}
                      </span>
                    </div>

                    <div className="px-5 space-y-1.5 font-sans">
                      <h4 className="text-base font-serif-theme font-bold text-[#4A070A]">
                        {story.judul}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed font-light">
                        {story.cerita}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 6: GALERI FOTO KENANGAN */}
        <section className="py-16 px-6 bg-[#FCF8F8] border-y border-[#EED7D9] space-y-10">
          <div className="text-center space-y-1">
            <RoseBotanicalOrnament />
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8A151F] font-bold block">
              Gallery
            </span>
            <h3 className="text-3xl font-serif-theme font-bold text-[#4A070A]">
              Galeri Kenangan
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {d.gallery.map((photo, i) => (
              <div
                key={i}
                onClick={() => d.openLightbox(i)}
                className={`overflow-hidden rounded-2xl border-2 border-white cursor-pointer relative group bg-white shadow-md transition-all duration-300 hover:shadow-xl ${
                  i % 3 === 0 ? 'col-span-2 h-64' : 'h-44'
                }`}
              >
                <img
                  src={photo}
                  alt={`Galeri ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#4A070A]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5 text-white">
                  <Camera className="w-4 h-4" />
                  <span className="text-xs font-sans font-medium tracking-wider uppercase">
                    Lihat Foto
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: TANDA KASIH (AMPLOP DIGITAL & KADO FISIK) */}
        <section className="py-16 px-6 bg-[#FFFFFF] space-y-10">
          <div className="text-center space-y-2">
            <RoseBotanicalOrnament />
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8A151F] font-bold block">
              Wedding Gift
            </span>
            <h3 className="text-3xl font-serif-theme font-bold text-[#4A070A]">
              Tanda Kasih
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed font-sans">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika memberi adalah tanda kasih Anda, Anda dapat mengirimkannya melalui amplop digital berikut:
            </p>
          </div>

          <div className="space-y-5 max-w-md mx-auto">
            {d.bankAccounts.map((acc, index) => (
              <div
                key={index}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-[#4A070A] via-[#6E0F17] to-[#8A151F] text-white shadow-xl space-y-4 font-sans overflow-hidden border border-[#E5989B]/30"
              >
                {/* Watermark Garis Lingkaran Abstrak Kartu */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border border-white/10 pointer-events-none" />
                <div className="absolute -right-2 -bottom-2 w-40 h-40 rounded-full border border-white/10 pointer-events-none" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#E5989B] uppercase">
                    {acc.bank}
                  </span>
                  <Heart className="w-4 h-4 text-[#E5989B]" />
                </div>

                {/* Chip Kartu Debit Digital */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#FFE3E5] to-[#D47A7A] opacity-80 shadow-xs" />

                <div>
                  <p className="text-2xl font-mono font-bold tracking-widest text-[#FFFDFD]">
                    {acc.nomor}
                  </p>
                  <p className="text-xs text-[#F7D6D8] mt-1 font-sans">a.n {acc.nama}</p>
                </div>

                <button
                  type="button"
                  onClick={() => d.copyBank(acc.nomor, index)}
                  className="w-full py-2.5 rounded-xl bg-white text-[#6E0F17] hover:bg-[#FFF5F5] text-xs font-sans font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98"
                >
                  {d.copiedBankIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nomor Rekening Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            ))}

            {/* Kirim Kado Fisik */}
            {d.giftAddress && (
              <div className="p-6 rounded-3xl bg-[#FCF8F8] border border-[#EED7D9] text-xs text-stone-700 space-y-3 font-sans shadow-xs">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A151F] font-bold flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#8A151F]" />
                  Kirim Kado Fisik:
                </span>
                <p className="leading-relaxed text-stone-600">{d.giftAddress}</p>
                <button
                  type="button"
                  onClick={d.copyAddress}
                  className="py-2 px-4 rounded-full bg-white hover:bg-[#F2E4E6] text-xs font-semibold text-[#6E0F17] transition-colors flex items-center gap-1.5 border border-[#EED7D9] cursor-pointer shadow-xs active:scale-95"
                >
                  {d.copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Alamat Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Alamat Lengkap</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 8: BUKU TAMU & RSVP */}
        <section className="py-16 px-6 bg-[#FCF8F8] border-y border-[#EED7D9] space-y-10">
          <div className="text-center space-y-1">
            <RoseBotanicalOrnament />
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8A151F] font-bold block">
              Guest Book
            </span>
            <h3 className="text-3xl font-serif-theme font-bold text-[#4A070A]">
              Ucapan &amp; Doa Restu
            </h3>
          </div>

          <div className="max-w-md mx-auto space-y-8">
            {/* Form RSVP */}
            <form
              onSubmit={d.rsvp.send}
              className="p-6 rounded-3xl bg-white border border-[#EED7D9] space-y-5 shadow-sm font-sans"
            >
              <div>
                <label className="text-xs font-bold text-[#4A070A]">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={d.rsvp.name}
                  onChange={(e) => d.rsvp.setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-[#FCF8F8] border border-[#EED7D9] text-xs text-[#2E0507] focus:outline-none focus:border-[#8A151F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A070A]">Konfirmasi Kehadiran</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {['Hadir', 'Ragu-ragu', 'Tidak Hadir'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => d.rsvp.setStatus(st)}
                      className={`py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        d.rsvp.status === st
                          ? 'bg-[#6E0F17] text-white font-bold shadow-md'
                          : 'bg-[#FCF8F8] border border-[#EED7D9] text-stone-700 hover:bg-[#F2E4E6]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {d.rsvp.status !== 'Tidak Hadir' && (
                <div>
                  <label className="text-xs font-bold text-[#4A070A]">Jumlah Tamu (Pax)</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {['1 Orang', '2 Orang'].map((px) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => d.rsvp.setPax(px)}
                        className={`py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          d.rsvp.pax === px
                            ? 'bg-[#8A151F] text-white font-bold shadow-md'
                            : 'bg-[#FCF8F8] border border-[#EED7D9] text-stone-700 hover:bg-[#F2E4E6]'
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#4A070A]">Untaian Doa &amp; Harapan</label>
                <textarea
                  rows={3}
                  required
                  value={d.rsvp.message}
                  onChange={(e) => d.rsvp.setMessage(e.target.value)}
                  placeholder="Tuliskan doa restu terbaik Anda..."
                  className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-[#FCF8F8] border border-[#EED7D9] text-xs text-[#2E0507] focus:outline-none focus:border-[#8A151F] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#6E0F17] hover:bg-[#8A151F] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Doa Restu</span>
              </button>
            </form>

            {/* List Ucapan Tamu */}
            <div className="space-y-3 font-sans">
              <span className="text-xs text-[#8A151F] uppercase tracking-wider block font-bold">
                Doa Restu Tamu ({d.rsvp.list.length})
              </span>
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {d.rsvp.list.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#EED7D9] space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#6E0F17] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {r.guest_name ? r.guest_name.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <span className="font-bold text-[#4A070A] font-serif-theme">
                          {r.guest_name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          r.attendance_status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {r.attendance_status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed pl-9">{r.message}</p>
                    <p className="text-[10px] text-[#8A151F] pl-9">
                      {formatRsvpDate(r.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: PENUTUP & KELUARGA BESAR */}
        <section className="py-16 px-6 text-center space-y-4 bg-white">
          <RoseBotanicalOrnament />
          <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed font-sans">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
          <p className="text-xs font-sans uppercase tracking-widest text-[#8A151F] font-bold">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>

          <div className="pt-4 space-y-1">
            <span className="text-[10px] font-sans text-stone-500 uppercase tracking-widest block">
              Kami yang berbahagia,
            </span>
            <p className="text-3xl font-serif-theme font-bold text-[#4A070A]">
              {d.groomShort} &amp; {d.brideShort}
            </p>
            <p className="text-xs text-stone-500 font-sans">Beserta Segenap Keluarga Besar</p>
          </div>
        </section>
      </div>

      {/* Fullscreen Interactive Lightbox */}
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
