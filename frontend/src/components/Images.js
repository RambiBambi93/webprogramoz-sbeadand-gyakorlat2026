import React, { useState, useEffect } from 'react';

function Images({ user }) {
  const [kepek, setKepek] = useState([]);
  const [kivalasztottKep, setKivalasztottKep] = useState(null);

  const betoltKepek = async () => {
    try {
      // JAVÍTVA: Relatív útvonalat használunk (./api.php)
      const response = await fetch('./api.php?adat=kepek');
      const data = await response.json();
      setKepek(data);
    } catch (error) {
      console.error("Hiba a képek betöltésekor:", error);
    }
  };

  useEffect(() => { 
    betoltKepek(); 
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!kivalasztottKep) {
        alert("Kérlek, válassz ki egy képet először!");
        return;
    }

    const formData = new FormData();
    formData.append('kep', kivalasztottKep);

    try {
      // JAVÍTVA: Relatív útvonal a feltöltéshez is
      const response = await fetch('./api.php?adat=kep_feltoltes', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
          alert("✅ Kép sikeresen feltöltve!");
          setKivalasztottKep(null);
          document.getElementById("kep-input").value = ""; 
          betoltKepek(); 
      } else {
          alert("❌ Hiba történt: " + result.message); 
      }
      
    } catch (error) {
      console.error("Hiba a feltöltés során:", error);
      alert("❌ Hálózati hiba! Lehet, hogy túl nagy a kép mérete.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>📷 Képgaléria</h2>

      {user !== "Vendég" && (
        <div style={{ backgroundColor: '#1a1c22', padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', border: '1px solid #34495e' }}>
          <h3>Új kép feltöltése</h3>
          <form onSubmit={handleUpload}>
            <input 
              id="kep-input"
              type="file" 
              accept="image/*" 
              onChange={(e) => setKivalasztottKep(e.target.files[0])} 
              style={{ color: 'white' }} 
              required 
            />
            <button type="submit" className="login-btn" style={{ marginLeft: '10px', cursor: 'pointer', border: 'none' }}>
              Feltöltés
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {kepek.map(kep => (
          <div key={kep.id} style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            <img 
              // JAVÍTVA: A képek forrását is relatívan adjuk meg az uploads mappához
              src={`./uploads/${kep.fajlnev}`} 
              alt="Galéria" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
          </div>
        ))}
      </div>
      {kepek.length === 0 && <p style={{ textAlign: 'center' }}>Még nincsenek feltöltött képek.</p>}
    </div>
  );
}

export default Images;