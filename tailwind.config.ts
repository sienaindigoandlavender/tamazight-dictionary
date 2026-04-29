import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted)" },
        "muted-foreground": "var(--muted)",
        accent: { DEFAULT: "var(--accent)", warm: "var(--accent-warm)" },
        surface: "var(--surface)",
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        tifinagh: ['Noto Sans Tifinagh', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
