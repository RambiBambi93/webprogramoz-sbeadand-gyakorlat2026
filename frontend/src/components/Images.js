import React, { useState, useEffect } from 'react';

function Images({ user }) {
  const [kepek, setKepek] = useState([]);
  const [kivalasztottKep, setKivalasztottKep] = useState(null);

  const betoltKepek = async () => {
    try {
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
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📷 Mozi Galéria</h2>

      {/* Feltöltő rész szépítése */}
      {user !== "Vendég" && (
        <div style={{ 
          backgroundColor: '#1a1c22', 
          padding: '25px', 
          borderRadius: '15px', 
          marginBottom: '40px', 
          textAlign: 'center', 
          border: '1px dashed #3498db',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#3498db' }}>Új pillanatkép hozzáadása</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              id="kep-input"
              type="file" 
              accept="image/*" 
              onChange={(e) => setKivalasztottKep(e.target.files[0])} 
              style={{ 
                color: '#bdc3c7',
                padding: '10px',
                backgroundColor: '#2c3e50',
                borderRadius: '8px'
              }} 
              required 
            />
            <button type="submit" className="login-btn" style={{ padding: '12px 25px', border: 'none', cursor: 'pointer' }}>
              Feltöltés indítása
            </button>
          </form>
        </div>
      )}

      {/* Galéria rács (Grid) szépítése */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px',
        padding: '10px'
      }}>
        {kepek.map(kep => (
          <div key={kep.id} className="gallery-card">
            <div style={{ 
              overflow: 'hidden', 
              borderRadius: '12px', 
              backgroundColor: '#1a1c22',
              boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
              border: '1px solid #34495e',
              transition: 'transform 0.3s ease'
            }}>
              <img 
                src={`./uploads/${kep.fajlnev}`} 
                alt="Mozi pillanatkép" 
                style={{ 
                  width: '100%', 
                  height: '250px', // Kicsit magasabb, hogy jobban látszódjon
                  objectFit: 'cover', // Kitölti a teret torzítás nélkül
                  display: 'block',
                  transition: 'filter 0.3s ease'
                }} 
              />
            </div>
          </div>
        ))}
      </div>

      {kepek.length === 0 && (
        <p style={{ textAlign: 'center', color: '#bdc3c7', marginTop: '50px', fontSize: '1.2rem' }}>
          Még nem érkeztek képek a galériába.
        </p>
      )}

      {/* CSS animációk az App.css-be vagy ide */}
      <style>{`
        .gallery-card:hover div {
          transform: translateY(-5px);
          border-color: #3498db;
        }
        .gallery-card:hover img {
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
}

export default Images;