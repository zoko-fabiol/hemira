import React from 'react';
import { t } from '../translations';
import CustomSectionCard from '../components/CustomSectionCard';

export default function CaseStudiesPage({ onNavigate, lang = 'fr', content, appearance }) {
  const defaultCs = t[lang]?.caseStudies || t.fr.caseStudies;
  const cs = content?.caseStudies || defaultCs;
  const cta = content?.ctaBand || t[lang]?.ctaBand || t.fr.ctaBand;
  const casesList = (cs.cases && cs.cases.length > 0) ? cs.cases : defaultCs.cases;

  const casesConfig = appearance?.sections?.['cases.list'] || {};
  const isCasesVisible = casesConfig.visible !== false;

  const sectionDesign = casesConfig.variant || cs.casesDesign || 'default';
  const sectionAnimation = appearance?.motion === 'expressive' ? 'float-gentle' : (cs.casesAnimation || 'default');
  const sectionAccent = appearance?.palette?.accent ? 'custom' : (cs.casesAccent || 'teal');

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow on-dark">{cs.eyebrow}</div>
          <h1>{cs.title}</h1>
          <p>{cs.lead}</p>
        </div>
      </section>

      {isCasesVisible && (
        <section 
          className={`reveal visible ${
            casesConfig.tone === 'dark' ? 'bg-navy on-dark' :
            casesConfig.tone === 'alt' ? 'bg-light' : ''
          }`} 
          style={{ padding: '60px 0' }}
          data-section-id="cases.list"
        >
          <div className="wrap">
            {(casesList || []).map((c, idx) => {
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
      )}

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
