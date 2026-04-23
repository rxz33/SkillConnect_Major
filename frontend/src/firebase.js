import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBD-nJFv_AVp9pUd0jVW_nOg3eoCsQDS0o",
  authDomain: "skill-connect-a0b46.firebaseapp.com",
  projectId: "skill-connect-a0b46",
  storageBucket: "skill-connect-a0b46.appspot.com",   // FIXED
  messagingSenderId: "39010303524",
  appId: "1:39010303524:web:6b4171a57e7f323ba2a2b1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const googleSignIn = () => {
  return signInWithPopup(auth, googleProvider);
};
