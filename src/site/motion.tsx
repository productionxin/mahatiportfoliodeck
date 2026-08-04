/**
 * Motion helpers.
 *
 * Everything here degrades to nothing when the visitor has asked for reduced
 * motion — the hook is the single gate, so no component has to remember.
 */
import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Fades each route in on arrival. Keyed on pathname so a navigation restarts
 * it; without the key the browser keeps the finished animation and pages after
 * the first would appear with no transition at all.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const reduced = usePrefersReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <div key={path} className="route-enter">
      {children}
    </div>
  );
}

/** Scroll-linked progress bar, pinned under the header. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : Math.min(1, window.scrollY / max);
      el.style.transform = `scaleX(${pct})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
      style={{ background: "transparent" }}
    >
      <div
        ref={ref}
        className="h-full origin-left"
        style={{ background: "var(--color-rust)", transform: "scaleX(0)" }}
      />
    </div>
  );
}

/**
 * Drifts a hero image slowly against the scroll. Kept small — a few percent of
 * travel reads as depth; more reads as a gimmick and costs sharpness.
 */
export function useParallax<T extends HTMLElement>(strength = 0.12) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      el.style.transform = `translate3d(0, ${y * strength}px, 0) scale(1.06)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, strength]);
  return ref;
}

/**
 * Adds `in` to an element the first time it enters view, and never removes
 * it. This is the switch behind every CSS move in the vocabulary — `lift`,
 * `plate`, `rule-draw` all sit inert until it fires — which keeps the
 * animation in the stylesheet and only the timing in React.
 *
 * Under reduced motion the class goes on immediately, so the element is in
 * its final state before the first paint rather than waiting on a scroll.
 */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // An element the visitor has already scrolled past — a restored
        // scroll position, a fragment link, a fast flick before the first
        // callback lands — reports isIntersecting false and would then never
        // report again, leaving it invisible for the rest of the session.
        // Treat "above the fold line" as arrived.
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, threshold]);
  return ref;
}

/**
 * Cycles the hero frames. Holds on the first frame under reduced motion,
 * and pauses entirely while the tab is hidden so a backgrounded page is not
 * quietly decoding photographs.
 */
export function useSlideshow(count: number, holdMs = 6400) {
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced || count < 2) return;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!document.hidden) setI((n) => (n + 1) % count);
        schedule();
      }, holdMs);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [count, holdMs, reduced]);
  return [i, setI] as const;
}

/**
 * Tracks the pointer inside a container and reports where it is, so a hover
 * preview can follow it. Returns null while the pointer is outside, and stays
 * null on touch and under reduced motion — the preview is an enhancement over
 * a list that already works without it.
 */
export function usePointerPreview<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    let frame = 0;
    // mousemove rather than pointermove: pointer events are not emitted by
    // every synthetic-input path, and the pointer:fine gate above already
    // does the job pointermove would have been used for.
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      });
    };
    const onLeave = () => setPos(null);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);
  return { ref, pos };
}

/**
 * Normalised scroll depth through the first viewport, 0 → 1. Drives the hero
 * title's departure: it should leave with the photograph rather than sit
 * pinned while the page moves underneath it.
 */
export function useHeroScroll() {
  const [t, setT] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setT(Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.72)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);
  return t;
}

/** Horizontal swipe detection for the lightbox on touch devices. */
export function useSwipe(onLeft: () => void, onRight: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      // Ignore mostly-vertical drags so scrolling still works.
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onLeft();
      else onRight();
    },
  };
}

/** True once the visitor has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}
