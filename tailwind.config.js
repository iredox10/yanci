/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Frank Ruhl Libre"', 'serif'],
        body: ['"Merriweather"', 'serif'],
      },
      colors: {
        yanci: {
          primary: '#0f3036', // Deep Teal/Green (Islam/Agriculture/Northern Identity)
          accent: '#c59d5f',  // Gold/Sand (Wealth/Desert)
          paper: '#f4f1ea',   // Warm Paper background
          dark: '#1c1917',    // Warm Black
          red: '#8a2c2c',     // Clay Red
          teal: '#2c7a7b',    // Lighter Teal
        }
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
