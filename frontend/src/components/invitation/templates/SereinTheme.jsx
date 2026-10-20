import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Heart,
  Send,
  Gift,
  Sparkles,
  Camera,
  Bell,
  Mail,
} from "lucide-react";
import { Badge } from "../../ui";
import { useToast } from "../../ui/Toast";
import { MusicVinylPlayer } from "../MusicVinylPlayer";
import { InvitationFloatingControls } from "../InvitationFloatingControls";
import { GalleryLightbox } from "../GalleryLightbox";
import { FallingPetals } from "../FallingPetals";
import { useScrollMotion, useParallax } from "../useScrollMotion";
import { ScrollProgress, Burst } from "../MotionKit";
import { DesktopSidePanel } from "../DesktopSidePanel";

/* ------------------------------------------------------------------ */
/* VIEW HELPERS — murni presentasi, tidak menyentuh state / data       */
/* ------------------------------------------------------------------ */

const Eyebrow = ({ children, light = false, className = "" }) => (
  <span
    className={`block text-[10px] font-sans uppercase tracking-[0.4em] font-semibold ${
      light ? "text-[#C8B79B]" : "text-[#7C7369]"
    } ${className}`}
  >
    {children}
  </span>
);

const Ornament = ({ light = false }) => (
  <div className="flex items-center justify-center gap-3" aria-hidden="true">
    <span
      className={`h-px w-10 ${light ? "bg-[#C8B79B]/50" : "bg-[#C8B79B]"}`}
    />
    <span className="h-1.5 w-1.5 rotate-45 bg-amber-600/80" />
    <span
      className={`h-px w-10 ${light ? "bg-[#C8B79B]/50" : "bg-[#C8B79B]"}`}
    />
  </div>
);

const SectionTitle = ({ eyebrow, title, light = false, children }) => (
  <div className="text-center space-y-3">
    <Eyebrow light={light}>{eyebrow}</Eyebrow>
    <h3
      className={`text-4xl font-serif font-light leading-tight ${
        light ? "text-[#FBF9F5]" : "text-[#24201D]"
      }`}
    >
      {title}
    </h3>
    <Ornament light={light} />
    {children}
  </div>
);

/** Satu acara (Akad / Resepsi) — daftar baris bergaris tipis di atas latar gelap */
const EventBlock = ({ no, title, icon: Icon, event, googleCalUrl }) => (
  <article className="border border-[#C8B79B]/30 bg-white/[0.03]">
    <div className="flex items-end justify-between gap-4 px-6 pt-6 pb-5 border-b border-[#C8B79B]/20">
      <div>
        <span className="block text-[10px] font-sans tracking-[0.4em] text-[#C8B79B] mb-2">
          {no}
        </span>
        <h4 className="text-3xl font-serif font-light leading-none text-[#FBF9F5]">
          {title}
        </h4>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C8B79B]/50 text-[#C8B79B]">
        <Icon className="w-4 h-4" />
      </span>
    </div>

    <dl className="px-6 font-sans divide-y divide-[#C8B79B]/20">
      <div className="flex gap-4 py-4">
        <dt className="w-16 shrink-0 pt-0.5 text-[10px] uppercase tracking-[0.25em] text-[#C8B79B]">
          Tanggal
        </dt>
        <dd className="flex-1 flex items-center gap-1.5 text-xs font-bold text-amber-300">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          {event.tanggal}
        </dd>
      </div>
      <div className="flex gap-4 py-4">
        <dt className="w-16 shrink-0 pt-0.5 text-[10px] uppercase tracking-[0.25em] text-[#C8B79B]">
          Waktu
        </dt>
        <dd className="flex-1 flex items-center gap-1.5 text-xs text-[#E8E2D8]">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          {event.waktu}
        </dd>
      </div>
      <div className="flex gap-4 py-4">
        <dt className="w-16 shrink-0 pt-0.5 text-[10px] uppercase tracking-[0.25em] text-[#C8B79B]">
          Lokasi
        </dt>
        <dd className="flex-1 space-y-1">
          <p className="flex items-start gap-1.5 text-xs font-bold text-[#FBF9F5]">
            <MapPin className="w-3.5 h-3.5 mt-px shrink-0 text-rose-300" />
            {event.lokasi}
          </p>
          <p className="text-[11px] leading-relaxed text-[#B9AFA3]">
            {event.alamat}
          </p>
        </dd>
      </div>
    </dl>

    <div className="flex flex-col sm:flex-row gap-2 px-6 pb-6 pt-3 font-sans">
      <a
        href={event.mapUrl}
        target="_blank"
        rel="noreferrer"
        className="flex-1 py-2.5 px-4 border border-[#C8B79B]/60 text-[#FBF9F5] hover:bg-white/10 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>Google Maps</span>
      </a>
      <a
        href={googleCalUrl}
        target="_blank"
        rel="noreferrer"
        className="flex-1 py-2.5 px-4 bg-[#C8B79B] hover:bg-[#D8C9AE] text-[#24201D] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
      >
        <Bell className="w-3.5 h-3.5" />
        <span>Pengingat Kalender</span>
      </a>
    </div>
  </article>
);

/** Profil mempelai — foto berbingkai offset + kartu teks yang menumpuk */
const CoupleBlock = ({
  photo,
  alt,
  role,
  name,
  parentLabel,
  father,
  mother,
  side,
}) => {
  const photoRight = side === "right";
  return (
    <div className="relative">
      <div className={`relative w-[78%] ${photoRight ? "ml-auto" : ""}`}>
        <span
          aria-hidden="true"
          className={`absolute inset-0 border border-[#C8B79B] translate-y-3 ${
            photoRight ? "-translate-x-3" : "translate-x-3"
          }`}
        />
        <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E2D8] shadow-lg">
          <img
            src={photo}
            alt={alt}
            className="w-full h-full object-cover filter contrast-105"
          />
        </div>
      </div>

      <div
        className={`relative -mt-14 w-[84%] bg-white border border-[#E8E2D8] shadow-md p-5 space-y-2 ${
          photoRight ? "" : "ml-auto"
        }`}
      >
        <Eyebrow>{role}</Eyebrow>
        <h4 className="text-2xl font-serif font-normal leading-snug text-[#24201D]">
          {name}
        </h4>
        <span className="block h-px w-8 bg-[#C8B79B]" />
        <p className="text-xs text-[#5A4F46] font-sans leading-relaxed">
          {parentLabel}
          <br />
          <span className="font-semibold text-[#24201D]">
            {father}
          </span> &amp;{" "}
          <span className="font-semibold text-[#24201D]">{mother}</span>
        </p>
      </div>
    </div>
  );
};

export const SereinTheme = ({
  invitation,
  guest,
  rsvps = [],
  onSubmitRsvp,
  isModalView = false,
  onClose,
}) => {
  const toast = useToast();
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedBankIndex, setCopiedBankIndex] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedQrLink, setCopiedQrLink] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // RSVP state
  const [rsvpName, setRsvpName] = useState(guest?.name || "");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpPax, setRsvpPax] = useState("1");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [localRsvps, setLocalRsvps] = useState(rsvps);

  const audioRef = useRef(null);
  const motionRef = useRef(null);
  useScrollMotion(motionRef, isOpened);
  useParallax(motionRef, isOpened);

  useEffect(() => {
    setLocalRsvps(rsvps);
  }, [rsvps]);

  useEffect(() => {
    if (guest?.name) {
      setRsvpName(guest.name);
    }
  }, [guest]);

  const content = invitation?.content_json || {};

  const groom = content.mempelaiPria || "Ahmad Fajar, S.T.";
  const bride = content.mempelaiWanita || "Siti Aminah, S.Pd.";
  const groomFather = content.ayahPria || "Bpk. H. Abdurrahman";
  const groomMother = content.ibuPria || "Ibu Hj. Maryam";
  const brideFather = content.ayahWanita || "Bpk. H. Ahmad Dahlan";
  const brideMother = content.ibuWanita || "Ibu Hj. Fatimah";

  const akad = content.akad || {
    tanggal: "Minggu, 15 November 2026",
    waktu: "08:00 - 10:00 WIB",
    lokasi: "Masjid Agung Al-Akbar Surabaya",
    alamat:
      "Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Kec. Jambangan, Surabaya",
    mapUrl: "https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya",
  };

  const resepsi = content.resepsi || {
    tanggal: "Minggu, 15 November 2026",
    waktu: "11:00 - 14:00 WIB",
    lokasi: "Grand Ballroom Hotel Majapahit, Surabaya",
    alamat: "Jl. Tunjungan No.65, Genteng, Surabaya",
    mapUrl: "https://maps.google.com/?q=Hotel+Majapahit+Surabaya",
  };

  const showQr =
    content.showQr !== undefined
      ? Boolean(content.showQr)
      : content.showQrCheckin !== undefined
      ? Boolean(content.showQrCheckin)
      : true;

  const ayatQuote = content.ayat || "QS. Ar-Rum: 21";
  const photoCover =
    content.fotoCover ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80";
  const photoGroom =
    content.fotoPria ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80";
  const photoBride =
    content.fotoWanita ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80";

  const loveStories = content.kisah || [
    {
      tahun: "2021",
      judul: "Awal Pertemuan",
      cerita:
        "Takdir mempertemukan kami pertama kali di Surabaya dalam sebuah acara edukasi. Dari sekadar obrolan santai, tumbuh ketertarikan dan kekaguman satu sama lain.",
    },
    {
      tahun: "2023",
      judul: "Menjalin Komitmen",
      cerita:
        "Seiring berjalannya waktu, saling memahami visi hidup dan nilai-nilai kebaikan membawa kami pada keputusan untuk melangkah lebih serius bersama dalam ridho Allah.",
    },
    {
      tahun: "2026",
      judul: "Menuju Ikatan Suci",
      cerita:
        "Dengan restu kedua orang tua dan keluarga tercinta, kami memantapkan niat suci ini untuk menyempurnakan separuh agama menuju ikatan pernikahan yang berkah.",
    },
  ];

  const gallery =
    content.galeri && content.galeri.length > 0
      ? content.galeri
      : [
          "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80",
        ];

  const musicUrl =
    content.musicUrl ||
    "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-wedding-113063.mp3";
  const musicTitle = content.musicTitle || "Acoustic Wedding - Romantic Bliss";

  const bankAccounts = content.rekening || [
    { bank: "BCA", nomor: "0182938192", nama: groom.split(",")[0] },
    { bank: "BSI", nomor: "7192830192", nama: bride.split(",")[0] },
  ];

  const giftAddress =
    content.alamatKado ||
    "Serein Residence Blok A-9, Gayungan, Surabaya (Penerima: Fajar & Aminah - 081234567890)";

  const guestName = guest?.name || "Tamu Undangan";
  const isVip = guest?.category === "VIP";
  const qrValue =
    guest?.qr_link ||
    guest?.qr_code ||
    "https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin";

  // Countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date("2026-11-15T08:00:00+07:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const dist = target - now;
      if (dist < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(dist / (1000 * 60 * 60 * 24)),
          hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((dist % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    const isCurrentlyPlaying = isPlayingMusic || (audio && !audio.paused);

    if (isCurrentlyPlaying) {
      if (audio) audio.pause();
      document.querySelectorAll('audio').forEach((el) => {
        try {
          el.pause();
        } catch {}
      });
      setIsPlayingMusic(false);
    } else {
      if (audio) {
        audio
          .play()
          .then(() => setIsPlayingMusic(true))
          .catch((e) => console.log("Audio blocked", e));
      }
    }
  };

  const handleCopyBank = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedBankIndex(index);
    toast.success("Nomor rekening berhasil disalin!");
    setTimeout(() => setCopiedBankIndex(null), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(giftAddress);
    setCopiedAddress(true);
    toast.success("Alamat pengiriman kado berhasil disalin!");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyQrLink = () => {
    navigator.clipboard.writeText(qrValue);
    setCopiedQrLink(true);
    toast.success("Link QR Code Check-In berhasil disalin!");
    setTimeout(() => setCopiedQrLink(false), 2000);
  };

  const handleSendRsvp = (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMessage.trim()) {
      toast.error("Mohon isi nama dan ucapan Anda.");
      return;
    }
    const newRsvp = {
      id: Date.now(),
      guest_name: rsvpName,
      attendance_status: rsvpStatus,
      pax: rsvpPax,
      message: rsvpMessage,
      created_at: new Date().toISOString(),
    };
    setLocalRsvps([newRsvp, ...localRsvps]);
    setRsvpMessage("");
    if (onSubmitRsvp) onSubmitRsvp(newRsvp);
    toast.success("Ucapan dan doa restu Anda telah tercatat!");
  };

  const googleCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `The Wedding of ${groom.split(",")[0]} & ${bride.split(",")[0]}`,
  )}&dates=20261115T010000Z/20261115T070000Z&details=${encodeURIComponent(
    "Pernikahan Suci Ahmad Fajar & Siti Aminah. Mohon doa restu.",
  )}&location=${encodeURIComponent(akad.lokasi)}`;

  // --- Turunan murni untuk tampilan (rumus sama dengan versi sebelumnya) ---
  const groomName = groom.split(",")[0];
  const brideName = bride.split(",")[0];
  const groomFirst = groomName.split(" ")[0];
  const brideFirst = brideName.split(" ")[0];

  const countdownItems = [
    { label: "HARI", val: timeLeft.days },
    { label: "JAM", val: timeLeft.hours },
    { label: "MENIT", val: timeLeft.minutes },
    { label: "DETIK", val: timeLeft.seconds },
  ];

  const sidePanelData = {
    groomShort: groomFirst || (groom ? String(groom).split(',')[0].trim().split(' ')[0] : '') || 'Ahmad',
    brideShort: brideFirst || (bride ? String(bride).split(',')[0].trim().split(' ')[0] : '') || 'Aminah',
    groom,
    bride,
    photoCover,
    photoGroom,
    photoBride,
    gallery,
    akad,
    timeLeft,
    ayatQuote,
  };

  return (
    <div
      ref={motionRef}
      className={`relative w-full max-w-lg md:max-w-none md:w-full lg:max-w-none lg:w-[480px] xl:w-[520px] ${isOpened ? 'min-h-screen md:w-full lg:w-[480px] xl:w-[520px] lg:ml-auto lg:mr-0' : 'h-screen max-h-screen mx-auto md:w-full lg:w-[480px] xl:w-[520px]'} bg-[#FBF9F5] text-[#24201D] shadow-2xl overflow-hidden font-editorial border-x border-[#E8E2D8] selection:bg-[#E8E2D8] scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="serein"
        invitationData={sidePanelData}
        isOpened={isOpened}
        isModalView={isModalView}
      />
      <ScrollProgress color="#7C7369" active={isOpened} />
      {isOpened && (
        <Burst colors={["#C8B79B", "#E8E2D8", "#7C7369", "#FBF9F5"]} />
      )}
      {/* Persistent Audio Tag */}
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />

      {/* Floating Vinyl Player */}
      {isOpened && (
        <MusicVinylPlayer
          musicUrl={musicUrl}
          musicTitle={musicTitle}
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          position="bottom-right"
          theme="serein"
          accentColor="#7C7369"
        />
      )}

      {/* Floating Bookmark QR Pass & Floating Scroll To Top */}
      <InvitationFloatingControls
        qrValue={qrValue}
        guestName={guestName}
        guestCategory={guest?.category || "Reguler"}
        guestPax={guest?.pax || 2}
        isOpened={isOpened}
        showQr={showQr}
        theme="sage"
        accentColor="#7C7369"
      />

      {/* Romantic Falling Petals */}
      {isOpened && <FallingPetals count={6} />}

      {/* ============================================================== */}
      {/* 1. COVER: FULL-BLEED PHOTO, EDITORIAL TYPOGRAPHY               */}
      {/* ============================================================== */}
      <div
        className={`cover-stagger fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-0 md:p-8 lg:p-12 bg-[#FBF9F5] text-[#24201D] transition-all duration-1000 ease-in-out ${
          isOpened
            ? "opacity-0 pointer-events-none -translate-y-full scale-105"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* Full Bleed Backdrop on Desktop */}
        <div
          className="fixed inset-0 bg-cover bg-center pointer-events-none filter contrast-105 opacity-20 md:opacity-30"
          style={{ backgroundImage: `url(${photoCover})` }}
        />
        <div className="fixed inset-0 bg-gradient-to-b from-[#FBF9F5]/90 via-[#FBF9F5]/85 to-[#FBF9F5]/95 pointer-events-none" />

        <div className="relative z-10 flex h-full md:h-auto w-full max-w-lg md:max-w-4xl lg:max-w-5xl flex-col md:flex-row md:items-center md:rounded-3xl md:bg-white/85 md:backdrop-blur-md md:border md:border-[#E8E2D8] md:shadow-2xl overflow-hidden">
          {/* Photo Column */}
          <div className="relative flex-1 min-h-[50vh] md:min-h-[520px] md:w-1/2 overflow-hidden">
            <img
              src={photoCover}
              alt="Mempelai"
              className="absolute inset-0 h-full w-full object-cover filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#FBF9F5] md:from-white/80 via-[#FBF9F5]/70 md:via-white/40 to-transparent" />

            <div className="absolute inset-x-0 top-0 pt-8 text-center space-y-2">
              <span className="block text-[11px] font-sans tracking-[0.4em] uppercase text-white/90 font-medium">
                THE WEDDING OF
              </span>
              <span className="block w-8 h-px bg-white/60 mx-auto" />
            </div>
          </div>

          {/* Content Column */}
          <div className="relative z-10 -mt-14 md:mt-0 px-6 sm:px-8 md:px-12 pb-8 pt-4 md:py-12 text-center md:text-left md:w-1/2 space-y-6">
            <div className="space-y-2">
              <span className="hidden md:block text-[11px] font-sans tracking-[0.3em] uppercase text-[#7C7369]">
                Special Invitation
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-wide text-[#24201D] leading-tight">
                {groomFirst}
                <span className="italic font-sans text-amber-700 mx-2">&amp;</span>
                {brideFirst}
              </h1>
              <p className="text-xs font-sans tracking-[0.3em] text-[#7C7369] uppercase">
                15 November 2026 • Surabaya
              </p>
            </div>

            {/* Guest Recipient */}
            <div className="max-w-xs mx-auto md:mx-0 border-y border-[#C8B79B] py-3.5 space-y-1">
              <p className="text-[11px] text-[#7C7369] font-sans tracking-wide">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </p>
              <h3 className="text-xl font-serif font-semibold text-[#24201D] flex items-center justify-center md:justify-start gap-2">
                {guestName}
                {isVip && (
                  <Badge variant="warning" size="sm" className="font-sans text-[10px]">
                    VIP
                  </Badge>
                )}
              </h3>
              <p className="text-[10px] text-[#8C8379] font-sans italic">
                *Di Tempat / Mohon maaf bila ada kesalahan penulisan gelar
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleOpenInvitation}
                className="btn-sheen w-full max-w-xs mx-auto md:mx-0 py-3.5 px-7 rounded-full bg-[#24201D] text-amber-100 hover:bg-black font-sans font-medium text-xs uppercase tracking-[0.25em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-200" />
                <span>Buka Undangan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN INVITATION BODY                                        */}
      {/* ============================================================== */}
      <div className="relative pb-24">
        {/* HERO */}
        <section className="relative px-6 pt-16 pb-20 text-center space-y-10">
          <div className="space-y-5">
            <Eyebrow>WALIMATUL &apos;URS</Eyebrow>
            <h2 className="font-serif font-light text-[#24201D] leading-[1.05] text-5xl sm:text-6xl">
              {groomName}
              <span className="block text-2xl font-sans italic text-amber-800 my-3 font-light">
                &
              </span>
              {brideName}
            </h2>
            <Ornament />
          </div>

          <div className="relative max-w-xs mx-auto">
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 border border-[#C8B79B]"
            />
            <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E2D8] shadow-xl">
              <img
                src={photoCover}
                alt="Mempelai"
                data-parallax
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>
        </section>

        {/* AYAT SUCI */}
        <section className="px-6 py-16 bg-[#F4EFEA] border-y border-[#E8E2D8]">
          <div className="max-w-md mx-auto text-center space-y-5">
            <div className="font-arabic text-2xl text-[#5A4F46] leading-loose">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <span className="block w-10 h-px bg-[#C8B79B] mx-auto" />
            <p className="text-[11px] font-sans font-bold text-[#7C7369] flex items-center justify-center gap-1.5 uppercase tracking-[0.3em]">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{ayatQuote}</span>
            </p>
            <p className="text-[15px] text-[#5A4F46] italic leading-relaxed font-serif">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia
              menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar
              kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan
              di antaramu rasa kasih dan sayang.&rdquo;
            </p>
          </div>
        </section>

        {/* MEMPELAI */}
        <section className="py-20 px-6 sm:px-8 space-y-14">
          <SectionTitle eyebrow="KEDUA MEMPELAI" title="Mempelai Pengantin" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12 md:gap-8 lg:gap-16 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            <CoupleBlock
              photo={photoGroom}
              alt="Mempelai Pria"
              role="MEMPELAI PRIA"
              name={groom}
              parentLabel="Putra tercinta dari:"
              father={groomFather}
              mother={groomMother}
              side="left"
            />
            <CoupleBlock
              photo={photoBride}
              alt="Mempelai Wanita"
              role="MEMPELAI WANITA"
              name={bride}
              parentLabel="Putri tercinta dari:"
              father={brideFather}
              mother={brideMother}
              side="right"
            />
          </div>
        </section>

        {/* RANGKAIAN ACARA */}
        <section className="px-6 py-20 bg-[#24201D] text-[#FBF9F5] space-y-12">
          <SectionTitle
            light
            eyebrow="RANGKAIAN ACARA"
            title="Waktu & Tempat"
          />

          {/* Countdown */}
          <div className="max-w-md mx-auto text-center space-y-4">
            <Eyebrow light>HITUNG MUNDUR HARI BAHAGIA</Eyebrow>
            <div className="grid grid-cols-4 divide-x divide-[#C8B79B]/30 border-y border-[#C8B79B]/30 py-5 font-sans">
              {countdownItems.map((item, i) => (
                <div key={item.label}>
                  <span
                    className={`block text-3xl font-serif font-light ${
                      i === 3
                        ? "text-amber-300 animate-pulse"
                        : "text-[#FBF9F5]"
                    }`}
                  >
                    <span key={item.val} className="inline-block animate-tick">
                      {item.val}
                    </span>
                  </span>
                  <span className="block mt-1 text-[9px] tracking-[0.25em] text-[#C8B79B]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            <EventBlock
              no="01"
              title="Akad Nikah"
              icon={Heart}
              event={akad}
              googleCalUrl={googleCalUrl}
            />
            <EventBlock
              no="02"
              title="Resepsi Pernikahan"
              icon={Sparkles}
              event={resepsi}
              googleCalUrl={googleCalUrl}
            />
          </div>
        </section>

        {/* KISAH KASIH */}
        {loveStories.length > 0 && (
          <section className="px-6 py-20 bg-[#F4EFEA] border-b border-[#E8E2D8] space-y-12">
            <SectionTitle eyebrow="OUR STORY" title="Kisah Kasih" />

            <div className="max-w-md mx-auto">
              {loveStories.map((story, idx) => (
                <div
                  key={idx}
                  className="group grid grid-cols-[4.5rem_1fr] gap-x-4"
                >
                  <div className="text-right pt-0.5">
                    <span className="block text-2xl font-serif italic font-light text-amber-800 leading-none">
                      {story.tahun}
                    </span>
                    <span className="block mt-1.5 text-[10px] font-sans tracking-wider text-[#7C7369]">
                      Momen #{idx + 1}
                    </span>
                  </div>
                  <div className="relative border-l border-[#C8B79B] pl-5 pb-10 group-last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rotate-45 bg-amber-700"
                    />
                    <h4 className="text-xl font-serif font-normal text-[#24201D]">
                      {story.judul}
                    </h4>
                    <p className="mt-2 text-xs text-[#5A4F46] leading-relaxed font-sans">
                      {story.cerita}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALERI PREWEDDING */}
        <section className="px-6 py-20 space-y-12">
          <SectionTitle eyebrow="GALLERY" title="Galeri Kenangan" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2 max-w-md md:max-w-4xl lg:max-w-md mx-auto">
            {gallery.map((photo, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSelectedPhotoIndex(index);
                  setIsLightboxOpen(true);
                }}
                className={`relative w-full overflow-hidden bg-[#E8E2D8] cursor-pointer group ${
                  index % 3 === 0 ? "col-span-2 h-64" : "h-44"
                }`}
              >
                <img
                  src={photo}
                  alt={`Album ${index}`}
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute left-2.5 top-2 text-[10px] font-sans tracking-[0.25em] text-white/90 drop-shadow">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-0 bg-[#24201D]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-stone-100 font-sans text-xs uppercase tracking-wider">
                  <Camera className="w-4 h-4" />
                  <span>Lihat Foto</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* TANDA KASIH / AMPLOP DIGITAL */}
        <section className="px-6 py-20 bg-[#F4EFEA] border-y border-[#E8E2D8] space-y-12">
          <SectionTitle eyebrow="WEDDING GIFT" title="Tanda Kasih">
            <p className="text-xs text-[#6B5A4E] max-w-sm mx-auto leading-relaxed font-sans pt-1">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika
              memberi adalah tanda kasih Anda, dapat dikirimkan melalui rekening
              berikut:
            </p>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            {bankAccounts.map((acc, index) => (
              <div
                key={index}
                className="relative overflow-hidden bg-[#24201D] text-[#FBF9F5] p-6 space-y-6 font-sans shadow-xl"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#C8B79B]/25"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -top-3 h-36 w-36 rounded-full border border-[#C8B79B]/15"
                />

                <div className="relative flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#C8B79B]">
                    {acc.bank}
                  </span>
                  <Heart className="w-4 h-4 text-[#C8B79B]" />
                </div>

                <div className="relative">
                  <p className="text-2xl font-mono tracking-[0.12em] text-[#FBF9F5]">
                    {acc.nomor}
                  </p>
                  <p className="mt-1.5 text-xs text-[#B9AFA3]">
                    a.n {acc.nama}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyBank(acc.nomor, index)}
                  className="relative w-full py-2.5 border border-[#C8B79B]/50 hover:bg-white/10 text-xs font-semibold text-[#FBF9F5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedBankIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {copiedBankIndex === index
                      ? "Nomor Disalin!"
                      : "Salin Nomor Rekening"}
                  </span>
                </button>
              </div>
            ))}

            {giftAddress && (
              <div className="p-5 bg-white/70 border border-[#C8B79B] text-xs text-[#5A4F46] space-y-3 font-sans text-left md:col-span-2 lg:col-span-1">
                <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] font-bold text-[#7C7369]">
                  <Gift className="w-3.5 h-3.5 text-amber-700" />
                  KIRIM KADO FISIK:
                </span>
                <p className="leading-relaxed">{giftAddress}</p>
                <button
                  onClick={handleCopyAddress}
                  className="py-2 px-3.5 border border-[#24201D] hover:bg-[#24201D] hover:text-amber-100 text-[11px] font-sans text-[#24201D] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedAddress ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>
                    {copiedAddress ? "Alamat Disalin!" : "Salin Alamat"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BUKU TAMU & DOA RESTU */}
        <section className="px-6 py-20 space-y-12">
          <SectionTitle eyebrow="WISHES" title="Buku Tamu & Doa" />

          <div className="max-w-md mx-auto space-y-10">
            <form
              onSubmit={handleSendRsvp}
              className="bg-white p-6 border border-[#E8E2D8] shadow-sm space-y-6 font-sans"
            >
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7C7369]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full mt-1 px-0 py-2.5 bg-transparent border-0 border-b border-[#C8B79B] text-sm text-[#24201D] placeholder:text-[#B9AFA3] focus:outline-none focus:border-[#24201D]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7C7369]">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 mt-2 border border-[#24201D]">
                  {["Hadir", "Ragu-ragu", "Tidak Hadir"].map((st, i) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRsvpStatus(st)}
                      className={`py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                        i > 0 ? "border-l border-[#24201D]" : ""
                      } ${
                        rsvpStatus === st
                          ? "bg-[#24201D] text-amber-100 font-bold"
                          : "bg-transparent text-[#24201D] hover:bg-[#F4EFEA]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {rsvpStatus !== "Tidak Hadir" && (
                <div>
                  <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7C7369]">
                    Jumlah Tamu (Pax)
                  </label>
                  <div className="grid grid-cols-2 mt-2 border border-[#24201D]">
                    {["1 Orang", "2 Orang"].map((px, i) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => setRsvpPax(px)}
                        className={`py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                          i > 0 ? "border-l border-[#24201D]" : ""
                        } ${
                          rsvpPax === px
                            ? "bg-[#24201D] text-amber-100 font-bold"
                            : "bg-transparent text-[#24201D] hover:bg-[#F4EFEA]"
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7C7369]">
                  Untaian Doa & Ucapan
                </label>
                <textarea
                  rows={3}
                  required
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                  className="w-full mt-1 px-0 py-2.5 bg-transparent border-0 border-b border-[#C8B79B] text-sm text-[#24201D] placeholder:text-[#B9AFA3] focus:outline-none focus:border-[#24201D] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#24201D] hover:bg-black text-amber-100 font-bold text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Doa Restu</span>
              </button>
            </form>

            {/* List Ucapan */}
            <div className="space-y-4">
              <Eyebrow>DOA RESTU TERCATAT ({localRsvps.length})</Eyebrow>
              <div className="max-h-80 overflow-y-auto space-y-5 pr-2">
                {localRsvps.map((r, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-[#C8B79B] pl-4 py-0.5 space-y-1.5 font-sans"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-serif text-base font-semibold text-[#24201D]">
                        {r.guest_name}
                      </span>
                      <span
                        className={`shrink-0 text-[10px] px-2 py-0.5 font-medium ${
                          r.attendance_status === "Hadir"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {r.attendance_status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A4F46] leading-relaxed italic">
                      {r.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="px-6 py-20 text-center space-y-6 border-t border-[#E8E2D8] bg-[#F4EFEA]">
          <Heart className="w-5 h-5 mx-auto text-amber-700/70" />

          <p className="text-xs text-[#6B5A4E] max-w-sm mx-auto leading-relaxed font-sans">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada
            kedua mempelai.
          </p>

          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#24201D] font-bold">
            Wassalamu’alaikum Warahmatullahi Wabarakatuh
          </p>

          <Ornament />

          <div className="pt-2 space-y-3">
            <span className="text-[10px] font-sans text-stone-500 uppercase tracking-[0.4em] block">
              KAMI YANG BERBAHAGIA,
            </span>
            <p className="text-4xl font-serif font-light text-[#24201D] leading-tight">
              {groomName}
              <span className="block text-xl font-sans italic text-amber-800 my-1">
                &
              </span>
              {brideName}
            </p>
            <p className="text-xs text-[#6B5A4E] font-sans">
              Beserta Segenap Keluarga Besar
            </p>
          </div>
        </section>
      </div>

      {/* Fullscreen Interactive Lightbox */}
      <GalleryLightbox
        photos={gallery}
        activeIndex={selectedPhotoIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={setSelectedPhotoIndex}
      />
    </div>
  );
};
