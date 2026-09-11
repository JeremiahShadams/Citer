import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#08090a",
        surface: {
          0: "#08090a",
          1: "#0f1011",
          2: "#141516",
          3: "#191a1b",
        },
        hairline: {
          subtle: "rgba(255,255,255,0.03)",
          DEFAULT: "rgba(255,255,255,0.05)",
          bright: "rgba(255,255,255,0.08)",
        },
        brand: {
          primary: "#5e6ad2",
          hover: "#7170ff",
          accent: "#828fff",
          glow: "#7170ff",
          // Backward-compatible semantic aliases mapped to Linear palette
          blue: "#5e6ad2",
          indigo: "#5e6ad2",
          violet: "#7170ff",
          cyan: "#828fff",
        },
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "Berkeley Mono",
          "JetBrains Mono",
          "Geist Mono",
          "Fira Code",
          "ui-monospace",
          "monospace",
        ],
      },
      letterSpacing: {
        "display-tight": "-1.056px",
        "display-tighter": "-1.584px",
      },
      fontWeight: {
        body: "510",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;