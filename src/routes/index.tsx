import { createFileRoute, Link } from "@tanstack/react-router";

import { ARTIST, FILMS, PLATES } from "@/content";
import { Body, Heading, Label, Lift, Reveal, Section } from "@/site/ui";
import { useHeroScroll, useParallax, useSlideshow } from "@/site/motion";
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
 * The hero runs as a sequence rather than a single plate.
 *
 * One photograph, however good, states a fact: she is a dancer. Four
 * photographs cross-dissolving state the thing the portfolio is actually
 * selling — range. The order is a colour arc, red into smoke into green into
 * violet, so the change reads as stage light moving rather than as a
 * slideshow advancing.
 *
 * objectPosition is per frame: these are 2:3 verticals cropped into a
 * landscape viewport, so only about two fifths of each frame survives and
 * where that window sits decides whether you get her face or her feet.
 */
const HERO_FRAMES = [
  {
    asset: "cover_hero.jpg",
    at: "50% 38%",
    alt: "Mahati Bhikshu in a red silk blouse and gold-woven silk drape, one hand raised in a mudra, against a black backdrop hung with temple garlands.",
  },
  {
    asset: "stage_smoke_wide.jpg",
    at: "50% 45%",
    alt: "Mahati Bhikshu low in araimandi inside billowing orange stage smoke, both hands drawn in towards her chest.",
  },
  {
    asset: "stage_green.jpg",
    at: "50% 40%",
    alt: "Mahati Bhikshu kneeling in green stage light in a green and gold silk costume, fingers spread in a hasta beside her face.",
  },
  {
    asset: "stage_reaching.jpg",
    at: "50% 40%",
    alt: "Mahati Bhikshu kneeling under violet light in a magenta silk costume, one arm reaching across her body.",
  },
] as const;

/**
 * The home page: the sequence, a short statement, and three ways in. It stays
 * deliberately brief — the sections hold the substance, and a visitor arriving
 * from a search or a signature link should be able to choose in one screen.
 */
function Home() {
  const heroRef = useParallax<HTMLDivElement>(0.14);
  const [frame, setFrame] = useSlideshow(HERO_FRAMES.length, 6600);
  const depth = useHeroScroll();

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
        {/* Parallax lives on the stack, the slow drift on each photograph
            inside it — two speeds, so the frame and its contents never move
            as one flat card. */}
        <div ref={heroRef} className="absolute inset-0 will-change-transform">
          {HERO_FRAMES.map((f, i) => (
            <img
              key={f.asset}
              src={requireAsset(f.asset)}
              alt={i === 0 ? f.alt : ""}
              aria-hidden={i === 0 ? undefined : true}
              // The first frame is the LCP element and must not wait on the
              // observer; the rest can arrive at their leisure.
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              data-active={i === frame}
              className="hero-frame drift absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: f.at }}
            />
          ))}
        </div>

        {/* Just enough veil to hold the lettering; the photograph stays the subject. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--scrim-hero-top) 0%, var(--scrim-hero-mid) 30%, var(--scrim-hero-low) 60%, var(--scrim-hero-foot) 100%)",
          }}
        />

        {/* The name leaves with the photograph instead of sitting pinned while
            the page moves under it — it rises, opens its letterspacing and
            clears out by the time the statement arrives. */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <Lift
            as="h1"
            step={110}
            className="font-display text-center"
            style={{
              color: "var(--color-on-dark)",
              fontSize: "var(--text-hero)",
              lineHeight: 1,
              opacity: 0.9 * (1 - depth),
              letterSpacing: `${depth * 0.05}em`,
              transform: `translate3d(0, ${-depth * 60}px, 0)`,
              textShadow: "var(--hero-title-shadow)",
              willChange: "transform, opacity",
            }}
          >
            {ARTIST.name}
          </Lift>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-10 md:pb-10">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4">
            <span className="eyebrow" style={{ color: "var(--color-on-dark)" }}>
              {ARTIST.roles}
            </span>

            {/* Four rules, one per frame. They are the only thing on the hero a
                visitor can act on, and they say plainly that there is more
                than one photograph here. */}
            <div className="flex items-center gap-3">
              {HERO_FRAMES.map((f, i) => (
                <button
                  key={f.asset}
                  type="button"
                  onClick={() => setFrame(i)}
                  aria-label={`Show frame ${i + 1} of ${HERO_FRAMES.length}`}
                  aria-current={i === frame}
                  className="tap px-1"
                >
                  <span
                    aria-hidden
                    className="block transition-all duration-700"
                    style={{
                      width: i === frame ? 34 : 16,
                      height: 1,
                      background: "var(--color-on-dark)",
                      opacity: i === frame ? 1 : 0.4,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue — a slow travelling hairline rather than a bouncing
            chevron, which would fight the stillness of the photograph. It
            fades out as soon as the visitor takes the hint. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-24 hidden justify-center transition-opacity duration-500 md:flex"
          style={{ opacity: 1 - Math.min(1, depth * 3) }}
        >
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
        </Reveal>
        <Lift
          as="h2"
          step={55}
          className="font-display mt-8 text-center"
          style={{ fontSize: "clamp(1.7rem, 3.6vw, 2.7rem)" }}
        >
          A Kuchipudi artist of more than twenty years, an actor across five features, and the
          teacher a new generation trains with.
        </Lift>
        <Reveal className="text-center">
          <Body dim className="mx-auto mt-8" measure="62ch">
            Daughter of a theatre actor and a Kuchipudi exponent, Mahati Bhikshu grew up inside the
            form — then carried it across India, to London, Toronto and Dubai, and into film.
          </Body>
          <Link to="/about" className="link-underline tap mt-10 inline-flex">
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
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "4/5", background: "var(--color-paper-edge)" }}
                >
                  <img
                    src={requireAsset(f.asset)}
                    alt=""
                    loading="lazy"
                    className="plate-zoom h-full w-full object-cover"
                  />
                  {/* The card darkens under the pointer so the lettering below
                      it reads as the active thing on the page. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "rgba(var(--shadow-rgb), 0.18)" }}
                  />
                </div>
                <div className="mt-5 flex items-baseline gap-4">
                  <Label tone="dim">{String(i + 1).padStart(2, "0")}</Label>
                  <Heading as="h3" size="clamp(1.5rem, 2.6vw, 2rem)">
                    <span className="link-underline">{f.label}</span>
                  </Heading>
                </div>
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
