import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routerConfig } from "./router";

export const createApp = ViteSSG(
  App,
  routerConfig,
  ({ app, router, routes, isClient, initialState }) => {}
);
