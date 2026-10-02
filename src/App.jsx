import React, { useState, useEffect } from 'react';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminView from './admin/AdminView';
import { trackVisitor } from './services/analyticsService';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [lang, setLang] = useState('fr');
  const { getContent, settings, theme } = useSiteData();

  // Check URL pathname, query parameters or hash on load & popstate
  useEffect(() => {
    const checkIsAdmin = () => {
      const params = new URLSearchParams(window.location.search);
      const path = (window.location.pathname || '').toLowerCase();
      if (
        path === '/admin' || 
        path.startsWith('/admin') || 
        params.get('admin') === 'true' || 
        window.location.hash === '#admin'
      ) {
        setCurrentPage('admin');
      }
    };

    checkIsAdmin();
    window.addEventListener('popstate', checkIsAdmin);
    return () => window.removeEventListener('popstate', checkIsAdmin);
  }, []);

  // Track visitor and revisits on public site visits
  useEffect(() => {
    if (currentPage !== 'admin') {
      trackVisitor();
    }
  }, [currentPage]);

  const toggleLang = () => {
    setLang(prev => (prev === 'fr' ? 'en' : 'fr'));
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  // Re-run animations whenever page changes
  useEffect(() => {
    if (currentPage === 'admin') return;

    // 1. Scroll reveal (IntersectionObserver)
    const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(el => observer.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('visible'));
    }

    // 2. Animated counters
    const counters = document.querySelectorAll('[data-count-to]');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
      const animateCounter = (el) => {
        const raw = el.getAttribute('data-count-to');
        const match = raw.match(/^(\D*)(\d+)(\D*)$/);
        if (!match) return;
        const prefix = match[1], target = parseInt(match[2], 10), suffix = match[3];
        const duration = 1200;
        let start = null;
        const step = (ts) => {
          if (start === null) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = raw;
        };
        requestAnimationFrame(step);
      };

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => io.observe(el));
    }
  }, [currentPage]);

  // Back to top button & header scroll listener
  useEffect(() => {
    if (currentPage === 'admin') return;

    const handleScroll = () => {
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }

      const backBtn = document.querySelector('.back-top');
      if (backBtn) {
        if (window.scrollY > 500) {
          backBtn.classList.add('visible');
        } else {
          backBtn.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Update html lang and document title when lang changes
  useEffect(() => {
    if (currentPage === 'admin') {
      document.title = "Administration CMS — HEMIRA Travel & Services";
      return;
    }

    document.documentElement.lang = lang;
    const baseTitle = settings?.siteTitle || "HEMIRA Travel & Services";
    const titles = {
      fr: {
        home: `Accueil — ${baseTitle}`,
        about: `À propos — ${baseTitle}`,
        services: `Services — ${baseTitle}`,
        'case-studies': `Nos réalisations — ${baseTitle}`,
        contact: `Contact — ${baseTitle}`
      },
      en: {
        home: `Home — ${baseTitle}`,
        about: `About — ${baseTitle}`,
        services: `Services — ${baseTitle}`,
        'case-studies': `Our Work — ${baseTitle}`,
        contact: `Contact — ${baseTitle}`
      }
    };
    document.title = titles[lang]?.[currentPage] || baseTitle;
  }, [lang, currentPage, settings]);

  const dynamicContent = getContent(lang);

  // If in admin mode, display admin view directly
  if (currentPage === 'admin') {
    return (
      <div style={{ background: '#070E1A', minHeight: '100vh' }}>
        <div style={{
          background: 'rgba(7, 15, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          fontSize: '13px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 10002,
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#10B981', 
              boxShadow: '0 0 10px #10B981', 
              display: 'inline-block' 
            }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A968" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              <strong style={{ color: '#fff' }}>Mode Administration CMS</strong> <span style={{ color: '#94A3B8', fontSize: '12px' }}>(Base Firebase : hemira-7716d)</span>
            </span>
          </div>
          <button 
            onClick={() => navigateTo('home')}
            style={{
              background: 'linear-gradient(135deg, #F0624D, #D84B37)',
              color: '#fff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(240, 98, 77, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            ← Retour au site public
          </button>
        </div>
        <AdminView onBackToSite={() => navigateTo('home')} />
      </div>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {lang === 'en' ? 'Skip to content' : 'Aller au contenu'}
      </a>

      <Navbar 
        currentPage={currentPage}
        onNavigate={navigateTo}
        lang={lang}
        onSetLang={(l) => setLang(l)}
        onToggleLang={toggleLang}
        content={dynamicContent}
        settings={settings}
      />

      <main id="main">
        {currentPage === 'home' && (
          <HomePage onNavigate={navigateTo} lang={lang} content={dynamicContent} />
        )}
        {currentPage === 'about' && (
          <AboutPage onNavigate={navigateTo} lang={lang} content={dynamicContent} />
        )}
        {currentPage === 'services' && (
          <ServicesPage onNavigate={navigateTo} lang={lang} content={dynamicContent} />
        )}
        {currentPage === 'case-studies' && (
          <CaseStudiesPage onNavigate={navigateTo} lang={lang} content={dynamicContent} />
        )}
        {currentPage === 'contact' && (
          <ContactPage lang={lang} content={dynamicContent} settings={settings} />
        )}
      </main>

      <Footer onNavigate={navigateTo} lang={lang} content={dynamicContent} settings={settings} />

      <Chatbot lang={lang} onNavigate={navigateTo} content={dynamicContent} />

      {/* Back to top button */}
      <button 
        className="back-top" 
        aria-label="Retour en haut"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppContent />
    </SiteDataProvider>
  );
}
