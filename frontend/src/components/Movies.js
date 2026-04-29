import React, { useState, useEffect } from 'react';

function Movies() {
  // 1. Állapotok (state) másolása
  const [filmek, setFilmek] = useState([]);
  const [mozik, setMozik] = useState([]);
  const [helyek, setHelyek] = useState([]);
  const [kereso, setKereso] = useState('');
  const [betoltes, setBetoltes] = useState(true);

  // 2. Adatlekérés (useEffect) másolása
  useEffect(() => {
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
  }, []);

  // 3. Szűrési és relációs logika másolása
  const szurtFilmek = filmek.filter(f => 
    f.filmcim.toLowerCase().includes(kereso.toLowerCase())
  );

  const holVetitik = (fkod) => {
    const moziAzonositok = helyek
      .filter(h => h.fkod === fkod)
      .map(h => h.moziazon);
    
    const talaltMozik = mozik
      .filter(m => moziAzonositok.includes(m.moziazon))
      .map(m => m.mozinev);

    return talaltMozik.length > 0 ? talaltMozik.join(', ') : 'Nincs adat';
  };

  if (betoltes) return <div className="loading">Betöltés...</div>;

  // 4. A megjelenítés (JSX) másolása
  return (
    <div className="movie-container">
      {/* Kereső sáv (most már az oldal része, nem a fejlécé, hogy kényelmesebb legyen) */}
      <div className="movies-controls" style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>🎬 Filmek listája</h2>
        <input 
          type="text" 
          placeholder="Keresés cím alapján..." 
          value={kereso}
          onChange={(e) => setKereso(e.target.value)}
          className="search-bar"
          style={{position: 'static', width: '300px'}} // Itt felülírjuk a korábbi fejléc-stílust
        />
      </div>

      <div className="stats-bar">
        Találatok: <strong>{szurtFilmek.length}</strong> film
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Film címe</th>
            <th>Műfaj</th>
            <th>Hossz</th>
            <th>Mozik</th>
          </tr>
        </thead>
        <tbody>
          {szurtFilmek.map((film) => (
            <tr key={film.fkod}>
              <td><strong>{film.filmcim}</strong></td>
              <td>{film.mufaj}</td>
              <td>{film.hossz} perc</td>
              <td className="cinema-list">{holVetitik(film.fkod)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Movies;