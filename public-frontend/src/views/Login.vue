<template>
    <div id="login" class="widget">
        <h2>Log in and/or create an account</h2>
        <a class="loginBar largeButton" href="/login/github">
            <img src="@/assets/auth_assets/github-mark-white.svg" />
            <span>Log in with GitHub</span>
        </a>
        <a class="loginBar largeButton" href="/login/discord">
            <img id="discord-mark" src="@/assets/auth_assets/discord-mark-white.svg" />
            <span>Log in with Discord</span>
        </a>
        <p class="smallNotice">(Registration is not open yet, so this is currently only useful to staff)</p>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { userLoadedPromise, user } from "../state/user.js";

const router = useRouter()
userLoadedPromise.then(() => {
    if (user.value) {
        router.push("/profile");
    }
})
// TODO:
// use "lastIDProvider" from localStorage (which is set after a successful login
// in profile.vue) to display a "you used this one last" message on the relevant
// button
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import '@/styles/space.scss';

#login {
    @include bg-primary;
    text-align: center;
    padding: 100px 1em;
    font-size: 20px;
    line-height: 30px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

h2 {
    margin-bottom: 35px;
}

.loginBar {
    display: block;
    width: 275px;

    img {
        height: 1.4em;
        width: auto;
        margin: -5px 15px;
    }

    img#discord-mark {
        height: 1.1em;
    }

    span {
        display: inline-block;
        width: 160px;
        text-align: justify;
    }
}

.smallNotice {
    font-size: small;
    margin-top: 20px;
}
</style>
