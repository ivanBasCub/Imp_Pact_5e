import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import "../../assets/css/App.css";

export default function Personajes() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main>
        <h1>Personajes</h1>
        <p>Esta es la página principal de Personajes</p>
        <button onClick={() => navigate('/Personajes/new')}>Nuevo Personaje</button>
        {/*Lista de personajes creados*/}
      </main>
      <Footer />
    </>
  );
}
