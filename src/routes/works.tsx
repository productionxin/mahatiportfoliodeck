import { createFileRoute } from "@tanstack/react-router";

import { FESTIVALS, INTERNATIONAL, PRODUCTIONS, REPERTOIRE } from "@/content";
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

export const Route = createFileRoute("/works")({
  component: Works,
  head: () => ({
    meta: [
      { title: "Works — Mahati Bhikshu" },
      {
        name: "description",
        content:
          "Repertoire, principal roles, and the festivals and platforms the work has been carried to.",
      },
    ],
  }),
});

/** Repertoire pieces, paired with their studio plate, in a 3-up grid. */
const REPERTOIRE_PLATE: Record<string, string> = {
  "Bho Shambo": "repertoire_studio.jpg",
  "Kshetrayya Padam": "repertoire_studio_2.jpg",
};

function Works() {
  return (
    <main>
      <PageTop>
        <Section className="pb-14 md:pb-20">
          <Reveal>
            <PageTitle>Works</PageTitle>
            <Body dim className="mx-auto mt-8 text-center" measure="60ch">
              Solo repertoire, principal roles in full-length dance dramas, and the festivals,
              temples and institutions the work has been carried to.
            </Body>
          </Reveal>
        </Section>

        {/* ------------------------------ repertoire ---------------------------- */}
        <Section className="pb-20 md:pb-28">
          <Reveal>
            <Label>Repertoire</Label>
            <Heading as="h2" className="mt-4">
              Danced in full.
            </Heading>
            <Body dim className="mt-5">
              Two pieces she returns to often — an invocation to Shiva, and a padam composed by the
              poet Kshetrayya. Both live in her solo recitals.
            </Body>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {REPERTOIRE.map((r, i) => (
              <Reveal key={r.title} delay={i * 110}>
                <Figure
                  src={requireAsset(REPERTOIRE_PLATE[r.title])}
                  alt={
                    i === 0
                      ? "Mahati Bhikshu seated on a red floor against a black drape in a red and gold silk costume, hands clasped beneath her chin."
                      : "Mahati Bhikshu standing against a black drape in a red and gold silk costume, arms extended in a Kuchipudi stance."
                  }
                  ratio="4/5"
                />
                <Heading as="h3" size="clamp(1.5rem, 2.6vw, 2rem)" className="mt-5">
                  {r.title}
                </Heading>
                <Body dim className="mt-2" measure="42ch">
                  {r.note}
                </Body>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* --------------------------- principal roles -------------------------- */}
        <Section className="py-20 md:py-28" tone="deep">
          <Reveal>
            <Label>Principal roles</Label>
            <Heading as="h2" className="mt-4">
              In production.
            </Heading>
          </Reveal>

          <div className="mt-14 grid gap-12 md:grid-cols-12 md:items-center">
            <Reveal className="md:col-span-7">
              <Figure
                src={requireAsset("principal_roles_group_tight.jpg")}
                alt="Three dancers on a garlanded festival stage — Sri Venkateswara crowned at centre with Padmavathi and Lakshmi to either side, hands raised in abhaya."
                ratio="4/5"
              />
            </Reveal>
            <Reveal className="md:col-span-5" delay={120}>
              <ul className="space-y-10">
                {PRODUCTIONS.map((p) => (
                  <li key={p.title}>
                    <Hairline strong />
                    <Heading as="h3" size="clamp(1.4rem, 2.6vw, 1.9rem)" className="mt-5">
                      {p.title}
                    </Heading>
                    <Body className="mt-3" measure="38ch">
                      {p.roles}
                    </Body>
                    <p className="mt-2 eyebrow" style={{ color: "var(--color-text-dim)" }}>
                      {p.where}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Section>

        {/* ------------------------------ festivals ----------------------------- */}
        <Section className="py-20 md:py-28">
          <Reveal>
            <Label>Where the work has been carried</Label>
            <Heading as="h2" className="mt-4">
              Festivals and platforms.
            </Heading>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-3">
            {FESTIVALS.map((group, gi) => (
              <Reveal key={group.group} delay={gi * 110}>
                <Label tone="dim">{group.group}</Label>
                <ul className="mt-5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-display py-3"
                      style={{
                        borderBottom: "1px solid var(--color-hairline)",
                        fontSize: "1.1rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ---------------------------- international --------------------------- */}
        <Section className="py-20 md:py-28" tone="deep" width="text">
          <Reveal className="text-center">
            <Label>Abroad</Label>
            <Heading as="h2" size="clamp(2rem, 5vw, 3.4rem)" className="mt-5">
              {INTERNATIONAL.cities.join(". ")}.
            </Heading>
            <Body dim className="mx-auto mt-7" measure="54ch">
              {INTERNATIONAL.note}
            </Body>
          </Reveal>
        </Section>
      </PageTop>
    </main>
  );
}
