import React, { useState, useEffect } from 'react';
import { Palette, RotateCcw, Save, Check, MessageSquare, Sparkles } from 'lucide-react';
import { DEFAULT_THEME, saveTheme, applyThemeToDOM } from '../services/cmsService';
import { THEME_PRESETS } from '../data/themePresets';

export default function ThemeTab({ theme, showToast, onOpenThemeModal }) {
  const [colors, setColors] = useState(theme || DEFAULT_THEME);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (theme) setColors(theme);
  }, [theme]);

  const handleColorChange = (key, value) => {
    const updated = { ...colors, [key]: value };
    setColors(updated);
    applyThemeToDOM(updated);
  };

  const handleApplyPreset = async (preset) => {
    setColors(preset.theme);
    applyThemeToDOM(preset.theme);
    setSaving(true);
    try {
      await saveTheme(preset.theme);
      showToast(`Thème "${preset.name}" appliqué et enregistré dans Firebase !`);
    } catch (err) {
      alert("Erreur enregistrement thème : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveTheme(colors);
      showToast("Couleurs enregistrées avec succès dans Firebase !");
    } catch (err) {
      console.error("Save theme error:", err);
      alert("Erreur lors de l'enregistrement : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Rétablir les couleurs d'origine du site HEMIRA ?")) {
      setColors(DEFAULT_THEME);
      applyThemeToDOM(DEFAULT_THEME);
      await saveTheme(DEFAULT_THEME);
      showToast("Couleurs d'origine restaurées !");
    }
  };

  const colorFields = [
    { key: 'navy', label: 'Bleu Nuit Principal', varName: '--navy', desc: 'Arrière-plan du Hero, de la bannière CTA et du Footer' },
    { key: 'navyLight', label: 'Bleu Nuit Clair', varName: '--navy-light', desc: 'Variante pour les bordures et cartes sombres' },
    { key: 'coral', label: 'Couleur d\'Accent / Boutons', varName: '--coral', desc: 'Boutons primaires, liens actifs et halo du chatbot' },
    { key: 'gold', label: 'Doré Élégant', varName: '--gold', desc: 'Chiffres clés des statistiques et titres de colonnes' },
    { key: 'teal', label: 'Bleu Cyan / Saphir', varName: '--teal', desc: 'Pastilles animées, badges et surtitres de section' },
    { key: 'ink', label: 'Texte Sombre (Encre)', varName: '--ink', desc: 'Couleur de lecture des textes sur fond blanc' },
    { key: 'bgLight', label: 'Fond Clair Alterné', varName: '--bg-light', desc: 'Arrière-plan des sections alternées (ex: Services)' },
  ];

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Palette size={20} color="var(--admin-accent)" />
              Thème Couleur Unique du Site
            </h3>
            <p className="admin-card-desc">
              Le thème couleur est unique et s'applique de manière cohérente à l'ensemble du site web. Choisissez une palette prédéfinie ou affinez chaque teinte ci-dessous.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="admin-btn admin-btn-outline" 
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              <span>Défaut</span>
            </button>
            <button 
              type="button" 
              className="admin-btn admin-btn-coral" 
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Enregistrement...' : 'Enregistrer les couleurs'}</span>
            </button>
          </div>
        </div>

        {/* 1. THÈMES PRÉDÉFINIS HARMONISÉS (1 CLIC POUR TOUT LE SITE) */}
        <div style={{
          background: 'var(--admin-card-inner, #F8FAFC)',
          border: '1px solid var(--admin-border, #E2E8F0)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '26px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--admin-text-main, #0F172A)' }}>
                Palettes Harmonieuses Prédéfinies (Appliquées à tout le site)
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--admin-text-muted, #64748B)' }}>
                Cliquez sur une palette pour habiller instantanément l'intégralité du site avec des teintes professionnelles.
              </span>
            </div>
            {onOpenThemeModal && (
              <button
                type="button"
                className="admin-btn admin-btn-outline"
                style={{ fontSize: '12px', padding: '5px 10px' }}
                onClick={onOpenThemeModal}
              >
                Ouvrir la boîte de dialogue
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '12px'
          }}>
            {THEME_PRESETS.map((preset) => {
              const isMatch = colors.navy === preset.theme.navy && colors.coral === preset.theme.coral;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  style={{
                    border: isMatch ? '2px solid var(--admin-accent, #4A7FB8)' : '1px solid var(--admin-border, #CBD5E1)',
                    borderRadius: '12px',
                    padding: '14px',
                    background: isMatch ? 'rgba(74, 127, 184, 0.06)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: isMatch ? '0 4px 14px rgba(74, 127, 184, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: isMatch ? 'var(--admin-accent, #4A7FB8)' : '#F1F5F9',
                      color: isMatch ? '#FFFFFF' : '#475569',
                      padding: '2px 7px',
                      borderRadius: '10px'
                    }}>
                      {preset.badge}
                    </span>
                    {isMatch && <Check size={14} color="var(--admin-accent, #4A7FB8)" />}
                  </div>

                  <div>
                    <strong style={{ fontSize: '13.5px', color: 'var(--admin-text-main, #0F172A)', display: 'block', marginBottom: '2px' }}>
                      {preset.name}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--admin-text-muted, #64748B)', lineHeight: 1.4, display: 'block' }}>
                      {preset.desc}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center', paddingTop: '4px' }}>
                    <div title="Fond Hero" style={{ width: '22px', height: '22px', borderRadius: '6px', background: preset.theme.navy, border: '1px solid rgba(0,0,0,0.1)' }} />
                    <div title="Bouton Primaire" style={{ width: '22px', height: '22px', borderRadius: '6px', background: preset.theme.coral, border: '1px solid rgba(0,0,0,0.1)' }} />
                    <div title="Doré Chiffres" style={{ width: '22px', height: '22px', borderRadius: '6px', background: preset.theme.gold, border: '1px solid rgba(0,0,0,0.1)' }} />
                    <div title="Cyan Pastilles" style={{ width: '22px', height: '22px', borderRadius: '6px', background: preset.theme.teal, border: '1px solid rgba(0,0,0,0.1)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Swatch Preview */}
        <div style={{ 
          background: colors.navy, 
          padding: '24px', 
          borderRadius: '12px', 
          marginBottom: '28px',
          color: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.teal, fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Aperçu instantané des couleurs combinées
          </span>
          <h3 style={{ color: '#fff', fontSize: '22px', marginBottom: '12px' }}>
            Simplifiez vos déplacements avec <span style={{ color: colors.gold }}>HEMIRA</span>
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '18px', maxWidth: '500px' }}>
            Voici comment ressortent vos choix de couleurs (Bleu nuit, Corail, Doré et Cyan).
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button style={{
              background: colors.coral,
              color: '#fff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '13px',
              boxShadow: `0 8px 20px ${colors.coral}66`,
              cursor: 'pointer'
            }}>
              Bouton Principal
            </button>
            <button style={{
              background: 'transparent',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '8px 20px',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              Bouton Secondaire
            </button>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: colors.coral,
              boxShadow: `0 6px 18px ${colors.coral}88`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={16} color="#fff" />
            </div>
          </div>
        </div>

        {/* Color pickers list */}
        <div className="form-grid">
          {colorFields.map((field) => (
            <div key={field.key} className="color-picker-card">
              <div className="color-info">
                <span className="color-name">{field.label}</span>
                <span className="color-var">{field.varName}</span>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>{field.desc}</span>
              </div>
              <div className="color-control">
                <input 
                  type="color" 
                  value={colors[field.key] || '#000000'}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                  className="color-swatch-input"
                />
                <input 
                  type="text" 
                  value={colors[field.key] || ''}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                  className="color-hex-input"
                  maxLength={7}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
