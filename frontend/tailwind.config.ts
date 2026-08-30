import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: "#FFFDF5",
          100: "#FDF8E2",
          200: "#F9EEB8",
          300: "#F3E08A",
          400: "#E8CD57",
          500: "#D4AF37", // Signature DZ Prime Metallic Gold
          600: "#B88F24",
          700: "#926B17",
          800: "#755217",
          900: "#604218",
          950: "#382309",
        },
        navy: {
          50: "#F0F4FD",
          100: "#E1EBFA",
          200: "#C7DAF6",
          300: "#A1C1EF",
          400: "#729FE6",
          500: "#4D7FDC",
          600: "#3663CF",
          700: "#2B4FA7",
          800: "#1C3066",
          850: "#101B38",
          900: "#080E21",
          950: "#040711", // Obsidian Dark
        },
        dzBlue: {
          DEFAULT: "#1E40AF",
          light: "#3B82F6",
          dark: "#172554",
          neon: "#38BDF8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Cairo", "Tajawal", "Inter", "sans-serif"],
        arabic: ["Cairo", "Tajawal", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5D061 0%, #D4AF37 50%, #AA771C 100%)",
        "gold-metallic": "linear-gradient(90deg, #D4AF37 0%, #FDF8E2 50%, #D4AF37 100%)",
        "card-dark": "linear-gradient(145deg, #0D1426 0%, #050811 100%)",
        "radial-glow": "radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.35)",
        "gold-glow-lg": "0 0 45px -5px rgba(212, 175, 55, 0.55)",
        "blue-glow": "0 0 25px -5px rgba(56, 189, 248, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
