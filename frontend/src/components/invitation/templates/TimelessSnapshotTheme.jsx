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
/* Motif: film strip, photo corners, frame negatif, label-maker        */
/* ------------------------------------------------------------------ */

const filmHoles = (hole) => ({
  backgroundImage: `linear-gradient(90deg, transparent 0 6px, ${hole} 6px 16px, transparent 16px 22px)`,
  backgroundSize: "22px 9px",
  backgroundRepeat: "repeat-x",
  backgroundPosition: "left center",
});

/** Pita film berlubang */
const FilmStrip = ({ bg = "#2C241D", hole = "#F2EDE4", className = "" }) => (
  <div
    aria-hidden="true"
    className={`h-6 w-full ${className}`}
    style={{ backgroundColor: bg, ...filmHoles(hole) }}
  />
);

/** Sudut album foto (photo corners) — taruh di dalam parent `relative` */
const PhotoCorners = ({ color = "#C9A24B" }) => (
  <>
    {[
      "top-0 left-0",
      "top-0 right-0 rotate-90",
      "bottom-0 right-0 rotate-180",
      "bottom-0 left-0 -rotate-90",
    ].map((pos) => (
      <span
        key={pos}
        aria-hidden="true"
        className={`absolute z-10 h-6 w-6 ${pos}`}
        style={{
          backgroundColor: color,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />
    ))}
  </>
);

/** Label ala label-maker */
const LabelTag = ({ children, light = false, className = "" }) => (
  <span
    className={`inline-block px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.3em] ${
      light ? "bg-[#C9A24B] text-[#2C241D]" : "bg-[#3D332A] text-amber-100"
    } ${className}`}
  >
    {children}
  </span>
);

const SectionHeading = ({ eyebrow, title, light = false, children }) => (
  <div className="text-center space-y-3">
    <LabelTag light={light}>{eyebrow}</LabelTag>
    <h3
      className={`text-3xl font-serif-theme font-bold ${
        light ? "text-[#F9F6F0]" : "text-[#2C241D]"
      }`}
    >
      {title}
    </h3>
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-10 bg-[#C9A24B]/60" />
      <Camera className="w-4 h-4 text-[#C9A24B]" />
      <span className="h-px w-10 bg-[#C9A24B]/60" />
    </div>
    {children}
  </div>
);

/** Satu acara (Akad / Resepsi) sebagai frame negatif film */
const EventFrame = ({ no, title, icon: Icon, event, googleCalUrl }) => (
  <article className="bg-[#2C241D] shadow-xl">
    <FilmStrip hole="#F2EDE4" />
    <div className="mx-0 border-x-8 border-[#2C241D]">
      <div className="bg-white px-6 py-6 text-center space-y-3">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-[#B08A2E]">
          <span>▸ {no}</span>
          <span>{no}A</span>
        </div>

        <div className="w-11 h-11 rounded-full bg-[#EFE8DC] border border-[#DDD0BF] text-[#5C4A3A] flex items-center justify-center mx-auto">
          <Icon className="w-5 h-5" />
        </div>

        <h4 className="text-2xl font-bold text-[#2C241D] font-serif-theme">
          {title}
        </h4>

        <div className="space-y-1.5">
          <p className="text-xs text-[#7A6452] font-sans font-bold flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {event.tanggal}
          </p>
          <p className="text-xs text-[#5C4A3A] font-sans flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {event.waktu}
          </p>
        </div>

        <div className="space-y-1 pt-3 border-t border-dashed border-[#C9A24B]/70">
          <p className="text-xs font-bold text-[#2C241D] flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-700" />
            {event.lokasi}
          </p>
          <p className="text-[11px] text-[#6B5A4E] leading-relaxed font-sans">
            {event.alamat}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-4 rounded-sm border border-[#3D332A] hover:bg-[#F0E9DC] text-xs font-sans text-[#3D332A] font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </a>
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-4 rounded-sm bg-[#3D332A] hover:bg-[#2C241D] text-xs font-sans text-amber-100 font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Pengingat Kalender</span>
          </a>
        </div>
      </div>
    </div>
    <FilmStrip hole="#F2EDE4" />
  </article>
);

/** Cetakan foto bersudut emas di halaman album gelap */
const MountedPrint = ({
  photo,
  alt,
  role,
  name,
  parentLabel,
  father,
  mother,
  tilt,
  frameNo,
}) => (
  <div className="text-center space-y-6">
    <div
      className={`relative mx-auto max-w-[17rem] bg-[#F9F6F0] p-3 pb-8 shadow-2xl ${tilt}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E3DACB]">
        <img
          src={photo}
          alt={alt}
          className="develop-img w-full h-full object-cover"
        />
      </div>
      <PhotoCorners />
      <span className="absolute bottom-2 right-4 font-mono text-[9px] tracking-[0.25em] text-[#8C7662]">
        {frameNo}
      </span>
    </div>

    <div className="space-y-2.5">
      <LabelTag light>{role}</LabelTag>
      <h4 className="text-2xl font-bold font-serif-theme text-[#F9F6F0] leading-snug">
        {name}
      </h4>
      <p className="text-xs text-[#C9BBA6] font-sans leading-relaxed">
        {parentLabel}
        <br />
        <span className="font-semibold text-[#F9F6F0]">
          {father}
        </span> &amp;{" "}
        <span className="font-semibold text-[#F9F6F0]">{mother}</span>
      </p>
    </div>
  </div>
);

export const TimelessSnapshotTheme = ({
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
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80",
        ];

  const musicUrl =
    content.musicUrl ||
    "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-wedding-113063.mp3";
  const musicTitle = content.musicTitle || "Acoustic Wedding - Romantic Bliss";

  const bankAccounts = content.rekening || [
    { bank: "Bank BCA", nomor: "0182938192", nama: groom.split(",")[0] },
    {
      bank: "Bank Syariah Indonesia (BSI)",
      nomor: "7192830192",
      nama: bride.split(",")[0],
    },
  ];

  const giftAddress =
    content.alamatKado ||
    "Perumahan Taman Vintage Blok C-12, Pagesangan, Surabaya (Penerima: Fajar & Aminah - 081234567890)";

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

  const handleOpenEnvelope = () => {
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
      toast.error("Mohon isi nama dan ucapan doa Anda.");
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
    toast.success("Doa restu Anda berhasil dicatat di buku tamu!");
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
      className={`relative w-full max-w-lg lg:max-w-none lg:w-[480px] xl:w-[520px] ${isOpened ? 'min-h-screen lg:ml-auto lg:mr-0' : 'h-screen max-h-screen mx-auto'} bg-[#F9F6F0] text-[#3D332A] shadow-2xl overflow-hidden font-serif-theme border-x border-[#E3DACB] selection:bg-[#E3DACB] scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="timeless"
        invitationData={sidePanelData}
        isOpened={isOpened}
        isModalView={isModalView}
      />
      <ScrollProgress color="#8C7662" active={isOpened} />
      {isOpened && (
        <Burst colors={["#C9A24B", "#E3DACB", "#8C7662", "#F9F6F0"]} />
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
          theme="wood"
          accentColor="#8C7662"
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
        theme="wood"
        accentColor="#8C7662"
      />

      {/* Romantic Falling Petals */}
      {isOpened && <FallingPetals count={8} />}

      {/* ============================================================== */}
      {/* 1. COVER: ROL FILM & TOMBOL SHUTTER                            */}
      {/* ============================================================== */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-10 bg-[#2C241D] transition-all duration-1000 ease-in-out ${
          isOpened
            ? "opacity-0 pointer-events-none -translate-y-full scale-105"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* Full-bleed sepia vintage backdrop photo */}
        <div
          className="fixed inset-0 bg-cover bg-center pointer-events-none opacity-25 md:opacity-35 contrast-125 filter sepia-[0.35]"
          style={{ backgroundImage: `url(${photoCover})` }}
        />
        <div className="fixed inset-0 bg-gradient-to-b from-[#2C241D]/90 via-[#2C241D]/85 to-[#1F1914]/95 pointer-events-none" />

        <div className="cover-stagger relative z-10 m-auto w-full max-w-md md:max-w-4xl lg:max-w-5xl bg-[#FAF6F0] shadow-2xl text-[#3D332A] overflow-hidden rounded-2xl md:rounded-3xl border border-[#E3DACB]">
          <FilmStrip />

          <div className="px-6 sm:px-8 md:px-12 py-7 md:py-10">
            {/* Desktop 2-column layout */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
              {/* Left Side: Polaroid Photo Showcase */}
              <div className="flex flex-col items-center md:w-1/2">
                <div className="mb-4">
                  <LabelTag>THE WEDDING INVITATION</LabelTag>
                </div>
                <div className="relative max-w-[240px] sm:max-w-[270px] md:max-w-[290px] w-full bg-white p-3 pb-6 shadow-2xl border border-stone-200 transform -rotate-2 hover:rotate-0 transition-transform">
                  <img
                    src={photoCover}
                    alt="Mempelai"
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                  <p className="mt-3 font-cursive text-2xl sm:text-3xl text-center text-[#5C4A3A]">
                    {groomFirst} &amp; {brideFirst}
                  </p>
                  <PhotoCorners />
                </div>
              </div>

              {/* Right Side: Details & Shutter Button */}
              <div className="flex flex-col justify-center text-center md:text-left md:w-1/2 space-y-6">
                {/* Names & Date */}
                <div className="space-y-1.5">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-cursive text-[#2C241D] leading-tight">
                    {groomFirst} &amp; {brideFirst}
                  </h1>
                  <p className="text-[11px] md:text-xs font-sans tracking-[0.25em] text-[#7A6452] uppercase">
                    Minggu, 15 November 2026 • Surabaya
                  </p>
                </div>

                {/* Guest Recipient Label */}
                <div className="p-4 sm:p-5 bg-[#F0E9DC] border border-dashed border-[#C9A24B] rounded-xl space-y-1 text-left">
                  <p className="text-[11px] text-[#7A6452] font-sans">
                    Kepada Yth. Bapak/Ibu/Saudara/i:
                  </p>
                  <h3 className="text-xl font-bold text-[#2C241D] font-serif-theme flex items-center gap-2">
                    {guestName}
                    {isVip && (
                      <Badge variant="warning" size="sm" className="font-sans text-[10px]">
                        VIP
                      </Badge>
                    )}
                  </h3>
                  <p className="text-[10px] text-[#8C7662] font-sans italic">
                    *Di Tempat / Mohon maaf bila ada kesalahan penulisan nama &amp; gelar
                  </p>
                </div>

                {/* Shutter Button */}
                <div className="flex flex-col items-center md:items-start gap-2.5 pt-1">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleOpenEnvelope}
                      aria-label="Buka Undangan"
                      className="btn-sheen relative h-16 w-16 md:h-18 md:w-18 overflow-hidden rounded-full bg-[#2C241D] p-1.5 shadow-xl transition-transform active:scale-90 hover:scale-105 cursor-pointer"
                    >
                      <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-[#C9A24B] bg-gradient-to-br from-[#4A3E33] to-[#2C241D]">
                        <span className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-[#F9F6F0] shadow-inner">
                          <Camera className="w-5 h-5 text-[#2C241D]" />
                        </span>
                      </span>
                    </button>
                    <div className="text-left">
                      <span className="block text-xs font-sans font-bold uppercase tracking-[0.25em] text-[#3D332A]">
                        Buka Undangan
                      </span>
                      <span className="block text-[10px] font-sans text-[#7A6452]">
                        Tekan untuk membuka lembaran kenangan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FilmStrip />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN INVITATION BODY                                        */}
      {/* ============================================================== */}
      <div className="relative pb-24">
        {/* HERO SECTION */}
        <section className="relative text-center bg-gradient-to-b from-[#F2EDE4] to-[#F9F6F0] pb-16">
          <FilmStrip />

          <div className="px-6 pt-12 space-y-10">
            <div className="space-y-3">
              <LabelTag>WALIMATUL &apos;URS</LabelTag>
              <h2 className="text-6xl sm:text-7xl font-cursive leading-none text-[#2C241D]">
                {groomFirst} & {brideFirst}
              </h2>
            </div>

            {/* Tumpukan cetakan foto */}
            <div className="relative max-w-xs mx-auto">
              <span
                aria-hidden="true"
                className="absolute inset-0 -rotate-6 bg-[#E3DACB] border border-[#DDD0BF] shadow-md"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 rotate-3 bg-[#EFE8DC] border border-[#DDD0BF] shadow-md"
              />
              <div className="relative bg-white p-3.5 pb-5 shadow-2xl border border-stone-200">
                <img
                  src={photoCover}
                  alt="Mempelai"
                  className="develop-img w-full h-80 object-cover"
                />
                <p className="mt-4 font-cursive text-2xl text-[#5C4A3A]">
                  Moment of Eternity
                </p>
                <PhotoCorners />
              </div>
            </div>
          </div>
        </section>

        {/* AYAT SUCI */}
        <section className="px-6 py-16 bg-[#EFE8DC] border-y border-[#DDD0BF]">
          <div className="max-w-md mx-auto text-center space-y-4">
            <span
              aria-hidden="true"
              className="block h-8 font-serif text-7xl leading-none text-[#C9A24B]/70"
            >
              &ldquo;
            </span>
            <div className="font-arabic text-2xl text-[#5C4A3A] leading-loose">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <p className="text-[11px] font-mono font-bold text-[#7A6452] flex items-center justify-center gap-1.5 uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>{ayatQuote}</span>
            </p>
            <p className="text-sm text-[#5C4A3A] italic leading-relaxed font-serif">
              Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
              pasangan-pasangan untukmu dari jenismu sendiri, agar kamu
              cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di
              antaramu rasa kasih dan sayang.&rdquo;
            </p>
          </div>
        </section>

        {/* MEMPELAI SECTION — HALAMAN ALBUM GELAP */}
        <section className="py-16 px-6 bg-[#2C241D] space-y-14">
          <SectionHeading
            light
            eyebrow="KEDUA MEMPELAI"
            title="Mempelai Pengantin"
          />

          <div className="space-y-16 max-w-md mx-auto">
            <MountedPrint
              photo={photoGroom}
              alt="Mempelai Pria"
              role="MEMPELAI PRIA"
              name={groom}
              parentLabel="Putra tercinta dari:"
              father={groomFather}
              mother={groomMother}
              tilt="-rotate-2"
              frameNo="01A"
            />
            <MountedPrint
              photo={photoBride}
              alt="Mempelai Wanita"
              role="MEMPELAI WANITA"
              name={bride}
              parentLabel="Putri tercinta dari:"
              father={brideFather}
              mother={brideMother}
              tilt="rotate-2"
              frameNo="02A"
            />
          </div>
        </section>

        {/* RANGKAIAN ACARA */}
        <section className="py-16 px-6 bg-[#F2EDE4] border-b border-[#DDD0BF] space-y-10">
          <SectionHeading eyebrow="RANGKAIAN ACARA" title="Waktu & Tempat" />

          {/* Countdown — penghitung frame ala LCD */}
          <div className="max-w-md mx-auto text-center space-y-3">
            <span className="block text-[10px] font-sans uppercase tracking-widest text-[#8C7662]">
              HITUNG MUNDUR MENUJU HARI BAHAGIA
            </span>
            <div className="grid grid-cols-4 gap-2 bg-[#2C241D] p-4 border border-[#3D332A] shadow-inner">
              {countdownItems.map((item, i) => (
                <div key={item.label} className="text-center">
                  <span
                    className={`block font-mono text-3xl font-bold tabular-nums text-[#E8A33D] drop-shadow-[0_0_6px_rgba(232,163,61,0.45)] ${
                      i === 3 ? "animate-pulse" : ""
                    }`}
                  >
                    <span key={item.val} className="inline-block animate-tick">
                      {item.val}
                    </span>
                  </span>
                  <span className="block mt-1 font-sans text-[9px] tracking-widest text-[#B9A58E]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 max-w-md mx-auto">
            <EventFrame
              no="01"
              title="Akad Nikah"
              icon={Heart}
              event={akad}
              googleCalUrl={googleCalUrl}
            />
            <EventFrame
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
          <section className="py-16 px-6 space-y-10">
            <SectionHeading eyebrow="OUR STORY" title="Kisah Kasih" />

            <div className="relative max-w-md mx-auto pl-10">
              <span
                aria-hidden="true"
                className="absolute left-[13px] top-2 bottom-2 border-l-2 border-dotted border-[#C9A24B]/80"
              />
              {loveStories.map((story, idx) => (
                <div key={idx} className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-10 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#3D332A] font-mono text-[10px] text-amber-100 ring-4 ring-[#F9F6F0]"
                  >
                    {idx + 1}
                  </span>
                  <div className="bg-white p-5 border border-[#E3DACB] shadow-sm space-y-2">
                    <div className="flex items-end justify-between border-b border-dashed border-[#C9A24B]/60 pb-2">
                      <span className="font-cursive text-3xl leading-none text-[#B08A2E]">
                        {story.tahun}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-[#8C7662]">
                        Momen #{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-[#2C241D] font-serif-theme">
                      {story.judul}
                    </h4>
                    <p className="text-xs text-[#5C4A3A] leading-relaxed font-sans">
                      {story.cerita}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALERI PREWEDDING — LEMBAR KONTAK */}
        <section className="bg-[#2C241D] pb-16 space-y-10">
          <FilmStrip bg="#1E1813" />

          <div className="px-6 space-y-10">
            <SectionHeading light eyebrow="MOMENTS" title="Galeri Kenangan" />

            <div className="grid grid-cols-2 gap-1.5 max-w-md mx-auto">
              {gallery.map((photo, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedPhotoIndex(index);
                    setIsLightboxOpen(true);
                  }}
                  className={`relative w-full overflow-hidden bg-[#1E1813] p-1.5 cursor-pointer group ${
                    index % 3 === 0 ? "col-span-2 h-60" : "h-44"
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Album ${index}`}
                    className="w-full h-full object-cover sepia-[0.15] group-hover:sepia-0 group-hover:scale-[1.03] transition-all duration-700"
                  />
                  <span className="absolute bottom-2.5 right-3 font-mono text-[10px] font-bold tracking-widest text-[#E8A33D] drop-shadow">
                    {String(index + 1).padStart(2, "0")}A
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* TANDA KASIH / AMPLOP DIGITAL */}
        <section className="py-16 px-6 bg-[#F2EDE4] border-y border-[#DDD0BF] space-y-10">
          <SectionHeading eyebrow="WEDDING GIFT" title="Tanda Kasih">
            <p className="text-xs text-[#6B5A4E] max-w-sm mx-auto leading-relaxed font-sans pt-1">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika
              memberi adalah tanda kasih Anda, dapat dikirimkan melalui rekening
              berikut:
            </p>
          </SectionHeading>

          <div className="space-y-4 max-w-md mx-auto">
            {bankAccounts.map((acc, index) => (
              <div
                key={index}
                className="bg-white p-5 border border-dashed border-[#C9A24B] shadow-sm space-y-3 font-sans"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-block bg-[#3D332A] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100">
                    {acc.bank}
                  </span>
                  <Heart className="w-4 h-4 shrink-0 text-[#C9A24B]" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono tracking-wider text-[#2C241D]">
                    {acc.nomor}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">a.n {acc.nama}</p>
                </div>
                <button
                  onClick={() => handleCopyBank(acc.nomor, index)}
                  className="w-full py-2.5 rounded-sm border border-[#3D332A] hover:bg-[#3D332A] hover:text-amber-100 text-xs font-semibold text-[#3D332A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedBankIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
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
              <div className="p-5 bg-[#F9F6F0] border border-[#DDD0BF] text-xs text-[#5C4A3A] space-y-3 font-sans text-left">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C7662]">
                  <Gift className="w-3.5 h-3.5 text-[#B08A2E]" />
                  KIRIM KADO FISIK:
                </span>
                <p className="leading-relaxed">{giftAddress}</p>
                <button
                  onClick={handleCopyAddress}
                  className="py-2 px-3.5 rounded-sm bg-[#3D332A] hover:bg-[#2C241D] text-[11px] font-sans text-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedAddress ? (
                    <Check className="w-3 h-3 text-emerald-400" />
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
        <section className="py-16 px-6 space-y-10">
          <SectionHeading eyebrow="WISHES" title="Buku Tamu & Doa" />

          <div className="max-w-md mx-auto space-y-8">
            <form
              onSubmit={handleSendRsvp}
              className="bg-white p-6 border border-[#E3DACB] border-t-4 border-t-[#C9A24B] shadow-md space-y-5 font-sans"
            >
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold text-[#7A6452]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-sm bg-[#FAF6F0] border border-[#DDD0BF] text-sm text-[#2C241D] placeholder:text-[#B9A58E] focus:outline-none focus:border-[#8C7662]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold text-[#7A6452]">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {["Hadir", "Ragu-ragu", "Tidak Hadir"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRsvpStatus(st)}
                      className={`py-2.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                        rsvpStatus === st
                          ? "bg-[#3D332A] text-amber-100 font-bold shadow-md"
                          : "bg-[#FAF6F0] border border-[#DDD0BF] text-[#3D332A] hover:bg-[#EFE8DC]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {rsvpStatus !== "Tidak Hadir" && (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold text-[#7A6452]">
                    Jumlah Tamu (Pax)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {["1 Orang", "2 Orang"].map((px) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => setRsvpPax(px)}
                        className={`py-2.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                          rsvpPax === px
                            ? "bg-[#5C4A3A] text-amber-100 font-bold shadow-md"
                            : "bg-[#FAF6F0] border border-[#DDD0BF] text-[#3D332A] hover:bg-[#EFE8DC]"
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold text-[#7A6452]">
                  Untaian Doa & Ucapan
                </label>
                <textarea
                  rows={3}
                  required
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-sm bg-[#FAF6F0] border border-[#DDD0BF] text-sm text-[#2C241D] placeholder:text-[#B9A58E] focus:outline-none focus:border-[#8C7662] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-sm bg-[#3D332A] hover:bg-[#2C241D] text-amber-100 font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Doa Restu</span>
              </button>
            </form>

            {/* List Ucapan */}
            <div className="space-y-3">
              <LabelTag>DOA RESTU TERCATAT ({localRsvps.length})</LabelTag>
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {localRsvps.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-[#E3DACB] border-l-4 border-l-[#C9A24B] shadow-xs space-y-1.5 font-sans"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-serif-theme text-base font-bold text-[#2C241D]">
                        {r.guest_name}
                      </span>
                      <span
                        className={`shrink-0 text-[10px] px-2 py-0.5 rounded-sm font-medium ${
                          r.attendance_status === "Hadir"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {r.attendance_status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C4A3A] leading-relaxed italic">
                      {r.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="bg-[#2C241D] text-[#F2EDE4]">
          <div className="px-6 pt-16 pb-14 text-center space-y-5">
            <p className="text-xs text-[#C9BBA6] max-w-sm mx-auto leading-relaxed font-sans">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
              Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
              kepada kedua mempelai.
            </p>

            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C9A24B] font-bold">
              Wassalamu’alaikum Warahmatullahi Wabarakatuh
            </p>

            <div
              className="flex items-center justify-center gap-3"
              aria-hidden="true"
            >
              <span className="h-px w-10 bg-[#C9A24B]/50" />
              <Camera className="w-4 h-4 text-[#C9A24B]" />
              <span className="h-px w-10 bg-[#C9A24B]/50" />
            </div>

            <div className="pt-2 space-y-2">
              <span className="block font-mono text-[10px] uppercase tracking-[0.35em] text-[#B9A58E]">
                KAMI YANG BERBAHAGIA,
              </span>
              <p className="text-4xl sm:text-5xl font-cursive text-[#F9F6F0] leading-tight">
                {groomName} & {brideName}
              </p>
              <p className="text-xs text-[#C9BBA6] font-sans">
                Beserta Segenap Keluarga Besar
              </p>
            </div>
          </div>
          <FilmStrip bg="#1E1813" />
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
