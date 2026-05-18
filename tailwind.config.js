/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lh: {
          50:  '#F2EEF9',
          100: '#E4DCF4',
          200: '#C9BAE9',
          300: '#AE97DE',
          400: '#9375D3',
          500: '#7B5CBF',  // brand purple
          600: '#6448A8',
          700: '#4E3690',
          800: '#362378',
          900: '#1E1040',  // deep sidebar mid
          950: '#0D0820',  // sidebar bg
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
