import { createFileRoute, Link } from "@tanstack/react-router";

import { BACK_MATTER, PRESS } from "@/content";
import { Page } from "@/book/Layout";
import { Display, Eyebrow, Reveal, Rule } from "@/book/primitives";

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
 * The archive holds around twenty-five clippings, but roughly twenty of them
 * are one recital notice syndicated across the Telugu dailies. Printing all
 * of them would read as padding, so the syndication is represented once and
 * named as syndication.
 */
function Press() {
  const folio = BACK_MATTER.find((b) => b.to === "/press")?.folio ?? 86;

  return (
    <Page runningHead="Press" folio={folio}>
      <section className="py-16 md:py-24">
        <Reveal className="max-w-[62ch]">
          <Eyebrow tone="oxblood">Back Matter</Eyebrow>
          <Display as="h1" size="clamp(2.6rem, 7vw, 5rem)" className="mt-5">
            Press
          </Display>
          <Rule className="mt-9 w-20" />
          <p className="mt-8" style={{ color: "var(--color-on-parch-dim)" }}>
            Three stories rather than a wall of clippings. The recital notice below ran across more
            than twenty Telugu dailies; it is one story, printed once.
          </p>
        </Reveal>
      </section>

      <ol className="border-t" style={{ borderColor: "rgba(184,138,62,0.35)" }}>
        {PRESS.map((p, i) => {
          const inner = (
            <>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <Eyebrow tone="oxblood">{KIND_LABEL[p.kind] ?? p.kind}</Eyebrow>
                <Eyebrow>{p.date}</Eyebrow>
              </div>
              <Display as="h2" size="clamp(1.5rem, 3.6vw, 2.5rem)" className="mt-4">
                {p.headline}
              </Display>
              <p
                className="mt-3 font-display italic"
                style={{ color: "var(--color-on-parch-dim)", fontSize: "1.05rem" }}
              >
                {p.outlet}
              </p>
              <p className="mt-5 max-w-[68ch]" style={{ color: "var(--color-on-parch-dim)" }}>
                {p.summary}
              </p>
              {p.url && (
                <span
                  className="eyebrow mt-6 inline-block"
                  style={{ color: "var(--color-gold-500)" }}
                >
                  Read the article →
                </span>
              )}
            </>
          );

          return (
            <Reveal
              as="li"
              key={p.headline}
              delay={i * 100}
              className="border-b py-12 md:py-16"
              {...({ style: { borderColor: "rgba(184,138,62,0.35)" } } as object)}
            >
              <div className="grid gap-4 md:grid-cols-[5rem_1fr] md:gap-10">
                <span
                  className="font-display italic"
                  style={{ color: "var(--color-gold-500)", fontSize: "1.1rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block transition-opacity hover:opacity-70"
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>

      <section className="py-16 md:py-24">
        <Reveal>
          <Link
            to="/contact"
            className="inline-block border px-6 py-4 transition-opacity hover:opacity-75"
            style={{ borderColor: "var(--color-gold-500)" }}
          >
            <Eyebrow tone="oxblood">Next — Correspondence →</Eyebrow>
          </Link>
        </Reveal>
      </section>
    </Page>
  );
}
