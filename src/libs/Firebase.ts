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
	doc,
	getDoc,
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

export let loggedIn = false

export async function register(email: string, password: string) {
	const currentAuth = getAuth()

	await createUserWithEmailAndPassword(currentAuth, email, password)

	// TODO: Insecure, should replace with better method later
	sessionStorage.setItem('email', email)
	sessionStorage.setItem('password', password)

	auth = currentAuth
	loggedIn = true
}

export async function login(email: string, password: string) {
	const currentAuth = getAuth()

	await signInWithEmailAndPassword(currentAuth, email, password)

	// TODO: Insecure, should replace with better method later
	sessionStorage.setItem('email', email)
	sessionStorage.setItem('password', password)

	auth = currentAuth
	loggedIn = true
}

export async function loginWithSavedAccount() {
	const currentAuth = getAuth()

	// TODO: Insecure, should replace with better method later
	await signInWithEmailAndPassword(
		currentAuth,
		sessionStorage.getItem('email') as string,
		sessionStorage.getItem('password') as string
	)

	auth = currentAuth
	loggedIn = true
}

export interface Member {
	account: string
	role: 'member' | 'admin' | 'owner'
	id: string
}

export interface Trade {
	from: string
	to: string
	shift: string
	approved: string
	id: string
}

export interface Shift {
	account: string
	day: Date
	time: 'day' | 'night'
	id: string
}

export interface Organization {
	name: string
	owner: string
	id: string
}

export async function createOrganization(name: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const organization = await addDoc(collection(db, 'organizations'), {
		name,
		owner: auth.currentUser.uid,
	} as Organization)

	await addDoc(collection(organization, 'members'), {
		account: auth.currentUser.uid,
		role: 'owner',
	})
}

export async function getOrganizations(): Promise<Organization[]> {
	if (!loggedIn) throw new Error('Not logged in!')
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
		const data = document.data() as Organization
		data.id = document.id

		organizations.push(data)
	}

	return organizations
}

export async function getOrganization(id: string): Promise<Organization | null> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const documentReference = doc(db, 'organizations', id)
	const document = await getDoc(documentReference)

	const data = document.data() as Organization
	data.id = document.id

	return data
}

export async function getMembers(organization: Organization): Promise<Member[]> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const members: Member[] = []

	const memberQuery = query(collection(db, `organizations/${organization.id}/members`))

	const memberDocs = await getDocs(memberQuery)
	for (const document of memberDocs.docs) {
		const data = document.data() as Member
		data.id = document.id

		members.push(data)
	}

	return members
}
