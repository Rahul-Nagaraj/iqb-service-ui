// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  // On Vercel, NITRO_PRESET=vercel is injected via vercel.json so output goes to
  // `.vercel/output` (Build Output API), which Vercel auto-detects. Locally / in
  // the Lovable sandbox, the default cloudflare-module preset is used.
  nitro: {
    preset: process.env.NITRO_PRESET || (process.env.VERCEL ? "vercel" : undefined),
  },
});
