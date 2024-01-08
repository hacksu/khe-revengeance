<template>
  <div id="app-container">
    <Stars />
    <div id="banner" style="z-index: 100" :class="{ scrolled: shrinkBanner }">
      <div id="bannerL" class="bannerContainer" style="z-index: 100">
        <p class="banner-link khe-link" id="kheTitle" @click="navigateTo('/')">
          KENT HACK ENOUGH
        </p>

        <div id="hamburgMenu">
          <img id="hamburgIcon" :src="hamburgerIcon" width="50" @click="togMenu()" />
        </div>
      </div>

      <div id="bannerR" class="bannerContainer" :class="{ hidden: expandMenu }" style="z-index: 100">
        <p class="banner-link" @click="navigateTo('/')">
          Home
        </p>
        <!-- <p class="banner-link"@click="scrollTo('/', '#about-container')">About</p> -->
        <p class="banner-link" id="faq-scrollto" @click="navigateTo('/', '#faq')">
          FAQ
        </p>
        <p v-if="showSponsors" class="banner-link" @click="navigateTo('/sponsor')">
          Sponsors
        </p>
        <p class="banner-link" @click="navigateTo('/contact')">
          Contact
        </p>
        <p v-if="showSchedule" class="banner-link" @click="navigateTo('/schedule')">
          Schedule
        </p>
        <p class="banner-link" @click="navigateTo('/profile')" v-if="user && showLogin">
          Profile
        </p>
        <LoginButton v-else-if="!user && showLogin" />
        <div class="padding" style="width: 50px"></div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import hamburgerIcon from '@/assets/Hamburger_icon.svg.png'
import Stars from "./components/stars.vue";
import { user } from "./state/user.js";
import LoginButton from "./components/login-button.vue";

export default {
  name: "app",
  components: { Stars, LoginButton },
  data() {
    return {
      showLogin: true,
      // registrationOpens: 'September 6th',
      showSponsors: true,
      showSchedule: false,
      showPasswordReset: false,
      showMLH: true,
      expandMenu: false,
      shrinkBanner: false,
      hamburgerIcon,
    };
  },
  setup() {
    return { user };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.shrinkBanner = document.documentElement.scrollTop > 0;
    },
    // userInitialState() {
    //   this.hasApp = false;
    //   return {
    //     _id: "",
    //     email: "",
    //     //        password: '',
    //     key: "",
    //     role: "",
    //     application: {
    //       name: "", // full name                                      !
    //       school: "", // name of school                               !
    //       phone: "", // phone number                                  !
    //       shirt: "", // t-shirt size                                  !
    //       demographic: null, // allowed to use demographic info?       ?
    //       first: null, // is this your first hackathon?               !
    //       dietary: [], // food restrictions seperated by |            !
    //       // Vegan, vegitarian, kosher, gluten free, allergy, other
    //       year: "", // the year in school                             !
    //       age: "", // person's age                                    !
    //       gender: "", // gender                                       !
    //       major: "", // degree                                        !
    //       conduct: null, // agree to MLH code of conduct?              ?
    //       travel: null, // need travel reimbursement?                 !
    //       waiver: false, // agreed to waiver?                           ?
    //       resume: "", // the filename of their resume                   ?
    //       link: "", // a github/linkedin link                           ?
    //       extra: "",
    //       mlh_emails: null,
    //     },
    //   };
    // },
    togMenu: function () {
      this.expandMenu = !this.expandMenu;
    },
    navigateTo: function (page, el) {
      this.expandMenu = false;
      this.$router.push({ path: page, hash: el });
    },
  },
};
</script>

<style lang="scss">
@import "@/globalVars.scss";
@import "@/styles/global.scss";

html {
  height: 100vh;
  //overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
}

body {
  perspective: 150px;
  transform-origin: 50% 50%;
  perspective-origin: 50% 50%;
  background-color: black;
  //overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  padding: 0 !important;
  margin: 0 !important;
  font-family: var(--font-family);
}

#hamburgMenu {
  display: none;
}

#app-container {
  color: color('text-primary');
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  width: 100%;
  top: 0px;
  left: 0px;
  min-height: 100vh;
  transform-style: preserve-3d;
}

#app {
  transform-style: preserve-3d;
}

#banner {
  position: fixed;
  width: 100%;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  z-index: 98;

  @include mobile {
    @include bg-primary;
  }

  @include display-not(mobile) {
    padding-top: 20px;
    padding-bottom: 20px;

    #bannerR {
      padding-right: 10px;
    }

    #bannerL {
      padding-left: 10px;
    }
  }
}

#banner.scrolled {
  @include bg-primary;

  @include display-not(mobile) {
    padding-top: 10px;
    padding-bottom: 5px;
  }
}

.banner-link {
  padding: 10px 15px;
  margin: 0px;
  font-size: 18px;
  cursor: pointer;
  @include grow('hover', 1.05, 0.2s);
}

.bannerContainer {
  display: flex;
}

.bannerContainer {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.v-popper--theme-dropdown .v-popper__inner {
  background: #000000 !important;
  color: #ffffff !important;
  border: 1px #ffffff solid !important;
}

.v-popper__arrow-outer {
  border-color: #ffffff !important;
}

.v-popper__arrow-inner {
  border-color: #000000 !important;
}

.flipped {
  transform: scaleX(-1);
}

.desktop-only {
  @media only screen and (max-width: 560px) {
    display: none !important;
  }
}

.mobile-only {
  @media only screen and (min-width: 560px) {
    display: none !important;
  }
}

/* AUTH STYLING */
/*  Putting this here so i don't need to duplicate in  two components*/

// #register .gold-clear-button {
//   font-size: 2vmin !important;
// }

// #auth-title2 {
//   font-family: Lazer84;
//   font-size: 50px;
//   margin: 0px;
//   /*margin-bottom: -70px;*/
//   padding-top: -10vh;
//   color: $gold;
//   font-size: 5vmin;
//   transform: rotate(-5deg) translate(0%, -80%);
//   letter-spacing: 1vmin;
//   display: inline-block;
//   filter: drop-shadow(4px 4px $blue) drop-shadow(-1.5px -1.5px $blue);
//   z-index: 5;
// }

// #auth-subtitle {
//   font-size: 20px;
//   margin-top: 5px;
//   // margin-bottom: 5px;
//   // margin-bottom: 10px;
// }

// .auth-container {
//   position: relative;
//   z-index: 15;
//   padding-top: 10px;
//   border-radius: 25px;
//   width: 50vw;
//   min-width: 300px;
//   margin-left: 50%;
//   transform: translatex(-50%);
//   @include bg-secondary;
// }

// .simple-text-input {
//   font-family: abel;
//   background: none;
//   border: none;
//   border-bottom: 2px solid black;
//   color: black;
//   font-size: 16px;
//   margin-bottom: 20px;
// }

// #auth-ground {
//   background: $sand;
//   width: 100vw;
//   height: 15vh;
//   position: absolute;
//   bottom: 0px;
//   z-index: 5;
// }

// #auth-cactus {
//   height: 50vh;
//   z-index: 10;
//   position: absolute;
//   bottom: 7vh;
//   left: 10vw;
// }

// #auth-rocks {
//   height: 7vh;
//   z-index: 10;
//   position: absolute;
//   bottom: 7vh;
//   left: 26vw;
// }

@media only screen and (max-width: 850px) {
  #bannerL {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #bannerR {
    flex-direction: column;
    align-items: flex-start;
  }

  #bannerR:not(.hidden) {
    display: none;
  }

  #banner {
    flex-direction: column;
  }

  #hamburgMenu {
    display: block;
    cursor: pointer;
  }

  #hamburgIcon {
    filter: invert(100%);
    width: 40px;
    height: 40px;
    padding: 5px;
  }

  #bannerLMobile {
    display: block;
  }

  .banner-link {
    margin-bottom: 0px;
    padding-bottom: 10px;
    text-align: left;
  }
}
</style>
