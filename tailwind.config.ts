import type { Config } from "tailwindcss";

import * as defaultTheme from "tailwindcss/defaultTheme";
import { withUt } from "uploadthing/tw";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xxs: "360px",
        xs: "480px",
        ...defaultTheme.screens,
      },
      spacing: {
        "header-height": "var(--header-height)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          "0%": { transform: "translateX(0rem)" },
          "25%": { transform: "translateX(0.5rem)" },
          "75%": { transform: "translateX(-0.5rem)" },
          "100%": { transform: "translateX(0rem)" },
        },
        shine: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.2s ease-in-out 0s 2",
        shine: "shine 8s ease-in-out infinite",
      },
      fontFamily: {
        interVariable: [
          ["InterVariable", ...defaultTheme.fontFamily.sans],
          { fontFeatureSettings: '"liga" 1, "calt" 1, "ss03" 1' },
        ],
        inter: [
          ["Inter", ...defaultTheme.fontFamily.sans],
          { fontFeatureSettings: '"liga" 1, "calt" 1, "ss03" 1' },
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default withUt(config);
