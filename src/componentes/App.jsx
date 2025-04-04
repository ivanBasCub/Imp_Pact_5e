import { useState } from 'react';
import '../assets/css/App.css';
import Header from './Header';
import Footer from './Footer';
import MenuInicial from './MenuInicial';

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
