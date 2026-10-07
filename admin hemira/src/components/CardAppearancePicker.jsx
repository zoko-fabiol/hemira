import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Sparkles, 
  Layers, 
  Eye, 
  Check, 
  MoveUp, 
  Maximize2, 
  Compass, 
  Activity, 
  Feather, 
  SunMedium 
} from 'lucide-react';
import { uploadImageFile } from '../services/cmsService';

export const DESIGNS_CONFIG = [
  // OPTION PAR DÉFAUT (ORIGINALE DU SITE)
  {
    id: 'default',
    name: '00. Standard (Par Défaut)',
    type: 'default',
    desc: 'Design et disposition d’origine du site HEMIRA',
    badge: 'Par Défaut'
  },

  // 3 NOUVEAUX DESIGNS SANS IMAGE
  {
    id: 'no-img-minimal',
    name: '01. Minimaliste Épuré',
    type: 'no-image',
    desc: 'Fond blanc pur, micro-bordure douce, icône en pastille soignée',
    badge: 'Sans Image'
  },
  {
    id: 'no-img-glass',
    name: '02. Nacre & Glassmorphism',
    type: 'no-image',
    desc: 'Fond translucide nacre, bordure filet or/corail, badge lumineux',
    badge: 'Sans Image'
  },
  {
    id: 'no-img-architect',
    name: '03. Architectural Numéroté',
    type: 'no-image',
    desc: 'Grand numéro filigrane 01 en arrière-plan, barre d’accent en haut',
    badge: 'Sans Image'
  },

  // 3 NOUVEAUX DESIGNS AVEC IMAGE
  {
    id: 'with-img-split',
    name: '04. Split Média Bipartite',
    type: 'with-image',
    desc: 'Disposition 50/50 : photo nette à gauche/haut + contenu à droite',
    badge: 'Avec Image'
  },
  {
    id: 'with-img-hero',
    name: '05. Plein Format & Verre Nacre',
    type: 'with-image',
    desc: 'Image panoramique avec encart inférieur en verre dépoli blanc lumineux',
    badge: 'Avec Image'
  },
  {
    id: 'with-img-banner',
    name: '06. Bannière & Badge Flottant',
    type: 'with-image',
    desc: 'En-tête photo supérieure et pastille d’icône/numéro flottante à cheval',
    badge: 'Avec Image'
  }
];

export const ANIMATIONS_CONFIG = [
  { id: 'default', name: 'Standard (Défaut)', desc: 'Animation fluide d’origine', icon: MoveUp },
  { id: 'anim-fade-up', name: 'Fade Up', desc: 'Montée fluide avec fondu', icon: MoveUp },
  { id: 'anim-zoom-in', name: 'Zoom In', desc: 'Révélation zoom dynamique', icon: Maximize2 },
  { id: 'anim-tilt-3d', name: 'Tilt 3D', desc: 'Perspective et relief au survol', icon: Compass },
  { id: 'anim-shimmer', name: 'Lueur Shimmer', desc: 'Reflet doré sur le contour', icon: Sparkles },
  { id: 'anim-float', name: 'Lévitation Douce', desc: 'Balancement aérien continu', icon: Feather },
  { id: 'anim-blur-reveal', name: 'Défloutage Cinéma', desc: 'Transition de flou à net', icon: SunMedium }
];

export const ACCENT_COLORS = [
  { id: 'coral', name: 'Corail HEMIRA', color: '#F0624D' },
  { id: 'gold', name: 'Or Raffiné', color: '#C9A968' },
  { id: 'teal', name: 'Bleu Ciel Teal', color: '#6FA0D0' },
  { id: 'navy', name: 'Bleu Nuit Navy', color: '#0E1F3D' }
];

export default function CardAppearancePicker({
  design = 'default',
  animation = 'default',
  media = '',
  accentColor = 'coral',
  showMediaUploader = true,
  onUpdate,
  onOpenThemeModal,
  label = "Personnalisation du Design & de l'Animation"
}) {
  const [uploading, setUploading] = useState(false);
  const [previewAnimKey, setPreviewAnimKey] = useState(0);

  const selectedDesign = DESIGNS_CONFIG.find(d => d.id === (design || 'default')) || DESIGNS_CONFIG[0];
  const isImageDesign = selectedDesign.type === 'with-image' || (media && (design === 'default' || !design));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageFile(file, 'card-media');
      onUpdate('media', url);
    } catch (err) {
      alert("Erreur lors de l'envoi de l'image : " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const replayAnimation = () => {
    setPreviewAnimKey(prev => prev + 1);
  };

  return (
    <div style={{
      background: 'var(--admin-card-inner, #F8FAFC)',
      border: '1px solid var(--admin-border, #E2E8F0)',
      borderRadius: '14px',
      padding: '20px',
      marginTop: '16px',
      marginBottom: '16px'
    }}>
      {/* Title & Preview Trigger */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--admin-coral, #F0624D)" />
          <strong style={{ fontSize: '14.5px', color: 'var(--admin-text-main, #0F172A)' }}>
            {label}
          </strong>
        </div>
        <button
          type="button"
          onClick={replayAnimation}
          className="admin-btn admin-btn-outline"
          style={{ fontSize: '12px', padding: '4px 10px' }}
          title="Rejouer l'animation pour tester le rendu"
        >
          <Eye size={13} />
          <span>Tester l'animation</span>
        </button>
      </div>

      {/* 1. SELECTION DES 6 DESIGNS */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--admin-text-muted, #64748B)',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Layers size={14} />
          <span>1. Choisissez un Design (Thème Clair HEMIRA)</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '12px'
        }}>
          {DESIGNS_CONFIG.map((d) => {
            const isSelected = design === d.id;
            return (
              <div
                key={d.id}
                onClick={() => onUpdate('design', d.id)}
                style={{
                  border: isSelected 
                    ? '2px solid var(--admin-coral, #F0624D)' 
                    : '1px solid var(--admin-border, #E2E8F0)',
                  borderRadius: '12px',
                  background: isSelected ? '#FFFFFF' : '#FFFFFF',
                  padding: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected 
                    ? '0 6px 18px -4px rgba(240, 98, 77, 0.2)' 
                    : '0 2px 6px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                {/* Schematic Mini Card Preview */}
                <div style={{
                  height: '62px',
                  borderRadius: '8px',
                  background: '#F7F6F2',
                  border: '1px solid #E7E5DE',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '6px'
                }}>
                  {d.id === 'default' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '5px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(240,98,77,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F0624D' }} />
                      </div>
                      <div style={{ height: '5px', width: '60%', background: '#0E1F3D', borderRadius: '2px' }} />
                      <div style={{ height: '4px', width: '80%', background: '#94A3B8', borderRadius: '2px' }} />
                    </div>
                  )}

                  {d.id === 'no-img-minimal' && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(240,98,77,0.2)' }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ height: '6px', width: '70%', background: '#0E1F3D', borderRadius: '2px' }} />
                        <div style={{ height: '4px', width: '90%', background: '#CBD5E1', borderRadius: '2px' }} />
                      </div>
                    </div>
                  )}

                  {d.id === 'no-img-glass' && (
                    <div style={{
                      height: '100%',
                      background: 'rgba(255,255,255,0.9)',
                      border: '1px solid rgba(201,169,104,0.4)',
                      borderRadius: '6px',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, #C9A968, #F0624D)', borderRadius: '2px' }} />
                      <div style={{ height: '6px', width: '60%', background: '#0E1F3D', borderRadius: '2px' }} />
                      <div style={{ height: '4px', width: '80%', background: '#CBD5E1', borderRadius: '2px' }} />
                    </div>
                  )}

                  {d.id === 'no-img-architect' && (
                    <div style={{ height: '100%', borderTop: '2px solid #F0624D', padding: '4px', position: 'relative' }}>
                      <span style={{ position: 'absolute', right: '4px', top: '0', fontSize: '26px', fontWeight: 900, color: '#E2E8F0', lineHeight: 1 }}>01</span>
                      <div style={{ height: '6px', width: '50%', background: '#0E1F3D', borderRadius: '2px', marginTop: '4px' }} />
                      <div style={{ height: '4px', width: '65%', background: '#CBD5E1', borderRadius: '2px', marginTop: '4px' }} />
                    </div>
                  )}

                  {d.id === 'with-img-split' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', height: '100%' }}>
                      <div style={{ background: '#CBD5E1', borderRadius: '4px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                        <div style={{ height: '5px', width: '80%', background: '#0E1F3D', borderRadius: '2px' }} />
                        <div style={{ height: '4px', width: '90%', background: '#94A3B8', borderRadius: '2px' }} />
                      </div>
                    </div>
                  )}

                  {d.id === 'with-img-hero' && (
                    <div style={{ height: '100%', background: '#94A3B8', borderRadius: '4px', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '3px' }}>
                      <div style={{ width: '100%', background: 'rgba(255,255,255,0.95)', padding: '3px 4px', borderRadius: '4px' }}>
                        <div style={{ height: '5px', width: '70%', background: '#0E1F3D', borderRadius: '2px' }} />
                      </div>
                    </div>
                  )}

                  {d.id === 'with-img-banner' && (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '45%', background: '#CBD5E1', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: '-4px', left: '6px', width: '10px', height: '10px', borderRadius: '50%', background: '#F0624D', border: '1px solid #fff' }} />
                      </div>
                      <div style={{ height: '55%', background: '#fff', padding: '4px 6px 0' }}>
                        <div style={{ height: '4px', width: '70%', background: '#0E1F3D', borderRadius: '2px' }} />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '12.5px', 
                    fontWeight: 700, 
                    color: isSelected ? 'var(--admin-coral, #F0624D)' : 'var(--admin-text-main, #0F172A)' 
                  }}>
                    {d.name}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: d.type === 'with-image' ? 'rgba(74, 127, 184, 0.12)' : 'rgba(201, 169, 104, 0.15)',
                    color: d.type === 'with-image' ? 'var(--admin-accent, #2563EB)' : 'var(--admin-gold, #D97706)'
                  }}>
                    {d.badge}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--admin-text-muted, #64748B)', margin: 0, lineHeight: 1.35 }}>
                  {d.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. GESTION DE L'IMAGE (ACTIF SI AVEC IMAGE) */}
      {showMediaUploader && isImageDesign && (
        <div style={{
          marginBottom: '22px',
          padding: '16px',
          background: '#FFFFFF',
          border: '1px solid var(--admin-border, #E2E8F0)',
          borderRadius: '12px'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--admin-text-muted, #64748B)',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ImageIcon size={14} />
            <span>2. Image de la carte ({selectedDesign.name})</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Thumbnail Preview */}
            <div style={{
              width: '90px',
              height: '70px',
              borderRadius: '8px',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {media ? (
                <img 
                  src={media} 
                  alt="Aperçu" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <ImageIcon size={24} color="#94A3B8" />
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <label 
                  className={`admin-btn admin-btn-outline ${uploading ? 'disabled' : ''}`}
                  style={{ cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '12.5px' }}
                >
                  <Upload size={14} />
                  <span>{uploading ? 'Téléversement...' : 'Importer une image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>

                {media && (
                  <button
                    type="button"
                    onClick={() => onUpdate('media', '')}
                    className="admin-btn admin-btn-danger"
                    style={{ fontSize: '12.5px', padding: '6px 10px' }}
                    title="Supprimer cette image"
                  >
                    <Trash2 size={14} />
                    <span>Retirer</span>
                  </button>
                )}
              </div>

              {/* Direct URL input */}
              <input
                type="text"
                placeholder="Ou collez directement l'URL d'une image..."
                value={media || ''}
                onChange={(e) => onUpdate('media', e.target.value)}
                className="form-input"
                style={{ fontSize: '12.5px', padding: '6px 10px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. SELECTION DE L'ANIMATION (6 CHOIX) */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--admin-text-muted, #64748B)',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Activity size={14} />
          <span>3. Choisissez une Animation Fluide (6 Variantes)</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '8px'
        }}>
          {ANIMATIONS_CONFIG.map((anim) => {
            const isSelected = animation === anim.id;
            const IconComp = anim.icon;
            return (
              <button
                key={anim.id}
                type="button"
                onClick={() => {
                  onUpdate('animation', anim.id);
                  setPreviewAnimKey(prev => prev + 1);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: isSelected 
                    ? '2px solid var(--admin-coral, #F0624D)' 
                    : '1px solid var(--admin-border, #E2E8F0)',
                  background: isSelected ? 'rgba(240, 98, 77, 0.08)' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: isSelected ? 'var(--admin-coral, #F0624D)' : '#F1F5F9',
                  color: isSelected ? '#FFFFFF' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComp size={15} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{
                    fontSize: '12.5px',
                    display: 'block',
                    color: isSelected ? 'var(--admin-coral, #F0624D)' : 'var(--admin-text-main, #0F172A)'
                  }}>
                    {anim.name}
                  </strong>
                  <span style={{ fontSize: '10.5px', color: 'var(--admin-text-muted, #64748B)', whiteSpace: 'nowrap' }}>
                    {anim.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. HARMONIE DU THÈME COULEUR DU SITE (UNIQUE) */}
      <div style={{
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid var(--admin-border, #E2E8F0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={16} color="var(--admin-gold, #C9A968)" />
          <span style={{ fontSize: '12.5px', color: 'var(--admin-text-muted, #64748B)' }}>
            Le thème couleur de ces cartes s'adapte automatiquement à la <strong>palette unique globale</strong> du site.
          </span>
        </div>
        {onOpenThemeModal && (
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            style={{ fontSize: '11.5px', padding: '4px 10px', gap: '5px' }}
            onClick={onOpenThemeModal}
          >
            <Palette size={13} />
            <span>Changer le thème couleur du site</span>
          </button>
        )}
      </div>
    </div>
  );
}
