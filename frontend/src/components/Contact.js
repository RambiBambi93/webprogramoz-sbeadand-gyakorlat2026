import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({ nev: '', email: '', uzenet: '' });
  const [hiba, setHiba] = useState('');
  const [siker, setSiker] = useState(false);
  const [betoltes, setBetoltes] = useState(false);

  const ellenorzes = async (e) => {
    e.preventDefault();
    
    // 1. JS Validáció (kötelező elem a beadandóban)
    if (formData.nev.length < 3) {
      setHiba("A név túl rövid (min. 3 karakter)!");
      return;
    }
    if (!formData.email.includes('@')) {
      setHiba("Érvénytelen e-mail cím!");
      return;
    }
    if (formData.uzenet.length < 10) {
      setHiba("Az üzenet legyen legalább 10 karakter!");
      return;
    }

    setHiba("");
    setBetoltes(true);

    // 2. Küldés a Backendnek (PHP)
    try {
      const response = await fetch('http://localhost:8000/api.php?adat=uzenet_kuldes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSiker(true);
      } else {
        setHiba("Szerver hiba: " + result.message);
      }
    } catch (err) {
      setHiba("Nem sikerült kapcsolódni a szerverhez!");
      console.error(err);
    } finally {
      setBetoltes(false);
    }
  };

  return (
    <div className="container">
      <h2>📩 Kapcsolat</h2>
      {siker ? (
        <div style={{padding: '20px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center'}}>
          <h3>Szuper!</h3>
          <p>Az üzenetedet sikeresen elmentettük az adatbázisba.</p>
          <button onClick={() => setSiker(false)} className="login-btn">Új üzenet</button>
        </div>
      ) : (
        <form onSubmit={ellenorzes} noValidate>
          <div style={{marginBottom: '15px'}}>
            <label>Név:</label>
            <input 
              type="text" 
              className="search-bar" 
              style={{width: '100%', position: 'static', marginTop: '5px'}}
              value={formData.nev}
              onChange={(e) => setFormData({...formData, nev: e.target.value})}
            />
          </div>
          <div style={{marginBottom: '15px'}}>
            <label>E-mail:</label>
            <input 
              type="email" 
              className="search-bar" 
              style={{width: '100%', position: 'static', marginTop: '5px'}}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div style={{marginBottom: '15px'}}>
            <label>Üzenet:</label>
            <textarea 
              rows="5" 
              style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '5px', fontFamily: 'inherit'}}
              value={formData.uzenet}
              onChange={(e) => setFormData({...formData, uzenet: e.target.value})}
            ></textarea>
          </div>
          
          {hiba && <p style={{color: 'red', fontWeight: 'bold'}}>{hiba}</p>}
          
          <button 
            type="submit" 
            className="login-btn" 
            style={{width: '100%', cursor: 'pointer', border: 'none', opacity: betoltes ? 0.7 : 1}}
            disabled={betoltes}
          >
            {betoltes ? "Küldés..." : "Üzenet küldése"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Contact;