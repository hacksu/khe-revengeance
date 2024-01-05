<template>
    <Dialog @hide="close()" v-model:visible="localAccountVisible" modal header="KHE Account" contentClass="loginModal">
        <SelectButton v-model="localAccountSwitch" :options="localAccountOptions" />
        <span class="p-float-label p-input-icon-right">
            <i class="pi pi-envelope" />
            <InputText id="email" v-model="modal.email"/>
        </span>
        <span class="p-float-label">
            <Password id="email" v-model="modal.password" inputId="password" toggleMask />
            <label for="password">Password</label>
        </span>
        <span v-if="makingAccount" class="p-flaot-label">
            <Password v-model="modal.confirmPassword" inputId="password" toggleMask />
            <label for="password">Confirm Password</label>
        </span>
        <Button @click="modal.submit()" :disabled="!formValid" :label="makingAccount ? 'Make Account' : 'Log In'"/>
    </Dialog>
</template>
<script>
import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

import { isEmailRegex } from '../../../global-includes/email-address';

const accountOptions = ["Log In", "Create Account"];
const LogIn = accountOptions[0];

//information to be sent in request on submission
const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        newUser: null
    })
};

export default { 
    name: "localDialog",
    methods: {
        async register () {
            requestOptions.body.newUser = true;
        },
        async login () {
            requestOptions.body.newUser = false;
        },
        submit() {
            //modify newUser variable accordingly
            if (makingAccount) {
                this.modal.register();
            } else {
                this.modal.login();
            }
            //send request using fetch
            fetch("/login/local", requestOptions)
                .then(response => response.json())
                .then(data => (this.postId = data.id))
        }
    },
    components: { Dialog, SelectButton, InputText, Password, Button },
    data: () => ({
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
    watch: {
        localAccountSwitch(newValue, oldValue) {
            if (!newValue) {
                this.localAccountSwitch = oldValue;
            }
        },
    },
    computed: {
        makingAccount() {
            return this.localAccountSwitch != LogIn;
        },
        formValid() {
            return this.makingAccount ?
                (this.modal.password == this.modal.confirmPassword && 
                    isEmailRegex.test(this.modal.email)) : 
                (this.modal.password && this.modal.email);
        }
    },
}

</script>
<style lang="scss">
.loginModal {
    width: 500px;
    max-width: 97vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}
</style>
