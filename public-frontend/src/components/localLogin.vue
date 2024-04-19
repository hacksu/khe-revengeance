<template>
    <Card>
        <template #content>
            <div class="loginForm">
            <SelectButton v-model="localAccountSwitch" :options="localAccountOptions" />
            <label v-if="validLoginWarning" style="color: red; text-align: center">{{ loginWarningMessage }}</label>
            <span class="p-float-label">
                <IconField iconPosition="right">
                    <InputText id="email" v-model="modal.email" />
                    <InputIcon class="pi pi-envelope"></InputIcon>
                </IconField>
                <label for="email">Email</label>
            </span>
            <span class="p-float-label">
                <Password id="password" v-model="modal.password" inputId="password" toggleMask :feedback="makingAccount" />
                <label for="password">Password</label>
            </span>
            <span v-if="makingAccount" class="p-float-label">
                <Password v-model="modal.confirmPassword" inputId="confirmPassword" toggleMask />
                <label for="confirmPassword">Confirm Password</label>
            </span>
            <Button @click="submit(makingAccount)" :disabled="!formValid" :label="makingAccount ? 'Make Account' : 'Log In'"/>
        </div>
    </template>
    </Card>
</template>

<script>
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import FloatLabel from 'primevue/floatlabel';
import Password from 'primevue/password';
import Button from 'primevue/button';

import { user, loadUser } from '../state/user.js';

import { isEmailRegex } from '../../../global-includes/email-address';

const accountOptions = ["Log In", "Create Account"];
const LogIn = accountOptions[0];

export default { 
    name: "localDialog",
    methods: {
        submit(makingAccount) {
            //information to be sent in request on submission
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: this.modal.email,
                    password: this.modal.password,
                    confirmPassword: this.modal.confirmPassword,
                    newUser: makingAccount
                })
            };
            //send request using fetch
            fetch("/login/local", requestOptions)
                .then(response => response.json().then(responseObject => {
                    console.log("response: ", responseObject)
                    if (responseObject.success) {
                        user.value = responseObject.userObject;
                        window.location.href = responseObject.goToPage;
                        this.validLoginWarning = false;
                    } else {
                        this.loginWarningMessage = responseObject.message;
                        this.validLoginWarning = true;
                        console.error("login failed");
                    }
                }))
                .catch( error => {
                    this.validLoginWarning = true;
                    console.error("Error: ", error)
                });
        },
    },
    components: { Dialog, SelectButton, InputText, Password, Button, Card, FloatLabel, InputIcon, IconField },
    data: () => ({
        //user: user,
        validLoginWarning: false,
        loginWarningMessage: "",
        localAccountVisible: true,
        localAccountSwitch: LogIn,
        localAccountOptions: accountOptions,
        modal: {
            email: "",
            password: "",
            confirmPassword: "",
            showingErrors: false
        },
        onMobile: typeof window !== "undefined" && window.innerWidth < 850
    }),
    mounted() {
        console.log("mounted is running")
        loadUser().then(() => {console.log("loaded user: ", user); this.user = user;});
    },
    setup() {
        console.log("localLogin: returning user: ", user.value)
        return { user }
    },
    watch: {
        localAccountSwitch(newValue, oldValue) {
            if (!newValue) {
                this.localAccountSwitch = oldValue;
            }
        },
    },
    computed: {
        makingAccount() {
            this.validLoginWarning = false;
            return this.localAccountSwitch != LogIn;
        },
        formValid() {
            return this.makingAccount ?
                (this.modal.password == this.modal.confirmPassword && 
                    this.modal.password.length > 5 &&
                    isEmailRegex.test(this.modal.email)) : 
                (this.modal.password && this.modal.email) &&
                    isEmailRegex.test(this.modal.email);
        }
    },
}

</script>
<style lang="scss" scoped>
:deep(.loginForm) {
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}
</style>
