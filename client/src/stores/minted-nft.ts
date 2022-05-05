import { writable } from 'svelte/store'
import type { DBItem } from '$types/index'

export const mintedNFT = writable<DBItem>()
