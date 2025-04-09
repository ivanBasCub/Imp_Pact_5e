// Funciones React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './firebase/AuthContext.jsx'
import PrivateRoute from './firebase/PrivateRoute.jsx'

// Componentes de la Aplicacion
import App from './componentes/App.jsx'
import SRD from './componentes/SRD/SRD.jsx'
import Personajes from './componentes/Personajes/Personajes.jsx'
import PersonajesNuevo from './componentes/Personajes/PersonajesNuevo.jsx'
import Login from './componentes/Users/Login.jsx'
import Signup from './componentes/Users/Signup.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Rutas del SRD */}
      <SRD />
      {/* Rutas de la página web que son necesarias tener una cuenta registrada */}
      <AuthProvider>
        <Routes>
          {/* Rutas para el menu y la creación de personajes */}
          <Route path='/Personajes' element={<PrivateRoute><Personajes /></PrivateRoute>} />
          <Route path='/Personajes/new' element={<PrivateRoute><PersonajesNuevo /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Ruta para el inicio y creación de cuenta */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
)
