/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      colors: {
        // CodeCraft Dark Theme - Codient style
        craft: {
          bg: "#0a0f0a",
          surface: "#141a14",
          card: "#1a221a",
          border: "#2a3a2a",
          "border-light": "#3a4a3a",
        },
        accent: {
          DEFAULT: "#00ff88",
          glow: "#00ff88",
          secondary: "#00cc6a",
          muted: "#00ff8833",
        },
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)",
        "gradient-glow": "radial-gradient(ellipse at center, rgba(0, 255, 136, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 30px rgba(0, 255, 136, 0.3)",
        "glow-lg": "0 0 50px rgba(0, 255, 136, 0.4)",
        "glow-sm": "0 0 15px rgba(0, 255, 136, 0.2)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "logo-spin": "logo-spin 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 136, 0.5)" },
        },
        "logo-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
};