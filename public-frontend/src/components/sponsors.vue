<template>
    <div
    style="display: flex; gap: 30px; flex-wrap: wrap; align-items: center; justify-content: center;"
    :style="{flexDirection: row ? 'row' : 'column'}" >
        <a href="https://www.kent.edu/cs" target="_blank" title="Kent State CS">
            <KSU class="item" style="padding: 10px" />
        </a>
        <a href="https://enbasis.com/" target="_blank" title="Enbasis">
            <Enbasis class="item" />
        </a>
        <a href="https://ybi.org" target="_blank" title="Youngstown Business Incubator">
            <img src="@/assets/ybi.png" class="item" style="object-fit: cover;" />
        </a>
        <a href="https://www.bawls.com/" target="_blank" title="BAWLS">
            <img src="@/assets/bawls.webp" class="item"  style="object-fit: cover;" />
        </a>
        <a href="https://www.wolframalpha.com/" target="_blank" title="Wolfram Alpha">
            <WolframAlpha class="item" />
        </a>
        <a href="https://www.kentdisplays.com/" target="_blank" title="Kent Displays">
            <img src="@/assets/kentdisplays.webp" class="item"  style="object-fit: cover;" />
        </a>
        <div v-if="showAd" class="item" id="extra-item">
            And You?
        </div>
        <div v-if="showAd" class="and-you">
            <p style="margin-top: 0">
                Kent Hack Enough depends on sponsors to help us keep this event
                going! To give back to the community, build respect for your brand,
                and connect with the next generation of engineers and hackers, you
                too can sponsor Kent Hack Enough!
            </p>
            <p style="margin-top: 0">
                <a href="/sponsor-packet.pdf">View our sponsor packet</a> and/or
                <router-link to="/contact">contact us.</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import WolframAlpha from "@/assets/wolfram-corporate-logo-horizontal.svg?component"
import Enbasis from "@/assets/enbasis.svg?component";
import KSU from "@/assets/ksu-logo.svg?component";

const props = defineProps({
    row: {
        type: Boolean,
        default: false,
        required: false
    },
    itemWidth: {
        type: Number,
        default: 500,
        required: false
    },
    itemHeight: {
        type: Number,
        default: 100,
        required: false
    },
    showAd: {
        type: Boolean,
        default: false,
        required: false
    }
});
</script>

<style scoped lang="scss">
.item {
    width: v-bind("itemWidth + 'px'");
    height: v-bind("itemHeight + 'px'");
    border-radius: 10px;
    background-color: white;

    @media (max-width: 600px) {
        width: 100%;
        height: auto;
        aspect-ratio: 5;
    }
}

a:has(.item) {
    @media (max-width: 600px) {
        width: 100%;
    }
}

#extra-item {
    background-color: rgba(27, 27, 27, 20);
    border: 1px solid white;
    font-size: 2rem;
    display: flex; align-items: center; justify-content: center;
    @media (max-width: 600px) {
        font-size: 1.3rem;
    }
}

.and-you {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
