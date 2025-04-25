// Importación de modulos react
import { Route, Routes } from 'react-router-dom'

// Compomentes
import App from './App';
import { SpellList, Spell } from "./Spells/Spell"
import { Monster, MonsterList } from "./Monsters/Monster"
import { MagicItemList, MagicItem } from './Magic_Items/magic_item'
import { RaceList, Race } from './Races/Race'
import Rules from './Rules/Rules'
import {FeatsList, Feat } from './Feats/Feats'
import {EquipmentList, Equipments }  from './Equipments/Equipments';
import { Background, BackgroundList } from './Backgrounds/Backgrounds';
import SubRace from './SubRaces/SubRaces';
import { Clase, ClassesList } from './Classes/Classes';
import SubClass from './SubClasses/SubClasses';

function SRD() {
  return (
    <Routes>
      {/* Pagina Principal del SRD */}
      <Route path='/SRD/' element={<App />} />

      {/* Reglas del DnD 5e */}
      <Route path='/SRD/rules' element={<Rules />} />

      {/* Spells */}
      <Route path='/SRD/spells/' element={<SpellList />} />
      <Route path='/SRD/spells/:clase' element={<SpellList />} />
      <Route path='/SRD/spell/:id' element={<Spell />} />

      {/* Objetos Mágicos */}
      <Route path='/SRD/magic_items/' element={<MagicItemList />} />
      <Route path='/SRD/magic_item/:id' element={<MagicItem />} />

      {/* Monstruos */}
      <Route path='/SRD/monsters' element={<MonsterList />} />
      <Route path='/SRD/monster/:id' element={<Monster />} />

      {/* Razas */}
      <Route path='/SRD/race' element={<RaceList />} />
      <Route path='/SRD/race/:id' element={<Race />} />

      {/* SubRazas */}
      <Route path='/SRD/subrace/:id' element={<SubRace />} />

      {/* Feats */}
      <Route path='/SRD/feats' element={<FeatsList />} />
      <Route path='/SRD/feat/:id' element={<Feat />} />

      {/* Lista de Equipamiento basico */}
      <Route path='/SRD/equipments' element={<EquipmentList />}/>
      <Route path='/SRD/equipment/:id' element={<Equipments />} />

      {/* Backgrounds */}
      <Route path='/SRD/backgrounds' element={<BackgroundList />} />
      <Route path='/SRD/background/:id' element={<Background />} />

      {/* Clases */}
      <Route path='/SRD/classes/' element={<ClassesList />} />
      <Route path='/SRD/class/:id' element={<Clase />} />
      
      {/* Subclases */}
      <Route path='/SRD/subclass/:id' element={<SubClass />} />
    </Routes>
  )
}

export default SRD