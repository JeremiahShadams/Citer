import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#060608",
        surface: {
          0: "#09090c",
          1: "#0e0e14",
          2: "#14141d",
          3: "#1c1c28",
        },
        hairline: {
          subtle: "#191924",
          DEFAULT: "#232332",
          bright: "#323246",
        },
        brand: {
          blue: "#3b82f6",
          indigo: "#6366f1",
          violet: "#8b5cf6",
          cyan: "#06b6d4",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Geist Mono",
          "Fira Code",
          "ui-monospace",
          "monospace",
        ],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;