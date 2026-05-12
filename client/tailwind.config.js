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
                playfair: ['Playfair Display', 'serif'],
                jakarta: ['Plus Jakarta Sans', 'sans-serif'],
                cormorant: ['Cormorant Garamond', 'serif'],
                inter: ['Inter', 'sans-serif'],
                tenor: ['Plus Jakarta Sans', 'sans-serif'], 
                jost: ['Plus Jakarta Sans', 'sans-serif'],
                body: ['Plus Jakarta Sans', 'sans-serif'],
            }



        },
    },
    plugins: [],
}
