import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyAaNpu5hOo50cJlbDAkvEiMSEqYyUkPIU0",
  authDomain: "form-comissionamento.firebaseapp.com",
  projectId: "form-comissionamento",
  storageBucket: "form-comissionamento.appspot.com",
  messagingSenderId: "1024976603255",
  appId: "1:1024976603255:web:44a2dd09a02d664a111e72"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth()
