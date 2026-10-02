import React from 'react';
import { t } from '../translations';

export default function Footer({ onNavigate, lang = 'fr', content, settings }) {
  const f = content?.footer || t[lang].footer;
  const n = content?.nav || t[lang].nav;

  const handleNav = (page) => {
    onNavigate(page);
  };

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          
          {/* Colonne 1 : Marque + réseaux sociaux */}
          <div className="footer-brand">
            <img 
              src={settings?.logoUrl || "/assets/img/uploads/logo-hemira-white.png"} 
              alt={settings?.siteTitle || "HEMIRA Travel & Services"} 
              className="footer-logo" 
            />
            <p className="footer-tagline">
              {f.tagline}
            </p>
            <div className="footer-social"></div>
            <div className="mosaic-mini" aria-hidden="true">
              <span className="sq coral"></span>
              <span className="sq gold"></span>
              <span className="sq teal"></span>
              <span className="sq gold"></span>
            </div>
          </div>

          {/* Colonne 2 : Navigation */}
          <div className="footer-col">
            <h4>{f.navTitle}</h4>
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNav('home'); }}>{n.home}</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleNav('about'); }}>{n.about}</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); handleNav('services'); }}>{n.services}</a>
            <a href="#case-studies" onClick={(e) => { e.preventDefault(); handleNav('case-studies'); }}>{n.caseStudies}</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNav('contact'); }}>{n.contact}</a>
          </div>

          {/* Colonne 3 : Contact */}
          <div className="footer-col">
            <h4>{f.contactTitle}</h4>
            <a href={`mailto:${settings?.email || "contact@hemiraservices.com"}`} data-track="footer_email">
              {settings?.email || "contact@hemiraservices.com"}
            </a>
            <a href={`tel:${(settings?.phone1 || "+237699976258").replace(/\s+/g, '')}`} data-track="team_call_jeanne">
              Jeanne Helene Epée Nsome — {settings?.phone1 || "+237 671 28 35 34"}
            </a>
            <a href={`tel:${(settings?.phone2 || "+237699430256").replace(/\s+/g, '')}`} data-track="team_call_miriam">
              Miriam Nguemdo Nouzeda — {settings?.phone2 || "+237 691 64 63 94"}
            </a>
            <span className="footer-address">{settings?.address || f.address}</span>
          </div>

          {/* Colonne 4 : Infos supplémentaires */}
          <div className="footer-col footer-extra">
            <h4>{f.aboutTitle}</h4>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              {f.aboutText1}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
              {f.aboutText2}
            </p>
          </div>

        </div>

        {/* Barre du bas */}
        <div className="footer-bottom">
          <span>{f.copyright}</span>
          <div>
            <span>{f.bottomAddress}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
