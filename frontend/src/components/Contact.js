import React, { useState } from 'react';

function Contact() {
  const [nev, setNev] = useState('');
  const [email, setEmail] = useState('');
  const [uzenet, setUzenet] = useState('');
  const [statusz, setStatusz] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusz('');

    try {
      const response = await fetch('http://localhost:8000/api.php?adat=uzenet_kuldes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nev, email, uzenet }),
      });
      const res = await response.json();
      
      if (res.status === "success") {
        setStatusz("✅ Üzenet sikeresen elküldve!");
        setNev('');
        setEmail('');
        setUzenet('');
      } else {
        setStatusz("❌ Hiba: " + res.message);
      }
    } catch (err) {
      setStatusz("❌ Hálózati hiba történt.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>✉️ Kapcsolatfelvétel</h2>
      
      {/* ITT VAN A KESKENYEBB, KÖZÉPRE IGAZÍTOTT DOBOZ */}
      <div style={{
        maxWidth: '65%',         /* Szélesség lekorlátozása 65%-ra */
        margin: '0 auto',        /* Középre igazítás */
        backgroundColor: '#1a1c22', /* Sötét doboz, hogy passzoljon a témához */
        padding: '30px', 
        borderRadius: '12px',
        border: '1px solid #34495e',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
      }}>
        <p style={{ textAlign: 'center', marginBottom: '25px', color: '#bdc3c7' }}>
          Kérdése van? Írjon nekünk, és hamarosan válaszolunk!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Név:</label>
            <input 
              type="text" 
              className="search-bar" 
              style={{ width: '100%', boxSizing: 'border-box' }}
              value={nev} 
              onChange={(e) => setNev(e.target.value)} 
              placeholder="Pl. Gipsz Jakab"
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>E-mail cím:</label>
            <input 
              type="email" 
              className="search-bar" 
              style={{ width: '100%', boxSizing: 'border-box' }}
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="pelda@email.hu"
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Üzenet:</label>
            <textarea 
              className="search-bar" 
              rows="6" 
              style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
              value={uzenet} 
              onChange={(e) => setUzenet(e.target.value)} 
              placeholder="Ide írja az üzenetét..."
              required 
            ></textarea>
          </div>
          
          {/* Visszajelző üzenet (sikeres/sikertelen küldés) */}
          {statusz && (
            <p style={{ 
              textAlign: 'center', 
              color: statusz.includes('❌') ? '#ff4d4d' : '#2ecc71', 
              fontWeight: 'bold',
              margin: '10px 0'
            }}>
              {statusz}
            </p>
          )}
          
          <button type="submit" className="login-btn" style={{ height: '45px', border: 'none', cursor: 'pointer', width: '100%', fontSize: '1rem', marginTop: '10px' }}>
            Üzenet küldése
          </button>
        </form>
      </div>

      {/* Mobilos nézet miatt, ha nagyon összeugrik a képernyő, alkalmazkodni fog */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="maxWidth: 65%"] {
            max-width: 95% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Contact;