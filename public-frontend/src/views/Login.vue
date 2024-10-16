<template>
    <div id="options-container" style="padding: 0 10px;">
        <LocalLogin style="width: 75%; height: 100%;"/>
        <div id="alt-login-container">
            <a class="loginBar loginBox" href="/login/github">
                <img src="@/assets/auth_assets/github-mark-white.svg" />
                <span>Login with GitHub</span>
            </a>
            <a class="loginBar loginBox" href="/login/discord">
                <img id="discord-mark" src="@/assets/auth_assets/discord-mark-white.svg" />
                <span>Login with Discord</span>
            </a>
        </div>
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

#options-container {
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    height: 100%;
}

#alt-login-container {
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    height: 100%;
}

.loginBox {
    padding: 6px 10px;
    background: linear-gradient(to bottom, rgb(46, 75, 75), rgb(30, 50, 50));
    height: 100%;
    width: 100%;
}

.loginBox:active{
    background: linear-gradient(to bottom, rgb(30, 50, 50), rgb(46, 75, 75));
}

.loginBar {
    display: flex;
    gap: 10px;
    width: 100%;
    height: 50%;
    &:not(.noHover) {
        cursor: pointer;
    }
    // margin: 15px auto;
    text-align: center;
    font-size: 24pt;
    transition: background-color 0.2s;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
    text-decoration: none;

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
