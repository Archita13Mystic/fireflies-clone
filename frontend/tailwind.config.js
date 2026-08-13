/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Fireflies dark theme palette
        'ff-bg': '#0f0f13',
        'ff-sidebar': '#16161e',
        'ff-card': '#1e1e2a',
        'ff-purple': '#7c5cfc',
        'ff-blue': '#5c9eff',
        'ff-border': '#2a2a3a',
        'ff-muted': '#9090a0',
        'ff-success': '#22c55e',
        'ff-warning': '#f59e0b',
        'ff-highlight': '#fbbf24',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
