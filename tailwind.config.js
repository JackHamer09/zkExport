const theme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F3F5FF",
          100: "#D9D9F9",
          200: "#CBCBFF",
          300: "#8C8DFC",
          400: "#5D65B9",
          500: "#53579f",
          600: "#4E529A",
          700: "#32325D",
          800: "#27274E",
          900: "#11142B",
        },
      },
    },
    screens: {
      xs: "400px",
      ...theme.screens,
    },
    container: false,
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen xl": {
            maxWidth: "1240px",
          },
        },
      });
    },
  ],
};
