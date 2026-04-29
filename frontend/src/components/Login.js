import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [fnev, setFnev] = useState('');
  const [pw, setPw] = useState('');
  const [hiba, setHiba] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setHiba("");

    try {
      const response = await fetch('http://localhost:8000/api.php?adat=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: fnev, password: pw }),
      });
      
      const res = await response.json();

      if (res.status === "success") {
        setUser(res.user); 
        navigate('/');    
      } else {
        setHiba(res.message || "Hibás adatok!");
      }
    } catch (err) {
      setHiba("Nem sikerült elérni a szervert!");
    }
  };

  return (
    <div className="container" style={{maxWidth: '400px', marginTop: '50px'}}>
      <div className="stats-bar" style={{textAlign: 'center', marginBottom: '20px'}}>
        <h2>🔑 Bejelentkezés</h2>
      </div>
      <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <div>
          <label>Felhasználónév:</label>
          <input 
            type="text" 
            className="search-bar" 
            style={{width: '100%', position: 'static', marginTop: '5px'}}
            value={fnev}
            onChange={(e) => setFnev(e.target.value)}
            required 
          />
        </div>
        <div>
          <label>Jelszó:</label>
          <input 
            type="password" 
            className="search-bar" 
            style={{width: '100%', position: 'static', marginTop: '5px'}}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required 
          />
        </div>
        
        {hiba && <p style={{color: 'red', fontWeight: 'bold', textAlign: 'center'}}>{hiba}</p>}
        
        <button type="submit" className="login-btn" style={{width: '100%', height: '45px', border: 'none', cursor: 'pointer'}}>
          Belépés
        </button>
      </form>
    </div>
  );
}

export default Login;