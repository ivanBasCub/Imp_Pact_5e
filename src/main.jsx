import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './componentes/App.jsx'
import SRD from './componentes/SRD/SRD.jsx'
import { SpellList, Spell } from './componentes/SRD/Spells/Spell.jsx'
import { MonsterList, Monster } from './componentes/SRD/Monsters/Monster.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Configuración de las rutas */}
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<App />} />

        {/* Rutas para el elementos del SRD */}
        <Route path='/SRD' element={<SRD />} />
        
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
