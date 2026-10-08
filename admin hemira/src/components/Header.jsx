import React from 'react';
import { ExternalLink, Menu, Sun, Moon, Sparkles } from 'lucide-react';

export default function Header({ 
  activeTabName, 
  lang, 
  setLang, 
  onOpenMobileMenu, 
  themeMode = 'light', 
  onToggleTheme,
  onNavigateAppearance 
}) {
  const publicSiteUrl = typeof window !== 'undefined' && window.location.port === '5174'
    ? `${window.location.protocol}//${window.location.hostname}:5173/`
    : 'http://localhost:5173/';

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button 
          type="button" 
          className="admin-menu-toggle" 
          onClick={onOpenMobileMenu}
          aria-label="Ouvrir le menu de navigation"
        >
          <Menu size={19} />
        </button>

        <div className="admin-header-title">
          <h1 title={activeTabName}>{activeTabName}</h1>
        </div>
      </div>

      <div className="admin-header-actions">
        {/* Visual Appearance Studio button */}
        <button
          type="button"
          className="admin-btn admin-btn-outline"
          onClick={onNavigateAppearance}
          title="Ouvrir le studio d'apparence et design visuel"
          style={{ gap: '6px', background: 'rgba(240, 98, 77, 0.08)', borderColor: 'rgba(240, 98, 77, 0.3)' }}
        >
          <Sparkles size={15} color="var(--admin-coral, #F0624D)" />
          <span className="theme-toggle-text" style={{ fontWeight: 700 }}>Apparence</span>
        </button>

        {/* Theme mode toggle (Light / Dark) */}
        <button
          type="button"
          className="admin-btn admin-btn-outline theme-toggle-btn"
          onClick={onToggleTheme}
          title={themeMode === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
          aria-label={themeMode === 'light' ? 'Mode Sombre' : 'Mode Clair'}
        >
          {themeMode === 'light' ? (
            <>
              <Moon size={15} />
              <span className="theme-toggle-text">Mode Sombre</span>
            </>
          ) : (
            <>
              <Sun size={15} color="var(--admin-gold)" />
              <span className="theme-toggle-text">Mode Clair</span>
            </>
          )}
        </button>

        <div className="firebase-status-badge" title="Connecté à Firebase (hemira-7716d)">
          <div className="firebase-status-dot"></div>
          <span className="firebase-status-text">hemira-7716d</span>
        </div>

        {/* Global language toggle */}
        <div className="admin-lang-toggle">
          <button 
            type="button"
            className={`admin-lang-btn ${lang === 'fr' ? 'active' : ''}`}
            onClick={() => setLang('fr')}
          >
            FR
          </button>
          <button 
            type="button"
            className={`admin-lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>

        <a 
          href={publicSiteUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="admin-btn admin-btn-outline admin-header-site-btn"
          title="Ouvrir le site public"
          aria-label="Ouvrir le site public"
        >
          <ExternalLink size={15} />
        </a>
      </div>
    </header>
  );
}
