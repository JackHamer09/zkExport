import { createApp } from "vue";
import { createPinia } from "pinia";
import "v-calendar/dist/style.css";
import App from "./App.vue";
import router from "./router";
import { startLogRocket } from "./utils/logger";
import "./assets/style/main.scss";

/* if (config.logRocketApplicationId?.length) {
  useLogRocket(config.logRocketApplicationId, config.version);
} */

createApp(App).use(createPinia()).use(router).mount("#app");

startLogRocket(import.meta.env.VITE_LOG_ROCKET_APP_ID as string | undefined);
