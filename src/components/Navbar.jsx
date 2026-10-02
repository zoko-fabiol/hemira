import React, { useState } from 'react';
import { t } from '../translations';

export default function Navbar({ currentPage, onNavigate, lang, onSetLang, onToggleLang, content, settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const n = content?.nav || t[lang].nav;

  const handleNav = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); handleNav('home'); }} 
          className="brand"
        >
          <img 
            src={settings?.logoUrl || "/assets/img/uploads/logo-hemira-full.png"} 
            alt={settings?.siteTitle || "HEMIRA Travel & Services"} 
            className="brand-logo" 
          />
        </a>

        <nav className={`main-nav ${isOpen ? 'open' : ''}`} id="main-nav">
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); handleNav('home'); }} 
            className={currentPage === 'home' ? 'active' : ''}
          >
            {n.home}
          </a>
          <a 
            href="#about" 
            onClick={(e) => { e.preventDefault(); handleNav('about'); }} 
            className={currentPage === 'about' ? 'active' : ''}
          >
            {n.about}
          </a>
          <a 
            href="#services" 
            onClick={(e) => { e.preventDefault(); handleNav('services'); }} 
            className={currentPage === 'services' ? 'active' : ''}
          >
            {n.services}
          </a>
          <a 
            href="#case-studies" 
            onClick={(e) => { e.preventDefault(); handleNav('case-studies'); }} 
            className={currentPage === 'case-studies' ? 'active' : ''}
          >
            {n.caseStudies}
          </a>
          <a 
            href="#contact" 
            onClick={(e) => { e.preventDefault(); handleNav('contact'); }} 
            className={currentPage === 'contact' ? 'active' : ''}
          >
            {n.contact}
          </a>
        </nav>

        <div className="header-actions">
          <div className="lang-switch" role="group" aria-label="Language">
            <a 
              href="#fr" 
              onClick={(e) => { e.preventDefault(); onSetLang ? onSetLang('fr') : (lang !== 'fr' && onToggleLang()); }} 
              className={lang === 'fr' ? 'active' : ''}
            >
              FR
            </a>
            <span aria-hidden="true">/</span>
            <a 
              href="#en" 
              onClick={(e) => { e.preventDefault(); onSetLang ? onSetLang('en') : (lang !== 'en' && onToggleLang()); }} 
              className={lang === 'en' ? 'active' : ''}
            >
              EN
            </a>
          </div>

          <a 
            href="#contact" 
            onClick={(e) => { e.preventDefault(); handleNav('contact'); }} 
            className="btn btn-primary btn-sm header-cta" 
            data-track="nav_cta"
          >
            {n.cta}
          </a>

          <button 
            className={`nav-toggle ${isOpen ? 'open' : ''}`} 
            id="nav-toggle" 
            aria-label="Menu" 
            aria-expanded={isOpen} 
            aria-controls="main-nav"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
