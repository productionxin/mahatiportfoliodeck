import { createFileRoute } from "@tanstack/react-router";

import { ARTIST, CROSS_TRAINING, INTERNATIONAL, TITLES } from "@/content";
import {
  Body,
  Figure,
  Hairline,
  Heading,
  Label,
  PageTitle,
  PageTop,
  Reveal,
  Section,
} from "@/site/ui";
import { requireAsset } from "@/site/assets";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Mahati Bhikshu" },
      {
        name: "description",
        content:
          "Kuchipudi artist, actor, choreographer and educator. Twenty years under Prof. Aruna Bhikshu, Doordarshan B-High graded.",
      },
    ],
  }),
});

/**
 * Biography. A single portrait beside continuous prose, following the
 * reference's About page — long-form text is the point here, so it holds one
 * column at a comfortable measure rather than being broken into cards.
 */
function About() {
  return (
    <main>
      <PageTop>
        <Section className="pb-16 md:pb-20">
          <Reveal>
            <PageTitle align="left">About</PageTitle>
          </Reveal>
        </Section>

        <Section className="pb-20 md:pb-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-14">
            <Reveal className="md:col-span-5">
              <Figure
                src={requireAsset("field_portrait.jpg")}
                alt="Close portrait of Mahati Bhikshu outdoors in daylight, in a magenta and green silk costume with gold temple jewellery, head lowered and hand resting near her chin."
                ratio="4/5"
                priority
              />
            </Reveal>

            <div className="md:col-span-7">
              <Reveal>
                <Body className="text-lg">
                  Mahati Bhikshu is a Doordarshan B-High graded Kuchipudi artist, performer,
                  choreographer and arts educator. Having trained under her guru, Prof. Aruna
                  Bhikshu, for over two decades, she has established herself as a dedicated
                  practitioner of classical dance, integrating performance, teaching and artistic
                  exploration.
                </Body>
                <Body className="mt-6">
                  She is the daughter of Dr. N.J. Bhikshu, a renowned theatre actor, and Prof. Aruna
                  Bhikshu, a Kuchipudi exponent and choreographer who taught at the University of
                  Hyderabad's school of dance. The studio was her living room. Her first appearance
                  came at eight, as Bala Narakasura in the musical dance drama{" "}
                  <em>Narakasura Vadha</em>; the same year she played Bhakta Prahlada in{" "}
                  <em>Parikatha</em>, where <em>vachika abhinaya</em> — the voice as gesture — was
                  introduced to her.
                </Body>

                {/* The guru passage is the emotional centre of the biography, so
                    it is illustrated where it is told rather than left to the
                    gallery to carry. */}
                <figure className="mt-10" style={{ maxWidth: 430 }}>
                  <div className="w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                    <img
                      src={requireAsset("guru_mother_01.jpg")}
                      alt="Mahati Bhikshu in a green and magenta Kuchipudi costume standing arm-in-arm with her mother and guru Prof. Aruna Bhikshu, who wears a deep red silk saree, on grass at night after a performance."
                      loading="lazy"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: "50% 26%" }}
                    />
                  </div>
                  <figcaption className="mt-3">
                    <Label>Her guru</Label>
                    <p className="mt-2" style={{ color: "var(--color-text-dim)" }}>
                      With Prof. Aruna Bhikshu — her mother, and her teacher for more than twenty
                      years.
                    </p>
                  </figcaption>
                </figure>
                <Body className="mt-6">
                  She has performed extensively across India and abroad, presenting solo recitals
                  and taking principal roles in acclaimed dance productions, with international
                  appearances in {INTERNATIONAL.countries}. Alongside Kuchipudi she has trained in
                  contemporary dance, ballet, Odissi and Chhau, broadening her approach to
                  performance, choreography and pedagogy.
                </Body>
                <Body className="mt-6">
                  Her work in film began behind the camera — as Assistant Acting Coach on{" "}
                  <em>1: Nenokkadine</em>, then as Casting Director for <em>Aakashavani</em> —
                  before she appeared on screen across five features, most recently in the titular
                  role of <em>Kinnerasani</em>. Today she coaches actors entering the industry, and
                  directs Natyavedam Academy.
                </Body>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* ----------------------------- recognition ---------------------------- */}
        <Section className="py-16 md:py-24" tone="deep">
          <Reveal>
            <Label>Recognition</Label>
            <Heading as="h2" className="mt-4">
              Grades and titles.
            </Heading>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {TITLES.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <Hairline strong />
                <Heading as="h3" size="clamp(1.25rem, 2.2vw, 1.6rem)" className="mt-5">
                  {t.title}
                </Heading>
                <Body dim className="mt-3" measure="46ch">
                  {t.body}
                </Body>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ---------------------------- cross-training -------------------------- */}
        <Section className="py-16 md:py-24">
          <Reveal>
            <Label>Also trained in</Label>
            <Heading as="h2" className="mt-4">
              Other grammars.
            </Heading>
            <Body dim className="mt-5">
              Kuchipudi is the spine. Each of these changed how she holds weight, or how she holds a
              pause.
            </Body>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CROSS_TRAINING.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <Hairline />
                <Heading as="h3" size="clamp(1.2rem, 2vw, 1.5rem)" className="mt-4">
                  {c.title}
                </Heading>
                <Body dim className="mt-2" measure="30ch">
                  {c.under}
                </Body>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ------------------------------ statement ----------------------------- */}
        <Section className="py-20 md:py-28" width="text">
          <Reveal className="text-center">
            <Heading as="h2" italic size="clamp(1.7rem, 4vw, 2.8rem)">
              “{ARTIST.thesis}”
            </Heading>
          </Reveal>
        </Section>
      </PageTop>
    </main>
  );
}
