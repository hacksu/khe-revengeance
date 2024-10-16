<template>
  <link rel="stylesheet" href="https://unpkg.com/xp.css">
  <div class="home">
    <div :hidden="!sponsors" id="sponsorWindow" class="window" style="width: 600px;">
      <div id="sponsorWindowHeader" class="title-bar" @mousedown="startDrag('sponsorWindow', $event)">
        <div class="title-bar-text">Sponsors</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" @click="$emit('closeSponsors')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeSponsors')"></button>
        </div>
      </div>
      <div class="window-body" style="height: 600px; overflow-y: scroll;">
        <Sponsors></Sponsors>
      </div>
    </div>
    <div :hidden="!faq" id="faqWindow" class="window" style="width: 600px;">
      <div id="faqWindowsHeader" class="title-bar" @mousedown="startDrag('faqWindow', $event)">
        <div class="title-bar-text">FAQ</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" @click="$emit('closeFAQ')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeFAQ')"></button>
        </div>
      </div>
      <div class="window-body" style="height: 600px; overflow-y: scroll;">
        <FAQ/>
      </div>
    </div>
    <div :hidden="!guide" id="guideWindow" class="window" style="width: 800px;">
      <div id="guideWindowHeader" class="title-bar" @mousedown="startDrag('guideWindow', $event)">
        <div class="title-bar-text">Hackathon Guide</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" @click="$emit('closeGuide')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeGuide')"></button>
        </div>
      </div>
      <div class="window-body" style="height: 800px; overflow-y: scroll;">
        <Guide/>
      </div>
    </div>
    <div :hidden="!contact" id="contactWindow" class="window" style="width: 600px;">
      <div id="contactWindowHeader" class="title-bar" @mousedown="startDrag('contactWindow', $event)">
        <div class="title-bar-text">Contact</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" @click="$emit('closeContact')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeContact')"></button>
        </div>
      </div>
      <div class="window-body" style="height: 560px; overflow-y: scroll;">
        <Contact/>
      </div>
    </div>
    <div :hidden="!login" id="loginWindow" class="window" style="width: 600px; background-color: white;">
      <div id="loginWindowHeader" class="title-bar" @mousedown="startDrag('loginWindow', $event)">
        <div class="title-bar-text">Login</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" @click="$emit('closeLogin')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeLogin')"></button>
        </div>
      </div>
      <div class="window-body" style="height: 450px; overflow-y: scroll;">
        <Login></Login>
      </div>
    </div>
  </div>
</template>

<script setup>
// @ is an alias to /src
import Landing from '@/components/landing.vue';
import About from '@/components/about.vue';
import FAQ from '@/components/faq.vue';
import Map from '@/components/map.vue';
import Footer from '@/components/footer.vue';
import Sponsors from '@/components/sponsors.vue';
import Gallery from '../components/gallery.vue';
import Guide from '../views/Guide.vue';
import Contact from '../views/Contact.vue';
import Login from '../views/Login.vue';

import { useHead } from '@unhead/vue';
import { ref } from 'vue';

defineProps(['faq', 'guide', 'sponsors', 'contact', 'login']);

const emit = defineEmits(['closeSponsors', 'closeFAQ', 'closeGuide', 'closeContact', 'closeLogin']);

useHead({
  title: "Kent Hack Enough",
  meta: [
    {
      name: "description",
      content: "Take 24 hours out of your schedule on April 20th-21st, 2024 to make something amazing."
    },
    {
      property: "og:image",
      content: "/khe-eclipse-centered.jpg"
    }
  ]
});

let isDragging = ref(false);
let offset = { x: 0, y: 0 }; // To store the offset when dragging
let activeWindowId = ref(null);

const startDrag = (windowId, event) => {
  isDragging.value = true;
  activeWindowId.value = windowId;

  const windowElement = document.getElementById(windowId);
  offset.x = event.clientX - windowElement.getBoundingClientRect().left;
  offset.y = event.clientY - windowElement.getBoundingClientRect().top;

  // Add mousemove and mouseup listeners
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
};

const drag = (event) => {
  if (!isDragging.value) return;
  
  const windowElement = document.getElementById(activeWindowId.value);
  windowElement.style.position = 'absolute';
  windowElement.style.left = `${event.clientX - offset.x}px`;
  windowElement.style.top = `${event.clientY - offset.y}px`;
};

const stopDrag = () => {
  isDragging.value = false;
  activeWindowId.value = null;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
};

</script>

<style scoped lang="scss">
@import '@/globalVars.scss';

.window {
  position: absolute;
  z-index: 9;
}

.title-bar {
  cursor: move;
  z-index: 10;
}

</style>