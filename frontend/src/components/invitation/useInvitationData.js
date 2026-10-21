import { useState, useEffect, useRef, useMemo } from 'react';
import { useToast } from '../ui/Toast';

const DEFAULT_PHOTOS = {
  cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
  groom: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  bride: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80',
  ],
};

const DEFAULT_STORIES = [
  {
    tahun: '2021',
    judul: 'Awal Pertemuan',
    cerita:
      'Takdir mempertemukan kami pertama kali dalam sebuah acara. Dari obrolan sederhana, tumbuh rasa nyaman dan saling mengagumi.',
  },
  {
    tahun: '2023',
    judul: 'Menjalin Komitmen',
    cerita:
      'Seiring waktu, kami saling memahami dan memantapkan hati untuk melangkah lebih serius bersama dengan restu keluarga.',
  },
  {
    tahun: '2026',
    judul: 'Menuju Hari Bahagia',
    cerita:
      'Dengan restu kedua orang tua, kami memantapkan niat suci untuk menyempurnakan separuh agama dalam ikatan pernikahan.',
  },
];

const firstName = (full = '') => full.split(',')[0].trim().split(' ')[0];
const plainName = (full = '') => full.split(',')[0].trim();

/**
 * Hook bersama untuk semua template: mengambil data dinamis dari content_json
 * beserta state & handler (musik, countdown, copy, RSVP) sehingga komponen
 * template cukup fokus pada tampilan.
 */
export const useInvitationData = ({ invitation, guest, rsvps = [], onSubmitRsvp }) => {
  const toast = useToast();
  const content = invitation?.content_json || {};

  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedBankIndex, setCopiedBankIndex] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedQrLink, setCopiedQrLink] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState(guest?.name || '');
  const [rsvpStatus, setRsvpStatus] = useState('Hadir');
  const [rsvpPax, setRsvpPax] = useState('1 Orang');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [localRsvps, setLocalRsvps] = useState(rsvps);
  const [hasJustSubmitted, setHasJustSubmitted] = useState(false);

  useEffect(() => setLocalRsvps(rsvps), [rsvps]);
  useEffect(() => {
    if (guest?.name) setRsvpName(guest.name);
  }, [guest]);

  const activeGuestName = (rsvpName || guest?.name || '').trim();
  const storageKey =
    invitation?.id && activeGuestName && activeGuestName !== 'Tamu Undangan'
      ? `rsvp_done_${invitation.id}_${encodeURIComponent(activeGuestName.toLowerCase())}`
      : null;

  const hasSubmitted = useMemo(() => {
    if (hasJustSubmitted) return true;
    if (!activeGuestName || activeGuestName === 'Tamu Undangan') return false;

    if (storageKey && typeof window !== 'undefined') {
      try {
        if (localStorage.getItem(storageKey) === 'true') return true;
      } catch (e) {}
    }

    return localRsvps.some(
      (r) => r.guest_name && r.guest_name.trim().toLowerCase() === activeGuestName.toLowerCase()
    );
  }, [hasJustSubmitted, activeGuestName, storageKey, localRsvps]);

  // Kunci scroll halaman saat cover undangan masih aktif
  useEffect(() => {
    if (!isOpened) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const preventWheel = (e) => {
        e.preventDefault();
      };
      window.addEventListener('wheel', preventWheel, { passive: false });

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        window.removeEventListener('wheel', preventWheel);
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isOpened]);

  const groom = content.mempelaiPria || 'Ahmad Fajar, S.T.';
  const bride = content.mempelaiWanita || 'Siti Aminah, S.Pd.';

  const data = {
    groom,
    bride,
    groomShort: firstName(groom),
    brideShort: firstName(bride),
    groomPlain: plainName(groom),
    bridePlain: plainName(bride),
    groomFather: content.ayahPria || 'Bpk. H. Abdurrahman',
    groomMother: content.ibuPria || 'Ibu Hj. Maryam',
    brideFather: content.ayahWanita || 'Bpk. H. Ahmad Dahlan',
    brideMother: content.ibuWanita || 'Ibu Hj. Fatimah',
    akad: content.akad || {
      tanggal: 'Minggu, 15 November 2026',
      waktu: '08:00 - 10:00 WIB',
      lokasi: 'Masjid Agung Al-Akbar Surabaya',
      alamat: 'Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya',
      mapUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya',
    },
    resepsi: content.resepsi || {
      tanggal: 'Minggu, 15 November 2026',
      waktu: '11:00 - 14:00 WIB',
      lokasi: 'Grand Ballroom Hotel Majapahit, Surabaya',
      alamat: 'Jl. Tunjungan No.65, Genteng, Surabaya',
      mapUrl: 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
    },
    ayatQuote: content.ayat || 'QS. Ar-Rum: 21',
    photoCover: content.fotoCover || DEFAULT_PHOTOS.cover,
    photoGroom: content.fotoPria || DEFAULT_PHOTOS.groom,
    photoBride: content.fotoWanita || DEFAULT_PHOTOS.bride,
    loveStories: content.kisah && content.kisah.length ? content.kisah : DEFAULT_STORIES,
    gallery: content.galeri && content.galeri.length ? content.galeri : DEFAULT_PHOTOS.gallery,
    musicUrl:
      content.musicUrl ||
      'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-wedding-113063.mp3',
    musicTitle: content.musicTitle || 'Acoustic Wedding - Romantic Bliss',
    bankAccounts: content.rekening || [
      { bank: 'BCA', nomor: '0182938192', nama: plainName(groom) },
      { bank: 'BSI', nomor: '7192830192', nama: plainName(bride) },
    ],
    giftAddress:
      content.alamatKado ||
      'Perumahan Graha Asri Blok C No. 12, Jambangan, Surabaya (0812-3456-7890)',
    guestName: guest?.name || 'Tamu Undangan',
    isVip: guest?.category === 'VIP',
    guestCategory: guest?.category || 'Reguler',
    guestPax: guest?.pax || 2,
    qrValue:
      guest?.qr_link ||
      guest?.qr_code ||
      'https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin',
    showQr:
      content.showQr !== undefined
        ? Boolean(content.showQr)
        : content.showQrCheckin !== undefined
        ? Boolean(content.showQrCheckin)
        : true,
  };

  // Countdown
  const targetDate = content.tanggalAkadISO || '2026-11-15T08:00:00+07:00';
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const dist = target - Date.now();
      if (dist <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(dist / 86400000),
        hours: Math.floor((dist % 86400000) / 3600000),
        minutes: Math.floor((dist % 3600000) / 60000),
        seconds: Math.floor((dist % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const googleCalUrl = useMemo(() => {
    const fmt = (iso) => new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const start = new Date(targetDate);
    const end = new Date(start.getTime() + 6 * 3600000);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Pernikahan ${data.groomShort} & ${data.brideShort}`
    )}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(
      'Mohon doa restu dan kehadiran Bapak/Ibu/Saudara/i.'
    )}&location=${encodeURIComponent(data.akad.lokasi)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate, data.groomShort, data.brideShort, data.akad.lokasi]);

  const audioInstanceRef = useRef(null);

  // Inisialisasi dan sinkronisasi audio instance secara internal
  useEffect(() => {
    if (!data.musicUrl) return;

    const audio = new Audio(data.musicUrl);
    audio.loop = true;
    audio.preload = 'auto';
    audioInstanceRef.current = audio;

    const onPlay = () => setIsPlayingMusic(true);
    const onPause = () => setIsPlayingMusic(false);
    const onEnded = () => setIsPlayingMusic(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audioInstanceRef.current = null;
      document.querySelectorAll('audio').forEach((el) => {
        try {
          el.pause();
        } catch {}
      });
    };
  }, [data.musicUrl]);

  const openInvitation = () => {
    setIsOpened(true);
    const audio = audioInstanceRef.current;
    if (audio && audio.paused) {
      audio
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    } else if (audio && !audio.paused) {
      setIsPlayingMusic(true);
    }
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  const toggleMusic = () => {
    const audio = audioInstanceRef.current;
    const isCurrentlyPlaying = isPlayingMusic || (audio && !audio.paused);

    if (isCurrentlyPlaying) {
      if (audio) {
        audio.pause();
      }
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
          .catch((err) => {
            console.warn('Playback prevented:', err);
            setIsPlayingMusic(false);
          });
      }
    }
  };

  const copyBank = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedBankIndex(index);
    toast.success('Nomor rekening berhasil disalin!');
    setTimeout(() => setCopiedBankIndex(null), 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(data.giftAddress);
    setCopiedAddress(true);
    toast.success('Alamat berhasil disalin!');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyQrLink = () => {
    navigator.clipboard.writeText(data.qrValue);
    setCopiedQrLink(true);
    toast.success('Link QR Code berhasil disalin!');
    setTimeout(() => setCopiedQrLink(false), 2000);
  };

  const sendRsvp = (e) => {
    e.preventDefault();
    if (hasSubmitted) {
      toast.error('Anda sudah mengirimkan ucapan doa restu sebelumnya.');
      return;
    }
    const finalGuestName = (rsvpName || guest?.name || data.guestName || '').trim();
    if (!finalGuestName || !rsvpMessage.trim()) {
      toast.error('Mohon isi pesan ucapan doa Anda.');
      return;
    }
    const nowIso = new Date().toISOString();
    const newRsvp = {
      id: Date.now(),
      guest_name: finalGuestName,
      attendance_status: rsvpStatus,
      pax: rsvpPax,
      message: rsvpMessage,
      created_at: nowIso,
      createdAt: nowIso,
    };
    setLocalRsvps([newRsvp, ...localRsvps]);
    setHasJustSubmitted(true);
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, 'true');
      } catch (e) {}
    }
    onSubmitRsvp?.(newRsvp);
    toast.success('Terima kasih atas doa restu Anda!');
  };

  const openLightbox = (index) => {
    setSelectedPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  return {
    ...data,
    isOpened,
    isPlayingMusic,
    timeLeft,
    googleCalUrl,
    openInvitation,
    toggleMusic,
    copyBank,
    copyAddress,
    copyQrLink,
    copiedBankIndex,
    copiedAddress,
    copiedQrLink,
    rsvp: {
      name: rsvpName || guest?.name || data.guestName || 'Tamu Undangan',
      setName: setRsvpName,
      status: rsvpStatus,
      setStatus: setRsvpStatus,
      pax: rsvpPax,
      setPax: setRsvpPax,
      message: rsvpMessage,
      setMessage: setRsvpMessage,
      list: localRsvps,
      send: sendRsvp,
      hasSubmitted,
    },
    gallerySelected: selectedPhotoIndex,
    setGallerySelected: setSelectedPhotoIndex,
    isLightboxOpen,
    setIsLightboxOpen,
    openLightbox,
  };
};

export const formatRsvpDate = (rawDate) => {
  if (!rawDate) return 'Baru saja';
  try {
    if (typeof rawDate === 'object' && !(rawDate instanceof Date)) {
      rawDate = rawDate.created_at || rawDate.createdAt || rawDate.date;
      if (!rawDate) return 'Baru saja';
    }

    if (rawDate instanceof Date) {
      if (isNaN(rawDate.getTime())) return 'Baru saja';
      return rawDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    // Tangani format MySQL / SQLite: "2026-10-21 14:02:11" agar valid di Safari / Mac
    let cleaned = String(rawDate).trim();
    if (cleaned.includes(' ') && !cleaned.includes('T')) {
      cleaned = cleaned.replace(' ', 'T');
    }

    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    const fallback = new Date(rawDate);
    if (!isNaN(fallback.getTime())) {
      return fallback.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    return 'Baru saja';
  } catch (err) {
    return 'Baru saja';
  }
};
