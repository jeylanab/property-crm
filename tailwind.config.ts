import type { Config } from "tailwindcss";

// Design tokens taken from the reference dashboard:
// soft gray canvas, white shell, light-gray cards, near-black ink, lime + coral badges.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F3F4F7",      // page background
        shell: "#FFFFFF",       // big white containers + top nav
        card: "#F5F5F5",        // inner cards
        line: "#E6E6E9",        // thin borders / dividers
        ink: {
          DEFAULT: "#0B0A1F",   // headings, big numbers, dark chart bars
          soft: "#6B6B76",      // secondary text
          faint: "#A3A3AD",     // axis labels, placeholders
        },
        lime: { DEFAULT: "#B4F25C", dark: "#1F3B00" },   // positive badge
        coral: { DEFAULT: "#FF6B5E", dark: "#FFFFFF" },  // negative badge
        status: {
          blueBg: "#DDE7FF",  blueText: "#2F55D4",       // in progress
          greenBg: "#DDF7E6", greenText: "#1E9A57",      // complete / paid
          pinkBg: "#FFE3E0",  pinkText: "#E5484D",       // waiting / overdue
        },
      },
      borderRadius: {
        card: "28px",
        shell: "36px",
        pill: "999px",
      },
      fontFamily: {
        sans: ["var(--font-urbanist)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
