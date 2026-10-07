import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm near-black surfaces and a single signal-orange accent.
        ink: {
          950: "#0b0a09",
          900: "#131210",
          800: "#1b1916",
          700: "#25221e",
        },
        accent: {
          DEFAULT: "#ff6b35",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans Fallback"', "system-ui", "sans-serif"],
        display: ['"Archivo"', '"Archivo Fallback"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
