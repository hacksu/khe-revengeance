<template>
    <div id="profile" class="widget">
        <div class="back"></div>
        <p>Hello! Registration is not open yet, so there is not much to do on this page. Congratulations on even finding it.
        </p>
        <p v-if="isStaff">You are authenticated as: {{ user.externalRole }}.
            Feel free to visit the <a :href="staffSite">staff site.</a>
        </p>
        <a v-if="user.id" class="largeButton" style="width: 200px" href="/logout">Log Out</a>
    </div>
</template>

<script setup>
// get user profile; save in state. if admin/staff, that should be displayed and a link to the staff site should appear.
import { User, UserRole } from "includes/users.ts";
import { ref, computed, onMounted } from "vue";
let user = ref({});
onMounted(() => {
    User.getOwnUserInfo().then(u => {
        if (u) {
            user.value = u;
            localStorage.setItem("lastIDProvider", u.method);
            // TODO: globally store login status/account to be used on other pages
        }
    })
})
const isStaff = computed(() => {
    return (
        user.value?.roles?.includes(UserRole.Staff) ||
        user.value?.roles?.includes(UserRole.Admin)
    );
});
let staffSite;
if (typeof window !== "undefined") {
    staffSite = window.location.protocol + "//staff." + window.location.host;
}
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import '@/styles/space.scss';

#profile {
    @include bg-primary;
    text-align: left;
    padding: 100px 1em;
    font-size: 20px;
    line-height: 30px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
</style>
