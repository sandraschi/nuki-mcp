/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: '#020617', // Slate-950
                foreground: '#f8fafc',
                primary: {
                    DEFAULT: '#f59e0b', // Amber-500
                    foreground: '#020617',
                },
                card: {
                    DEFAULT: 'rgba(15, 23, 42, 0.8)', // Slate-900 with alpha
                    foreground: '#f8fafc',
                }
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
