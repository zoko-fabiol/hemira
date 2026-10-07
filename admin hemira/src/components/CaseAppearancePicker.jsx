import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Check, 
  MoveUp, 
  Maximize2, 
  Compass, 
  Activity, 
  Feather, 
  SunMedium,
  Palette,
  LayoutTemplate
} from 'lucide-react';

export const CASE_DESIGNS_CONFIG = [
  {
    id: 'default',
    name: '00. Standard HEMIRA (Par Défaut)',
    badge: 'Défaut',
    desc: 'Format 50/50 d’origine : photo à gauche + tag, défi, réponse et résultat turquoise à droite.'
  },
  {
    id: 'case-editorial',
    name: '01. Split Éditorial Magazine',
    badge: 'Magazine',
    desc: 'Photo immersive grand format à gauche avec badge vitré, typographie prestige et liseré doré.'
  },
  {
    id: 'case-cinema',
    name: '02. Panoramique Cinéma & Timeline',
    badge: '16:9 Cinéma',
    desc: 'Bannière photo panoramique 16:9 en haut, suivie d’une timeline en 3 colonnes horizontales.'
  },
  {
    id: 'case-floating',
    name: '03. Studio Luxe & Photo en Relief',
    badge: 'Luxe 3D',
    desc: 'Photo décalée en relief 3D avec ombre douce portée, carte nacrée et étiquette de certification.'
  },
  {
    id: 'case-bento',
    name: '04. Grille Bento Case Study',
    badge: 'Bento Grid',
    desc: 'Disposition Bento ultra-moderne : grand bloc visuel à gauche et cellules Défi, Solution, Résultat.'
  },
  {
    id: 'case-showcase',
    name: '05. Alternance Showcase Gauche/Droite',
    badge: 'Alterné',
    desc: 'Disposition dynamique alternée : photo à gauche pour le 1er, photo à droite pour le 2e, etc.'
  },
  {
    id: 'case-carnet',
    name: '06. Carnet d\'Expédition VIP',
    badge: 'Feuille de Route',
    desc: 'Style carnet de bord officiel : en-tête dossier de mission, cadre photo voyage et sceau de réussite.'
  }
];

export const ANIMATIONS_CONFIG = [
  { id: 'default', name: 'Standard (Défaut)', desc: 'Apparition progressive naturelle', icon: MoveUp },
  { id: 'anim-fade-up', name: 'Fade Up', desc: 'Montée fluide avec fondu', icon: MoveUp },
  { id: 'anim-zoom-in', name: 'Zoom In', desc: 'Révélation zoom dynamique', icon: Maximize2 },
  { id: 'anim-tilt-3d', name: 'Tilt 3D', desc: 'Perspective et relief au survol', icon: Compass },
  { id: 'anim-shimmer', name: 'Lueur Shimmer', desc: 'Reflet doré sur le contour', icon: Sparkles },
  { id: 'anim-float', name: 'Lévitation Douce', desc: 'Balancement aérien continu', icon: Feather },
  { id: 'anim-blur-reveal', name: 'Défloutage Cinéma', desc: 'Transition de flou à net', icon: SunMedium }
];

export default function CaseAppearancePicker({
  design = 'default',
  animation = 'default',
  onUpdate,
  onOpenThemeModal,
  label = "Design & Animation de la section 'Nos Réalisations' (Gros Blocs avec Images)"
}) {
  const [previewAnimKey, setPreviewAnimKey] = useState(0);

  const selectedDesign = CASE_DESIGNS_CONFIG.find(d => d.id === (design || 'default')) || CASE_DESIGNS_CONFIG[0];

  const replayAnimation = () => {
    setPreviewAnimKey(prev => prev + 1);
  };

  // Mini schémas visuels pour chaque design de réalisation
  const renderCaseMiniPreview = (designId) => {
    switch (designId) {
      case 'default':
        return (
          <div style={{ width: '100%', height: '56px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', display: 'grid', gridTemplateColumns: '40% 60%', overflow: 'hidden' }}>
            <div style={{ background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '14px', height: '10px', background: '#94A3B8', borderRadius: '2px' }} />
            </div>
            <div style={{ padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'center' }}>
              <div style={{ width: '40%', height: '3px', background: 'var(--admin-coral, #F0624D)', borderRadius: '2px' }} />
              <div style={{ width: '70%', height: '4px', background: '#0F172A', borderRadius: '2px' }} />
              <div style={{ width: '90%', height: '6px', background: 'rgba(111,160,208,0.2)', borderLeft: '2px solid var(--admin-teal, #6FA0D0)', borderRadius: '1px' }} />
            </div>
          </div>
        );
      case 'case-editorial':
        return (
          <div style={{ width: '100%', height: '56px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', display: 'grid', gridTemplateColumns: '45% 55%', overflow: 'hidden' }}>
            <div style={{ background: '#CBD5E1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ position: 'absolute', top: '3px', left: '3px', background: 'rgba(255,255,255,0.85)', fontSize: '6px', padding: '1px 3px', borderRadius: '2px', color: '#0F172A', fontWeight: 700 }}>VIP</span>
              <div style={{ width: '16px', height: '12px', background: '#94A3B8', borderRadius: '2px' }} />
            </div>
            <div style={{ padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'center' }}>
              <div style={{ width: '75%', height: '4px', background: '#0F172A', borderRadius: '2px' }} />
              <div style={{ width: '55%', height: '3px', background: '#64748B', borderRadius: '2px' }} />
              <div style={{ width: '85%', height: '8px', background: 'rgba(201,169,104,0.15)', borderLeft: '2px solid var(--admin-gold, #C9A968)', borderRadius: '2px' }} />
            </div>
          </div>
        );
      case 'case-cinema':
        return (
          <div style={{ width: '100%', height: '56px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '24px', background: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
              <span style={{ fontSize: '6px', color: '#fff', fontWeight: 700 }}>16:9 Panoramique</span>
              <div style={{ width: '8px', height: '6px', background: 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
            </div>
            <div style={{ flex: 1, padding: '3px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px', alignItems: 'center' }}>
              <div style={{ height: '18px', background: '#F1F5F9', borderRadius: '2px', border: '1px solid #E2E8F0' }} />
              <div style={{ height: '18px', background: '#F1F5F9', borderRadius: '2px', border: '1px solid #E2E8F0' }} />
              <div style={{ height: '18px', background: 'rgba(240,98,77,0.12)', borderRadius: '2px', border: '1px solid rgba(240,98,77,0.3)' }} />
            </div>
          </div>
        );
      case 'case-floating':
        return (
          <div style={{ width: '100%', height: '56px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '4px', display: 'grid', gridTemplateColumns: '40% 60%', gap: '4px', alignItems: 'center' }}>
            <div style={{ height: '44px', background: '#CBD5E1', borderRadius: '4px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)', border: '1px solid #fff' }} />
            <div style={{ background: '#FFFFFF', height: '44px', borderRadius: '4px', border: '1px solid #E2E8F0', padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'center' }}>
              <div style={{ width: '80%', height: '4px', background: '#0F172A', borderRadius: '2px' }} />
              <div style={{ width: '60%', height: '3px', background: '#94A3B8', borderRadius: '2px' }} />
              <div style={{ width: '90%', height: '6px', background: 'rgba(111,160,208,0.15)', borderRadius: '2px' }} />
            </div>
          </div>
        );
      case 'case-bento':
        return (
          <div style={{ width: '100%', height: '56px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '4px', display: 'grid', gridTemplateColumns: '45% 55%', gap: '3px' }}>
            <div style={{ height: '46px', background: '#94A3B8', borderRadius: '4px', display: 'flex', alignItems: 'flex-end', padding: '3px' }}>
              <div style={{ width: '60%', height: '4px', background: '#fff', borderRadius: '1px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '3px' }}>
              <div style={{ background: '#F1F5F9', borderRadius: '3px', border: '1px solid #E2E8F0' }} />
              <div style={{ background: 'rgba(201,169,104,0.18)', borderRadius: '3px', border: '1px solid rgba(201,169,104,0.35)' }} />
            </div>
          </div>
        );
      case 'case-showcase':
        return (
          <div style={{ width: '100%', height: '56px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '3px', display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'center' }}>
            <div style={{ height: '22px', display: 'grid', gridTemplateColumns: '40% 60%', gap: '3px' }}>
              <div style={{ background: '#94A3B8', borderRadius: '2px' }} />
              <div style={{ background: '#F1F5F9', borderRadius: '2px' }} />
            </div>
            <div style={{ height: '22px', display: 'grid', gridTemplateColumns: '60% 40%', gap: '3px' }}>
              <div style={{ background: '#F1F5F9', borderRadius: '2px' }} />
              <div style={{ background: '#94A3B8', borderRadius: '2px' }} />
            </div>
          </div>
        );
      case 'case-carnet':
        return (
          <div style={{ width: '100%', height: '56px', background: '#FFFDF9', border: '1px solid #E5D5C5', borderRadius: '6px', padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '6px', fontWeight: 800, color: 'var(--admin-gold, #C9A968)' }}>DOSSIER VIP</span>
              <span style={{ fontSize: '5.5px', background: '#E2E8F0', padding: '1px 3px', borderRadius: '2px' }}>VALIDÉ</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '3px', flex: 1, alignItems: 'center' }}>
              <div style={{ height: '26px', background: '#CBD5E1', borderRadius: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ width: '90%', height: '3px', background: '#1E293B', borderRadius: '1px' }} />
                <div style={{ width: '70%', height: '3px', background: '#94A3B8', borderRadius: '1px' }} />
                <div style={{ width: '85%', height: '5px', background: 'rgba(240,98,77,0.15)', borderRadius: '1px' }} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
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
      {/* Title & Theme Trigger */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '18px',
        paddingBottom: '14px',
        borderBottom: '1px solid var(--admin-border, #E2E8F0)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(111, 160, 208, 0.15)',
            color: 'var(--admin-teal, #6FA0D0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LayoutTemplate size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--admin-text-main, #0F172A)' }}>
              {label}
            </h4>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-muted, #64748B)' }}>
              Chaque design de réalisation intègre obligatoirement de grandes images et s'applique à tous les blocs.
            </span>
          </div>
        </div>

        {onOpenThemeModal && (
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            style={{ fontSize: '12px', padding: '6px 12px', gap: '6px' }}
            onClick={onOpenThemeModal}
          >
            <Palette size={14} color="var(--admin-gold, #C9A968)" />
            <span>Thème Couleur Unique du Site</span>
          </button>
        )}
      </div>

      {/* SECTION 1 : Les 6 Designs Dédiés Gros Blocs + Défaut */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text-main, #0F172A)' }}>
            1. Choisissez le Design des Réalisations (Gros Blocs avec Photos)
          </label>
          <span style={{ fontSize: '11px', color: 'var(--admin-text-muted, #64748B)' }}>
            Actif : <strong>{selectedDesign.name}</strong>
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {CASE_DESIGNS_CONFIG.map((d) => {
            const isSelected = (design || 'default') === d.id;
            return (
              <div
                key={d.id}
                onClick={() => onUpdate('design', d.id)}
                style={{
                  border: isSelected ? '2px solid var(--admin-accent, #4A7FB8)' : '1px solid var(--admin-border, #CBD5E1)',
                  borderRadius: '12px',
                  padding: '12px',
                  background: isSelected ? 'rgba(74, 127, 184, 0.05)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(74, 127, 184, 0.15)' : 'none'
                }}
              >
                {/* Mini diagramme */}
                {renderCaseMiniPreview(d.id)}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: isSelected ? '#FFFFFF' : 'var(--admin-teal, #6FA0D0)',
                    background: isSelected ? 'var(--admin-accent, #4A7FB8)' : 'rgba(111,160,208,0.12)',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    {d.badge}
                  </span>
                  {isSelected && <Check size={14} color="var(--admin-accent, #4A7FB8)" />}
                </div>

                <strong style={{ fontSize: '12.5px', color: 'var(--admin-text-main, #0F172A)', lineHeight: 1.3 }}>
                  {d.name}
                </strong>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted, #64748B)', lineHeight: 1.4 }}>
                  {d.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 : Animations Fluides */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text-main, #0F172A)' }}>
            2. Animation d'Apparition & d'Interaction
          </label>
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            style={{ fontSize: '11px', padding: '3px 8px', gap: '4px' }}
            onClick={replayAnimation}
          >
            <Eye size={12} />
            <span>Rejouer l'animation</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '8px'
        }}>
          {ANIMATIONS_CONFIG.map((anim) => {
            const isSelected = (animation || 'default') === anim.id;
            const Icon = anim.icon;
            return (
              <div
                key={anim.id}
                onClick={() => onUpdate('animation', anim.id)}
                style={{
                  border: isSelected ? '2px solid var(--admin-coral, #F0624D)' : '1px solid var(--admin-border, #CBD5E1)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  background: isSelected ? 'rgba(240, 98, 77, 0.05)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(240, 98, 77, 0.15)' : '#F1F5F9',
                  color: isSelected ? 'var(--admin-coral, #F0624D)' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-main, #0F172A)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {anim.name}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--admin-text-muted, #64748B)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {anim.desc}
                  </div>
                </div>
                {isSelected && <Check size={14} color="var(--admin-coral, #F0624D)" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3 : Aperçu en Direct avec Photos et Animation */}
      <div style={{
        marginTop: '22px',
        padding: '20px',
        background: '#FFFFFF',
        border: '1px solid var(--admin-border, #CBD5E1)',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={16} color="var(--admin-teal, #6FA0D0)" />
            <strong style={{ fontSize: '13.5px', color: 'var(--admin-text-main, #0F172A)' }}>
              Aperçu en direct du grand bloc : {selectedDesign.name}
            </strong>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            style={{ fontSize: '11px', padding: '4px 10px', gap: '5px' }}
            onClick={replayAnimation}
          >
            <Sparkles size={12} color="var(--admin-coral, #F0624D)" />
            <span>Rejouer l'animation ({animation})</span>
          </button>
        </div>

        <div key={previewAnimKey} className={animation !== 'default' ? `card-anim--${animation}` : ''}>
          {(() => {
            const sampleData = {
              tag: "Exemple VIP · Billets d'Avion & Conciergerie",
              title: "Organisation express d'une mission d'affaires à Dubaï & Tokyo",
              need: "Émission d'urgence de 6 billets classe Affaires sous 4h avec transferts VIP et suites d'hôtel.",
              response: "Activation de nos couloirs de réservation prioritaires et conciergerie 24/7 dédiée.",
              result: "Délégation à destination à l'heure exacte, zéro incident et surclassement offert.",
              image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
            };

            const designId = selectedDesign.id;

            if (designId === 'case-cinema') {
              return (
                <div className="case-design--case-cinema" style={{ marginBottom: 0 }}>
                  <div className="case-cinema-banner">
                    <img src={sampleData.image} alt="" />
                    <div className="case-cinema-banner-overlay">
                      <span className="case-cinema-tag">{sampleData.tag}</span>
                      <h3 className="case-cinema-title">{sampleData.title}</h3>
                    </div>
                  </div>
                  <div className="case-cinema-timeline">
                    <div className="case-cinema-card">
                      <strong>1. Défi & Besoin</strong>
                      <p>{sampleData.need}</p>
                    </div>
                    <div className="case-cinema-card">
                      <strong>2. Solution HEMIRA</strong>
                      <p>{sampleData.response}</p>
                    </div>
                    <div className="case-cinema-card highlight">
                      <strong>3. Résultat Obtenu</strong>
                      <p>{sampleData.result}</p>
                    </div>
                  </div>
                </div>
              );
            }

            if (designId === 'case-floating') {
              return (
                <div className="case-design--case-floating" style={{ marginBottom: 0 }}>
                  <div className="case-floating-media">
                    <img src={sampleData.image} alt="" />
                    <span className="case-floating-seal">HEMIRA VIP CASE</span>
                  </div>
                  <div className="case-floating-body">
                    <span className="case-floating-tag">{sampleData.tag}</span>
                    <h3 className="case-floating-title">{sampleData.title}</h3>
                    <div className="case-floating-box">
                      <div>
                        <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#0F172A', letterSpacing: '0.05em' }}>
                          Besoin client :
                        </strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748B' }}>{sampleData.need}</p>
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#0F172A', letterSpacing: '0.05em' }}>
                          Intervention HEMIRA :
                        </strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748B' }}>{sampleData.response}</p>
                      </div>
                    </div>
                    <div className="case-floating-result">
                      <strong>Résultat obtenu :</strong> <span>{sampleData.result}</span>
                    </div>
                  </div>
                </div>
              );
            }

            if (designId === 'case-bento') {
              return (
                <div className="case-design--case-bento" style={{ marginBottom: 0 }}>
                  <div className="case-bento-hero">
                    <img src={sampleData.image} alt="" />
                    <div className="case-bento-hero-top">
                      <span className="case-editorial-tag" style={{ position: 'static' }}>{sampleData.tag}</span>
                    </div>
                    <div className="case-bento-hero-bottom">
                      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {sampleData.title}
                      </h3>
                    </div>
                  </div>
                  <div className="case-bento-stack">
                    <div className="case-bento-card">
                      <strong style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-coral, #F0624D)', letterSpacing: '0.06em', marginBottom: '4px' }}>
                        Le Défi
                      </strong>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{sampleData.need}</p>
                    </div>
                    <div className="case-bento-card">
                      <strong style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-teal, #6FA0D0)', letterSpacing: '0.06em', marginBottom: '4px' }}>
                        L'Approche HEMIRA
                      </strong>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{sampleData.response}</p>
                    </div>
                    <div className="case-bento-card result">
                      <strong style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-gold, #C9A968)', letterSpacing: '0.06em', marginBottom: '4px' }}>
                        Le Succès Obtenu
                      </strong>
                      <p style={{ margin: 0, fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{sampleData.result}</p>
                    </div>
                  </div>
                </div>
              );
            }

            if (designId === 'case-showcase') {
              return (
                <div className="case-design--case-showcase" style={{ marginBottom: 0 }}>
                  <div className="case-showcase-media">
                    <img src={sampleData.image} alt="" />
                    <div className="case-editorial-tag">{sampleData.tag}</div>
                  </div>
                  <div className="case-showcase-body">
                    <h3 className="case-editorial-title">{sampleData.title}</h3>
                    <div className="case-editorial-step">
                      <span className="case-editorial-step-badge">▸ Besoin client</span>
                      <p>{sampleData.need}</p>
                    </div>
                    <div className="case-editorial-step">
                      <span className="case-editorial-step-badge">▸ Intervention HEMIRA</span>
                      <p>{sampleData.response}</p>
                    </div>
                    <div className="case-editorial-result">
                      <strong>Résultat obtenu :</strong> <span>{sampleData.result}</span>
                    </div>
                  </div>
                </div>
              );
            }

            if (designId === 'case-carnet') {
              return (
                <div className="case-design--case-carnet" style={{ marginBottom: 0 }}>
                  <div className="case-carnet-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '11.5px', color: 'var(--admin-gold, #C9A968)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        DOSSIER VOYAGE #01
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>— {sampleData.title}</span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(240, 98, 77, 0.1)', color: 'var(--admin-coral, #F0624D)', padding: '3px 10px', borderRadius: '12px' }}>
                      {sampleData.tag}
                    </span>
                  </div>
                  <div className="case-carnet-body-grid">
                    <div className="case-carnet-photo">
                      <img src={sampleData.image} alt="" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', letterSpacing: '0.05em', marginBottom: '2px' }}>
                          ✦ Demande Client
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{sampleData.need}</p>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', letterSpacing: '0.05em', marginBottom: '2px' }}>
                          ✦ Réponse Opérationnelle
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{sampleData.response}</p>
                      </div>
                      <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(111, 160, 208, 0.12)', borderLeft: '3px solid var(--admin-teal, #6FA0D0)', fontSize: '13px', color: '#0F172A' }}>
                        <strong>Bilan :</strong> {sampleData.result}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Default ou case-editorial
            return (
              <div className="case-design--case-editorial" style={{ marginBottom: 0 }}>
                <div className="case-editorial-media">
                  <img src={sampleData.image} alt="" />
                  <div className="case-editorial-tag">{sampleData.tag}</div>
                </div>
                <div className="case-editorial-body">
                  <h3 className="case-editorial-title">{sampleData.title}</h3>
                  <div className="case-editorial-step">
                    <div className="case-editorial-step-badge">
                      <span style={{ color: 'var(--admin-coral, #F0624D)' }}>●</span> Besoin client :
                    </div>
                    <p>{sampleData.need}</p>
                  </div>
                  <div className="case-editorial-step">
                    <div className="case-editorial-step-badge">
                      <span style={{ color: 'var(--admin-teal, #6FA0D0)' }}>●</span> Intervention HEMIRA :
                    </div>
                    <p>{sampleData.response}</p>
                  </div>
                  <div className="case-editorial-result">
                    <strong>Résultat obtenu :</strong> <span>{sampleData.result}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* FOOTER : Harmonie du Thème Couleur Global Unique */}
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
            Les teintes et bordures des grands blocs s'harmonisent avec le <strong>thème couleur unique</strong> de tout le site.
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
