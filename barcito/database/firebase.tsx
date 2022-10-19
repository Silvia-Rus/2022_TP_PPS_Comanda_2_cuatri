// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk5FjkUpU-rmF6khdwkx3zwb1GBvdI0nY",
  authDomain: "appmovil-42850.firebaseapp.com",
  projectId: "appmovil-42850",
  storageBucket: "appmovil-42850.appspot.com",
  messagingSenderId: "702272886849",
  appId: "1:702272886849:web:9e253d34cb6bd3ff2b8ec0"
};

const firebaseApp = initializeApp(firebaseConfig);

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore(firebaseApp);

export default firebaseConfig;