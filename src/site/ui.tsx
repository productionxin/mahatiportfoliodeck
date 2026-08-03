/**
 * Shared UI for the site.
 *
 * The design is quiet: a blush paper ground, near-black text, one rust accent
 * reserved for small labels, and hairline rules. Photographs carry all the
 * contrast, so these primitives stay deliberately plain.
 */
import { useEffect, useRef, useState } from "react";

/* --------------------------------- reveal -------------------------------- */

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
  const ref = useRef<HTMLElement | null>(null);
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
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
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
    accent: "var(--color-accent)",
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
 * and sized to dominate the top of the page.
 */
export function PageTitle({
  children,
  align = "center",
  className = "",
}: {
  children: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <h1
      className={`font-display ${align === "center" ? "text-center" : ""} ${className}`}
      style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)", lineHeight: 1.02 }}
    >
      {children}
    </h1>
  );
}

export function Heading({
  children,
  as = "h2",
  size = "clamp(1.8rem, 3.8vw, 2.9rem)",
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

export function Hairline({
  className = "",
  strong = false,
}: {
  className?: string;
  strong?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{
        height: 1,
        background: strong ? "var(--color-hairline-strong)" : "var(--color-hairline)",
      }}
    />
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

export function Figure({
  src,
  alt,
  caption,
  credit,
  ratio = "2/3",
  onClick,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  ratio?: string;
  onClick?: () => void;
  priority?: boolean;
  className?: string;
}) {
  const media = (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover"
      />
    </div>
  );
  return (
    <figure className={`w-full ${className}`}>
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
      <span className="eyebrow" style={{ color: "var(--color-accent)" }}>
        {children}
      </span>
      <span aria-hidden style={{ color: "var(--color-accent)" }}>
        →
      </span>
    </a>
  );
}
