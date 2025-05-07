import { Children, createContext, useContext, useEffect, useState } from "react";
import { auth } from "./config";
import { onAuthStateChanged } from "firebase/auth";


/**
 * Contexto de autenticación para compartir el usuario actual entre componentes.
 * @type {React.Context<{ currentUser: import("firebase/auth").User | null }>}
 */
const AuthContext = createContext();


/**
 * Hook personalizado para acceder fácilmente al contexto de autenticación.
 *
 * @returns {{ currentUser: import("firebase/auth").User | null }}
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Proveedor del contexto de autenticación.
 * Escucha los cambios de estado de autenticación de Firebase y los expone a la aplicación.
 *
 * @component
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        /**
         * Suscripción al cambio de estado del usuario autenticado.
         * Se ejecuta cuando el usuario inicia o cierra sesión.
         */
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe(); // Limpia la suscripción al desmontar el componente.
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}