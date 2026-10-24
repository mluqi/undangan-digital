import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal: Komponen animasi kemunculan elemen saat di-scroll dengan berbagai varian kreatif:
 * - 'fade-up' (default): naik lembut dari bawah
 * - 'fade-down': turun halus dari atas
 * - 'fade-left': meluncur lembut dari kanan
 * - 'fade-right': meluncur lembut dari kiri
 * - 'zoom-in': membesar proporsional dengan soft bloom
 * - 'zoom-out': mengecil anggun ke ukuran normal
 * - 'blur-in': merekah dari kabut lembut menjadi jernih
 * - 'rotate-in': rotasi anggun dedaunan botanis
 * - 'flip-up': efek 3D tilt kartu mewah
 */
export const Reveal = ({
  children,
  className = '',
  delay = 0,
  duration = 1000,
  variant = 'fade-up',
  threshold = 0.12,
  as: Tag = 'div',
  style = {},
  ...rest
}) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const variantClass = variant ? `reveal-${variant}` : 'reveal-fade-up';

  return (
    <Tag
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        ...style,
      }}
      className={`reveal ${variantClass} ${shown ? 'reveal-in' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};
