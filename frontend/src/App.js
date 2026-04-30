import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Movies from './components/Movies';
import Contact from './components/Contact';
import Login from './components/Login';
import Images from './components/Images';
import Messages from './components/Messages';
import './App.css';

function App() {
  // Kezdetben "Vendég", bejelentkezés után egy objektum lesz: {vezeteknev, keresztnev, felhasznalonev}
  const [user, setUser] = useState("Vendég");

  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <header className="App-header">
          <div className="header-container">
            <div className="logo">
              <Link to="/" className="logo-link">🎬 <span>Mozi</span>Portál</Link>
            </div>
            <nav className="nav-menu">
              <Link to="/" className="nav-link">Főoldal</Link>
              <Link to="/movies" className="nav-link">Filmek</Link>
              <Link to="/images" className="nav-link">Képek</Link>
              <Link to="/contact" className="nav-link">Kapcsolat</Link>
              
              {user !== "Vendég" && (
                <Link to="/messages" className="nav-link" style={{color: '#f1c40f'}}>Üzenetek</Link>
              )}
            </nav>
            <div className="user-info">
              {/* JAVÍTVA: A kért formátum megjelenítése: Családi_név Utónév (Login_név) */}
              {user !== "Vendég" && (
                <span className="user-name" style={{ marginRight: '15px', color: '#bdc3c7' }}>
                  Bejelentkezett: <b>{user.vezeteknev} {user.keresztnev} ({user.felhasznalonev})</b>
                </span>
              )}
              
              {user === "Vendég" ? (
                <Link to="/login" className="login-btn">Bejelentkezés</Link>
              ) : (
                <button 
                  onClick={() => setUser("Vendég")} 
                  className="login-btn" 
                  style={{border: 'none', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white'}}
                >
                  Kijelentkezés
                </button>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/contact" element={<Contact user={user !== "Vendég" ? user.felhasznalonev : "Vendég"} />} />
            <Route path="/images" element={<Images user={user !== "Vendég" ? user.felhasznalonev : "Vendég"} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/messages" element={user !== "Vendég" ? <Messages /> : <Home />} />
          </Routes>
        </main>

        <footer style={{
          backgroundColor: '#131519',
          color: '#bdc3c7',
          textAlign: 'center',
          padding: '20px',
          borderTop: '1px solid #34495e',
          marginTop: 'auto',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0 }}>
            Készítették: <strong style={{ color: '#00d4ff' }}>Fajcsák Gábor, Zahorszki Csaba, Muhari Péter</strong>
          </p>
        </footer>

      </div>
    </Router>
  );
}

export default App;