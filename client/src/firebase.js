// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2fc4c.firebaseapp.com",
  projectId: "mern-blog-2fc4c",
  storageBucket: "mern-blog-2fc4c.appspot.com",
  messagingSenderId: "772412696953",
  appId: "1:772412696953:web:78c21820cce7a32e4e67a8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { app }; // <-- add this line
