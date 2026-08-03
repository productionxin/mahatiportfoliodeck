import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ARTIST, PLATES, REGISTER_LABELS, type Register } from "@/content";
import { Body, Label, PageTitle, PageTop, Reveal, Section, useLightbox } from "@/site/ui";
import { useSwipe } from "@/site/motion";
import { requireAsset } from "@/site/assets";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Gallery — Mahati Bhikshu" },
      {
        name: "description",
        content: "Photographs from stage, studio, portrait, cinema and archive.",
      },
    ],
  }),
});

const FILTERS: (Register | "all")[] = ["all", "stage", "studio", "portrait", "film", "archive"];

/**
 * The photographs.
 *
 * The library holds five registers that fight each other when mixed — stage
 * light, controlled studio, cinematic portraiture, 16:9 trailer frames and
 * grainy archive. Rather than blending them the gallery filters by register,
 * so a visitor reads one at a time.
 */
function Gallery() {
  const [filter, setFilter] = useState<Register | "all">("all");
  const shown = useMemo(
    () => (filter === "all" ? PLATES : PLATES.filter((p) => p.register === filter)),
    [filter],
  );
  const { open, setOpen } = useLightbox(shown.length);
  const step = (d: number) =>
    setOpen((o) => (o === null ? 0 : (o + d + shown.length) % shown.length));
  const swipe = useSwipe(
    () => step(1),
    () => step(-1),
  );

  return (
    <main>
      <PageTop>
        <Section className="pb-12 md:pb-16">
          <Reveal>
            <PageTitle>Gallery</PageTitle>
            <Body dim className="mx-auto mt-8 text-center" measure="58ch">
              Photographs from performance, studio sessions, portraiture, film and the archive.
            </Body>
          </Reveal>
        </Section>

        {/* Filters read as one control: a hairline rail with the registers
            sitting on it, rather than seven links floating in space. */}
        <Section className="pb-14 md:pb-16">
          <Reveal>
            <div
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 border-y"
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
                    {/* Underline sits under the whole control, drawn on the
                        rail so the active register reads as selected rather
                        than merely coloured. */}
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
          </Reveal>
        </Section>

        <Section className="pb-24 md:pb-32">
          {/* Column flow rather than a rigid grid. The plates run 2:3, 3:2,
              16:9, 2:1 and 1:1; forcing them into equal grid cells left holes
              wherever a landscape frame spanned two columns and pushed the
              captions to inconsistent heights. Columns let every frame keep
              its own crop and close the gaps by themselves. */}
          <div className="gallery-columns">
            {shown.map((p, i) => (
              <Reveal
                key={p.asset}
                delay={Math.min(i, 6) * 40}
                className="mb-8 break-inside-avoid md:mb-10"
              >
                <figure>
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    // Space is reserved from the stored ratio so nothing
                    // reflows as the images arrive.
                    className="group relative block w-full overflow-hidden"
                    style={{ aspectRatio: p.ratio ?? "2/3" }}
                    aria-label={`View: ${p.caption}`}
                  >
                    <img
                      src={requireAsset(p.asset)}
                      alt={p.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 55%, var(--scrim-hero-foot) 100%)",
                      }}
                    />
                  </button>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                    <span className="font-display" style={{ fontSize: "1.05rem" }}>
                      {p.caption}
                    </span>
                    <Label tone="dim">{REGISTER_LABELS[p.register]}</Label>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 text-center">
            <Body dim className="mx-auto" measure="52ch">
              Archival images are frames from video and are reproduced as found.
            </Body>
          </Reveal>
        </Section>
      </PageTop>

      {open !== null && shown[open] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shown[open].caption}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          style={{ background: "var(--scrim-lightbox)" }}
          onClick={() => setOpen(null)}
          {...swipe}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            // Padded to clear the 44px minimum touch target; the label alone
            // gave a ~40x14 hit area.
            className="absolute right-3 top-3 px-4 py-3"
            aria-label="Close"
          >
            <span className="eyebrow" style={{ color: "var(--color-on-dark)" }}>
              Close
            </span>
          </button>
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-4 text-3xl md:left-10"
            style={{ color: "var(--color-on-dark)" }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (o === null ? 0 : (o - 1 + shown.length) % shown.length));
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-4 text-3xl md:right-10"
            style={{ color: "var(--color-on-dark)" }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (o === null ? 0 : (o + 1) % shown.length));
            }}
            aria-label="Next"
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
              className="mt-4 flex flex-wrap items-baseline justify-between gap-4"
              style={{ color: "var(--color-on-dark)" }}
            >
              <span className="font-display" style={{ fontSize: "1.1rem" }}>
                {shown[open].caption}
              </span>
              <span className="eyebrow" style={{ color: "var(--color-on-dark-dim)" }}>
                {open + 1} / {shown.length} · {REGISTER_LABELS[shown[open].register]}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
