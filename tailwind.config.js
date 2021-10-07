module.exports = {
  purge: [],
  darkMode: false,
  theme: {
    colors: {
      blue: {
        light: '#6ec1e4',
        DEFAULT: '#6ec1e4',
        dark: '#166088',
      },
      danger: {
        DEFAULT: '#d9534f',
      },
      warning: {
        DEFAULT: '#f0ad4e',
      },
      border: {
        DEFAULT: '#e2e2e2',
      },
    },
    margin: {
    },
    fontFamily: {
    },
    extend: {
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
