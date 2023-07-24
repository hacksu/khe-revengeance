<template>
    <div ref="cont" class="orbiter-container" :style="contSize">
        <div class="spinner">
            <picture>
                <source type="image/avif" srcset="/capsule.avif">
                <source type="image/webp" srcset="/capsule.webp">
                <img src="/capsule.png" class="orbiter">
            </picture>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "Orbiter",
    data() {
        return {
            contWidth: -1,
            contHeight: -1
        }
    },
    mounted() {
        const bbox = this.$refs.cont.getBoundingClientRect();
        this.contWidth = bbox.width;
        this.contHeight = bbox.height;
    },
    computed: {
        contSize() {
            return this.contWidth == -1 ?
                {} :
                { width: this.contWidth + "px", height: this.contWidth + "px" };
        }
    }
}
</script>

<style scoped lang="scss">
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.orbiter-container {
    position: relative;
}

.spinner {
    position: absolute;
    height: 100%;
    width: 120%;
    left: 0;
    top: 0;

    @media (prefers-reduced-motion: no-preference) {
        animation-name: spin;
        animation-duration: 30s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        z-index: -1;
    }
}

.orbiter {
    position: absolute;
    left: calc(100% + 20px);
    top: 50%;
    width: 70px;
    height: auto;

    @media (prefers-reduced-motion: no-preference) {
        animation-name: spin;
        animation-duration: 25s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-direction: reverse;
    }
}
</style>
