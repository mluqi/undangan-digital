import { useState, useEffect, useRef, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Send,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Gift,
  CreditCard,
  Trees,
  Leaf,
  QrCode,
  ChevronDown,
  Lock,
} from "lucide-react";
import { MusicVinylPlayer } from "../MusicVinylPlayer";
import { InvitationFloatingControls } from "../InvitationFloatingControls";
import { GalleryLightbox } from "../GalleryLightbox";
import { useScrollMotion, useParallax } from "../useScrollMotion";
import { ScrollProgress } from "../MotionKit";
import { Reveal } from "../Reveal";
import { useInvitationData, formatRsvpDate } from "../useInvitationData";
import { DesktopSidePanel } from "../DesktopSidePanel";

/**
 * ------------------------------------------------------------------
 * ASET BACKGROUND
 * Taruh gambar hutan referensi di folder public (disarankan dikonversi
 * ke .webp / .jpg agar ringan), lalu sesuaikan path-nya di sini.
 * Jika gambar gagal dimuat, gradasi hijau di bawahnya tetap tampil.
 * ------------------------------------------------------------------
 */
const FOREST_BG = "/images/forest-tropical-bg.webp";

/**
 * ------------------------------------------------------------------
 * VIDEO TRANSISI MASUK HUTAN
 * Video diputar saat tombol "Buka Undangan" ditekan (kamera zoom-in
 * ke dalam hutan), lalu cover memudar menuju undangan.
 * - Bisa dioverride lewat prop: <ForestTropicalTheme introVideoUrl="..." />
 * - Isi "" / null untuk menonaktifkan (kembali ke animasi semak saja).
 * - Video dimuat otomatis di latar; jika gagal/belum siap saat tombol
 *   ditekan, tema otomatis memakai animasi semak sebagai cadangan.
 * ------------------------------------------------------------------
 */
const FOREST_INTRO_VIDEO = "/videos/forest-intro.mp4";
const FOREST_INTRO_POSTER = ""; // opsional, mis. "/images/forest-intro-poster.webp"
/**
 * Desktop: selama cover tampil, area sisi kiri (di balik/atas DesktopSidePanel)
 * hanya menampilkan slide foto tanpa teks. Setelah undangan terbuka,
 * DesktopSidePanel normal muncul kembali. Set true agar slide foto
 * dipertahankan di sisi kiri selamanya.
 */
const SIDE_PHOTO_ONLY_ALWAYS = false;
/** Batas aman: jika video macet, cover tetap ditutup setelah sekian ms */
const INTRO_SAFETY_MS = 15000;
/** Mulai memudarkan cover sekian detik sebelum video selesai */
const INTRO_FADE_LEAD_S = 0.9;

/** Palet — tetap sama seperti tema hutan sebelumnya */
const C = {
  night: "#04120B", // bayangan terdalam
  canopy: "#0E3B28", // kanopi gelap
  fern: "#3F9B58", // daun pakis
  meadow: "#A6D854", // padang rumput terkena cahaya
  mist: "#E9F3C9", // kabut / langit di sela pohon
  bark: "#6B4A2B", // batang pohon
  stone: "#D2B48C", // batu
  gold: "#D4AF37", // aksen emas
};

/** Panel kaca gelap — sekarang hanya dipakai untuk elemen kecil/form */
const glass =
  "bg-[#04120B]/55 backdrop-blur-md border border-[#E9F3C9]/15 shadow-[0_10px_40px_rgba(0,0,0,0.45)]";

/** Tombol sekunder (maps, calendar, copy) */
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-[#E9F3C9] bg-[#0E3B28]/70 hover:bg-[#3F9B58]/50 border border-[#A6D854]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A6D854] transition-colors cursor-pointer";

/** Tombol utama (hijau menyala) */
const primaryBtn =
  "group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2F8A48] via-[#7CC04A] to-[#2F8A48] px-6 py-3 text-sm font-bold text-[#04120B] shadow-[0_6px_26px_rgba(166,216,84,0.35)] transition-all hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

/** Latar band tiap section — gelap-hijau transparan di atas backdrop hutan */
const band = {
  dark: "bg-[#04120B]/80",
  mid: "bg-[#0A2A1B]/72",
  moss: "bg-[#0E3B28]/62",
};

/** Input form */
const inputCls =
  "w-full rounded-xl border border-[#A6D854]/25 bg-[#04120B]/70 px-4 py-2.5 text-xs text-white placeholder:text-stone-500 focus:border-[#A6D854] focus:outline-none focus:ring-1 focus:ring-[#A6D854]";

/* =================================================================
 * ORNAMEN SVG
 * ================================================================= */
const MonsteraLeafSVG = ({ className = "", style = {}, color = "#A6D854" }) => (
  <svg
    viewBox="0 0 100 120"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="monsteraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8D27A" />
        <stop offset="35%" stopColor={color} />
        <stop offset="100%" stopColor="#0E3B28" />
      </linearGradient>
    </defs>
    <path
      d="M50 8 C30 18 12 36 10 65 C8 92 26 114 50 118 C74 114 92 92 90 65 C88 36 70 18 50 8 Z"
      fill="url(#monsteraGrad)"
      opacity="0.95"
    />
    {/* Urat daun emas */}
    <path
      d="M50 14 Q51 60 50 112"
      stroke="#F3E5AB"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
    {/* Celah belahan daun monstera alami */}
    <path
      d="M47 38 C36 32 24 35 18 42 C28 47 38 45 46 45 
         M53 38 C64 32 76 35 82 42 C72 47 62 45 54 45 
         M46 62 C32 58 20 66 18 76 C28 76 38 70 47 67 
         M54 62 C68 58 80 66 82 76 C72 76 62 70 53 67 
         M47 84 C36 84 26 92 24 100 C34 98 42 92 48 89 
         M53 84 C64 84 74 92 76 100 C66 98 58 92 52 89"
      stroke="#04120B"
      strokeWidth="3.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const PalmFrondSVG = ({ className = "", style = {} }) => (
  <svg
    viewBox="0 0 120 80"
    fill="none"
    stroke="currentColor"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 70 Q60 50 110 10"
      stroke="#D4AF37"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M40 56 Q30 35 20 30"
      stroke="#52B788"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M55 49 Q50 25 40 18"
      stroke="#52B788"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M70 41 Q70 18 62 10"
      stroke="#74C69D"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M85 31 Q90 12 85 4"
      stroke="#52B788"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M50 53 Q65 42 75 42"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M68 43 Q85 35 95 38"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M82 32 Q100 28 108 32"
      stroke="#52B788"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/** Daun pakis siluet (terisi) — dipakai sebagai semak di tepi section */
const FernSVG = ({ className = "", style = {} }) => {
  const leaflets = Array.from({ length: 11 }, (_, i) => {
    const y = 154 - i * 13;
    const len = 36 - i * 2.8;
    return { y, len };
  });
  return (
    <svg
      viewBox="0 0 100 160"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M49 160 Q51 80 50 6"
        stroke="currentColor"
        strokeWidth="2.2"
        fill="none"
      />
      {leaflets.map(({ y, len }, i) => (
        <g key={i}>
          <path
            d={`M50 ${y} Q${50 - len * 0.5} ${y - 13} ${50 - len} ${y - 9} Q${50 - len * 0.5} ${y - 1} 50 ${y} Z`}
          />
          <path
            d={`M50 ${y} Q${50 + len * 0.5} ${y - 13} ${50 + len} ${y - 9} Q${50 + len * 0.5} ${y - 1} 50 ${y} Z`}
          />
        </g>
      ))}
    </svg>
  );
};

/** Daun pisang tropis rimbun dengan guratan alami */
const BananaLeafSVG = ({ className = "", style = {}, color = "#2D6A4F" }) => (
  <svg
    viewBox="0 0 120 220"
    fill="currentColor"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M60 215 Q58 110 60 8"
      stroke="#D4AF37"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M60 10 C32 30 14 75 16 130 C18 165 38 198 60 215 C82 198 102 165 104 130 C106 75 88 30 60 10 Z"
      fill={color}
    />
    <path
      d="M60 45 Q36 40 24 35 M60 75 Q32 72 18 70 M60 110 Q32 110 20 114 M60 145 Q36 150 26 158 M60 178 Q42 184 34 192"
      stroke="rgba(233,243,201,0.28)"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M60 45 Q84 40 96 35 M60 75 Q88 72 102 70 M60 110 Q88 110 100 114 M60 145 Q84 150 94 158 M60 178 Q78 184 86 192"
      stroke="rgba(233,243,201,0.28)"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

/** Sulur liana rimba menjuntai dari atas kanopi */
const HangingVinesSVG = ({ className = "", style = {} }) => (
  <svg
    viewBox="0 0 400 130"
    fill="none"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M30 0 Q40 50 32 95 Q28 115 35 125"
      stroke="#1B6B43"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M95 0 Q80 40 100 80 Q110 110 102 125"
      stroke="#0E3B28"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M200 0 Q185 30 205 65 Q220 95 205 115"
      stroke="#2F8A48"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M305 0 Q325 45 315 85 Q305 115 320 130"
      stroke="#0E3B28"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M370 0 Q355 35 375 75 Q385 105 380 120"
      stroke="#1B6B43"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <ellipse
      cx="38"
      cy="45"
      rx="8"
      ry="14"
      fill="#52B788"
      transform="rotate(25 38 45)"
    />
    <ellipse
      cx="28"
      cy="85"
      rx="7"
      ry="12"
      fill="#74C69D"
      transform="rotate(-30 28 85)"
    />
    <ellipse
      cx="90"
      cy="35"
      rx="7"
      ry="12"
      fill="#3F9B58"
      transform="rotate(-20 90 35)"
    />
    <ellipse
      cx="106"
      cy="82"
      rx="8"
      ry="13"
      fill="#8CC84B"
      transform="rotate(35 106 82)"
    />
    <ellipse
      cx="196"
      cy="32"
      rx="7"
      ry="12"
      fill="#74C69D"
      transform="rotate(-25 196 32)"
    />
    <ellipse
      cx="212"
      cy="72"
      rx="8"
      ry="14"
      fill="#A6D854"
      transform="rotate(30 212 72)"
    />
    <ellipse
      cx="315"
      cy="40"
      rx="8"
      ry="14"
      fill="#52B788"
      transform="rotate(20 315 40)"
    />
    <ellipse
      cx="308"
      cy="95"
      rx="7"
      ry="12"
      fill="#74C69D"
      transform="rotate(-25 308 95)"
    />
    <ellipse
      cx="365"
      cy="38"
      rx="7"
      ry="12"
      fill="#3F9B58"
      transform="rotate(-15 365 38)"
    />
    <ellipse
      cx="380"
      cy="78"
      rx="8"
      ry="13"
      fill="#8CC84B"
      transform="rotate(30 380 78)"
    />
  </svg>
);

/** Pembungkus ornamen yang bergoyang lembut (rotasi dasar lewat prop `rot`) */
const Sway = ({ className = "", rot = "0deg", delay = "0s", children }) => (
  <span
    className={`ft-sway pointer-events-none absolute block ${className}`}
    style={{ "--r": rot, animationDelay: delay }}
    aria-hidden="true"
  >
    {children}
  </span>
);

/* =================================================================
 * GERBANG COVER (semak tersibak selaras dengan visual video intro)
 * ================================================================= */
/** Pendar cahaya mentari kanopi di tengah atas yang memancar lembut saat gerbang terbuka */
const CanopySunbeam = ({ active }) => (
  <div
    className={`pointer-events-none absolute inset-x-0 top-0 z-15 flex justify-center transition-all duration-[1400ms] ease-out ${
      active ? "scale-125 opacity-90" : "scale-90 opacity-40"
    }`}
    aria-hidden="true"
  >
    <div
      className="h-80 w-80 rounded-full blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(246,247,212,0.35) 0%, rgba(232,240,198,0.18) 40%, transparent 70%)",
      }}
    />
  </div>
);

/** Gerbang semak hutan sisi kiri — lukisan dedaunan selaras video (crop bagian kiri) */
const FoliageGateLeft = ({ isOpening }) => (
  <div
    className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-[55%] overflow-hidden transition-all duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isOpening
        ? "-translate-x-full -rotate-6 scale-105 opacity-0 blur-xs"
        : "translate-x-0 rotate-0 scale-100 opacity-100 ft-bush-sway-left"
    }`}
    aria-hidden="true"
  >
    <img
      src="/images/forest-foliage-left.png"
      onError={(e) => {
        e.currentTarget.src = "/images/forest-foliage-curtain.png";
      }}
      alt=""
      className="h-full w-full object-cover object-right filter contrast-[1.05]"
    />
  </div>
);

/** Gerbang semak hutan sisi kanan — lukisan dedaunan selaras video (crop bagian kanan) */
const FoliageGateRight = ({ isOpening }) => (
  <div
    className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-[55%] overflow-hidden transition-all duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isOpening
        ? "translate-x-full rotate-6 scale-105 opacity-0 blur-xs"
        : "translate-x-0 rotate-0 scale-100 opacity-100 ft-bush-sway-right"
    }`}
    aria-hidden="true"
  >
    <img
      src="/images/forest-foliage-right.png"
      onError={(e) => {
        e.currentTarget.src = "/images/forest-foliage-curtain.png";
      }}
      alt=""
      className="h-full w-full object-cover object-left filter contrast-[1.05]"
    />
  </div>
);

/* =================================================================
 * ORNAMEN SECTION
 * ================================================================= */
/** Sulur & semak tepi dinonaktifkan agar tidak memotong section secara kaku */
const CanopyEdge = () => null;
const FoliageEdge = () => null;

/** Rumpun dedaunan lukisan di tepi kiri/kanan section (ornamen samping hidup) */
const SideLeaves = () => (
  <>
    <Sway
      className="-left-12 top-6 h-48 w-36 opacity-85 pointer-events-none"
      rot="6deg"
    >
      <img
        src="/images/forest-botanical-cluster.png"
        alt=""
        className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
      />
    </Sway>
    <Sway
      className="-right-12 top-6 h-48 w-36 opacity-85 pointer-events-none"
      rot="-6deg"
      delay="1.2s"
    >
      <img
        src="/images/forest-botanical-cluster.png"
        alt=""
        className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] [transform:scaleX(-1)]"
      />
    </Sway>
  </>
);

/** Pembatas daun */
const LeafDivider = () => (
  <div className="flex items-center justify-center gap-3" aria-hidden="true">
    <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
    <MonsteraLeafSVG className="h-5 w-5 text-[#D4AF37]" />
    <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
  </div>
);

/** Judul section — rata tengah */
const SectionTitle = ({ title, desc }) => (
  <Reveal className="mb-9 text-center">
    <h2 className="font-serif-theme text-[2rem] font-bold leading-tight text-[#F4F9E4] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
      {title}
    </h2>
    <div className="mt-3">
      <LeafDivider />
    </div>
    {desc && (
      <p className="mx-auto mt-3 max-w-[19rem] text-[13px] leading-relaxed text-[#CFE3C2]">
        {desc}
      </p>
    )}
  </Reveal>
);

/** Foto berbentuk jendela lengkung dengan bingkai emas–hijau */
const ArchPhoto = ({
  src,
  alt,
  className = "",
  ringFrom = C.gold,
  ringTo = C.fern,
}) => (
  <div
    className={`rounded-t-[999px] rounded-b-[2rem] p-[3px] shadow-[0_14px_40px_rgba(0,0,0,0.55)] ${className}`}
    style={{
      background: `linear-gradient(160deg, ${ringFrom}, ${ringTo} 60%, ${C.canopy})`,
    }}
  >
    <div className="h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[calc(2rem-3px)] bg-[#04120B]">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  </div>
);

/** Bingkai foto & ornamen dedaunan khusus Mempelai Pria */
const GroomBotanicalFrame = ({
  src,
  alt,
  ringFrom = C.gold,
  ringTo = C.fern,
}) => (
  <div className="relative mx-auto h-72 w-52">
    {/* Rumpun daun di BELAKANG bingkai foto (z-0), mengintip dari sisi kiri bawah */}
    <Sway
      className="pointer-events-none absolute -bottom-6 -left-16 z-0 h-48 w-44 opacity-90"
      rot="-6deg"
    >
      <img
        src="/images/forest-botanical-cluster.png"
        alt=""
        className="h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.85)] filter contrast-[1.08]"
      />
    </Sway>

    {/* Foto Mempelai (z-10 di depan daun, bersih tanpa tertutupi) */}
    <ArchPhoto
      src={src}
      alt={alt}
      className="h-full w-full relative z-10"
      ringFrom={ringFrom}
      ringTo={ringTo}
    />
  </div>
);

/** Bingkai foto & ornamen dedaunan khusus Mempelai Wanita (posisi diatur sendiri) */
const BrideBotanicalFrame = ({
  src,
  alt,
  ringFrom = C.fern,
  ringTo = C.gold,
}) => (
  <div className="relative mx-auto h-72 w-52">
    {/* Rumpun daun di BELAKANG bingkai foto (z-0), mengintip dari sisi kanan bawah */}
    <Sway
      className="pointer-events-none absolute -bottom-6 -right-16 z-0 h-48 w-44 opacity-90"
      rot="6deg"
    >
      <img
        src="/images/forest-botanical-cluster.png"
        alt=""
        className="h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.85)] filter contrast-[1.08] [transform:scaleX(-1)]"
      />
    </Sway>

    {/* Foto Mempelai (z-10 di depan daun, bersih tanpa tertutupi) */}
    <ArchPhoto
      src={src}
      alt={alt}
      className="h-full w-full relative z-10"
      ringFrom={ringFrom}
      ringTo={ringTo}
    />
  </div>
);

/** Kompatibilitas BotanicalFrame */
const BotanicalFrame = ({ src, alt, flip = false, ringFrom, ringTo }) =>
  flip ? (
    <BrideBotanicalFrame
      src={src}
      alt={alt}
      ringFrom={ringFrom}
      ringTo={ringTo}
    />
  ) : (
    <GroomBotanicalFrame
      src={src}
      alt={alt}
      ringFrom={ringFrom}
      ringTo={ringTo}
    />
  );

/* =================================================================
 * PARTIKEL
 * ================================================================= */
/** Kunang-kunang hutan */
const ForestFireflies = () => {
  const fireflies = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${((i * 19) % 94) + 3}%`,
      top: `${((i * 23) % 90) + 5}%`,
      size: 3 + (i % 4) * 1.5,
      delay: `${(i * 0.7) % 5}s`,
      duration: `${5 + (i % 4) * 2}s`,
      color: i % 2 === 0 ? "#E8D27A" : "#B7E36B",
    }));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      {fireflies.map((f) => (
        <span
          key={f.id}
          className="animate-firefly absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: `${f.size}px`,
            height: `${f.size}px`,
            backgroundColor: f.color,
            boxShadow: `0 0 ${f.size * 3}px ${f.color}`,
            animationDelay: f.delay,
            animationDuration: f.duration,
          }}
        />
      ))}
    </div>
  );
};

/** Daun yang jatuh melayang */
const FallingLeaves = ({ count = 10 }) => {
  const leaves = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${((i * 29) % 90) + 5}%`,
      size: 14 + (i % 3) * 6,
      delay: `${i * 1.6}s`,
      duration: `${11 + (i % 4) * 3}s`,
      opacity: 0.4 + (i % 3) * 0.2,
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      {leaves.map((l) => (
        <div
          key={l.id}
          className="animate-leaf-fall absolute"
          style={{
            left: l.left,
            width: `${l.size}px`,
            height: `${l.size}px`,
            opacity: l.opacity,
            animationDelay: l.delay,
            animationDuration: l.duration,
          }}
        >
          <MonsteraLeafSVG
            className="h-full w-full drop-shadow-md"
            color="#8FD3A6"
          />
        </div>
      ))}
    </div>
  );
};

/** Desktop: slide foto polos di sisi kiri (tanpa teks), menutupi DesktopSidePanel */
const DesktopPhotoSlides = ({ photos, current, hidden }) => (
  <div
    className={`pointer-events-none fixed inset-y-0 left-0 right-0 z-40 hidden overflow-hidden bg-[#04120B] transition-opacity duration-700 ease-out lg:right-[480px] lg:block xl:right-[520px] ${
      hidden ? "opacity-0" : "opacity-100"
    }`}
    aria-hidden="true"
  >
    {photos.map((src, idx) => {
      const isActive = idx === current;
      return (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt=""
            className={`h-full w-full object-cover object-[center_30%] transition-transform duration-[7500ms] ease-out ${
              isActive ? "scale-[1.08]" : "scale-100"
            }`}
          />
        </div>
      );
    })}
    <div className="absolute inset-0 bg-gradient-to-b from-[#04120B]/35 via-transparent to-[#04120B]/55" />
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(4,18,11,0) 55%, rgba(4,18,11,0.55) 100%)",
      }}
    />
  </div>
);

/** Lapisan background hutan (menempel di layar, konten bergulir di atasnya) */
const ForestBackdrop = () => (
  <div
    className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-lg md:left-0 md:translate-x-0 md:w-full md:max-w-none lg:left-auto lg:right-0 lg:w-[480px] xl:w-[520px] lg:translate-x-0 z-0 overflow-hidden"
    aria-hidden="true"
  >
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${FOREST_BG}), radial-gradient(ellipse at 50% 12%, ${C.mist} 0%, rgba(233,243,201,0) 38%), linear-gradient(180deg, #0E3B28 0%, #145232 45%, #2F8A48 78%, #8CC84B 100%)`,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#04120B]/60 via-[#04120B]/40 to-[#04120B]/75" />
    <div
      className="ft-mist absolute -left-16 top-1/3 h-64 w-[30rem] rounded-full blur-3xl opacity-30"
      style={{ background: "rgba(233,243,201,0.2)" }}
    />
    <div
      className="ft-mist-slow absolute -right-20 top-2/3 h-72 w-[32rem] rounded-full blur-3xl opacity-25"
      style={{ background: "rgba(166,216,84,0.18)" }}
    />
  </div>
);

/* =================================================================
 * BLOK ACARA (dipakai Akad & Resepsi — field data sama persis)
 * Datar & rata tengah, tanpa kartu kaca.
 * ================================================================= */
const EventBlock = ({ title, icon: Icon, event }) => (
  <div className="relative mx-auto max-w-xs text-center">
    <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/55 bg-[#0E3B28]/70 shadow-[0_0_24px_rgba(166,216,84,0.18)]">
      <Icon className="h-6 w-6 text-[#E8D27A]" />
    </span>
    <h3 className="font-serif-theme text-2xl font-bold text-[#F4F9E4]">
      {title}
    </h3>

    <div className="mt-5 space-y-2 text-[13px] text-[#E2EFD2]">
      <p className="flex items-center justify-center gap-2">
        <Calendar className="h-4 w-4 shrink-0 text-[#A6D854]" />
        <span>{event.tanggal}</span>
      </p>
      <p className="flex items-center justify-center gap-2">
        <Clock className="h-4 w-4 shrink-0 text-[#A6D854]" />
        <span>{event.waktu}</span>
      </p>
      <div className="pt-2">
        <MapPin className="mx-auto mb-1 h-4 w-4 text-[#A6D854]" />
        <strong className="block text-sm font-semibold text-white">
          {event.lokasi}
        </strong>
        <p className="mx-auto mt-1 text-xs leading-relaxed text-[#B9D2B0]">
          {event.alamat}
        </p>
      </div>
    </div>

    {event.mapUrl && (
      <a
        href={event.mapUrl}
        target="_blank"
        rel="noreferrer"
        className={`${ghostBtn} mt-6`}
      >
        <MapPin className="h-3.5 w-3.5 text-[#E8D27A]" />
        <span>Buka Google Maps</span>
        <ExternalLink className="h-3 w-3 opacity-70" />
      </a>
    )}
  </div>
);

/* =================================================================
 * TEMA: FOREST TROPICAL
 * Tata letak editorial rata tengah: cover → hero → ayat → mempelai
 * (foto berbingkai dedaunan) → Save The Date (countdown + acara) →
 * kisah → galeri → amplop (toggle) → ucapan (berpaginasi) → penutup.
 * ================================================================= */
export const ForestTropicalTheme = (props) => {
  const d = useInvitationData(props);
  const motionRef = useRef(null);
  useScrollMotion(motionRef, d.isOpened);
  useParallax(motionRef, d.isOpened);

  const [isOpeningTransition, setIsOpeningTransition] = useState(false);
  const [isCoverDismissed, setIsCoverDismissed] = useState(false);
  const [coverExited, setCoverExited] = useState(false);

  // Koleksi foto untuk slide hero & cover
  const heroPhotos = useMemo(() => {
    const list = [];
    if (d.photoCover) list.push(d.photoCover);
    if (Array.isArray(d.gallery) && d.gallery.length > 0) {
      d.gallery.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (d.photoGroom && !list.includes(d.photoGroom)) list.push(d.photoGroom);
    if (d.photoBride && !list.includes(d.photoBride)) list.push(d.photoBride);

    if (list.length === 0) {
      list.push(
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80",
      );
    }
    return list;
  }, [d.photoCover, d.gallery, d.photoGroom, d.photoBride]);

  // Auto-slide foto
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    if (!heroPhotos || heroPhotos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroPhotos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroPhotos]);

  // Ucapan RSVP: statistik
  const wishes = Array.isArray(d.rsvp?.list) ? d.rsvp.list : [];
  const hadirCount = wishes.filter(
    (r) => r.attendance_status === "Hadir",
  ).length;
  const tidakHadirCount = wishes.filter(
    (r) => r.attendance_status === "Tidak Hadir",
  ).length;

  /* ------------------------------------------------------------ */
  /* Video intro                                                   */
  /* ------------------------------------------------------------ */
  const introSrc =
    props?.introVideoUrl !== undefined
      ? props.introVideoUrl
      : FOREST_INTRO_VIDEO;
  const videoRef = useRef(null);
  const introDoneRef = useRef(false);
  const timersRef = useRef([]);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  /** Tutup cover (dipanggil sekali saja) */
  const finishIntro = () => {
    if (introDoneRef.current) return;
    introDoneRef.current = true;
    setIsCoverDismissed(true);
    later(() => setCoverExited(true), 750);
  };

  /** Cadangan tanpa video: hanya animasi semak tersibak */
  const runBushFallback = () => {
    later(() => setIsCoverDismissed(true), 1060);
    later(() => {
      introDoneRef.current = true;
      setCoverExited(true);
    }, 1500);
  };

  const handleStartOpen = () => {
    if (isOpeningTransition) return;
    setIsOpeningTransition(true);

    // Buka undangan & putar musik (harus dalam gesture klik agar tidak diblokir browser)
    d.openInvitation();

    const video = videoRef.current;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const canUseVideo = !!introSrc && !videoFailed && !reduceMotion && video;

    if (!canUseVideo) {
      runBushFallback();
      return;
    }

    try {
      video.currentTime = 0;
    } catch (_) {
      /* abaikan */
    }
    setIsIntroPlaying(true);
    const playing = video.play();
    if (playing && typeof playing.catch === "function") {
      playing.catch(() => {
        setVideoFailed(true);
        setIsIntroPlaying(false);
        runBushFallback();
      });
    }
    // pengaman bila video macet / tidak pernah selesai
    later(finishIntro, INTRO_SAFETY_MS);
  };

  const handleVideoTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (!isIntroPlaying || !v.duration || Number.isNaN(v.duration)) return;
    if (v.duration - v.currentTime <= INTRO_FADE_LEAD_S) finishIntro();
  };

  const showCover = !coverExited && (!d.isOpened || isOpeningTransition);
  const showSidePhotos =
    !props?.isModalView && (SIDE_PHOTO_ONLY_ALWAYS || showCover);

  const closingPhoto = d.photoCover || heroPhotos[0];

  return (
    <div
      ref={motionRef}
      className={`bg-forest-tropical relative ${
        d.isOpened
          ? "min-h-screen"
          : "h-screen max-h-screen overflow-hidden"
      } w-full max-w-lg md:max-w-none md:w-full lg:max-w-none lg:w-[480px] xl:w-[520px] lg:ml-auto lg:mr-0 border-x border-[#0E3B28]/60 bg-[#04120B] font-sans text-[#EAF4DA] shadow-2xl selection:bg-[#A6D854] selection:text-black scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop (selalu aktif di layar desktop) */}
      <DesktopSidePanel
        theme="forest"
        invitationData={d}
        isOpened={d.isOpened}
        alwaysVisible={true}
        isModalView={props?.isModalView}
      />

      {/* animasi lokal (menghormati prefers-reduced-motion) */}
      <style>{`
        @keyframes ft-drift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(46px); } }
        @keyframes ft-sway { 0%,100% { transform: rotate(var(--r, 0deg)); } 50% { transform: rotate(calc(var(--r, 0deg) + 3deg)); } }
        @keyframes ft-bush-sway-left {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(-5px, -3px, 0) rotate(-1.5deg); }
        }
        @keyframes ft-bush-sway-right {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(5px, -3px, 0) rotate(1.5deg); }
        }
        .ft-mist { animation: ft-drift 18s ease-in-out infinite; }
        .ft-mist-slow { animation: ft-drift 28s ease-in-out infinite reverse; }
        .ft-sway { transform-origin: 50% 100%; transform: rotate(var(--r, 0deg)); animation: ft-sway 7s ease-in-out infinite; }
        .ft-bush-sway-left { transform-origin: 0% 100%; animation: ft-bush-sway-left 7s ease-in-out infinite; }
        .ft-bush-sway-right { transform-origin: 100% 100%; animation: ft-bush-sway-right 7.5s ease-in-out infinite; }
        .ft-wishes-scroll::-webkit-scrollbar { width: 4px; }
        .ft-wishes-scroll::-webkit-scrollbar-track { background: rgba(4, 18, 11, 0.4); border-radius: 9999px; }
        .ft-wishes-scroll::-webkit-scrollbar-thumb { background: rgba(166, 216, 84, 0.35); border-radius: 9999px; }
        .ft-wishes-scroll::-webkit-scrollbar-thumb:hover { background: rgba(166, 216, 84, 0.6); }
        @media (prefers-reduced-motion: reduce) {
          .ft-mist, .ft-mist-slow, .ft-sway, .ft-bush-sway-left, .ft-bush-sway-right { animation: none; }
        }
      `}</style>

      {/* Background hutan */}
      <ForestBackdrop />

      {/* Efek scroll progress */}
      <ScrollProgress color="#A6D854" active={d.isOpened} />

      {/* Kunang-kunang & daun melayang */}
      {d.isOpened && (
        <>
          <ForestFireflies />
          <FallingLeaves count={8} />
        </>
      )}

      {/* Pemutar musik */}
      {d.isOpened && (
        <MusicVinylPlayer
          musicUrl={d.musicUrl}
          musicTitle={d.musicTitle}
          isPlaying={d.isPlayingMusic}
          onToggle={d.toggleMusic}
          position="bottom-right"
          theme="forest"
          accentColor="#A6D854"
        />
      )}

      {/* Floating controls */}
      <InvitationFloatingControls
        qrValue={d.qrValue}
        guestName={d.guestName}
        guestCategory={d.guestCategory}
        guestPax={d.guestPax}
        isOpened={d.isOpened}
        showQr={d.showQr}
        showQrFloater={false}
        theme="forest"
        accentColor="#A6D854"
        isOpen={isQrModalOpen}
        onOpenChange={setIsQrModalOpen}
      />

      {/* ============================================================ */}
      {/* COVER: video transisi hutan sebagai background utama          */}
      {/* ============================================================ */}
      {showCover && (
        <div
          className={`fixed inset-y-0 left-1/2 z-50 flex w-full max-w-lg -translate-x-1/2 items-stretch justify-center overflow-hidden bg-[#04120B] transition-opacity duration-700 ease-out md:left-0 md:w-full md:max-w-none md:translate-x-0 lg:left-auto lg:right-0 lg:w-[480px] lg:translate-x-0 xl:w-[520px] ${
            isCoverDismissed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Latar Belakang Cover: Video Transisi Hutan (atau Foto Fallback) */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#04120B]">
            {introSrc && !videoFailed ? (
              <video
                ref={videoRef}
                src={`${introSrc}#t=0.001`}
                poster={FOREST_INTRO_POSTER || undefined}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                onLoadedMetadata={(e) => {
                  try {
                    e.currentTarget.currentTime = 0.001;
                  } catch (_) {}
                }}
                onError={() => setVideoFailed(true)}
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={finishIntro}
                className="h-full w-full object-cover"
                aria-hidden="true"
              />
            ) : (
              /* Fallback foto prewedding bila video tidak tersedia */
              heroPhotos.map((src, idx) => {
                const isActive = idx === currentHeroSlide;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Cover Prewedding ${idx + 1}`}
                      className="h-full w-full object-cover object-[center_30%]"
                    />
                  </div>
                );
              })
            )}

            {/* Peredam gelap lembut agar teks cover terbaca jelas, memudar saat video berputar */}
            <div
              className={`absolute inset-0 z-10 bg-gradient-to-b from-[#04120B]/80 via-[#04120B]/25 to-[#04120B]/90 transition-opacity duration-700 pointer-events-none ${
                isOpeningTransition ? "opacity-10" : "opacity-100"
              }`}
              aria-hidden="true"
            />
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-96 z-10 transition-opacity duration-700 ${
                isOpeningTransition ? "opacity-0" : "opacity-75"
              }`}
              style={{
                background:
                  "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(20,82,50,0.5) 0%, rgba(14,59,40,0.25) 50%, transparent 85%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Tombol lewati video jika tamu ingin langsung ke konten */}
          {isIntroPlaying && !isCoverDismissed && (
            <button
              type="button"
              onClick={finishIntro}
              className="absolute bottom-6 right-5 z-40 cursor-pointer rounded-full border border-[#E9F3C9]/30 bg-[#04120B]/55 px-4 py-2 text-[11px] font-semibold text-[#E9F3C9] backdrop-blur-md transition-colors hover:bg-[#0E3B28]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A6D854]"
            >
              Lewati
            </button>
          )}

          {/* Kabut lembut */}
          <div
            className={`ft-mist absolute -left-10 top-1/4 z-10 h-52 w-96 rounded-full bg-[#E9F3C9]/15 blur-3xl pointer-events-none transition-opacity duration-700 ${
              isOpeningTransition ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden="true"
          />

          {/* Pendar cahaya mentari kanopi */}
          <CanopySunbeam active={isOpeningTransition} />

          {/* Gerbang semak selaras lukisan video yang menyibak halus */}
          <FoliageGateLeft isOpening={isOpeningTransition} />
          <FoliageGateRight isOpening={isOpeningTransition} />

          {/* Isi cover */}
          <div
            className={`relative z-30 flex w-full max-w-sm sm:max-w-md flex-col items-center justify-between px-6 pb-10 pt-16 text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpeningTransition
                ? "opacity-0 translate-y-12 scale-90 pointer-events-none"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {/* atas: judul */}
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#04120B]/60 backdrop-blur-sm shadow-[0_0_25px_rgba(183,227,107,0.25)]">
                <Trees className="h-7 w-7 text-[#B7E36B]" />
              </div>
              <p className="mb-2 text-xs font-medium tracking-[0.25em] text-[#E8D27A]">
                The Wedding of
              </p>
              <h2 className="font-serif-theme text-[2.8rem] font-bold leading-[1.1] text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.7)]">
                {d.groomShort}
                <span className="font-cursive mx-2 text-[#E8D27A]">&</span>
                {d.brideShort}
              </h2>
            </div>

            {/* bawah: tamu + tombol */}
            <div className="flex w-full flex-col items-center">
              <p className="text-[11px] text-[#CFE3C2]">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <h3 className="mt-1 text-xl font-bold tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {d.guestName}
              </h3>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                    d.isVip
                      ? "border-[#D4AF37]/50 bg-[#D4AF37]/20 text-[#F3E5AB]"
                      : "border-[#A6D854]/30 bg-[#2D6A4F]/40 text-[#E2F5D5]"
                  }`}
                >
                  {d.guestCategory} Guest
                </span>
                <span className="text-[10px] text-[#CFE3C2]">
                  Reservasi {d.guestPax} Pax
                </span>
              </div>

              <div className="relative mt-6 w-full max-w-xs">
                <div
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#2F8A48] via-[#A6D854] to-[#2F8A48] opacity-60 blur-md animate-pulse pointer-events-none"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={handleStartOpen}
                  disabled={isOpeningTransition}
                  className={`${primaryBtn} w-full py-3.5 disabled:opacity-80`}
                >
                  <Leaf className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  <span>Buka Undangan</span>
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-[10px] italic text-[#B9D2B0]">
                Sentuh tombol di atas untuk membuka undangan & memutar alunan
                musik
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* KONTEN UTAMA                                                  */}
      {/* ============================================================ */}
      <div
        className={`relative z-[1] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          d.isOpened
            ? "opacity-100 translate-y-0 scale-100 filter-none"
            : "opacity-0 translate-y-10 scale-[0.98] blur-[2px] pointer-events-none"
        }`}
      >
        {/* ============================================================ */}
        {/* HERO: foto penuh, nama di tengah, tanggal + Save The Date     */}
        {/* ============================================================ */}
        <section className="relative z-[1] flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden pb-24 pt-12 text-center">
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#04120B]">
            {heroPhotos.map((src, idx) => {
              const isActive = idx === currentHeroSlide;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 transform-gpu transition-opacity duration-1000 ease-in-out ${
                    isActive
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                  style={{
                    willChange: "opacity",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src={src}
                    alt={`Prewedding ${idx + 1}`}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={`h-full w-full object-cover object-[center_20%] transform-gpu transition-transform duration-[7000ms] ease-out ${
                      isActive ? "scale-[1.05]" : "scale-100"
                    }`}
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  />
                </div>
              );
            })}

            {/* Filter gradien overlay murni satu lapis (tanpa backdrop-blur) — 60fps bebas flicker di mobile & desktop */}
            <div
              className="pointer-events-none absolute inset-0 z-20 transform-gpu"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4,18,11,0.85) 0%, rgba(4,18,11,0.3) 20%, rgba(4,18,11,0.12) 40%, rgba(10,42,27,0.65) 68%, rgba(4,18,11,0.92) 88%, #04120B 100%)",
              }}
              aria-hidden="true"
            />
            {/* Sinar mentari kanopi */}
            <div
              className="pointer-events-none absolute inset-0 z-20 opacity-35 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(circle at 75% 18%, rgba(254,240,138,0.35) 0%, rgba(166,216,84,0.1) 35%, transparent 65%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Konten hero */}
          <div className="relative z-30 flex flex-1 flex-col justify-between px-6">
            {/* indikator slide */}
            <div className="pt-2">
              {heroPhotos.length > 1 && (
                <div className="flex items-center justify-center gap-1.5">
                  {heroPhotos.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentHeroSlide(dotIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        dotIdx === currentHeroSlide
                          ? "w-7 bg-gradient-to-r from-[#B7E36B] to-[#E8D27A] shadow-[0_0_10px_rgba(232,210,122,0.9)]"
                          : "w-2 bg-white/35 hover:bg-white/70"
                      }`}
                      aria-label={`Slide foto ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* nama + tanggal + CTA, ditaruh di bawah seperti referensi */}
            <div className="mt-auto pt-24">
              <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-[#E8D27A] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                The Wedding of
              </p>
              <h1 className="font-serif-theme text-[3.2rem] sm:text-[4rem] font-bold leading-[1.05] text-[#F7FBE9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                {d.groomShort}
                <span className="font-cursive mx-2 text-[3.5rem] sm:text-[4.2rem] text-[#E8D27A] drop-shadow-[0_2px_14px_rgba(232,210,122,0.6)]">
                  &
                </span>
                {d.brideShort}
              </h1>

              <div
                className="mt-4 flex items-center justify-center gap-3"
                aria-hidden="true"
              >
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8D27A]/70" />
                <Leaf className="h-4 w-4 text-[#E8D27A]" />
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8D27A]/70" />
              </div>

              <p className="mt-4 text-[13px] font-medium tracking-wide text-[#E2EFD2] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {d.akad.tanggal}
                <br />
                <span className="text-xs font-normal text-[#B9D2B0]">
                  {d.akad.lokasi}
                </span>
              </p>

              {/* Tombol QR Code Check-in */}
              {d.showQr && (
                <div className="mt-6 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(true)}
                    className={primaryBtn}
                  >
                    <QrCode className="h-4 w-4" />
                    <span>QR Code Check-in</span>
                  </button>
                </div>
              )}

              <ChevronDown
                className="mx-auto mt-5 h-5 w-5 animate-bounce text-[#E8D27A]/80"
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* AYAT                                                          */}
        {/* ============================================================ */}
        <section
          className={`relative z-[1] overflow-hidden px-8 pb-20 pt-14 text-center ${band.dark}`}
        >
          <SideLeaves />

          <Reveal delay={100}>
            <div className="relative mx-auto max-w-sm">
              <div
                className="mx-auto mb-5 flex items-center justify-center gap-2.5"
                aria-hidden="true"
              >
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#E8D27A]/60" />
                <MonsteraLeafSVG className="h-8 w-8 text-[#E8D27A] drop-shadow-[0_2px_8px_rgba(232,210,122,0.5)]" />
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#E8D27A]/60" />
              </div>

              <p className="font-serif text-[14px] sm:text-[15px] italic leading-[1.95] text-[#F0F8E0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar
                kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan
                di antaramu rasa kasih dan sayang.&rdquo;
              </p>

              <p className="mt-6 text-xs sm:text-sm font-semibold tracking-wide text-[#E8D27A]">
                {d.ayatQuote}
              </p>
            </div>
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/* MEMPELAI                                                      */}
        {/* ============================================================ */}
        <section
          className={`relative z-[1] overflow-hidden px-6 pb-20 pt-24 ${band.mid}`}
        >
          <CanopyEdge />
          <SectionTitle
            title="Bride & Groom"
            desc="Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud melangsungkan pernikahan suci:"
          />

          <div className="mx-auto grid max-w-md grid-cols-1 gap-12 md:max-w-4xl md:grid-cols-2 lg:max-w-md lg:grid-cols-1">
            {/* Pria */}
            <Reveal delay={100}>
              <div className="text-center">
                <GroomBotanicalFrame src={d.photoGroom} alt={d.groom} />
                <p className="mt-8 text-xs font-medium text-[#A6D854]">
                  Mempelai Pria
                </p>
                <h3 className="font-serif-theme mt-1 text-2xl font-bold leading-snug text-white">
                  {d.groom}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#CFE3C2]">
                  Putra tercinta dari
                  <br />
                  <strong className="font-semibold text-white">
                    {d.groomFather}
                  </strong>
                  <br />&{" "}
                  <strong className="font-semibold text-white">
                    {d.groomMother}
                  </strong>
                </p>
              </div>
            </Reveal>

            {/* Wanita */}
            <Reveal delay={200}>
              <div className="text-center">
                <BrideBotanicalFrame
                  src={d.photoBride}
                  alt={d.bride}
                  ringFrom={C.fern}
                  ringTo={C.gold}
                />
                <p className="mt-8 text-xs font-medium text-[#A6D854]">
                  Mempelai Wanita
                </p>
                <h3 className="font-serif-theme mt-1 text-2xl font-bold leading-snug text-white">
                  {d.bride}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#CFE3C2]">
                  Putri tercinta dari
                  <br />
                  <strong className="font-semibold text-white">
                    {d.brideFather}
                  </strong>
                  <br />&{" "}
                  <strong className="font-semibold text-white">
                    {d.brideMother}
                  </strong>
                </p>
              </div>
            </Reveal>
          </div>

          <FoliageEdge />
        </section>

        {/* ============================================================ */}
        {/* SAVE THE DATE: countdown + Akad & Resepsi                      */}
        {/* ============================================================ */}
        <section
          id="save-the-date"
          className={`relative z-[1] overflow-hidden px-6 pb-20 pt-24 ${band.dark}`}
        >
          <CanopyEdge />
          <SectionTitle title="Save The Date" />

          <Reveal delay={80}>
            <div className="mx-auto max-w-sm">
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { val: d.timeLeft.days, label: "Hari" },
                  { val: d.timeLeft.hours, label: "Jam" },
                  { val: d.timeLeft.minutes, label: "Menit" },
                  { val: d.timeLeft.seconds, label: "Detik" },
                ].map((t, idx) => (
                  <div
                    key={idx}
                    className="flex aspect-square flex-col items-center justify-center rounded-full border border-[#E8D27A]/45 bg-[#0E3B28]/60 shadow-[0_0_22px_rgba(166,216,84,0.12)]"
                  >
                    <span className="font-serif-theme text-xl sm:text-2xl font-bold tabular-nums text-white">
                      {String(t.val).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-[#B9D2B0]">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mx-auto mt-6 max-w-[18rem] text-[13px] italic leading-relaxed text-[#CFE3C2]">
                Dan kami bersyukur, dipertemukan Allah di waktu terbaik. Kini
                kami menanti hari istimewa kami.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={d.googleCalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={ghostBtn}
                >
                  <Calendar className="h-3.5 w-3.5 text-[#E8D27A]" />
                  <span>Google Calendar</span>
                </a>
                {d.showQr && (
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(true)}
                    className={`${ghostBtn} cursor-pointer`}
                  >
                    <QrCode className="h-3.5 w-3.5 text-[#A6D854]" />
                    <span>QR Code Tamu</span>
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-md grid-cols-1 gap-12 md:max-w-3xl md:grid-cols-2 lg:max-w-md lg:grid-cols-1">
            <Reveal delay={100}>
              <EventBlock title="Akad Nikah" icon={Calendar} event={d.akad} />
            </Reveal>
            <Reveal delay={200}>
              <EventBlock
                title="Resepsi Pernikahan"
                icon={Clock}
                event={d.resepsi}
              />
            </Reveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* KISAH CINTA                                                   */}
        {/* ============================================================ */}
        {d.loveStories && d.loveStories.length > 0 && (
          <section
            className={`relative z-[1] overflow-hidden px-6 pb-20 pt-24 ${band.moss}`}
          >
            <CanopyEdge />
            <SectionTitle
              title="Love Story"
              desc="Setiap langkah menuju satu tujuan yang sama."
            />

            <div className="mx-auto flex max-w-md flex-col items-center md:max-w-xl">
              {d.loveStories.map((story, idx) => (
                <Reveal key={idx} delay={idx * 120} className="w-full">
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#E8D27A] bg-[#04120B] text-[#E8D27A] shadow-[0_0_18px_rgba(232,210,122,0.3)]">
                      <Leaf className="h-4 w-4" />
                    </span>
                    <span className="font-serif-theme mt-3 text-xl font-bold text-[#E8D27A]">
                      {story.tahun}
                    </span>
                    <h4 className="mt-1 text-base font-bold text-white">
                      {story.judul}
                    </h4>
                    <p className="mt-2 max-w-sm text-[13px] leading-[1.85] text-[#CFE3C2]">
                      {story.cerita}
                    </p>
                    {idx < d.loveStories.length - 1 && (
                      <span
                        className="my-6 h-12 w-px bg-gradient-to-b from-[#E8D27A]/70 via-[#7CC04A]/40 to-transparent"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* GALERI                                                        */}
        {/* ============================================================ */}
        {d.gallery && d.gallery.length > 0 && (
          <section
            className={`relative z-[1] overflow-hidden px-6 pb-20 pt-24 ${band.dark}`}
          >
            <CanopyEdge />
            <SectionTitle title="Galeri Foto" />

            <div className="mx-auto grid max-w-md grid-cols-2 gap-3 md:max-w-4xl md:grid-cols-4 lg:max-w-md lg:grid-cols-2">
              {d.gallery.map((photoUrl, idx) => (
                <Reveal key={idx} delay={(idx % 2) * 120}>
                  <button
                    type="button"
                    onClick={() => d.openLightbox(idx)}
                    aria-label={`Buka foto ${idx + 1}`}
                    className={`group relative w-full cursor-pointer overflow-hidden border border-[#E9F3C9]/20 shadow-[0_8px_24px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A6D854] ${
                      idx % 5 === 0
                        ? "col-span-2 h-56 rounded-[2rem]"
                        : idx % 5 === 1
                          ? "h-44 rounded-t-[999px] rounded-b-2xl"
                          : idx % 5 === 2
                            ? "h-44 rounded-2xl rounded-tr-[3rem]"
                            : "h-40 rounded-2xl"
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Galeri ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#04120B]/50 to-transparent" />
                  </button>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* AMPLOP DIGITAL & KADO (Ditampilkan Langsung)                  */}
        {/* ============================================================ */}
        <section
          className={`relative z-[1] overflow-hidden px-6 pb-20 pt-24 ${band.mid}`}
        >
          <CanopyEdge />
          <SectionTitle
            title="Amplop Digital"
            desc="Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless."
          />

          <Reveal delay={100}>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-4 md:max-w-4xl md:grid-cols-2 lg:max-w-md lg:grid-cols-1">
              {d.bankAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-[1.75rem] border border-[#A6D854]/30 bg-gradient-to-br from-[#0F4A30]/85 via-[#0A3322]/85 to-[#04120B]/90 p-5 text-left shadow-[0_10px_34px_rgba(0,0,0,0.5)] backdrop-blur-md"
                >
                  <MonsteraLeafSVG className="pointer-events-none absolute -bottom-8 -right-6 h-32 w-32 text-[#A6D854]/15" />

                  <div className="relative mb-5 flex items-center justify-between">
                    <span className="text-sm font-bold tracking-wide text-[#E8D27A]">
                      {acc.bank}
                    </span>
                    <CreditCard className="h-5 w-5 text-[#A6D854]" />
                  </div>

                  <div className="relative font-mono text-lg font-bold tracking-widest text-white">
                    {acc.nomor}
                  </div>
                  <div className="relative mb-4 mt-1 text-xs text-[#CFE3C2]">
                    a.n. {acc.nama}
                  </div>

                  <button
                    type="button"
                    onClick={() => d.copyBank(acc.nomor, idx)}
                    className={`${ghostBtn} relative w-full`}
                  >
                    {d.copiedBankIndex === idx ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#B7E36B]" />
                        <span>Nomor Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#E8D27A]" />
                        <span>Salin No. Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              ))}

              {d.giftAddress && (
                <div
                  className={`rounded-[1.75rem] p-5 text-center md:col-span-2 lg:col-span-1 ${glass}`}
                >
                  <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-[#E8D27A]">
                    <Gift className="h-4 w-4 text-[#A6D854]" />
                    <span>Kirim Kado Fisik</span>
                  </div>
                  <p className="mb-4 text-xs leading-relaxed text-[#CFE3C2]">
                    {d.giftAddress}
                  </p>
                  <button
                    type="button"
                    onClick={d.copyAddress}
                    className={ghostBtn}
                  >
                    {d.copiedAddress ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#B7E36B]" />
                        <span>Alamat Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#E8D27A]" />
                        <span>Salin Alamat</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/* UCAPAN & RSVP                                                 */}
        {/* ============================================================ */}
        <section
          className={`relative z-[1] overflow-hidden px-6 pb-20 pt-24 ${band.dark}`}
        >
          <CanopyEdge />
          <SectionTitle
            title="Berikan Pesan"
            desc="Berikan ucapan & doa restu, serta konfirmasi kehadiran Anda"
          />

          {/* statistik kehadiran */}
          <Reveal delay={60}>
            <div className="mx-auto mb-6 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 py-3 text-center">
                <span className="font-serif-theme block text-2xl font-bold tabular-nums text-emerald-300">
                  {hadirCount}
                </span>
                <span className="text-[11px] text-[#CFE3C2]">Hadir</span>
              </div>
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 py-3 text-center">
                <span className="font-serif-theme block text-2xl font-bold tabular-nums text-rose-300">
                  {tidakHadirCount}
                </span>
                <span className="text-[11px] text-[#CFE3C2]">Tidak Hadir</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form
              onSubmit={d.rsvp.send}
              className={`mx-auto mb-10 max-w-md space-y-4 rounded-[2rem] p-6 text-left ${glass}`}
            >
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="ft-rsvp-name"
                    className="block text-xs font-medium text-[#CFE3C2]"
                  >
                    Nama Lengkap
                  </label>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    <Lock className="h-2.5 w-2.5" />
                    Terkunci sesuai undangan
                  </span>
                </div>
                <input
                  id="ft-rsvp-name"
                  type="text"
                  readOnly
                  value={d.rsvp.name || d.guestName || "Tamu Undangan"}
                  placeholder="Nama Tamu"
                  className={`${inputCls} cursor-not-allowed bg-black/40 text-stone-200 border-emerald-500/20 select-none focus:ring-0 focus:border-emerald-500/20`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="ft-rsvp-status"
                    className="mb-1.5 block text-xs font-medium text-[#CFE3C2]"
                  >
                    Konfirmasi Kehadiran
                  </label>
                  <select
                    id="ft-rsvp-status"
                    disabled={d.rsvp.hasSubmitted}
                    value={d.rsvp.status}
                    onChange={(e) => d.rsvp.setStatus(e.target.value)}
                    className={`${inputCls} ${d.rsvp.hasSubmitted ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                    <option value="Masih Ragu">Masih Ragu</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ft-rsvp-pax"
                    className="mb-1.5 block text-xs font-medium text-[#CFE3C2]"
                  >
                    Jumlah Hadir
                  </label>
                  <select
                    id="ft-rsvp-pax"
                    disabled={d.rsvp.hasSubmitted}
                    value={d.rsvp.pax}
                    onChange={(e) => d.rsvp.setPax(e.target.value)}
                    className={`${inputCls} ${d.rsvp.hasSubmitted ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <option value="1 Orang">1 Orang</option>
                    <option value="2 Orang">2 Orang</option>
                    <option value="3 Orang">3 Orang</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="ft-rsvp-msg"
                  className="mb-1.5 block text-xs font-medium text-[#CFE3C2]"
                >
                  Ucapan & Doa Restu
                </label>
                <textarea
                  id="ft-rsvp-msg"
                  rows={3}
                  required
                  disabled={d.rsvp.hasSubmitted}
                  value={d.rsvp.message}
                  onChange={(e) => d.rsvp.setMessage(e.target.value)}
                  placeholder={
                    d.rsvp.hasSubmitted
                      ? "Terima kasih, Anda telah mengirimkan ucapan & doa restu."
                      : "Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                  }
                  className={`${inputCls} ${d.rsvp.hasSubmitted ? "cursor-not-allowed bg-black/40 text-stone-300 opacity-70" : ""}`}
                />
              </div>

              {d.rsvp.hasSubmitted && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/50 p-3 text-[11px] text-emerald-300 leading-snug">
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>
                    Anda telah mengirimkan ucapan doa restu untuk kedua mempelai. Terima kasih!
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={d.rsvp.hasSubmitted}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-bold transition-all focus-visible:outline-none ${
                  d.rsvp.hasSubmitted
                    ? "cursor-not-allowed bg-stone-800/80 text-emerald-400/90 border border-emerald-500/30 opacity-80 select-none"
                    : "cursor-pointer bg-gradient-to-r from-[#2F8A48] via-[#7CC04A] to-[#2F8A48] text-[#04120B] shadow-md hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white"
                }`}
              >
                {d.rsvp.hasSubmitted ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Ucapan Telah Terkirim</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Kirim Ucapan & Konfirmasi</span>
                  </>
                )}
              </button>
            </form>
          </Reveal>

          {/* daftar ucapan (3 card ditampilkan, sisanya discroll jika melebihi 3) */}
          <Reveal delay={160}>
            <div className="mx-auto max-w-md">
              {wishes.length > 0 ? (
                <div className="ft-wishes-scroll max-h-[345px] overflow-y-auto space-y-3 pr-1.5 scroll-smooth">
                  {wishes.map((r) => (
                    <div
                      key={r.id}
                      className="space-y-1.5 rounded-2xl rounded-tl-md border border-[#E9F3C9]/15 bg-[#04120B]/70 p-4 text-left backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-white">
                          {r.guest_name}
                        </h4>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${
                            r.attendance_status === "Hadir"
                              ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                              : r.attendance_status === "Tidak Hadir"
                                ? "border-rose-500/30 bg-rose-500/20 text-rose-300"
                                : "border-amber-500/30 bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {r.attendance_status}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#CFE3C2]">
                        {r.message}
                      </p>
                      <span className="block text-[10px] text-stone-400">
                        {formatRsvpDate(r.created_at || r.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-xs italic text-[#B9D2B0]">
                  Belum ada ucapan doa. Jadilah yang pertama memberikan ucapan!
                </p>
              )}
            </div>
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/* PENUTUP: foto penuh + ucapan terima kasih                     */}
        {/* ============================================================ */}
        <footer className="relative z-[1] flex min-h-[34rem] flex-col justify-end overflow-hidden px-6 pb-32 pt-24 text-center">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            {closingPhoto && (
              <img
                src={closingPhoto}
                alt=""
                className="h-full w-full object-cover object-[center_25%]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#04120B] via-[#04120B]/55 to-[#04120B]/92" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(20,82,50,0.5) 0%, transparent 75%)",
              }}
            />
          </div>

          {/* Aksen dedaunan sudut penutup yang proporsional dan menyatu */}
          <Sway
            className="-left-4 -bottom-4 z-10 h-44 w-32 pointer-events-none opacity-75"
            rot="6deg"
          >
            <img
              src="/images/forest-botanical-cluster.png"
              alt=""
              className="h-full w-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] [transform:scaleX(-1)]"
            />
          </Sway>
          <Sway
            className="-right-4 -bottom-4 z-10 h-44 w-32 pointer-events-none opacity-75"
            rot="-6deg"
            delay="1s"
          >
            <img
              src="/images/forest-botanical-cluster.png"
              alt=""
              className="h-full w-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] "
            />
          </Sway>

          <Reveal delay={100}>
            <div className="relative z-20">
              <MonsteraLeafSVG className="mx-auto mb-4 h-8 w-8 text-[#E8D27A]" />

              <p className="mx-auto mb-5 max-w-xs text-[13px] leading-relaxed text-[#D9EBCB]">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
                Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.
              </p>

              <p className="font-serif-theme mb-1 text-sm font-semibold text-[#E8D27A]">
                Kami yang berbahagia,
              </p>
              <h3 className="font-serif-theme text-3xl font-bold text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.8)]">
                {d.groomShort} & {d.brideShort}
              </h3>

              <p className="mt-8 text-[10px] text-[#9DB890]">
                Tamuva Digital Wedding Invitation
              </p>
            </div>
          </Reveal>
        </footer>
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        isOpen={d.isLightboxOpen}
        onClose={() => d.setIsLightboxOpen(false)}
        photos={d.gallery}
        activeIndex={d.gallerySelected}
        onIndexChange={d.setGallerySelected}
      />
    </div>
  );
};
