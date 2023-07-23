import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routerConfig } from "./router";

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export const createApp = ViteSSG(
  App,
  routerConfig,
  ({ app, router, routes, isClient, initialState }) => {
    const vuetify = createVuetify({
      components,
      directives,
      ssr: !isClient,
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
    })
    app.use(vuetify);
  }
);
