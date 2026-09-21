import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#061526",
          900: "#08213d",
          800: "#0c2d55"
        },
        coop: {
          blue: "#1268b3",
          cyan: "#04a9c9",
          mint: "#2fbf9f",
          amber: "#d99824"
        }
      },
      boxShadow: {
        soft: "0 12px 28px rgba(8, 33, 61, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
