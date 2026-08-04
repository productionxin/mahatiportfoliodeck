/**
 * Site navigation.
 *
 * Plainly named sections rather than invented vocabulary — a casting director
 * or a festival programmer should be able to find what they came for without
 * first learning the site's metaphors.
 */
export type NavItem = { to: string; label: string };

export const NAV: NavItem[] = [
  { to: "/about", label: "About" },
  { to: "/works", label: "Works" },
  { to: "/film", label: "Film" },
  { to: "/teaching", label: "Teaching" },
  { to: "/gallery", label: "Gallery" },
  { to: "/events", label: "Events" },
  { to: "/press", label: "Press" },
  { to: "/contact", label: "Contact" },
];
