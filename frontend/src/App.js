import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Movies from './components/Movies';
import Contact from './components/Contact';
import './App.css';

function App() {
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
              <Link to="/images" className="nav-link">Képek</Link>
            </nav>
            <div className="user-info">
              <span className="user-name">Bejelentkezett: <b>Vendég</b></span>
              <Link to="/login" className="login-btn">Bejelentkezés</Link>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/images" element={<div className="container"><h2>📷 Galéria</h2><p>Hamarosan...</p></div>} />
            <Route path="/login" element={<div className="container"><h2>🔑 Belépés</h2><p>Hamarosan...</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;