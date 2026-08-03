import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { BACK_MATTER, PLATES, REGISTER_LABELS, type Register } from "@/content";
import { Page } from "@/book/Layout";
import {
  Display,
  Eyebrow,
  PlateFrame,
  Reveal,
  Rule,
  toRoman,
  useLightbox,
} from "@/book/primitives";
import { requireAsset } from "@/book/assets";

export const Route = createFileRoute("/plates")({
  component: Plates,
  head: () => ({
    meta: [
      { title: "Plates — Mahati Bhikshu" },
      { name: "description", content: "The photographic record, catalogued by register." },
    ],
  }),
});

const FILTERS: (Register | "all")[] = ["all", "stage", "studio", "portrait", "film", "archive"];

/**
 * The plate section.
 *
 * The library holds five visual registers that fight each other when mixed —
 * theatrical stage light, controlled studio, cinematic portraiture, 16:9
 * trailer frames, and grainy archive. Rather than blend them, the catalogue
 * declares each plate's register and lets a visitor read one at a time.
 */
function Plates() {
  const folio = BACK_MATTER.find((b) => b.to === "/plates")?.folio ?? 64;
  const [filter, setFilter] = useState<Register | "all">("all");

  // Plate numbers are assigned over the full catalogue, not the filtered view,
  // so a given photograph keeps the same number however you arrive at it.
  const numbered = useMemo(() => PLATES.map((p, i) => ({ ...p, n: i + 1 })), []);
  const shown = useMemo(
    () => (filter === "all" ? numbered : numbered.filter((p) => p.register === filter)),
    [filter, numbered],
  );

  const { open, setOpen } = useLightbox(shown.length);

  return (
    <Page runningHead="Plates" folio={folio} tone="ink">
      <section className="py-16 md:py-24">
        <Reveal>
          <Eyebrow tone="gold">Back Matter</Eyebrow>
          <Display as="h1" size="clamp(2.6rem, 7vw, 5rem)" className="mt-5">
            Plates
          </Display>
          <Rule className="mt-9 w-20" />
          <p className="mt-8 max-w-[58ch]" style={{ color: "var(--color-on-ink-dim)" }}>
            The photographic record, catalogued. Stage light, studio, portrait, cinema and archive
            are kept apart rather than blended — each reads differently, and mixing them flattens
            all of them.
          </p>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap gap-3" delay={80}>
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
                className="border px-4 py-2.5 transition-colors"
                style={{
                  borderColor: on ? "var(--color-gold-400)" : "rgba(184,138,62,0.45)",
                  background: on ? "var(--color-gold-400)" : "transparent",
                  color: on ? "var(--color-ink-900)" : "var(--color-on-ink)",
                }}
              >
                <span className="eyebrow">
                  {REGISTER_LABELS[f]} <span style={{ opacity: 0.65 }}>{count}</span>
                </span>
              </button>
            );
          })}
        </Reveal>

        {/* Film plates are 16:9 and get their own column rhythm; everything
            else is 2:3, the ratio the photography was framed at. */}
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal
              key={p.asset}
              delay={(i % 3) * 90}
              className={p.register === "film" ? "sm:col-span-2 lg:col-span-2" : undefined}
            >
              <PlateFrame
                src={requireAsset(p.asset)}
                alt={p.alt}
                caption={p.caption}
                number={p.n}
                ratio={p.register === "film" ? "16/9" : "2/3"}
                tone="ink"
                onClick={() => setOpen(i)}
              />
            </Reveal>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="py-16 font-display italic" style={{ color: "var(--color-on-ink-dim)" }}>
            No plates in this register.
          </p>
        )}

        <Reveal className="mt-20">
          <Link
            to="/honours"
            className="inline-block border px-6 py-4 transition-opacity hover:opacity-75"
            style={{ borderColor: "var(--color-gold-500)" }}
          >
            <Eyebrow tone="gold">Next — Honours →</Eyebrow>
          </Link>
        </Reveal>
      </section>

      {open !== null && shown[open] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shown[open].caption}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ background: "rgba(21,19,15,0.96)" }}
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 border px-4 py-2.5"
            style={{ borderColor: "var(--color-gold-500)", color: "var(--color-on-ink)" }}
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            <span className="eyebrow">Close</span>
          </button>

          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-3xl md:left-10"
            style={{ color: "var(--color-gold-400)" }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (o === null ? 0 : (o - 1 + shown.length) % shown.length));
            }}
            aria-label="Previous plate"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-3xl md:right-10"
            style={{ color: "var(--color-gold-400)" }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (o === null ? 0 : (o + 1) % shown.length));
            }}
            aria-label="Next plate"
          >
            ›
          </button>

          <figure className="max-h-[88vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={requireAsset(shown[open].asset)}
              alt={shown[open].alt}
              className="mx-auto max-h-[78vh] w-auto object-contain"
            />
            <figcaption
              className="mt-5 flex flex-wrap items-baseline justify-between gap-4"
              style={{ color: "var(--color-on-ink)" }}
            >
              <span className="font-display italic">{shown[open].caption}</span>
              <span className="eyebrow" style={{ color: "var(--color-gold-400)" }}>
                Plate {toRoman(shown[open].n)} · {REGISTER_LABELS[shown[open].register]}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </Page>
  );
}
