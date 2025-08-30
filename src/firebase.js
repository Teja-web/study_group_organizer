// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...",  // keep your actual key
  authDomain: "study-group-organizer-c15d4.firebaseapp.com",
  projectId: "study-group-organizer-c15d4",
  storageBucket: "study-group-organizer-c15d4.appspot.com", // can stay, even if not used
  messagingSenderId: "429820797137",
  appId: "1:429820797137:web:495d5ffe45c2c165ef65f0",
  measurementId: "G-0BLQHYZX0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
