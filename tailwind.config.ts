import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",
        pop: "rgb(var(--color-pop) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(19 18 22 / 0.06), 0 24px 48px -28px rgb(19 18 22 / 0.22), 0 10px 24px -16px rgb(43 31 219 / 0.16)"
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.8s var(--ease-out) both",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)"
          }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
