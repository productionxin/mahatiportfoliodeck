/**
 * Shared typographic furniture for the volume.
 *
 * The site is built as a bound book rather than a scrolling page, so these are
 * the parts a book actually has: rules, eyebrows (running heads and small
 * caps), folios (page numbers), epigraphs, and framed plates.
 */
import { useEffect, useRef, useState } from "react";

/* --------------------------------- reveal -------------------------------- */

export function useReveal<T extends HTMLElement>() {
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
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({
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

/* -------------------------------- lettering ------------------------------ */

export type Tone = "parch" | "ink" | "gold" | "oxblood" | "cinema";

const TONE_COLOR: Record<Tone, string> = {
  parch: "var(--color-on-parch-dim)",
  ink: "var(--color-on-ink-dim)",
  gold: "var(--color-gold-400)",
  /** Oxblood is only legible on parchment — 1.7:1 on the ink grounds. */
  oxblood: "var(--color-oxblood-600)",
  /** The same cinema register, tinted to clear 4.5:1 on ink. */
  cinema: "var(--color-oxblood-400)",
};

export function Eyebrow({
  children,
  tone = "parch",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`eyebrow ${className}`} style={{ color: TONE_COLOR[tone] }}>
      {children}
    </span>
  );
}

export function Rule({
  className = "",
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "faint";
}) {
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{
        height: 1,
        background: tone === "gold" ? "var(--color-gold-500)" : "rgba(184,138,62,0.3)",
      }}
    />
  );
}

/** Display heading. `level` picks the semantic tag; size is set independently. */
export function Display({
  children,
  as = "h2",
  size = "clamp(2rem, 4.6vw, 3.4rem)",
  italic = false,
  color,
  className = "",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  size?: string;
  italic?: boolean;
  color?: string;
  className?: string;
}) {
  const Comp = as;
  return (
    <Comp
      className={`font-display ${className}`}
      style={{
        fontSize: size,
        fontWeight: 500,
        lineHeight: 1.06,
        letterSpacing: "-0.01em",
        fontStyle: italic ? "italic" : undefined,
        color,
      }}
    >
      {children}
    </Comp>
  );
}

/* ---------------------------------- book --------------------------------- */

/** The printed page number, set in the outer corner as a book sets it. */
export function Folio({ n, tone = "parch" }: { n: number; tone?: "parch" | "ink" }) {
  return (
    <span
      className="font-display italic"
      style={{
        fontSize: "0.95rem",
        color: tone === "ink" ? "var(--color-on-ink-dim)" : "var(--color-on-parch-dim)",
      }}
    >
      {n}
    </span>
  );
}

export function Epigraph({
  children,
  tone = "parch",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "parch" | "ink";
  className?: string;
}) {
  return (
    <blockquote
      className={`font-display italic ${className}`}
      style={{
        fontSize: "clamp(1.25rem, 2.4vw, 1.7rem)",
        lineHeight: 1.42,
        color: tone === "ink" ? "var(--color-on-ink)" : "var(--color-oxblood-600)",
        maxWidth: "34ch",
      }}
    >
      {children}
    </blockquote>
  );
}

/**
 * A catalogued plate. Numbered and captioned in the manner of a printed plate
 * section, so the photography reads as a record rather than as decoration.
 */
export function PlateFrame({
  src,
  alt,
  caption,
  number,
  ratio = "2/3",
  tone = "ink",
  onClick,
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  number?: number;
  ratio?: string;
  tone?: "ink" | "parch";
  onClick?: () => void;
  priority?: boolean;
}) {
  const dim = tone === "ink" ? "var(--color-on-ink-dim)" : "var(--color-on-parch-dim)";
  const body = (
    <>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out"
        />
      </div>
      {(caption || number !== undefined) && (
        <figcaption className="mt-3 flex items-baseline justify-between gap-4">
          <span className="font-display italic" style={{ color: dim, fontSize: "0.98rem" }}>
            {caption}
          </span>
          {number !== undefined && <Eyebrow tone="gold">Pl. {toRoman(number)}</Eyebrow>}
        </figcaption>
      )}
    </>
  );

  if (!onClick) return <figure className="w-full">{body}</figure>;
  return (
    <figure className="w-full">
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
        data-cursor="View"
        aria-label={`View plate ${number !== undefined ? toRoman(number) : ""} — ${caption ?? alt}`}
      >
        {body}
      </button>
    </figure>
  );
}

/** Roman numerals for plate numbering. Values here never exceed a few dozen. */
export function toRoman(n: number): string {
  const table: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  let rest = n;
  for (const [v, s] of table) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
}

/* -------------------------------- lightbox ------------------------------- */

export function useLightbox(count: number) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? 0 : (o + 1) % count));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? 0 : (o - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, count]);
  return { open, setOpen };
}
