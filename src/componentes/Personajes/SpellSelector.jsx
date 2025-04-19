import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function SpellSelector({ classList = [], onSelectSpells }) {
  const [mainClassSpells, setMainClassSpells] = useState([]);
  const [multiClassSpells, setMultiClassSpells] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState([]);

  const [mainClass, multiclass] = classList;

  useEffect(() => {
    async function fetchSpellsByClass(className) {
      const spellsSnapshot = await getDocs(collection(db, "SRD_Spells"));
      const filtered = spellsSnapshot.docs
        .map(doc => doc.data())
        .filter(spell => spell.classes.includes(className));
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
  }, [mainClass, multiclass]);

  // Maneja selección/deselección de hechizos
  function handleSpellToggle(spell) {
    const alreadySelected = selectedSpells.some(s => s.index === spell.index);
    const updated = alreadySelected
      ? selectedSpells.filter(s => s.index !== spell.index)
      : [...selectedSpells, spell];

    setSelectedSpells(updated);
    onSelectSpells(updated);
  }

  function renderSpellList(spells, label) {
    return (
      <div>
        <h3>{label}</h3>
        {spells.length === 0 ? <p>No spells available</p> : (
          <ul>
            {spells.map(spell => (
              <li key={spell.index}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedSpells.some(s => s.index === spell.index)}
                    onChange={() => handleSpellToggle(spell)}
                  />
                  {spell.name} (lvl {spell.level})
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {mainClass && renderSpellList(mainClassSpells, `Spells for ${mainClass}`)}
      {multiclass && renderSpellList(multiClassSpells, `Spells for ${multiclass}`)}
    </div>
  );
}
