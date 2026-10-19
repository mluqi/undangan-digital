import React, { useEffect, useMemo, useRef, useState } from 'react';

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Garis kemajuan scroll tipis di bagian atas undangan. */
export const ScrollProgress = ({ color = '#C9A24B', active = true }) => {
  const barRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[3px] z-[60] pointer-events-none">
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{ background: color, transform: 'scaleX(0)', transition: 'transform 0.1s linear' }}
      />
    </div>
  );
};

/** Hujan partikel singkat (konfeti) saat undangan dibuka. */
export const Burst = ({ colors = ['#C9A24B', '#E3C987', '#F3E7CF'], count = 28, shape = 'confetti' }) => {
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setAlive(false), 3600);
    return () => clearTimeout(t);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * (0.15 + 0.7 * Math.random())) ; // menyebar ke atas
        const dist = 140 + Math.random() * 220;
        return {
          id: i,
          x: Math.cos(angle) * dist * (Math.random() > 0.5 ? 1 : -1),
          y: -Math.sin(angle) * dist,
          rot: Math.round(Math.random() * 720 - 360),
          delay: Math.round(Math.random() * 180),
          size: 6 + Math.round(Math.random() * 6),
          color: colors[i % colors.length],
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!alive || reduced()) return null;
  return (
    <div className="fixed left-1/2 bottom-[38%] z-[55] pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="burst-particle absolute block"
          style={{
            '--x': `${p.x}px`,
            '--y': `${p.y}px`,
            '--r': `${p.rot}deg`,
            width: p.size,
            height: shape === 'heart' ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: shape === 'heart' ? '50%' : '1px',
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
};
