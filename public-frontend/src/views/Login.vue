<template>
    <div id = "options-container" style="padding: 0 10px">
        <a class="loginBar loginButton" href="/login/github">
            <img src="@/assets/auth_assets/github-mark-white.svg" />
            <span>Register with<br />GitHub</span>
        </a>
        <a class="loginBar loginButton" href="/login/discord">
            <img id="discord-mark" src="@/assets/auth_assets/discord-mark-white.svg" />
            <span>Register with<br />Discord</span>
        </a>
        <p class="loginBar loginButton" @click="hide(); showLocalAccountModal = true">
            <img id="khe-mark" src="/favicon.ico" />
            <span>Register with<br />local account</span>
        </p>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from 'vue-router';
import { user, loadUser } from "../state/user.js";
import LoginButton from "../components/login-button.vue";

const router = useRouter();
onMounted(() => {
    loadUser().then(() => {
        if (user.value) {
            router.push("/profile");
        }
    });
});
// TODO:
// use "lastIDProvider" from localStorage (which is set after a successful login
// in profile.vue) to display a "you used this one last" message on the relevant
// button
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import '@/styles/space.scss';

#options-container {
    margin-top: 200px;
}

.loginBar {
    display: flex;
    gap: 10px;
    max-width: 600px;

    justify-content: center;
    align-items: center;

    img {
        height: 1.4em;
        width: auto;
    }

    img#discord-mark {
        height: 1.1em;
        margin-left: 5px;
    }

    span {
        display: inline-block;
    }
}

.loginButton {
    cursor: pointer;
    margin: 15px auto;
    text-align: center;
    font-size: 0.9em;
    padding: 6px 10px;
    border-radius: 5px;
    border: 3px solid rgb(169, 169, 169);
    background-color: rgb(22, 36, 36);
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;

    &:hover {
        background-color: rgb(46, 75, 75);
    }
}

</style>
