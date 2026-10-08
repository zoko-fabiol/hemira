import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Save } from 'lucide-react';
import { DEFAULT_SETTINGS, saveSettings } from '../services/cmsService';
import FirestoreImageUploader from './FirestoreImageUploader';

export default function IdentityTab({ settings, showToast }) {
  const [form, setForm] = useState(settings || DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(form);
      showToast("Identité et logo enregistrés avec succès dans Firebase !");
    } catch (err) {
      console.error("Save settings error:", err);
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
              <ImageIcon size={20} color="var(--admin-accent)" />
              Logo & Identité Visuelle
            </h3>
            <p className="admin-card-desc">
              Changez le logo principal du site, l'icône de marque et les titres officiels.
            </p>
          </div>
          <button 
            type="button" 
            className="admin-btn admin-btn-coral" 
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-grid" style={{ marginBottom: '24px' }}>
            <div className="form-field">
              <label>Nom officiel du site</label>
              <input 
                type="text" 
                className="form-input" 
                value={form.siteTitle || ''} 
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                placeholder="HEMIRA Travel & Services" 
              />
              <span className="helper">Affiché dans le titre de page et les métadonnées</span>
            </div>

            <div className="form-field">
              <label>Slogan principal (Tagline)</label>
              <input 
                type="text" 
                className="form-input" 
                value={form.siteTagline || ''} 
                onChange={(e) => handleChange('siteTagline', e.target.value)}
                placeholder="Agence de voyage à Douala..." 
              />
              <span className="helper">Utilisé dans le pied de page et les aperçus</span>
            </div>
          </div>

          {/* Logo Principal & Favicon Upload avec FirestoreImageUploader */}
          <div className="form-grid" style={{ marginBottom: '24px' }}>
            <div>
              <FirestoreImageUploader 
                value={form.logoUrl || ''}
                folder="identity"
                label="Logo Principal (Header, Barre de navigation & Pied de page)"
                description="Format SVG, PNG transparent ou WebP. Compression automatique et stockage Firestore."
                aspectRatio="auto"
                onChange={(url) => handleChange('logoUrl', url)}
              />
            </div>

            <div>
              <FirestoreImageUploader 
                value={form.logoMarkUrl || ''}
                folder="identity"
                label="Icône de Marque & Favicon (Carré)"
                description="Icône d'onglet de navigation et pictogramme de marque officiel. Recommandé : format carré."
                aspectRatio="1/1"
                onChange={(url) => handleChange('logoMarkUrl', url)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
