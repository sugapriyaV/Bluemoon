/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0A1F33', light: '#12304D' }, ocean: { DEFAULT: '#0F5C7A', deep: '#0A3D55' },
        teal: { DEFAULT: '#5DB7B2', dark: '#2F8985' }, seafoam: '#DCEFEC',
        sand: '#E8DCC6', cream: '#FBF7EE', ivory: '#F6F1E7', champagne: { DEFAULT: '#C8A96A', dark: '#A88B50' }, charcoal: '#1B2A38'
      },
      fontFamily: { serif: ['"Cormorant Garamond"', 'serif'], sans: ['Manrope', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 24px 60px -28px rgba(10,31,51,.38)', float: '0 40px 80px -30px rgba(10,31,51,.45)' },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        scrolldot: { '0%': { transform: 'translateY(0)', opacity: 0 }, '30%': { opacity: 1 }, '100%': { transform: 'translateY(22px)', opacity: 0 } },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } }
      },
      animation: { float: 'float 6s ease-in-out infinite', scrolldot: 'scrolldot 1.8s ease-in-out infinite' }
    }
  },
  plugins: []
}
