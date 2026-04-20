import tailwindAnimate from "tailwindcss-animate";
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
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
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "#0B0F1A",
                foreground: "#E2E8F0",
                primary: {
                    DEFAULT: "#3B82F6",
                    neon: "#22C55E",
                    purple: "#8B5CF6",
                },
                glass: {
                    DEFAULT: "rgba(255, 255, 255, 0.05)",
                    border: "rgba(255, 255, 255, 0.1)",
                    hover: "rgba(255, 255, 255, 0.08)",
                },
                card: {
                    DEFAULT: "#111827",
                    foreground: "#F8FAFC",
                },
            },
            borderRadius: {
                lg: "1.25rem",
                md: "1rem",
                sm: "0.75rem",
                xl: "2rem",
            },
            boxShadow: {
                'neon-blue': '0 0 15px rgba(59, 130, 246, 0.3)',
                'neon-green': '0 0 15px rgba(34, 197, 94, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
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
                "glow": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.6" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "glow-slow": "glow 3s ease-in-out infinite",
            },
        },
    },
    plugins: [tailwindAnimate],
} satisfies Config;

export default config;
