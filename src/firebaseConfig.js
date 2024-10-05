// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDyVDplwc_ieDRWLcuywAWTiWopJBXa6aw",
    authDomain: "hairsalon-a8f5b.firebaseapp.com",
    projectId: "hairsalon-a8f5b",
    storageBucket: "hairsalon-a8f5b.appspot.com",
    messagingSenderId: "766999572473",
    appId: "1:766999572473:web:c8cfc03c2ad216d9515728"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };