/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#002279', // Azul corporativo
        accent: '#0057E7',
        secondary: '#64748b',
        success: '#10b981', // emerald-500
        error: '#ef4444', // red-500
        warning: '#f59e0b', // amber-500
      }
    },
  },
  plugins: [],
}
