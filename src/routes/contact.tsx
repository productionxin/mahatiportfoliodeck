import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ARTIST, BACK_MATTER, CHAPTERS, FACT_SHEETS } from "@/content";
import { Page } from "@/book/Layout";
import { Display, Eyebrow, Reveal, Rule } from "@/book/primitives";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Correspondence — Mahati Bhikshu" },
      {
        name: "description",
        content: "One-sheets for programmers and casting, enquiries, and the colophon.",
      },
    ],
  }),
});

const SHEET_KEYS = ["programmers", "casting"] as const;

/**
 * Correspondence — the volume's closing apparatus.
 *
 * Carries the two one-sheets, because a professional visitor who has read
 * this far wants the summary and the address in one place, not scattered.
 */
function Contact() {
  const folio = BACK_MATTER.find((b) => b.to === "/contact")?.folio ?? 92;
  const [active, setActive] = useState<(typeof SHEET_KEYS)[number]>("programmers");
  const sheet = FACT_SHEETS[active];

  return (
    <Page runningHead="Correspondence" folio={folio}>
      <section className="py-16 md:py-24">
        <Reveal className="max-w-[62ch]">
          <Eyebrow tone="oxblood">Back Matter</Eyebrow>
          <Display as="h1" size="clamp(2.6rem, 7vw, 5rem)" className="mt-5">
            Correspondence
          </Display>
          <Rule className="mt-9 w-20" />
          <p className="mt-8" style={{ color: "var(--color-on-parch-dim)" }}>
            The same career, summarised for the question you came with.
          </p>
        </Reveal>
      </section>

      {/* ------------------------------ one-sheets --------------------------- */}
      <section className="border-t py-14 md:py-20" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <Reveal className="flex flex-wrap gap-3">
          {SHEET_KEYS.map((k) => {
            const on = active === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setActive(k)}
                aria-pressed={on}
                className="border px-5 py-3 transition-colors"
                style={{
                  borderColor: on ? "var(--color-oxblood-600)" : "rgba(184,138,62,0.5)",
                  background: on ? "var(--color-oxblood-600)" : "transparent",
                  color: on ? "var(--color-on-ink)" : "var(--color-on-parch)",
                }}
              >
                <span className="eyebrow">{FACT_SHEETS[k].label}</span>
              </button>
            );
          })}
        </Reveal>

        <Reveal className="mt-10" delay={90}>
          <p className="font-display italic" style={{ fontSize: "1.25rem" }}>
            {sheet.blurb}
          </p>
          <dl className="mt-8 border-t" style={{ borderColor: "rgba(184,138,62,0.35)" }}>
            {sheet.facts.map((f) => (
              <div
                key={f.k}
                className="grid gap-2 border-b py-5 md:grid-cols-[220px_1fr] md:gap-8"
                style={{ borderColor: "rgba(184,138,62,0.35)" }}
              >
                <dt>
                  <Eyebrow tone="oxblood">{f.k}</Eyebrow>
                </dt>
                <dd className="font-display" style={{ fontSize: "1.15rem", lineHeight: 1.4 }}>
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={`mailto:${active === "casting" ? ARTIST.email : ARTIST.workEmail}`}
              className="border px-6 py-4 transition-opacity hover:opacity-85"
              style={{
                borderColor: "var(--color-oxblood-600)",
                background: "var(--color-oxblood-600)",
                color: "var(--color-on-ink)",
              }}
            >
              <span className="eyebrow">
                {active === "casting" ? "Enquire about casting" : "Enquire about booking"}
              </span>
            </a>
            {active === "casting" && (
              <a
                href={ARTIST.imdbUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="border px-6 py-4 transition-opacity hover:opacity-75"
                style={{ borderColor: "rgba(184,138,62,0.6)" }}
              >
                <span className="eyebrow">View IMDb</span>
              </a>
            )}
          </div>
        </Reveal>
      </section>

      {/* -------------------------------- address ---------------------------- */}
      <section className="border-t py-14 md:py-20" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <Reveal>
          <Eyebrow tone="oxblood">Address</Eyebrow>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        </Reveal>
      </section>

      {/* -------------------------------- colophon --------------------------- */}
      <section className="border-t py-14 md:py-20" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <Reveal className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow tone="oxblood">Colophon</Eyebrow>
            <Display as="h2" size="clamp(1.8rem, 4vw, 2.6rem)" className="mt-4">
              About this volume.
            </Display>
          </div>
          <div className="md:col-span-7" style={{ color: "var(--color-on-parch-dim)" }}>
            <p style={{ maxWidth: "58ch" }}>
              Set in Playfair Display and Inter. Performance photography by{" "}
              <em>{ARTIST.photographyCredit}</em>. Archival plates are frames from video and are
              printed as found. Produced by {ARTIST.studio}.
            </p>
            <p className="mt-5" style={{ maxWidth: "58ch" }}>
              Six chapters, {BACK_MATTER.length} sections of back matter.
            </p>
            <Rule className="mt-8 w-16" />
            <p className="mt-6 text-sm">
              © {new Date().getFullYear()} {ARTIST.name}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------ back to top -------------------------- */}
      <section className="py-14 md:py-20">
        <Reveal className="flex flex-wrap items-center justify-between gap-6">
          <Link
            to="/chapters/$slug"
            params={{ slug: CHAPTERS[0].slug }}
            className="border px-6 py-4 transition-opacity hover:opacity-75"
            style={{ borderColor: "var(--color-gold-500)" }}
          >
            <Eyebrow tone="oxblood">← Return to Chapter I</Eyebrow>
          </Link>
          <Link
            to="/"
            className="font-display text-xl italic transition-opacity hover:opacity-70"
            style={{ color: "var(--color-oxblood-600)" }}
          >
            Close the book
          </Link>
        </Reveal>
      </section>
    </Page>
  );
}

function Address({ label, value, href }: { label: string; value: string; href: string }) {
  const external = href.startsWith("http");
  return (
    <div className="border-t pt-4" style={{ borderColor: "rgba(184,138,62,0.4)" }}>
      <Eyebrow tone="oxblood" className="block">
        {label}
      </Eyebrow>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className="font-display mt-2 inline-block break-all transition-opacity hover:opacity-70"
        style={{ fontSize: "1.05rem" }}
      >
        {value}
      </a>
    </div>
  );
}
