import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  Minus,
  Mail,
} from "lucide-react";
import { DelleaLogo } from "../components/ui/DelleaLogo";
import { templateService } from "../services/templateService";

const DEFAULT_FAQS = [
  {
    question:
      "Apa perbedaan paket Intimate (Undangan Saja) dan Signature (Undangan + QR Sync)?",
    answer:
      "Paket Intimate berfokus pada undangan digital mandiri tanpa sistem scan QR di lokasi (tamu tak terbatas, RSVP, ucapan, dan amplop digital). Paket Signature dilengkapi sinkronisasi kode/link QR dari vendor buku tamu eksternal, kategori tamu (VVIP, VIP, Reguler, Grup), serta fitur Private Guest Lock.",
  },
  {
    question: "Apakah jumlah tamu yang diundang dibatasi?",
    answer:
      "Tidak ada batasan jumlah tamu. Anda dapat menambahkan tamu satu per satu atau mengimpor ratusan hingga ribuan daftar tamu sekaligus menggunakan file Excel, lengkap dengan link personal untuk masing-masing tamu.",
  },
  {
    question: "Bagaimana cara kerja sinkronisasi QR Check-In sistem luar?",
    answer:
      "Jika Anda atau Wedding Organizer menggunakan sistem buku tamu atau scanner eksternal, cukup masukkan link atau ID QR dari vendor tersebut pada file Excel daftar tamu. Sistem Samskara akan otomatis menampilkan tombol QR Check-In layar penuh yang cepat dipindai di kartu undangan tiap tamu.",
  },
  {
    question:
      "Apakah data acara, foto, dan teks bisa direvisi setelah undangan aktif?",
    answer:
      "Ya. Anda dapat memperbarui jadwal acara, lokasi Google Maps, galeri foto, musik latar, hingga daftar tamu kapan saja melalui panel dashboard secara real-time tanpa biaya tambahan.",
  },
  {
    question: "Berapa lama masa aktif undangan digital?",
    answer:
      "Undangan digital aktif selama 12 bulan sejak tanggal aktivasi, sehingga keluarga dan tamu tetap dapat membuka kembali galeri foto maupun doa serta ucapan dengan nyaman.",
  },
  {
    question: "Apakah fitur amplop digital, kado, atau QR bisa disembunyikan?",
    answer:
      "Bisa. Seluruh bagian seperti Amplop Digital/Rekening, Info Kado, RSVP, hingga tombol QR Check-In dapat diaktifkan atau disembunyikan (hide/show) sesuai kebutuhan dan preferensi keluarga.",
  },
  {
    question: "Apakah undangan hanya tersedia untuk acara pernikahan saja?",
    answer:
      "Tidak. Selain pernikahan (modern, adat Jawa, Sunda, botanical, maupun gala), tersedia juga tema untuk lamaran, ulang tahun, hingga acara umum atau korporat yang dapat dipilih di katalog.",
  },
  {
    question: "Berapa lama proses pengerjaan untuk paket Custom Atelier?",
    answer:
      "Untuk tema katalog, undangan dapat aktif di hari yang sama. Untuk paket Custom Atelier (penyesuaian layout, palet warna, atau ornamen adat khusus), estimasi pengerjaan adalah 3–7 hari kerja bersama tim Samskara.",
  },
];

const TEMPLATE_META_BY_CODE = {
  mildness: { category: "modern", tag: "Earthy Sage" },
  "snap-photo": { category: "modern", tag: "Darkroom" },
  "timeless-snapshot": { category: "rustic", tag: "Archival" },
  serein: { category: "modern", tag: "Editorial" },
  "rustic-wood": { category: "rustic", tag: "Wood & Leaf" },
  "elegant-gold": { category: "modern", tag: "Royal Gold" },
  "royal-gold": { category: "modern", tag: "Royal Gold" },
  "jawa-keraton": { category: "tradisional", tag: "Adat Jawa" },
  "sunda-priangan": { category: "tradisional", tag: "Adat Sunda" },
  "crimson-rose": { category: "modern", tag: "Signature" },
  "forest-tropical": { category: "rustic", tag: "Botanical" },
  "jawa-kembar-mayang": { category: "tradisional", tag: "Heritage" },
  "noir-velvet": { category: "modern", tag: "Cinematic Video" },
  "drapery-pink": { category: "modern", tag: "Romantic Lace" },
};

const DEFAULT_DB_TEMPLATES = [
  {
    id: 1,
    no: "01",
    code: "mildness",
    name: "Mildness Earthy Sage & Luxury Ivory",
    category: "modern",
    tag: "Earthy Sage",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    no: "02",
    code: "snap-photo",
    name: "Snap Photo Cinematic Dark",
    category: "modern",
    tag: "Darkroom",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    no: "03",
    code: "timeless-snapshot",
    name: "Timeless Snapshot Vintage Polaroid",
    category: "rustic",
    tag: "Archival",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    no: "04",
    code: "serein",
    name: "Serein Minimalist Luxury",
    category: "modern",
    tag: "Editorial",
    image:
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    no: "05",
    code: "rustic-wood",
    name: "Rustic Wood & Botanical",
    category: "rustic",
    tag: "Wood & Leaf",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    no: "06",
    code: "elegant-gold",
    name: "Royal Gold & Black Velvet",
    category: "modern",
    tag: "Royal Gold",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    no: "07",
    code: "jawa-keraton",
    name: "Keraton Jawa Sogan & Emas",
    category: "tradisional",
    tag: "Adat Jawa",
    image:
      "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    no: "08",
    code: "sunda-priangan",
    name: "Priangan Hijau Sunda",
    category: "tradisional",
    tag: "Adat Sunda",
    image:
      "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    no: "09",
    code: "crimson-rose",
    name: "Crimson Rose & Pure Elegance",
    category: "modern",
    tag: "Signature",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    no: "10",
    code: "forest-tropical",
    name: "Forest Tropical & Botanical Luxury",
    category: "rustic",
    packageTier: "intimate",
    tag: "Botanical",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 11,
    no: "11",
    code: "jawa-kembar-mayang",
    name: "Kembar Mayang Javanese Heritage",
    category: "tradisional",
    tag: "Heritage",
    image: "/images/templates/kembar-mayang-thumb.png",
  },
  {
    id: 12,
    no: "12",
    code: "noir-velvet",
    name: "Noir Velvet Motion",
    category: "modern",
    tag: "Cinematic Video",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 13,
    no: "13",
    code: "drapery-pink",
    name: "Drapery Pink & Vintage Lace",
    category: "modern",
    tag: "Romantic Lace",
    image: "/images/drapery-pink/demo-couple-1.jpg",
  },
];

const SYSTEM_MODES = [
  {
    id: "standalone",
    num: "01",
    label: "Hanya Undangan",
    title: "Undangan Digital Murni.",
    caption:
      "Tanpa tampilan QR Check-In. Bersih, intim, siap sebar via WhatsApp.",
    tags: [
      "Tamu Tak Terbatas",
      "RSVP & Doa",
      "Amplop Digital",
      "Mode Tanpa QR",
    ],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "qrsync",
    num: "02",
    label: "Konek QR Luar",
    title: "Sinkronisasi QR Sistem Eksternal.",
    caption:
      "Impor link/kode QR dari vendor buku tamu luar via Excel. Otomatis menjadi kartu akses tiap tamu.",
    tags: [
      "Sync QR Vendor Luar",
      "VVIP • VIP • Reguler",
      "Grup Otomatis Tanpa QR",
      "Guest Lock",
    ],
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "custom",
    num: "03",
    label: "Custom Atelier",
    title: "Desain & Alur Eksklusif.",
    caption:
      "Dirancang khusus mengikuti moodboard pernikahan, ornamen adat, atau sistem WO Anda.",
    tags: [
      "Custom Layout",
      "Ilustrasi Adat",
      "Format Vendor WO",
      "Full Support",
    ],
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=80",
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.14 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={visible ? "visible" : "hidden"}
      style={{ transitionDelay: `${delay}ms` }}
      className={`dellea-reveal ${className}`}
    >
      {children}
    </div>
  );
}

const TEMPLATES_PER_PAGE = 12;

export const LandingPage = ({ isAuthenticated = false, onNavigate }) => {
  const [templates, setTemplates] = useState(() =>
    DEFAULT_DB_TEMPLATES.slice(0, TEMPLATES_PER_PAGE),
  );
  const [cms, setCms] = useState({
    heroSubtitle:
      "Undangan pernikahan digital. Mandiri, terkoneksi QR Check-In sistem luar, atau dirancang custom.",
    systemModes: SYSTEM_MODES,
    pricelistTitle: "Pricelist & Custom",
    pricelistSubtitle:
      "Pilih paket undangan digital sesuai kebutuhan acara dan alur tamu Anda.",
    pricelist: [
      {
        tier: "01 / Intimate",
        name: "Undangan Saja",
        price: "149K",
        note: "Cocok untuk acara intimate tanpa sistem QR check-in di lokasi.",
        items: [
          "Akses semua tema katalog",
          "Tamu tanpa batas (import Excel)",
          "RSVP & ucapan real-time",
          "Amplop digital & info kado (hide/show)",
        ],
        ctaLabel: "Pilih Paket",
        featured: false,
      },
      {
        tier: "02 / Signature",
        name: "Undangan + QR Sync",
        price: "299K",
        note: "Cocok untuk acara yang terhubung dengan sistem QR eksternal atau manajemen tamu terstruktur.",
        items: [
          "Semua fitur paket Intimate",
          "Sync link / ID QR sistem luar",
          "Kategori tamu VVIP, VIP, Reguler & Grup",
          "Private guest lock (aktif 12 bulan)",
        ],
        ctaLabel: "Pilih Paket",
        featured: true,
      },
      {
        tier: "03 / Bespoke",
        name: "Custom Atelier",
        price: "599K+",
        note: "Desain dan penyesuaian alur khusus sesuai permintaan klien maupun vendor.",
        items: [
          "Custom layout & palet warna",
          "Custom ornamen / ilustrasi",
          "Penyesuaian format kebutuhan WO / vendor",
          "Pendampingan penuh tim Samskara",
        ],
        ctaLabel: "Pilih Paket",
        featured: false,
      },
    ],
    faqTitle: "Pertanyaan Umum",
    faqSubtitle:
      "Jawaban singkat seputar cara pemesanan, fitur undangan digital, hingga integrasi QR check-in.",
    faqs: DEFAULT_FAQS,
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePackageTier, setActivePackageTier] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: TEMPLATES_PER_PAGE,
    total: DEFAULT_DB_TEMPLATES.length,
    totalPages: Math.max(
      1,
      Math.ceil(DEFAULT_DB_TEMPLATES.length / TEMPLATES_PER_PAGE),
    ),
    hasNext: DEFAULT_DB_TEMPLATES.length > TEMPLATES_PER_PAGE,
    hasPrev: false,
  });
  const [availableEventCategories, setAvailableEventCategories] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [activeMode, setActiveMode] = useState("qrsync");
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ambil konten CMS Landing Page sekali saat mount
  useEffect(() => {
    let mounted = true;
    templateService
      .getLandingCms()
      .then((res) => {
        if (mounted && res?.data) {
          setCms((prev) => ({
            ...prev,
            ...res.data,
            systemModes:
              Array.isArray(res.data.systemModes) &&
              res.data.systemModes.length > 0
                ? res.data.systemModes
                : prev.systemModes,
            pricelist:
              Array.isArray(res.data.pricelist) && res.data.pricelist.length > 0
                ? res.data.pricelist
                : prev.pricelist,
            faqs:
              Array.isArray(res.data.faqs) && res.data.faqs.length > 0
                ? res.data.faqs
                : prev.faqs,
          }));
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // Ambil katalog tema terpaginasi dari backend (maks. 12 tema per halaman)
  useEffect(() => {
    let mounted = true;
    setIsLoadingTemplates(true);

    templateService
      .getAll({
        active: true,
        page: currentPage,
        limit: TEMPLATES_PER_PAGE,
        category: activeCategory,
        packageTier: activePackageTier,
      })
      .then((res) => {
        if (!mounted) return;
        const dbList = Array.isArray(res?.data) ? res.data : [];
        const srvPage = res?.pagination?.page || currentPage;
        const srvLimit = res?.pagination?.limit || TEMPLATES_PER_PAGE;
        const srvTotal =
          res?.pagination?.total !== undefined
            ? res.pagination.total
            : dbList.length;
        const srvTotalPages =
          res?.pagination?.totalPages ||
          Math.max(1, Math.ceil(srvTotal / srvLimit));

        const mapped = dbList.slice(0, TEMPLATES_PER_PAGE).map((t, idx) => {
          const dJson = t.default_content_json || {};
          const meta = TEMPLATE_META_BY_CODE[t.template_code] || {
            category:
              t.template_code.includes("jawa") ||
              t.template_code.includes("sunda")
                ? "tradisional"
                : t.template_code.includes("rustic") ||
                    t.template_code.includes("forest")
                  ? "rustic"
                  : "modern",
            tag: "Atelier",
          };
          const eventCategory = (
            dJson.templateEventType ||
            dJson.eventType ||
            "wedding"
          ).toLowerCase();
          const packageTier = (dJson.packageTier || "all").toLowerCase();
          const styleCategory = dJson.styleCategory || meta.category;
          const tag = dJson.tag || meta.tag;
          const fallbackImg =
            DEFAULT_DB_TEMPLATES.find((d) => d.code === t.template_code)
              ?.image || "/images/defaults/couple-cover.jpg";
          return {
            id: t.id,
            no: String((srvPage - 1) * srvLimit + idx + 1).padStart(2, "0"),
            code: t.template_code,
            name: t.name,
            category: styleCategory,
            eventCategory,
            packageTier,
            tag,
            image: t.thumbnail_url || fallbackImg,
          };
        });

        setTemplates(mapped);
        setPagination({
          page: srvPage,
          limit: srvLimit,
          total: srvTotal,
          totalPages: srvTotalPages,
          hasNext:
            res?.pagination?.hasNext !== undefined
              ? res.pagination.hasNext
              : srvPage < srvTotalPages,
          hasPrev:
            res?.pagination?.hasPrev !== undefined
              ? res.pagination.hasPrev
              : srvPage > 1,
        });

        if (Array.isArray(res?.meta?.availableEventCategories)) {
          setAvailableEventCategories(res.meta.availableEventCategories);
        }
      })
      .catch(() => {
        if (!mounted) return;
        // Fallback offline tetap dipaginasi maks. 12 item per halaman
        const byCategory =
          activeCategory === "all"
            ? DEFAULT_DB_TEMPLATES
            : ["wedding", "engagement", "birthday", "event"].includes(
                  activeCategory,
                )
              ? DEFAULT_DB_TEMPLATES.filter(
                  (t) =>
                    (t.eventCategory || "wedding") === activeCategory ||
                    t.eventCategory === "all",
                )
              : DEFAULT_DB_TEMPLATES.filter(
                  (t) => t.category === activeCategory,
                );

        const byTier =
          activePackageTier === "all"
            ? byCategory
            : byCategory.filter(
                (t) =>
                  (t.packageTier || "all") === "all" ||
                  (t.packageTier || "all") === activePackageTier,
              );

        const total = byTier.length;
        const totalPages = Math.max(1, Math.ceil(total / TEMPLATES_PER_PAGE));
        const safePage = Math.min(currentPage, totalPages);
        const start = (safePage - 1) * TEMPLATES_PER_PAGE;
        setTemplates(byTier.slice(start, start + TEMPLATES_PER_PAGE));
        setPagination({
          page: safePage,
          limit: TEMPLATES_PER_PAGE,
          total,
          totalPages,
          hasNext: safePage < totalPages,
          hasPrev: safePage > 1,
        });
      })
      .finally(() => {
        if (mounted) setIsLoadingTemplates(false);
      });

    return () => {
      mounted = false;
    };
  }, [currentPage, activeCategory, activePackageTier]);

  const PACKAGE_TIER_META = {
    intimate: { code: "01", label: "Intimate" },
    signature: { code: "02", label: "Signature" },
    bespoke: { code: "03", label: "Bespoke" },
  };

  const filteredTemplates = templates;

  const eventCategoryTabs = [
    { id: "engagement", label: "Lamaran" },
    { id: "birthday", label: "Ulang Tahun" },
    { id: "event", label: "Acara Umum" },
  ].filter((tab) => availableEventCategories.includes(tab.id));

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const handleSelectPackageTier = (tierId) => {
    setActivePackageTier(tierId);
    setCurrentPage(1);
  };

  const handleChangePage = (nextPage) => {
    const clamped = Math.max(1, Math.min(pagination.totalPages, nextPage));
    if (clamped === currentPage) return;
    setCurrentPage(clamped);
    const section = document.getElementById("koleksi");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getVisiblePageNumbers = () => {
    const totalPages = pagination.totalPages || 1;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push("ellipsis-start");
    for (let p = start; p <= end; p += 1) pages.push(p);
    if (end < totalPages - 1) pages.push("ellipsis-end");
    pages.push(totalPages);
    return pages;
  };

  const modesList = cms.systemModes || SYSTEM_MODES;
  const currentMode =
    modesList.find((m) => m.id === activeMode) ||
    modesList[1] ||
    SYSTEM_MODES[1];

  const handleGoAuth = () => {
    if (onNavigate) {
      onNavigate(isAuthenticated ? "/dashboard" : "/login");
    } else {
      window.location.href = isAuthenticated ? "/dashboard" : "/login";
    }
  };

  return (
    <div
      className="min-h-screen bg-[#E6D2BE] text-[#2B0C0C] selection:bg-[#4A1515] selection:text-[#E6D2BE]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ============================================================== */}
      {/* FLOATING MINIMAL HEADER                                        */}
      {/* ============================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
          scrolled
            ? "bg-[#2B0C0C]/95 backdrop-blur-md border-b border-[#633A2C]/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="focus:outline-none"
          >
            <DelleaLogo
              variant="horizontal"
              theme="light"
              size="sm"
              showTagline={false}
            />
          </a>

          <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.26em] text-[#D8BFA6]">
            <a
              href="#koleksi"
              className="hover:text-[#E6D2BE] transition-colors"
            >
              Katalog
            </a>
            <a
              href="#sistem"
              className="hover:text-[#E6D2BE] transition-colors"
            >
              Sistem
            </a>
            <a
              href="#pricelist"
              className="hover:text-[#E6D2BE] transition-colors"
            >
              Pricelist
            </a>
            <a href="#faq" className="hover:text-[#E6D2BE] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <button
              type="button"
              onClick={handleGoAuth}
              className="px-5 py-2 border border-[#C9A98B]/60 hover:border-[#E6D2BE] hover:bg-[#E6D2BE] hover:text-[#2B0C0C] text-[#E6D2BE] text-[10px] uppercase tracking-[0.24em] font-semibold transition-all duration-300 cursor-pointer"
            >
              {isAuthenticated ? "Dashboard" : "Masuk"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#E6D2BE]"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2B0C0C] border-b border-[#633A2C] px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3 text-xs uppercase tracking-[0.24em] text-[#E6D2BE]">
              <a href="#koleksi" onClick={() => setMobileMenuOpen(false)}>
                Katalog
              </a>
              <a href="#sistem" onClick={() => setMobileMenuOpen(false)}>
                Sistem
              </a>
              <a href="#pricelist" onClick={() => setMobileMenuOpen(false)}>
                Pricelist
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
            </div>
            <button
              type="button"
              onClick={handleGoAuth}
              className="w-full py-3 bg-[#E6D2BE] text-[#2B0C0C] text-xs uppercase tracking-[0.22em] font-semibold"
            >
              {isAuthenticated ? "Dashboard" : "Masuk"}
            </button>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* FULL-SCREEN ATELIER HERO (#4A1515 MULBERRY BURGUNDY)           */}
      {/* ============================================================== */}
      <section className="relative min-h-dvh bg-[#4A1515] text-[#E6D2BE] flex flex-col justify-between px-6 sm:px-10 pt-28 pb-10 border-b border-[#633A2C] overflow-hidden">
        {/* Subtle radial vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(99,58,44,0.28) 0%, rgba(43,12,12,0.65) 100%)",
          }}
        />

        <div className="relative z-10 my-auto max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="dellea-float inline-block mb-6">
              <DelleaLogo variant="mark" theme="light" size="xl" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1
              className="text-5xl sm:text-7xl lg:text-[96px] font-normal uppercase leading-[0.95] tracking-[0.08em] text-[#E6D2BE]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              SAMSKARA
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <div className="flex items-center justify-center gap-5 mt-5 text-[10px] sm:text-xs uppercase tracking-[0.38em] text-[#D8BFA6]">
              <span>ETERNAL</span>
              <span className="text-sm text-[#E6D2BE]">☾</span>
              <span>MEMORIES</span>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 text-xs sm:text-sm text-[#D8BFA6]/90 max-w-md mx-auto leading-relaxed font-light tracking-wide">
              {cms.heroSubtitle}
            </p>
          </Reveal>

          <Reveal delay={420}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#koleksi"
                className="px-8 py-3.5 bg-[#E6D2BE] hover:bg-[#D8BFA6] text-[#2B0C0C] text-[11px] uppercase tracking-[0.24em] font-semibold transition-all duration-300"
              >
                Lihat Koleksi
              </a>
              <a
                href="#pricelist"
                className="px-8 py-3.5 border border-[#C9A98B]/60 hover:border-[#E6D2BE] text-[#E6D2BE] text-[11px] uppercase tracking-[0.24em] transition-all duration-300"
              >
                Pricelist &amp; Custom
              </a>
            </div>
          </Reveal>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.34em] text-[#C9A98B]">
            Scroll
          </span>
          <div className="w-px h-10 bg-[#633A2C] overflow-hidden">
            <div className="w-full h-full bg-[#E6D2BE] dellea-scroll-indicator" />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE SYSTEM SWITCHER (MINIMAL WORDS, KINETIC STAGE)     */}
      {/* ============================================================== */}
      <section
        id="sistem"
        className="bg-[#E6D2BE] border-b border-[#C9A98B] py-20 sm:py-28 px-6 sm:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-[#C9A98B]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#633A2C] mb-2">
                  Fleksibilitas Sistem
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-normal text-[#2B0C0C]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Tiga Mode{" "}
                  <span className="italic text-[#4A1515]">Penggunaan</span>
                </h2>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex border border-[#3B1010]">
                {modesList.map((m) => {
                  const active = activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveMode(m.id)}
                      className={`px-4 sm:px-6 py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-pointer ${
                        active
                          ? "bg-[#3B1010] text-[#E6D2BE]"
                          : "bg-transparent text-[#3B1010] hover:bg-[#D8BFA6]"
                      }`}
                    >
                      <span className="hidden sm:inline mr-1.5 opacity-60">
                        {m.num}.
                      </span>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Animated Stage */}
          <div
            key={currentMode.id}
            className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-500"
          >
            <div className="lg:col-span-6 space-y-6">
              <span
                className="text-6xl sm:text-7xl italic font-light text-[#633A2C]/45 block leading-none"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {currentMode.num}
              </span>
              <h3
                className="text-3xl sm:text-5xl font-normal text-[#2B0C0C] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {currentMode.title}
              </h3>
              <p className="text-sm text-[#3B1010] max-w-md leading-relaxed">
                {currentMode.caption}
              </p>

              <div className="pt-4 flex flex-wrap gap-2">
                {currentMode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 border border-[#633A2C]/50 bg-[#E0D6B8] text-[10px] uppercase tracking-[0.18em] text-[#2B0C0C] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/11] overflow-hidden border border-[#633A2C] bg-[#2B0C0C] group">
                <img
                  src={currentMode.image}
                  alt={currentMode.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B0C0C]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[#E6D2BE]">
                  <span className="text-[10px] uppercase tracking-[0.28em]">
                    {currentMode.label}
                  </span>
                  <DelleaLogo variant="wreath" theme="light" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* VISUAL LOOKBOOK GALLERY (MINIMAL TEXT, STAGGERED MOTION)       */}
      {/* ============================================================== */}
      <section
        id="koleksi"
        className="bg-[#E0D6B8] border-b border-[#C9A98B] py-20 sm:py-28 px-6 sm:px-10"
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-[#C9A98B]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#633A2C] mb-2">
                  Kurasi Katalog
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-normal text-[#2B0C0C]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Pilih <span className="italic text-[#4A1515]">Tema</span>
                </h2>
              </div>

              <div className="flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.22em]">
                {[
                  { id: "all", label: "Semua" },
                  { id: "modern", label: "Modern" },
                  { id: "tradisional", label: "Adat" },
                  { id: "rustic", label: "Botanical" },
                  ...eventCategoryTabs,
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectCategory(tab.id)}
                    className={`pb-1 transition-all cursor-pointer ${
                      activeCategory === tab.id
                        ? "text-[#2B0C0C] font-bold border-b-2 border-[#3B1010]"
                        : "text-[#633A2C] hover:text-[#2B0C0C]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Tipe Paket Tema */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <span className="text-[#633A2C]/80 mr-1">Tipe Paket:</span>
              {[
                { id: "all", label: "Semua Paket" },
                { id: "intimate", label: "01 / Intimate" },
                { id: "signature", label: "02 / Signature" },
                { id: "bespoke", label: "03 / Bespoke" },
              ].map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handleSelectPackageTier(pkg.id)}
                  className={`px-3 py-1.5 border transition-all cursor-pointer ${
                    activePackageTier === pkg.id
                      ? "bg-[#3B1010] text-[#E6D2BE] border-[#3B1010] font-semibold"
                      : "bg-transparent text-[#633A2C] border-[#C9A98B] hover:border-[#3B1010] hover:text-[#2B0C0C]"
                  }`}
                >
                  {pkg.label}
                </button>
              ))}
            </div>
          </Reveal>

          {filteredTemplates.length === 0 && !isLoadingTemplates ? (
            <div className="mt-12 py-16 px-6 border border-[#C9A98B] text-center space-y-3">
              <p className="text-sm text-[#633A2C]">
                Belum ada tema pada kombinasi filter kategori &amp; tipe paket
                ini.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setActivePackageTier("all");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center px-4 py-2 text-[10px] uppercase tracking-[0.22em] border border-[#3B1010] text-[#3B1010] hover:bg-[#3B1010] hover:text-[#E6D2BE] transition-colors cursor-pointer"
              >
                Tampilkan Semua Tema
              </button>
            </div>
          ) : (
            <>
              <div
                className={`mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 transition-opacity duration-300 ${
                  isLoadingTemplates ? "opacity-55 pointer-events-none" : "opacity-100"
                }`}
              >
                {filteredTemplates.map((tpl, idx) => {
                  const pkgInfo = PACKAGE_TIER_META[tpl.packageTier];
                  return (
                    <Reveal key={`${pagination.page}-${tpl.code}`} delay={idx * 50}>
                      <a href={`/preview/${tpl.code}`} className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#2B0C0C] border border-[#C9A98B]">
                          <img
                            src={tpl.image}
                            alt={tpl.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/defaults/couple-cover.jpg";
                            }}
                            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108 opacity-92"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2B0C0C]/85 via-transparent to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />

                          <span className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#E6D2BE]">
                            /{tpl.no}
                          </span>
                          <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 flex flex-col items-end gap-1">
                            {pkgInfo && (
                              <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-[#E6D2BE] text-[#2B0C0C] text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em]">
                                {pkgInfo.label}
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-[#2B0C0C]/70 backdrop-blur-xs text-[8px] sm:text-[9px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#E6D2BE]">
                              {tpl.tag}
                            </span>
                          </div>

                          <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-2 text-[#E6D2BE]">
                            <h3
                              className="text-base sm:text-xl lg:text-2xl italic font-normal leading-tight line-clamp-2"
                              style={{
                                fontFamily:
                                  "'Cormorant Garamond', Georgia, serif",
                              }}
                            >
                              {tpl.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#C9A98B] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                              <span>Demo</span>
                              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </span>
                          </div>
                        </div>
                      </a>
                    </Reveal>
                  );
                })}
              </div>

              {/* Pagination Katalog */}
              {pagination.total > 0 && (
                <div className="mt-10 sm:mt-14 pt-6 border-t border-[#C9A98B] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#633A2C]">
                    Menampilkan{" "}
                    <span className="font-semibold text-[#2B0C0C]">
                      {(pagination.page - 1) * pagination.limit + 1}–
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total,
                      )}
                    </span>{" "}
                    dari{" "}
                    <span className="font-semibold text-[#2B0C0C]">
                      {pagination.total}
                    </span>{" "}
                    tema
                  </p>

                  {pagination.totalPages > 1 && (
                    <nav
                      aria-label="Navigasi halaman katalog tema"
                      className="flex items-center gap-1.5 sm:gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => handleChangePage(currentPage - 1)}
                        disabled={!pagination.hasPrev || isLoadingTemplates}
                        className="inline-flex items-center gap-1 px-3 py-2 text-[10px] uppercase tracking-[0.18em] border border-[#C9A98B] text-[#3B1010] hover:border-[#3B1010] hover:bg-[#3B1010] hover:text-[#E6D2BE] disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-[#3B1010] disabled:hover:border-[#C9A98B] disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Prev</span>
                      </button>

                      {getVisiblePageNumbers().map((item) =>
                        typeof item === "string" ? (
                          <span
                            key={item}
                            className="px-2 text-xs text-[#633A2C] select-none"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleChangePage(item)}
                            disabled={isLoadingTemplates}
                            aria-current={
                              item === pagination.page ? "page" : undefined
                            }
                            className={`min-w-[34px] h-[34px] px-2 text-xs font-mono border transition-colors cursor-pointer ${
                              item === pagination.page
                                ? "bg-[#3B1010] text-[#E6D2BE] border-[#3B1010] font-semibold"
                                : "bg-transparent text-[#3B1010] border-[#C9A98B] hover:border-[#3B1010] hover:bg-[#3B1010]/10"
                            }`}
                          >
                            {item}
                          </button>
                        ),
                      )}

                      <button
                        type="button"
                        onClick={() => handleChangePage(currentPage + 1)}
                        disabled={!pagination.hasNext || isLoadingTemplates}
                        className="inline-flex items-center gap-1 px-3 py-2 text-[10px] uppercase tracking-[0.18em] border border-[#C9A98B] text-[#3B1010] hover:border-[#3B1010] hover:bg-[#3B1010] hover:text-[#E6D2BE] disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-[#3B1010] disabled:hover:border-[#C9A98B] disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </nav>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* ULTRA-CONCISE PRICELIST & CUSTOM (#3B1010 OXBLOOD)             */}
      {/* ============================================================== */}
      <section
        id="pricelist"
        className="bg-[#3B1010] text-[#E6D2BE] border-b border-[#633A2C] py-20 sm:py-28 px-6 sm:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10 border-b border-[#633A2C]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#C9A98B] mb-2">
                  Investasi
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-normal text-[#E6D2BE]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {(() => {
                    const titleText = (
                      cms.pricelistTitle || "Pricelist & Custom"
                    ).trim();
                    const parts = titleText.split(" ");
                    if (parts.length <= 1) return titleText;
                    const lastWord = parts.pop();
                    return (
                      <>
                        {parts.join(" ")}{" "}
                        <span className="italic text-[#C9A98B]">
                          {lastWord}
                        </span>
                      </>
                    );
                  })()}
                </h2>
              </div>
              <p className="text-xs text-[#D8BFA6] tracking-wide max-w-sm sm:text-right">
                {cms.pricelistSubtitle ||
                  "Pilih paket undangan digital sesuai kebutuhan acara dan alur tamu Anda."}
              </p>
            </div>
          </Reveal>

          <div
            className={`grid grid-cols-1 ${
              (cms.pricelist || []).length === 2
                ? "lg:grid-cols-2"
                : "lg:grid-cols-3"
            } divide-y lg:divide-y-0 lg:divide-x divide-[#633A2C] border-b border-[#633A2C]`}
          >
            {(cms.pricelist || []).map((pkg, idx) => (
              <Reveal
                key={`${pkg.tier}-${idx}`}
                delay={idx * 120}
                className={`py-10 ${
                  idx === 0
                    ? "lg:pr-10"
                    : idx === (cms.pricelist || []).length - 1
                      ? "lg:pl-10"
                      : "lg:px-10"
                } ${
                  pkg.featured ? "bg-[#4A1515]/70 px-6 lg:px-10" : ""
                } flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-[#C9A98B] block mb-2">
                    {pkg.tier}
                  </span>
                  <h3
                    className="text-3xl font-normal text-[#E6D2BE]"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-[#D8BFA6] leading-relaxed mt-2 lg:min-h-[40px]">
                    {pkg.note}
                  </p>

                  <div className="my-7 py-5 border-y border-[#633A2C] space-y-1">
                    {pkg.originalPrice && (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm text-[#C9A98B]/80 line-through decoration-[#E6D2BE]/80 tracking-wide">
                          IDR {pkg.originalPrice}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs uppercase tracking-widest text-[#C9A98B]">
                        IDR
                      </span>
                      <span
                        className="text-5xl font-normal text-[#E6D2BE]"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}
                      >
                        {pkg.price}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#D8BFA6]">
                    {(pkg.items || [])
                      .filter((it) => String(it || "").trim() !== "")
                      .map((it, itemIdx) => (
                        <li
                          key={`${it}-${itemIdx}`}
                          className="flex items-start gap-2.5"
                        >
                          <span className="text-[#C9A98B] shrink-0">—</span>
                          <span>{it}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleGoAuth}
                  className={`mt-9 w-full py-3.5 text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-300 cursor-pointer ${
                    pkg.featured
                      ? "bg-[#E6D2BE] hover:bg-[#D8BFA6] text-[#2B0C0C]"
                      : "border border-[#C9A98B] hover:bg-[#E6D2BE] hover:text-[#2B0C0C] text-[#E6D2BE]"
                  }`}
                >
                  {pkg.ctaLabel || "Pilih Paket"}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FAQ / PERTANYAAN UMUM (#E6D2BE CHAMPAGNE)                      */}
      {/* ============================================================== */}
      <section
        id="faq"
        className="bg-[#E6D2BE] text-[#2B0C0C] border-b border-[#C9A98B] py-20 sm:py-28 px-6 sm:px-10"
      >
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10 border-b border-[#C9A98B]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#633A2C] mb-2">
                  FAQ
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-normal text-[#2B0C0C]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {(() => {
                    const titleText = (
                      cms.faqTitle || "Pertanyaan Umum"
                    ).trim();
                    const parts = titleText.split(" ");
                    if (parts.length <= 1) return titleText;
                    const lastWord = parts.pop();
                    return (
                      <>
                        {parts.join(" ")}{" "}
                        <span className="italic text-[#633A2C]">
                          {lastWord}
                        </span>
                      </>
                    );
                  })()}
                </h2>
              </div>
              <p className="text-xs text-[#633A2C] tracking-wide max-w-sm sm:text-right">
                {cms.faqSubtitle ||
                  "Jawaban singkat seputar cara pemesanan, fitur undangan digital, hingga integrasi QR check-in."}
              </p>
            </div>
          </Reveal>

          <div className="divide-y divide-[#C9A98B] border-b border-[#C9A98B]">
            {(cms.faqs || DEFAULT_FAQS).map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <Reveal key={`${item.question}-${idx}`} delay={idx * 45}>
                  <div className="py-5 sm:py-6">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-start justify-between gap-4 text-left group cursor-pointer"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
                        <span className="text-[11px] font-mono tracking-widest text-[#633A2C]/80 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="text-xl sm:text-2xl font-normal text-[#2B0C0C] group-hover:text-[#4A1515] transition-colors leading-snug"
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                          }}
                        >
                          {item.question}
                        </span>
                      </div>
                      <span className="mt-1 w-7 h-7 shrink-0 border border-[#C9A98B] group-hover:border-[#3B1010] flex items-center justify-center text-[#3B1010] transition-colors">
                        {isOpen ? (
                          <Minus className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-3.5 pl-9 sm:pl-12 pr-8 sm:pr-12">
                        <p className="text-xs sm:text-sm text-[#4A2520] leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MINIMALIST FOOTER (#2B0C0C)                                    */}
      {/* ============================================================== */}
      <footer className="bg-[#2B0C0C] text-[#E6D2BE] py-16 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <Reveal>
            <DelleaLogo variant="stacked" theme="light" size="md" />
          </Reveal>

          <Reveal delay={90}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs tracking-wide">
              <a
                href="https://instagram.com/samskara.createed"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#633A2C]/70 hover:border-[#C9A98B] hover:bg-[#3B1010] text-[#E6D2BE] transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-[#C9A98B] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>@samskara.createed</span>
              </a>

              <a
                href="https://www.tiktok.com/@samskara_created"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#633A2C]/70 hover:border-[#C9A98B] hover:bg-[#3B1010] text-[#E6D2BE] transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-[#C9A98B] fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z" />
                </svg>
                <span>@samskara_created</span>
              </a>

              <a
                href="mailto:samskara.id00@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#633A2C]/70 hover:border-[#C9A98B] hover:bg-[#3B1010] text-[#E6D2BE] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C9A98B]" />
                <span>samskara.id00@gmail.com</span>
              </a>

              <a
                href="https://wa.me/628570254446?text=Halo%20Samskara%2C%20saya%20ingin%20konsultasi%20tentang%20undangan%20digital."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#633A2C]/70 hover:border-[#C9A98B] hover:bg-[#3B1010] text-[#E6D2BE] transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-[#C9A98B] fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.46 0 .1 5.36.1 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.22-1.63a11.9 11.9 0 0 0 5.84 1.49h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.51-8.42ZM12.07 21.84h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.69.97.99-3.6-.24-.37a9.89 9.89 0 0 1-1.52-5.29c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.87-9.96 9.87Zm5.44-7.43c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
                </svg>
                <span>0857-0254-4446</span>
              </a>
            </div>
          </Reveal>

          <div className="mt-10 pt-8 border-t border-[#4A1515] w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-[#C9A98B]">
            <span>© {new Date().getFullYear()} SAMSKARA</span>
            <button
              type="button"
              onClick={handleGoAuth}
              className="inline-flex items-center gap-2 text-[#E6D2BE] hover:text-[#C9A98B] transition-colors cursor-pointer"
            >
              <span>
                {isAuthenticated ? "Buka Dashboard" : "Masuk Panel Akun"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* FLOATING WHATSAPP BUTTON                                       */}
      {/* ============================================================== */}
      <a
        href="https://wa.me/628570254446?text=Halo%20Samskara%2C%20saya%20ingin%20konsultasi%20tentang%20undangan%20digital."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Samskara"
        className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 group inline-flex items-center gap-2.5 rounded-full bg-[#4A1515] hover:bg-[#3B1010] text-[#E6D2BE] px-4 py-3 sm:px-5 sm:py-3.5 border border-[#C9A98B]/80 hover:border-[#E6D2BE] shadow-[0_12px_32px_rgba(43,12,12,0.42)] ring-1 ring-[#E6D2BE]/30 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <svg
          className="w-5 h-5 text-[#E6D2BE] fill-current shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.46 0 .1 5.36.1 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.22-1.63a11.9 11.9 0 0 0 5.84 1.49h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.51-8.42ZM12.07 21.84h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.69.97.99-3.6-.24-.37a9.89 9.89 0 0 1-1.52-5.29c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.87-9.96 9.87Zm5.44-7.43c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
        <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#E6D2BE] hidden sm:inline">
          Chat WhatsApp
        </span>
      </a>
    </div>
  );
};
