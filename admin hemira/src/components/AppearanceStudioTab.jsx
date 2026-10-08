import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Palette, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  Upload, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Layers, 
  Maximize2, 
  ExternalLink, 
  RefreshCw,
  Layout,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  Type,
  Maximize
} from 'lucide-react';
import { 
  PRESET_STYLES, 
  DEFAULT_APPEARANCE, 
  SHAPE_RADIUS, 
  MOTION_DURATIONS, 
  TYPOGRAPHY_CONFIGS,
  subscribeAppearance,
  subscribeAppearanceDraft,
  saveAppearanceDraft,
  saveAppearanceLive
} from '../services/appearanceService';

const SECTIONS_CONFIG = [
  {
    id: 'global',
    name: 'Style & Thème Global',
    group: 'global',
    description: 'Preset d’ambiance, palette de couleurs, typographie et animations globales.'
  },
  {
    id: 'home.hero',
    name: 'Hero & Accroche (Haut de page)',
    group: 'home',
    description: 'Bannière d\'introduction et promesse de voyage.',
    variants: [
      { id: 'split', name: 'Signature Split (Défaut)', desc: 'Texte à gauche, mosaïque artistique à droite et métriques' },
      { id: 'center', name: 'Prestige Centré VIP', desc: 'Grand titre centré de luxe, badge lumineux et métriques alignées' },
      { id: 'bento', name: 'Bento Moderne Asymétrique', desc: 'Disposition moderne en blocs asymétriques avec conciergerie 24/7' },
      { id: 'minimal', name: 'Éditorial Haute Couture', desc: 'Typographie noble épurée, barre d\'accent et clarté maximale' }
    ]
  },
  {
    id: 'home.commitments',
    name: 'Nos Engagements ("Pourquoi HEMIRA")',
    group: 'home',
    description: 'Les 3 piliers de réassurance et d’excellence pour le voyageur.',
    variants: [
      { id: 'default', name: 'Signature HEMIRA (Défaut)', desc: 'Design officiel fidèle avec numéro d\'ordre' },
      { id: 'card-elevated', name: 'Surélévation Moderne 3D', desc: 'Cartes 3D flottantes contemporaines avec ombres douces et pastille accent' },
      { id: 'card-bordered', name: 'Piliers Architecturaux', desc: 'Liseré supérieur accentué et numéro filigrane géant' },
      { id: 'card-minimal', name: 'Minimaliste Lignes Pures', desc: 'Barre verticale d\'accent, lecture pure et lisibilité maximale' },
      { id: 'card-dark', name: 'Écrin Sombre Nuit & Or', desc: 'Fond sombre feutré avec liseré or pour une ambiance VIP' },
      { id: 'card-glass', name: 'Nacre & Glassmorphism', desc: 'Effet verre dépoli moderne avec reflets translucides' }
    ]
  },
  {
    id: 'home.services',
    name: 'Nos Services (Grille Accueil)',
    group: 'home',
    description: 'Les 6 services de voyage présentés sur la page d\'accueil.',
    variants: [
      { id: 'default', name: 'Signature HEMIRA (Défaut)', desc: 'Design officiel fidèle avec numéro d\'ordre' },
      { id: 'card-elevated', name: 'Surélévation Moderne 3D', desc: 'Cartes 3D surélevées avec ombre douce et pastille accent' },
      { id: 'card-bordered', name: 'Piliers Architecturaux', desc: 'Bordure supérieure stylisée et numérotation forte' },
      { id: 'card-minimal', name: 'Minimaliste Intemporel', desc: 'Ligne pure et focus direct sur l\'expertise' },
      { id: 'card-dark', name: 'Mode Nuit VIP & Or', desc: 'Cartes sombres avec reflets dorés et contrastes VIP' },
      { id: 'card-glass', name: 'Nacre & Glassmorphism', desc: 'Cartes translucides frosted glass haute couture' }
    ]
  },
  {
    id: 'services.list',
    name: 'Page Services (Catalogue Détaillé)',
    group: 'services',
    description: 'Présentation complète de l\'ensemble des services sur la page dédiée.',
    variants: [
      { id: 'default', name: 'Signature HEMIRA (Défaut)', desc: 'Affichage détaillé classique avec icônes' },
      { id: 'card-elevated', name: 'Cartes Premium Surélevées', desc: 'Cartes aérées 3D avec mise en relief contemporaine' },
      { id: 'card-bordered', name: 'Piliers Architecturaux', desc: 'Bordure stylisée avec numérotation de prestige' },
      { id: 'card-minimal', name: 'Minimaliste Éditorial', desc: 'Épure contemporaine et mise en valeur des prestations' },
      { id: 'card-dark', name: 'Contraste Sombre VIP', desc: 'Style sombre feutré pour standing haut de gamme' },
      { id: 'card-glass', name: 'Nacre & Glassmorphism', desc: 'Effet verre translucide lumineux' }
    ]
  },
  {
    id: 'cases.list',
    name: 'Nos Réalisations (Blocs & Témoignages)',
    group: 'cases',
    description: 'Cas clients, anecdotes d’urgence et dossiers de voyage résolus avec succès.',
    variants: [
      { id: 'default', name: 'Signature HEMIRA (Défaut)', desc: 'Mise en page originale avec photo ou typographie' },
      { id: 'case-editorial', name: 'Split Éditorial Magazine', desc: 'Grand visuel plein cadre et composition magazine de luxe' },
      { id: 'case-cinema', name: 'Panoramique Cinéma & Timeline', desc: 'Bandeau cinématographique supérieur et étapes du voyage' },
      { id: 'case-bento', name: 'Bento Moderne Asymétrique', desc: 'Grille moderne bento multi-blocs avec défi, solution et résultat' },
      { id: 'case-carnet', name: 'Fiche Carnet d\'Expédition VIP', desc: 'Dossier diplomatique officiel avec sceau d\'intervention' },
      { id: 'case-prestige-dark', name: 'Écrin Sombre Nuit & Or', desc: 'Fond noir onyx, liseré or champagne et contrastes VIP' },
      { id: 'case-floating', name: 'Studio Luxe & Relief 3D', desc: 'Photo décalée en relief flottant avec badge sceau' }
    ]
  },
  {
    id: 'about.founders',
    name: 'À Propos (Fondatrices & Vision)',
    group: 'about',
    description: 'Présentation des fondatrices Jeanne Helene et Miriam J.',
    variants: [
      { id: 'default', name: 'Duo Signature & Piliers (Défaut)', desc: 'Photo officielle du duo à gauche et liste des engagements à droite' },
      { id: 'centered-vision', name: 'Prestige Centré & Citation VIP', desc: 'Portrait centré majestueux avec citation et 3 cartes piliers' },
      { id: 'editorial-split', name: 'Éditorial Magazine Haute Couture', desc: 'Composition asymétrique de magazine de prestige avec signature' }
    ]
  }
];

export default function AppearanceStudioTab({ showToast }) {
  const [currentAppearance, setCurrentAppearance] = useState(DEFAULT_APPEARANCE);
  const [publishedAppearance, setPublishedAppearance] = useState(DEFAULT_APPEARANCE);
  const [selectedSectionId, setSelectedSectionId] = useState('global');
  const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
  const [iframeKey, setIframeKey] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const iframeRef = useRef(null);
  const draftSaveTimeoutRef = useRef(null);

  // Charger l'apparence depuis Firestore (Draft en priorité pour continuer l'édition, Live pour comparer)
  useEffect(() => {
    let isInitial = true;
    const unsubDraft = subscribeAppearanceDraft((draftData) => {
      if (draftData) {
        setCurrentAppearance(prev => {
          if (isInitial) {
            setHistory([draftData]);
            setHistoryIndex(0);
            isInitial = false;
            return draftData;
          }
          return prev;
        });
      }
    });

    const unsubLive = subscribeAppearance((liveData) => {
      if (liveData) {
        setPublishedAppearance(liveData);
      }
    });

    return () => {
      unsubDraft?.();
      unsubLive?.();
    };
  }, []);

  // Synchronisation en direct avec l'iframe via postMessage (0ms de latence)
  const broadcastToIframe = useCallback((appearanceData) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({
          type: 'HEMIRA_PREVIEW_APPEARANCE',
          appearance: appearanceData
        }, '*');
      } catch (err) {
        console.warn("Iframe postMessage sync error:", err);
      }
    }
  }, []);

  // Envoi à l'iframe dès que currentAppearance change
  useEffect(() => {
    broadcastToIframe(currentAppearance);

    // Déclencheur autosave draft (debounced 400ms)
    if (draftSaveTimeoutRef.current) clearTimeout(draftSaveTimeoutRef.current);
    draftSaveTimeoutRef.current = setTimeout(() => {
      saveAppearanceDraft(currentAppearance).catch(err => {
        console.warn("Autosave draft error:", err);
      });
    }, 400);

    return () => {
      if (draftSaveTimeoutRef.current) clearTimeout(draftSaveTimeoutRef.current);
    };
  }, [currentAppearance, broadcastToIframe]);

  // Écoute des événements émis par l'iframe (ex: clic sur une section pour inspection directe)
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'HEMIRA_SECTION_CLICKED' && e.data.sectionId) {
        const found = SECTIONS_CONFIG.find(s => s.id === e.data.sectionId);
        if (found) {
          setSelectedSectionId(found.id);
          showToast(`Section inspectée : ${found.name}`);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showToast]);

  // Synchronisation contextuelle : quand l'utilisateur sélectionne une section, ordonne à l'iframe de naviguer et scroller vers celle-ci
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow && selectedSectionId) {
      try {
        iframeRef.current.contentWindow.postMessage({
          type: 'HEMIRA_NAVIGATE_SECTION',
          sectionId: selectedSectionId
        }, '*');
      } catch (err) {
        console.warn("Iframe section navigation error:", err);
      }
    }
  }, [selectedSectionId]);

  // Gestion de l'historique Undo / Redo
  const updateAppearance = (updater) => {
    setCurrentAppearance(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // Troncature de l'historique et ajout du nouvel état
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const targetState = history[nextIndex];
      setHistoryIndex(nextIndex);
      setCurrentAppearance(targetState);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetState = history[nextIndex];
      setHistoryIndex(nextIndex);
      setCurrentAppearance(targetState);
    }
  };

  // Raccourcis clavier (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Appliquer un style Preset en 1 clic
  const handleApplyPreset = (presetKey) => {
    const preset = PRESET_STYLES[presetKey];
    if (!preset) return;
    updateAppearance(prev => ({
      ...prev,
      style: preset.id,
      palette: { ...preset.palette },
      typography: preset.typography,
      shape: preset.shape,
      density: preset.density,
      motion: preset.motion,
      sections: {
        ...prev.sections,
        ...preset.sections
      }
    }));
    showToast(`Style appliqué : ${preset.name} !`);
  };

  // Mise à jour de couleur spécifique
  const handleColorChange = (key, val) => {
    updateAppearance(prev => ({
      ...prev,
      palette: {
        ...prev.palette,
        [key]: val
      }
    }));
  };

  // Réglage de section
  const handleSectionVariantChange = (secId, variantId) => {
    const updatedSections = {
      ...currentAppearance.sections,
      [secId]: {
        ...(currentAppearance.sections?.[secId] || { tone: 'light', visible: true }),
        variant: variantId
      }
    };
    const nextAppearance = {
      ...currentAppearance,
      sections: updatedSections
    };
    updateAppearance(nextAppearance);
    broadcastToIframe(nextAppearance);
    try {
      iframeRef.current?.contentWindow?.postMessage({
        type: 'HEMIRA_NAVIGATE_SECTION',
        sectionId: secId
      }, '*');
    } catch (_) {}
  };

  const handleSectionToneChange = (secId, tone) => {
    const defaultSecTone = secId === 'home.hero' ? 'dark' : (secId === 'home.services' ? 'alt' : 'light');
    const updatedSections = {
      ...currentAppearance.sections,
      [secId]: {
        ...(currentAppearance.sections?.[secId] || { variant: 'default', tone: defaultSecTone, visible: true }),
        tone: tone
      }
    };
    const nextAppearance = {
      ...currentAppearance,
      sections: updatedSections
    };
    updateAppearance(nextAppearance);
    broadcastToIframe(nextAppearance);
    try {
      iframeRef.current?.contentWindow?.postMessage({
        type: 'HEMIRA_NAVIGATE_SECTION',
        sectionId: secId
      }, '*');
    } catch (_) {}
  };

  const handleSectionVisibilityToggle = (secId) => {
    const currentVal = currentAppearance.sections?.[secId]?.visible !== false;
    const defaultSecTone = secId === 'home.hero' ? 'dark' : (secId === 'home.services' ? 'alt' : 'light');
    const updatedSections = {
      ...currentAppearance.sections,
      [secId]: {
        ...(currentAppearance.sections?.[secId] || { variant: 'default', tone: defaultSecTone }),
        visible: !currentVal
      }
    };
    const nextAppearance = {
      ...currentAppearance,
      sections: updatedSections
    };
    updateAppearance(nextAppearance);
    broadcastToIframe(nextAppearance);
  };

  const handleResetSection = (secId) => {
    const defaultSecTone = secId === 'home.hero' ? 'dark' : (secId === 'home.services' ? 'alt' : 'light');
    const updatedSections = {
      ...currentAppearance.sections,
      [secId]: { variant: 'default', tone: defaultSecTone, visible: true }
    };
    const nextAppearance = {
      ...currentAppearance,
      sections: updatedSections
    };
    updateAppearance(nextAppearance);
    broadcastToIframe(nextAppearance);
    showToast(`Section ${secId} réinitialisée au style global.`);
  };

  // Publication en ligne sur le site public
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await saveAppearanceLive(currentAppearance);
      setPublishedAppearance(currentAppearance);
      showToast("Apparence publiée avec succès sur le site en ligne !");
    } catch (err) {
      console.error("Publication error:", err);
      alert("Erreur lors de la publication : " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Déterminer s'il y a des modifications non publiées
  const isModified = JSON.stringify(currentAppearance) !== JSON.stringify(publishedAppearance);

  const selectedSection = SECTIONS_CONFIG.find(s => s.id === selectedSectionId) || SECTIONS_CONFIG[0];
  const defaultSecTone = selectedSectionId === 'home.hero' ? 'dark' : (selectedSectionId === 'home.services' ? 'alt' : 'light');
  const sectionState = currentAppearance.sections?.[selectedSectionId] || { variant: 'default', tone: defaultSecTone, visible: true };

  // URL cible de l'aperçu du site
  const sitePreviewUrl = typeof window !== 'undefined' && window.location.search.includes('preview_target=')
    ? new URLSearchParams(window.location.search).get('preview_target')
    : `${window.location.protocol}//${window.location.hostname}:5175/?admin_preview=1`;

  return (
    <div className="appearance-studio">
      {/* 1. BARRE D'OUTILS SUPÉRIEURE */}
      <header className="appearance-topbar">
        <div className="appearance-topbar-left">
          <div className="appearance-badge-title">
            <Palette size={18} color="var(--admin-coral, #F0624D)" />
            <strong>Studio d'Apparence & Design Visuel</strong>
          </div>
          {isModified ? (
            <span className="appearance-status-pill modified">
              <span className="dot pulse"></span> Brouillon non publié
            </span>
          ) : (
            <span className="appearance-status-pill clean">
              <Check size={12} /> À jour sur le site
            </span>
          )}
        </div>

        {/* Device Switcher */}
        <div className="appearance-device-switch">
          <button 
            type="button" 
            className={`device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
            onClick={() => setDeviceView('desktop')}
            title="Vue Ordinateur (Plein écran)"
          >
            <Monitor size={15} />
            <span>Desktop</span>
          </button>
          <button 
            type="button" 
            className={`device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
            onClick={() => setDeviceView('tablet')}
            title="Vue Tablette (768px)"
          >
            <Tablet size={15} />
            <span>Tablette</span>
          </button>
          <button 
            type="button" 
            className={`device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
            onClick={() => setDeviceView('mobile')}
            title="Vue Mobile (390px)"
          >
            <Smartphone size={15} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Actions : Undo / Redo / Reload / Publish */}
        <div className="appearance-topbar-actions">
          <button 
            type="button" 
            className="admin-btn admin-btn-outline icon-only-btn" 
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button 
            type="button" 
            className="admin-btn admin-btn-outline icon-only-btn" 
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Rétablir (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
          <button 
            type="button" 
            className="admin-btn admin-btn-outline icon-only-btn" 
            onClick={() => setIframeKey(k => k + 1)}
            title="Recharger l'aperçu"
          >
            <RefreshCw size={15} />
          </button>
          <a 
            href={sitePreviewUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="admin-btn admin-btn-outline icon-only-btn"
            title="Ouvrir le site dans un nouvel onglet"
          >
            <ExternalLink size={15} />
          </a>
          <button 
            type="button" 
            className="admin-btn admin-btn-coral publish-btn"
            onClick={handlePublish}
            disabled={isPublishing || !isModified}
          >
            <Sparkles size={15} />
            <span>{isPublishing ? 'Publication...' : 'Publier sur le site'}</span>
          </button>
        </div>
      </header>

      {/* 2. CORPS PRINCIPAL : 3 COLONNES ERGONOMIQUES */}
      <div className="appearance-studio-workspace">
        
        {/* COLONNE GAUCHE : ARBORESCENCE DE NAVIGATION */}
        <aside className="appearance-nav-sidebar">
          <div className="appearance-nav-header">
            <h4>Sections & Pages</h4>
            <span className="sub">Cliquez pour configurer</span>
          </div>

          <div className="appearance-nav-list">
            <div className="appearance-nav-group-title">Configuration Générale</div>
            <button 
              type="button"
              className={`appearance-nav-item ${selectedSectionId === 'global' ? 'active' : ''}`}
              onClick={() => setSelectedSectionId('global')}
            >
              <div className="nav-item-icon"><Sliders size={15} /></div>
              <div className="nav-item-info">
                <strong>Thème & Style Global</strong>
                <span>Palette, typographie, arrondis</span>
              </div>
            </button>

            <div className="appearance-nav-group-title">Page d'Accueil</div>
            {SECTIONS_CONFIG.filter(s => s.group === 'home').map(s => {
              const state = currentAppearance.sections?.[s.id] || { variant: 'default', visible: true };
              const isHidden = state.visible === false;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`appearance-nav-item ${selectedSectionId === s.id ? 'active' : ''} ${isHidden ? 'hidden-item' : ''}`}
                  onClick={() => setSelectedSectionId(s.id)}
                >
                  <div className="nav-item-icon"><Layout size={15} /></div>
                  <div className="nav-item-info">
                    <strong>{s.name}</strong>
                    <span>{isHidden ? 'Section masquée' : (s.variants?.find(v => v.id === state.variant)?.name || 'Défaut')}</span>
                  </div>
                </button>
              );
            })}

            <div className="appearance-nav-group-title">Autres Pages</div>
            {SECTIONS_CONFIG.filter(s => s.group === 'services' || s.group === 'cases' || s.group === 'about').map(s => {
              const state = currentAppearance.sections?.[s.id] || { variant: 'default', visible: true };
              const isHidden = state.visible === false;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`appearance-nav-item ${selectedSectionId === s.id ? 'active' : ''} ${isHidden ? 'hidden-item' : ''}`}
                  onClick={() => setSelectedSectionId(s.id)}
                >
                  <div className="nav-item-icon"><Layers size={15} /></div>
                  <div className="nav-item-info">
                    <strong>{s.name}</strong>
                    <span>{isHidden ? 'Section masquée' : (s.variants?.find(v => v.id === state.variant)?.name || 'Défaut')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* COLONNE CENTRALE : APERÇU LIVE EN DIRECT (IFRAME) */}
        <section className="appearance-preview-viewport">
          <div className={`appearance-device-container device-${deviceView}`}>
            <div className="device-screen-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <div className="device-screen-url">
                <span>hemiraservices.com</span>
                <span className="preview-indicator">Mode Aperçu Interactif</span>
              </div>
            </div>
            <iframe 
              ref={iframeRef}
              key={iframeKey}
              src={sitePreviewUrl}
              title="Aperçu interactif HEMIRA"
              className="appearance-iframe"
              onLoad={() => broadcastToIframe(currentAppearance)}
            />
          </div>
        </section>

        {/* COLONNE DROITE : INSPECTEUR D'APPARENCE */}
        <aside className="appearance-inspector">
          
          {/* ======================= VUE GLOBALE ======================= */}
          {selectedSectionId === 'global' ? (
            <div className="inspector-content">
              <div className="inspector-header">
                <h3>Style & Thème Global</h3>
                <p>Définissez l'ambiance visuelle globale du site en un clic, ou personnalisez chaque élément.</p>
              </div>

              {/* 1. PRESETS DE STYLES */}
              <div className="inspector-section">
                <label className="inspector-label">
                  <Sparkles size={14} color="var(--admin-coral, #F0624D)" />
                  <span>Styles Visuels Prêts à l'Emploi</span>
                </label>
                <div className="presets-grid">
                  {Object.values(PRESET_STYLES).map(p => {
                    const isSelected = currentAppearance.style === p.id;
                    return (
                      <div 
                        key={p.id}
                        className={`preset-card ${isSelected ? 'active' : ''}`}
                        onClick={() => handleApplyPreset(p.id)}
                      >
                        <div className="preset-card-top">
                          <strong className="preset-name">{p.name}</strong>
                          {isSelected && <span className="preset-check"><Check size={12} /></span>}
                        </div>
                        <p className="preset-desc">{p.description}</p>
                        <div className="preset-palette-chips">
                          <span style={{ background: p.palette.primary }} title="Primaire"></span>
                          <span style={{ background: p.palette.accent }} title="Accent"></span>
                          <span style={{ background: p.palette.gold }} title="Or"></span>
                          <span style={{ background: p.palette.surfaceAlt }} title="Fond"></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. PALETTE DE COULEURS */}
              <div className="inspector-section">
                <label className="inspector-label">
                  <Palette size={14} color="var(--admin-coral, #F0624D)" />
                  <span>Palette de Couleurs Curatée</span>
                </label>
                <div className="palette-fields-grid">
                  <div className="color-field">
                    <label>Couleur Primaire (Marine)</label>
                    <div className="color-input-wrap">
                      <input 
                        type="color" 
                        value={currentAppearance.palette?.primary || '#0E1F3D'}
                        onChange={(e) => handleColorChange('primary', e.target.value)} 
                      />
                      <input 
                        type="text" 
                        className="form-input color-text"
                        value={currentAppearance.palette?.primary || '#0E1F3D'}
                        onChange={(e) => handleColorChange('primary', e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="color-field">
                    <label>Couleur d'Accent</label>
                    <div className="color-input-wrap">
                      <input 
                        type="color" 
                        value={currentAppearance.palette?.accent || '#4A7FB8'}
                        onChange={(e) => handleColorChange('accent', e.target.value)} 
                      />
                      <input 
                        type="text" 
                        className="form-input color-text"
                        value={currentAppearance.palette?.accent || '#4A7FB8'}
                        onChange={(e) => handleColorChange('accent', e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="color-field">
                    <label>Rehaut Or / Luxe</label>
                    <div className="color-input-wrap">
                      <input 
                        type="color" 
                        value={currentAppearance.palette?.gold || '#C9A968'}
                        onChange={(e) => handleColorChange('gold', e.target.value)} 
                      />
                      <input 
                        type="text" 
                        className="form-input color-text"
                        value={currentAppearance.palette?.gold || '#C9A968'}
                        onChange={(e) => handleColorChange('gold', e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="color-field">
                    <label>Fond Clair / Alterné</label>
                    <div className="color-input-wrap">
                      <input 
                        type="color" 
                        value={currentAppearance.palette?.surfaceAlt || '#F7F6F2'}
                        onChange={(e) => handleColorChange('surfaceAlt', e.target.value)} 
                      />
                      <input 
                        type="text" 
                        className="form-input color-text"
                        value={currentAppearance.palette?.surfaceAlt || '#F7F6F2'}
                        onChange={(e) => handleColorChange('surfaceAlt', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. TYPOGRAPHIE */}
              <div className="inspector-section">
                <label className="inspector-label">
                  <Type size={14} color="var(--admin-coral, #F0624D)" />
                  <span>Duo Typographique</span>
                </label>
                <div className="options-pill-list">
                  {Object.entries(TYPOGRAPHY_CONFIGS).map(([k, cfg]) => {
                    const isSelected = currentAppearance.typography === k;
                    return (
                      <button 
                        key={k}
                        type="button"
                        className={`option-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => updateAppearance(prev => ({ ...prev, typography: k }))}
                      >
                        <span className="pill-name">{cfg.name}</span>
                        {isSelected && <Check size={13} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. FORMES & ARRONDIS */}
              <div className="inspector-section">
                <label className="inspector-label">
                  <Maximize size={14} color="var(--admin-coral, #F0624D)" />
                  <span>Arrondis des Cartes & Boutons</span>
                </label>
                <div className="options-grid-4">
                  {[
                    { id: 'sharp', label: 'Droit (6px)' },
                    { id: 'soft', label: 'Doux (10px)' },
                    { id: 'rounded', label: 'Rond (16px)' },
                    { id: 'pill', label: 'Pilule (24px)' }
                  ].map(sh => (
                    <button
                      key={sh.id}
                      type="button"
                      className={`option-chip ${currentAppearance.shape === sh.id ? 'active' : ''}`}
                      onClick={() => updateAppearance(prev => ({ ...prev, shape: sh.id }))}
                    >
                      {sh.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. MOUVEMENT & ANIMATIONS */}
              <div className="inspector-section">
                <label className="inspector-label">
                  <Sparkles size={14} color="var(--admin-coral, #F0624D)" />
                  <span>Mouvement & Transitions</span>
                </label>
                <div className="options-grid-3">
                  {[
                    { id: 'none', label: 'Sans animation' },
                    { id: 'subtle', label: 'Subtil & Fluide' },
                    { id: 'expressive', label: 'Expressif VIP' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className={`option-chip ${currentAppearance.motion === m.id ? 'active' : ''}`}
                      onClick={() => updateAppearance(prev => ({ ...prev, motion: m.id }))}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* ======================= VUE DE SECTION ======================= */
            <div className="inspector-content">
              <div className="inspector-header">
                <div className="section-breadcrumb">
                  <span>Sections</span> <ChevronRight size={12} /> <strong>{selectedSection.name}</strong>
                </div>
                <h3>{selectedSection.name}</h3>
                <p>{selectedSection.description}</p>
              </div>

              {/* AFFICHER / MASQUER */}
              <div className="inspector-section visibility-box">
                <div className="visibility-info">
                  <strong>Visibilité sur le site</strong>
                  <span>{sectionState.visible !== false ? 'La section est affichée aux visiteurs' : 'Section masquée (invisible sur le site public)'}</span>
                </div>
                <button 
                  type="button" 
                  className={`toggle-switch ${sectionState.visible !== false ? 'active' : ''}`}
                  onClick={() => handleSectionVisibilityToggle(selectedSectionId)}
                  aria-label="Basculer la visibilité de la section"
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>

              {/* VARIANTES CURATÉES */}
              {selectedSection.variants && selectedSection.variants.length > 0 && (
                <div className="inspector-section">
                  <label className="inspector-label">
                    <Layout size={14} color="var(--admin-coral, #F0624D)" />
                    <span>Variantes de Mise en Page</span>
                  </label>
                  <div className="variants-list">
                    {selectedSection.variants.map(v => {
                      const isSelected = (sectionState.variant || 'default') === v.id;
                      const getVariantBadge = (vId) => {
                        if (vId.includes('elevated')) return { label: '3D Floating', color: '#38BDF8' };
                        if (vId.includes('bordered') || vId.includes('architect')) return { label: 'Architecte', color: '#F0624D' };
                        if (vId.includes('dark') || vId.includes('prestige')) return { label: 'VIP Or & Nuit', color: '#D4AF37' };
                        if (vId.includes('glass')) return { label: 'Verre Nacre', color: '#818CF8' };
                        if (vId.includes('bento')) return { label: 'Bento Grid', color: '#10B981' };
                        if (vId.includes('minimal')) return { label: 'Épuré', color: '#94A3B8' };
                        if (vId.includes('center')) return { label: 'Centré VIP', color: '#C9A968' };
                        if (vId.includes('cinema')) return { label: 'Panoramique', color: '#F43F5E' };
                        if (vId.includes('carnet')) return { label: 'Dossier VIP', color: '#F59E0B' };
                        if (vId.includes('floating')) return { label: 'Relief 3D', color: '#A855F7' };
                        if (vId.includes('editorial')) return { label: 'Magazine', color: '#FB923C' };
                        return { label: 'Signature', color: '#6FA0D0' };
                      };
                      const badge = getVariantBadge(v.id);

                      return (
                        <div 
                          key={v.id}
                          className={`variant-card ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSectionVariantChange(selectedSectionId, v.id)}
                        >
                          <div className="variant-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong className="variant-title">{v.name}</strong>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                color: badge.color,
                                background: 'rgba(255,255,255,0.06)',
                                border: `1px solid ${badge.color}44`,
                                padding: '1px 6px',
                                borderRadius: '6px'
                              }}>
                                {badge.label}
                              </span>
                            </div>
                            {isSelected && <span className="variant-check"><Check size={14} /></span>}
                          </div>
                          <p className="variant-desc">{v.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TON DE FOND */}
              <div className="inspector-section">
                <label className="inspector-label">
                  <Sun size={14} color="var(--admin-coral, #F0624D)" />
                  <span>Ambiance & Ton de Fond</span>
                </label>
                <div className="tone-selector-grid">
                  {[
                    { id: 'light', label: 'Clair', desc: 'Fond blanc', bg: '#FFFFFF', color: '#16213A' },
                    { id: 'alt', label: 'Alterné', desc: 'Fond doux', bg: '#F7F6F2', color: '#16213A' },
                    { id: 'dark', label: 'Sombre', desc: 'Marine / Nuit', bg: '#0E1F3D', color: '#FFFFFF' }
                  ].map(t => {
                    const currentTone = sectionState.tone || defaultSecTone;
                    const isSelected = currentTone === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`tone-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSectionToneChange(selectedSectionId, t.id)}
                      >
                        <span className="tone-preview-circle" style={{ background: t.bg, border: '1px solid #CBD5E1' }}></span>
                        <strong>{t.label}</strong>
                        <span>{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RÉINITIALISER */}
              <div className="inspector-section reset-box">
                <button 
                  type="button" 
                  className="admin-btn admin-btn-outline reset-section-btn"
                  onClick={() => handleResetSection(selectedSectionId)}
                >
                  <RotateCcw size={13} />
                  <span>Réinitialiser cette section aux valeurs du thème</span>
                </button>
              </div>

            </div>
          )}

        </aside>

      </div>
    </div>
  );
}
