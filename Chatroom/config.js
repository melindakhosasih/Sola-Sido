import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, push, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCxSFVoTexKwZzDbnsS5YB0E-n1CSXGHaw",
    authDomain: "sola-sido.firebaseapp.com",
    databaseURL:
        "https://sola-sido-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sola-sido",
    storageBucket: "sola-sido.appspot.com",
    messagingSenderId: "540570331188",
    appId: "1:540570331188:web:f1603a268586bd061f0261",
    measurementId: "G-D36777X06F",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);


// Get the Firebase database
export const db = getDatabase();

// Database Reference
export const chatroomDatabase = ref(db, "chatroom/");
export const userDatabase = ref(db, "userData/");
export const chatroomKey = ref(db, "chatroomKey/");

