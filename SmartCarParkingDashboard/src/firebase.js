// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
  apiKey: "AIzaSyC8h3belQ1gzsf_1UDIM1gZjR7A65TrSAM",
  authDomain: "carparking-19ebb.firebaseapp.com",
  projectId: "carparking-19ebb",
  storageBucket: "carparking-19ebb.appspot.com",
  messagingSenderId: "449000179160",
  appId: "1:449000179160:web:6f736116a54c9c4878dead",
  measurementId: "G-HCVY082V0Y",
});

// Initialize Firebase
export const auth = app.auth();
export const db = app.firestore();

export default app;
