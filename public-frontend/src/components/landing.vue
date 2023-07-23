<template>
  <div id="landing-container" class="landing">
    <div class="hacksu-box box1" />
    <div class="hacksu-box box2" />

    <div id="logo-container">
      <img src="/2023_Logo_Resized.png" id="short-logo" />
    </div>

    <div id="landing-content-container">
      <p id="date">Blasting off this October</p>
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
import { remult } from 'remult';
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
@import "@/styles/global.scss";
@import "@/styles/space.scss";

$text-color: #bdbdbd;


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
  color: $text-color;
  display: inline;
  padding: 10px;
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
  }

  100% {
    transform: translate(30px, -30px);
  }
}

.rocketing {
  animation-name: rocket-away;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
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
