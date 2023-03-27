<template>
    <h1>we are a hackathon</h1>
    <p>sign up for our emails 🥺</p>
    <template v-if="!signedUp">
        <input placeholder="address@stuff.com" v-model="inputEmail" type="text" />
        <button @click="registerEmail">join email list</button>
    </template>
    <p v-else>thank</p>
</template>

<script setup>
import { ref } from 'vue';
import { Email } from '../../global-includes/email-address';
import { remult } from "remult";

const emailDB = remult.repo(Email);

const signedUp = ref(false);
const inputEmail = ref("");

const registerEmail = async () => {
    await emailDB.save({ address: inputEmail.value });
    signedUp.value = true;
}

</script>
