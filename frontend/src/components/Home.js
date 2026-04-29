import React from 'react';

function Home() {
  return (
    <div className="container">
      <h2 style={{textAlign: 'center', margin: '20px 0'}}>Üdvözöljük a Moziműsor Projektben!</h2>
      
      <section className="video-section" style={{marginTop: '30px'}}>
        <div className="video-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px'}}>
          
          {/* Első videó: Cinema City */}
          <div className="video-card" style={{width: '100%', maxWidth: '800px'}}>
            <h3 style={{textAlign: 'center', marginBottom: '15px'}}>Cinema City</h3>
            <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 6px 15px rgba(0,0,0,0.3)'}}>
              <iframe 
                style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
                src="https://www.youtube.com/embed/OTMqxc48ERg" 
                title="Cinema City" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </div>

          {/* Második videó: A Gyűrűk Ura */}
          <div className="video-card" style={{width: '100%', maxWidth: '800px'}}>
            <h3 style={{textAlign: 'center', marginBottom: '15px'}}>A Gyűrűk Ura Jubileumi Vetítés 4K Extended</h3>
            <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 6px 15px rgba(0,0,0,0.3)'}}>
              <iframe 
                style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
                src="https://www.youtube.com/embed/zckJCxYxn1g" 
                title="A Gyűrűk Ura" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </div>

        </div>
      </section>

      <section className="map-section" style={{marginTop: '60px'}}>
        <h3 style={{textAlign: 'center', marginBottom: '20px'}}>📍 Hol talál meg minket?</h3>
        <iframe 
          title="Google Maps - Mozi helyszín"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.845012586022!2d19.06798151562305!3d47.48512147917696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc5a24ecfcab%3A0x6c6e755252834db9!2sCorvin%20Mozi!5e0!3m2!1shu!2shu!4v1683050141258!5m2!1shu!2shu" 
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