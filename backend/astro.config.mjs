// @ts-check
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import { FRONTEND_HOST } from "./src/lib/constants";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  security: {
    allowedDomains: [
      {
        hostname: FRONTEND_HOST,
        protocol: "https",
      },
    ],
  },
});
