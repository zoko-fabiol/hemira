import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import ThemeTab from './components/ThemeTab';
import IdentityTab from './components/IdentityTab';
import HomeTab from './components/HomeTab';
import ServicesTab from './components/ServicesTab';
import CaseStudiesTab from './components/CaseStudiesTab';
import AboutTab from './components/AboutTab';
import GeneralTextsTab from './components/GeneralTextsTab';
import ContactTab from './components/ContactTab';
import AnalyticsTab from './components/AnalyticsTab';

import { 
  DEFAULT_THEME, 
  DEFAULT_SETTINGS, 
  subscribeTheme, 
  subscribeSettings, 
  subscribeContent 
} from './services/cmsService';
import { 
  CheckCircle2, 
  LayoutDashboard, 
  BarChart3,
  Palette, 
  Image as ImageIcon, 
  Home, 
  Briefcase, 
  Award, 
  Users, 
  Type, 
  PhoneCall 
} from 'lucide-react';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [contentFr, setContentFr] = useState(null);
  const [contentEn, setContentEn] = useState(null);
  const [toast, setToast] = useState(null);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('hemira_admin_theme') || 'light';
  });

  const toggleThemeMode = () => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('hemira_admin_theme', next);
      return next;
    });
  };

  const navTabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
    { id: 'theme', label: 'Couleurs', icon: Palette },
    { id: 'identity', label: 'Logo', icon: ImageIcon },
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'case-studies', label: 'Réalisations', icon: Award },
    { id: 'about', label: 'À Propos', icon: Users },
    { id: 'texts', label: 'Textes', icon: Type },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  // Subscriptions to Firebase in real-time
  useEffect(() => {
    const unsubTheme = subscribeTheme(setTheme);
    const unsubSettings = subscribeSettings(setSettings);
    const unsubFr = subscribeContent('fr', setContentFr);
    const unsubEn = subscribeContent('en', setContentEn);

    return () => {
      unsubTheme?.();
      unsubSettings?.();
      unsubFr?.();
      unsubEn?.();
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Tableau de bord';
      case 'analytics': return 'Statistiques & Visiteurs';
      case 'theme': return 'Palette & Couleurs';
      case 'identity': return 'Logo & Identité Visuelle';
      case 'home': return 'Page d\'Accueil & Engagements';
      case 'services': return 'Services de Voyage';
      case 'case-studies': return 'Nos Réalisations';
      case 'about': return 'À Propos & Fondatrices';
      case 'texts': return 'Textes Généraux & Navigation';
      case 'contact': return 'Contact & Chatbot';
      default: return 'Administration';
    }
  };

  return (
    <div className="admin-layout" data-theme={themeMode}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="admin-main">
        <Header 
          activeTabName={getTabTitle()} 
          lang={lang} 
          setLang={setLang} 
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          themeMode={themeMode}
          onToggleTheme={toggleThemeMode}
        />

        {/* Swipeable Tabs Strip on Mobile */}
        <div className="admin-mobile-tabs-strip">
          {navTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`admin-mobile-tab-pill ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <main className="admin-content">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              theme={theme}
              settings={settings}
              content={lang === 'fr' ? contentFr : contentEn}
              setActiveTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab 
              showToast={showToast}
            />
          )}

          {activeTab === 'theme' && (
            <ThemeTab 
              theme={theme} 
              showToast={showToast} 
            />
          )}

          {activeTab === 'identity' && (
            <IdentityTab 
              settings={settings} 
              showToast={showToast} 
            />
          )}

          {activeTab === 'home' && (
            <HomeTab 
              contentFr={contentFr}
              contentEn={contentEn}
              showToast={showToast}
            />
          )}

          {activeTab === 'services' && (
            <ServicesTab 
              contentFr={contentFr}
              contentEn={contentEn}
              showToast={showToast}
            />
          )}

          {activeTab === 'case-studies' && (
            <CaseStudiesTab 
              contentFr={contentFr}
              contentEn={contentEn}
              showToast={showToast}
            />
          )}

          {activeTab === 'about' && (
            <AboutTab 
              contentFr={contentFr}
              contentEn={contentEn}
              showToast={showToast}
            />
          )}

          {activeTab === 'texts' && (
            <GeneralTextsTab 
              contentFr={contentFr}
              contentEn={contentEn}
              showToast={showToast}
            />
          )}

          {activeTab === 'contact' && (
            <ContactTab 
              settings={settings}
              contentFr={contentFr}
              contentEn={contentEn}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {toast && (
        <div className="toast-success">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
