import { createFileRoute } from "@tanstack/react-router";

import { ARTIST, COACHING, INSTITUTIONS } from "@/content";
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

export const Route = createFileRoute("/teaching")({
  component: Teaching,
  head: () => ({
    meta: [
      { title: "Teaching — Mahati Bhikshu" },
      {
        name: "description",
        content:
          "Natyavedam Academy, Bhikshu's House of Arts, and acting coaching for debut film leads.",
      },
    ],
  }),
});

/**
 * Teaching — two practices under one roof: Kuchipudi training through
 * Natyavedam, and acting coaching for newcomers entering film. The second is
 * her present-tense work and appears in none of the earlier portfolio material.
 */
function Teaching() {
  return (
    <main>
      <PageTop>
        <Section className="pb-14 md:pb-20">
          <Reveal>
            <PageTitle>Teaching</PageTitle>
            <Body dim className="mx-auto mt-8 text-center" measure="58ch">
              One house trains dancers. The other trains actors. Both grew out of the room she
              watched from as a child.
            </Body>
          </Reveal>
        </Section>

        {/* ----------------------------- institutions --------------------------- */}
        <Section className="pb-20 md:pb-28">
          <div className="grid gap-10 md:grid-cols-2">
            {INSTITUTIONS.map((inst, i) => (
              <Reveal key={inst.name} delay={i * 110}>
                <Hairline strong />
                <Label tone="dim" className="mt-6 block">
                  {inst.role}
                </Label>
                <Heading as="h2" size="clamp(1.7rem, 3.4vw, 2.4rem)" className="mt-4">
                  {inst.name}
                </Heading>
                <Body dim className="mt-4" measure="42ch">
                  {inst.note}
                </Body>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ------------------------------- coaching ----------------------------- */}
        <Section className="py-20 md:py-28" tone="deep">
          <div className="grid gap-12 md:grid-cols-12 md:gap-14">
            <Reveal className="md:col-span-5">
              <Figure
                src={requireAsset("contemporary_portrait_tight.jpg")}
                alt="Editorial portrait of Mahati Bhikshu in a dark green checked sari with silver tribal jewellery, one hand raised near her face in low warm light."
                ratio="4/5"
              />
            </Reveal>

            <div className="md:col-span-7">
              <Reveal>
                <Label>Acting coaching</Label>
                <Heading as="h2" italic size="clamp(1.6rem, 3.4vw, 2.4rem)" className="mt-6">
                  “{COACHING.intro}”
                </Heading>
                <Body dim className="mt-8">
                  {COACHING.method}
                </Body>
              </Reveal>

              <Reveal className="mt-12">
                <Label tone="dim">In training</Label>
                <ul className="mt-5">
                  {COACHING.trained.map((t) => (
                    <li
                      key={t.name}
                      className="py-5"
                      style={{ borderTop: "1px solid var(--color-hairline)" }}
                    >
                      <Heading as="h3" size="clamp(1.25rem, 2.2vw, 1.6rem)">
                        {t.name}
                      </Heading>
                      <Body dim className="mt-1" measure="48ch">
                        {t.note}
                      </Body>
                    </li>
                  ))}
                </ul>
                <Hairline className="mt-0" />
              </Reveal>

              <Reveal className="mt-12">
                <Label tone="dim">For directors</Label>
                <ul className="mt-4 space-y-2">
                  {COACHING.forDirectors.map((d) => (
                    <li key={d} className="font-display" style={{ fontSize: "1.15rem" }}>
                      {d}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* ---------------------------- the living room ------------------------- */}
        <Section className="py-20 md:py-28" width="text">
          <Reveal>
            {/* The claim on this page is that the coaching began in a room she
                watched from as a child. The earliest frame in the archive is
                the evidence for it, so it runs here rather than only in the
                gallery. */}
            <Figure
              src={requireAsset("childhood_archival.jpg")}
              alt="A grainy archival video still: Mahati Bhikshu at age eight in costume on a dark stage, one arm extended in a mudra."
              ratio="16/9"
              caption="Bala Narakasura — age eight"
            />
          </Reveal>

          <Reveal className="mt-14 text-center">
            <Label>Before</Label>
            <Heading as="h2" size="clamp(1.6rem, 3.4vw, 2.4rem)" className="mt-5">
              Actors came to her parents' house to train while she was a child.
            </Heading>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {COACHING.childhoodVisitors.map((n) => (
                <li key={n} className="font-display italic" style={{ fontSize: "1.2rem" }}>
                  {n}
                </li>
              ))}
            </ul>
            <Body dim className="mx-auto mt-10" measure="50ch">
              Enquiries about training with Natyavedam Academy or Bhikshu's House of Arts —{" "}
              <a
                href={`mailto:${ARTIST.workEmail}`}
                className="underline underline-offset-4 hover:opacity-60"
                style={{ color: "var(--color-rust)" }}
              >
                {ARTIST.workEmail}
              </a>
            </Body>
          </Reveal>
        </Section>
      </PageTop>
    </main>
  );
}
