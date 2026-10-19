import React from 'react';

export const FallingPetals = ({ count = 12 }) => {
  // Pre-generate deterministic petal offsets
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 8.3 + 3) % 100}%`,
    animationDelay: `${(i * 0.75) % 6}s`,
    animationDuration: `${7 + (i % 4) * 1.5}s`,
    size: 14 + (i % 3) * 6,
    rotate: (i * 35) % 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-petal"
          style={{
            left: p.left,
            top: '-30px',
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        >
          {/* Petal SVG */}
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: `rotate(${p.rotate}deg)` }}
          >
            <path
              d="M12 2C8 6 4 11 6 16C8 21 16 21 18 16C20 11 16 6 12 2Z"
              fill="rgba(244, 114, 182, 0.35)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
