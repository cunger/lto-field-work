/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./global.css",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#6ec1e4',
          DEFAULT: '#6ec1e4',
          dark: '#4389b1',
        },
        gray: {
          light: '#c8d1e0',
          DEFAULT: '#afbacc',
          dark: '#707a8a',
        },
        danger: {
          DEFAULT: '#ff5c33',
        },
        warning: {
          DEFAULT: '#f0ad4e',
        },
        border: {
          DEFAULT: '#e2e2e2',
        },
      },
    },
  },
  plugins: [],
}
