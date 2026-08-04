import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { BEHIND_CAMERA, FILMS } from "@/content";
import {
  Body,
  Hairline,
  Heading,
  Label,
  Lift,
  PageTitle,
  PageTop,
  Reveal,
  Section,
} from "@/site/ui";
import { asset } from "@/site/assets";
import { usePointerPreview } from "@/site/motion";

export const Route = createFileRoute("/film")({
  component: Film,
  head: () => ({
    meta: [
      { title: "Film — Mahati Bhikshu" },
      {
        name: "description",
        content:
          "Five features including the titular role in Kinnerasani, plus casting and acting-coach credits.",
      },
    ],
  }),
});

const FILM_STILL: Record<string, string> = {
  Sita: "film_sita.jpg",
  "George Reddy": "film_george_reddy.jpg",
  "Radhe Shyam": "film_radhe_shyam.jpg",
  Kinnerasani: "film_kinnerasani.jpg",
};

/**
 * Filmography.
 *
 * Set as an index of titles rather than a column of thumbnails. A casting
 * visitor reads names, not pictures — the titles are the scannable thing, so
 * they get the size, and the still arrives under the pointer for whichever
 * line is being read. Hovering the list dims the rest, so the page resolves to
 * one film at a time instead of sitting there as a block.
 *
 * On touch and under reduced motion the preview never appears, so the same
 * stills are printed inline beneath each title. The list is complete either
 * way; the hover is an enhancement, never the only route to the image.
 */
function Film() {
  const [hover, setHover] = useState<number | null>(null);
  const { ref, pos } = usePointerPreview<HTMLDivElement>();
  const preview = hover !== null ? FILM_STILL[FILMS[hover]!.title] : undefined;
  const previewSrc = preview ? asset(preview) : undefined;

  return (
    <main>
      <PageTop>
        <Section className="pb-14 md:pb-20">
          <Reveal>
            <PageTitle>Film</PageTitle>
            <Body dim className="mx-auto mt-8 text-center" measure="58ch">
              Five features to date, and the work behind the camera that came first.
            </Body>
          </Reveal>
        </Section>

        {/* ----------------------------- filmography ---------------------------- */}
        <Section className="pb-20 md:pb-28">
          <Reveal>
            <Label>On screen</Label>
            <Lift as="h2" className="font-display mt-4" style={{ fontSize: "var(--text-h2)" }}>
              Filmography.
            </Lift>
          </Reveal>

          <div ref={ref} className="relative mt-12">
            {/* The floating still. Rendered once and re-pointed, so moving
                between rows slides the same frame rather than cross-fading
                five stacked images. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
              style={{
                width: 380,
                transform: `translate3d(${(pos?.x ?? 0) - 190}px, ${(pos?.y ?? 0) - 107}px, 0)`,
                opacity: pos && previewSrc ? 1 : 0,
                transition: "opacity 420ms ease",
                willChange: "transform",
              }}
            >
              <div
                className="w-full overflow-hidden"
                style={{ aspectRatio: "16/9", background: "var(--color-shadow)" }}
              >
                {previewSrc && (
                  <img src={previewSrc} alt="" className="h-full w-full object-cover" />
                )}
              </div>
            </div>

            <ul className="index-list">
              {FILMS.map((f, i) => {
                const still = FILM_STILL[f.title];
                const src = still ? asset(still) : undefined;
                return (
                  <Reveal
                    as="li"
                    key={f.title}
                    delay={i * 70}
                    className="index-row"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <Hairline delay={i * 70} />
                    <div className="flex items-baseline justify-between gap-6 py-7 md:py-9">
                      <div className="flex items-baseline gap-5 md:gap-8">
                        <Label tone="dim">{String(i + 1).padStart(2, "0")}</Label>
                        <Heading as="h3" size="clamp(1.8rem, 5vw, 3.4rem)">
                          {f.title}
                        </Heading>
                      </div>
                      <p
                        className="eyebrow shrink-0 text-right"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        {f.year ?? "—"}
                      </p>
                    </div>
                    <p
                      className="-mt-4 pb-7 md:pb-9 md:pl-[calc(3rem+4ch)]"
                      style={{ color: "var(--color-text-dim)" }}
                    >
                      {f.note}
                    </p>
                    {/* Touch has no pointer to follow, so the still prints. */}
                    {src && (
                      <div
                        className="mb-8 w-full overflow-hidden md:hidden"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <img
                          src={src}
                          alt={`Film still from ${f.title}.`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </ul>
            <Hairline />
          </div>
        </Section>

        {/* --------------------------- behind the camera ------------------------ */}
        <Section className="py-20 md:py-28" tone="deep">
          <div className="grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-6">
              <Label>Before the camera ever saw her</Label>
              <Lift as="h2" className="font-display mt-4" style={{ fontSize: "var(--text-h2)" }}>
                Craft before performance.
              </Lift>
              <Body dim className="mt-6" measure="46ch">
                Her route into film ran backwards through it — coaching actors first, then casting
                them, and only afterwards appearing on screen.
              </Body>
            </Reveal>

            <Reveal className="md:col-span-6" delay={110}>
              <ul className="index-list">
                {BEHIND_CAMERA.map((b, i) => (
                  <li key={b.project} className="index-row py-6">
                    <Hairline strong delay={i * 80} className="mb-6" />
                    <Label tone="dim">{b.role}</Label>
                    <Heading as="h3" size="clamp(1.4rem, 2.6vw, 1.9rem)" className="mt-3">
                      {b.project}
                    </Heading>
                    {b.note && (
                      <Body dim className="mt-2" measure="42ch">
                        {b.note}
                      </Body>
                    )}
                  </li>
                ))}
              </ul>
              <Hairline strong className="mt-2" />
            </Reveal>
          </div>
        </Section>
      </PageTop>
    </main>
  );
}
