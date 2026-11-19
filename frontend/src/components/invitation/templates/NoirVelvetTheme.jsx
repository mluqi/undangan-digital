import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Check,
  Heart,
  Disc,
  Play,
  MailOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  QrCode,
  Sparkles,
  Copy,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GalleryLightbox } from '../GalleryLightbox';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';

const InstagramIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DEFAULT_QUOTE =
  '"Setiap pertemuan memiliki maknanya dan setiap perjalanan memiliki tujuannya. Hari ini, kami melangkah bersama, menyambut masa depan yang akan kami rajut dengan cinta, kesetiaan, dan harapan."';

const splitDayAndDate = (raw = '') => {
  if (!raw) return { day: 'Minggu', date: '15 November 2026' };
  const parts = String(raw).split(',');
  if (parts.length >= 2) {
    return {
      day: parts[0].trim(),
      date: parts.slice(1).join(',').trim(),
    };
  }
  const words = String(raw).trim().split(/\s+/);
  const knownDays = [
    'senin',
    'selasa',
    'rabu',
    'kamis',
    'jumat',
    "jum'at",
    'sabtu',
    'minggu',
    'ahad',
  ];
  if (words.length > 1 && knownDays.includes(words[0].toLowerCase())) {
    return {
      day: words[0],
      date: words.slice(1).join(' '),
    };
  }
  return {
    day: 'Hari Bahagia',
    date: raw,
  };
};

const getYoutubeEmbedUrl = (url = '') => {
  if (!url) return null;
  const trimmed = String(url).trim();
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/i);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  return null;
};

const KenBurnsSlideshow = ({ images = [], intervalMs = 3400, overlayClassName = '' }) => {
  const safeImages = useMemo(() => {
    const valid = (images || []).filter(Boolean);
    return valid.length > 0
      ? valid
      : [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
        ];
  }, [images]);

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % safeImages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [safeImages.length, intervalMs]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {safeImages.map((src, idx) => {
        const isActive = idx === activeIdx;
        return (
          <div
            key={`${src}-${idx}`}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={src}
              alt=""
              className={`w-full h-full object-cover object-top transition-transform duration-[6000ms] ease-out ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        );
      })}
      {overlayClassName && <div className={`absolute inset-0 z-20 ${overlayClassName}`} />}
    </div>
  );
};

/**
 * TEMA NOIR VELVET MOTION — "Espresso Noir & Champagne Editorial"
 * Desain sinematik modern dengan dukungan video latar kustom, palet Espresso Noir (#0D0A09)
 * & Champagne Gold (#E6D2BE), tipografi editorial, timeline vertikal, serta kustomisasi penuh.
 * Kode template di database: `noir-velvet`
 */
export const NoirVelvetTheme = ({
  invitation,
  guest,
  rsvps = [],
  onSubmitRsvp,
  isModalView = false,
  defaultOpened = false,
}) => {
  const d = useInvitationData({
    invitation,
    guest,
    rsvps,
    onSubmitRsvp,
    defaultOpened,
  });

  const [selectedEvents, setSelectedEvents] = useState(['akad', 'resepsi']);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [rsvpPage, setRsvpPage] = useState(1);
  const [desktopSlideIdx, setDesktopSlideIdx] = useState(0);
  const [isDesktopInfoHidden, setIsDesktopInfoHidden] = useState(false);
  const [videoLoadFailed, setVideoLoadFailed] = useState(false);

  const toggleEventSelection = (key) => {
    setSelectedEvents((prev) =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter((k) => k !== key) : prev) : [...prev, key]
    );
  };

  const akadParts = useMemo(() => splitDayAndDate(d.akad?.tanggal), [d.akad?.tanggal]);
  const resepsiParts = useMemo(() => splitDayAndDate(d.resepsi?.tanggal), [d.resepsi?.tanggal]);

  const groomInitial = (d.groomShort?.[0] || 'A').toUpperCase();
  const brideInitial = (d.brideShort?.[0] || 'S').toUpperCase();

  const desktopSlides = useMemo(() => {
    const list = [d.photoCover, ...(d.gallery || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [d.photoCover, d.gallery]);

  const heroSlideshowImages = useMemo(() => {
    const g = d.gallery || [];
    if (g.length >= 4) return g.slice(0, 4);
    return [d.photoCover, ...g].filter(Boolean);
  }, [d.photoCover, d.gallery]);

  const groomSlideshowImages = useMemo(() => {
    return [d.photoGroom, d.gallery?.[0] || d.photoCover].filter(Boolean);
  }, [d.photoGroom, d.gallery, d.photoCover]);

  const brideSlideshowImages = useMemo(() => {
    return [d.photoBride, d.gallery?.[1] || d.gallery?.[0] || d.photoCover].filter(Boolean);
  }, [d.photoBride, d.gallery, d.photoCover]);

  useEffect(() => {
    if (desktopSlides.length <= 1) return;
    const t = setInterval(() => {
      setDesktopSlideIdx((p) => (p + 1) % desktopSlides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [desktopSlides.length]);

  const activeBgVideoUrl =
    d.backgroundVideoUrl && d.backgroundVideoUrl !== 'none' ? d.backgroundVideoUrl : '';
  const youtubeEmbed = useMemo(() => getYoutubeEmbedUrl(d.preweddingVideoUrl), [d.preweddingVideoUrl]);

  const philosophicalQuote = d.kutipanPembuka?.trim()
    ? d.kutipanPembuka
    : !d.ayatQuote || d.ayatQuote.trim() === 'QS. Ar-Rum: 21'
    ? DEFAULT_QUOTE
    : d.ayatQuote;

  const monogramDisplay = d.monogramText?.trim() || `${groomInitial} & ${brideInitial}`;

  const rsvpsPerPage = 6;
  const totalRsvpPages = Math.max(1, Math.ceil((d.rsvp.list?.length || 0) / rsvpsPerPage));
  const paginatedRsvps = (d.rsvp.list || []).slice(
    (rsvpPage - 1) * rsvpsPerPage,
    rsvpPage * rsvpsPerPage
  );

  const combinedDateText =
    d.akad?.tanggal && d.resepsi?.tanggal && d.akad.tanggal !== d.resepsi.tanggal
      ? `${d.akad.tanggal} — ${d.resepsi.tanggal}`
      : d.akad?.tanggal || 'Minggu, 15 November 2026';

  return (
    <div
      className="relative min-h-screen w-full bg-[#0D0A09] text-[#F6EFE8] font-public-sans selection:bg-[#E6D2BE]/30 selection:text-white overflow-x-hidden"
      translate="no"
    >
      {/* =====================================================================
          1. DESKTOP LEFT EDITORIAL SHOWCASE
         ===================================================================== */}
      {!isModalView && (
        <aside
          aria-label="Desktop Couple Showcase"
          className="fixed inset-y-0 left-0 right-[430px] hidden lg:flex flex-col justify-between overflow-hidden z-10 bg-[#0D0A09] select-none"
        >
          <div className="absolute inset-0 z-0">
            {desktopSlides.map((src, idx) => {
              const active = idx === desktopSlideIdx;
              return (
                <div
                  key={`${src}-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={src}
                    alt={`${d.groomShort} & ${d.brideShort}`}
                    className={`w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                      active ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </div>
              );
            })}
            <div
              className="absolute inset-0 z-20 transition-opacity duration-500"
              style={{
                background: isDesktopInfoHidden
                  ? 'linear-gradient(180deg, rgba(13,10,9,0.05) 60%, rgba(13,10,9,0.7) 100%)'
                  : 'linear-gradient(180deg, rgba(13,10,9,0.22) 0%, rgba(13,10,9,0.38) 50%, rgba(13,10,9,0.94) 100%)',
              }}
            />
          </div>

          {/* Inset Editorial Frame */}
          <div className="pointer-events-none absolute inset-5 z-20 border border-[#E6D2BE]/15 rounded-2xl" />

          {/* Top Bar */}
          <div className="relative z-30 flex items-center justify-between px-10 pt-9">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E6D2BE]/30 bg-[#0D0A09]/50 backdrop-blur-md px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6D2BE]" />
              <span className="font-romantic text-xs uppercase tracking-[0.26em] text-[#E6D2BE]">
                {monogramDisplay}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {desktopSlides.length > 1 && (
                <div className="flex items-center gap-1.5 bg-[#0D0A09]/55 backdrop-blur-md border border-[#E6D2BE]/20 rounded-full px-2.5 py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setDesktopSlideIdx((p) => (p === 0 ? desktopSlides.length - 1 : p - 1))
                    }
                    className="p-1 text-[#E6D2BE]/80 hover:text-white cursor-pointer"
                    aria-label="Slide Sebelumnya"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-quicksand text-[#E6D2BE]/90 px-1">
                    {desktopSlideIdx + 1}/{desktopSlides.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDesktopSlideIdx((p) => (p + 1) % desktopSlides.length)}
                    className="p-1 text-[#E6D2BE]/80 hover:text-white cursor-pointer"
                    aria-label="Slide Selanjutnya"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsDesktopInfoHidden(!isDesktopInfoHidden)}
                className="flex items-center gap-1.5 rounded-full bg-[#0D0A09]/55 backdrop-blur-md border border-[#E6D2BE]/20 px-3.5 py-1.5 text-[11px] font-quicksand text-[#F6EFE8] hover:bg-[#0D0A09]/80 transition cursor-pointer"
              >
                {isDesktopInfoHidden ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-[#E6D2BE]" />
                    <span>Tampilkan Teks</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#E6D2BE]" />
                    <span>Lihat Foto Penuh</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Editorial Title */}
          <div
            className={`relative z-30 px-12 pb-14 text-left transition-all duration-700 ${
              isDesktopInfoHidden
                ? 'opacity-0 translate-y-6 pointer-events-none'
                : 'opacity-100 translate-y-0'
            }`}
          >
            <p className="font-quicksand text-[11px] uppercase tracking-[0.38em] text-[#E6D2BE] mb-2">
              {d.coverSubtitle}
            </p>
            <h1 className="font-romantic text-[60px] xl:text-[70px] font-medium uppercase leading-[0.98] text-[#FAF3EC] tracking-wide drop-shadow-[0_6px_28px_rgba(0,0,0,0.65)]">
              {d.groomShort} <span className="text-[#E6D2BE] font-light">&amp;</span> {d.brideShort}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-[1px] w-10 bg-[#E6D2BE]/60" />
              <p className="font-quicksand text-[13px] font-light text-[#E6D2BE]/90 tracking-wider">
                {combinedDateText}
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* =====================================================================
          2. RIGHT / MOBILE INVITATION COLUMN (430px Desktop)
         ===================================================================== */}
      <main
        className={`relative w-full ${
          isModalView ? 'max-w-[430px] mx-auto' : 'lg:ml-auto lg:w-[430px]'
        } min-h-screen bg-[#0D0A09] text-[#F6EFE8] overflow-hidden shadow-[0_0_90px_rgba(0,0,0,0.95)] lg:border-l lg:border-[#E6D2BE]/15`}
      >
        {/* Fixed Background Video / Ken Burns Photo Layer */}
        <div
          className={`fixed inset-y-0 ${
            isModalView
              ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
              : 'left-0 right-0 lg:left-auto lg:right-0 lg:w-[430px]'
          } z-0 overflow-hidden pointer-events-none bg-[#0D0A09]`}
        >
          {activeBgVideoUrl && !videoLoadFailed ? (
            <video
              key={activeBgVideoUrl}
              className="w-full h-full object-cover"
              src={activeBgVideoUrl}
              poster={d.photoCover}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoLoadFailed(true)}
            />
          ) : (
            <KenBurnsSlideshow images={desktopSlides} intervalMs={4800} />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(13,10,9,0.68) 0%, rgba(13,10,9,0.58) 45%, rgba(13,10,9,0.88) 100%)',
            }}
          />
        </div>

        {/* -------------------------------------------------------------------
            OPENING COVER OVERLAY
           ------------------------------------------------------------------- */}
        <section
          aria-label="Sampul Undangan"
          className={`fixed inset-y-0 ${
            isModalView
              ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
              : 'left-0 right-0 lg:left-auto lg:right-0 lg:w-[430px]'
          } z-50 flex flex-col justify-between items-center text-center px-6 py-12 transition-all duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            d.isOpened
              ? '-translate-y-full opacity-0 pointer-events-none'
              : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="absolute inset-0 z-0 bg-[#0D0A09]">
            <img
              src={d.photoCover}
              alt={`${d.groomShort} & ${d.brideShort}`}
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(13,10,9,0.65) 0%, rgba(13,10,9,0.28) 42%, rgba(13,10,9,0.92) 100%)',
              }}
            />
          </div>

          {/* Inset Archival Border */}
          <div className="pointer-events-none absolute inset-4 z-10 border border-[#E6D2BE]/25 rounded-[22px]" />

          {/* Top Monogram & Couple Title */}
          <div className="relative z-20 mt-4 flex flex-col items-center space-y-3">
            <div className="px-4 py-1 rounded-full border border-[#E6D2BE]/40 bg-[#0D0A09]/45 backdrop-blur-md">
              <span className="font-quicksand text-[10px] uppercase tracking-[0.3em] text-[#E6D2BE]">
                {d.coverSubtitle}
              </span>
            </div>
            <h1 className="font-romantic text-[50px] sm:text-[56px] font-medium uppercase leading-[0.94] tracking-wide text-[#FAF3EC] drop-shadow-[0_4px_22px_rgba(0,0,0,0.7)]">
              {d.groomShort}
              <span className="block text-[26px] text-[#E6D2BE] my-1 font-light">&amp;</span>
              {d.brideShort}
            </h1>
          </div>

          {/* Bottom Guest Greeting & Open CTA */}
          <div className="relative z-20 w-full flex flex-col items-center space-y-3 mb-2">
            <p className="font-quicksand text-[10px] uppercase tracking-[0.28em] text-[#E6D2BE]/85">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>

            <div className="space-y-1">
              <h2
                id="namatamu"
                className="font-romantic text-[24px] sm:text-[26px] font-medium leading-[1.25] tracking-wide text-white"
              >
                {d.guestName}
              </h2>
              {d.isVip && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-quicksand uppercase tracking-widest bg-[#E6D2BE]/15 border border-[#E6D2BE]/40 text-[#E6D2BE]">
                  <Sparkles className="w-2.5 h-2.5" /> {d.guestCategory}
                </span>
              )}
            </div>

            <div className="pt-2">
              <button
                id="tombol-buka"
                type="button"
                onClick={d.openInvitation}
                className="inline-flex items-center justify-center gap-2.5 bg-[#E6D2BE] hover:bg-[#FAF3EC] text-[#140C09] font-quicksand text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <MailOpen className="w-3.5 h-3.5" />
                <span>Buka Undangan</span>
              </button>
            </div>

            <p className="font-ysabeau text-[10px] text-[#E6D2BE]/70 pt-1 px-4">
              {d.coverFootnote}
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            MAIN SCROLLABLE INVITATION CONTENT
           ------------------------------------------------------------------- */}
        <div className="relative z-10 w-full">
          {/* SECTION 1: EDITORIAL CREST & QUOTE */}
          <section className="min-h-[86vh] flex flex-col justify-center items-center text-center px-8 py-24">
            <div className="w-full max-w-[320px] space-y-6">
              {/* Circular Champagne Crest */}
              <div className="mx-auto w-24 h-24 rounded-full border border-[#E6D2BE]/45 bg-[#140E0C]/60 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(230,210,190,0.08)]">
                <span className="font-romantic text-[28px] uppercase tracking-[0.14em] text-[#E6D2BE]">
                  {monogramDisplay}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="h-[1px] w-14 bg-[#E6D2BE]/45" />
                <Heart className="w-3.5 h-3.5 text-[#E6D2BE] fill-[#E6D2BE]/30" />
                <span className="h-[1px] w-14 bg-[#E6D2BE]/45" />
              </div>

              <p className="font-ysabeau italic text-[16px] leading-[1.65] text-[#F6EFE8]/95">
                {philosophicalQuote}
              </p>

              <p className="font-romantic text-[26px] uppercase tracking-wider text-[#E6D2BE] pt-1">
                {d.groomShort} &amp; {d.brideShort}
              </p>
            </div>
          </section>

          {/* SECTION 2: HERO SLIDESHOW & SALAM PEMBUKA */}
          <section className="relative min-h-[78vh] flex flex-col justify-end px-6 pt-12 pb-14 overflow-hidden">
            <KenBurnsSlideshow
              images={heroSlideshowImages}
              intervalMs={3200}
              overlayClassName="bg-[linear-gradient(180deg,rgba(13,10,9,0.1)_25%,#0D0A09_96%)]"
            />

            <div className="relative z-20 flex flex-col items-center text-center space-y-3 pt-[40vh]">
              <p className="font-quicksand text-[10px] uppercase tracking-[0.34em] text-[#E6D2BE]">
                {d.coverSubtitle}
              </p>
              <h2 className="font-romantic text-[36px] font-normal uppercase leading-tight text-white">
                {d.groomShort} &amp; {d.brideShort}
              </h2>

              <div className="w-24 h-[1px] bg-[#E6D2BE]/50 my-2" />

              <p className="font-public-sans text-[13px] font-light leading-[1.6] text-[#F6EFE8]/90 max-w-xs">
                {d.openingGreeting}
              </p>
            </div>
          </section>

          {/* SECTION 3: GROOM & BRIDE ARCHED PORTRAIT CARDS */}
          <section className="relative bg-[#0D0A09]/85 px-5 py-16 space-y-8">
            {/* GROOM */}
            <div className="relative rounded-t-[150px] rounded-b-2xl overflow-hidden min-h-[520px] flex flex-col justify-between border border-[#E6D2BE]/25 shadow-2xl">
              <KenBurnsSlideshow
                images={groomSlideshowImages}
                intervalMs={2800}
                overlayClassName="bg-[linear-gradient(180deg,rgba(13,10,9,0.28)_0%,rgba(13,10,9,0.1)_40%,rgba(13,10,9,0.95)_100%)]"
              />

              <div className="relative z-20 pt-7 text-center">
                <span className="inline-block px-4 py-1 rounded-full bg-[#0D0A09]/65 backdrop-blur-md border border-[#E6D2BE]/30 font-quicksand text-[10px] uppercase tracking-[0.28em] text-[#E6D2BE]">
                  01 &bull; The Groom
                </span>
              </div>

              <div className="relative z-20 mt-auto p-6 bg-gradient-to-t from-[#0D0A09] via-[#0D0A09]/85 to-transparent text-center space-y-1.5">
                <h3 className="font-romantic text-[42px] font-normal uppercase leading-none text-white">
                  {d.groomShort}
                </h3>
                <p className="font-romantic text-[22px] font-normal text-[#E6D2BE]">
                  {d.groom}
                </p>
                <p className="font-public-sans text-[12.5px] font-light leading-[1.55] text-[#F6EFE8]/85 pt-1">
                  {d.groomChildOrder} dari {d.groomFather} dan {d.groomMother}
                </p>
                {d.groomInstagram && (
                  <div className="pt-2.5">
                    <a
                      href={`https://instagram.com/${d.groomInstagram.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#E6D2BE]/10 hover:bg-[#E6D2BE] hover:text-[#140C09] text-[#E6D2BE] font-quicksand text-[11px] font-medium px-4 py-2 rounded-full border border-[#E6D2BE]/30 transition"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span>@{d.groomInstagram.replace(/^@/, '')}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* BRIDE */}
            <div className="relative rounded-t-[150px] rounded-b-2xl overflow-hidden min-h-[520px] flex flex-col justify-between border border-[#E6D2BE]/25 shadow-2xl">
              <KenBurnsSlideshow
                images={brideSlideshowImages}
                intervalMs={2800}
                overlayClassName="bg-[linear-gradient(180deg,rgba(13,10,9,0.28)_0%,rgba(13,10,9,0.1)_40%,rgba(13,10,9,0.95)_100%)]"
              />

              <div className="relative z-20 pt-7 text-center">
                <span className="inline-block px-4 py-1 rounded-full bg-[#0D0A09]/65 backdrop-blur-md border border-[#E6D2BE]/30 font-quicksand text-[10px] uppercase tracking-[0.28em] text-[#E6D2BE]">
                  02 &bull; The Bride
                </span>
              </div>

              <div className="relative z-20 mt-auto p-6 bg-gradient-to-t from-[#0D0A09] via-[#0D0A09]/85 to-transparent text-center space-y-1.5">
                <h3 className="font-romantic text-[42px] font-normal uppercase leading-none text-white">
                  {d.brideShort}
                </h3>
                <p className="font-romantic text-[22px] font-normal text-[#E6D2BE]">
                  {d.bride}
                </p>
                <p className="font-public-sans text-[12.5px] font-light leading-[1.55] text-[#F6EFE8]/85 pt-1">
                  {d.brideChildOrder} dari {d.brideFather} dan {d.brideMother}
                </p>
                {d.brideInstagram && (
                  <div className="pt-2.5">
                    <a
                      href={`https://instagram.com/${d.brideInstagram.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#E6D2BE]/10 hover:bg-[#E6D2BE] hover:text-[#140C09] text-[#E6D2BE] font-quicksand text-[11px] font-medium px-4 py-2 rounded-full border border-[#E6D2BE]/30 transition"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span>@{d.brideInstagram.replace(/^@/, '')}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 4: COUNTDOWN & AGENDA ACARA */}
          <section className="relative px-5 py-16 flex flex-col items-center text-center space-y-7">
            {/* Countdown Box */}
            <div className="w-full rounded-2xl bg-[#150F0D]/80 backdrop-blur-md border border-[#E6D2BE]/20 px-3 py-6 space-y-4">
              <p className="font-romantic text-[23px] font-normal text-[#FAF3EC]">
                {d.countdownTitle}
              </p>

              <div className="grid grid-cols-4 divide-x divide-[#E6D2BE]/15">
                {[
                  { label: 'Hari', value: d.timeLeft.days },
                  { label: 'Jam', value: d.timeLeft.hours },
                  { label: 'Menit', value: d.timeLeft.minutes },
                  { label: 'Detik', value: d.timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center px-1">
                    <span className="font-sugar text-[38px] sm:text-[42px] leading-none text-[#E6D2BE]">
                      {String(item.value ?? 0).padStart(2, '0')}
                    </span>
                    <span className="font-quicksand text-[10px] uppercase tracking-[0.2em] text-[#F6EFE8]/75 mt-1.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <a
                  href={d.googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#E6D2BE]/15 hover:bg-[#E6D2BE] hover:text-[#140C09] text-[#E6D2BE] font-quicksand text-[11px] font-semibold uppercase tracking-[0.16em] px-6 py-2.5 rounded-full border border-[#E6D2BE]/35 transition duration-300"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Save The Date</span>
                </a>
              </div>
            </div>

            {/* Event Cards */}
            <div className="w-full space-y-6">
              {[
                { ev: d.akad, parts: akadParts, defaultTitle: 'Akad Nikah' },
                { ev: d.resepsi, parts: resepsiParts, defaultTitle: 'Resepsi' },
              ].map(({ ev, parts, defaultTitle }, idx) => (
                <div
                  key={idx}
                  className="w-full rounded-2xl bg-[#150F0D]/80 backdrop-blur-md px-5 py-9 flex flex-col items-center text-center space-y-2 border border-[#E6D2BE]/20 shadow-xl"
                >
                  <span className="text-[10px] font-quicksand uppercase tracking-[0.3em] text-[#E6D2BE]/80">
                    0{idx + 1} &bull; Rangkaian Acara
                  </span>
                  <h2 className="font-romantic text-[32px] font-normal uppercase text-white leading-tight">
                    {ev?.judul || defaultTitle}
                  </h2>
                  <div className="w-24 h-[1px] bg-[#E6D2BE]/45 my-2" />

                  <p className="font-romantic text-[26px] font-light uppercase text-[#E6D2BE] pt-1">
                    {parts.day}
                  </p>
                  <p className="font-public-sans text-[20px] font-extralight uppercase text-white">
                    {parts.date}
                  </p>
                  <p className="font-quicksand text-[12px] uppercase tracking-[0.15em] text-[#E6D2BE]/90">
                    {ev?.waktu}
                  </p>

                  <div className="pt-4 pb-2 flex flex-col items-center space-y-1.5 px-2">
                    <MapPin className="w-6 h-6 text-[#E6D2BE] stroke-[1.5] mb-1" />
                    <h3 className="font-romantic text-[18px] uppercase tracking-wider text-white">
                      {ev?.lokasi}
                    </h3>
                    {ev?.alamat && (
                      <p className="font-public-sans text-[12px] font-light leading-relaxed text-[#F6EFE8]/80 max-w-[280px]">
                        {ev.alamat}
                      </p>
                    )}
                  </div>

                  {ev?.mapUrl && (
                    <div className="pt-2">
                      <a
                        href={ev.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#E6D2BE]/40 bg-[#E6D2BE]/10 hover:bg-[#E6D2BE] hover:text-[#140C09] text-[#E6D2BE] font-quicksand text-[11px] font-semibold uppercase tracking-[0.15em] px-6 py-2.5 transition"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Lihat Lokasi</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: OUR MOMENTS (VIDEO + FRAMED GALLERY) */}
          <section className="relative bg-[#0D0A09]/70 px-4 py-14 space-y-5">
            <div className="text-center space-y-1">
              <p className="font-quicksand text-[10px] uppercase tracking-[0.32em] text-[#E6D2BE]">
                Gallery
              </p>
              <h2 className="font-romantic text-[34px] font-normal uppercase text-white">
                {d.momentsTitle}
              </h2>
            </div>

            {d.preweddingVideoUrl && (
              <div className="w-full aspect-video rounded-2xl bg-black relative overflow-hidden border border-[#E6D2BE]/20 shadow-lg">
                {!isVideoPlaying ? (
                  <button
                    type="button"
                    onClick={() => setIsVideoPlaying(true)}
                    className="group relative w-full h-full block cursor-pointer"
                    aria-label="Putar Video Prewedding"
                  >
                    <img
                      src={d.gallery?.[0] || d.photoCover}
                      alt="Video Cover"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#0D0A09]/45 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#E6D2BE]/20 backdrop-blur-md border border-[#E6D2BE]/60 flex items-center justify-center text-[#E6D2BE] shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 fill-[#E6D2BE] ml-0.5" />
                      </div>
                    </div>
                  </button>
                ) : youtubeEmbed ? (
                  <iframe
                    src={youtubeEmbed}
                    title="Our Moments Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={d.preweddingVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {(d.gallery || []).map((photoUrl, idx) => {
                const isWide = idx % 5 === 0;
                return (
                  <button
                    key={`${photoUrl}-${idx}`}
                    type="button"
                    onClick={() => d.openLightbox(idx)}
                    className={`group relative overflow-hidden rounded-xl border border-[#E6D2BE]/15 bg-[#150F0D] cursor-pointer ${
                      isWide ? 'col-span-2 aspect-[16/10]' : 'col-span-1 aspect-[3/4]'
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Moment ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#0D0A09]/0 group-hover:bg-[#0D0A09]/35 transition-colors duration-500" />
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 6: OUR STORIES (VERTICAL CHAMPAGNE TIMELINE) */}
          {d.loveStories && d.loveStories.length > 0 && (
            <section className="relative bg-[#0D0A09]/80 px-6 py-16 space-y-7">
              <div className="text-center space-y-1">
                <p className="font-quicksand text-[10px] uppercase tracking-[0.32em] text-[#E6D2BE]">
                  Journey
                </p>
                <h2 className="font-romantic text-[34px] font-normal uppercase text-white">
                  {d.storiesTitle}
                </h2>
              </div>

              <div className="relative pl-6 border-l border-[#E6D2BE]/30 space-y-6">
                {d.loveStories.map((story, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl bg-[#150F0D]/80 backdrop-blur-md border border-[#E6D2BE]/15 p-5 space-y-2"
                  >
                    <span
                      className="absolute -left-[29px] top-6 w-2.5 h-2.5 rounded-full bg-[#E6D2BE] ring-4 ring-[#0D0A09]"
                      aria-hidden="true"
                    />
                    {story.tahun && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E6D2BE]/15 border border-[#E6D2BE]/30 font-quicksand text-[10px] font-semibold tracking-widest text-[#E6D2BE]">
                        {story.tahun}
                      </span>
                    )}
                    <h3 className="font-romantic text-[22px] font-normal text-white">
                      {story.judul}
                    </h3>
                    <p className="font-public-sans text-[12.5px] font-light leading-[1.6] text-[#F6EFE8]/85">
                      {story.cerita}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 7: WEDDING GIFT */}
          {((d.showDonation && d.bankAccounts.length > 0) || (d.showGift && d.giftAddress)) && (
            <section className="relative bg-[#0D0A09]/70 px-5 py-14 space-y-6">
              <div className="text-center space-y-2">
                <p className="font-quicksand text-[10px] uppercase tracking-[0.32em] text-[#E6D2BE]">
                  Tanda Kasih
                </p>
                <h2 className="font-romantic text-[34px] font-normal uppercase text-white">
                  {d.giftTitle}
                </h2>
                <p className="font-public-sans text-[12px] font-light leading-[1.6] text-[#F6EFE8]/85 px-2">
                  {d.giftSubtitle}
                </p>
              </div>

              <div className="space-y-4">
                {d.showDonation &&
                  d.bankAccounts.map((acc, idx) => (
                    <div
                      key={idx}
                      className="relative flex flex-col items-center text-center px-5 py-6 rounded-2xl bg-[#150F0D]/85 backdrop-blur-xl border border-[#E6D2BE]/20 shadow-xl overflow-hidden font-quicksand"
                    >
                      <div className="text-[18px] font-bold tracking-[0.2em] uppercase text-[#E6D2BE] mb-3">
                        {acc.bank}
                      </div>
                      <div className="mb-4">
                        <div className="text-[16px] font-bold tracking-[0.14em] text-white mb-1">
                          {acc.nomor}
                        </div>
                        <div className="text-[12px] font-medium text-[#F6EFE8]/80">{acc.nama}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => d.copyBank(acc.nomor, idx)}
                        className="inline-flex items-center justify-center gap-2 px-7 py-2 rounded-full bg-[#E6D2BE]/15 hover:bg-[#E6D2BE] hover:text-[#140C09] text-[#E6D2BE] border border-[#E6D2BE]/35 text-[12px] font-semibold transition cursor-pointer"
                      >
                        {d.copiedBankIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Rekening</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}

                {d.showGift && d.giftAddress && (
                  <div className="relative flex flex-col items-center text-center px-5 py-6 rounded-2xl bg-[#150F0D]/85 backdrop-blur-xl border border-[#E6D2BE]/20 shadow-xl overflow-hidden font-quicksand">
                    <div className="text-[16px] font-bold tracking-[0.2em] uppercase text-[#E6D2BE] mb-3">
                      Kirim Kado Fisik
                    </div>
                    <div className="space-y-2 mb-4 px-2">
                      {d.giftRecipient && (
                        <div className="text-[12px] text-white">
                          <span className="text-[#E6D2BE] font-semibold">Penerima: </span>
                          {d.giftRecipient}
                        </div>
                      )}
                      <div className="text-[12px] text-[#F6EFE8]/85 leading-relaxed">
                        {d.giftAddress}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={d.copyAddress}
                      className="inline-flex items-center justify-center gap-2 px-7 py-2 rounded-full bg-[#E6D2BE]/15 hover:bg-[#E6D2BE] hover:text-[#140C09] text-[#E6D2BE] border border-[#E6D2BE]/35 text-[12px] font-semibold transition cursor-pointer"
                    >
                      {d.copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Alamat</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 8: QR CHECK-IN PASS */}
          {d.showQr && (
            <section className="relative bg-[#0D0A09]/70 px-5 pb-8">
              <div className="flex flex-col items-center text-center px-5 py-7 rounded-2xl bg-[#150F0D]/85 backdrop-blur-xl border border-[#E6D2BE]/25 shadow-xl font-quicksand">
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#E6D2BE] mb-1">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Access Pass</span>
                </div>
                <h3 className="font-romantic text-[26px] uppercase text-white mb-4">
                  QR Check-In Tamu
                </h3>
                <div className="p-3 bg-white rounded-2xl shadow-lg mb-3">
                  <QRCodeSVG value={d.qrValue} size={136} level="M" includeMargin={false} />
                </div>
                <p className="text-[13px] font-semibold text-[#E6D2BE]">{d.guestName}</p>
                <p className="text-[11px] text-[#F6EFE8]/70 mt-1 max-w-[260px]">
                  Tunjukkan kode QR ini kepada petugas penerima tamu di lokasi acara.
                </p>
              </div>
            </section>
          )}

          {/* SECTION 9: RSVP & UCAPAN DOA */}
          <section id="rsvp-section" className="relative px-4 py-16 space-y-2">
            <p className="font-romantic text-[68px] font-normal uppercase leading-none text-center text-[#E6D2BE]/25">
              {d.rsvpTitle}
            </p>
            <h2 className="font-romantic text-[30px] font-normal uppercase text-center text-white -mt-6 pb-4">
              {d.rsvpSubtitle}
            </h2>

            <div className="rounded-2xl bg-[#150F0D]/80 backdrop-blur-md px-5 py-8 border border-[#E6D2BE]/20">
              <div className="text-center space-y-1 mb-6">
                <h3 className="font-public-sans text-[16px] font-light text-white">
                  Berikan Ucapan &amp; Doa Terbaik
                </h3>
                <p className="font-public-sans text-[12px] font-light text-[#E6D2BE]/80">
                  Untuk Kedua Mempelai
                </p>
              </div>

              <form onSubmit={d.rsvp.send} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px] text-[#F6EFE8]">
                    <label>
                      Nama Tamu <span className="text-[#E6D2BE]">*</span>
                    </label>
                    <span className="text-[11px] text-[#F6EFE8]/50">
                      ({(d.rsvp.name || '').length}/100)
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={100}
                    required
                    value={d.rsvp.name}
                    onChange={(e) => d.rsvp.setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full rounded-xl bg-[#0D0A09]/70 border border-[#E6D2BE]/20 px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:outline-none focus:border-[#E6D2BE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[12px] text-[#F6EFE8]">
                    Konfirmasi Kehadiran <span className="text-[#E6D2BE]">*</span>
                  </label>
                  <select
                    value={d.rsvp.status}
                    onChange={(e) => d.rsvp.setStatus(e.target.value)}
                    className="w-full rounded-xl bg-[#0D0A09]/70 border border-[#E6D2BE]/20 px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#E6D2BE]"
                  >
                    <option value="Hadir" className="bg-[#150F0D] text-white">
                      Hadir
                    </option>
                    <option value="Tidak Hadir" className="bg-[#150F0D] text-white">
                      Tidak Hadir
                    </option>
                  </select>
                </div>

                {d.rsvp.status === 'Hadir' && (
                  <div className="space-y-1.5">
                    <label className="block text-[12px] text-[#F6EFE8]">
                      Pilih Acara <span className="text-[#E6D2BE]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'akad', label: d.akad?.judul || 'Akad Nikah', sub: akadParts.day },
                        {
                          key: 'resepsi',
                          label: d.resepsi?.judul || 'Resepsi',
                          sub: resepsiParts.day,
                        },
                      ].map((ev) => {
                        const isSelected = selectedEvents.includes(ev.key);
                        return (
                          <button
                            key={ev.key}
                            type="button"
                            onClick={() => toggleEventSelection(ev.key)}
                            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#E6D2BE]/15 border-[#E6D2BE] text-[#E6D2BE]'
                                : 'bg-[#0D0A09]/65 border-[#E6D2BE]/20 text-white/75 hover:opacity-100'
                            }`}
                          >
                            {isSelected && (
                              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#E6D2BE] text-[#140C09] flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                            <Calendar className="w-5 h-5 mb-1.5" />
                            <span className="text-[12px] font-medium">{ev.label}</span>
                            <span className="text-[10px] opacity-75 mt-0.5">{ev.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px] text-[#F6EFE8]">
                    <label>
                      Ucapan &amp; Doa <span className="text-[#E6D2BE]">*</span>
                    </label>
                    <span className="text-[11px] text-[#F6EFE8]/50">
                      ({(d.rsvp.message || '').length}/500)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    required
                    value={d.rsvp.message}
                    onChange={(e) => d.rsvp.setMessage(e.target.value)}
                    placeholder="Tuliskan doa dan ucapan terbaik untuk kedua mempelai..."
                    className="w-full rounded-xl bg-[#0D0A09]/70 border border-[#E6D2BE]/20 px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:outline-none focus:border-[#E6D2BE]"
                  />
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={d.rsvp.hasSubmitted}
                    className="inline-flex items-center justify-center bg-[#E6D2BE] hover:bg-[#FAF3EC] text-[#140C09] font-quicksand text-[12px] font-bold uppercase tracking-[0.16em] px-10 py-3 rounded-full transition cursor-pointer disabled:opacity-50"
                  >
                    {d.rsvp.hasSubmitted ? 'Ucapan Terkirim' : 'Kirim Ucapan'}
                  </button>
                </div>
              </form>

              {d.rsvp.list && d.rsvp.list.length > 0 && (
                <div className="mt-7 pt-5 border-t border-[#E6D2BE]/15 space-y-2.5">
                  <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2.5">
                    {paginatedRsvps.map((item, idx) => {
                      const initial = (item.guest_name || 'T')[0].toUpperCase();
                      const isAttending = item.attendance_status === 'Hadir';
                      return (
                        <div
                          key={item.id || idx}
                          className="p-3.5 rounded-xl bg-[#0D0A09]/65 border border-[#E6D2BE]/15 flex items-start gap-3 text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#E6D2BE]/15 text-[#E6D2BE] font-quicksand text-[13px] font-semibold flex items-center justify-center shrink-0 border border-[#E6D2BE]/25">
                            {initial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-quicksand text-[13px] font-semibold text-white">
                                {item.guest_name}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                                  isAttending
                                    ? 'bg-[#E6D2BE]/15 text-[#E6D2BE] border border-[#E6D2BE]/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {item.attendance_status || 'Hadir'}
                              </span>
                            </div>
                            <p className="text-[9px] text-[#F6EFE8]/55 mt-0.5">
                              {formatRsvpDate(item)}
                            </p>
                            <p className="font-public-sans text-[12px] font-light text-[#F6EFE8]/90 mt-1.5 leading-relaxed break-words">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalRsvpPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        disabled={rsvpPage <= 1}
                        onClick={() => setRsvpPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded-full bg-[#E6D2BE]/15 text-[#E6D2BE] text-[11px] disabled:opacity-40 cursor-pointer"
                      >
                        « Prev
                      </button>
                      <span className="text-[11px] text-[#F6EFE8]/75">
                        {rsvpPage} / {totalRsvpPages}
                      </span>
                      <button
                        type="button"
                        disabled={rsvpPage >= totalRsvpPages}
                        onClick={() => setRsvpPage((p) => Math.min(totalRsvpPages, p + 1))}
                        className="px-3 py-1 rounded-full bg-[#E6D2BE]/15 text-[#E6D2BE] text-[11px] disabled:opacity-40 cursor-pointer"
                      >
                        Next »
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 10: TERIMA KASIH / CLOSING */}
          <section className="relative px-6 py-24 flex flex-col items-center text-center bg-gradient-to-b from-transparent via-[#0D0A09]/80 to-[#0D0A09]">
            <h2 className="font-romantic text-[38px] font-normal uppercase text-[#E6D2BE]">
              {d.closingTitle}
            </h2>
            <p className="font-public-sans text-[12px] font-light text-[#F6EFE8]/85 mt-1">
              {d.closingSubtitle}
            </p>

            <div className="w-[64%] my-8 overflow-hidden rounded-t-[100px] rounded-b-2xl shadow-2xl border border-[#E6D2BE]/25">
              <img
                src={d.photoClosing || d.gallery?.[2] || d.gallery?.[0] || d.photoCover}
                alt={`${d.groomShort} & ${d.brideShort}`}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            {d.closingText && (
              <p className="font-public-sans text-[12px] font-light leading-relaxed text-[#F6EFE8]/80 max-w-xs mb-5">
                {d.closingText}
              </p>
            )}

            <p className="font-public-sans text-[13px] font-light text-[#E6D2BE]/90">
              {d.closingSignoff}
            </p>
            <p className="font-romantic text-[32px] font-medium uppercase text-white mt-1">
              {d.groomShort} &amp; {d.brideShort}
            </p>
          </section>

          {/* FOOTER */}
          <footer className="bg-[#080605] py-7 px-4 text-center border-t border-[#E6D2BE]/15 space-y-1.5">
            <p className="font-quicksand text-[10px] uppercase tracking-[0.2em] text-[#F6EFE8]/60">
              Made with Love by
            </p>
            <p className="font-romantic text-[18px] tracking-[0.2em] uppercase text-[#E6D2BE]">
              {d.footerBrand}
            </p>
          </footer>
        </div>

        {/* Spinning Compact Disc Music Toggle */}
        {d.isOpened && (
          <button
            type="button"
            onClick={d.toggleMusic}
            aria-label={d.isPlayingMusic ? 'Jeda Musik' : 'Putar Musik'}
            className="fixed bottom-[30px] right-[25px] z-40 w-[38px] h-[38px] rounded-full bg-[#150F0D]/80 backdrop-blur-md border border-[#E6D2BE]/40 flex items-center justify-center text-[#E6D2BE] shadow-[0_4px_14px_rgba(0,0,0,0.55)] hover:scale-110 transition cursor-pointer"
          >
            <Disc
              className={`w-5 h-5 ${d.isPlayingMusic ? 'animate-spin' : 'opacity-65'}`}
              style={{ animationDuration: '3s' }}
            />
          </button>
        )}

        <InvitationFloatingControls
          isOpened={d.isOpened}
          guest={guest}
          guestName={d.guestName}
          qrValue={d.qrValue}
          showQr={d.showQr}
          invitationTitle={`${d.groomShort} & ${d.brideShort}`}
          accentColor="#1C1410"
        />

        <GalleryLightbox
          images={d.gallery}
          selectedIndex={d.gallerySelected}
          isOpen={d.isLightboxOpen}
          onClose={() => d.setIsLightboxOpen(false)}
          onSelectIndex={d.setGallerySelected}
        />
      </main>
    </div>
  );
};
