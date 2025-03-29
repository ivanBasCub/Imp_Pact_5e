import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import SkillProficiencyForm from "./SkillProficiencyForm.jsx";
import "../../assets/css/App.css";
import "../../assets/css/modal.css";

export default function PersonajesNuevo() {
  const [showModal, setShowModal] = useState(false);
  const [showRaceModal, setShowRaceModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [spellcastingAbility, setSpellcastingAbility] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [level, setLevel] = useState(1);
  const [features, setFeatures] = useState([]);
  const [raceFeatures, setRaceFeatures] = useState([]);
  const [subclass, setSubclass] = useState(null);
  const [subclassFeatures, setSubclassFeatures] = useState([]);
  const [stats, setStats] = useState([10, 10, 10, 10, 10, 10]);
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [hitDie, setHitDie] = useState(null);
  const [hp, setHp] = useState(null);
  const [savingThrows, setSavingThrows] = useState(null);
  const [savingThrowsBool, setSavingThrowsBool] = useState([false, false, false, false, false, false]);
  const [proficiencies, setProficiencies] = useState([]);
  const [pb, setPb] = useState(calcularProficiencyBonus(level));
  const [casterLevel, setCasterLevel] = useState(0);
  const [spellSlots, setSpellSlots] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);



  useEffect(() => {
    setPb(calcularProficiencyBonus(level));
  }, [level]);

  useEffect(() => {
    if(casterLevel>0 && level>0){
      setSpellSlots([
        level/casterLevel>=1 ? (level/casterLevel>1 ? (level/casterLevel>2 ? 4 : 3) : 2) : 0, //nivel 1
        level/casterLevel>2 ? (level/casterLevel>3 ? 3 : 2) : 0, //nivel 2
        level/casterLevel>4 ? (level/casterLevel>5 ? 3 : 2) : 0, //nivel 3
        level/casterLevel>6 ? (level/casterLevel>7 ? (level/casterLevel>8 ? 3 : 2) : 1) : 0, //nivel 4
        level/casterLevel>8 ? (level/casterLevel>9 ? (level/casterLevel>17 ? 3 : 2) : 1) : 0, //nivel 5
        level/casterLevel>10 ? (level/casterLevel>18 ? 2 : 1) : 0, //nivel 6
        level/casterLevel>12 ? (level/casterLevel>19 ? 2 : 1) : 0, //nivel 7
        level/casterLevel>14 ? 1 : 0,   //nivel 8
        level/casterLevel>16 ? 1 : 0]); //nivel 9
    }else{
      setSpellSlots([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
  }, [level, casterLevel]);

  useEffect(() => {
    if (selectedClass) {
      fetch(`https://www.dnd5eapi.co/api/classes/${selectedClass.toLowerCase()}/proficiencies`)
        .then((response) => response.json())
        .then((data) => {
          const savingProficiencies = data.results
            .filter((st) => !st.index.startsWith("saving-throw"))
            .map((st) => st.index); 
          setProficiencies(savingProficiencies);
        })
        .catch((error) => console.error("Error fetching proficiencies:", error));
    }
  }, [selectedClass]);
  
  


useEffect(() => {
  if (selectedClass) {
    fetch(`https://www.dnd5eapi.co/api/classes/${selectedClass.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        const savingThrowIndexes = data.saving_throws.map((st) => st.index); // ["str", "con", ...]
        setSavingThrows(savingThrowIndexes);

        if (data.spellcasting) {
          setSpellcastingAbility(data.spellcasting.spellcasting_ability.index);
          setCasterLevel(data.spellcasting.level);
        } else {
          setSpellcastingAbility(null);
          setCasterLevel(0);

        }

        // Mapeamos los atributos en un array de booleanos
        const newSavingThrowsBool = ["str", "dex", "con", "int", "wis", "cha"].map(stat => 
          savingThrowIndexes.includes(stat)
        );
        setSavingThrowsBool(newSavingThrowsBool);
      })
      .catch((error) => console.error("Error fetching saving throws:", error));
  }
}, [selectedClass]);

useEffect(() => {
  if (selectedClass) {
    fetch(`https://www.dnd5eapi.co/api/classes/${selectedClass.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => setHitDie(data.hit_die))
      .catch((error) => console.error("Error fetching hit die:", error));
  }
}, [selectedClass]);

useEffect(() => {
  if (hitDie && level) {
    const conBonus = statBonus(stats[2]); // Modificador de Constitución
    let calculatedHp = hitDie + conBonus; // HP de nivel 1

    if (level > 1) {
      calculatedHp += (level - 1) * ((hitDie / 2) + conBonus);
    }

    setHp(Math.max(1, Math.floor(calculatedHp))); // Asegurar que HP mínimo sea 1
  }
}, [hitDie, level, stats]);

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

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/races/")
      .then((response) => response.json())
      .then((data) => setRaces(data.results))
      .catch((error) => console.error("Error fetching races:", error));
  }, []);

  useEffect(() => {
    if (selectedRace) {
      fetch(`https://www.dnd5eapi.co/api/races/${selectedRace}`)
        .then((response) => response.json())
        .then(async (data) => {
          const traitsWithDesc = await Promise.all(
            data.traits.map(async (trait) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/traits/${trait.index}`);
              const traitData = await res.json();
              return { ...trait, desc: traitData.desc };
            })
          );
  
          setRaceFeatures(traitsWithDesc);
        })
        .catch((error) => console.error("Error fetching race features:", error));
    }
  }, [selectedRace]);

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

  function statBonus(stat) {
    let bonus = Math.floor(stat/2 - 5);
    return bonus;

  }

  function calcularProficiencyBonus(n) {
    return Math.floor((n - 1) / 4) + 2;
  }

  const calcularSavingThrow = (statIndex) => {
    const bonus = statBonus(stats[statIndex]); // Modificador base
    const proficiencyBonus = calcularProficiencyBonus(level);
    return savingThrowsBool[statIndex] ? bonus + proficiencyBonus : bonus;
  };

  var statsDict = [{key:"FUE", value:0},{key:"DEX", value:0},{key:"CON", value:0},{key:"INT", value:0},{key:"WIS", value:0},{key:"CHA", value:0}];

  return (
    <>
      <Header />
      <main>
        <h1>Personajes</h1>
        <p>Esta es la página principal de creación de personajes</p>

        <div>
          <label>Nombre:</label>
          <input type="string" id="characterName"></input>
        </div>

        {/* Formulario de estadísticas */}
        <div className="stats-grid">
          {["FUE", "DES", "CON", "INT", "WIS", "CHA"].map((statName, index) => {
            statsDict[statName] = stats[index]; // Se ejecuta sin renderizar
            
            return (
              <div key={statName} className="stat-item">
                <label htmlFor={statName}>{statName}</label>
                <input
                  type="number"
                  id={statName}
                  value={stats[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
                -- Bonus -- {statBonus(stats[index])}
                -- Save -- {calcularSavingThrow(index)}
                -- Tiene competencia? -- {savingThrowsBool[index] ? "✅" : "❌"}
              </div>
            );
          })}
          <button onClick={handleRandomStats}>Generar Atributos</button>
        </div>

        <div id="hp">
          <h3>Puntos de Golpe (HP): {hp !== null ? hp : "Cargando..."}</h3>
        </div>

        <button onClick={() => setShowModal(true)}>Clase</button>
        <button onClick={() => setShowRaceModal(true)}>Raza</button>
        {selectedClass && <p>Clase seleccionada: {selectedClass}</p>}
        {selectedRace && <p>Raza seleccionada: {selectedRace}</p>}
        {spellcastingAbility && <><p>Habilidad de spellcasting: {spellcastingAbility.toUpperCase()}</p>
        <p>Spellcasting Bonus: {statBonus(statsDict[spellcastingAbility.toUpperCase()])+pb}</p>
        <p>Spell Saving Difficulty: {statBonus(statsDict[spellcastingAbility.toUpperCase()])+pb+8}</p>
        <p>Spellcasting Level: {casterLevel}</p>
        </>}

        <h2>Ranuras de Conjuros</h2>
        <ul>
          {spellSlots.map((slots, index) => (
            slots > 0 && <li key={index}>Nivel {index + 1}: {slots} ranuras</li>
          ))}
        </ul>

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
            <p>Proficiency Bonus: {pb}</p>
            
          </div>
        )}

        <SkillProficiencyForm/>

      {/* Lista de Proficiencies */}
      <h3>Competencias varias</h3>
      <ul>
        {proficiencies.length > 0 ? (
          proficiencies.map((prof, index) => <li key={index}>{prof}</li>)
        ) : (
          <li>No hay proficiencias disponibles</li>
        )}
      </ul>



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

        {raceFeatures.length > 0 && (
          <div>
            <h2>Características de la Raza</h2>
            <ul>
              {raceFeatures.map((feature) => (
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

      {showRaceModal && (
        <div className="modal-overlay" onClick={() => setShowRaceModal(false)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Selecciona una raza</h2>
            <ul>
              {races.map((race) => (
                <li
                  key={race.index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedRace(race.index);
                    setShowRaceModal(false);
                  }}
                >
                  {race.name}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowRaceModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
