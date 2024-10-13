import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import '@libs/Firebase'
import Account from '@pages/Account.vue'
import Admin from '@pages/Admin.vue'
import Calendar from '@pages/Calendar.vue'
import Dashboard from '@pages/Dashboard.vue'
import Login from '@pages/Login.vue'
import Register from '@pages/Register.vue'
import Trades from '@pages/Trades.vue'
import Welcome from '@pages/Welcome.vue'
import { loginWithSavedAccount } from '@libs/Firebase'
import { loadUser } from '@/libs/User'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: Welcome },
		{ path: '/login', component: Login },
		{ path: '/register', component: Register },
		{ path: '/dashboard', component: Dashboard },
		{ path: '/trades', component: Trades },
		{ path: '/calendar', component: Calendar },
		{ path: '/admin', component: Admin },
		{ path: '/account', component: Account },
	],
})

await loginWithSavedAccount()
await loadUser()

createApp(App).use(router).mount('#app')
