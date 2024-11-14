<template>
  <div id="faq-container">
    <div id="faq">
      <orbiter />
      <div class="info-container">
        <h2 id="faqTitle">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <Accordion :multiple="true">
          <AccordionTab v-for="faq, i in faqs" :key="i" :header="faq.question">
            <p class="faq-answer" v-for="p, i in faq.answer.split('\n\n')" :key="i" v-html="p" />
          </AccordionTab>
        </Accordion>

        <p class="faqModule">
          Still have questions?
          <router-link to="contact" id="contactLink">Let us know!</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import orbiter from "./orbiter.vue";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
export default {
  name: "Main",
  components: { orbiter, Accordion, AccordionTab },
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
            `If you're a college student of any kind, then yes! 
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
            and anything else you think you might use to complete your project.`
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
  padding: 20px;
  width: 600px;
  max-width: 97.5vw;
}

:deep(.p-accordion .p-accordion-header) {
    background-color: #1e1e1e!important;
}

:deep(.p-accordion) {
    background-color: black;
    border: 2px solid white;
    border-radius: 5px;
    overflow: hidden;
}

:deep(.p-accordion .p-accordion-tab.p-accordion-tab-active) {
    margin-bottom: 0;
}

:deep(.p-accordion .p-accordion-content) {
    background-color: #fff2;
}

#faq-container {
  margin-top: 0px;
  padding-top: 20px;
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#faqTitle {
  margin: 20px 10px;
  color: white;
}

#faq {
  color: white;
  display: flex;
  justify-content: center;
  position: relative;
}

.faqModule {
  padding: 10px 20px 10px 20px;
  margin-top: 20px;
}

.faq-answer {
  margin: 15px 8px;

  &:first-of-type {
    margin-top: 5px;
  }

  &:last-of-type {
    margin-bottom: 5px;
  }
}
</style>
