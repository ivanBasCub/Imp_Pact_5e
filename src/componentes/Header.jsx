// Header.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from "../firebase/config";
import { onAuthStateChanged } from 'firebase/auth';
import  Logout  from "./Users/Logout"

/**
 * Componente de navegación principal de la aplicación.
 * Contiene enlaces a diferentes secciones y un menú de usuario que muestra opciones
 * dependiendo del estado de autenticación.
 *
 * @component
 * @returns {JSX.Element} Elemento JSX que representa el header con navegación.
 */
const Header = () => {

  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
        {/* Logo */}
        <a class="navbar-brand">
            <img src="/images/Logo.ico" class="d-block w-100" height="20"/>
        </a>

        {/* Link a página de inicio */}
        <Link to="/" className="text-decoration-none mt-2">
            <p class="nav-link">Index</p>
        </Link>

        {/* Botón para navegación colapsable en pantallas pequeñas */}
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        {/* Navegación principal */}
        <div class="collapse navbar-collapse mt-2" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <Link to="/SRD" className="text-decoration-none">
                        <p class="nav-link">SRD</p>
                    </Link>
                </li>
                <li class="nav-item">
                    <p class="nav-link">Homebrew</p>
                </li>
                <li class="nav-item">
                    <Link to="/Personajes" className="text-decoration-none">
                        <p class="nav-link">Characters</p>
                    </Link>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Sharespace</a>
                </li>
                {/* Menú de usuario: login/logout */}
                <li class="nav-item justify-content-end">
                    <UserMenu auth={auth}/>
                </li>
            </ul>
        </div>
        
        </div>
    </nav>
  );
};

/**
 * Componente que muestra el menú de autenticación.
 * Se actualiza dinámicamente según el estado de sesión del usuario.
 *
 * @component
 * @param {Object} props
 * @param {import("firebase/auth").Auth} props.auth - Objeto de autenticación de Firebase.
 * @returns {JSX.Element} Botones de login/signup si no hay sesión, o logout si hay usuario autenticado.
 */
function UserMenu({ auth }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Suscripción al cambio de estado de autenticación
        const state = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                setUser(currentUser)
            }else{
                setUser(null)
            }
        })
        // Cancelar suscripción al desmontar el componente
        return () => state();
    }, [auth])

    return (
        <div>
            {user ? (
                // Si hay usuario autenticado, mostrar botón de logout
                <>
                    <Logout/>
                </>
            ) : (
                // Si no hay usuario, mostrar botones de login y signup
                <>
                    <Link to="/login">
                        <button className="btn btn-outline-success mx-md-2 my-sm-0">Sign In</button>
                    </Link>
                    <Link to="/signup">
                        <button className='btn btn-outline-primary mx-md-2 my-sm-0'>Sign Up</button>
                    </Link>
                </>

            )}
        </div>
    )
}

export default Header;