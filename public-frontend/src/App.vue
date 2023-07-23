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
        <p class="banner-link" @click="navigateTo('/', '#map')" hidden>Virtual</p>
        <p v-if="showLive" class="banner-link" @click="navigateTo('/live')">
          Live!
        </p>
        <p class="banner-link register-link" @click="scrollTo('/register', '#register')"
          v-if="user._id == '' && showRegister">
          Register
        </p>
        <p class="banner-link logout-link" @click="logout()" v-if="user._id != '' && showRegister">
          Log out
        </p>
        <div class="padding" style="width: 50px"></div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
// import scrollto from "vue-scrollto";
import hamburgerIcon from '@/assets/Hamburger_icon.svg.png'
import Stars from "./components/stars.vue";

export default {
  name: "app",
  components: { Stars },
  data() {
    return {
      // showRegister: (window.location.href.indexOf("khe.io") >= 0) ? false : true,
      showRegister: false,
      // registrationOpens: 'September 6th',
      showSponsors: true,
      showLive: false,
      showSchedule: false,
      showPasswordReset: false,
      showMLH: true,
      hasApp: false,
      hasCheckedForApp: false,
      expandMenu: false,
      shrinkBanner: false,
      user: this.userInitialState(),
      liveUpdates: {},
      events: [],
      messages: [],
      scores: [],
      hamburgerIcon
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    // Checking if a user is saved as logged in
    // var user = this.wrapper.userManager.getLocalUser();
    // if (user && user.key) {
    //   console.log("You've been logged in from a previous session!");
    //   this.user._id = user.key;
    //   this.user.email = user.email;
    //   this.user.role = user.role;

    //   // Redirects to home if they're on register
    //   if (
    //     this.$route.fullPath == "/register" ||
    //     this.$route.fullPath == "/login"
    //   ) {
    //     this.$router.push("/");
    //   }

    //   // Checks if the user has an application
    //   this.wrapper.applicationManager
    //     .getApplication()
    //     .then((app) => {
    //       console.log("Hey you have an app: ", app);
    //       this.hasApp = app._onServer;
    //       this.hasCheckedForApp = true;
    //     })
    //     .catch((err) => {
    //       console.error("Problem getting your app!!");
    //       this.hasCheckedForApp = true;
    //     });
    // }
    // // LOADING IN SCHEDULE
    // let vm = this;
    // this.liveUpdates = this.wrapper.liveManager;
    // this.liveUpdates.exisitingEvents().then((msgs) => {
    //   for (let i = 0; i < msgs.length; i++) vm.events.push(msgs[i]);
    // });
    // this.liveUpdates.SubscribeToEvents({
    //   onCreate(event) {
    //     vm.events.unshift(event);
    //   },
    //   onUpdate: function (event) {
    //     var index = vm.events.findIndex(function (o) {
    //       return o._id === event._id;
    //     });
    //     vm.events.splice(index, 1);
    //     vm.events.push(event);
    //   },
    //   onDelete: function (event) {
    //     var index = vm.events.findIndex(function (o) {
    //       return o._id === event._id;
    //     });
    //     if (index !== -1) vm.events.splice(index, 1);
    //   },
    // });
    // // LOADING IN UPDATES
    // this.liveUpdates.exisitingMessages().then((msgs) => {
    //   for (let i = 0; i < msgs.length; i++) vm.messages.push(msgs[i]);
    // });
    // this.liveUpdates.SubscribeToMessages({
    //   onCreate(msg) {
    //     vm.messages.unshift(msg);
    //   },
    //   onUpdate: function (event) {
    //     var index = vm.messages.findIndex(function (o) {
    //       return o._id === event._id;
    //     });
    //     vm.messages[index].text = event.text;
    //   },
    //   onDelete: function (event) {
    //     var index = vm.messages.findIndex(function (o) {
    //       return o._id === event._id;
    //     });
    //     if (index !== -1) vm.messages.splice(index, 1);
    //   },
    // });
    // this.getScores();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll(event) {
      this.shrinkBanner = document.documentElement.scrollTop > 0;
    },
    // getScores() {
    //   // LOADING LEADERBOARD:
    //   var vm = this;
    //   this.wrapper.gamifyV1
    //     .scoreboard()
    //     .then((scores) => {
    //       vm.scores = scores;
    //     })
    //     .catch((err) => {
    //       throw err;
    //     });
    // },
    userInitialState() {
      this.hasApp = false;
      return {
        _id: "",
        email: "",
        //        password: '',
        key: "",
        role: "",
        application: {
          name: "", // full name                                      !
          school: "", // name of school                               !
          phone: "", // phone number                                  !
          shirt: "", // t-shirt size                                  !
          demographic: null, // allowed to use demographic info?       ?
          first: null, // is this your first hackathon?               !
          dietary: [], // food restrictions seperated by |            !
          // Vegan, vegitarian, kosher, gluten free, allergy, other
          year: "", // the year in school                             !
          age: "", // person's age                                    !
          gender: "", // gender                                       !
          major: "", // degree                                        !
          conduct: null, // agree to MLH code of conduct?              ?
          travel: null, // need travel reimbursement?                 !
          waiver: false, // agreed to waiver?                           ?
          resume: "", // the filename of their resume                   ?
          link: "", // a github/linkedin link                           ?
          extra: "",
          mlh_emails: null,
        },
      };
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

#hamburgMenu {
  display: none;
}

@font-face {
  font-family: 'Roboto';
  src: url('/Roboto-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

#app-container {
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  position: absolute;
  width: 100%;
  top: 0px;
  left: 0px;
  min-height: 100vh;
}

#banner {
  position: fixed;
  width: 100%;
  /*background-color: #39183e;*/
  // background-color: #ff7c70;
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
      padding-right: 250px;
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
  // padding: 15px;
  padding: 10px 15px;
  margin: 0px;
  font-size: 18px;
  // color: white;
  cursor: pointer;
  // -webkit-transition-duration: 0.2s;
  // transition-duration: 0.2s;
  // border-radius: 0.25em;
  @include grow('hover', 1.05, 0.2s);
  @include underline;
}

.register-link,
.logout-link {
  @include display-not(mobile) {
    margin-left: 50px;
  }
}

// .banner-link:hover {
//   background-color: #dec5ec;
// }

.bannerContainer {
  display: flex;
}

.bannerContainer {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
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

#register .gold-clear-button {
  font-size: 2vmin !important;
}

#auth-title2 {
  font-family: Lazer84;
  font-size: 50px;
  margin: 0px;
  /*margin-bottom: -70px;*/
  padding-top: -10vh;
  color: $gold;
  font-size: 5vmin;
  transform: rotate(-5deg) translate(0%, -80%);
  letter-spacing: 1vmin;
  display: inline-block;
  filter: drop-shadow(4px 4px $blue) drop-shadow(-1.5px -1.5px $blue);
  z-index: 5;
}

#auth-subtitle {
  font-size: 20px;
  margin-top: 5px;
  // margin-bottom: 5px;
  // margin-bottom: 10px;
}

.auth-container {
  position: relative;
  z-index: 15;
  padding-top: 10px;
  border-radius: 25px;
  width: 50vw;
  min-width: 300px;
  margin-left: 50%;
  transform: translatex(-50%);
  @include bg-secondary;
}

.simple-text-input {
  font-family: abel;
  background: none;
  border: none;
  border-bottom: 2px solid black;
  color: black;
  font-size: 16px;
  margin-bottom: 20px;
}

#auth-ground {
  background: $sand;
  width: 100vw;
  height: 15vh;
  position: absolute;
  bottom: 0px;
  z-index: 5;
}

#auth-cactus {
  height: 50vh;
  z-index: 10;
  position: absolute;
  bottom: 7vh;
  left: 10vw;
}

#auth-rocks {
  height: 7vh;
  z-index: 10;
  position: absolute;
  bottom: 7vh;
  left: 26vw;
}

@media only screen and (max-width: 850px) {
  #bannerL {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #bannerR {
    flex-direction: column;
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
