// MenuInicial.jsx
import React from 'react';
import { Link } from 'react-router-dom';


const MenuInicial = () => {
  return (
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-sm-6">
          <Link to="/SRD" className="text-decoration-none">
            <div className="card">
              <img src="images/scroll.png" alt="scroll" className="card-img-top" />
              <div className="card-body">
                <h2 className="card-title">SRD</h2>
                <p className="card-text">Habilitado</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-12 col-sm-6">
          <div className="card">
            <img src="/images/homebrew.png" alt="Imagen 2" className="card-img-top" />
            <div className="card-body">
              <h2 className="card-title">Homebrew</h2>
              <p className="card-text">Inhabilitado</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <Link to="/Personajes" className="text-decoration-none">
            <div className="card">
              <img src="/images/personajes.png" alt="Personajes" className="card-img-top" />
              <div className="card-body">
                <h2 className="card-title">Characters</h2>
                <p className="card-text">Habilitado</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-12 col-sm-6">
          <div className="card">
            <img src="images/sharespace.png" alt="Imagen 4" className="card-img-top" />
            <div className="card-body">
              <h2 className="card-title">Sharespace</h2>
              <p className="card-text">Inhabilitado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuInicial;