import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA49UL-BdwqAteV2LW1i9fg7yHadt4vZhc",
  authDomain:
    "stock-monitor-ee9c7.firebaseapp.com",
  projectId: "stock-monitor-ee9c7",
  storageBucket:
    "stock-monitor-ee9c7.firebasestorage.app",
  messagingSenderId:
    "291262744182",
  appId:
    "1:291262744182:web:fa2d19d7b59ded6b864157",
};
    
const app =
  initializeApp(firebaseConfig);

export const db =
  getFirestore(app);