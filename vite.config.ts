import { defineConfig } from "vite";

// The playground reuses the exact pure engine from src/ and builds to /docs for
// GitHub Pages. Nothing here ever talks to a server.
export default defineConfig({
  root: "web",
  base: "./",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    target: "es2022",
  },
});
