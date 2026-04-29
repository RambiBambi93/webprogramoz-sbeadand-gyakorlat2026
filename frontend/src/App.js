import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Állapotok (state) az adatok tárolására
  const [filmek, setFilmek] = useState([]);
  const [mozik, setMozik] = useState([]);
  const [helyek, setHelyek] = useState([]);
  const [kereso, setKereso] = useState('');
  const [betoltes, setBetoltes] = useState(true);

  useEffect(() => {
    // Adatok lekérése a PHP backendtől
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
      console.error("Hiba történt az adatok betöltésekor:", err);
      setBetoltes(false);
    });
  }, []);

  // Szűrés a keresőmező alapján
  const szurtFilmek = filmek.filter(f => 
    f.filmcim.toLowerCase().includes(kereso.toLowerCase())
  );

  // Relációs logika: Film összekötése a mozikkal a 'helyek' táblán keresztül
  const holVetitik = (fkod) => {
    // Megkeressük az összes moziazonosítót ehhez a filmhez
    const moziAzonositok = helyek
      .filter(h => h.fkod === fkod)
      .map(h => h.moziazon);
    
    // Kikvesszük a mozik neveit
    const talaltMozik = mozik
      .filter(m => moziAzonositok.includes(m.moziazon))
      .map(m => m.mozinev);

    return talaltMozik.length > 0 ? talaltMozik.join(', ') : 'Nincs adat';
  };

  if (betoltes) {
    return <div className="loading">Adatok betöltése a szerverről...</div>;
  }

  return (
    <div className="App">
      {/* Kompakt fejléc: h1 és input egy sorban (flexbox-szal a CSS-ben) */}
      <header className="App-header">
        <h1>🎬 Moziműsor 2026</h1>
        <input 
          type="text" 
          placeholder="Gyorskeresés..." 
          value={kereso}
          onChange={(e) => setKereso(e.target.value)}
          className="search-bar"
        />
      </header>

      <main>
        <div className="movie-container">
          <div className="stats-bar">
            Találatok: <strong>{szurtFilmek.length}</strong> film
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Film címe</th>
                <th>Műfaj</th>
                <th>Perc</th>
                <th>Mozik, ahol vetítik</th>
              </tr>
            </thead>
            <tbody>
              {szurtFilmek.map((film) => (
                <tr key={film.fkod}>
                  <td><strong>{film.filmcim}</strong></td>
                  <td>{film.mufaj}</td>
                  <td>{film.hossz}</td>
                  <td className="cinema-list">{holVetitik(film.fkod)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {szurtFilmek.length === 0 && (
            <p className="empty-msg">Nincs a keresésnek megfelelő találat.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;