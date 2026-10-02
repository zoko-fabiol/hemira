import React from 'react';
import { t } from '../translations';

export default function AboutPage({ onNavigate, lang = 'fr', content }) {
  const a = content?.about || t[lang].about;
  const cta = content?.ctaBand || t[lang].ctaBand;

  React.useEffect(() => {
    const items = document.querySelectorAll('.bullet-item');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          } else {
            entry.target.classList.remove('active');
          }
        });
      },
      {
        rootMargin: '-15% 0px -40% 0px',
        threshold: 0.1
      }
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [a.bullets]);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow on-dark">{a.eyebrow}</div>
          <h1>{a.title}</h1>
          <p>{a.lead}</p>
        </div>
      </section>

      <section className="about-founders-section">
        <div className="wrap about-layout">
          <div className="about-photo-wrap">
            <img 
              src="/assets/img/uploads/avatar-duo.svg" 
              alt="Jeanne Helene Epée Nsome &amp; Miriam J. Nguemdo Epse Nouzeda" 
              className="about-photo" 
            />
            <div className="about-photo-name">Jeanne Helene Epée Nsome &amp; Miriam J. Nguemdo Epse Nouzeda</div>
            <div className="about-photo-title">{a.role}</div>
            <div className="mosaic-mini" style={{ justifyContent: 'center' }} aria-hidden="true">
              <span className="sq coral"></span>
              <span className="sq gold"></span>
              <span className="sq teal"></span>
              <span className="sq gold"></span>
            </div>
          </div>
          <div>
            <div className="bullet-list reveal-stagger">
              {a.bullets.map((item, i) => (
                <div key={i} className="bullet-item">
                  <span className={`bullet-marker sq ${item.color}`}></span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light reveal">
        <div className="wrap" style={{ maxWidth: '820px' }}>
          <div className="section-head">
            <h2>{a.storyTitle}</h2>
          </div>
          <p style={{ fontSize: '17px', color: 'var(--slate)', whiteSpace: 'pre-line' }}>
            {a.storyText}
          </p>
        </div>
      </section>

      <section className="reveal">
        <div className="wrap">
          <div className="section-head center">
            <h2>{a.teamTitle}</h2>
          </div>
          <div className="grid-2 reveal-stagger">
            <div className="card" style={{ textAlign: 'center' }}>
              <img 
                src="/assets/img/uploads/avatar-jeanne.svg" 
                alt="Jeanne Helene Epée Nsome" 
                style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', border: '4px solid var(--coral)' }} 
              />
              <h3>Jeanne Helene Epée Nsome</h3>
              <p style={{ color: 'var(--coral)', fontWeight: 600, fontSize: '14px' }}>{a.jeanneRole}</p>
              <p style={{ fontSize: '14px', color: 'var(--slate)', margin: '12px 0' }}>
                {a.jeanneBio}
              </p>
              <a 
                href="tel:+237699976258" 
                style={{ color: 'var(--teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 006 6l1.5-2L21 15v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>
                </svg> 
                699 976 258 / 677 119 086
              </a>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <img 
                src="/assets/img/uploads/avatar-miriam.svg" 
                alt="Miriam J. Nguemdo Epse Nouzeda" 
                style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', border: '4px solid var(--coral)' }} 
              />
              <h3>Miriam J. Nguemdo Epse Nouzeda</h3>
              <p style={{ color: 'var(--coral)', fontWeight: 600, fontSize: '14px' }}>{a.miriamRole}</p>
              <p style={{ fontSize: '14px', color: 'var(--slate)', margin: '12px 0' }}>
                {a.miriamBio}
              </p>
              <a 
                href="tel:+237699430256" 
                style={{ color: 'var(--teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 006 6l1.5-2L21 15v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>
                </svg> 
                699 430 256 / 675 732 338
              </a>
            </div>
          </div>
        </div>
      </section>

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
