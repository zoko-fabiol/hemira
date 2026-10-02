import React from 'react';
import { t } from '../translations';

export default function CaseStudiesPage({ onNavigate, lang = 'fr', content }) {
  const cs = content?.caseStudies || t[lang].caseStudies;
  const cta = content?.ctaBand || t[lang].ctaBand;

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow on-dark">{cs.eyebrow}</div>
          <h1>{cs.title}</h1>
          <p>{cs.lead}</p>
        </div>
      </section>

      <section className="reveal">
        <div className="wrap">
          {(cs.cases || []).map((c, idx) => (
            <div key={c.id || idx} className="case-card" id={c.id || `case-${idx}`}>
              <div className={`case-media ${c.media ? '' : 'logo-only'}`}>
                {c.media ? (
                  <img src={c.media} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="mosaic-mini" aria-hidden="true">
                    <span className="sq coral"></span>
                    <span className="sq gold"></span>
                    <span className="sq teal"></span>
                  </div>
                )}
              </div>
              <div className="case-body">
                <div className="case-tag">{c.tag}</div>
                <h3>{c.title}</h3>

                {(c.contexte || c.context) && (
                  <div className="case-row">
                    <strong>{cs.contextLabel || "Contexte :"}</strong>
                    <span>{c.contexte || c.context}</span>
                  </div>
                )}
                <div className="case-row">
                  <strong>{cs.needLabel || "Besoin client :"}</strong>
                  <span>{c.besoin || c.need}</span>
                </div>
                <div className="case-row">
                  <strong>{cs.interventionLabel || "Intervention HEMIRA :"}</strong>
                  <span>{c.intervention || c.response}</span>
                </div>

                <div className="case-result">
                  <strong>{cs.resultLabel || "Résultat obtenu :"}</strong> <span>{c.resultat || c.result}</span>
                </div>
              </div>
            </div>
          ))}
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
