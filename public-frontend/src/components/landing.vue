<template>
  <div id="landing-container" class="landing">

    <div id="sun-container">
      <img id="sun" src="/sun.png" />
      <img id="eclipse" src="/eclipse-overlay-bottom.png" />
    </div>

    <div id="moon-container">
      <img src="/Logo.svg" id="khe-logo" />
    </div>

    <div id="sun-container">
      <img id="eclipse" src="/eclipse-overlay-top.png" />
    </div>


    <div id="landing-content-container">
      <div class="date-container">
        <p id="date">Come to our hackathon in April 2024.</p>
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
import { Email } from 'includes/email-address';

export default {
  name: "landing",
  data: () => ({
    updatesEmail: "",
    updatesEmailSubmitted: false,
    updatesEmailError: "",
    updatesEmailPlaceholder: ""
  }),
  mounted() {
    const prevUpdatesEmail = localStorage.getItem("updatesEmail");
    if (prevUpdatesEmail) {
      this.updatesEmailPlaceholder = "Added: " + prevUpdatesEmail;
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
    }
  }
};
</script>

<style scoped lang="scss">
@use "sass:math";
@import "@/styles/global.scss";
@import "@/styles/space.scss";

$text-color: #bdbdbd;

#date {
  font-size: 1.8em;
  max-width: 90vw;
  margin-left: auto;
  margin-right: auto;
  color: var(--text-primary);
  display: inline;
  padding: 10px;
}

.date-container {
  display: inline;
  @include dark-bg;
}

#apply-btn {
  @include large-btn-primary;
  width: 300px;
  max-width: 80vw;
}

#landing-container {
  min-height: 100vh;
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
    color: var(--text-primary);
    font-size: 1.2em;
  }

  #email-input {
    display: flex;
    height: 40px;
    border-radius: 5px;
    overflow: clip;
    position: relative;
    body.light & {
      border: 1px solid black;
    }

    #thank-you-message {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 20px;
      padding: 5px;
      color: var(--text-primary);
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
      background-color: lightgray;
      cursor: pointer;

      &:disabled {
        background-color: white;
        @include fadeOutInput;
      }
    }
  }
}

#sun-container {
  width: 1100px;
  position: fixed;
  left: 50%;
  top: -250px;
  transform: translateX(-50%);

  img {
    width: 100%;
  }

  #sun{
    position: absolute;
    top: 0;
    left: 0;
    body.dark & {
      opacity: 0;
    }
    @include use-theme-transition(opacity);
  }

  #eclipse {
    body.light & {
      opacity: 0;
    }
    @include use-theme-transition(opacity);
    transition-duration: math.div($theme-transition-length, 2);
    transition-delay: math.div($theme-transition-length, 2);
  }
}

#moon-container {
  width: 360px;
  height: 360px;
  // #moon {
  //   filter: brightness(1);
  //   width: 100%;
  //   body.dark & {
  //     // opacity: 0;
  //     filter: brightness(0.1);
  //   }
  //   @include use-theme-transition(opacity, filter);
  // }
  position:absolute;
  left: 50%;
  // body.light & {
  //   bottom: 35%;
  // }
  // body.dark & {
  //   bottom: 51%;
  // }
  bottom: 51%;
  @include use-theme-transition(bottom);
  transform: translateX(-50%);

  #khe-logo {
    position: absolute;
    width: 60%;
    left: 50%;
    top: 40%;
    transform: translateX(-50%);
  }
}

#landing-content-container {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
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
