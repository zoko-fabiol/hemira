import React, { useState, useEffect } from 'react';
import { Type, Save } from 'lucide-react';
import { saveContent } from '../services/cmsService';

export default function GeneralTextsTab({ contentFr, contentEn, showToast }) {
  const [activeLang, setActiveLang] = useState('fr');
  const [dataFr, setDataFr] = useState({});
  const [dataEn, setDataEn] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDataFr(contentFr || {});
    setDataEn(contentEn || {});
  }, [contentFr, contentEn]);

  const current = activeLang === 'fr' ? dataFr : dataEn;
  const setCurrent = activeLang === 'fr' ? setDataFr : setDataEn;

  const handleNavChange = (field, val) => {
    setCurrent(prev => ({
      ...prev,
      nav: { ...prev.nav, [field]: val }
    }));
  };

  const handleCtaBandChange = (field, val) => {
    setCurrent(prev => ({
      ...prev,
      ctaBand: { ...prev.ctaBand, [field]: val }
    }));
  };

  const handleFooterChange = (field, val) => {
    setCurrent(prev => ({
      ...prev,
      footer: { ...prev.footer, [field]: val }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveContent('fr', dataFr);
      await saveContent('en', dataEn);
      showToast("Textes généraux et navigation enregistrés dans Firebase !");
    } catch (err) {
      console.error("Save general texts error:", err);
      alert("Erreur : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Type size={20} color="var(--admin-accent)" />
              Textes Généraux, Navigation & Pied de Page
            </h3>
            <p className="admin-card-desc">
              Personnalisez les menus, la bannière d'action globale et les mentions du pied de page.
            </p>
          </div>
          <button 
            type="button" 
            className="admin-btn admin-btn-coral" 
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer dans Firebase'}</span>
          </button>
        </div>

        {/* Language Tabs */}
        <div className="lang-tabs">
          <button 
            type="button"
            className={`lang-tab-btn ${activeLang === 'fr' ? 'active' : ''}`}
            onClick={() => setActiveLang('fr')}
          >
            FR · Version Française
          </button>
          <button 
            type="button"
            className={`lang-tab-btn ${activeLang === 'en' ? 'active' : ''}`}
            onClick={() => setActiveLang('en')}
          >
            EN · Version Anglaise
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Navigation */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>Barre de Navigation</h4>
            <div className="form-grid-3">
              <div className="form-field">
                <label>Lien 1 (Accueil)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.nav?.home || ''} 
                  onChange={(e) => handleNavChange('home', e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Lien 2 (À propos)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.nav?.about || ''} 
                  onChange={(e) => handleNavChange('about', e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Lien 3 (Services)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.nav?.services || ''} 
                  onChange={(e) => handleNavChange('services', e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Lien 4 (Nos réalisations)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.nav?.caseStudies || ''} 
                  onChange={(e) => handleNavChange('caseStudies', e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Lien 5 (Contact)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.nav?.contact || ''} 
                  onChange={(e) => handleNavChange('contact', e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Bouton CTA Header</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.nav?.cta || ''} 
                  onChange={(e) => handleNavChange('cta', e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Global CTA Band */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>Bannière d'Appel à l'Action (CTA Band)</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Surtitre (Eyebrow)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.ctaBand?.eyebrow || ''} 
                  onChange={(e) => handleCtaBandChange('eyebrow', e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Titre Principal</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.ctaBand?.title || ''} 
                  onChange={(e) => handleCtaBandChange('title', e.target.value)} 
                />
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '14px' }}>
              <label>Description</label>
              <textarea 
                className="form-textarea" 
                value={current.ctaBand?.desc || ''} 
                onChange={(e) => handleCtaBandChange('desc', e.target.value)} 
                rows={2}
              />
            </div>

            <div className="form-grid" style={{ marginTop: '14px' }}>
              <div className="form-field">
                <label>Label du Contact Direct</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.ctaBand?.label || ''} 
                  onChange={(e) => handleCtaBandChange('label', e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Texte du Bouton</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.ctaBand?.btn || ''} 
                  onChange={(e) => handleCtaBandChange('btn', e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>Pied de Page (Footer)</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Slogan Footer</label>
                <textarea 
                  className="form-textarea" 
                  value={current.footer?.tagline || ''} 
                  onChange={(e) => handleFooterChange('tagline', e.target.value)} 
                  rows={2}
                />
              </div>

              <div className="form-field">
                <label>Adresse Principale</label>
                <textarea 
                  className="form-textarea" 
                  value={current.footer?.address || ''} 
                  onChange={(e) => handleFooterChange('address', e.target.value)} 
                  rows={2}
                />
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '14px' }}>
              <label>Texte de Copyright</label>
              <input 
                type="text" 
                className="form-input" 
                value={current.footer?.copyright || ''} 
                onChange={(e) => handleFooterChange('copyright', e.target.value)} 
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
