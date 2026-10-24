import { useEffect } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * useScrollMotion
 * Memberi efek muncul (fade + naik) secara berurutan pada isi setiap <section>
 * saat di-scroll, tanpa perlu membungkus elemen satu per satu.
 * - Anak langsung <section> akan di-reveal.
 * - Jika anak berupa grid (class "grid"), item di dalamnya muncul bergantian (stagger).
 * Kelas efek dilepas setelah selesai agar hover/transition bawaan elemen tidak terganggu.
 */
export const useScrollMotion = (rootRef, enabled = true) => {
  // Kunci scroll halaman saat cover undangan masih aktif (!enabled)
  useEffect(() => {
    if (!enabled) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const root = rootRef?.current;
      if (root) {
        root.style.maxHeight = "100vh";
        root.style.overflow = "hidden";
      }

      const preventWheel = (e) => {
        // Cegah wheel scroll menembus cover
        e.preventDefault();
      };

      window.addEventListener("wheel", preventWheel, { passive: false });

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        window.removeEventListener("wheel", preventWheel);
        if (root) {
          root.style.maxHeight = "";
          root.style.overflow = "";
        }
      };
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      const root = rootRef?.current;
      if (root) {
        root.style.maxHeight = "";
        root.style.overflow = "";
      }
    }
  }, [rootRef, enabled]);

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root || prefersReducedMotion()) return undefined;

    const targets = [];
    root.querySelectorAll('section').forEach((section) => {
      Array.from(section.children).forEach((child, i) => {
        const tag = child.tagName.toLowerCase();
        if (
          tag === 'svg' ||
          tag === 'style' ||
          getComputedStyle(child).position === 'absolute' ||
          child.classList.contains('reveal') ||
          child.querySelector('.reveal')
        ) {
          return;
        }
        if (child.classList.contains('grid') && child.children.length > 1) {
          Array.from(child.children).forEach((item, j) => {
            if (!item.classList.contains('reveal') && !item.querySelector('.reveal')) {
              targets.push([item, Math.min(j, 8) * 90]);
            }
          });
        } else {
          targets.push([child, Math.min(i, 3) * 80]);
        }
      });
    });

    const timers = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('reveal-in');
          io.unobserve(el);
          timers.push(
            setTimeout(() => {
              el.classList.remove('reveal', 'reveal-in');
              el.style.transitionDelay = '';
            }, 1900)
          );
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach(([el, delay]) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${delay}ms`;
      io.observe(el);
    });

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      targets.forEach(([el]) => {
        el.classList.remove('reveal', 'reveal-in');
        el.style.transitionDelay = '';
      });
    };
  }, [rootRef, enabled]);
};

/**
 * useParallax
 * Elemen dengan atribut data-parallax bergeser pelan berlawanan arah scroll.
 * Gunakan pada <img> di dalam wadah overflow-hidden, beri class scale-110 agar tidak ada celah.
 */
export const useParallax = (rootRef, enabled = true, strength = 0.14) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root || prefersReducedMotion()) return undefined;
    const els = Array.from(root.querySelectorAll('[data-parallax]'));
    if (!els.length) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      els.forEach((el) => {
        const rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -strength;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      els.forEach((el) => {
        el.style.translate = '';
      });
    };
  }, [rootRef, enabled, strength]);
};
