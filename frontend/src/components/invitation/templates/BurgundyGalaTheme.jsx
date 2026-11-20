import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ZoomIn,
  ZoomOut,
  X,
  LayoutGrid,
  Award,
} from 'lucide-react';
import { DesktopSidePanel } from '../DesktopSidePanel';
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { Reveal } from '../Reveal';
import { useInvitationData } from '../useInvitationData';

const ENVELOPE_IMAGE = '/images/burgundy-gala/envelope-closed.png';

const GOLD_DUST = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 7.3 + 5) % 94}%`,
  size: 3 + (i % 3) * 2,
  duration: `${10 + (i % 5) * 2}s`,
  delay: `${(i * 0.7) % 5}s`,
}));

export const BurgundyGalaTheme = (props) => {
  const { invitation, isModalView = false, defaultOpened = false } = props;
  const d = useInvitationData(props);

  const [openPhase, setOpenPhase] = useState(defaultOpened ? 'opened' : 'closed');
  const [seatPlanLightboxOpen, setSeatPlanLightboxOpen] = useState(false);
  const [seatPlanZoom, setSeatPlanZoom] = useState(1);
  const timersRef = useRef([]);

  const rawContent = invitation?.content_json || {};
  const templateDefaults = invitation?.template?.default_content_json || {};
  const seatPlanImage =
    rawContent.seatPlanImage || templateDefaults.seatPlanImage || '';
  const seatPlanTitle =
    rawContent.seatPlanTitle ||
    templateDefaults.seatPlanTitle ||
    'Seat Plan & Denah Ruangan';
  const seatPlanCaption =
    rawContent.seatPlanCaption ||
    templateDefaults.seatPlanCaption ||
    'Silakan periksa posisi meja atau tempat duduk Anda melalui denah di bawah ini. Ketuk gambar untuk memperbesar.';

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    clearTimers();
    setOpenPhase(defaultOpened ? 'opened' : 'closed');
  }, [defaultOpened]);

  const triggerEnvelopeOpen = () => {
    if (openPhase !== 'closed') return;
    clearTimers();
    setOpenPhase('flap-open');

    const t1 = setTimeout(() => {
      setOpenPhase('zooming');
    }, 680);

    const t2 = setTimeout(() => {
      setOpenPhase('opened');
      d.openInvitation();
    }, 1360);

    timersRef.current.push(t1, t2);
  };

  const isOverlayHidden = openPhase === 'opened' || d.isOpened;

  const eventTitleDisplay =
    d.showSecondPerson !== false
      ? `${d.brideShort} & ${d.groomShort}`
      : d.groom || d.groomShort;

  const sidePanelData = useMemo(
    () => ({
      eventType: d.eventType || 'event',
      showSecondPerson: d.showSecondPerson,
      showSecondEvent: d.showSecondEvent,
      coverSubtitle: d.coverSubtitle || 'SPECIAL EVENT INVITATION',
      groomShort: d.groomShort,
      brideShort: d.brideShort,
      groom: d.groom,
      bride: d.bride,
      photoCover: d.photoCover || ENVELOPE_IMAGE,
      photoGroom: d.photoGroom,
      photoBride: d.photoBride,
      gallery: d.gallery,
      akad: d.akad,
      timeLeft: d.timeLeft,
      ayatQuote: '',
    }),
    [d]
  );

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden font-public-sans bg-[#190309] text-[#FDF8F2]"
      translate="no"
    >
      <style>{`
        @keyframes bg-gold-drift {
          0% { transform: translate3d(0, 102vh, 0) scale(0.7); opacity: 0; }
          18% { opacity: 0.72; }
          75% { opacity: 0.45; }
          100% { transform: translate3d(18px, -10vh, 0) scale(1.1); opacity: 0; }
        }
        @keyframes bg-envelope-hover {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bg-content-zoom {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .bg-gold-mote {
          position: absolute;
          bottom: -8vh;
          border-radius: 9999px;
          background: radial-gradient(circle, #FFF4D2 0%, #D4AF6A 60%, transparent 100%);
          box-shadow: 0 0 8px rgba(212, 175, 106, 0.75);
          pointer-events: none;
          animation: bg-gold-drift linear infinite;
        }
        .bg-envelope-float {
          animation: bg-envelope-hover 4.2s ease-in-out infinite;
        }
        .bg-content-zoom-in {
          animation: bg-content-zoom 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* Desktop Left Showcase Panel (Tanpa Foto Slider & Countdown) */}
      {!isModalView && (
        <DesktopSidePanel
          theme="burgundy-gala"
          invitationData={sidePanelData}
          isOpened={isOverlayHidden}
          isModalView={isModalView}
          hidePhotos={true}
          hideCountdown={true}
        />
      )}

      {/* Right / Mobile Invitation Column */}
      <main
        className={`relative min-h-screen ${
          isModalView
            ? 'w-full mx-auto'
            : 'w-full lg:w-[480px] xl:w-[520px] lg:ml-auto lg:mr-0'
        } shadow-2xl overflow-hidden`}
        style={{
          background:
            'linear-gradient(170deg, #1E040B 0%, #3A0A17 38%, #4F1021 65%, #1D040B 100%)',
        }}
      >
        {/* Ambient Golden Dust Layer */}
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-y-0 ${
            isModalView
              ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
              : 'right-0 w-full lg:w-[480px] xl:w-[520px]'
          } z-30 overflow-hidden`}
        >
          {GOLD_DUST.map((p) => (
            <span
              key={p.id}
              className="bg-gold-mote"
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        {/* ============================================================ */}
        {/* OPENING COVER OVERLAY — BURGUNDY ENVELOPE + 3D OPEN -> ZOOM  */}
        {/* ============================================================ */}
        <section
          aria-label="Sampul Amplop Burgundy Gala"
          className={`fixed inset-y-0 ${
            isModalView
              ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
              : 'left-0 right-0 lg:left-auto lg:right-0 lg:w-[480px] xl:w-[520px]'
          } z-50 flex flex-col justify-between items-center text-center px-6 pt-11 pb-9 select-none overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOverlayHidden
              ? 'opacity-0 scale-110 pointer-events-none'
              : openPhase === 'zooming'
                ? 'opacity-0 scale-[1.14] pointer-events-none'
                : 'opacity-100 scale-100'
          }`}
          style={{
            background:
              'radial-gradient(circle at 50% 42%, #63162A 0%, #3F0B19 46%, #1C040A 100%)',
          }}
        >
          {/* Decorative Luxury Gold Inner Border */}
          <div className="pointer-events-none absolute inset-4 rounded-3xl border border-[#D4AF6A]/25" />
          <div className="pointer-events-none absolute inset-5 rounded-[20px] border border-[#D4AF6A]/10" />

          {/* Subtle Radial Champagne Glow Behind Envelope */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl opacity-35"
            style={{
              background:
                'radial-gradient(circle, rgba(212,175,106,0.55) 0%, rgba(114,22,46,0.15) 60%, transparent 100%)',
            }}
          />

          {/* Top Cover Header */}
          <div
            className={`relative z-20 flex flex-col items-center space-y-2 transition-all duration-500 ${
              openPhase !== 'closed' ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-[#D4AF6A]/45 bg-[#2A0610]/70 backdrop-blur-md text-[10px] uppercase tracking-[0.28em] text-[#F3DFA8]">
              <span>{d.coverSubtitle || 'SPECIAL EVENT INVITATION'}</span>
            </span>

            <h1 className="font-cinzel text-2xl sm:text-[28px] font-bold tracking-[0.06em] leading-snug text-[#FDF8F2] max-w-[320px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] pt-1">
              {eventTitleDisplay}
            </h1>

            {d.akad?.tanggal && (
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6C98B]/90">
                {d.akad.tanggal}
              </p>
            )}
          </div>

          {/* Center Interactive 3D Burgundy Envelope */}
          <div
            className="relative z-20 my-auto py-3 flex flex-col items-center justify-center w-full"
            style={{ perspective: '1200px' }}
          >
            <button
              type="button"
              onClick={triggerEnvelopeOpen}
              aria-label="Ketuk Amplop untuk Membuka Undangan"
              className={`group relative w-[285px] sm:w-[315px] aspect-[846/600] cursor-pointer focus:outline-none transition-transform duration-700 ${
                openPhase === 'closed'
                  ? 'bg-envelope-float hover:scale-[1.03] active:scale-[0.98]'
                  : openPhase === 'flap-open'
                    ? 'scale-[1.04]'
                    : 'scale-[1.22]'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Back interior of envelope visible when flap opens */}
              <div
                className="absolute inset-0 rounded-[8px] shadow-[0_28px_55px_rgba(0,0,0,0.72)] overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #4B0E1E 0%, #2D0711 100%)',
                }}
              />

              {/* Emerging Ivory-Gold Invitation Letter Card */}
              <div
                className={`absolute left-[6%] right-[6%] top-[8%] bottom-[8%] rounded-[6px] border border-[#D4AF6A] shadow-2xl flex flex-col items-center justify-center px-4 text-center transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  openPhase === 'closed'
                    ? 'translate-y-0 scale-95 opacity-0 duration-300 z-10'
                    : openPhase === 'flap-open'
                      ? '-translate-y-[44%] scale-100 opacity-100 duration-700 z-20'
                      : '-translate-y-[26%] scale-[1.85] opacity-100 duration-700 z-40'
                }`}
                style={{
                  background:
                    'linear-gradient(165deg, #FFFDF9 0%, #F8EFE0 60%, #EFE0C6 100%)',
                }}
              >
                <div className="absolute inset-2 rounded-[4px] border border-[#D4AF6A]/60 pointer-events-none" />
                <p className="text-[8px] uppercase tracking-[0.28em] text-[#8B243A] font-semibold">
                  You Are Cordially Invited
                </p>
                <p className="font-cinzel text-sm sm:text-base font-bold text-[#3B0A17] mt-1.5 line-clamp-2 leading-snug">
                  {eventTitleDisplay}
                </p>
                <div className="w-10 h-[1px] bg-[#D4AF6A] my-2" />
                <p className="text-[10px] font-medium text-[#6C1D30]">
                  {d.akad?.tanggal || 'Special Event'}
                </p>
                <p className="text-[9px] text-[#7D4A54] mt-0.5 line-clamp-1">
                  {d.akad?.lokasi}
                </p>
              </div>

              {/* Closed Envelope Photo (fades out cleanly once flap swings open) */}
              <img
                src={ENVELOPE_IMAGE}
                alt="Amplop Undangan Burgundy"
                className={`absolute inset-0 w-full h-full object-cover rounded-[8px] border border-[#D4AF6A]/25 transition-opacity duration-300 z-30 ${
                  openPhase === 'closed' ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Front Pocket Overlay visible during flap-open & zooming */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-[8px] overflow-hidden transition-opacity duration-300 z-30 ${
                  openPhase === 'closed' ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {/* Left fold */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(0 0, 52% 52%, 0 100%)',
                    background: 'linear-gradient(135deg, #68162B 0%, #4E0F1F 100%)',
                  }}
                />
                {/* Right fold */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(100% 0, 48% 52%, 100% 100%)',
                    background: 'linear-gradient(225deg, #68162B 0%, #4B0E1E 100%)',
                  }}
                />
                {/* Bottom fold */}
                <div
                  className="absolute inset-0 shadow-inner"
                  style={{
                    clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)',
                    background: 'linear-gradient(180deg, #741A31 0%, #561123 100%)',
                  }}
                />
              </div>

              {/* 3D Animated Top Flap */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-[62%] origin-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  openPhase === 'closed' ? 'z-30 opacity-0' : 'z-10 opacity-100'
                }`}
                style={{
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  background: 'linear-gradient(180deg, #7C1D35 0%, #521022 100%)',
                  transform:
                    openPhase === 'closed' ? 'rotateX(0deg)' : 'rotateX(-176deg)',
                }}
              />

              {/* Subtle Golden Glow Pulse on Wax Seal when Closed */}
              {openPhase === 'closed' && (
                <span className="pointer-events-none absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#D4AF6A]/25 blur-md animate-pulse z-30" />
              )}
            </button>

            <p
              className={`text-[10px] uppercase tracking-[0.26em] text-[#F3DFA8]/85 mt-4 transition-opacity duration-300 ${
                openPhase === 'closed' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Ketuk Amplop Untuk Membuka
            </p>
          </div>

          {/* Bottom Guest Greeting & CTA */}
          <div
            className={`relative z-20 w-full max-w-[330px] flex flex-col items-center space-y-3 transition-all duration-500 ${
              openPhase !== 'closed' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {d.guestName && (
              <div className="w-full px-5 py-3 rounded-2xl backdrop-blur-md border border-[#D4AF6A]/35 bg-[#1B0309]/65 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#E6C98B]/80">
                  Kepada Yth. Bapak/Ibu/Saudara/i
                </p>
                <p className="font-cinzel text-[17px] font-bold text-[#FDF8F2] mt-0.5">
                  {d.guestName}
                </p>
                {d.isVip && (
                  <span className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest border border-[#D4AF6A]/50 bg-[#D4AF6A]/20 text-[#F3DFA8]">
                    <Sparkles className="w-2.5 h-2.5" /> {d.guestCategory}
                  </span>
                )}
              </div>
            )}

            <p className="text-[10px] text-[#E6C98B]/65">{d.coverFootnote}</p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MAIN INVITATION CONTENT (REVEALS WITH ZOOM AFTER ENVELOPE)   */}
        {/* ============================================================ */}
        <div
          className={`relative z-10 pb-28 ${
            isOverlayHidden ? 'bg-content-zoom-in' : 'opacity-0'
          }`}
        >
          {/* SECTION 1: INFORMASI ACARA UTAMA (HERO) */}
          <section className="relative px-6 pt-14 pb-12 text-center space-y-6">
            {/* Top Subtle Gold Hairline */}
            <div className="flex items-center justify-center gap-3">
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#D4AF6A]/70" />
              <Award className="w-4 h-4 text-[#D4AF6A]" />
              <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#D4AF6A]/70" />
            </div>

            <Reveal variant="fade-up" duration={800} className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#D4AF6A]">
                {d.coverSubtitle || 'SPECIAL EVENT INVITATION'}
              </p>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide leading-tight text-[#FDF8F2]">
                {eventTitleDisplay}
              </h2>
              {d.person1Subline && (
                <p className="text-xs uppercase tracking-[0.2em] text-[#E6C98B]/90 pt-0.5">
                  {d.person1Subline}
                </p>
              )}
              {(d.groomFather || d.groomMother) && (
                <p className="text-[11px] text-[#FDF8F2]/75">
                  {[d.groomFather, d.groomMother].filter(Boolean).join(' • ')}
                </p>
              )}
            </Reveal>

            {/* Opening Greeting */}
            <Reveal
              variant="fade-up"
              duration={850}
              delay={120}
              className="max-w-xs mx-auto space-y-4 pt-2"
            >
              <p className="text-[13px] leading-[1.8] text-[#FDF8F2]/90">
                {d.openingGreeting}
              </p>
            </Reveal>
          </section>

          {/* SECTION 2: DETAIL JADWAL ACARA */}
          <section className="relative px-6 py-12 text-center space-y-7 bg-[#24050E]/75 border-y border-[#D4AF6A]/20">
            {/* Primary Event Card */}
            <Reveal
              variant="fade-up"
              duration={850}
              className="rounded-3xl p-6 border border-[#D4AF6A]/35 bg-gradient-to-b from-[#3B0A18]/90 to-[#25050E]/90 space-y-3 shadow-xl max-w-sm mx-auto"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF6A] font-semibold">
                Informasi Acara
              </p>
              <h4 className="font-cinzel text-xl font-bold text-[#FDF8F2]">
                {d.akad?.judul || 'Acara Utama'}
              </h4>
              <div className="w-12 h-[1px] bg-[#D4AF6A]/50 mx-auto" />

              <div className="space-y-2 pt-1 text-xs">
                <p className="font-semibold flex items-center justify-center gap-2 text-[#F3DFA8]">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF6A]" />
                  <span>{d.akad?.tanggal}</span>
                </p>
                <p className="flex items-center justify-center gap-2 text-[#FDF8F2]/85">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF6A]" />
                  <span>{d.akad?.waktu}</span>
                </p>
              </div>

              <div className="pt-2 space-y-1">
                <p className="font-cinzel text-sm font-bold text-[#FDF8F2]">
                  {d.akad?.lokasi}
                </p>
                {d.akad?.alamat && (
                  <p className="text-xs leading-relaxed text-[#FDF8F2]/75">
                    {d.akad.alamat}
                  </p>
                )}
              </div>

              <div className="pt-3 flex flex-wrap justify-center gap-2">
                {d.akad?.mapUrl && (
                  <a
                    href={d.akad.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sheen inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold shadow-md bg-gradient-to-r from-[#C89B4B] via-[#E8C984] to-[#C89B4B] text-[#2B0610]"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                )}
                {d.googleCalUrl && (
                  <a
                    href={d.googleCalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border border-[#D4AF6A]/55 text-[#F3DFA8] hover:bg-[#D4AF6A]/15 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Simpan Tanggal</span>
                  </a>
                )}
              </div>
            </Reveal>

            {/* Optional Second Session Card */}
            {d.showSecondEvent && (
              <Reveal
                variant="fade-up"
                duration={850}
                className="rounded-3xl p-6 border border-[#D4AF6A]/35 bg-gradient-to-b from-[#3B0A18]/90 to-[#25050E]/90 space-y-3 shadow-xl max-w-sm mx-auto"
              >
                <h4 className="font-cinzel text-xl font-bold text-[#FDF8F2]">
                  {d.resepsi?.judul || 'Sesi Kedua'}
                </h4>
                <p className="text-xs font-semibold flex items-center justify-center gap-2 text-[#F3DFA8]">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF6A]" />
                  <span>{d.resepsi?.tanggal}</span>
                </p>
                <p className="text-xs flex items-center justify-center gap-2 text-[#FDF8F2]/85">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF6A]" />
                  <span>{d.resepsi?.waktu}</span>
                </p>
                <p className="font-cinzel text-sm font-bold text-[#FDF8F2] pt-1">
                  {d.resepsi?.lokasi}
                </p>
                {d.resepsi?.alamat && (
                  <p className="text-xs leading-relaxed text-[#FDF8F2]/75">
                    {d.resepsi.alamat}
                  </p>
                )}
              </Reveal>
            )}
          </section>

          {/* ============================================================ */}
          {/* SECTION 3: SEAT PLAN / DENAH TEMPAT DUDUK (SLIDE BAWAH)      */}
          {/* ============================================================ */}
          <section
            aria-label="Seat Plan & Denah Tempat Duduk"
            className="relative px-6 py-14 text-center space-y-6"
          >
            <Reveal variant="fade-up" duration={800} className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#D4AF6A]/40 bg-[#3B0A18]/70 text-[10px] uppercase tracking-[0.3em] text-[#F3DFA8]">
                <LayoutGrid className="w-3 h-3 text-[#D4AF6A]" />
                <span>Seating Arrangement</span>
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-[#FDF8F2]">
                {seatPlanTitle}
              </h3>
              <p className="text-xs leading-relaxed text-[#FDF8F2]/75 max-w-xs mx-auto">
                {seatPlanCaption}
              </p>
            </Reveal>

            <Reveal variant="zoom-in" duration={850}>
              <div className="max-w-sm mx-auto rounded-3xl p-3 border border-[#D4AF6A]/45 bg-[#2A0610]/85 shadow-[0_24px_55px_rgba(0,0,0,0.6)]">
                {seatPlanImage ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSeatPlanZoom(1);
                        setSeatPlanLightboxOpen(true);
                      }}
                      className="group relative block w-full rounded-2xl overflow-hidden border border-[#D4AF6A]/30 bg-[#140207] cursor-pointer focus:outline-none"
                    >
                      <img
                        src={seatPlanImage}
                        alt={seatPlanTitle}
                        className="w-full h-auto max-h-[420px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C040A]/85 border border-[#D4AF6A]/55 text-[11px] font-semibold text-[#F3DFA8] shadow-lg">
                          <ZoomIn className="w-3.5 h-3.5 text-[#D4AF6A]" />
                          <span>Ketuk untuk Perbesar Denah</span>
                        </span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="py-12 px-5 rounded-2xl border border-dashed border-[#D4AF6A]/35 bg-[#1B040A]/70 space-y-2">
                    <LayoutGrid className="w-8 h-8 mx-auto text-[#D4AF6A]/70" />
                    <p className="font-cinzel text-sm font-semibold text-[#F3DFA8]">
                      Gambar Seat Plan Belum Diupload
                    </p>
                    <p className="text-[11px] leading-relaxed text-[#FDF8F2]/65">
                      Upload gambar denah meja / kursi (PNG/JPG) melalui halaman{' '}
                      <strong>Detail Undangan → Media &amp; Foto</strong> agar tampil otomatis di slide ini.
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </section>
        </div>

        {/* Seat Plan Full-Screen Zoom Lightbox */}
        {seatPlanLightboxOpen && seatPlanImage && (
          <div className="fixed inset-0 z-[70] bg-black/92 backdrop-blur-md flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-white shrink-0">
              <span className="font-cinzel text-xs font-bold tracking-wider text-[#F3DFA8] truncate">
                {seatPlanTitle}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSeatPlanZoom((z) => Math.max(1, Number((z - 0.5).toFixed(1))))}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  aria-label="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-1.5 text-[#F3DFA8]">
                  {Math.round(seatPlanZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setSeatPlanZoom((z) => Math.min(2.5, Number((z + 0.5).toFixed(1))))}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  aria-label="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSeatPlanLightboxOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/80 text-white cursor-pointer ml-1"
                  aria-label="Tutup Denah"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <img
                src={seatPlanImage}
                alt={seatPlanTitle}
                className="transition-transform duration-200 origin-center rounded-xl shadow-2xl"
                style={{
                  transform: `scale(${seatPlanZoom})`,
                  maxWidth: seatPlanZoom === 1 ? '100%' : 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Audio Player */}
        <audio ref={d.audioRef} src={d.musicUrl} loop preload="auto" />

        {isOverlayHidden && (
          <MusicVinylPlayer
            musicUrl={d.musicUrl}
            musicTitle={d.musicTitle}
            isPlaying={d.isPlayingMusic}
            onToggle={d.toggleMusic}
            position="bottom-right"
            theme="gold"
            accentColor="#D4AF6A"
          />
        )}
      </main>
    </div>
  );
};
