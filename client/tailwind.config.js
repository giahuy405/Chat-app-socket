/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // important: true,
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",
        secondary: "#4B019A",
      },
      animation: {
        'spin': 'spin 0.7s linear infinite',
      }
    },
  },
  plugins: [],
};
