// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
        <a class="navbar-brand" href="#">
            <img src="/images/Logo.ico" class="d-block w-100" height="20"/>
        </a>
        <Link to="/" className="text-decoration-none">
            <p class="nav-link">Inicio</p>
        </Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
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
            </ul>
        </div>
        </div>
    </nav>
  );
};

export default Header;