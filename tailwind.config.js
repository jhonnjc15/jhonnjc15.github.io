// tailwind.config.js
const theme = require("./src/config/theme.json");

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;
let fontPrimary, fontPrimaryType, fontSecondary, fontSecondaryType;
if (theme.fonts.font_family.primary) {
  fontPrimary = theme.fonts.font_family.primary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontPrimaryType = theme.fonts.font_family.primary_type;
}
if (theme.fonts.font_family.secondary) {
  fontSecondary = theme.fonts.font_family.secondary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontSecondaryType = theme.fonts.font_family.secondary_type;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        text: theme.colors.default.text_color.default,
        light: theme.colors.default.text_color.light,
        dark: theme.colors.default.text_color.dark,

        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",

        body: theme.colors.default.theme_color.body,
        border: theme.colors.default.theme_color.border,
        "theme-light": theme.colors.default.theme_color.theme_light,
        "theme-dark": theme.colors.default.theme_color.theme_dark,

        /* === Nuevas referencias === */
        "primary-alt": "var(--color-primary-alt)",
        "secondary-alt": "var(--color-secondary-alt)",
        error: "var(--color-error)",
        "on-error": "var(--color-on-error)",

        paqariGreen: "#217276",
        paqariGreenDark: "#0c2324",
        paqariYellow: "#f3a415",
        paqariYellowHover: "#f3b815",

      },

      textColor: {
        default: "var(--color-text)",
        offset: "var(--color-text-offset)",
        muted: "var(--color-text-muted)",
        inverted: "var(--color-text-inverted)",
        secondary: "var(--color-secondary)",
      },

      backgroundColor: {
        default: "var(--color-background)",
        offset: "var(--color-background-offset)",
        soft: "var(--color-background-soft)",
        overlay: "var(--color-overlay)",
        overlay_hover: "var(--color-overlay-hover)"
      },

      animation: {
        "rotate-sheen": "rotate-sheen 9s linear infinite",
        "border-rotate": "border-rotate 10s linear infinite",
      },

      keyframes: {
        "rotate-sheen": {
          "0%": { transform: "rotate(0deg) scale(1.4)" },
          "100%": { transform: "rotate(360deg) scale(1.4)" },
        },
        "border-rotate": {
          "0%": { transform: "rotate(0deg) scale(6)" },
          "100%": { transform: "rotate(-360deg) scale(6)" },
        },
      },

      borderColor: {
        default: "var(--color-border)",
        offset: "var(--color-border-offset)",
        soft: "var(--color-border-soft)",
        strong: "var(--color-border-strong)",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(rgb(33, 114, 118), rgb(12, 35, 36))",
        "gradient-radial-contact":
          "linear-gradient(180deg, rgba(33,114,118,1) 0%, rgba(12,35,36,1) 100%)",
        "gradient-linear-contact2":
          "linear-gradient(278deg, rgba(243,164,21,1) 0%, rgba(33,114,118,1) 100%)",
      },

      fontSize: {
        base: font_base + "px",
        h1: h1 + "rem",
        "h1-sm": h1 * 0.8 + "rem",
        h2: h2 + "rem",
        "h2-sm": h2 * 0.8 + "rem",
        h3: h3 + "rem",
        "h3-sm": h3 * 0.8 + "rem",
        h4: h4 + "rem",
        h5: h5 + "rem",
        h6: h6 + "rem",
      },

      fontFamily: {
        primary: [fontPrimary, fontPrimaryType],
        secondary: [fontSecondary, fontSecondaryType],
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({ generateContainer: false }),
  ],
};
