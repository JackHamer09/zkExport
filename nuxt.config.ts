// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          property: "og:image",
          content: "https://zkexport.netlify.app/preview.jpg",
        },
        {
          property: "og:image:alt",
          content: "Export zkSync Era transactions to CSV, XLS and more",
        },
        {
          property: "og:image:type",
          content: "image/jpeg",
        },
        {
          property: "og:image:width",
          content: "1200",
        },
        {
          property: "og:image:height",
          content: "630",
        },
      ],
    },
  },

  ssr: true,
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt", // https://pinia.vuejs.org/ssr/nuxt.html
    "@nuxtjs/eslint-module", // https://nuxt.com/modules/eslint
    "@nuxtjs/tailwindcss", // https://nuxt.com/modules/tailwindcss
    "@nuxtjs/google-fonts", // https://google-fonts.nuxtjs.org
    "nuxt-gtag", // https://nuxt.com/modules/gtag
    "@kevinmarrec/nuxt-pwa",
  ],

  css: ["web3-avatar-vue/dist/style.css"],
  googleFonts: {
    families: {
      Inter: [400, 500],
    },
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore",
      "storeToRefs",
    ],
  },
  imports: {
    dirs: ["store"],
  },
});
