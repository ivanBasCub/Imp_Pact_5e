// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzATxbnBbZT6Zqnod3IZwMlsuLii_RWaE",
  authDomain: "el-grimorio-de-mephistopheles.firebaseapp.com",
  databaseURL: "https://el-grimorio-de-mephistopheles-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "el-grimorio-de-mephistopheles",
  storageBucket: "el-grimorio-de-mephistopheles.firebasestorage.app",
  messagingSenderId: "439495597087",
  appId: "1:439495597087:web:385a65fe1dde36f68e092a",
  measurementId: "G-SX0F28WBP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
