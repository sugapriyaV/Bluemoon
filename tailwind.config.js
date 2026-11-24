/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF6E5', sand: '#EFE3CE', ocean: { DEFAULT: '#0B6E8A', dark: '#08566C' },
        teal: { DEFAULT: '#14A3A3', dark: '#0E7C7C' }, coral: { DEFAULT: '#F2764B', dark: '#D95A30' }, ink: '#1F2A33'
      },
      fontFamily: { serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'], sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 10px 40px -12px rgba(11,110,138,.25)' }
    }
  },
  plugins: []
}
