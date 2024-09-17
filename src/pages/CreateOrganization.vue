<script setup lang="ts">
import { ref } from 'vue'
import { createOrganization } from '@libs/Firebase'

const name = ref('')

async function  create() {
    createOrganization(name.value)
}
</script>

<template>
<h1>Create Organization</h1>
<p>Name</p>
<input v-model="name" />
<button @click="create">Create</button>
</template>