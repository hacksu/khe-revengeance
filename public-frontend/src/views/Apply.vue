<template>
  <div id="application" ref="application" @keyup.enter="next()">
    <div style="display: block; height: 100px; margin: 0px; margin-bottom: -70px; padding-top: 10vh;"></div>
    <h6 id="auth-subtitle"><img style="height: 10vh;" src="/Logo.svg" /></h6>
    <div class="back" style="">
    </div>

    <div id="questionHolder" v-on:submit.prevent v-if="currentQuestion != appQuestions.length">
      <div class="question" v-for="(question, index) in appQuestions" :key="index">
        <div id="displayedQuestion" v-if="currentQuestion == index">
          <p>
            {{ index + 1 }}.
            <span class="err" v-if="question.required">*</span>
            <span v-html="question.label"></span>
          </p>
          <input type="text" v-if="question.type == 'text'" class="question" @keyup.enter="next()"
            v-bind:placeholder="question.placeholder" v-model="$parent.user.application[question.appField]" />

          <div v-if="question.type == 'phone'">
            <vue-tel-input v-model="$parent.user.application.phone" :defaultCountry="'US'" @onInput="onInput"
              placeholder="5551239876" @keyup.enter="next()" class="front">
            </vue-tel-input>
          </div>

          <div class="optHolder" v-if="question.type == 'radio'">
            <!--            The following input is used to allow users to type their selection,
                instead of clicking on the buttons.

                You can find it's handler in the watched functions.
-->
            <input class="hidden question" v-model="radioInput" @keyup.enter="next()" />
            <div class="opt" v-for="(option, optIndex) in question.options" :key="optIndex" v-bind:class="{
              selected:
                $parent.user.application[question.appField] == option[1],
              selectable:
                $parent.user.application[question.appField] != option[1],
            }" @click="$parent.user.application[question.appField] = option[1]">
              [{{ optIndex + 1 }}.] &nbsp; {{ option[0] }}
            </div>
            <input class="stringOpt" v-if="question.stringInputLabel != undefined" type="text"
              v-model="$parent.user.application[question.appField]" @keyup.enter="next()"
              v-bind:placeholder="question.stringInputLabel" />
          </div>

          <div class="optHolder" v-if="question.type == 'bool'">
            <span v-if="question.appField == 'conduct'" class="gray-subtitle">
              TL;DR. Be respectful. Harassment and abuse are never tolerated.
            </span>

            <span v-if="question.appField == 'demographic'" class="gray-subtitle">
              I authorize you to share my application/registration information
              for event administration, ranking, MLH administration, pre- and
              post-event informational e-mails, and occasional messages about
              hackathons in-line with the MLH Privacy Policy. I further agree to
              the terms of both the MLH Contest Terms and Conditions and the MLH
              Privacy Policy.
            </span>

            <input class="hidden question" v-model="boolInput" @keyup.enter="next()" />
            <div class="opt" v-bind:class="{
              selected: $parent.user.application[question.appField] == true,
              selectable:
                $parent.user.application[question.appField] != true,
            }" @click="$parent.user.application[question.appField] = true">
              1. Yes!
            </div>
            <div class="opt" v-bind:class="{
              selected: $parent.user.application[question.appField] == false,
              selectable: $parent.user.application[question.appField] != false,
            }" @click="$parent.user.application[question.appField] = false">
              2. Nope!
            </div>
            <!-- <div v-if="question.appField == 'travel' &&
                       $parent.user.application[question.appField]">
              What is your address? (So we can mail you some KHE swag!)
              <input v-model="$parent.user.application['dietary']" data-old-v-model="$parent.user.application.extra"
                     class="question"
                 @keyup.enter="next()"
                    placeholder="USA, Ohio, Kent">
            </div> -->
          </div>

          <div v-if="question.type == 'number'">
            <input type="number" class="numInput" v-model="$parent.user.application[question.appField]"
              v-bind:placeholder="question.placeholder" />
            <p v-if="
              question.appField == 'age' &&
              $parent.user.application[question.appField] != '' &&
              $parent.user.application[question.appField] > 12 &&
              $parent.user.application[question.appField] < 18
            " style="font-size: 14px">
              As a minor, make sure you bring a
              <a href="https://drive.google.com/file/d/1-AKs9LPvUtkPbgQwvr1o-nbHIxr5Ez_9/view?usp=sharing"
                target="_blank" class="orange-link">waiver</a>, signed by a parent or gaurdian.
            </p>
          </div>

          <div v-if="question.type == 'upload'">
            <input class="hidden question" v-model="boolInput" @keyup.enter="next()" />
            <vue-dropzone ref="resumeUpload" id="dropzone" :options="dropzoneOptions"
              v-on:error="uploadError(errorMessage)" name="resume" v-on:success="uploadSuccess()"></vue-dropzone>
          </div>
        </div>
      </div>
      <div class="nav-buttons">
        <button @click="previous()" class="fancy-button" v-if="currentQuestion != 0">
          ← Back
        </button>
        <button style="opacity: 0" v-else></button>
        <button @click="next()" class="fancy-button" v-if="currentQuestion < appQuestions.length - 1" :class="{
          disabled: !valid(currentQuestion),
        }">
          Next →
        </button>
        <button @click="submit()" v-else class="fancy-button" :class="{
          disabled: !valid(currentQuestion),
        }">
          Finish!
        </button>
      </div>
      <div class="err">
        {{ submissionErr }}
      </div>
    </div>
    <div v-else id="questionHolder">
      <h1>Thanks!</h1>
      <p>Your application was submitted! Nice!</p>
      <p>We'll send confirmation to your email soon. Get pumped!</p>
      <router-link tag="button" class="fancy-button" to="/">
        Back to Home!
      </router-link>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
//import phoneFilter from '../filters/phoneFilter';
import VueTelInput from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";

import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

import apiConfig from "@/config/config";

Vue.use(VueTelInput);
export default {
  name: "apply",

  components: {
    vueDropzone: vue2Dropzone,
    VueTelInput,
  },

  data() {
    return {
      currentQuestion: 0,
      radioInput: "", // Stores the user's input as a full string
      radioChoice: -1, // The calculated choice. See radioInput's watcher for more info

      boolInput: "",
      boolChoice: -1,

      goToNext: true, // Used to debounce next()

      submissionErr: "", // automatically displays any text here

      phone: {
        number: "",
        isValid: false,
        country: undefined,
      },

      dropzoneOptions: {
        url: `${apiConfig.api_base}/users/application/resume?email=${this.$parent.email}`,
        acceptedFiles: "application/docx,application/pdf,text/plain",
        thumbnailWidth: 150,
        paramName: "resume",
        success: this.uploadSuccess,
      },

      // All appQuestion objects should have:
      //    - type: one of: 'text', 'radio', 'phone', 'bool' 'number'
      //    - label (any string)
      //    - required (bool)
      //
      // If you change these questions, make sure they still work with
      // the requirements here:
      // https://github.com/hacksu/kenthackenough/blob/master/app/users/application/model.js
      appQuestions: [
        {
          appField: "name",

          type: "text",
          label: "Full Name: ",
          placeholder: "Jane Doe",

          required: true,
        },
        {
          appField: "school",

          type: "text",
          label: "Your school's full name:",
          placeholder: "Kent State University",

          required: true,
        },
        {
          appField: "phone",

          type: "phone",
          label: "Your phone number: ",
          placeholder: "555-555-5555",

          required: true,
        },
        /*{
          appField: 'shirt',

          type: 'radio',
          label: 'Your shirt size: ',
          options: [
            // First value of each array is a label,
            // second value is the value
            ['Small', 'S'],
            ['Medium', 'M'],
            ['Large', 'L'],
            ['X-Large', 'XL'],
            ['XX-Large', 'XXL'],
            ['XXX-Large', 'XXXL']
          ],

          required: true
        },*/
        {
          appField: "first",

          type: "bool",
          label: "Is this your first hackathon?",

          required: true,
        },
        /*{
          appField: 'dietary',

          type: 'radio',
          label: 'Do you have any dietary restrictions?',

          options: [
            ['Vegetarian', 'vegetarian'],
            ['Vegan', 'vegan'],
            ['Kosher', 'kosher'],
            ['Gluten Free', 'gluten']
          ],
          // stringInputLabel is optional
          stringInputLabel: 'Allergies/Other Dietary Restrictions '
        },*/
        {
          appField: "year",

          type: "radio",
          label:
            'Where are you in school? If you are a recent graduate (spring 2019 to now), please type "recent grad" in the box. If none of these options apply, you are not eligible to participate. Please exit registration. ',

          options: [
            ["In high school", "High School"],
            ["Freshman", "Freshman"],
            ["Sophomore", "Sophomore"],
            ["Junior", "Junior"],
            ["Senior", "Senior"],
            ["Grad Student", "Graduate"],
          ],
          // stringInputLabel is optional
          stringInputLabel: "Other (describe here)",
          required: true,
        },
        {
          appField: "age",

          type: "number",
          placeholder: "Age",
          label: "How old are you?",

          required: true,
        },
        {
          appField: "gender",

          type: "radio",
          label: "What's your gender?",

          options: [
            ["Female", "Female"],
            ["Male", "Male"],
            ["Prefer Not to Say", "Prefer Not to Say"],
          ],
          // stringInputLabel is optional
          stringInputLabel: "Other",
          required: true,
        },
        {
          appField: "major",

          type: "text",
          label: "What's your major?",
          placeholder: "Computer Science",

          required: true,
        },
        // {
        //   appField: 'travel',
        //   type: 'bool',
        //   label: 'Do you reside in the United States?', //'Will you need travel reimbursement?',

        //   required: true
        // },
        {
          appField: "resume",
          type: "upload",
          label: "Upload your resume:",

          required: false,
        },
        {
          appField: "link",

          type: "text",
          label: "Link to your github, personal website, or anything else.",
          placeholder: "github.com/you",

          required: false,
        },
        {
          appField: "conduct",
          type: "bool",
          label:
            'Do you agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf" target="_blank" class="orange-link">MLH code of conduct</a>?',

          required: true,
        },
        {
          appField: "demographic",
          type: "bool",
          label: "Can we send your demographic info to MLH's administration?",

          required: true,
        },
        {
          appField: "mlh_emails",
          type: "bool",
          label:
            "Would you like MLH to send you pre- and post-event informational emails, which contain free credit and opportunities from their partners?",

          required: false,
        },
      ],
    };
  },
  watch: {
    // This function takes the latest numeric input from the hidden input,
    // & selects the corresponding radio value.
    radioInput(newVal, oldVal) {
      // The hidden input holds a string, so first we grab the last character
      // of that string:
      var newChar = newVal[newVal.length - 1];

      // Next we grab the question from the question array:
      var question = this.appQuestions[this.currentQuestion];

      // Checking if newChar is a number in the options:
      var number = Number(newChar);
      if (number && question.options[number - 1]) {
        this.$parent.user.application[question.appField] =
          question.options[number - 1][1];
      }
    },
    boolInput(newVal, oldVal) {
      // The hidden input holds a string, so first we grab the last character
      // of that string:
      var newChar = newVal[newVal.length - 1];

      // Next we grab the question from the question array:
      var question = this.appQuestions[this.currentQuestion];

      if (newChar === "1") {
        this.$parent.user.application[question.appField] = true;
      } else if (newChar === "2") {
        this.$parent.user.application[question.appField] = false;
      }
    },
  },
  methods: {
    valid(q) {
      var app = this.$parent.user.application;
      let x = 0;
      switch (q) {
        case x++: // Name
          return app.name.length > 2;
          break;
        case x++: // School
          return app.school.length > 3;
          break;
        case x++: // Phone
          return this.phone.isValid;
          break;
        /*case x++: // shirt
          return (app.shirt);*/
        case x++: // first hackathon? Just needs to be yes/no
          return app.first != null;
          break;
        /*case x++: // Dietary restrictions? Can be skipped
          return true
          break;*/
        case x++: // Year of school
          return app.year;
          break;
        case x++: // Age
          return app.age > 12;
          break;
        case x++: // gender
          return app.gender;
          break;
        case x++: // Major
          return app.major;
          break;
        // case x++: // Travel
        //   return (app.travel == true && (true || app.extra.length > 5))
        //           || (app.travel == false);
        //   break;
        case x++:
          return true;
          break;
        case x++: // resume
          return true;
          break;
        case x++: // MLH code of conduct
          return app.conduct;
          break;
        case x++: // demographic info
          return app.demographic;
          break;
        case x++: // mlh emails
          console.log(app);
          return true;
          break;
        default:
          return true;
      }
    },

    next() {
      if (this.goToNext && this.valid(this.currentQuestion)) {
        // Handling the last question
        if (this.currentQuestion == this.appQuestions.length - 1) {
          this.submit();
          return;
        }

        this.currentQuestion++;
        this.focusElement();
        this.goToNext = false;
        var vm = this;
        setTimeout(() => {
          vm.goToNext = true;
        }, 100);
      }
    },
    previous() {
      this.currentQuestion--;
      this.focusElement();
    },
    focusElement() {
      setTimeout(() => {
        var input =
          document.querySelector(".question input") ||
          document.querySelector(".question-cell.is-selected textarea") ||
          document.querySelector(".question-cell.is-selected select");
        if (input) {
          input.focus();
        }
      }, 200);
    },
    // For phone number handling
    onInput({ number, isValid, country }) {
      this.phone.number = number;
      this.phone.isValid = isValid;
      this.phone.country = country && country.name;
    },

    uploadSuccess(resp) {
      console.log("Success!");
      let filename = JSON.parse(resp.xhr.responseText).filename;
      this.$parent.user.application["resume"] = `${filename}`;
      /*fetch(`${apiConfig.api_base}/users/application/resume-email/${
        this.$parent.email
      }/${
        filename
      }`).then(() => {}).catch(() => {});*/
    },
    uploadError(errorMessage) {
      console.error("Error uploading resume! ", errorMessage);
    },

    submit() {
      if (!this.valid(this.appQuestions.length - 1)) {
        return;
      }
      let phone = this.$parent.user.application.phone.split(" ");
      this.$parent.user.application.phone = phone[1] + phone[2] + phone[3];

      // Virtual Hackathon
      this.$parent.user.application.shirt = "M";
      // this.$parent.user.application.travel = false;
      // ---------------

      var vm = this;
      console.warn(this.$parent.user.application);
      this.$parent.wrapper.applicationManager
        .saveApplication(this.$parent.user.application)
        .then((data) => {
          console.log("Submitted app!");
          vm.currentQuestion++;
          vm.$parent.hasApp = true;
        })
        .catch((err) => {
          console.error(err.response.data.errors[0]);
          vm.submissionErr = err.response.data.errors[0];
        });
    },
  },

  mounted() {
    this.focusElement();
    const user = this.$parent.wrapper.userManager.getLocalUser();
    // console.log('user =', user);
    if (!user) {
      this.$router.push('/register');
    }
  },
  //  filters: {
  //    phone: function(phone) {
  //      return phone.replace(/[^0-9]/g, '')
  //                .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  //    }
  //  }
};
</script>

<style scoped lang="scss">
@import "@/globalVars.scss";
@import '@/styles/global.scss';

#application .back {
  @include bg-flashy;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: -1;
  overflow: hidden;
}

#the-back {
  background: linear-gradient(45deg, #ffecb8, #ffe499 95%);
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1;
  overflow: hidden;
}

#the-back .squiggly {
  margin-top: 8vh;
  height: 84vh;
  width: 100vw;
  position: absolute;
  top: 0px;
  left: 0px;
  background-image: url(../assets/squiggly-back.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  z-index: -2;
}

#the-back img {
  width: 100vw;
  opacity: 0.02;
  z-index: -5;
}

#application {
  // color: white;
  display: flex;
  flex-direction: column;
  //background: $dark-blue;
  // background: linear-gradient(90deg, rgba(215,93,222,1) 0%, rgba(245,119,49,1) 100%);
  // height: 100vh;
  // overflow-x: hidden;
}

#app-header {
  text-align: left;
  margin-top: 0px;
  padding-top: 50px;
  left: 0px;
  min-height: 100px;
  // color: black;
  font-size: 20px;

  padding-bottom: 20px;
  display: flex;
  justify-content: space-around;
  // background: black;

  img {
    height: 60px;
  }

  z-index: 99;

  @media only screen and (max-width: 600px) {
    img:not(.logo) {
      display: none;
    }
  }
}

#questionHolder {
  margin-left: 15%;
  margin-right: 15%;
  padding-top: 100px;
  margin-bottom: 200px;
  z-index: 50;
  position: relative;
  font-size: 20px;

  padding: 50px;
  border-radius: 15px;
  @include bg-secondary;
}

.question {
  margin-top: 30px;
}

input {
  font-size: 20px;
  padding: 5px;
  border: none;
  //border-bottom: solid black 3px;
  width: 100%;
  outline: none;
  border-radius: 0.25em;

  background-color: rgba(0, 0, 0, 0.05);
}

input:focus {
  opacity: 1;
  border-bottom: solid color('secondary');
}

input[type="text"] {
  opacity: 0.5;
}

input[type="text"]:focus {
  opacity: 1;
}

.optHolder {
  display: flex;
  flex-flow: row wrap;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
}

.fancy-button {
  // border-radius: 0.25em;
  @include btn-primary;
  padding: 12px;
}

/*  Used to facilitate the option chosen in the radio questions*/
.hidden {
  max-height: 2px;
  opacity: 0;
}

.hidden:focus {
  opacity: 0;
}

.opt {
  background: #eeeeee;
  padding: 5px 10px 5px 10px;
  border: solid gray 1px;
  width: 40%;
  color: black;
  min-width: 200px;
  //margin-right: 3%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 15px;
}

.selectable:hover {
  filter: brightness(90%);
}

.selectable:active {
  filter: brightness(80%);
}

.selected {
  filter: brightness(80%);
  border: solid 2px var(--orange);
}

.stringOpt {
  width: 42%;
  min-width: 200px;
}

.err {
  color: lightcoral;
  font-weight: bold;
}

.is-danger {
  border-bottom: solid 3px lightcoral;
}

.numInput {
  width: 100px;
}

.disabled {
  opacity: 0.5;
}

.gray-subtitle {
  opacity: 0.5;
  font-style: italic;
  font-size: 12px;
  text-align: left;
}
</style>

<style>
.dropdown {
  z-index: 1001 !important;
  color: black;
}

.orange-link {
  color: orange !important;
}

#apply-ground {
  background: #241b2a;
  width: 100vw;
  height: 12vh;
  position: absolute;
  bottom: 0px;
  z-index: 10;
}

#apply-cactus {
  position: absolute;
  height: 50vh;
  bottom: 10vh;
  left: 10vw;
  z-index: 11;
}
</style>
