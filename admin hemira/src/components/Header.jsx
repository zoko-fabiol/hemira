import React from 'react';
import { ExternalLink, Menu, Sun, Moon, Palette } from 'lucide-react';

export default function Header({ 
  activeTabName, 
  lang, 
  setLang, 
  onOpenMobileMenu, 
  themeMode = 'light', 
  onToggleTheme,
  onOpenThemeModal 
}) {
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
        {/* Global Color Theme Preset Modal */}
        <button
          type="button"
          className="admin-btn admin-btn-outline"
          onClick={onOpenThemeModal}
          title="Choisir le thème couleur unique pour tout le site"
          style={{ gap: '6px' }}
        >
          <Palette size={15} color="var(--admin-coral, #F0624D)" />
          <span className="theme-toggle-text">Thème Couleur</span>
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
          href="http://localhost:5173/" 
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
