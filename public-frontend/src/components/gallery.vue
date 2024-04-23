<template>
<div class="gallery-container" :style="{backgroundImage: `url(${imgBg})`}">
    <Galleria :value="images" :numVisible="8" containerStyle="max-height: 100vh; max-width: 100vw" :circular="true"
        :showItemNavigators="wide" :showThumbnailNavigators="!wide" :responsiveOptions="responsiveOptions"
        v-model:activeIndex="activeIndex" :nextButtonProps="{ disabled: false }" :prevButtonProps="{ disabled: false }">
        <template #item="slotProps">
            <img class="main-image" :src="galleryURLPath + slotProps.item.filename" />
        </template>
        <template #thumbnail="slotProps">
            <img :src="galleryURLPath + slotProps.item.filename + '?thumb=1'"
                style="max-height: 75px; max-width: 150px; margin: 0 10px"/>
        </template>
    </Galleria>
</div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { remult } from "remult";
import Galleria from 'primevue/galleria';
import { Gallery, galleryURLPath } from "../../../global-includes/image-gallery";
import { useWindowSize } from '@vueuse/core';
import { decode } from "blurhash";

const { width } = useWindowSize();

const wide = computed(() => {
    return width.value > 575;
});

const imgBg = ref("");

const activeIndex = ref(0);

const indexChanged = () => {
    const pixels = decode(images.value[activeIndex.value].hash, 64, 64);
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(64, 64);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
    imgBg.value = canvas.toDataURL();
};

watch(activeIndex, indexChanged);

const images = ref([]);
onMounted(() => {
    remult.repo(Gallery).findFirst({}).then(i => {
        images.value = i.images;
        indexChanged();
    }); 
});

const responsiveOptions = [
    {
        breakpoint: '1300px',
        numVisible: 4,
    },
    {
        breakpoint: '575px',
        numVisible: 2
    }
];
</script>

<style lang="scss">
/* these buttons were constantly disabled and faded out and i have no idea why */
.p-galleria-thumbnail-next, .p-galleria-thumbnail-prev {
    opacity: 1!important;
    pointer-events: all!important;
}
.p-galleria-content {
    position: relative;
}
.p-galleria-thumbnail-wrapper {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
}
@media (max-width: 700px) {
    .p-galleria-thumbnail-wrapper {
        transform: translate(-50%, 100%);
    }
}
.p-galleria-thumbnail-container {
    background: none;
}
</style>
<style scoped lang="scss">
.main-image {
    width: 100vw;
    max-height: 100vh;
    max-width: 100vw;
    object-fit: contain;
}
.gallery-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    /* doesn't work on firefox :/ */
    transition: background-image 1s ease-in-out;
}
</style>
