import { createFileRoute, Link } from "@tanstack/react-router";

import { ARTIST, BACK_MATTER, CHAPTERS } from "@/content";
import { Display, Eyebrow, Rule } from "@/book/primitives";
import coverHero from "@/assets/cover_hero.jpg";

export const Route = createFileRoute("/")({
  component: Cover,
  head: () => ({
    meta: [
      { property: "og:image", content: coverHero },
      { name: "twitter:image", content: coverHero },
    ],
  }),
});

/**
 * The cover and the contents page — the volume's front matter.
 *
 * Deliberately not a scrolling summary of everything: a cover's job is to
 * name the work and open, so the whole first screen is the photograph and the
 * title, and the contents follow as their own leaf.
 */
function Cover() {
  return (
    <main style={{ background: "var(--color-ink-900)", color: "var(--color-on-ink)" }}>
      {/* -------------------------------- cover ------------------------------- */}
      <section className="relative flex h-[100svh] min-h-[620px] w-full flex-col overflow-hidden">
        <img
          src={coverHero}
          alt="Mahati Bhikshu in a red silk blouse and gold-woven silk drape, one hand raised in a mudra, against a black backdrop hung with temple garlands."
          className="absolute inset-0 h-full w-full object-cover"
          // A portrait plate in a landscape frame fills the width, so only the
          // vertical component does anything here — it holds her face high.
          style={{ objectPosition: "50% 26%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,19,15,0.72) 0%, rgba(21,19,15,0.12) 32%, rgba(21,19,15,0.15) 52%, rgba(21,19,15,0.9) 100%)",
          }}
        />
        {/* A scrim down the binding edge. The title sits over her raised arm,
            and without this the lettering loses its counters against the silk. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(21,19,15,0.86) 0%, rgba(21,19,15,0.55) 28%, rgba(21,19,15,0) 58%)",
          }}
        />

        {/* A ruled border, held inside the trim — the frame of a bound cover. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-4 md:inset-8"
          style={{ border: "1px solid rgba(184,138,62,0.55)" }}
        />

        <div className="relative flex h-full flex-col justify-between p-8 md:p-16">
          <div className="flex items-start justify-between gap-6">
            <Eyebrow tone="gold">{ARTIST.studio}</Eyebrow>
            <Eyebrow tone="gold">Portfolio · Vol. I</Eyebrow>
          </div>

          <div className="max-w-[22ch]">
            <Display
              as="h1"
              size="clamp(3rem, 10vw, 8rem)"
              color="var(--color-on-ink)"
              className="leading-[0.92]"
            >
              Mahati
              <br />
              <span style={{ fontStyle: "italic", color: "var(--color-gold-400)" }}>Bhikshu</span>
            </Display>
            <Rule className="mt-8 w-24" />
            <p className="eyebrow mt-5" style={{ color: "var(--color-on-ink)" }}>
              {ARTIST.roles}
            </p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <p
              className="font-display italic"
              style={{
                color: "var(--color-on-ink)",
                fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)",
                maxWidth: "24ch",
              }}
            >
              “{ARTIST.thesis}”
            </p>
            <a
              href="#contents"
              className="group inline-flex items-center gap-3"
              aria-label="Open the contents"
            >
              <Eyebrow tone="gold">Open the book</Eyebrow>
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-full border transition-transform duration-500 group-hover:translate-y-1"
                style={{ borderColor: "var(--color-gold-500)" }}
              >
                <span
                  className="block"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "9px solid var(--color-gold-400)",
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    marginTop: 2,
                  }}
                />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------- contents ----------------------------- */}
      <section
        id="contents"
        className="scroll-mt-0 px-6 py-20 md:px-16 md:py-28 lg:pl-[100px]"
        style={{ background: "var(--color-parchment-100)", color: "var(--color-on-parch)" }}
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>The Volume</Eyebrow>
              <Display as="h2" size="clamp(2.4rem, 6vw, 4rem)" className="mt-4">
                Contents
              </Display>
            </div>
            <p style={{ color: "var(--color-on-parch-dim)", maxWidth: "38ch" }}>
              Six chapters, then the plates, the honours, the press, and the correspondence. Each
              stands on its own page.
            </p>
          </div>

          <Rule className="mt-12" />

          <ol className="mt-2">
            {CHAPTERS.map((c) => (
              <li key={c.slug} className="border-b" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
                <Link
                  to="/chapters/$slug"
                  params={{ slug: c.slug }}
                  className="group grid gap-3 py-7 transition-opacity hover:opacity-65 md:grid-cols-[3rem_1fr_auto] md:items-baseline md:gap-6"
                >
                  <span
                    className="font-display italic"
                    style={{ color: "var(--color-gold-500)", fontSize: "1.1rem" }}
                  >
                    {c.numeral}
                  </span>
                  <span className="min-w-0">
                    <Display as="h3" size="clamp(1.7rem, 4.2vw, 2.9rem)">
                      {c.title}
                    </Display>
                    <span
                      className="mt-2 block font-display italic"
                      style={{ color: "var(--color-on-parch-dim)", fontSize: "1.05rem" }}
                    >
                      {c.subtitle}
                    </span>
                  </span>
                  <span
                    className="font-display italic"
                    style={{ color: "var(--color-on-parch-dim)", fontSize: "1rem" }}
                  >
                    {c.folio}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-16">
            <Eyebrow tone="oxblood">Back Matter</Eyebrow>
            <ol className="mt-4">
              {BACK_MATTER.map((b) => (
                <li key={b.to} className="border-b" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
                  <Link
                    to={b.to}
                    className="group grid gap-3 py-6 transition-opacity hover:opacity-65 md:grid-cols-[3rem_1fr_auto] md:items-baseline md:gap-6"
                  >
                    <span aria-hidden />
                    <span className="min-w-0">
                      <Display as="h3" size="clamp(1.4rem, 3vw, 2rem)">
                        {b.label}
                      </Display>
                      <span className="mt-1 block" style={{ color: "var(--color-on-parch-dim)" }}>
                        {b.description}
                      </span>
                    </span>
                    <span
                      className="font-display italic"
                      style={{ color: "var(--color-on-parch-dim)", fontSize: "1rem" }}
                    >
                      {b.folio}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-6">
            <Link
              to="/chapters/$slug"
              params={{ slug: CHAPTERS[0].slug }}
              className="border px-7 py-4 transition-colors"
              style={{
                borderColor: "var(--color-oxblood-600)",
                background: "var(--color-oxblood-600)",
                color: "var(--color-on-ink)",
              }}
            >
              <Eyebrow tone="gold">Begin at Chapter I</Eyebrow>
            </Link>
            <a
              href={`mailto:${ARTIST.email}`}
              className="font-display text-xl italic transition-opacity hover:opacity-70"
              style={{ color: "var(--color-oxblood-600)" }}
            >
              {ARTIST.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
