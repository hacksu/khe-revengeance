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
        getRandomCircles() {
            const circles = [];
            const width = window.innerWidth;
            const height = document.body.scrollHeight;
            const baseRows = Math.round(height / 200);
            const baseCols = Math.round(width / 200);
            const jitter = 0.5;
            const getJitter = () => (Math.random() * jitter - (jitter / 2));
            for (let x = 0; x < baseCols; x++) {
                for (let y = 0; y < baseRows; y++) {
                    const left = (x + getJitter() * 2) * (width / baseCols);
                    const top = (y + getJitter()) * (height / baseRows);
                    const z = Math.random();
                    circles.push(
                        {
                            style: {
                                left: left + "px",
                                top: top + "px",
                                opacity: Math.sin((1 - z) * (Math.PI / 2)),
                                transform: `translateZ(${(1 - z) * 150 - 150}px)`
                            },
                            z
                        }
                    );
                }
            }
            circles.sort((c1, c2) => c2.z - c1.z);
            return circles;
        },
    },
};
</script>
    
<style scoped>
.star {
    width: 50px;
    height: 50px;
    position: absolute;
    transform-origin: 50% 50%;
    perspective-origin: 50% 50%;
    background-image: url("/one-star.png");
    background-size: contain;
    background-repeat: no-repeat;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    will-change: transform;
}
</style>
    