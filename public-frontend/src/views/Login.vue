<template>
    <div id="login" class="widget">
        <p>🥺</p>
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

.smallNotice {
    font-size: small;
    margin-top: 20px;
}
</style>
