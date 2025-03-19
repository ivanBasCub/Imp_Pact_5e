import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import "../../assets/css/App.css";
import "../../assets/css/modal.css";

export default function PersonajesNuevo() {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [level, setLevel] = useState(1);
  const [features, setFeatures] = useState([]);
  const [subclass, setSubclass] = useState(null);
  const [subclassFeatures, setSubclassFeatures] = useState([]);
  const [stats, setStats] = useState([10, 10, 10, 10, 10, 10]);
  const [expandedFeatures, setExpandedFeatures] = useState({});

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/classes/")
      .then((response) => response.json())
      .then((data) => setClasses(data.results))
      .catch((error) => console.error("Error fetching classes:", error));
  }, []);

  useEffect(() => {
    if (selectedClass && level) {
      fetch(`https://www.dnd5eapi.co/api/2014/classes/${selectedClass.toLowerCase()}/levels/`)
        .then((response) => response.json())
        .then(async (data) => {
          const filteredFeatures = data
            .filter((lvl) => lvl.level <= level)
            .flatMap((lvl) => lvl.features);

          const featuresWithDesc = await Promise.all(
            filteredFeatures.map(async (feature) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/2014/features/${feature.index}`);
              const featureData = await res.json();
              return { ...feature, desc: featureData.desc };
            })
          );

          setFeatures(featuresWithDesc);
        })
        .catch((error) => console.error("Error fetching class levels:", error));
    }
  }, [selectedClass, level]);

  useEffect(() => {
    if (selectedClass) {
      fetch(`https://www.dnd5eapi.co/api/2014/classes/${selectedClass.toLowerCase()}/subclasses/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            setSubclass(data.results[0].index);
          }
        })
        .catch((error) => console.error("Error fetching subclass:", error));
    }
  }, [selectedClass]);

  useEffect(() => {
    if (subclass && level) {
      fetch(`https://www.dnd5eapi.co/api/2014/subclasses/${subclass}/levels/`)
        .then((response) => response.json())
        .then(async (data) => {
          const filteredSubclassFeatures = data
            .filter((lvl) => lvl.level <= level)
            .flatMap((lvl) => lvl.features);

          const subclassFeaturesWithDesc = await Promise.all(
            filteredSubclassFeatures.map(async (feature) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/2014/features/${feature.index}`);
              const featureData = await res.json();
              return { ...feature, desc: featureData.desc };
            })
          );

          setSubclassFeatures(subclassFeaturesWithDesc);
        })
        .catch((error) => console.error("Error fetching subclass features:", error));
    }
  }, [subclass, level]);

  const handleToggleFeature = (featureIndex) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [featureIndex]: !prev[featureIndex],
    }));
  };

  const handleRandomStats = () => {
    const newStats = Array.from({ length: 6 }, () => {
      let rolls = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      rolls.sort((a, b) => a - b);
      return rolls.slice(1).reduce((sum, val) => sum + val, 0);
    });

    setStats(newStats);
  };

  // Función para manejar los cambios en los inputs de estadísticas
  const handleInputChange = (index, value) => {
    const newStats = [...stats];
    newStats[index] = Math.max(0, parseInt(value) || 0);  // Para asegurarte que no sea un valor negativo
    setStats(newStats);
  };

  return (
    <>
      <Header />
      <main>
        <h1>Personajes</h1>
        <p>Esta es la página principal de creación de personajes</p>

        {/* Formulario de estadísticas */}
        <div className="stats-grid">
          {["FUE", "DES", "CON", "INT", "WIS", "CHA"].map((statName, index) => (
            <div key={statName} className="stat-item">
              <label htmlFor={statName}>{statName}</label>
              <input
                type="number"
                id={statName}
                value={stats[index]}
                onChange={(e) => handleInputChange(index, e.target.value)} // Llamar la función al cambiar el valor
              />
            </div>
          ))}
          <button onClick={handleRandomStats}>Generar Atributos</button>
        </div>

        <button onClick={() => setShowModal(true)}>Clase</button>
        {selectedClass && <p>Clase seleccionada: {selectedClass}</p>}

        {selectedClass && (
          <div>
            <label htmlFor="level">Nivel:</label>
            <input
              type="number"
              id="level"
              min="1"
              max="20"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            />
          </div>
        )}

        {/* Lista de Features de la Clase */}
        {features.length > 0 && (
          <div>
            <h2>Características hasta nivel {level}</h2>
            <ul>
              {features.map((feature) => (
                <li key={feature.index}>
                  <button onClick={() => handleToggleFeature(feature.index)}>
                    <strong>{feature.name}</strong>
                  </button>
                  {expandedFeatures[feature.index] && <p>{feature.desc.join(" ")}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lista de Features de la Subclase */}
        {subclass && subclassFeatures.length > 0 && (
          <div>
            <h2>Características de Subclase: {subclass}</h2>
            <ul>
              {subclassFeatures.map((feature) => (
                <li key={feature.index}>
                  <button onClick={() => handleToggleFeature(feature.index)}>
                    <strong>{feature.name}</strong>
                  </button>
                  {expandedFeatures[feature.index] && <p>{feature.desc.join(" ")}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Selecciona una clase</h2>
            <ul>
              {classes.map((clase) => (
                <li
                  key={clase.index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedClass(clase.index);
                    setShowModal(false);
                  }}
                >
                  {clase.name}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
