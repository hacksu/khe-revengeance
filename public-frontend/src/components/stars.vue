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
            const fullWidth = width > 700;
            const starDensity = fullWidth ? 225 : 125;
            const baseRows = Math.round(height / starDensity);
            const baseCols = Math.round(width / starDensity);
            const jitter = 0.25;
            const getJitter = () => (Math.random() * jitter - (jitter / 2));
            // TODO: widen range for x and y coordinates in accordance with z being higher or lower
            // also: there are never any stars all the way on the right?? off by one error?
            // actually: i think it looks better when the stars are visibly
            // higher-density at the horizontal center and fall off towards the
            // edges, at least in full width mode
            for (let x = fullWidth ? 1 : 0; x < baseCols - (fullWidth ? 1 : 0); x++) {
                for (let y = 0; y < baseRows; y++) {
                    const left = (x + getJitter()) * (width / baseCols);
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
    
<style scoped lang="scss">
.star {
    width: 60px;
    height: 60px;

    @media only screen and (max-width: 700px) {
        width: 45px;
        height: 45px;
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
    