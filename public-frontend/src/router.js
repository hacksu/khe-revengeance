import Home from "./views/Home.vue";
import Sponsor from "./views/Sponsor.vue";
import Contact from "./views/Contact.vue";

export const routerConfig = {
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: Register,
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login,
    // },
    // {
    //   path: '/apply',
    //   name: 'apply',
    //   component: Apply
    // },
    {
      path: "/sponsor",
      name: "sponsor",
      component: Sponsor,
    },
    {
      path: "/contact",
      name: "contact",
      component: Contact,
    },
    // {
    //   path: '/schedule',
    //   name: 'schedule',
    //   component: Schedule
    // }
  ],
};
