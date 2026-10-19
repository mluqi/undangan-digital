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
  Flower2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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

/** Palet — diambil dari gambar referensi */
const C = {
  night: "#04120B", // bayangan terdalam
  canopy: "#0E3B28", // kanopi gelap
  fern: "#3F9B58", // daun pakis
  meadow: "#A6D854", // padang rumput terkena cahaya
  mist: "#E9F3C9", // kabut / langit di sela pohon
  bark: "#6B4A2B", // batang pohon
  stone: "#D2B48C", // batu
  gold: "#D4AF37", // aksen emas (dipertahankan dari tema awal)
};

/** Panel kaca gelap di atas background hutan */
const glass =
  "bg-[#04120B]/55 backdrop-blur-md border border-[#E9F3C9]/15 shadow-[0_10px_40px_rgba(0,0,0,0.45)]";

/** Tombol sekunder (maps, calendar, copy) */
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-[#E9F3C9] bg-[#0E3B28]/70 hover:bg-[#3F9B58]/50 border border-[#A6D854]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A6D854] transition-colors cursor-pointer";

/* =================================================================
 * ORNAMEN SVG
 * ================================================================= */
const MonsteraLeafSVG = ({ className = "", style = {}, color = "#52B788" }) => (
  <svg
    viewBox="0 0 100 120"
    fill="currentColor"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 5 C30 15 10 35 8 65 C6 90 25 112 50 118 C75 112 94 90 92 65 C90 35 70 15 50 5 Z 
         M50 20 C52 40 54 80 50 110 
         M46 45 C35 40 22 42 16 50 C26 55 38 52 47 52 
         M54 45 C65 40 78 42 84 50 C74 55 62 52 53 52 
         M47 68 C32 66 20 74 18 84 C28 84 39 77 48 74 
         M53 68 C68 66 80 74 82 84 C72 84 61 77 52 74"
      stroke={color}
      strokeWidth="2.5"
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

/** Berkas sinar matahari kanopi yang memancar saat semak tersibak */
const SunbeamGodRays = ({ active }) => (
  <div
    className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-all duration-[1250ms] ease-out ${
      active ? "scale-150 opacity-95" : "scale-75 opacity-0"
    }`}
    aria-hidden="true"
  >
    <div
      className="h-[42rem] w-[42rem] rounded-full blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(254,240,138,0.75) 0%, rgba(166,216,84,0.4) 35%, rgba(14,59,40,0) 70%)",
      }}
    />
    <div
      className="absolute inset-0 opacity-45 mix-blend-screen"
      style={{
        background:
          "repeating-conic-gradient(from 0deg at 50% 45%, rgba(254,240,138,0.4) 0deg 16deg, transparent 16deg 32deg)",
      }}
    />
  </div>
);

/** Semak hutan sisi kiri — tersibak ke kiri & berputar keluar saat dibuka, tidak menutupi isi kartu */
const BushGateLeft = ({ isOpening }) => (
  <div
    className={`pointer-events-none absolute inset-y-0 -left-20 sm:-left-14 z-10 w-48 sm:w-56 transition-all duration-[1250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isOpening
        ? "-translate-x-full -rotate-12 scale-110 opacity-0 blur-sm"
        : "translate-x-0 rotate-0 scale-100 opacity-100 ft-bush-sway-left"
    }`}
    aria-hidden="true"
  >
    <BananaLeafSVG
      className="absolute -left-10 top-10 h-72 w-36 rotate-6 drop-shadow-2xl"
      color="#051910"
    />
    <PalmFrondSVG className="absolute -left-6 top-36 h-28 w-44 rotate-[18deg] text-[#0E3B28] drop-shadow-xl" />
    <MonsteraLeafSVG
      className="absolute -left-2 top-56 h-36 w-32 rotate-6 text-[#1B6B43] drop-shadow-xl"
      color="#1B6B43"
    />
    <BananaLeafSVG
      className="absolute -left-8 bottom-16 h-56 w-36 rotate-[16deg] drop-shadow-xl"
      color="#2F8A48"
    />
    <FernSVG className="absolute -left-6 -bottom-6 h-44 w-28 rotate-6 text-[#0A2A1B]" />
    <FernSVG className="absolute left-6 -bottom-8 h-40 w-24 rotate-[18deg] text-[#145232]" />
    <PalmFrondSVG className="absolute left-6 bottom-36 h-24 w-32 rotate-[25deg] text-[#D4AF37]/70" />
    <MonsteraLeafSVG
      className="absolute left-10 top-24 h-20 w-20 rotate-[12deg] text-[#A6D854]/50"
      color="#A6D854"
    />
  </div>
);

/** Semak hutan sisi kanan — tersibak ke kanan & berputar keluar saat dibuka, tidak menutupi isi kartu */
const BushGateRight = ({ isOpening }) => (
  <div
    className={`pointer-events-none absolute inset-y-0 -right-20 sm:-right-14 z-10 w-48 sm:w-56 transition-all duration-[1250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isOpening
        ? "translate-x-full rotate-12 scale-110 opacity-0 blur-sm"
        : "translate-x-0 rotate-0 scale-100 opacity-100 ft-bush-sway-right"
    }`}
    aria-hidden="true"
  >
    <BananaLeafSVG
      className="absolute -right-10 top-10 h-72 w-36 -rotate-6 drop-shadow-2xl [transform:scaleX(-1)]"
      color="#051910"
    />
    <PalmFrondSVG className="absolute -right-6 top-36 h-28 w-44 -rotate-[18deg] text-[#0E3B28] drop-shadow-xl [transform:scaleX(-1)]" />
    <MonsteraLeafSVG
      className="absolute -right-2 top-56 h-36 w-32 -rotate-6 text-[#1B6B43] drop-shadow-xl [transform:scaleX(-1)]"
      color="#1B6B43"
    />
    <BananaLeafSVG
      className="absolute -right-8 bottom-16 h-56 w-36 -rotate-[16deg] drop-shadow-xl [transform:scaleX(-1)]"
      color="#2F8A48"
    />
    <FernSVG className="absolute -right-6 -bottom-6 h-44 w-28 -rotate-6 text-[#0A2A1B] [transform:scaleX(-1)]" />
    <FernSVG className="absolute right-6 -bottom-8 h-40 w-24 -rotate-[18deg] text-[#145232] [transform:scaleX(-1)]" />
    <PalmFrondSVG className="absolute right-6 bottom-36 h-24 w-32 -rotate-[25deg] text-[#D4AF37]/70 [transform:scaleX(-1)]" />
    <MonsteraLeafSVG
      className="absolute right-10 top-24 h-20 w-20 -rotate-[12deg] text-[#A6D854]/50 [transform:scaleX(-1)]"
      color="#A6D854"
    />
  </div>
);

/** Semak pakis bawah penutup gerbang rimba — tidak menjulang ke tombol */
const BushGateBottom = ({ isOpening }) => (
  <div
    className={`pointer-events-none absolute inset-x-0 -bottom-4 z-10 h-24 overflow-hidden transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isOpening ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
    }`}
    aria-hidden="true"
  >
    <FernSVG className="absolute -bottom-6 left-1/4 h-32 w-24 -rotate-6 text-[#0A2A1B]" />
    <FernSVG className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-36 w-24 rotate-2 text-[#0E3B28]" />
    <FernSVG className="absolute -bottom-6 right-1/4 h-32 w-24 rotate-6 text-[#145232]" />
  </div>
);

/** Sulur atas penutup gerbang rimba — tidak menutupi judul */
const BushGateTop = ({ isOpening }) => (
  <div
    className={`pointer-events-none absolute inset-x-0 -top-2 z-10 h-24 overflow-hidden transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isOpening ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
    }`}
    aria-hidden="true"
  >
    <HangingVinesSVG className="h-full w-full object-cover" />
  </div>
);

/** Semak pakis di tepi bawah sebuah section */
const FoliageEdge = ({ flip = false }) => (
  <div
    className={`pointer-events-none absolute inset-x-0 ${flip ? "top-0 rotate-180" : "bottom-0"} h-28 overflow-hidden`}
    aria-hidden="true"
  >
    <FernSVG className="absolute -bottom-8 -left-6 h-40 w-24 -rotate-12 text-[#0E3B28]" />
    <FernSVG className="absolute -bottom-10 left-8 h-44 w-28 rotate-6 text-[#145232]" />
    <FernSVG className="absolute -bottom-12 left-1/3 h-36 w-24 -rotate-3 text-[#0A2A1B]" />
    <FernSVG className="absolute -bottom-10 right-1/4 h-44 w-28 rotate-12 text-[#1B6B43]" />
    <FernSVG className="absolute -bottom-8 -right-4 h-40 w-24 rotate-[18deg] text-[#0E3B28]" />
  </div>
);

/** Pembatas daun */
const LeafDivider = () => (
  <div className="flex items-center justify-center gap-3" aria-hidden="true">
    <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
    <MonsteraLeafSVG className="h-5 w-5 text-[#D4AF37]" />
    <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
  </div>
);

/** Judul section — rata tengah, tanpa eyebrow berlebihan */
const SectionTitle = ({ title, desc }) => (
  <Reveal className="mb-9 text-center">
    <h2 className="font-serif-theme text-[2rem] font-bold leading-tight text-[#F4F9E4] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
      {title}
    </h2>
    <div className="mt-3">
      <LeafDivider />
    </div>
    {desc && (
      <p className="mx-auto mt-3 max-w-[18rem] text-[13px] leading-relaxed text-[#CFE3C2]">
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

/** Lapisan background hutan (menempel di layar, konten bergulir di atasnya) */
const ForestBackdrop = () => (
  <div
    className="pointer-events-none fixed inset-y-0 left-1/2 z-0 w-full max-w-lg -translate-x-1/2"
    aria-hidden="true"
  >
    {/* gambar referensi + gradasi cadangan */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${FOREST_BG}), radial-gradient(ellipse at 50% 12%, ${C.mist} 0%, rgba(233,243,201,0) 38%), linear-gradient(180deg, #0E3B28 0%, #145232 45%, #2F8A48 78%, #8CC84B 100%)`,
        backgroundSize: "cover, auto, auto",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    />
    {/* peredam agar teks tetap terbaca */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#04120B]/55 via-[#04120B]/35 to-[#04120B]/70" />
    {/* kabut melayang */}
    <div
      className="ft-mist absolute -left-16 top-1/3 h-56 w-[28rem] rounded-full blur-3xl"
      style={{ background: "rgba(233,243,201,0.16)" }}
    />
    <div
      className="ft-mist-slow absolute -right-20 top-2/3 h-64 w-[30rem] rounded-full blur-3xl"
      style={{ background: "rgba(166,216,84,0.12)" }}
    />
  </div>
);

/* =================================================================
 * KARTU ACARA (dipakai Akad & Resepsi — field data sama persis)
 * ================================================================= */
const EventCard = ({ title, icon: Icon, event, align = "left" }) => (
  <article
    className={`relative overflow-hidden rounded-[2rem] p-6 ${glass} ${
      align === "right" ? "rounded-tr-[4rem]" : "rounded-tl-[4rem]"
    }`}
  >
    <MonsteraLeafSVG
      className={`pointer-events-none absolute -top-3 h-24 w-24 text-[#A6D854]/15 ${
        align === "right" ? "-left-4 -rotate-12" : "-right-4 rotate-12"
      }`}
    />
    <div className="relative mb-5 flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#0E3B28]/80">
        <Icon className="h-5 w-5 text-[#E8D27A]" />
      </span>
      <h3 className="font-serif-theme text-xl font-bold text-[#F4F9E4]">
        {title}
      </h3>
    </div>

    <div className="relative space-y-3.5 text-[13px] text-[#E2EFD2]">
      <div className="flex items-start gap-3">
        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#A6D854]" />
        <span>{event.tanggal}</span>
      </div>
      <div className="flex items-start gap-3">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#A6D854]" />
        <span>{event.waktu}</span>
      </div>
      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A6D854]" />
        <div>
          <strong className="block text-sm font-semibold text-white">
            {event.lokasi}
          </strong>
          <p className="mt-0.5 text-xs leading-relaxed text-[#B9D2B0]">
            {event.alamat}
          </p>
        </div>
      </div>
    </div>

    {event.mapUrl && (
      <a
        href={event.mapUrl}
        target="_blank"
        rel="noreferrer"
        className={`${ghostBtn} relative mt-6 w-full`}
      >
        <MapPin className="h-3.5 w-3.5 text-[#E8D27A]" />
        <span>Buka Google Maps</span>
        <ExternalLink className="h-3 w-3 opacity-70" />
      </a>
    )}
  </article>
);

/* =================================================================
 * TEMA: FOREST TROPICAL
 * Menyusuri jalan setapak hutan — background gambar hutan menempel,
 * konten muncul sebagai panel kaca & jendela lengkung.
 * ================================================================= */
export const ForestTropicalTheme = (props) => {
  const d = useInvitationData(props);
  const motionRef = useRef(null);
  useScrollMotion(motionRef, d.isOpened);
  useParallax(motionRef, d.isOpened);

  const [isOpeningTransition, setIsOpeningTransition] = useState(false);
  const [isCoverDismissed, setIsCoverDismissed] = useState(false);
  const [coverExited, setCoverExited] = useState(false);

  // Koleksi foto untuk slide photo awal bergradien dramatis
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

  // State & timer auto-slide untuk hero background full-size
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    if (!heroPhotos || heroPhotos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroPhotos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroPhotos]);

  const handleStartOpen = () => {
    if (isOpeningTransition) return;
    setIsOpeningTransition(true);

    // Buka undangan dan putar alunan musik satu kali saja
    d.openInvitation();

    // Selesaikan efek visual semak tersibak & zoom-out
    setTimeout(() => {
      setIsCoverDismissed(true);
    }, 1060);

    // Unmount cover secara bersih setelah transisi tuntas
    setTimeout(() => {
      setCoverExited(true);
    }, 1500);
  };

  return (
    <div
      ref={motionRef}
      className={`bg-forest-tropical relative ${d.isOpened ? "min-h-screen lg:ml-auto lg:mr-0" : "h-screen max-h-screen overflow-hidden mx-auto"} w-full max-w-lg lg:max-w-none lg:w-[480px] xl:w-[520px] border-x border-[#0E3B28]/60 bg-[#04120B] font-sans text-[#EAF4DA] shadow-2xl selection:bg-[#A6D854] selection:text-black scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="forest"
        invitationData={d}
        isOpened={d.isOpened}
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
        .ft-sway { transform-origin: 50% 100%; animation: ft-sway 7s ease-in-out infinite; }
        .ft-bush-sway-left { transform-origin: 0% 100%; animation: ft-bush-sway-left 7s ease-in-out infinite; }
        .ft-bush-sway-right { transform-origin: 100% 100%; animation: ft-bush-sway-right 7.5s ease-in-out infinite; }
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

      {/* Pemutar musik bertema forest tropical */}
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
        theme="forest"
        accentColor="#A6D854"
      />

      {/* ============================================================ */}
      {/* COVER: gerbang masuk hutan dengan semak tersibak & zoom-out   */}
      {/* ============================================================ */}
      {!coverExited && (!d.isOpened || isOpeningTransition) && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-[#04120B] transition-opacity duration-700 ease-out ${
            isCoverDismissed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Background Slide Foto Prewedding Full Size di Cover Awal */}
          <div
            className={`absolute inset-0 z-0 overflow-hidden bg-[#04120B] transition-transform duration-[1350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpeningTransition ? "scale-100" : "scale-[1.08]"
            }`}
            aria-hidden="true"
          >
            {heroPhotos.map((src, idx) => {
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
                    className={`h-full w-full object-cover object-[center_30%] transition-transform duration-[7500ms] ease-out ${
                      isActive
                        ? "scale-108 translate-y-0"
                        : "scale-100 translate-y-2"
                    }`}
                  />
                </div>
              );
            })}

            {/* Peredam gelap & gradasi hijau kanopi rimbun tropis agar teks tetap kontras */}
            <div
              className="absolute inset-0 z-20 bg-gradient-to-b from-[#04120B]/65 via-[#04120B]/35 to-[#04120B]/90 pointer-events-none"
              aria-hidden="true"
            />

            {/* Ambient Forest Underglow — nuansa zamrud di bagian bawah kartu */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-96 z-20 opacity-75"
              style={{
                background:
                  "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(20,82,50,0.5) 0%, rgba(14,59,40,0.25) 50%, transparent 85%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Kabut lembut atmosferik */}
          <div
            className="ft-mist absolute -left-10 top-1/4 z-10 h-52 w-96 rounded-full bg-[#E9F3C9]/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Semak-semak hutan lebat: membuka ke kiri & kanan, bawah & atas */}
          <BushGateLeft isOpening={isOpeningTransition} />
          <BushGateRight isOpening={isOpeningTransition} />
          <BushGateBottom isOpening={isOpeningTransition} />
          <BushGateTop isOpening={isOpeningTransition} />

          {/* Isi kartu pass cover - berada di z-30 di atas semua semak agar tidak tertutupi */}
          <div
            className={`relative z-30 flex w-full max-w-sm sm:max-w-md flex-col items-center px-4 sm:px-6 pb-6 pt-4 text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpeningTransition
                ? "opacity-0 translate-y-12 scale-90 pointer-events-none"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#04120B]/70 backdrop-blur-sm shadow-[0_0_25px_rgba(183,227,107,0.25)]">
              <Trees className="h-8 w-8 text-[#B7E36B]" />
            </div>

            <p className="mb-2 text-xs font-medium tracking-[0.25em] text-[#E8D27A]">
              The Wedding Invitation
            </p>
            <h2 className="font-serif-theme text-[2.6rem] font-bold leading-[1.1] text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.7)]">
              {d.groomShort}
              <span className="font-cursive mx-2 text-[#E8D27A]">&</span>
              {d.brideShort}
            </h2>
            <p className="mt-2 text-xs italic text-[#D3E6C5]">
              Lush Forest & Botanical Celebration
            </p>

            <div className={`mt-8 w-full rounded-[1.75rem] p-5 ${glass}`}>
              <p className="text-[11px] text-[#CFE3C2]">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <h3 className="mt-1 text-lg font-bold tracking-wide text-white">
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
            </div>

            {/* Tombol buka undangan dengan pulsating aura glow */}
            <div className="relative mt-5 w-full">
              <div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#2F8A48] via-[#A6D854] to-[#2F8A48] opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-100 animate-pulse pointer-events-none"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={handleStartOpen}
                disabled={isOpeningTransition}
                className="group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2F8A48] via-[#7CC04A] to-[#2F8A48] px-6 py-3.5 text-sm font-bold text-[#04120B] shadow-[0_6px_26px_rgba(166,216,84,0.35)] transition-all hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-80"
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
      )}

      {/* ============================================================ */}
      {/* KONTEN UTAMA UNDANGAN: Transisi kemunculan halus & sinematik */}
      {/* ============================================================ */}
      <div
        className={`relative z-[1] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          d.isOpened
            ? "opacity-100 translate-y-0 scale-100 filter-none"
            : "opacity-0 translate-y-10 scale-[0.98] blur-[2px] pointer-events-none"
        }`}
      >
        {/* ============================================================ */}
        {/* HERO: FULL-SIZE SCREEN DENGAN SLIDE FOTO MENYATU PENUH        */}
        {/* ============================================================ */}
        <section className="relative z-[1] min-h-[106dvh] sm:min-h-[112dvh] w-full flex flex-col justify-between overflow-hidden text-center pb-20 sm:pb-24 pt-10">
          {/* Latar Belakang Slide Foto Full Size (Menjulur Lebih ke Bawah & Frameless) */}
          <div className="absolute -inset-x-0 -top-0 -bottom-24 sm:-bottom-32 z-0 overflow-hidden bg-[#04120B]">
            {heroPhotos.map((src, idx) => {
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
                    alt={`Prewedding ${idx + 1}`}
                    className={`h-full w-full object-cover object-[center_20%] transition-transform duration-[7500ms] ease-out ${
                      isActive
                        ? "scale-108 translate-y-0"
                        : "scale-100 translate-y-2"
                    }`}
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.92) 68%, rgba(0,0,0,0.62) 82%, rgba(0,0,0,0.22) 93%, transparent 100%)",
                      maskImage:
                        "linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.92) 68%, rgba(0,0,0,0.62) 82%, rgba(0,0,0,0.22) 93%, transparent 100%)",
                    }}
                  />
                </div>
              );
            })}

            {/* ======================================================== */}
            {/* GRADIENT OVERLAYS & PROGRESSIVE OPTICAL BLUR TRANSITION   */}
            {/* ======================================================== */}
            {/* 1. Gradien Atas: menyatu lembut dengan kanopi rimbun */}
            <div
              className="absolute inset-x-0 top-0 z-20 h-36 bg-gradient-to-b from-[#04120B] via-[#04120B]/60 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* 2. PROGRESSIVE MULTI-STAGE OPTICAL BLUR DI BAGIAN BAWAH */}
            {/* Mengaburkan foto secara optik bertingkat (bokeh lembut) */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[32rem] sm:h-[40rem] overflow-hidden"
              aria-hidden="true"
            >
              {/* Layer 1: Feathered Micro Blur (2px) */}
              <div
                className="absolute inset-0 backdrop-blur-[2px]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)",
                }}
              />
              {/* Layer 2: Soft Intermediate Blur (6px) */}
              <div
                className="absolute inset-0 backdrop-blur-[6px]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 100%)",
                }}
              />
              {/* Layer 3: Creamy Bokeh Blur (14px) */}
              <div
                className="absolute inset-0 backdrop-blur-[14px]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,1) 85%, rgba(0,0,0,1) 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,1) 85%, rgba(0,0,0,1) 100%)",
                }}
              />
              {/* Layer 4: Deep Atmosphere Blur (28px) */}
              <div
                className="absolute inset-0 backdrop-blur-[28px]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.9) 82%, rgba(0,0,0,1) 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.9) 82%, rgba(0,0,0,1) 100%)",
                }}
              />

              {/* Multi-stop smooth atmospheric shadow gradient yang serasi dengan component berikutnya */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(4,18,11,0) 0%, rgba(7,36,23,0.18) 28%, rgba(10,42,27,0.48) 52%, rgba(14,59,40,0.78) 72%, rgba(7,36,23,0.94) 88%, #04120B 100%)",
                }}
              />

              {/* Ambient Forest Underglow — rona hijau zamrud alami menyelaraskan dengan kartu Ayat & Mempelai */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-80 z-20 opacity-75"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 60% at 50% 92%, rgba(20,82,50,0.42) 0%, rgba(14,59,40,0.22) 45%, transparent 80%)",
                }}
              />

              {/* Subtle Golden Canopy Mist Accent — pendar halus menyatu dengan aksen emas component berikutnya */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-64 z-20 opacity-35 mix-blend-screen"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 50% at 50% 88%, rgba(232,210,122,0.2) 0%, rgba(166,216,84,0.08) 40%, transparent 75%)",
                }}
              />
            </div>

            {/* 3. Radial Vignette: bayangan sudut lembut */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, rgba(4,18,11,0.02) 0%, rgba(4,18,11,0.35) 60%, rgba(4,18,11,0.9) 100%)",
              }}
              aria-hidden="true"
            />

            {/* 4. Berkas Sinar Mentari Kanopi (God Rays) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(circle at 75% 18%, rgba(254,240,138,0.4) 0%, rgba(166,216,84,0.12) 35%, transparent 65%)",
              }}
              aria-hidden="true"
            />

            {/* Tombol Navigasi Panah Kiri & Kanan */}
            {/* {heroPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentHeroSlide((prev) =>
                      prev === 0 ? heroPhotos.length - 1 : prev - 1,
                    );
                  }}
                  className="absolute left-3.5 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#A6D854]/40 bg-[#04120B]/50 text-[#E8D27A] backdrop-blur-md transition-all hover:bg-[#0E3B28] hover:scale-110 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.7)] cursor-pointer"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentHeroSlide(
                      (prev) => (prev + 1) % heroPhotos.length,
                    );
                  }}
                  className="absolute right-3.5 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#A6D854]/40 bg-[#04120B]/50 text-[#E8D27A] backdrop-blur-md transition-all hover:bg-[#0E3B28] hover:scale-110 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.7)] cursor-pointer"
                  aria-label="Foto Selanjutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )} */}
          </div>

          {/* Konten Hero Melayang di Atas Foto */}
          <div className="relative z-30 flex flex-1 flex-col justify-between px-6">
            {/* Bagian Atas */}
            <div className="pt-2">

              {heroPhotos.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-1.5">
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

            {/* Bagian Tengah: Judul & Nama Mempelai */}
            <div className="my-auto py-8">
              <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-[#E8D27A] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                The Wedding Celebration of
              </p>
              <h1 className="font-serif-theme text-[3.2rem] sm:text-[4rem] font-bold leading-[1.05] text-[#F7FBE9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                {d.groomShort}
                <span className="font-cursive mx-2 text-[3.5rem] sm:text-[4.2rem] text-[#E8D27A] drop-shadow-[0_2px_14px_rgba(232,210,122,0.6)]">
                  &
                </span>
                {d.brideShort}
              </h1>

              <p className="mt-4 text-[13px] font-medium tracking-wide text-[#E2EFD2] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {d.akad.tanggal}
                <br />
                <span className="text-[#B9D2B0] text-xs font-normal">
                  {d.akad.lokasi}
                </span>
              </p>
            </div>

            {/* Bagian Bawah: Countdown Floating di atas gradien transisi lembut */}
            <div className="w-full">
              <div
                className={`w-full rounded-[2rem] p-5 ${glass} border border-[#A6D854]/30 shadow-[0_12px_40px_rgba(0,0,0,0.65)]`}
              >
                <p className="mb-3.5 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E8D27A]">
                  <Clock className="h-4 w-4 text-[#A6D854]" />
                  <span>Menuju Hari Bahagia</span>
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: d.timeLeft.days, label: "Hari" },
                    { val: d.timeLeft.hours, label: "Jam" },
                    { val: d.timeLeft.minutes, label: "Menit" },
                    { val: d.timeLeft.seconds, label: "Detik" },
                  ].map((t, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center rounded-2xl border border-[#A6D854]/20 bg-[#04120B]/75 py-2.5 sm:py-3"
                    >
                      <span className="font-serif-theme text-xl sm:text-2xl font-bold tabular-nums text-white">
                        {String(t.val).padStart(2, "0")}
                      </span>
                      <span className="mt-0.5 text-[10px] text-[#B9D2B0]">
                        {t.label}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href={d.googleCalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${ghostBtn} mt-3.5 text-xs py-2.5`}
                >
                  <Calendar className="h-3.5 w-3.5 text-[#E8D27A]" />
                  <span>Simpan ke Google Calendar</span>
                </a>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SEAMLESS CANOPY BRIDGE: Dedaunan & Kabut Tumpang Tindih   */}
          {/* Menghubungkan hero secara organik ke section berikutnya   */}
          {/* ======================================================== */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 overflow-hidden"
            aria-hidden="true"
          >
            {/* Gradasi kabut bawah pekat yang selaras dengan rona hijau hutan zamrud */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(7,36,23,0.3) 35%, rgba(10,42,27,0.7) 70%, #04120B 100%)",
              }}
            />

            {/* Kabut atmosferik melayang di zona sambungan */}
            <div
              className="ft-mist absolute -left-12 bottom-0 h-28 w-80 rounded-full blur-2xl"
              style={{ background: "rgba(233,243,201,0.15)" }}
            />
            <div
              className="ft-mist-slow absolute -right-16 bottom-0 h-32 w-96 rounded-full blur-3xl"
              style={{ background: "rgba(166,216,84,0.12)" }}
            />

            {/* Dedaunan pakis bertingkat yang menyeberangi perbatasan hero */}
            <FernSVG className="absolute -bottom-8 -left-8 h-36 w-28 -rotate-12 text-[#051910] drop-shadow-2xl" />
            <FernSVG className="absolute -bottom-10 left-6 h-40 w-28 rotate-6 text-[#0A2A1B] drop-shadow-xl" />
            <PalmFrondSVG className="absolute -bottom-6 left-16 h-28 w-36 rotate-[28deg] text-[#0E3B28]/90" />
            <MonsteraLeafSVG className="absolute -bottom-4 left-1/3 h-24 w-24 -rotate-12 text-[#145232] drop-shadow-lg" />
            <FernSVG className="absolute -bottom-12 right-1/4 h-40 w-28 rotate-12 text-[#0A2A1B] drop-shadow-xl" />
            <PalmFrondSVG className="absolute -bottom-6 right-10 h-28 w-36 -rotate-[22deg] text-[#0E3B28]/90 [transform:scaleX(-1)]" />
            <FernSVG className="absolute -bottom-8 -right-6 h-36 w-28 rotate-[18deg] text-[#051910] drop-shadow-2xl" />
          </div>
        </section>

        {/* ============================================================ */}
        {/* AYAT: SANCTUARY CARD MENYATU LEMBUT DENGAN KABUT HERO        */}
        {/* ============================================================ */}
        <section className="relative z-20 px-6 pb-16 pt-8 text-center">
          {/* Layer kabut penerus yang memudar mulus ke section berikutnya */}
          <div
            className="pointer-events-none absolute -inset-x-0 top-0 -bottom-10 z-0"
            style={{
              background:
                "linear-gradient(to bottom, #04120B 0%, rgba(7,36,23,0.85) 30%, rgba(10,42,27,0.55) 60%, rgba(4,18,11,0.15) 90%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Kabut pendar lembut di belakang kartu */}
          <div
            className="ft-mist pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-44 w-72 rounded-full blur-3xl"
            style={{ background: "rgba(166,216,84,0.08)" }}
            aria-hidden="true"
          />

          {/* Kartu Ayat Kaca Rimba yang Nyaru & Terintegrasi */}
          <Reveal delay={120}>
            <div className="relative z-10 mx-auto max-w-sm rounded-[2.2rem] border border-[#A6D854]/25 bg-gradient-to-b from-[#04120B]/85 via-[#072417]/70 to-[#04120B]/85 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-md">
              {/* Ornamen sulur daun di sudut atas kartu */}
              <MonsteraLeafSVG
                className="pointer-events-none absolute -top-4 -left-3 h-12 w-12 -rotate-12 text-[#A6D854]/25"
                aria-hidden="true"
              />
              <MonsteraLeafSVG
                className="pointer-events-none absolute -bottom-4 -right-3 h-12 w-12 rotate-12 text-[#A6D854]/20 [transform:scaleX(-1)]"
                aria-hidden="true"
              />

              {/* Header Monstera Emas dengan Aksen Garis Cahaya */}
              <div className="mx-auto mb-4 flex items-center justify-center gap-2.5">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#E8D27A]/60" />
                <MonsteraLeafSVG className="h-7 w-7 text-[#E8D27A] drop-shadow-[0_2px_8px_rgba(232,210,122,0.5)]" />
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#E8D27A]/60" />
              </div>

              <p className="font-serif text-[14px] sm:text-[15px] italic leading-[1.9] text-[#F0F8E0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar
                kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan
                di antaramu rasa kasih dan sayang.&rdquo;
              </p>

              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="h-px w-6 bg-[#A6D854]/40" />
                <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#E8D27A] drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                  {d.ayatQuote}
                </p>
                <span className="h-px w-6 bg-[#A6D854]/40" />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/* MEMPELAI: dua potret lengkung berselang-seling                */}
        {/* ============================================================ */}
        <section className="relative z-[1] px-6 py-14">
          <SectionTitle
            title="Pasangan Mempelai"
            desc="Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud melangsungkan pernikahan suci:"
          />

          <div className="space-y-10">
            {/* Pria */}
            <Reveal delay={100}>
              <div className="flex items-center gap-5">
                <ArchPhoto
                  src={d.photoGroom}
                  alt={d.groom}
                  className="h-52 w-36 shrink-0"
                />
                <div
                  className={`flex-1 rounded-[1.75rem] rounded-bl-[3rem] p-5 ${glass}`}
                >
                  <p className="text-xs font-medium text-[#A6D854]">
                    Mempelai Pria
                  </p>
                  <h3 className="font-serif-theme mt-1 text-xl font-bold leading-snug text-white">
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
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div
                className="flex items-center justify-center gap-3 text-[#E8D27A]"
                aria-hidden="true"
              >
                <span className="h-px w-16 bg-[#E8D27A]/40" />
                <span className="font-cursive text-4xl">&</span>
                <span className="h-px w-16 bg-[#E8D27A]/40" />
              </div>
            </Reveal>

            {/* Wanita */}
            <Reveal delay={200}>
              <div className="flex flex-row-reverse items-center gap-5">
                <ArchPhoto
                  src={d.photoBride}
                  alt={d.bride}
                  className="h-52 w-36 shrink-0"
                  ringFrom={C.fern}
                  ringTo={C.gold}
                />
                <div
                  className={`flex-1 rounded-[1.75rem] rounded-br-[3rem] p-5 text-right ${glass}`}
                >
                  <p className="text-xs font-medium text-[#A6D854]">
                    Mempelai Wanita
                  </p>
                  <h3 className="font-serif-theme mt-1 text-xl font-bold leading-snug text-white">
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
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ACARA                                                         */}
        {/* ============================================================ */}
        <section className="relative z-[1] px-6 py-14">
          <SectionTitle
            title="Rangkaian Acara"
            desc="Kehadiran dan doa restu Anda merupakan kehormatan terbesar bagi kami"
          />

          <div className="space-y-6">
            <Reveal delay={100}>
              <EventCard
                title="Akad Nikah"
                icon={Calendar}
                event={d.akad}
                align="left"
              />
            </Reveal>
            <Reveal delay={200}>
              <EventCard
                title="Resepsi Pernikahan"
                icon={Clock}
                event={d.resepsi}
                align="right"
              />
            </Reveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* KISAH CINTA                                                   */}
        {/* ============================================================ */}
        {d.loveStories && d.loveStories.length > 0 && (
          <section className="relative z-[1] px-6 py-14">
            <SectionTitle title="Kisah Kasih Kami" />

            <div className="relative space-y-7 pl-8 before:absolute before:bottom-2 before:left-[0.6rem] before:top-2 before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-[#E8D27A] before:via-[#7CC04A] before:to-[#2D6A4F]/30">
              {d.loveStories.map((story, idx) => (
                <Reveal key={idx} delay={idx * 120} className="relative">
                  <span className="absolute -left-8 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#E8D27A] bg-[#04120B] text-[#E8D27A]">
                    <Leaf className="h-2.5 w-2.5" />
                  </span>

                  <div
                    className={`rounded-[1.5rem] rounded-tl-md p-4 ${glass}`}
                  >
                    <span className="font-serif-theme text-lg font-bold text-[#E8D27A]">
                      {story.tahun}
                    </span>
                    <h4 className="mt-0.5 text-sm font-bold text-white">
                      {story.judul}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#CFE3C2]">
                      {story.cerita}
                    </p>
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
          <section className="relative z-[1] px-6 py-14">
            <SectionTitle title="Galeri Kenangan" />

            <div className="grid grid-cols-2 gap-3">
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
        {/* AMPLOP DIGITAL & KADO                                         */}
        {/* ============================================================ */}
        <section className="relative z-[1] px-6 py-14">
          <SectionTitle
            title="Amplop Digital & Kado"
            desc="Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberi tanda kasih, kami menyediakan rekening berikut:"
          />

          <div className="mb-6 space-y-4">
            {d.bankAccounts.map((acc, idx) => (
              <Reveal key={idx} delay={idx * 120}>
                <div
                  className="relative overflow-hidden rounded-[1.75rem] border border-[#A6D854]/30 bg-gradient-to-br from-[#0F4A30]/85 via-[#0A3322]/85 to-[#04120B]/90 p-5 shadow-[0_10px_34px_rgba(0,0,0,0.5)] backdrop-blur-md"
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
              </Reveal>
            ))}
          </div>

          {d.giftAddress && (
            <Reveal delay={180}>
              <div className={`rounded-[1.75rem] p-5 text-center ${glass}`}>
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
            </Reveal>
          )}
        </section>

        {/* ============================================================ */}
        {/* BUKU TAMU & RSVP                                              */}
        {/* ============================================================ */}
        <section className="relative z-[1] px-6 py-14">
          <SectionTitle
            title="Buku Tamu & RSVP"
            desc="Mohon konfirmasikan kehadiran Anda untuk membantu kami mempersiapkan acara"
          />

          <Reveal delay={100}>
            <form
              onSubmit={d.rsvp.send}
              className={`mb-8 space-y-4 rounded-[2rem] rounded-tr-[4rem] p-6 ${glass}`}
            >
              <div>
                <label
                  htmlFor="ft-rsvp-name"
                  className="mb-1.5 block text-xs font-medium text-[#CFE3C2]"
                >
                  Nama Lengkap
                </label>
                <input
                  id="ft-rsvp-name"
                  type="text"
                  required
                  value={d.rsvp.name}
                  onChange={(e) => d.rsvp.setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full rounded-xl border border-[#A6D854]/25 bg-[#04120B]/70 px-4 py-2.5 text-xs text-white placeholder:text-stone-500 focus:border-[#A6D854] focus:outline-none focus:ring-1 focus:ring-[#A6D854]"
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
                    value={d.rsvp.status}
                    onChange={(e) => d.rsvp.setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#A6D854]/25 bg-[#04120B]/70 px-3 py-2.5 text-xs text-white focus:border-[#A6D854] focus:outline-none focus:ring-1 focus:ring-[#A6D854]"
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
                    value={d.rsvp.pax}
                    onChange={(e) => d.rsvp.setPax(e.target.value)}
                    className="w-full rounded-xl border border-[#A6D854]/25 bg-[#04120B]/70 px-3 py-2.5 text-xs text-white focus:border-[#A6D854] focus:outline-none focus:ring-1 focus:ring-[#A6D854]"
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
                  value={d.rsvp.message}
                  onChange={(e) => d.rsvp.setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                  className="w-full rounded-xl border border-[#A6D854]/25 bg-[#04120B]/70 px-4 py-2.5 text-xs text-white placeholder:text-stone-500 focus:border-[#A6D854] focus:outline-none focus:ring-1 focus:ring-[#A6D854]"
                />
              </div>

              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2F8A48] via-[#7CC04A] to-[#2F8A48] px-4 py-3 text-xs font-bold text-[#04120B] shadow-md transition-all hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim Ucapan & Konfirmasi</span>
              </button>
            </form>
          </Reveal>

          {/* daftar ucapan */}
          <Reveal delay={180}>
            <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {d.rsvp.list && d.rsvp.list.length > 0 ? (
                d.rsvp.list.map((r) => (
                  <div
                    key={r.id}
                    className="space-y-1.5 rounded-2xl rounded-tl-md border border-[#E9F3C9]/15 bg-[#04120B]/70 p-4 backdrop-blur-md"
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
                      {formatRsvpDate(r.created_at)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-xs italic text-[#B9D2B0]">
                  Belum ada ucapan doa. Jadilah yang pertama memberikan ucapan!
                </p>
              )}
            </div>
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/* FOOTER: kembali ke jalan setapak                              */}
        {/* ============================================================ */}
        <footer className="relative z-[1] overflow-hidden px-6 pb-32 pt-16 text-center">
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#04120B]/70 to-[#04120B]"
            aria-hidden="true"
          />
          <Reveal delay={100}>
            <div className="relative">
              <MonsteraLeafSVG className="mx-auto mb-4 h-8 w-8 text-[#E8D27A]" />

              <p className="mx-auto mb-5 max-w-xs text-[13px] leading-relaxed text-[#D9EBCB]">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
              </p>

              <p className="font-serif-theme mb-1 text-sm font-semibold text-[#E8D27A]">
                Kami yang berbahagia,
              </p>
              <h3 className="font-serif-theme text-3xl font-bold text-white">
                {d.groomShort} & {d.brideShort}
              </h3>

              <p className="mt-8 text-[10px] text-[#9DB890]">
                Digital Wedding Invitation • Forest Tropical Edition
              </p>
            </div>
          </Reveal>

          <FoliageEdge />
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
