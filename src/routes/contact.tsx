import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ARTIST, FACT_SHEETS } from "@/content";
import { Body, Hairline, Heading, Label, PageTitle, PageTop, Reveal, Section } from "@/site/ui";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Mahati Bhikshu" },
      {
        name: "description",
        content: "Booking, casting and academy enquiries, with summaries for each.",
      },
    ],
  }),
});

const SHEET_KEYS = ["programmers", "casting"] as const;

/**
 * Contact, with the two summaries attached.
 *
 * A festival programmer and a casting director arrive with different
 * questions; both are answered from the same dataset so nothing drifts.
 */
function Contact() {
  const [active, setActive] = useState<(typeof SHEET_KEYS)[number]>("programmers");
  const sheet = FACT_SHEETS[active];

  return (
    <main>
      <PageTop>
        <Section className="pb-14 md:pb-20">
          <Reveal>
            <PageTitle>Contact</PageTitle>
            <Body dim className="mx-auto mt-8 text-center" measure="56ch">
              For performance bookings, casting, coaching and academy enquiries.
            </Body>
          </Reveal>
        </Section>

        {/* ------------------------------- addresses ---------------------------- */}
        <Section className="pb-20 md:pb-28">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <Address
              label="Bookings & Casting"
              value={ARTIST.email}
              href={`mailto:${ARTIST.email}`}
            />
            <Address
              label="Academy & Teaching"
              value={ARTIST.workEmail}
              href={`mailto:${ARTIST.workEmail}`}
            />
            <Address label="Instagram" value={`@${ARTIST.instagram}`} href={ARTIST.instagramUrl} />
            <Address label="IMDb" value={ARTIST.imdbId} href={ARTIST.imdbUrl} />
          </div>
        </Section>

        {/* ------------------------------ one-sheets ---------------------------- */}
        <Section className="py-20 md:py-28" tone="deep">
          <Reveal>
            <Label>At a glance</Label>
            <Heading as="h2" className="mt-4">
              The same career, summarised for the question you came with.
            </Heading>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap gap-7" delay={70}>
            {SHEET_KEYS.map((k) => {
              const on = active === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActive(k)}
                  aria-pressed={on}
                  className="navlink pb-1 transition-opacity hover:opacity-60"
                  style={{
                    color: on ? "var(--color-rust)" : "var(--color-text)",
                    borderBottom: `1px solid ${on ? "var(--color-rust)" : "transparent"}`,
                  }}
                >
                  {FACT_SHEETS[k].label}
                </button>
              );
            })}
          </Reveal>

          <Reveal className="mt-10" delay={110}>
            <p className="font-display italic" style={{ fontSize: "1.25rem" }}>
              {sheet.blurb}
            </p>
            <dl className="mt-8">
              {sheet.facts.map((f) => (
                <div
                  key={f.k}
                  className="grid gap-1 py-5 md:grid-cols-[240px_1fr] md:gap-8"
                  style={{ borderTop: "1px solid var(--color-hairline)" }}
                >
                  <dt>
                    <Label tone="dim">{f.k}</Label>
                  </dt>
                  <dd className="font-display" style={{ fontSize: "1.2rem", lineHeight: 1.45 }}>
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
            <Hairline />

            <a
              href={`mailto:${active === "casting" ? ARTIST.email : ARTIST.workEmail}`}
              className="mt-10 inline-block border-b pb-1 transition-opacity hover:opacity-60"
              style={{ borderColor: "var(--color-rust)" }}
            >
              <span className="eyebrow" style={{ color: "var(--color-rust)" }}>
                {active === "casting" ? "Enquire about casting" : "Enquire about booking"}
              </span>
            </a>
          </Reveal>
        </Section>

        {/* -------------------------------- credits ----------------------------- */}
        <Section className="py-20 md:py-28" width="text">
          <Reveal className="text-center">
            <Label tone="dim">Credits</Label>
            <Body dim className="mx-auto mt-6" measure="54ch">
              Set in Fraunces and Jost. Archival images are frames from video and are reproduced as
              found. Produced by {ARTIST.studio}.
            </Body>
          </Reveal>
        </Section>
      </PageTop>
    </main>
  );
}

function Address({ label, value, href }: { label: string; value: string; href: string }) {
  const external = href.startsWith("http");
  return (
    <Reveal>
      <Hairline strong />
      <Label tone="dim" className="mt-5 block">
        {label}
      </Label>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className="font-display mt-2 inline-block break-all transition-opacity hover:opacity-60"
        style={{ fontSize: "1.15rem" }}
      >
        {value}
      </a>
    </Reveal>
  );
}
