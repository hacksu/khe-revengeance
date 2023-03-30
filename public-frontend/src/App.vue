<template>
  <div id="app">
    <div id="banner" style="z-index: 100">
      <div id="bannerL" class="bannerContainer" style="z-index: 100">
        <p class="banner-link khe-link" id="kheTitle" @click="scrollTo('/', '#mainContainer')">
          KENT HACK ENOUGH
        </p>

        <div id="hamburgMenu">
          <img id="hamburgIcon" :src="hamburgerIcon" width="50" @click="togMenu()" />
        </div>
      </div>

      <div id="bannerR" class="bannerContainer" :class="{ hidden: expandMenu }" style="z-index: 100">
        <p class="banner-link" @click="scrollTo('/', '#landing-container')">
          Home
        </p>
        <!-- <p class="banner-link"@click="scrollTo('/', '#about-container')">About</p> -->
        <p class="banner-link" id="faq-scrollto" @click="scrollTo('/', '#faq-container')">
          FAQ
        </p>
        <p v-if="$data.showSponsors" class="banner-link" @click="scrollTo('/sponsor', '#sponsors')">
          Sponsors
        </p>
        <p class="banner-link" @click="scrollTo('/contact', '#contact')">
          Contact
        </p>
        <!-- <p v-if="$data.showSchedule" class="banner-link" @click="scrollTo('/schedule')">
          Schedule
        </p> -->
        <p class="banner-link" @click="scrollTo('/', '#map')" hidden>Virtual</p>
        <p v-if="$data.showLive" class="banner-link" @click="scrollTo('/live')">
          Live!
        </p>
        <!-- <p class="banner-link register-link" @click="scrollTo('/register', '#register')"
          v-if="user._id == '' && $data.showRegister">
          Register
        </p> -->
        <p class="banner-link logout-link" @click="logout()" v-if="user._id != '' && $data.showRegister">
          Log out
        </p>
        <div class="padding" style="width: 50px"></div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import scrollto from "vue-scrollto";
import hamburgerIcon from '@/assets/Hamburger_icon.svg.png'

export default {
  name: "app",
  components: {},
  data() {
    return {
      showLogin: true,
      showRegister: true, //true, //false,
      registrationOpens: 'September 6th',
      //showRegister: (window.location.href.indexOf("khe.io") >= 0) ? false : true, // Temporary disable
      showSponsors: true, //true, //false,
      allowSponsorship: false,
      showLive: false,
      showSchedule: true, //true, //false,
      showPasswordReset: false,
      showMLH: true,
      hasApp: false,
      hasCheckedForApp: false,
      expandMenu: false,
      user: this.userInitialState(),
      liveUpdates: {},
      events: [],
      messages: [],
      scores: [],
      hamburgerIcon
    };
  },
  watch: {
    '$route': function (to, from) {
      this.handleScroll();
    }
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
      let ok = true;
      if (this.$route.name === 'apply') {
        ok = false;
      }
      if (ok && (document.documentElement.scrollTop > 0 || this.$route.name !== 'home')) {
        document.getElementById('banner').classList.add('scrolled');
      } else {
        document.getElementById('banner').classList.remove('scrolled');
      }
    },
    dispLogin: function () {
      // Normally we could do a one line function like this inside an @click attribute,
      // but this makes it easier to access from it's children
      this.expandMenu = false;
      this.showLogin = !this.showLogin;
    },
    dispRegister: function () {
      this.expandMenu = false;
      this.showRegister = !this.showRegister;
    },
    dispPasswordReset: function () {
      this.expandMenu = false;
      this.showPasswordReset = false;
    },
    switchLoginRegister: function () {
      this.showRegister = !this.showRegister;
      this.showLogin = !this.showLogin;
    },
    switchPasswordReset: function () {
      this.showLogin = false;
      this.showPasswordReset = !this.showPasswordReset;
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
    // logout: function () {
    //   this.wrapper.userManager.logout();
    //   //        .then(() => {
    //   //        console.log("Logged out!");
    //   //      }).catch((err) => {
    //   //        console.error("Error logging out: ", err);
    //   //      })
    //   this.user = this.userInitialState();
    //   this.$router.push({ path: "/" });
    // },
    togMenu: function () {
      this.expandMenu = !this.expandMenu;
    },
    scrollTo: function (page, el) {
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

// @font-face {
//   font-family: nandaka;
//   src: url("./assets/fonts/nandaka_western.ttf");
// }

// @font-face {
//   font-family: athelas;
//   src: url("./assets/fonts/Athelas-Regular.ttf");
// }

// @font-face {
//   font-family: Lazer84;
//   src: url("./assets/fonts/Lazer84.ttf");
// }

// @font-face {
//   font-family: abel;
//   src: url("./assets/fonts/abel-regular.ttf");
// }

// @font-face {
//   font-family: "Dagger Square";
//   src: url("./assets/fonts/DAGGERSQUARE.otf");
// }

@font-face {
  font-family: "Ropa Sans";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local("Ropa Sans Regular"), local("RopaSans-Regular"),
    url(https://fonts.gstatic.com/s/ropasans/v9/EYqxmaNOzLlWtsZSScy6UzNpY5I.woff2) format("woff2");
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

// @font-face {
//   font-family: Commando;
//   src: url("./assets/fonts/commando/commando.ttf");
// }

// @font-face {
//   font-family: "HappyBirthday";
//   src: url("./assets/fonts/happyBirthday.ttf") format("truetype");
// }

// @font-face {
//   font-family: "CreamCake";
//   src: url("./assets/fonts/CreamCake.ttf") format("truetype");
// }

// @font-face {
//   font-family: "Hestina";
//   src: url("./assets/fonts/Hestina.otf");
// }

// @font-face {
//   font-family: "Buba-Outline";
//   src: url("./assets/fonts/Buba-Outline.otf");
// }

// @font-face {
//   font-family: "Buba-Shadow";
//   src: url("./assets/fonts/Buba-Shadow.otf");
// }

// h1 {
//   font-family: Commando;
//   // color: $black-overwrite;
//   font-size: 40px;
// }

// button {
//   /*filter: brightness(100%);*/
//   transition: transform 0.25s, filter 0.25s, background-color 0.05s, color 0.05s;
// }

// button:hover {
//   transform: scale(1.1);
//   /*filter: brightness(120%);*/
// }

// .banner-link {
//   /*filter: brightness(100%);*/
//   transition: transform 0.25s, filter 0.25s, background-color 0.05s, color 0.05s;
// }

// .banner-link:hover {
//   transform: scale(1.1);
//   /*filter: brightness(120%);*/
// }

// a {
//   /*filter:brightness(100%);*/
//   transition: transform 0.25s, filter 0.25s, text-decoration-color 0.25s;
// }

// a:hover {
//   transform: scale(1.1);
//   /*filter: brightness(120%);*/
// }

#app {
  // font-family: abel;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  position: absolute;
  width: 100%;
  top: 0px;
  left: 0px;
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
  padding-left: 20px;

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

/*.gold-clear-button {
  font-family: abel;
  background: none;
  color: $purple;
  border: solid $purple 1px;
  text-decoration: none;
  font-size: 4vmin;
  padding: 10px 20px;
  transition-duration: 0.5s;
  margin-bottom: 15px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    color: $dark-blue;
    background: $gold;
  }
}

.gold-link {
  color: $purple;
  font-size: 2.5vmin;
  display: inline-block;
  text-decoration-color: transparent;
}
.gold-link:hover {
  text-decoration-style: underline !important;
  color: $gold;
  text-decoration-color: $blue;
}

.fancy-button {
  background: $gold;
  box-shadow: 5px 5px 0px $blue;
  cursor: pointer;
  font-family: abel;
  font-weight: bold;
  font-size: 20px;
  padding: 10px 20px;
  border: none;

  p {
    font-size: 14px;
    margin: 0px;
    font-weight: normal;
  }
}*/

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
