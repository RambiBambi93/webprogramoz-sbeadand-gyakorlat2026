import React, { useState, useEffect } from 'react';

function Movies() {
  const [filmek, setFilmek] = useState([]);
  const [mozik, setMozik] = useState([]);
  const [helyek, setHelyek] = useState([]);
  const [kereso, setKereso] = useState('');
  const [betoltes, setBetoltes] = useState(true);

  // Állapot az űrlaphoz (Hozzáadás/Szerkesztés ugyanazt használja)
  const [ujFilm, setUjFilm] = useState({ filmcim: '', mufaj: '', hossz: '' });
  
  // Ez tárolja, hogy épp melyik filmet szerkesztjük. Ha null, akkor "Hozzáadás" módban vagyunk.
  const [szerkesztesId, setSzerkesztesId] = useState(null);

  const betoltAdatok = () => {
    Promise.all([
      fetch('http://localhost:8000/api.php?adat=filmek').then(res => res.json()),
      fetch('http://localhost:8000/api.php?adat=mozik').then(res => res.json()),
      fetch('http://localhost:8000/api.php?adat=helyek').then(res => res.json())
    ])
    .then(([fAdat, mAdat, hAdat]) => {
      setFilmek(fAdat);
      setMozik(mAdat);
      setHelyek(hAdat);
      setBetoltes(false);
    })
    .catch(err => {
      console.error("Hiba:", err);
      setBetoltes(false);
    });
  };

  useEffect(() => {
    betoltAdatok();
  }, []);

  // --- TÖRLÉS ---
  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a filmet?")) {
      try {
        const response = await fetch(`http://localhost:8000/api.php?id=${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.status === "success") {
          betoltAdatok();
        }
      } catch (err) {
        alert("Hiba történt a törlés során!");
      }
    }
  };

  // --- MENTÉS (Hozzáadás VAGY Módosítás) ---
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Eldöntjük a célpontot: ha van szerkesztesId, akkor a szerkesztés API-t hívjuk
    const celAdat = szerkesztesId ? 'szerkeszt_film' : 'uj_film';
    const kuldeniValoAdat = szerkesztesId ? { ...ujFilm, fkod: szerkesztesId } : ujFilm;

    try {
      const response = await fetch(`http://localhost:8000/api.php?adat=${celAdat}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kuldeniValoAdat),
      });
      const res = await response.json();
      
      if (res.status === "success") {
        setUjFilm({ filmcim: '', mufaj: '', hossz: '' }); // Mezők ürítése
        setSzerkesztesId(null); // Kilépés szerkesztő módból
        betoltAdatok(); // Lista frissítése
      }
    } catch (err) {
      alert("Hiba történt a mentés során!");
    }
  };

  // Szerkesztés megkezdése: adatok betöltése a táblázatból az űrlapba
  const startEdit = (film) => {
    setUjFilm({ filmcim: film.filmcim, mufaj: film.mufaj, hossz: film.hossz });
    setSzerkesztesId(film.fkod);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Felugrunk az oldal tetejére az űrlaphoz
  };

  // Mégse gomb (Szerkesztés megszakítása)
  const cancelEdit = () => {
    setUjFilm({ filmcim: '', mufaj: '', hossz: '' });
    setSzerkesztesId(null);
  };

  const holVetitik = (fkod) => {
    const moziAzonositok = helyek.filter(h => h.fkod === fkod).map(h => h.moziazon);
    const talaltMozik = mozik.filter(m => moziAzonositok.includes(m.moziazon)).map(m => m.mozinev);
    return talaltMozik.length > 0 ? talaltMozik.join(', ') : 'Nincs adat';
  };

  const szurtFilmek = filmek.filter(f => 
    f.filmcim.toLowerCase().includes(kereso.toLowerCase())
  );

  if (betoltes) return <div className="container">Betöltés...</div>;

  return (
    <div className="container">
      <h2>🎬 Filmek kezelése (CRUD)</h2>

      {/* DINAMIKUS ŰRLAP (Sárga, ha szerkesztünk, Szürke, ha újat adunk hozzá) */}
      <div style={{
        backgroundColor: szerkesztesId ? '#fff3cd' : '#f8f9fa', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '25px', 
        border: '1px solid #ddd',
        transition: '0.3s'
      }}>
        <h3 style={{marginTop: 0, fontSize: '1.1rem'}}>
          {szerkesztesId ? '⚠️ Film adatainak módosítása' : '➕ Új film felvétele'}
        </h3>
        <form onSubmit={handleSave} style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <input 
            type="text" placeholder="Film címe" className="search-bar" required
            style={{position: 'static', flex: '2', minWidth: '200px'}}
            value={ujFilm.filmcim} onChange={(e) => setUjFilm({...ujFilm, filmcim: e.target.value})}
          />
          <input 
            type="text" placeholder="Műfaj" className="search-bar" required
            style={{position: 'static', flex: '1', minWidth: '150px'}}
            value={ujFilm.mufaj} onChange={(e) => setUjFilm({...ujFilm, mufaj: e.target.value})}
          />
          <input 
            type="number" placeholder="Perc" className="search-bar" required
            style={{position: 'static', width: '100px'}}
            value={ujFilm.hossz} onChange={(e) => setUjFilm({...ujFilm, hossz: e.target.value})}
          />
          <button type="submit" className="login-btn" style={{
            border: 'none', 
            cursor: 'pointer', 
            height: '40px',
            backgroundColor: szerkesztesId ? '#ffc107' : '#007bff'
          }}>
            {szerkesztesId ? 'Módosítás mentése' : 'Hozzáadás'}
          </button>
          
          {szerkesztesId && (
            <button type="button" onClick={cancelEdit} className="login-btn" style={{backgroundColor: '#6c757d', border: 'none'}}>
              Mégse
            </button>
          )}
        </form>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <h3 style={{margin: 0}}>Aktuális kínálat</h3>
        <input 
          type="text" 
          placeholder="Gyorskeresés a listában..." 
          value={kereso}
          onChange={(e) => setKereso(e.target.value)}
          className="search-bar"
          style={{position: 'static', width: '250px'}}
        />
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Film címe</th>
            <th>Műfaj</th>
            <th>Perc</th>
            <th>Mozik</th>
            <th style={{textAlign: 'center'}}>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {szurtFilmek.map((film) => (
            <tr key={film.fkod} style={{backgroundColor: szerkesztesId === film.fkod ? '#fff9db' : ''}}>
              <td><strong>{film.filmcim}</strong></td>
              <td>{film.mufaj}</td>
              <td>{film.hossz} perc</td>
              <td><small>{holVetitik(film.fkod)}</small></td>
              <td style={{textAlign: 'center', display: 'flex', gap: '5px', justifyContent: 'center'}}>
                <button 
                  onClick={() => startEdit(film)}
                  style={{backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
                >
                  Szerkeszt
                </button>
                <button 
                  onClick={() => handleDelete(film.fkod)}
                  style={{backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
                >
                  Törlés
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Movies;