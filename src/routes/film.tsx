import { createFileRoute } from "@tanstack/react-router";

import { BEHIND_CAMERA, FILMS } from "@/content";
import { Body, Hairline, Heading, Label, PageTitle, PageTop, Reveal, Section } from "@/site/ui";
import { asset } from "@/site/assets";

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
 * Filmography, set as poster-left / details-right rows like the reference's
 * events list. A casting visitor reads down the column; the stills are trailer
 * frames rather than press stills, so they sit at a modest size.
 */
function Film() {
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
            <Heading as="h2" className="mt-4">
              Filmography.
            </Heading>
          </Reveal>

          <ul className="mt-12">
            {FILMS.map((f, i) => {
              const still = FILM_STILL[f.title];
              const src = still ? asset(still) : undefined;
              return (
                <Reveal
                  as="li"
                  key={f.title}
                  delay={i * 80}
                  className="grid gap-6 py-10 md:grid-cols-[320px_1fr] md:gap-12"
                  {...({ style: { borderTop: "1px solid var(--color-hairline)" } } as object)}
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: "16/9",
                      background: src ? undefined : "var(--color-paper-edge)",
                    }}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={`Film still from ${f.title}.`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span
                        className="absolute inset-0 grid place-items-center font-display italic"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        Still to come
                      </span>
                    )}
                  </div>

                  <div>
                    <Heading as="h3" size="clamp(1.6rem, 3.2vw, 2.4rem)">
                      {f.title}
                    </Heading>
                    <p className="mt-3 eyebrow" style={{ color: "var(--color-text-dim)" }}>
                      {f.year ? `${f.year} · ` : ""}
                      {f.note}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </Section>

        {/* --------------------------- behind the camera ------------------------ */}
        <Section className="py-20 md:py-28" tone="deep">
          <div className="grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-6">
              <Label>Before the camera ever saw her</Label>
              <Heading as="h2" className="mt-4">
                Craft before performance.
              </Heading>
              <Body dim className="mt-6" measure="46ch">
                Her route into film ran backwards through it — coaching actors first, then casting
                them, and only afterwards appearing on screen.
              </Body>
            </Reveal>

            <Reveal className="md:col-span-6" delay={110}>
              <ul>
                {BEHIND_CAMERA.map((b) => (
                  <li
                    key={b.project}
                    className="py-6"
                    style={{ borderTop: "1px solid var(--color-hairline-strong)" }}
                  >
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
