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
import { t as staticTranslations } from '../translations';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [contentFr, setContentFr] = useState(staticTranslations.fr);
  const [contentEn, setContentEn] = useState(staticTranslations.en);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial DOM theme
    applyThemeToDOM(DEFAULT_THEME);

    // Subscriptions
    const unsubTheme = subscribeTheme((newTheme) => {
      setTheme(newTheme);
      setLoading(false);
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

    return () => {
      unsubTheme?.();
      unsubSettings?.();
      unsubFr?.();
      unsubEn?.();
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
