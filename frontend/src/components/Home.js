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

      {/* TÉRKÉP SZEKCIÓ - CINEMA CITY ALLEE */}
     {/* TÉRKÉP SZEKCIÓ - CINEMA CITY ALLEE */}
      <section className="map-section" style={{marginTop: '60px'}}>
        <h3 style={{textAlign: 'center', marginBottom: '20px'}}>📍 Itt megtalál minket: Cinema City Allee</h3>
        <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
          <iframe 
            title="Cinema City Allee Térkép"
            src="https://maps.google.com/maps?q=Cinema+City+Allee+Budapest&output=embed" 
            width="100%" 
            height="400" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        <p style={{ textAlign: 'center', marginTop: '10px', color: '#bdc3c7', fontSize: '0.9rem' }}>
          1117 Budapest, Október huszonharmadika u. 8-10.
        </p>
      </section>
    </div>
  );
}

export default Home;