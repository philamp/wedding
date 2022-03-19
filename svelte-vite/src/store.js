import { writable } from 'svelte/store';
export const storeReady = writable();
export const connectionStatus = writable();
export const mapOpened = writable(false);

export const alert = writable("Bienvenue sur notre site!");
export const alertFailure = writable("false");
export const familyStore = writable();