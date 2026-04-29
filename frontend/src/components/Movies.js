import React, { useState, useEffect } from 'react';

function Movies() {
  const [filmek, setFilmek] = useState([]);
  const [mozik, setMozik] = useState([]);
  const [helyek, setHelyek] = useState([]);
  const [kereso, setKereso] = useState('');
  const [betoltes, setBetoltes] = useState(true);

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

  const szurtFilmek = filmek.filter(f => 
    f.filmcim.toLowerCase().includes(kereso.toLowerCase())
  );

  const holVetitik = (fkod) => {
    const moziAzonositok = helyek.filter(h => h.fkod === fkod).map(h => h.moziazon);
    const talaltMozik = mozik.filter(m => moziAzonositok.includes(m.moziazon)).map(m => m.mozinev);
    return talaltMozik.length > 0 ? talaltMozik.join(', ') : 'Nincs adat';
  };

  if (betoltes) return <div className="container">Betöltés...</div>;

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h2>🎬 Filmek és Mozik</h2>
        <input 
          type="text" 
          placeholder="Keresés..." 
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
          </tr>
        </thead>
        <tbody>
          {szurtFilmek.map((film) => (
            <tr key={film.fkod}>
              <td><strong>{film.filmcim}</strong></td>
              <td>{film.mufaj}</td>
              <td>{film.hossz}</td>
              <td>{holVetitik(film.fkod)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Movies;