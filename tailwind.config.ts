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
        canvas: "#F7F5EE",
        cobalt: {
          DEFAULT: "#4F83FF",
          dark: "#3B6DE6",
          light: "#EBF1FF",
        },
        butter: {
          DEFAULT: "#FDF166",
          dark: "#EBDC36",
          light: "#FEF9C3",
        },
        lime: {
          DEFAULT: "#B6F554",
          dark: "#9CE434",
          light: "#ECFCCB",
        },
        charcoal: {
          DEFAULT: "#141518",
          soft: "#23252B",
          muted: "#757780",
        },
        pastel: {
          peach: {
            DEFAULT: "#FFD5C2",
            light: "#FFF2EC",
            dark: "#F49F83",
            border: "#F7BAA2",
          },
          lavender: {
            DEFAULT: "#E3DFF8",
            light: "#F4F1FD",
            dark: "#9D91E4",
            border: "#CFC7F7",
          },
          yellow: {
            DEFAULT: "#FEF0B3",
            light: "#FEF9DB",
            dark: "#EAB308",
            border: "#FCD34D",
          },
          mint: {
            DEFAULT: "#D8ECD7",
            light: "#EFF8EE",
            dark: "#68A866",
            border: "#BEE0BC",
          },
          sky: {
            DEFAULT: "#DCEAFE",
            light: "#F0F6FF",
            dark: "#3B82F6",
            border: "#BAE6FD",
          },
          rose: {
            DEFAULT: "#FCE6E9",
            light: "#FFF2F5",
            dark: "#E86F95",
            border: "#F9AFC7",
          },
        },
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(26, 27, 31, 0.04), 0 2px 6px -1px rgba(26, 27, 31, 0.02)",
        card: "0 10px 30px -4px rgba(26, 27, 31, 0.06)",
        float: "0 20px 40px -6px rgba(26, 27, 31, 0.12)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
