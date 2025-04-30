// Header.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from "../firebase/config";
import { onAuthStateChanged } from 'firebase/auth';
import  Logout  from "./Users/Logout"

const Header = () => {

  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
        <a class="navbar-brand">
            <img src="/images/Logo.ico" class="d-block w-100" height="20"/>
        </a>
        <Link to="/" className="text-decoration-none mt-2">
            <p class="nav-link">Inicio</p>
        </Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
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
                        <p class="nav-link">Personajes</p>
                    </Link>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Sharespace</a>
                </li>
                <li class="nav-item justify-content-end">
                    <UserMenu auth={auth}/>
                </li>
            </ul>
        </div>
        
        </div>
    </nav>
  );
};

// Creación de un menu dinamo que se actualiza en caso del estado de usuario esta logeado o no
function UserMenu({ auth }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const state = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                setUser(currentUser)
            }else{
                setUser(null)
            }
        })

        return () => state();
    }, [auth])

    return (
        <div>
            {user ? (
                <>
                    <Logout/>
                </>
            ) : (
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