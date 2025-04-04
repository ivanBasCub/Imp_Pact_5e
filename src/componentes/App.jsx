<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "../firebase/config";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setMessage('Logout successful!');
    }).catch((error) => {
      setMessage('Logout failed.');
      console.error("Logout failed:", error);
    });
  };

  return (
    <div className="App">
      <h1>Firebase Authentication Example</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={handleLogin}>Login</button>
          <p>{message}</p>
        </div>
      )}
=======
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
>>>>>>> master
    </div>
  );
}

export default App;
