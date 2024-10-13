<script setup lang="ts">
import { loginWithSavedAccount } from '@/libs/Firebase'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
	await loginWithSavedAccount()

	router.push('dashboard')
})
</script>

<template>
	<h1>Welcome</h1>
	<button @click="router.push('login')">Login</button>
</template>
