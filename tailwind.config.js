module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'media',
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
  variants: {},
  plugins: [
  ],
}
