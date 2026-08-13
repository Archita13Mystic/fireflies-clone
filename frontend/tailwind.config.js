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
          dark: '#0B0F17',
          card: '#131B2E',
          cardHover: '#1B2640',
          sidebar: '#0D1322',
          border: '#212E4A',
          primary: '#6366F1',
          primaryHover: '#4F46E5',
          accent: '#8B5CF6',
          purple: '#A855F7',
          pink: '#EC4899',
          green: '#10B981',
          textMuted: '#94A3B8',
          textBright: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
}
