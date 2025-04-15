import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { db } from "../../firebase/config.jsx";
import { collection, getDocs } from 'firebase/firestore';

function SpellSelector({ classList, onSelectSpells }) {
  const [spells, setSpells] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState([]);

  useEffect(() => {
    const fetchSpells = async () => {
      const spellsSnapshot = await getDocs(collection(db, 'spells'));
      const allSpells = spellsSnapshot.docs.map((doc) => doc.data());

      const filtered = allSpells.filter(spell =>
        spell.classes.some(cls => classList.includes(cls.name))
      );

      setSpells(filtered);
    };

    fetchSpells();
  }, [classList]);

  const toggleSpell = (spell) => {
    const isSelected = selectedSpells.find(s => s.index === spell.index);
    const updated = isSelected
      ? selectedSpells.filter(s => s.index !== spell.index)
      : [...selectedSpells, spell];

    setSelectedSpells(updated);
    onSelectSpells(updated);
  };

  return (
    <div>
      <h2>Available Spells</h2>
      <ul>
        {spells.map(spell => (
          <li key={spell.index}>
            <label>
              <input
                type="checkbox"
                checked={selectedSpells.some(s => s.index === spell.index)}
                onChange={() => toggleSpell(spell)}
              />
              {spell.name} (Level {spell.level}, School: {spell.school.name})
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

SpellSelector.propTypes = {
    classList: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    onSelectSpells: PropTypes.func.isRequired,
  };

export default SpellSelector;
