/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
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
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        display: ['"Archivo"', '"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
