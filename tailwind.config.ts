import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-fallback)", "system-ui", "sans-serif"],
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "10%": { transform: "translate(-14px, 8px) rotate(-3deg)" },
          "20%": { transform: "translate(16px, -10px) rotate(3deg)" },
          "30%": { transform: "translate(-18px, -6px) rotate(-4deg)" },
          "40%": { transform: "translate(18px, 10px) rotate(4deg)" },
          "50%": { transform: "translate(-16px, 12px) rotate(-3deg)" },
          "60%": { transform: "translate(16px, -12px) rotate(3deg)" },
          "70%": { transform: "translate(-12px, 8px) rotate(-2deg)" },
          "80%": { transform: "translate(14px, -8px) rotate(2deg)" },
          "90%": { transform: "translate(-8px, 6px) rotate(-1deg)" },
        },
        glitch: {
          "0%": { clipPath: "inset(20% 0 60% 0)", transform: "translate(-3px)" },
          "20%": { clipPath: "inset(80% 0 5% 0)", transform: "translate(3px)" },
          "40%": { clipPath: "inset(40% 0 40% 0)", transform: "translate(-2px)" },
          "60%": { clipPath: "inset(10% 0 75% 0)", transform: "translate(2px)" },
          "80%": { clipPath: "inset(60% 0 20% 0)", transform: "translate(-3px)" },
          "100%": { clipPath: "inset(30% 0 50% 0)", transform: "translate(0)" },
        },
      },
      animation: {
        floaty: "floaty 3s ease-in-out infinite",
        wiggle: "wiggle 1.2s ease-in-out infinite",
        shake: "shake 0.3s ease-in-out infinite",
        glitch: "glitch 0.6s steps(2, end) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
