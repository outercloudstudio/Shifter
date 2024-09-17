<script setup lang="ts">
import { register, login } from '@/libs/Firebase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

async function onLogin() {
    await register(email.value, password.value)

    router.push('dashboard')
}
</script>

<template>
    <h1>Register</h1>
    <p>Email</p>
    <input v-model="email" />
    <p>Password</p>
    <input v-model="password" />
    <br>
    <button @click="onLogin">Register</button>
</template>