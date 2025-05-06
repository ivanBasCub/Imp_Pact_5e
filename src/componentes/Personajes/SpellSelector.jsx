import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Link } from 'react-router-dom';

/**
 * Selector de hechizos para clases principales y multiclases.
 * Permite filtrar los hechizos por clase y niveles disponibles.
 * 
 * @param {*} classList Lista de dos clases: [mainClass, multiclass]
 * @param {*} spellSlots Array con el número de ranuras disponibles por nivel
 * @param {*} onSelectSpells Callback que devuelve la lista actualizada de hechizos seleccionados
 *  
 * @returns {JSX.Element} Componente React que muestra los hechizos disponibles y seleccionados
 */
export default function SpellSelector({ classList = [], spellSlots = [], onSelectSpells }) {
  const [mainClassSpells, setMainClassSpells] = useState([]);
  const [multiClassSpells, setMultiClassSpells] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState([]);

  const [mainClass, multiclass] = classList;

  // Determina los niveles de hechizos disponibles según las ranuras
  const availableLevels = [
    0, // nivel 0 (cantrips) siempre disponible si hay hechizos
    ...spellSlots
      .map((slots, index) => (slots > 0 ? index + 1 : null)) // index + 1 porque spellSlots[0] es nivel 1
      .filter(level => level !== null),
  ];
  
  // Íconos representativos para las escuelas de magia
  const schoolIcons = {
    abjuration: "🛡️",
    conjuration: "✨",
    divination: "🔮",
    enchantment: "🧠",
    evocation: "🔥",
    illusion: "👁️",
    necromancy: "💀",
    transmutation: "⚗️",
  };
  
  // Reinicia los hechizos seleccionados al cambiar de clase
  useEffect(() => {
    setSelectedSpells([]);
    onSelectSpells([]);
  }, [mainClass, multiclass]);

  // Obtiene los hechizos filtrados por clase y nivel
  useEffect(() => {
    /**
     * Recupera los hechizos disponibles desde Firestore para una clase dada.
     * 
     * @param {*} className Nombre de la clase (ej. "wizard", "cleric")
     * @returns Array de hechizos filtrados por clase y nivel
     */
    async function fetchSpellsByClass(className) {
      const snapshot = await getDocs(collection(db, "SRD_Spells"));
      const filtered = snapshot.docs
        .map(doc => doc.data())
        .filter(
          spell =>
            spell.classes.includes(className) &&  // Filtramos los hechizos según clase
            availableLevels.includes(spell.level) // Filtramos los hechizos según los niveles disponibles
        );
      return filtered;
    }

    // Carga los hechizos para ambas clases si están definidas
    async function fetchAllSpells() {
      if (mainClass) {
        const mainSpells = await fetchSpellsByClass(mainClass);
        setMainClassSpells(mainSpells);
      }
      if (multiclass) {
        const multiSpells = await fetchSpellsByClass(multiclass);
        setMultiClassSpells(multiSpells);
      }
    }

    fetchAllSpells();
  }, [mainClass, multiclass, spellSlots]);

   /**
   * Añade o elimina un hechizo de la selección.
   * 
   * @param {*} spell Objeto del hechizo seleccionado
   */
  function handleSpellToggle(spell) {
    const alreadySelected = selectedSpells.some(s => s.index === spell.index);
    const updated = alreadySelected
      ? selectedSpells.filter(s => s.index !== spell.index)
      : [...selectedSpells, spell];

    setSelectedSpells(updated);
    onSelectSpells(updated);
  }

  // Ordenamos los hechizos por nivel y luego por nombre
  function sortSpells(spells) {
    return spells.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  }

   /**
   * Renderiza la lista de hechizos en tarjetas por clase.
   * 
   * @param {*} spells Lista de hechizos a mostrar
   * @param {*} label Etiqueta de encabezado para el grupo de hechizos
   * @returns JSX del listado de hechizos
   */
  function renderSpellList(spells, label) {
    spells=sortSpells(spells);
    return (
      <div className="mb-4">
        <h3>{label}</h3>
        {spells.length === 0 ? (
          <p>No spells available</p>
        ) : (
          <div className="row">
            {spells.map(spell => (
              <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={spell.index}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={selectedSpells.some(s => s.index === spell.index)}
                          onChange={() => handleSpellToggle(spell)}
                        />
                        {/*Enlace a la página del SRD del hechizo*/}
                        <Link
                          to={`/SRD/spell/${spell.index}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          {spell.name}
                        </Link>
                      </label>
                      <span title={spell.school}>{schoolIcons[spell.school] || "📘"}</span>
                    </h5>
                    <p className="card-text">Level: {spell.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="d-flex flex-column gap-4">
      {mainClass && renderSpellList(mainClassSpells, `Spells for ${mainClass}`)}
      {multiclass && renderSpellList(multiClassSpells, `Spells for ${multiclass}`)}
    </div>
  );
}
