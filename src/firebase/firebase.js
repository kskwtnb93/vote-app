// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
	authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
	projectId: process.env.VUE_APP_FIREBASE_PROJECTID,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGEBUCKET,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID,
	appId: process.env.VUE_APP_FIREBASE_APPID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;