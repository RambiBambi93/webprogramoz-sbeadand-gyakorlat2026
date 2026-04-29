import React, { useState } from 'react';

function Contact({ user }) {
  const [email, setEmail] = useState('');
  const [uzenet, setUzenet] = useState('');
  const [statusz, setStatusz] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusz('');

    try {
      // Itt a 'nev' fixen a 'user' változó (Vendég vagy a belépett felhasználó)
      const response = await fetch('http://localhost:8000/api.php?adat=uzenet_kuldes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nev: user, email, uzenet }),
      });
      const res = await response.json();
      
      if (res.status === "success") {
        setStatusz("✅ Üzenet sikeresen elküldve!");
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
      
      <div style={{
        maxWidth: '65%',         
        margin: '0 auto',        
        backgroundColor: '#1a1c22', 
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
            {/* ÍRÁSVÉDETT MEZŐ */}
            <input 
              type="text" 
              className="search-bar" 
              style={{ 
                width: '100%', 
                boxSizing: 'border-box', 
                backgroundColor: '#dcdde1', // Kicsit szürkés háttér
                cursor: 'not-allowed',      // "Tilos" egérmutató
                color: '#2f3640'            // Sötétszürke betű
              }}
              value={user} 
              readOnly 
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