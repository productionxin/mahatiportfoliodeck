/**
 * The volume's binding.
 *
 * `Spine` is the persistent navigation — a narrow vertical strip at the left
 * edge on desktop carrying the chapter numerals, and a slim bar with a
 * contents drawer on narrow screens. `Page` supplies the running head and
 * folio that make each route read as a leaf of one book rather than a
 * separate web page. `PageTurn` is the prev/next at the foot of a chapter.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ARTIST, BACK_MATTER, CHAPTERS } from "@/content";
import { Eyebrow, Rule } from "./primitives";

const SPINE_W = 68;

/* --------------------------------- spine --------------------------------- */

function useCurrentPath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

export function Spine() {
  const path = useCurrentPath();
  const [open, setOpen] = useState(false);
  // The cover carries its own framing and its own way in; a binding strip
  // across it would break the one full-bleed image in the volume.
  const onCover = path === "/";

  useEffect(() => {
    setOpen(false);
  }, [path]);

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

  if (onCover) return null;

  return (
    <>
      {/* Desktop: the spine itself, held against the left edge. */}
      <nav
        aria-label="Contents"
        className="fixed inset-y-0 left-0 z-40 hidden flex-col items-center justify-between py-6 lg:flex"
        style={{
          width: SPINE_W,
          background: "var(--color-ink-900)",
          borderRight: "1px solid rgba(184,138,62,0.35)",
        }}
      >
        <Link to="/" className="grid place-items-center" aria-label="Cover">
          <span
            className="font-display italic"
            style={{ color: "var(--color-gold-400)", fontSize: "1.35rem", lineHeight: 1 }}
          >
            MB
          </span>
        </Link>

        <ul className="flex flex-col items-center gap-1">
          {CHAPTERS.map((c) => {
            const active = path === `/chapters/${c.slug}`;
            return (
              <li key={c.slug}>
                <Link
                  to="/chapters/$slug"
                  params={{ slug: c.slug }}
                  className="group grid h-11 w-11 place-items-center transition-opacity hover:opacity-100"
                  style={{ opacity: active ? 1 : 0.5 }}
                  title={`${c.numeral} — ${c.title}`}
                >
                  <span
                    className="font-display italic"
                    style={{
                      color: active ? "var(--color-gold-400)" : "var(--color-on-ink)",
                      fontSize: "1rem",
                    }}
                  >
                    {c.numeral}
                  </span>
                </Link>
              </li>
            );
          })}

          <li aria-hidden className="my-2">
            <span
              className="block"
              style={{ width: 18, height: 1, background: "rgba(184,138,62,0.5)" }}
            />
          </li>

          {BACK_MATTER.map((b) => {
            const active = path === b.to;
            return (
              <li key={b.to}>
                <Link
                  to={b.to}
                  className="grid h-11 w-11 place-items-center transition-opacity"
                  style={{ opacity: active ? 1 : 0.5 }}
                  title={b.label}
                >
                  <span
                    aria-hidden
                    className="block rounded-full"
                    style={{
                      width: active ? 7 : 5,
                      height: active ? 7 : 5,
                      background: active ? "var(--color-gold-400)" : "var(--color-on-ink)",
                    }}
                  />
                  <span className="sr-only">{b.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="grid h-11 w-11 place-items-center"
          aria-label="Open contents"
        >
          <span aria-hidden className="flex flex-col gap-[5px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block"
                style={{ width: 20, height: 1, background: "var(--color-gold-500)" }}
              />
            ))}
          </span>
        </button>
      </nav>

      {/* Narrow screens: a slim bar, since a vertical spine costs too much width. */}
      <div
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden"
        style={{
          background: "var(--color-ink-900)",
          borderBottom: "1px solid rgba(184,138,62,0.35)",
        }}
      >
        <Link to="/" aria-label="Cover">
          <span
            className="font-display italic"
            style={{ color: "var(--color-gold-400)", fontSize: "1.15rem" }}
          >
            Mahati Bhikshu
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border px-3 py-2"
          style={{ borderColor: "var(--color-gold-500)" }}
          aria-label="Open contents"
        >
          <Eyebrow tone="gold">Contents</Eyebrow>
        </button>
      </div>

      {open && <ContentsOverlay onClose={() => setOpen(false)} path={path} />}
    </>
  );
}

/* ------------------------------ contents sheet --------------------------- */

function ContentsOverlay({ onClose, path }: { onClose: () => void; path: string }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contents"
      className="fixed inset-0 z-[70] overflow-y-auto"
      style={{ background: "var(--color-ink-900)", color: "var(--color-on-ink)" }}
    >
      <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex items-start justify-between gap-6">
          <div>
            <Eyebrow tone="gold">{ARTIST.name}</Eyebrow>
            <h2
              className="font-display mt-3"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 500, lineHeight: 1 }}
            >
              Contents
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2.5"
            style={{ borderColor: "var(--color-gold-500)", color: "var(--color-on-ink)" }}
          >
            <Eyebrow tone="gold">Close</Eyebrow>
          </button>
        </div>

        <Rule className="mt-8" />

        <ol className="mt-6">
          {CHAPTERS.map((c) => (
            <ContentsRow
              key={c.slug}
              to="/chapters/$slug"
              params={{ slug: c.slug }}
              numeral={c.numeral}
              label={c.title}
              sub={c.subtitle}
              folio={c.folio}
              active={path === `/chapters/${c.slug}`}
            />
          ))}
        </ol>

        <div className="mt-12">
          <Eyebrow tone="gold">Back Matter</Eyebrow>
          <ol className="mt-4">
            {BACK_MATTER.map((b) => (
              <ContentsRow
                key={b.to}
                to={b.to}
                label={b.label}
                sub={b.description}
                folio={b.folio}
                active={path === b.to}
              />
            ))}
          </ol>
        </div>

        <div className="mt-14 border-t pt-6" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
          <a
            href={`mailto:${ARTIST.email}`}
            className="font-display text-lg italic"
            style={{ color: "var(--color-gold-400)" }}
          >
            {ARTIST.email}
          </a>
        </div>
      </div>
    </div>
  );
}

function ContentsRow({
  to,
  params,
  numeral,
  label,
  sub,
  folio,
  active,
}: {
  to: string;
  params?: Record<string, string>;
  numeral?: string;
  label: string;
  sub: string;
  folio: number;
  active: boolean;
}) {
  return (
    <li className="border-b" style={{ borderColor: "rgba(184,138,62,0.25)" }}>
      <Link
        to={to}
        params={params as never}
        className="flex items-baseline gap-4 py-4 transition-opacity hover:opacity-70 md:gap-6"
        style={{ color: active ? "var(--color-gold-400)" : "var(--color-on-ink)" }}
      >
        <span
          className="font-display w-8 shrink-0 italic"
          style={{ color: "var(--color-gold-500)", fontSize: "0.95rem" }}
        >
          {numeral ?? ""}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="font-display block"
            style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 500, lineHeight: 1.15 }}
          >
            {label}
          </span>
          <span className="mt-1 block text-sm" style={{ color: "var(--color-on-ink-dim)" }}>
            {sub}
          </span>
        </span>
        {/* Leader dots, the way a printed contents page sets them. */}
        <span
          aria-hidden
          className="hidden min-w-8 flex-1 self-center sm:block"
          style={{
            borderBottom: "1px dotted rgba(184,138,62,0.45)",
            transform: "translateY(-3px)",
          }}
        />
        <span
          className="font-display shrink-0 italic"
          style={{ color: "var(--color-on-ink-dim)", fontSize: "0.95rem" }}
        >
          {folio}
        </span>
      </Link>
    </li>
  );
}

/* ---------------------------------- page --------------------------------- */

/**
 * Wraps a route's content in the book's page furniture. `tone` sets the paper:
 * parchment for reading pages, ink for plate and cinema pages.
 */
export function Page({
  children,
  runningHead,
  folio,
  tone = "parch",
  className = "",
}: {
  children: React.ReactNode;
  runningHead: string;
  folio: number;
  tone?: "parch" | "ink";
  className?: string;
}) {
  const bg = tone === "ink" ? "var(--color-ink-900)" : "var(--color-parchment-100)";
  const fg = tone === "ink" ? "var(--color-on-ink)" : "var(--color-on-parch)";
  return (
    <div
      className={`min-h-screen pt-14 lg:pt-0 lg:pl-[68px] ${className}`}
      style={{ background: bg, color: fg }}
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <header className="flex items-baseline justify-between gap-6 py-6">
          <Eyebrow tone={tone === "ink" ? "ink" : "parch"}>{runningHead}</Eyebrow>
          <Eyebrow tone={tone === "ink" ? "ink" : "parch"}>{ARTIST.name}</Eyebrow>
        </header>
        <Rule tone="faint" />
        {children}
        <footer
          className="flex items-baseline justify-between gap-6 border-t py-6"
          style={{ borderColor: "rgba(184,138,62,0.3)" }}
        >
          <Eyebrow tone={tone === "ink" ? "ink" : "parch"}>{ARTIST.studio} — Portfolio</Eyebrow>
          <span
            className="font-display italic"
            style={{
              fontSize: "0.95rem",
              color: tone === "ink" ? "var(--color-on-ink-dim)" : "var(--color-on-parch-dim)",
            }}
          >
            {folio}
          </span>
        </footer>
      </div>
    </div>
  );
}

/* -------------------------------- page turn ------------------------------ */

/** Prev / next at the foot of a chapter, as a book sets its running feet. */
export function PageTurn({ slug }: { slug: string }) {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  const prev = i > 0 ? CHAPTERS[i - 1] : null;
  const next = i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : null;

  return (
    <nav
      aria-label="Chapter navigation"
      className="grid gap-px border-y sm:grid-cols-2"
      style={{ borderColor: "rgba(184,138,62,0.3)" }}
    >
      {prev ? (
        <Link
          to="/chapters/$slug"
          params={{ slug: prev.slug }}
          className="group py-10 pr-6 transition-opacity hover:opacity-70"
        >
          <Eyebrow tone="gold">← Previous · {prev.numeral}</Eyebrow>
          <span
            className="font-display mt-3 block"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)", fontWeight: 500, lineHeight: 1.1 }}
          >
            {prev.title}
          </span>
        </Link>
      ) : (
        <Link to="/" className="group py-10 pr-6 transition-opacity hover:opacity-70">
          <Eyebrow tone="gold">← Cover</Eyebrow>
          <span
            className="font-display mt-3 block"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)", fontWeight: 500, lineHeight: 1.1 }}
          >
            Contents
          </span>
        </Link>
      )}

      {next ? (
        <Link
          to="/chapters/$slug"
          params={{ slug: next.slug }}
          className="group py-10 transition-opacity hover:opacity-70 sm:border-l sm:pl-6 sm:text-right"
          style={{ borderColor: "rgba(184,138,62,0.3)" }}
        >
          <Eyebrow tone="gold">Next · {next.numeral} →</Eyebrow>
          <span
            className="font-display mt-3 block"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)", fontWeight: 500, lineHeight: 1.1 }}
          >
            {next.title}
          </span>
        </Link>
      ) : (
        <Link
          to="/plates"
          className="group py-10 transition-opacity hover:opacity-70 sm:border-l sm:pl-6 sm:text-right"
          style={{ borderColor: "rgba(184,138,62,0.3)" }}
        >
          <Eyebrow tone="gold">Back matter →</Eyebrow>
          <span
            className="font-display mt-3 block"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)", fontWeight: 500, lineHeight: 1.1 }}
          >
            Plates
          </span>
        </Link>
      )}
    </nav>
  );
}
