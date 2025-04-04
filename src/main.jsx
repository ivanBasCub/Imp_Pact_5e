// Funciones React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Componentes de la Aplicacion
import App from './componentes/App.jsx'
import SRD from './componentes/SRD/SRD.jsx'
import Personajes from './componentes/Personajes/Personajes.jsx'
import PersonajesNuevo from './componentes/Personajes/PersonajesNuevo.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Configuración de las rutas */}
    <BrowserRouter>
      {/* Componente con todas las rutas relacionadas con el SRD */}
      <SRD />
      <Routes>
        <Route path="/" element={<App />} />

        {/* Rutas para el menu de personajes */}
        <Route path='/Personajes' element={<Personajes />} />
        <Route path='/Personajes/new' element={<PersonajesNuevo />} />


      </Routes>  
    </BrowserRouter>
  </StrictMode>
)
