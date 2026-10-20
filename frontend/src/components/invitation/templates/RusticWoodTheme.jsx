import { useRef } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Send,
  Navigation,
  Bell,
  Heart,
  Sparkles,
  Gift,
} from "lucide-react";
import { Badge } from "../../ui";
import { MusicVinylPlayer } from "../MusicVinylPlayer";
import { GalleryLightbox } from "../GalleryLightbox";
import { useScrollMotion, useParallax } from "../useScrollMotion";
import { ScrollProgress, Burst } from "../MotionKit";
import { useInvitationData, formatRsvpDate } from "../useInvitationData";
import { InvitationFloatingControls } from "../InvitationFloatingControls";
import { DesktopSidePanel } from "../DesktopSidePanel";

/**
 * TEMA RUSTIC WOOD & BOTANICAL
 * Palet: kayu walnut hangat, kertas kraft bertekstur, daun eukaliptus, lampu temaram (fairy lights).
 * Motif: garland lampu gantung, dedaunan botanical, stempel wax seal, tiket perforasi kayu,
 *        polaroid bertape, papan kayu bernama, buku catatan bergaris.
 * Kode template: `rustic-wood`
 */

/* ------------------------------------------------------------------ */
/* DESIGN TOKENS (inline style helpers)                                */
/* ------------------------------------------------------------------ */

const WOOD_GRAIN = {
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 3px, transparent 3px, transparent 17px)",
};

const WOOD_PLANK = { ...WOOD_GRAIN, backgroundColor: "#6B4426" };
const WOOD_DARK = { ...WOOD_GRAIN, backgroundColor: "#4A2F1B" };

const WAX_STYLE = {
  background:
    "radial-gradient(circle at 35% 30%, #A8452F 0%, #7A2E1F 55%, #4E1C12 100%)",
  boxShadow:
    "inset 0 2px 3px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.45)",
};

const RULED_PAPER = {
  backgroundImage:
    "repeating-linear-gradient(transparent, transparent 23px, #E3D3B8 23px, #E3D3B8 24px)",
  backgroundAttachment: "local",
  lineHeight: "24px",
};

const SECTION_BG_TICKET = "#EFE3D0";

const mapsHref = (ev) =>
  ev.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(ev.lokasi)}`;

/* ------------------------------------------------------------------ */
/* DECORATIVE PIECES                                                   */
/* ------------------------------------------------------------------ */

const FairyLights = () => (
  <svg
    viewBox="0 0 400 36"
    className="w-full h-9 block overflow-visible pointer-events-none select-none"
    aria-hidden="true"
  >
    {/* String cable */}
    <path
      d="M0 8 Q 50 20 100 8 T 200 8 T 300 8 T 400 8"
      fill="none"
      stroke="#5A3821"
      strokeWidth="1.2"
      opacity="0.65"
    />
    {/* Bulbs with glowing aura */}
    {[25, 60, 100, 145, 190, 235, 275, 320, 365].map((cx, i) => (
      <g
        key={cx}
        className="animate-warm-glow"
        style={{ animationDelay: `${(i % 4) * 0.7}s` }}
      >
        <circle
          cx={cx}
          cy={16 + (i % 2) * 2}
          r="9"
          fill="#FBBF24"
          opacity="0.35"
        />
        <ellipse cx={cx} cy={15 + (i % 2) * 2} rx="3.5" ry="5" fill="#FEF3C7" />
        <circle cx={cx} cy={15 + (i % 2) * 2} r="1.5" fill="#F59E0B" />
        <rect
          x={cx - 2}
          y={10 + (i % 2) * 2}
          width="4"
          height="2"
          fill="#3E2717"
          rx="0.5"
        />
      </g>
    ))}
  </svg>
);

const BotanicalBranch = ({ className = "", flip = false }) => (
  <svg
    viewBox="0 0 100 30"
    className={`w-28 h-8 ${flip ? "-scale-x-100" : ""} ${className}`}
    fill="none"
    stroke="#4A6B53"
    strokeWidth="1.3"
    aria-hidden="true"
  >
    <path d="M5 15 Q 50 12 95 15" strokeLinecap="round" />
    {[20, 40, 60, 80].map((x) => (
      <g key={x}>
        <path
          d={`M${x} 14 Q ${x + 8} 3 ${x + 14} 7 Q ${x + 8} 14 ${x} 14`}
          fill="#4A6B53"
          fillOpacity="0.28"
        />
        <path
          d={`M${x + 5} 16 Q ${x + 13} 27 ${x + 19} 23 Q ${x + 13} 16 ${x + 5} 16`}
          fill="#4A6B53"
          fillOpacity="0.28"
        />
      </g>
    ))}
  </svg>
);

const RusticDivider = () => (
  <div
    className="flex items-center justify-center gap-3 select-none"
    aria-hidden="true"
  >
    <BotanicalBranch flip />
    <span className="w-2.5 h-2.5 rounded-full bg-[#8C6239] ring-4 ring-[#8C6239]/20" />
    <BotanicalBranch />
  </div>
);

/** Selotip kertas untuk menempel polaroid / catatan */
const Tape = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={`absolute z-10 h-5 w-16 bg-[#E6D3A8]/85 shadow-xs ${className}`}
    style={{
      clipPath: "polygon(3% 0, 97% 0, 100% 50%, 97% 100%, 3% 100%, 0 50%)",
    }}
  />
);

/** Cap lilin (wax seal) */
const WaxSeal = ({ children, className = "" }) => (
  <span
    className={`relative inline-flex items-center justify-center rounded-full text-[#F3D9B8] ${className}`}
    style={WAX_STYLE}
  >
    <span
      aria-hidden="true"
      className="absolute inset-1.5 rounded-full border border-[#F3D9B8]/30"
    />
    {children}
  </span>
);

const SectionHeading = ({ eyebrow, title, subtitle, light = false }) => (
  <div
    className={`text-center space-y-2 ${light ? "text-[#E0B77A]" : "text-[#8C6239]"}`}
  >
    <span className="block text-[10px] font-sans uppercase tracking-[0.35em] font-bold">
      {eyebrow}
    </span>
    <h3
      className={`text-3xl font-serif-theme font-bold ${
        light ? "text-[#F5EEE6]" : "text-[#2A1B10]"
      }`}
    >
      {title}
    </h3>
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      <span className="h-px w-10 bg-current opacity-40" />
      <Sparkles className="w-3 h-3" />
      <span className="h-px w-10 bg-current opacity-40" />
    </div>
    {subtitle && (
      <p
        className={`text-xs max-w-sm mx-auto leading-relaxed font-sans pt-1 ${
          light ? "text-[#D8C3A5]" : "text-[#5A3821]"
        }`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

/** Tiket perforasi untuk Akad / Resepsi */
const EventTicket = ({ label, dotClass, event, googleCalUrl }) => (
  <div className="relative rounded-3xl bg-[#FBF6EE] border border-[#D8C3A5] shadow-lg px-6 pb-6 text-center font-sans">
    {/* Header papan kayu */}
    <div
      className="-mx-6 mb-5 rounded-t-[23px] py-3 flex items-center justify-center gap-2 text-[#F5EEE6] text-xs font-bold uppercase tracking-[0.3em]"
      style={WOOD_PLANK}
    >
      <span className={`w-2 h-2 rounded-full ${dotClass}`} />
      {label}
    </div>

    <div className="space-y-1.5">
      <p className="text-base font-bold font-serif-theme text-[#2A1B10] flex items-center justify-center gap-1.5">
        <Calendar className="w-4 h-4 text-[#8C6239]" />
        {event.tanggal}
      </p>
      <p className="text-xs text-[#6D4C2B] flex items-center justify-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-[#8C6239]" />
        {event.waktu}
      </p>
    </div>

    {/* Garis perforasi + takik tiket */}
    <div className="relative -mx-6 my-5" aria-hidden="true">
      <div className="border-t-2 border-dashed border-[#D8C3A5]" />
      <span
        className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-r border-[#D8C3A5]"
        style={{ backgroundColor: SECTION_BG_TICKET }}
      />
      <span
        className="absolute right-0 top-0 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full border-l border-[#D8C3A5]"
        style={{ backgroundColor: SECTION_BG_TICKET }}
      />
    </div>

    <div className="space-y-1">
      <p className="text-xs font-bold text-[#2E1F14] flex items-center justify-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-[#8C6239]" />
        {event.lokasi}
      </p>
      {event.alamat && (
        <p className="text-[11px] text-[#6D4C2B] leading-relaxed max-w-xs mx-auto">
          {event.alamat}
        </p>
      )}
    </div>

    <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
      <a
        href={mapsHref(event)}
        target="_blank"
        rel="noreferrer"
        className="py-2.5 px-4 rounded-xl bg-[#2E1F14] hover:bg-black text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm"
      >
        <Navigation className="w-3.5 h-3.5" />
        <span>Google Maps</span>
      </a>
      <a
        href={googleCalUrl}
        target="_blank"
        rel="noreferrer"
        className="py-2.5 px-4 rounded-xl bg-[#F5EEE6] hover:bg-[#EADDCF] text-[#5A3821] text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-[#D8C3A5]"
      >
        <Bell className="w-3.5 h-3.5" />
        <span>Simpan ke Kalender</span>
      </a>
    </div>
  </div>
);

/** Kartu mempelai ala polaroid bertape */
const CoupleCard = ({
  photo,
  alt,
  name,
  role,
  roleClass,
  parentLabel,
  father,
  mother,
  tilt,
}) => (
  <div className="relative mx-auto w-64">
    <div
      className={`relative bg-[#FFFDF8] p-3 pb-6 shadow-xl border border-[#E5D5BB] ${tilt}`}
    >
      <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />
      <div className="aspect-[4/5] overflow-hidden bg-[#EADDCF]">
        <img
          src={photo}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
    <div className="mt-6 space-y-1.5 text-center">
      <span
        className={`block text-[10px] font-sans uppercase tracking-[0.3em] font-bold ${roleClass}`}
      >
        {role}
      </span>
      <h4 className="text-2xl font-bold font-serif-theme text-[#2A1B10] leading-snug">
        {name}
      </h4>
      <p className="text-xs text-[#6D4C2B] leading-relaxed font-sans">
        {parentLabel}
        <br />
        <span className="font-semibold text-[#2E1F14]">
          {father}
        </span> &amp;{" "}
        <span className="font-semibold text-[#2E1F14]">{mother}</span>
      </p>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* MAIN THEME                                                          */
/* ------------------------------------------------------------------ */

export const RusticWoodTheme = (props) => {
  const d = useInvitationData(props);
  const motionRef = useRef(null);

  useScrollMotion(motionRef, d.isOpened);
  useParallax(motionRef, d.isOpened, 0.12);

  const countdownItems = [
    { label: "Hari", val: d.timeLeft.days },
    { label: "Jam", val: d.timeLeft.hours },
    { label: "Menit", val: d.timeLeft.minutes },
    { label: "Detik", val: d.timeLeft.seconds },
  ];

  const galleryTilt = ["-rotate-1", "rotate-1", "rotate-[0.6deg]"];
  const initials = `${String(d.groomShort ?? "").charAt(0)}&${String(d.brideShort ?? "").charAt(0)}`;

  return (
    <div
      ref={motionRef}
      className={`relative w-full max-w-lg md:max-w-none md:w-full lg:max-w-none lg:w-[480px] xl:w-[520px] ${d.isOpened ? 'min-h-screen md:w-full lg:w-[480px] xl:w-[520px] lg:ml-auto lg:mr-0' : 'h-screen max-h-screen mx-auto md:w-full lg:w-[480px] xl:w-[520px]'} bg-rustic-kraft text-[#2E1F14] shadow-2xl overflow-hidden font-serif-theme border-x border-[#D8C3A5] selection:bg-[#8C6239] selection:text-white scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="rustic"
        invitationData={d}
        isOpened={d.isOpened}
        isModalView={props?.isModalView}
      />
      {/* Scroll indicator & Audio */}
      <ScrollProgress color="#8C6239" active={d.isOpened} />
      {d.isOpened && (
        <Burst
          colors={["#8C6239", "#4A6B53", "#D8C3A5", "#F5EEE6", "#B45309"]}
        />
      )}

      {d.isOpened && (
        <MusicVinylPlayer
          musicUrl={d.musicUrl}
          musicTitle={d.musicTitle}
          isPlaying={d.isPlayingMusic}
          onToggle={d.toggleMusic}
          position="bottom-right"
          theme="wood"
          accentColor="#8C6239"
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
        theme="wood"
        accentColor="#8C6239"
      />

      {/* ============================================================== */}
      {/* COVER: PAPAN KAYU, LAMPU TEMARAM & WAX SEAL                    */}
      {/* ============================================================== */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto bg-[#2A1B10] text-[#F5EEE6] transition-all duration-1000 ease-in-out ${
          d.isOpened
            ? "opacity-0 pointer-events-none -translate-y-full scale-105"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* Background photo + warm overlay */}
        <div
          className="fixed inset-0 bg-cover bg-center opacity-30 contrast-125 pointer-events-none"
          style={{ backgroundImage: `url(${d.photoCover})` }}
        />
        <div className="fixed inset-0 bg-gradient-to-b from-[#1C120A]/85 via-[#2A1B10]/90 to-[#1C120A] pointer-events-none" />

        <div className="relative z-10 flex min-h-full flex-col justify-between p-6 sm:p-8 md:p-12">
          {/* Top fairy lights */}
          <div className="-mt-2 -mx-4">
            <FairyLights />
          </div>

          {/* Desktop Responsive Content */}
          <div className="cover-stagger w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto my-auto py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12 text-center">
            {/* Left Column (Desktop): Arch Window & Couple Names */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#D8C3A5] font-sans font-medium">
                The Wedding Celebration
              </p>

              {/* Arch window photo */}
              <div className="relative w-44 h-56 sm:w-48 sm:h-64 mx-auto md:mx-0 rounded-t-[5.5rem] rounded-b-xl p-1.5 bg-gradient-to-b from-[#D8C3A5] via-[#8C6239] to-[#4A6B53] shadow-2xl">
                <div className="w-full h-full overflow-hidden rounded-t-[5rem] rounded-b-lg border-2 border-[#FAF4EC]">
                  <img
                    src={d.photoCover}
                    alt="Couple"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-5xl sm:text-6xl md:text-6xl font-cursive text-[#F5EEE6] leading-tight">
                  {d.groomShort} &amp; {d.brideShort}
                </h1>
                <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#A3B899] font-sans">
                  {d.akad.tanggal}
                </p>
              </div>
            </div>

            {/* Right Column (Desktop): Guest Nameplate & Wax Seal Button */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 space-y-6">
              {/* Guest nameplate — papan kayu */}
              <div
                className="relative w-full max-w-sm mx-auto md:mx-0 rounded-2xl border border-[#3E2717] px-6 py-5 shadow-2xl space-y-2 text-center md:text-left"
                style={WOOD_PLANK}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-3 w-1.5 h-1.5 rounded-full bg-[#2A1B10]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-[#2A1B10]"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-3 bottom-3 w-1.5 h-1.5 rounded-full bg-[#2A1B10]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 bottom-3 w-1.5 h-1.5 rounded-full bg-[#2A1B10]"
                />

                <p className="text-[11px] text-[#E8D5B7] font-sans">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h3 className="text-xl font-bold font-serif-theme text-[#FBF3E4] flex items-center justify-center md:justify-start gap-2">
                  {d.guestName}
                  {d.isVip && (
                    <Badge
                      variant="warning"
                      size="sm"
                      className="font-sans font-bold text-[10px]"
                    >
                      VIP
                    </Badge>
                  )}
                </h3>
                <p className="text-[10px] text-[#D8C3A5] italic font-sans">
                  *Di Tempat / Mohon maaf bila ada kesalahan penulisan nama &amp; gelar
                </p>
              </div>

              {/* Buka Undangan — wax seal */}
              <div className="flex items-center gap-4 pt-2 mx-auto md:mx-0">
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#B45309]/40 animate-ping"
                  />
                  <button
                    type="button"
                    onClick={d.openInvitation}
                    aria-label="Buka Undangan"
                    className="btn-sheen relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-90"
                    style={WAX_STYLE}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-1.5 rounded-full border border-[#F3D9B8]/30"
                    />
                    <Heart className="relative w-7 h-7 text-[#F3D9B8] fill-[#F3D9B8]/30" />
                  </button>
                </div>
                <div className="text-left">
                  <span className="block text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#E8D5B7]">
                    Buka Undangan
                  </span>
                  <span className="block text-[10px] font-sans text-[#D8C3A5]/80">
                    Sentuh cap stempel lilin untuk membuka
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="hidden md:block pb-2" />
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN CONTENT                                                   */}
      {/* ============================================================== */}
      <div className="relative pb-24">
        {/* SECTION 1: HERO — ARCH PHOTO */}
        <section className="relative pt-6 pb-14 px-6 text-center space-y-6 bg-gradient-to-b from-[#E8D9C0]/70 via-[#F8F4EC] to-[#F8F4EC]">
          <FairyLights />

          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-[#8C6239] font-semibold">
              Walimatul &apos;Urs
            </span>
            <h2 className="text-5xl font-cursive text-[#2A1B10] leading-tight">
              {d.groomShort} &amp; {d.brideShort}
            </h2>
            <p className="text-xs font-sans tracking-widest text-[#6D4C2B] uppercase">
              {d.akad.tanggal} &bull; {d.akad.lokasi}
            </p>
          </div>

          {/* Arch frame with parallax */}
          <div className="relative w-64 mx-auto pb-6">
            <div className="p-2 rounded-t-[8rem] rounded-b-3xl bg-gradient-to-b from-[#D8C3A5] via-[#8C6239] to-[#5A3821] shadow-2xl">
              <div className="h-80 overflow-hidden rounded-t-[7.5rem] rounded-b-2xl border-2 border-[#FAF4EC] relative bg-[#EADDCF]">
                <img
                  src={d.photoCover}
                  alt="Mempelai"
                  data-parallax
                  className="w-full h-full object-cover scale-110"
                />
              </div>
            </div>
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#3E2717] px-4 py-1.5 font-cursive text-xl text-[#F5EEE6] shadow-lg"
              style={WOOD_PLANK}
            >
              A Sweet Beginning
            </span>
          </div>

          <RusticDivider />
        </section>

        {/* SECTION 2: BASMALAH & AYAT */}
        <section className="py-14 px-6 text-center space-y-5 bg-[#FBF6EE] border-y border-[#D8C3A5]/60">
          <p className="font-arabic text-2xl text-[#2A1B10] leading-loose">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <h3 className="text-sm font-semibold text-[#2E1F14] font-sans uppercase tracking-wider">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </h3>
          <p className="text-xs text-[#5A3821] max-w-sm mx-auto leading-relaxed font-sans">
            Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta&apos;ala, kami
            mengundang Bapak/Ibu/Saudara/i untuk menghadiri syukuran pernikahan
            kami:
          </p>

          {/* Kertas kraft bertape */}
          <div className="relative max-w-md mx-auto mt-4 px-6 py-8 bg-[#F1E4CC] border border-[#D8C3A5] shadow-md -rotate-[0.8deg] space-y-3">
            <Tape className="-top-2.5 left-4 -rotate-6" />
            <Tape className="-top-2.5 right-4 rotate-6" />
            <p className="text-xs font-sans font-bold text-[#8C6239] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>{d.ayatQuote}</span>
            </p>
            <p className="text-xs text-[#5A3821] italic leading-relaxed font-serif">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia
              menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar
              kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan
              di antaramu rasa kasih dan sayang.&rdquo;
            </p>
          </div>
        </section>

        {/* SECTION 3: KEDUA MEMPELAI — POLAROID */}
        <section className="py-16 px-6 space-y-12">
          <SectionHeading eyebrow="Kedua Mempelai" title="Mempelai Pengantin" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-10 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            <CoupleCard
              photo={d.photoBride}
              alt={d.bride}
              name={d.bride}
              role="Mempelai Wanita"
              roleClass="text-[#4A6B53]"
              parentLabel="Putri tercinta dari:"
              father={d.brideFather}
              mother={d.brideMother}
              tilt="-rotate-2"
            />

            <div
              className="flex items-center justify-center gap-3 md:hidden lg:flex"
              aria-hidden="true"
            >
              <BotanicalBranch flip className="w-20" />
              <span className="text-4xl font-cursive text-[#8C6239]">
                &amp;
              </span>
              <BotanicalBranch className="w-20" />
            </div>

            <CoupleCard
              photo={d.photoGroom}
              alt={d.groom}
              name={d.groom}
              role="Mempelai Pria"
              roleClass="text-[#8C6239]"
              parentLabel="Putra tercinta dari:"
              father={d.groomFather}
              mother={d.groomMother}
              tilt="rotate-2"
            />
          </div>
        </section>

        {/* SECTION 4: RANGKAIAN ACARA — TIKET PERFORASI */}
        <section
          className="py-16 px-6 border-y border-[#D8C3A5] space-y-10"
          style={{ backgroundColor: SECTION_BG_TICKET }}
        >
          <SectionHeading
            eyebrow="Save The Date"
            title="Rangkaian Acara"
            subtitle="Insya Allah acara pernikahan kami akan diselenggarakan pada:"
          />

          {/* Countdown — ubin kayu */}
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto font-sans">
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className="py-2.5 rounded-xl border border-[#3E2717] text-center shadow-md"
                style={WOOD_PLANK}
              >
                <span className="block text-2xl font-bold text-[#FBF3E4] font-serif-theme">
                  <span key={item.val} className="inline-block animate-tick">
                    {item.val}
                  </span>
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-[#E0B77A] font-bold mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            <EventTicket
              label="Akad Nikah"
              dotClass="bg-[#FBBF24]"
              event={d.akad}
              googleCalUrl={d.googleCalUrl}
            />
            <EventTicket
              label="Resepsi Pernikahan"
              dotClass="bg-[#A3B899]"
              event={d.resepsi}
              googleCalUrl={d.googleCalUrl}
            />
          </div>
        </section>

        {/* SECTION 5: KISAH KASIH — TIMELINE RANTING */}
        {d.loveStories.length > 0 && (
          <section className="py-16 px-6 space-y-10">
            <SectionHeading eyebrow="Our Story" title="Kisah Kasih" />

            <div className="relative max-w-md mx-auto pl-8">
              <span
                aria-hidden="true"
                className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#4A6B53] via-[#8C6239] to-[#4A6B53] opacity-50"
              />
              {d.loveStories.map((story, idx) => (
                <div key={idx} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#4A6B53] ring-4 ring-[#F4EBDC]">
                    <Heart className="w-3 h-3 text-[#F5EEE6] fill-[#F5EEE6]/40" />
                  </span>
                  <div className="p-5 rounded-2xl bg-[#FBF6EE] border border-[#D8C3A5] shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EADDCF] text-[#5A3821] font-bold tracking-wider">
                        {story.tahun}
                      </span>
                      <span className="text-[10px] text-[#6D4C2B]">
                        Momen #{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-lg font-serif-theme font-bold text-[#2A1B10]">
                      {story.judul}
                    </h4>
                    <p className="text-xs text-[#5A3821] leading-relaxed font-sans font-light">
                      {story.cerita}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 6: GALERI — POLAROID BERTAPE */}
        <section className="py-16 px-6 space-y-10 bg-[#F4EBDC]/70 border-y border-[#D8C3A5]/70">
          <SectionHeading eyebrow="Gallery" title="Momen Bahagia" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-5 max-w-md md:max-w-4xl lg:max-w-md mx-auto">
            {d.gallery.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => d.openLightbox(i)}
                className={`relative group cursor-pointer bg-[#FFFDF8] p-2 pb-4 border border-[#E5D5BB] shadow-lg transition-transform duration-500 hover:rotate-0 hover:-translate-y-1 ${
                  galleryTilt[i % 3]
                } ${i % 3 === 0 ? "col-span-2" : ""}`}
              >
                <Tape
                  className={`-top-2.5 left-1/2 -translate-x-1/2 ${
                    i % 2 === 0 ? "rotate-3" : "-rotate-3"
                  }`}
                />
                <div
                  className={`relative overflow-hidden bg-[#EADDCF] ${i % 3 === 0 ? "h-56" : "h-40"}`}
                >
                  <img
                    src={photo}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#2A1B10]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <span className="text-xs font-sans font-medium">
                      Lihat Foto
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 7: TANDA KASIH — KARTU KAYU */}
        <section
          className="py-16 px-6 space-y-10 bg-[#2A1B10]"
          style={WOOD_GRAIN}
        >
          <SectionHeading
            light
            eyebrow="Wedding Gift"
            title="Tanda Kasih"
            subtitle="Doa restu Anda merupakan karunia terindah bagi kami. Namun jika memberi adalah tanda kasih Anda, Anda dapat mengirimkannya melalui amplop digital:"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            {d.bankAccounts.map((acc, index) => (
              <div
                key={index}
                className="relative p-5 rounded-2xl border border-[#8C6239]/60 shadow-xl space-y-4 font-sans overflow-hidden"
                style={WOOD_DARK}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E0B77A] uppercase tracking-[0.2em]">
                    {acc.bank}
                  </span>
                  <Heart className="w-4 h-4 text-[#E0B77A]" />
                </div>

                {/* chip */}
                <span
                  aria-hidden="true"
                  className="block w-9 h-7 rounded-md bg-gradient-to-br from-[#E8C88A] via-[#C9A262] to-[#9C7A40] opacity-90"
                />

                <div>
                  <p className="text-xl font-mono font-bold tracking-widest text-[#FBF3E4]">
                    {acc.nomor}
                  </p>
                  <p className="text-xs text-[#D8C3A5] mt-1">a.n {acc.nama}</p>
                </div>

                <button
                  onClick={() => d.copyBank(acc.nomor, index)}
                  className="w-full py-2.5 rounded-xl bg-[#F5EEE6] hover:bg-white text-xs font-semibold text-[#2E1F14] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {d.copiedBankIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {d.copiedBankIndex === index
                      ? "Nomor Disalin!"
                      : "Salin Nomor Rekening"}
                  </span>
                </button>
              </div>
            ))}

            {d.giftAddress && (
              <div className="relative p-5 pt-7 rounded-xl bg-[#F1E4CC] border border-[#D8C3A5] shadow-xl space-y-2.5 text-xs text-[#5A3821] font-sans md:col-span-2 lg:col-span-1">
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-2.5 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2A1B10] ring-2 ring-[#D8C3A5]"
                />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C6239] font-bold flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  KIRIM KADO FISIK:
                </span>
                <p className="leading-relaxed">{d.giftAddress}</p>
                <button
                  onClick={d.copyAddress}
                  className="py-1.5 px-3 rounded-lg bg-[#FBF6EE] hover:bg-white text-[11px] text-[#2E1F14] transition-colors flex items-center gap-1 border border-[#D8C3A5] cursor-pointer"
                >
                  {d.copiedAddress ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>
                    {d.copiedAddress
                      ? "Alamat Disalin!"
                      : "Salin Alamat Lengkap"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 8: BUKU TAMU & RSVP — BUKU CATATAN */}
        <section className="py-16 px-6 space-y-10">
          <SectionHeading eyebrow="Guest Book" title="Ucapan & Doa Restu" />

          <div className="max-w-md mx-auto space-y-8">
            <form
              onSubmit={d.rsvp.send}
              className="relative p-6 pt-8 rounded-sm bg-[#FBF6EE] border border-[#D8C3A5] border-l-4 border-l-[#B45309]/50 space-y-5 shadow-lg font-sans"
            >
              <Tape className="-top-2.5 left-1/2 -translate-x-1/2 -rotate-1" />

              <div>
                <label className="text-xs font-semibold text-[#2E1F14]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={d.rsvp.name}
                  onChange={(e) => d.rsvp.setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full mt-1 px-1 py-2 bg-transparent border-0 border-b-2 border-[#D8C3A5] text-xs text-[#2A1B10] placeholder:text-[#B59A78] focus:outline-none focus:border-[#8C6239]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2E1F14]">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["Hadir", "Ragu-ragu", "Tidak Hadir"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => d.rsvp.setStatus(st)}
                      className={`py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        d.rsvp.status === st
                          ? "bg-[#4A6B53] text-[#FAF4EC] font-bold shadow-md"
                          : "bg-[#FAF4EC] border border-[#D8C3A5] text-[#5A3821] hover:bg-[#EADDCF]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {d.rsvp.status !== "Tidak Hadir" && (
                <div>
                  <label className="text-xs font-semibold text-[#2E1F14]">
                    Jumlah Kehadiran (Pax)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["1 Orang", "2 Orang"].map((px) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => d.rsvp.setPax(px)}
                        className={`py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          d.rsvp.pax === px
                            ? "bg-[#8C6239] text-[#FAF4EC] font-bold shadow-md"
                            : "bg-[#FAF4EC] border border-[#D8C3A5] text-[#5A3821] hover:bg-[#EADDCF]"
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#2E1F14]">
                  Untaian Doa Restu
                </label>
                <textarea
                  rows={3}
                  required
                  value={d.rsvp.message}
                  onChange={(e) => d.rsvp.setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                  className="w-full mt-2 px-3 py-0 rounded-md bg-transparent border border-[#D8C3A5] text-xs text-[#2A1B10] placeholder:text-[#B59A78] focus:outline-none focus:border-[#8C6239] resize-none"
                  style={RULED_PAPER}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl border border-[#3E2717] text-[#FAF4EC] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                style={WOOD_PLANK}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Doa Restu</span>
              </button>
            </form>

            {/* List ucapan — sticky notes */}
            <div className="space-y-3 font-sans">
              <span className="text-xs text-[#6D4C2B] uppercase tracking-wider block font-semibold">
                Doa Restu Tamu ({d.rsvp.list.length})
              </span>
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {d.rsvp.list.map((r, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-sm shadow-md space-y-1.5 border-t-4 ${
                      idx % 2 === 0
                        ? "bg-[#FFF3C9] border-[#F0D98A]"
                        : "bg-[#E6EFE1] border-[#B9CFB0]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#5A3821] text-[#F5EEE6] flex items-center justify-center font-bold text-xs">
                          {r.guest_name
                            ? r.guest_name.charAt(0).toUpperCase()
                            : "T"}
                        </div>
                        <span className="font-bold text-[#2A1B10] font-serif-theme">
                          {r.guest_name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          r.attendance_status === "Hadir"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {r.attendance_status}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A3220] leading-relaxed pl-9">
                      {r.message}
                    </p>
                    <p className="text-[10px] text-[#8C6239] pl-9">
                      {formatRsvpDate(r.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: PENUTUP — WAX SEAL */}
        <section className="pt-16 pb-8 px-6 text-center space-y-6 border-t border-[#D8C3A5] bg-[#EADDCF]/40">
          <RusticDivider />

          <p className="text-xs text-[#5A3821] max-w-sm mx-auto leading-relaxed font-sans">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada
            kedua mempelai.
          </p>

          <p className="text-xs font-sans uppercase tracking-wider text-[#8C6239] font-bold">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>

          <div className="pt-2 space-y-3">
            <span className="text-[10px] font-sans text-[#6D4C2B] uppercase tracking-[0.3em] block">
              Kami yang berbahagia,
            </span>
            <WaxSeal className="w-20 h-20">
              <span className="relative text-2xl font-cursive">{initials}</span>
            </WaxSeal>
            <p className="text-4xl font-cursive text-[#2A1B10]">
              {d.groomShort} &amp; {d.brideShort}
            </p>
            <p className="text-xs text-[#5A3821] font-sans">
              Keluarga Besar {d.groomFather} &amp; {d.brideFather}
            </p>
          </div>

          <div className="pt-4">
            <FairyLights />
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
