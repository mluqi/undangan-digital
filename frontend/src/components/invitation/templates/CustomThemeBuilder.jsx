import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Copy,
  Check,
  Heart,
  Sparkles,
  MessageCircle,
  Send,
  Gift,
  QrCode,
  MailOpen,
  Play,
  X,
  ZoomIn,
} from 'lucide-react';
import { GalleryLightbox } from '../GalleryLightbox';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { DesktopSidePanel } from '../DesktopSidePanel';
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { Reveal } from '../Reveal';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';

const INTRO_SAFETY_MS = 15000;
const INTRO_FADE_LEAD_S = 0.85;

export const DEFAULT_CUSTOM_THEME = {
  coverStyle: 'envelope', // 'envelope' | 'arch-curtain' | 'cinematic' | 'gate-curtain'
  heroLayoutStyle: 'arch-frame', // 'arch-frame' | 'fullscreen-photo' | 'cameo-royal' | 'polaroid-collage' | 'magazine-split' | 'minimal-typographic'
  bodyStyleMode: 'texture-default', // 'texture-default' | 'photo-backdrop' | 'slideshow-backdrop' | 'ornate-frame' | 'clean-editorial'
  photoFrameShape: 'cameo-overlay', // 'cameo-overlay' | 'arch' | 'oval' | 'circle' | 'polaroid' | 'rounded'
  cardStyle: 'soft-solid', // 'soft-solid' | 'glass' | 'editorial-flat' | 'double-border'
  galleryStyle: 'editorial', // 'editorial' | 'grid-2' | 'carousel'
  coverOverlayOpacity: 55,
  bgOverlayOpacity: 80,
  colors: {
    bgPrimary: '#fdf9f6',
    bgSecondary: '#f6ebe9',
    textPrimary: '#3b181f',
    textMuted: '#68333e',
    accent: '#a96d79',
    buttonBg: '#68333e',
    buttonText: '#fdf9f6',
  },
  typography: {
    scriptFont: 'font-sloop',
    headingFont: 'font-cardo',
    bodyFont: 'font-public-sans',
  },
  assets: {
    coverBgImage: '/images/drapery-pink/bg-drapery-main.png',
    bodyBgImage: '/images/drapery-pink/bg-paper-long.jpg',
    gateLeftImage: '',
    gateRightImage: '',
    cornerTopLeftImage: '/images/drapery-pink/floral-swirl.png',
    bottomPillarImage: '/images/drapery-pink/corner-roses.png',
    floatingAccentImage: '/images/drapery-pink/butterfly.gif',
    coupleFrameImage: '/images/drapery-pink/oval-frame-border.png',
    headerCalligraphyImage: '/images/drapery-pink/bismillah.svg',
    venueIllustrationImage: '/images/drapery-pink/date-strip-1.png',
    dividerImage: '/images/drapery-pink/divider-flower.png',
    envelopeClosedImage: '/images/drapery-pink/envelope-body.png',
  },
  assetPositions: {
    coverBgImage: 'center', // 'center' | 'top' | 'bottom' | 'contain-center'
    bodyBgImage: 'repeat-y', // 'repeat-y' | 'cover-fixed' | 'top-banner' | 'tile-all'
    envelopeClosedImage: 'center', // 'center' | 'top-curtain' | 'bottom-stage' | 'full-frame'
    coupleFrameImage: 'couple-only', // 'couple-only' | 'couple-and-hero' | 'couple-and-cover' | 'all-photos'
    cornerTopLeftImage: 'top-corners', // 'top-corners' | 'top-both' | 'top-left-only' | 'top-right-only'
    bottomPillarImage: 'bottom-center', // 'bottom-center' | 'bottom-corners' | 'bottom-left' | 'bottom-right'
    floatingAccentImage: 'bottom-right', // 'bottom-right' | 'top-right' | 'top-left' | 'bottom-left'
    headerCalligraphyImage: 'above-greeting', // 'above-greeting' | 'above-hero-photo' | 'cover-top' | 'above-couple'
    dividerImage: 'between-events', // 'between-events' | 'all-sections' | 'couple-and-events' | 'top-and-bottom'
    venueIllustrationImage: 'above-title', // 'above-title' | 'below-countdown' | 'inside-event-card' | 'below-events'
  },
  animations: {
    coverTransition: 'slide-up', // 'slide-up' | 'fade-zoom' | 'blur-fade'
    particleType: 'petals', // 'petals' | 'sparkles' | 'leaves' | 'fireflies' | 'snow' | 'none'
    particleColor: '#eab8c2',
    ornamentMotion: 'sway-float', // 'sway-float' | 'subtle' | 'static'
    scrollReveal: 'fade-up', // 'fade-up' | 'zoom-in' | 'slide-side'
    revealDuration: '850', // '550' | '850' | '1250'
  },
};

export const CUSTOM_THEME_PRESETS = {
  'forest-opening-video': {
    label: 'Forest Gate & Opening Video (Undangan Saja)',
    description:
      'Gerbang semak menyibak + opening video zoom hutan, kunang-kunang & kartu glass',
    defaultContentPatch: {
      introVideoUrl: '/videos/forest-intro.mp4',
      packageTier: 'intimate',
      showQr: false,
      styleCategory: 'rustic',
      tag: 'Botanical',
    },
    theme: {
      coverStyle: 'gate-curtain',
      heroLayoutStyle: 'fullscreen-photo',
      bodyStyleMode: 'texture-default',
      photoFrameShape: 'oval',
      cardStyle: 'glass',
      galleryStyle: 'editorial',
      coverOverlayOpacity: 58,
      bgOverlayOpacity: 62,
      colors: {
        bgPrimary: '#04120B',
        bgSecondary: '#0E3B28',
        textPrimary: '#EAF4DA',
        textMuted: '#C7E2B2',
        accent: '#A6D854',
        buttonBg: '#7CC04A',
        buttonText: '#04120B',
      },
      typography: {
        scriptFont: 'font-romantic',
        headingFont: 'font-serif-theme',
        bodyFont: 'font-nunito',
      },
      assets: {
        coverBgImage: '/images/forest-gate-frame.jpg',
        bodyBgImage: '/images/forest-tropical-bg.webp',
        gateLeftImage: '/images/forest-foliage-left.png',
        gateRightImage: '/images/forest-foliage-right.png',
        cornerTopLeftImage: '/images/forest-canopy-vines.png',
        bottomPillarImage: '/images/forest-botanical-cluster.png',
        floatingAccentImage: '',
        coupleFrameImage: '',
        headerCalligraphyImage: '',
        venueIllustrationImage: '',
        dividerImage: '/images/forest-bush-border.png',
        envelopeClosedImage: '',
      },
      assetPositions: {
        coverBgImage: 'center',
        bodyBgImage: 'cover-fixed',
        envelopeClosedImage: 'center',
        coupleFrameImage: 'couple-only',
        cornerTopLeftImage: 'top-both',
        bottomPillarImage: 'bottom-center',
        floatingAccentImage: 'bottom-right',
        headerCalligraphyImage: 'above-greeting',
        dividerImage: 'all-sections',
        venueIllustrationImage: 'above-title',
      },
      animations: {
        coverTransition: 'fade-zoom',
        particleType: 'fireflies',
        particleColor: '#E8D27A',
        ornamentMotion: 'sway-float',
        scrollReveal: 'fade-up',
        revealDuration: '850',
      },
    },
  },
  'romantic-cameo': {
    label: 'Romantic Satin & Cameo',
    description: 'Amplop interaktif, renda vintage, ornamen mawar & bingkai cameo',
    theme: DEFAULT_CUSTOM_THEME,
  },
  'noir-cinematic': {
    label: 'Espresso Noir & Video',
    description: 'Tema gelap sinematik dengan full foto pembuka & slideshow latar',
    theme: {
      coverStyle: 'cinematic',
      heroLayoutStyle: 'fullscreen-photo',
      bodyStyleMode: 'slideshow-backdrop',
      photoFrameShape: 'arch',
      cardStyle: 'glass',
      galleryStyle: 'editorial',
      coverOverlayOpacity: 60,
      bgOverlayOpacity: 78,
      colors: {
        bgPrimary: '#0D0A09',
        bgSecondary: '#16110E',
        textPrimary: '#FAF3EC',
        textMuted: '#E6D2BE',
        accent: '#D4AF37',
        buttonBg: '#E6D2BE',
        buttonText: '#140C09',
      },
      typography: {
        scriptFont: 'font-romantic',
        headingFont: 'font-cinzel',
        bodyFont: 'font-public-sans',
      },
      assets: {
        coverBgImage: '',
        bodyBgImage: '',
        gateLeftImage: '',
        gateRightImage: '',
        cornerTopLeftImage: '',
        bottomPillarImage: '',
        floatingAccentImage: '',
        coupleFrameImage: '',
        headerCalligraphyImage: '',
        venueIllustrationImage: '',
        dividerImage: '',
        envelopeClosedImage: '',
      },
      animations: {
        coverTransition: 'fade-zoom',
        particleType: 'sparkles',
        particleColor: '#E6D2BE',
        ornamentMotion: 'subtle',
        scrollReveal: 'zoom-in',
        revealDuration: '850',
      },
    },
  },
  'royal-gold': {
    label: 'Royal Gold Heritage',
    description: 'Biru malam gelap dengan bingkai garis klasik, cameo emas & mahkota',
    theme: {
      coverStyle: 'arch-curtain',
      heroLayoutStyle: 'cameo-royal',
      bodyStyleMode: 'ornate-frame',
      photoFrameShape: 'oval',
      cardStyle: 'double-border',
      galleryStyle: 'grid-2',
      coverOverlayOpacity: 55,
      bgOverlayOpacity: 82,
      colors: {
        bgPrimary: '#0B0D12',
        bgSecondary: '#141926',
        textPrimary: '#FAF0D4',
        textMuted: '#CBD5E1',
        accent: '#DFB76C',
        buttonBg: '#DFB76C',
        buttonText: '#111622',
      },
      typography: {
        scriptFont: 'font-cursive',
        headingFont: 'font-cinzel',
        bodyFont: 'font-montserrat',
      },
      assets: {
        coverBgImage: '/images/kembar-cover.jpg',
        bodyBgImage: '',
        gateLeftImage: '',
        gateRightImage: '',
        cornerTopLeftImage: '',
        bottomPillarImage: '/images/kembar-flower-cluster.png',
        floatingAccentImage: '',
        coupleFrameImage: '/images/drapery-pink/arch-gold-frame.png',
        headerCalligraphyImage: '/images/kembar-gunungan-gold.png',
        venueIllustrationImage: '',
        dividerImage: '/images/kembar-divider.png',
        envelopeClosedImage: '',
      },
      animations: {
        coverTransition: 'blur-fade',
        particleType: 'sparkles',
        particleColor: '#DFB76C',
        ornamentMotion: 'sway-float',
        scrollReveal: 'fade-up',
        revealDuration: '850',
      },
    },
  },
  'botanical-sage': {
    label: 'Botanical Sage & Editorial',
    description: 'Nuansa sage lembut dengan hero majalah melayang & kertas bertekstur',
    theme: {
      coverStyle: 'arch-curtain',
      heroLayoutStyle: 'magazine-split',
      bodyStyleMode: 'texture-default',
      photoFrameShape: 'rounded',
      cardStyle: 'soft-solid',
      galleryStyle: 'editorial',
      coverOverlayOpacity: 50,
      bgOverlayOpacity: 82,
      colors: {
        bgPrimary: '#F7F5EE',
        bgSecondary: '#ECF0E4',
        textPrimary: '#243326',
        textMuted: '#4A614D',
        accent: '#5D7B53',
        buttonBg: '#3D5A3D',
        buttonText: '#FBFBF7',
      },
      typography: {
        scriptFont: 'font-fraunces',
        headingFont: 'font-editorial',
        bodyFont: 'font-nunito',
      },
      assets: {
        coverBgImage: '/images/forest-gate-frame.jpg',
        bodyBgImage: '/images/kembar-paper-bg.jpg',
        gateLeftImage: '/images/forest-foliage-left.png',
        gateRightImage: '/images/forest-foliage-right.png',
        cornerTopLeftImage: '/images/forest-foliage-left.png',
        bottomPillarImage: '/images/forest-bush-border.png',
        floatingAccentImage: '',
        coupleFrameImage: '',
        headerCalligraphyImage: '/images/drapery-pink/bismillah.svg',
        venueIllustrationImage: '',
        dividerImage: '/images/forest-botanical-cluster.png',
        envelopeClosedImage: '',
      },
      animations: {
        coverTransition: 'slide-up',
        particleType: 'leaves',
        particleColor: '#74A15A',
        ornamentMotion: 'sway-float',
        scrollReveal: 'fade-up',
        revealDuration: '850',
      },
    },
  },
  'vintage-polaroid': {
    label: 'Vintage Scrapbook & Polaroid Collage',
    description: 'Kolase 2 foto Polaroid miring hangat dengan kertas cream & pita vintage',
    defaultContentPatch: {
      packageTier: 'intimate',
      showQr: false,
      styleCategory: 'rustic',
      tag: 'Archival',
    },
    theme: {
      coverStyle: 'envelope',
      heroLayoutStyle: 'polaroid-collage',
      bodyStyleMode: 'texture-default',
      photoFrameShape: 'polaroid',
      cardStyle: 'soft-solid',
      galleryStyle: 'carousel',
      coverOverlayOpacity: 52,
      bgOverlayOpacity: 82,
      colors: {
        bgPrimary: '#FAF5EC',
        bgSecondary: '#F1E8D8',
        textPrimary: '#3D2E22',
        textMuted: '#6E5643',
        accent: '#A47E5B',
        buttonBg: '#5C4433',
        buttonText: '#FAF5EC',
      },
      typography: {
        scriptFont: 'font-cursive',
        headingFont: 'font-cardo',
        bodyFont: 'font-quicksand',
      },
      assets: {
        coverBgImage: '/images/drapery-pink/bg-paper-cream.jpg',
        bodyBgImage: '/images/drapery-pink/bg-paper-cream.jpg',
        gateLeftImage: '',
        gateRightImage: '',
        cornerTopLeftImage: '',
        bottomPillarImage: '',
        floatingAccentImage: '',
        coupleFrameImage: '',
        headerCalligraphyImage: '/images/drapery-pink/bismillah.svg',
        venueIllustrationImage: '/images/drapery-pink/date-strip-1.png',
        dividerImage: '/images/drapery-pink/divider-ornament.png',
        envelopeClosedImage: '/images/drapery-pink/envelope-body.png',
      },
      animations: {
        coverTransition: 'slide-up',
        particleType: 'petals',
        particleColor: '#D8BFA6',
        ornamentMotion: 'subtle',
        scrollReveal: 'fade-up',
        revealDuration: '850',
      },
    },
  },
};

const isDarkColor = (hex = '#ffffff') => {
  const clean = String(hex).replace('#', '').trim();
  if (clean.length !== 3 && clean.length !== 6) return false;
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 135;
};

const hexToRgba = (hex = '#000000', alpha = 0.8) => {
  const clean = String(hex).replace('#', '').trim();
  if (clean.length !== 3 && clean.length !== 6) return `rgba(0,0,0,${alpha})`;
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getYoutubeEmbedUrl = (url = '') => {
  const clean = String(url).trim();
  if (!clean) return '';
  if (clean.includes('youtube.com/embed/')) return clean;
  const shortMatch = clean.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  const watchMatch = clean.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return '';
};

const PARTICLE_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 8.4 + 4) % 96}%`,
  top: `${(i * 13 + 7) % 88}%`,
  size: 9 + (i % 4) * 3,
  duration: `${9 + (i % 5) * 1.8}s`,
  delay: `${(i * 0.85) % 6}s`,
}));

export const mergeCustomTheme = (templateCustom = {}, contentCustom = {}) => ({
  coverStyle:
    contentCustom.coverStyle ||
    templateCustom.coverStyle ||
    DEFAULT_CUSTOM_THEME.coverStyle,
  heroLayoutStyle:
    contentCustom.heroLayoutStyle ||
    templateCustom.heroLayoutStyle ||
    DEFAULT_CUSTOM_THEME.heroLayoutStyle,
  bodyStyleMode:
    contentCustom.bodyStyleMode ||
    templateCustom.bodyStyleMode ||
    DEFAULT_CUSTOM_THEME.bodyStyleMode,
  photoFrameShape:
    contentCustom.photoFrameShape ||
    templateCustom.photoFrameShape ||
    DEFAULT_CUSTOM_THEME.photoFrameShape,
  cardStyle:
    contentCustom.cardStyle ||
    templateCustom.cardStyle ||
    DEFAULT_CUSTOM_THEME.cardStyle,
  galleryStyle:
    contentCustom.galleryStyle ||
    templateCustom.galleryStyle ||
    DEFAULT_CUSTOM_THEME.galleryStyle,
  coverOverlayOpacity:
    contentCustom.coverOverlayOpacity ??
    templateCustom.coverOverlayOpacity ??
    DEFAULT_CUSTOM_THEME.coverOverlayOpacity,
  bgOverlayOpacity:
    contentCustom.bgOverlayOpacity ??
    templateCustom.bgOverlayOpacity ??
    DEFAULT_CUSTOM_THEME.bgOverlayOpacity,
  colors: {
    ...DEFAULT_CUSTOM_THEME.colors,
    ...(templateCustom.colors || {}),
    ...(contentCustom.colors || {}),
  },
  typography: {
    ...DEFAULT_CUSTOM_THEME.typography,
    ...(templateCustom.typography || {}),
    ...(contentCustom.typography || {}),
  },
  assets: {
    ...DEFAULT_CUSTOM_THEME.assets,
    ...(templateCustom.assets || {}),
    ...(contentCustom.assets || {}),
  },
  assetPositions: {
    ...DEFAULT_CUSTOM_THEME.assetPositions,
    ...(templateCustom.assetPositions || {}),
    ...(contentCustom.assetPositions || {}),
  },
  animations: {
    ...DEFAULT_CUSTOM_THEME.animations,
    ...(templateCustom.animations || {}),
    ...(contentCustom.animations || {}),
  },
});

const getFloatingAccentPosClass = (pos = 'bottom-right') => {
  switch (pos) {
    case 'top-right':
      return '-top-3 -right-2';
    case 'top-left':
      return '-top-3 -left-2 -scale-x-100';
    case 'bottom-left':
      return '-bottom-2 -left-2 -scale-x-100';
    case 'bottom-right':
    default:
      return '-bottom-2 -right-2';
  }
};

const OrnamentDivider = ({ src, className = '' }) => {
  if (!src) return null;
  return (
    <div className="flex justify-center py-1">
      <img src={src} alt="" className={`h-11 w-auto object-contain opacity-90 ${className}`} />
    </div>
  );
};

const PersonPortrait = ({
  photo,
  name,
  shortName,
  shape,
  frameOverlay,
  floatingAccent,
  floatingAccentPos = 'bottom-right',
  accentColor,
  ornamentClass,
}) => {
  const accentPosClass = getFloatingAccentPosClass(floatingAccentPos);

  if (shape === 'cameo-overlay') {
    const overlaySrc = frameOverlay || '/images/drapery-pink/oval-frame-border.png';
    return (
      <div className={`relative w-[178px] sm:w-[196px] aspect-[3/4] mx-auto ${ornamentClass}`}>
        <img
          src={overlaySrc}
          alt=""
          className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_12px_22px_rgba(0,0,0,0.25)]"
        />
        <div
          className="absolute left-[22%] right-[22%] top-[19%] bottom-[19%] rounded-[50%] overflow-hidden z-20 border"
          style={{ borderColor: `${accentColor}66` }}
        >
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
        </div>
        {floatingAccent && (
          <img
            src={floatingAccent}
            alt=""
            className={`pointer-events-none absolute ${accentPosClass} w-11 h-11 object-contain z-30 dp-butterfly-drift`}
          />
        )}
      </div>
    );
  }

  if (shape === 'arch') {
    return (
      <div
        className={`relative w-52 h-72 mx-auto rounded-t-[130px] rounded-b-2xl p-1.5 shadow-xl ${ornamentClass}`}
        style={{
          border: `1.5px solid ${accentColor}`,
          background: `${accentColor}15`,
        }}
      >
        <div className="w-full h-full overflow-hidden rounded-t-[122px] rounded-b-xl">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        {floatingAccent && (
          <img
            src={floatingAccent}
            alt=""
            className={`pointer-events-none absolute ${accentPosClass} w-10 h-10 object-contain z-30`}
          />
        )}
      </div>
    );
  }

  if (shape === 'oval') {
    return (
      <div
        className={`relative w-48 h-64 mx-auto rounded-full p-2 shadow-xl ${ornamentClass}`}
        style={{
          border: `2px solid ${accentColor}`,
          boxShadow: `0 12px 30px ${accentColor}30`,
        }}
      >
        <div
          className="w-full h-full rounded-full overflow-hidden border"
          style={{ borderColor: `${accentColor}66` }}
        >
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        {floatingAccent && (
          <img
            src={floatingAccent}
            alt=""
            className={`pointer-events-none absolute ${accentPosClass} w-10 h-10 object-contain z-30`}
          />
        )}
      </div>
    );
  }

  if (shape === 'circle') {
    return (
      <div
        className={`relative w-48 h-48 mx-auto rounded-full p-1.5 shadow-xl ${ornamentClass}`}
        style={{ border: `2px solid ${accentColor}` }}
      >
        <img
          src={photo}
          alt={name}
          className="w-full h-full rounded-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {floatingAccent && (
          <img
            src={floatingAccent}
            alt=""
            className={`pointer-events-none absolute ${accentPosClass} w-10 h-10 object-contain z-30`}
          />
        )}
      </div>
    );
  }

  if (shape === 'polaroid') {
    return (
      <div
        className={`relative w-56 mx-auto bg-white p-3 pb-7 shadow-2xl border border-stone-200 -rotate-2 hover:rotate-0 transition-transform duration-500 ${ornamentClass}`}
      >
        <div className="w-full aspect-[4/5] overflow-hidden bg-stone-100">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <p className="mt-2.5 text-center font-cursive text-2xl text-stone-700 leading-none">
          {shortName}
        </p>
        {floatingAccent && (
          <img
            src={floatingAccent}
            alt=""
            className={`pointer-events-none absolute ${accentPosClass} w-10 h-10 object-contain z-30`}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-52 h-68 mx-auto rounded-3xl overflow-hidden shadow-xl ${ornamentClass}`}
      style={{ border: `2px solid ${accentColor}88` }}
    >
      <img
        src={photo}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />
      {floatingAccent && (
        <img
          src={floatingAccent}
          alt=""
          className={`pointer-events-none absolute ${accentPosClass} w-10 h-10 object-contain z-30`}
        />
      )}
    </div>
  );
};

export const CustomThemeBuilder = (props) => {
  const { invitation, guest, isModalView = false, defaultOpened = false } = props;
  const d = useInvitationData(props);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [seatPlanZoomOpen, setSeatPlanZoomOpen] = useState(false);

  const customTheme = useMemo(() => {
    const tCustom = invitation?.template?.default_content_json?.customTheme || {};
    const cCustom = invitation?.content_json?.customTheme || {};
    return mergeCustomTheme(tCustom, cCustom);
  }, [invitation]);

  const {
    coverStyle,
    heroLayoutStyle,
    bodyStyleMode,
    photoFrameShape,
    cardStyle,
    galleryStyle,
    coverOverlayOpacity,
    bgOverlayOpacity,
    colors,
    typography,
    assets,
    assetPositions,
    animations,
  } = customTheme;
  const pos = assetPositions || DEFAULT_CUSTOM_THEME.assetPositions;

  const backdropSlides = useMemo(() => {
    const list = [];
    if (d.photoCover) list.push(d.photoCover);
    if (Array.isArray(d.gallery)) {
      d.gallery.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ['/images/defaults/couple-cover.jpg'];
  }, [d.photoCover, d.gallery]);

  const [activeBackdropIdx, setActiveBackdropIdx] = useState(0);
  useEffect(() => {
    if (bodyStyleMode !== 'slideshow-backdrop' || backdropSlides.length <= 1) return;
    const id = setInterval(() => {
      setActiveBackdropIdx((prev) => (prev + 1) % backdropSlides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [bodyStyleMode, backdropSlides.length]);

  const isDark = useMemo(() => isDarkColor(colors.bgPrimary), [colors.bgPrimary]);

  const activeIntroVideoUrl =
    props?.introVideoUrl !== undefined
      ? props.introVideoUrl
      : d.introVideoUrl && d.introVideoUrl !== 'none'
        ? d.introVideoUrl
        : '';

  const [isOpeningTransition, setIsOpeningTransition] = useState(false);
  const [isCoverDismissed, setIsCoverDismissed] = useState(Boolean(defaultOpened));
  const [coverExited, setCoverExited] = useState(Boolean(defaultOpened));
  const [introVideoFailed, setIntroVideoFailed] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const introVideoRef = useRef(null);
  const introDoneRef = useRef(false);
  const introTimersRef = useRef([]);

  const scheduleIntroTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    introTimersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    const timers = introTimersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    setIntroVideoFailed(false);
  }, [activeIntroVideoUrl]);

  useEffect(() => {
    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    if (defaultOpened) {
      introDoneRef.current = true;
      setIsOpeningTransition(false);
      setIsIntroPlaying(false);
      setIsCoverDismissed(true);
      setCoverExited(true);
    } else {
      introDoneRef.current = false;
      setIsOpeningTransition(false);
      setIsIntroPlaying(false);
      setIsCoverDismissed(false);
      setCoverExited(false);
    }
  }, [defaultOpened]);

  const finishIntro = () => {
    if (introDoneRef.current) return;
    introDoneRef.current = true;
    setIsIntroPlaying(false);
    setIsCoverDismissed(true);
    scheduleIntroTimer(() => setCoverExited(true), 850);
  };

  const hasGateCurtains = Boolean(
    coverStyle === 'gate-curtain' || assets.gateLeftImage || assets.gateRightImage
  );

  const handleOpenCover = () => {
    if (isOpeningTransition) return;
    setIsOpeningTransition(true);
    d.openInvitation();

    const video = introVideoRef.current;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const canPlayIntroVideo =
      Boolean(activeIntroVideoUrl) && !introVideoFailed && !reduceMotion && video;

    if (canPlayIntroVideo) {
      try {
        video.currentTime = 0;
      } catch {}
      setIsIntroPlaying(true);
      const playing = video.play();
      if (playing && typeof playing.catch === 'function') {
        playing.catch(() => {
          setIntroVideoFailed(true);
          setIsIntroPlaying(false);
          scheduleIntroTimer(finishIntro, hasGateCurtains ? 850 : 50);
        });
      }
      scheduleIntroTimer(finishIntro, INTRO_SAFETY_MS);
      return;
    }

    if (hasGateCurtains) {
      scheduleIntroTimer(finishIntro, 850);
    } else {
      finishIntro();
    }
  };

  const handleIntroTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (!isIntroPlaying || !v.duration || Number.isNaN(v.duration)) return;
    if (v.duration - v.currentTime <= INTRO_FADE_LEAD_S) {
      finishIntro();
    }
  };

  const showCover = !coverExited && (!d.isOpened || isOpeningTransition || !isCoverDismissed);

  const revealDuration = Number(animations.revealDuration) || 850;
  const revealPrimary =
    animations.scrollReveal === 'zoom-in'
      ? 'zoom-in'
      : animations.scrollReveal === 'slide-side'
        ? 'fade-left'
        : 'fade-up';
  const revealAlt =
    animations.scrollReveal === 'zoom-in'
      ? 'zoom-in'
      : animations.scrollReveal === 'slide-side'
        ? 'fade-right'
        : 'fade-up';

  const swayClass =
    animations.ornamentMotion === 'sway-float'
      ? 'dp-orchid-sway-l'
      : animations.ornamentMotion === 'subtle'
        ? 'animate-breathe'
        : '';
  const floatClass =
    animations.ornamentMotion === 'sway-float'
      ? 'dp-envelope-float'
      : '';

  const coverClosedClass = useMemo(() => {
    if (!isCoverDismissed) return 'opacity-100 translate-y-0 scale-100';
    if (activeIntroVideoUrl && !introVideoFailed) {
      return 'opacity-0 pointer-events-none';
    }
    if (animations.coverTransition === 'fade-zoom') {
      return 'opacity-0 scale-110 pointer-events-none';
    }
    if (animations.coverTransition === 'blur-fade') {
      return 'opacity-0 blur-md scale-105 pointer-events-none';
    }
    return '-translate-y-full opacity-0 pointer-events-none';
  }, [isCoverDismissed, activeIntroVideoUrl, introVideoFailed, animations.coverTransition]);

  const cardBoxMeta = useMemo(() => {
    if (cardStyle === 'glass') {
      return {
        className: 'backdrop-blur-md shadow-[0_10px_32px_rgba(0,0,0,0.22)] border',
        style: {
          backgroundColor: isDark
            ? hexToRgba(colors.bgSecondary, 0.56)
            : 'rgba(255, 255, 255, 0.66)',
          borderColor: `${colors.accent}48`,
        },
      };
    }
    if (cardStyle === 'editorial-flat') {
      return {
        className: 'border-y py-5 rounded-none',
        style: {
          backgroundColor: 'transparent',
          borderColor: `${colors.accent}40`,
        },
      };
    }
    if (cardStyle === 'double-border') {
      return {
        className: 'border-2 shadow-md',
        style: {
          backgroundColor: colors.bgSecondary,
          borderColor: `${colors.accent}85`,
          boxShadow: `inset 0 0 0 3px ${colors.bgPrimary}, inset 0 0 0 4px ${colors.accent}55`,
        },
      };
    }
    return {
      className: 'border shadow-sm',
      style: {
        backgroundColor: colors.bgSecondary,
        borderColor: `${colors.accent}45`,
      },
    };
  }, [cardStyle, colors.bgSecondary, colors.bgPrimary, colors.accent, isDark]);

  const sectionBandStyle = useMemo(() => {
    if (
      cardStyle === 'glass' ||
      bodyStyleMode === 'photo-backdrop' ||
      bodyStyleMode === 'slideshow-backdrop' ||
      (bodyStyleMode !== 'clean-editorial' && assets.bodyBgImage) ||
      d.backgroundVideoUrl
    ) {
      const bandAlpha = Math.min(0.95, Math.max(0.25, (Number(bgOverlayOpacity) || 80) / 100));
      return {
        backgroundColor: hexToRgba(colors.bgSecondary, bandAlpha * 0.76),
      };
    }
    return { backgroundColor: colors.bgSecondary };
  }, [
    cardStyle,
    bodyStyleMode,
    assets.bodyBgImage,
    d.backgroundVideoUrl,
    bgOverlayOpacity,
    colors.bgSecondary,
  ]);

  const youtubeEmbed = useMemo(
    () => getYoutubeEmbedUrl(d.preweddingVideoUrl),
    [d.preweddingVideoUrl]
  );

  const activeBgVideoUrl =
    d.backgroundVideoUrl && d.backgroundVideoUrl !== 'none'
      ? d.backgroundVideoUrl
      : '';

  const sidePanelTheme = isDark
    ? coverStyle === 'gate-curtain'
      ? 'forest'
      : coverStyle === 'cinematic'
        ? 'noir-velvet'
        : 'royal-gold'
    : 'drapery-pink';

  const sidePanelData = useMemo(
    () => ({
      eventType: d.eventType,
      showSecondPerson: d.showSecondPerson,
      showSecondEvent: d.showSecondEvent,
      coverSubtitle: d.coverSubtitle,
      groomShort: d.groomShort,
      brideShort: d.brideShort,
      groom: d.groom,
      bride: d.bride,
      photoCover: d.photoCover,
      photoGroom: d.photoGroom,
      photoBride: d.photoBride,
      gallery: d.gallery,
      akad: d.akad,
      timeLeft: d.timeLeft,
      ayatQuote: d.ayatQuote,
    }),
    [d]
  );

  const coverOverlayAlpha = Math.min(0.9, Math.max(0.15, (Number(coverOverlayOpacity) || 55) / 100));
  const bodyOverlayAlpha = Math.min(0.96, Math.max(0, (Number(bgOverlayOpacity) ?? 80) / 100));

  const resolvedGateLeft =
    assets.gateLeftImage ||
    (coverStyle === 'gate-curtain'
      ? assets.cornerTopLeftImage || '/images/forest-foliage-left.png'
      : '');
  const resolvedGateRight =
    assets.gateRightImage ||
    (coverStyle === 'gate-curtain'
      ? assets.gateLeftImage || assets.cornerTopLeftImage || '/images/forest-foliage-right.png'
      : '');

  const renderParticleShape = (p) => {
    if (animations.particleType === 'none') return null;
    if (animations.particleType === 'fireflies') {
      const sz = Math.max(4, (p.size % 5) + 3);
      return (
        <span
          key={p.id}
          className="cb-firefly-item"
          style={{
            left: p.left,
            top: p.top,
            width: `${sz}px`,
            height: `${sz}px`,
            borderRadius: '9999px',
            backgroundColor: animations.particleColor,
            boxShadow: `0 0 ${sz * 3.5}px ${animations.particleColor}`,
            animationDuration: `${4.5 + (p.id % 4) * 1.4}s`,
            animationDelay: p.delay,
          }}
        />
      );
    }
    if (animations.particleType === 'sparkles') {
      return (
        <span
          key={p.id}
          className="cb-particle-item"
          style={{
            left: p.left,
            width: `${Math.max(4, p.size - 4)}px`,
            height: `${Math.max(4, p.size - 4)}px`,
            borderRadius: '9999px',
            backgroundColor: animations.particleColor,
            boxShadow: `0 0 10px ${animations.particleColor}`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      );
    }
    if (animations.particleType === 'snow') {
      return (
        <span
          key={p.id}
          className="cb-particle-item"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '9999px',
            background: `radial-gradient(circle, #ffffff 0%, ${animations.particleColor} 100%)`,
            opacity: 0.7,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      );
    }
    return (
      <span
        key={p.id}
        className="cb-particle-item"
        style={{
          left: p.left,
          width: `${p.size}px`,
          height: `${Math.round(p.size * 1.3)}px`,
          borderRadius:
            animations.particleType === 'leaves' ? '85% 0 85% 0' : '80% 0 80% 0',
          background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${animations.particleColor} 70%)`,
          opacity: 0.72,
          animationDuration: p.duration,
          animationDelay: p.delay,
        }}
      />
    );
  };

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden ${typography.bodyFont}`}
      style={{
        backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
      }}
      translate="no"
    >
      <style>{`
        @keyframes cb-particle-fall {
          0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.78; }
          50% { transform: translate3d(24px, 48vh, 0) rotate(165deg); opacity: 0.7; }
          100% { transform: translate3d(-18px, 108vh, 0) rotate(330deg); opacity: 0; }
        }
        @keyframes cb-firefly-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.85); opacity: 0.2; }
          50% { transform: translate3d(14px, -22px, 0) scale(1.25); opacity: 0.92; }
        }
        .cb-particle-item {
          position: absolute;
          top: -8vh;
          pointer-events: none;
          animation: cb-particle-fall linear infinite;
        }
        .cb-firefly-item {
          position: absolute;
          pointer-events: none;
          animation: cb-firefly-float ease-in-out infinite;
        }
      `}</style>

      {!isModalView && (
        <DesktopSidePanel
          theme={sidePanelTheme}
          invitationData={sidePanelData}
          isOpened={d.isOpened}
          isModalView={isModalView}
        />
      )}

      <main
        className={`relative min-h-screen ${
          isModalView
            ? 'w-full mx-auto'
            : 'w-full lg:w-[480px] xl:w-[520px] lg:ml-auto lg:mr-0'
        } shadow-2xl overflow-hidden`}
        style={{ backgroundColor: colors.bgPrimary }}
      >
        {/* Background Video / Body Image / Backdrop Mode Layer */}
        {activeBgVideoUrl ? (
          <div
            className={`pointer-events-none fixed inset-y-0 ${
              isModalView
                ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
                : 'right-0 w-full lg:w-[480px] xl:w-[520px]'
            } z-0 overflow-hidden`}
          >
            <video
              src={activeBgVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: hexToRgba(colors.bgPrimary, bodyOverlayAlpha) }}
            />
          </div>
        ) : bodyStyleMode === 'photo-backdrop' ? (
          <div
            className={`pointer-events-none fixed inset-y-0 ${
              isModalView
                ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
                : 'right-0 w-full lg:w-[480px] xl:w-[520px]'
            } z-0 overflow-hidden cb-photo-backdrop`}
          >
            <img
              src={d.photoCover}
              alt=""
              className="w-full h-full object-cover scale-105"
            />
            <div
              className="absolute inset-0 backdrop-blur-[1.5px]"
              style={{ backgroundColor: hexToRgba(colors.bgPrimary, bodyOverlayAlpha) }}
            />
          </div>
        ) : bodyStyleMode === 'slideshow-backdrop' ? (
          <div
            className={`pointer-events-none fixed inset-y-0 ${
              isModalView
                ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
                : 'right-0 w-full lg:w-[480px] xl:w-[520px]'
            } z-0 overflow-hidden cb-slideshow-backdrop`}
          >
            {backdropSlides.map((slideSrc, idx) => (
              <img
                key={`${slideSrc}-${idx}`}
                src={slideSrc}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1800ms] ease-in-out ${
                  idx === activeBackdropIdx
                    ? 'opacity-100 scale-105'
                    : 'opacity-0 scale-100'
                }`}
              />
            ))}
            <div
              className="absolute inset-0 backdrop-blur-[1.5px]"
              style={{ backgroundColor: hexToRgba(colors.bgPrimary, bodyOverlayAlpha) }}
            />
          </div>
        ) : bodyStyleMode !== 'clean-editorial' && assets.bodyBgImage ? (
          <div
            className={`pointer-events-none ${
              pos.bodyBgImage === 'cover-fixed'
                ? `fixed inset-y-0 ${
                    isModalView
                      ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
                      : 'right-0 w-full lg:w-[480px] xl:w-[520px]'
                  } z-0 opacity-75`
                : pos.bodyBgImage === 'top-banner'
                  ? 'absolute inset-x-0 top-0 h-[420px] z-0 opacity-85'
                  : 'absolute inset-0 z-0 opacity-85'
            }`}
            style={{
              backgroundImage: `url(${assets.bodyBgImage})`,
              backgroundSize:
                pos.bodyBgImage === 'top-banner'
                  ? '100% auto'
                  : pos.bodyBgImage === 'tile-all'
                    ? '260px auto'
                    : 'cover',
              backgroundPosition:
                pos.bodyBgImage === 'cover-fixed'
                  ? 'center center'
                  : pos.bodyBgImage === 'tile-all'
                    ? 'top left'
                    : 'center top',
              backgroundRepeat:
                pos.bodyBgImage === 'tile-all'
                  ? 'repeat'
                  : pos.bodyBgImage === 'cover-fixed' ||
                      pos.bodyBgImage === 'top-banner'
                    ? 'no-repeat'
                    : 'repeat-y',
            }}
          >
            {(cardStyle === 'glass' || Number(bgOverlayOpacity) !== 80) && (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: hexToRgba(colors.bgPrimary, bodyOverlayAlpha * 0.55) }}
              />
            )}
          </div>
        ) : null}

        {/* Stationery Ornate Page Frame (bodyStyleMode === 'ornate-frame') */}
        {bodyStyleMode === 'ornate-frame' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 z-30 rounded-[22px] border cb-ornate-page-frame"
            style={{
              borderColor: `${colors.accent}75`,
              boxShadow: `inset 0 0 0 4px ${hexToRgba(colors.bgPrimary, 0.25)}, inset 0 0 0 5px ${colors.accent}45`,
            }}
          >
            <span
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border"
              style={{
                backgroundColor: colors.bgPrimary,
                borderColor: colors.accent,
              }}
            />
            <span
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border"
              style={{
                backgroundColor: colors.bgPrimary,
                borderColor: colors.accent,
              }}
            />
          </div>
        )}

        {/* Ambient Particle Layer */}
        {animations.particleType !== 'none' && (
          <div
            aria-hidden="true"
            className={`pointer-events-none fixed inset-y-0 ${
              isModalView
                ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
                : 'right-0 w-full lg:w-[480px] xl:w-[520px]'
            } z-40 overflow-hidden`}
          >
            {PARTICLE_ITEMS.map(renderParticleShape)}
          </div>
        )}

        {/* ============================================================ */}
        {/* OPENING COVER OVERLAY (+ OPENING VIDEO TRANSITION)           */}
        {/* ============================================================ */}
        <section
          aria-label="Sampul Undangan Custom"
          className={`fixed inset-y-0 ${
            isModalView
              ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
              : 'left-0 right-0 lg:left-auto lg:right-0 lg:w-[480px] xl:w-[520px]'
          } z-50 flex flex-col justify-between items-center text-center px-6 pt-12 pb-10 transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] select-none overflow-hidden ${coverClosedClass} ${
            coverExited && activeIntroVideoUrl ? 'invisible' : ''
          }`}
          style={{
            backgroundColor: isDark ? '#04120B' : colors.textPrimary,
            color: '#FDF9F6',
          }}
        >
          {/* Cover Background: Opening Intro Video -> Looping Video -> Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {activeIntroVideoUrl && !introVideoFailed ? (
              <video
                ref={introVideoRef}
                src={`${activeIntroVideoUrl}#t=0.001`}
                poster={assets.coverBgImage || undefined}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                onLoadedMetadata={(e) => {
                  try {
                    e.currentTarget.currentTime = 0.001;
                  } catch {}
                }}
                onError={() => setIntroVideoFailed(true)}
                onTimeUpdate={handleIntroTimeUpdate}
                onEnded={finishIntro}
                className="w-full h-full object-cover"
                aria-hidden="true"
              />
            ) : activeBgVideoUrl ? (
              <video
                src={activeBgVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={assets.coverBgImage || d.photoCover}
                alt="Cover Background"
                className={`w-full h-full ${
                  pos.coverBgImage === 'top'
                    ? 'object-cover object-top dp-drapery-motion'
                    : pos.coverBgImage === 'bottom'
                      ? 'object-cover object-bottom dp-drapery-motion'
                      : pos.coverBgImage === 'contain-center'
                        ? 'object-contain object-center'
                        : 'object-cover object-center dp-drapery-motion'
                }`}
              />
            )}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                isOpeningTransition && activeIntroVideoUrl && !introVideoFailed
                  ? 'opacity-10'
                  : 'opacity-100'
              }`}
              style={{
                background:
                  coverStyle === 'cinematic' && Number(coverOverlayOpacity) === 55
                    ? 'linear-gradient(180deg, rgba(10,8,7,0.5) 0%, rgba(10,8,7,0.25) 45%, rgba(10,8,7,0.88) 100%)'
                    : `linear-gradient(180deg, rgba(10,8,7,${coverOverlayAlpha}) 0%, rgba(10,8,7,${(coverOverlayAlpha * 0.45).toFixed(2)}) 48%, rgba(10,8,7,${Math.min(0.92, coverOverlayAlpha + 0.22).toFixed(2)}) 100%)`,
              }}
            />
          </div>

            {/* Skip Opening Video Button */}
            {isIntroPlaying && !isCoverDismissed && (
              <button
                type="button"
                onClick={finishIntro}
                className="absolute bottom-6 right-5 z-40 rounded-full border border-white/35 bg-black/55 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/80 cursor-pointer"
              >
                Lewati
              </button>
            )}

            {/* Parting Gate / Foliage Curtains (Forest Gate Style) */}
            {resolvedGateLeft && (
              <img
                src={resolvedGateLeft}
                alt=""
                className={`pointer-events-none absolute inset-y-0 -left-10 h-full w-[62%] max-w-[300px] object-cover object-right z-15 transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpeningTransition
                    ? '-translate-x-[92%] -rotate-6 opacity-0'
                    : 'translate-x-0 opacity-95'
                }`}
              />
            )}
            {resolvedGateRight && (
              <img
                src={resolvedGateRight}
                alt=""
                className={`pointer-events-none absolute inset-y-0 -right-10 h-full w-[62%] max-w-[300px] object-cover object-left z-15 transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  assets.gateRightImage ? '' : '-scale-x-100'
                } ${
                  isOpeningTransition
                    ? 'translate-x-[92%] rotate-6 opacity-0'
                    : 'translate-x-0 opacity-95'
                }`}
              />
            )}

            {assets.cornerTopLeftImage &&
              (pos.cornerTopLeftImage === 'top-corners' ||
                pos.cornerTopLeftImage === 'top-both' ||
                pos.cornerTopLeftImage === 'top-left-only') && (
                <img
                  src={assets.cornerTopLeftImage}
                  alt=""
                  className={`pointer-events-none absolute -top-6 -left-6 w-32 z-10 transition-opacity duration-500 ${
                    isOpeningTransition ? 'opacity-0' : 'opacity-90'
                  } ${swayClass}`}
                />
              )}

            {assets.cornerTopLeftImage &&
              (pos.cornerTopLeftImage === 'top-both' ||
                pos.cornerTopLeftImage === 'top-right-only') && (
                <img
                  src={assets.cornerTopLeftImage}
                  alt=""
                  className={`pointer-events-none absolute -top-6 -right-6 w-32 z-10 -scale-x-100 transition-opacity duration-500 ${
                    isOpeningTransition ? 'opacity-0' : 'opacity-90'
                  } ${swayClass}`}
                />
              )}

            {assets.envelopeClosedImage && pos.envelopeClosedImage === 'top-curtain' && (
              <img
                src={assets.envelopeClosedImage}
                alt=""
                className={`pointer-events-none absolute top-0 inset-x-0 w-full max-h-48 object-cover object-top z-10 transition-all duration-700 ${
                  isOpeningTransition ? '-translate-y-full opacity-0' : 'opacity-90'
                }`}
              />
            )}

            {assets.envelopeClosedImage && pos.envelopeClosedImage === 'bottom-stage' && (
              <img
                src={assets.envelopeClosedImage}
                alt=""
                className={`pointer-events-none absolute bottom-0 inset-x-0 w-full max-h-56 object-contain object-bottom z-10 transition-all duration-700 ${
                  isOpeningTransition ? 'translate-y-full opacity-0' : 'opacity-85'
                }`}
              />
            )}

            {assets.envelopeClosedImage && pos.envelopeClosedImage === 'full-frame' && (
              <img
                src={assets.envelopeClosedImage}
                alt=""
                className={`pointer-events-none absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-700 ${
                  isOpeningTransition ? 'opacity-0' : 'opacity-90'
                }`}
              />
            )}

            {assets.bottomPillarImage &&
              (pos.bottomPillarImage === 'bottom-corners' ||
                pos.bottomPillarImage === 'bottom-left') && (
                <img
                  src={assets.bottomPillarImage}
                  alt=""
                  className={`pointer-events-none absolute -bottom-4 -left-6 w-32 z-10 transition-opacity duration-500 ${
                    isOpeningTransition ? 'opacity-0' : 'opacity-85'
                  } ${swayClass}`}
                />
              )}

            {assets.bottomPillarImage &&
              (pos.bottomPillarImage === 'bottom-corners' ||
                pos.bottomPillarImage === 'bottom-right') && (
                <img
                  src={assets.bottomPillarImage}
                  alt=""
                  className={`pointer-events-none absolute -bottom-4 -right-6 w-32 z-10 -scale-x-100 transition-opacity duration-500 ${
                    isOpeningTransition ? 'opacity-0' : 'opacity-85'
                  } ${swayClass}`}
                />
              )}

            {/* Foreground Cover Content (fades out cleanly while intro video plays) */}
            <div
              className={`relative z-20 flex-1 w-full flex flex-col justify-between items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpeningTransition
                  ? 'opacity-0 translate-y-10 scale-95 pointer-events-none'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              {/* Header Title on Cover */}
              <div className="flex flex-col items-center mt-2 cover-stagger space-y-2">
                {assets.headerCalligraphyImage && pos.headerCalligraphyImage === 'cover-top' && (
                  <img
                    src={assets.headerCalligraphyImage}
                    alt=""
                    className="h-9 w-auto object-contain mb-1 drop-shadow-[0_2px_10px_rgba(255,255,255,0.45)]"
                  />
                )}
                <span
                  className="px-4 py-1 rounded-full border text-[10px] uppercase tracking-[0.28em] backdrop-blur-md"
                  style={{
                    borderColor: `${colors.accent}70`,
                    backgroundColor: 'rgba(0,0,0,0.32)',
                    color: '#FDF9F6',
                  }}
                >
                  {d.coverSubtitle}
                </span>

                <h1
                  className={`${typography.scriptFont} text-[50px] sm:text-[58px] leading-[1.06] mt-2 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]`}
                >
                  {d.showSecondPerson !== false
                    ? `${d.brideShort} & ${d.groomShort}`
                    : d.groomShort}
                </h1>
              </div>

              {/* Middle Cover Visual per coverStyle */}
              {coverStyle === 'envelope' &&
              assets.envelopeClosedImage &&
              pos.envelopeClosedImage === 'center' ? (
                <div className="my-auto py-2 flex flex-col items-center cover-stagger">
                  <button
                    type="button"
                    onClick={handleOpenCover}
                    aria-label="Buka Amplop Undangan"
                    className={`group relative w-[255px] sm:w-[285px] cursor-pointer transition-transform duration-500 hover:scale-[1.03] active:scale-95 focus:outline-none ${floatClass}`}
                  >
                    <img
                      src={assets.envelopeClosedImage}
                      alt="Amplop Undangan"
                      className="w-full h-auto drop-shadow-[0_22px_36px_rgba(0,0,0,0.45)]"
                    />
                    {assets.floatingAccentImage && (
                      <img
                        src={assets.floatingAccentImage}
                        alt=""
                        className={`pointer-events-none absolute ${getFloatingAccentPosClass(pos.floatingAccentImage)} w-12 h-12 object-contain dp-butterfly-drift`}
                      />
                    )}
                  </button>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-white/80 mt-2">
                    Ketuk Amplop Untuk Membuka
                  </p>
                </div>
              ) : coverStyle === 'arch-curtain' ? (
                <div className="my-auto py-3 cover-stagger">
                  <div
                    className={`relative w-44 h-56 sm:w-48 sm:h-64 mx-auto rounded-t-[110px] rounded-b-2xl p-1.5 shadow-2xl ${floatClass}`}
                    style={{
                      border: `1.5px solid ${colors.accent}`,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="w-full h-full rounded-t-[102px] rounded-b-xl overflow-hidden">
                      <img
                        src={d.photoCover}
                        alt={d.displayTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {assets.coupleFrameImage &&
                      (pos.coupleFrameImage === 'couple-and-cover' ||
                        pos.coupleFrameImage === 'all-photos') && (
                        <img
                          src={assets.coupleFrameImage}
                          alt=""
                          className="pointer-events-none absolute inset-0 w-full h-full object-contain z-20 scale-[1.08]"
                        />
                      )}
                    {assets.floatingAccentImage && (
                      <img
                        src={assets.floatingAccentImage}
                        alt=""
                        className={`pointer-events-none absolute ${getFloatingAccentPosClass(pos.floatingAccentImage)} w-11 h-11 object-contain z-30 dp-butterfly-drift`}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative my-auto w-full max-w-[260px] h-20 flex items-center justify-center">
                  {assets.floatingAccentImage && (
                    <img
                      src={assets.floatingAccentImage}
                      alt=""
                      className={`pointer-events-none absolute ${getFloatingAccentPosClass(pos.floatingAccentImage)} w-12 h-12 object-contain dp-butterfly-drift`}
                    />
                  )}
                </div>
              )}

              {/* Bottom Guest Greeting & CTA */}
              <div className="w-full max-w-[330px] flex flex-col items-center space-y-3 cover-stagger">
                {d.guestName && (
                  <div
                    className="w-full px-5 py-3 rounded-2xl backdrop-blur-md border shadow-xl"
                    style={{
                      borderColor: 'rgba(255,255,255,0.28)',
                      backgroundColor: 'rgba(0,0,0,0.42)',
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/75">
                      Kepada Yth. Bapak/Ibu/Saudara/i
                    </p>
                    <p
                      className={`${typography.headingFont} text-[18px] font-bold text-white mt-0.5`}
                    >
                      {d.guestName}
                    </p>
                    {d.isVip && (
                      <span
                        className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest border"
                        style={{
                          borderColor: `${colors.accent}88`,
                          color: '#fff',
                          backgroundColor: `${colors.accent}35`,
                        }}
                      >
                        <Sparkles className="w-2.5 h-2.5" /> {d.guestCategory}
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleOpenCover}
                  className="btn-sheen inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-[11px] font-bold uppercase tracking-[0.22em] shadow-xl transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: colors.buttonBg,
                    color: colors.buttonText,
                  }}
                >
                  <MailOpen className="w-3.5 h-3.5" />
                  <span>Buka Undangan</span>
                </button>

                <p className="text-[10px] text-white/70">{d.coverFootnote}</p>
              </div>
            </div>
          </section>

        {/* ============================================================ */}
        {/* MAIN INVITATION BODY SECTIONS                                */}
        {/* ============================================================ */}
        <div className="relative z-10 pb-28">
          {/* SECTION 1: HERO PORTRAIT / OPENING GREETING (6 LAYOUT STYLES) */}
          <section
            className={`relative text-center ${
              heroLayoutStyle === 'fullscreen-photo' || heroLayoutStyle === 'magazine-split'
                ? 'pb-12'
                : 'px-6 pt-14 pb-12 space-y-6'
            }`}
          >
            {assets.cornerTopLeftImage &&
              (pos.cornerTopLeftImage === 'top-both' ||
                pos.cornerTopLeftImage === 'top-left-only') && (
                <img
                  src={assets.cornerTopLeftImage}
                  alt=""
                  className={`pointer-events-none absolute -top-4 -left-6 w-32 z-20 opacity-80 ${swayClass}`}
                />
              )}

            {assets.cornerTopLeftImage &&
              (pos.cornerTopLeftImage === 'top-corners' ||
                pos.cornerTopLeftImage === 'top-both' ||
                pos.cornerTopLeftImage === 'top-right-only') && (
                <img
                  src={assets.cornerTopLeftImage}
                  alt=""
                  className={`pointer-events-none absolute -top-4 -right-6 w-32 z-20 opacity-80 -scale-x-100 ${swayClass}`}
                />
              )}

            {/* STYLE 2: FULLSCREEN PHOTO EDITORIAL */}
            {heroLayoutStyle === 'fullscreen-photo' ? (
              <div className="space-y-8 cb-hero-fullscreen">
                <div className="relative min-h-[76vh] flex flex-col justify-end items-center px-6 pb-12 pt-24 overflow-hidden">
                  <img
                    src={d.photoCover}
                    alt={d.displayTitle}
                    className="absolute inset-0 w-full h-full object-cover dp-drapery-motion"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(10,8,7,0.32) 0%, rgba(10,8,7,0.12) 42%, ${hexToRgba(colors.bgPrimary, 0.72)} 82%, ${colors.bgPrimary} 100%)`,
                    }}
                  />
                  <Reveal
                    variant={revealPrimary}
                    duration={revealDuration}
                    className="relative z-10 space-y-2 max-w-sm mx-auto"
                  >
                    {assets.headerCalligraphyImage &&
                      pos.headerCalligraphyImage === 'above-hero-photo' && (
                        <img
                          src={assets.headerCalligraphyImage}
                          alt=""
                          className="h-9 w-auto mx-auto object-contain mb-2 drop-shadow"
                        />
                      )}
                    <p
                      className="inline-block px-3.5 py-1 rounded-full text-[10px] uppercase tracking-[0.32em] font-semibold backdrop-blur-xs border"
                      style={{
                        borderColor: `${colors.accent}70`,
                        backgroundColor: hexToRgba(colors.bgPrimary, 0.55),
                        color: colors.textPrimary,
                      }}
                    >
                      {d.coverSubtitle}
                    </p>
                    <h2
                      className={`${typography.scriptFont} text-[52px] sm:text-[60px] leading-[1.06] pt-1 drop-shadow-sm`}
                      style={{ color: colors.textPrimary }}
                    >
                      {d.showSecondPerson !== false
                        ? `${d.brideShort} & ${d.groomShort}`
                        : d.groomShort}
                    </h2>
                    <p
                      className="text-xs tracking-[0.24em] uppercase font-semibold"
                      style={{ color: colors.accent }}
                    >
                      {d.akad?.tanggal}
                    </p>
                  </Reveal>
                </div>

                {pos.dividerImage === 'top-and-bottom' && assets.dividerImage && (
                  <OrnamentDivider src={assets.dividerImage} className={swayClass} />
                )}
              </div>
            ) : heroLayoutStyle === 'magazine-split' ? (
              /* STYLE 5: EDITORIAL MAGAZINE (CURVED BANNER + FLOATING CARD) */
              <div className="cb-hero-magazine">
                <div
                  className="relative h-80 sm:h-92 w-full overflow-hidden rounded-b-[48px] shadow-xl border-b-2"
                  style={{ borderColor: `${colors.accent}65` }}
                >
                  <img
                    src={d.photoCover}
                    alt={d.displayTitle}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 45%, rgba(0,0,0,0.45) 100%)',
                    }}
                  />
                </div>

                <Reveal
                  variant="zoom-in"
                  duration={revealDuration}
                  className={`relative z-10 -mt-14 mx-6 rounded-3xl p-6 space-y-2 ${cardBoxMeta.className}`}
                  style={cardBoxMeta.style}
                >
                  <span
                    className={`${typography.headingFont} inline-flex items-center justify-center w-11 h-11 rounded-full border text-xs font-bold tracking-widest mx-auto`}
                    style={{
                      borderColor: `${colors.accent}80`,
                      color: colors.accent,
                    }}
                  >
                    {d.showSecondPerson !== false
                      ? `${(d.brideShort || 'B')[0]}&${(d.groomShort || 'A')[0]}`
                      : (d.groomShort || 'A')[0]}
                  </span>
                  <p
                    className="text-[10px] uppercase tracking-[0.32em] font-semibold pt-1"
                    style={{ color: colors.accent }}
                  >
                    {d.coverSubtitle}
                  </p>
                  <h2
                    className={`${typography.scriptFont} text-[46px] sm:text-[52px] leading-tight`}
                    style={{ color: colors.textMuted }}
                  >
                    {d.showSecondPerson !== false
                      ? `${d.brideShort} & ${d.groomShort}`
                      : d.groomShort}
                  </h2>
                  <p
                    className="text-[11px] tracking-[0.22em] uppercase font-semibold"
                    style={{ color: colors.accent }}
                  >
                    {d.akad?.tanggal}
                  </p>
                </Reveal>
              </div>
            ) : heroLayoutStyle === 'cameo-royal' ? (
              /* STYLE 3: CAMEO / OVAL ROYAL CREST */
              <div className="space-y-5 cb-hero-cameo">
                {pos.dividerImage === 'top-and-bottom' && assets.dividerImage && (
                  <OrnamentDivider src={assets.dividerImage} className={swayClass} />
                )}
                <Reveal variant={revealPrimary} duration={revealDuration} className="space-y-2">
                  <div
                    className={`${typography.headingFont} w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center text-sm font-bold tracking-widest shadow-sm`}
                    style={{
                      borderColor: colors.accent,
                      backgroundColor: hexToRgba(colors.bgSecondary, 0.8),
                      color: colors.textPrimary,
                    }}
                  >
                    {d.monogramText ||
                      (d.showSecondPerson !== false
                        ? `${(d.brideShort || 'B')[0]}•${(d.groomShort || 'A')[0]}`
                        : (d.groomShort || 'A')[0])}
                  </div>
                  <p
                    className="text-[10px] uppercase tracking-[0.35em] font-semibold pt-1"
                    style={{ color: colors.accent }}
                  >
                    {d.coverSubtitle}
                  </p>
                </Reveal>

                <Reveal variant="zoom-in" duration={revealDuration} delay={100}>
                  <PersonPortrait
                    photo={d.photoCover}
                    name={d.displayTitle}
                    shortName={d.displayTitle}
                    shape={assets.coupleFrameImage ? 'cameo-overlay' : 'oval'}
                    frameOverlay={assets.coupleFrameImage}
                    floatingAccent={assets.floatingAccentImage}
                    floatingAccentPos={pos.floatingAccentImage}
                    accentColor={colors.accent}
                    ornamentClass={floatClass}
                  />
                </Reveal>

                <Reveal variant={revealPrimary} duration={revealDuration} delay={150}>
                  <h2
                    className={`${typography.scriptFont} text-[48px] sm:text-[54px] leading-tight`}
                    style={{ color: colors.textMuted }}
                  >
                    {d.showSecondPerson !== false
                      ? `${d.brideShort} & ${d.groomShort}`
                      : d.groomShort}
                  </h2>
                  <p
                    className="text-xs tracking-[0.2em] uppercase mt-1"
                    style={{ color: colors.accent }}
                  >
                    {d.akad?.tanggal}
                  </p>
                </Reveal>
              </div>
            ) : heroLayoutStyle === 'polaroid-collage' ? (
              /* STYLE 4: POLAROID SCRAPBOOK COLLAGE */
              <div className="space-y-6 cb-hero-polaroid">
                {pos.dividerImage === 'top-and-bottom' && assets.dividerImage && (
                  <OrnamentDivider src={assets.dividerImage} className={swayClass} />
                )}
                <Reveal variant={revealPrimary} duration={revealDuration}>
                  <p
                    className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                    style={{ color: colors.accent }}
                  >
                    {d.coverSubtitle}
                  </p>
                  <h2
                    className={`${typography.scriptFont} text-[48px] sm:text-[54px] leading-tight mt-2`}
                    style={{ color: colors.textMuted }}
                  >
                    {d.showSecondPerson !== false
                      ? `${d.brideShort} & ${d.groomShort}`
                      : d.groomShort}
                  </h2>
                </Reveal>

                <Reveal
                  variant="zoom-in"
                  duration={revealDuration}
                  delay={120}
                  className="relative max-w-[310px] h-[290px] mx-auto pt-3"
                >
                  {/* Back right Polaroid */}
                  <div className="absolute right-2 top-5 w-[172px] bg-white p-2.5 pb-6 shadow-xl border border-stone-200 rotate-6">
                    <span
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rotate-2 opacity-65"
                      style={{ backgroundColor: `${colors.accent}66` }}
                    />
                    <div className="w-full aspect-[4/5] overflow-hidden bg-stone-100">
                      <img
                        src={d.gallery?.[1] || d.photoBride || d.photoCover}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Front left Polaroid */}
                  <div className="absolute left-2 top-1 w-[184px] bg-white p-2.5 pb-7 shadow-2xl border border-stone-200 -rotate-4 z-10">
                    <span
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 -rotate-2 opacity-75"
                      style={{ backgroundColor: `${colors.accent}80` }}
                    />
                    <div className="w-full aspect-[4/5] overflow-hidden bg-stone-100">
                      <img
                        src={d.photoCover}
                        alt={d.displayTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-2 font-cursive text-xl text-stone-700 leading-none">
                      {d.akad?.tanggal || 'Our Special Day'}
                    </p>
                  </div>
                </Reveal>
              </div>
            ) : heroLayoutStyle === 'minimal-typographic' ? (
              /* STYLE 6: MINIMAL TYPOGRAPHIC (NO HERO PHOTO BOX — HIGHLIGHTS BACKDROP) */
              <div className="py-6 space-y-5 cb-hero-typographic">
                {pos.dividerImage === 'top-and-bottom' && assets.dividerImage && (
                  <OrnamentDivider src={assets.dividerImage} className={swayClass} />
                )}
                <Reveal variant={revealPrimary} duration={revealDuration} className="space-y-3">
                  <div
                    className={`${typography.headingFont} w-16 h-16 mx-auto rounded-full border flex items-center justify-center text-base font-bold tracking-widest`}
                    style={{
                      borderColor: `${colors.accent}90`,
                      backgroundColor: hexToRgba(colors.bgSecondary, 0.65),
                      color: colors.textPrimary,
                    }}
                  >
                    {d.monogramText ||
                      (d.showSecondPerson !== false
                        ? `${(d.brideShort || 'B')[0]}&${(d.groomShort || 'A')[0]}`
                        : (d.groomShort || 'A')[0])}
                  </div>
                  <p
                    className="text-[10px] uppercase tracking-[0.35em] font-semibold pt-1"
                    style={{ color: colors.accent }}
                  >
                    {d.coverSubtitle}
                  </p>
                  <h2
                    className={`${typography.scriptFont} text-[54px] sm:text-[62px] leading-[1.06]`}
                    style={{ color: colors.textMuted }}
                  >
                    {d.showSecondPerson !== false
                      ? `${d.brideShort} & ${d.groomShort}`
                      : d.groomShort}
                  </h2>
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <span className="h-px w-10" style={{ backgroundColor: `${colors.accent}80` }} />
                    <span
                      className="text-xs tracking-[0.24em] uppercase font-semibold"
                      style={{ color: colors.accent }}
                    >
                      {d.akad?.tanggal}
                    </span>
                    <span className="h-px w-10" style={{ backgroundColor: `${colors.accent}80` }} />
                  </div>
                </Reveal>
              </div>
            ) : (
              /* STYLE 1 (DEFAULT): ARCH DOME FRAME + OPTIONAL PNG OVERLAY */
              <>
                {pos.dividerImage === 'top-and-bottom' && assets.dividerImage && (
                  <OrnamentDivider src={assets.dividerImage} className={swayClass} />
                )}

                <Reveal variant={revealPrimary} duration={revealDuration}>
                  <p
                    className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                    style={{ color: colors.accent }}
                  >
                    {d.coverSubtitle}
                  </p>
                  <h2
                    className={`${typography.scriptFont} text-[48px] sm:text-[54px] leading-tight mt-2`}
                    style={{ color: colors.textMuted }}
                  >
                    {d.showSecondPerson !== false
                      ? `${d.brideShort} & ${d.groomShort}`
                      : d.groomShort}
                  </h2>
                  <p
                    className="text-xs tracking-[0.2em] uppercase mt-1"
                    style={{ color: colors.accent }}
                  >
                    {d.akad?.tanggal}
                  </p>
                </Reveal>

                {assets.headerCalligraphyImage &&
                  pos.headerCalligraphyImage === 'above-hero-photo' && (
                    <img
                      src={assets.headerCalligraphyImage}
                      alt=""
                      className="h-9 w-auto mx-auto object-contain"
                    />
                  )}

                <Reveal variant="zoom-in" duration={revealDuration} delay={120}>
                  <div
                    className="relative max-w-[290px] mx-auto rounded-t-[150px] rounded-b-3xl overflow-hidden shadow-2xl border-2"
                    style={{ borderColor: `${colors.accent}88` }}
                  >
                    <img
                      src={d.photoCover}
                      alt={d.displayTitle}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    {assets.coupleFrameImage &&
                      (pos.coupleFrameImage === 'couple-and-hero' ||
                        pos.coupleFrameImage === 'all-photos') && (
                        <img
                          src={assets.coupleFrameImage}
                          alt=""
                          className="pointer-events-none absolute inset-0 w-full h-full object-contain z-20 scale-[1.06]"
                        />
                      )}
                  </div>
                </Reveal>
              </>
            )}

            <Reveal
              variant={revealPrimary}
              duration={revealDuration}
              delay={180}
              className={`max-w-xs mx-auto space-y-4 ${
                heroLayoutStyle === 'fullscreen-photo' || heroLayoutStyle === 'magazine-split'
                  ? 'px-4 pt-6'
                  : 'pt-2'
              }`}
            >
              {assets.headerCalligraphyImage &&
                (pos.headerCalligraphyImage === 'above-greeting' ||
                  pos.headerCalligraphyImage === 'cover-top') && (
                  <img
                    src={assets.headerCalligraphyImage}
                    alt=""
                    className="h-9 w-auto mx-auto object-contain"
                  />
                )}
              <p
                className="text-[13px] leading-[1.7]"
                style={{ color: colors.textPrimary }}
              >
                {d.openingGreeting}
              </p>

              {d.kutipanPembuka && (
                <p
                  className={`text-[12.5px] italic leading-relaxed px-3 py-3 rounded-2xl ${cardBoxMeta.className}`}
                  style={{
                    ...cardBoxMeta.style,
                    color: colors.textMuted,
                  }}
                >
                  &ldquo;{d.kutipanPembuka}&rdquo;
                </p>
              )}
              {d.ayatQuote && (
                <p
                  className={`${typography.headingFont} text-xs uppercase tracking-[0.22em] font-semibold`}
                  style={{ color: colors.accent }}
                >
                  {d.ayatQuote}
                </p>
              )}
            </Reveal>
          </section>

          {/* SECTION 2: COUPLE / MAIN SUBJECT PROFILES */}
          <section
            className="relative px-6 py-14 space-y-10"
            style={sectionBandStyle}
          >
            <Reveal variant={revealPrimary} duration={revealDuration} className="text-center space-y-2">
              {assets.headerCalligraphyImage &&
                pos.headerCalligraphyImage === 'above-couple' && (
                  <img
                    src={assets.headerCalligraphyImage}
                    alt=""
                    className="h-9 w-auto mx-auto object-contain mb-2"
                  />
                )}
              <p
                className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                style={{ color: colors.accent }}
              >
                {d.showSecondPerson !== false
                  ? 'Kedua Mempelai'
                  : d.person1Role || 'Profil Acara'}
              </p>
              <h3
                className={`${typography.headingFont} text-2xl sm:text-3xl font-bold mt-1`}
                style={{ color: colors.textPrimary }}
              >
                {d.showSecondPerson !== false ? 'Mempelai Berbahagia' : d.groomShort}
              </h3>
            </Reveal>

            <div className="space-y-8 max-w-sm mx-auto">
              {/* Second person (Bride) when couple event */}
              {d.showSecondPerson !== false && (
                <>
                  <Reveal
                    variant={revealPrimary}
                    duration={revealDuration}
                    className="text-center space-y-3"
                  >
                    <PersonPortrait
                      photo={d.photoBride}
                      name={d.bride}
                      shortName={d.brideShort}
                      shape={photoFrameShape}
                      frameOverlay={assets.coupleFrameImage}
                      floatingAccent={assets.floatingAccentImage}
                      floatingAccentPos={pos.floatingAccentImage}
                      accentColor={colors.accent}
                      ornamentClass={floatClass}
                    />
                    <h4
                      className={`${typography.scriptFont} text-[44px] leading-none pt-1`}
                      style={{ color: colors.textMuted }}
                    >
                      {d.brideShort}
                    </h4>
                    <p
                      className={`${typography.headingFont} text-base font-bold`}
                      style={{ color: colors.textPrimary }}
                    >
                      {d.bride}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                      {d.brideChildOrder || 'Putri Pertama'} dari{' '}
                      <strong>{d.brideFather}</strong> &amp;{' '}
                      <strong>{d.brideMother}</strong>
                    </p>
                  </Reveal>

                  <div className="text-center space-y-2">
                    {pos.dividerImage === 'couple-and-events' && assets.dividerImage && (
                      <OrnamentDivider src={assets.dividerImage} className={swayClass} />
                    )}
                    <span
                      className={`${typography.scriptFont} text-4xl inline-block animate-breathe`}
                      style={{ color: colors.accent }}
                    >
                      &amp;
                    </span>
                  </div>
                </>
              )}

              {/* First person (Groom or Main Subject for Birthday/Event) */}
              <Reveal
                variant={revealAlt}
                duration={revealDuration}
                className="text-center space-y-3"
              >
                <PersonPortrait
                  photo={d.photoGroom}
                  name={d.groom}
                  shortName={d.groomShort}
                  shape={photoFrameShape}
                  frameOverlay={assets.coupleFrameImage}
                  floatingAccent={assets.floatingAccentImage}
                  floatingAccentPos={pos.floatingAccentImage}
                  accentColor={colors.accent}
                  ornamentClass={floatClass}
                />
                <h4
                  className={`${typography.scriptFont} text-[44px] leading-none pt-1`}
                  style={{ color: colors.textMuted }}
                >
                  {d.groomShort}
                </h4>
                <p
                  className={`${typography.headingFont} text-base font-bold`}
                  style={{ color: colors.textPrimary }}
                >
                  {d.groom}
                </p>
                {(d.showSecondPerson !== false ||
                  d.person1Subline ||
                  d.groomFather ||
                  d.groomMother) && (
                  <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                    {d.showSecondPerson !== false
                      ? `${d.groomChildOrder || 'Putra Pertama'} dari`
                      : d.person1Subline}
                    {(d.groomFather || d.groomMother) && (
                      <>
                        {(d.showSecondPerson !== false || d.person1Subline) && <br />}
                        {[d.groomFather, d.groomMother]
                          .filter(Boolean)
                          .map((p, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && ' & '}
                              <strong>{p}</strong>
                            </React.Fragment>
                          ))}
                      </>
                    )}
                  </p>
                )}
              </Reveal>
            </div>
          </section>

          {/* SECTION 3: SAVE THE DATE, COUNTDOWN & RANGKAIAN ACARA */}
          <section className="relative px-6 py-14 text-center space-y-7">
            <Reveal variant={revealPrimary} duration={revealDuration} className="space-y-2">
              {assets.venueIllustrationImage &&
                pos.venueIllustrationImage === 'above-title' && (
                  <img
                    src={assets.venueIllustrationImage}
                    alt="Ilustrasi Tempat"
                    className="w-48 h-auto mx-auto object-contain mb-3 opacity-90"
                  />
                )}
              <p
                className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                style={{ color: colors.accent }}
              >
                Save The Date
              </p>
              <h3
                className={`${typography.scriptFont} text-[46px] leading-none`}
                style={{ color: colors.textMuted }}
              >
                {d.countdownTitle}
              </h3>
            </Reveal>

            {/* Countdown Grid */}
            {d.showCountdown !== false && (
              <Reveal variant="zoom-in" duration={revealDuration}>
                <div className="grid grid-cols-4 gap-2 max-w-[320px] mx-auto">
                  {[
                    { label: 'Hari', val: d.timeLeft?.days ?? 0 },
                    { label: 'Jam', val: d.timeLeft?.hours ?? 0 },
                    { label: 'Menit', val: d.timeLeft?.minutes ?? 0 },
                    { label: 'Detik', val: d.timeLeft?.seconds ?? 0 },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className={`rounded-2xl py-3 px-1 ${cardBoxMeta.className}`}
                      style={cardBoxMeta.style}
                    >
                      <div
                        className={`${typography.headingFont} text-xl font-bold leading-none`}
                        style={{ color: colors.textPrimary }}
                      >
                        {String(c.val).padStart(2, '0')}
                      </div>
                      <div
                        className="text-[9px] uppercase tracking-widest mt-1"
                        style={{ color: colors.accent }}
                      >
                        {c.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {assets.venueIllustrationImage &&
              pos.venueIllustrationImage === 'below-countdown' && (
                <img
                  src={assets.venueIllustrationImage}
                  alt="Ilustrasi Tempat"
                  className="w-48 h-auto mx-auto object-contain opacity-90"
                />
              )}

            {/* Primary Event Card */}
            <Reveal
              variant={revealPrimary}
              duration={revealDuration}
              className={`rounded-3xl p-6 space-y-3 max-w-sm mx-auto ${cardBoxMeta.className}`}
              style={cardBoxMeta.style}
            >
              {assets.venueIllustrationImage &&
                pos.venueIllustrationImage === 'inside-event-card' && (
                  <img
                    src={assets.venueIllustrationImage}
                    alt="Ilustrasi Tempat"
                    className="w-40 h-auto mx-auto object-contain mb-2 opacity-90"
                  />
                )}
              <h4
                className={`${typography.scriptFont} text-[44px] leading-none`}
                style={{ color: colors.textMuted }}
              >
                {d.akad?.judul || 'Acara Utama'}
              </h4>
              <p className="text-xs font-bold flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                <span>{d.akad?.tanggal}</span>
              </p>
              <p className="text-xs flex items-center justify-center gap-1.5" style={{ color: colors.textMuted }}>
                <Clock className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                <span>{d.akad?.waktu}</span>
              </p>
              <p
                className={`${typography.headingFont} text-sm font-bold pt-1`}
                style={{ color: colors.textPrimary }}
              >
                {d.akad?.lokasi}
              </p>
              {d.akad?.alamat && (
                <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                  {d.akad.alamat}
                </p>
              )}
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                {d.akad?.mapUrl && (
                  <a
                    href={d.akad.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sheen inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold shadow-md"
                    style={{
                      backgroundColor: colors.buttonBg,
                      color: colors.buttonText,
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                )}
                {d.googleCalUrl && (
                  <a
                    href={d.googleCalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border"
                    style={{
                      borderColor: `${colors.accent}70`,
                      color: colors.textPrimary,
                    }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Simpan Tanggal</span>
                  </a>
                )}
              </div>
            </Reveal>

            {/* Optional Divider + Second Event */}
            {d.showSecondEvent !== false && (
              <>
                {assets.dividerImage &&
                  (pos.dividerImage === 'between-events' ||
                    pos.dividerImage === 'all-sections' ||
                    pos.dividerImage === 'couple-and-events') && (
                    <Reveal variant="zoom-in" className="flex justify-center">
                      <img
                        src={assets.dividerImage}
                        alt=""
                        className={`h-12 w-auto object-contain ${swayClass}`}
                      />
                    </Reveal>
                  )}

                <Reveal
                  variant={revealAlt}
                  duration={revealDuration}
                  className={`rounded-3xl p-6 space-y-3 max-w-sm mx-auto ${cardBoxMeta.className}`}
                  style={cardBoxMeta.style}
                >
                  <h4
                    className={`${typography.scriptFont} text-[44px] leading-none`}
                    style={{ color: colors.textMuted }}
                  >
                    {d.resepsi?.judul || 'Resepsi'}
                  </h4>
                  <p className="text-xs font-bold flex items-center justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    <span>{d.resepsi?.tanggal}</span>
                  </p>
                  <p className="text-xs flex items-center justify-center gap-1.5" style={{ color: colors.textMuted }}>
                    <Clock className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    <span>{d.resepsi?.waktu}</span>
                  </p>
                  <p
                    className={`${typography.headingFont} text-sm font-bold pt-1`}
                    style={{ color: colors.textPrimary }}
                  >
                    {d.resepsi?.lokasi}
                  </p>
                  {d.resepsi?.alamat && (
                    <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                      {d.resepsi.alamat}
                    </p>
                  )}
                  {(d.resepsi?.mapUrl || d.akad?.mapUrl) && (
                    <div className="pt-2">
                      <a
                        href={d.resepsi?.mapUrl || d.akad?.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-sheen inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold shadow-md"
                        style={{
                          backgroundColor: colors.buttonBg,
                          color: colors.buttonText,
                        }}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Google Maps</span>
                      </a>
                    </div>
                  )}
                </Reveal>
              </>
            )}

            {assets.venueIllustrationImage &&
              pos.venueIllustrationImage === 'below-events' && (
                <img
                  src={assets.venueIllustrationImage}
                  alt="Ilustrasi Tempat"
                  className="w-48 h-auto mx-auto object-contain pt-2 opacity-90"
                />
              )}

            {d.showQr && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold border shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
                  style={{
                    borderColor: `${colors.accent}80`,
                    backgroundColor: colors.buttonBg,
                    color: colors.buttonText,
                  }}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Tampilkan Kartu QR Tamu</span>
                </button>
              </div>
            )}

            {/* Optional Seat Plan / Denah Lokasi */}
            {d.showSeatPlan && d.seatPlanImage && (
              <Reveal
                variant={revealPrimary}
                duration={revealDuration}
                className={`rounded-3xl p-5 space-y-3 max-w-sm mx-auto text-center ${cardBoxMeta.className}`}
                style={cardBoxMeta.style}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: colors.accent }}
                >
                  Denah Acara
                </p>
                <h4
                  className={`${typography.headingFont} text-lg font-bold`}
                  style={{ color: colors.textPrimary }}
                >
                  {d.seatPlanTitle}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                  {d.seatPlanCaption}
                </p>
                <button
                  type="button"
                  onClick={() => setSeatPlanZoomOpen(true)}
                  className="group relative block w-full rounded-2xl overflow-hidden border cursor-pointer"
                  style={{ borderColor: `${colors.accent}50` }}
                >
                  <img
                    src={d.seatPlanImage}
                    alt={d.seatPlanTitle}
                    className="w-full h-auto object-contain max-h-64 mx-auto transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold py-1.5 px-3 rounded-full mb-2 bg-black/60 text-white">
                    <ZoomIn className="w-3 h-3" /> Perbesar Denah
                  </span>
                </button>
              </Reveal>
            )}
          </section>

          {/* SECTION 4: PREWEDDING VIDEO (OPTIONAL) */}
          {(d.preweddingVideoUrl || youtubeEmbed) && (
            <section
              className="px-6 py-12 space-y-5 text-center"
              style={sectionBandStyle}
            >
              <Reveal variant={revealPrimary} duration={revealDuration}>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: colors.accent }}>
                  <Play className="w-3 h-3" />
                  <span>Video Momen</span>
                </div>
                <div
                  className="mt-4 max-w-sm mx-auto rounded-2xl overflow-hidden border shadow-xl bg-black"
                  style={{ borderColor: `${colors.accent}45` }}
                >
                  {youtubeEmbed ? (
                    <iframe
                      src={youtubeEmbed}
                      title="Video Momen"
                      className="w-full aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={d.preweddingVideoUrl}
                      controls
                      className="w-full aspect-video object-cover"
                    />
                  )}
                </div>
              </Reveal>
            </section>
          )}

          {/* SECTION 5: LOVE STORIES / KISAH */}
          {d.showLoveStory !== false && d.loveStories && d.loveStories.length > 0 && (
            <section className="px-6 py-12 space-y-6">
              {pos.dividerImage === 'all-sections' && assets.dividerImage && (
                <OrnamentDivider src={assets.dividerImage} className={swayClass} />
              )}
              <Reveal variant={revealPrimary} duration={revealDuration} className="text-center">
                <p
                  className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                  style={{ color: colors.accent }}
                >
                  Timeline
                </p>
                <h3
                  className={`${typography.scriptFont} text-[44px] leading-none mt-1`}
                  style={{ color: colors.textMuted }}
                >
                  {d.storiesTitle}
                </h3>
              </Reveal>

              <div className="space-y-4 max-w-sm mx-auto">
                {d.loveStories.map((st, idx) => (
                  <Reveal
                    key={idx}
                    variant={revealPrimary}
                    duration={revealDuration}
                    delay={idx * 80}
                    className={`rounded-2xl p-5 space-y-1.5 ${cardBoxMeta.className}`}
                    style={cardBoxMeta.style}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`${typography.headingFont} font-bold text-sm`}
                        style={{ color: colors.textPrimary }}
                      >
                        {st.judul}
                      </h4>
                      {st.tahun && (
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${colors.accent}25`,
                            color: colors.textMuted,
                          }}
                        >
                          {st.tahun}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: colors.textMuted }}
                    >
                      {st.cerita}
                    </p>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 6: GALLERY */}
          {d.showGallery !== false && d.gallery && d.gallery.length > 0 && (
            <section
              className="px-6 py-12 space-y-6"
              style={sectionBandStyle}
            >
              {pos.dividerImage === 'all-sections' && assets.dividerImage && (
                <OrnamentDivider src={assets.dividerImage} className={swayClass} />
              )}
              <Reveal variant={revealPrimary} duration={revealDuration} className="text-center">
                <p
                  className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                  style={{ color: colors.accent }}
                >
                  Galeri
                </p>
                <h3
                  className={`${typography.scriptFont} text-[44px] leading-none mt-1`}
                  style={{ color: colors.textMuted }}
                >
                  {d.momentsTitle}
                </h3>
              </Reveal>

              {galleryStyle === 'carousel' ? (
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-2 px-2">
                  {d.gallery.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => d.openLightbox(idx)}
                      className="snap-center shrink-0 w-[235px] aspect-[3/4] rounded-2xl overflow-hidden border shadow-md cursor-pointer group"
                      style={{ borderColor: `${colors.accent}45` }}
                    >
                      <img
                        src={photo}
                        alt={`Galeri ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {d.gallery.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => d.openLightbox(idx)}
                      className={`group overflow-hidden rounded-2xl border shadow-sm cursor-pointer ${
                        galleryStyle === 'editorial' && idx % 3 === 0
                          ? 'col-span-2 aspect-[16/10]'
                          : 'aspect-[4/5]'
                      }`}
                      style={{ borderColor: `${colors.accent}40` }}
                    >
                      <img
                        src={photo}
                        alt={`Galeri ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* SECTION 7: DRESS CODE (OPTIONAL) */}
          {d.showDresscode && (
            <section className="px-6 py-10 text-center space-y-4">
              <Reveal variant={revealPrimary} duration={revealDuration} className="max-w-xs mx-auto space-y-3">
                <h3
                  className={`${typography.headingFont} text-xl font-bold`}
                  style={{ color: colors.textPrimary }}
                >
                  {d.dresscodeTitle}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                  {d.dresscodeText}
                </p>
                <div className="flex items-center justify-center gap-3 pt-1">
                  {(d.dresscodeColors || []).map((col, idx) => (
                    <span
                      key={idx}
                      className="w-8 h-8 rounded-full border shadow-sm"
                      style={{
                        backgroundColor: col,
                        borderColor: `${colors.accent}66`,
                      }}
                    />
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          {/* SECTION 8: WEDDING GIFT / AMPLOP DIGITAL */}
          {((d.bankAccounts && d.bankAccounts.length > 0) || Boolean(d.giftAddress)) && (
            <section
              className="px-6 py-12 space-y-6 text-center"
              style={sectionBandStyle}
            >
              {pos.dividerImage === 'all-sections' && assets.dividerImage && (
                <OrnamentDivider src={assets.dividerImage} className={swayClass} />
              )}
              <Reveal variant={revealPrimary} duration={revealDuration} className="max-w-sm mx-auto space-y-2">
                <Gift className="w-6 h-6 mx-auto" style={{ color: colors.accent }} />
                <h3
                  className={`${typography.scriptFont} text-[44px] leading-none`}
                  style={{ color: colors.textMuted }}
                >
                  {d.giftTitle}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                  {d.giftSubtitle}
                </p>
              </Reveal>

              <div className="space-y-3.5 max-w-sm mx-auto text-left">
                {(d.bankAccounts || []).map((acc, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 flex items-center justify-between gap-3 ${cardBoxMeta.className}`}
                    style={{
                      ...cardBoxMeta.style,
                      backgroundColor:
                        cardStyle === 'glass'
                          ? cardBoxMeta.style.backgroundColor
                          : colors.bgPrimary,
                    }}
                  >
                    <div>
                      <p
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: colors.accent }}
                      >
                        {acc.bank}
                      </p>
                      <p
                        className={`${typography.headingFont} text-base font-bold tracking-wide mt-0.5`}
                        style={{ color: colors.textPrimary }}
                      >
                        {acc.nomor}
                      </p>
                      <p className="text-xs" style={{ color: colors.textMuted }}>
                        a.n {acc.nama}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => d.copyBank(acc.nomor, idx)}
                      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold cursor-pointer shrink-0"
                      style={{
                        backgroundColor: colors.buttonBg,
                        color: colors.buttonText,
                      }}
                    >
                      {d.copiedBankIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}

                {d.giftAddress && (
                  <div
                    className={`rounded-2xl p-4 space-y-2 text-center ${cardBoxMeta.className}`}
                    style={{
                      ...cardBoxMeta.style,
                      backgroundColor:
                        cardStyle === 'glass'
                          ? cardBoxMeta.style.backgroundColor
                          : colors.bgPrimary,
                    }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.accent }}
                    >
                      Kirim Kado Fisik
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                      {d.giftAddress}
                    </p>
                    <button
                      type="button"
                      onClick={d.copyAddress}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold border cursor-pointer"
                      style={{
                        borderColor: `${colors.accent}70`,
                        color: colors.textPrimary,
                      }}
                    >
                      {d.copiedAddress ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{d.copiedAddress ? 'Alamat Disalin' : 'Salin Alamat'}</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 9: RSVP & UCAPAN */}
          {d.showRsvp !== false && (
          <section className="px-6 py-12 space-y-6">
            {pos.dividerImage === 'all-sections' && assets.dividerImage && (
              <OrnamentDivider src={assets.dividerImage} className={swayClass} />
            )}
            <Reveal variant={revealPrimary} duration={revealDuration} className="text-center space-y-1">
              <MessageCircle className="w-6 h-6 mx-auto" style={{ color: colors.accent }} />
              <h3
                className={`${typography.scriptFont} text-[44px] leading-none`}
                style={{ color: colors.textMuted }}
              >
                {d.rsvpTitle}
              </h3>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                {d.rsvpSubtitle}
              </p>
              {d.rsvp.list && d.rsvp.list.length > 0 && (
                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-semibold">
                  <span
                    className="px-3 py-1 rounded-full border"
                    style={{
                      borderColor: `${colors.accent}50`,
                      backgroundColor: `${colors.accent}18`,
                      color: colors.textPrimary,
                    }}
                  >
                    Hadir: {d.rsvp.list.filter((r) => (r.attendance_status || 'Hadir') === 'Hadir').length}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full border"
                    style={{
                      borderColor: `${colors.accent}35`,
                      color: colors.textMuted,
                    }}
                  >
                    Berhalangan: {d.rsvp.list.filter((r) => r.attendance_status === 'Tidak Hadir').length}
                  </span>
                </div>
              )}
            </Reveal>

            <form
              onSubmit={d.rsvp.send}
              className={`max-w-sm mx-auto rounded-3xl p-5 space-y-3.5 ${cardBoxMeta.className}`}
              style={cardBoxMeta.style}
            >
              <div>
                <label className="block text-[11px] font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Nama Tamu *
                </label>
                <input
                  type="text"
                  required
                  value={d.rsvp.name}
                  onChange={(e) => d.rsvp.setName(e.target.value)}
                  disabled={d.rsvp.hasSubmitted}
                  placeholder="Nama lengkap Anda..."
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs border focus:outline-none"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.45)' : '#ffffff',
                    borderColor: `${colors.accent}55`,
                    color: isDark ? '#ffffff' : colors.textPrimary,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Kehadiran
                  </label>
                  <select
                    value={d.rsvp.status}
                    onChange={(e) => d.rsvp.setStatus(e.target.value)}
                    disabled={d.rsvp.hasSubmitted}
                    className="w-full rounded-xl px-3 py-2.5 text-xs border focus:outline-none"
                    style={{
                      backgroundColor: isDark ? '#181412' : '#ffffff',
                      borderColor: `${colors.accent}55`,
                      color: isDark ? '#ffffff' : colors.textPrimary,
                    }}
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                    <option value="Masih Ragu">Masih Ragu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Jumlah Hadir
                  </label>
                  <select
                    value={d.rsvp.pax}
                    onChange={(e) => d.rsvp.setPax(e.target.value)}
                    disabled={d.rsvp.hasSubmitted}
                    className="w-full rounded-xl px-3 py-2.5 text-xs border focus:outline-none"
                    style={{
                      backgroundColor: isDark ? '#181412' : '#ffffff',
                      borderColor: `${colors.accent}55`,
                      color: isDark ? '#ffffff' : colors.textPrimary,
                    }}
                  >
                    <option value="1 Orang">1 Orang</option>
                    <option value="2 Orang">2 Orang</option>
                    <option value="3 Orang">3 Orang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Ucapan &amp; Doa *
                </label>
                <textarea
                  rows={3}
                  required
                  value={d.rsvp.message}
                  onChange={(e) => d.rsvp.setMessage(e.target.value)}
                  disabled={d.rsvp.hasSubmitted}
                  placeholder={
                    d.showSecondPerson !== false
                      ? 'Tuliskan ucapan dan doa terbaik untuk kedua mempelai...'
                      : 'Tuliskan ucapan dan doa terbaik Anda...'
                  }
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs border focus:outline-none"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.45)' : '#ffffff',
                    borderColor: `${colors.accent}55`,
                    color: isDark ? '#ffffff' : colors.textPrimary,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={d.rsvp.hasSubmitted}
                className="btn-sheen w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-60"
                style={{
                  backgroundColor: colors.buttonBg,
                  color: colors.buttonText,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{d.rsvp.hasSubmitted ? 'Ucapan Terkirim' : 'Kirim Ucapan'}</span>
              </button>
            </form>

            {d.rsvp.list && d.rsvp.list.length > 0 && (
              <div className="max-w-sm mx-auto space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {d.rsvp.list.map((w, idx) => (
                  <div
                    key={w.id || idx}
                    className={`rounded-2xl p-3.5 space-y-1 ${cardBoxMeta.className}`}
                    style={cardBoxMeta.style}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-xs font-bold"
                        style={{ color: colors.textPrimary }}
                      >
                        {w.guest_name}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${colors.accent}25`,
                          color: colors.textMuted,
                        }}
                      >
                        {w.attendance_status || 'Hadir'}
                      </span>
                    </div>
                    <p className="text-[10px] opacity-70" style={{ color: colors.textMuted }}>
                      {formatRsvpDate(w)}
                    </p>
                    <p className="text-xs leading-relaxed pt-0.5" style={{ color: colors.textPrimary }}>
                      {w.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
          )}

          {/* SECTION 10: CLOSING */}
          <section
            className="relative px-6 py-16 text-center space-y-4 overflow-hidden"
            style={sectionBandStyle}
          >
            {assets.bottomPillarImage &&
              (pos.bottomPillarImage === 'bottom-center' ||
                !pos.bottomPillarImage) && (
                <img
                  src={assets.bottomPillarImage}
                  alt=""
                  className={`pointer-events-none mx-auto w-56 h-auto object-contain opacity-90 ${swayClass}`}
                />
              )}

            {assets.bottomPillarImage &&
              (pos.bottomPillarImage === 'bottom-corners' ||
                pos.bottomPillarImage === 'bottom-left') && (
                <img
                  src={assets.bottomPillarImage}
                  alt=""
                  className={`pointer-events-none absolute -bottom-3 -left-6 w-36 h-auto object-contain opacity-90 ${swayClass}`}
                />
              )}

            {assets.bottomPillarImage &&
              (pos.bottomPillarImage === 'bottom-corners' ||
                pos.bottomPillarImage === 'bottom-right') && (
                <img
                  src={assets.bottomPillarImage}
                  alt=""
                  className={`pointer-events-none absolute -bottom-3 -right-6 w-36 h-auto object-contain opacity-90 -scale-x-100 ${swayClass}`}
                />
              )}

            <Reveal variant={revealPrimary} duration={revealDuration} className="relative z-10 max-w-xs mx-auto space-y-3">
              {pos.dividerImage === 'top-and-bottom' && assets.dividerImage && (
                <OrnamentDivider src={assets.dividerImage} className={swayClass} />
              )}
              <Heart className="w-5 h-5 mx-auto" style={{ color: colors.accent }} />
              <p
                className="text-xs leading-relaxed whitespace-pre-line"
                style={{ color: colors.textPrimary }}
              >
                {d.closingText}
              </p>
              {d.closingGreeting && (
                <p
                  className="text-xs font-bold"
                  style={{ color: colors.textMuted }}
                >
                  {d.closingGreeting}
                </p>
              )}

              <div className="pt-3 space-y-1">
                <p
                  className="text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: colors.accent }}
                >
                  {d.closingSignoff}
                </p>
                <p
                  className={`${typography.scriptFont} text-[48px] leading-none pt-1`}
                  style={{ color: colors.textMuted }}
                >
                  {d.showSecondPerson !== false
                    ? `${d.brideShort} & ${d.groomShort}`
                    : d.groomShort}
                </p>
              </div>

              <div className="pt-6 opacity-75 space-y-0.5">
                <p className="text-[9px] uppercase tracking-[0.25em]">
                  Made with Love by
                </p>
                <p
                  className={`${typography.headingFont} text-xs uppercase tracking-[0.25em] font-bold`}
                >
                  {d.footerBrand}
                </p>
              </div>
            </Reveal>
          </section>
        </div>

        {/* Seat Plan Fullscreen Lightbox */}
        {seatPlanZoomOpen && d.seatPlanImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSeatPlanZoomOpen(false)}
          >
            <button
              type="button"
              onClick={() => setSeatPlanZoomOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
              aria-label="Tutup Denah"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={d.seatPlanImage}
              alt={d.seatPlanTitle}
              className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Floating Music & Controls */}
        <audio src={d.musicUrl} preload="none" className="hidden" />

        {d.isOpened && (
          <MusicVinylPlayer
            musicUrl={d.musicUrl}
            musicTitle={d.musicTitle}
            isPlaying={d.isPlayingMusic}
            onToggle={d.toggleMusic}
            position="bottom-right"
            theme={isDark ? 'gold' : 'wood'}
            accentColor={colors.accent}
          />
        )}

        <InvitationFloatingControls
          isOpened={d.isOpened}
          guest={guest}
          guestName={d.guestName}
          guestCategory={d.guestCategory}
          guestPax={d.guestPax}
          qrValue={d.qrValue}
          showQr={d.showQr}
          showQrFloater={false}
          accentColor={colors.accent}
          theme={isDark ? 'gold' : 'wood'}
          isOpen={qrModalOpen}
          onOpenChange={setQrModalOpen}
        />

        <GalleryLightbox
          photos={d.gallery}
          activeIndex={d.gallerySelected}
          isOpen={d.isLightboxOpen}
          onClose={() => d.setIsLightboxOpen(false)}
          onIndexChange={d.setGallerySelected}
        />
      </main>
    </div>
  );
};
