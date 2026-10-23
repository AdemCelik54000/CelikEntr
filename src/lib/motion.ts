import { useEffect, useRef, useState, type CSSProperties } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Adds `is-visible` to every `[data-reveal]` element once it scrolls into view. Watches the DOM so
 * elements rendered later (photos arriving from the manifest) are picked up too.
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const showAll = () =>
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => node.classList.add('is-visible'));

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      showAll();
      const mutations = new MutationObserver(showAll);
      mutations.observe(document.body, { childList: true, subtree: true });
      return () => mutations.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    const watched = new WeakSet<Element>();
    const observeNew = () =>
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((node) => {
        if (!watched.has(node)) {
          watched.add(node);
          observer.observe(node);
        }
      });

    observeNew();
    const mutations = new MutationObserver(observeNew);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);
};

/** Stagger delay for the n-th item of a revealed group. */
export const stagger = (index: number, step = 80, base = 0) =>
  ({ '--reveal-delay': `${base + index * step}ms` }) as CSSProperties;

/** Writes the page scroll offset to `--scroll` on the element, for parallax in CSS. */
export const useParallax = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) {
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = Math.min(window.scrollY, window.innerHeight * 1.2);
      node.style.setProperty('--scroll', `${offset}`);
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
};

/** Counts from 0 to `target` the first time the element enters the viewport. */
export const useCountUp = (target: number, duration = 1600) => {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setValue(target);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * progress);
          setValue(Math.round(target * (progress === 1 ? 1 : eased)));
          if (progress < 1) {
            frame = requestAnimationFrame(tick);
          }
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return { ref, value };
};
