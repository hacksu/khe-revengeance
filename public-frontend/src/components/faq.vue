<template>
  <div id="faq-container">
    <orbiter>
      <div id="faq">
        <div class="info-container">
          <h2 id="faqTitle">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="faq, i in faqs" :key="i" :title="faq.question">
              <v-expansion-panel-text>
                <div class="faq-answer">
                  <p v-for="p, i in faq.answer.split('\n\n')" :key="i" v-html="p" />
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <p class="faqModule">
            Still have questions?
            <router-link to="contact" id="contactLink">Let us know!</router-link>
          </p>
        </div>
      </div>
    </orbiter>
  </div>
</template>

<script>
import orbiter from "./orbiter.vue";
export default {
  name: "Main",
  components: { orbiter },
  data() {
    return {
      faqs: [
        {
          id: 0,
          question: "What is a hackathon?",
          answer:
            `A hackathon is a weekend-long event to meet smart creative people, make connections, learn, and build something awesome! 

            Attendees meet on Saturday, make a team, and have 24 hours to build a tech-related project. 
            There will be optional lessons and talks, sponsors looking to hire smart, motivated people, and tons of free stuff!`
        },
        {
          id: 1,
          question: "Can I participate?",
          answer:
            `If you're a high school student, a college student, or a recent college graduate, then yes! 
            KHE is attended by people of all skill levels and backgrounds. 
            You'll fit right in and hopefully, learn something!`
        },
        {
          id: 2,
          question: "Sounds cool, but how much does it cost?",
          answer:
            `$0.00!
            
            Thanks to the generosity of our sponsors, we're able to put on events like this for <i>free</i>.  
            We even pay for your meals for the weekend!  
            Make sure to thank our sponsors - we couldn't do it without them!`
        },
        {
          id: 3,
          question: "What should I bring?",
          answer:
            `Bring a laptop/something to hack on, a change of clothes, deodorant, a blanket/pillow, toiletries, 
            and anything else you think you might use to complete your project.
            
            We'll have an MLH hardware lab, which means we'll also have cool hardware available to rent!`
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
};
</script>

<style scoped lang="scss">
@import '@/globalVars.scss';

.info-container {
  padding: 50px 50px;
  border-radius: 50px;
  width: 600px;
  max-width: 90vw;
  border: 1px solid gray;
  background-color: rgb(238, 238, 238);

  @media only screen and (max-width: $md-bp) {
    padding: 20px 10px;
    border-radius: 20px;
  }
}

#faq-container {
  margin-top: 0px;
  padding-top: 20px;
  min-height: 100vh;
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#faqTitle {
  margin-top: 0;
  margin-bottom: 40px;
}

#faq {
  color: black;
  display: flex;
  justify-content: center;
}

.faqModule {
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  padding: 10px 20px 10px 20px;
  margin-top: 20px;
  background: white;
}

.faq-answer {
  margin: 10px;

  & p {
    margin: 5px 0;
  }
}

#contactLink {
  color: black;
}
</style>
