<template>
  <div id="faq-container">
    <div id="faq">
      <div class="info-container">
        <h2 id="faqTitle">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div class="image-box1 desktop-only">

        </div>

        <div class="image-box2 desktop-only">

        </div>

        <!--Outputs faq objects dynamically, as defined by the 'faqs' object in the data.-->
        <div class="faqModule" v-for="faq in faqs" @click="expandFAQ(faq.id)">
          <div class="question">
            <span v-if="expanded != faq.id">▶ &nbsp;</span>
            <span v-if="expanded == faq.id">▼ &nbsp;</span>
            <span class="qText">{{ faq.question }}</span>
          </div>
          <transition name="wipe">
            <div class="answer" v-html="faq.answer" v-if="expanded == faq.id"></div>
          </transition>
        </div>
        <br>
        <p class="faqModule">
          Still have questions?
          <router-link to="contact" id="contactLink">Let us know!</router-link>
        </p>
      </div>

      <div class="back"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      expanded: -1,
      faqs: [
        {
          id: 0,
          question: "What is a hackathon?",
          answer:
            "A hackathon is a weekend long event to meet smart creative people, make connections, learn, and build something awesome! <br><br> Attendes meet on Friday, make a team, and have 36 hours to build a tech-related project. There will be optional lessons and talks, sponsors looking to hire smart, motivated people, and tons of free stuff!"
        },
        {
          id: 1,
          question: "Can I participate?",
          answer:
            "If you're a high school student, a college student, or a recent college graduate, then yes!  KHE is attended by people of all skill levels and backgrounds.  You'll fit right in, and hopefully learn something."
        },
        {
          id: 2,
          question: "Sounds cool, but how much does it cost?",
          answer:
            "$0.00!<br><br>Thanks to the generosity of our sponsors, we're able to put on events like this for <i>free</i>.  We even pay for your meals for the weekend! Make sure to thank our sponsors - we couldn't do it without them!"
        },
        {
          id: 3,
          question: "What should I bring?",
          answer:
            "Bring a laptop/something to hack on, a change of clothes, deoderant, a blanket/pillow, toiletries, deoderant, anything else you think you might use to complete your project, and deoderant.<br><br>We'll have an MLH hardware lab, which means we'll also have cool hardware available to rent!"
        },
        {
          id: 4,
          question: "Do I need to come with a team?",
          answer:
            "You can, but you don't have to! We'll have team building at the event."
        },
        {
          id: 5,
          question: "How many people per team?",
          answer:
            "There's no hard limit, but the prizes are meant for teams of 4, so that's what we recommend."
        }
      ]
    };
  },
  methods: {
    expandFAQ(id) {
      if (this.expanded === id) {
        this.expanded = -1;
      } else {
        this.expanded = id;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/globalVars.scss';

.image-box1 {
  background-position: -0vh 0vh;
  /*left: -25vh;
  margin-left: 12vw;*/
  left: 2vw;
  position: absolute;
  background-image: url("../assets/walkman2020.png");
  background-size: contain;
  background-repeat: no-repeat;
  width: 45vh;
  max-width: 25vmax;
  height: 40vh;
  max-height: 50vw;
  z-index: -1;
  margin-top: 25vh;
  transform: rotate(15deg);
}

.image-box2 {
  background-position: 0vw 0vh;
  right: 2vh;
  position: absolute;
  background-image: url("../assets/cassettes.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 45vh;
  max-width: 45vmax;
  height: 40vh;
  max-height: 50vw;
  z-index: -1;
  margin-top: -20vh;
  transform: rotate(180deg);
}

#faq-container {
  margin-top: 0px;
  padding-top: 20px;
  /*background: $sand2;*/
  /*background: rgb(0,82,224);
  background: linear-gradient(90deg, rgba(0,82,224,1) 0%, rgba(255,255,255,1) 100%);*/
  min-height: 100vh;

}

#faq-container .back {
  background: $sand2;
  display: inline-block;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: -2;
  position: absolute;
}

#faqTitle {
  text-align: center;

  /*font-size: 50px;*/
  /*height: calc(8vw + 5vh);*/
  img {
    height: 100%;
  }

  @media only screen and (max-width: $md-bp) {
    height: calc(13vw + 3vh);
    font-size: 7.5vmin !important;
  }

  color: black;
  background: linear-gradient(90deg, rgba(215, 93, 222, 1) 0%, rgba(245, 119, 49, 1) 100%);
  display: inline-block;
  font-family: Lazer84;
  font-size: 6vmin;
  transform: rotate(-2.5deg);
  /* translate(0%, -20%); */
  line-height: 7.5vmin;
  letter-spacing: 1vmin;
  /*filter: drop-shadow(4px 4px $blue) drop-shadow(-1.5px -1.5px $blue)*/
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#faq {
  background-color: var(--orange);
  background-image: radial-gradient(var(--dark-orange) 15%, transparent 16%),
    radial-gradient(var(--dark-orange) 15%, transparent 16%);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
  font-size: 20px;
  line-height: 30px;
  color: black;
  width: 50vw;
  margin-left: 25vw;

  @media only screen and (max-width: $md-bp) {
    width: 90vw;
    margin-left: 5vw;
  }
}

.faqModule {
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  padding: 10px 20px 10px 20px;
  margin: 5px;
  background: white;
}

.question {
  width: 100%;
  cursor: pointer;
  font-weight: bold;
}

.answer {
  margin-top: 10px;
  border-top: 1px solid gray;
  padding-top: 10px;
  overflow: hidden;
  max-height: 300px;
  padding-bottom: 50px;
}

#contactLink {
  color: black;
}

.qText {
  transition-duration: 0.4s;
}

.qText:hover {
  letter-spacing: 1px;
}

/*  VUE TRANSITIONS*/
.wipe-enter-active,
.wipe-leave-active {
  transition: max-height 0.5s;
}

.wipe-enter,
.wipe-leave-to {
  max-height: 0px;
}
</style>
