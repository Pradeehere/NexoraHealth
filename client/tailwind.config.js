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
                    dark: '#000000',
                    light: '#ffffff',
                    gold: '#C9A84C',
                    muted: '#555555',
                    danger: '#ff4757',
                    warning: '#ffa502'
                }
            },
            fontFamily: {
                cormorant: ['Cormorant Garamond', 'serif'],
                tenor: ['Tenor Sans', 'sans-serif'],
                jost: ['Jost', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
