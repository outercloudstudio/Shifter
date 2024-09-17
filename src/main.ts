import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@pages/Login.vue'
import Dashboard from '@pages/Dashboard.vue'
import CreateOrganization from '@pages/CreateOrganization.vue'
import '@libs/Firebase'
import MyOrganizations from '@pages/MyOrganizations.vue'
import Register from './pages/Register.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: Login },
		{ path: '/register', component: Register },
		{ path: '/dashboard', component: Dashboard },
		{ path: '/create-organization', component: CreateOrganization },
		{ path: '/my-organizations', component: MyOrganizations },
	],
})

createApp(App).use(router).mount('#app')
