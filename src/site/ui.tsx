/**
 * Shared UI for the site.
 *
 * The design is quiet: a blush paper ground, near-black text, one rust accent
 * reserved for small labels, and hairline rules. Photographs carry all the
 * contrast, so these primitives stay deliberately plain.
 */
import { useEffect, useRef, useState } from "react";

import { useInView } from "./motion";

/* --------------------------------- reveal -------------------------------- */

/**
 * Fades and lifts its children in the first time they reach the viewport.
 *
 * Anything else passed in is forwarded to the rendered element. That is not
 * cosmetic: without it every `style` and every event handler a caller wrote
 * was silently swallowed, so rows that were supposed to carry a rule or
 * respond to hover simply did nothing.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  style,
  ...rest
}: {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // See useInView: something already scrolled past never reports
          // again, so it has to be counted as arrived here and now.
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref as never}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * Display type that rises out of a mask, one word at a time.
 *
 * Words, not letters: letter-by-letter is the cliché of the genre and it
 * shreds the kerning of a serif this fine. The stagger is short enough that
 * a four-word line still resolves in under a second.
 *
 * The words stay in the DOM as ordinary text, so this reads normally to a
 * screen reader and to a search engine — only the paint is animated.
 */
export function Lift({
  children,
  className = "",
  step = 70,
  as: Tag = "span",
  style,
}: {
  children: string;
  className?: string;
  step?: number;
  as?: "span" | "h1" | "h2" | "h3";
  style?: React.CSSProperties;
}) {
  const ref = useInView<HTMLElement>(0.25);
  const words = children.split(" ");
  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref as never} className={className} style={style}>
      {words.map((w, i) => (
        // The space sits between the masks, never inside one: a trailing
        // space in an inline-block with overflow:hidden collapses away and
        // the words would close up against each other.
        <span key={`${w}-${i}`} className="lift" data-space={i < words.length - 1}>
          <span style={{ ["--lift-delay" as string]: `${i * step}ms` }}>{w}</span>
        </span>
      ))}
    </Comp>
  );
}

/* -------------------------------- lettering ------------------------------ */

export function Label({
  children,
  tone = "accent",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "accent" | "dim" | "light";
  className?: string;
}) {
  const color = {
    accent: "var(--color-rust)",
    dim: "var(--color-text-dim)",
    light: "var(--color-on-dark-dim)",
  }[tone];
  return (
    <span className={`eyebrow ${className}`} style={{ color }}>
      {children}
    </span>
  );
}

/**
 * Page title. Centred by default, as the reference sets its section heads,
 * and sized to dominate the top of the page. It rises out of a mask on
 * arrival, so every section opens with the same gesture.
 */
export function PageTitle({
  children,
  align = "center",
  className = "",
}: {
  children: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Lift
      as="h1"
      step={90}
      className={`font-display ${align === "center" ? "text-center" : ""} ${className}`}
      style={{ fontSize: "var(--text-h1)", lineHeight: 1.02 }}
    >
      {children}
    </Lift>
  );
}

export function Heading({
  children,
  as = "h2",
  size = "var(--text-h2)",
  italic = false,
  className = "",
  color,
}: {
  children: React.ReactNode;
  as?: "h2" | "h3" | "h4";
  size?: string;
  italic?: boolean;
  className?: string;
  color?: string;
}) {
  const Comp = as;
  return (
    <Comp
      className={`font-display ${className}`}
      style={{ fontSize: size, fontStyle: italic ? "italic" : undefined, color }}
    >
      {children}
    </Comp>
  );
}

export function Body({
  children,
  className = "",
  dim = false,
  measure = "68ch",
}: {
  children: React.ReactNode;
  className?: string;
  dim?: boolean;
  measure?: string;
}) {
  return (
    <p
      className={className}
      style={{ color: dim ? "var(--color-text-dim)" : undefined, maxWidth: measure }}
    >
      {children}
    </p>
  );
}

/**
 * A rule. It draws itself across from the leading edge when its section
 * arrives, which turns the dozens of hairlines on this site from furniture
 * into part of the page turning over. `static` opts out where the rule is
 * structural rather than decorative.
 */
export function Hairline({
  className = "",
  strong = false,
  delay = 0,
  static: isStatic = false,
}: {
  className?: string;
  strong?: boolean;
  delay?: number;
  static?: boolean;
}) {
  const ref = useInView<HTMLSpanElement>(0.2);
  return (
    <span
      aria-hidden
      ref={isStatic ? undefined : ref}
      className={`block ${isStatic ? "" : "rule-draw"} ${className}`}
      style={{
        height: 1,
        background: strong ? "var(--color-hairline-strong)" : "var(--color-hairline)",
        ["--rule-delay" as string]: `${delay}ms`,
      }}
    />
  );
}

/**
 * An endless horizontal run of short items. Used where a list is long,
 * unranked and visually inert as a column — the festivals Mahati has been
 * carried to are exactly that, and set as a ticker they read as a body of
 * work rather than a spreadsheet.
 *
 * The children are rendered twice and the track travels exactly half its
 * width, so the loop has no seam. The duplicate is hidden from assistive
 * technology; the first run is the real list.
 */
export function Marquee({
  items,
  duration = 68,
  reverse = false,
  className = "",
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  // A run has to be wider than the widest viewport or the track leaves a gap
  // at the end of each cycle. Three city names do not manage that on their
  // own, so the list is repeated until a run is long enough to fill it.
  const reps = Math.max(1, Math.ceil(9 / items.length));
  const filled = Array.from({ length: reps }).flatMap(() => items);
  const run = () => (
    <ul className="flex shrink-0 items-center" aria-hidden>
      {filled.map((item, i) => (
        <li key={`${item}-${i}`} className="flex shrink-0 items-center">
          <span
            className="font-display whitespace-nowrap"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.3rem)" }}
          >
            {item}
          </span>
          <span
            aria-hidden
            className="mx-6 inline-block md:mx-9"
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: "var(--color-rust)",
              opacity: 0.75,
            }}
          />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee w-full overflow-hidden ${className}`}>
      {/* The moving copy is repeated and therefore lies about how many items
          there are, so all of it is hidden from assistive technology and the
          real list is carried once, out of sight. */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div
        className="marquee-track"
        data-reverse={reverse}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {run()}
        {run()}
      </div>
    </div>
  );
}

/* --------------------------------- layout -------------------------------- */

/** Standard page frame: clears the fixed header and holds the measure. */
export function Section({
  children,
  className = "",
  width = "wide",
  tone = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "wide" | "text";
  tone?: "paper" | "deep";
}) {
  const max = width === "text" ? "max-w-[820px]" : "max-w-[1240px]";
  return (
    <section
      className={className}
      style={tone === "deep" ? { background: "var(--color-paper-deep)" } : undefined}
    >
      <div className={`mx-auto ${max} px-6 md:px-10`}>{children}</div>
    </section>
  );
}

/** Adds the top offset every page needs to clear the fixed header. */
export function PageTop({ children }: { children: React.ReactNode }) {
  return <div className="pt-24 md:pt-32">{children}</div>;
}

/* --------------------------------- media --------------------------------- */

/**
 * A plate. The frame wipes open from the bottom edge as it arrives while the
 * photograph inside settles back from a slight over-scale — two speeds, which
 * is what keeps it from reading as a stock fade-in.
 *
 * `zoom` adds a slow push on hover for plates that are also links.
 */
export function Figure({
  src,
  alt,
  caption,
  credit,
  ratio = "2/3",
  onClick,
  priority = false,
  className = "",
  delay = 0,
  zoom = false,
  objectPosition,
}: {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  ratio?: string;
  onClick?: () => void;
  priority?: boolean;
  className?: string;
  delay?: number;
  zoom?: boolean;
  objectPosition?: string;
}) {
  // The observer sits on the <figure>, never on the clipped element — see
  // the note on .plate in styles.css.
  const frameRef = useInView<HTMLElement>(0.15);
  const media = (
    <div
      className="plate relative w-full overflow-hidden"
      style={{ aspectRatio: ratio, ["--plate-delay" as string]: `${delay}ms` }}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={`h-full w-full object-cover ${zoom ? "plate-zoom" : ""}`}
        style={{ objectPosition }}
      />
    </div>
  );
  return (
    <figure ref={frameRef as never} className={`w-full ${className}`}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="block w-full text-left"
          aria-label={caption ?? alt}
        >
          {media}
        </button>
      ) : (
        media
      )}
      {(caption || credit) && (
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          {caption && (
            <span className="font-display" style={{ fontSize: "1.15rem" }}>
              {caption}
            </span>
          )}
          {credit && <Label tone="dim">{credit}</Label>}
        </figcaption>
      )}
    </figure>
  );
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

/* ---------------------------------- links -------------------------------- */

/** Understated text link with the reference's trailing arrow. */
export function ArrowLink({
  children,
  href,
  external = false,
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="group inline-flex items-baseline gap-2 transition-opacity hover:opacity-60"
    >
      <span className="eyebrow" style={{ color: "var(--color-rust)" }}>
        {children}
      </span>
      <span aria-hidden style={{ color: "var(--color-rust)" }}>
        →
      </span>
    </a>
  );
}
