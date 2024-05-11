// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBZSXOqxKtZ8boJb51ktMDIrJhEjVMLbmo",
  authDomain: "authphone-d3b04.firebaseapp.com",
  projectId: "authphone-d3b04",
  storageBucket: "authphone-d3b04.appspot.com",
  messagingSenderId: "618429461597",
  appId: "1:618429461597:web:61e6eaf7c87f40f2f709b4",
  measurementId: "G-VBVWCL8D2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
