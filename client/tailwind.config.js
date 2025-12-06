/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pathwise Custom Color Palette (Duolingo-inspired)
        'dusk-blue': '#3D5A80',
        'powder-blue': '#98C1D9',
        'light-cyan': '#E0FBFC',
        'burnt-peach': '#EE6C4D',
        'jet-black': '#293241',

        // Keep primary for backward compatibility
        primary: {
          50: '#E0FBFC',
          100: '#98C1D9',
          500: '#3D5A80',
          600: '#3D5A80',
          700: '#293241',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#EE6C4D',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
