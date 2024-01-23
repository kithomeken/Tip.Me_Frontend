import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, onAuthStateChanged} from 'firebase/auth'

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDLFPNVR0g0gEkPpVsrh3pDbVGAhmzeaVo",
    authDomain: "tip-me-heic240119.firebaseapp.com",
    projectId: "tip-me-heic240119",
    storageBucket: "tip-me-heic240119.appspot.com",
    messagingSenderId: "515264196533",
    appId: "1:515264196533:web:7ce4117e55dabba611f3fc",
    measurementId: "G-EHGJZMG0LZ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export const firebaseAuth = getAuth(firebaseApp)
onAuthStateChanged(firebaseAuth, authenticatedUser => {
    if (authenticatedUser !== null) {
        console.log('Logged in');
    } else {
        console.log('No user');
        
    }
})