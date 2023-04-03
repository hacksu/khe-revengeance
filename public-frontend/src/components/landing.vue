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
      <div id="email-input-container">
        <span id="email-input-label">Sign up to get registration information:</span>
        <div id="email-input">
          <input @keyup.enter="submitEmail" type="email" :disabled="updatesEmailSubmitted"
            placeholder="sic-itur@astra.com" v-model="updatesEmail" />
          <button @click="submitEmail" :disabled="updatesEmailSubmitted">
            <span :class="{ rocketing: updatesEmailSubmitted }">🚀</span>
          </button>
          <span id="thank-you-message" v-if="updatesEmailSubmitted">{{ thankYou }}</span>
        </div>
      </div>
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
        <p title="Registration has not yet opened!" class="registration-opens">
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
  data: () => ({
    updatesEmail: "",
    updatesEmailSubmitted: false,
    thankYou: ""
  }),
  methods: {
    async typeThankYou() {
      for (const char of "Got it, thanks!") {
        this.thankYou += char;
        await new Promise(res => setTimeout(res, 50));
      }
    },
    submitEmail() {
      this.updatesEmailSubmitted = true;
      this.updatesEmail = "";
      setTimeout(this.typeThankYou, 1000);
    }
  }
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
  font-size: 1.8em;
  max-width: 90vw;
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

@keyframes rocket-away {
  0% {
    transform: translate(0px, 0px);
    opacity: 1;
  }

  100% {
    transform: translate(20px, -20px);
    opacity: 0;
  }
}

.rocketing {
  animation-name: rocket-away;
  animation-duration: 0.75s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  display: inline-block;
}

#email-input-container {
  & * {
    box-sizing: border-box;
  }

  background-color: #000d;
  box-shadow: 0 0 20px 15px #000d;
  padding: 2px;
  width: 450px;
  max-width: 80vw;
  margin: 1.5vh auto;
  font-size: 1.25em;

  #email-input-label {
    display: block;
    margin: 14px 8px;
    color: #bdbdbd;
    font-size: 1.2em;
  }

  #email-input {
    display: flex;
    height: 40px;
    border-radius: 5px;
    overflow: clip;
    position: relative;

    #thank-you-message {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 20px;
      padding: 5px;
      color: black;
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      // justify-content: center;
    }

    input {
      width: 100%;
      height: 100%;
      border-radius: 0;
      border: none;
      font-size: 20px;
      padding: 5px;
      background-color: white;

      &:disabled {
        color: white;
      }
    }

    button {
      width: 45px;
      height: 100%;
      border-radius: 0;
      border: none;
      transition: background-color 0.25s;

      &:disabled {
        background-color: white;
      }
    }
  }
}

#logo-container {
  /*height: 130px;*/
  margin-top: 22vh;

  img {
    height: 70%;
    padding: 0px 10px;

    @media only screen and (max-width: $md-bp) {
      height: 80%;
    }
  }

  #short-logo {
    margin-top: 20px;
    width: 350px;
    max-width: 70vw;
    height: auto;
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

.registration-opens {
  font-size: 3vh;
  max-width: 800px;
  width: 80vw;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.5;
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
