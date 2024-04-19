<template>
<div class="project-container" style="text-align: center">
    <div style="border: 1px solid white; border-radius: 10px; padding: 10px">
        <img :src="image" v-if="image" class="headerImage" />
        <a :href="link">
            <h3 style="margin-bottom: 0; font-size: 110%">{{ title }}</h3>
        </a>
        <div class="project-content"><slot></slot></div>
    </div>
</div>
</template>

<script setup>
defineProps({
    title: String,
    link: String,
    image: String,
    content: String
});
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
