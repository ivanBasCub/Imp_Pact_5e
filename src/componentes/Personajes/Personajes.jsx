import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Footer from "../Footer";
import Header from "../Header";
import "../../assets/css/App.css";

export default function Personajes() {
  const navigate = useNavigate();   
  const [personajes, setPersonajes] = useState([]);   // Estado para almacenar la lista de personajes del usuario
  const [selectedId, setSelectedId] = useState(null); // Estado para manejar el personaje que tiene sus detalles desplegados

  // Hook para obtener los personajes del usuario desde Firestore
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;  // Si no hay usuario, salir

    const db = getFirestore();
    const personajesRef = collection(db, "Characters");

    // Consulta que filtra personajes por el UID del creador
    const q = query(personajesRef, where("creator", "==", user.uid));

    // Suscripción en tiempo real a los cambios en los datos del usuario
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPersonajes(results);
    });

    // Limpieza de la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  /**
   * Alterna la visualización de los detalles de un personaje.
   * Si el ID recibido ya estaba seleccionado, lo deselecciona.
   * 
   * @param {*} id ID del personaje
   */
  const toggleDetails = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  /**
   * Elimina un personaje de Firestore después de confirmación.
   * 
   * @param {*} id ID del personaje a eliminar
   */
  const eliminarPersonaje = async (id) => {
    if (window.confirm("Are you sure that you want to delete this character?")) {
      const db = getFirestore();
      await deleteDoc(doc(db, "Characters", id));
    }
  };

  /**
   * Guarda el personaje seleccionado en localStorage para edición
   * y redirige al formulario de nuevo personaje (/Personajes/new).
   * 
   * @param {*} personaje Objeto del personaje a editar
   */
  const editarPersonaje = (personaje) => {
    localStorage.setItem("editCharacter", JSON.stringify(personaje));
    navigate("/Personajes/new");
  };

  return (
    <>
      <Header />
      <main>
        {/* Tarjeta de cabecera con botón para crear personaje */}
        <div className="container my-5">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h1 className="card-title mb-3">🎲 Your Characters</h1>
              <Link to="/Personajes/new" className="btn btn-primary">
                ➕ New Character
              </Link>
            </div>
          </div>
        </div>

        {/* Lista de personajes */}
        {personajes.length > 0 ? (
          <ul className="list-unstyled m-5 rounded bg-light shadow">
            {personajes.map((personaje) => (
              <li key={personaje.id} className=" border rounded p-3">
                <div className="d-flex justify-content-between align-items-center gap-2">
                  {/* Botón para mostrar detalles */}
                  <button
                    onClick={() => toggleDetails(personaje.id)}
                    className="btn btn-outline-primary flex-grow-1 text-start"
                  >
                    {personaje.name} – Level {personaje.level}
                  </button>
                  {/* Botón para editar personaje */}
                  <button
                    onClick={() => editarPersonaje(personaje)}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </button>
                  {/* Botón para eliminar personaje */}
                  <button
                    onClick={() => eliminarPersonaje(personaje.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>

                {/* Detalles del personaje si está seleccionado */}
                {selectedId === personaje.id && (
                  <div className="border p-3 mt-2 bg-light rounded">
                    <p><strong>Iniciative:</strong> {personaje.initiative}</p>
                    <p><strong>AC:</strong> {personaje.armor_class}</p>
                    <p><strong>HP:</strong> {personaje.hit_points}</p>
                    <p><strong>Speed:</strong> {personaje.speed}</p>

                    <h5>Stats</h5>
                    <ul>
                      {personaje.stats && Object.entries(personaje.stats).map(([stat, value]) => (
                        <li key={stat}><strong>{stat}:</strong> {value}</li>
                      ))}
                    </ul>
                    
                    <p><strong>Race:</strong> {personaje.race || "Unknown"}</p>

                    <h5>Classes</h5>
                    <ul>
                      {personaje.class?.map((cls, index) =>
                        cls.name ? (
                          <li key={index}>
                            {cls.name} level {cls.level} ({cls.subclass}) –{" "}
                            {cls.spell_caster ? "Spellcaster" : "Non spellcaster"}
                          </li>
                        ) : null
                      )}
                    </ul>

                    <h5>Spells</h5>
                    <ul>
                      {personaje.spells?.spellbook?.map((spell, index) => (
                        <li key={index}>{spell.name}</li>
                      ))}
                    </ul>

                    <h5>Equipment</h5>
                    <ul>
                      <li><strong>Weapons:</strong> {personaje.equipment?.weapons || "None"}</li>
                      <li><strong>Armor:</strong> {personaje.equipment?.armor || "None"}</li>
                      <li><strong>Tools:</strong> {personaje.equipment?.tools || "None"}</li>
                      <li><strong>Other:</strong> {personaje.equipment?.other || "None"}</li>
                    </ul>

                    <h5>Proficiencies</h5>
                    <p>{personaje.proficiencies}</p>

                    <h5>Saves</h5>
                    <ul>
                      {personaje.saving_throws && Object.entries(personaje.saving_throws).map(([stat, value]) => (
                        <li key={stat}><strong>{stat}:</strong> {value}</li>
                      ))}
                    </ul>

                    <h5>Skills</h5>
                    <ul>
                      {personaje.skills && Object.entries(personaje.skills).map(([skill, value]) => (
                        <li key={skill}><strong>{skill}:</strong> {value}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          // Mensaje si no hay personajes creados
          <p className="text-center">You have not created any characters yet</p>
        )}
      </main>
      <Footer />
    </>
  );
}

