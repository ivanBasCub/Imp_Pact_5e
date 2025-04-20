import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Link } from 'react-router-dom';

export default function SpellSelector({ classList = [], spellSlots = [], onSelectSpells }) {
  const [mainClassSpells, setMainClassSpells] = useState([]);
  const [multiClassSpells, setMultiClassSpells] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState([]);

  const [mainClass, multiclass] = classList;

  // Determinamos los niveles disponibles de hechizos basado en spellSlots
  // El nivel 0 siempre estará disponible si hay ranuras de nivel 1 o superior
  const availableLevels = [
    0, // nivel 0 (cantrips) siempre disponible si hay hechizos
    ...spellSlots
      .map((slots, index) => (slots > 0 ? index + 1 : null)) // index + 1 porque spellSlots[0] es nivel 1
      .filter(level => level !== null),
  ];

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
  

  useEffect(() => {
    setSelectedSpells([]);
    onSelectSpells([]);
  }, [mainClass, multiclass]);

  useEffect(() => {
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
