import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PLATES, REGISTER_LABELS, type Plate, type Register } from "@/content";
import { Body, Label, PageTitle, PageTop, Reveal, Section, useLightbox } from "@/site/ui";
import { usePrefersReducedMotion, useSwipe } from "@/site/motion";
import { requireAsset } from "@/site/assets";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Gallery — Mahati Bhikshu" },
      {
        name: "description",
        content: "Photographs from performance, studio, portrait, cinema and archive.",
      },
    ],
  }),
});

const FILTERS: (Register | "all")[] = ["all", "stage", "studio", "portrait", "film", "archive"];
type View = "wall" | "reel";

/**
 * The photographs.
 *
 * Two ways to look. The wall is a column flow — the plates run 2:3, 3:2, 16:9,
 * 2:1 and 1:1, and columns let each keep its own crop without leaving holes.
 * The reel hangs them at a single height on a dark ground and lets you walk
 * the length of it, which is how you would actually meet this work: a row of
 * lit frames you move along, one coming into focus as the last falls behind.
 */
function Gallery() {
  const [filter, setFilter] = useState<Register | "all">("all");
  const [view, setView] = useState<View>("wall");

  const shown = useMemo(
    () => (filter === "all" ? PLATES : PLATES.filter((p) => p.register === filter)),
    [filter],
  );
  const { open, setOpen } = useLightbox(shown.length);
  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? 0 : (o + d + shown.length) % shown.length)),
    [setOpen, shown.length],
  );
  const swipe = useSwipe(
    () => step(1),
    () => step(-1),
  );

  return (
    <main>
      <PageTop>
        <Section className="pb-10 md:pb-12">
          <Reveal>
            <PageTitle>Gallery</PageTitle>
            <Body dim className="mx-auto mt-8 text-center" measure="56ch">
              Performance, studio, portrait, cinema and archive — kept apart, because each reads
              differently.
            </Body>
          </Reveal>
        </Section>

        {/* Filters and the view switch share one hairline rail. */}
        <Section className="pb-12 md:pb-14">
          <Reveal>
            <div
              className="flex flex-wrap items-center justify-center gap-x-7 gap-y-1 border-y"
              style={{ borderColor: "var(--color-hairline)" }}
            >
              {FILTERS.map((f) => {
                const on = filter === f;
                const count =
                  f === "all" ? PLATES.length : PLATES.filter((p) => p.register === f).length;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFilter(f);
                      setOpen(null);
                    }}
                    aria-pressed={on}
                    className="navlink tap relative gap-2 transition-opacity hover:opacity-60"
                    style={{ color: on ? "var(--color-rust)" : "var(--color-text)" }}
                  >
                    {REGISTER_LABELS[f]}
                    <span
                      className="eyebrow"
                      style={{
                        color: on ? "var(--color-rust)" : "var(--color-text-dim)",
                        opacity: on ? 1 : 0.7,
                      }}
                    >
                      {count}
                    </span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px transition-transform duration-300"
                      style={{
                        background: "var(--color-rust)",
                        transform: on ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-6">
              {(["wall", "reel"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className="tap gap-2 transition-opacity hover:opacity-60"
                >
                  <span
                    aria-hidden
                    className="inline-block transition-colors"
                    style={{
                      width: 22,
                      height: 1,
                      background: view === v ? "var(--color-rust)" : "var(--color-hairline-strong)",
                    }}
                  />
                  <span
                    className="eyebrow"
                    style={{
                      color: view === v ? "var(--color-rust)" : "var(--color-text-dim)",
                    }}
                  >
                    {v === "wall" ? "Wall" : "Walk the reel"}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        </Section>

        {view === "wall" ? (
          <Wall plates={shown} onOpen={setOpen} />
        ) : (
          <Reel plates={shown} onOpen={setOpen} />
        )}
      </PageTop>

      {open !== null && shown[open] && (
        <Lightbox
          plate={shown[open]}
          index={open}
          total={shown.length}
          onClose={() => setOpen(null)}
          onStep={step}
          swipe={swipe}
        />
      )}
    </main>
  );
}

/* ---------------------------------- wall --------------------------------- */

function Wall({ plates, onOpen }: { plates: Plate[]; onOpen: (i: number) => void }) {
  return (
    <Section className="pb-24 md:pb-32">
      <div className="gallery-columns">
        {plates.map((p, i) => (
          <Reveal
            key={p.asset}
            delay={Math.min(i, 6) * 40}
            className="mb-6 break-inside-avoid md:mb-8"
          >
            <button
              type="button"
              onClick={() => onOpen(i)}
              // Captions are deliberately not printed under every frame — on a
              // wall of thirty photographs that reads as clutter. The caption
              // rises on hover, and is always there in the enlarged view.
              className="group relative block w-full overflow-hidden"
              style={{ aspectRatio: p.ratio ?? "2/3" }}
              aria-label={p.caption ? `${p.caption} — enlarge` : "Enlarge photograph"}
            >
              <img
                src={requireAsset(p.asset)}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 45%, var(--scrim-hero-foot) 100%)",
                }}
              />
              <span
                className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{ color: "var(--color-on-dark)" }}
              >
                <span className="font-display text-left" style={{ fontSize: "1.02rem" }}>
                  {p.caption ?? ""}
                </span>
                <span className="eyebrow" style={{ color: "var(--color-on-dark-dim)" }}>
                  {REGISTER_LABELS[p.register]}
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------- reel --------------------------------- */

/**
 * The reel. Frames hang at one height on a dark ground and you move along
 * them — drag, scroll, or the arrow keys. The frame nearest the centre comes
 * up to full brightness while its neighbours sit back, so the thing you are
 * looking at is unambiguous without a caption under every picture.
 */
function Reel({ plates, onOpen }: { plates: Plate[]; onOpen: (i: number) => void }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  // Which frame is nearest the centre of the viewport.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement;
        const centre = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(centre - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [plates]);

  const scrollToIndex = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const child = el.children[i] as HTMLElement | undefined;
      if (!child) return;
      el.scrollTo({
        left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  // A vertical wheel over the reel should move it sideways — otherwise the
  // page scrolls away underneath and the reel never advances.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1 && e.deltaY > 0;
      // Let the page take over at either end, so the reel is not a trap.
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const current = plates[active];

  return (
    <section className="py-10 md:py-14" style={{ background: "var(--color-shadow)" }}>
      <div
        ref={trackRef}
        role="group"
        aria-label="Photographs — use the arrow keys to move along the reel"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollToIndex(Math.min(active + 1, plates.length - 1));
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollToIndex(Math.max(active - 1, 0));
          }
          if (e.key === "Enter") onOpen(active);
        }}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[42vw] py-2 md:gap-8 md:px-[38vw]"
        style={{ scrollbarWidth: "none" }}
      >
        {plates.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.asset}
              type="button"
              onClick={() => (on ? onOpen(i) : scrollToIndex(i))}
              aria-label={p.caption ? `${p.caption} — enlarge` : "Enlarge photograph"}
              className="relative h-[46vh] shrink-0 snap-center overflow-hidden transition-all duration-500 md:h-[62vh]"
              style={{
                aspectRatio: p.ratio ?? "2/3",
                opacity: on ? 1 : 0.38,
                transform: on ? "scale(1)" : "scale(0.9)",
              }}
            >
              <img
                src={requireAsset(p.asset)}
                alt={p.alt}
                loading="lazy"
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* One caption, for the frame you are actually looking at. */}
      <div className="mx-auto mt-8 flex max-w-[1240px] flex-wrap items-baseline justify-between gap-4 px-6 md:px-10">
        <span
          className="font-display"
          style={{ color: "var(--color-on-dark)", fontSize: "clamp(1.1rem, 2.4vw, 1.5rem)" }}
        >
          {current?.caption ?? ""}
        </span>
        <span className="eyebrow" style={{ color: "var(--color-on-dark-dim)" }}>
          {active + 1} / {plates.length} · {current ? REGISTER_LABELS[current.register] : ""}
        </span>
      </div>

      <div className="mx-auto mt-6 max-w-[1240px] px-6 md:px-10">
        {/* Position along the reel, as a filling rule. */}
        <div style={{ height: 1, background: "var(--color-on-dark-dim)", opacity: 0.25 }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${((active + 1) / Math.max(plates.length, 1)) * 100}%`,
              background: "var(--color-rust-soft)",
            }}
          />
        </div>
        <p className="eyebrow mt-4" style={{ color: "var(--color-on-dark-dim)" }}>
          Drag, scroll or use the arrow keys · select the centred frame to enlarge
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- lightbox ------------------------------- */

function Lightbox({
  plate,
  index,
  total,
  onClose,
  onStep,
  swipe,
}: {
  plate: Plate;
  index: number;
  total: number;
  onClose: () => void;
  onStep: (d: number) => void;
  swipe: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={plate.caption ?? "Photograph"}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: "var(--scrim-lightbox)" }}
      onClick={onClose}
      {...swipe}
    >
      <button
        type="button"
        onClick={onClose}
        className="tap absolute right-3 top-3 px-4"
        aria-label="Close"
      >
        <span className="eyebrow" style={{ color: "var(--color-on-dark)" }}>
          Close
        </span>
      </button>
      <button
        type="button"
        className="tap absolute left-2 top-1/2 w-12 -translate-y-1/2 justify-center text-3xl md:left-8"
        style={{ color: "var(--color-on-dark)" }}
        onClick={(e) => {
          e.stopPropagation();
          onStep(-1);
        }}
        aria-label="Previous photograph"
      >
        ‹
      </button>
      <button
        type="button"
        className="tap absolute right-2 top-1/2 w-12 -translate-y-1/2 justify-center text-3xl md:right-8"
        style={{ color: "var(--color-on-dark)" }}
        onClick={(e) => {
          e.stopPropagation();
          onStep(1);
        }}
        aria-label="Next photograph"
      >
        ›
      </button>
      <figure className="max-h-[88vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
        <img
          src={requireAsset(plate.asset)}
          alt={plate.alt}
          className="mx-auto max-h-[78vh] w-auto object-contain"
        />
        <figcaption
          className="mt-4 flex flex-wrap items-baseline justify-between gap-4"
          style={{ color: "var(--color-on-dark)" }}
        >
          <span className="font-display" style={{ fontSize: "1.1rem" }}>
            {plate.caption ?? ""}
          </span>
          <span className="eyebrow" style={{ color: "var(--color-on-dark-dim)" }}>
            {index + 1} / {total} · {REGISTER_LABELS[plate.register]}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
