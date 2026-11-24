import { useState, useEffect, useRef, useMemo } from "react";
import { useToast } from "../ui/Toast";

export const DEFAULT_PHOTOS = {
  cover: "/images/defaults/couple-cover.jpg",
  groom: "/images/defaults/groom.jpg",
  bride: "/images/defaults/bride.jpg",
  closing: "/images/defaults/gallery-hands.jpg",
  gallery: [
    "/images/defaults/couple-cover.jpg",
    "/images/defaults/gallery-hands.jpg",
    "/images/defaults/gallery-bouquet.jpg",
    "/images/defaults/bride.jpg",
    "/images/defaults/groom.jpg",
  ],
};

const DEFAULT_STORIES = [
  {
    tahun: "2021",
    judul: "Awal Pertemuan",
    cerita:
      "Takdir mempertemukan kami pertama kali dalam sebuah acara. Dari obrolan sederhana, tumbuh rasa nyaman dan saling mengagumi.",
  },
  {
    tahun: "2023",
    judul: "Menjalin Komitmen",
    cerita:
      "Seiring waktu, kami saling memahami dan memantapkan hati untuk melangkah lebih serius bersama dengan restu keluarga.",
  },
  {
    tahun: "2026",
    judul: "Menuju Hari Bahagia",
    cerita:
      "Dengan restu kedua orang tua, kami memantapkan niat suci untuk menyempurnakan separuh agama dalam ikatan pernikahan.",
  },
];

const firstName = (full = "") => full.split(",")[0].trim().split(" ")[0];
const plainName = (full = "") => full.split(",")[0].trim();

/**
 * Hook bersama untuk semua template: mengambil data dinamis dari content_json
 * beserta state & handler (musik, countdown, copy, RSVP) sehingga komponen
 * template cukup fokus pada tampilan.
 */
export const useInvitationData = ({
  invitation,
  guest,
  rsvps = [],
  onSubmitRsvp,
  defaultOpened = false,
  isModalView = false,
}) => {
  const toast = useToast();
  const rawContent = invitation?.content_json || {};
  const templateCode =
    invitation?.template?.template_code || invitation?.template_code || "";
  const templateDefaults = invitation?.template?.default_content_json || {};
  const templateOverrides =
    (templateCode && rawContent?.templateOverrides?.[templateCode]) || {};
  const content = {
    ...templateDefaults,
    ...rawContent,
    ...templateOverrides,
  };

  const [isOpened, setIsOpened] = useState(Boolean(defaultOpened));
  useEffect(() => {
    setIsOpened(Boolean(defaultOpened));
  }, [defaultOpened]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedBankIndex, setCopiedBankIndex] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedQrLink, setCopiedQrLink] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState(guest?.name || "");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpPax, setRsvpPax] = useState("1 Orang");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [localRsvps, setLocalRsvps] = useState(rsvps);
  const [hasJustSubmitted, setHasJustSubmitted] = useState(false);

  useEffect(() => setLocalRsvps(rsvps), [rsvps]);
  useEffect(() => {
    if (guest?.name) setRsvpName(guest.name);
  }, [guest]);

  const activeGuestName = (rsvpName || guest?.name || "").trim();
  const storageKey =
    invitation?.id && activeGuestName && activeGuestName !== "Tamu Undangan"
      ? `rsvp_done_${invitation.id}_${encodeURIComponent(activeGuestName.toLowerCase())}`
      : null;

  const hasSubmitted = useMemo(() => {
    if (hasJustSubmitted) return true;
    if (!activeGuestName || activeGuestName === "Tamu Undangan") return false;

    if (storageKey && typeof window !== "undefined") {
      try {
        if (localStorage.getItem(storageKey) === "true") return true;
      } catch (e) {}
    }

    return localRsvps.some(
      (r) =>
        r.guest_name &&
        r.guest_name.trim().toLowerCase() === activeGuestName.toLowerCase(),
    );
  }, [hasJustSubmitted, activeGuestName, storageKey, localRsvps]);

  // Kunci scroll halaman saat cover undangan masih aktif
  useEffect(() => {
    const isEmbeddedPreview =
      isModalView ||
      (typeof document !== "undefined" &&
        Boolean(
          document.querySelector(
            '.builder-phone-viewport, [data-invitation-preview="true"]',
          ),
        ));
    if (isEmbeddedPreview) return undefined;

    if (!isOpened) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const preventWheel = (e) => {
        e.preventDefault();
      };
      window.addEventListener("wheel", preventWheel, { passive: false });

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        window.removeEventListener("wheel", preventWheel);
      };
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [isOpened, isModalView]);

  const eventType = (content.eventType || "wedding").toLowerCase();
  const isCoupleEvent = eventType === "wedding" || eventType === "engagement";
  const showSecondPerson = isCoupleEvent;
  const showSecondEvent =
    content.showSecondEvent !== undefined
      ? content.showSecondEvent !== false &&
        content.showSecondEvent !== "false" &&
        content.showSecondEvent !== 0
      : eventType === "wedding";

  const groom = content.mempelaiPria || "Ahmad Fajar, S.T.";
  const bride = content.mempelaiWanita || "Siti Aminah, S.Pd.";
  const groomShort =
    (content.panggilanPria && String(content.panggilanPria).trim()) ||
    firstName(groom) ||
    "Ahmad";
  const brideShort =
    (content.panggilanWanita && String(content.panggilanWanita).trim()) ||
    firstName(bride) ||
    "Aminah";

  const EVENT_TYPE_DEFAULTS = {
    wedding: {
      coverSubtitle: "The Wedding of",
      primaryEventTitle: "Akad Nikah",
      secondaryEventTitle: "Resepsi",
      giftTitle: "Wedding Gift",
      countdownTitle: "Menuju Hari Bahagia Kami",
      openingGreeting:
        "Dengan penuh rasa syukur dan bahagia, kami mengundang Bapak/Ibu/Saudara/i untuk hadir, dan memberikan doa serta restu di hari bahagia kami.",
      person1Role: "Mempelai Pria",
      person2Role: "Mempelai Wanita",
    },
    engagement: {
      coverSubtitle: "The Engagement of",
      primaryEventTitle: "Acara Lamaran",
      secondaryEventTitle: "Ramah Tamah",
      giftTitle: "Tanda Kasih",
      countdownTitle: "Menuju Hari Lamaran Kami",
      openingGreeting:
        "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara lamaran kami.",
      person1Role: "Calon Mempelai Pria",
      person2Role: "Calon Mempelai Wanita",
    },
    birthday: {
      coverSubtitle: content.anakKePria
        ? `Birthday Celebration • ${content.anakKePria}`
        : "Birthday Invitation",
      primaryEventTitle: "Birthday Party",
      secondaryEventTitle: "Dinner & After Party",
      giftTitle: "Birthday Gift",
      countdownTitle: "Menuju Hari Ulang Tahun",
      openingGreeting:
        "Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i/Sahabat untuk hadir merayakan momen ulang tahun yang istimewa ini.",
      person1Role: content.anakKePria || "The Celebrant",
      person2Role: "",
    },
    event: {
      coverSubtitle: content.anakKePria || "Special Event Invitation",
      primaryEventTitle: "Acara Utama",
      secondaryEventTitle: "Sesi Kedua",
      giftTitle: "Tanda Kasih",
      countdownTitle: "Menuju Hari Acara",
      openingGreeting:
        "Merupakan suatu kehormatan bagi kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara yang kami selenggarakan.",
      person1Role: content.anakKePria || "Penyelenggara Acara",
      person2Role: "",
    },
  };
  const typeDefaults =
    EVENT_TYPE_DEFAULTS[eventType] || EVENT_TYPE_DEFAULTS.wedding;

  const rawAkad = content.akad || {
    judul: typeDefaults.primaryEventTitle,
    tanggal: "Minggu, 15 November 2026",
    waktu: "08:00 - 10:00 WIB",
    lokasi: "Masjid Agung Al-Akbar Surabaya",
    alamat: "Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya",
    mapUrl: "https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya",
  };

  const rawResepsi = content.resepsi || {
    judul: typeDefaults.secondaryEventTitle,
    tanggal: "Minggu, 15 November 2026",
    waktu: "11:00 - 14:00 WIB",
    lokasi: "Grand Ballroom Hotel Majapahit, Surabaya",
    alamat: "Jl. Tunjungan No.65, Genteng, Surabaya",
    mapUrl: "https://maps.google.com/?q=Hotel+Majapahit+Surabaya",
  };

  const resolvedPhotoBride =
    !isCoupleEvent && !content.fotoWanita
      ? content.fotoPria || content.fotoCover || DEFAULT_PHOTOS.groom
      : content.fotoWanita || DEFAULT_PHOTOS.bride;

  const data = {
    eventType,
    isCoupleEvent,
    showSecondPerson,
    showSecondEvent,
    person1Role: typeDefaults.person1Role,
    person2Role: typeDefaults.person2Role,
    displayTitle: isCoupleEvent ? `${groomShort} & ${brideShort}` : groomShort,
    groom,
    bride,
    groomShort,
    brideShort,
    groomPlain: plainName(groom),
    bridePlain: plainName(bride),
    groomFather: content.ayahPria || "",
    groomMother: content.ibuPria || "",
    groomChildOrder: content.anakKePria || (isCoupleEvent ? "Putra Pertama" : ""),
    groomInstagram: (content.instagramPria || "").replace(/^@/, "").trim(),
    brideFather: content.ayahWanita || "",
    brideMother: content.ibuWanita || "",
    brideChildOrder: content.anakKeWanita || (isCoupleEvent ? "Putri Pertama" : ""),
    brideInstagram: (content.instagramWanita || "").replace(/^@/, "").trim(),
    akad: {
      ...rawAkad,
      judul: rawAkad.judul || typeDefaults.primaryEventTitle,
    },
    resepsi: {
      ...rawResepsi,
      judul: rawResepsi.judul || typeDefaults.secondaryEventTitle,
    },
    ayatQuote: content.ayat || "QS. Ar-Rum: 21",
    coverSubtitle: content.judulPembuka || typeDefaults.coverSubtitle,
    coverFootnote:
      content.catatanCover ||
      "*Mohon maaf jika terdapat kesalahan penulisan nama & gelar",
    monogramText: content.monogram || "",
    kutipanPembuka: content.kutipanPembuka || "",
    openingGreeting: content.salamPembuka || typeDefaults.openingGreeting,
    countdownTitle: content.judulCountdown || typeDefaults.countdownTitle,
    momentsTitle: content.judulGaleri || "OUR MOMENTS",
    storiesTitle: content.judulKisah || "OUR STORIES",
    giftTitle: content.judulKado || typeDefaults.giftTitle,
    giftSubtitle:
      content.subjudulKado ||
      "Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih, dapat mengirimkan melalui rekening dan alamat di bawah ini:",
    rsvpTitle: content.judulRsvp || "RSVP",
    rsvpSubtitle: content.subjudulRsvp || "Ucapan & doa",
    closingTitle: content.judulPenutup || "Terima Kasih",
    closingSubtitle:
      content.subjudulPenutup || "Sampai bertemu di hari bahagia kami!",
    closingSignoff: content.tandaTanganPenutup || "Kami yang berbahagia,",
    footerBrand: content.footerText || "SAMSKARA",
    closingText:
      content.teksPenutup ||
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.",
    closingGreeting:
      content.salamPenutup !== undefined
        ? content.salamPenutup
        : "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    photoCover: content.fotoCover || DEFAULT_PHOTOS.cover,
    photoGroom: content.fotoPria || DEFAULT_PHOTOS.groom,
    photoBride: resolvedPhotoBride,
    photoClosing: content.fotoPenutup || "",
    introVideoUrl: content.introVideoUrl || "",
    backgroundVideoUrl: content.backgroundVideoUrl || "",
    preweddingVideoUrl: content.preweddingVideoUrl || "",
    seatPlanImage: content.seatPlanImage || "",
    seatPlanTitle: content.seatPlanTitle || "Seat Plan & Denah Lokasi",
    seatPlanCaption:
      content.seatPlanCaption ||
      "Silakan periksa posisi meja atau denah lokasi acara di bawah ini.",
    showSeatPlan:
      content.showSeatPlan !== undefined
        ? Boolean(content.showSeatPlan)
        : Boolean(content.seatPlanImage),
    showCountdown:
      content.showCountdown !== undefined ? Boolean(content.showCountdown) : true,
    showLoveStory:
      content.showLoveStory !== undefined ? Boolean(content.showLoveStory) : true,
    showGallery:
      content.showGallery !== undefined ? Boolean(content.showGallery) : true,
    showRsvp:
      content.showRsvp !== undefined ? Boolean(content.showRsvp) : true,
    packageTier: (content.packageTier || "all").toLowerCase(),
    loveStories:
      content.showLoveStory === false
        ? []
        : content.kisah && content.kisah.length
          ? content.kisah
          : DEFAULT_STORIES,
    gallery:
      content.showGallery === false
        ? []
        : content.galeri && content.galeri.length
          ? content.galeri
          : DEFAULT_PHOTOS.gallery,
    musicUrl:
      content.musicUrl ||
      "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-wedding-113063.mp3",
    musicTitle: content.musicTitle || "Acoustic Wedding - Romantic Bliss",
    bankAccounts:
      content.showDonation === false
        ? []
        : content.rekening || [
            { bank: "BCA", nomor: "0182938192", nama: plainName(groom) },
            { bank: "BSI", nomor: "7192830192", nama: plainName(bride) },
          ],
    giftRecipient: content.penerimaKado || plainName(bride) || "",
    giftAddress:
      content.showGift === false
        ? ""
        : content.alamatKado ||
          "Perumahan Graha Asri Blok C No. 12, Jambangan, Surabaya (0812-3456-7890)",
    giftConfirmText:
      content.giftConfirmText ||
      "Untuk pengiriman hadiah fisik bisa konfirmasi melalui nomer whatsapp dibawah ini ya..",
    giftWa1Name:
      content.giftWa1Name !== undefined ? content.giftWa1Name : brideShort,
    giftWa1Phone:
      content.giftWa1Phone !== undefined
        ? content.giftWa1Phone
        : "0811 2233 4455",
    giftWa2Name:
      content.giftWa2Name !== undefined ? content.giftWa2Name : groomShort,
    giftWa2Phone:
      content.giftWa2Phone !== undefined
        ? content.giftWa2Phone
        : "0811 2233 4455",
    showDresscode:
      content.showDresscode !== undefined
        ? Boolean(content.showDresscode)
        : true,
    dresscodeTitle: content.judulDresscode || "Dress Code",
    dresscodeText: content.dresscodeText || "Pink, brown and white",
    dresscodeColors:
      Array.isArray(content.dresscodeColors) &&
      content.dresscodeColors.length > 0
        ? content.dresscodeColors
        : ["#fdf9f6", "#a96d79", "#68333e"],
    showDonation:
      content.showDonation !== undefined ? Boolean(content.showDonation) : true,
    showGift: content.showGift !== undefined ? Boolean(content.showGift) : true,
    guestName: guest?.name || "Tamu Undangan",
    isVip: guest?.category === "VIP" || guest?.category === "VVIP",
    guestCategory: guest?.category || "Reguler",
    guestPax: guest?.pax || 2,
    qrValue:
      guest?.qr_link ||
      guest?.qr_code ||
      "https://app.tamuva.com/events/bb8213df-5f1a-4711-810f-3197e7b00143/checkin",
    showQr:
      (guest?.category || "").trim().toLowerCase() === "grup"
        ? false
        : content.showQr !== undefined
          ? content.showQr !== false &&
            content.showQr !== "false" &&
            content.showQr !== 0 &&
            content.showQr !== "0"
          : content.showQrCheckin !== undefined
            ? content.showQrCheckin !== false &&
              content.showQrCheckin !== "false" &&
              content.showQrCheckin !== 0 &&
              content.showQrCheckin !== "0"
            : (content.packageTier || "").toLowerCase() === "intimate"
              ? false
              : true,
  };

  // Countdown
  const targetDate = content.tanggalAkadISO || "2026-11-15T08:00:00+07:00";
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const dist = target - Date.now();
      if (dist <= 0)
        return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
    const fmt = (iso) =>
      new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const start = new Date(targetDate);
    const end = new Date(start.getTime() + 6 * 3600000);
    const calTitle =
      data.eventType === "engagement"
        ? `Lamaran ${data.groomShort} & ${data.brideShort}`
        : data.eventType === "birthday"
          ? `Ulang Tahun ${data.groomShort}`
          : data.eventType === "event"
            ? `${data.groom}`
            : `Pernikahan ${data.groomShort} & ${data.brideShort}`;
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      calTitle,
    )}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(
      "Mohon doa restu dan kehadiran Bapak/Ibu/Saudara/i.",
    )}&location=${encodeURIComponent(data.akad.lokasi)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    targetDate,
    data.eventType,
    data.groomShort,
    data.brideShort,
    data.groom,
    data.akad.lokasi,
  ]);

  const audioInstanceRef = useRef(null);

  // Inisialisasi dan sinkronisasi audio instance secara internal
  useEffect(() => {
    if (!data.musicUrl) return;

    const audio = new Audio(data.musicUrl);
    audio.loop = true;
    audio.preload = "auto";
    audioInstanceRef.current = audio;

    const onPlay = () => setIsPlayingMusic(true);
    const onPause = () => setIsPlayingMusic(false);
    const onEnded = () => setIsPlayingMusic(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audioInstanceRef.current = null;
      document.querySelectorAll("audio").forEach((el) => {
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
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  const toggleMusic = () => {
    const audio = audioInstanceRef.current;
    const isCurrentlyPlaying = isPlayingMusic || (audio && !audio.paused);

    if (isCurrentlyPlaying) {
      if (audio) {
        audio.pause();
      }
      document.querySelectorAll("audio").forEach((el) => {
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
            console.warn("Playback prevented:", err);
            setIsPlayingMusic(false);
          });
      }
    }
  };

  const copyBank = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedBankIndex(index);
    toast.success("Nomor rekening berhasil disalin!");
    setTimeout(() => setCopiedBankIndex(null), 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(data.giftAddress);
    setCopiedAddress(true);
    toast.success("Alamat berhasil disalin!");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyQrLink = () => {
    navigator.clipboard.writeText(data.qrValue);
    setCopiedQrLink(true);
    toast.success("Link QR Code berhasil disalin!");
    setTimeout(() => setCopiedQrLink(false), 2000);
  };

  const sendRsvp = (e) => {
    e.preventDefault();
    if (hasSubmitted) {
      toast.error("Anda sudah mengirimkan ucapan doa restu sebelumnya.");
      return;
    }
    const finalGuestName = (
      rsvpName ||
      guest?.name ||
      data.guestName ||
      ""
    ).trim();
    if (!finalGuestName || !rsvpMessage.trim()) {
      toast.error("Mohon isi pesan ucapan doa Anda.");
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
    if (storageKey && typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, "true");
      } catch (e) {}
    }
    onSubmitRsvp?.(newRsvp);
    toast.success("Terima kasih atas doa restu Anda!");
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
      name: rsvpName || guest?.name || data.guestName || "Tamu Undangan",
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
  if (!rawDate) return "Baru saja";
  try {
    if (typeof rawDate === "object" && !(rawDate instanceof Date)) {
      rawDate = rawDate.created_at || rawDate.createdAt || rawDate.date;
      if (!rawDate) return "Baru saja";
    }

    if (rawDate instanceof Date) {
      if (isNaN(rawDate.getTime())) return "Baru saja";
      return rawDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    // Tangani format MySQL / SQLite: "2026-10-21 14:02:11" agar valid di Safari / Mac
    let cleaned = String(rawDate).trim();
    if (cleaned.includes(" ") && !cleaned.includes("T")) {
      cleaned = cleaned.replace(" ", "T");
    }

    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    const fallback = new Date(rawDate);
    if (!isNaN(fallback.getTime())) {
      return fallback.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    return "Baru saja";
  } catch (err) {
    return "Baru saja";
  }
};
