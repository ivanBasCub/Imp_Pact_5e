import { useState } from 'react';
import '../assets/css/App.css';
import Header from './Header';
import Footer from './Footer';
import MenuInicial from './MenuInicial';

/**
 * Componente principal de la aplicación.
 * Renderiza la estructura general de la página: cabecera, contenido principal y pie de página.
 *
 * @component
 * @returns {JSX.Element} Elemento raíz de la aplicación.
 */
function App() {
  return (
    <div id="root">
      <Header />  
      <main>
        <MenuInicial />
      </main>
      <Footer />
    </div>
  );
}

export default App;
