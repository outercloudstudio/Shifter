<script setup lang="ts">
import { user } from '@/libs/User'
</script>

<template>
	<nav>
		<h3>Naviagtion Menu</h3>
		<p>{{ user?.name ?? 'Loading...' }}</p>

		<RouterLink to="dashboard">Dashboard</RouterLink>
		<br />
		<RouterLink to="calendar">Calendar</RouterLink>
		<br />
		<RouterLink to="trades">Trades</RouterLink>
		<br />
		<RouterLink to="admin">Admin</RouterLink>
		<br />
		<RouterLink to="account">Account</RouterLink>
	</nav>
</template>
