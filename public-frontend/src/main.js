import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routerConfig } from "./router";
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/mira/theme.css";

export const createApp = ViteSSG(
  App,
  routerConfig,
  ({ app, router, routes, isClient, initialState }) => {
    app.use(PrimeVue);
  }
);
