import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Noto Sans Thai'", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        'xs': ['14px', { lineHeight: '1.8' }],
        'sm': ['16px', { lineHeight: '1.8' }],
        'base': ['18px', { lineHeight: '1.8' }],
        'lg': ['20px', { lineHeight: '1.7' }],
        'xl': ['24px', { lineHeight: '1.6' }],
        '2xl': ['28px', { lineHeight: '1.5' }],
        '3xl': ['34px', { lineHeight: '1.4' }],
        '4xl': ['42px', { lineHeight: '1.3' }],
        '5xl': ['52px', { lineHeight: '1.2' }],
        '6xl': ['68px', { lineHeight: '1.1' }],
      },
      lineHeight: {
        'thai': '1.8',
        'thai-loose': '2.0',
        'thai-tight': '1.6',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Prompt Lego Corporate Colors
        oxford: {
          DEFAULT: "#012840",
          foreground: "#FFFFFF",
        },
        tennessee: {
          DEFAULT: "#F27405",
          foreground: "#FFFFFF",
        },
        turquoise: {
          DEFAULT: "#05F2F2",
          foreground: "#012840",
        },
        rackley: {
          DEFAULT: "#6593A6",
          foreground: "#FFFFFF",
        },
        rootbeer: {
          DEFAULT: "#260D0B",
          foreground: "#FFFFFF",
        },
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
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      maxWidth: {
        'content': '720px',
        'wide': '1080px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      transitionDuration: {
        "200": "200ms",
        "300": "300ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
