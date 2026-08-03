import { createFileRoute } from "@tanstack/react-router";

import { ARTIST, EVENTS, splitEvents, type EventItem } from "@/content";
import { ArrowLink, Body, Heading, Label, PageTitle, PageTop, Reveal, Section } from "@/site/ui";
import { requireAsset } from "@/site/assets";

export const Route = createFileRoute("/events")({
  component: Events,
  head: () => ({
    meta: [
      { title: "Events — Mahati Bhikshu" },
      { name: "description", content: "Upcoming and past performances, recitals and appearances." },
    ],
  }),
});

/**
 * Performances and events.
 *
 * Split into upcoming and past against today's date, so the page stays true
 * without anyone editing it. When nothing is scheduled the upcoming half says
 * so and offers the enquiry route — better than an empty heading, and better
 * than leaving a stale date sitting at the top pretending to be current.
 */
function Events() {
  const { upcoming, past } = splitEvents(EVENTS);

  return (
    <main>
      <PageTop>
        <Section className="pb-12 md:pb-16">
          <Reveal>
            <PageTitle>Performances and Events</PageTitle>
          </Reveal>
        </Section>

        <Section className="pb-16 md:pb-20">
          <Reveal>
            <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={requireAsset("gallery_02.jpg")}
                alt="Mahati Bhikshu in a dark green and magenta silk costume, fist raised and stance wide, lit against billowing red smoke."
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 38%" }}
              />
            </div>
            <Body dim className="mt-5">
              Below are Mahati's upcoming and past performances. For programming enquiries and
              available dates, please{" "}
              <a
                href={`mailto:${ARTIST.email}`}
                className="underline underline-offset-4 hover:opacity-60"
                style={{ color: "var(--color-rust)" }}
              >
                get in touch
              </a>
              .
            </Body>
          </Reveal>
        </Section>

        {/* ------------------------------- upcoming ----------------------------- */}
        <Section className="pb-16 md:pb-24">
          <Reveal>
            <Label>Upcoming</Label>
          </Reveal>

          {upcoming.length > 0 ? (
            <ul className="mt-8">
              {upcoming.map((e, i) => (
                <EventRow key={e.title + e.iso} event={e} delay={i * 90} highlight />
              ))}
            </ul>
          ) : (
            <Reveal
              className="mt-8 px-6 py-14 text-center md:px-10"
              {...({
                style: {
                  border: "1px solid var(--color-hairline-strong)",
                  background: "var(--color-paper-deep)",
                },
              } as object)}
            >
              <Heading as="h2" size="clamp(1.4rem, 3vw, 2rem)">
                No dates announced just now.
              </Heading>
              <Body dim className="mx-auto mt-4" measure="46ch">
                New performances are added here as they are confirmed. Follow along on Instagram, or
                write for available dates.
              </Body>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-8">
                <ArrowLink href={ARTIST.instagramUrl} external>
                  @{ARTIST.instagram}
                </ArrowLink>
                <ArrowLink href={`mailto:${ARTIST.email}`}>Enquire about dates</ArrowLink>
              </div>
            </Reveal>
          )}
        </Section>

        {/* --------------------------------- past ------------------------------- */}
        {past.length > 0 && (
          <Section className="py-16 md:py-24" tone="deep">
            <Reveal>
              <Label>Previously</Label>
            </Reveal>
            <ul className="mt-8">
              {past.map((e, i) => (
                <EventRow key={e.title + e.iso} event={e} delay={i * 80} />
              ))}
            </ul>
          </Section>
        )}
      </PageTop>
    </main>
  );
}

/**
 * One diary row: date block left, detail right. Upcoming rows carry the accent
 * rule so the eye finds them before the archive below.
 */
function EventRow({
  event,
  delay,
  highlight = false,
}: {
  event: EventItem;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <Reveal
      as="li"
      delay={delay}
      className="group grid gap-3 py-8 md:grid-cols-[200px_1fr] md:gap-10"
      {...({
        style: {
          borderTop: `1px solid ${highlight ? "var(--color-rust)" : "var(--color-hairline)"}`,
        },
      } as object)}
    >
      <div>
        <span
          className="font-display block"
          style={{ fontSize: "1.25rem", color: highlight ? "var(--color-rust)" : undefined }}
        >
          {event.date}
        </span>
        {event.time && (
          <span className="eyebrow mt-1 block" style={{ color: "var(--color-text-dim)" }}>
            {event.time}
          </span>
        )}
      </div>

      <div>
        <Heading as="h3" size="clamp(1.4rem, 3vw, 2.1rem)">
          {event.title}
        </Heading>
        <p className="eyebrow mt-3" style={{ color: "var(--color-text-dim)" }}>
          {event.venue} · {event.city}
        </p>
        {event.note && (
          <Body dim className="mt-4">
            {event.note}
          </Body>
        )}
        {event.url && (
          <div className="mt-5">
            <ArrowLink href={event.url} external>
              More information
            </ArrowLink>
          </div>
        )}
      </div>
    </Reveal>
  );
}
