import React from 'react';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

const getPlayerThemeStyle = (theme = 'gold') => {
  switch (theme) {
    case 'forest':
    case 'tropical':
    case 'tropical-forest':
    case 'sunda':
    case 'sunda-priangan':
      return {
        bg: 'bg-[#04160E]/90 hover:bg-[#072418]',
        border: 'border-[#52B788]/40 hover:border-[#52B788]/70',
        ring: 'ring-[#A6D854]/40',
        labelFrom: 'from-[#2F8A48]',
        labelTo: 'to-[#A6D854]',
        accentText: 'text-[#A6D854]',
        eqColors: ['bg-[#A6D854]', 'bg-[#74C69D]', 'bg-[#A6D854]', 'bg-[#52B788]'],
        glow: 'rgba(166, 216, 84, 0.35)',
      };
    case 'crimson':
    case 'maroon':
    case 'red-white':
    case 'simple-rustic-4':
      return {
        bg: 'bg-[#250306]/90 hover:bg-[#380509]',
        border: 'border-[#E5989B]/40 hover:border-[#E5989B]/70',
        ring: 'ring-[#B32430]/40',
        labelFrom: 'from-[#8A151F]',
        labelTo: 'to-[#E5989B]',
        accentText: 'text-[#FAD2D4]',
        eqColors: ['bg-[#E5989B]', 'bg-[#B32430]', 'bg-[#E5989B]', 'bg-[#FAD2D4]'],
        glow: 'rgba(179, 36, 48, 0.35)',
      };
    case 'wood':
    case 'rustic':
    case 'timeless':
    case 'timeless-snapshot':
      return {
        bg: 'bg-[#1F140D]/90 hover:bg-[#2C1D13]',
        border: 'border-[#8C6239]/40 hover:border-[#8C6239]/70',
        ring: 'ring-[#C9A24B]/40',
        labelFrom: 'from-[#8C6239]',
        labelTo: 'to-[#D8C3A5]',
        accentText: 'text-[#D8C3A5]',
        eqColors: ['bg-[#D8C3A5]', 'bg-[#C9A24B]', 'bg-[#8C6239]', 'bg-[#E3DACB]'],
        glow: 'rgba(140, 98, 57, 0.35)',
      };
    case 'sage':
    case 'mildness':
    case 'serein':
      return {
        bg: 'bg-[#14221A]/90 hover:bg-[#1E3026]',
        border: 'border-[#6B9080]/40 hover:border-[#6B9080]/70',
        ring: 'ring-[#A4C3B2]/40',
        labelFrom: 'from-[#4D6A5D]',
        labelTo: 'to-[#A4C3B2]',
        accentText: 'text-[#A4C3B2]',
        eqColors: ['bg-[#A4C3B2]', 'bg-[#6B9080]', 'bg-[#C2D7CE]', 'bg-[#A4C3B2]'],
        glow: 'rgba(107, 144, 128, 0.35)',
      };
    case 'dark':
    case 'snap-photo':
      return {
        bg: 'bg-zinc-950/90 hover:bg-black',
        border: 'border-zinc-700/60 hover:border-amber-400/50',
        ring: 'ring-amber-400/40',
        labelFrom: 'from-amber-500',
        labelTo: 'to-amber-200',
        accentText: 'text-amber-300',
        eqColors: ['bg-amber-400', 'bg-amber-300', 'bg-amber-400', 'bg-amber-200'],
        glow: 'rgba(245, 185, 66, 0.35)',
      };
    default: // gold / royal / jawa
      return {
        bg: 'bg-[#10141D]/90 hover:bg-[#161C28]',
        border: 'border-[#DFB76C]/40 hover:border-[#DFB76C]/70',
        ring: 'ring-[#DFB76C]/40',
        labelFrom: 'from-amber-600',
        labelTo: 'to-amber-300',
        accentText: 'text-amber-300',
        eqColors: ['bg-amber-400', 'bg-amber-300', 'bg-amber-400', 'bg-amber-200'],
        glow: 'rgba(223, 183, 108, 0.35)',
      };
  }
};

export const MusicVinylPlayer = ({
  musicUrl,
  musicTitle = 'Acoustic Wedding - Romantic Bliss',
  isPlaying,
  onToggle,
  position = 'bottom-right', // 'bottom-right' | 'bottom-left'
  theme = 'gold',
  accentColor,
}) => {
  if (!musicUrl) return null;

  const style = getPlayerThemeStyle(theme);

  const positionClasses =
    position === 'bottom-left'
      ? 'bottom-5 left-4 sm:bottom-6 sm:left-6'
      : 'bottom-5 right-4 sm:bottom-6 sm:right-6';

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <div
      className={`fixed ${positionClasses} z-40 transition-all duration-300`}
    >
      {/* Floating Circular Music Button - Tombol Bulat Tunggal Play/Pause */}
      <button
        type="button"
        onClick={handleClick}
        className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full ${style.bg} text-stone-100 shadow-[0_6px_25px_rgba(0,0,0,0.55)] backdrop-blur-md ${style.border} border cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group select-none ${
          isPlaying ? `ring-2 ${style.ring}` : 'opacity-85'
        }`}
        title={isPlaying ? 'Jeda Musik (Klik untuk Pause)' : 'Putar Musik (Klik untuk Play)'}
        aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
      >
        {/* Rotating Vinyl Disc */}
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full vinyl-grooves flex items-center justify-center flex-shrink-0">
          {/* Spinning wrapper */}
          <div
            className={`w-full h-full rounded-full flex items-center justify-center ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            {/* Center Vinyl Label */}
            <div
              className={`w-4 h-4 rounded-full bg-gradient-to-tr ${style.labelFrom} ${style.labelTo} border border-stone-800 flex items-center justify-center shadow-inner`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />
            </div>
          </div>

          {/* Play/Pause Overlay Icon */}
          <div
            className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity ${
              isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-white" />
            ) : (
              <Play className={`w-3.5 h-3.5 ${style.accentText} fill-current ml-0.5`} />
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
