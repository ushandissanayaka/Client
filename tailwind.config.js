/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  safelist: [
    {
      pattern: /w-\[(\d{1,3})%\]/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

