<script setup lang="ts">
import { user, organizations, currentOrganization, isAdmin } from '@/libs/State'
</script>

<template>
	<nav>
		<h3>Naviagtion Menu</h3>
		<p>{{ user?.name ?? 'Loading...' }}</p>

		<button
			v-for="organization in organizations"
			:style="{ backgroundColor: organization === currentOrganization ? 'lightblue' : undefined }"
			@click="currentOrganization = organization"
		>
			{{ organization.name }}
		</button>
		<br />
		<br />
		<RouterLink to="dashboard">Dashboard</RouterLink>
		<br />
		<RouterLink to="calendar">Calendar</RouterLink>
		<br />
		<RouterLink to="trades">Trades</RouterLink>
		<br />
		<RouterLink to="admin" v-if="isAdmin">Admin</RouterLink>
		<br />
		<RouterLink to="account">Account</RouterLink>
	</nav>
</template>
