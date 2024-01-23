<template>
    <div id="profile" class="widget">
        <template v-if="user">
            <Card>
                <template #title> Registration for KHE 2024 </template>
                <template #content>
                    <label v-if="submissionStatus == 'failed'" style="color: red">Please fill out marked items</label>
                    <div class="labeled-field">
                        <span>The email currently associated with your account is: {{ user.email }}</span>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" @change="alternateEmail = !alternateEmail"/>
                            <label for="email">I would like to change my contact email!</label>
                        </div>
                        <div class="horizontal-labeled-field" style="margin-top: 10px;"
                            v-if="alternateEmail">
                            <svg height="50" width="100%" viewBox="10 0 100 100">
                                <line x1="50" y1="0" x2="50" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                                <line x1="50" y1="50" x2="100" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                            </svg>
                            <InputText style="width:100%" id="optionalAlternateEmail" placeholder="email"
                                v-model="alternateEmailValue" />
                        </div>
                    </div>
                    <div class="labeled-field">
                        <label for="name">Name <failureLabel v-if="submissionStatus == 'failed' && user.registration.name == ''"/></label>
                        <InputText id="name" v-model="user.registration.name" />
                    </div>
                    <div class="labeled-field">
                        <label for="school">School <failureLabel v-if="submissionStatus == 'failed' && user.registration.school == ''"/></label>
                        <InputText id="school" v-model="user.registration.school" />
                    </div>
                    <div class="labeled-field">
                        <label for="country">Country of Residence <failureLabel v-if="submissionStatus == 'failed' && user.registration.country == ''"/></label>
                        <InputText id="country" v-model="user.registration.country" />
                    </div>
                    <div class="labeled-field">
                        <label for="state">State/Province of Residence <failureLabel v-if="submissionStatus == 'failed' && user.registration.state == ''"/></label>
                        <InputText id="state" v-model="user.registration.state" />
                    </div>
                    <div class="labeled-field">
                        <label for="major">Major (if in high school enter "NA") <failureLabel v-if="submissionStatus == 'failed' && user.registration.major == ''"/></label>
                        <InputText id="major" v-model="user.registration.major" />
                    </div>
                    <div class="labeled-field">
                        <label for="phone">Phone Number <failureLabel v-if="submissionStatus == 'failed' && user.registration.phone == ''"/></label>
                        <InputText id="phone" v-model="user.registration.phone" />
                    </div>
                    <div class="labeled-field">
                        <label for="age">Age <failureLabel v-if="submissionStatus == 'failed' && user.registration.age == undefined"/>
                            <span v-else-if="submissionStatus == 'failed' && user.registration.age < 13 || user.registration.age > 130">You are either too old or too young!</span>
                        </label>
                        <InputNumber id="age" v-model="user.registration.age" />
                    </div>
                    <div class="labeled-field">
                        <label for="gender">Gender <failureLabel v-if="submissionStatus == 'failed' && user.registration.gender == undefined"/></label>
                        <Dropdown id="gender" v-model="user.registration.gender" :options="genders" append-to="self" />
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
                        <label for="pronouns">Pronouns <failureLabel v-if="submissionStatus == 'failed' && user.registration.pronouns == undefined"/></label>
                        <Dropdown is="pronouns" v-model="user.registration.pronouns" :options="userPronouns" append-to="self" />
                    </div>
                    <div class="horizontal-labeled-field" style="margin-top: 10px;"
                        v-if="user.registration.pronouns == 'Other'">
                        <svg height="50" width="auto" viewBox="10 0 100 100">
                            <line x1="50" y1="0" x2="50" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                            <line x1="50" y1="50" x2="100" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        <InputText style="width:100%" id="optionalExtraPronouns" placeholder="Optional: Enter pronouns here..."
                            v-model="user.registration.optionalExtraPronouns" />
                    </div>
                    <div class="labeled-field">
                        <label for="ethnicity">Ethnicity <failureLabel v-if="submissionStatus == 'failed' && user.registration.ethnicity == undefined"/></label>
                        <Dropdown is="ethnicity" v-model="user.registration.ethnicity" :options="ethnicities" append-to="self" />
                    </div>
                    <div class="horizontal-labeled-field" style="margin-top: 10px;"
                        v-if="user.registration.ethnicity == 'Other'">
                        <svg height="50" width="auto" viewBox="10 0 100 100">
                            <line x1="50" y1="0" x2="50" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                            <line x1="50" y1="50" x2="100" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        <InputText style="width:100%" id="optionalExtraEthnicity" placeholder="Optional: Enter ethnicity here..."
                            v-model="user.registration.optionalExtraEthnicity" />
                    </div>
                    <div class="labeled-field">
                        <label for="sexuality">Do you identify as any of the following? <failureLabel v-if="submissionStatus == 'failed' && user.registration.sexuality == undefined "/></label>
                        <Dropdown append-to="self" is="sexuality" v-model="user.registration.sexuality" :options="sexualities"></Dropdown>
                    </div>
                    <div class="horizontal-labeled-field" style="margin-top: 10px;"
                        v-if="user.registration.sexuality == 'Other'">
                        <svg height="50" width="100%" viewBox="10 0 100 100">
                            <line x1="50" y1="0" x2="50" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                            <line x1="50" y1="50" x2="100" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        <InputText style="width:100%" id="optionalExtraSexuality" placeholder="Optional: Enter info here..."
                            v-model="user.registration.optionalExtraSexuality" />
                    </div>
                    <div class="labeled-field">
                        <label>Do you have any of the following dietary restriction? </label>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="vegetarian" value="Vegetarian" v-model="user.registration.dietaryRestrictions" />
                            <label for="vegetarian">Vegetarian</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="vegan" value="Vegan" v-model="user.registration.dietaryRestrictions"/>
                            <label for="vegan">Vegan</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="halal" value="Halal" v-model="user.registration.dietaryRestrictions"/>
                            <label for="halal">Halal</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="celiac" value="Celiac Disease" v-model="user.registration.dietaryRestrictions"/>
                            <label for="celiac">Celiac Disease</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="peanut" value="Peanut Allergy" v-model="user.registration.dietaryRestrictions"/>
                            <label for="peanut">Peanut Allergy</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="nut" value="Other Nut Allergy" v-model="user.registration.dietaryRestrictions"/>
                            <label for="nut">Other Nut Allergy</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="wheat" value="Wheat" v-model="user.registration.dietaryRestrictions"/>
                            <label for="wheat">Wheat</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="soy" value="Soy" v-model="user.registration.dietaryRestrictions"/>
                            <label for="soy">Soy</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="lactose" value="Lactose Intolerant" v-model="user.registration.dietaryRestrictions"/>
                            <label for="lactose">Lactose Intolerant</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <input type="checkbox" id="other" value="Other" v-model="user.registration.dietaryRestrictions" @change="otherRestriction = !otherRestriction"/>
                            <label for="other">Other</label>
                        </div>
                    </div>
                    <div class="horizontal-labeled-field" style="margin-top: 10px;"
                        v-if="otherRestriction">
                        <svg height="50" width="100%" viewBox="10 0 100 100">
                            <line x1="50" y1="0" x2="50" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                            <line x1="50" y1="50" x2="100" y2="50" stroke="gray" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        <InputText style="width:100%" id="optionalExtraRestriction" placeholder="Optional: Enter info here..."
                            v-model="user.registration.optionalExtraRestriction" />
                    </div>
                    <div class="labeled-field">
                        <label for="size">T-Shirt Size <failureLabel v-if="submissionStatus == 'failed' && user.registration.shirtSize == undefined"/></label>
                        <Dropdown append-to="self" id="size" v-model="user.registration.shirtSize" :options="shirtSize" />
                    </div>
                    <div class="labeled-field">
                        <label for="schoolStatus">Education Status <failureLabel v-if="submissionStatus == 'failed' && user.registration.schoolStatus == undefined"/></label>
                        <Dropdown append-to="self" id="schoolStatus" v-model="user.registration.schoolStatus" :options="schoolStatus" />
                    </div>
                    <div class="labeled-field">
                        <label for="resume">Upload your resume (optional):</label>
                        <FileUpload mode="basic" name="resume" url="/api/upload" accept="application/pdf" :show-upload-button="false" @select="filesChosen" />
                    </div>
                    <div class="labeled-field">
                        <label for="link">Link to your website or profile (optional):</label>
                        <InputText id="link" v-model="user.registration.link" />
                    </div>
                    <failureLabel v-if="submissionStatus == 'failed' && user.registration.firstHackathon == undefined"/>
                    <div class="horizontal-labeled-field" style="margin-bottom: 10px">
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
                    <failureLabel v-if="submissionStatus == 'failed' && user.registration.attendedKhe == null"/>
                    <div class="horizontal-labeled-field" style="margin-bottom: 10px">
                        Is this your first time attending Kent Hack Enough?
                        <div class="horizontal-labeled-field">
                            <RadioButton v-model="user.registration.attendedKhe" inputId="isFirstKhe" :value="true" />
                            <label for="isFirstKhe" class="ml-2">Yes</label>
                        </div>
                        <div class="horizontal-labeled-field">
                            <RadioButton v-model="user.registration.attendedKhe" inputId="isNotFirstKhe" :value="false" />
                            <label for="isNotFirstKhe" class="ml-2">No</label>
                        </div>
                    </div>
                    
                    <failureLabel v-if="submissionStatus == 'failed' && user.registration.mlhConduct == false"/>
                    <div class="horizontal-labeled-field" style="margin-bottom: 10px">
                        <Checkbox id="mlhConduct" v-model="user.registration.mlhConduct" :binary="true" />
                        <label for="mlhConduct">
                            I have read and agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>.
                        </label>
                    </div>
                    <failureLabel v-if="submissionStatus == 'failed' && user.registration.mlhShare == false"/>
                    <div class="horizontal-labeled-field">
                        <Checkbox id="mlhShare" v-model="user.registration.mlhShare" :binary="true" />
                        <label for="mlhShare">
                            I authorize you to share my application/registration information with Major League Hacking for event administration, 
                            ranking, and MLH administration in-line with the <a href="https://mlh.io/privacy">MLH Privacy Policy</a>. I further agree to the 
                            terms of both the <a href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md">>MLH Contest Terms and Conditions</a> and 
                            the <a href="https://mlh.io/privacy">MLH Privacy Policy</a>.
                        </label>
                    </div>
                </template>
                <template #footer>
                    <Button icon="pi pi-check" label="Save Draft" iconPos="right" @click="saveUser" />
                    <Button v-if="submissionStatus != 'success'" @click="submitForm" icon="pi pi-envelope" label="Submit" iconPos="right"
                        :style="'margin-left: 0.5em;' + (formComplete ? `color: #333; background-color: white;` : '')" />
                    <span style="margin-left: 0.5em;" id="submitted" v-if="submissionStatus == 'success'">Application Submitted!</span>
                </template>
            </Card>

            <p v-if="submissionStatus == 'success'">
                Thanks for submitting your application to Kent Hack Enough! You
                will receive an email when your application is accepted or
                rejected.

                You are free to make changes to your application and save them,
                but please note that this will put your application back at the
                end of the line.
            </p>

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
import { User, schoolStatus, FullRegistration, genders, userPronouns, ethnicities, shirtSize, sexualities} from "includes/users.ts";
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
import FileUpload from "primevue/fileupload";
import failureLabel from "@/components/failureLabel.vue";


const otherSexuality = ref(false);
const otherRestriction = ref(false);
const alternateEmail = ref(false);
const alternateEmailValue = ref("");

const submissionStatus = ref('pending');

const receivingEmails = ref(true);
onMounted(() => {
    loadUser().then(() => {
        if (user.value) {
            if (user.value.submittedApplication == true) {submissionStatus.value = 'success'}
            receivingEmails.value = user.value.receivingEmails;
            localStorage.setItem("lastIDProvider", user.value.method);
        }
    });
});
let resumeFiles = null;
const filesChosen = (event) => {
    console.log("upload event:", event);
    resumeFiles = event.files;
};
const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
            // The result property contains the base64 string
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        }
        reader.readAsDataURL(file);
    });
}
const saveUser = async () => {
    if (alternateEmail.value) {user.value.registration.email = alternateEmailValue.value}
    if (resumeFiles){
        const file = resumeFiles[0];
        await User.uploadResume(await fileToBase64(file), file.name || "untitled.pdf");
    }
    await remult.repo(User).save(user.value).catch(err => {
        const specific = JSON.parse(err.modelState.registration);
        console.error(specific);
    });
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
       submissionStatus.value = 'success';
    } catch (e) {
        console.log(e.message);
        console.log(JSON.parse(e.message));
        submissionStatus.value = 'failed';
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
    // margin: 2px 0;
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

:deep(.p-card .p-card-body) {
    border: 1px solid white;
    border-radius: 5px;
}
</style>
