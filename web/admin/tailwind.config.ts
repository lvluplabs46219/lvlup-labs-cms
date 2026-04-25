import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        background: "#FAF9F6",
        foreground: "#282623",
        brand: {
          leather: "#BC6C25",
          moss: "#606C38",
          gold: "#D4AF37",
          bone: "#FAF9F6",
          stone: "#CDC9C3",
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
