/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { navy: { DEFAULT: '#123047', light: '#1C4260' }, teal: { DEFAULT: '#397C7A', dark: '#2B6361' },
        ivory: '#F8F6F0', sand: '#E8DDCB', seafoam: '#DCEAE5', charcoal: '#252B2D' },
      fontFamily: { serif: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'], sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 18px 50px -20px rgba(18,48,71,.28)' }
    }
  },
  plugins: []
}
