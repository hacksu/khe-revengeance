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
        this.circles = this.getRandomCircles(window.location.pathname == "/");
        this.$router.afterEach((to) => {
            document.body.scrollTop = 0;
            this.circles = [];
            this.$nextTick(() => {
                this.circles = this.getRandomCircles(to.path == "/");
            });
        });
    },
    methods: {
        getRandomCircles(startBelowFold) {
            const circles = [];
            const width = window.innerWidth;
            const height = document.body.scrollHeight;
            const fullWidth = width > 700;
            const starDensity = fullWidth ? 130 : 100;
            const baseRows = Math.round(height / starDensity);
            const baseCols = Math.round(width / starDensity);
            const jitter = 0.45;
            const getJitter = () => (Math.random() * jitter - (jitter / 2));
            const startingY = startBelowFold ? Math.ceil(window.innerHeight/starDensity) : 0;
            for (let x = fullWidth ? 1 : 0; x < baseCols - (fullWidth ? 1 : 0); x++) {
                for (let y = startingY; y < baseRows; y++) {
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
    width: 40px;
    height: 40px;

    @media only screen and (max-width: 700px) {
        width: 25px;
        height: 25px;
    }

    position: absolute;
    transform-origin: 50% 50%;
    perspective-origin: 50% 50%;
    background-image: url("/star.svg");
    background-size: cover;
    background-repeat: no-repeat;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
}
</style>
    