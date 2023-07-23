import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routerConfig } from "./router";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export const createApp = ViteSSG(
  App,
  routerConfig,
  ({ app, router, routes, isClient, initialState }) => {
    const vuetify = createVuetify({
      ssr: !isClient,
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
    });
    app.use(vuetify);
  }
);
