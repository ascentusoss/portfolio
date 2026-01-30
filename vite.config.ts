import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(__dirname, "src"),
  publicDir: false,
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        termosDeUso: resolve(__dirname, "src/termos-de-uso/index.html"),
        politicaDePrivacidade: resolve(
          __dirname,
          "src/politica-de-privacidade/index.html",
        ),
      },
    },
  },
});
