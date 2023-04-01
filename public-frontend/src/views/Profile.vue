<template>
    <div id="profile" class="widget">
        <div class="back"></div>
        <p>Hello! Registration is not open yet, so there is not much to do on this page. Congratulations on even finding it.
        </p>
        <p v-if="isStaff">You are authenticated as: {{ user.externalRole }}.
            Feel free to visit the <a :href="staffSite">staff site.</a>
        </p>
        <a v-if="user.id" href="/logout"><button>Log Out</button></a>
    </div>
</template>

<script setup>
// get user profile; save in state. if admin/staff, that should be displayed and a link to the staff site should appear.
import { User, UserRole } from "includes/users.ts";
import { ref, computed } from "vue";
let user = ref({});
User.getOwnUserInfo().then(u => {
    console.log(u);
    user.value = u;
})
const isStaff = computed(() => {
    // 
    return (
        user.value?.roles?.includes(UserRole.Staff) ||
        user.value?.roles?.includes(UserRole.Admin)
    );
});
const staffSite = location.protocol + "//staff." + location.host;
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
@import '@/styles/space.scss';

#profile {
    @include bg-primary;
    text-align: left;
    // padding: 2rem 6rem;
    padding: 100px 6rem 100px 6rem;
    font-size: 20px;
    line-height: 30px;
    // height: 100vh;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
</style>
