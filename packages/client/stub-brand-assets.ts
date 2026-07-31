/**
 * Vite plugin to stub missing brand assets from the private git repo.
 * These assets come from a private brand-assets repo which is not accessible.
 * This plugin intercepts imports from public/assets/** and returns appropriate stubs.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const STUB_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>`;

const STUB_SVG_COMPONENT = `
import { createComponent as _createComponent } from "solid-js";
function Stub() { return null; }
export default Stub;
`;

export default function stubBrandAssets() {
  const publicDir = resolve(__dirname, "public");

  return {
    name: "stub-brand-assets",
    enforce: "pre",

    resolveId(source: string, importer: string | undefined) {
      // Match both original imports and already-resolved paths
      const check = source + (importer ?? "");
      if (
        check.includes("public/assets/") ||
        check.includes("/assets/badges/") ||
        check.includes("/assets/sounds/") ||
        check.includes("/assets/inapp-promotion/")
      ) {
        return "\0stub-brand-asset:" + source;
      }
      return null;
    },

    load(id: string) {
      if (!id.startsWith("\0stub-brand-asset:")) return null;

      const originalId = id.slice("\0stub-brand-asset:".length);
      const isSvgComponent = originalId.includes("?component-solid");
      const isSvg = originalId.endsWith(".svg");

      if (isSvgComponent) {
        return STUB_SVG_COMPONENT;
      }

      if (isSvg) {
        return `export default ${JSON.stringify(STUB_SVG)};`;
      }

      // For sounds (.ogg, .mp3, .wav)
      if (
        originalId.endsWith(".ogg") ||
        originalId.endsWith(".mp3") ||
        originalId.endsWith(".wav")
      ) {
        return `const buf = new ArrayBuffer(0); export default buf; export const src = "";`;
      }

      // For images (.png, .jpg, etc)
      return `export default "";`;
    },

    // Also intercept Vite's transform to catch imports that slipped through
    transform(code: string, id: string) {
      // Replace any remaining public/assets imports
      if (
        code.includes("public/assets/") ||
        code.includes("/assets/badges/") ||
        code.includes("/assets/sounds/")
      ) {
        // Let the resolveId/load hooks handle it
        return null;
      }
      return null;
    },
  };
}
