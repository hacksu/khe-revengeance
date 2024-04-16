<template>
<div class="project-container" style="text-align: center">
    <div style="border: 1px solid white; border-radius: 10px; padding: 10px">

        <img :src="image" v-if="image" @click="imageModalOpen=true" class="headerImage" />

        <a :href="link">
            <h3 style="margin-bottom: 0; font-size: 110%">{{ title }}</h3>
        </a>

        <div class="project-content"><slot></slot></div>

        <Dialog appendTo="#app-container" v-model:visible="imageModalOpen"
                modal dismissableMask :blockScroll="false"
        >
            <img :src="image" class="modalImage"/>
        </Dialog>
    </div>
</div>
</template>

<script setup>
import Dialog from "primevue/dialog";
import { ref } from "vue";

defineProps({
    title: String,
    link: String,
    image: String,
    content: String
});

const imageModalOpen = ref(false);
</script>

<style scoped lang="scss">
    .project-container {
        box-sizing: border-box;
        background: black;
        width: 100%;
        padding: 15px;
    }
    .headerImage {
        max-height: 200px;
        max-width: 100%;
        cursor: pointer;
    }
    .modalImage {
        max-height: 80vh;
        max-width: 80vw;
        @media (max-width: 700px) {
            max-height: 95vh;
            max-width: 95vw;
        }
    }
    .project-content :deep(p) { 
        margin: 15px 0;
        line-height: 1.3;
    }
</style>
