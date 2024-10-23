import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routerConfig } from "./router";
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/md-dark-indigo/theme.css";
import 'primeicons/primeicons.css';
import 'floating-vue/dist/style.css'
import { theme } from "antd";

import xp from 'xp.css/dist/XP.css?raw';
const xpStyle = document.createElement('style');
xpStyle.innerHTML = xp;
document.head.appendChild(xpStyle);
if (xpStyle.sheet) {
  for (const rule of Array.from(xpStyle.sheet.cssRules)) {
    if (rule instanceof CSSStyleRule) {
      rule.selectorText = ".xp" + rule.selectorText;
    }
  }

  for (let i = xpStyle.sheet.cssRules.length - 1; i >=0; i--) {
    if (xpStyle.sheet.cssRules[i] instanceof CSSFontFaceRule) {
      xpStyle.sheet.removeRule(i);
    }
  }
} else {
  console.log("browser not generating xp stylesheet properly");
}
import "xp.css/gui/_fonts.scss";

export const createApp = ViteSSG(
  App,
  routerConfig,
  ({ app, router, routes, isClient, initialState }) => {
    app.use(PrimeVue);
  }
);
