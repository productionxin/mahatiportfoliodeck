import { createFileRoute, Link } from "@tanstack/react-router";

import { ARTIST, FILMS, PLATES } from "@/content";
import { Body, Heading, Label, Reveal, Section } from "@/site/ui";
import { useParallax } from "@/site/motion";
import { requireAsset } from "@/site/assets";
import coverHero from "@/assets/cover_hero.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { property: "og:image", content: coverHero },
      { name: "twitter:image", content: coverHero },
    ],
  }),
});

/**
 * The home page: one full-bleed photograph with the name set over it, then a
 * short statement and three ways in. It is deliberately brief — the sections
 * hold the substance, and a visitor arriving from a search or a signature link
 * should be able to choose in one screen.
 */
function Home() {
  const heroRef = useParallax<HTMLImageElement>(0.14);
  const featured = [
    {
      to: "/works",
      label: "Works",
      note: "Repertoire, productions, and the festivals the work has been carried to.",
      asset: "stage_fist.jpg",
    },
    {
      to: "/film",
      label: "Film",
      note: `${FILMS.length} features, and the coaching practice behind the camera.`,
      asset: "contemporary_portrait_tight.jpg",
    },
    {
      to: "/gallery",
      label: "Gallery",
      note: `${PLATES.length} photographs — stage, studio, portrait, cinema, archive.`,
      asset: "field_portrait.jpg",
    },
  ];

  return (
    <main>
      {/* --------------------------------- hero -------------------------------- */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        <img
          ref={heroRef}
          src={coverHero}
          alt="Mahati Bhikshu in a red silk blouse and gold-woven silk drape, one hand raised in a mudra, against a black backdrop hung with temple garlands."
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          // Sits her face above centre so the title crosses the silk rather
          // than her eyes.
          style={{ objectPosition: "50% 40%" }}
        />
        {/* Just enough veil to hold the lettering; the photograph stays the subject. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--scrim-hero-top) 0%, var(--scrim-hero-mid) 30%, var(--scrim-hero-low) 60%, var(--scrim-hero-foot) 100%)",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1
            className="font-display text-center"
            style={{
              color: "var(--color-on-dark)",
              fontSize: "var(--text-hero)",
              lineHeight: 1,
              // Slightly translucent so the photograph reads through the
              // lettering, as it does on the reference.
              opacity: 0.88,
              textShadow: "var(--hero-title-shadow)",
            }}
          >
            {ARTIST.name}
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-10 md:pb-10">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4">
            <span className="eyebrow" style={{ color: "var(--color-on-dark)" }}>
              {ARTIST.roles}
            </span>
            <span className="text-right text-xs" style={{ color: "var(--color-on-dark-dim)" }}>
              © {ARTIST.instagram} | All rights reserved
            </span>
          </div>
        </div>

        {/* Scroll cue — a slow travelling hairline rather than a bouncing
            chevron, which would fight the stillness of the photograph. */}
        <div aria-hidden className="absolute inset-x-0 bottom-24 hidden justify-center md:flex">
          <span
            className="block overflow-hidden"
            style={{ width: 1, height: 54, background: "var(--cue-track)" }}
          >
            <span
              className="scroll-cue block"
              style={{ width: 1, height: 54, background: "var(--color-on-dark)" }}
            />
          </span>
        </div>
      </section>

      {/* ------------------------------- statement ----------------------------- */}
      <Section className="py-24 md:py-36" width="text">
        <Reveal className="text-center">
          <Label>{ARTIST.thesis}</Label>
          <Heading as="h2" size="clamp(1.7rem, 3.6vw, 2.7rem)" className="mt-8">
            A Kuchipudi artist of more than twenty years, an actor across five features, and the
            teacher a new generation trains with.
          </Heading>
          <Body dim className="mx-auto mt-8" measure="62ch">
            Daughter of a theatre actor and a Kuchipudi exponent, Mahati Bhikshu grew up inside the
            form — then carried it across India, to London, Toronto and Dubai, and into film.
          </Body>
          <Link
            to="/about"
            className="mt-10 inline-block border-b pb-1 transition-opacity hover:opacity-60"
            style={{ borderColor: "var(--color-rust)" }}
          >
            <span className="eyebrow" style={{ color: "var(--color-rust)" }}>
              Read the full biography
            </span>
          </Link>
        </Reveal>
      </Section>

      {/* -------------------------------- ways in ------------------------------ */}
      <Section className="pb-24 md:pb-36">
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
          {featured.map((f, i) => (
            <Reveal key={f.to} delay={i * 110}>
              <Link to={f.to} className="group block">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                  <img
                    src={requireAsset(f.asset)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <Heading as="h3" size="clamp(1.5rem, 2.6vw, 2rem)" className="mt-5">
                  {f.label}
                </Heading>
                <Body dim className="mt-2" measure="34ch">
                  {f.note}
                </Body>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </main>
  );
}
