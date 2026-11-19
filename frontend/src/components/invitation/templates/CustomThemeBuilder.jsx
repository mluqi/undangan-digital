import React, { useMemo, useState } from 'react';
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
} from 'lucide-react';
import { GalleryLightbox } from '../GalleryLightbox';
import { InvitationFloatingControls } from '../InvitationFloatingControls';
import { DesktopSidePanel } from '../DesktopSidePanel';
import { MusicVinylPlayer } from '../MusicVinylPlayer';
import { Reveal } from '../Reveal';
import { useInvitationData, formatRsvpDate } from '../useInvitationData';

export const DEFAULT_CUSTOM_THEME = {
  coverStyle: 'envelope', // 'envelope' | 'arch-curtain' | 'cinematic'
  photoFrameShape: 'cameo-overlay', // 'cameo-overlay' | 'arch' | 'oval' | 'circle' | 'polaroid' | 'rounded'
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
    particleType: 'petals', // 'petals' | 'sparkles' | 'leaves' | 'snow' | 'none'
    particleColor: '#eab8c2',
    ornamentMotion: 'sway-float', // 'sway-float' | 'subtle' | 'static'
    scrollReveal: 'fade-up', // 'fade-up' | 'zoom-in' | 'slide-side'
    revealDuration: '850', // '550' | '850' | '1250'
  },
};

export const CUSTOM_THEME_PRESETS = {
  'romantic-cameo': {
    label: 'Romantic Satin & Cameo',
    description: 'Amplop interaktif, renda vintage, ornamen mawar & bingkai cameo',
    theme: DEFAULT_CUSTOM_THEME,
  },
  'noir-cinematic': {
    label: 'Espresso Noir & Video',
    description: 'Tema gelap sinematik mendukung latar video loop & foto arch',
    theme: {
      coverStyle: 'cinematic',
      photoFrameShape: 'arch',
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
    description: 'Biru malam gelap dengan bingkai emas, mahkota & kilau cahaya',
    theme: {
      coverStyle: 'arch-curtain',
      photoFrameShape: 'oval',
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
    label: 'Botanical Sage & Ivory',
    description: 'Nuansa taman tropis lembut dengan ornamen daun & kertas bertekstur',
    theme: {
      coverStyle: 'arch-curtain',
      photoFrameShape: 'rounded',
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
  size: 9 + (i % 4) * 3,
  duration: `${9 + (i % 5) * 1.8}s`,
  delay: `${(i * 0.85) % 6}s`,
}));

const mergeCustomTheme = (templateCustom = {}, contentCustom = {}) => ({
  coverStyle:
    contentCustom.coverStyle ||
    templateCustom.coverStyle ||
    DEFAULT_CUSTOM_THEME.coverStyle,
  photoFrameShape:
    contentCustom.photoFrameShape ||
    templateCustom.photoFrameShape ||
    DEFAULT_CUSTOM_THEME.photoFrameShape,
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
  const { invitation, guest, isModalView = false } = props;
  const d = useInvitationData(props);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const customTheme = useMemo(() => {
    const tCustom = invitation?.template?.default_content_json?.customTheme || {};
    const cCustom = invitation?.content_json?.customTheme || {};
    return mergeCustomTheme(tCustom, cCustom);
  }, [invitation]);

  const {
    coverStyle,
    photoFrameShape,
    colors,
    typography,
    assets,
    assetPositions,
    animations,
  } = customTheme;
  const pos = assetPositions || DEFAULT_CUSTOM_THEME.assetPositions;

  const isDark = useMemo(() => isDarkColor(colors.bgPrimary), [colors.bgPrimary]);

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
    if (!d.isOpened) return 'opacity-100 translate-y-0 scale-100';
    if (animations.coverTransition === 'fade-zoom') {
      return 'opacity-0 scale-110 pointer-events-none';
    }
    if (animations.coverTransition === 'blur-fade') {
      return 'opacity-0 blur-md scale-105 pointer-events-none';
    }
    return '-translate-y-full opacity-0 pointer-events-none';
  }, [d.isOpened, animations.coverTransition]);

  const youtubeEmbed = useMemo(
    () => getYoutubeEmbedUrl(d.preweddingVideoUrl),
    [d.preweddingVideoUrl]
  );

  const activeBgVideoUrl =
    d.backgroundVideoUrl && d.backgroundVideoUrl !== 'none'
      ? d.backgroundVideoUrl
      : '';

  const sidePanelTheme = isDark
    ? coverStyle === 'cinematic'
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

  const renderParticleShape = (p) => {
    if (animations.particleType === 'none') return null;
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
        .cb-particle-item {
          position: absolute;
          top: -8vh;
          pointer-events: none;
          animation: cb-particle-fall linear infinite;
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
        {/* Background Video / Body Image Layer */}
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
              className="w-full h-full object-cover opacity-35"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `${colors.bgPrimary}cc` }}
            />
          </div>
        ) : assets.bodyBgImage ? (
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
          />
        ) : null}

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
        {/* OPENING COVER OVERLAY                                        */}
        {/* ============================================================ */}
        <section
          aria-label="Sampul Undangan Custom"
          className={`fixed inset-y-0 ${
            isModalView
              ? 'left-1/2 -translate-x-1/2 w-full max-w-[430px]'
              : 'left-0 right-0 lg:left-auto lg:right-0 lg:w-[480px] xl:w-[520px]'
          } z-50 flex flex-col justify-between items-center text-center px-6 pt-12 pb-10 transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] select-none overflow-hidden ${coverClosedClass}`}
          style={{
            backgroundColor: isDark ? '#0D0A09' : colors.textPrimary,
            color: '#FDF9F6',
          }}
        >
          {/* Cover Background Video or Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {activeBgVideoUrl ? (
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
              className="absolute inset-0"
              style={{
                background:
                  coverStyle === 'cinematic'
                    ? 'linear-gradient(180deg, rgba(10,8,7,0.5) 0%, rgba(10,8,7,0.25) 45%, rgba(10,8,7,0.88) 100%)'
                    : 'linear-gradient(180deg, rgba(20,10,12,0.52) 0%, rgba(20,10,12,0.28) 50%, rgba(20,10,12,0.72) 100%)',
              }}
            />
          </div>

          {assets.cornerTopLeftImage &&
            (pos.cornerTopLeftImage === 'top-corners' ||
              pos.cornerTopLeftImage === 'top-both' ||
              pos.cornerTopLeftImage === 'top-left-only') && (
              <img
                src={assets.cornerTopLeftImage}
                alt=""
                className={`pointer-events-none absolute -top-6 -left-6 w-32 z-10 opacity-90 ${swayClass}`}
              />
            )}

          {assets.cornerTopLeftImage &&
            (pos.cornerTopLeftImage === 'top-both' ||
              pos.cornerTopLeftImage === 'top-right-only') && (
              <img
                src={assets.cornerTopLeftImage}
                alt=""
                className={`pointer-events-none absolute -top-6 -right-6 w-32 z-10 opacity-90 -scale-x-100 ${swayClass}`}
              />
            )}

          {assets.envelopeClosedImage && pos.envelopeClosedImage === 'top-curtain' && (
            <img
              src={assets.envelopeClosedImage}
              alt=""
              className="pointer-events-none absolute top-0 inset-x-0 w-full max-h-48 object-cover object-top z-10 opacity-90"
            />
          )}

          {assets.envelopeClosedImage && pos.envelopeClosedImage === 'bottom-stage' && (
            <img
              src={assets.envelopeClosedImage}
              alt=""
              className="pointer-events-none absolute bottom-0 inset-x-0 w-full max-h-56 object-contain object-bottom z-10 opacity-85"
            />
          )}

          {assets.envelopeClosedImage && pos.envelopeClosedImage === 'full-frame' && (
            <img
              src={assets.envelopeClosedImage}
              alt=""
              className="pointer-events-none absolute inset-0 w-full h-full object-contain z-10 opacity-90"
            />
          )}

          {assets.bottomPillarImage &&
            (pos.bottomPillarImage === 'bottom-corners' ||
              pos.bottomPillarImage === 'bottom-left') && (
              <img
                src={assets.bottomPillarImage}
                alt=""
                className={`pointer-events-none absolute -bottom-4 -left-6 w-32 z-10 opacity-85 ${swayClass}`}
              />
            )}

          {assets.bottomPillarImage &&
            (pos.bottomPillarImage === 'bottom-corners' ||
              pos.bottomPillarImage === 'bottom-right') && (
              <img
                src={assets.bottomPillarImage}
                alt=""
                className={`pointer-events-none absolute -bottom-4 -right-6 w-32 z-10 opacity-85 -scale-x-100 ${swayClass}`}
              />
            )}

          {/* Header Title on Cover */}
          <div className="relative z-20 flex flex-col items-center mt-2 cover-stagger space-y-2">
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
            <div className="relative z-20 my-auto py-2 flex flex-col items-center cover-stagger">
              <button
                type="button"
                onClick={d.openInvitation}
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
            <div className="relative z-20 my-auto py-3 cover-stagger">
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
          <div className="relative z-20 w-full max-w-[330px] flex flex-col items-center space-y-3 cover-stagger">
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
              onClick={d.openInvitation}
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
        </section>

        {/* ============================================================ */}
        {/* MAIN INVITATION BODY SECTIONS                                */}
        {/* ============================================================ */}
        <div className="relative z-10 pb-28">
          {/* SECTION 1: HERO PORTRAIT / OPENING GREETING */}
          <section className="relative px-6 pt-14 pb-12 text-center space-y-6">
            {assets.cornerTopLeftImage &&
              (pos.cornerTopLeftImage === 'top-both' ||
                pos.cornerTopLeftImage === 'top-left-only') && (
                <img
                  src={assets.cornerTopLeftImage}
                  alt=""
                  className={`pointer-events-none absolute -top-4 -left-6 w-32 opacity-80 ${swayClass}`}
                />
              )}

            {assets.cornerTopLeftImage &&
              (pos.cornerTopLeftImage === 'top-corners' ||
                pos.cornerTopLeftImage === 'top-both' ||
                pos.cornerTopLeftImage === 'top-right-only') && (
                <img
                  src={assets.cornerTopLeftImage}
                  alt=""
                  className={`pointer-events-none absolute -top-4 -right-6 w-32 opacity-80 -scale-x-100 ${swayClass}`}
                />
              )}

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

            <Reveal
              variant={revealPrimary}
              duration={revealDuration}
              delay={180}
              className="max-w-xs mx-auto space-y-4 pt-2"
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
                  className="text-[12.5px] italic leading-relaxed px-3 py-3 rounded-2xl border"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    borderColor: `${colors.accent}45`,
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
            style={{ backgroundColor: colors.bgSecondary }}
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
                    className="rounded-2xl py-3 px-1 border shadow-xs"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: `${colors.accent}45`,
                    }}
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
              className="rounded-3xl p-6 border space-y-3 shadow-sm max-w-sm mx-auto"
              style={{
                backgroundColor: colors.bgSecondary,
                borderColor: `${colors.accent}45`,
              }}
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
                  className="rounded-3xl p-6 border space-y-3 shadow-sm max-w-sm mx-auto"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    borderColor: `${colors.accent}45`,
                  }}
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
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold border cursor-pointer"
                  style={{
                    borderColor: `${colors.accent}70`,
                    color: colors.textPrimary,
                  }}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Tampilkan Kartu QR Tamu</span>
                </button>
              </div>
            )}
          </section>

          {/* SECTION 4: PREWEDDING VIDEO (OPTIONAL) */}
          {(d.preweddingVideoUrl || youtubeEmbed) && (
            <section
              className="px-6 py-12 space-y-5 text-center"
              style={{ backgroundColor: colors.bgSecondary }}
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
          {d.loveStories && d.loveStories.length > 0 && (
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
                    className="rounded-2xl p-5 border space-y-1.5"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: `${colors.accent}40`,
                    }}
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
          {d.gallery && d.gallery.length > 0 && (
            <section
              className="px-6 py-12 space-y-6"
              style={{ backgroundColor: colors.bgSecondary }}
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

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {d.gallery.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => d.openLightbox(idx)}
                    className={`group overflow-hidden rounded-2xl border shadow-sm cursor-pointer ${
                      idx % 3 === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/5]'
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
              style={{ backgroundColor: colors.bgSecondary }}
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
                    className="rounded-2xl p-4 border flex items-center justify-between gap-3"
                    style={{
                      backgroundColor: colors.bgPrimary,
                      borderColor: `${colors.accent}45`,
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
                      {d.copiedBankIdx === idx ? (
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
                    className="rounded-2xl p-4 border space-y-2 text-center"
                    style={{
                      backgroundColor: colors.bgPrimary,
                      borderColor: `${colors.accent}45`,
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
            </Reveal>

            <form
              onSubmit={d.rsvp.send}
              className="max-w-sm mx-auto rounded-3xl p-5 border space-y-3.5"
              style={{
                backgroundColor: colors.bgSecondary,
                borderColor: `${colors.accent}45`,
              }}
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
                    className="rounded-2xl p-3.5 border space-y-1"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: `${colors.accent}35`,
                    }}
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

          {/* SECTION 10: CLOSING */}
          <section
            className="relative px-6 py-16 text-center space-y-4 overflow-hidden"
            style={{ backgroundColor: colors.bgSecondary }}
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

        {/* Floating Music & Controls */}
        <audio ref={d.audioRef} src={d.musicUrl} loop preload="auto" />

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
