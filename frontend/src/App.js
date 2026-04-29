import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Movies from './components/Movies';
import Contact from './components/Contact';
import Login from './components/Login';
import Images from './components/Images';     // ÚJ KOMPONENS BEKÖTVE
import Messages from './components/Messages'; // ÚJ KOMPONENS BEKÖTVE
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
              <Link to="/movies" className="nav-link">Filmek</Link>
              <Link to="/images" className="nav-link">Képek</Link>
              <Link to="/contact" className="nav-link">Kapcsolat</Link>
              
              {/* Üzenetek menü CSAK ha be van jelentkezve */}
              {user !== "Vendég" && (
                <Link to="/messages" className="nav-link" style={{color: '#f1c40f'}}>Üzenetek</Link>
              )}
            </nav>
            <div className="user-info">
              {user !== "Vendég" && (
                <span className="user-name">Bejelentkezett: <b>{user}</b></span>
              )}
              {user === "Vendég" ? (
                <Link to="/login" className="login-btn">Bejelentkezés</Link>
              ) : (
                <button onClick={() => setUser("Vendég")} className="login-btn" style={{border: 'none', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white'}}>Kijelentkezés</button>
              )}
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/contact" element={<Contact user={user} />} />
            <Route path="/images" element={<Images user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            {/* Védett útvonal: Ha nincs belépve, visszadobja a Főoldalra */}
            <Route path="/messages" element={user !== "Vendég" ? <Messages /> : <Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;