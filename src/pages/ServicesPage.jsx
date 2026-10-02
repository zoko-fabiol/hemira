import React from 'react';
import { t } from '../translations';

export default function ServicesPage({ onNavigate, lang = 'fr', content }) {
  const s = content?.services || t[lang].services;
  const h = content?.home || t[lang].home;
  const cta = content?.ctaBand || t[lang].ctaBand;

  const serviceIcons = [
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 16l7-2 4.5-8.5c.3-.6 1.2-.6 1.5.1L13 14l6-1.7c1.1-.3 2.1.7 1.7 1.8-.2.6-.7 1-1.3 1.2L13 17.5l-1 4.3c-.1.6-.9.8-1.3.3L9 19l-4 1 1-3-4-1z"/></svg>,
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 7"/></svg>,
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M3 8h18M3 12h18M9 4v12M15 4v12"/><path d="M9 20h6"/></svg>,
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polygon points="15,9 13,13 9,15 11,11" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>,
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 20c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5"/><path d="M11 20c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5"/></svg>,
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z"/></svg>
  ];

  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow on-dark">{s.eyebrow}</div>
          <h1>{s.title}</h1>
          <p>{s.lead}</p>
        </div>
      </section>

      {/* 1. NOS AXES STRATÉGIQUES (CE QUE NOUS FAISONS) */}
      <section className="reveal">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">{s.eyebrow}</div>
            <h2>{s.commitmentsTitle}</h2>
            <p style={{ fontSize: '17px', color: 'var(--slate)' }}>
              {s.commitmentsSub}
            </p>
          </div>

          <div className="grid-3 reveal-stagger" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {(h.commitments || []).map((com, idx) => {
              const icons = [
                // 1. Un point de contact (Bullseye)
                <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="8"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="12" cy="12" r="0.6" fill="currentColor"/>
                </svg>,
                // 2. Rapidité (Compass)
                <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"/>
                  <polygon points="15,9 13,13 9,15 11,11" fill="currentColor" stroke="none"/>
                  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
                </svg>,
                // 3. Proximité (Users)
                <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="8" cy="9" r="3"/>
                  <circle cx="16" cy="9" r="3"/>
                  <path d="M3 20c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5"/>
                  <path d="M11 20c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5"/>
                </svg>
              ];
              return (
                <div key={idx} className="card service-card" style={{ position: 'relative', paddingTop: '50px' }}>
                  <span style={{ position: 'absolute', top: '20px', right: '24px', fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: '48px', color: 'var(--border)', opacity: 0.6, lineHeight: 1 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="card-icon">
                    {icons[idx % icons.length]}
                  </div>
                  <h3>{com.title}</h3>
                  <p>{com.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. NOTRE PROCESSUS (COMMENT NOUS FAISONS) */}
      <section className="bg-light reveal">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">{s.servicesEyebrow}</div>
            <h2>{s.servicesTitle}</h2>
            <p style={{ fontSize: '17px', color: 'var(--slate)' }}>
              {s.servicesSub}
            </p>
          </div>

          <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {(s.servicesList || s.services || []).map((item, idx) => (
              <div 
                key={idx} 
                className={`mini-card ${item.highlight ? 'highlight' : ''}`}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '28px' }}
              >
                <span style={{ 
                  fontFamily: "'Sora',sans-serif", 
                  fontWeight: 900, 
                  fontSize: '28px', 
                  color: item.highlight ? 'var(--gold)' : 'var(--coral)', 
                  opacity: 0.7, 
                  lineHeight: 1, 
                  marginBottom: '6px' 
                }}>
                  {item.num}
                </span>
                <span style={{ color: 'var(--coral)', marginBottom: '8px' }}>
                  {serviceIcons[idx]}
                </span>
                <h4 style={{ fontSize: '17px', marginBottom: '6px' }}>{item.title}</h4>
                <p style={{ fontSize: '14px', color: 'var(--slate)', margin: 0 }}>{item.desc}</p>
                {item.highlight && (
                  <span style={{ 
                    marginTop: '10px', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.08em', 
                    color: 'var(--gold)', 
                    background: 'rgba(245,197,24,0.15)', 
                    padding: '4px 12px', 
                    borderRadius: '20px' 
                  }}>
                    {s.flagshipBadge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PASSERELLE DE DÉPLOIEMENT */}
      <section className="reveal">
        <div className="wrap bridge-layout">
          <div>
            <div className="eyebrow">{s.supportEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,32px)', marginBottom: '22px' }}>
              {s.supportTitle}
            </h2>
            <div className="bridge-sub" style={{ fontSize: '17px', color: 'var(--slate)', marginBottom: '28px' }}>
              {s.supportSub}
            </div>
            <div className="check-list">
              {h.bridgeItems.map((item, idx) => (
                <div key={idx} className="check-item">
                  <span className="sq" style={{ background: 'var(--teal)' }}></span>
                  <p><strong>{item.title}</strong> {item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bridge-image">
            <img 
              src="/assets/img/uploads/hemira-illustration.svg" 
              alt="HEMIRA Travel &amp; Services" 
              style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-hover)' }}
            />
          </div>
        </div>
      </section>

      {/* 4. NOTRE ANCRAGE LOCAL */}
      <section className="bg-light reveal">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">{s.localEyebrow}</div>
            <h2>{s.localTitle}</h2>
            <p style={{ fontSize: '17px', color: 'var(--slate)' }}>
              {s.localSub}
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px 32px' }}>
              <div className="card-icon" style={{ margin: '0 auto 20px', background: 'rgba(57,173,198,0.12)', color: 'var(--teal)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.6 7-11.5A7 7 0 105 9.5C5 14.4 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>
              </div>
              <h3 style={{ fontSize: '18px' }}>{h.localItems[0].title}</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--slate)' }}>{h.localItems[0].desc}</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '40px 24px 32px' }}>
              <div className="card-icon" style={{ margin: '0 auto 20px', background: 'rgba(57,173,198,0.12)', color: 'var(--teal)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l2.5 9M16 7l-2.5 9M8.4 6h7.2"/></svg>
              </div>
              <h3 style={{ fontSize: '18px' }}>{h.localItems[1].title}</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--slate)' }}>{h.localItems[1].desc}</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '40px 24px 32px' }}>
              <div className="card-icon" style={{ margin: '0 auto 20px', background: 'rgba(57,173,198,0.12)', color: 'var(--teal)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 7"/></svg>
              </div>
              <h3 style={{ fontSize: '18px' }}>{h.localItems[2].title}</h3>
              <p style={{ fontSize: '14.5px', color: 'var(--slate)' }}>{h.localItems[2].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <div className="wrap" style={{ paddingTop: '70px', paddingBottom: '70px' }}>
          <div className="eyebrow on-dark" style={{ justifyContent: 'center' }}>{cta.eyebrow}</div>
          <h2 style={{ fontSize: 'clamp(26px,3.4vw,38px)' }}>{cta.title}</h2>
          <div className="hero-ctas" style={{ justifyContent: 'center', marginTop: '10px' }}>
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} 
              className="btn btn-primary"
            >
              {cta.btn}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
