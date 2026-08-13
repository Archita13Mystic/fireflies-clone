/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fireflies: {
          purple: '#7C3AED',
          purpleLight: '#F3E8FF',
          purpleHover: '#6D28D9',
          pink: '#FDF2F8',
          pinkBorder: '#FBCFE8',
          green: '#ECFDF5',
          greenBorder: '#A7F3D0',
          greenBtn: '#D1FAE5',
          greenText: '#065F46',
          slateBg: '#F8FAFC',
          border: '#E2E8F0',
          textDark: '#0F172A',
          textMuted: '#64748B'
        }
      }
    },
  },
  plugins: [],
}
