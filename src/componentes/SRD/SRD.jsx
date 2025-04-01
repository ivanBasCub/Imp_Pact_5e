// Importación de modulos react
import { Routes, Route } from 'react-router-dom'

// Compomentes
import { SpellList, Spell } from "./Spells/Spell"
import { Monster, MonsterList } from "./Monsters/Monster"
import { MagicItemList, MagicItem } from './Magic_Items/magic_item'
import { RaceList, Race } from './Races/Race'
import Rules from './Rules/Rules';

function SRD() {
  return (
    <Routes>
      {/* Reglas del DnD 5e */}
      <Route path='/SRD/Rules' element={<Rules />} />

      {/* Spells */}
      <Route path='/SRD/SpellList/' element={<SpellList />} />
      <Route path='/SRD/SpellList/:clase' element={<SpellList />} />
      <Route path='/SRD/Spell/:id' element={<Spell />} />

      {/* Objetos Mágicos */}
      <Route path='/SRD/MagicItemList/' element={<MagicItemList />} />
      <Route path='/SRD/MagicItem/:id' element={<MagicItem />} />

      {/* Monstruos */}
      <Route path='/SRD/MonsterList' element={<MonsterList />} />
      <Route path='/SRD/Monster/:id' element={<Monster />} />

      {/* Razas */}
      <Route path='/SRD/Race' element={<RaceList />} />
      <Route path='/SRD/Race/:id' element={<Race />} />

    </Routes>
  )
}

export default SRD