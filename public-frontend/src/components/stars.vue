<template>
    <div v-for="c, i in circles" :key="i" class="star" :style="c.style" />
</template>
    
<script>
export default {
    name: 'Stars',
    data() {
        return {
            circles: []
        }
    },
    mounted() {
        this.circles = this.getRandomCircles();
    },
    methods: {
        // TODO: something to make extra rows if the page gets taller/hide them
        // if the page gets shorter. can't regenerate them every time while
        // using random points... use ResizeObserver or run a check on every
        // page transition, accordion open/close, etc, etc
        // note: actually, the presence of the stars keeps a page from shrinking
        // vertically even when it should, yikes
        getRandomCircles() {
            const circles = [];
            const width = window.innerWidth;
            const height = document.body.scrollHeight;
            const starAreaSideLength = width > 700 ? 250 : 175;
            const baseRows = Math.round(height / starAreaSideLength);
            const baseCols = Math.round(width / starAreaSideLength);
            const jitter = 1 / baseCols * 0.3;
            const maxDepth = 500;
            const getJitter = () => (Math.random()-0.5) * jitter * 2;
            const getNormalizedZ = () => 1 - Math.random() ** 1.2;
            for (let colIndex = 0; colIndex < baseCols; colIndex++) {
                for (let rowIndex = 4; rowIndex < baseRows; rowIndex++) {
                    const z = getNormalizedZ();
                    const depth = -(z * maxDepth);
                    
                    const normalizedX = colIndex * (1/baseCols) + (1/baseCols*0.5) + getJitter();
                    const depthAdjustedX = (normalizedX - 0.5) * (z*4+2) + 0.5;
                    const scaledX = depthAdjustedX * width;
                    
                    const normalizedY = rowIndex * (1/baseRows) + getJitter();
                    const depthAdjustedY = normalizedY;
                    const scaledY = depthAdjustedY * height;

                    circles.push(
                        {
                            style: {
                                left: scaledX + "px",
                                top: scaledY + "px",
                                filter: `brightness(${1-z})`,
                                transform: `translateZ(${depth}px)`
                            },
                            z: depth
                        }
                    );
                }
            }
            circles.sort((c1, c2) => c1.z - c2.z);
            return circles;
        },
    },
};
</script>
    
<style scoped lang="scss">
@import "@/globalVars.scss";
.star {
    .light & {
        opacity: 0;
    }
    @include use-theme-transition(opacity);
    
    // mix-blend-mode: lighten;

    width: 175px;
    height: 175px;

    @media only screen and (max-width: 700px) {
        width: 125px;
        height: 125px;
    }

    position: absolute;
    transform-origin: 50% 50%;
    perspective-origin: 50% 50%;
    background-image: url("/one-star.png");
    background-size: cover;
    background-repeat: no-repeat;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
}
</style>
    