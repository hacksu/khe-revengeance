<template>
    <div class="stars" />
</template>
    
<script>
let reqID = 0;
export default {
    name: 'Stars',
    mounted() {
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
            applyStyles(circles[i].style, d);
            applyStyles(this.getStyle(circles[i]), d);
            els.push(d);
            this.$el.appendChild(d);
        }
        const draw = () => {
            for (let i = 0; i < circles.length; ++i) {
                applyStyles(this.getStyle(circles[i]), els[i]);
            }
            reqID = requestAnimationFrame(draw);
        };
        reqID = requestAnimationFrame(draw);
    },
    unmounted() {
        if (reqID) {
            cancelAnimationFrame(reqID);
        }
    },
    methods: {
        getStyle(c) {
            const scrollDampeningFactor = 3;
            let y = -window.scrollY / scrollDampeningFactor;
            let finalY = c.y + y;
            // this assumes that adding window.outerHeight over and over won't
            // just land a star in the view of the window, like if it would if
            // it went from -105 to window.outerHeight-105. why does this work
            // at all?? there are still jumps at least on mobile
            while (finalY < -100) {
                y += window.outerHeight;
                finalY += window.outerHeight;
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
            const baseRows = Math.round(window.outerHeight / 100);
            const baseCols = Math.round(window.innerWidth / 100);
            const jitter = 0.5;
            const getJitter = () => (Math.random() * jitter - (jitter / 2));
            for (let x = 0; x < baseCols; x++) {
                for (let y = 0; y < baseRows; y++) {
                    const left = (x + getJitter() * 2) * (window.innerWidth / baseCols);
                    const top = (y + getJitter()) * (window.outerHeight / baseRows);
                    const z = Math.random();
                    circles.push(
                        {
                            style: {
                                left: left + "px",
                                top: top + "px",
                                opacity: Math.sin((1 - z) * (Math.PI / 2))
                            },
                            y: top,
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
    