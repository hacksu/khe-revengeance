<template>
  <div class="home">
    <div id="sponsorWindow" class="window" style="width: 600px;">
      <div id="sponsorWindowHeader" class="title-bar" @mousedown="startDrag">
        <div class="title-bar-text">Sponsors</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div class="window-body" style="height: 600px; overflow-y: scroll;">
        <Sponsors></Sponsors>
      </div>
    </div>
  </div>
  <link rel="stylesheet" href="https://unpkg.com/xp.css">
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

import { useHead } from '@unhead/vue';
import { ref } from 'vue';

let showRegister = false;
let showGallery = false;
let showAbout = false;
let showFAQ = false;

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

const startDrag = (event) => {
  isDragging.value = true;
  offset.x = event.clientX - event.target.closest('.window').getBoundingClientRect().left;
  offset.y = event.clientY - event.target.closest('.window').getBoundingClientRect().top;

  // Add mousemove and mouseup listeners
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
};

const drag = (event) => {
  if (!isDragging.value) return;
  
  const sponsorWindow = document.getElementById('sponsorWindow');
  sponsorWindow.style.left = `${event.clientX - offset.x}px`;
  sponsorWindow.style.top = `${event.clientY - offset.y}px`;
};

const stopDrag = () => {
  isDragging.value = false;
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