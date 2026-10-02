import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Save, Check, RefreshCw } from 'lucide-react';
import { DEFAULT_SETTINGS, saveSettings, uploadImageFile } from '../services/cmsService';

export default function IdentityTab({ settings, showToast }) {
  const [form, setForm] = useState(settings || DEFAULT_SETTINGS);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingMark, setUploadingMark] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleFileUpload = async (e, field, setUploadingState) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState(true);
    try {
      const url = await uploadImageFile(file, 'identity');
      handleChange(field, url);
      showToast("Fichier téléversé avec succès ! N'oubliez pas d'enregistrer.");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Erreur lors de l'envoi de l'image : " + err.message);
    } finally {
      setUploadingState(false);
    }
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

          {/* Logo Principal Upload */}
          <div className="form-grid" style={{ marginBottom: '24px' }}>
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: '14px', padding: '20px', background: 'var(--admin-card-inner)' }}>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--admin-text-main)' }}>
                Logo Principal (Header & Footer)
              </label>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                <div className="image-preview-wrap">
                  <img 
                    src={form.logoUrl || '/assets/img/uploads/logo-hemira-full.png'} 
                    alt="Logo preview" 
                    onError={(e) => { e.target.src = '/assets/img/uploads/logo-hemira-full.png'; }}
                  />
                </div>
                <div>
                  <label className="admin-btn admin-btn-outline" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                    <Upload size={14} />
                    <span>{uploadingLogo ? 'Envoi...' : 'Choisir un fichier'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, 'logoUrl', setUploadingLogo)}
                    />
                  </label>
                </div>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '12px' }}>Ou collez une URL d'image directe</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={form.logoUrl || ''} 
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="/assets/img/uploads/logo-hemira-full.png ou https://..." 
                />
              </div>
            </div>

            {/* Logo Mark (Favicon) */}
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: '14px', padding: '20px', background: 'var(--admin-card-inner)' }}>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--admin-text-main)' }}>
                Icône de Marque / Favicon (Carré)
              </label>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                <div className="image-preview-wrap" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={form.logoMarkUrl || '/assets/img/uploads/logo-hemira-mark.png'} 
                    alt="Mark preview" 
                    style={{ maxHeight: '48px', maxWidth: '48px' }}
                    onError={(e) => { e.target.src = '/assets/img/uploads/logo-hemira-mark.png'; }}
                  />
                </div>
                <div>
                  <label className="admin-btn admin-btn-outline" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                    <Upload size={14} />
                    <span>{uploadingMark ? 'Envoi...' : 'Choisir un fichier'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, 'logoMarkUrl', setUploadingMark)}
                    />
                  </label>
                </div>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '12px' }}>Ou collez une URL d'icône directe</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={form.logoMarkUrl || ''} 
                  onChange={(e) => handleChange('logoMarkUrl', e.target.value)}
                  placeholder="/assets/img/uploads/logo-hemira-mark.png" 
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
