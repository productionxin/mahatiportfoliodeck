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
  photographyCredit: "Beyond Portrait Studio",
  studio: "Production X",
} as const;

/* ------------------------------- the stages ------------------------------ */

export type Stage = { id: string; numeral: string; label: string };

export const STAGES: Stage[] = [
  { id: "stage-1", numeral: "I", label: "Lineage" },
  { id: "stage-2", numeral: "II", label: "Nritta & Abhinaya" },
  { id: "stage-3", numeral: "III", label: "Beyond Kuchipudi" },
  { id: "stage-4", numeral: "IV", label: "The Second Stage" },
  { id: "stage-5", numeral: "V", label: "Natyavedam" },
  { id: "stage-6", numeral: "VI", label: "The Room Before the Camera" },
];

/** Direct jumps for professional visitors who arrive with one question. */
export const QUICK_LINKS = [
  { href: "#repertoire", label: "Repertoire" },
  { href: "#festivals", label: "Festivals" },
  { href: "#filmography", label: "Filmography" },
  { href: "#coaching", label: "Coaching" },
  { href: "#press", label: "Press" },
  { href: "#sheets", label: "One-sheets" },
  { href: "#contact", label: "Contact" },
];

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
