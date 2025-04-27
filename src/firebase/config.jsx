// Funciones Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Información del proyecto de firebase
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos servicios que vamos a usar en este proyecto
const auth = getAuth(app);
const db = getFirestore(app);

// Habilitamos la exportación de los servicios para usarlos en otros componentes
export { auth, db };