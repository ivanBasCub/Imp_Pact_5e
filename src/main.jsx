import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './componentes/App.jsx'
import SRD from './componentes/SRD/SRD.jsx'
import { SpellList, Spell } from './componentes/SRD/Spells/Spell.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Configuración de las rutas */}
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<App />} />

        {/* Rutas para el elementos del SRD */}
        <Route path='/SRD' element={<SRD />} />
        <Route path='/SRD/SpellList/' element={<SpellList />} />
        <Route path='/SRD/SpellLists/:clase' element={<SpellList />} />
        <Route path='/SRD/Spell/:id' element={<Spell />} />
      </Routes>  
    </BrowserRouter>
  </StrictMode>
)
