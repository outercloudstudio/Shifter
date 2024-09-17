import { initializeApp } from 'firebase/app'
import {
	Auth,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
} from 'firebase/auth'
import {
	addDoc,
	collection,
	getDocs,
	getFirestore,
	or,
	query,
	where,
} from 'firebase/firestore'
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
const db = getFirestore(app)

let auth: Auth | null = null

export async function register(email: string, password: string) {
	const currentAuth = getAuth()

	await createUserWithEmailAndPassword(currentAuth, email, password)

	auth = currentAuth
}

export async function login(email: string, password: string) {
	const currentAuth = getAuth()

	await signInWithEmailAndPassword(currentAuth, email, password)

	auth = currentAuth
}

export interface Organization {
	name: string
	owner: string
	admins: string[]
}

export async function createOrganization(name: string) {
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await addDoc(collection(db, 'organizations'), {
		name,
		owner: auth.currentUser.uid,
		admins: [],
	} as Organization)
}

export async function getOrganizations(): Promise<Organization[]> {
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const organizations: Organization[] = []

	const organizationQuery = query(
		collection(db, 'organizations'),
		or(
			where('owner', '==', auth.currentUser.uid),
			where('admins', 'array-contains', auth.currentUser.uid)
		)
	)

	const organizationDocs = await getDocs(organizationQuery)
	for (const document of organizationDocs.docs) {
		organizations.push(document.data() as Organization)
	}

	return organizations
}
