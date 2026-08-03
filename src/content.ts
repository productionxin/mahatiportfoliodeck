/**
 * Mahati Bhikshu — portfolio content.
 *
 * Single source of truth. The narrative stages and the two one-sheets
 * ("For Programmers" / "For Casting") all read from here, so a credit added
 * once appears everywhere it belongs.
 *
 * Sourced from the client's own material: MAHATI BHIKSHU.docx (official bio),
 * the Editorial and Casting portfolio PDFs, and the Eenadu feature of
 * 10 July 2026 (the coaching practice, which none of the PDFs cover).
 */

/* ------------------------------- identity -------------------------------- */

export const ARTIST = {
  name: "Mahati Bhikshu",
  firstName: "Mahati",
  lastName: "Bhikshu",
  roles: "Kuchipudi Artist · Actor · Choreographer · Educator",
  thesis: "One life. Many stages.",
  closing: "Still unfolding.",
  email: "mahatibhikshu@gmail.com",
  workEmail: "mahati.natyavedam@gmail.com",
  instagram: "mahatibhikshu",
  instagramUrl: "https://www.instagram.com/mahatibhikshu/",
  imdbUrl: "https://www.imdb.com/name/nm5825092/",
  imdbId: "nm5825092",
  studio: "Production X",
} as const;

/* -------------------------------- events --------------------------------- */

/**
 * Performances and events.
 *
 * Only engagements that are documented get listed — the past entries below
 * come from the press archive and the event poster. Add upcoming dates here
 * and they surface automatically at the top of /events and on the home page;
 * when there are none, the page says so rather than showing a stale list.
 */
export type EventItem = {
  title: string;
  date: string;
  /** ISO date, used only for sorting and for the upcoming/past split. */
  iso: string;
  time?: string;
  venue: string;
  city: string;
  note?: string;
  url?: string;
};

export const EVENTS: EventItem[] = [
  {
    title: "Nritya Deva Archana — Edition 2",
    date: "4 July 2026",
    iso: "2026-07-04",
    time: "5:30 PM",
    venue: "Shree Narayani Natyalaya",
    city: "Serilingampally, Hyderabad",
    note: "A Kuchipudi recital at the trust's second annual celebration, shared with Odissi dancer Sabarnik De.",
  },
  {
    title: "Mrigthrusna — Prajwala Conference",
    date: "2026",
    iso: "2026-01-01",
    venue: "Anti-Human Trafficking Conference",
    city: "Hyderabad",
    note: "A cultural presentation on trafficking and the resilience of survivors, staged for 500 delegates before judges of the Supreme Court and the Telangana High Court.",
  },
  {
    title: "Sri Venkateswara Vilasam",
    date: "2019",
    iso: "2019-01-01",
    venue: "Gudi Sambaralu",
    city: "Nizamabad",
    note: "Principal roles — Sri Padmavathi Devi, Goddess Lakshmi Devi and Sri Venkateswara Swamy.",
  },
];

/** Splits the diary against a reference date, newest first within each half. */
export function splitEvents(events: EventItem[], now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.iso >= today).sort((a, b) => a.iso.localeCompare(b.iso));
  const past = events.filter((e) => e.iso < today).sort((a, b) => b.iso.localeCompare(a.iso));
  return { upcoming, past };
}

/* ----------------------------- credentials ------------------------------- */

export const TITLES = [
  {
    title: "Doordarshan B-High Grade",
    body: "Awarded by India's national broadcaster — an official grading of my classical practice, and an empanelment among the network's highest-graded Kuchipudi artists.",
  },
  {
    title: "Nritya Nipun",
    body: "Conferred by the Atharva School of Fine Arts, Mumbai, for demonstrated mastery in nritta.",
  },
  {
    title: "Natya Vikas",
    body: "Recognition of my sustained contribution to the growth and teaching of Kuchipudi.",
  },
  {
    title: "Nrithya Pratibha Puraskar",
    body: "A distinction for excellence in performance and interpretive depth.",
  },
];

export const CROSS_TRAINING = [
  { title: "Contemporary Dance", under: "under the late Astad Deboo" },
  { title: "Odissi", under: "basics workshop under Ileana Citaristi" },
  { title: "Ballet", under: "Martha Graham School — beginner and intensive workshops" },
  { title: "Chhau", under: "two-week intensive under Sashidhar Acharya" },
];

/* ------------------------------ performance ------------------------------ */

export const REPERTOIRE = [
  {
    title: "Bho Shambo",
    note: "An invocation to Shiva.",
  },
  {
    title: "Kshetrayya Padam",
    note: "A padam composed by the poet Kshetrayya.",
  },
];

export const PRODUCTIONS = [
  {
    title: "Sri Venkateswara Vilasam",
    roles: "Sri Padmavathi Devi · Goddess Lakshmi Devi · Sri Venkateswara Swamy",
    where: "Gudi Sambaralu · Nizamabad, 2019",
  },
  {
    title: "Alwar Charitam",
    roles: "Principal role",
    where: "Temple and cultural festivals",
  },
];

/** Grouped so the festival list reads as a credential, not a wall of names. */
export const FESTIVALS = [
  {
    group: "State & Temple Festivals",
    items: [
      "TSNA Kaleswaram Festival",
      "TSNA Dussehra Festival",
      "Tirupati Utsavalu",
      "Sivaratri Brahmotsavalu, Sri Kalahasti",
      "Kinnera Nrityotsavalu",
      "Gudi Sambaralu, Nizamabad",
    ],
  },
  {
    group: "Dance Festivals",
    items: [
      "IIDF Hyderabad",
      "Kalopasana — Festival of Young Artists",
      "Atharvotsav Dance Festival, Mumbai",
      "Ardhang, Mumbai",
      "Madras Telugu Academy Festivals",
      "Guru Rohini Bhate Birth Centenary, Pune",
      "Nritya Deva Archana, Hyderabad",
    ],
  },
  {
    group: "Institutional Platforms",
    items: [
      "World Bank delegates, Administrative Staff College of India",
      "Society for Reproductive Biology & Comparative Endocrinology, CCMB",
      "International Conference on Molecular Signalling",
    ],
  },
];

export const INTERNATIONAL = {
  cities: ["London", "Toronto", "Dubai"],
  countries: "United Kingdom · Canada · UAE",
  note: "Guest performances with Nrityaarchana in Toronto, and a London brand-launch event for Maaya Entertainment and London Digital Media and TV Studio.",
};

/* -------------------------------- cinema --------------------------------- */

export type Film = {
  title: string;
  note: string;
  year?: string;
  hasStill: boolean;
};

/**
 * `hasStill: false` entries have no image in the asset library — they render
 * as typographic cards rather than being dropped from the list.
 */
export const FILMS: Film[] = [
  { title: "Sita", note: "Opposite Sonu Sood", year: "2019", hasStill: true },
  { title: "George Reddy", note: "Feature", year: "2019", hasStill: true },
  { title: "Radhe Shyam", note: "Feature", year: "2022", hasStill: true },
  { title: "11th Hour", note: "Feature", hasStill: false },
  { title: "Kinnerasani", note: "Titular role — most recent", year: "2022", hasStill: true },
];

export const BEHIND_CAMERA = [
  {
    role: "Assistant Acting Coach",
    project: "1: Nenokkadine",
  },
  {
    role: "Casting Director",
    project: "Aakashavani (SonyLIV)",
    note: "Brought on by producer Karthikeya, son of S.S. Rajamouli.",
  },
];

/* ------------------------------- coaching -------------------------------- */

/**
 * Stage VI. Sourced from the Eenadu interview of 10 July 2026 — this is her
 * present-tense practice and appears in none of the earlier portfolio PDFs.
 */
export const COACHING = {
  intro:
    "Actors came to my parents' house to train when I was a child. I watched from the doorway. Now the room is mine.",
  trained: [
    {
      name: "Sitara",
      note: "Coached for her commercial film work.",
    },
    {
      name: "Ayaas",
      note: "Lead of Sing Geetham — trained for his debut.",
    },
    {
      name: "Anish Reddy",
      note: "Introduced through Itlu Arjuna. In training.",
    },
    {
      name: "Don Bosco",
      note: "Coaching the film's leads ahead of release.",
    },
  ],
  forDirectors: [
    "Newcomers trained for Sukumar's productions",
    "Newcomers trained for Yeleti Chandrasekhar's productions",
  ],
  childhoodVisitors: ["Ram Pothineni", "Ileana", "Bellamkonda Sai Sreenivas", "Parvathy Melton"],
  method:
    "I learn what a newcomer likes and how they think. I watch how feeling reaches their eyes — how it moves across the face — and we work from there.",
};

/* --------------------------------- press --------------------------------- */

export type PressItem = {
  outlet: string;
  headline: string;
  date: string;
  summary: string;
  url?: string;
  kind: "feature" | "review" | "coverage";
};

/**
 * Three genuine stories. The archive holds ~25 clippings, but roughly twenty
 * of them are the same Nritya Deva Archana notice syndicated across Telugu
 * dailies — represented here once, with the syndication noted.
 */
export const PRESS: PressItem[] = [
  {
    outlet: "Eenadu",
    headline: "Teaching young leads the fundamentals",
    date: "10 July 2026",
    summary:
      "A feature on the coaching practice — training debut leads, casting for Aakashavani, and growing up in a house where actors came to learn.",
    kind: "feature",
  },
  {
    outlet: "Sakshi · Eenadu · and 20 more",
    headline: "Nritya Deva Archana — second annual celebration",
    date: "5 July 2026",
    summary:
      "A Kuchipudi recital at Shree Narayani Natyalaya, Kondapur, alongside Odissi dancer Sabarnik De. Covered across the Telugu dailies.",
    kind: "review",
  },
  {
    outlet: "Telangana Today",
    headline: "Prajwala hosts anti-human trafficking conference",
    date: "2026",
    summary:
      "Mrigthrusna — a cultural presentation on the realities of trafficking and the resilience of survivors — staged for 500 delegates before judges of the Supreme Court and Telangana High Court.",
    url: "https://telanganatoday.com/prajwala-hosts-anti-human-trafficking-conference-in-hyderabad",
    kind: "coverage",
  },
];

/* -------------------------------- plates --------------------------------- */

/**
 * The photographic record. The library holds five distinct visual registers —
 * mixing them freely is what made the earlier build read as a slide deck, so
 * each plate declares its own and the gallery lets a visitor filter by it.
 *
 * `asset` is the filename in src/assets; the route resolves it to an import.
 * Every plate is captioned rather than left bare — a catalogue, not a wall.
 */
export type Register = "stage" | "studio" | "portrait" | "film" | "archive";

export type Plate = {
  asset: string;
  register: Register;
  caption: string;
  alt: string;
  /**
   * The frame's true aspect ratio. Stored rather than assumed: the gallery
   * used to render every plate at 4:5, which re-cropped the 2:3 portraits and
   * cut heads off. Rendering each plate at its own ratio means the crop that
   * was made deliberately on export is the crop that ships.
   */
  ratio?: string;
};

export const REGISTER_LABELS: Record<Register | "all", string> = {
  all: "All Plates",
  stage: "In Performance",
  studio: "Studio",
  portrait: "Portrait",
  film: "Cinema",
  archive: "Archive",
};

export const PLATES: Plate[] = [
  {
    asset: "guru_mother_01.jpg",
    register: "archive",
    caption: "With her guru — Prof. Aruna Bhikshu",
    alt: "Mahati Bhikshu in a green and magenta Kuchipudi costume standing arm-in-arm with her mother and guru Prof. Aruna Bhikshu, who wears a deep red silk saree, on grass at night after a performance.",
  },
  {
    asset: "guru_mother_02.jpg",
    register: "archive",
    caption: "After a performance",
    alt: "Prof. Aruna Bhikshu and Mahati Bhikshu standing together outdoors in the evening, her mother's arm linked through hers.",
  },

  /* ------------------------------ portraiture ----------------------------- */
  {
    asset: "field_portrait.jpg",
    register: "portrait",
    caption: "Daylight",
    alt: "Close portrait of Mahati Bhikshu outdoors in daylight, in a magenta and green silk costume with gold temple jewellery, head lowered and hand resting near her chin.",
  },
  {
    asset: "field_seated.jpg",
    register: "portrait",
    caption: "Seated on grass",
    alt: "Mahati Bhikshu seated on grass in a green and magenta silk costume, one hand raised beside her head, trees blurred behind her.",
  },
  {
    asset: "contemporary_portrait_tight.jpg",
    register: "portrait",
    caption: "Editorial",
    alt: "Editorial portrait of Mahati Bhikshu in a dark green checked sari with silver tribal jewellery, one hand raised near her face in low warm light.",
  },

  /* -------------------------------- studio -------------------------------- */
  {
    asset: "cover_hero.jpg",
    ratio: "0.70",
    register: "studio",
    caption: "Mudra, raised",
    alt: "Mahati Bhikshu in a red silk blouse and gold-woven silk drape, one hand raised in a mudra, against a black backdrop hung with temple garlands.",
  },
  {
    asset: "repertoire_studio.jpg",
    ratio: "3/2",
    register: "studio",
    caption: "Bho Shambo — seated",
    alt: "Mahati Bhikshu seated on a red floor against a black drape in a red and gold silk costume, hands clasped beneath her chin.",
  },
  {
    asset: "repertoire_studio_2.jpg",
    register: "studio",
    caption: "Kshetrayya Padam — standing",
    alt: "Mahati Bhikshu standing against a black drape in a red and gold silk costume, arms extended in a Kuchipudi stance.",
  },
  {
    asset: "hand_detail.jpg",
    ratio: "1/1",
    register: "studio",
    caption: "Mudra",
    alt: "A hand held in a Kuchipudi mudra with red-tipped fingers, pearl and gold bracelets at the wrist, red silk sleeve below.",
  },
  {
    asset: "eyes_detail.jpg",
    ratio: "2/1",
    register: "studio",
    caption: "Drishti",
    alt: "Close crop of Mahati Bhikshu's eyes in performance make-up — heavy kohl liner and a red bindi.",
  },
  {
    asset: "jewelry_detail.jpg",
    ratio: "2/1",
    register: "studio",
    caption: "Temple jewellery",
    alt: "Temple jewellery detail — kemp stones set in gold with pearl drops.",
  },

  /* ----------------------------- in performance --------------------------- */
  {
    asset: "stage_symmetry.jpg",
    register: "stage",
    caption: "Symmetry",
    alt: "Mahati Bhikshu standing on a red-lit stage, both hands raised symmetrically beside her head in a mudra.",
  },
  {
    asset: "stage_fist.jpg",
    register: "stage",
    caption: "Nritta — red smoke",
    alt: "Mahati Bhikshu with fist raised and stance wide, lit against billowing orange-red smoke.",
  },
  {
    asset: "stage_green.jpg",
    register: "stage",
    caption: "Under green light",
    alt: "Mahati Bhikshu kneeling under green stage light, hands extended, two warm lamps glowing out of focus behind her.",
  },
  {
    asset: "stage_reaching.jpg",
    register: "stage",
    caption: "Reaching",
    alt: "Mahati Bhikshu seated low under violet light and haze, one arm reaching out with fingers in a mudra.",
  },
  {
    asset: "stage_leap.jpg",
    register: "stage",
    caption: "Mid-turn",
    alt: "Mahati Bhikshu mid-turn under violet stage light, one leg lifted behind her, drape flaring with the movement.",
  },
  {
    asset: "stage_lunge.jpg",
    register: "stage",
    caption: "Low lunge",
    alt: "Mahati Bhikshu in a deep lunge across a teal-lit stage floor, one arm sweeping out behind her.",
  },
  {
    asset: "stage_arms_wide.jpg",
    register: "stage",
    caption: "Arms wide",
    alt: "Mahati Bhikshu in a low stance under blue light, both arms extended wide with palms open.",
  },
  {
    asset: "stage_mauve.jpg",
    register: "stage",
    caption: "In haze",
    alt: "Mahati Bhikshu in profile against pale mauve haze, one hand raised, the stage otherwise dark.",
  },
  {
    asset: "stage_blue.jpg",
    register: "stage",
    caption: "Abhinaya",
    alt: "Mahati Bhikshu under deep blue light, hands held in an expressive gesture near her shoulder.",
  },
  {
    asset: "stage_recline_magenta.jpg",
    ratio: "3/2",
    register: "stage",
    caption: "Floor work — magenta",
    alt: "Mahati Bhikshu reclining across the stage floor under magenta light, weight on one arm.",
  },
  {
    asset: "stage_recline_blue.jpg",
    ratio: "3/2",
    register: "stage",
    caption: "Floor work — blue",
    alt: "The same reclining pose lit in deep blue, Mahati Bhikshu's hands drawn in towards her face.",
  },
  {
    asset: "stage_smoke_wide.jpg",
    ratio: "3/2",
    register: "stage",
    caption: "Alone in the smoke",
    alt: "A wide frame of Mahati Bhikshu small against a full stage of orange smoke.",
  },
  {
    asset: "principal_roles_group_tight.jpg",
    ratio: "5/6",
    register: "stage",
    caption: "Sri Venkateswara Vilasam — Nizamabad, 2019",
    alt: "Three dancers on a garlanded festival stage — Sri Venkateswara crowned at centre with Padmavathi and Lakshmi to either side, hands raised in abhaya.",
  },

  /* -------------------------------- archive ------------------------------- */
  {
    asset: "felicitation.jpg",
    ratio: "0.55",
    register: "archive",
    caption: "Felicitation",
    alt: "An elder in a red printed shirt draping a pink silk shawl over Mahati Bhikshu's shoulders on stage, her hands folded in gratitude.",
  },
  {
    asset: "award_ceremony.jpg",
    ratio: "3/2",
    register: "archive",
    caption: "Nrithya Pratibha Puraskar",
    alt: "Mahati Bhikshu on stage holding a framed citation, flanked by dignitaries and family.",
  },
  {
    asset: "archive_ceremony.jpg",
    ratio: "3/2",
    register: "archive",
    caption: "On stage with her teachers",
    alt: "A line of artists and dignitaries standing together on a decorated stage after a performance, a lit lamp at one side.",
  },
  {
    asset: "childhood_archival.jpg",
    ratio: "16/9",
    register: "archive",
    caption: "Bala Narakasura — age eight",
    alt: "A grainy archival video still: Mahati Bhikshu at age eight in costume on a dark stage, one arm extended in a mudra.",
  },

  /* -------------------------------- cinema -------------------------------- */
  {
    asset: "film_sita.jpg",
    ratio: "16/9",
    register: "film",
    caption: "Sita",
    alt: "Film still from Sita — an interior scene, a woman in a red and cream sari standing beside a seated man.",
  },
  {
    asset: "film_george_reddy.jpg",
    ratio: "16/9",
    register: "film",
    caption: "George Reddy",
    alt: "Film still from George Reddy — a student addressing a rally at a microphone before a hand-painted banner.",
  },
  {
    asset: "film_radhe_shyam.jpg",
    ratio: "16/9",
    register: "film",
    caption: "Radhe Shyam",
    alt: "Film still from Radhe Shyam — a woman in round glasses carrying a first-aid crate aboard a train carriage.",
  },
  {
    asset: "film_kinnerasani.jpg",
    ratio: "16/9",
    register: "film",
    caption: "Kinnerasani",
    alt: "Film still from Kinnerasani — a woman in an orange sari lying on stone in dappled outdoor light.",
  },
];

/* ------------------------------- teaching -------------------------------- */

export const INSTITUTIONS = [
  {
    name: "Bhikshu's House of Arts",
    role: "Founder",
    note: "Acting training for newcomers entering film.",
  },
  {
    name: "Natyavedam Academy",
    role: "Director",
    note: "Kuchipudi training and repertoire for the next generation.",
  },
];

/* ------------------------------- one-sheets ------------------------------ */

/**
 * Two audiences, two summaries, one dataset. A festival programmer and a
 * casting director want different first screens; both are derived from the
 * constants above so nothing drifts out of sync.
 */
export const FACT_SHEETS = {
  programmers: {
    label: "For Programmers",
    blurb: "Booking a classical recital or a festival slot.",
    facts: [
      { k: "Form", v: "Kuchipudi — solo recital and ensemble" },
      { k: "Grading", v: "Doordarshan B-High" },
      { k: "Training", v: "20+ years under Prof. Aruna Bhikshu" },
      { k: "Titles", v: "Nritya Nipun · Natya Vikas · Nrithya Pratibha Puraskar" },
      { k: "Repertoire", v: "Bho Shambo · Kshetrayya Padam — danced in full" },
      { k: "Productions", v: "Sri Venkateswara Vilasam · Alwar Charitam" },
      { k: "Also trained in", v: "Contemporary · Odissi · Ballet · Chhau" },
      { k: "Performed in", v: "India · United Kingdom · Canada · UAE" },
    ],
  },
  casting: {
    label: "For Casting",
    blurb: "Casting a role, or engaging an acting coach.",
    facts: [
      { k: "Films", v: "Sita · George Reddy · Radhe Shyam · 11th Hour · Kinnerasani" },
      { k: "Most recent", v: "Kinnerasani — titular role" },
      { k: "Behind camera", v: "Casting Director, Aakashavani (SonyLIV)" },
      { k: "Coaching", v: "Debut leads, and commercial work for Sitara" },
      { k: "For directors", v: "Sukumar · Yeleti Chandrasekhar productions" },
      { k: "Languages", v: "Telugu · English · Hindi" },
      { k: "Movement", v: "Classical, contemporary, ballet, Chhau — trained" },
      { k: "IMDb", v: ARTIST.imdbId },
    ],
  },
} as const;

/* ------------------------------ open items ------------------------------- */

/**
 * Placeholders awaiting material from the artist. Each `WatchMarker` with
 * `href="#"` corresponds to an entry here. Kept in code so they are easy to
 * find and wire up rather than scattered through the markup.
 *
 *  1. Bho Shambo — full recital recording
 *  2. Kshetrayya Padam — full recital recording
 *  3. Kinnerasani — trailer, and the song "Ninu Nanu Dache"
 *  4. Showreel — currently pointing at Instagram
 *  5. Shabdham — 2.7 GB master in Drive, needs a hosted web cut
 *
 * Also unresolved: the official bio names Sita as her debut, while the Eenadu
 * interview names the 2019 Kannada film Hangover as her first role. Sita is
 * listed as the debut here pending confirmation.
 */
export const PENDING_MEDIA = {
  bhoShambo: "#",
  kshetrayyaPadam: "#",
  kinnerasaniTrailer: "#",
  showreel: ARTIST.instagramUrl,
} as const;
