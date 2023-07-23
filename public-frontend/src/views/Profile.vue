<template>
    <div id="profile" class="widget">
        <div class="back"></div>
        <p>Hello! Registration is not open yet, so there is not much to do on this page. Congratulations on even finding it.
        </p>
        <p v-if="isStaff">You are authenticated as: {{ user?.externalRole }}.
            Feel free to visit the <a :href="staffSite">staff site.</a>
        </p>
        <div id="options" v-if="user?.email">
            <h4>Options</h4>
            <label>
                <input type="checkbox" v-model="receivingEmails" />
                Send KHE 2023 updates to {{ user?.email }}
            </label>
            <div class="largeButton" @click="updateOptions" style="width: 100px; margin-left: auto">
                {{ justSaved ? 'Saved' : 'Save' }}
            </div>
        </div>
        <a v-if="user?.id" class="largeButton" style="width: 200px" href="/logout">Log Out</a>
    </div>
</template>

<script setup>
// get user profile; save in state. if admin/staff, that should be displayed and a link to the staff site should appear.
import { User } from "includes/users.ts";
import { UserRole } from "includes/common.ts";
import { ref, computed, onMounted, watch } from "vue";
import { remult } from "remult";
import { user, onUserLoaded } from "../state/user.js";

const receivingEmails = ref(true);
onMounted(() => {
    onUserLoaded.then(() => {
        if (user.value) {
            receivingEmails.value = user.value.receivingEmails;
            localStorage.setItem("lastIDProvider", user.value.method);
            // TODO: globally store login status/account to be used on other pages
        }
    });
});
const justSaved = ref(false);
const updateOptions = async () => {
    if (receivingEmails.value != user.value.receivingEmails) {
        user.value.receivingEmails = receivingEmails.value;
        await remult.repo(User).save(user.value);
    }
    justSaved.value = true;
};
watch(receivingEmails, () => (justSaved.value = false));
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

#options {
    h4 {
        margin: 5px 0;
    }

    input[type="checkbox"] {
        width: 20px;
        height: 20px;
    }

    border-radius: 5px;
    padding: 10px 15px;
    border: 1px solid white;
}
</style>
