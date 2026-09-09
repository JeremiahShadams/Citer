import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#08080a",
        surface: {
          0: "#0b0b0e",
          1: "#111115",
          2: "#17171d",
          3: "#202028",
        },
        hairline: {
          subtle: "#1c1c24",
          DEFAULT: "#272732",
          bright: "#383848",
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