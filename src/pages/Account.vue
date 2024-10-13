<script setup lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue'
import { changeUserName } from '@/libs/Firebase'
import { computed, ref } from 'vue'
import { user } from '@libs/State'

const editMode = ref(false)
const name = computed(() => user.value?.name ?? 'Loading...')
const editedName = ref('Loading...')

function enterEditMode() {
	if (!user.value) return

	editMode.value = true
	editedName.value = name.value
}

function discard() {
	if (!user.value) return

	editMode.value = false
}

async function save() {
	if (!user.value) return

	editMode.value = false

	if (name.value !== editedName.value) await changeUserName(user.value, editedName.value)
	user.value.name = editedName.value
}
</script>

<template>
	<NavigationMenu />

	<h1>Account</h1>

	<div v-if="!editMode">
		<p>Name: {{ name }}</p>

		<button @click="enterEditMode">Edit</button>
	</div>

	<div v-else>
		<input v-model="editedName" />

		<button @click="save">Save</button>
		<button @click="discard">Discard</button>
	</div>
</template>
