// src/lib/lazyJose.ts

let cachedJose: typeof import('jose') | null = null;

/**
 * Dynamically loads the ESM-only `jose` module once and caches it for reuse.
 * Compatible with CommonJS or TypeScript projects not using `"type": "module"`.
 */
export async function getJose() {
  if (!cachedJose) {
    cachedJose = await import('jose');
  }
  return cachedJose;
}
