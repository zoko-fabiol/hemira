import React from 'react';

/**
 * Universal Card component:
 * - PAR DÉFAUT : Restitue fidèlement le design et l'animation originale du site HEMIRA
 * - SI PERSONNALISÉ DANS L'ADMIN : Applique l'un des 6 nouveaux designs et l'une des 6 nouvelles animations
 */
export default function CustomSectionCard({
  type = 'service', // 'service' | 'service-home' | 'commitment' | 'case'
  item = {},
  index = 0,
  icon = null,
  extraBadge = null,
  showBigNumber = false,
  extraLabels = {},
  action = null,
  className = '',
  onClick = null,
  children = null
}) {
  // Mode personnalisé ou mode par défaut ?
  const hasCustomDesign = item.design && item.design !== 'default';
  const hasCustomAnim = item.animation && item.animation !== 'default';

  const animClass = hasCustomAnim ? `card-anim--${item.animation}` : '';

  // =========================================================================
  // 1. RENDU PAR DÉFAUT (EXACTEMENT COMME AVANT)
  // =========================================================================
  if (!hasCustomDesign) {
    // Cas A : Étude de cas / Réalisation (Case Studies)
    if (type === 'case') {
      const c = item;
      return (
        <div key={c.id || index} className={`case-card ${animClass}`} id={c.id || `case-${index}`} onClick={onClick}>
          <div className={`case-media ${c.media ? '' : 'logo-only'}`}>
            {c.media ? (
              <img src={c.media} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="mosaic-mini" aria-hidden="true">
                <span className="sq coral"></span>
                <span className="sq gold"></span>
                <span className="sq teal"></span>
              </div>
            )}
          </div>
          <div className="case-body">
            <div className="case-tag">{c.tag}</div>
            <h3>{c.title}</h3>

            {(c.contexte || c.context) && (
              <div className="case-row">
                <strong>{extraLabels?.contextLabel || "Contexte :"}</strong>
                <span>{c.contexte || c.context}</span>
              </div>
            )}
            <div className="case-row">
              <strong>{extraLabels?.needLabel || "Besoin client :"}</strong>
              <span>{c.besoin || c.need}</span>
            </div>
            <div className="case-row">
              <strong>{extraLabels?.interventionLabel || "Intervention HEMIRA :"}</strong>
              <span>{c.intervention || c.response}</span>
            </div>

            <div className="case-result">
              <strong>{extraLabels?.resultLabel || "Résultat obtenu :"}</strong> <span>{c.resultat || c.result}</span>
            </div>
          </div>
        </div>
      );
    }

    // Cas B : Engagement (Commitment)
    if (type === 'commitment') {
      if (showBigNumber) {
        return (
          <div key={index} className={`card service-card ${animClass}`} style={{ position: 'relative', paddingTop: '50px' }} onClick={onClick}>
            <span style={{ position: 'absolute', top: '20px', right: '24px', fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: '48px', color: 'var(--border)', opacity: 0.6, lineHeight: 1 }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="card-icon">
              {icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        );
      }
      return (
        <div key={index} className={`card ${animClass}`} onClick={onClick}>
          <div className="card-icon">
            {icon}
          </div>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      );
    }

    // Cas C : Service sur la page d'accueil (mini-card simple)
    if (type === 'service-home') {
      return (
        <div key={index} className={`mini-card ${item.highlight ? 'highlight' : ''} ${animClass}`} onClick={onClick}>
          <span className="step-num">{item.num}</span>
          <h4>{item.title}</h4>
          <p>{item.desc}</p>
        </div>
      );
    }

    // Cas D : Service sur la page Services (mini-card avec icône et badge)
    return (
      <div 
        key={index} 
        className={`mini-card ${item.highlight ? 'highlight' : ''} ${animClass}`}
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '28px' }}
        onClick={onClick}
      >
        <span style={{ 
          fontFamily: "'Sora',sans-serif", 
          fontWeight: 900, 
          fontSize: '28px', 
          color: item.highlight ? 'var(--gold)' : 'var(--coral)', 
          opacity: 0.7, 
          lineHeight: 1, 
          marginBottom: '6px' 
        }}>
          {item.num}
        </span>
        {icon && (
          <span style={{ color: 'var(--coral)', marginBottom: '8px' }}>
            {icon}
          </span>
        )}
        <h4 style={{ fontSize: '17px', marginBottom: '6px' }}>{item.title}</h4>
        <p style={{ fontSize: '14px', color: 'var(--slate)', margin: 0 }}>{item.desc}</p>
        {item.highlight && (
          <span style={{ 
            marginTop: '10px', 
            fontSize: '11px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            color: 'var(--gold)', 
            background: 'rgba(245,197,24,0.15)', 
            padding: '4px 12px', 
            borderRadius: '20px' 
          }}>
            {extraBadge || 'Service phare'}
          </span>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. RENDU PERSONNALISÉ (QUAND UN DES 6 DESIGNS EST CHOISI DANS L'ADMIN)
  // =========================================================================
  const design = item.design;
  const accent = item.accentColor || (item.highlight ? 'gold' : 'coral');
  const media = item.media || '';
  const num = item.num || (index !== undefined ? String(index + 1).padStart(2, '0') : '');
  const title = item.title || '';
  const desc = item.desc || item.description || '';
  const tag = item.tag || extraBadge || '';
  const items = item.items || item.bullets || [];

  const accentMap = {
    coral: {
      color: 'var(--coral, #F0624D)',
      bgLight: 'rgba(240, 98, 77, 0.1)',
      border: 'rgba(240, 98, 77, 0.25)'
    },
    gold: {
      color: 'var(--gold, #C9A968)',
      bgLight: 'rgba(201, 169, 104, 0.14)',
      border: 'rgba(201, 169, 104, 0.35)'
    },
    teal: {
      color: 'var(--teal, #6FA0D0)',
      bgLight: 'rgba(111, 160, 208, 0.12)',
      border: 'rgba(111, 160, 208, 0.3)'
    },
    navy: {
      color: 'var(--navy, #0E1F3D)',
      bgLight: 'rgba(14, 31, 61, 0.08)',
      border: 'rgba(14, 31, 61, 0.2)'
    }
  };

  const currentAccent = accentMap[accent] || accentMap.coral;

  const renderCardContent = (opts = {}) => (
    <>
      {tag && !opts.hideTag && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: currentAccent.color,
          background: currentAccent.bgLight,
          border: `1px solid ${currentAccent.border}`,
          padding: '3px 10px',
          borderRadius: '20px',
          marginBottom: '12px',
          width: 'fit-content'
        }}>
          {tag}
        </div>
      )}

      {title && (
        <h3 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '19px',
          fontWeight: 800,
          color: 'var(--ink, #16213A)',
          marginBottom: '10px',
          lineHeight: 1.35,
          letterSpacing: '-0.01em'
        }}>
          {title}
        </h3>
      )}

      {desc && (
        <p style={{
          fontSize: '14.5px',
          lineHeight: 1.6,
          color: 'var(--slate, #5B6B7C)',
          marginBottom: (items.length > 0 || item.need || action) ? '16px' : '0'
        }}>
          {desc}
        </p>
      )}

      {/* Case studies rows */}
      {(item.besoin || item.need) && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(item.contexte || item.context) && (
            <div style={{ fontSize: '13.5px' }}>
              <strong style={{ color: 'var(--navy)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em', display: 'block' }}>Contexte :</strong>
              <span style={{ color: 'var(--slate)' }}>{item.contexte || item.context}</span>
            </div>
          )}
          <div style={{ fontSize: '13.5px' }}>
            <strong style={{ color: 'var(--navy)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em', display: 'block' }}>Besoin client :</strong>
            <span style={{ color: 'var(--slate)' }}>{item.besoin || item.need}</span>
          </div>
          {(item.intervention || item.response) && (
            <div style={{ fontSize: '13.5px' }}>
              <strong style={{ color: 'var(--navy)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em', display: 'block' }}>Intervention HEMIRA :</strong>
              <span style={{ color: 'var(--slate)' }}>{item.intervention || item.response}</span>
            </div>
          )}
          {(item.resultat || item.result) && (
            <div style={{
              background: 'rgba(111, 160, 208, 0.12)',
              borderLeft: '3px solid var(--teal, #6FA0D0)',
              padding: '10px 14px',
              borderRadius: '6px',
              marginTop: '6px',
              fontSize: '13.5px'
            }}>
              <strong style={{ color: 'var(--navy)' }}>Résultat : </strong>
              <span style={{ color: 'var(--slate)' }}>{item.resultat || item.result}</span>
            </div>
          )}
        </div>
      )}

      {/* Bullet list */}
      {items.length > 0 && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {items.map((it, idx) => (
            <li key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px',
              color: 'var(--slate, #5B6B7C)'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: currentAccent.color,
                flexShrink: 0
              }} />
              <span>{typeof it === 'string' ? it : it.title || it.text}</span>
            </li>
          ))}
        </ul>
      )}

      {children}

      {action && (
        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          {action}
        </div>
      )}
    </>
  );

  const containerClasses = [
    `card-design--${design}`,
    animClass,
    item.highlight ? 'highlight' : '',
    className
  ].filter(Boolean).join(' ');

  // Design 1: Minimaliste Épuré (No Image)
  if (design === 'no-img-minimal') {
    return (
      <div className={containerClasses} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: currentAccent.bgLight,
            color: currentAccent.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            fontWeight: 800,
            fontFamily: "'Sora', sans-serif"
          }}>
            {icon || num}
          </div>
          {item.highlight && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(201, 169, 104, 0.16)',
              color: 'var(--gold, #C9A968)',
              border: '1px solid rgba(201, 169, 104, 0.35)',
              padding: '3px 10px',
              borderRadius: '20px'
            }}>
              ★ Mis en avant
            </span>
          )}
        </div>
        {renderCardContent()}
      </div>
    );
  }

  // Design 2: Nacre & Glassmorphism (No Image)
  if (design === 'no-img-glass') {
    return (
      <div className={containerClasses} onClick={onClick} style={{ borderColor: currentAccent.border }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{
            padding: '5px 12px',
            borderRadius: '10px',
            background: currentAccent.bgLight,
            color: currentAccent.color,
            fontSize: '13px',
            fontWeight: 800,
            fontFamily: "'Sora', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {icon}
            <span>{num}</span>
          </div>
        </div>
        {renderCardContent()}
      </div>
    );
  }

  // Design 3: Architectural Numéroté (No Image)
  if (design === 'no-img-architect') {
    return (
      <div className={containerClasses} onClick={onClick} style={{ borderTopColor: currentAccent.color }}>
        <span className="architect-watermark">{num}</span>
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            fontSize: '12px',
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            color: currentAccent.color,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Pilier {num}
          </span>
        </div>
        {renderCardContent()}
      </div>
    );
  }

  // Design 4: Split Média Bipartite (With Image)
  if (design === 'with-img-split') {
    return (
      <div className={containerClasses} onClick={onClick}>
        <div className="split-media-pane">
          {media ? (
            <img src={media} alt={title} />
          ) : (
            <div style={{
              height: '100%',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-light, #F7F6F2)',
              color: currentAccent.color,
              fontFamily: "'Sora', sans-serif",
              fontSize: '32px',
              fontWeight: 800
            }}>
              {num}
            </div>
          )}
        </div>
        <div className="split-body-pane">
          {renderCardContent()}
        </div>
      </div>
    );
  }

  // Design 5: Plein Format Lumineux & Frosted Glass (With Image)
  if (design === 'with-img-hero') {
    return (
      <div className={containerClasses} onClick={onClick}>
        <div className="hero-bg-pane">
          {media ? (
            <img src={media} alt={title} />
          ) : (
            <div style={{ 
              height: '100%', 
              background: 'linear-gradient(135deg, #E2E8F0 0%, #F7F6F2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '36px', fontWeight: 900, color: currentAccent.color, opacity: 0.35 }}>
                {num}
              </span>
            </div>
          )}
        </div>
        <div className="hero-frosted-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{
              fontSize: '12px',
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              color: currentAccent.color
            }}>
              {num}
            </span>
            {tag && (
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: currentAccent.color,
                background: currentAccent.bgLight,
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {tag}
              </span>
            )}
          </div>
          {renderCardContent({ hideTag: true })}
        </div>
      </div>
    );
  }

  // Design 6: Bannière Top & Pastille Flottante (With Image)
  if (design === 'with-img-banner') {
    return (
      <div className={containerClasses} onClick={onClick}>
        <div className="banner-media">
          {media ? (
            <img src={media} alt={title} />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentAccent.color,
              fontFamily: "'Sora', sans-serif",
              fontSize: '24px',
              fontWeight: 800,
              opacity: 0.6
            }}>
              {num}
            </div>
          )}
        </div>
        <div className="banner-badge-floating" style={{ color: currentAccent.color }}>
          {icon || num}
        </div>
        <div className="banner-body">
          {renderCardContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} onClick={onClick}>
      {renderCardContent()}
    </div>
  );
}
