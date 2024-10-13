import { ref, Ref } from 'vue'
import { getUser, User } from './Firebase'

export const user: Ref<User | null> = ref(null)

export async function loadUser() {
	user.value = await getUser()
}
