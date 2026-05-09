/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0a0f1e',
                    card: 'rgba(255, 255, 255, 0.04)',
                    cyan: '#00d4ff',
                    green: '#00ff9d',
                    text: '#f0f4ff',
                    muted: '#8892b0',
                    danger: '#ff4757',
                    warning: '#ffa502'
                }
            },
            fontFamily: {
                heading: ['Syne', 'sans-serif'],
                body: ['DM Sans', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
