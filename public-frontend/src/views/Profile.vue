<template>
    <div id="profile" class="widget">
        <template v-if="user">
            <Card>
                <template #title> Registration for KHE 2023 </template>
                <template #content>
                    <div class="labeled-field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model="user.registration.name" />
                    </div>
                    <div class="labeled-field">
                        <label for="school">School</label>
                        <InputText id="school" v-model="user.registration.school" />
                    </div>
                    <div class="labeled-field">
                        <label for="phone">Phone Number</label>
                        <InputText id="phone" v-model="user.registration.phone" />
                    </div>
                    <div class="labeled-field">
                        <label for="age">Age</label>
                        <InputNumber id="age" v-model="user.registration.age" />
                    </div>
                    <div class="labeled-field">
                        <label for="gender">Gender</label>
                        <Dropdown id="gender" v-model="user.registration.gender" :options="genders" />
                    </div>
                    <div class="horizontal-labeled-field" style="margin-top: 10px;"
                        v-if="user.registration.gender == 'Other'">
                        <svg height="50" width="auto" viewBox="10 0 100 100">
                            <line x1="50" y1="0" x2="50" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                            <line x1="50" y1="50" x2="100" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        <InputText style="width:100%" id="optionalExtraGender" placeholder="Optional: Enter gender info..."
                            v-model="user.registration.optionalExtraGender" />
                    </div>
                    <div class="labeled-field">
                        <label for="schoolStatus">Education Status</label>
                        <Dropdown id="schoolStatus" v-model="user.registration.schoolStatus" :options="schoolStatus" />
                    </div>
                    <div class="labeled-field">
                        <label for="link">Link to your website or profile</label>
                        <InputText id="link" v-model="user.registration.link" />
                    </div>
                    <div class="horizontal-labeled-field">
                        Is this your first hackathon?
                        <div class="horizontal-labeled-field">
                            <RadioButton v-model="user.registration.firstHackathon" inputId="isFirst" :value="true" />
                            <label for="isFirst" class="ml-2">Yes</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <RadioButton v-model="user.registration.firstHackathon" inputId="isNotFirst" :value="false" />
                            <label for="isNotFirst" class="ml-2">No</label>
                        </div>
                    </div>

                </template>
                <template #footer>
                    <Button icon="pi pi-check" label="Save" iconPos="right" @click="saveUser" />
                    <Button @click="submitForm" icon="pi pi-envelope" label="Submit" iconPos="right"
                        :style="'margin-left: 0.5em;' + (formComplete ? `color: #333; background-color: white;` : '')" />
                </template>
            </Card>

            <div class="horizontal-labeled-field">
                <label for="receiveMail">Receive Emails from KHE</label>
                <Checkbox id="receiveMail" v-model="user.receivingEmails" :binary="true" />
            </div>


            <a v-if="user?.id" class="largeButton" style="width: 200px" href="/logout">Log Out</a>
            <p v-if="isStaff">You are authenticated as: {{ user?.externalRole }}.
                Feel free to visit the <a :href="staffSite">staff site.</a>
            </p>
        </template>
        <p v-else>Please log in</p>
    </div>
</template>

<script setup>
import { User, schoolStatus, FullRegistration, genders } from "includes/users.ts";
import { UserRole } from "includes/common.ts";
import { ref, computed, onMounted } from "vue";
import { remult } from "remult";
import { user, loadUser } from "../state/user.js";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Card from "primevue/card";
import Button from "primevue/button";
import Checkbox from 'primevue/checkbox';
import InputNumber from "primevue/inputnumber";
import RadioButton from "primevue/radiobutton";

const receivingEmails = ref(true);
onMounted(() => {
    loadUser().then(() => {
        if (user.value) {
            receivingEmails.value = user.value.receivingEmails;
            localStorage.setItem("lastIDProvider", user.value.method);
        }
    });
});
const saveUser = async () => {
    await remult.repo(User).save(user.value);
};
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
const formComplete = computed(() => FullRegistration.safeParse(user.registration));
const submitForm = async () => {
    await saveUser();
    try {
        await User.submitRegistration();
    } catch (e) {
        console.log(e.message);
        console.log(JSON.parse(e.message));
    }
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
    width: 600px;
    max-width: 97vw;
    margin-left: auto;
    margin-right: auto;
}

.labeled-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 10px 0;
}

.horizontal-labeled-field {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin: 10px 0;
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

:deep(.p-card-footer) {
    text-align: right;
}
</style>
