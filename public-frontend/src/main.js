import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routerConfig } from "./router";
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/md-dark-indigo/theme.css";
import 'primeicons/primeicons.css';
import 'floating-vue/dist/style.css'

export const createApp = ViteSSG(
  App,
  routerConfig,
  ({ app, router, routes, isClient, initialState }) => {
    app.use(PrimeVue);
  }
);
