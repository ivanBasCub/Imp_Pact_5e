import { Link } from "react-router-dom"

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
        <Link to="/Personajes/new" className="text-decoration-none">
          <button>Nuevo Personaje</button>
        </Link>
        
        {/*Lista de personajes creados*/}
      </main>
      <Footer />
    </>
  );
}
