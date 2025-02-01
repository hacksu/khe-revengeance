<template>
  <link rel="stylesheet" href="https://unpkg.com/xp.css">
  <div class="home">
    <div class="shortcuts-container">
      <div class="shortcut" @click="openRegistration()">
        <img src="/favicon.ico" alt="" />
        <p>Registration</p>
      </div>
      <div class="shortcut">
        <a href="https://kent-hack-enough-2025.devpost.com/" style="text-decoration: none" target="_blank">
          <img src="../assets/devpost.jpg" alt="">
          <p>KHE 2025 Devpost</p>
        </a>
      </div>
      <div class="shortcut">
        <a href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md" style="text-decoration: none" target="_blank">
          <img src="../assets/mlh-logo-color.png" alt="" />
          <p>MLH Code of Conduct</p>
        </a>
      </div>
    </div>
    <div :hidden="!sponsors" id="sponsorWindow" class="window xp">
      <div id="sponsorWindowHeader" class="title-bar xp" @mousedown="startDrag('sponsorWindow', $event)">
        <div class="title-bar-text xp">Sponsors</div>
        <div class="title-bar-controls xp">
          <button aria-label="Minimize" @click="$emit('closeSponsors')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeSponsors')"></button>
        </div>
      </div>
      <div class="window-body xp" style="overflow-y: scroll;">
        <Sponsors></Sponsors>
      </div>
    </div>
    <div :hidden="!faq" id="faqWindow" class="window xp">
      <div id="faqWindowsHeader" class="title-bar xp" @mousedown="startDrag('faqWindow', $event)">
        <div class="title-bar-text xp">FAQ</div>
        <div class="title-bar-controls xp">
          <button aria-label="Minimize" @click="$emit('closeFAQ')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeFAQ')"></button>
        </div>
      </div>
      <div class="window-body xp" style="height: 600px; overflow-y: scroll;">
        <FAQ/>
      </div>
    </div>
    <div :hidden="!guide" id="guideWindow" class="window xp">
      <div id="guideWindowHeader" class="title-bar xp" @mousedown="startDrag('guideWindow', $event)">
        <div class="title-bar-text xp">Hackathon Guide</div>
        <div class="title-bar-controls xp">
          <button aria-label="Minimize" @click="$emit('closeGuide')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeGuide')"></button>
        </div>
      </div>
      <div class="window-body xp" style="height: 800px; overflow-y: scroll;">
        <Guide/>
      </div>
    </div>
    <div :hidden="!contact" id="contactWindow" class="window xp">
      <div id="contactWindowHeader" class="title-bar xp" @mousedown="startDrag('contactWindow', $event)">
        <div class="title-bar-text xp">Contact</div>
        <div class="title-bar-controls xp">
          <button aria-label="Minimize" @click="$emit('closeContact')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeContact')"></button>
        </div>
      </div>
      <div class="window-body xp" style="height: 560px; overflow-y: scroll;">
        <Contact/>
      </div>
    </div>
    <div :hidden="!login" id="loginWindow" class="window xp">
      <div id="loginWindowHeader" class="title-bar xp" @mousedown="startDrag('loginWindow', $event)">
        <div class="title-bar-text xp">Login</div>
        <div class="title-bar-controls xp">
          <button aria-label="Minimize" @click="$emit('toggleLogin')"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('toggleLogin')"></button>
        </div>
      </div>
      <div class="window-body xp" style="overflow-y: auto">
        <Login></Login>
      </div>
    </div>
    <div :hidden="!profile" id="profileWindow" class="window xp">
      <div id="profileWindowHeader" class="title-bar xp" @mousedown="startDrag('profileWindow', $event)">
        <div class="title-bar-text xp">Profile</div>
        <div class="title-bar-controls xp">
          <button aria-label="Minimize" @click="$emit('closeProfile')" ></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" @click="$emit('closeProfile')"></button>
        </div>
      </div>
      <div class="window-body xp" style="height: 600px; overflow-y: scroll;">
        <Profile></Profile>
      </div>
    </div>
    <div>
      <a id="mlh-trust-badge" style="display:block;max-width:100px;min-width:60px;position:fixed;right:50px;top:0;width:10%;z-index:-1" href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2025-season&utm_content=yellow" target="_blank">
        <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2025/mlh-trust-badge-2025-yellow.svg" alt="Major League Hacking 2025 Hackathon Season" style="width:100%;">
      </a>
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
import Profile from '../views/Profile.vue'

import { user } from '../state/user.js';
import { useHead } from '@unhead/vue';
import { ref } from 'vue';

defineProps(['faq', 'guide', 'sponsors', 'contact', 'login', 'profile']);

const emit = defineEmits(['closeSponsors', 'closeFAQ', 'closeGuide', 'closeContact', 'toggleLogin', 'closeProfile']);

useHead({
  title: "Kent Hack Enough",
  meta: [
    {
      name: "description",
      content: "Take 24 hours out of your schedule on Feburary 15th-16th, 2025 to make something amazing."
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

const openRegistration = () => {
  if (!user || (typeof user.value == "undefined")) {
    emit('toggleLogin');
  } else {
    emit('closeProfile');
  }
}

</script>

<style scoped lang="scss">
@import '@/globalVars.scss';

.window {
  position: absolute;
  z-index: 9;
  // default width for windows:
  width: 600px;
  // limit window width to the actual screen width for smaller devices
  max-width: 100vw;
}

.title-bar {
  cursor: move;
  z-index: 10;
}

.shortcuts-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
}

.shortcut {
  background: #0000;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.shortcut img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.shortcut p {
  margin: 0;
  font-size: 14px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 3px #000;
}
</style>
