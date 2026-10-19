import { useRef } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Send,
  Navigation,
  Bell,
  Crown,
  Sparkles,
  Award,
} from 'lucide-react';
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { GalleryLightbox } from '../GalleryLightbox';
import { useScrollMotion, useParallax } from '../useScrollMotion';
import { ScrollProgress, Burst } from '../MotionKit';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { DesktopSidePanel } from '../DesktopSidePanel';

/**
 * TEMA ROYAL GOLD & BLACK VELVET
 * Palet: Hitam obsidian velvet (#0B0D12), emas berkilau (#DFB76C, #F5DE9C, #B88728), ivory mewah (#FAF0D4).
 * Motif: Mahkota kerajaan, ornamen filigree barok emas, sudut bevel geometris, kartu VIP emas.
 * Kode template: `royal-gold` / `elegant-gold`
 */

/* Ornamen Filigree Pembatas Emas */
const GoldFiligreeDivider = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-2 py-3 ${className}`} aria-hidden="true">
    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#DFB76C] to-transparent" />
    <svg viewBox="0 0 80 24" className="w-20 h-6 text-[#DFB76C]" fill="currentColor">
      <path d="M40 2 L43 9 L50 12 L43 15 L40 22 L37 15 L30 12 L37 9 Z" opacity="0.9" />
      <circle cx="20" cy="12" r="2.5" opacity="0.7" />
      <circle cx="60" cy="12" r="2.5" opacity="0.7" />
      <path d="M10 12 Q 15 8 20 12 T 30 12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M50 12 Q 55 16 60 12 T 70 12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#DFB76C] to-transparent" />
  </div>
);

/* Sudut Ornamen Emas Kerajaan */
const RoyalCorner = ({ position = 'top-left' }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-right': return 'rotate-90 top-2 right-2';
      case 'bottom-right': return 'rotate-180 bottom-2 right-2';
      case 'bottom-left': return '-rotate-90 bottom-2 left-2';
      default: return 'top-2 left-2';
    }
  };

  return (
    <svg
      viewBox="0 0 32 32"
      className={`absolute w-6 h-6 text-[#DFB76C]/60 pointer-events-none select-none ${getTransform()}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M2 14 L2 2 L14 2" />
      <path d="M6 10 L6 6 L10 6" opacity="0.6" />
      <circle cx="4" cy="4" r="1.5" fill="currentColor" />
    </svg>
  );
};

/* Royal Crest Emblem */
const RoyalCrest = ({ initialA = 'R', initialB = 'A' }) => (
  <div className="relative inline-flex flex-col items-center justify-center p-3">
    {/* Glow halo */}
    <div className="absolute inset-0 bg-[#DFB76C]/10 rounded-full blur-xl" />
    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#DFB76C] relative z-10" fill="none">
      {/* Outer Laurel Wreath */}
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      {/* Crown Top */}
      <path
        d="M40 24 L43 28 L50 20 L57 28 L60 24 L58 32 L42 32 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="40" cy="22" r="1.5" fill="currentColor" />
      <circle cx="50" cy="18" r="1.8" fill="currentColor" />
      <circle cx="60" cy="22" r="1.5" fill="currentColor" />
    </svg>
    {/* Monogram inside */}
    <div className="absolute inset-0 flex items-center justify-center pt-3 z-20">
      <span className="font-serif-theme text-xl font-bold tracking-wider text-gold-gradient">
        {initialA}&amp;{initialB}
      </span>
    </div>
  </div>
);

export const RoyalGoldTheme = (props) => {
  const d = useInvitationData(props);
  const motionRef = useRef(null);

  useScrollMotion(motionRef, d.isOpened);
  useParallax(motionRef, d.isOpened, 0.12);

  const countdownItems = [
    { label: 'Hari', val: d.timeLeft?.days ?? 0 },
    { label: 'Jam', val: d.timeLeft?.hours ?? 0 },
    { label: 'Menit', val: d.timeLeft?.minutes ?? 0 },
    { label: 'Detik', val: d.timeLeft?.seconds ?? 0 },
  ];

  const groomInitial = (d.groomShort || 'P').charAt(0);
  const brideInitial = (d.brideShort || 'W').charAt(0);

  const eventsList = [
    {
      title: 'Akad Nikah',
      date: d.akad?.tanggal,
      time: d.akad?.waktu,
      location: d.akad?.lokasi,
      address: d.akad?.alamat,
      mapUrl: d.akad?.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(d.akad?.lokasi || '')}`,
    },
    {
      title: 'Resepsi Pernikahan',
      date: d.resepsi?.tanggal,
      time: d.resepsi?.waktu,
      location: d.resepsi?.lokasi,
      address: d.resepsi?.alamat,
      mapUrl: d.resepsi?.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(d.resepsi?.lokasi || '')}`,
    },
  ];

  return (
    <div
      ref={motionRef}
      className={`relative w-full max-w-lg lg:max-w-none lg:w-[480px] xl:w-[520px] ${d.isOpened ? 'min-h-screen lg:ml-auto lg:mr-0' : 'h-screen max-h-screen mx-auto'} bg-royal-dark text-[#E6E1D8] shadow-2xl overflow-hidden font-serif-theme border-x border-[#3A2E17] selection:bg-[#B88728] selection:text-black scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="royal-gold"
        invitationData={d}
        isOpened={d.isOpened}
        isModalView={props?.isModalView}
      />
      {/* Scroll indicator & Burst */}
      <ScrollProgress color="#DFB76C" active={d.isOpened} />
      {d.isOpened && (
        <Burst colors={['#DFB76C', '#F5DE9C', '#B88728', '#FAF0D4', '#ECC880']} />
      )}

      {d.isOpened && (
        <MusicVinylPlayer
          musicUrl={d.musicUrl}
          musicTitle={d.musicTitle}
          isPlaying={d.isPlayingMusic}
          onToggle={d.toggleMusic}
          position="bottom-right"
          theme="gold"
          accentColor="#DFB76C"
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
        theme="gold"
        accentColor="#DFB76C"
      />

      {/* Floating Gold Sparkle Dust */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-[#DFB76C] rounded-full animate-ping" />
        <div className="absolute top-[35%] right-[12%] w-1 h-1 bg-[#F5DE9C] rounded-full animate-pulse" />
        <div className="absolute top-[60%] left-[8%] w-2 h-2 bg-[#ECC880] rounded-full blur-[1px] animate-pulse" />
        <div className="absolute top-[80%] right-[15%] w-1.5 h-1.5 bg-[#DFB76C] rounded-full animate-ping" />
      </div>

      {/* ============================================================== */}
      {/* 1. COVER / WELCOME SCREEN (MODAL GERBANG KERAJAAN) */}
      {/* ============================================================== */}
      {/* 1. COVER / WELCOME SCREEN (GERBANG KERAJAAN MEWAH DESKTOP)     */}
      {/* ============================================================== */}
      {!d.isOpened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-10 bg-[#080A0E] transition-all duration-1000 ease-in-out">
          {/* Full Bleed Royal Backdrop */}
          <div
            className="fixed inset-0 bg-cover bg-center pointer-events-none filter contrast-125 opacity-20 md:opacity-35"
            style={{ backgroundImage: `url(${d.photoCover})` }}
          />
          <div className="fixed inset-0 bg-gradient-to-b from-[#080A0E]/95 via-[#0B0E14]/90 to-[#040507]/98 pointer-events-none" />

          {/* Ambient gold glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#DFB76C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-sm md:max-w-4xl lg:max-w-5xl rounded-2xl md:rounded-3xl bg-[#11141B]/95 backdrop-blur-xl border border-[#DFB76C]/40 p-6 sm:p-8 md:p-12 text-center md:text-left shadow-[0_0_60px_rgba(223,183,108,0.25)] overflow-hidden">
            <RoyalCorner position="top-left" />
            <RoyalCorner position="top-right" />
            <RoyalCorner position="bottom-left" />
            <RoyalCorner position="bottom-right" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
              {/* Left Column: Crest & Royal Titles */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 space-y-4">
                {/* Emblem */}
                <div className="mb-1">
                  <RoyalCrest initialA={groomInitial} initialB={brideInitial} />
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-sans tracking-[0.35em] uppercase text-[#DFB76C] font-semibold">
                    The Royal Wedding of
                  </p>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif-theme leading-tight text-gold-gradient">
                    {d.groomShort} &amp; {d.brideShort}
                  </h1>
                </div>

                <div className="w-full max-w-xs md:max-w-sm">
                  <GoldFiligreeDivider />
                </div>

                <p className="hidden md:block text-xs text-neutral-400 font-sans italic leading-relaxed pt-2">
                  Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir pada momen istimewa pernikahan kami.
                </p>
              </div>

              {/* Right Column: Guest Card & Action Button */}
              <div className="flex flex-col justify-center space-y-5 md:w-1/2">
                {/* Kepada Yth Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#181D27] border border-[#DFB76C]/30 shadow-inner text-center md:text-left space-y-2">
                  <p className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">
                    Kepada Yth. Bapak/Ibu/Saudara/i:
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {d.guestName}
                  </p>
                  {d.guestCategory && (
                    <span className="inline-block text-[10px] font-sans px-3 py-1 rounded-full bg-[#DFB76C]/20 text-[#F5DE9C] border border-[#DFB76C]/40 font-medium">
                      {d.guestCategory}
                    </span>
                  )}
                </div>

                <p className="block md:hidden text-xs text-neutral-400 font-sans italic leading-relaxed text-center">
                  Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir pada momen istimewa pernikahan kami.
                </p>

                {/* Tombol Buka Undangan */}
                <button
                  type="button"
                  onClick={d.openInvitation}
                  className="w-full group relative py-4 px-6 rounded-xl font-sans font-semibold text-sm tracking-wider uppercase bg-gradient-to-r from-[#C59B3F] via-[#F5DE9C] to-[#B88728] text-black shadow-lg hover:shadow-[0_0_25px_rgba(223,183,108,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
                  <span>Buka Undangan</span>
                  <Sparkles className="w-4 h-4 text-black animate-pulse" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. HERO / PARALLAX HEADER */}
      {/* ============================================================== */}
      <section className="relative min-h-[90vh] flex flex-col justify-end p-6 text-center overflow-hidden">
        {/* Background Image with Vignette */}
        <div
          data-parallax
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{ backgroundImage: `url(${d.photoCover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/70 to-[#0B0D12]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D12]/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 space-y-3 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0D12]/80 border border-[#DFB76C]/40 text-[#DFB76C] text-xs font-sans uppercase tracking-[0.25em]">
            <Crown className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>Walimatul Ursy</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold font-serif-theme text-gold-gradient leading-tight drop-shadow-lg">
            {d.groomShort} &amp; {d.brideShort}
          </h2>

          <p className="text-sm font-sans tracking-widest text-[#E6E1D8]/80 uppercase">
            {d.akad?.tanggal}
          </p>

          <GoldFiligreeDivider />

          {/* Quick Countdown in Hero */}
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto pt-2">
            {countdownItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#141823]/80 backdrop-blur-md border border-[#DFB76C]/30 rounded-lg p-2 text-center shadow-md"
              >
                <span className="block text-xl font-bold text-[#F5DE9C]">
                  {item.val}
                </span>
                <span className="text-[10px] uppercase font-sans text-neutral-400">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Body Flow */}
      <div className="relative z-10 px-5 py-10 space-y-16">
        {/* ============================================================== */}
        {/* 3. AYAT SUCI / KALIMAT PEMBUKA */}
        {/* ============================================================== */}
        <section data-reveal className="text-center space-y-4 max-w-md mx-auto">
          <div className="p-6 rounded-2xl bg-[#121620] border border-[#DFB76C]/30 shadow-xl relative overflow-hidden">
            <RoyalCorner position="top-left" />
            <RoyalCorner position="bottom-right" />

            <Crown className="w-6 h-6 text-[#DFB76C] mx-auto mb-3" />
            <p className="text-xs font-sans tracking-[0.2em] uppercase text-[#DFB76C] font-semibold">
              {d.ayatQuote || 'QS. Ar-Rum : 21'}
            </p>
            <p className="text-xs sm:text-sm italic font-sans text-neutral-300 leading-relaxed mt-2">
              &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&quot;
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. MEMPELAI (THE ROYAL COUPLE) */}
        {/* ============================================================== */}
        <section data-reveal className="space-y-8 text-center">
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#DFB76C] font-semibold block">
              Mempelai Bahagia
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-theme font-bold text-white mt-1">
              Sang Pangeran &amp; Sang Ratu
            </h3>
            <GoldFiligreeDivider />
          </div>

          <div className="grid gap-8">
            {/* Mempelai Pria */}
            <div className="p-6 rounded-2xl bg-[#121620] border border-[#DFB76C]/30 relative overflow-hidden shadow-xl text-center group">
              <RoyalCorner position="top-right" />
              <div className="relative w-36 h-48 mx-auto rounded-t-full rounded-b-xl overflow-hidden border-2 border-[#DFB76C] shadow-[0_0_20px_rgba(223,183,108,0.3)] mb-4">
                <img
                  src={d.photoGroom}
                  alt={d.groom}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h4 className="text-xl font-bold font-serif-theme text-gold-gradient">
                {d.groom}
              </h4>
              <p className="text-xs font-sans text-[#DFB76C] tracking-wider uppercase mt-1">
                Mempelai Pria
              </p>
              <p className="text-xs font-sans text-neutral-400 mt-2">
                Putra dari Bapak <strong className="text-neutral-200">{d.groomFather}</strong> &amp; Ibu <strong className="text-neutral-200">{d.groomMother}</strong>
              </p>
            </div>

            {/* Simbol Dan (&) */}
            <div className="flex items-center justify-center my-[-10px]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DFB76C] to-[#9A7228] text-black font-bold font-serif-theme flex items-center justify-center shadow-lg text-lg">
                &amp;
              </div>
            </div>

            {/* Mempelai Wanita */}
            <div className="p-6 rounded-2xl bg-[#121620] border border-[#DFB76C]/30 relative overflow-hidden shadow-xl text-center group">
              <RoyalCorner position="top-left" />
              <div className="relative w-36 h-48 mx-auto rounded-t-full rounded-b-xl overflow-hidden border-2 border-[#DFB76C] shadow-[0_0_20px_rgba(223,183,108,0.3)] mb-4">
                <img
                  src={d.photoBride}
                  alt={d.bride}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h4 className="text-xl font-bold font-serif-theme text-gold-gradient">
                {d.bride}
              </h4>
              <p className="text-xs font-sans text-[#DFB76C] tracking-wider uppercase mt-1">
                Mempelai Wanita
              </p>
              <p className="text-xs font-sans text-neutral-400 mt-2">
                Putri dari Bapak <strong className="text-neutral-200">{d.brideFather}</strong> &amp; Ibu <strong className="text-neutral-200">{d.brideMother}</strong>
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. JADWAL ACARA (ROYAL BANQUET & CEREMONY) */}
        {/* ============================================================== */}
        <section data-reveal className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#DFB76C] font-semibold block">
              Rangkaian Acara
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-theme font-bold text-white mt-1">
              Waktu &amp; Tempat
            </h3>
            <GoldFiligreeDivider />
          </div>

          <div className="grid gap-6">
            {eventsList.map((evt, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-[#121620] border border-[#DFB76C]/40 shadow-xl overflow-hidden"
              >
                <RoyalCorner position={idx % 2 === 0 ? 'top-left' : 'top-right'} />

                {/* Badge title */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFB76C]/20 border border-[#DFB76C]/40 text-[#F5DE9C] text-xs font-sans font-semibold uppercase tracking-wider mb-3">
                  <Award className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>{evt.title}</span>
                </div>

                <div className="space-y-3 font-sans mt-2">
                  <div className="flex items-center gap-3 text-neutral-200">
                    <Calendar className="w-4 h-4 text-[#DFB76C] shrink-0" />
                    <span className="text-sm font-medium">{evt.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-neutral-200">
                    <Clock className="w-4 h-4 text-[#DFB76C] shrink-0" />
                    <span className="text-sm">{evt.time}</span>
                  </div>

                  <div className="flex items-start gap-3 text-neutral-300">
                    <MapPin className="w-4 h-4 text-[#DFB76C] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">{evt.location}</p>
                      {evt.address && (
                        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                          {evt.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[#DFB76C]/20 font-sans">
                  {evt.mapUrl && (
                    <a
                      href={evt.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#DFB76C] text-black hover:bg-[#F5DE9C] transition-colors shadow"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Petunjuk Lokasi</span>
                    </a>
                  )}
                  {d.googleCalUrl && (
                    <a
                      href={d.googleCalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#1A202C] text-[#F5DE9C] border border-[#DFB76C]/40 hover:bg-[#252D3D] transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#DFB76C]" />
                      <span>Simpan Kalender</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. COUNTDOWN BESAR */}
        {/* ============================================================== */}
        <section data-reveal className="text-center space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#141824] to-[#0D1017] border border-[#DFB76C]/50 shadow-2xl relative overflow-hidden">
            <Crown className="w-6 h-6 text-[#DFB76C] mx-auto mb-2" />
            <h4 className="text-xl font-bold font-serif-theme text-gold-gradient">
              Menghitung Hari
            </h4>
            <p className="text-xs font-sans text-neutral-400 mt-1 mb-5">
              Menuju awal ikatan suci kami berdua
            </p>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {countdownItems.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#0B0D12] border border-[#DFB76C]/40 text-center shadow-inner"
                >
                  <span className="block text-2xl sm:text-3xl font-bold font-serif-theme text-[#F5DE9C]">
                    {c.val}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans uppercase tracking-wider text-neutral-400 mt-1 block">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. LOVE STORY / PERJALANAN CINTA */}
        {/* ============================================================== */}
        {d.loveStories && d.loveStories.length > 0 && (
          <section data-reveal className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#DFB76C] font-semibold block">
                Kisah Kami
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-theme font-bold text-white mt-1">
                Jejak Cinta Kerajaan
              </h3>
              <GoldFiligreeDivider />
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#DFB76C] before:via-[#9A7228] before:to-transparent">
              {d.loveStories.map((st, idx) => (
                <div key={idx} className="relative group">
                  {/* Pin Node */}
                  <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-[#0B0D12] border-2 border-[#DFB76C] flex items-center justify-center shadow">
                    <div className="w-1.5 h-1.5 bg-[#DFB76C] rounded-full" />
                  </div>
                  <div className="p-4 rounded-xl bg-[#121620] border border-[#DFB76C]/25">
                    <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#DFB76C]/20 text-[#F5DE9C] border border-[#DFB76C]/30">
                      {st.tahun || `Fase ${idx + 1}`}
                    </span>
                    <h5 className="text-base font-bold font-serif-theme text-white mt-2">
                      {st.judul}
                    </h5>
                    <p className="text-xs font-sans text-neutral-300 mt-1 leading-relaxed">
                      {st.cerita}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 8. GALERI FOTO (MOMEN BERSEJARAH) */}
        {/* ============================================================== */}
        {d.gallery && d.gallery.length > 0 && (
          <section data-reveal className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#DFB76C] font-semibold block">
                Galeri Momen
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-theme font-bold text-white mt-1">
                Kenangan Indah
              </h3>
              <GoldFiligreeDivider />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {d.gallery.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => d.openLightbox(i)}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-[#DFB76C]/40 bg-black/60 shadow-md focus:outline-none focus:ring-2 focus:ring-[#DFB76C]"
                >
                  <img
                    src={photo.url || photo}
                    alt={photo.caption || `Galeri Foto ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <Sparkles className="w-4 h-4 text-[#DFB76C]" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 9. TANDA KASIH / DIGITAL GIFT */}
        {/* ============================================================== */}
        <section data-reveal className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#DFB76C] font-semibold block">
              Ungkapan Tanda Kasih
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-theme font-bold text-white mt-1">
              Kado Pernikahan
            </h3>
            <GoldFiligreeDivider />
            <p className="text-xs font-sans text-neutral-400 max-w-xs mx-auto">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberi tanda kasih secara digital, dapat melalui:
            </p>
          </div>

          <div className="grid gap-4">
            {d.bankAccounts?.map((g, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-gradient-to-br from-[#161B26] to-[#0F131C] border border-[#DFB76C]/40 shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-sans font-bold px-3 py-1 rounded-md bg-[#DFB76C]/20 text-[#F5DE9C] border border-[#DFB76C]/40 uppercase tracking-wider">
                    {g.bank || 'Bank'}
                  </span>
                  <Crown className="w-4 h-4 text-[#DFB76C]/60" />
                </div>

                <div className="space-y-1 font-sans">
                  <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                    Nomor Rekening
                  </p>
                  <p className="text-lg font-mono font-bold tracking-wider text-white">
                    {g.nomor}
                  </p>
                  <p className="text-xs text-neutral-300">
                    a.n {g.nama}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => d.copyBank(g.nomor, idx)}
                  className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-sans font-semibold bg-[#DFB76C] text-black hover:bg-[#F5DE9C] transition-all flex items-center justify-center gap-2 shadow"
                >
                  {d.copiedBankIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>Berhasil Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-black" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            ))}

            {/* Alamat Fisik Kado */}
            {d.giftAddress && (
              <div className="p-5 rounded-2xl bg-[#121620] border border-[#DFB76C]/30 text-center font-sans space-y-2">
                <MapPin className="w-5 h-5 text-[#DFB76C] mx-auto" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#DFB76C]">
                  Kirim Kado Fisik
                </h5>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                  {d.giftAddress}
                </p>
                <button
                  type="button"
                  onClick={d.copyAddress}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full bg-[#1A202C] border border-[#DFB76C]/40 text-[#F5DE9C] hover:bg-[#252D3D] transition-colors"
                >
                  {d.copiedAddress ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Alamat Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#DFB76C]" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 10. RSVP (KONFIRMASI KEHADIRAN) */}
        {/* ============================================================== */}
        <section data-reveal className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#DFB76C] font-semibold block">
              Konfirmasi Kehadiran
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-theme font-bold text-white mt-1">
              Reservasi Tamu
            </h3>
            <GoldFiligreeDivider />
            <p className="text-xs font-sans text-neutral-400 max-w-xs mx-auto">
              Mohon konfirmasikan kehadiran Anda demi kenyamanan dan kelancaran jamuan resepsi kami.
            </p>
          </div>

          <form
            onSubmit={d.rsvp?.send}
            className="p-6 rounded-2xl bg-[#121620] border border-[#DFB76C]/40 shadow-xl space-y-4 font-sans relative overflow-hidden"
          >
            <RoyalCorner position="top-right" />
            <RoyalCorner position="bottom-left" />

            {/* Nama */}
            <div>
              <label className="block text-xs font-semibold text-[#DFB76C] uppercase tracking-wider mb-1">
                Nama Tamu
              </label>
              <input
                type="text"
                name="name"
                value={d.rsvp?.name || ''}
                onChange={(e) => d.rsvp?.setName(e.target.value)}
                required
                placeholder="Masukkan nama lengkap"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#DFB76C]/30 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#DFB76C] focus:ring-1 focus:ring-[#DFB76C]"
              />
            </div>

            {/* Status Kehadiran */}
            <div>
              <label className="block text-xs font-semibold text-[#DFB76C] uppercase tracking-wider mb-2">
                Status Kehadiran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => d.rsvp?.setStatus('Hadir')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    d.rsvp?.status === 'Hadir'
                      ? 'bg-[#DFB76C] text-black border-[#DFB76C] shadow-md'
                      : 'bg-[#0B0D12] text-neutral-300 border-[#DFB76C]/30 hover:bg-[#1A202C]'
                  }`}
                >
                  ✓ Hadir
                </button>
                <button
                  type="button"
                  onClick={() => d.rsvp?.setStatus('Berhalangan')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    d.rsvp?.status === 'Berhalangan'
                      ? 'bg-red-900/60 text-red-200 border-red-500 shadow-md'
                      : 'bg-[#0B0D12] text-neutral-300 border-[#DFB76C]/30 hover:bg-[#1A202C]'
                  }`}
                >
                  ✕ Berhalangan
                </button>
              </div>
            </div>

            {/* Jumlah Tamu Pax */}
            {d.rsvp?.status === 'Hadir' && (
              <div>
                <label className="block text-xs font-semibold text-[#DFB76C] uppercase tracking-wider mb-1">
                  Jumlah Tamu (Pax)
                </label>
                <select
                  name="pax"
                  value={d.rsvp?.pax || '1 Orang'}
                  onChange={(e) => d.rsvp?.setPax(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#DFB76C]/30 text-white text-sm focus:outline-none focus:border-[#DFB76C]"
                >
                  <option value="1 Orang">1 Orang</option>
                  <option value="2 Orang">2 Orang</option>
                  <option value="3 Orang">3 Orang</option>
                  <option value="4 Orang">4 Orang</option>
                </select>
              </div>
            )}

            {/* Pesan & Doa */}
            <div>
              <label className="block text-xs font-semibold text-[#DFB76C] uppercase tracking-wider mb-1">
                Ucapan &amp; Doa Restu
              </label>
              <textarea
                name="message"
                value={d.rsvp?.message || ''}
                onChange={(e) => d.rsvp?.setMessage(e.target.value)}
                rows={3}
                placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#DFB76C]/30 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#DFB76C] focus:ring-1 focus:ring-[#DFB76C]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#C59B3F] via-[#F5DE9C] to-[#B88728] text-black shadow-lg hover:shadow-[0_0_20px_rgba(223,183,108,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Konfirmasi</span>
            </button>
          </form>
        </section>

        {/* ============================================================== */}
        {/* 11. BUKU TAMU / UCAPAN & DOA RESTU */}
        {/* ============================================================== */}
        {d.rsvp?.list && d.rsvp.list.length > 0 && (
          <section data-reveal className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#DFB76C] font-semibold block">
                Doa &amp; Harapan
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-theme font-bold text-white mt-1">
                Buku Tamu Kerajaan
              </h3>
              <GoldFiligreeDivider />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {d.rsvp.list.map((w, idx) => (
                <div
                  key={w.id || idx}
                  className="p-4 rounded-xl bg-[#121620] border border-[#DFB76C]/25 font-sans space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {w.guest_name || w.name || 'Tamu Undangan'}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {formatRsvpDate(w.created_at || w.createdAt)}
                    </span>
                  </div>
                  {w.attendance_status && (
                    <span
                      className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-medium ${
                        w.attendance_status === 'Hadir' || w.attendance_status === 'hadir'
                          ? 'bg-[#DFB76C]/20 text-[#F5DE9C] border border-[#DFB76C]/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {w.attendance_status === 'Hadir' || w.attendance_status === 'hadir' ? '✓ Hadir' : 'Berhalangan'}
                    </span>
                  )}
                  <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                    {w.message || w.wishes}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}



        {/* ============================================================== */}
        {/* 13. PENUTUP & ROYAL SIGN-OFF */}
        {/* ============================================================== */}
        <section data-reveal className="text-center space-y-4 pt-4 pb-8">
          <GoldFiligreeDivider />
          <p className="text-xs font-sans text-neutral-400 max-w-sm mx-auto leading-relaxed italic">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kami.
          </p>

          <div className="pt-4 space-y-1">
            <span className="text-[10px] font-sans text-[#DFB76C] uppercase tracking-widest block">
              Kami yang berbahagia,
            </span>
            <p className="text-3xl font-serif-theme font-bold text-gold-gradient">
              {d.groomShort} &amp; {d.brideShort}
            </p>
            <p className="text-xs text-neutral-400 font-sans">
              Keluarga Besar {d.groomFather} &amp; {d.brideFather}
            </p>
          </div>
        </section>
      </div>

      {/* Lightbox */}
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
