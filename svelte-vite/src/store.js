import { writable } from 'svelte/store';
export const storeReady = writable();
export const connectionStatus = writable();

export const alert = writable("Loaded");