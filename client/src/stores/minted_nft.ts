import { writable } from 'svelte/store'
import type { INFT } from '$types/index'

export const mintedNFT = writable<INFT>()
