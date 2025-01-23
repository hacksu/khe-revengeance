<template>
    <div class="loginForm">
        <!-- Account Type Switch (Log In / Create Account) -->
        <SelectButton v-model="localAccountSwitch" :options="localAccountOptions" class="xp-selectbutton" />
        
        <!-- Warning Message -->
        <label v-if="validLoginWarning" class="warning-label">{{ loginWarningMessage }}</label>
        
        <!-- Email Input -->
        <fieldset>
            <legend>Email</legend>
            <input type="email" id="email" v-model="modal.email" class="xp-input" />
        </fieldset>

        <!-- Password Input -->
        <fieldset>
            <legend>Password</legend>
            <input type="password" id="password" v-model="modal.password" class="xp-input" inputId="password" toggleMask :feedback="makingAccount" />
        </fieldset>
        
        <!-- Confirm Password (only for account creation) -->
        <div v-if="makingAccount">
            <fieldset>
                <legend>Confirm Password</legend>
                <input type="password" v-model="modal.confirmPassword" class="xp-input" inputId="confirmPassword" toggleMask />
            </fieldset>
        </div>
 
        <!-- Submit Button -->
        <button @click="submit(makingAccount)" :disabled="!formValid" class="xp-button" :label="makingAccount ? 'Make Account' : 'Log In'">
            {{ makingAccount ? 'Make Account' : 'Log In' }}
        </button>
    </div>
</template>

<script>
import SelectButton from 'primevue/selectbutton';
import { user, loadUser } from '../state/user.js';
import { isEmailRegex } from '../../../global-includes/email-address';

const accountOptions = ["Log In", "Create Account"];
const LogIn = accountOptions[0];

export default { 
    name: "localDialog",
    components: { SelectButton },
    data: () => ({
        validLoginWarning: false,
        loginWarningMessage: "",
        localAccountSwitch: LogIn,  // Initially set to "Log In"
        localAccountOptions: accountOptions,  // Options for the SelectButton
        modal: {
            email: "",
            password: "",
            confirmPassword: "",
            showingErrors: false
        },
        onMobile: typeof window !== "undefined" && window.innerWidth < 850
    }),
    methods: {
        submit(makingAccount) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: this.modal.email,
                    password: this.modal.password,
                    confirmPassword: this.modal.confirmPassword,
                    newUser: makingAccount
                })
            };
            fetch("/login/local", requestOptions)
                .then(response => response.json().then(responseObject => {
                    console.log("response: ", responseObject);
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
                .catch(error => {
                    this.validLoginWarning = true;
                    console.error("Error: ", error);
                });
        }
    },
    computed: {
        makingAccount() {
            this.validLoginWarning = false;
            return this.localAccountSwitch !== LogIn;  // Only show confirmPassword when creating an account
        },
        formValid() {
            return this.makingAccount
                ? (this.modal.password === this.modal.confirmPassword && this.modal.password.length > 5 && isEmailRegex.test(this.modal.email))
                : (this.modal.password && this.modal.email && isEmailRegex.test(this.modal.email));
        }
    }
}
</script>

<style lang="scss" scoped>
.xp-input {
    background: white; /* Lighter gradient blue background */
    border: 1px solid #7a98d1;
    padding: 5px 10px;
    font-size: 14px;
    color: #000;
    border-radius: 4px;
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
    height: 30px;

    &:focus {
        border-color: #3e76b9; /* Blue border when focused */
        box-shadow: 0 0 8px rgba(62, 118, 185, 0.4);
    }
}

.xp-button {
    background: linear-gradient(to top, #e3e7f5, #7a98d1);
    border: 1px solid #4a6fa3;
    padding: 10px 20px;
    color: white;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: background 0.3s, box-shadow 0.2s;

    &:hover {
        background: #567fbd;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    &:disabled {
        background: #9baed3;
        cursor: not-allowed;
    }
}

.warning-label {
    color: red;
    text-align: center;
    font-size: 12px;
}

:deep(.p-button) {
    width: 50%;
    height:50px;
}

.xp-selectbutton {
    margin-bottom: 20px;
}

.loginForm{
    display: flex;
    flex-direction: column;
    justify-content: space-betweens;
    padding-top: 20px;
    padding-bottom: 20px;
}

fieldset{
    background-color: transparent;
}

</style>
