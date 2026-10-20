import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  X,
  ChevronUp,
  Crown,
  Check,
  Copy,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

/**
 * FLOATING CONTROLS FOR DIGITAL INVITATION
 * 1. Floater Penanda Buku di samping (Bookmark QR Pass):
 *    Menempel di sisi kiri layar seperti penanda buku pita mewah.
 *    Ketika diklik, memunculkan modal kartu akses QR tamu lengkap.
 * 2. Floater Scroll to Top di kanan bawah:
 *    Tombol melayang di pojok kanan bawah untuk scroll kembali ke paling atas secara halus.
 */

export const InvitationFloatingControls = ({
  qrValue,
  guestName = 'Tamu Undangan',
  guestCategory = 'Reguler',
  guestPax = 1,
  isOpened = false,
  showQr = true, // Mengatur apakah floater penanda buku QR ditampilkan atau disembunyikan
  accentColor = '#DFB76C', // default gold/amber
  theme = 'gold', // 'gold' | 'wood' | 'dark' | 'sage'
  isOpen: externalIsOpen,
  onOpenChange: setExternalIsOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isQrModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsQrModalOpen = (val) => {
    setInternalIsOpen(val);
    if (setExternalIsOpen) setExternalIsOpen(val);
  };
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const widgetRef = useRef(null);

  // Monitor scroll untuk menampilkan / menyembunyikan tombol scroll to top
  useEffect(() => {
    if (!isOpened) return;

    const checkScroll = () => {
      // Periksa apakah berada di dalam container scrollable (seperti modal preview) atau window utama
      const scrollableParent = widgetRef.current?.closest('.overflow-y-auto');
      const currentScroll = scrollableParent
        ? scrollableParent.scrollTop
        : window.pageYOffset || document.documentElement.scrollTop;

      setShowScrollTop(currentScroll > 250);
    };

    window.addEventListener('scroll', checkScroll, { passive: true });

    const scrollableParent = widgetRef.current?.closest('.overflow-y-auto');
    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', checkScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', checkScroll);
      if (scrollableParent) {
        scrollableParent.removeEventListener('scroll', checkScroll);
      }
    };
  }, [isOpened]);

  // Handler Scroll ke atas secara smooth
  const handleScrollToTop = () => {
    const scrollableParent = widgetRef.current?.closest('.overflow-y-auto');
    if (scrollableParent) {
      scrollableParent.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Copy kode QR ke clipboard
  const handleCopyCode = () => {
    if (!qrValue) return;
    navigator.clipboard.writeText(qrValue);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpened) return null;

  const isVip = (guestCategory || '').toUpperCase() === 'VIP';

  // Tema styling terpadu untuk Floater dan Modal QR Code
  const getThemeStyles = () => {
    switch (theme) {
      case 'forest':
      case 'tropical':
        return {
          bg: 'bg-gradient-to-r from-[#071E14] via-[#0C2A1C] to-[#14422B]',
          border: 'border-[#52B788]/60',
          text: 'text-[#D8F3DC]',
          badgeBg: 'bg-[#2D6A4F]/40',
          badgeText: 'text-[#A6D854]',
          modalBg: 'bg-[#04120B]',
          modalBorder: 'border-[#52B788]/40',
          modalGlow: 'bg-[#52B788]/20',
          modalBadgeBg: 'bg-[#2D6A4F]/40 border-[#52B788]/50 text-[#A6D854]',
          qrShadow: 'shadow-[0_0_25px_rgba(166,216,84,0.3)]',
          btnPrimary: 'bg-gradient-to-r from-[#2F8A48] via-[#52B788] to-[#2F8A48] text-[#04120B] shadow-[#52B788]/30',
          infoCardBg: 'bg-[#071E14]/90 border-[#52B788]/20',
        };
      case 'crimson':
      case 'maroon':
        return {
          bg: 'bg-gradient-to-r from-[#4A070A] via-[#660D14] to-[#80141D]',
          border: 'border-[#E5989B]/50',
          text: 'text-[#FFF5F5]',
          badgeBg: 'bg-[#80141D]/40',
          badgeText: 'text-[#FAD2D4]',
          modalBg: 'bg-[#250306]',
          modalBorder: 'border-[#E5989B]/40',
          modalGlow: 'bg-[#B32430]/25',
          modalBadgeBg: 'bg-[#80141D]/40 border-[#E5989B]/50 text-[#FAD2D4]',
          qrShadow: 'shadow-[0_0_25px_rgba(229,152,155,0.35)]',
          btnPrimary: 'bg-gradient-to-r from-[#8A151F] via-[#B32430] to-[#8A151F] text-white shadow-[#B32430]/30',
          infoCardBg: 'bg-[#380509]/90 border-[#E5989B]/20',
        };
      case 'wood':
      case 'rustic':
        return {
          bg: 'bg-gradient-to-r from-[#2A1B10] via-[#3E2717] to-[#4A2F1B]',
          border: 'border-[#8C6239]/60',
          text: 'text-[#F5EEE6]',
          badgeBg: 'bg-[#8C6239]/30',
          badgeText: 'text-[#D8C3A5]',
          modalBg: 'bg-[#1F140D]',
          modalBorder: 'border-[#8C6239]/40',
          modalGlow: 'bg-[#8C6239]/25',
          modalBadgeBg: 'bg-[#8C6239]/30 border-[#8C6239]/50 text-[#D8C3A5]',
          qrShadow: 'shadow-[0_0_25px_rgba(140,98,57,0.35)]',
          btnPrimary: 'bg-gradient-to-r from-[#8C6239] via-[#A87B4F] to-[#8C6239] text-[#1F140D] font-bold shadow-[#8C6239]/30',
          infoCardBg: 'bg-[#2C1D13]/90 border-[#8C6239]/20',
        };
      case 'sage':
      case 'mildness':
        return {
          bg: 'bg-gradient-to-r from-[#1E2E24] via-[#2D4536] to-[#3B5A46]',
          border: 'border-[#6B9080]/60',
          text: 'text-[#EAF4F4]',
          badgeBg: 'bg-[#6B9080]/30',
          badgeText: 'text-[#A4C3B2]',
          modalBg: 'bg-[#14221A]',
          modalBorder: 'border-[#6B9080]/40',
          modalGlow: 'bg-[#6B9080]/25',
          modalBadgeBg: 'bg-[#6B9080]/30 border-[#6B9080]/50 text-[#A4C3B2]',
          qrShadow: 'shadow-[0_0_25px_rgba(107,144,128,0.35)]',
          btnPrimary: 'bg-gradient-to-r from-[#4D6A5D] via-[#6B9080] to-[#4D6A5D] text-white shadow-[#6B9080]/30',
          infoCardBg: 'bg-[#1E3026]/90 border-[#6B9080]/20',
        };
      case 'dark':
      case 'snap-photo':
        return {
          bg: 'bg-gradient-to-r from-stone-950 via-stone-900 to-stone-850',
          border: 'border-white/20',
          text: 'text-white',
          badgeBg: 'bg-white/10',
          badgeText: 'text-amber-300',
          modalBg: 'bg-zinc-950',
          modalBorder: 'border-zinc-700/60',
          modalGlow: 'bg-amber-500/15',
          modalBadgeBg: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
          qrShadow: 'shadow-[0_0_25px_rgba(245,185,66,0.3)]',
          btnPrimary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-amber-500/25',
          infoCardBg: 'bg-zinc-900/90 border-white/10',
        };
      default: // gold / royal
        return {
          bg: 'bg-gradient-to-r from-[#141824] via-[#1B2232] to-[#252E42]',
          border: 'border-[#DFB76C]/60',
          text: 'text-[#F5DE9C]',
          badgeBg: 'bg-[#DFB76C]/20',
          badgeText: 'text-[#DFB76C]',
          modalBg: 'bg-[#10141D]',
          modalBorder: 'border-[#DFB76C]/40',
          modalGlow: 'bg-[#DFB76C]/20',
          modalBadgeBg: 'bg-[#DFB76C]/20 border-[#DFB76C]/40 text-[#DFB76C]',
          qrShadow: 'shadow-[0_0_25px_rgba(223,183,108,0.35)]',
          btnPrimary: 'bg-gradient-to-r from-[#DFB76C] to-[#B88728] text-black font-bold shadow-[#DFB76C]/30',
          infoCardBg: 'bg-[#161C28]/90 border-[#DFB76C]/20',
        };
    }
  };

  const style = getThemeStyles();

  return (
    <div ref={widgetRef} className="pointer-events-auto">
      {/* ============================================================== */}
      {/* 1. FLOATER QR CODE TAMU VERTIKAL (MUNCUL BERSAMAAN SCROLL TOP) */}
      {/* ============================================================== */}
      {showQr && showScrollTop && (
        <div className="fixed bottom-[8rem] right-4 sm:bottom-[8.25rem] sm:right-6 z-40 select-none animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="relative group">
            {/* Subtle glowing halo on floater */}
            <div
              className="absolute -inset-0.5 rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"
              style={{ backgroundColor: accentColor }}
            />

            {/* Vertical Pill Tag Button */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className={`relative flex flex-col items-center justify-center w-9 sm:w-10 py-2.5 px-1 rounded-2xl ${style.bg} ${style.border} border shadow-[0_6px_25px_rgba(0,0,0,0.5)] backdrop-blur-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:brightness-110 active:scale-95`}
              title="Buka QR Code Check-In Tamu"
              aria-label="QR Code Tamu"
            >
              {/* QR Icon Box with Ping dot */}
              <div
                className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-xl ${style.badgeBg} ${style.badgeText} border border-current/30 shrink-0 mb-1`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </div>

              {/* Vertical Text Label "QR TAMU" memanjang ke bawah */}
              <span
                className="text-[8px] sm:text-[8.5px] font-sans font-bold tracking-[0.2em] uppercase select-none text-white/95 my-1"
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                }}
              >
                QR TAMU
              </span>

              {/* VIP Crown or Status Icon */}
              {isVip && (
                <Crown className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FLOATER SCROLL TO TOP DI ATAS TOMBOL MUSIK                 */}
      {/* ============================================================== */}
      {showScrollTop && (
        <div className="fixed bottom-[4.5rem] right-4 sm:bottom-[4.75rem] sm:right-6 z-40 animate-in fade-in-0 zoom-in-95 duration-200">
          <button
            type="button"
            onClick={handleScrollToTop}
            className={`w-11 h-11 rounded-full flex items-center justify-center ${style.bg} ${style.border} border shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group`}
            title="Kembali ke Bagian Paling Atas"
            aria-label="Scroll ke atas"
          >
            <ChevronUp
              className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5"
              style={{ color: accentColor }}
            />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MODAL INFORMASI QR CODE TAMU (POPUP KARTU VIP CHECK-IN)     */}
      {/* ============================================================== */}
      {isQrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-0 duration-200"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className={`relative w-full max-w-sm rounded-3xl ${style.modalBg} ${style.modalBorder} border p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-hidden animate-in zoom-in-95 duration-200`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Ambient theme glow */}
            <div
              className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 ${style.modalGlow} rounded-full blur-3xl pointer-events-none`}
            />

            {/* Header Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-sans font-semibold uppercase tracking-widest mt-1 mb-3 ${style.modalBadgeBg}`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{isVip ? 'VIP Guest Pass' : 'Kartu Akses Tamu'}</span>
            </div>

            <h3 className="text-xl font-bold font-serif-theme text-white mb-1">
              QR Code Check-In
            </h3>
            <p className="text-xs font-sans text-stone-300/80 mb-5 leading-relaxed">
              Tunjukkan QR Code ini kepada penerima tamu saat tiba di lokasi untuk proses check-in cepat.
            </p>

            {/* QR Code Container */}
            <div
              className={`inline-block p-4 rounded-2xl bg-white ${style.qrShadow} mb-4`}
            >
              <QRCodeSVG
                value={qrValue || 'https://undangan.id/checkin'}
                size={170}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Tamu Info Card */}
            <div
              className={`p-3.5 rounded-2xl ${style.infoCardBg} border text-center font-sans space-y-1 mb-4`}
            >
              <p className="text-[11px] text-stone-400 uppercase tracking-wider">
                Nama Tamu Undangan
              </p>
              <h4 className="text-base font-bold text-white tracking-wide">
                {guestName}
              </h4>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isVip
                      ? `${style.badgeBg} ${style.badgeText} border-current/30`
                      : 'bg-stone-800 text-stone-300 border-stone-700'
                  }`}
                >
                  {guestCategory}
                </span>
                <span className="text-[10px] text-stone-400">
                  • Reservasi: {guestPax} Pax
                </span>
              </div>
            </div>

            {/* Actions: Copy or Close */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-sans font-semibold bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-white/15 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kode Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" />
                    <span>Salin Kode QR</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-sans font-semibold ${style.btnPrimary} shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer`}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
