<template>
    <Dropdown :distance="6" :placement="onMobile ? 'bottom-start' : 'bottom-end'">
        <p class="banner-link">
            Login
        </p>
        <LocalLogin v-if="localClicked" @close="localClicked = false"/>
        <template #popper="{ hide }">
            <div style="padding: 0 10px">
                <a class="loginBar loginButton" href="/login/github">
                    <img src="@/assets/auth_assets/github-mark-white.svg" />
                    <span>Log in with<br />GitHub</span>
                </a>
                <a class="loginBar loginButton" href="/login/discord">
                    <img id="discord-mark" src="@/assets/auth_assets/discord-mark-white.svg" />
                    <span>Log in with<br />Discord</span>
                </a>
                <a class="loginBar loginButton" @click="localClicked = true">
                    <img id="khe-mark" src="/favicon.ico" />
                    <span>Log in with<br />local account</span>
                </a>
            </div>
        </template>
    </Dropdown>
</template>

<script setup>
import { Dropdown } from "floating-vue";
import { ref } from 'vue';
import LocalLogin from './localLogin.vue'

const localClicked = ref(false);

</script>

<style scoped lang="scss">
.loginBar {
    display: flex;
    gap: 10px;

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

<!-- <style lang="scss">
.loginModal {
    width: 500px;
    max-width: 97vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}
</style> -->
