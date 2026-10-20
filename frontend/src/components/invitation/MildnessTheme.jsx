import { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Heart,
  Mail,
  Send,
  MessageSquare,
  Gift,
  Users,
  ChevronDown,
  Navigation,
  Image as ImageIcon,
  BookOpen,
  Camera,
} from 'lucide-react';
import { Badge } from '../ui';
import { useToast } from '../ui/Toast';
import { MusicVinylPlayer } from './MusicVinylPlayer';
import { InvitationFloatingControls } from './InvitationFloatingControls';
import { GalleryLightbox } from './GalleryLightbox';
import { FallingPetals } from './FallingPetals';
import { useScrollMotion, useParallax } from './useScrollMotion';
import { ScrollProgress, Burst } from './MotionKit';
import { DesktopSidePanel } from './DesktopSidePanel';

export const MildnessTheme = ({
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
  const [activeNav, setActiveNav] = useState('cover');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // RSVP state
  const [rsvpName, setRsvpName] = useState(guest?.name || '');
  const [rsvpStatus, setRsvpStatus] = useState('Hadir');
  const [rsvpPax, setRsvpPax] = useState('1');
  const [rsvpMessage, setRsvpMessage] = useState('');
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

  // Mempelai & Orang Tua
  const groom = content.mempelaiPria || 'Ahmad Fajar, S.T.';
  const bride = content.mempelaiWanita || 'Siti Aminah, S.Pd.';
  const groomFather = content.ayahPria || 'Bpk. H. Abdurrahman';
  const groomMother = content.ibuPria || 'Ibu Hj. Maryam';
  const brideFather = content.ayahWanita || 'Bpk. H. Ahmad Dahlan';
  const brideMother = content.ibuWanita || 'Ibu Hj. Fatimah';

  // Akad & Resepsi
  const akad = content.akad || {
    tanggal: 'Minggu, 15 November 2026',
    waktu: '08:00 - 10:00 WIB',
    lokasi: 'Masjid Agung Al-Akbar Surabaya',
    alamat: 'Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Kec. Jambangan, Surabaya, Jawa Timur 60274',
    mapUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya',
  };

  const resepsi = content.resepsi || {
    tanggal: 'Minggu, 15 November 2026',
    waktu: '11:00 - 14:00 WIB',
    lokasi: 'Grand Ballroom Hotel Majapahit, Surabaya',
    alamat: 'Jl. Tunjungan No.65, Genteng, Kec. Genteng, Surabaya, Jawa Timur 60275',
    mapUrl: 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
  };

  // Visibilitas QR Floating
  const showQr =
    content.showQr !== undefined
      ? Boolean(content.showQr)
      : content.showQrCheckin !== undefined
      ? Boolean(content.showQrCheckin)
      : true;

  // Ayat & Foto
  const ayatQuote = content.ayat || 'QS. Ar-Rum: 21';
  const photoGroom =
    content.fotoPria ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80';
  const photoBride =
    content.fotoWanita ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
  const photoCover =
    content.fotoCover ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80';

  // Kisah Cinta
  const loveStories = content.kisah || [
    {
      tahun: '2021',
      judul: 'Awal Pertemuan',
      cerita:
        'Takdir mempertemukan kami pertama kali di Surabaya dalam sebuah acara edukasi. Dari sekadar obrolan santai, tumbuh ketertarikan dan kekaguman satu sama lain.',
    },
    {
      tahun: '2023',
      judul: 'Menjalin Komitmen',
      cerita:
        'Seiring berjalannya waktu, saling memahami visi hidup dan nilai-nilai kebaikan membawa kami pada keputusan untuk melangkah lebih serius bersama dalam ridho Allah.',
    },
    {
      tahun: '2026',
      judul: 'Lamaran Menuju Akad',
      cerita:
        'Dengan restu kedua orang tua dan keluarga tercinta, kami memantapkan niat suci ini untuk menyempurnakan separuh agama menuju ikatan pernikahan yang berkah.',
    },
  ];

  // Galeri Foto
  const gallery = (content.galeri && content.galeri.length > 0) ? content.galeri : [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80',
  ];

  // Musik
  const musicUrl =
    content.musicUrl ||
    'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-wedding-113063.mp3';
  const musicTitle = content.musicTitle || 'Acoustic Wedding - Romantic Bliss';

  // Rekening Hadiah
  const bankAccounts = content.rekening || [
    {
      bank: 'Bank BCA',
      nomor: '0182938192',
      nama: groom.split(',')[0],
    },
    {
      bank: 'Bank Syariah Indonesia (BSI)',
      nomor: '7192830192',
      nama: bride.split(',')[0],
    },
  ];

  const giftAddress =
    content.alamatKado ||
    'Perumahan Graha Asri Blok C No. 12, Pagesangan, Kec. Jambangan, Surabaya (0812-3456-7890)';

  // Tamu Data
  const guestName = guest?.name || 'Tamu Undangan';
  const isVip = guest?.category === 'VIP';
  const qrValue =
    guest?.qr_link ||
    guest?.qr_code ||
    'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin';

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-11-15T08:00:00+07:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    // Play music
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
          .catch((err) => console.log('Audio playback prevented:', err));
      }
    }
  };

  const handleCopyBank = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedBankIndex(index);
    toast.success('Nomor rekening berhasil disalin!');
    setTimeout(() => setCopiedBankIndex(null), 2000);
  };

  const handleCopyAddress = () => {
    if (giftAddress) {
      navigator.clipboard.writeText(giftAddress);
      setCopiedAddress(true);
      toast.success('Alamat kirim kado berhasil disalin!');
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleCopyQrLink = () => {
    if (guest?.qr_link) {
      navigator.clipboard.writeText(guest.qr_link);
      setCopiedQrLink(true);
      toast.success('Link QR Code Check-In berhasil disalin!');
      setTimeout(() => setCopiedQrLink(false), 2000);
    }
  };

  const handleSendRsvp = (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMessage.trim()) {
      toast.error('Mohon isi nama dan ucapan doa Anda.');
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
    setRsvpMessage('');
    if (onSubmitRsvp) {
      onSubmitRsvp(newRsvp);
    }
    toast.success('Terima kasih atas doa restu dan konfirmasi kehadiran Anda!');
  };

  const scrollToSection = (id) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Google Calendar Link Generator
  const getGoogleCalendarUrl = (title, details, location, startDate, endDate) => {
    const formatTime = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const start = formatTime(new Date(startDate));
    const end = formatTime(new Date(endDate));
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}`;
  };

  const sidePanelData = {
    groomShort: (groom ? String(groom).split(',')[0].trim().split(' ')[0] : '') || 'Ahmad',
    brideShort: (bride ? String(bride).split(',')[0].trim().split(' ')[0] : '') || 'Aminah',
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
      className={`relative w-full max-w-lg md:max-w-none md:w-full lg:max-w-none lg:w-[480px] xl:w-[520px] ${isOpened ? 'min-h-screen md:w-full lg:w-[480px] xl:w-[520px] lg:ml-auto lg:mr-0' : 'h-screen max-h-screen mx-auto md:w-full lg:w-[480px] xl:w-[520px]'} bg-[#FAF8F5] text-stone-800 shadow-2xl overflow-hidden font-sans border-x border-stone-200 selection:bg-amber-100 scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="mildness"
        invitationData={sidePanelData}
        isOpened={isOpened}
        isModalView={isModalView}
      />
      <ScrollProgress color="#B45309" active={isOpened} />
      {isOpened && <Burst colors={['#D6A24B','#E8D5A8','#A8B89A','#F3E9D6']} />}
      {/* Persistent Audio Tag */}
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
      />

      {/* Floating Vinyl Player */}
      {isOpened && (
        <MusicVinylPlayer
          musicUrl={musicUrl}
          musicTitle={musicTitle}
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          position="bottom-right"
          theme="sage"
          accentColor="#6B9080"
        />
      )}

      {/* Floating Bookmark QR Pass & Floating Scroll To Top */}
      <InvitationFloatingControls
        qrValue={qrValue}
        guestName={guestName}
        guestCategory={guest?.category || 'Reguler'}
        guestPax={guest?.pax || 2}
        isOpened={isOpened}
        showQr={showQr}
        theme="sage"
        accentColor="#B45309"
      />

      {/* Romantic Falling Petals Ambient Effect */}
      {isOpened && <FallingPetals count={12} />}

      {/* ============================================================== */}
      {/* FULLSCREEN COVER / OPENING MODAL                               */}
      {/* ============================================================== */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#FAF8F5] transition-all duration-1000 ease-in-out ${
          isOpened
            ? 'opacity-0 pointer-events-none -translate-y-full'
            : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Full-bleed subtle backdrop photo on desktop */}
        <div
          className="fixed inset-0 bg-cover bg-center pointer-events-none filter contrast-105 opacity-20 md:opacity-30 transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${photoCover})` }}
        />
        <div className="fixed inset-0 bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/85 to-[#FAF8F5]/95 pointer-events-none" />

        {/* Soft Floral Watermark Ornaments */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-amber-100/60 to-transparent pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial from-stone-200/60 to-transparent pointer-events-none blur-3xl" />

        <div className="cover-stagger relative z-10 w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-12 min-h-[90vh] md:min-h-[80vh] justify-between">
          {/* Left Column (Desktop): Center Couple Photo Frame */}
          <div className="flex flex-col items-center justify-center md:w-1/2">
            <div className="relative my-4 md:my-0 animate-float">
              <div className="w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-84 rounded-t-full rounded-b-2xl overflow-hidden p-2 bg-gradient-to-b from-amber-200 via-stone-200 to-amber-100 shadow-2xl border border-white">
                <img
                  src={photoCover}
                  alt="Couple"
                  className="w-full h-full object-cover rounded-t-full rounded-b-xl"
                />
              </div>
              {/* Corner Decorative Accent */}
              <div className="absolute -bottom-3 -right-3 w-11 h-11 rounded-full bg-white/95 shadow-lg border border-amber-200/60 flex items-center justify-center">
                <Heart className="w-5 h-5 text-amber-700 fill-amber-700/20" />
              </div>
            </div>
          </div>

          {/* Right Column (Desktop): Invitation Details & Action */}
          <div className="flex flex-col justify-center text-center md:text-left md:w-1/2 space-y-5">
            {/* Header Tag */}
            <div className="space-y-1 pt-2 md:pt-0">
              <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-medium block">
                The Wedding Of
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-cursive text-stone-800 leading-tight">
                {groom.split(',')[0].split(' ')[0]} &amp; {bride.split(',')[0].split(' ')[0]}
              </h1>
            </div>

            {/* Date Breakdown Box (Mildness Signature Style) */}
            <div className="inline-flex self-center md:self-start py-2.5 px-6 rounded-2xl bg-white/90 border border-stone-200/80 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-center divide-x divide-stone-200 text-stone-700 text-xs tracking-wider">
                <div className="px-3 uppercase font-medium">Minggu</div>
                <div className="px-4 text-xl font-bold font-serif-theme text-stone-900">15</div>
                <div className="px-3 uppercase font-medium">Nov 2026</div>
              </div>
            </div>

            {/* Kepada Yth. & Guest Box */}
            <div className="w-full space-y-4">
              <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm backdrop-blur-md text-center md:text-left">
                <p className="text-xs text-stone-500 font-light mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                <h3 className="text-xl font-bold text-stone-900 font-serif-theme flex items-center justify-center md:justify-start gap-2">
                  {guestName}
                  {isVip && (
                    <Badge variant="warning" size="sm" className="font-sans font-bold text-[10px]">
                      VIP
                    </Badge>
                  )}
                </h3>
                <p className="text-[11px] text-stone-400 italic mt-1">
                  *Mohon maaf bila ada kesalahan penulisan nama/gelar
                </p>
              </div>

              {/* Buka Undangan Button with Elegant Wax Seal Accent */}
              <div className="relative group max-w-sm mx-auto md:mx-0">
                <button
                  type="button"
                  onClick={handleOpenInvitation}
                  className="btn-sheen relative w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-amber-100 font-medium text-xs tracking-[0.2em] uppercase shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer border border-amber-300/30"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3 h-3 text-amber-200" />
                  </div>
                  <span className="font-serif-theme font-bold text-amber-100 text-sm">
                    Buka Undangan
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN INVITATION CONTENT (SCROLLABLE)                           */}
      {/* ============================================================== */}
      <div className="relative pb-24">
        {/* SECTION 1: COVER HERO SECTION */}
        <section
          id="cover"
          className="relative min-h-[92vh] flex flex-col items-center justify-between p-6 text-center bg-gradient-to-b from-stone-100 via-[#FAF8F5] to-[#FAF8F5]"
        >
          {/* Top Leaf Accent Pattern */}
          <div className="pt-6 space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
              Walimatul 'Urs
            </p>
            <h2 className="text-4xl md:text-5xl font-cursive text-stone-800">
              {groom.split(',')[0].split(' ')[0]} & {bride.split(',')[0].split(' ')[0]}
            </h2>
          </div>

          {/* Hero Portrait Frame */}
          <div className="my-6 relative">
            <div className="w-56 h-72 rounded-t-full rounded-b-3xl overflow-hidden p-2 bg-white shadow-2xl border border-stone-200/80">
              <img
                src={photoCover}
                alt="The Couple"
                data-parallax
                className="w-full h-full object-cover rounded-t-full rounded-b-2xl scale-110"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-md border border-stone-200 text-xs font-serif-theme tracking-wider text-stone-700 whitespace-nowrap">
              15 November 2026
            </div>
          </div>

          {/* Invitation Opening Salutation */}
          <div className="max-w-xs space-y-3 pb-4">
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu
              dari jenismu sendiri..."
            </p>
            <div className="flex justify-center text-amber-700">
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </div>
        </section>

        {/* SECTION 2: AYAT SUCI (SURAH AR-RUM: 21) */}
        <section className="py-12 px-6 text-center bg-white/70 border-y border-stone-200/60 relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-6">
            {/* Bismillah */}
            <p className="text-2xl font-arabic text-stone-800 tracking-wide font-normal">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>

            {/* Arabic Verse */}
            <p className="text-xl md:text-2xl font-arabic text-stone-800 leading-loose">
              وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا
              اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗاِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ
              لِّقَوْمٍ يَّتَفَكَّرُوْنَ
            </p>

            {/* Translation */}
            <p className="text-xs text-stone-600 leading-relaxed italic font-light max-w-sm mx-auto">
              "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu
              dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia
              menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu
              benar-benar terdapat tanda-tanda bagi kaum yang berpikir."
            </p>

            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-medium tracking-wide">
              {ayatQuote}
            </span>
          </div>
        </section>

        {/* SECTION 3: PASANGAN MEMPELAI (BRIDE & GROOM) */}
        <section id="couple" className="py-16 px-6 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
              Mempelai Bahagia
            </span>
            <h2 className="text-3xl font-serif-theme font-bold text-stone-800">
              Assalamu'alaikum Wr. Wb.
            </h2>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang
              Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            {/* MEMPELAI WANITA */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm w-full max-w-sm mx-auto space-y-4 transition-all hover:shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-36 h-48 mx-auto rounded-t-full rounded-b-2xl overflow-hidden p-1.5 bg-gradient-to-b from-stone-200 to-amber-100 shadow-md">
                  <img
                    src={photoBride}
                    alt={bride}
                    className="w-full h-full object-cover rounded-t-full rounded-b-xl"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-cursive text-stone-900">{bride}</h3>
                  <p className="text-xs text-stone-500 font-medium">Mempelai Wanita</p>
                </div>
              </div>
              <div className="text-xs text-stone-600 space-y-0.5 border-t border-stone-100 pt-3">
                <p className="text-stone-400 text-[11px]">Putri tercinta dari:</p>
                <p className="font-semibold text-stone-800">{brideFather}</p>
                <p className="text-stone-500">&</p>
                <p className="font-semibold text-stone-800">{brideMother}</p>
              </div>
            </div>

            {/* Ampersand Divider */}
            <div className="hidden lg:flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-stone-300" />
              <span className="text-3xl font-cursive text-amber-800">&</span>
              <span className="h-px w-12 bg-stone-300" />
            </div>

            {/* MEMPELAI PRIA */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm w-full max-w-sm mx-auto space-y-4 transition-all hover:shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-36 h-48 mx-auto rounded-t-full rounded-b-2xl overflow-hidden p-1.5 bg-gradient-to-b from-stone-200 to-amber-100 shadow-md">
                  <img
                    src={photoGroom}
                    alt={groom}
                    className="w-full h-full object-cover rounded-t-full rounded-b-xl"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-cursive text-stone-900">{groom}</h3>
                  <p className="text-xs text-stone-500 font-medium">Mempelai Pria</p>
                </div>
              </div>
              <div className="text-xs text-stone-600 space-y-0.5 border-t border-stone-100 pt-3">
                <p className="text-stone-400 text-[11px]">Putra tercinta dari:</p>
                <p className="font-semibold text-stone-800">{groomFather}</p>
                <p className="text-stone-500">&</p>
                <p className="font-semibold text-stone-800">{groomMother}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: WAKTU & TEMPAT ACARA (SAVE THE DATE & SCHEDULE) */}
        <section id="event" className="py-16 px-6 bg-[#F4F1EA] border-y border-stone-200/80">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
              Save The Date
            </span>
            <h2 className="text-3xl font-serif-theme font-bold text-stone-800">
              Rangkaian Acara
            </h2>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Insya Allah acara pernikahan kami akan diselenggarakan pada:
            </p>
          </div>

          {/* COUNTDOWN TIMER */}
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-10 text-center">
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
              <span className="text-2xl font-bold font-serif-theme text-stone-900">
                <span key={timeLeft.days} className="inline-block animate-tick">{timeLeft.days}</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-stone-400 mt-0.5">Hari</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
              <span className="text-2xl font-bold font-serif-theme text-stone-900">
                <span key={timeLeft.hours} className="inline-block animate-tick">{timeLeft.hours}</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-stone-400 mt-0.5">Jam</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
              <span className="text-2xl font-bold font-serif-theme text-stone-900">
                <span key={timeLeft.minutes} className="inline-block animate-tick">{timeLeft.minutes}</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-stone-400 mt-0.5">Menit</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
              <span className="text-2xl font-bold font-serif-theme text-stone-900">
                <span key={timeLeft.seconds} className="inline-block animate-tick">{timeLeft.seconds}</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-stone-400 mt-0.5">Detik</p>
            </div>
          </div>

          {/* EVENT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            {/* AKAD NIKAH CARD */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0" />
              <div className="relative z-10 space-y-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold tracking-wider uppercase">
                  Akad Nikah
                </span>

                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-center gap-2 text-stone-700">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span className="font-medium text-sm">{akad.tanggal}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-stone-700">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span className="text-sm">{akad.waktu}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span className="font-semibold text-sm">{akad.lokasi}</span>
                  </div>
                  {akad.alamat && (
                    <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                      {akad.alamat}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={
                      akad.mapUrl ||
                      `https://maps.google.com/?q=${encodeURIComponent(akad.lokasi)}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center justify-center gap-2 shadow"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Petunjuk Lokasi (Google Maps)</span>
                  </a>

                  <a
                    href={getGoogleCalendarUrl(
                      `Akad Nikah ${groom.split(' ')[0]} & ${bride.split(' ')[0]}`,
                      `Akad Nikah di ${akad.lokasi}`,
                      akad.lokasi,
                      '2026-11-15T08:00:00+07:00',
                      '2026-11-15T10:00:00+07:00'
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 text-stone-700 text-xs font-medium hover:bg-stone-200 transition-all flex items-center justify-center gap-2 border border-stone-200"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Simpan ke Kalender</span>
                  </a>
                </div>
              </div>
            </div>

            {/* RESEPSI PERNIKAHAN CARD */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0" />
              <div className="relative z-10 space-y-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold tracking-wider uppercase">
                  Resepsi Pernikahan
                </span>

                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-center gap-2 text-stone-700">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span className="font-medium text-sm">{resepsi.tanggal}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-stone-700">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span className="text-sm">{resepsi.waktu}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span className="font-semibold text-sm">{resepsi.lokasi}</span>
                  </div>
                  {resepsi.alamat && (
                    <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                      {resepsi.alamat}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={
                      resepsi.mapUrl ||
                      `https://maps.google.com/?q=${encodeURIComponent(resepsi.lokasi)}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center justify-center gap-2 shadow"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Petunjuk Lokasi (Google Maps)</span>
                  </a>

                  <a
                    href={getGoogleCalendarUrl(
                      `Resepsi Pernikahan ${groom.split(' ')[0]} & ${bride.split(' ')[0]}`,
                      `Resepsi di ${resepsi.lokasi}`,
                      resepsi.lokasi,
                      '2026-11-15T11:00:00+07:00',
                      '2026-11-15T14:00:00+07:00'
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 text-stone-700 text-xs font-medium hover:bg-stone-200 transition-all flex items-center justify-center gap-2 border border-stone-200"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Simpan ke Kalender</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: KISAH KASIH (LOVE STORY - OPSIONAL) */}
        {loveStories && loveStories.length > 0 && (
          <section id="story" className="py-16 px-6 bg-white border-y border-stone-200/80">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
                Our Journey
              </span>
              <h2 className="text-3xl font-serif-theme font-bold text-stone-800">
                Kisah Kasih Kami
              </h2>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Bagaimana takdir mempertemukan dan menumbuhkan rasa hingga melangkah ke jenjang suci
              </p>
            </div>

            <div className="max-w-sm mx-auto relative pl-6 border-l-2 border-amber-200/80 space-y-8">
              {loveStories.map((story, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-4 border-amber-600 shadow-sm" />

                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {story.tahun}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 font-serif-theme">
                      {story.judul}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      {story.cerita}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 7: GALERI FOTO (MOMEN BAHAGIA) */}
        <section id="gallery" className="py-16 px-6 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
              Gallery
            </span>
            <h2 className="text-3xl font-serif-theme font-bold text-stone-800">Momen Bahagia</h2>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Kenangan indah perjalanan cinta kami yang terabadikan dalam potret bahagia
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3 max-w-md md:max-w-4xl lg:max-w-md mx-auto">
            {gallery.map((photo, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedPhotoIndex(index);
                  setIsLightboxOpen(true);
                }}
                className={`overflow-hidden rounded-2xl shadow-sm border border-stone-200 cursor-pointer group relative ${
                  index % 3 === 0 ? 'col-span-2 h-56' : 'h-40'
                }`}
              >
                <img
                  src={photo}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                  <Camera className="w-5 h-5 drop-shadow" />
                  <span className="text-xs font-medium drop-shadow">Lihat Foto</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: TANDA KASIH (WEDDING GIFT / CASHLESS ENVELOPE) */}
        <section id="gift" className="py-16 px-6 bg-[#F4F1EA] border-y border-stone-200/80">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
              Wedding Gift
            </span>
            <h2 className="text-3xl font-serif-theme font-bold text-stone-800">Tanda Kasih</h2>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Doa restu Anda merupakan karunia yang sangat berarti bagi kedua mempelai. Namun jika
              memberi adalah ungkapan tanda kasih Anda, Anda dapat mengirimkan hadiah secara
              cashless melalui nomor rekening berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-md md:max-w-4xl lg:max-w-md mx-auto items-stretch">
            {bankAccounts.map((acc, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    {acc.bank}
                  </span>
                  <Gift className="w-4 h-4 text-stone-400" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-stone-400">Nomor Rekening:</p>
                  <p className="text-xl font-bold font-mono text-stone-900 tracking-wider">
                    {acc.nomor}
                  </p>
                  <p className="text-xs text-stone-600 font-medium">a.n {acc.nama}</p>
                </div>

                <button
                  onClick={() => handleCopyBank(acc.nomor, index)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-all flex items-center justify-center gap-2 border border-stone-200"
                >
                  {copiedBankIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">
                        Nomor Rekening Disalin!
                      </span>
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

            {/* OPSI KIRIM KADO FISIK */}
            {giftAddress && (
              <div className="bg-white rounded-3xl p-5 border border-stone-200 text-left space-y-2 md:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Alamat Pengiriman Kado
                  </span>
                  <MapPin className="w-4 h-4 text-amber-700" />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{giftAddress}</p>
                <button
                  onClick={handleCopyAddress}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-stone-200 cursor-pointer"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Alamat Berhasil Disalin!</span>
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

        {/* SECTION 9: RSVP & UCAPAN DOA RESTU (BUKU TAMU) */}
        <section id="wishes" className="py-16 px-6 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
              Guest Book
            </span>
            <h2 className="text-3xl font-serif-theme font-bold text-stone-800">
              Ucapan & Doa Restu
            </h2>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Tinggalkan pesan ucapan manis dan doa restu terbaik Anda untuk kedua mempelai
            </p>
          </div>

          {/* Form RSVP */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm max-w-sm mx-auto text-left">
            <form onSubmit={handleSendRsvp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Masukkan nama Anda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-stone-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Hadir', 'Ragu-ragu', 'Tidak Hadir'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setRsvpStatus(status)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        rsvpStatus === status
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {rsvpStatus !== 'Tidak Hadir' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Jumlah Kehadiran (Pax)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['1 Orang', '2 Orang'].map((pax) => (
                      <button
                        key={pax}
                        type="button"
                        onClick={() => setRsvpPax(pax)}
                        className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                          rsvpPax === pax
                            ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-xs'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {pax}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pesan Ucapan & Doa
                </label>
                <textarea
                  rows="3"
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Tulis ucapan dan doa terbaik Anda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-stone-400 focus:outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ucapan & Konfirmasi</span>
              </button>
            </form>
          </div>

          {/* Feed Daftar Ucapan */}
          <div className="max-w-sm mx-auto space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Doa Restu Tamu ({localRsvps.length})
            </h4>

            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {localRsvps.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-xs text-stone-400 border border-stone-100">
                  Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
                </div>
              ) : (
                localRsvps.map((rsvp, idx) => (
                  <div
                    key={rsvp.id || idx}
                    className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                          {rsvp.guest_name ? rsvp.guest_name.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <span className="font-semibold text-xs text-stone-900">
                          {rsvp.guest_name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          rsvp.attendance_status === 'Hadir'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rsvp.attendance_status === 'Tidak Hadir'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rsvp.attendance_status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-light pl-9">
                      {rsvp.message}
                    </p>
                    <p className="text-[10px] text-stone-400 pl-9">
                      {rsvp.created_at
                        ? new Date(rsvp.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Baru saja'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* SECTION 10: PENUTUP / CLOSING & SIGNATURE */}
        <section className="py-20 px-6 text-center space-y-8 bg-gradient-to-t from-stone-100 to-[#FAF8F5] border-t border-stone-200">
          <div className="max-w-sm mx-auto space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga, apabila
              Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do'a restu kepada kami.
            </p>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Atas kehadiran dan do'a restunya kami ucapkan terima kasih yang sebesar-besarnya.
            </p>
            <p className="text-xs font-serif-theme font-medium text-stone-800">
              Wassalamu'alaikum Warahmatullahi Wabarakatuh
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-xs uppercase tracking-widest text-stone-400">Kami yang berbahagia,</p>
            <h2 className="text-4xl md:text-5xl font-cursive text-stone-900">
              {groom.split(',')[0].split(' ')[0]} & {bride.split(',')[0].split(' ')[0]}
            </h2>
            <p className="text-xs text-stone-500 pt-1">
              Keluarga Besar {groomFather} & {brideFather}
            </p>
          </div>

          <div className="pt-8 border-t border-stone-200/60 text-center space-y-1">
            <p className="font-serif-theme text-xs text-stone-500 italic">
              The Wedding of {groom.split(',')[0].split(' ')[0]} & {bride.split(',')[0].split(' ')[0]}
            </p>
            <p className="text-[10px] text-stone-400">
              Terima kasih atas doa restu & kehadiran Anda
            </p>
          </div>
        </section>
      </div>

      {/* ============================================================== */}
      {/* FLOATING BOTTOM NAVIGATION BAR (WEVITATION MILDNESS STYLE)     */}
      {/* ============================================================== */}
      {isOpened && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-stone-900/90 text-stone-300 rounded-full px-4 py-2.5 shadow-2xl backdrop-blur-md border border-stone-700/80 flex items-center gap-4 transition-all">
          <button
            onClick={() => scrollToSection('cover')}
            className={`p-1.5 rounded-full hover:text-white transition-colors ${
              activeNav === 'cover' ? 'text-amber-400' : ''
            }`}
            title="Sampul"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('couple')}
            className={`p-1.5 rounded-full hover:text-white transition-colors ${
              activeNav === 'couple' ? 'text-amber-400' : ''
            }`}
            title="Mempelai"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('event')}
            className={`p-1.5 rounded-full hover:text-white transition-colors ${
              activeNav === 'event' ? 'text-amber-400' : ''
            }`}
            title="Acara"
          >
            <Calendar className="w-4 h-4" />
          </button>
          {loveStories && loveStories.length > 0 && (
            <button
              onClick={() => scrollToSection('story')}
              className={`p-1.5 rounded-full hover:text-white transition-colors ${
                activeNav === 'story' ? 'text-amber-400' : ''
              }`}
              title="Kisah Kasih"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => scrollToSection('gallery')}
            className={`p-1.5 rounded-full hover:text-white transition-colors ${
              activeNav === 'gallery' ? 'text-amber-400' : ''
            }`}
            title="Galeri"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('gift')}
            className={`p-1.5 rounded-full hover:text-white transition-colors ${
              activeNav === 'gift' ? 'text-amber-400' : ''
            }`}
            title="Tanda Kasih"
          >
            <Gift className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('wishes')}
            className={`p-1.5 rounded-full hover:text-white transition-colors ${
              activeNav === 'wishes' ? 'text-amber-400' : ''
            }`}
            title="Buku Tamu"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </nav>
      )}

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
