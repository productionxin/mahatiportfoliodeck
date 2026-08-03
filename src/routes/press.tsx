import { createFileRoute } from "@tanstack/react-router";

import { PRESS } from "@/content";
import { ArrowLink, Body, Heading, Label, PageTitle, PageTop, Reveal, Section } from "@/site/ui";
import { requireAsset } from "@/site/assets";

export const Route = createFileRoute("/press")({
  component: Press,
  head: () => ({
    meta: [
      { title: "Press — Mahati Bhikshu" },
      { name: "description", content: "Selected writing on the work." },
    ],
  }),
});

const KIND_LABEL: Record<string, string> = {
  feature: "Feature",
  review: "Recital",
  coverage: "Coverage",
};

/**
 * Selected press.
 *
 * The archive holds around twenty-five clippings, but roughly twenty are one
 * recital notice syndicated across the Telugu dailies. Printing all of them
 * would read as padding, so the syndication appears once and is named as such.
 */
function Press() {
  return (
    <main>
      <PageTop>
        <Section className="pb-14 md:pb-20">
          <Reveal>
            <PageTitle>Press</PageTitle>
            <Body dim className="mx-auto mt-8 text-center" measure="58ch">
              Selected writing on the work.
            </Body>
          </Reveal>
        </Section>

        <Section className="pb-24 md:pb-32">
          <ul>
            {PRESS.map((p, i) => (
              <Reveal
                as="li"
                key={p.headline}
                delay={i * 90}
                className="py-12 md:py-16"
                {...({ style: { borderTop: "1px solid var(--color-hairline)" } } as object)}
              >
                {/* The clipping runs alongside the entry. Press without the
                    page is a claim; with it, it is evidence — and this page
                    had no image on it at all. */}
                <div className="grid gap-6 md:grid-cols-[260px_1fr] md:gap-12">
                  <div>
                    {p.image && (
                      <div
                        className="mb-5 w-full overflow-hidden"
                        style={{
                          aspectRatio: p.ratio ?? "3/4",
                          border: "1px solid var(--color-hairline-strong)",
                          background: "var(--color-paper-deep)",
                        }}
                      >
                        <img
                          src={requireAsset(p.image)}
                          alt={`${p.outlet} — ${p.headline}`}
                          loading="lazy"
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                    )}
                    <Label>{KIND_LABEL[p.kind] ?? p.kind}</Label>
                    <p className="eyebrow mt-2" style={{ color: "var(--color-text-dim)" }}>
                      {p.date}
                    </p>
                  </div>
                  <div>
                    <Heading as="h2" size="clamp(1.5rem, 3.4vw, 2.4rem)">
                      {p.headline}
                    </Heading>
                    <p
                      className="font-display mt-3 italic"
                      style={{ color: "var(--color-text-dim)", fontSize: "1.1rem" }}
                    >
                      {p.outlet}
                    </p>
                    <Body dim className="mt-5">
                      {p.summary}
                    </Body>
                    {p.url && (
                      <div className="mt-6">
                        <ArrowLink href={p.url} external>
                          Read the article
                        </ArrowLink>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>
      </PageTop>
    </main>
  );
}
