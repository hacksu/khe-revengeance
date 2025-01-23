<template>
    <div class="profileContainer">
        <div v-if="user">
            <p style="color:red" v-if="registrationClosed">
                KHE registration is currently closed! Your profile is preserved below or archival purposes, 
                but cannot be changed.
            </p>
            <label v-if="submissionStatus == 'failed'" style="color: red">Place fill out marked items</label><br>
            <span>The email currently associated with your account is: {{ user.email }}</span><br><br>
            <div class="field-row">
                <input type="checkbox" id="alternateEmailCheckbox" @change="alternateEmail = !alternateEmail"/>
                <label for="alternateEmailCheckbox">I would like to change my contact email!</label>
            </div>
            <div class="field-row" v-if="alternateEmail">
                <label for="alternateEmail">Email:</label>
                <input id="alternateEmail" type="text" v-model="alternateEmailValue"/>
            </div>
            <div class="field-row-stacked">
                <label for="firstName">First Name <failureLabel v-if="submissionStatus == 'failed' && user.registration.firstName == ''"/></label>
                <input type="text" id="firstName" v-model="user.registration.firstName">
            </div>
            <div class="field-row-stacked">
                <label for="lastname">Last Name <failureLabel v-if="submissionStatus == 'failed' && user.registration.lastName == ''"/></label>
                <input type="text" id="lastName" v-model="user.registration.lastName">
            </div>
            <div class="field-row-stacked">
                <label for="phone">Phone Number <failureLabel v-if="submissionStatus == 'failed' && user.registration.phone == ''"/></label>
                <input type="text" id="phone" v-model="user.registration.phone">
            </div>
            <div class="field-row-stacked">
                <label for="age">Age <failureLabel v-if="submissionStatus == 'failed' && ((user.registration.age == undefined)||(user.registration.age == ''))"/></label>
                <input class="number" type="number" id="age" v-model="user.registration.age">
            </div>
            <div class="field-row-stacked">
                <label for="school">School <failureLabel v-if="submissionStatus == 'failed' && ((user.registration.school == undefined)||(user.registration.school == ''))" /></label>
                <select id="school" v-model="user.registration.school">
                    <option v-for="(school, index) in schools" :key="index">{{school}}</option>
                </select>
            </div>
            <div class="field-row-stacked">
                <label for="classStanding">Class Standing / Level of Current Study <failureLabel v-if="submissionStatus == 'failed' && user.registration.schoolStatus == undefined"/></label>
                <select id="classStanding" v-model="user.registration.schoolStatus">
                    <option v-for="(status, index) in schoolStatus" :key="index">{{status}}</option>
                </select>
            </div>
            <div class="field-row-stacked">
                <label for="country">Country of Residence <failureLabel v-if="submissionStatus == 'failed' && user.registration.country == ''"/></label>
                <select id="country" v-model="user.registration.country">
                    <option v-for="(country, index) in countries" :key="index">{{country}}</option>
                </select>
            </div>
            <div class="field-row-stacked">
                <label for="state">State / Province <failureLabel v-if="submissionStatus == 'failed' && user.registration.state == ''"/></label>
                <input id="state" type="text" v-model="user.registration.state">
            </div>
            <div class="field-row-stacked">
                <label for="gender">Gender <failureLabel v-if="submissionStatus == 'failed' && user.registration.gender == undefined"/></label>
                <select id="gender" v-model="user.registration.gender">
                    <option v-for="(gender, index) in genders" :key="index">{{gender}}</option>
                </select>
            </div>
            <div class="field-row" v-if="user.registration.gender == 'Other'">
                <label for="optionalGender">Gender:</label>
                <input type="text" id="optionalGender" v-model="user.registration.optionalExtraGender">
            </div>
            <div class="field-row-stacked">
                <label for="pronouns">Pronouns <failureLabel v-if="submissionStatus == 'failed' && user.registration.pronouns == undefined"/></label>
                <select id="pronouns" v-model="user.registration.pronouns">
                    <option v-for="(pronoun, index) in userPronouns" :key="index">{{pronoun}}</option>
                </select>
            </div>
            <div class="field-row" v-if="user.registration.pronouns == 'Other'">
                <label for="optionalPronouns">Pronouns: </label>
                <input type="text" id="optionalPronouns" v-model="user.registration.optionalExtraPronouns">
            </div>
            <div class="field-row-stacked">
                <label for="major">Major <failureLabel v-if="submissionStatus == 'failed' && user.registration.major == ''"/></label>
                <input type="text" id="major" v-model="user.registration.major">
            </div>
            <div class="checkbox-group">
                <br><span>Do you have any of the following dietary restrictions?</span><br><br>
                <div class="field-row">
                    <input type="checkbox" id="vegetarian" value="vegetarian" v-model="user.registration.dietaryRestrictions">
                    <label for="vegetarian">Vegetarian</label>
                </div>
                <div class="field-row">
                    <input type="checkbox" id="vegan" value="vegan" v-model="user.registration.dietaryRestrictions">
                    <label for="vegan">Vegan</label>
                </div>
                <div class="field-row">
                    <input type="checkbox" id="kosher" value="kosher" v-model="user.registration.dietaryRestrictions">
                    <label for="kosher">Kosher</label>
                </div>
                <div class="field-row">
                    <input type="checkbox" id="halal" value="halal" v-model="user.registration.dietaryRestrictions">
                    <label for="halal">Halal</label>
                </div>
                <div class="field-row">
                    <input type="checkbox" id="gluten-free" value="gluten-free" v-model="user.registration.dietaryRestrictions">
                    <label for="gluten-free">Gluten Free</label>
                </div>
            </div><br>
            <div class="field-row-stacked">
                <label for="link">Link (GitHub, LinkedIn, etc)<failureLabel v-if="submissionStatus == 'failed' && user.registration.link == ''"/></label>
                <input type="text" id="link" v-model="user.registration.link">
            </div><br>
            <div class="field-row-stacked">
                <label for="resumeUpload">Upload Resume</label>
                <button v-if="existingResume" @click="removeResume">Remove Resume</button><strong v-if="existingResume">{{existingResume}}</strong>
                <input id="resumeUpload" v-else type="file" url="/api/upload" accept="application/pdf" @select="fileChosen">
            </div><br>
            <div class="radio-group">
                <span>Is this your first hackathon?</span>
                <failureLabel v-if="submissionStatus == 'failed' && user.registration.firstHackathon == undefined"/>
                <div class="field-row">
                    <input type="radio" id="firstHackathonYes" v-model="user.registration.firstHackathon" :value="true">
                    <label for="firstHackathonYes">Yes</label>
                </div>
                <div class="field-row">
                    <input type="radio" id="firstHackathonNo" v-model="user.registration.firstHackathon" :value="false">
                    <label for="firstHackathonNo">No</label>
                </div>
            </div><br>
            <div class="radio-group">
                <span>Is this your first time attending Kent Hack Enough?</span>
                <failureLabel v-if="submissionStatus == 'failed' && user.registration.attendedKhe == undefined"/>
                <div class="field-row">
                    <input type="radio" id="firstKheYes" v-model="user.registration.attendedKhe" :value="false">
                    <label for="firstKheYes">Yes</label>
                </div>
                <div class="field-row">
                    <input type="radio" id="firstKheNo" v-model="user.registration.attendedKhe" :value="true">
                    <label for="firstKheNo">No</label>
                </div>
            </div><br>
            <failureLabel v-if="submissionStatus == 'failed' && user.registration.mlhConduct != true"/>
            <div class="field-row">
                <input type="checkbox" id="mlhConduct" v-model="user.registration.mlhConduct" :binary="true">
                <label for="mlhConduct" style="display: block">
                    I have read and agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>.
                </label>
            </div>
            <failureLabel v-if="submissionStatus == 'failed' && user.registration.mlhShare != true"/>
            <div class="field-row">
                <input type="checkbox" id="mlhShare" v-model="user.registration.mlhShare" :binary="true">
                <label for="mlhShare" style="display: block;">
                    I authorize you to share my application/registration information with Major League Hacking for event administration, 
                    ranking, and MLH administration in-line with the <a href="https://mlh.io/privacy">MLH Privacy Policy</a>. I further agree to the 
                    terms of both the <a href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md">>MLH Contest Terms and Conditions</a> and 
                    the <a href="https://mlh.io/privacy">MLH Privacy Policy</a>.
                </label>
            </div><br>
            <p v-if="saveStatus == 'failed'" style="text-align: left; color: red;">
                Could not update application! Make sure all fields are filled out.
            </p>
            <p v-if="saveStatus == 'saved'" style="text-align: left; color: darkgreen;">
                Saved application!
            </p>
            <p v-if="submissionStatus == 'success'" style="text-align: left">
                Thanks for submitting your application to Kent Hack Enough! You
                will receive an email when your application is accepted or
                rejected.

                You are free to make changes to your application and save them,
                but please note that this will put your application back at the
                end of the line.
            </p>
            <div class="action-buttons">
                <button @click="saveUser" :disabled="registrationClosed">
                    {{ submissionStatus === 'success' ? 'Revise' : 'Save Draft' }}
                </button>
                <button @click="submissionStatus != 'success' && submitForm()" :disabled="submissionStatus == 'success' || registrationClosed">
                    {{ submissionStatus == 'success' ? 'Application Submitted!' : 'Submit'}}
                </button>
                <button :disabled="registrationClosed" v-if="submissionStatus == 'success'">Withdraw Application</button>
            </div>
        </div>
        <div v-else>
            <p>Please log in</p>
        </div>
    </div>
</template>
<script setup>
import { User, schoolStatus, FullRegistration, genders, userPronouns} from "includes/users.ts"
import { UserRole } from "includes/common.ts";
import { ref, computed, onMounted } from "vue";
import { remult } from "remult";
import { user, loadUser } from "../state/user.js";
import failureLabel from "@/components/failureLabel.vue";

const schools = ref([]);
const countries = ref([]);

// change to re-disable registration!
// TODO: this should be controlled from the admin console
const registrationClosed = false;

const otherSexuality = ref(false);
const otherRestriction = ref(false);

//TODO: I'm not sure why I made these two separate variables
const alternateEmail = ref(false);
const alternateEmailValue = ref("");
//basically an enum: "success", "failed", "pending"
const submissionStatus = ref("pending");

const saveStatus = ref("");

const receivingEmails = ref(true);
//TODO: why does this have two onMounted calls? weird.
onMounted(() => {
    loadUser().then(() => {
        if (user.value) {
             if (user.value.submittedApplication == true) {submissionStatus.value = 'success'}
             receivingEmails.value = user.value.receivingEmails;
             localStorage.setItem("lastIDProvider", user.value.method);
             console.log(user.value.registration);
        }
    });
    getSchools(); //TODO: this should not be called this because it gets more than just schools
});
const existingResume = ref("");
onMounted(() => {
    User.getExistingResumeName().then(name => {
        existingResume.value = name;
    });
});
let resumeFiles = null;
const fileChoose = (event) => {
    //console.log('upload event:', event); 
    resumeFiles = event.files;
};
const removeResume = () => {
    removeFiles = null;
    existingResume.value = "";
    User.uploadResume("","");
};
const file2Base64 = file => {
    return new Promise((resolve, reject) => {
        const render = new FileRender();
        render.onloadend = function () {
            // The result property contains the base64 string
            const base64String = render.result.split(',')[1];
            resolve(base64String);
        }
        render.reasAsDataURL(file);
    });
};
const saveUser = async () => {
    if (alternateEmail.value) {user.value.registration.email = alternateEmailValue.value}
    if (resumeFiles) {
        const file = resumeFiles[0];
        await User.uploadResume(await fileToBase64(file), file.name || "untitled.pdf");
    }
    await remult.repo(User).save(user.value)
        .then(() => {
            saveStatus.value = "saved";
        }).catch(err => {
            console.error(err);
            // saving should only fail if there is something really, really
            // weird with the data that violates the HackathonRegistrationDraft
            // type check or if the application was previously submitted and is
            // thus validated with the FullRegistration type check.
            saveStatus.value = "failed";
            submissionStatus.value = 'failed';
            console.log(user.value);
        });
};
const isStaff = computed(() => {
    return(
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

const deregister = async () => {
    await User.withdrawRegistration();
}

const getSchools = async () => {
    const response = await fetch('/obtainSchools', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const result = await response.json();
    let schoolList = result.schools;
    let countryList = result.countries;
    console.log(result);
    schools.value = schoolList;
    countries.value = countryList;
}

</script>
<style scoped>

.profileContainer{
    color: black;
    font-size: 12pt;
    margin: 12px;
    display: flex;
    flex-direction: column;
}

label{
    font-size: 11pt;
}

input, select{
    color: black;
}

button{
    color: black;
}

.number {
    background-color: white !important;
    padding: 3px 4px;
    border: solid #7f9db9 1px;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0;
    height: 21px;
    line-height: 2;
}

.number:focus{
    outline: none;
}

</style>