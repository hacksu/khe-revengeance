<template>
  <div id="contact" class="widget">
    <div class="back"></div>
    <div v-if="!submitted">
      <h1 id="contactTitle">Contact</h1>
      <p style="opacity: 0.5; margin-bottom: 40px;">
        If you have any questions, concerns, or problems, please do not hesitate
        to contact us. One of our organizers will get back to you as soon as
        humanly possible.
      </p>

      <div class="formField">
        <span id="subjectTitle">Subject:</span>
        <input type="text" placeholder="What do you need to talk about?" name="subject" class="contactTextField"
          v-model="subject" />
      </div>

      <div class="formField">
        <span id="subjectTitle">Name:</span>
        <input type="text" placeholder="What is your name?" name="name" class="contactTextField" v-model="name" />
      </div>

      <div class="formField">
        <span id="subjectTitle">Email:</span>
        <input type="text" placeholder="Where can we contact you?" name="email" class="contactTextField"
          v-model="email" />
      </div>

      <div class="formField">
        <span id="subjectTitle">Body:</span>
        <textarea placeholder="Tell us more!" name="body" class="contactTextField" v-model="content" />
      </div>

      <div style="text-align: center;">
        <button id="contactButton" class="apply-link" :class="{ disabled: !formFilledOut }"
          @click="formFilledOut && submitTicket()">
          Send!
        </button>
      </div>

      <p class="error" v-html="err"></p>
    </div>
    <div v-else>
      <h2>Thanks!</h2>
      <p>Your ticket is submitted. We'll look into it as soon as possible!</p>
    </div>
  </div>
</template>

<script>
import { SupportTicketController } from "includes/support-ticket.ts";

export default {
  name: "Main",
  data() {
    return {
      subject: "",
      content: "",
      email: "",
      name: "",

      submitted: false,
      err: "",
    };
  },
  watch: {
    content() {
      const $el = this.$el.querySelector('textarea');
      if ($el.scrollHeight > $el.offsetHeight) {
        $el.style.height = $el.scrollHeight + 30 + 'px';
      }
    }
  },
  methods: {
    async submitTicket() {
      await SupportTicketController.createTicketAndSendAlert({
        originalSubject: this.subject,
        theirEmail: this.email,
        theirName: this.name,
        messages: [{
          subject: this.subject,
          text: this.content,
        }]
      });
      this.submitted = true;
    },
  },
  computed: {
    formFilledOut() {
      return this.subject && this.name && this.email && this.content;
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import '@/styles/space.scss';

#contact {
  @include bg-primary;
  text-align: left;
  // padding: 2rem 6rem;
  padding: 100px 6rem 100px 6rem;
  font-size: 20px;
  line-height: 30px;
  // height: 100vh;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

@media only screen and (max-width: 768px) {
  #contact {
    padding: 2rem 1rem !important;
  }
}

#infoTitle {
  font-size: 50px;
}

#subjectTitle {
  font-size: 24px;
}

.formField {
  width: 100%;
  margin-bottom: 20px;

  input,
  textarea {
    @include input-primary;
    margin: 5px 0px;
  }
}

.contactTextField {
  display: block;
  // color: white;
  background: none;
  // border: none;
  // outline: none;
  font-size: 20px;
  width: 100%;
  box-sizing: border-box;
  // border-bottom: 2px solid white;
}

textarea.contactTextField {
  min-height: 100px;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  box-sizing: border-box;
}

#contactButton {
  margin-top: 10px;
  @include large-btn-primary;
  position: relative;
  text-align: center;
  display: inline-block;
  width: 200px;
  height: 50px;
  font-size: 20px;
  border: 2px solid white;

  &.disabled {
    outline: none;
    border: none;
    opacity: 0.5;
  }
}

#contactButton:hover:not(.disabled) {
  cursor: pointer;
  position: relative;
  // background-color: $gold;
  // color: $dark-blue;
  // transition: 0.5s;
}

.error {
  color: color('error');
}
</style>
