/**
 * The site header — a plain horizontal bar, logotype left and sections right,
 * with the social accounts at the end. It is fixed, and turns from transparent
 * to paper once the page scrolls, so it can sit over the home hero without a
 * band across the photograph.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ARTIST } from "@/content";
import { NAV } from "./nav";
import { useScrolled } from "./motion";

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const onHome = path === "/";
  // Over the home hero the bar is transparent and its lettering is light;
  // everywhere else it sits on paper from the start.
  const light = onHome && !scrolled;

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const fg = light ? "var(--color-on-dark)" : "var(--color-text)";

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
        style={{
          background: light ? "transparent" : "var(--color-paper)",
          borderBottom: light ? "1px solid transparent" : "1px solid var(--color-hairline)",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-8 px-6 py-5 md:px-10">
          <Link to="/" className="tap shrink-0 transition-opacity hover:opacity-70">
            <span
              className="font-display"
              style={{ color: fg, fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)", letterSpacing: "0" }}
            >
              {ARTIST.name}
            </span>
          </Link>

          <nav aria-label="Sections" className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => {
              const active = path === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="navlink transition-opacity hover:opacity-60"
                  style={{
                    color: fg,
                    borderBottom: active ? `1px solid ${fg}` : "1px solid transparent",
                    paddingBottom: 2,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <span aria-hidden style={{ width: 1, height: 18, background: fg, opacity: 0.3 }} />
            <Social fg={fg} />
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="tap w-11 justify-center lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span aria-hidden className="flex flex-col gap-[6px]">
              {[0, 1, 2].map((i) => (
                <span key={i} className="block" style={{ width: 26, height: 1, background: fg }} />
              ))}
            </span>
          </button>
        </div>
      </header>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[70] overflow-y-auto lg:hidden"
          style={{ background: "var(--color-paper)" }}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-display" style={{ fontSize: "1.35rem" }}>
              {ARTIST.name}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="tap px-2"
              aria-label="Close menu"
            >
              <span className="eyebrow" style={{ color: "var(--color-rust)" }}>
                Close
              </span>
            </button>
          </div>
          <nav aria-label="Sections" className="px-6 pb-16 pt-6">
            <ul>
              {NAV.map((item) => (
                <li key={item.to} style={{ borderTop: "1px solid var(--color-hairline)" }}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-5 font-display"
                    style={{
                      fontSize: "clamp(1.8rem, 7vw, 2.6rem)",
                      color: path === item.to ? "var(--color-rust)" : "var(--color-text)",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex items-center gap-6">
              <Social fg="var(--color-text)" />
            </div>
            <a
              href={`mailto:${ARTIST.email}`}
              className="mt-8 inline-block font-display italic"
              style={{ fontSize: "1.15rem", color: "var(--color-rust)" }}
            >
              {ARTIST.email}
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

function Social({ fg }: { fg: string }) {
  return (
    <span className="flex items-center gap-4">
      <a
        href={ARTIST.instagramUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Instagram"
        className="transition-opacity hover:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill={fg} stroke="none" />
        </svg>
      </a>
      <a
        href={ARTIST.imdbUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="IMDb"
        className="transition-opacity hover:opacity-60"
      >
        <span className="eyebrow" style={{ color: fg, fontSize: 12 }}>
          IMDb
        </span>
      </a>
    </span>
  );
}

/* --------------------------------- footer -------------------------------- */

export function Footer() {
  return (
    <footer
      className="mt-24 md:mt-32"
      style={{
        borderTop: "1px solid var(--color-hairline)",
        background: "var(--color-paper-deep)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              {ARTIST.name}
            </span>
            <p className="mt-3" style={{ color: "var(--color-text-dim)" }}>
              {ARTIST.roles}
            </p>
          </div>

          <nav aria-label="Sections" className="md:col-span-4">
            <span className="eyebrow" style={{ color: "var(--color-text-dim)" }}>
              Sections
            </span>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="navlink tap transition-opacity hover:opacity-60">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <span className="eyebrow" style={{ color: "var(--color-text-dim)" }}>
              Enquiries
            </span>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${ARTIST.email}`}
                  className="navlink tap break-all hover:opacity-60"
                >
                  {ARTIST.email}
                </a>
              </li>
              <li>
                <a
                  href={ARTIST.instagramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="navlink tap hover:opacity-60"
                >
                  @{ARTIST.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col gap-2 pt-6 text-sm md:flex-row md:items-center md:justify-between"
          style={{ borderTop: "1px solid var(--color-hairline)", color: "var(--color-text-dim)" }}
        >
          <span>{ARTIST.studio}</span>
          <span>
            © {new Date().getFullYear()} {ARTIST.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
