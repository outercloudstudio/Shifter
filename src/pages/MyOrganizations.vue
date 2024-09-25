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

	<div v-for="organization in organizations">
		<router-link :to="`organization/${organization.id}`">{{ organization.name }}</router-link>
	</div>
</template>
