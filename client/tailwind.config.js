/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pathwise Premium Palette
        'ink': '#1E2D3D',
        'ink-light': '#2E4057',
        'parchment': '#F8F7F4',
        'parchment-dark': '#F0EDE8',
        'accent': '#6366F1',
        'accent-light': '#818CF8',
        'accent-dark': '#4F46E5',
        'sage': '#10B981',
        'amber': '#F59E0B',
        'rose': '#F43F5E',

        // Keep primary for backward compatibility
        primary: {
          50: '#EEF2FF',
          100: '#C7D2FE',
          500: '#6366F1',
          600: '#6366F1',
          700: '#4F46E5',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#F43F5E',
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
