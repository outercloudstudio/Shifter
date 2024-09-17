<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { getOrganizations, Organization } from '@libs/Firebase'

const organizations: Ref<Organization[]> = ref([])

onMounted(async () => {
    organizations.value = await getOrganizations()
})
</script>

<template>
<h1>My Organizations</h1>

<p v-for="organization in organizations">{{ organization.name }}</p>
</template>