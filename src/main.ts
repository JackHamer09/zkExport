import { createApp } from "vue";
import { createPinia } from "pinia";
import "v-calendar/dist/style.css";
import App from "./App.vue";
import VueGtag from "vue-gtag-next";
import router from "./router";
import "./assets/style/main.scss";

createApp(App)
  .use(VueGtag, {
    useDebugger: process.env.NODE_ENV === "development",
    property: {
      id: import.meta.env.VITE_GOOGLE_MEASUREMENT_ID,
    },
  })
  .use(createPinia())
  .use(router)
  .mount("#app");
