// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // Replace with your actual API key
  authDomain: "study-group-organizer-c15d4.firebaseapp.com",
  projectId: "study-group-organizer-c15d4",
  storageBucket: "study-group-organizer-c15d4.appspot.com",
  messagingSenderId: "429820797137",
  appId: "1:429820797137:web:495d5ffe45c2c165ef65f0",
  measurementId: "G-0BLQHYZX0H"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create a mock app for development
  app = { name: 'mock-app' };
}

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
