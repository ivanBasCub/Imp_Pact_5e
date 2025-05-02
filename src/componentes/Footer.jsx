// Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <div className="containerFooter">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top ms-3 me-3">
        <p className="col-md-4 mb-0 text-body-secondary">  Created by Iván Bascones Cubillo y Pablo Pollos Iglesias</p>

        <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
          <svg className="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"/></svg>
        </a>

        <ul className="nav col-md-4 justify-content-end ">
          <li className="nav-item"><p className="nav-link px-2 text-body-secondary">References:</p></li>
          <li className="nav-item"><a href="https://5e-bits.github.io/docs/" className="nav-link px-2">D&D 5e API</a></li>
          <li className="nav-item"><a href="https://dnd.wizards.com/es/resources/systems-reference-document" className="nav-link px-2">SRD 5.1</a></li>
          <li className="nav-item"><a href="https://vite.dev/" className="nav-link px-2">React Vite</a></li>
          <li className="nav-item"><a href="https://getbootstrap.com/" className="nav-link px-2">Bootstrap</a></li>
          <li className="nav-item"><a href="https://firebase.google.com/?hl=es-419" className="nav-link px-2 ">Firebase</a></li>
        </ul>
      </footer>
    </div>
  );
};

export default Footer;