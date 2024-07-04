import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyAOq79GH7QN57T7Bd9nbJ_P8R1onhjpMA4",
  authDomain: "holu-ops-dev.firebaseapp.com",
  databaseURL: "https://holu-ops-dev.firebaseio.com",
  projectId: "holu-ops-dev",
  storageBucket: "holu-ops-dev.appspot.com",
  messagingSenderId: "1010385749702",
  appId: "1:1010385749702:web:3e004a0f24f162c32c39c7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth()
