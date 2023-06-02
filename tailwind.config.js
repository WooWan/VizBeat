/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4.5s linear infinite'
      },
      colors: {
        'primary-black': '#1A232E',
        'secondary-white': '#c7c7c7'
      },
      fontSize: {
        h1: ['1.375rem', { fontWeight: 800, lineHeight: '1.875rem', letterSpacing: '-0.8px' }],
        h2: ['1.625rem', { lineHeight: '2rem', fontWeight: 800, letterSpacing: '-1.5px' }],
        h3: ['2.5rem', { lineHeight: '3.5rem', fontWeight: 800, letterSpacing: '2px' }],
        s1: ['0.75rem', { lineHeight: '1.25rem', fontWeight: 700, letterSpacing: '-0.8px' }],
        s2: ['0.875rem', { lineHeight: '1.5rem', fontWeight: 700, letterSpacing: '-0.8px' }],
        s3: ['1rem', { lineHeight: '1.5rem', fontWeight: 700, letterSpacing: '-0.8px' }],
        s4: ['1.125rem', { lineHeight: '1.75rem', fontWeight: 700, letterSpacing: '-1px' }],
        s5: ['1.25rem', { lineHeight: '1.875rem', fontWeight: 700, letterSpacing: '-1px' }],
        b1: ['0.75rem', { lineHeight: '1.25rem', fontWeight: 400, letterSpacing: '-0.8px' }],
        b2: ['0.875rem', { lineHeight: '1.5rem', fontWeight: 400, letterSpacing: '-0.8px' }],
        b3: ['1rem', { lineHeight: '1.75rem', fontWeight: 400, letterSpacing: '-0.8px' }],
        b4: ['1.125rem', { lineHeight: '1.875rem', fontWeight: 400, letterSpacing: '-1px' }]
      },
      transitionTimingFunction: {
        'out-flex': 'cubic-bezier(0.05, 0.6, 0.4, 0.9)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: [require('tailwind-scrollbar'), require('tailwind-scrollbar-hide')]
};
