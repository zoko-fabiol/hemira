import React, { useState, useEffect } from 'react';
import { Users, Save, Sparkles } from 'lucide-react';
import { saveContent } from '../services/cmsService';
import FirestoreImageUploader from './FirestoreImageUploader';

export default function AboutTab({ contentFr, contentEn, showToast }) {
  const [activeLang, setActiveLang] = useState('fr');
  const [dataFr, setDataFr] = useState({});
  const [dataEn, setDataEn] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDataFr(contentFr?.about || {});
    setDataEn(contentEn?.about || {});
  }, [contentFr, contentEn]);

  const current = activeLang === 'fr' ? dataFr : dataEn;
  const setCurrent = activeLang === 'fr' ? setDataFr : setDataEn;

  const handleChange = (field, val) => {
    setCurrent(prev => ({ ...prev, [field]: val }));
  };

  const setFounderPhoto = (founderKey, url) => {
    setDataFr(prev => ({
      ...prev,
      [founderKey + 'Photo']: url,
      [founderKey]: { ...(prev?.[founderKey] || {}), photo: url },
      founders: {
        ...(prev?.founders || {}),
        [founderKey]: { ...(prev?.founders?.[founderKey] || {}), photo: url }
      }
    }));
    setDataEn(prev => ({
      ...prev,
      [founderKey + 'Photo']: url,
      [founderKey]: { ...(prev?.[founderKey] || {}), photo: url },
      founders: {
        ...(prev?.founders || {}),
        [founderKey]: { ...(prev?.founders?.[founderKey] || {}), photo: url }
      }
    }));
  };

  const setDuoPhoto = (url) => {
    setDataFr(prev => ({ ...prev, duoPhoto: url }));
    setDataEn(prev => ({ ...prev, duoPhoto: url }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedFr = { ...contentFr, about: dataFr };
      const updatedEn = { ...contentEn, about: dataEn };
      await saveContent('fr', updatedFr);
      await saveContent('en', updatedEn);
      showToast("Section À propos enregistrée avec succès dans Firebase !");
    } catch (err) {
      console.error("Save about error:", err);
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
              <Users size={20} color="var(--admin-accent)" />
              Gestion de la Page "À Propos" & Fondatrices
            </h3>
            <p className="admin-card-desc">
              Modifiez les textes de présentation, les biographies de Jeanne Helene et Miriam, et les photos d'équipe.
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
          {/* Hero Section */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>En-tête de la page</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Titre principal</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.title || ''} 
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Deux associées, une ambition : simplifier chacun de vos voyages" 
                />
              </div>

              <div className="form-field">
                <label>Paragraphe d'accroche (Lead)</label>
                <textarea 
                  className="form-textarea" 
                  value={current.lead || ''} 
                  onChange={(e) => handleChange('lead', e.target.value)}
                  placeholder="Basée à Akwa, Douala, HEMIRA Travel & Services..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Jeanne Helene Epée Nsome */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>Jeanne Helene Epée Nsome</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Nom complet</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.jeanne?.name || "Jeanne Helene Epée Nsome"} 
                  onChange={(e) => {
                    setCurrent(prev => ({
                      ...prev,
                      jeanne: { ...prev.jeanne, name: e.target.value }
                    }));
                  }}
                />
              </div>

              <div className="form-field">
                <label>Titre / Rôle</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.jeanne?.role || "Associée Fondatrice"} 
                  onChange={(e) => {
                    setCurrent(prev => ({
                      ...prev,
                      jeanne: { ...prev.jeanne, role: e.target.value }
                    }));
                  }}
                />
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '14px' }}>
              <label>Biographie & Présentation</label>
              <textarea 
                className="form-textarea" 
                value={current.jeanne?.bio || current.jeanneBio || ''} 
                onChange={(e) => {
                  setCurrent(prev => ({
                    ...prev,
                    jeanne: { ...prev.jeanne, bio: e.target.value },
                    jeanneBio: e.target.value
                  }));
                }}
                rows={4}
              />
            </div>

            {/* Photo Jeanne avec FirestoreImageUploader */}
            <div style={{ marginTop: '16px' }}>
              <FirestoreImageUploader 
                value={current.jeannePhoto || current.jeanne?.photo || ''}
                folder="founders"
                label="Photo de profil - Jeanne Helene Epée Nsome"
                description="Format recommandé: carré ou portrait. Optimisation WebP automatique et stockage Firestore."
                aspectRatio="1/1"
                onChange={(url) => setFounderPhoto('jeanne', url)}
              />
            </div>
          </div>

          {/* Miriam Nguemdo Nouzeda */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>Miriam Nguemdo Nouzeda</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Nom complet</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.miriam?.name || "Miriam Nguemdo Nouzeda"} 
                  onChange={(e) => {
                    setCurrent(prev => ({
                      ...prev,
                      miriam: { ...prev.miriam, name: e.target.value }
                    }));
                  }}
                />
              </div>

              <div className="form-field">
                <label>Titre / Rôle</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.miriam?.role || "Associée Fondatrice"} 
                  onChange={(e) => {
                    setCurrent(prev => ({
                      ...prev,
                      miriam: { ...prev.miriam, role: e.target.value }
                    }));
                  }}
                />
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '14px' }}>
              <label>Biographie & Présentation</label>
              <textarea 
                className="form-textarea" 
                value={current.miriam?.bio || current.miriamBio || ''} 
                onChange={(e) => {
                  setCurrent(prev => ({
                    ...prev,
                    miriam: { ...prev.miriam, bio: e.target.value },
                    miriamBio: e.target.value
                  }));
                }}
                rows={4}
              />
            </div>

            {/* Photo Miriam avec FirestoreImageUploader */}
            <div style={{ marginTop: '16px' }}>
              <FirestoreImageUploader 
                value={current.miriamPhoto || current.miriam?.photo || ''}
                folder="founders"
                label="Photo de profil - Miriam Nguemdo Nouzeda"
                description="Format recommandé: carré ou portrait. Optimisation WebP automatique et stockage Firestore."
                aspectRatio="1/1"
                onChange={(url) => setFounderPhoto('miriam', url)}
              />
            </div>
          </div>

          {/* Photo Duo Fondatrices */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>Photo officielle du Duo de Fondatrices</h4>
            <FirestoreImageUploader 
              value={current.duoPhoto || ''}
              folder="founders"
              label="Photo conjointe des associées (affichée en haut de la section À Propos)"
              description="Optimisation automatique et enregistrement direct dans Firestore."
              aspectRatio="4/3"
              onChange={(url) => setDuoPhoto(url)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
