<template>
  <div id="landing-container" class="landing">
    <div class="back"></div>
    <div class="hacksu-box box1" />
    <div class="hacksu-box box2" />

    <!-- <a v-if="$parent.$parent.showMLH" id="mlh-trust-badge"
      href="https://mlh.io/seasons/2021/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2021-season&utm_content=white"
      target="_blank">
      <img id="mlh-banner" src="https://s3.amazonaws.com/logged-assets/trust-badge/2023/mlh-trust-badge-2023-white.svg"
        alt="Major League Hacking 2023 Hackathon Season" />
    </a> -->

    <div id="logo-container">
      <img src="/2023_Logo_Resized.png" id="short-logo" />
      <!-- <br /> -->
      <!-- <h2 class="kenthackenough">Kent Hack Enough</h2> -->
    </div>

    <div id="landing-content-container">
      <p id="date">Blasting off this October</p>
      <!-- <span v-if="$parent.$parent.showRegister">
        <router-link tag="button" :to="{ name: 'register' }" id="apply-btn" class="register-now"
          v-if="$parent.$parent.user._id == ''">
          Register Now!
        </router-link>
        <router-link tag="button" :to="{ name: 'apply' }" id="apply-btn" class="apply-now"
          v-else-if="$parent.$parent.user._id == ''">
          Apply now!
        </router-link>
        <p v-if="$parent.$parent.showSchedule" style="margin: 20px;">
          <a id="schedule-link" style="
              display: inline-block;
              cursor: pointer;
              text-decoration: none;
            " href="/schedule">CHECK OUT THE SCHEDULE</a>
        </p>
        <p hidden title="The Event has already occured" style="
            font-size: 5vh;
            max-width: 800px;
            width: 80vw;
            margin-left: auto;
            margin-right: auto;
          ">
          REGISTRATION FOR KENT HACK ENOUGH 2022 IS CLOSED
        </p>
        <div v-if="$parent.$parent.showMLH" style="font-size: initial !important; margin-top: 20px">
          <a class="mlh-conduct" href="https://mlh.io/code-of-conduct/" target="_blank" style="
              font-weight: bold;
              opacity: 0.75;
              font-size: 2vh;
              text-decoration: none;
            ">MLH Code of Conduct</a>
        </div>
      </span> -->
      <span v-if="!$parent.$parent.showRegister && $parent.$parent.registrationOpens">
        <p title="Registration has not yet opened!" style="
                          font-size: 3vh;
                          max-width: 800px;
                          width: 80vw;
                          margin-left: auto;
                          margin-right: auto;
                          opacity: 0.5;
                        ">
          Registration opens {{ $parent.$parent.registrationOpens }}
        </p>
      </span>
      <!-- <a class="desktop-only gold-link" v-bind:style="{ 'font-size': ((!$parent.$parent.showRegister) ? '3vh!important' : '2.5vmin') + '', 'margin-top': ((!$parent.$parent.showRegister) ? '0px' : '0px') }" href="/sponsor" target="_blank">
        <span style="font-family: 'Dagger Square'!important; color: white;">Interested in Sponsoring?</span>
      </a>
      <a class="mobile-only gold-link" v-bind:style="{ 'font-size': ((!$parent.$parent.showRegister) ? '6vmin!important' : '5.5vmin') + '', 'margin-top': ((!$parent.$parent.showRegister) ? '0px' : '0px') }" href="/sponsor" target="_blank">
        <span style="font-family: 'Dagger Square'!important; color: white;">Interested in Sponsoring?</span>
      </a> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "landing",
  data() {
    return {
      scrollPos: 0,
      mouseX: 0,
      mouseY: 0,
    };
  },
  mounted() {
    this.handleScroll();
    window.addEventListener("scroll", this.handleScroll);
    document.onmousemove = this.handleMouseMove;
  },
  methods: {
    handleScroll() {
      this.scrollPos = window.scrollY;
    },
    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    logout: function () {
      this.$parent.$parent.wrapper.userManager.logout();
      //        .then(() => {
      //        console.log("Logged out!");
      //      }).catch((err) => {
      //        console.error("Error logging out: ", err);
      //      })
      this.$parent.$parent.user = this.$parent.$parent.userInitialState();
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import "@/styles/space.scss";


.hacksu-box {
  display: none;
}

.img-box {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40vh;
  max-width: 50vw;
  height: 40vh;
  max-height: 50vw;
  z-index: -1;
}

#date {
  font-size: 3.5vh;
  max-width: 80vw;
  margin-left: auto;
  margin-right: auto;
  color: #bdbdbd;
}

#apply-btn {
  @include large-btn-primary;
  @include grow("hover", 1.1, 0.3s);
  width: 300px;
  max-width: 80vw;
}

#schedule-link {
  @include underline;
  @include grow("hover", 1.025, 0.2s);
  color: color("text-primary");
  font-size: 2vh;

  @include mobile {
    font-size: 2.5vh;
  }
}

#landing-container {
  min-height: 100vh;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  padding-bottom: 20px;
  position: relative;
}

#logo-container {
  /*height: 130px;*/
  margin-top: 150px;

  img {
    height: 70%;
    padding: 0px 10px;

    @media only screen and (max-width: $md-bp) {
      height: 80%;
    }
  }

  #short-logo {
    margin-top: 20px;
    width: 25vw;
    height: auto;

    @media only screen and (max-width: $md-bp) {
      width: 50vw;
    }
  }
}

#landing-content-container {
  margin-top: 40px;
  z-index: 11;
}

#mlh-trust-badge {
  display: block;
  max-width: 100px;
  min-width: 60px;
  position: absolute;
  //left: 5px;
  left: 300px;
  top: 0;
  width: 10%;
  z-index: 10000;
}

@media (max-width: 1100px) {
  #mlh-trust-badge {
    left: 80vw;
  }
}

@media (max-width: 500px) {
  #mlh-trust-badge {
    left: 70vw;
  }
}

// @media (max-width: 1100px) {
//   #mlh-trust-badge {
//     left: 250px;
//   }
// }

#mlh-banner {
  width: 100%;
}

.mlh-conduct {
  color: color('secondary')
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

sup {
  font-size: 14px;
}
</style>
