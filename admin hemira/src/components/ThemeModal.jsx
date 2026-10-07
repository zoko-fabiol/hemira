import React, { useState } from 'react';
import { Palette, Check, X, Sparkles, Sun, ShieldCheck } from 'lucide-react';
import { THEME_PRESETS } from '../data/themePresets';
import { saveTheme, applyThemeToDOM } from '../services/cmsService';

export default function ThemeModal({ isOpen, onClose, currentTheme, showToast }) {
  const [savingId, setSavingId] = useState(null);

  if (!isOpen) return null;

  const handleApplyPreset = async (preset) => {
    setSavingId(preset.id);
    try {
      applyThemeToDOM(preset.theme);
      await saveTheme(preset.theme);
      if (showToast) {
        showToast(`Thème "${preset.name}" appliqué à tout le site avec succès !`);
      }
      setTimeout(() => {
        setSavingId(null);
        onClose();
      }, 350);
    } catch (err) {
      console.error("Error applying theme:", err);
      alert("Erreur lors de l'application du thème : " + err.message);
      setSavingId(null);
    }
  };

  const isCurrentTheme = (presetTheme) => {
    if (!currentTheme) return false;
    return (
      currentTheme.navy === presetTheme.navy &&
      currentTheme.coral === presetTheme.coral &&
      currentTheme.gold === presetTheme.gold
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(14, 31, 61, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.25s ease'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '820px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px -15px rgba(14, 31, 61, 0.35)',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(74, 127, 184, 0.12)',
              color: 'var(--admin-accent, #4A7FB8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Palette size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A', fontFamily: "'Sora', sans-serif" }}>
                Thème Couleur Unique du Site
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                Sélectionnez une palette harmonieuse qui s'applique instantanément sur toutes les pages et sections du site.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
              transition: 'all 0.2s ease'
            }}
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content: Presets Grid */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '16px'
          }}>
            {THEME_PRESETS.map((preset) => {
              const active = isCurrentTheme(preset.theme);
              const isSaving = savingId === preset.id;

              return (
                <div
                  key={preset.id}
                  style={{
                    border: active ? '2px solid var(--admin-accent, #4A7FB8)' : '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '20px',
                    background: active ? 'rgba(74, 127, 184, 0.04)' : '#FFFFFF',
                    boxShadow: active ? '0 10px 24px -6px rgba(74, 127, 184, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {/* Top info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '3px 9px',
                        borderRadius: '20px',
                        background: active ? 'var(--admin-accent, #4A7FB8)' : '#F1F5F9',
                        color: active ? '#FFFFFF' : '#475569'
                      }}>
                        {preset.badge}
                      </span>
                      {active && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: 'var(--admin-accent, #4A7FB8)'
                        }}>
                          <Check size={14} /> Thème Actif
                        </span>
                      )}
                    </div>

                    <strong style={{ fontSize: '16px', color: '#0F172A', display: 'block', marginBottom: '4px', fontFamily: "'Sora', sans-serif" }}>
                      {preset.name}
                    </strong>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B', lineHeight: 1.5 }}>
                      {preset.desc}
                    </p>
                  </div>

                  {/* Swatches Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                      <div
                        title={`Fond Hero / Titres: ${preset.theme.navy}`}
                        style={{ width: '28px', height: '28px', borderRadius: '8px', background: preset.theme.navy, border: '1px solid rgba(0,0,0,0.1)' }}
                      />
                      <div
                        title={`Boutons / Accent: ${preset.theme.coral}`}
                        style={{ width: '28px', height: '28px', borderRadius: '8px', background: preset.theme.coral, border: '1px solid rgba(0,0,0,0.1)' }}
                      />
                      <div
                        title={`Or Raffiné: ${preset.theme.gold}`}
                        style={{ width: '28px', height: '28px', borderRadius: '8px', background: preset.theme.gold, border: '1px solid rgba(0,0,0,0.1)' }}
                      />
                      <div
                        title={`Bleu Ciel / Pastilles: ${preset.theme.teal}`}
                        style={{ width: '28px', height: '28px', borderRadius: '8px', background: preset.theme.teal, border: '1px solid rgba(0,0,0,0.1)' }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>4 teintes</span>
                  </div>

                  {/* Apply Button */}
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    disabled={isSaving}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      borderRadius: '10px',
                      border: active ? '1px solid var(--admin-accent, #4A7FB8)' : '1px solid #CBD5E1',
                      background: active ? 'var(--admin-accent, #4A7FB8)' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#0F172A',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {active ? (
                      <>
                        <ShieldCheck size={16} /> Déjà appliqué sur le site
                      </>
                    ) : isSaving ? (
                      'Application en cours...'
                    ) : (
                      <>
                        <Sparkles size={15} color="var(--admin-gold, #C9A968)" /> Appliquer à tout le site
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info note */}
        <div style={{
          padding: '16px 28px',
          background: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            💡 Le thème couleur choisi s'applique automatiquement sur le Hero, les boutons, les sections, les cartes et le pied de page.
          </span>
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
