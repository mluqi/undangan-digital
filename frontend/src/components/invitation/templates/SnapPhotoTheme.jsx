import { useState, useEffect, useRef } from 'react';
import {
  Clock,
  MapPin,
  Copy,
  Check,
  Heart,
  Send,
  Gift,
  Sparkles,
  Camera,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { GalleryLightbox } from '../GalleryLightbox';
import { useScrollMotion, useParallax } from '../useScrollMotion';
import { ScrollProgress, Burst } from '../MotionKit';
import { DesktopSidePanel } from '../DesktopSidePanel';

export const SnapPhotoTheme = ({
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

  const groom = content.mempelaiPria || 'Ahmad Fajar, S.T.';
  const bride = content.mempelaiWanita || 'Siti Aminah, S.Pd.';
  const groomFather = content.ayahPria || 'Bpk. H. Abdurrahman';
  const groomMother = content.ibuPria || 'Ibu Hj. Maryam';
  const brideFather = content.ayahWanita || 'Bpk. H. Ahmad Dahlan';
  const brideMother = content.ibuWanita || 'Ibu Hj. Fatimah';

  const akad = content.akad || {
    tanggal: 'Minggu, 15 November 2026',
    waktu: '08:00 - 10:00 WIB',
    lokasi: 'Masjid Agung Al-Akbar Surabaya',
    alamat: 'Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Kec. Jambangan, Surabaya',
    mapUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya',
  };

  const resepsi = content.resepsi || {
    tanggal: 'Minggu, 15 November 2026',
    waktu: '11:00 - 14:00 WIB',
    lokasi: 'Grand Ballroom Hotel Majapahit, Surabaya',
    alamat: 'Jl. Tunjungan No.65, Genteng, Surabaya',
    mapUrl: 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
  };

  const showQr =
    content.showQr !== undefined
      ? Boolean(content.showQr)
      : content.showQrCheckin !== undefined
      ? Boolean(content.showQrCheckin)
      : true;

  const ayatQuote = content.ayat || 'QS. Ar-Rum: 21';
  const photoCover =
    content.fotoCover ||
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80';
  const photoGroom =
    content.fotoPria ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80';
  const photoBride =
    content.fotoWanita ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';

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
      judul: 'Menuju Hari Bahagia',
      cerita:
        'Dengan restu kedua orang tua dan keluarga tercinta, kami memantapkan niat suci ini untuk menyempurnakan separuh agama menuju ikatan pernikahan yang berkah.',
    },
  ];

  const gallery =
    content.galeri && content.galeri.length > 0
      ? content.galeri
      : [
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80',
        ];

  const musicUrl =
    content.musicUrl ||
    'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-wedding-113063.mp3';
  const musicTitle = content.musicTitle || 'Acoustic Wedding - Romantic Bliss';

  const bankAccounts = content.rekening || [
    { bank: 'BCA', nomor: '0182938192', nama: groom.split(',')[0] },
    { bank: 'BSI', nomor: '7192830192', nama: bride.split(',')[0] },
  ];

  const giftAddress =
    content.alamatKado ||
    'Perumahan Taman Vintage Blok C-12, Surabaya (Penerima: Fajar & Aminah - 081234567890)';

  const guestName = guest?.name || 'Tamu Undangan';
  const isVip = guest?.category === 'VIP';
  const qrValue =
    guest?.qr_link ||
    guest?.qr_code ||
    'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin';

  // Countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date('2026-11-15T08:00:00+07:00').getTime();
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
          .catch((e) => console.log('Audio blocked', e));
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
    navigator.clipboard.writeText(giftAddress);
    setCopiedAddress(true);
    toast.success('Alamat pengiriman kado berhasil disalin!');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyQrLink = () => {
    navigator.clipboard.writeText(qrValue);
    setCopiedQrLink(true);
    toast.success('Link QR Code Check-In berhasil disalin!');
    setTimeout(() => setCopiedQrLink(false), 2000);
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
      message: rsvpMessage,
      created_at: new Date().toISOString(),
    };
    setLocalRsvps([newRsvp, ...localRsvps]);
    setRsvpMessage('');
    if (onSubmitRsvp) onSubmitRsvp(newRsvp);
    toast.success('Terima kasih, doa restu Anda telah terkirim!');
  };

  const googleCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `The Wedding of ${groom.split(',')[0]} & ${bride.split(',')[0]}`
  )}&dates=20261115T010000Z/20261115T070000Z&details=${encodeURIComponent(
    'Pernikahan Suci Ahmad Fajar & Siti Aminah. Mohon doa restu.'
  )}&location=${encodeURIComponent(akad.lokasi)}`;

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
      className={`relative w-full max-w-lg lg:max-w-none lg:w-[480px] xl:w-[520px] ${isOpened ? 'min-h-screen lg:ml-auto lg:mr-0' : 'h-screen max-h-screen mx-auto'} bg-[#0F1014] text-[#E4E4E7] shadow-2xl overflow-hidden font-sans border-x border-zinc-800 selection:bg-amber-500 selection:text-black scroll-smooth`}
    >
      {/* Panel Showcase Sisi Kiri untuk Layar Desktop */}
      <DesktopSidePanel
        theme="snap-photo"
        invitationData={sidePanelData}
        isOpened={isOpened}
        isModalView={isModalView}
      />
      <ScrollProgress color="#F5B942" active={isOpened} />
      {isOpened && <Burst colors={['#F5B942','#FCD98A','#FFFFFF','#E4E4E7']} />}
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
          theme="dark"
          accentColor="#F5B942"
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
        theme="dark"
        accentColor="#F59E0B"
      />

      {/* ============================================================== */}
      {/* 1. COVER HERO (Aesthetic Dark Photography Cover)               */}
      {/* ============================================================== */}
      <div
        className={`cover-stagger fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto p-6 sm:p-8 md:p-12 lg:p-16 bg-[#0F1014] text-white transition-all duration-1000 ease-in-out ${
          isOpened
            ? 'opacity-0 pointer-events-none -translate-y-full scale-105'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Full Bleed Backdrop with Vignette */}
        <div
          className="fixed inset-0 bg-cover bg-center brightness-60 contrast-115 pointer-events-none"
          style={{ backgroundImage: `url(${photoCover})` }}
        />
        <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 pointer-events-none" />

        <div className="relative z-10 flex min-h-full flex-col justify-between w-full max-w-md md:max-w-5xl lg:max-w-6xl mx-auto">
          {/* Top Header Tag */}
          <div className="text-center md:text-left pt-4 space-y-1">
            <span className="text-[11px] font-cinzel tracking-[0.35em] uppercase text-amber-200/90 font-medium inline-block">
              THE WEDDING CELEBRATION
            </span>
            <div className="w-16 h-px bg-amber-200/50 mx-auto md:mx-0 mt-2" />
          </div>

          {/* Desktop Responsive Content: Split between Left (Names) & Right (Guest & Button) */}
          <div className="my-auto py-8 md:py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
            {/* Couple Names */}
            <div className="text-center md:text-left space-y-3 md:w-1/2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-cinzel font-normal tracking-wide text-white leading-tight">
                {groom.split(',')[0].split(' ')[0]}
                <span className="block md:inline-block text-3xl sm:text-4xl md:text-5xl font-cursive text-amber-300 mx-2 my-1 md:my-0 font-normal">
                  &amp;
                </span>
                {bride.split(',')[0].split(' ')[0]}
              </h1>
              <p className="text-xs md:text-sm font-montserrat tracking-[0.25em] text-zinc-300 uppercase">
                Minggu, 15 November 2026
              </p>
            </div>

            {/* Guest Recipient Box & Button */}
            <div className="space-y-4 w-full max-w-sm mx-auto md:mx-0 md:w-5/12">
              <div className="p-5 sm:p-6 rounded-3xl bg-zinc-950/70 backdrop-blur-md border border-white/15 space-y-2 shadow-2xl text-center md:text-left">
                <p className="text-[11px] text-zinc-400 font-montserrat font-light">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h3 className="text-xl font-cinzel font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  {guestName}
                  {isVip && (
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-sans font-bold rounded-full">
                      VIP
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-zinc-400 italic">
                  *Mohon maaf apabila ada kesalahan penulisan nama/gelar
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleOpenInvitation}
                className="btn-sheen w-full py-4 px-7 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-montserrat font-bold text-xs uppercase tracking-widest shadow-[0_4px_24px_rgba(245,158,11,0.35)] hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buka Undangan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom subtle detail */}
          <div className="text-center md:text-right pb-2 text-[10px] font-montserrat tracking-widest text-zinc-500 uppercase">
            Surabaya • Jawa Timur
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN INVITATION BODY                                        */}
      {/* ============================================================== */}
      <div className="relative pb-24">
        {/* HERO HEADER */}
        <section className="relative min-h-[80vh] flex flex-col justify-end p-6 sm:p-8 overflow-hidden text-center">
          <img
            src={photoCover}
            alt="Hero Prewedding"
            data-parallax
            className="absolute inset-0 w-full h-full object-cover brightness-70 contrast-110 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1014] via-[#0F1014]/40 to-transparent" />

          <div className="relative z-10 space-y-3 pb-6">
            <span className="text-[11px] font-cinzel tracking-[0.3em] uppercase text-amber-300 font-semibold block">
              WALIMATUL 'URS
            </span>
            <h2 className="text-4xl sm:text-5xl font-cinzel text-white leading-tight font-medium">
              {groom.split(',')[0]}
              <span className="block text-2xl font-cursive text-amber-300 my-1 font-normal">
                &
              </span>
              {bride.split(',')[0]}
            </h2>
            <div className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-zinc-200 font-montserrat tracking-widest uppercase">
              15 November 2026 • Surabaya, Jawa Timur
            </div>
          </div>
        </section>

        {/* SALAM & AYAT AL-QUR'AN */}
        <section className="py-16 px-6 text-center space-y-4 border-b border-zinc-800 bg-[#13141A]">
          {/* Basmalah */}
          <div className="font-arabic text-2xl text-amber-300/90 leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <h3 className="text-sm font-semibold text-zinc-200 font-montserrat uppercase tracking-wider">
            Assalamu’alaikum Warahmatullahi Wabarakatuh
          </h3>

          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon
            rahmat dan ridho-Nya, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri
            kami:
          </p>

          <div className="pt-4 max-w-md mx-auto p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <p className="text-xs text-amber-300 font-semibold flex items-center justify-center gap-1.5 font-montserrat">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{ayatQuote}</span>
            </p>
            <p className="text-xs text-zinc-300 italic font-serif leading-relaxed">
              "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan
              untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan
              Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
          </div>
        </section>

        {/* KEDUA MEMPELAI */}
        <section className="py-16 px-6 space-y-12">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-montserrat tracking-[0.3em] text-amber-400 font-semibold">
              KEDUA MEMPELAI
            </span>
            <h3 className="text-3xl font-cinzel font-bold text-white">Mempelai Pengantin</h3>
          </div>

          <div className="space-y-8 max-w-md mx-auto">
            {/* Groom Card */}
            <div className="p-5 rounded-2xl bg-[#16171E] border border-zinc-800 shadow-xl space-y-4">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-inner">
                <img
                  src={photoGroom}
                  alt="Mempelai Pria"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="text-center space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-montserrat font-bold">
                  MEMPELAI PRIA
                </span>
                <h4 className="text-2xl font-cinzel font-bold text-white">{groom}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Putra tercinta dari:
                  <br />
                  <span className="font-semibold text-zinc-200">{groomFather}</span> &{' '}
                  <span className="font-semibold text-zinc-200">{groomMother}</span>
                </p>
              </div>
            </div>

            {/* Bride Card */}
            <div className="p-5 rounded-2xl bg-[#16171E] border border-zinc-800 shadow-xl space-y-4">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-inner">
                <img
                  src={photoBride}
                  alt="Mempelai Wanita"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="text-center space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-rose-400 font-montserrat font-bold">
                  MEMPELAI WANITA
                </span>
                <h4 className="text-2xl font-cinzel font-bold text-white">{bride}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Putri tercinta dari:
                  <br />
                  <span className="font-semibold text-zinc-200">{brideFather}</span> &{' '}
                  <span className="font-semibold text-zinc-200">{brideMother}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RANGKAIAN ACARA (AKAD & RESEPSI) */}
        <section className="py-16 px-6 bg-[#13141A] border-y border-zinc-800 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-montserrat tracking-[0.3em] text-amber-400 font-semibold">
              SAVE THE DATE
            </span>
            <h3 className="text-3xl font-cinzel font-bold text-white">Rangkaian Acara</h3>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            {/* Akad Card */}
            <div className="p-6 rounded-2xl bg-[#16171E] border border-zinc-800 shadow-xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-xl font-cinzel font-bold text-white">Akad Nikah</h4>
                <div className="w-8 h-px bg-amber-400/50 mx-auto my-2" />
                <p className="text-sm font-semibold text-amber-300 font-montserrat">
                  {akad.tanggal}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{akad.waktu}</span>
                </p>
              </div>

              <div className="space-y-1 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                <p className="font-semibold text-white flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  {akad.lokasi}
                </p>
                <p className="text-zinc-400 leading-relaxed text-[11px]">{akad.alamat}</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={akad.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-montserrat font-medium text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Buka Google Maps</span>
                </a>
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-montserrat font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Simpan ke Kalender</span>
                </a>
              </div>
            </div>

            {/* Resepsi Card */}
            <div className="p-6 rounded-2xl bg-[#16171E] border border-zinc-800 shadow-xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-xl font-cinzel font-bold text-white">Resepsi Pernikahan</h4>
                <div className="w-8 h-px bg-amber-400/50 mx-auto my-2" />
                <p className="text-sm font-semibold text-amber-300 font-montserrat">
                  {resepsi.tanggal}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{resepsi.waktu}</span>
                </p>
              </div>

              <div className="space-y-1 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                <p className="font-semibold text-white flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  {resepsi.lokasi}
                </p>
                <p className="text-zinc-400 leading-relaxed text-[11px]">{resepsi.alamat}</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={resepsi.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-montserrat font-medium text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Buka Google Maps</span>
                </a>
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-montserrat font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Simpan ke Kalender</span>
                </a>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="p-6 rounded-2xl bg-[#0F1014] border border-zinc-800 text-center space-y-3">
              <span className="text-xs uppercase font-montserrat tracking-widest text-zinc-400">
                HITUNG MUNDUR HARI BAHAGIA
              </span>
              <div className="grid grid-cols-4 gap-2 font-montserrat text-center">
                <div className="p-3 bg-[#16171E] rounded-xl border border-zinc-800">
                  <span className="text-2xl font-bold text-amber-300 font-cinzel">
                    <span key={timeLeft.days} className="inline-block animate-tick">{timeLeft.days}</span>
                  </span>
                  <span className="block text-[10px] text-zinc-400 font-medium mt-1">HARI</span>
                </div>
                <div className="p-3 bg-[#16171E] rounded-xl border border-zinc-800">
                  <span className="text-2xl font-bold text-amber-300 font-cinzel">
                    <span key={timeLeft.hours} className="inline-block animate-tick">{timeLeft.hours}</span>
                  </span>
                  <span className="block text-[10px] text-zinc-400 font-medium mt-1">JAM</span>
                </div>
                <div className="p-3 bg-[#16171E] rounded-xl border border-zinc-800">
                  <span className="text-2xl font-bold text-amber-300 font-cinzel">
                    <span key={timeLeft.minutes} className="inline-block animate-tick">{timeLeft.minutes}</span>
                  </span>
                  <span className="block text-[10px] text-zinc-400 font-medium mt-1">MENIT</span>
                </div>
                <div className="p-3 bg-[#16171E] rounded-xl border border-zinc-800">
                  <span className="text-2xl font-bold text-amber-400 font-cinzel animate-pulse">
                    <span key={timeLeft.seconds} className="inline-block animate-tick">{timeLeft.seconds}</span>
                  </span>
                  <span className="block text-[10px] text-zinc-400 font-medium mt-1">DETIK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KISAH CINTA (LOVE STORY) */}
        {loveStories.length > 0 && (
          <section className="py-16 px-6 bg-[#13141A] border-y border-zinc-800 space-y-8">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-montserrat tracking-[0.3em] text-amber-400 font-semibold">
                OUR JOURNEY
              </span>
              <h3 className="text-3xl font-cinzel font-bold text-white">Kisah Kasih</h3>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              {loveStories.map((story, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#16171E] border border-zinc-800 space-y-2 relative"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-bold font-montserrat tracking-wider">
                      {story.tahun}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-montserrat">
                      Momen #{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-lg font-cinzel font-bold text-white">{story.judul}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">{story.cerita}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALERI PREWEDDING */}
        <section className="py-16 px-6 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-montserrat tracking-[0.3em] text-amber-400 font-semibold">
              GALLERY
            </span>
            <h3 className="text-3xl font-cinzel font-bold text-white">Momen Bahagia</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {gallery.map((photo, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedPhotoIndex(i);
                  setIsLightboxOpen(true);
                }}
                className={`overflow-hidden rounded-2xl border border-zinc-800 cursor-pointer relative group ${
                  i % 3 === 0 ? 'col-span-2 h-60' : 'h-44'
                }`}
              >
                <img
                  src={photo}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-montserrat font-medium">Lihat Foto</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AMPLOP DIGITAL / TANDA KASIH */}
        <section className="py-16 px-6 bg-[#13141A] border-y border-zinc-800 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-montserrat tracking-[0.3em] text-amber-400 font-semibold">
              WEDDING GIFT
            </span>
            <h3 className="text-3xl font-cinzel font-bold text-white">Tanda Kasih</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika memberi adalah tanda
              kasih Anda, Anda dapat mengirimkan hadiah cashless melalui:
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            {bankAccounts.map((acc, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[#16171E] border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-montserrat font-bold text-amber-300 uppercase tracking-wider">
                    {acc.bank}
                  </span>
                  <Gift className="w-4 h-4 text-zinc-500" />
                </div>

                <div>
                  <p className="text-xl font-mono font-bold tracking-widest text-white">
                    {acc.nomor}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">a.n {acc.nama}</p>
                </div>

                <button
                  onClick={() => handleCopyBank(acc.nomor, index)}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-montserrat font-medium text-white transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedBankIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedBankIndex === index ? 'Nomor Disalin!' : 'Salin Nomor Rekening'}</span>
                </button>
              </div>
            ))}

            {giftAddress && (
              <div className="p-5 rounded-2xl bg-[#16171E] border border-zinc-800 text-xs text-zinc-300 space-y-2">
                <span className="text-[10px] font-montserrat uppercase text-amber-300 font-bold block">
                  KIRIM KADO FISIK:
                </span>
                <p className="leading-relaxed text-zinc-300">{giftAddress}</p>
                <button
                  onClick={handleCopyAddress}
                  className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-montserrat text-zinc-200 transition-colors flex items-center gap-1"
                >
                  {copiedAddress ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAddress ? 'Alamat Disalin!' : 'Salin Alamat'}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BUKU TAMU & DOA RESTU */}
        <section className="py-16 px-6 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-montserrat tracking-[0.3em] text-amber-400 font-semibold">
              WISHES & PRAYERS
            </span>
            <h3 className="text-3xl font-cinzel font-bold text-white">Buku Tamu & Doa</h3>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <form
              onSubmit={handleSendRsvp}
              className="p-6 rounded-2xl bg-[#16171E] border border-zinc-800 space-y-4"
            >
              <div>
                <label className="text-xs font-montserrat text-zinc-300 font-medium">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-montserrat text-zinc-300 font-medium">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {['Hadir', 'Ragu-ragu', 'Tidak Hadir'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRsvpStatus(st)}
                      className={`py-2 rounded-xl text-xs font-montserrat transition-all ${
                        rsvpStatus === st
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {rsvpStatus !== 'Tidak Hadir' && (
                <div>
                  <label className="text-xs font-montserrat text-zinc-300 font-medium">
                    Jumlah Kehadiran (Pax)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {['1 Orang', '2 Orang'].map((px) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => setRsvpPax(px)}
                        className={`py-2 rounded-xl text-xs font-montserrat transition-all ${
                          rsvpPax === px
                            ? 'bg-amber-400 text-zinc-950 font-bold'
                            : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-montserrat text-zinc-300 font-medium">
                  Untaian Doa Restu
                </label>
                <textarea
                  rows={3}
                  required
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
                  className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-montserrat font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Doa Restu</span>
              </button>
            </form>

            {/* List Ucapan Masuk */}
            <div className="space-y-3">
              <span className="text-xs font-montserrat text-zinc-400 uppercase tracking-wider block">
                DOA RESTU TERCATAT ({localRsvps.length})
              </span>
              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {localRsvps.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#16171E] border border-zinc-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs font-montserrat">
                          {r.guest_name ? r.guest_name.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <span className="font-bold text-white font-cinzel">{r.guest_name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-montserrat px-2 py-0.5 rounded-full ${
                          r.attendance_status === 'Hadir'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {r.attendance_status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans pl-9">
                      {r.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING & THANKS */}
        <section className="py-16 px-6 text-center space-y-4 border-t border-zinc-800 bg-[#0F1014]">
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
            berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>

          <p className="text-xs font-montserrat uppercase tracking-wider text-amber-300 font-semibold">
            Wassalamu’alaikum Warahmatullahi Wabarakatuh
          </p>

          <div className="pt-4 space-y-1">
            <span className="text-[10px] font-montserrat text-zinc-500 uppercase tracking-widest block">
              KAMI YANG BERBAHAGIA,
            </span>
            <p className="text-2xl font-cinzel font-bold text-white">
              {groom.split(',')[0]} & {bride.split(',')[0]}
            </p>
            <p className="text-xs text-zinc-400">Beserta Seluruh Keluarga Besar</p>
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
