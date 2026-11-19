import React, { useMemo, useState } from 'react';
import {
  Calendar,
  MapPin,
  Copy,
  Check,
  Heart,
  Disc,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  QrCode,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GalleryLightbox } from '../GalleryLightbox';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { DesktopSidePanel } from '../DesktopSidePanel';
import { Reveal } from '../Reveal';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';

const FLOATING_PETALS = [
  { left: '8%', size: 11, duration: '11s', delay: '0s' },
  { left: '22%', size: 9, duration: '14s', delay: '2.2s' },
  { left: '38%', size: 13, duration: '12.5s', delay: '4.1s' },
  { left: '56%', size: 10, duration: '15s', delay: '1.3s' },
  { left: '74%', size: 12, duration: '13s', delay: '3.5s' },
  { left: '89%', size: 9, duration: '11.8s', delay: '5.2s' },
];

const ASSETS = {
  bgDrapery: '/images/drapery-pink/bg-drapery-main.png',
  bgPaperCream: '/images/drapery-pink/bg-paper-cream.jpg',
  bgPaperLong: '/images/drapery-pink/bg-paper-long.jpg',
  draperyVignette: '/images/drapery-pink/drapery-curtain.png',
  envelopeClosed: '/images/drapery-pink/envelope-body.png',
  envelopeOpenBack: '/images/drapery-pink/arch-gold-frame.png',
  envelopeOpenPocket: '/images/drapery-pink/floral-bouquet-overlay.png',
  waxSeal: '/images/drapery-pink/wax-seal.png',
  orchidCascade: '/images/drapery-pink/floral-swirl.png',
  laceCard: '/images/drapery-pink/arch-card-bg.png',
  tasselRed: '/images/drapery-pink/ribbon-accent-1.png',
  tasselDark: '/images/drapery-pink/ribbon-accent-2.png',
  bismillah: '/images/drapery-pink/bismillah.svg',
  cameoOvalFrame: '/images/drapery-pink/oval-frame-border.png',
  floralPillar: '/images/drapery-pink/corner-roses.png',
  venueSketch: '/images/drapery-pink/date-strip-1.png',
  callaLilyGreen: '/images/drapery-pink/divider-ornament.png',
  callaLilyBurgundy: '/images/drapery-pink/divider-flower.png',
  giftIcon: '/images/drapery-pink/gift-icon.svg',
  laceBankCard: '/images/drapery-pink/bank-card-bg.png',
  waCardFrame: '/images/drapery-pink/wa-card-frame.svg',
  polaroidCard: '/images/drapery-pink/polaroid-tape-1.png',
  storyBullet: '/images/drapery-pink/story-bullet.svg',
  butterfly: '/images/drapery-pink/butterfly.gif',
  demoCouple1: '/images/drapery-pink/demo-couple-1.jpg',
  demoBride: '/images/drapery-pink/demo-bride.jpg',
  demoGroom: '/images/drapery-pink/demo-groom.jpg',
  demoClosing: '/images/drapery-pink/demo-closing.jpg',
};

const DEFAULT_AR_RUM =
  '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."';

const DEFAULT_DRAPERY_STORIES = [
  {
    tahun: '',
    judul: 'Awal Pertemuan',
    cerita:
      'Tidak ada yang benar-benar kebetulan di dunia ini. Setiap pertemuan telah diatur dengan indah, hanya menunggu waktu yang tepat untuk terjadi. Berawal dari sebuah perkenalan sederhana, tanpa banyak rencana atau harapan berlebihan, kami dipertemukan dalam cara yang tidak pernah kami duga sebelumnya.',
  },
  {
    tahun: '',
    judul: 'Perjalanan Bersama',
    cerita:
      'Seiring berjalannya waktu, kebersamaan kecil yang kami lalui perlahan tumbuh menjadi sesuatu yang lebih berarti. Dalam setiap cerita, tentu ada tawa, ada juga tantangan. Namun dari situlah kami belajar untuk saling memahami, menerima, dan melengkapi satu sama lain.',
  },
  {
    tahun: '',
    judul: 'Komitmen',
    cerita:
      'Hingga akhirnya kami menyadari bahwa perjalanan ini bukan lagi tentang dua orang yang berjalan sendiri, melainkan tentang dua hati yang memilih untuk melangkah bersama. Dengan penuh rasa syukur dan keyakinan, kami memutuskan untuk mengikat janji suci dan memulai babak baru dalam kehidupan kami.',
  },
];

/**
 * Helper: mengekstrak tanggal, bulan, dan tahun dari string seperti "Sabtu, 8 Agustus 2026"
 */
const parseDateBadge = (raw = '') => {
  const cleaned = String(raw).replace(/^[^,]+,\s*/, '').trim();
  const tokens = cleaned.split(/\s+/);
  if (tokens.length >= 3) {
    return {
      dayNum: tokens[0].padStart(2, '0'),
      month: tokens[1].toUpperCase(),
      year: tokens[2],
    };
  }
  return {
    dayNum: '08',
    month: 'AGUSTUS',
    year: '2026',
  };
};

const formatWaLink = (phone = '', name = '') => {
  const digits = String(phone).replace(/[^0-9]/g, '');
  if (!digits) return '#';
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  const text = encodeURIComponent(
    `Halo ${name || ''}, saya ingin konfirmasi pengiriman hadiah pernikahan.`
  );
  return `https://wa.me/${normalized}?text=${text}`;
};

/**
 * TEMA DRAPERY PINK & VINTAGE LACE — "Romantic Satin Drapery, Cameo & Lace Envelope"
 * Remake presisi dari referensi Canva:
 * https://bison-wv5m5r.my.canva.site/salinan-dari-salinan-lynk-drapery-pink/details
 * Kode template di database: `drapery-pink`
 */
export const DraperyPinkTheme = ({
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

  const [rsvpPage, setRsvpPage] = useState(1);

  const dateBadge = useMemo(() => parseDateBadge(d.akad?.tanggal), [d.akad?.tanggal]);

  const coverCouplePhoto =
    d.photoCover && !d.photoCover.includes('photo-1519741497674-611481863552')
      ? d.photoCover
      : ASSETS.demoCouple1;

  const bridePhoto =
    d.photoBride && !d.photoBride.includes('photo-1534528741775-53994a69daeb')
      ? d.photoBride
      : ASSETS.demoBride;

  const groomPhoto =
    d.photoGroom && !d.photoGroom.includes('photo-1507003211169-0a1dd7228f2d')
      ? d.photoGroom
      : ASSETS.demoGroom;

  const closingPhoto = d.photoClosing || d.gallery?.[2] || ASSETS.demoClosing;

  const quoteBody = d.kutipanPembuka?.trim() ? d.kutipanPembuka : DEFAULT_AR_RUM;
  const quoteSource = d.ayatQuote || 'QS Ar-Rum 21';

  const storiesToRender = useMemo(() => {
    const rawStories = invitation?.content_json?.kisah;
    if (Array.isArray(rawStories) && rawStories.length > 0) return rawStories;
    return DEFAULT_DRAPERY_STORIES;
  }, [invitation?.content_json?.kisah]);

  const rsvpsPerPage = 5;
  const totalRsvpPages = Math.max(1, Math.ceil((d.rsvp.list?.length || 0) / rsvpsPerPage));
  const paginatedRsvps = (d.rsvp.list || []).slice(
    (rsvpPage - 1) * rsvpsPerPage,
    rsvpPage * rsvpsPerPage
  );

  return (
    <div
      className="relative min-h-screen w-full bg-[#3b181f] text-[#68333e] font-quattrocento selection:bg-[#a96d79]/30 selection:text-[#3b181f] overflow-x-hidden"
      translate="no"
    >
      {/* Desktop Left Showcase Panel */}
      <DesktopSidePanel
        theme="drapery-pink"
        invitationData={{
          ...d,
          photoCover: coverCouplePhoto,
          photoGroom: groomPhoto,
          photoBride: bridePhoto,
        }}
        isOpened={d.isOpened}
        isModalView={isModalView}
        alwaysVisible={true}
      />

      {/* Right / Mobile Main Column */}
      <main
        className={`relative w-full ${
          isModalView ? 'max-w-[430px] mx-auto' : 'lg:ml-auto lg:w-[480px] xl:w-[520px]'
        } min-h-screen bg-[#faf3ed] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.65)]`}
      >
        {/* Ambient Falling Rose Petals Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 right-0 w-full lg:w-[480px] xl:w-[520px] z-30 overflow-hidden"
        >
          {FLOATING_PETALS.map((p, idx) => (
            <span
              key={idx}
              className="dp-petal"
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${Math.round(p.size * 1.35)}px`,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        {/* ===================================================================
            OPENING COVER OVERLAY (TopPage[0]: Pink Satin Drapery + Lace Envelope)
           =================================================================== */}
        <section
          aria-label="Sampul Undangan Drapery Pink"
          className={`fixed inset-y-0 ${
            isModalView
              ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
              : 'left-0 right-0 lg:left-auto lg:right-0 lg:w-[480px] xl:w-[520px]'
          } z-50 flex flex-col justify-between items-center text-center px-6 pt-12 pb-10 transition-all duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] select-none overflow-hidden ${
            d.isOpened
              ? '-translate-y-full opacity-0 pointer-events-none'
              : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Pink Satin Drapery Curtain Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={ASSETS.bgDrapery}
              alt="Pink Drapery Background"
              className="w-full h-full object-cover object-center dp-drapery-motion"
            />
            <img
              src={ASSETS.draperyVignette}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none"
            />
          </div>

          {/* Top Header: We're GETTING MARRIED & Couple Names */}
          <div className="relative z-20 flex flex-col items-center mt-2 cover-stagger">
            <p className="font-slight text-[44px] sm:text-[50px] text-[#fdf9f6] leading-none drop-shadow-[0_2px_10px_rgba(59,24,31,0.45)]">
              We’re
            </p>
            <p
              className="text-[14px] sm:text-[16px] uppercase tracking-[0.18em] text-[#fdf9f6] -mt-1 font-medium drop-shadow-[0_2px_8px_rgba(59,24,31,0.4)]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              GETTING MARRIED
            </p>

            <h1 className="font-sloop text-[50px] sm:text-[58px] text-[#fdf9f6] leading-[1.1] mt-3 drop-shadow-[0_4px_14px_rgba(59,24,31,0.5)]">
              {d.brideShort} &amp; {d.groomShort}
            </h1>
          </div>

          {/* Center Interactive Closed Lace Envelope with Orchids & Wax Seal */}
          <div className="relative z-20 w-full max-w-[330px] my-auto py-4 flex flex-col items-center cover-stagger">
            {/* Guest Name Tag */}
            {d.guestName && (
              <div className="mb-4 px-5 py-2 rounded-full bg-[#3b181f]/55 backdrop-blur-md border border-[#fdf9f6]/30 text-[#fdf9f6] shadow-lg">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#e6ddcb]">
                  Kepada Yth.
                </p>
                <p className="font-cardo text-[16px] font-semibold tracking-wide">
                  {d.guestName}
                </p>
                {d.isVip && (
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#fdf9f6]/90">
                    <Sparkles className="w-2.5 h-2.5" /> {d.guestCategory}
                  </span>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={d.openInvitation}
              aria-label="Klik Amplop untuk Membuka Undangan"
              className="group relative w-[280px] sm:w-[305px] cursor-pointer transition-transform duration-500 hover:scale-[1.03] active:scale-95 focus:outline-none dp-envelope-float"
            >
              {/* Top-left Hanging Orchid Cascade */}
              <img
                src={ASSETS.orchidCascade}
                alt=""
                className="pointer-events-none absolute -top-10 -left-10 w-28 sm:w-32 z-10 drop-shadow-md dp-orchid-sway-l"
              />
              {/* Bottom-right Hanging Orchid Cascade */}
              <img
                src={ASSETS.orchidCascade}
                alt=""
                className="pointer-events-none absolute -bottom-10 -right-8 w-24 sm:w-28 z-30 drop-shadow-md dp-orchid-sway-r"
              />

              {/* Cream Lace Envelope Body */}
              <img
                src={ASSETS.envelopeClosed}
                alt="Envelope"
                className="relative z-20 w-full h-auto drop-shadow-[0_18px_35px_rgba(59,24,31,0.55)]"
              />

              {/* 3D Dusty Rose Wax Seal at Envelope Flap Center */}
              <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 z-30 w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-500 group-hover:scale-110">
                <img
                  src={ASSETS.waxSeal}
                  alt="Wax Seal"
                  className="w-full h-full object-contain dp-wax-pulse"
                />
              </div>
            </button>

            {/* CLICK ENVELOPE TO OPEN */}
            <button
              type="button"
              onClick={d.openInvitation}
              className="mt-7 font-cardo text-[12px] sm:text-[13px] uppercase tracking-[0.18em] text-[#fdf9f6] hover:text-white animate-pulse cursor-pointer drop-shadow-[0_2px_8px_rgba(59,24,31,0.7)]"
            >
              CLICK ENVELOPE TO OPEN
            </button>
          </div>
        </section>

        {/* ===================================================================
            MAIN SCROLLABLE CONTENT (Slides t[0] .. t[7])
           =================================================================== */}
        <div className="relative z-10 w-full">
          {/* -----------------------------------------------------------------
              SLIDE 1 (t[0]): SURAH AR-RUM 21 LACE LETTER TUCKED INSIDE OPEN ENVELOPE
             ----------------------------------------------------------------- */}
          <section className="relative min-h-screen flex flex-col items-center px-5 pt-10 pb-14 overflow-hidden">
            {/* Pink Drapery Satin Background */}
            <img
              src={ASSETS.bgDrapery}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 dp-drapery-motion"
            />

            {/* Bottom-Left & Bottom-Right Floral Pillar Borders */}
            <img
              src={ASSETS.floralPillar}
              alt=""
              className="pointer-events-none absolute -bottom-6 -left-14 w-40 sm:w-44 z-10 opacity-95 dp-orchid-sway-l"
            />
            <img
              src={ASSETS.floralPillar}
              alt=""
              className="pointer-events-none absolute -bottom-6 -right-14 w-40 sm:w-44 z-10 opacity-95 scale-x-[-1] dp-orchid-sway-r"
            />

            {/* Composite Envelope & Lace Letter Stack */}
            <Reveal
              variant="fade-up"
              duration={1150}
              className="relative z-20 w-full max-w-[340px] mx-auto mt-2"
            >
              <div className="relative w-full pt-2 pb-[155px]">
                {/* 1. Back of Open Envelope (behind the letter) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[330px] z-10">
                  <img
                    src={ASSETS.envelopeOpenBack}
                    alt=""
                    className="w-full h-full object-contain object-bottom drop-shadow-[0_18px_36px_rgba(59,24,31,0.5)]"
                  />
                  {/* Mauve Velvet Interior Liner of the Envelope */}
                  <div className="absolute left-[10.5%] right-[10.5%] top-[28%] bottom-[8%] overflow-hidden rounded-xs">
                    <img
                      src={ASSETS.demoCouple1}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 2. Embossed Vintage Lace Letter Card (Emerging from inside the envelope) */}
                <div className="relative z-20 w-[86%] mx-auto dp-photo-emerge">
                  {/* Top-left Hanging Orchids */}
                  <img
                    src={ASSETS.orchidCascade}
                    alt=""
                    className="pointer-events-none absolute -top-6 -left-9 w-32 sm:w-36 z-30 drop-shadow-lg dp-orchid-sway-l"
                  />
                  {/* Animated Butterfly */}
                  <img
                    src={ASSETS.butterfly}
                    alt=""
                    className="pointer-events-none absolute top-7 -right-3 w-13 h-13 object-contain z-30 dp-butterfly-drift"
                  />

                  <div className="relative w-full aspect-[3/4.15] flex flex-col items-center justify-center px-9 pt-12 pb-20 text-center">
                    <img
                      src={ASSETS.laceCard}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_12px_25px_rgba(59,24,31,0.3)]"
                    />
                    <div className="relative z-10 space-y-3 px-1">
                      <p className="text-[12px] sm:text-[13px] leading-[1.62] text-[#68333e] font-normal">
                        {quoteBody}
                      </p>
                      <p className="text-[12.5px] font-bold tracking-wide text-[#68333e] pt-1">
                        {quoteSource}
                      </p>
                    </div>

                    {/* Grommet Eyelet & Hanging Burgundy Silk Tassel attached to bottom of Lace Letter */}
                    <div className="pointer-events-none absolute left-1/2 bottom-[3%] -translate-x-1/2 translate-y-[42%] z-30 flex flex-col items-center">
                      {/* Eyelet Ring on the Letter */}
                      <div className="w-5 h-5 rounded-full bg-[#3b181f] border-[2.5px] border-[#a96d79] shadow-inner" />
                      {/* Hanging Burgundy Silk Tassel */}
                      <img
                        src={ASSETS.tasselDark}
                        alt=""
                        className="-mt-3.5 w-14 sm:w-16 h-28 sm:h-32 object-contain drop-shadow-[0_10px_16px_rgba(32,10,15,0.5)] dp-tassel-l"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Open Envelope Front Pocket Flaps (In front of the letter bottom, creating the V-pocket) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[330px] z-30">
                  <img
                    src={ASSETS.envelopeOpenPocket}
                    alt=""
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>
              </div>
            </Reveal>

            {/* Interactive Minimalist Music Transport Bar (Matches Canva Reference) */}
            <Reveal
              variant="fade-up"
              delay={250}
              className="relative z-30 w-full max-w-[260px] mx-auto mt-3 text-center space-y-2.5"
            >
              <div className="px-2 pt-2 pb-1">
                {/* Progress Bar */}
                <div className="relative h-[2px] w-full bg-[#fdf9f6]/45 rounded-full mb-3.5">
                  <div
                    className={`h-full bg-[#fdf9f6] rounded-full transition-all duration-700 ${
                      d.isPlayingMusic ? 'w-2/3' : 'w-1/4'
                    }`}
                  />
                  <span
                    className={`absolute -top-[4px] w-2.5 h-2.5 rounded-full bg-[#e6ddcb] shadow transition-all duration-700 ${
                      d.isPlayingMusic ? 'left-2/3' : 'left-1/4'
                    }`}
                  />
                </div>
                {/* Controls */}
                <div className="flex items-center justify-between text-[#e6ddcb] px-3">
                  <Shuffle className="w-4 h-4 opacity-90" />
                  <SkipBack className="w-4 h-4 opacity-95 fill-current" />
                  <button
                    type="button"
                    onClick={d.toggleMusic}
                    className="w-10 h-10 rounded-full bg-[#e6ddcb] text-[#68333e] flex items-center justify-center shadow-lg hover:scale-105 transition cursor-pointer"
                    aria-label={d.isPlayingMusic ? 'Jeda Musik' : 'Putar Musik'}
                  >
                    {d.isPlayingMusic ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                  <SkipForward className="w-4 h-4 opacity-95 fill-current" />
                  <Repeat className="w-4 h-4 opacity-90" />
                </div>
              </div>
              <p
                className="text-[11.5px] italic text-[#faf3ed] tracking-wide drop-shadow"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Klik tombol “mulai” untuk mendengarkan musik..
              </p>
            </Reveal>
          </section>

          {/* -----------------------------------------------------------------
              SLIDE 2 (t[1]): BISMILLAH & BRIDE / GROOM BAROQUE CAMEO FRAMES
             ----------------------------------------------------------------- */}
          <section
            className="relative px-5 py-16 overflow-hidden"
            style={{
              backgroundImage: `url(${ASSETS.bgPaperCream})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Top Left & Top Right Hanging Orchids */}
            <img
              src={ASSETS.orchidCascade}
              alt=""
              className="pointer-events-none absolute -top-10 -left-10 w-32 opacity-95 dp-orchid-sway-l"
            />
            <img
              src={ASSETS.orchidCascade}
              alt=""
              className="pointer-events-none absolute -top-6 -right-10 w-32 opacity-95 dp-orchid-sway-r"
            />

            {/* Bismillah & Opening Greeting */}
            <Reveal
              variant="fade-up"
              className="relative z-10 flex flex-col items-center text-center max-w-[330px] mx-auto pt-4 space-y-4"
            >
              <img
                src={ASSETS.bismillah}
                alt="Bismillahirrahmanirrahim"
                className="h-9 w-auto object-contain"
              />
              <p className="text-[12.5px] leading-[1.65] text-[#3b181f]">
                {d.openingGreeting &&
                !d.openingGreeting.includes('Dengan penuh rasa syukur dan bahagia')
                  ? d.openingGreeting
                  : 'Dengan memohon rahmat & ridho Allah SWT, kami mengundang bapak/ibu/saudara/i untuk hadir pada pernikahan:'}
              </p>
            </Reveal>

            {/* Bride Cameo Row */}
            <div className="relative z-10 mt-10 grid grid-cols-12 items-center gap-2">
              <Reveal variant="fade-right" delay={100} className="col-span-6 relative flex justify-center">
                <div className="relative w-[175px] sm:w-[190px] aspect-[3/4] dp-envelope-float">
                  {/* 3D Baroque Dusty Rose Cameo Frame (Base Layer) */}
                  <img
                    src={ASSETS.cameoOvalFrame}
                    alt=""
                    className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_20px_rgba(104,51,62,0.28)]"
                  />
                  {/* Photo Masked Inside the Inner Cameo Oval */}
                  <div className="absolute left-[22.5%] right-[22.5%] top-[19.5%] bottom-[19.5%] rounded-[50%] overflow-hidden z-20 shadow-[inset_0_3px_10px_rgba(59,24,31,0.45)] border border-[#e6ddcb]/40">
                    <img
                      src={bridePhoto}
                      alt={d.bride}
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <img
                    src={ASSETS.butterfly}
                    alt=""
                    className="pointer-events-none absolute -bottom-3 right-2 w-11 h-11 object-contain z-30 dp-butterfly-drift"
                  />
                </div>
              </Reveal>

              <Reveal variant="fade-left" delay={220} className="col-span-6 text-center px-1 space-y-1">
                <h2 className="font-sloop text-[50px] sm:text-[56px] text-[#68333e] leading-none">
                  {d.brideShort}
                </h2>
                <p className="text-[12px] font-bold text-[#3b181f] leading-snug">
                  {d.bride}
                </p>
                <p className="text-[12px] leading-[1.55] text-[#68333e] pt-1">
                  {d.brideChildOrder || 'Putri Pertama'} dari
                  <br />
                  {d.brideFather}
                  <br />
                  &amp; {d.brideMother}
                </p>
                {d.brideInstagram && (
                  <a
                    href={`https://instagram.com/${d.brideInstagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1.5 text-[11px] text-[#a96d79] hover:text-[#68333e] underline"
                  >
                    @{d.brideInstagram.replace(/^@/, '')}
                  </a>
                )}
              </Reveal>
            </div>

            {/* Center Ampersand */}
            <Reveal variant="zoom-in" delay={150} className="relative z-10 my-3 text-center">
              <span className="font-amoresa text-[24px] text-[#68333e] inline-block animate-breathe">&amp;</span>
            </Reveal>

            {/* Groom Cameo Row */}
            <div className="relative z-10 grid grid-cols-12 items-center gap-2 pb-10">
              <Reveal variant="fade-right" delay={120} className="col-span-6 text-center px-1 space-y-1">
                <h2 className="font-sloop text-[50px] sm:text-[56px] text-[#68333e] leading-none">
                  {d.groomShort}
                </h2>
                <p className="text-[12px] font-bold text-[#3b181f] leading-snug">
                  {d.groom}
                </p>
                <p className="text-[12px] leading-[1.55] text-[#68333e] pt-1">
                  {d.groomChildOrder || 'Putra Pertama'} dari
                  <br />
                  {d.groomFather}
                  <br />
                  &amp; {d.groomMother}
                </p>
                {d.groomInstagram && (
                  <a
                    href={`https://instagram.com/${d.groomInstagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1.5 text-[11px] text-[#a96d79] hover:text-[#68333e] underline"
                  >
                    @{d.groomInstagram.replace(/^@/, '')}
                  </a>
                )}
              </Reveal>

              <Reveal variant="fade-left" delay={240} className="col-span-6 relative flex justify-center">
                <div className="relative w-[175px] sm:w-[190px] aspect-[3/4] dp-envelope-float">
                  {/* 3D Baroque Dusty Rose Cameo Frame (Base Layer) */}
                  <img
                    src={ASSETS.cameoOvalFrame}
                    alt=""
                    className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_20px_rgba(104,51,62,0.28)]"
                  />
                  {/* Photo Masked Inside the Inner Cameo Oval */}
                  <div className="absolute left-[22.5%] right-[22.5%] top-[19.5%] bottom-[19.5%] rounded-[50%] overflow-hidden z-20 shadow-[inset_0_3px_10px_rgba(59,24,31,0.45)] border border-[#e6ddcb]/40">
                    <img
                      src={groomPhoto}
                      alt={d.groom}
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <img
                    src={ASSETS.butterfly}
                    alt=""
                    className="pointer-events-none absolute -bottom-3 right-2 w-11 h-11 object-contain z-30 dp-butterfly-drift"
                  />
                </div>
              </Reveal>
            </div>

            {/* Bottom Corner Floral Pillars */}
            <img
              src={ASSETS.floralPillar}
              alt=""
              className="pointer-events-none absolute -bottom-6 -left-8 w-28 opacity-90 dp-orchid-sway-l"
            />
            <img
              src={ASSETS.floralPillar}
              alt=""
              className="pointer-events-none absolute -bottom-8 -right-8 w-24 opacity-90 dp-orchid-sway-r"
            />
          </section>

          {/* -----------------------------------------------------------------
              SLIDE 3 (t[2]): SAVE THE DATE + AKAD + RESEPSI + DRESS CODE
             ----------------------------------------------------------------- */}
          <section
            className="relative px-6 py-16 overflow-hidden text-center"
            style={{
              backgroundImage: `url(${ASSETS.bgPaperLong})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <img
              src={ASSETS.orchidCascade}
              alt=""
              className="pointer-events-none absolute -top-8 -right-10 w-32 opacity-90 dp-orchid-sway-r"
            />

            {/* Save the Date Staggered Script Heading */}
            <Reveal variant="zoom-in" className="relative z-10 flex flex-col items-center">
              <h2 className="font-slight text-[48px] sm:text-[54px] text-[#68333e] leading-[0.85]">
                Save
              </h2>
              <span className="font-slight text-[34px] text-[#68333e] leading-none my-0.5">
                the
              </span>
              <h2 className="font-slight text-[48px] sm:text-[54px] text-[#68333e] leading-[0.85]">
                Date
              </h2>
            </Reveal>

            {/* 3-Column Date Table (Akad | AGUSTUS 08 2026 | Resepsi) */}
            <Reveal
              variant="fade-up"
              delay={120}
              className="relative z-10 mt-8 grid grid-cols-3 items-center max-w-[360px] mx-auto"
            >
              {/* Left: Akad */}
              <div className="border-l-2 border-[#68333e] py-3 px-2 flex flex-col items-center justify-center space-y-1">
                <span className="font-sloop text-[28px] text-[#68333e] leading-none">
                  {d.akad?.judul || 'Akad'}
                </span>
                <span className="text-[11px] font-bold text-[#68333e]">
                  {d.akad?.waktu}
                </span>
              </div>

              {/* Center: Month / Giant Day / Year */}
              <div className="border-x-2 border-[#68333e] py-2 px-2 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#68333e]">
                  {dateBadge.month}
                </span>
                <span className="text-[48px] sm:text-[54px] font-normal leading-none text-[#68333e] my-1">
                  {dateBadge.dayNum}
                </span>
                <span className="text-[14px] font-normal tracking-[0.15em] text-[#68333e]">
                  {dateBadge.year}
                </span>
              </div>

              {/* Right: Resepsi */}
              <div className="border-r-2 border-[#68333e] py-3 px-2 flex flex-col items-center justify-center space-y-1">
                <span className="font-sloop text-[28px] text-[#68333e] leading-none">
                  {d.resepsi?.judul || 'Resepsi'}
                </span>
                <span className="text-[11px] font-bold text-[#68333e]">
                  {d.resepsi?.waktu}
                </span>
              </div>
            </Reveal>

            {/* Live Countdown Pills */}
            <Reveal
              variant="fade-up"
              delay={200}
              className="relative z-10 mt-6 grid grid-cols-4 gap-2 max-w-[310px] mx-auto"
            >
              {[
                { label: 'Hari', val: d.timeLeft.days },
                { label: 'Jam', val: d.timeLeft.hours },
                { label: 'Menit', val: d.timeLeft.minutes },
                { label: 'Detik', val: d.timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-[#fdf9f6]/90 border border-[#68333e]/25 py-2 px-1 shadow-xs"
                >
                  <div className="text-[18px] font-bold text-[#68333e] leading-none">
                    {String(item.val ?? 0).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-[#a96d79] mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </Reveal>

            {/* Architectural Venue Sketch */}
            <Reveal variant="zoom-in" delay={250} className="relative z-10 my-8 flex justify-center">
              <img
                src={ASSETS.venueSketch}
                alt="Venue Illustration"
                className="w-56 sm:w-64 h-auto object-contain opacity-90 animate-float"
              />
            </Reveal>

            {/* Akad Details */}
            <Reveal variant="fade-up" delay={120} className="relative z-10 space-y-2 max-w-[330px] mx-auto">
              <h3 className="font-sloop text-[62px] sm:text-[70px] text-[#68333e] leading-none">
                {d.akad?.judul || 'Akad'}
              </h3>
              <p className="text-[14px] font-bold text-[#68333e]">
                {d.akad?.tanggal}
                <br />
                {d.akad?.waktu}
              </p>
              <p className="text-[14px] font-bold uppercase tracking-wide text-[#68333e] pt-2">
                {d.akad?.lokasi}
              </p>
              {d.akad?.alamat && (
                <p className="text-[12.5px] leading-relaxed text-[#68333e]/90">
                  {d.akad.alamat}
                </p>
              )}
              {d.akad?.mapUrl && d.akad.mapUrl !== d.resepsi?.mapUrl && (
                <div className="pt-2">
                  <a
                    href={d.akad.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sheen inline-flex items-center gap-2 rounded-full bg-[#68333e] hover:bg-[#3b181f] text-[#fdf9f6] text-[12px] font-bold px-7 py-2.5 shadow-md transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                </div>
              )}
            </Reveal>

            {/* Calla Lily Divider */}
            <Reveal variant="zoom-in" className="relative z-10 my-7 flex justify-center items-center gap-2">
              <img
                src={ASSETS.callaLilyGreen}
                alt=""
                className="w-10 h-16 object-contain dp-tassel-l"
              />
              <img
                src={ASSETS.callaLilyBurgundy}
                alt=""
                className="w-10 h-16 object-contain dp-tassel-r"
              />
            </Reveal>

            {/* Resepsi Details */}
            <Reveal variant="fade-up" delay={120} className="relative z-10 space-y-2 max-w-[330px] mx-auto">
              <h3 className="font-sloop text-[62px] sm:text-[70px] text-[#68333e] leading-none">
                {d.resepsi?.judul || 'Resepsi'}
              </h3>
              <p className="text-[14px] font-bold text-[#68333e]">
                {d.resepsi?.tanggal}
                <br />
                {d.resepsi?.waktu}
              </p>
              <p className="text-[14px] font-bold uppercase tracking-wide text-[#68333e] pt-2">
                {d.resepsi?.lokasi}
              </p>
              {d.resepsi?.alamat && (
                <p className="text-[12.5px] leading-relaxed text-[#68333e]/90">
                  {d.resepsi.alamat}
                </p>
              )}
              {(d.resepsi?.mapUrl || d.akad?.mapUrl) && (
                <div className="pt-3">
                  <a
                    href={d.resepsi?.mapUrl || d.akad?.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sheen inline-flex items-center gap-2 rounded-full bg-[#68333e] hover:bg-[#3b181f] text-[#fdf9f6] text-[13px] font-bold px-8 py-2.5 shadow-md transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                </div>
              )}
            </Reveal>

            {/* Dress Code Section */}
            {d.showDresscode && (
              <Reveal
                variant="fade-up"
                delay={150}
                className="relative z-10 mt-14 pt-4 space-y-3 max-w-[320px] mx-auto"
              >
                <h3 className="font-sloop text-[60px] sm:text-[68px] text-[#68333e] leading-none">
                  {d.dresscodeTitle || 'Dress Code'}
                </h3>
                <p className="text-[14px] font-bold text-[#68333e]">
                  {d.dresscodeText}
                </p>
                {/* 3 Circular Color Swatches */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  {(d.dresscodeColors || ['#fdf9f6', '#a96d79', '#68333e']).map((hex, idx) => (
                    <span
                      key={idx}
                      className="w-11 h-11 rounded-full border-[2.5px] border-[#68333e] shadow-sm inline-block transition-transform duration-500 hover:scale-115"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </Reveal>
            )}

            <img
              src={ASSETS.floralPillar}
              alt=""
              className="pointer-events-none absolute -bottom-8 -left-10 w-28 opacity-85 dp-orchid-sway-l"
            />
          </section>

          {/* -----------------------------------------------------------------
              SLIDE 4 (t[3]): WEDDING GIFT (LACE CARDS & WHATSAPP CONFIRMATION)
             ----------------------------------------------------------------- */}
          {((d.showDonation && d.bankAccounts.length > 0) || (d.showGift && d.giftAddress)) && (
            <section
              className="relative px-5 py-16 overflow-hidden text-center"
              style={{
                backgroundImage: `url(${ASSETS.bgPaperLong})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <img
                src={ASSETS.orchidCascade}
                alt=""
                className="pointer-events-none absolute -top-8 -right-10 w-32 opacity-90 dp-orchid-sway-r"
              />

              <div className="relative z-10 max-w-[340px] mx-auto space-y-4">
                <Reveal variant="fade-up">
                  <h2 className="font-sloop text-[62px] sm:text-[70px] text-[#68333e] leading-none">
                    {d.giftTitle || 'Wedding Gift'}
                  </h2>

                  <div className="flex justify-center py-2">
                    <img
                      src={ASSETS.giftIcon}
                      alt="Gift"
                      className="w-16 h-16 object-contain animate-float"
                    />
                  </div>

                  <p
                    className="text-[14px] leading-[1.6] text-[#68333e]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {d.giftSubtitle &&
                    !d.giftSubtitle.includes('Tanpa mengurangi rasa hormat')
                      ? d.giftSubtitle
                      : 'Doa restu dan kehadiran Anda merupakan karunia yang sangat berarti bagi kami.\n\nNamun, jika memberi adalah ungkapan tanda kasih, Anda dapat memberi melalui dibawah ini.'}
                  </p>
                </Reveal>

                {/* Embroidered Lace Bank Cards */}
                {d.showDonation && (
                  <div className="space-y-6 pt-3">
                    {d.bankAccounts.map((acc, idx) => (
                      <Reveal
                        key={idx}
                        variant={idx % 2 === 0 ? 'fade-right' : 'fade-left'}
                        delay={idx * 150}
                        className="relative w-full max-w-[310px] mx-auto"
                      >
                        <img
                          src={ASSETS.orchidCascade}
                          alt=""
                          className={`pointer-events-none absolute -top-5 ${
                            idx % 2 === 0 ? '-left-6 dp-orchid-sway-l' : '-right-6 dp-orchid-sway-r'
                          } w-20 z-20 drop-shadow`}
                        />
                        <div className="relative w-full aspect-[1.36/1] flex flex-col items-center justify-center px-10 py-8">
                          <img
                            src={ASSETS.laceBankCard}
                            alt=""
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none rotate-90 scale-[1.28] drop-shadow-md"
                          />
                          <div className="relative z-10 space-y-1.5 text-center">
                            <p
                              className="text-[19px] font-bold tracking-[0.08em] text-[#68333e]"
                              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                            >
                              {acc.nomor}
                            </p>
                            <p
                              className="text-[14px] font-semibold text-[#68333e]"
                              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                            >
                              {acc.bank}
                              <br />
                              a.n {acc.nama}
                            </p>
                            <div className="pt-1.5">
                              <button
                                type="button"
                                onClick={() => d.copyBank(acc.nomor, idx)}
                                className="btn-sheen inline-flex items-center gap-1.5 rounded-full bg-[#68333e] hover:bg-[#3b181f] text-[#fdf9f6] text-[11px] font-semibold px-5 py-1.5 shadow transition cursor-pointer"
                              >
                                {d.copiedBankIndex === idx ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#00bf63]" />
                                    <span>Tersalin</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Salin Rekening</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                )}

                {/* Physical Gift & WhatsApp Confirmation Cards */}
                {d.showGift && (
                  <Reveal variant="fade-up" delay={180} className="pt-6 space-y-4">
                    <p
                      className="text-[14px] leading-[1.55] text-[#68333e]"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {d.giftConfirmText}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {[
                        { name: d.giftWa1Name || d.brideShort, phone: d.giftWa1Phone },
                        { name: d.giftWa2Name || d.groomShort, phone: d.giftWa2Phone },
                      ]
                        .filter((c) => c.phone || c.name)
                        .map((c, idx) => (
                          <a
                            key={idx}
                            href={formatWaLink(c.phone, c.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex flex-col items-center justify-center p-4 min-h-[96px] hover:scale-[1.04] transition"
                          >
                            <img
                              src={ASSETS.waCardFrame}
                              alt=""
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                            />
                            <div className="relative z-10 font-courier-prime text-[#68333e] text-center space-y-0.5">
                              <p className="text-[11px] sm:text-[12px] font-bold tracking-tight">
                                {c.phone}
                              </p>
                              <p className="text-[12px] font-bold">{c.name}</p>
                            </div>
                          </a>
                        ))}
                    </div>

                    {d.giftAddress && (
                      <div className="mt-3 p-4 rounded-2xl bg-[#fdf9f6]/85 border border-[#68333e]/20 text-center space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#68333e]">
                          Alamat Pengiriman Kado
                        </p>
                        <p className="text-[12px] text-[#68333e]/90 leading-relaxed">
                          {d.giftAddress}
                        </p>
                        <button
                          type="button"
                          onClick={d.copyAddress}
                          className="btn-sheen inline-flex items-center gap-1.5 rounded-full bg-[#68333e] text-[#fdf9f6] text-[11px] px-4 py-1.5 cursor-pointer"
                        >
                          {d.copiedAddress ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Alamat Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin Alamat</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {/* -----------------------------------------------------------------
              SLIDE 5 (t[4]): RSVP & UCAPAN INSIDE VINTAGE LACE PAPER FRAME
             ----------------------------------------------------------------- */}
          <section
            id="rsvp-section"
            className="relative px-4 py-14 overflow-hidden"
            style={{
              backgroundImage: `url(${ASSETS.bgPaperLong})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <img
              src={ASSETS.orchidCascade}
              alt=""
              className="pointer-events-none absolute top-2 -right-8 w-28 z-20 dp-orchid-sway-r"
            />

            <Reveal
              variant="fade-up"
              className="relative z-10 w-full max-w-[370px] mx-auto rounded-[28px] bg-[#fdf9f6]/95 border-2 border-[#e6ddcb] shadow-[0_14px_35px_rgba(104,51,62,0.15)] p-6 space-y-4"
            >
              <div className="text-center space-y-1">
                <h2 className="font-sloop text-[54px] text-[#68333e] leading-none">
                  {d.rsvpSubtitle && d.rsvpSubtitle !== 'Ucapan & doa'
                    ? d.rsvpSubtitle
                    : 'Ucapan & Doa'}
                </h2>
                <p className="text-[12px] text-[#68333e]/80">
                  Konfirmasi kehadiran &amp; berikan doa restu terbaik Anda
                </p>
              </div>

              <form onSubmit={d.rsvp.send} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#68333e] mb-1">
                    Nama Tamu *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={d.rsvp.name}
                    onChange={(e) => d.rsvp.setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full rounded-xl bg-white border border-[#68333e]/25 px-3.5 py-2 text-[12.5px] text-[#3b181f] focus:outline-none focus:border-[#68333e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#68333e] mb-1">
                    Konfirmasi Kehadiran *
                  </label>
                  <select
                    value={d.rsvp.status}
                    onChange={(e) => d.rsvp.setStatus(e.target.value)}
                    className="w-full rounded-xl bg-white border border-[#68333e]/25 px-3.5 py-2 text-[12.5px] text-[#3b181f] focus:outline-none focus:border-[#68333e]"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#68333e] mb-1">
                    Ucapan &amp; Doa *
                  </label>
                  <textarea
                    rows={3}
                    required
                    maxLength={500}
                    value={d.rsvp.message}
                    onChange={(e) => d.rsvp.setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan dan doa untuk kedua mempelai..."
                    className="w-full rounded-xl bg-white border border-[#68333e]/25 px-3.5 py-2 text-[12.5px] text-[#3b181f] focus:outline-none focus:border-[#68333e]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={d.rsvp.hasSubmitted}
                  className="btn-sheen w-full rounded-full bg-[#68333e] hover:bg-[#3b181f] text-[#fdf9f6] text-[12.5px] font-bold py-2.5 shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {d.rsvp.hasSubmitted ? 'Ucapan Terkirim' : 'Kirim Ucapan'}
                </button>
              </form>

              {d.rsvp.list && d.rsvp.list.length > 0 && (
                <div className="pt-4 border-t border-[#68333e]/15 space-y-2.5">
                  <div className="max-h-[290px] overflow-y-auto pr-1 space-y-2">
                    {paginatedRsvps.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3 rounded-xl bg-[#faf3ed] border border-[#68333e]/15 text-left space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12.5px] font-bold text-[#3b181f]">
                            {item.guest_name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.attendance_status === 'Hadir'
                                ? 'bg-[#68333e]/15 text-[#68333e]'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {item.attendance_status || 'Hadir'}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#68333e] leading-relaxed">
                          {item.message}
                        </p>
                        <p className="text-[9.5px] text-[#a96d79]">
                          {formatRsvpDate(item)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {totalRsvpPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={rsvpPage <= 1}
                        onClick={() => setRsvpPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded-full bg-[#68333e]/10 text-[#68333e] text-[11px] disabled:opacity-40 cursor-pointer"
                      >
                        « Prev
                      </button>
                      <span className="text-[11px] text-[#68333e]">
                        {rsvpPage} / {totalRsvpPages}
                      </span>
                      <button
                        type="button"
                        disabled={rsvpPage >= totalRsvpPages}
                        onClick={() => setRsvpPage((p) => Math.min(totalRsvpPages, p + 1))}
                        className="px-3 py-1 rounded-full bg-[#68333e]/10 text-[#68333e] text-[11px] disabled:opacity-40 cursor-pointer"
                      >
                        Next »
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Reveal>

            {/* QR Check-In Card (hanya tampil bila d.showQr aktif & bukan Grup) */}
            {d.showQr && (
              <Reveal
                variant="zoom-in"
                delay={150}
                className="relative z-10 w-full max-w-[340px] mx-auto mt-6 rounded-2xl bg-[#fdf9f6]/95 border border-[#68333e]/25 p-5 text-center shadow-md space-y-2"
              >
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a96d79]">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Check-In Pass</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl inline-block border border-[#e6ddcb] shadow-xs">
                  <QRCodeSVG value={d.qrValue} size={128} level="M" includeMargin={false} />
                </div>
                <p className="text-[13px] font-bold text-[#3b181f]">{d.guestName}</p>
                <p className="text-[11px] text-[#68333e]/80">
                  Tunjukkan QR Code ini kepada petugas penerima tamu di lokasi acara.
                </p>
              </Reveal>
            )}
          </section>

          {/* -----------------------------------------------------------------
              SLIDE 6 (t[5]): LOVE STORY (TILTED POLAROIDS + WAX SEAL + TIMELINE)
             ----------------------------------------------------------------- */}
          {storiesToRender.length > 0 && (
            <section
              className="relative px-6 py-16 overflow-hidden"
              style={{
                backgroundImage: `url(${ASSETS.bgPaperCream})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dual Tilted Paper Polaroids + Wax Seal */}
              <Reveal
                variant="zoom-in"
                className="relative z-10 max-w-[330px] mx-auto pt-2 pb-6 flex items-center justify-center"
              >
                {/* Left Polaroid */}
                <div className="relative w-36 sm:w-40 aspect-[4/5] -rotate-6 bg-[#fdf9f6] p-2.5 pb-6 shadow-xl border border-[#e6ddcb] transition-transform duration-500 hover:rotate-0">
                  <img
                    src={d.gallery?.[0] || coverCouplePhoto}
                    alt="Story 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Right Polaroid */}
                <div className="relative w-36 sm:w-40 aspect-[4/5] rotate-6 -ml-4 mt-4 bg-[#fdf9f6] p-2.5 pb-6 shadow-xl border border-[#e6ddcb] transition-transform duration-500 hover:rotate-0">
                  <img
                    src={d.gallery?.[1] || closingPhoto}
                    alt="Story 2"
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={ASSETS.orchidCascade}
                    alt=""
                    className="pointer-events-none absolute -top-6 -right-8 w-24 z-20 drop-shadow dp-orchid-sway-r"
                  />
                </div>
                {/* Center Wax Seal */}
                <img
                  src={ASSETS.waxSeal}
                  alt=""
                  className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-12 object-contain z-30 dp-wax-pulse"
                />
              </Reveal>

              <Reveal variant="fade-up" delay={120}>
                <h2 className="relative z-10 font-sloop text-[64px] sm:text-[72px] text-[#68333e] text-center leading-none mt-2 mb-8">
                  {d.storiesTitle && d.storiesTitle !== 'OUR STORIES'
                    ? d.storiesTitle
                    : 'Love Story'}
                </h2>
              </Reveal>

              {/* Vertical Timeline with Heart/Ribbon Bullet Icons */}
              <div className="relative z-10 max-w-[340px] mx-auto pl-7 border-l-2 border-[#68333e] space-y-7">
                {storiesToRender.map((st, idx) => (
                  <Reveal
                    key={idx}
                    variant="fade-left"
                    delay={idx * 160}
                    className="relative text-left space-y-1"
                  >
                    <img
                      src={ASSETS.storyBullet}
                      alt=""
                      className="absolute -left-[37px] top-1 w-4 h-5 object-contain bg-[#faf3ed] py-0.5"
                    />
                    <h3 className="font-sloop text-[36px] sm:text-[40px] text-[#3b181f] leading-none">
                      {st.judul}
                      {st.tahun ? ` (${st.tahun})` : ''}
                    </h3>
                    <p className="text-[12.5px] leading-[1.65] text-[#3b181f]/90">
                      {st.cerita}
                    </p>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* -----------------------------------------------------------------
              SLIDE 7 (t[6]): GALLERY FILMSTRIP COLLAGE
             ----------------------------------------------------------------- */}
          <section
            className="relative px-5 py-16 overflow-hidden"
            style={{
              backgroundImage: `url(${ASSETS.bgPaperCream})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <img
              src={ASSETS.orchidCascade}
              alt=""
              className="pointer-events-none absolute -top-8 -right-8 w-32 opacity-90 dp-orchid-sway-r"
            />

            <Reveal variant="fade-up">
              <h2 className="relative z-10 font-sloop text-[64px] sm:text-[74px] text-[#3b181f] text-center leading-none mb-8">
                {d.momentsTitle && d.momentsTitle !== 'OUR MOMENTS'
                  ? d.momentsTitle
                  : 'Gallery'}
              </h2>
            </Reveal>

            {/* Staggered Filmstrip Frames */}
            <div className="relative z-10 grid grid-cols-2 gap-3 max-w-[360px] mx-auto">
              {(d.gallery || []).map((photoUrl, idx) => {
                const isOffset = idx % 2 === 1;
                return (
                  <Reveal
                    key={`${photoUrl}-${idx}`}
                    variant={isOffset ? 'fade-left' : 'fade-right'}
                    delay={(idx % 4) * 110}
                  >
                    <button
                      type="button"
                      onClick={() => d.openLightbox(idx)}
                      className={`group relative w-full bg-[#202020] p-2 shadow-xl transition-transform duration-500 hover:scale-[1.03] cursor-pointer ${
                        isOffset ? 'mt-5 -rotate-1' : 'rotate-1'
                      }`}
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-stone-900">
                        <img
                          src={photoUrl}
                          alt={`Gallery ${idx + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* -----------------------------------------------------------------
              SLIDE 8 (t[7]): CLOSING LACE LETTER TUCKED INSIDE OPEN ENVELOPE
             ----------------------------------------------------------------- */}
          <section className="relative min-h-screen flex flex-col items-center px-5 pt-12 pb-16 overflow-hidden">
            <img
              src={ASSETS.bgDrapery}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 dp-drapery-motion"
            />

            {/* Bottom-Left & Bottom-Right Floral Pillar Borders */}
            <img
              src={ASSETS.floralPillar}
              alt=""
              className="pointer-events-none absolute -bottom-6 -left-14 w-40 sm:w-44 z-10 opacity-95 dp-orchid-sway-l"
            />
            <img
              src={ASSETS.floralPillar}
              alt=""
              className="pointer-events-none absolute -bottom-6 -right-14 w-40 sm:w-44 z-10 opacity-95 scale-x-[-1] dp-orchid-sway-r"
            />

            <Reveal
              variant="fade-up"
              duration={1150}
              className="relative z-20 w-full max-w-[340px] mx-auto"
            >
              <div className="relative w-full pt-2 pb-[155px]">
                {/* 1. Back of Open Envelope (behind the closing letter) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[330px] z-10">
                  <img
                    src={ASSETS.envelopeOpenBack}
                    alt=""
                    className="w-full h-full object-contain object-bottom drop-shadow-[0_18px_36px_rgba(59,24,31,0.5)]"
                  />
                  {/* Mauve Velvet Interior Liner of the Envelope */}
                  <div className="absolute left-[10.5%] right-[10.5%] top-[28%] bottom-[8%] overflow-hidden rounded-xs">
                    <img
                      src={ASSETS.demoClosing}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 2. Embossed Vintage Lace Closing Letter Card (Emerging from inside the envelope) */}
                <div className="relative z-20 w-[86%] mx-auto dp-photo-emerge">
                  <img
                    src={ASSETS.orchidCascade}
                    alt=""
                    className="pointer-events-none absolute -top-4 -right-8 w-32 z-30 drop-shadow-lg dp-orchid-sway-r"
                  />
                  <img
                    src={ASSETS.butterfly}
                    alt=""
                    className="pointer-events-none absolute top-6 -left-3 w-13 h-13 object-contain z-30 dp-butterfly-drift"
                  />

                  <div className="relative w-full aspect-[3/4.15] flex flex-col items-center justify-center px-9 pt-12 pb-20 text-center">
                    <img
                      src={ASSETS.laceCard}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_12px_25px_rgba(59,24,31,0.3)]"
                    />
                    <div className="relative z-10 space-y-2.5 px-1">
                      <p className="text-[11.5px] sm:text-[12.5px] leading-[1.58] text-[#68333e]">
                        {d.closingText &&
                        !d.closingText.includes('Merupakan suatu kehormatan dan kebahagiaan')
                          ? d.closingText
                          : 'Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam hari bahagia kami. Terimakasih atas segala ucapan, doa, dan perhatian yang diberikan.'}
                      </p>
                      <p className="text-[12px] font-bold text-[#68333e]">
                        {d.closingSubtitle || 'Sampai jumpa di hari pernikahan kami!'}
                      </p>
                      <div className="pt-1 font-sloop text-[46px] sm:text-[52px] text-[#68333e] leading-[0.88]">
                        <div>{d.brideShort}</div>
                        <div className="text-[34px] my-0.5">&amp;</div>
                        <div>{d.groomShort}</div>
                      </div>
                    </div>

                    {/* Grommet Eyelet & Hanging Burgundy Silk Tassel attached to bottom of Lace Letter */}
                    <div className="pointer-events-none absolute left-1/2 bottom-[3%] -translate-x-1/2 translate-y-[42%] z-30 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#3b181f] border-[2.5px] border-[#a96d79] shadow-inner" />
                      <img
                        src={ASSETS.tasselDark}
                        alt=""
                        className="-mt-3.5 w-14 sm:w-16 h-28 sm:h-32 object-contain drop-shadow-[0_10px_16px_rgba(32,10,15,0.5)] dp-tassel-l"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Open Envelope Front Pocket Flaps */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[330px] z-30">
                  <img
                    src={ASSETS.envelopeOpenPocket}
                    alt=""
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>
              </div>
            </Reveal>

            {/* Footer Brand */}
            <div className="relative z-20 mt-8 text-center text-[#fdf9f6]/85 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.22em]">Made with Love by</p>
              <p className="font-cardo text-[15px] tracking-[0.22em] uppercase font-bold">
                {d.footerBrand || 'SAMSKARA'}
              </p>
            </div>
          </section>
        </div>

        {/* Floating Music Disc */}
        {d.isOpened && (
          <button
            type="button"
            onClick={d.toggleMusic}
            aria-label={d.isPlayingMusic ? 'Jeda Musik' : 'Putar Musik'}
            className="fixed bottom-[30px] right-[25px] z-40 w-[38px] h-[38px] rounded-full bg-[#68333e]/90 backdrop-blur-md border border-[#fdf9f6]/40 flex items-center justify-center text-[#fdf9f6] shadow-lg hover:scale-110 transition cursor-pointer"
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
          invitationTitle={`${d.brideShort} & ${d.groomShort}`}
          accentColor="#68333e"
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
