import React from 'react';
import { t } from '../translations';

export default function HomePage({ onNavigate, lang = 'fr', content }) {
  const h = content?.home || t[lang].home;
  const cta = content?.ctaBand || t[lang].ctaBand;

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <div className="hero-badge">
              <span className="dot"></span>{h.badge}
            </div>
            <h1>{h.title}</h1>
            <p className="lead">{h.lead}</p>
            <div className="hero-ctas">
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} 
                className="btn btn-primary" 
                data-track="hero_cta_primary"
              >
                {h.ctaPrimary}
              </a>
              <a 
                href="#services" 
                onClick={(e) => { e.preventDefault(); onNavigate('services'); }} 
                className="btn btn-outline" 
                data-track="hero_cta_secondary"
              >
                {h.ctaSecondary}
              </a>
            </div>
          </div>

          <div className="hero-mosaic" aria-hidden="true">
            <span className="sq s1"></span>
            <span className="sq s2"></span>
            <span className="sq s3"></span>
            <span className="sq s4"></span>
            <span className="sq s5"></span>
            <span className="sq s6"></span>
            <span className="sq s7"></span>
            <span className="sq s8"></span>
            <span className="sq s9"></span>
            <span className="sq s10"></span>
            <span className="sq s11"></span>
            <span className="sq s12"></span>
          </div>

          <div className="hero-stats" style={{ gridColumn: '1 / -1' }}>
            {(h.stats || []).map((s, idx) => (
              <div key={idx} className="hero-stat">
                <div className="num" data-count-to={s.num}>{s.num}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI HEMIRA - NOS ENGAGEMENTS */}
      <section className="reveal">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">{h.commitmentsEyebrow}</div>
            <h2>{h.commitmentsTitle}</h2>
          </div>
          <div className="grid-3 reveal-stagger" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {(h.commitments || []).map((com, idx) => {
              const icons = [
                // 1. Un point de contact, plusieurs solutions (Target / Bullseye)
                <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="8"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="12" cy="12" r="0.6" fill="currentColor"/>
                </svg>,
                // 2. Rapidité et disponibilité (Compass / Navigation)
                <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"/>
                  <polygon points="15,9 13,13 9,15 11,11" fill="currentColor" stroke="none"/>
                  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
                </svg>,
                // 3. Confiance et proximité (Users / Team)
                <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="8" cy="9" r="3"/>
                  <circle cx="16" cy="9" r="3"/>
                  <path d="M3 20c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5"/>
                  <path d="M11 20c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5"/>
                </svg>
              ];
              return (
                <div key={idx} className="card">
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

      {/* NOS FONDATRICES */}
      <section className="bg-light reveal">
        <div className="wrap about-layout" style={{ alignItems: 'center' }}>
          <div className="about-photo-wrap" style={{ position: 'static' }}>
            <img 
              src="/assets/img/uploads/avatar-duo.svg" 
              alt="Jeanne Helene Epée Nsome &amp; Miriam J. Nguemdo Epse Nouzeda" 
              className="about-photo" 
            />
            <div className="about-photo-name">Jeanne Helene Epée Nsome &amp; Miriam J. Nguemdo Epse Nouzeda</div>
            <div className="about-photo-title">{h.foundersRole}</div>
          </div>
          <div>
            <div className="eyebrow">{h.foundersEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', marginBottom: '18px' }}>{h.foundersTitle}</h2>
            <p className="about-intro" style={{ marginBottom: '24px' }}>
              {h.foundersIntro}
            </p>
            <a 
              href="#about" 
              onClick={(e) => { e.preventDefault(); onNavigate('about'); }} 
              className="btn btn-outline-dark"
            >
              {h.readMore}{' '}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* NOS 6 SERVICES DE VOYAGE */}
      <section className="reveal">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">{h.servicesEyebrow}</div>
            <h2>{h.servicesTitle}</h2>
          </div>
          <div className="grid-6 reveal-stagger">
            {h.services.map((item, idx) => (
              <div key={idx} className={`mini-card ${item.highlight ? 'highlight' : ''}`}>
                <span className="step-num">{item.num}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE ACCOMPAGNEMENT */}
      <section className="bg-light reveal">
        <div className="wrap bridge-layout">
          <div>
            <div className="eyebrow">{h.bridgeEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,32px)', marginBottom: '22px' }}>{h.bridgeTitle}</h2>
            <div className="bridge-sub">{h.bridgeSub}</div>
            <div className="check-list">
              {h.bridgeItems.map((item, idx) => (
                <div key={idx} className="check-item">
                  <span className="sq"></span>
                  <p><strong>{item.title}</strong> {item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bridge-image">
            <img 
              src="/assets/img/uploads/hemira-illustration.svg" 
              alt="HEMIRA Travel &amp; Services" 
            />
          </div>
        </div>
      </section>

      {/* EXEMPLES DE VOYAGES ORGANISÉS PAR HEMIRA */}
      <section className="reveal">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">{h.casesEyebrow}</div>
            <h2>{h.casesTitle}</h2>
            <p>{h.casesLead}</p>
          </div>
          <div className="grid-3">
            {h.casesPreview.map((item, idx) => (
              <div key={idx} className="card">
                <div className="case-tag">{item.tag}</div>
                <h3 style={{ fontSize: '19px', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ marginBottom: '16px' }}>{item.desc}</p>
                <a 
                  href="#case-studies" 
                  onClick={(e) => { e.preventDefault(); onNavigate('case-studies'); }} 
                  className="btn btn-outline-dark btn-sm" 
                  data-track="case_study_read_more"
                >
                  {h.readMore}
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a 
              href="#case-studies" 
              onClick={(e) => { e.preventDefault(); onNavigate('case-studies'); }} 
              className="btn btn-primary"
            >
              {h.viewAllCases}
            </a>
          </div>
        </div>
      </section>

      {/* NOTRE ANCRAGE LOCAL */}
      <section className="bg-light reveal">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">{h.localEyebrow}</div>
            <h2>{h.localTitle}</h2>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s7-6.6 7-11.5A7 7 0 105 9.5C5 14.4 12 21 12 21z"/>
                  <circle cx="12" cy="9.5" r="2.3"/>
                </svg>
              </div>
              <h3>{h.localItems[0].title}</h3>
              <p>{h.localItems[0].desc}</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="6" cy="6" r="2.5"/>
                  <circle cx="18" cy="6" r="2.5"/>
                  <circle cx="12" cy="18" r="2.5"/>
                  <path d="M8 7l2.5 9M16 7l-2.5 9M8.4 6h7.2"/>
                </svg>
              </div>
              <h3>{h.localItems[1].title}</h3>
              <p>{h.localItems[1].desc}</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12.5l5 5L20 7"/>
                </svg>
              </div>
              <h3>{h.localItems[2].title}</h3>
              <p>{h.localItems[2].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <div className="wrap" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="eyebrow on-dark" style={{ justifyContent: 'center' }}>{cta.eyebrow}</div>
          <h2>{cta.title}</h2>
          <p style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '36px' }}>
            {cta.desc}
          </p>
          <div 
            className="cta-contact-box"
            onClick={() => window.location.href = 'mailto:contact@hemiraservices.com'}
          >
            <span className="label">{cta.label}</span>
            <a 
              href="mailto:contact@hemiraservices.com" 
              data-track="cta_final"
              onClick={(e) => e.stopPropagation()}
            >
              contact@hemiraservices.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
