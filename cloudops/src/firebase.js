import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArldi4pSkLTaoxiQeTLl6UY35XP1RUXGA",
  authDomain: "cloudops-254e5.firebaseapp.com",
  projectId: "cloudops-254e5",
  storageBucket: "cloudops-254e5.firebasestorage.app",
  messagingSenderId: "90462812305",
  appId: "1:90462812305:web:77b8390fb36aadee002730",
  measurementId: "G-4NZWDW3R7D"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;