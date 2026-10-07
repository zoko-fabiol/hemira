import React from 'react';
import { t } from '../translations';
import CustomSectionCard from '../components/CustomSectionCard';

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
        <div className="wrap reveal-stagger">
          {(cs.cases || []).map((c, idx) => {
            const sectionDesign = cs.casesDesign || 'default';
            const sectionAnimation = cs.casesAnimation || 'default';
            const sectionAccent = cs.casesAccent || 'teal';

            return (
              <CustomSectionCard
                key={c.id || idx}
                type="case"
                item={{
                  ...c,
                  design: sectionDesign,
                  animation: sectionAnimation,
                  accentColor: sectionAccent
                }}
                index={idx}
                extraLabels={cs}
              />
            );
          })}
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
