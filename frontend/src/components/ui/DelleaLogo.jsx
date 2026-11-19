import React from 'react';

/**
 * DELLEA.INVITE OFFICIAL BRAND LOGO SYSTEM
 * Based on the official Dellea brand identity:
 * - Arched Double-Line Envelope Crest with 'D | L' monogram, central ribbon loop & 5-leaf botanical sprig
 * - Flowing script 'dellea' wordmark with 'ETERNAL ☾ MEMORIES' & 'DIGITAL & PAPER INVITATIONS'
 * - Secondary Organic Botanical Wreath & Star Seal
 * - Brand Palette:
 *   Champagne Sand: #E6D2BE, #D8BFA6, #C9A98B, #E0D6B8
 *   Deep Burgundy / Oxblood: #4A1515, #3B1010, #2B0C0C, #633A2C
 */
export const DelleaLogo = ({
  variant = 'horizontal', // 'horizontal' | 'stacked' | 'mark' | 'wordmark' | 'wreath'
  theme = 'dark', // 'dark' (burgundy ink on champagne bg) | 'light' (champagne ink on burgundy bg) | 'gold'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showTagline = true,
  subtitle = 'ETERNAL ☾ MEMORIES',
  className = '',
}) => {
  const palette = {
    dark: {
      stroke: '#3B1010',
      leafFill: '#E6D2BE',
      wordMain: 'text-[#3B1010]',
      wordSuffix: 'text-[#633A2C]',
      tagline: 'text-[#4A1515]',
      subTagline: 'text-[#633A2C]',
      moonFill: '#4A1515',
    },
    light: {
      stroke: '#E6D2BE',
      leafFill: '#3B1010',
      wordMain: 'text-[#E6D2BE]',
      wordSuffix: 'text-[#C9A98B]',
      tagline: 'text-[#D8BFA6]',
      subTagline: 'text-[#C9A98B]',
      moonFill: '#E6D2BE',
    },
    gold: {
      stroke: '#C9A98B',
      leafFill: '#2B0C0C',
      wordMain: 'text-[#D8BFA6]',
      wordSuffix: 'text-[#B8842C]',
      tagline: 'text-[#C9A98B]',
      subTagline: 'text-[#B8842C]',
      moonFill: '#D8BFA6',
    },
  }[theme] || {
    stroke: '#3B1010',
    leafFill: '#E6D2BE',
    wordMain: 'text-[#3B1010]',
    wordSuffix: 'text-[#633A2C]',
    tagline: 'text-[#4A1515]',
    subTagline: 'text-[#633A2C]',
    moonFill: '#4A1515',
  };

  const sizeMap = {
    sm: {
      mark: 'w-9 h-9',
      stackedMark: 'w-14 h-14',
      word: 'text-2xl',
      suffix: 'text-sm',
      stackedWord: 'text-4xl',
      tagline: 'text-[8px] tracking-[0.28em]',
      gap: 'gap-2.5',
    },
    md: {
      mark: 'w-11 h-11',
      stackedMark: 'w-16 h-16',
      word: 'text-3xl sm:text-[32px]',
      suffix: 'text-base',
      stackedWord: 'text-5xl',
      tagline: 'text-[9px] tracking-[0.32em]',
      gap: 'gap-3',
    },
    lg: {
      mark: 'w-14 h-14',
      stackedMark: 'w-20 h-20',
      word: 'text-4xl sm:text-[42px]',
      suffix: 'text-lg',
      stackedWord: 'text-6xl',
      tagline: 'text-[10px] tracking-[0.34em]',
      gap: 'gap-3.5',
    },
    xl: {
      mark: 'w-20 h-20',
      stackedMark: 'w-24 h-24',
      word: 'text-5xl sm:text-6xl',
      suffix: 'text-xl',
      stackedWord: 'text-7xl',
      tagline: 'text-[11px] tracking-[0.36em]',
      gap: 'gap-4',
    },
  }[size] || {
    mark: 'w-11 h-11',
    stackedMark: 'w-16 h-16',
    word: 'text-3xl sm:text-[32px]',
    suffix: 'text-base',
    stackedWord: 'text-5xl',
    tagline: 'text-[9px] tracking-[0.32em]',
    gap: 'gap-3',
  };

  /**
   * Primary Official Mark: Arched Double-Line Envelope with D | L & Botanical 5-Leaf Branch
   */
  const renderEnvelopeCrestSvg = (svgClass) => (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgClass} shrink-0 select-none`}
      aria-hidden="true"
    >
      <g
        stroke={palette.stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer Arch Frame (open at top-right for botanical branch) */}
        <path d="M99 48 V107 H17 V56 A41 41 0 0 1 65 15.4" />
        {/* Inner Arch Frame */}
        <path d="M94.5 45 V102.5 H21.5 V56 A36.5 36.5 0 0 1 64.5 19.8" />

        {/* Botanical 5-Leaf Branch curving up from right inner arch */}
        <g className="dellea-leaf-sway">
          <path d="M94.5 45 C92 33 84 23 70 13" />
          {/* Leaf 1 (Top Tip) */}
          <path
            d="M70 13 C74 12.5 79.5 15.5 81 21 C75.5 21 71.5 17.5 70 13 Z"
            fill={palette.leafFill}
          />
          <path d="M73 15.5 L78 19" strokeWidth="1.3" />
          {/* Leaf 2 (Upper Left) */}
          <path
            d="M84 25.5 C78.5 23.5 72.5 24.5 69.5 27.5 C73.5 30.5 79.5 30 84 25.5 Z"
            fill={palette.leafFill}
          />
          <path d="M73.5 27.2 L81 26.2" strokeWidth="1.3" />
          {/* Leaf 3 (Upper Right) */}
          <path
            d="M85.5 26 C84 19.5 85.5 14 88 11.5 C91 15 91.5 21.5 85.5 26 Z"
            fill={palette.leafFill}
          />
          <path d="M87.5 15.5 L86.2 23" strokeWidth="1.3" />
          {/* Leaf 4 (Lower Left) */}
          <path
            d="M91 36.5 C85.5 33.5 79.5 33.5 76.5 36 C80 39.5 86 40 91 36.5 Z"
            fill={palette.leafFill}
          />
          <path d="M80.5 36.3 L88 36.5" strokeWidth="1.3" />
          {/* Leaf 5 (Lower Right) */}
          <path
            d="M92.8 39 C92.5 32.5 94.8 27 97.5 24 C100 28.5 99 35 92.8 39 Z"
            fill={palette.leafFill}
          />
          <path d="M96.2 28.5 L94 35.5" strokeWidth="1.3" />
        </g>

        {/* Geometric Open Envelope */}
        <path d="M29 56 L58 31 L87 56 V94 H29 V56 Z" />
        {/* Envelope Bottom Flap & Center Diamond */}
        <path d="M29 94 L58 68 L87 94" />
        <path d="M29 56 L58 80 L87 56" />
        <path d="M58 68 V80" />

        {/* Top Flap Inner Chevron Lines */}
        <path d="M47 40.5 L58 50 L69 40.5" />
        <path d="M43 44 L58 57 L73 44" />

        {/* Central Ribbon Loop / Knot & Side Panels */}
        <path d="M39.5 47 L58 63 L76.5 47" />
        <path d="M58 63 C55.8 66 55.8 70 58 70 C60.2 70 60.2 66 58 63 Z" />
        <path d="M34.5 51.5 V60.5" />
        <path d="M81.5 51.5 V60.5" />
        <path d="M50 56 V66 L44.5 71" />
        <path d="M66 56 V66 L71.5 71" />

        {/* Monogram 'D' (Left Wing) & 'L' (Right Wing) */}
        <path d="M39 54.5 H42.8 C45.8 54.5 47.5 56.6 47.5 59.8 C47.5 63 45.8 65 42.8 65 H39 V54.5 Z" />
        <path d="M70.5 54.5 V65 H77" />
      </g>
    </svg>
  );

  /**
   * Secondary Official Mark: Organic Oval Botanical Wreath + Star Seal (from cover 2)
   */
  const renderBotanicalWreathSvg = (svgClass) => (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgClass} shrink-0 select-none`}
      aria-hidden="true"
    >
      {/* Top & Bottom Dots */}
      <circle cx="60" cy="10" r="3" fill={palette.stroke} />
      <circle cx="60" cy="130" r="3" fill={palette.stroke} />
      {/* Organic Wax-Seal Oval Frame */}
      <path
        d="M60 20 C86 20 96 42 96 72 C96 102 84 118 60 118 C36 118 24 102 24 72 C24 42 34 20 60 20 Z"
        stroke={palette.stroke}
        strokeWidth="3.2"
      />
      {/* 8-Point Star at Top Center */}
      <path
        d="M60 32 L62.2 39.8 L70 42 L62.2 44.2 L60 52 L57.8 44.2 L50 42 L57.8 39.8 Z"
        fill={palette.stroke}
      />
      {/* Left & Right Crossed Botanical Branches */}
      <g stroke={palette.stroke} strokeWidth="1.6" strokeLinecap="round">
        <path d="M68 104 C50 94 40 74 44 48" />
        <path d="M52 104 C70 94 80 74 76 48" />
        <ellipse cx="40" cy="60" rx="3" ry="6" transform="rotate(-30 40 60)" />
        <ellipse cx="48" cy="64" rx="3" ry="6" transform="rotate(25 48 64)" />
        <ellipse cx="42" cy="76" rx="3" ry="6" transform="rotate(-35 42 76)" />
        <ellipse cx="51" cy="80" rx="3" ry="6" transform="rotate(20 51 80)" />
        <ellipse cx="80" cy="60" rx="3" ry="6" transform="rotate(30 80 60)" />
        <ellipse cx="72" cy="64" rx="3" ry="6" transform="rotate(-25 72 64)" />
        <ellipse cx="78" cy="76" rx="3" ry="6" transform="rotate(35 78 76)" />
        <ellipse cx="69" cy="80" rx="3" ry="6" transform="rotate(-20 69 80)" />
      </g>
    </svg>
  );

  // 1. MARK ONLY (Arched D|L Envelope Crest)
  if (variant === 'mark' || variant === 'monogram') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEnvelopeCrestSvg(sizeMap.mark)}
      </div>
    );
  }

  // 2. WREATH SEAL ONLY (Secondary Botanical Wreath Mark)
  if (variant === 'wreath') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderBotanicalWreathSvg(sizeMap.mark)}
      </div>
    );
  }

  // 3. WORDMARK ONLY
  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <span
          className={`${sizeMap.word} font-normal uppercase tracking-[0.08em] leading-none ${palette.wordMain}`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          SAMSKARA
        </span>
        {showTagline && (
          <div
            className={`flex items-center gap-3 mt-1.5 ${sizeMap.tagline} uppercase font-semibold ${palette.tagline}`}
          >
            <span>ETERNAL</span>
            <span className="text-[11px] leading-none">☾</span>
            <span>MEMORIES</span>
          </div>
        )}
      </div>
    );
  }

  // 4. STACKED FULL LOCKUP (Matching Official SAMSKARA Logo: Crest Top -> SAMSKARA -> ETERNAL ☾ MEMORIES)
  if (variant === 'stacked') {
    return (
      <div
        className={`inline-flex flex-col items-center text-center ${className}`}
      >
        {renderEnvelopeCrestSvg(sizeMap.stackedMark)}
        <span
          className={`${sizeMap.stackedWord} font-normal uppercase tracking-[0.08em] leading-none mt-3 ${palette.wordMain}`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          SAMSKARA
        </span>
        {showTagline && (
          <div
            className={`flex items-center justify-center gap-4 mt-2.5 ${sizeMap.tagline} uppercase font-semibold ${palette.tagline}`}
          >
            <span>ETERNAL</span>
            <span className="text-xs leading-none">☾</span>
            <span>MEMORIES</span>
          </div>
        )}
      </div>
    );
  }

  // 5. HORIZONTAL LOCKUP (Default for Navbar / Sidebar)
  return (
    <div className={`inline-flex items-center ${sizeMap.gap} ${className}`}>
      {renderEnvelopeCrestSvg(sizeMap.mark)}
      <div className="flex flex-col text-left">
        <span
          className={`${sizeMap.word} font-normal uppercase tracking-[0.08em] leading-none ${palette.wordMain}`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          SAMSKARA
        </span>
        {showTagline && (
          <span
            className={`${sizeMap.tagline} uppercase font-semibold ${palette.tagline} mt-1`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export const SamskaraLogo = DelleaLogo;
