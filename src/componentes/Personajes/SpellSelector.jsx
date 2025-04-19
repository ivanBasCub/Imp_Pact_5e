import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { db } from "../../firebase/config.jsx";
import { collection, getDocs } from 'firebase/firestore';

function SpellSelector({ classList, onSelectSpells }) {
  const [spells, setSpells] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState([]);

  useEffect(() => {
    const fetchSpells = async () => {
      const nanmeColeccion = "SRD_Spells"; // Nombre de la colección en Firestore
      const spellsSnapshot = await getDocs(collection(db, nanmeColeccion));
      const allSpells = spellsSnapshot.docs.map(doc => doc.data());

      // Filtrar los hechizos por clases
      const filteredSpells = allSpells.filter(spell =>
        spell.classes.some(cls => classList.includes(cls))
      );

      setSpells(filteredSpells);
    };

    fetchSpells();
  }, [classList]); // Solo se vuelve a ejecutar cuando 'classList' cambia

  const toggleSpell = (spell) => {
    const isSelected = selectedSpells.find(s => s.index === spell.index);
    const updatedSelectedSpells = isSelected
      ? selectedSpells.filter(s => s.index !== spell.index)
      : [...selectedSpells, spell];

    setSelectedSpells(updatedSelectedSpells);
    onSelectSpells(updatedSelectedSpells); // Llamar a la función de callback con los hechizos seleccionados
  };

  return (
    <div>
      <h2>Available Spells</h2>
      <ul>
        {spells.length === 0 ? (
          <li>No spells available for the selected classes.</li>
        ) : (
          spells.map(spell => (
            <li key={spell.index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedSpells.some(s => s.index === spell.index)}
                  onChange={() => toggleSpell(spell)}
                />
                {spell.name} (Level {spell.level}, School: {spell.school})
              </label>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

SpellSelector.propTypes = {
  classList: PropTypes.arrayOf(PropTypes.string).isRequired, // Cambié la definición del tipo a solo strings
  onSelectSpells: PropTypes.func.isRequired,
};

export default SpellSelector;
