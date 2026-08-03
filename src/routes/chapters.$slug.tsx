import { createFileRoute, notFound, Link } from "@tanstack/react-router";

import {
  BEHIND_CAMERA,
  CHAPTERS,
  COACHING,
  CROSS_TRAINING,
  FILMS,
  INSTITUTIONS,
  INTERNATIONAL,
  PENDING_MEDIA,
  PRODUCTIONS,
  REPERTOIRE,
  TITLES,
  type Chapter,
} from "@/content";
import { Page, PageTurn } from "@/book/Layout";
import { Display, Epigraph, Eyebrow, PlateFrame, Reveal, Rule } from "@/book/primitives";
import { requireAsset } from "@/book/assets";

export const Route = createFileRoute("/chapters/$slug")({
  loader: ({ params }) => {
    const chapter = CHAPTERS.find((c) => c.slug === params.slug);
    if (!chapter) throw notFound();
    return { chapter };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.chapter.title} — Mahati Bhikshu` },
          { name: "description", content: loaderData.chapter.epigraph },
        ]
      : [],
  }),
  component: ChapterPage,
});

/** Opening plate for each chapter, and the paper it is printed on. */
const CHAPTER_PLATE: Record<string, { asset: string; tone: "parch" | "ink" }> = {
  lineage: { asset: "outdoor_fullpose.jpg", tone: "parch" },
  "nritta-abhinaya": { asset: "gallery_02.jpg", tone: "ink" },
  "beyond-kuchipudi": { asset: "outdoor_portrait.jpg", tone: "parch" },
  "the-second-stage": { asset: "contemporary_portrait_tight.jpg", tone: "ink" },
  natyavedam: { asset: "gallery_07.jpg", tone: "parch" },
  "the-room": { asset: "gallery_08.jpg", tone: "ink" },
};

function ChapterPage() {
  const { chapter } = Route.useLoaderData();
  const plate = CHAPTER_PLATE[chapter.slug];
  const tone = plate?.tone ?? "parch";

  return (
    <Page runningHead={`${chapter.numeral} · ${chapter.title}`} folio={chapter.folio} tone={tone}>
      <ChapterOpener chapter={chapter} tone={tone} />
      <ChapterBody slug={chapter.slug} tone={tone} />
      <PageTurn slug={chapter.slug} />
    </Page>
  );
}

/* -------------------------------- opener --------------------------------- */

function ChapterOpener({ chapter, tone }: { chapter: Chapter; tone: "parch" | "ink" }) {
  const plate = CHAPTER_PLATE[chapter.slug];
  return (
    // Centred rather than bottom-aligned: the opening plate is a tall 2:3 and
    // a short title block, so aligning to the foot left a dead column above it.
    <div className="grid gap-12 py-16 md:grid-cols-12 md:items-center md:gap-14 md:py-24">
      <Reveal className="md:col-span-7">
        <Eyebrow tone={tone === "ink" ? "gold" : "oxblood"}>Chapter {chapter.numeral}</Eyebrow>
        <Display
          as="h1"
          size="clamp(2.6rem, 8vw, 5.6rem)"
          className="mt-5"
          color={tone === "ink" ? "var(--color-on-ink)" : undefined}
        >
          {chapter.title}
        </Display>
        <p
          className="font-display mt-4 italic"
          style={{
            fontSize: "clamp(1.1rem, 2.4vw, 1.5rem)",
            color: tone === "ink" ? "var(--color-on-ink-dim)" : "var(--color-on-parch-dim)",
          }}
        >
          {chapter.subtitle}
        </p>
        <Rule className="mt-10 w-20" />
        <Epigraph className="mt-8" tone={tone}>
          {chapter.epigraph}
        </Epigraph>
      </Reveal>

      {plate && (
        <Reveal className="md:col-span-5" delay={120}>
          <PlateFrame src={requireAsset(plate.asset)} alt="" ratio="2/3" tone={tone} priority />
        </Reveal>
      )}
    </div>
  );
}

/* --------------------------------- bodies -------------------------------- */

function ChapterBody({ slug, tone }: { slug: string; tone: "parch" | "ink" }) {
  switch (slug) {
    case "lineage":
      return <Lineage />;
    case "nritta-abhinaya":
      return <NrittaAbhinaya />;
    case "beyond-kuchipudi":
      return <BeyondKuchipudi />;
    case "the-second-stage":
      return <SecondStage />;
    case "natyavedam":
      return <Natyavedam />;
    case "the-room":
      return <TheRoom />;
    default:
      return <div className="py-16" style={{ color: tone === "ink" ? "#fff" : undefined }} />;
  }
}

/** Section heading used inside chapter bodies. */
function SectionHead({
  eyebrow,
  title,
  tone = "parch",
  note,
}: {
  eyebrow: string;
  title: string;
  tone?: "parch" | "ink";
  note?: string;
}) {
  return (
    <Reveal>
      <Eyebrow tone={tone === "ink" ? "cinema" : "oxblood"}>{eyebrow}</Eyebrow>
      <Display as="h2" size="clamp(1.8rem, 4vw, 2.8rem)" className="mt-4">
        {title}
      </Display>
      <Rule className="mt-7 w-16" />
      {note && (
        <p
          className="mt-7 max-w-[62ch]"
          style={{
            color: tone === "ink" ? "var(--color-on-ink-dim)" : "var(--color-on-parch-dim)",
          }}
        >
          {note}
        </p>
      )}
    </Reveal>
  );
}

/* ---------------------------------- I ------------------------------------ */

function Lineage() {
  return (
    <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
      <div className="grid gap-14 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p
            className="font-display"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2rem)", lineHeight: 1.4 }}
          >
            I am the daughter of <em>Dr. N.J. Bhikshu</em>, a renowned theatre actor, and{" "}
            <em>Prof. Aruna Bhikshu</em>, a Kuchipudi exponent and choreographer — I grew up inside
            the art form itself.
          </p>
          <p className="mt-8" style={{ color: "var(--color-on-parch-dim)", maxWidth: "58ch" }}>
            For more than twenty years, my mother has been my guru. She taught at the University of
            Hyderabad's school of dance; the studio was my living room, and the stage was inherited
            before I ever chose it.
          </p>
          <p className="mt-6" style={{ color: "var(--color-on-parch-dim)", maxWidth: "58ch" }}>
            Actors came to the house to train with my parents while I was small — I learned what a
            rehearsal looked like before I understood what it was for. That room returns in Chapter
            VI.
          </p>
        </Reveal>

        <Reveal className="md:col-span-5" delay={120}>
          {/* A video frame, not a photograph — framed as an archival plate so
              its softness reads as age rather than as a fault. */}
          <figure
            className="border p-3"
            style={{
              borderColor: "var(--color-gold-500)",
              background: "var(--color-parchment-200)",
            }}
          >
            <div style={{ border: "1px solid rgba(34,30,23,0.55)" }}>
              <img
                src={requireAsset("childhood_archival.jpg")}
                alt="A grainy archival video still: Mahati Bhikshu at age eight in costume on a dark stage, one arm extended in a mudra."
                loading="lazy"
                className="block w-full"
                style={{ filter: "sepia(0.18) contrast(1.05)" }}
              />
            </div>
            <figcaption className="mt-4 px-1">
              <Eyebrow tone="oxblood" className="block">
                Archival Plate — First Appearance
              </Eyebrow>
              <span className="mt-2 block font-display italic text-lg leading-snug">
                Bala Narakasura, from the musical dance drama <em>Narakasura Vadha</em> — age eight.
              </span>
              <span className="mt-3 block text-sm" style={{ color: "var(--color-on-parch-dim)" }}>
                That same year I played Bhakta Prahlada in <em>Parikatha</em>, where{" "}
                <em>vachika abhinaya</em> — the voice as gesture — was introduced to me.
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- II ----------------------------------- */

function NrittaAbhinaya() {
  return (
    <>
      <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHead
              eyebrow="Titles & Recognition"
              title="A record of grades, honours, and vidwat."
              tone="ink"
            />
            <Reveal className="mt-10">
              <PlateFrame
                src={requireAsset("award_ceremony.jpg")}
                alt="Mahati Bhikshu on stage holding a framed citation, flanked by dignitaries and family after receiving the Nrithya Pratibha Puraskar."
                caption="Receiving the Nrithya Pratibha Puraskar"
                ratio="3/2"
                tone="ink"
              />
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <ul className="border-t" style={{ borderColor: "rgba(184,138,62,0.35)" }}>
                {TITLES.map((t, i) => (
                  <li
                    key={t.title}
                    className="border-b py-6"
                    style={{ borderColor: "rgba(184,138,62,0.35)" }}
                  >
                    <div className="flex items-baseline gap-4">
                      <Eyebrow tone="gold">{String(i + 1).padStart(2, "0")}</Eyebrow>
                      <Display as="h3" size="clamp(1.3rem, 2.6vw, 1.9rem)">
                        {t.title}
                      </Display>
                    </div>
                    <p
                      className="mt-3 pl-10"
                      style={{ color: "var(--color-on-ink-dim)", maxWidth: "58ch" }}
                    >
                      {t.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="mt-10">
              <Link
                to="/honours"
                className="inline-block border px-6 py-4 transition-opacity hover:opacity-75"
                style={{ borderColor: "var(--color-gold-500)" }}
              >
                <Eyebrow tone="gold">Full record of honours →</Eyebrow>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <SectionHead
          eyebrow="Repertoire"
          title="Bho Shambo. Kshetrayya Padam."
          tone="ink"
          note="Two pieces I return to often — an invocation to Shiva, and a padam composed by the poet Kshetrayya. Both live in my solo recitals, danced in full."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {REPERTOIRE.map((r, i) => (
            <Reveal key={r.title} delay={i * 110}>
              <PlateFrame
                src={requireAsset(i === 0 ? "repertoire_studio.jpg" : "repertoire_studio_2.jpg")}
                alt={
                  i === 0
                    ? "Mahati Bhikshu seated on a red floor against a black drape in a red and gold silk costume, hands clasped beneath her chin."
                    : "Mahati Bhikshu standing against a black drape in a red and gold silk costume, arms extended in a Kuchipudi stance."
                }
                caption={r.title}
                ratio="2/3"
                tone="ink"
              />
              <p className="mt-2 text-sm" style={{ color: "var(--color-on-ink-dim)" }}>
                {r.note}
              </p>
            </Reveal>
          ))}
        </div>
        {PENDING_MEDIA.bhoShambo === "#" && (
          <Reveal className="mt-10">
            <p className="font-display italic" style={{ color: "var(--color-on-ink-dim)" }}>
              Full recordings of both pieces exist — links to follow.
            </p>
          </Reveal>
        )}
      </section>

      <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <SectionHead
          eyebrow="Principal Roles"
          title="In production."
          tone="ink"
          note="Solo work sits alongside principal roles in full-length dance dramas."
        />
        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7">
            <PlateFrame
              src={requireAsset("principal_roles_group_tight.jpg")}
              alt="Three dancers on a garlanded festival stage — Sri Venkateswara crowned at centre with Padmavathi and Lakshmi to either side, hands raised in abhaya."
              ratio="4/5"
              tone="ink"
            />
          </Reveal>
          <Reveal className="md:col-span-5" delay={120}>
            <ul className="space-y-8">
              {PRODUCTIONS.map((p) => (
                <li key={p.title}>
                  <Display as="h3" size="clamp(1.4rem, 3vw, 2rem)" italic>
                    {p.title}
                  </Display>
                  <p className="mt-2" style={{ color: "var(--color-on-ink)" }}>
                    {p.roles}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--color-on-ink-dim)" }}>
                    {p.where}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-6">
            <Eyebrow tone="cinema">Abroad</Eyebrow>
            <Display as="h2" size="clamp(2.2rem, 6vw, 4rem)" className="mt-5">
              {INTERNATIONAL.cities.map((c, i) => (
                <span key={c}>
                  {i === INTERNATIONAL.cities.length - 1 ? (
                    <span style={{ fontStyle: "italic", color: "var(--color-gold-400)" }}>
                      {c}.
                    </span>
                  ) : (
                    <>{c}.</>
                  )}
                  {i < INTERNATIONAL.cities.length - 1 && <br />}
                </span>
              ))}
            </Display>
          </Reveal>
          <Reveal className="md:col-span-6" delay={100}>
            <p style={{ color: "var(--color-on-ink-dim)", maxWidth: "48ch" }}>
              {INTERNATIONAL.note}
            </p>
            <p className="mt-4" style={{ color: "var(--color-on-ink-dim)" }}>
              {INTERNATIONAL.countries}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* --------------------------------- III ----------------------------------- */

function BeyondKuchipudi() {
  return (
    <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
      <SectionHead
        eyebrow="Cross-training"
        title="Vocabularies I've gathered from other rooms."
        note="Kuchipudi is the spine. These are the other grammars — each one changed how I hold weight, or how I hold a pause."
      />
      <ol className="mt-16">
        {CROSS_TRAINING.map((c, i) => (
          <Reveal
            as="li"
            key={c.title}
            delay={i * 90}
            className="grid gap-3 border-b py-8 md:grid-cols-[5rem_1fr_auto] md:items-baseline md:gap-8"
            {...({ style: { borderColor: "rgba(184,138,62,0.3)" } } as object)}
          >
            <Eyebrow tone="oxblood">{String(i + 1).padStart(2, "0")}</Eyebrow>
            <Display as="h3" size="clamp(1.6rem, 3.6vw, 2.4rem)">
              {c.title}
            </Display>
            <span
              className="font-display italic"
              style={{ color: "var(--color-on-parch-dim)", fontSize: "1.05rem" }}
            >
              {c.under}
            </span>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ---------------------------------- IV ----------------------------------- */

function SecondStage() {
  return (
    <>
      <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <Eyebrow tone="cinema">Before the Camera Ever Saw Me</Eyebrow>
            <p
              className="font-display mt-6"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)", lineHeight: 1.35 }}
            >
              I came into film from behind it — coaching actors, then casting them —{" "}
              <span style={{ color: "var(--color-gold-400)" }}>craft before performance.</span>
            </p>
          </Reveal>
          <Reveal className="md:col-span-5" delay={110}>
            <ul>
              {BEHIND_CAMERA.map((b) => (
                <li
                  key={b.project}
                  className="border-t py-5"
                  style={{ borderColor: "rgba(184,138,62,0.3)" }}
                >
                  <Eyebrow tone="gold" className="block">
                    {b.role}
                  </Eyebrow>
                  <span className="font-display mt-1 block text-xl italic">{b.project}</span>
                  {b.note && (
                    <span
                      className="mt-1 block text-sm"
                      style={{ color: "var(--color-on-ink-dim)" }}
                    >
                      {b.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <SectionHead
          eyebrow="On Screen"
          title="Filmography."
          tone="ink"
          note="Five features to date. A casting visitor can scan the list; the stills are trailer frames, framed as such."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FILMS.map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <FilmCard film={f} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

const FILM_STILL: Record<string, string> = {
  Sita: "film_sita.jpg",
  "George Reddy": "film_george_reddy.jpg",
  "Radhe Shyam": "film_radhe_shyam.jpg",
  Kinnerasani: "film_kinnerasani.jpg",
};

function FilmCard({ film }: { film: (typeof FILMS)[number] }) {
  const still = FILM_STILL[film.title];
  const src = still ? requireAsset(still) : undefined;
  return (
    <div
      className="relative aspect-[16/9] overflow-hidden"
      style={{ border: "1px solid var(--color-gold-500)", background: "var(--color-ink-800)" }}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={`Film still from ${film.title}.`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(21,19,15,0.12) 0%, rgba(21,19,15,0.42) 55%, rgba(21,19,15,0.9) 100%)",
            }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(184,138,62,0.16) 0%, rgba(21,19,15,0) 70%)",
          }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-2"
        style={{ border: "1px solid rgba(184,138,62,0.45)" }}
      />
      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <Eyebrow tone="gold">Film</Eyebrow>
          {film.year && <Eyebrow tone="gold">{film.year}</Eyebrow>}
        </div>
        <div>
          <Display
            as="h3"
            size="clamp(1.4rem, 2.6vw, 2rem)"
            color="var(--color-on-ink)"
            className={src ? "[text-shadow:0_2px_12px_rgba(0,0,0,0.6)]" : ""}
          >
            {film.title}
          </Display>
          <p className="mt-2 italic" style={{ color: "var(--color-on-ink-dim)" }}>
            {film.note}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- V ------------------------------------ */

function Natyavedam() {
  return (
    <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
      <SectionHead
        eyebrow="Passing It Forward"
        title="Two houses, one purpose."
        note="What is kept is what is taught. One house trains dancers; the other trains actors."
      />
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {INSTITUTIONS.map((inst, i) => (
          <Reveal key={inst.name} delay={i * 120}>
            <div
              className="flex h-full flex-col justify-between border p-8 md:p-10"
              style={{ borderColor: "rgba(184,138,62,0.45)" }}
            >
              <div>
                <Eyebrow tone="oxblood">{inst.role}</Eyebrow>
                <Display as="h3" size="clamp(1.6rem, 3.4vw, 2.3rem)" className="mt-4">
                  {inst.name}
                </Display>
                <p className="mt-5" style={{ color: "var(--color-on-parch-dim)" }}>
                  {inst.note}
                </p>
              </div>
              <Rule className="mt-10 w-12" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- VI ----------------------------------- */

function TheRoom() {
  return (
    <>
      <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <Reveal className="max-w-[62ch]">
          <Eyebrow tone="cinema">The Practice Now</Eyebrow>
          <p
            className="font-display mt-6 italic"
            style={{
              fontSize: "clamp(1.5rem, 3.4vw, 2.4rem)",
              lineHeight: 1.32,
              color: "var(--color-on-ink)",
            }}
          >
            “{COACHING.intro}”
          </p>
          <Rule className="mt-10 w-16" />
          <p className="mt-8" style={{ color: "var(--color-on-ink-dim)" }}>
            {COACHING.method}
          </p>
        </Reveal>
      </section>

      <section className="border-t py-16 md:py-24" style={{ borderColor: "rgba(184,138,62,0.3)" }}>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHead eyebrow="In Training" title="Who I'm working with." tone="ink" />
            <ul className="mt-10">
              {COACHING.trained.map((t, i) => (
                <Reveal
                  as="li"
                  key={t.name}
                  delay={i * 80}
                  className="border-b py-6"
                  {...({ style: { borderColor: "rgba(184,138,62,0.3)" } } as object)}
                >
                  <div className="flex items-baseline gap-4">
                    <Eyebrow tone="gold">{String(i + 1).padStart(2, "0")}</Eyebrow>
                    <Display as="h3" size="clamp(1.4rem, 2.8vw, 2rem)">
                      {t.name}
                    </Display>
                  </div>
                  <p className="mt-2 pl-10" style={{ color: "var(--color-on-ink-dim)" }}>
                    {t.note}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal className="md:col-span-5" delay={140}>
            <div
              className="border p-7 md:p-8"
              style={{ borderColor: "var(--color-gold-500)", background: "var(--color-ink-800)" }}
            >
              <Eyebrow tone="gold" className="block">
                For Directors
              </Eyebrow>
              <ul className="mt-4 space-y-3">
                {COACHING.forDirectors.map((d) => (
                  <li key={d} className="font-display italic leading-snug">
                    {d}
                  </li>
                ))}
              </ul>
              <Rule className="my-8 w-10" />
              <Eyebrow tone="gold" className="block">
                The Living Room, Before
              </Eyebrow>
              <p className="mt-3 text-sm" style={{ color: "var(--color-on-ink-dim)" }}>
                Actors who came to my parents' house to train while I was a child:
              </p>
              <ul className="mt-3 space-y-1">
                {COACHING.childhoodVisitors.map((n) => (
                  <li key={n} className="font-display italic">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
