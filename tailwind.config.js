/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-light": "hsl(var(--primary-light))",
        "primary-dark": "hsl(var(--primary-dark))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
      },
      fontFamily: {
        tamil: ["'Baloo Thambi 2'", "'Anek Tamil'", "sans-serif"],
        fredoka: ["'Fredoka'", "sans-serif"],
      },
      boxShadow: {
        'tamil': '0 8px 16px rgba(68, 130, 63, 0.15)',
        'tamil-lg': '0 12px 24px rgba(68, 130, 63, 0.2)',
      },
    },
  },
  plugins: [],
}
