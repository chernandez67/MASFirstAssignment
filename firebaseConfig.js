import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDQPw2I5v-z4up2Renb4PbRq4BT5qRENqo",
    authDomain: "masfirst-cfb32.firebaseapp.com",
    projectId: "masfirst-cfb32",
    storageBucket: "masfirst-cfb32.appspot.com",
    messagingSenderId: "930438301249",
    appId: "1:930438301249:web:1c87c5508485212653a8c0",
    measurementId: "G-TNC3NKCCDB"
};

export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)
// export const FIREBASE_AUTH = getAuth(firebaseConfig)

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
