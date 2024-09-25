<script setup lang="ts">
import {
	getMembers,
	getOrganization,
	loginWithSavedAccount,
	Member,
	Organization,
} from '@/libs/Firebase'
import { onMounted, ref, Ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
	() => route.params.id,
	id => {
		update()
	}
)

onMounted(() => {
	update()
})

const organization: Ref<Organization | null> = ref(null)
const members: Ref<Member[] | null> = ref(null)

async function update() {
	organization.value = null
	members.value = null

	if (typeof route.params.id !== 'string') return

	//DEBUG
	await loginWithSavedAccount()

	organization.value = await getOrganization(route.params.id)

	if (!organization.value) return

	members.value = await getMembers(organization.value)
}
</script>

<template>
	<div v-if="organization">
		<h2>{{ organization.name }}</h2>
		<p>Owner: {{ organization.owner }}</p>

		<h2>Members</h2>
		<p v-for="member in members">{{ member.account }} {{ member.role }}</p>
	</div>
</template>
