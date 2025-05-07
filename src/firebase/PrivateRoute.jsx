import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Componente de ruta privada que restringe el acceso a usuarios autenticados.
 * Si no hay un usuario autenticado, redirige a la página de login.
 *
 * @component
 * @param {{ children: React.ReactNode }} props - Elementos hijos que deben renderizarse si el usuario está autenticado.
 * @returns {JSX.Element} - El contenido protegido o una redirección al login.
 */
const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;