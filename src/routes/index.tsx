import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  ARTIST,
  BEHIND_CAMERA,
  COACHING,
  CROSS_TRAINING,
  FACT_SHEETS,
  FESTIVALS,
  FILMS,
  INSTITUTIONS,
  INTERNATIONAL,
  PENDING_MEDIA,
  PRESS,
  PRODUCTIONS,
  QUICK_LINKS,
  REPERTOIRE,
  STAGES,
  TITLES,
} from "@/content";

import coverHero from "@/assets/cover_hero.jpg";
import principalRoles from "@/assets/principal_roles_group_tight.jpg";
import contemporaryPortrait from "@/assets/contemporary_portrait_tight.jpg";
import childhoodArchival from "@/assets/childhood_archival.jpg";
import handDetail from "@/assets/hand_detail.jpg";
import eyesDetail from "@/assets/eyes_detail.jpg";
import jewelryDetail from "@/assets/jewelry_detail.jpg";
import awardCeremony from "@/assets/award_ceremony.jpg";
import felicitation from "@/assets/felicitation.jpg";
import outdoorPortrait from "@/assets/outdoor_portrait.jpg";
import outdoorFullpose from "@/assets/outdoor_fullpose.jpg";
import repertoireStudio from "@/assets/repertoire_studio.jpg";
import repertoireStudio2 from "@/assets/repertoire_studio_2.jpg";
import gallery01 from "@/assets/gallery_01.jpg";
import gallery02 from "@/assets/gallery_02.jpg";
import gallery03 from "@/assets/gallery_03.jpg";
import gallery04 from "@/assets/gallery_04.jpg";
import gallery05 from "@/assets/gallery_05.jpg";
import gallery06 from "@/assets/gallery_06.jpg";
import gallery07 from "@/assets/gallery_07.jpg";
import gallery08 from "@/assets/gallery_08.jpg";
import gallery09 from "@/assets/gallery_09.jpg";
import gallery10 from "@/assets/gallery_10.jpg";
import filmSita from "@/assets/film_sita.jpg";
import filmRadheShyam from "@/assets/film_radhe_shyam.jpg";
import filmGeorgeReddy from "@/assets/film_george_reddy.jpg";
import filmKinnerasani from "@/assets/film_kinnerasani.jpg";

export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    meta: [
      { property: "og:image", content: coverHero },
      { name: "twitter:image", content: coverHero },
    ],
  }),
});

/** Film stills, keyed by title. Titles absent here render typographically. */
const FILM_STILLS: Record<string, string> = {
  Sita: filmSita,
  "George Reddy": filmGeorgeReddy,
  "Radhe Shyam": filmRadheShyam,
  Kinnerasani: filmKinnerasani,
};

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
 * or drag required. Wheel-scroll and touch-drag are kept as fallbacks. The
 * target is eased toward every frame (rAF lerp) so motion feels springy.
 */
function useArcCarousel(count: number) {
  const restValue = (count - 1) / 2;
  const target = useRef(restValue);
  const current = useRef(restValue);
  const [value, setValue] = useState(restValue);
  const raf = useRef<number | null>(null);
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

  const onPointerMoveHover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    target.current = clamp(rel * (count - 1));
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    // Touch fires "leave" the moment a finger lifts — that's a release, not
    // the cursor wandering off, so keep the position the drag ended at.
    if (e.pointerType === "touch") return;
    target.current = restValue;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    target.current = clamp(target.current + e.deltaY * 0.0028);
  };

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

function WatchMarker({ href, label, size = 88 }: { href: string; label: string; size?: number }) {
  const external = href.startsWith("http");
  const pending = href === "#";
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      aria-disabled={pending || undefined}
      className="group inline-flex items-center gap-4"
      style={pending ? { opacity: 0.55, pointerEvents: "none" } : undefined}
      aria-label={label}
      data-cursor={pending ? undefined : "Watch"}
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

function Eyebrow({
  children,
  tone = "parch",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "parch" | "ink" | "gold" | "oxblood" | "cinema";
  className?: string;
}) {
  const color = {
    parch: "var(--color-on-parch-dim)",
    ink: "var(--color-on-ink-dim)",
    gold: "var(--color-gold-400)",
    /** Oxblood on parchment only — it is illegible on the ink grounds. */
    oxblood: "var(--color-oxblood-600)",
    /** The same cinema register, tinted for legibility on ink. */
    cinema: "var(--color-oxblood-400)",
  }[tone];
  return (
    <span className={`eyebrow ${className}`} style={{ color }}>
      {children}
    </span>
  );
}

/**
 * Custom cursor for pointer:fine devices — a small ring that follows the
 * mouse with spring easing and picks up a label from the nearest ancestor's
 * `data-cursor` attribute. Only rendered over deliberately interactive areas.
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
      <span className="eyebrow" style={{ color: "var(--color-on-ink)", fontSize: 10 }}>
        {label}
      </span>
    </div>
  );
}

/**
 * A 3D coverflow / arc carousel track: cards fan out in a shallow perspective
 * arc around a continuous focus value, receding in depth and opacity as they
 * move off-centre. Reserved for the performance gallery — the impression
 * layer. Utility lists (filmography, festivals) use static grids instead, so
 * a professional visitor can scan rather than steer.
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
      // The fanned cards extend well past the track's own width, which pushes
      // the document wider than the viewport on narrow screens. Clipping here
      // keeps the arc inside the section — cards receding off the edge is the
      // intended coverflow read anyway.
      className="relative w-full touch-pan-y select-none overflow-hidden"
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
          <Eyebrow tone="ink">{eyebrow}</Eyebrow>
          <div
            className="font-display mt-2 text-[10rem] leading-none md:text-[14rem]"
            style={{ color: "var(--color-gold-400)", fontStyle: "italic", fontWeight: 400 }}
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
          {/* 2:3 — the ratio the photography was shot at, held everywhere. */}
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <img src={image} alt={alt} loading="lazy" className="h-full w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* --------------------------------- page ---------------------------------- */

function Portfolio() {
  const activeStage = useActiveStage(STAGES.map((s) => s.id));

  return (
    <main style={{ background: "var(--color-parchment-100)", color: "var(--color-on-parch)" }}>
      <IndexOverlay activeId={activeStage} />
      <StageProgress activeId={activeStage} />
      <CustomCursor />

      {/* ------------------------------- HERO ------------------------------ */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src={coverHero}
          alt="Mahati Bhikshu in a red silk blouse and gold-woven silk drape, one hand raised in a mudra, against a black backdrop hung with temple garlands."
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "70% 30%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,19,15,0.55) 0%, rgba(21,19,15,0) 30%, rgba(21,19,15,0) 55%, rgba(21,19,15,0.85) 100%)",
          }}
        />
        {/* Right padding keeps this clear of the fixed Index button, which
            sits over it on narrow viewports. */}
        <div className="absolute left-6 top-6 pr-28 md:left-10 md:top-10 md:pr-40">
          <Eyebrow tone="gold">{ARTIST.studio} — Editorial Portfolio</Eyebrow>
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
              {ARTIST.firstName}
              <br />
              <span style={{ fontStyle: "italic", color: "var(--color-gold-400)" }}>
                {ARTIST.lastName}
              </span>
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <GoldRule className="w-12" />
              <p className="eyebrow" style={{ color: "var(--color-on-ink)" }}>
                {ARTIST.roles}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ THESIS ----------------------------- */}
      <section className="px-6 py-40 md:py-56" style={{ background: "var(--color-parchment-100)" }}>
        <Reveal className="mx-auto max-w-4xl text-center">
          <Eyebrow>Thesis</Eyebrow>
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
            “{ARTIST.thesis}”
          </blockquote>
          <GoldRule className="mx-auto mt-12 w-16" />
          <p className="eyebrow mt-6" style={{ color: "var(--color-on-parch-dim)" }}>
            {ARTIST.name}
          </p>
        </Reveal>
      </section>

      {/* --------------------------- I — LINEAGE --------------------------- */}
      <section id="stage-1">
        <StageOpener
          numeral="I"
          title="Lineage"
          eyebrow="Stage One"
          image={outdoorFullpose}
          alt="Mahati Bhikshu seated on grass at golden hour in a green and magenta silk costume, wrists crossed in a mudra, trees blurred behind her."
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
                I am the daughter of <em>Dr. N.J. Bhikshu</em>, a renowned theatre actor, and{" "}
                <em>Prof. Aruna Bhikshu</em>, a Kuchipudi exponent and choreographer — I grew up
                inside the art form itself.
              </p>
              <p className="mt-8" style={{ color: "var(--color-on-ink-dim)", maxWidth: "56ch" }}>
                For more than twenty years, my mother has been my guru. The studio was my living
                room; the stage was inherited before I ever chose it.
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
                {/* A video frame, not a photograph — framed so its softness
                    reads as archival rather than as a mistake. */}
                <div className="border border-black">
                  <img
                    src={childhoodArchival}
                    alt="A grainy archival video still: Mahati Bhikshu at age eight in costume on a dark stage, one arm extended in a mudra."
                    loading="lazy"
                    className="block w-full"
                    style={{ filter: "sepia(0.15) contrast(1.05)" }}
                  />
                </div>
                <figcaption className="mt-4 px-1" style={{ color: "var(--color-on-ink-dim)" }}>
                  <Eyebrow tone="gold" className="block">
                    Archival Plate — My First Appearance
                  </Eyebrow>
                  <span className="mt-2 block font-display italic text-lg leading-snug">
                    Bala Narakasura, from the musical dance drama <em>Narakasura Vadha</em> — my
                    first stage appearance, age eight.
                  </span>
                  <span className="mt-3 block text-sm">
                    That same year I played Bhakta Prahlada in <em>Parikatha</em>, where{" "}
                    <em>vachika abhinaya</em> — the voice as gesture — was introduced to me.
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------- II — NRITTA & ABHINAYA ---------------------- */}
      <section id="stage-2">
        <StageOpener
          numeral="II"
          title="Nritta & Abhinaya"
          eyebrow="Stage Two"
          image={gallery10}
          alt="Mahati Bhikshu kneeling under blue stage light in a dark green and magenta silk costume, one hand raised near her chin."
        />

        {/* The felicitation moment — full-bleed with a pull-quote. */}
        <div className="relative h-[92svh] min-h-[600px] w-full overflow-hidden">
          <img
            src={felicitation}
            alt="An elder in a red printed shirt draping a pink silk shawl over Mahati Bhikshu's shoulders on stage, her hands folded in gratitude."
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 20%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(21,19,15,0.78) 0%, rgba(21,19,15,0.3) 45%, rgba(21,19,15,0) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center px-6 md:px-16">
            <Reveal className="max-w-2xl">
              <Eyebrow tone="gold">Pull-quote</Eyebrow>
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
              <Eyebrow>Titles &amp; Recognition</Eyebrow>
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
              <div className="relative mt-8 aspect-[3/2] w-full overflow-hidden">
                <img
                  src={awardCeremony}
                  alt="Mahati Bhikshu on stage holding a framed citation, flanked by dignitaries and family after receiving the Nrithya Pratibha Puraskar."
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="eyebrow mt-3" style={{ color: "var(--color-on-parch-dim)" }}>
                Receiving the Nrithya Pratibha Puraskar
              </p>
            </Reveal>

            <div className="md:col-span-7">
              <Accordion items={TITLES} />
            </div>
          </div>
        </div>

        {/* Detail plate */}
        <div className="px-6 py-24 md:py-32" style={{ background: "var(--color-parchment-200)" }}>
          <div className="mx-auto max-w-[1200px]">
            <Reveal>
              <Eyebrow>Detail Plate</Eyebrow>
            </Reveal>
            <div className="mt-8 grid grid-cols-12 gap-3 md:gap-5">
              {/* These two crops are low-resolution originals — kept small on
                  purpose so they never scale past what the pixels support. */}
              <Reveal className="col-span-12 md:col-span-8">
                <img
                  src={eyesDetail}
                  alt="Close crop of Mahati Bhikshu's eyes in performance make-up — heavy kohl liner and a red bindi."
                  loading="lazy"
                  className="block h-full w-full object-cover"
                  style={{ aspectRatio: "2/1" }}
                />
              </Reveal>
              <Reveal className="col-span-6 md:col-span-4" delay={120}>
                <img
                  src={handDetail}
                  alt="A hand held in a Kuchipudi mudra with red-tipped fingers, pearl and gold bracelets at the wrist, red silk sleeve below."
                  loading="lazy"
                  className="block h-full w-full object-cover"
                  style={{ aspectRatio: "1/1" }}
                />
              </Reveal>
              <Reveal className="col-span-6 md:col-span-4" delay={200}>
                <img
                  src={jewelryDetail}
                  alt="Temple jewellery detail — kemp stones set in gold with pearl drops."
                  loading="lazy"
                  className="block h-full w-full object-cover"
                  style={{ aspectRatio: "2/1" }}
                />
              </Reveal>
            </div>
            <Reveal>
              <p className="eyebrow mt-6" style={{ color: "var(--color-on-parch-dim)" }}>
                Nritta. Abhinaya. In detail.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Repertoire */}
        <div
          id="repertoire"
          className="scroll-mt-24 px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-800)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-[1200px]">
            <Reveal>
              <Eyebrow tone="gold">Repertoire</Eyebrow>
              <h3
                className="font-display mt-4"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                }}
              >
                {REPERTOIRE.map((r) => r.title).join(". ")}.
              </h3>
              <GoldRule className="mt-8 w-16" />
              <p className="mt-8 max-w-[60ch]" style={{ color: "var(--color-on-ink-dim)" }}>
                Two pieces I return to often — <em>Bho Shambo</em>, an invocation to Shiva, and a{" "}
                <em>padam</em> composed by the poet Kshetrayya. Both live in my solo recitals,
                danced in full.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                {
                  img: repertoireStudio,
                  alt: "Mahati Bhikshu seated on a red floor against a black drape in a red and gold silk costume, hands clasped beneath her chin.",
                  title: REPERTOIRE[0].title,
                },
                {
                  img: repertoireStudio2,
                  alt: "Mahati Bhikshu standing against a black drape in a red and gold silk costume, arms extended in a Kuchipudi stance.",
                  title: REPERTOIRE[1].title,
                },
              ].map((r, i) => (
                <Reveal key={r.title} delay={i * 120}>
                  <div className="relative aspect-[2/3] w-full overflow-hidden">
                    <img
                      src={r.img}
                      alt={r.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="font-display italic mt-3" style={{ fontSize: "1.1rem" }}>
                    {r.title}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-12 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <p
                className="font-display italic"
                style={{ color: "var(--color-on-ink-dim)", fontSize: "1.2rem" }}
              >
                Full recordings of both pieces exist — link coming soon.
              </p>
              <WatchMarker href={PENDING_MEDIA.bhoShambo} label="Click to watch" />
            </Reveal>
          </div>
        </div>

        {/* In performance — the impression layer */}
        <div
          className="px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-900)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-[1200px]">
            <Reveal>
              <Eyebrow tone="gold">In Performance</Eyebrow>
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
              <p className="mt-8 max-w-[62ch]" style={{ color: "var(--color-on-ink-dim)" }}>
                Move through the frames — drag, scroll, or just hover. A full list of festivals and
                platforms follows below.
              </p>
            </Reveal>

            <Lightbox
              className="mt-12"
              items={[
                {
                  src: gallery01,
                  title: "Nritta I",
                  alt: "Mahati Bhikshu mid-turn under violet stage light and haze, one leg lifted, in a magenta and green silk costume.",
                },
                {
                  src: gallery03,
                  title: "Abhinaya",
                  alt: "Mahati Bhikshu in an expressive stance under warm stage light, gaze turned to the side.",
                },
                {
                  src: gallery04,
                  title: "Tribhangi",
                  alt: "Mahati Bhikshu in a sharp tribhangi stance under red stage light.",
                },
                {
                  src: gallery05,
                  title: "Movement",
                  alt: "Mahati Bhikshu under blue stage light in a green and copper silk costume, one arm extended, weight low.",
                },
                {
                  src: gallery06,
                  title: "Nritta II",
                  alt: "Mahati Bhikshu in an expressive stance under violet stage light.",
                },
                {
                  src: gallery07,
                  title: "Solo Recital",
                  alt: "Mahati Bhikshu standing tall under blue stage light in a full Kuchipudi costume.",
                },
                {
                  src: gallery08,
                  title: "Stillness",
                  alt: "Mahati Bhikshu in a quiet composed pose in a red and gold costume against near-black darkness.",
                },
                {
                  src: gallery09,
                  title: "Nritta III",
                  alt: "Mahati Bhikshu in motion under blue stage light, drape lifting with the turn.",
                },
                {
                  src: gallery10,
                  title: "Closing Pose",
                  alt: "Mahati Bhikshu kneeling under blue stage light, one hand raised near her chin.",
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
              <WatchMarker href={PENDING_MEDIA.showreel} label="Click to watch" />
            </Reveal>
          </div>
        </div>

        {/* gallery_02 — the strongest frame, given the room it deserves. */}
        <div className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
          <img
            src={gallery02}
            alt="Mahati Bhikshu in a dark green and magenta silk costume, fist raised and stance wide, lit against billowing red smoke."
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "60% 50%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(21,19,15,0.7) 0%, rgba(21,19,15,0.1) 45%, rgba(21,19,15,0.6) 100%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 px-6 pt-20 md:px-16 md:pt-28">
            <Reveal className="mx-auto max-w-[1200px]">
              <Eyebrow tone="gold">Nritta</Eyebrow>
              <p
                className="font-display mt-4"
                style={{
                  color: "var(--color-on-ink)",
                  fontStyle: "italic",
                  fontSize: "clamp(2rem, 5.5vw, 4.2rem)",
                  lineHeight: 1.02,
                  maxWidth: "18ch",
                }}
              >
                Rhythm before meaning.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Festivals — utility, so it is a list, not a carousel */}
        <div id="festivals" className="scroll-mt-24 px-6 py-24 md:py-32">
          <div className="mx-auto max-w-[1200px]">
            <Reveal>
              <Eyebrow>Where I've Performed</Eyebrow>
              <h3
                className="font-display mt-4"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                }}
              >
                Festivals &amp; platforms.
              </h3>
              <GoldRule className="mt-8 w-16" />
            </Reveal>
            <div className="mt-14 grid gap-12 md:grid-cols-3">
              {FESTIVALS.map((group, gi) => (
                <Reveal key={group.group} delay={gi * 110}>
                  <Eyebrow tone="oxblood">{group.group}</Eyebrow>
                  <ul className="mt-5 space-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border-b pb-3 font-display"
                        style={{
                          borderColor: "rgba(184,138,62,0.28)",
                          fontSize: "1.05rem",
                          lineHeight: 1.35,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Abroad */}
        <div className="px-6 py-32 md:py-44" style={{ background: "var(--color-parchment-200)" }}>
          <Reveal className="mx-auto max-w-3xl">
            <Eyebrow>Abroad</Eyebrow>
            <h3
              className="font-display mt-6"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 4.6rem)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              {INTERNATIONAL.cities.map((c, i) => (
                <span key={c}>
                  {i === INTERNATIONAL.cities.length - 1 ? (
                    <span style={{ fontStyle: "italic", color: "var(--color-gold-500)" }}>
                      {c}.
                    </span>
                  ) : (
                    <>{c}.</>
                  )}
                  {i < INTERNATIONAL.cities.length - 1 && <br />}
                </span>
              ))}
            </h3>
            <GoldRule className="mt-10 w-16" />
            <p className="mt-8" style={{ color: "var(--color-on-parch-dim)", maxWidth: "52ch" }}>
              {INTERNATIONAL.note}
            </p>
          </Reveal>
        </div>

        {/* Principal roles — the one temple-festival frame, full-bleed and alone */}
        <div className="relative w-full">
          <img
            src={principalRoles}
            alt="Three dancers on a garlanded festival stage — Sri Venkateswara crowned at centre with Padmavathi and Lakshmi to either side, hands raised in abhaya."
            loading="lazy"
            className="block w-full"
          />
          <div className="px-6 py-8" style={{ background: "var(--color-ink-900)" }}>
            <div className="mx-auto flex max-w-[1400px] flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <p
                className="font-display italic"
                style={{ color: "var(--color-on-ink)", fontSize: "1.4rem" }}
              >
                {PRODUCTIONS[0].roles
                  .split(" · ")
                  .map((r) => r.replace(/^Sri |^Goddess /, ""))
                  .join(". ")}
                .
              </p>
              <Eyebrow tone="gold">
                {PRODUCTIONS[0].title} · {PRODUCTIONS[0].where}
              </Eyebrow>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------- III — BEYOND KUCHIPUDI --------------------- */}
      <section id="stage-3">
        <StageOpener
          numeral="III"
          title="Beyond Kuchipudi"
          eyebrow="Stage Three"
          image={outdoorPortrait}
          alt="Mahati Bhikshu at golden hour in a magenta blouse and green silk with gold temple jewellery, head lowered, hand resting near her chin."
        />

        <div className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Eyebrow>Cross-training</Eyebrow>
              <h3
                className="font-display mt-4"
                style={{
                  fontSize: "clamp(1.8rem, 3.6vw, 2.4rem)",
                  lineHeight: 1.15,
                  fontWeight: 500,
                }}
              >
                Vocabularies I've gathered from other rooms.
              </h3>
            </Reveal>
            <Timeline className="mt-16" items={CROSS_TRAINING} />
          </div>
        </div>

        <div className="px-6 py-40 md:py-56" style={{ background: "var(--color-parchment-200)" }}>
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

      {/* ---------------------- IV — THE SECOND STAGE ----------------------- */}
      <section id="stage-4">
        <StageOpener
          numeral="IV"
          title="The Second Stage"
          eyebrow="Stage Four · Cinema"
          image={contemporaryPortrait}
          alt="Editorial portrait of Mahati Bhikshu in a dark green checked sari with silver tribal jewellery, one hand raised near her face in low warm light."
          tone="cinema"
        />

        <div
          className="px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-800)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Eyebrow tone="cinema">Before the Camera Ever Saw Me</Eyebrow>
              <p
                className="font-display mt-6"
                style={{
                  fontSize: "clamp(1.6rem, 3.4vw, 2.4rem)",
                  lineHeight: 1.3,
                  color: "var(--color-on-ink)",
                }}
              >
                I was Assistant Acting Coach on <em>1: Nenokkadine</em>, then Casting Director for{" "}
                <em>Aakashavani</em> (SonyLIV) —{" "}
                <span style={{ color: "var(--color-gold-400)" }}>craft before performance.</span>
              </p>
              <ul className="mt-10 space-y-4">
                {BEHIND_CAMERA.map((b) => (
                  <li
                    key={b.project}
                    className="border-t pt-4"
                    style={{ borderColor: "rgba(184,138,62,0.3)" }}
                  >
                    <Eyebrow tone="gold" className="block">
                      {b.role}
                    </Eyebrow>
                    <span className="font-display mt-1 block text-xl italic">{b.project}</span>
                    {b.note && (
                      <span
                        className="mt-1 block text-sm"
                        style={{ color: "var(--color-on-ink-dim)" }}
                      >
                        {b.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Filmography — a scannable grid, not a carousel */}
        <div
          id="filmography"
          className="scroll-mt-24 px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-900)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="flex flex-wrap items-baseline justify-between gap-6">
              <div>
                <Eyebrow tone="cinema">On Screen</Eyebrow>
                <h3
                  className="font-display mt-4"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 500, lineHeight: 1 }}
                >
                  Filmography.
                </h3>
              </div>
              <GoldRule className="w-24" />
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FILMS.map((f, i) => (
                <Reveal key={f.title} delay={i * 80}>
                  <FilmCard
                    title={f.title}
                    note={f.note}
                    year={f.year}
                    image={FILM_STILLS[f.title]}
                  />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <p
                className="font-display italic"
                style={{ color: "var(--color-on-ink-dim)", fontSize: "1.4rem" }}
              >
                Kinnerasani — trailer &amp; <em>Ninu Nanu Dache</em>.
              </p>
              <WatchMarker href={PENDING_MEDIA.kinnerasaniTrailer} label="Click to watch" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------- V — NATYAVEDAM -------------------------- */}
      <section id="stage-5">
        <StageOpener
          numeral="V"
          title="Natyavedam"
          eyebrow="Stage Five · Legacy"
          image={gallery07}
          alt="Mahati Bhikshu standing tall under blue stage light in a full Kuchipudi costume, arms held in a closing stance."
        />
        <div className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="max-w-3xl">
              <Eyebrow>Passing It Forward</Eyebrow>
              <p
                className="font-display mt-6"
                style={{
                  fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)",
                  lineHeight: 1.35,
                  fontWeight: 500,
                }}
              >
                I founded{" "}
                <em style={{ color: "var(--color-oxblood-600)" }}>Bhikshu's House of Arts</em> and
                direct <em style={{ color: "var(--color-oxblood-600)" }}>Natyavedam Academy</em> —
                mentoring the next generation and continuing the preservation of Kuchipudi.
              </p>
              <GoldRule className="mt-10 w-16" />
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {INSTITUTIONS.map((inst, i) => (
                <Reveal key={inst.name} delay={i * 120}>
                  <div
                    className="h-full border p-8"
                    style={{ borderColor: "rgba(184,138,62,0.4)" }}
                  >
                    <Eyebrow tone="oxblood">{inst.role}</Eyebrow>
                    <h4
                      className="font-display mt-3"
                      style={{
                        fontSize: "clamp(1.5rem, 3vw, 2rem)",
                        fontWeight: 500,
                        lineHeight: 1.1,
                      }}
                    >
                      {inst.name}
                    </h4>
                    <p className="mt-4" style={{ color: "var(--color-on-parch-dim)" }}>
                      {inst.note}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- VI — THE ROOM BEFORE THE CAMERA ------------------- */}
      <section id="stage-6">
        <StageOpener
          numeral="VI"
          title="The Room Before the Camera"
          eyebrow="Stage Six · Present"
          image={gallery08}
          alt="Mahati Bhikshu in a red and gold costume standing in near-darkness, lit from one side."
          tone="cinema"
        />

        <div
          id="coaching"
          className="scroll-mt-24 px-6 py-24 md:py-32"
          style={{ background: "var(--color-ink-800)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="max-w-3xl">
              <Eyebrow tone="gold">The Practice Now</Eyebrow>
              <p
                className="font-display mt-6"
                style={{
                  fontSize: "clamp(1.7rem, 3.6vw, 2.6rem)",
                  lineHeight: 1.3,
                  color: "var(--color-on-ink)",
                  fontStyle: "italic",
                }}
              >
                “{COACHING.intro}”
              </p>
              <GoldRule className="mt-10 w-16" />
              <p className="mt-8 max-w-[58ch]" style={{ color: "var(--color-on-ink-dim)" }}>
                {COACHING.method}
              </p>
            </Reveal>

            <div className="mt-16 grid gap-10 md:grid-cols-12">
              <Reveal className="md:col-span-7">
                <Eyebrow tone="cinema">In Training</Eyebrow>
                <ul className="mt-6">
                  {COACHING.trained.map((t, i) => (
                    <li
                      key={t.name}
                      className="border-b py-5"
                      style={{ borderColor: "rgba(184,138,62,0.3)" }}
                    >
                      <div className="flex items-baseline gap-4">
                        <Eyebrow tone="gold">{String(i + 1).padStart(2, "0")}</Eyebrow>
                        <h4
                          className="font-display"
                          style={{
                            fontSize: "clamp(1.4rem, 2.6vw, 2rem)",
                            fontWeight: 500,
                            lineHeight: 1.1,
                          }}
                        >
                          {t.name}
                        </h4>
                      </div>
                      <p className="mt-2 pl-11" style={{ color: "var(--color-on-ink-dim)" }}>
                        {t.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="md:col-span-4 md:col-start-9" delay={140}>
                <div
                  className="border p-7"
                  style={{
                    borderColor: "var(--color-gold-500)",
                    background: "var(--color-ink-900)",
                  }}
                >
                  <Eyebrow tone="gold" className="block">
                    For Directors
                  </Eyebrow>
                  <ul className="mt-4 space-y-3">
                    {COACHING.forDirectors.map((d) => (
                      <li key={d} className="font-display italic leading-snug">
                        {d}
                      </li>
                    ))}
                  </ul>
                  <GoldRule className="my-7 w-10" />
                  <Eyebrow tone="gold" className="block">
                    The Living Room, Before
                  </Eyebrow>
                  <p className="mt-3 text-sm" style={{ color: "var(--color-on-ink-dim)" }}>
                    Actors who came to my parents' house to train while I was a child:
                  </p>
                  <ul className="mt-3 space-y-1">
                    {COACHING.childhoodVisitors.map((n) => (
                      <li key={n} className="font-display italic">
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------- SELECTED PRESS ------------------------- */}
      <section id="press" className="scroll-mt-24 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <Reveal className="flex flex-wrap items-baseline justify-between gap-6">
            <div>
              <Eyebrow>Selected Press</Eyebrow>
              <h3
                className="font-display mt-4"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 500, lineHeight: 1 }}
              >
                In print.
              </h3>
            </div>
            <GoldRule className="w-24" />
          </Reveal>

          <ul className="mt-14">
            {PRESS.map((p, i) => {
              const Row = (
                <>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <Eyebrow tone="oxblood">{p.outlet}</Eyebrow>
                    <Eyebrow>{p.date}</Eyebrow>
                  </div>
                  <h4
                    className="font-display mt-3"
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 2.1rem)",
                      fontWeight: 500,
                      lineHeight: 1.15,
                    }}
                  >
                    {p.headline}
                  </h4>
                  <p
                    className="mt-3"
                    style={{ color: "var(--color-on-parch-dim)", maxWidth: "70ch" }}
                  >
                    {p.summary}
                  </p>
                </>
              );
              return (
                <Reveal
                  as="li"
                  key={p.headline}
                  delay={i * 100}
                  className="border-t py-8"
                  {...({ style: { borderColor: "rgba(184,138,62,0.35)" } } as object)}
                >
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block transition-opacity hover:opacity-70"
                    >
                      {Row}
                      <span
                        className="eyebrow mt-4 inline-block"
                        style={{ color: "var(--color-gold-500)" }}
                      >
                        Read the article →
                      </span>
                    </a>
                  ) : (
                    Row
                  )}
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------------------- ONE-SHEETS --------------------------- */}
      <FactSheets />

      {/* ------------------------------ CONTACT ---------------------------- */}
      <section id="contact" className="relative w-full scroll-mt-24 overflow-hidden">
        <img
          src={coverHero}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "70% 30%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,19,15,0.88) 0%, rgba(21,19,15,0.66) 40%, rgba(21,19,15,0.92) 100%)",
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
              {ARTIST.thesis}
              <br />
              <span style={{ color: "var(--color-gold-400)" }}>{ARTIST.closing}</span>
            </p>
            <GoldRule className="mt-12 w-24" />

            <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
              <div className="grid gap-6 sm:grid-cols-2">
                <ContactLine
                  label="Bookings & Casting"
                  value={ARTIST.email}
                  href={`mailto:${ARTIST.email}`}
                />
                <ContactLine
                  label="Academy & Teaching"
                  value={ARTIST.workEmail}
                  href={`mailto:${ARTIST.workEmail}`}
                />
                <ContactLine
                  label="Instagram"
                  value={`@${ARTIST.instagram}`}
                  href={ARTIST.instagramUrl}
                />
                <ContactLine label="IMDb" value={ARTIST.imdbId} href={ARTIST.imdbUrl} />
              </div>
              <WatchMarker
                href={PENDING_MEDIA.showreel}
                label="Click to watch — full reel"
                size={104}
              />
            </div>

            <div
              className="mt-16 flex flex-col gap-2 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between"
              style={{ borderColor: "rgba(184,138,62,0.35)" }}
            >
              <span className="eyebrow" style={{ color: "var(--color-on-ink-dim)" }}>
                {ARTIST.studio} — Editorial Portfolio
              </span>
              <span style={{ color: "var(--color-on-ink-dim)" }}>
                Performance photography — {ARTIST.photographyCredit}
              </span>
              <span style={{ color: "var(--color-on-ink-dim)" }}>
                © {new Date().getFullYear()} {ARTIST.name}
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ subcomponents ----------------------------- */

function ContactLine({ label, value, href }: { label: string; value: string; href: string }) {
  const external = href.startsWith("http");
  return (
    <div>
      <Eyebrow tone="gold" className="block">
        {label}
      </Eyebrow>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className="font-display mt-2 inline-block break-all transition-opacity hover:opacity-70"
        style={{ color: "var(--color-on-ink)", fontSize: "clamp(1.05rem, 2vw, 1.5rem)" }}
      >
        {value}
      </a>
    </div>
  );
}

/**
 * The index. Both target audiences are professional bookers arriving with one
 * question — this gives them a direct route without removing the narrative
 * for everyone else. Styled as a printed contents page, matching the
 * portfolio metaphor the rest of the page uses.
 */
function IndexOverlay({ activeId }: { activeId: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // Solid rather than translucent: over the parchment sections a
        // semi-transparent ink turns muddy grey and loses its edge.
        className="fixed right-5 top-5 z-50 border px-4 py-2.5 transition-opacity hover:opacity-85 md:right-8 md:top-8"
        style={{
          borderColor: "var(--color-gold-500)",
          background: "var(--color-ink-900)",
          color: "var(--color-on-ink)",
        }}
        aria-expanded={open}
      >
        <span className="eyebrow">Index</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Contents"
          className="fixed inset-0 z-[70] overflow-y-auto"
          style={{ background: "var(--color-ink-900)", color: "var(--color-on-ink)" }}
        >
          <div className="mx-auto max-w-[1100px] px-6 py-20 md:px-10 md:py-24">
            <div className="flex items-start justify-between gap-6">
              <div>
                <Eyebrow tone="gold">{ARTIST.name}</Eyebrow>
                <h2
                  className="font-display mt-3"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 500, lineHeight: 1 }}
                >
                  Contents
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border px-4 py-2.5"
                style={{ borderColor: "var(--color-gold-500)", color: "var(--color-on-ink)" }}
              >
                <span className="eyebrow">Close</span>
              </button>
            </div>

            <GoldRule className="mt-10" />

            <ol className="mt-8">
              {STAGES.map((s) => {
                const active = activeId === s.id;
                return (
                  <li
                    key={s.id}
                    className="border-b"
                    style={{ borderColor: "rgba(184,138,62,0.28)" }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-6 py-5 transition-opacity hover:opacity-70"
                      style={{ color: active ? "var(--color-gold-400)" : "var(--color-on-ink)" }}
                    >
                      <span
                        className="font-display w-10 shrink-0 italic"
                        style={{ color: "var(--color-gold-500)", fontSize: "1.1rem" }}
                      >
                        {s.numeral}
                      </span>
                      <span
                        className="font-display"
                        style={{
                          fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
                          fontWeight: 500,
                          lineHeight: 1.1,
                        }}
                      >
                        {s.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>

            <div className="mt-14">
              <Eyebrow tone="gold">Go Straight To</Eyebrow>
              <div className="mt-5 flex flex-wrap gap-3">
                {QUICK_LINKS.map((q) => (
                  <a
                    key={q.href}
                    href={q.href}
                    onClick={() => setOpen(false)}
                    className="border px-5 py-3 transition-colors"
                    style={{ borderColor: "rgba(184,138,62,0.5)", color: "var(--color-on-ink)" }}
                  >
                    <span className="eyebrow">{q.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-16 border-t pt-6" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
              <a
                href={`mailto:${ARTIST.email}`}
                className="font-display text-xl italic"
                style={{ color: "var(--color-gold-400)" }}
              >
                {ARTIST.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Slim reading-progress bar; the side rail moved into the Index overlay. */
function StageProgress({ activeId }: { activeId: string | null }) {
  const idx = STAGES.findIndex((s) => s.id === activeId);
  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-40 h-[3px]"
      style={{ background: "rgba(184,138,62,0.15)" }}
    >
      <div
        className="h-full transition-all duration-500"
        style={{
          width: idx >= 0 ? `${((idx + 1) / STAGES.length) * 100}%` : "0%",
          background: "var(--color-gold-500)",
        }}
      />
    </div>
  );
}

function Accordion({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-t" style={{ borderColor: "rgba(184,138,62,0.35)" }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={it.title} className="border-b" style={{ borderColor: "rgba(184,138,62,0.35)" }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
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
                <span className="eyebrow mr-4" style={{ color: "var(--color-gold-500)" }}>
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
      <div className={className}>
        {/* Card is 2:3 — the ratio every stage photograph was shot at. */}
        <ArcTrack
          items={items}
          cardWidth={266}
          cardHeight={399}
          spacing={320}
          height={470}
          onSelect={(i) => setOpen(i)}
          renderCard={(it, i, focused) => (
            <div className="group h-full w-full text-left">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "2/3",
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
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
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
          <figure className="max-h-[88vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
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
  items: readonly { title: string; under: string }[];
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
          <Eyebrow>{String(i + 1).padStart(2, "0")}</Eyebrow>
          <h4
            className="font-display mt-2"
            style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)", fontWeight: 500, lineHeight: 1.1 }}
          >
            {it.title}
          </h4>
          <p className="mt-2 italic" style={{ color: "var(--color-on-parch-dim)" }}>
            {it.under}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}

/**
 * Film stills are 16:9 trailer frames, so they get their own lane and a
 * visible inner frame — softness then reads as "film still" rather than as a
 * low-quality photograph. Titles without a still fall back to a typographic
 * card instead of being dropped from the filmography.
 */
function FilmCard({
  title,
  note,
  year,
  image,
}: {
  title: string;
  note: string;
  year?: string;
  image?: string;
}) {
  return (
    <div
      className="relative aspect-[16/9] overflow-hidden"
      style={{ border: "1px solid var(--color-gold-500)", background: "var(--color-ink-800)" }}
    >
      {image ? (
        <>
          <img
            src={image}
            alt={`Film still from ${title}.`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(21,19,15,0.15) 0%, rgba(21,19,15,0.4) 55%, rgba(21,19,15,0.9) 100%)",
            }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(184,138,62,0.16) 0%, rgba(21,19,15,0) 70%)",
          }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-2"
        style={{ border: "1px solid rgba(184,138,62,0.45)" }}
      />
      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <Eyebrow tone="gold">Film</Eyebrow>
          {year && <Eyebrow tone="gold">{year}</Eyebrow>}
        </div>
        <div>
          <h4
            className="font-display"
            style={{
              color: "var(--color-on-ink)",
              fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
              fontWeight: 500,
              letterSpacing: "0.02em",
              lineHeight: 1,
              textShadow: image ? "0 2px 12px rgba(0,0,0,0.6)" : undefined,
            }}
          >
            {title}
          </h4>
          <p className="mt-2 italic" style={{ color: "var(--color-on-ink-dim)" }}>
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Two audiences, two summaries, one dataset. A festival programmer and a
 * casting director want different first screens; both render from
 * FACT_SHEETS so a credit added once appears in the right place.
 */
function FactSheets() {
  const keys = ["programmers", "casting"] as const;
  const [active, setActive] = useState<(typeof keys)[number]>("programmers");
  const sheet = FACT_SHEETS[active];

  return (
    <section
      id="sheets"
      className="scroll-mt-24 px-6 py-24 md:py-32"
      style={{ background: "var(--color-parchment-200)" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <Reveal>
          <Eyebrow>At a Glance</Eyebrow>
          <h3
            className="font-display mt-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 500, lineHeight: 1.05 }}
          >
            One-sheets.
          </h3>
          <p className="mt-6 max-w-[56ch]" style={{ color: "var(--color-on-parch-dim)" }}>
            The same career, summarised for the question you came with.
          </p>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap gap-3" delay={80}>
          {keys.map((k) => {
            const on = active === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setActive(k)}
                aria-pressed={on}
                className="border px-5 py-3 transition-colors"
                style={{
                  borderColor: on ? "var(--color-oxblood-600)" : "rgba(184,138,62,0.5)",
                  background: on ? "var(--color-oxblood-600)" : "transparent",
                  color: on ? "var(--color-on-ink)" : "var(--color-on-parch)",
                }}
              >
                <span className="eyebrow">{FACT_SHEETS[k].label}</span>
              </button>
            );
          })}
        </Reveal>

        <Reveal className="mt-10" delay={120}>
          <p className="font-display italic" style={{ fontSize: "1.25rem" }}>
            {sheet.blurb}
          </p>
          <dl className="mt-8 border-t" style={{ borderColor: "rgba(184,138,62,0.35)" }}>
            {sheet.facts.map((f) => (
              <div
                key={f.k}
                className="grid gap-2 border-b py-5 md:grid-cols-[220px_1fr] md:gap-8"
                style={{ borderColor: "rgba(184,138,62,0.35)" }}
              >
                <dt>
                  <Eyebrow tone="oxblood">{f.k}</Eyebrow>
                </dt>
                <dd className="font-display" style={{ fontSize: "1.15rem", lineHeight: 1.4 }}>
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={`mailto:${active === "casting" ? ARTIST.email : ARTIST.workEmail}`}
              className="border px-6 py-4 transition-colors"
              style={{
                borderColor: "var(--color-oxblood-600)",
                background: "var(--color-oxblood-600)",
                color: "var(--color-on-ink)",
              }}
            >
              <span className="eyebrow">
                {active === "casting" ? "Enquire about casting" : "Enquire about booking"}
              </span>
            </a>
            {active === "casting" && (
              <a
                href={ARTIST.imdbUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="border px-6 py-4"
                style={{ borderColor: "rgba(184,138,62,0.6)", color: "var(--color-on-parch)" }}
              >
                <span className="eyebrow">View IMDb</span>
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
