/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hemira: {
          navy: "#0C1B33",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          blueLight: "#E8EEF5",
          accent: "#2A7B9B",
        }
      }
    },
  },
  plugins: [],
};
