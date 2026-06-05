/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Lottery custom colors
        lottery: {
          primary: "#4ECDC4",
          "primary-dark": "#3DBDB5",
          "primary-light": "#6FE3DC",
          "bg-main": "#F5F5F0",
          "bg-sidebar": "#2D2D2D",
          "bg-sidebar-hover": "#3A3A3A",
          "bg-sidebar-active": "#1E1E1E",
          "bg-card": "#FFFFFF",
          "bg-header": "#FFFFFF",
          "text-primary": "#333333",
          "text-secondary": "#666666",
          "text-muted": "#999999",
          "text-sidebar-muted": "#A0A0A0",
          "border": "#E5E5E0",
          "border-light": "#F0F0EB",
          "border-table": "#E8E8E3",
          success: "#22C55E",
          danger: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        },
        // Lottery brand colors
        loteria: {
          anguila10: "#FF6B6B",
          anguila1: "#4ECDC4",
          anguila6: "#45B7D1",
          anguila9: "#96CEB4",
          primero: "#DDA0DD",
          lotedom: "#FFD93D",
          suerte: "#6BCB77",
          kingam: "#F9A826",
          kingpm: "#E17055",
          quiniela: "#74B9FF",
          floridam: "#FD79A8",
          floridapm: "#E84393",
          nyam: "#0984E3",
          nypm: "#6C5CE7",
          loteka: "#00CEC9",
          nacional: "#D63031",
          ganamas: "#55EFC4",
        },
      },
      spacing: {
        sidebar: "260px",
        header: "56px",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"Cascadia Code"',
          '"Fira Code"',
          'monospace',
        ],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 1px 3px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08)",
        button: "0 2px 8px rgba(78, 205, 196, 0.3)",
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        pulse: "pulse 1.5s ease-in-out infinite",
        spin: "spin 1s linear infinite",
      },
      transitionTimingFunction: {
        "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
