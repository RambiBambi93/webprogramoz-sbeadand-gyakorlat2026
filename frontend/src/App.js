import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Movies from './components/Movies';
import Contact from './components/Contact';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState("Vendég");

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-container">
            <div className="logo">
              <Link to="/" className="logo-link">🎬 <span>Mozi</span>Portál</Link>
            </div>
            <nav className="nav-menu">
              <Link to="/" className="nav-link">Főoldal</Link>
              <Link to="/movies" className="nav-link">Filmek (CRUD)</Link>
              <Link to="/contact" className="nav-link">Kapcsolat</Link>
            </nav>
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              
              {/* CSAK AKKOR jelenítjük meg a nevet, ha be van jelentkezve valaki */}
              {user !== "Vendég" && (
                <span className="user-name">Bejelentkezett: <b>{user}</b></span>
              )}
              
              {/* Ha Vendég, csak a gombot látja. Ha belépett, a Kijelentkezés gombot. */}
              {user === "Vendég" ? (
                <Link to="/login" className="login-btn">Bejelentkezés</Link>
              ) : (
                <button 
                  onClick={() => setUser("Vendég")} 
                  className="login-btn" 
                  style={{border: 'none', cursor: 'pointer', backgroundColor: '#6c757d'}}
                >
                  Kijelentkezés
                </button>
              )}

            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/images" element={<div className="container"><h2>📷 Galéria</h2><p>Hamarosan...</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;