import Home from "./views/Home.vue";
import Sponsor from "./views/Sponsor.vue";
import Contact from "./views/Contact.vue";
import NewLogin from "./views/NewLogin.vue";
import Profile from "./views/Profile.vue";

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
    {
      path: "/login",
      name: "login",
      component: NewLogin,
    },
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
    {
      path: "/profile",
      name: "profile",
      component: Profile,
    },
    // {
    //   path: '/schedule',
    //   name: 'schedule',
    //   component: Schedule
    // }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 75,
      };
    } else {
      return {
        top: 0,
        behavior: "smooth",
      };
    }
  },
};
