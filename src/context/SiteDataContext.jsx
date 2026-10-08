import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DEFAULT_THEME, 
  DEFAULT_SETTINGS, 
  subscribeTheme, 
  subscribeSettings, 
  subscribeContent, 
  applyThemeToDOM,
  saveTheme,
  saveSettings,
  saveContent,
  seedAllDefaults,
  uploadImageFile
} from '../services/cmsService';
import {
  DEFAULT_APPEARANCE,
  subscribeAppearance,
  applyAppearanceToDOM
} from '../services/appearanceService';
import { t as staticTranslations } from '../translations';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [contentFr, setContentFr] = useState(staticTranslations.fr);
  const [contentEn, setContentEn] = useState(staticTranslations.en);
  const [appearance, setAppearance] = useState(DEFAULT_APPEARANCE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial DOM theme & appearance
    applyThemeToDOM(DEFAULT_THEME);
    applyAppearanceToDOM(DEFAULT_APPEARANCE);

    // Subscriptions
    const unsubTheme = subscribeTheme((newTheme) => {
      setTheme(newTheme);
      setLoading(false);
    });

    const unsubAppearance = subscribeAppearance((newAppearance) => {
      setAppearance(newAppearance);
    });

    const unsubSettings = subscribeSettings((newSettings) => {
      setSettings(newSettings);
    });

    const unsubFr = subscribeContent('fr', (newContent) => {
      setContentFr(newContent);
    });

    const unsubEn = subscribeContent('en', (newContent) => {
      setContentEn(newContent);
    });

    // Écoute des messages en direct du personnaliseur visuel Admin (iframe postMessage)
    const handleMessage = (event) => {
      if (event.data?.type === 'HEMIRA_PREVIEW_APPEARANCE' && event.data.appearance) {
        setAppearance(event.data.appearance);
        applyAppearanceToDOM(event.data.appearance);
      }
    };
    window.addEventListener('message', handleMessage);

    // Détection des clics sur sections en mode preview pour inspection directe dans l'admin
    const handleClick = (e) => {
      const sectionEl = e.target.closest('[data-section-id]');
      if (sectionEl && window.parent && window.parent !== window) {
        const sectionId = sectionEl.getAttribute('data-section-id');
        window.parent.postMessage({
          type: 'HEMIRA_SECTION_CLICKED',
          sectionId
        }, '*');
      }
    };
    document.addEventListener('click', handleClick);

    return () => {
      unsubTheme?.();
      unsubAppearance?.();
      unsubSettings?.();
      unsubFr?.();
      unsubEn?.();
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Helper to get active content for language
  const getContent = (lang = 'fr') => {
    return lang === 'en' ? contentEn : contentFr;
  };

  const value = {
    theme,
    settings,
    contentFr,
    contentEn,
    appearance,
    getContent,
    loading,
    saveTheme,
    saveSettings,
    saveContent,
    seedAllDefaults,
    uploadImageFile
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return ctx;
}
