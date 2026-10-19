import React, { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon } from 'lucide-react';

/**
 * Normalizer untuk mengekstrak URL foto baik dari array string maupun array objek
 */
const getPhotoUrl = (item) => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.url || item.src || item.photoUrl || item.image || '';
};

const getPhotoCaption = (item) => {
  if (!item || typeof item === 'string') return '';
  return item.caption || item.title || item.alt || '';
};

/**
 * Fullscreen Interactive Lightbox untuk Galeri Foto Undangan
 * - Mendukung navigasi tombol panah kiri / kanan (Desktop & Mobile)
 * - Mendukung navigasi keyboard: ArrowLeft, ArrowRight, dan Escape
 * - Mendukung navigasi usapan layar (Touch Swipe) pada smartphone
 * - Kompatibel dengan props: activeIndex/currentIndex dan onIndexChange/onChangeIndex
 */
export const GalleryLightbox = ({
  photos = [],
  activeIndex,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  onChangeIndex,
}) => {
  // Ambil index aktif dari activeIndex atau currentIndex
  const currentIdx =
    typeof activeIndex === 'number'
      ? activeIndex
      : typeof currentIndex === 'number'
      ? currentIndex
      : 0;

  // Normalisasi callback perubahan slide
  const changeIndex = useCallback(
    (newIndex) => {
      if (typeof onIndexChange === 'function') {
        onIndexChange(newIndex);
      } else if (typeof onChangeIndex === 'function') {
        onChangeIndex(newIndex);
      }
    },
    [onIndexChange, onChangeIndex]
  );

  const totalPhotos = photos.length;

  const handlePrev = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (totalPhotos <= 1) return;
      const nextIdx = (currentIdx - 1 + totalPhotos) % totalPhotos;
      changeIndex(nextIdx);
    },
    [currentIdx, totalPhotos, changeIndex]
  );

  const handleNext = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (totalPhotos <= 1) return;
      const nextIdx = (currentIdx + 1) % totalPhotos;
      changeIndex(nextIdx);
    },
    [currentIdx, totalPhotos, changeIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch Swipe gesture support untuk perangkat mobile/smartphone
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    // Pastikan usapan dominan horizontal (minimal 40px)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // Swipe ke kiri -> Foto berikutnya
        handleNext();
      } else {
        // Swipe ke kanan -> Foto sebelumnya
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Thumbnail active auto-scroll
  const activeThumbRef = useRef(null);
  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIdx]);

  if (!isOpen || totalPhotos === 0) return null;

  const currentItem = photos[currentIdx];
  const currentPhotoUrl = getPhotoUrl(currentItem);
  const currentCaption = getPhotoCaption(currentItem);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in-0 duration-200 select-none"
    >
      {/* Top Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl flex items-center justify-between text-white/80 py-2 px-2 z-30"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-200">
            Foto {currentIdx + 1} dari {totalPhotos}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer shadow-lg backdrop-blur-md border border-white/15"
          title="Tutup Galeri (Esc)"
          aria-label="Tutup Galeri"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Frame with Nav Arrows */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-4xl flex-1 flex items-center justify-center min-h-0 py-2 sm:py-4 px-2"
      >
        {/* Tombol Panah Kiri (Prev) */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-black/75 hover:bg-black/95 active:scale-90 text-white transition-all backdrop-blur-md border border-white/30 shadow-2xl hover:border-amber-400 cursor-pointer group"
            title="Foto Sebelumnya (Panah Kiri)"
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 group-hover:text-amber-300 transition-colors" />
          </button>
        )}

        {/* Gambar Utama */}
        {currentPhotoUrl ? (
          <img
            key={currentIdx}
            src={currentPhotoUrl}
            alt={currentCaption || `Gallery ${currentIdx + 1}`}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95"
            draggable={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/60 p-8">
            <ImageIcon className="w-12 h-12 mb-2 text-stone-500" />
            <p className="text-sm">Gambar tidak dapat dimuat</p>
          </div>
        )}

        {/* Tombol Panah Kanan (Next) */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-black/75 hover:bg-black/95 active:scale-90 text-white transition-all backdrop-blur-md border border-white/30 shadow-2xl hover:border-amber-400 cursor-pointer group"
            title="Foto Selanjutnya (Panah Kanan)"
            aria-label="Foto Selanjutnya"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 group-hover:text-amber-300 transition-colors" />
          </button>
        )}

        {/* Caption jika ada */}
        {currentCaption && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-md bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-center">
            <p className="text-xs text-stone-200 truncate">{currentCaption}</p>
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {totalPhotos > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl overflow-x-auto py-2 px-2 flex items-center justify-start sm:justify-center gap-2.5 z-30 scrollbar-none"
        >
          {photos.map((item, idx) => {
            const thumbUrl = getPhotoUrl(item);
            const isActive = idx === currentIdx;
            return (
              <button
                key={idx}
                ref={isActive ? activeThumbRef : null}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  changeIndex(idx);
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-400 scale-110 shadow-[0_0_15px_rgba(251,191,36,0.5)] opacity-100 ring-2 ring-amber-400/30'
                    : 'border-white/20 opacity-40 hover:opacity-90 hover:scale-105'
                }`}
                title={`Lihat Foto ${idx + 1}`}
                aria-label={`Lihat Foto ${idx + 1}`}
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center text-[10px] text-white/40">
                    {idx + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
