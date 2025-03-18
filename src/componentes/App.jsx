import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import './index.css';


// Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzATxbnBbZT6Zqnod3IZwMlsuLii_RWaE",
  authDomain: "el-grimorio-de-mephistopheles.firebaseapp.com",
  databaseURL: "https://el-grimorio-de-mephistopheles-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "el-grimorio-de-mephistopheles",
  storageBucket: "el-grimorio-de-mephistopheles.firebasestorage.app",
  messagingSenderId: "439495597087",
  appId: "1:439495597087:web:385a65fe1dde36f68e092a",
  measurementId: "G-SX0F28WBP1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
    </div>
  );
}

export default App;
