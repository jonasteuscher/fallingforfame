import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "deep-navy": "#0A1A2F",
        charcoal: "#3A3A3A",
        "dark-red": "#8A1E1E",
        "signal-orange": "#FF6B00",
        "forest-green": "#3E6B47",
        white: "#FFFFFF",
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        border: "var(--border)",
      },
      maxWidth: {
        reading: "72ch",
      },
    },
  },
};

export default config;
