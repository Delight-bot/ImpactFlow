/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable dark mode via class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beneficiary: {
          light: "#BFDBFE",   // light blue
          DEFAULT: "#3B82F6", // blue-600
          dark: "#1E40AF",    // blue-900
        },
        volunteer: {
          light: "#15dd4aff",   // orange-ish light
          DEFAULT: "#16A34A", // green-600
          dark: "#14532D",    // green-900
        },
        admin: {
          light: "#E9D5FF",   // light purple
          DEFAULT: "#7C3AED", // purple-600
          dark: "#4C1D95",    // purple-900
        },
        sitebg: {
          light: "#7ccbe617",   // gray-50
          dark: "#111827",    // gray-900
        },
        textbase: {
          light: "#1F2937",   // gray-800
          dark: "#F9FAFB",    // gray-50
        },
      },
    },
  },
  plugins: [],
};
