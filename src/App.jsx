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
import { trackVisitor } from './services/analyticsService';

const AdminView = React.lazy(() => import('./admin/AdminView'));

const PAGE_ROUTES = {
  home: '/',
  about: '/about',
  services: '/services',
  'case-studies': '/case-studies',
  contact: '/contact',
  admin: '/admin'
};

const normalizePage = (p) => {
  if (!p) return 'home';
  const clean = p.toLowerCase().trim().replace(/^\//, '');
  if (clean === 'about' || clean === 'a-propos') return 'about';
  if (clean === 'services') return 'services';
  if (clean === 'case-studies' || clean === 'casestudies' || clean === 'realisations') return 'case-studies';
  if (clean === 'contact') return 'contact';
  if (clean === 'admin') return 'admin';
  return 'home';
};

const getPageFromUrl = () => {
  if (typeof window === 'undefined') return 'home';
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get('page');
  if (pageParam) return normalizePage(pageParam);
  if (params.get('admin') === 'true') return 'admin';

  const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
  if (hash && ['about', 'services', 'case-studies', 'contact', 'admin', 'home'].includes(hash)) {
    return normalizePage(hash);
  }

  const rawPath = (window.location.pathname || '').toLowerCase().replace(/\/$/, '') || '/';
  if (rawPath === '/admin' || rawPath.startsWith('/admin')) return 'admin';
  if (rawPath === '/about') return 'about';
  if (rawPath === '/services') return 'services';
  if (rawPath === '/case-studies') return 'case-studies';
  if (rawPath === '/contact') return 'contact';

  return 'home';
};

function AppContent() {
  const [currentPage, setCurrentPage] = useState(() => getPageFromUrl());
  const [lang, setLang] = useState('fr');
  const { getContent, settings, theme, appearance } = useSiteData();

  // Handle manual browser scroll restoration to prevent jarring jumps on refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Restore scroll position after page refresh (F5) if available
    const savedScroll = sessionStorage.getItem('hemira_reload_scroll');
    const savedPage = sessionStorage.getItem('hemira_reload_page');
    const initialPage = getPageFromUrl();

    if (savedScroll !== null && savedPage === initialPage) {
      const targetY = parseInt(savedScroll, 10);
      if (!isNaN(targetY) && targetY > 0) {
        const timer = setTimeout(() => {
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }, 60);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Listen to popstate (Back/Forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromUrl();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track visitor on public visits
  useEffect(() => {
    if (currentPage !== 'admin') {
      trackVisitor();
    }
  }, [currentPage]);

  const toggleLang = () => {
    setLang(prev => (prev === 'fr' ? 'en' : 'fr'));
  };

  // Navigate to tab: updates URL & scrolls cleanly to top
  const navigateTo = (page) => {
    const normalized = normalizePage(page);
    setCurrentPage(normalized);

    // Explicit tab change -> reset scroll to top & clear refresh scroll
    sessionStorage.removeItem('hemira_reload_scroll');
    sessionStorage.setItem('hemira_reload_page', normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const path = PAGE_ROUTES[normalized] || '/';
    if (window.location.pathname !== path) {
      window.history.pushState({ page: normalized }, '', path);
    }
  };

  // Re-run animations whenever page changes
  useEffect(() => {
    if (currentPage === 'admin') return;

    let observer = null;
    let counterObserver = null;

    const timer = setTimeout(() => {
      // 1. Scroll reveal (IntersectionObserver)
      const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

        reveals.forEach(el => {
          const rect = el.getBoundingClientRect();
          // If already in viewport (e.g. after scroll restoration)
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
          } else {
            observer.observe(el);
          }
        });
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

        counterObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.25 });
        counters.forEach(el => counterObserver.observe(el));
      }
    }, 60);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      counterObserver?.disconnect();
    };
  }, [currentPage]);

  // Back to top button, header scroll listener & scroll position persistence for F5
  useEffect(() => {
    if (currentPage === 'admin') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Header shadow on scroll
          const header = document.querySelector('.site-header');
          if (header) {
            header.classList.toggle('scrolled', scrollY > 20);
          }

          // Back to top visibility
          const backBtn = document.querySelector('.back-top');
          if (backBtn) {
            if (scrollY > 500) {
              backBtn.classList.add('visible');
            } else {
              backBtn.classList.remove('visible');
            }
          }

          // Persist scroll position for F5 reload
          try {
            sessionStorage.setItem('hemira_reload_scroll', scrollY.toString());
            sessionStorage.setItem('hemira_reload_page', currentPage);
          } catch {}

          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
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
        <React.Suspense fallback={<div style={{ padding: '80px 20px', textAlign: 'center', color: '#fff', fontFamily: 'sans-serif' }}>Chargement de l'administration...</div>}>
          <AdminView onBackToSite={() => navigateTo('home')} />
        </React.Suspense>
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
          <HomePage onNavigate={navigateTo} lang={lang} content={dynamicContent} appearance={appearance} />
        )}
        {currentPage === 'about' && (
          <AboutPage onNavigate={navigateTo} lang={lang} content={dynamicContent} appearance={appearance} />
        )}
        {currentPage === 'services' && (
          <ServicesPage onNavigate={navigateTo} lang={lang} content={dynamicContent} appearance={appearance} />
        )}
        {currentPage === 'case-studies' && (
          <CaseStudiesPage onNavigate={navigateTo} lang={lang} content={dynamicContent} appearance={appearance} />
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
