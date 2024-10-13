import { ref, Ref, watch } from 'vue'
import { getMember, getUser, getUserOrganizations, Organization, User } from './Firebase'

export const user: Ref<User | null> = ref(null)

export const organizations: Ref<Organization[]> = ref([])

export const currentOrganization: Ref<Organization | null> = ref(null)

export const isAdmin: Ref<boolean> = ref(false)

watch(currentOrganization, async () => {
	isAdmin.value = false

	if (!user.value) return
	if (!currentOrganization.value) return

	const member = await getMember(currentOrganization.value, user.value.account)
	isAdmin.value = member.role === 'admin'
})

export async function loadUser() {
	user.value = await getUser()
	organizations.value = await getUserOrganizations()

	if (organizations.value.length > 0) currentOrganization.value = organizations.value[0]
}
