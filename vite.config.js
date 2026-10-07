import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  // Keep CRA's output folder so existing hosting config keeps working.
  // three.js lives in its own lazy chunk (~130 kB gzip), so allow it.
  build: { outDir: "build", chunkSizeWarningLimit: 600 },
});
