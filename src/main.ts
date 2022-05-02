import { createApp } from "vue";
import { createPinia } from "pinia";
import "v-calendar/dist/style.css";
import App from "./App.vue";
import router from "./router";
import "./assets/style/main.scss";

createApp(App).use(createPinia()).use(router).mount("#app");
