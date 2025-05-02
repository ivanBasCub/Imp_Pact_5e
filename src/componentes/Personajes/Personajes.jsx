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
  const [personajes, setPersonajes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    const personajesRef = collection(db, "Characters");
    const q = query(personajesRef, where("creator", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPersonajes(results);
    });

    return () => unsubscribe();
  }, []);

  const toggleDetails = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const eliminarPersonaje = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este personaje?")) {
      const db = getFirestore();
      await deleteDoc(doc(db, "Characters", id));
    }
  };

  const editarPersonaje = (personaje) => {
    localStorage.setItem("editCharacter", JSON.stringify(personaje));
    navigate("/Personajes/new");
  };

  return (
    <>
      <Header />
      <main>
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

        {personajes.length > 0 ? (
          <ul className="list-unstyled m-5 rounded bg-light shadow">
            {personajes.map((personaje) => (
              <li key={personaje.id} className=" border rounded p-3">
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <button
                    onClick={() => toggleDetails(personaje.id)}
                    className="btn btn-outline-primary flex-grow-1 text-start"
                  >
                    {personaje.name} – Level {personaje.level}
                  </button>
                  <button
                    onClick={() => editarPersonaje(personaje)}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => eliminarPersonaje(personaje.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>

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
                      <li><strong>Weapons:</strong> {personaje.equipment?.weapons || "Ninguna"}</li>
                      <li><strong>Armor:</strong> {personaje.equipment?.armor || "Ninguna"}</li>
                      <li><strong>Tools:</strong> {personaje.equipment?.tools || "Ninguna"}</li>
                      <li><strong>Other:</strong> {personaje.equipment?.other || "Ninguno"}</li>
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
          <p className="text-center">You have not created any characters yet</p>
        )}
      </main>
      <Footer />
    </>
  );
}

