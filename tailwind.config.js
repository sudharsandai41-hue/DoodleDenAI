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
                    blue: '#6EA8FF',
                    dark: '#222222', // Sketch Black
                    soft: '#F0F9FF',
                    sky: '#BFE4FF' // Soft Sky Frame
                },
                paper: '#F7F4EB', // Notebook texture
                line: '#E8F0FE', // Faint blue line
                pastel: {
                    blue: '#A7CCFF',
                    mint: '#B8EED5',
                    yellow: '#FFE493',
                    orange: '#FEBA8F',
                    pink: '#FF8E8E', // Coral Pink Accent
                }
            },
            fontFamily: {
                sans: ['"Comic Neue"', 'cursive'],
                hand: ['"Patrick Hand"', 'cursive'],
                body: ['"Comic Neue"', 'cursive'],
            },
            keyframes: {
                wobble: {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' },
                },
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                bounce: {
                    '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
                    '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
                }
            },
            animation: {
                wobble: 'wobble 0.2s ease-in-out infinite',
                'float-slow': 'float-slow 4s ease-in-out infinite',
            },
            borderRadius: {
                'doodle': '255px 15px 225px 15px / 15px 225px 15px 255px',
                'pill': '50px',
            },
            boxShadow: {
                'sticker': '4px 4px 0px rgba(0,0,0,0.1)',
            }
        },
    },
    plugins: [],
}
