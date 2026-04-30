import React, { useState, useEffect } from 'react';

function Messages() {
  const [uzenetek, setUzenetek] = useState([]);

  useEffect(() => {
    // JAVÍTVA: Relatív útvonal, hogy a szerver és a böngésző ne vesszenek össze
    fetch('./api.php?adat=uzenetek')
      .then(res => res.json())
      .then(data => setUzenetek(data))
      .catch(err => console.error("Hiba az üzenetek lekérésekor:", err));
  }, []);

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>📨 Beérkezett üzenetek</h2>
      <table>
        <thead>
          <tr>
            <th>Időpont</th>
            <th>Név</th>
            <th>E-mail</th>
            <th>Üzenet</th>
          </tr>
        </thead>
        <tbody>
          {uzenetek.map(msg => (
            <tr key={msg.id}>
              <td style={{ whiteSpace: 'nowrap' }}>{msg.datum}</td>
              <td><strong>{msg.nev}</strong></td>
              <td>{msg.email}</td>
              <td>{msg.uzenet}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uzenetek.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>Nincsenek üzenetek.</p>}
    </div>
  );
}

export default Messages;