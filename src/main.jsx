import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/css/index.css'
import App from './componentes/App.jsx'
import Personajes from './componentes/Personajes/Personajes.jsx'
import PersonajesNuevo from './componentes/Personajes/PersonajesNuevo.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Configuración de las rutas */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        {/* Rutas para el menu de personajes */}
        <Route path='/Personajes' element={<Personajes />} />
        <Route path='/Personajes/new' element={<PersonajesNuevo />} />


      </Routes>  
    </BrowserRouter>
  </StrictMode>,
)
