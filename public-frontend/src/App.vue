<template>
  <div id="app-container">
    <Stars />
    <div id="banner" style="z-index: 100" :class="{ scrolled: shrinkBanner }">
      <div id="bannerL" class="bannerContainer" style="z-index: 100">
        <p class="banner-link khe-link" id="kheTitle" @click="navigateTo('/')">
          Kent Hack Enough
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
        <p class="banner-link" @click="navigateTo('/guide')">
          Guide
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

:root {
    --font-family: "Inter", sans-serif;
}

html {
  height: 100vh;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
}

body {
  perspective: 150px;
  transform-origin: 50% 50%;
  perspective-origin: 50% 50%;
  background-color: black;
  overflow-y: auto;
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

#bannerL, #bannerR {
  background-color: #0003;
  border-radius: 10px;
}

#banner {
  position: fixed;
  width: 100%;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  z-index: 98;
  padding: 0 10px;

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
