import { createFileRoute, Link } from "@tanstack/react-router";

import {
  BACK_MATTER,
  CROSS_TRAINING,
  FESTIVALS,
  INTERNATIONAL,
  PRODUCTIONS,
  REPERTOIRE,
  TITLES,
} from "@/content";
import { Page } from "@/book/Layout";
import { Display, Eyebrow, PlateFrame, Reveal, Rule } from "@/book/primitives";
import { requireAsset } from "@/book/assets";

export const Route = createFileRoute("/honours")({
  component: Honours,
  head: () => ({
    meta: [
      { title: "Honours — Mahati Bhikshu" },
      {
        name: "description",
        content:
          "Doordarshan B-High grading, titles, festivals and institutional platforms — the full record.",
      },
    ],
  }),
});

/**
 * The record, set as a reference section rather than a narrative one: a
 * programmer checking credentials should be able to scan it in one pass.
 */
function Honours() {
  const folio = BACK_MATTER.find((b) => b.to === "/honours")?.folio ?? 78;

  return (
    <Page runningHead="Honours" folio={folio}>
      <section className="py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <Eyebrow tone="oxblood">Back Matter</Eyebrow>
            <Display as="h1" size="clamp(2.6rem, 7vw, 5rem)" className="mt-5">
              Honours
            </Display>
            <Rule className="mt-9 w-20" />
            <p className="mt-8 max-w-[54ch]" style={{ color: "var(--color-on-parch-dim)" }}>
              Grades, titles, repertoire, and every stage the work has been carried to — set out in
              full for anyone assessing it professionally.
            </p>
          </Reveal>
          <Reveal className="md:col-span-5" delay={110}>
            <PlateFrame
              src={requireAsset("award_ceremony.jpg")}
              alt="Mahati Bhikshu on stage holding a framed citation, flanked by dignitaries and family after receiving the Nrithya Pratibha Puraskar."
              caption="Receiving the Nrithya Pratibha Puraskar"
              ratio="3/2"
            />
          </Reveal>
        </div>
      </section>

      {/* --------------------------- grade & titles -------------------------- */}
      <Section eyebrow="Grading & Titles" title="Conferred.">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {TITLES.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <div className="border-t pt-5" style={{ borderColor: "rgba(184,138,62,0.4)" }}>
                <Eyebrow tone="oxblood">{String(i + 1).padStart(2, "0")}</Eyebrow>
                <Display as="h3" size="clamp(1.3rem, 2.6vw, 1.8rem)" className="mt-3">
                  {t.title}
                </Display>
                <p
                  className="mt-3"
                  style={{ color: "var(--color-on-parch-dim)", maxWidth: "46ch" }}
                >
                  {t.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------ repertoire --------------------------- */}
      <Section eyebrow="Repertoire" title="Danced in full.">
        <ul className="grid gap-8 sm:grid-cols-2">
          {REPERTOIRE.map((r) => (
            <Reveal as="li" key={r.title}>
              <Display as="h3" size="clamp(1.4rem, 3vw, 2rem)" italic>
                {r.title}
              </Display>
              <p className="mt-2" style={{ color: "var(--color-on-parch-dim)" }}>
                {r.note}
              </p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12">
          <Eyebrow tone="oxblood">Principal Roles</Eyebrow>
          <ul className="mt-5 space-y-6">
            {PRODUCTIONS.map((p) => (
              <li
                key={p.title}
                className="border-t pt-4"
                style={{ borderColor: "rgba(184,138,62,0.35)" }}
              >
                <Display as="h4" size="clamp(1.2rem, 2.4vw, 1.6rem)">
                  {p.title}
                </Display>
                <p className="mt-1">{p.roles}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--color-on-parch-dim)" }}>
                  {p.where}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* ------------------------------ festivals ---------------------------- */}
      <Section
        eyebrow="Where the Work Has Been Carried"
        title="Festivals & platforms."
        note="State and temple festivals, dance festivals, and institutional platforms."
      >
        <div className="grid gap-12 md:grid-cols-3">
          {FESTIVALS.map((group, gi) => (
            <Reveal key={group.group} delay={gi * 110}>
              <Eyebrow tone="oxblood">{group.group}</Eyebrow>
              <ul className="mt-5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-b py-3 font-display"
                    style={{
                      borderColor: "rgba(184,138,62,0.28)",
                      fontSize: "1.02rem",
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

      {/* --------------------------- cross-training -------------------------- */}
      <Section eyebrow="Also Trained In" title="Other grammars.">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CROSS_TRAINING.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 80}>
              <div className="border-t pt-5" style={{ borderColor: "rgba(184,138,62,0.4)" }}>
                <Display as="h3" size="clamp(1.2rem, 2.4vw, 1.6rem)">
                  {c.title}
                </Display>
                <p className="mt-2 italic" style={{ color: "var(--color-on-parch-dim)" }}>
                  {c.under}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ----------------------------- international ------------------------- */}
      <Section eyebrow="Abroad" title={INTERNATIONAL.cities.join(". ") + "."}>
        <Reveal>
          <p style={{ color: "var(--color-on-parch-dim)", maxWidth: "56ch" }}>
            {INTERNATIONAL.note}
          </p>
          <p className="mt-4 font-display italic" style={{ fontSize: "1.15rem" }}>
            {INTERNATIONAL.countries}
          </p>
        </Reveal>
        <Reveal className="mt-16">
          <Link
            to="/press"
            className="inline-block border px-6 py-4 transition-opacity hover:opacity-75"
            style={{ borderColor: "var(--color-gold-500)" }}
          >
            <Eyebrow tone="oxblood">Next — Press →</Eyebrow>
          </Link>
        </Reveal>
      </Section>
    </Page>
  );
}

function Section({
  eyebrow,
  title,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t py-14 md:py-20" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
      <Reveal>
        <Eyebrow tone="oxblood">{eyebrow}</Eyebrow>
        <Display as="h2" size="clamp(1.8rem, 4vw, 2.8rem)" className="mt-4">
          {title}
        </Display>
        {note && (
          <p className="mt-5 max-w-[58ch]" style={{ color: "var(--color-on-parch-dim)" }}>
            {note}
          </p>
        )}
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}
