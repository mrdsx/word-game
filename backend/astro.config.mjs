// @ts-check
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  security: {
    allowedDomains: [
      {
        hostname: "classic-word-game.vercel.app",
        protocol: "https",
      },
    ],
  },
});
