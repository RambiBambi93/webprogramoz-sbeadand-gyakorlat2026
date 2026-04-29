import React from 'react';

function Home() {
  return (
    <div className="container">
      <h2 style={{textAlign: 'center', margin: '20px 0'}}>Üdvözöljük a Moziműsor Projektben!</h2>
      
      <section className="video-section">
        <h3>🎬 Bemutató videók</h3>
        <div className="video-container" style={{display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center'}}>
          {/* Saját videó - Győződj meg róla, hogy a frontend/public mappában ott van a sajat.mp4! */}
          <div className="video-card">
            <p><strong>Saját bemutatkozó (5mp):</strong></p>
            <video width="400" height="225" controls style={{borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'}}>
              <source src="/sajat.mp4" type="video/mp4" />
              A böngésző nem támogatja a videót.
            </video>
          </div>

          {/* YouTube videó */}
          <div className="video-card">
            <p><strong>YouTube előzetes:</strong></p>
            <iframe 
              width="400" 
              height="225" 
              src="https://www.youtube.com/embed/ScMzIvxBSi4" 
              title="YouTube filmelőzetes" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'}}
            ></iframe>
          </div>
        </div>
      </section>

      <section className="map-section" style={{marginTop: '40px'}}>
        <h3>📍 Hol talál meg minket?</h3>
        {/* Itt egy valódi Google Térkép beágyazás (Corvin Mozi példa) */}
        <iframe 
          title="Google Maps - Mozi helyszín"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2696.025345710633!2d19.068281376884042!3d47.4893817960352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc5ec749f767%3A0x67396a56e073c683!2sCorvin%20mozi!5e0!3m2!1shu!2shu!4v1714392000000!5m2!1shu!2shu" 
          width="100%" 
          height="350" 
          style={{border:0, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}

export default Home;