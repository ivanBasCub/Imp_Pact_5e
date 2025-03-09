import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRoute, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRoute>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRoute>
)
