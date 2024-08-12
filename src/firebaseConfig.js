// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAECLrJY2amLR4csWJv3d3gIiKnP214f30",
  authDomain: "telecall-733b3.firebaseapp.com",
  projectId: "telecall-733b3",
  storageBucket: "telecall-733b3.appspot.com",
  messagingSenderId: "889651743042",
  appId: "1:889651743042:web:1935aa0648dbfae74d20db",
  measurementId: "G-GB84X2J6W9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);  
export { auth, db};