// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-2fc4c.firebaseapp.com",
  projectId: "mern-blog-2fc4c",
  storageBucket: "mern-blog-2fc4c.appspot.com",
  messagingSenderId: "772412696953",
  appId: "1:772412696953:web:78c21820cce7a32e4e67a8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);