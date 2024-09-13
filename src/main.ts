import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

import { initializeApp } from 'firebase/app'
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: 'AIzaSyBEJPrkIu_qSEVL-gjQ0RUpwoMlC7IyO-4',
	authDomain: 'shifter-34852.firebaseapp.com',
	projectId: 'shifter-34852',
	storageBucket: 'shifter-34852.appspot.com',
	messagingSenderId: '35646851933',
	appId: '1:35646851933:web:2eec85b5ab5230db9b76b4',
}

const app = initializeApp(firebaseConfig)
