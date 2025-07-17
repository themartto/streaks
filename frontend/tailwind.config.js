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
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF',
        },
        background: '#F7F5F0',
        foreground: '#1F2937',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937',
        },
        muted: {
          DEFAULT: '#E5E7EB',
          foreground: '#6B7280',
        },
      },
    },
  },
  plugins: [],
}