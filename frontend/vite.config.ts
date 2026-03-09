import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { router } from "sv-router/vite-plugin";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss(), router()],
  server: {
    port: 3000,
  },

  resolve: {
    alias: {
      $lib: path.resolve(__dirname, "./src/lib"),
      $features: path.resolve(__dirname, "./src/features"),
    },
  },
});
