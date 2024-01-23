<template>
    <div id="options-container" style="padding: 0 10px">
        <a class="loginBar loginBox" href="/login/github">
            <img src="@/assets/auth_assets/github-mark-white.svg" />
            <span>Login with GitHub</span>
        </a>
        <a class="loginBar loginBox" href="/login/discord">
            <img id="discord-mark" src="@/assets/auth_assets/discord-mark-white.svg" />
            <span>Login with <br v-if="narrow" />Discord</span>
        </a>
        <a class="loginBar loginBox noHover">
            <img id="khe-mark" src="/favicon.ico" />
            <span>Login with KHE account:</span>
        </a>
        <LocalLogin/>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { user, loadUser } from "../state/user.js";
import LocalLogin from "../components/localLogin.vue";

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
    margin: 150px auto;
    display: flex;
    flex-direction: column;
    align-items: center ;
    gap: 10px;
    max-width: 500px;

}

.loginBox {
    padding: 6px 10px;
    border-radius: 5px;
    border: 3px solid rgb(169, 169, 169);
    background-color: rgb(22, 36, 36);
}

.loginBar {
    display: flex;

    gap: 10px;
    width: 250px;
    height: 40px;
    &:not(.noHover) {
        cursor: pointer;
    }
    // margin: 15px auto;
    text-align: center;
    font-size: 0.9em;
    transition: background-color 0.2s;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;

    &:hover:not(.noHover) {
        background-color: rgb(46, 75, 75);
    }

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

</style>
