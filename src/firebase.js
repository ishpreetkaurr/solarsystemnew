// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5rwSdB2k8NRLer5ow8YWuVoir_3BzU40",
  authDomain: "solarsystem-b3f76.firebaseapp.com",
  projectId: "solarsystem-b3f76",
  storageBucket: "solarsystem-b3f76.firebasestorage.app",
  messagingSenderId: "400075534779",
  appId: "1:400075534779:web:3fcf07bec1af370601949e",
  measurementId: "G-K4QY81CFMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
export { db, collection, addDoc, getDocs };