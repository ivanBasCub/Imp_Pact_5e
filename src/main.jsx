import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/css/index.css'
import App from './componentes/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Configuración de las rutas */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>  
    </BrowserRouter>
  </StrictMode>,
)
