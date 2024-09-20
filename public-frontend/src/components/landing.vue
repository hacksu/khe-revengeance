<template>
  <div id="landing-container" class="landing">
    <slot v-if="replace"></slot>
    <div v-else-if="registrationOpen" id="full-size-logo-container">
        <SplashLanding id="splash-landing" ref="splashLanding" />
    </div>
    <div v-else="!registrationOpen" id="landing-content-container">
      <div class="date-container">
        <p id="date">KHE returns February 15-16, 2025</p>
      </div>
      <div id="email-input-container">
        <span id="email-input-label">Sign up to get registration information:</span>
        <div id="email-input">
          <span id="thank-you-message" v-if="updatesEmailSubmitted">Thank you 💖</span>
          <input @keyup.enter="submitEmail" type="email" :disabled="updatesEmailSubmitted"
            :placeholder="updatesEmailPlaceholder || 'sic-itur@astra.com'" v-model="updatesEmail" />
          <button @click="submitEmail" :disabled="updatesEmailSubmitted">
            <span :class="{ rocketing: updatesEmailSubmitted }">🚀</span>
          </button>
        </div>
        <span v-if="updatesEmailError" style="font-size: small; color: red">{{ updatesEmailError }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SplashLanding from "@/assets/khe-eclipse-splash.svg?component";

import { Email } from 'includes/email-address';

export default {
  name: "landing",
  components: {SplashLanding},
  props: {
    replace: {
      type: Boolean,
      required: false
    }
  },
  data: () => ({
    updatesEmail: "",
    updatesEmailSubmitted: false,
    updatesEmailError: "",
    updatesEmailPlaceholder: "",
    //the boolean below determines whether the page displays email input or a register button
    //TODO: automate this with a toggle on the staff page 
    registrationOpen: false
  }),
  mounted() {
    if (!this.replace) {
      const prevUpdatesEmail = localStorage.getItem("updatesEmail");
      if (prevUpdatesEmail) {
        this.updatesEmailPlaceholder = "Added: " + prevUpdatesEmail;
      }
      this.$refs.splashLanding.$el.querySelector("a").addEventListener("click", (e) => {
          e.preventDefault();
          this.navigateTo("/login");
      });
    }
  },
  methods: {
    async submitEmail() {
      const email = { address: this.updatesEmail };
      try {
        await Email.addEmailAndSendWelcome(email);
      } catch (e) {
        console.log(e);
        this.updatesEmailError = e.modelState?.address || "We already have that email!";
        return;
      }
      localStorage.setItem("updatesEmail", this.updatesEmail);
      this.updatesEmailError = "";
      this.updatesEmailSubmitted = true;
      this.updatesEmail = "";
    },
    navigateTo: function (page, el) {
      this.expandMenu = false;
      this.$router.push({ path: page, hash: el });
    },
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import "@/styles/space.scss";

$text-color: #bdbdbd;

#date {
  font-size: 1.8em;
  max-width: 90vw;
  margin-left: auto;
  margin-right: auto;
  color: $text-color;
  display: inline;
  padding: 10px;
}

.date-container {
  display: inline;
  @include dark-bg;
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
  min-height: 70vh;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  padding-bottom: 20px;
  position: relative;
  text-align: center;
}

@keyframes rocket-away {
  0% {
    transform: translate(0px, 0px);
  }

  100% {
    transform: translate(30px, -30px);
  }
}

.rocketing {
  @media (prefers-reduced-motion: no-preference) {
    animation-name: rocket-away;
    animation-duration: 0.5s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  display: inline-block;
}

@keyframes fadingOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@mixin fadeOutInput {
  animation-name: fadingOut;
  animation-delay: 0.5s;
  animation-fill-mode: forwards;
  animation-duration: 0.5s;
}

#email-input-container {
  & * {
    box-sizing: border-box;
  }

  @include dark-bg;

  padding: 2px;
  width: 450px;
  max-width: 80vw;
  margin: 1.5vh auto;
  font-size: 1.25em;

  #email-input-label {
    display: block;
    margin: 14px 8px;
    color: $text-color;
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
      color: $text-color;
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    input {
      width: 100%;
      height: 100%;
      border-radius: 0;
      border: none;
      font-size: 20px;
      padding: 5px;
      background-color: white;
      color: black;

      &:disabled {
        color: white;
        @include fadeOutInput;
      }
    }

    button {
      width: 45px;
      height: 100%;
      border-radius: 0;
      border: none;
      transition: background-color 0.25s;
      background-color: lightgray;

      &:disabled {
        background-color: white;
        @include fadeOutInput;
      }
    }
  }
}

@keyframes fade-in {
    0% {
        opacity: 0;
        // transform: translateY(70vh);
    }
    100% {
        opacity: 1;
        // transform: translateY(0);
    }
}

#full-size-logo-container {
    text-align: center;
    height: 100vh;
    animation: fade-in 1s ease-in;
    animation-delay: 0.5s;
    animation-fill-mode: both;
    #splash-landing {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        max-width: 170vw;
    }
}


#landing-content-container {
  margin-top: 40px;
  padding-top: 200px;
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
