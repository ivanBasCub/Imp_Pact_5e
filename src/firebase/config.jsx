// Funciones Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Información del proyecto de firebase
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

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos servicios que vamos a usar en este proyecto
const auth = getAuth(app);
const db = getFirestore(app);

// Habilitamos la exportación de los servicios para usarlos en otros componentes
export { auth, db };