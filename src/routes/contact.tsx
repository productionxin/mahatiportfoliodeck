import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ARTIST, FACT_SHEETS } from "@/content";
import { Body, Hairline, Label, Lift, PageTitle, PageTop, Reveal, Section } from "@/site/ui";
import { useInView } from "@/site/motion";
import { requireAsset } from "@/site/assets";

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
            <Lift as="h2" className="font-display mt-4" style={{ fontSize: "var(--text-h2)" }}>
              The same career, summarised for the question you came with.
            </Lift>
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
                  className="navlink px-1 py-2.5 transition-opacity hover:opacity-60"
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

          {/* Keyed on the active sheet so switching tabs replays the arrival
              — without the key React reuses the nodes and the numbers change
              underneath you with no acknowledgement that anything happened. */}
          <div key={active} className="route-enter mt-10">
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
          </div>
        </Section>

        {/* ------------------------------- sign-off ----------------------------- */}
        {/* Contact was the one page with nothing to look at — a column of
            addresses and a table. It closes on a plate instead, full-bleed and
            wide, so the last thing a programmer sees is the work. */}
        <ClosingPlate />

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

function ClosingPlate() {
  const ref = useInView<HTMLElement>(0.1);
  return (
    <section ref={ref as never} className="relative w-full overflow-hidden">
      <div className="plate relative w-full" style={{ aspectRatio: "21/9" }}>
        <img
          src={requireAsset("stage_recline_blue.jpg")}
          alt="Mahati Bhikshu crouched low in blue stage haze, in a green and magenta silk costume, both hands drawn in towards her face."
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 40%" }}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 45%, var(--scrim-hero-foot) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-10 md:pb-10">
        <div className="mx-auto max-w-[1240px]">
          <span className="eyebrow" style={{ color: "var(--color-on-dark)" }}>
            {ARTIST.roles}
          </span>
        </div>
      </div>
    </section>
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
