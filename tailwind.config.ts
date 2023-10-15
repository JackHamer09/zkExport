import type { Config } from "tailwindcss";
import tailwindColors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Config>{
  content: [
    "./components/**/*.vue",
    "./views/**/*.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.ts",
    "./utils/**/*.ts",
    "./nuxt.config.ts",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        transparent: tailwindColors.transparent,
        black: tailwindColors.slate[900],
      },
      screens: {
        tall: { raw: "(min-height: 800px)" },
      },
    },
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
    },
    container: {
      padding: "3.5%",
      center: true,
      screens: {
        DEFAULT: "1536px",
      },
    },
    plugins: [require("@tailwindcss/forms")],
  },
};
