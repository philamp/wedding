import { writable } from 'svelte/store';
export const storeReady = writable();
export const connectionStatus = writable(false);
export const connectionAttempted = writable(false);
export const mapOpened = writable(false);
export const loadingRoot = writable(false);

export const alert = writable("Bienvenue sur notre site!");
export const alertFailure = writable("false");
export const formValuesRoot = writable({
    "familyId": 0,
    "familyName":"",
    "signing": "",
    "signingImgUrl": "",
    "signingOnScreen": null,
    "signingOnWeb": null,
    "cocktailAttending":true,
    "dinerAttending":false,
    "emailAddress":"",
    "phone":"",
    "freeBooking": false,
    "dayOfArrival": "samedi",
    "guestLevel":1,
    "formStep":2,
    "peopleByFamilyId":{
       "nodes":[]
    },
    "bookingsByFamilyId":{
       "nodes":[]
    },
    "toolBookingsByFamilyId":{
       "nodes":[]
    }
 });