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
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	or,
	query,
	updateDoc,
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

export type User = {
	account: string
	name: string
	id: string
}

export type Organization = {
	name: string
	owner: string
	id: string
}

export type Role = 'member' | 'admin'

export type Member = {
	account: string
	role: Role
	organization: Organization
	id: string
}

export type Shift = {
	account: string
	day: Date
	time: 'day' | 'night'
	organization: Organization
	id: string
}

export type Trade =
	| {
			from: string
			to: unknown
			shift: string
			approved: false
			organization: Organization
			id: string
	  }
	| {
			from: string
			to: string
			shift: string
			approved: true
			organization: Organization
			id: string
	  }

export async function getUser(accountId?: string): Promise<User> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const userQuery = query(
		collection(db, `users`),
		where('account', '==', accountId ?? auth.currentUser.uid)
	)

	const userDocs = await getDocs(userQuery)

	console.log(auth.currentUser.uid)

	if (userDocs.docs.length != 1) throw new Error(`Found ${userDocs.docs.length} users instead of 1!`)

	let data = userDocs.docs[0].data() as User
	data.id = userDocs.docs[0].id

	return data
}

export async function changeUserName(user: User, name: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	user.name = name

	await updateDoc(doc(db, `users/${user.id}`), user)
}

export async function createOrganization(name: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const organization = await addDoc(collection(db, 'organizations'), {
		name,
		owner: auth.currentUser.uid,
	})

	await addDoc(collection(organization, 'members'), {
		account: auth.currentUser.uid,
		role: 'admin',
	})
}

export async function deleteOrganization(organization: Organization) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await deleteDoc(doc(db, `organizations/${organization.id}`))
}

export async function transferOrganizationOwnership(organization: Organization, ownerId: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${organization.id}`), {
		name: organization.name,
		owner: ownerId,
	} as Organization)
}

export async function changeOrganizationName(organization: Organization, name: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	organization.name = name

	await updateDoc(doc(db, `organizations/${organization.id}`), {
		name,
		owner: organization.owner,
	})
}

export async function getUserOrganizations(): Promise<Organization[]> {
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

export async function addMember(organization: Organization, account: string, role: Role) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await addDoc(collection(db, `organizations/${organization.id}/members`), {
		account,
		role,
	})
}

export async function removeMember(member: Member) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await deleteDoc(doc(db, `organizations/${member.organization.id}/members/${member.id}`))
}

export async function changeMemberRole(member: Member, role: Role) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${member.organization.id}/members/${member.id}`), {
		account: member.account,
		role,
	})
}

export async function getMember(organization: Organization, memberId: string): Promise<Member> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const document = await getDoc(doc(db, `organizations/${organization.id}/members/${memberId}`))

	const data = document.data() as Member
	data.id = document.id
	data.organization = organization

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
		data.organization = organization

		members.push(data)
	}

	return members
}

export async function createShift(
	organization: Organization,
	account: string,
	day: Date,
	time: 'day' | 'night'
) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await addDoc(collection(db, `organizations/${organization.id}/shifts`), {
		account,
		day,
		time,
	})
}

export async function deleteShift(shift: Shift) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await deleteDoc(doc(db, `organizations/${shift.organization.id}/shifts/${shift.id}`))
}

export async function changeShiftTime(shift: Shift, day: Date, time: 'day' | 'night') {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${shift.organization.id}/shifts/${shift.id}`), {
		account: shift.account,
		day,
		time,
	})
}

export async function getShifts(organization: Organization): Promise<Shift[]> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const shifts: Shift[] = []

	const shiftQuery = query(collection(db, `organizations/${organization.id}/shifts`))

	const shiftDocs = await getDocs(shiftQuery)
	for (const document of shiftDocs.docs) {
		const data = document.data() as Shift
		data.id = document.id
		data.organization = organization

		shifts.push(data)
	}

	return shifts
}

export async function createTrade(
	organization: Organization,
	from: string,
	to: string,
	shift: Shift
) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await addDoc(collection(db, `organizations/${organization.id}/trades`), {
		from,
		to,
		shift: shift.id,
		approved: false,
	})
}

export async function deleteTrade(trade: Trade) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await deleteDoc(doc(db, `organizations/${trade.organization.id}/trades/${trade.id}`))
}

export async function changeTradeApproval(trade: Trade, approved: boolean) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${trade.organization.id}/trades/${trade.id}`), {
		from: trade.from,
		to: trade.to,
		shift: trade.shift,
		approved,
	})
}

export async function changeTradeAcceptedUser(trade: Trade, acceptedUserId: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${trade.organization.id}/trades/${trade.id}`), {
		from: trade.from,
		to: acceptedUserId,
		shift: trade.shift,
		approved: trade.approved,
	})
}

export async function acceptTrade(trade: Trade) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await changeTradeAcceptedUser(trade, auth.currentUser.uid)
}

export async function approveTrade(trade: Trade) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await changeTradeApproval(trade, true)
}

export async function getTrades(organization: Organization): Promise<Trade[]> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const trades: Trade[] = []

	const tradeQuery = query(collection(db, `organizations/${organization.id}/trades`))

	const tradeDocs = await getDocs(tradeQuery)
	for (const document of tradeDocs.docs) {
		const data = document.data() as Trade
		data.id = document.id
		data.organization = organization

		trades.push(data)
	}

	return trades
}
