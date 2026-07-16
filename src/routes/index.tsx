import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import coverHero from "@/assets/cover_hero.jpg";
import stage2Full from "@/assets/stage2_fullbody_tight.jpg";
import principalRoles from "@/assets/principal_roles_group_tight.jpg";
import contemporaryPortrait from "@/assets/contemporary_portrait_tight.jpg";
import childhoodArchival from "@/assets/childhood_archival.jpg";
import handDetail from "@/assets/hand_detail.jpg";
import eyesDetail from "@/assets/eyes_detail.jpg";
import jewelryDetail from "@/assets/jewelry_detail.jpg";

export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    meta: [
      { property: "og:image", content: coverHero },
      { name: "twitter:image", content: coverHero },
    ],
  }),
});

/* --------------------------------- hooks --------------------------------- */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/**
 * Drives a 3D coverflow / arc carousel: a continuous floating "focus index"
 * that follows the cursor's horizontal position across the track — no click
 * or drag required, just move the mouse over it, the way the reference
 * (Framer-style) carousels behave. Wheel-scroll and touch-drag are kept as
 * fallbacks for trackpads and touch devices. The target is eased toward
 * every frame (rAF lerp) so motion feels springy, not jump-cut. Rests
 * centered on the middle card when nothing is hovering it.
 */
function useArcCarousel(count: number) {
  const restValue = (count - 1) / 2;
  const target = useRef(restValue);
  const current = useRef(restValue);
  const [value, setValue] = useState(restValue);
  const raf = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const dragStart = useRef({ x: 0, target: 0 });
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const ease = reduceMotionRef.current ? 1 : 0.09;
      current.current += (target.current - current.current) * ease;
      if (Math.abs(current.current - target.current) < 0.001) current.current = target.current;
      setValue(current.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const clamp = (v: number) => Math.max(0, Math.min(count - 1, v));

  // Primary interaction: cursor position across the track maps directly to
  // focus index — moving the mouse left-to-right fans the cards, no drag.
  const onPointerMoveHover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) return; // touch-drag takes over below
    hoveringRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    target.current = clamp(rel * (count - 1));
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    hoveringRef.current = false;
    draggingRef.current = false;
    // Touch fires a "leave" the moment a finger lifts — that's a release,
    // not the cursor wandering off, so keep whatever position the drag
    // ended at instead of snapping back to center.
    if (e.pointerType === "touch") return;
    target.current = restValue; // mouse actually left — settle to a centered fan
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    target.current = clamp(target.current + e.deltaY * 0.0028);
    e.preventDefault();
  };

  // Touch fallback: pointer devices without hover (fine pointer) drag instead.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    draggingRef.current = true;
    movedRef.current = false;
    dragStart.current = { x: e.clientX, target: target.current };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMoveDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 4) movedRef.current = true;
    target.current = clamp(dragStart.current.target - dx / 150);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };
  const goTo = (i: number) => {
    target.current = clamp(i);
  };

  return {
    value,
    onWheel,
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMoveHover(e);
      onPointerMoveDrag(e);
    },
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    goTo,
    movedRef,
  };
}

function useActiveStage(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* -------------------------------- primitives ------------------------------ */

function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal<HTMLElement>();
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref as never}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}

function WatchMarker({
  href,
  label,
  size = 88,
}: {
  href: string;
  label: string;
  size?: number;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="group inline-flex items-center gap-4"
      aria-label={label}
      data-cursor="Watch"
    >
      <span
        className="relative grid place-items-center rounded-full border transition-transform duration-500 group-hover:scale-105"
        style={{
          width: size,
          height: size,
          borderColor: "var(--color-gold-500)",
          borderWidth: 1,
        }}
      >
        <span
          className="block"
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 5}px solid var(--color-emerald-600)`,
            borderTop: `${size / 7}px solid transparent`,
            borderBottom: `${size / 7}px solid transparent`,
            marginLeft: 6,
          }}
          aria-hidden
        />
      </span>
      <span className="eyebrow" style={{ color: "var(--color-gold-500)" }}>
        {label}
      </span>
    </a>
  );
}

function GoldRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{ height: 1, background: "var(--color-gold-500)" }}
    />
  );
}

/**
 * Custom cursor for pointer:fine devices — a small ring that follows the
 * mouse with spring easing and picks up a label from the nearest ancestor's
 * `data-cursor` attribute. Only ever rendered over deliberately interactive
 * areas (carousels, watch markers) — not applied globally.
 */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduceMotion) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (el) {
        setLabel(el.getAttribute("data-cursor"));
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] grid place-items-center rounded-full"
      style={{
        width: 76,
        height: 76,
        border: "1px solid var(--color-gold-500)",
        background: "rgba(21,19,15,0.55)",
        backdropFilter: "blur(2px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 220ms ease",
      }}
    >
      <span
        className="eyebrow"
        style={{ color: "var(--color-on-ink)", fontSize: 10 }}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * A 3D coverflow / arc carousel track: cards fan out in a shallow perspective
 * arc around a continuous focus value, receding in depth and opacity as they
 * move off-center. Drag or wheel-scroll to move through it.
 */
function ArcTrack<T>({
  items,
  cardWidth,
  cardHeight,
  spacing,
  renderCard,
  onSelect,
  height,
  cursorLabel = "Move",
}: {
  items: T[];
  cardWidth: number;
  cardHeight: number;
  spacing: number;
  renderCard: (item: T, index: number, focused: boolean) => React.ReactNode;
  onSelect?: (index: number) => void;
  height: number;
  cursorLabel?: string;
}) {
  const { value, onWheel, onPointerDown, onPointerMove, onPointerUp, onPointerLeave, movedRef } =
    useArcCarousel(items.length);

  return (
    <div
      className="relative w-full touch-pan-y select-none"
      style={{ height, perspective: 1600 }}
      data-cursor={cursorLabel}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, i) => {
          const o = i - value;
          const focused = Math.abs(o) < 0.5;
          const angle = Math.max(-58, Math.min(58, o * 16));
          const tx = o * spacing;
          const tz = -Math.min(Math.abs(o), 4) * 130;
          const scale = Math.max(0.72, 1 - Math.abs(o) * 0.14);
          const opacity = Math.max(0.22, 1 - Math.abs(o) * 0.32);
          return (
            <div
              key={i}
              data-cursor={focused ? "View" : undefined}
              onClick={() => {
                if (focused && !movedRef.current) onSelect?.(i);
              }}
              className="absolute"
              style={{
                width: cardWidth,
                height: cardHeight,
                transform: `translate3d(${tx}px, 0, ${tz}px) rotateY(${angle}deg) scale(${scale})`,
                opacity,
                zIndex: 1000 - Math.round(Math.abs(o) * 10),
                transition: "box-shadow 400ms ease",
                cursor: focused ? "pointer" : "default",
              }}
            >
              {renderCard(item, i, focused)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StageOpener({
  numeral,
  title,
  eyebrow,
  image,
  alt,
  tone = "ink",
}: {
  numeral: string;
  title: string;
  eyebrow: string;
  image: string;
  alt: string;
  tone?: "ink" | "cinema";
}) {
  const bg = tone === "cinema" ? "var(--color-ink-800)" : "var(--color-ink-900)";
  return (
    <div style={{ background: bg, color: "var(--color-on-ink)" }}>
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-24 md:grid-cols-[1fr_1.1fr] md:items-end md:gap-16 md:py-32">
        <Reveal className="order-2 md:order-1">
          <div
            className="eyebrow"
            style={{ color: "var(--color-on-ink-dim)" }}
          >
            {eyebrow}
          </div>
          <div
            className="font-display mt-2 text-[10rem] leading-none md:text-[14rem]"
            style={{
              color: "var(--color-gold-400)",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            {numeral}
          </div>
          <h2
            className="font-display mt-2 text-4xl leading-[1.05] md:text-6xl"
            style={{ color: "var(--color-on-ink)", fontWeight: 500 }}
          >
            {title}
          </h2>
          <GoldRule className="mt-8 w-24" />
        </Reveal>
        <Reveal className="order-1 md:order-2" delay={120}>
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <img
              src={image}
              alt={alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* --------------------------------- page ---------------------------------- */

const STAGES = [
  { id: "stage-1", numeral: "I", label: "Lineage" },
  { id: "stage-2", numeral: "II", label: "Nritta & Abhinaya" },
  { id: "stage-3", numeral: "III", label: "Beyond Kuchipudi" },
  { id: "stage-4", numeral: "IV", label: "The Second Stage" },
  { id: "stage-5", numeral: "V", label: "Natyavedam" },
];

function Portfolio() {
  const activeStage = useActiveStage(STAGES.map((s) => s.id));

  return (
    <main
      style={{
        background: "var(--color-parchment-100)",
        color: "var(--color-on-parch)",
      }}
    >
      {/* Sticky stage indicator */}
      <StageIndicator activeId={activeStage} />
      <CustomCursor />

      {/* 1. HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src={coverHero}
          alt="Mahati Bhikshu in Kuchipudi costume — red silk blouse and gold-woven silk drape, mudra raised, temple garlands behind."
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "70% 30%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,19,15,0.35) 0%, rgba(21,19,15,0) 30%, rgba(21,19,15,0) 55%, rgba(21,19,15,0.85) 100%)",
          }}
        />
        <div className="absolute left-6 top-6 md:left-10 md:top-10">
          <span
            className="eyebrow"
            style={{ color: "var(--color-gold-400)" }}
          >
            Production X — Editorial Portfolio
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-14 md:pb-20">
          <div className="mx-auto max-w-[1400px]">
            <h1
              className="font-display leading-[0.95]"
              style={{
                color: "var(--color-on-ink)",
                fontSize: "clamp(3rem, 9vw, 7rem)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              Mahati
              <br />
              <span style={{ fontStyle: "italic", color: "var(--color-gold-400)" }}>
                Bhikshu
              </span>
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <GoldRule className="w-12" />
              <p
                className="eyebrow"
                style={{ color: "var(--color-on-ink)" }}
              >
                Kuchipudi Artist · Actor · Choreographer · Educator
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THESIS */}
      <section
        className="px-6 py-40 md:py-56"
        style={{ background: "var(--color-parchment-100)" }}
      >
        <Reveal className="mx-auto max-w-4xl text-center">
          <p
            className="eyebrow"
            style={{ color: "var(--color-on-parch-dim)" }}
          >
            Thesis
          </p>
          <blockquote
            className="font-display mt-10"
            style={{
              color: "var(--color-oxblood-600)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2.4rem, 6.5vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            “One life. Many stages.”
          </blockquote>
          <GoldRule className="mx-auto mt-12 w-16" />
          <p
            className="eyebrow mt-6"
            style={{ color: "var(--color-on-parch-dim)" }}
          >
            Mahati Bhikshu
          </p>
        </Reveal>
      </section>

      {/* 4. STAGE I — LINEAGE */}
      <section id="stage-1">
        <StageOpener
          numeral="I"
          title="Lineage"
          eyebrow="Stage One"
          image={stage2Full}
          alt="Mahati Bhikshu in a pink and gold silk Kuchipudi costume, mid-pose, against a temple-painted wall."
        />
        <div
          className="px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-900)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-12">
            <Reveal className="md:col-span-7 md:col-start-1">
              <p
                className="font-display text-2xl md:text-3xl"
                style={{ color: "var(--color-on-ink)", lineHeight: 1.35 }}
              >
                Daughter of <em>Dr. N.J. Bhikshu</em>, renowned theatre actor,
                and <em>Prof. Aruna Bhikshu</em>, Kuchipudi exponent and
                choreographer — she grew up inside the art form itself.
              </p>
              <p
                className="mt-8"
                style={{ color: "var(--color-on-ink-dim)", maxWidth: "56ch" }}
              >
                For more than twenty years, her mother has been her guru. The
                studio was the living room; the stage was inherited before it
                was chosen.
              </p>
            </Reveal>

            <Reveal className="md:col-span-4 md:col-start-9" delay={140}>
              <figure
                className="border p-3"
                style={{
                  borderColor: "var(--color-gold-500)",
                  background: "var(--color-ink-800)",
                }}
              >
                <div className="border border-black">
                  <img
                    src={childhoodArchival}
                    alt="Grainy archival photograph of Mahati Bhikshu at age eight in costume for Bala Narakasura."
                    loading="lazy"
                    className="block w-full"
                    style={{ filter: "sepia(0.15) contrast(1.05)" }}
                  />
                </div>
                <figcaption
                  className="mt-4 px-1"
                  style={{ color: "var(--color-on-ink-dim)" }}
                >
                  <span
                    className="eyebrow block"
                    style={{ color: "var(--color-gold-400)" }}
                  >
                    Archival Plate — c. First Appearance
                  </span>
                  <span className="mt-2 block font-display italic text-lg leading-snug">
                    Bala Narakasura, from the musical dance drama{" "}
                    <em>Narakasura Vadha</em> — her first stage appearance,
                    age eight.
                  </span>
                  <span className="mt-3 block text-sm">
                    That same year she played Bhakta Prahlada in{" "}
                    <em>Parikatha</em>, where <em>vachika abhinaya</em> — the
                    voice as gesture — was introduced to her.
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. STAGE II — NRITTA & ABHINAYA */}
      <section id="stage-2">
        <StageOpener
          numeral="II"
          title="Nritta & Abhinaya"
          eyebrow="Stage Two"
          image={coverHero}
          alt="Portrait of Mahati Bhikshu in traditional red and gold Kuchipudi costume."
        />

        {/* Full-bleed portrait with pull-quote overlay */}
        <div className="relative h-[92svh] min-h-[600px] w-full overflow-hidden">
          <img
            src={stage2Full}
            alt="Full body Kuchipudi stance in pink silk with gold border, arms raised, mid-tribhangi."
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 30%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(21,19,15,0.7) 0%, rgba(21,19,15,0.25) 45%, rgba(21,19,15,0) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center px-6 md:px-16">
            <Reveal className="max-w-2xl">
              <span
                className="eyebrow"
                style={{ color: "var(--color-gold-400)" }}
              >
                Pull-quote
              </span>
              <p
                className="font-display mt-6"
                style={{
                  color: "var(--color-on-ink)",
                  fontStyle: "italic",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  lineHeight: 1.05,
                }}
              >
                “Twenty years under one guru,{" "}
                <span style={{ color: "var(--color-gold-400)" }}>my mother.</span>”
              </p>
            </Reveal>
          </div>
        </div>

        {/* Titles & Recognition */}
        <div className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <span className="eyebrow" style={{ color: "var(--color-on-parch-dim)" }}>
                Titles & Recognition
              </span>
              <h3
                className="font-display mt-4"
                style={{
                  fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)",
                  lineHeight: 1.1,
                  fontWeight: 500,
                }}
              >
                A record of grades,
                <br />
                honours, and vidwat.
              </h3>
              <GoldRule className="mt-8 w-16" />
              <div className="mt-8 grid grid-cols-2 gap-3">
                <img
                  src={jewelryDetail}
                  alt="Detail of temple jewellery: kemp necklace with pearls and jhumka earring."
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <img
                  src={eyesDetail}
                  alt="Extreme close-up of kohl-lined eyes and bindi — abhinaya through the gaze."
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </Reveal>

            <div className="md:col-span-7">
              <Accordion
                items={[
                  {
                    title: "Doordarshan B-High Grade",
                    body: "Awarded by India's national broadcaster — an official grading of her classical practice.",
                  },
                  {
                    title: "Nritya Nipun",
                    body: "Conferred by the Atharva School of Fine Arts, Mumbai, for demonstrated mastery in nritta.",
                  },
                  {
                    title: "Natya Vikas",
                    body: "Recognition of sustained contribution to the growth and teaching of Kuchipudi.",
                  },
                  {
                    title: "Nrithya Pratibha Puraskar",
                    body: "A distinction for excellence in performance and interpretive depth.",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Detail Plate — contact sheet */}
        <div
          className="px-6 py-24 md:py-32"
          style={{ background: "var(--color-parchment-200)" }}
        >
          <div className="mx-auto max-w-[1200px]">
            <Reveal>
              <span className="eyebrow" style={{ color: "var(--color-on-parch-dim)" }}>
                Detail Plate
              </span>
            </Reveal>
            <div className="mt-8 grid grid-cols-12 gap-3 md:gap-5">
              <Reveal className="col-span-12 md:col-span-8 md:row-span-2">
                <img
                  src={eyesDetail}
                  alt="Close-up of eyes with dramatic kohl and bindi — the language of drishti."
                  loading="lazy"
                  className="block h-full w-full object-cover"
                  style={{ aspectRatio: "16/9" }}
                />
              </Reveal>
              <Reveal className="col-span-6 md:col-span-4" delay={120}>
                <img
                  src={jewelryDetail}
                  alt="Temple jewellery detail with kemp stones and pearl drops."
                  loading="lazy"
                  className="block h-full w-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                />
              </Reveal>
              <Reveal className="col-span-6 md:col-span-4" delay={200}>
                <img
                  src={handDetail}
                  alt="Hand held in a Kuchipudi mudra with red-tipped fingers and pearl bracelets."
                  loading="lazy"
                  className="block h-full w-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                />
              </Reveal>
            </div>
            <Reveal>
              <p
                className="eyebrow mt-6"
                style={{ color: "var(--color-on-parch-dim)" }}
              >
                Nritta. Abhinaya. In detail.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Across India — gallery */}
        <div
          className="px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-900)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-[1200px]">
            <Reveal>
              <span className="eyebrow" style={{ color: "var(--color-gold-400)" }}>
                Selected Performances
              </span>
              <h3
                className="font-display mt-4"
                style={{
                  color: "var(--color-on-ink)",
                  fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                }}
              >
                Across India.
              </h3>
              <GoldRule className="mt-8 w-16" />
            </Reveal>

            <Lightbox
              className="mt-12"
              items={[
                {
                  src: stage2Full,
                  title: "TSNA Kaleswaram Festival",
                  alt: "Solo Kuchipudi performance at the TSNA Kaleswaram Festival.",
                },
                {
                  src: coverHero,
                  title: "TSNA Dussehra Festival",
                  alt: "Performance at the TSNA Dussehra Festival.",
                },
                {
                  src: stage2Full,
                  title: "Tirupati Utsavalu",
                  alt: "Performance during Tirupati Utsavalu.",
                },
                {
                  src: coverHero,
                  title: "Sivaratri Brahmotsavalu, Sri Kalahasti",
                  alt: "Sivaratri Brahmotsavalu at Sri Kalahasti temple.",
                },
                {
                  src: stage2Full,
                  title: "Solo Recital — World Bank delegates at ASCI",
                  alt: "Solo recital for World Bank delegates at the Administrative Staff College of India.",
                },
              ]}
            />

            <Reveal className="mt-16 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <p
                className="font-display text-2xl italic"
                style={{ color: "var(--color-on-ink-dim)" }}
              >
                A moment on film.
              </p>
              {/* Placeholder anchor — to be wired to her Instagram reel later. */}
              <WatchMarker href="#" label="Click to watch" />
            </Reveal>
          </div>
        </div>

        {/* London. Toronto. Dubai. — quiet text moment */}
        <div className="px-6 py-32 md:py-48">
          <Reveal className="mx-auto max-w-3xl">
            <span className="eyebrow" style={{ color: "var(--color-on-parch-dim)" }}>
              Abroad
            </span>
            <h3
              className="font-display mt-6"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 4.6rem)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              London.
              <br />
              Toronto.
              <br />
              <span style={{ fontStyle: "italic", color: "var(--color-gold-500)" }}>
                Dubai.
              </span>
            </h3>
            <GoldRule className="mt-10 w-16" />
            <p className="mt-8" style={{ color: "var(--color-on-parch-dim)", maxWidth: "50ch" }}>
              Guest performances with <em>Nrityaarchana</em> in Toronto, and a
              London brand-launch performance for <em>Maaya Entertainment</em>.
            </p>
          </Reveal>
        </div>

        {/* Principal Roles — full-bleed */}
        <div className="relative w-full">
          <img
            src={principalRoles}
            alt="Three dancers on stage — Padmavathi, Lakshmi, and Venkateswara in Sri Venkateswara Vilasam."
            loading="lazy"
            className="block w-full"
          />
          <div className="px-6 py-8" style={{ background: "var(--color-ink-900)" }}>
            <div className="mx-auto flex max-w-[1400px] flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <p
                className="font-display italic"
                style={{ color: "var(--color-on-ink)", fontSize: "1.4rem" }}
              >
                Padmavathi. Lakshmi. Venkateswara.
              </p>
              <p className="eyebrow" style={{ color: "var(--color-gold-400)" }}>
                Sri Venkateswara Vilasam · Gudi Sambaralu · Nizamabad, 2019
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STAGE III — BEYOND KUCHIPUDI */}
      <section id="stage-3">
        <StageOpener
          numeral="III"
          title="Beyond Kuchipudi"
          eyebrow="Stage Three"
          image={contemporaryPortrait}
          alt="Contemporary portrait of Mahati Bhikshu in a checked handloom sari, hand raised to her face."
        />

        <div className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className="eyebrow" style={{ color: "var(--color-on-parch-dim)" }}>
                Cross-training
              </span>
              <h3
                className="font-display mt-4"
                style={{
                  fontSize: "clamp(1.8rem, 3.6vw, 2.4rem)",
                  lineHeight: 1.15,
                  fontWeight: 500,
                }}
              >
                Vocabularies gathered from other rooms.
              </h3>
            </Reveal>
            <Timeline
              className="mt-16"
              items={[
                {
                  title: "Contemporary Dance",
                  under: "under the late Astad Deboo",
                },
                {
                  title: "Odissi",
                  under: "basics workshop under Ileana Citaristi",
                },
                {
                  title: "Ballet",
                  under: "Martha Graham School",
                },
                {
                  title: "Chhau",
                  under: "intensive under Sashidhar Acharya",
                },
              ]}
            />
          </div>
        </div>

        {/* Signature pause */}
        <div
          className="px-6 py-40 md:py-56"
          style={{ background: "var(--color-parchment-200)" }}
        >
          <Reveal className="mx-auto max-w-4xl text-center">
            <blockquote
              className="font-display"
              style={{
                color: "var(--color-oxblood-600)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 6vw, 4.4rem)",
                lineHeight: 1.1,
              }}
            >
              “Breath by breath. Step by step.”
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* 7. STAGE IV — THE SECOND STAGE (cinema) */}
      <section id="stage-4">
        <StageOpener
          numeral="IV"
          title="The Second Stage"
          eyebrow="Stage Four · Cinema"
          image={contemporaryPortrait}
          alt="Editorial portrait — dark backdrop, silver nose ring, contemporary sari."
          tone="cinema"
        />

        {/* Before the Camera */}
        <div
          className="px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-800)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span
                className="eyebrow"
                style={{ color: "var(--color-oxblood-600)" }}
              >
                Before the Camera Ever Saw Her
              </span>
              <p
                className="font-display mt-6"
                style={{
                  fontSize: "clamp(1.6rem, 3.4vw, 2.4rem)",
                  lineHeight: 1.3,
                  color: "var(--color-on-ink)",
                }}
              >
                Assistant Acting Coach on{" "}
                <em>1: Nenokkadine</em>, then Casting Director for{" "}
                <em>Aakashavani</em> (SonyLIV) —{" "}
                <span style={{ color: "var(--color-gold-400)" }}>
                  craft before performance.
                </span>
              </p>
            </Reveal>
          </div>
        </div>

        {/* On Screen — filmography cards */}
        <div
          className="px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-900)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="flex flex-wrap items-baseline justify-between gap-6">
              <div>
                <span className="eyebrow" style={{ color: "var(--color-oxblood-600)" }}>
                  On Screen
                </span>
                <h3
                  className="font-display mt-4"
                  style={{
                    fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  Filmography.
                </h3>
              </div>
              <GoldRule className="w-24" />
            </Reveal>

            <FilmCarousel
              className="mt-12"
              films={[
                { title: "SITA", note: "Debut — opposite Sonu Sood" },
                { title: "RADHE SHYAM", note: "Feature" },
                { title: "GEORGE REDDY", note: "Feature" },
                { title: "KINNERASANI", note: "Titular role — most recent" },
              ]}
            />

            {/* TODO: Replace href="#" with real YouTube URLs — Kinnerasani trailer
                and the song "Ninu Nanu Dache" — once supplied by client. */}
            <Reveal className="mt-16 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <p
                className="font-display italic"
                style={{ color: "var(--color-on-ink-dim)", fontSize: "1.4rem" }}
              >
                Kinnerasani — trailer & <em>Ninu Nanu Dache</em>.
              </p>
              <WatchMarker href="#" label="Click to watch" />
            </Reveal>
          </div>
        </div>

        {/* Signature hero moment — full-bleed silence */}
        <div className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
          <img
            src={stage2Full}
            alt="Full-length Kuchipudi stance — pink and gold silk, mid-tribhangi, uninterrupted."
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            className="absolute bottom-3 right-3"
            style={{
              fontSize: 10,
              color: "rgba(233,226,207,0.6)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Plate IV
          </span>
        </div>
      </section>

      {/* 8. STAGE V — NATYAVEDAM */}
      <section id="stage-5">
        <StageOpener
          numeral="V"
          title="Natyavedam"
          eyebrow="Stage Five · Legacy"
          image={contemporaryPortrait}
          alt="Contemporary editorial portrait."
        />
        <div className="px-6 py-24 md:py-32">
          <Reveal className="mx-auto max-w-3xl">
            <span className="eyebrow" style={{ color: "var(--color-on-parch-dim)" }}>
              Passing It Forward
            </span>
            <p
              className="font-display mt-6"
              style={{
                fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)",
                lineHeight: 1.35,
                fontWeight: 500,
              }}
            >
              Founder of{" "}
              <em style={{ color: "var(--color-oxblood-600)" }}>
                Bhikshu&rsquo;s House of Arts
              </em>{" "}
              and Director of{" "}
              <em style={{ color: "var(--color-oxblood-600)" }}>
                Natyavedam Academy
              </em>{" "}
              — mentoring the next generation and continuing the preservation of
              Kuchipudi.
            </p>
            <GoldRule className="mt-10 w-16" />
          </Reveal>
        </div>
      </section>

      {/* 9. CLOSE / CONTACT */}
      <section className="relative w-full overflow-hidden">
        <img
          src={coverHero}
          alt="Mahati Bhikshu in Kuchipudi costume, closing plate."
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "70% 30%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,19,15,0.85) 0%, rgba(21,19,15,0.6) 40%, rgba(21,19,15,0.9) 100%)",
          }}
        />
        <div className="relative px-6 py-32 md:py-48">
          <Reveal className="mx-auto max-w-[1200px]">
            <p
              className="font-display"
              style={{
                color: "var(--color-on-ink)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 5.5vw, 4.4rem)",
                lineHeight: 1.05,
              }}
            >
              One life. Many stages.
              <br />
              <span style={{ color: "var(--color-gold-400)" }}>
                Still unfolding.
              </span>
            </p>
            <GoldRule className="mt-12 w-24" />

            <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-4">
                <div>
                  <span
                    className="eyebrow block"
                    style={{ color: "var(--color-gold-400)" }}
                  >
                    Correspondence
                  </span>
                  <a
                    href="mailto:mahatibhikshu@gmail.com"
                    className="font-display mt-2 inline-block text-2xl md:text-3xl"
                    style={{ color: "var(--color-on-ink)" }}
                  >
                    mahatibhikshu@gmail.com
                  </a>
                </div>
                <div>
                  <span
                    className="eyebrow block"
                    style={{ color: "var(--color-gold-400)" }}
                  >
                    Instagram
                  </span>
                  <a
                    href="https://www.instagram.com/mahatibhikshu/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-display mt-2 inline-block text-2xl md:text-3xl"
                    style={{ color: "var(--color-on-ink)" }}
                  >
                    @mahatibhikshu
                  </a>
                </div>
              </div>
              <WatchMarker
                href="https://www.instagram.com/mahatibhikshu/"
                label="Click to watch — full reel"
                size={104}
              />
            </div>

            <div
              className="mt-16 flex flex-col gap-2 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between"
              style={{ borderColor: "rgba(184,138,62,0.35)" }}
            >
              <span
                className="eyebrow"
                style={{ color: "var(--color-on-ink-dim)" }}
              >
                Production X — Editorial Portfolio
              </span>
              <span style={{ color: "var(--color-on-ink-dim)" }}>
                © {new Date().getFullYear()} Mahati Bhikshu
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ subcomponents ----------------------------- */

function StageIndicator({ activeId }: { activeId: string | null }) {
  return (
    <>
      {/* Desktop: side rail */}
      <nav
        aria-label="Stage navigation"
        className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      >
        <ul className="pointer-events-auto flex flex-col gap-5">
          {STAGES.map((s) => {
            const active = activeId === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex items-center gap-3"
                  style={{ color: active ? "var(--color-gold-500)" : "var(--color-on-parch-dim)" }}
                >
                  <span
                    className="font-display text-sm"
                    style={{ fontStyle: "italic", opacity: active ? 1 : 0.55 }}
                  >
                    {s.numeral}
                  </span>
                  <span
                    aria-hidden
                    className="block transition-all duration-500"
                    style={{
                      height: 1,
                      width: active ? 44 : 20,
                      background: active
                        ? "var(--color-gold-500)"
                        : "currentColor",
                      opacity: active ? 1 : 0.5,
                    }}
                  />
                  <span
                    className="eyebrow whitespace-nowrap opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ opacity: active ? 1 : undefined }}
                  >
                    {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile: slim progress bar */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-40 h-[3px] md:hidden"
        style={{ background: "rgba(184,138,62,0.15)" }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: activeId
              ? `${((STAGES.findIndex((s) => s.id === activeId) + 1) / STAGES.length) * 100}%`
              : "0%",
            background: "var(--color-gold-500)",
          }}
        />
      </div>
    </>
  );
}

function Accordion({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-t" style={{ borderColor: "rgba(184,138,62,0.35)" }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li
            key={it.title}
            className="border-b"
            style={{ borderColor: "rgba(184,138,62,0.35)" }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-baseline justify-between gap-6 py-5 text-left"
            >
              <span
                className="font-display"
                style={{
                  fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)",
                  fontWeight: 500,
                  color: "var(--color-on-parch)",
                }}
              >
                <span
                  className="eyebrow mr-4"
                  style={{ color: "var(--color-gold-500)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {it.title}
              </span>
              <span
                aria-hidden
                className="shrink-0 transition-transform duration-500"
                style={{
                  color: "var(--color-gold-500)",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </button>
            <div
              className="grid overflow-hidden transition-[grid-template-rows] duration-500"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="min-h-0">
                <p
                  className="pb-6 pr-10"
                  style={{ color: "var(--color-on-parch-dim)", maxWidth: "60ch" }}
                >
                  {it.body}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Lightbox({
  items,
  className = "",
}: {
  items: { src: string; title: string; alt: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? 0 : (o + 1) % items.length));
      if (e.key === "ArrowLeft")
        setOpen((o) => (o === null ? 0 : (o - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  return (
    <>
      {/* 3D coverflow — drag or wheel-scroll through it, click the centered frame to open full-screen. */}
      <div className={className}>
        <ArcTrack
          items={items}
          cardWidth={280}
          cardHeight={350}
          spacing={190}
          height={420}
          onSelect={(i) => setOpen(i)}
          renderCard={(it, i, focused) => (
            <div className="group h-full w-full text-left">
              <div
                className="relative h-[85%] w-full overflow-hidden"
                style={{
                  boxShadow: focused
                    ? "0 30px 60px -20px rgba(21,19,15,0.55)"
                    : "0 12px 30px -16px rgba(21,19,15,0.4)",
                }}
              >
                <img
                  src={it.src}
                  alt={it.alt}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(21,19,15,0) 55%, rgba(21,19,15,0.7) 100%)",
                    opacity: focused ? 0 : 0.55,
                    transition: "opacity 400ms ease",
                  }}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <span
                  className="font-display italic"
                  style={{
                    color: "var(--color-on-ink)",
                    fontSize: "1.05rem",
                    opacity: focused ? 1 : 0,
                    transition: "opacity 300ms ease",
                  }}
                >
                  {it.title}
                </span>
                <span
                  className="eyebrow"
                  style={{
                    color: "var(--color-gold-500)",
                    opacity: focused ? 1 : 0,
                    transition: "opacity 300ms ease",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          )}
        />
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(21,19,15,0.94)" }}
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-2xl"
            style={{ color: "var(--color-on-ink)" }}
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            ×
          </button>
          <figure
            className="max-h-[88vh] max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[open].src}
              alt={items[open].alt}
              className="max-h-[80vh] w-auto object-contain"
            />
            <figcaption
              className="mt-4 flex items-baseline justify-between gap-6"
              style={{ color: "var(--color-on-ink)" }}
            >
              <span className="font-display italic">{items[open].title}</span>
              <span className="eyebrow" style={{ color: "var(--color-gold-500)" }}>
                {open + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

function Timeline({
  items,
  className = "",
}: {
  items: { title: string; under: string }[];
  className?: string;
}) {
  const ref = useRef<HTMLOListElement | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.6;
      const seen = Math.min(Math.max(vh - rect.top, 0), total);
      setProgress(Math.min(1, seen / total));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <ol ref={ref} className={`relative pl-10 ${className}`}>
      <span
        aria-hidden
        className="absolute left-2 top-2 bottom-2"
        style={{ width: 1, background: "rgba(184,138,62,0.25)" }}
      />
      <span
        aria-hidden
        className="absolute left-2 top-2"
        style={{
          width: 1,
          height: `calc(${progress * 100}% - 4px)`,
          background: "var(--color-gold-500)",
          transition: "height 300ms linear",
        }}
      />
      {items.map((it, i) => (
        <Reveal as="li" key={it.title} className="relative pb-14 last:pb-0" delay={i * 90}>
          <span
            aria-hidden
            className="absolute -left-[34px] top-2 block h-2 w-2 rounded-full"
            style={{ background: "var(--color-gold-500)" }}
          />
          <span className="eyebrow" style={{ color: "var(--color-on-parch-dim)" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h4
            className="font-display mt-2"
            style={{
              fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)",
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            {it.title}
          </h4>
          <p
            className="mt-2 italic"
            style={{ color: "var(--color-on-parch-dim)" }}
          >
            {it.under}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}

function FilmCarousel({
  films,
  className = "",
}: {
  films: { title: string; note: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <ArcTrack
        items={films}
        cardWidth={340}
        cardHeight={191}
        spacing={230}
        height={280}
        renderCard={(f, _i, focused) => (
          <div
            style={{
              boxShadow: focused
                ? "0 30px 60px -20px rgba(21,19,15,0.6)"
                : "0 12px 30px -16px rgba(21,19,15,0.45)",
              height: "100%",
            }}
          >
            <FilmCard title={f.title} note={f.note} />
          </div>
        )}
      />
    </div>
  );
}

function FilmCard({ title, note }: { title: string; note: string }) {
  return (
    <div
      className="relative aspect-[16/9] overflow-hidden"
      style={{
        border: "1px solid var(--color-gold-500)",
        background: "var(--color-ink-800)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-2"
        style={{ border: "1px solid rgba(184,138,62,0.35)" }}
      />
      <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
        <span
          className="eyebrow"
          style={{ color: "var(--color-oxblood-600)" }}
        >
          Film
        </span>
        <div>
          <h4
            className="font-display"
            style={{
              color: "var(--color-on-ink)",
              fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)",
              fontWeight: 500,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            {title}
          </h4>
          <p
            className="mt-2 italic"
            style={{ color: "var(--color-on-ink-dim)" }}
          >
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}