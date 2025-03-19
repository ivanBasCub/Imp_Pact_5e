// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './componentes/App.jsx'
import SRD from './componentes/SRD/SRD.jsx'
import { SpellList, Spell } from './componentes/SRD/Spells/Spell.jsx'
import { MonsterList, Monster } from './componentes/SRD/Monsters/Monster.jsx'
import { RaceList, Race } from './componentes/SRD/Races/Race.jsx'

{/* Información del servidor de firebase */}
const firebaseConfig = {
  apiKey: "AIzaSyCzATxbnBbZT6Zqnod3IZwMlsuLii_RWaE",
  authDomain: "el-grimorio-de-mephistopheles.firebaseapp.com",
  databaseURL: "https://el-grimorio-de-mephistopheles-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "el-grimorio-de-mephistopheles",
  storageBucket: "el-grimorio-de-mephistopheles.firebasestorage.app",
  messagingSenderId: "439495597087",
  appId: "1:439495597087:web:385a65fe1dde36f68e092a",
  measurementId: "G-SX0F28WBP1"
};

const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Configuración de las rutas */}
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<App />} />

        {/* Rutas para el elementos del SRD */}
        <Route path='/SRD' element={<SRD />} />
        
        {/* Rutas para el apartado relacionado a las razas */}
        <Route path='/SRD/Race' element={<RaceList/>}/>
        <Route path='/SRD/Race/:id' element={<Race/>}/>
        
        {/* Rutas para el apartado que esta relacionado a los mounstros */}
        <Route path='/SRD/MonsterList' element={<MonsterList />} />
        <Route path='/SRD/Monster/:id' element={<Monster />} />
        
        {/* Rutas para el apartado que esta relacionado a los Spell o Hechizos */}
        <Route path='/SRD/SpellList/' element={<SpellList />} />
        <Route path='/SRD/SpellList/:clase' element={<SpellList />} />
        <Route path='/SRD/Spell/:id' element={<Spell />} />
      </Routes>  
    </BrowserRouter>
  </StrictMode>
)
