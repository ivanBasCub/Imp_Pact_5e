// Importación de modulos react
import { Routes, Route } from 'react-router-dom'

// Compomentes
import App from './App';
import { SpellList, Spell } from "./Spells/Spell"
import { Monster, MonsterList } from "./Monsters/Monster"
import { MagicItemList, MagicItem } from './Magic_Items/magic_item'
import { RaceList, Race } from './Races/Race'
import Rules from './Rules/Rules'
import {FeatsList, Feat } from './Feats/Feats'
import {EquimentList, Equiments }  from './Equiments/Equiments';
import { Background, BackgroundList } from './Backgrounds/Backgrounds';

function SRD() {
  return (
    <Routes>
      {/* Pagina Principal del SRD */}
      <Route path='/SRD/' element={<App />} />

      {/* Reglas del DnD 5e */}
      <Route path='/SRD/Rules' element={<Rules />} />

      {/* Spells */}
      <Route path='/SRD/Spells/' element={<SpellList />} />
      <Route path='/SRD/Spells/:clase' element={<SpellList />} />
      <Route path='/SRD/Spell/:id' element={<Spell />} />

      {/* Objetos Mágicos */}
      <Route path='/SRD/MagicItems/' element={<MagicItemList />} />
      <Route path='/SRD/MagicItem/:id' element={<MagicItem />} />

      {/* Monstruos */}
      <Route path='/SRD/Monsters' element={<MonsterList />} />
      <Route path='/SRD/Monster/:id' element={<Monster />} />

      {/* Razas */}
      <Route path='/SRD/Race' element={<RaceList />} />
      <Route path='/SRD/Race/:id' element={<Race />} />

      {/* Feats */}
      <Route path='/SRD/Feats' element={<FeatsList />} />
      <Route path='/SRD/Feat/:id' element={<Feat />} />

      {/* Lista de Equipamiento basico */}
      <Route path='/SRD/Equiments' element={<EquimentList />}/>
      <Route path='/SRD/Equiment/:id' element={<Equiments />} />

      {/* Backgrounds */}
      <Route path='/SRD/Backgrounds' element={<BackgroundList />} />
      <Route path='/SRD/Background/:id' element={<Background />} />
    </Routes>
  )
}

export default SRD