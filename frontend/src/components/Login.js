import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [isReg, setIsReg] = useState(false); // Váltó a Login és Regisztráció között
  const [formData, setFormData] = useState({ vnev: '', knev: '', fnev: '', pw: '' });
  const [uzenet, setUzenet] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // A célpontot az alapján választjuk, hogy regisztrálunk vagy belépünk
    const endpoint = isReg ? './api.php?adat=regisztracio' : './api.php?adat=login';
    const payload = isReg 
      ? { vezeteknev: formData.vnev, keresztnev: formData.knev, username: formData.fnev, password: formData.pw }
      : { username: formData.fnev, password: formData.pw };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await response.json();

      if (res.status === "success") {
        if (isReg) {
          alert("Sikeres regisztráció! Most jelentkezzen be.");
          setIsReg(false); // Visszaváltunk a bejelentkezéshez
        } else {
          setUser(res.user); // Itt kapjuk meg az objektumot: vezeteknev, keresztnev, felhasznalonev
          navigate('/');
        }
      } else {
        setUzenet(res.message);
      }
    } catch (err) { setUzenet("Hálózati hiba történt."); }
  };

  return (
    <div className="container" style={{maxWidth: '400px', marginTop: '50px'}}>
      <h2 style={{textAlign:'center'}}>{isReg ? '📝 Regisztráció' : '🔑 Bejelentkezés'}</h2>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        {isReg && (
          <>
            <input type="text" placeholder="Vezetéknév" className="search-bar" style={{position:'static'}}
              onChange={(e) => setFormData({...formData, vnev: e.target.value})} required />
            <input type="text" placeholder="Keresztnév" className="search-bar" style={{position:'static'}}
              onChange={(e) => setFormData({...formData, knev: e.target.value})} required />
          </>
        )}
        <input type="text" placeholder="Felhasználónév" className="search-bar" style={{position:'static'}}
          onChange={(e) => setFormData({...formData, fnev: e.target.value})} required />
        <input type="password" placeholder="Jelszó" className="search-bar" style={{position:'static'}}
          onChange={(e) => setFormData({...formData, pw: e.target.value})} required />
        
        {uzenet && <p style={{color: '#ff4d4d', textAlign: 'center'}}>{uzenet}</p>}
        
        <button type="submit" className="login-btn" style={{width:'100%', height:'45px'}}>
          {isReg ? 'Regisztráció' : 'Belépés'}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#00d4ff'}} 
         onClick={() => {setIsReg(!isReg); setUzenet('');}}>
        {isReg ? 'Már van fiókja? Belépés' : 'Nincs fiókja? Regisztráció'}
      </p>
    </div>
  );
}

export default Login;