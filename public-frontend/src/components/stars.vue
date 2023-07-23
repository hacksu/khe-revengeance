<template>
    <div class="stars" />
</template>
    
<script>
export default {
    name: 'Stars',
    data() {
        return {
            scrollFactor: 0,
        };
    },
    mounted() {
        window.addEventListener('scroll', this.updateScroll);
        this.updateScroll();
        const applyStyles = (styles, el) => {
            for (const prop in styles) {
                el.style[prop] = styles[prop];
            }
        };
        const circles = this.getRandomCircles();
        const els = [];
        for (let i = 0; i < circles.length; ++i) {
            const d = document.createElement("div");
            d.classList.add("star");
            applyStyles(circles[i], d);
            applyStyles(this.getStyle(circles[i]), d);
            els.push(d);
            this.$el.appendChild(d);
        }
        const draw = () => {
            for (let i = 0; i < circles.length; ++i) {
                applyStyles(this.getStyle(circles[i]), els[i]);
            }
            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    },
    unmounted() {
        window.removeEventListener('scroll', this.updateScroll);
    },
    methods: {
        updateScroll() {
            this.scrollFactor = window.scrollY / 3;
        },
        getStyle(c) {
            let y = -this.scrollFactor;
            let finalY = c._y - this.scrollFactor;
            while (finalY < -100) {
                y += window.innerHeight;
                finalY += window.innerHeight;
            }
            return {
                transform: `translate3d(\
                        0,\
                        ${y}px,\
                        ${(1 - c.distanceAway) * 150}px\
                    )`,
            };
        },
        getRandomCircles() {
            const circles = [];
            // adjust rows and cols to aspect ratio of window?
            const baseRows = Math.round(window.innerHeight / 100);
            const baseCols = Math.round(window.innerWidth / 100);
            const jitter = 0.5;
            const getJitter = () => (Math.random() * jitter - (jitter / 2));
            for (let x = 0; x < baseCols; x++) {
                for (let y = 0; y < baseRows; y++) {
                    const left = (x + getJitter() * 2) * (window.innerWidth / baseCols);
                    const top = (y + getJitter()) * (window.innerHeight / baseRows);
                    const z = Math.random();
                    circles.push(
                        {
                            left: left + "px",
                            top: top + "px",
                            _y: top,
                            opacity: Math.sin((1 - z) * (Math.PI / 2)),
                            distanceAway: z,
                        }
                    );
                }
            }
            circles.sort((c1, c2) => c2.distanceAway - c1.distanceAway);
            return circles;
        },
    },
};
</script>
    
<style>
.stars {
    perspective: 200px;
    transform-origin: 50% 50%;
    perspective-origin: 50% 50%;
    background-color: black;
    position: fixed;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
}

.star {
    width: 25px;
    height: 25px;
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
    