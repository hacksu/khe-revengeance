<template>
    <Dropdown :distance="6" :placement="onMobile ? 'bottom-start' : 'bottom-end'">
        <p class="banner-link">
            Login
        </p>
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
                <p class="loginBar loginButton" @click="hide(); showLocalAccountModal = true">
                    <img id="khe-mark" src="/favicon.ico" />
                    <span>Log in with<br />local account</span>
                </p>
            </div>
        </template>
    </Dropdown>
    <Dialog v-model:visible="showLocalAccountModal" modal header="KHE Account (WIP)" contentClass="loginModal">
        <SelectButton v-model="localAccountSwitch" :options="localAccountOptions" />
        <span class="p-float-label p-input-icon-right">
            <i class="pi pi-envelope" />
            <InputText id="email" v-model="modal.email" />
            <label for="email">Email Address</label>
        </span>
        <span class="p-float-label">
            <Password v-model="modal.password" inputId="password" toggleMask />
            <label for="password">Password</label>
        </span>
        <span v-if="makingAccount" class="p-float-label">
            <Password v-model="modal.confirmPassword" inputId="password" toggleMask />
            <label for="password">Confirm Password</label>
        </span>
        <Button :disabled="!formValid" :label="makingAccount ? 'Make Account' : 'Log In'" />
    </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { Dropdown } from "floating-vue";
import { isEmailRegex } from '../../../global-includes/email-address';
const accountOptions = ["Log In", "Create Account"];
const logIn = accountOptions[0]
export default {
    name: "LoginButton",
    components: { Dialog, SelectButton, Dropdown, InputText, Password, Button },
    data: () => ({
        showLocalAccountModal: false,
        localAccountSwitch: logIn,
        localAccountOptions: accountOptions,
        logInOption: logIn,
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
            return this.localAccountSwitch != logIn;
        },
        formValid() {
            return this.makingAccount ?
                (this.modal.password == this.modal.confirmPassword &&
                    isEmailRegex.test(this.modal.email)) :
                (this.modal.password && this.modal.email);
        }
    }
}
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
