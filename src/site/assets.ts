/**
 * Resolves the plate catalogue's `asset` filenames to hashed build URLs.
 *
 * The catalogue in content.ts is plain data — it names files rather than
 * importing them, so it stays free of bundler concerns and can be edited by
 * anyone. This module does the binding, eagerly so images resolve during SSR.
 */
const MODULES = import.meta.glob<{ default: string }>("../assets/*.{jpg,jpeg,png}", {
  eager: true,
});

const BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(MODULES).map(([path, mod]) => [path.split("/").pop() as string, mod.default]),
);

/** Returns the built URL for an asset filename, or undefined if absent. */
export function asset(filename: string): string | undefined {
  return BY_NAME[filename];
}

/** Same, but throws if a record names a file that is not in src/assets. */
export function requireAsset(filename: string): string {
  const url = BY_NAME[filename];
  if (!url) {
    throw new Error(`Missing asset "${filename}". Add it to src/assets or correct the catalogue.`);
  }
  return url;
}
