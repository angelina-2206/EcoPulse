/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00E676', // Neon Green
          dark: '#00B35C',
          glow: 'rgba(0, 230, 118, 0.4)',
        },
        background: {
          DEFAULT: '#0A0A0A', // Deep Black
          surface: '#121212',
          layered: '#1A1A1A',
        },
        accent: {
          DEFAULT: '#00BFA5', // Teal
          glow: 'rgba(0, 191, 165, 0.4)',
        },
        text: {
          main: '#E0E0E0',
          muted: '#A0A0A0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'glow-gradient': 'linear-gradient(135deg, #00E676, #00BFA5)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px -5px rgba(0, 230, 118, 0.4)',
        'glow-accent': '0 0 20px -5px rgba(0, 191, 165, 0.4)',
        'glass-panel': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
