import React from 'react';

/**
 * Universal Card component:
 * - PAR DÉFAUT : Restitue fidèlement le design et l'animation originale du site HEMIRA
 * - SI PERSONNALISÉ DANS L'ADMIN : Applique l'un des 6 nouveaux designs et l'une des 6 nouvelles animations
 * - SANS IMAGE : Si une réalisation n'a pas de photo (c.media absent), aucun placeholder n'est injecté,
 *   un affichage textuel de prestige typographique est rendu.
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
  // 1. RENDU PAR DÉFAUT (EXACTEMENT COMME AVANT, MAIS SANS IMAGES IMAGINAIRES)
  // =========================================================================
  if (!hasCustomDesign) {
    // Cas A : Étude de cas / Réalisation (Case Studies)
    if (type === 'case') {
      const c = item;
      const hasMedia = Boolean(c.media && typeof c.media === 'string' && c.media.trim().length > 0);
      const caseImg = hasMedia ? c.media.trim() : null;
      return (
        <div 
          key={c.id || index} 
          className={`case-card ${hasMedia ? 'has-media' : 'no-media'} ${animClass}`} 
          id={c.id || `case-${index}`} 
          onClick={onClick}
        >
          {hasMedia && (
            <div className="case-media">
              <img src={caseImg} alt={c.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div className="case-body">
            <div className="case-tag">{c.tag || extraBadge || "Mission HEMIRA"}</div>
            <h3>{c.title}</h3>

            {(c.contexte || c.context) && (
              <div className="case-row">
                <strong>{extraLabels?.contextLabel || "Contexte :"}</strong>
                <span>{c.contexte || c.context}</span>
              </div>
            )}
            {(c.besoin || c.need) && (
              <div className="case-row">
                <strong>{extraLabels?.needLabel || "Besoin client :"}</strong>
                <span>{c.besoin || c.need}</span>
              </div>
            )}
            {(c.intervention || c.response) && (
              <div className="case-row">
                <strong>{extraLabels?.interventionLabel || "Intervention HEMIRA :"}</strong>
                <span>{c.intervention || c.response}</span>
              </div>
            )}

            {(c.resultat || c.result) && (
              <div className="case-result">
                <strong>{extraLabels?.resultLabel || "Résultat obtenu :"}</strong> <span>{c.resultat || c.result}</span>
              </div>
            )}
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
  // 2. RENDU DÉDIÉ POUR "NOS RÉALISATIONS" (DESIGNS DE PRESTIGE SANS FAKE IMAGES)
  // =========================================================================
  if (type === 'case') {
    const c = item;
    let design = c.design || 'case-editorial';
    // Remplacement de l'ancien 'case-showcase' par 'case-prestige-dark'
    if (design === 'case-showcase') {
      design = 'case-prestige-dark';
    }
    if (design === 'case-minimal-grid') {
      design = 'case-bento';
    }
    if (design === 'case-timeline') {
      design = 'case-cinema';
    }

    const hasMedia = Boolean(c.media && typeof c.media === 'string' && c.media.trim().length > 0);
    const caseImg = hasMedia ? c.media.trim() : null;
    const needText = c.besoin || c.need || '';
    const respText = c.intervention || c.response || '';
    const resultText = c.resultat || c.result || '';
    const contextText = c.contexte || c.context || '';
    const caseTitle = c.title || '';
    const caseTag = c.tag || extraBadge || "Mission HEMIRA";

    // Design 01 : Split Éditorial Magazine
    if (design === 'case-editorial' || design === 'with-img-split') {
      return (
        <div 
          key={c.id || index} 
          className={`case-design--case-editorial ${hasMedia ? 'has-media' : 'no-media'} ${animClass} ${className}`} 
          id={c.id || `case-${index}`} 
          onClick={onClick}
        >
          {hasMedia && (
            <div className="case-editorial-media">
              <img src={caseImg} alt={caseTitle} />
              {caseTag && <div className="case-editorial-tag">{caseTag}</div>}
            </div>
          )}
          <div className="case-editorial-body">
            {(!hasMedia && caseTag) && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--coral, #F0624D)',
                background: 'rgba(240, 98, 77, 0.08)',
                border: '1px solid rgba(240, 98, 77, 0.25)',
                padding: '4px 14px',
                borderRadius: '20px',
                marginBottom: '16px',
                width: 'fit-content'
              }}>
                ✦ {caseTag}
              </div>
            )}
            <h3 className="case-editorial-title">{caseTitle}</h3>

            {contextText && (
              <div className="case-editorial-step">
                <div className="case-editorial-step-badge">
                  <span className="dot" style={{ background: 'var(--navy, #0E1F3D)' }}></span> {extraLabels?.contextLabel || "Contexte :"}
                </div>
                <p>{contextText}</p>
              </div>
            )}

            {needText && (
              <div className="case-editorial-step">
                <div className="case-editorial-step-badge">
                  <span className="dot" style={{ background: 'var(--coral, #F0624D)' }}></span> {extraLabels?.needLabel || "Besoin client :"}
                </div>
                <p>{needText}</p>
              </div>
            )}

            {respText && (
              <div className="case-editorial-step">
                <div className="case-editorial-step-badge">
                  <span className="dot" style={{ background: 'var(--teal, #6FA0D0)' }}></span> {extraLabels?.interventionLabel || "Intervention HEMIRA :"}
                </div>
                <p>{respText}</p>
              </div>
            )}

            {resultText && (
              <div className="case-editorial-result">
                <strong>{extraLabels?.resultLabel || "Résultat obtenu :"}</strong> <span>{resultText}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Design 02 : Panoramique Cinéma & Timeline Pipeline
    if (design === 'case-cinema' || design === 'with-img-banner') {
      return (
        <div key={c.id || index} className={`case-design--case-cinema ${animClass} ${className}`} id={c.id || `case-${index}`} onClick={onClick}>
          {hasMedia ? (
            <div className="case-cinema-banner">
              <img src={caseImg} alt={caseTitle} />
              <div className="case-cinema-banner-overlay">
                {caseTag && <span className="case-cinema-tag">{caseTag}</span>}
                <h3 className="case-cinema-title">{caseTitle}</h3>
              </div>
            </div>
          ) : (
            <div className="case-cinema-header-nomedia">
              {caseTag && <span className="case-cinema-tag">{caseTag}</span>}
              <h3 className="case-cinema-title">{caseTitle}</h3>
            </div>
          )}
          <div className="case-cinema-timeline">
            {contextText && (
              <div className="case-cinema-card">
                <span className="case-cinema-step-num">Étape 01</span>
                <strong>{extraLabels?.contextLabel || "Contexte de la Mission"}</strong>
                <p>{contextText}</p>
              </div>
            )}
            {needText && (
              <div className="case-cinema-card">
                <span className="case-cinema-step-num">{contextText ? "Étape 02" : "Étape 01"}</span>
                <strong>{extraLabels?.needLabel || "Défi & Exigence Client"}</strong>
                <p>{needText}</p>
              </div>
            )}
            {respText && (
              <div className="case-cinema-card">
                <span className="case-cinema-step-num">{contextText ? "Étape 03" : "Étape 02"}</span>
                <strong>{extraLabels?.interventionLabel || "Stratégie & Déploiement HEMIRA"}</strong>
                <p>{respText}</p>
              </div>
            )}
            {resultText && (
              <div className="case-cinema-card highlight">
                <span className="case-cinema-step-num" style={{ color: 'var(--gold, #C9A968)' }}>Bilan & Succès</span>
                <strong>{extraLabels?.resultLabel || "Résultat Obtenu"}</strong>
                <p>{resultText}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Design 03 : Grille Bento Case Study Moderne
    if (design === 'case-bento') {
      return (
        <div 
          key={c.id || index} 
          className={`case-design--case-bento ${hasMedia ? 'has-media' : 'no-media'} ${animClass} ${className}`} 
          id={c.id || `case-${index}`} 
          onClick={onClick}
        >
          <div className="case-bento-hero">
            {hasMedia && <img src={caseImg} alt={caseTitle} />}
            <div className="case-bento-hero-top">
              {caseTag && <span className="case-editorial-tag" style={{ position: 'static' }}>{caseTag}</span>}
            </div>
            <div className="case-bento-hero-bottom">
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--coral, #F0624D)', display: 'block', marginBottom: '4px' }}>
                Mission VIP #{String(index + 1).padStart(2, '0')}
              </span>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', fontWeight: 800, color: 'var(--ink, #16213A)', margin: 0, lineHeight: 1.35 }}>
                {caseTitle}
              </h3>
              {contextText && (
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.5 }}>
                  {contextText}
                </p>
              )}
            </div>
          </div>
          <div className="case-bento-stack">
            {needText && (
              <div className="case-bento-card">
                <strong style={{ fontSize: '11.5px', textTransform: 'uppercase', color: 'var(--coral, #F0624D)', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  ✦ {extraLabels?.needLabel || "Le Défi & Problématique"}
                </strong>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.55 }}>{needText}</p>
              </div>
            )}
            {respText && (
              <div className="case-bento-card">
                <strong style={{ fontSize: '11.5px', textTransform: 'uppercase', color: 'var(--teal, #6FA0D0)', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  ✦ {extraLabels?.interventionLabel || "L'Approche & Solution HEMIRA"}
                </strong>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.55 }}>{respText}</p>
              </div>
            )}
            {resultText && (
              <div className="case-bento-card result">
                <strong style={{ fontSize: '11.5px', textTransform: 'uppercase', color: 'var(--gold, #C9A968)', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  ★ {extraLabels?.resultLabel || "Le Succès Obtenu"}
                </strong>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink, #16213A)', fontWeight: 600, lineHeight: 1.55 }}>{resultText}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Design 04 : Fiche Carnet d'Expédition VIP
    if (design === 'case-carnet') {
      return (
        <div key={c.id || index} className={`case-design--case-carnet ${animClass} ${className}`} id={c.id || `case-${index}`} onClick={onClick}>
          <div className="case-carnet-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className="case-carnet-seal-badge">
                DOSSIER EXPÉDITION #{String(index + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink, #16213A)' }}>— {caseTitle}</span>
            </div>
            {caseTag && (
              <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(240, 98, 77, 0.1)', color: 'var(--coral, #F0624D)', padding: '4px 12px', borderRadius: '14px' }}>
                {caseTag}
              </span>
            )}
          </div>
          <div className={`case-carnet-body-grid ${hasMedia ? 'has-media' : 'no-media'}`}>
            {hasMedia && (
              <div className="case-carnet-photo">
                <img src={caseImg} alt={caseTitle} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {contextText && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy, #0E1F3D)', letterSpacing: '0.06em', marginBottom: '3px' }}>
                    ✦ {extraLabels?.contextLabel || "Contexte Officiel"}
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.55 }}>{contextText}</p>
                </div>
              )}
              {needText && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy, #0E1F3D)', letterSpacing: '0.06em', marginBottom: '3px' }}>
                    ✦ {extraLabels?.needLabel || "Demande Client Exprimée"}
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.55 }}>{needText}</p>
                </div>
              )}
              {respText && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy, #0E1F3D)', letterSpacing: '0.06em', marginBottom: '3px' }}>
                    ✦ {extraLabels?.interventionLabel || "Réponse Opérationnelle Déployée"}
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.55 }}>{respText}</p>
                </div>
              )}
              {resultText && (
                <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(201, 169, 104, 0.14)', borderLeft: '4px solid var(--gold, #C9A968)', fontSize: '14px', color: 'var(--ink, #16213A)' }}>
                  <strong>{extraLabels?.resultLabel || "Bilan Opérationnel :"}</strong> {resultText}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Design 05 : Écrin Sombre Nuit d'Étoiles & Or Royal (Black Tie VIP)
    if (design === 'case-prestige-dark') {
      return (
        <div 
          key={c.id || index} 
          className={`case-design--case-prestige-dark ${hasMedia ? 'has-media' : 'no-media'} ${animClass} ${className}`} 
          id={c.id || `case-${index}`} 
          onClick={onClick}
        >
          {hasMedia && (
            <div className="case-editorial-media" style={{ background: '#050D18' }}>
              <img src={caseImg} alt={caseTitle} />
              {caseTag && <div className="case-prestige-dark-tag" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 2 }}>{caseTag}</div>}
            </div>
          )}
          <div className="case-prestige-dark-body">
            {(!hasMedia && caseTag) && (
              <div className="case-prestige-dark-tag">
                ★ {caseTag}
              </div>
            )}
            <h3 className="case-prestige-dark-title">{caseTitle}</h3>

            {contextText && (
              <div className="case-prestige-dark-step">
                <strong>✦ {extraLabels?.contextLabel || "Contexte :"}</strong>
                <p>{contextText}</p>
              </div>
            )}
            {needText && (
              <div className="case-prestige-dark-step">
                <strong>✦ {extraLabels?.needLabel || "Besoin client :"}</strong>
                <p>{needText}</p>
              </div>
            )}
            {respText && (
              <div className="case-prestige-dark-step">
                <strong>✦ {extraLabels?.interventionLabel || "Intervention HEMIRA :"}</strong>
                <p>{respText}</p>
              </div>
            )}
            {resultText && (
              <div className="case-prestige-dark-result">
                <strong>{extraLabels?.resultLabel || "Résultat d'Excellence :"}</strong> <span>{resultText}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Design 06 : Studio Luxe & Photo Décalée en Relief
    if (design === 'case-floating' || design === 'with-img-hero') {
      return (
        <div 
          key={c.id || index} 
          className={`case-design--case-floating ${hasMedia ? 'has-media' : 'no-media'} ${animClass} ${className}`} 
          id={c.id || `case-${index}`} 
          onClick={onClick}
        >
          {hasMedia && (
            <div className="case-floating-media">
              <img src={caseImg} alt={caseTitle} />
              <span className="case-floating-seal">HEMIRA VIP CASE</span>
            </div>
          )}
          <div className="case-floating-body">
            {caseTag && <span className="case-floating-tag">✦ {caseTag}</span>}
            <h3 className="case-floating-title">{caseTitle}</h3>
            <div className="case-floating-box">
              {contextText && (
                <div>
                  <strong style={{ display: 'block', fontSize: '11.5px', textTransform: 'uppercase', color: 'var(--navy, #0E1F3D)', letterSpacing: '0.05em' }}>
                    {extraLabels?.contextLabel || "Contexte :"}
                  </strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.55 }}>{contextText}</p>
                </div>
              )}
              {needText && (
                <div>
                  <strong style={{ display: 'block', fontSize: '11.5px', textTransform: 'uppercase', color: 'var(--navy, #0E1F3D)', letterSpacing: '0.05em' }}>
                    {extraLabels?.needLabel || "Besoin client :"}
                  </strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.55 }}>{needText}</p>
                </div>
              )}
              {respText && (
                <div>
                  <strong style={{ display: 'block', fontSize: '11.5px', textTransform: 'uppercase', color: 'var(--navy, #0E1F3D)', letterSpacing: '0.05em' }}>
                    {extraLabels?.interventionLabel || "Intervention HEMIRA :"}
                  </strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: 'var(--slate, #5B6B7C)', lineHeight: 1.55 }}>{respText}</p>
                </div>
              )}
            </div>
            {resultText && (
              <div className="case-floating-result">
                <strong>{extraLabels?.resultLabel || "Résultat obtenu :"}</strong> <span>{resultText}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Fallback gracieux si design non reconnu : Rendu Éditorial
    return (
      <div 
        key={c.id || index} 
        className={`case-design--case-editorial ${hasMedia ? 'has-media' : 'no-media'} ${animClass} ${className}`} 
        id={c.id || `case-${index}`} 
        onClick={onClick}
      >
        {hasMedia && (
          <div className="case-editorial-media">
            <img src={caseImg} alt={caseTitle} />
            {caseTag && <div className="case-editorial-tag">{caseTag}</div>}
          </div>
        )}
        <div className="case-editorial-body">
          {(!hasMedia && caseTag) && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--coral, #F0624D)',
              background: 'rgba(240, 98, 77, 0.08)',
              border: '1px solid rgba(240, 98, 77, 0.25)',
              padding: '4px 14px',
              borderRadius: '20px',
              marginBottom: '16px',
              width: 'fit-content'
            }}>
              ✦ {caseTag}
            </div>
          )}
          <h3 className="case-editorial-title">{caseTitle}</h3>
          {needText && (
            <div className="case-editorial-step">
              <div className="case-editorial-step-badge">
                <span className="dot" style={{ background: 'var(--coral, #F0624D)' }}></span> {extraLabels?.needLabel || "Besoin client :"}
              </div>
              <p>{needText}</p>
            </div>
          )}
          {respText && (
            <div className="case-editorial-step">
              <div className="case-editorial-step-badge">
                <span className="dot" style={{ background: 'var(--teal, #6FA0D0)' }}></span> {extraLabels?.interventionLabel || "Intervention HEMIRA :"}
              </div>
              <p>{respText}</p>
            </div>
          )}
          {resultText && (
            <div className="case-editorial-result">
              <strong>{extraLabels?.resultLabel || "Résultat obtenu :"}</strong> <span>{resultText}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. RENDU PERSONNALISÉ POUR SERVICES & ENGAGEMENTS
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

  // Design: Surélévation Moderne 3D (card-elevated ou no-img-minimal)
  if (design === 'card-elevated' || design === 'no-img-minimal') {
    return (
      <div className={`card-design--card-elevated ${containerClasses}`} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div className="card-icon-pill" style={{
            background: currentAccent.bgLight,
            color: currentAccent.color,
            boxShadow: `inset 0 0 0 1px ${currentAccent.border}`
          }}>
            {icon || num}
          </div>
          {item.highlight ? (
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
          ) : (
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: currentAccent.color,
              opacity: 0.8
            }}>
              0{index + 1}
            </span>
          )}
        </div>
        {renderCardContent()}
      </div>
    );
  }

  // Design: Piliers Architecturaux (card-bordered ou no-img-architect)
  if (design === 'card-bordered' || design === 'no-img-architect') {
    return (
      <div className={`card-design--card-bordered ${containerClasses}`} onClick={onClick} style={{ borderTopColor: currentAccent.color }}>
        <span className="card-watermark">{num}</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{
            fontSize: '11.5px',
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            color: currentAccent.color,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: currentAccent.bgLight,
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            Pilier {num}
          </span>
          {icon && (
            <div style={{ color: currentAccent.color, opacity: 0.9 }}>
              {icon}
            </div>
          )}
        </div>
        {renderCardContent()}
      </div>
    );
  }

  // Design: Minimaliste Typographique & Lignes Pures (card-minimal)
  if (design === 'card-minimal') {
    return (
      <div className={`card-design--card-minimal ${containerClasses}`} onClick={onClick} style={{ borderLeftColor: currentAccent.color }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{
            fontSize: '12px',
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            color: currentAccent.color,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            // {num}
          </span>
          {icon && (
            <span style={{ color: currentAccent.color, opacity: 0.8 }}>
              {icon}
            </span>
          )}
        </div>
        {renderCardContent()}
      </div>
    );
  }

  // Design: Écrin Sombre Nuit & Or VIP (card-dark ou no-img-dark)
  if (design === 'card-dark' || design === 'no-img-dark') {
    return (
      <div className={`card-design--card-dark ${containerClasses}`} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#D4AF37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            fontWeight: 800,
            fontFamily: "'Sora', sans-serif"
          }}>
            {icon || num}
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#D4AF37',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'rgba(212, 175, 55, 0.1)',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.25)'
          }}>
            VIP ★ #{num}
          </span>
        </div>
        {renderCardContent()}
      </div>
    );
  }

  // Design: Nacre & Glassmorphism (card-glass ou no-img-glass)
  if (design === 'card-glass' || design === 'no-img-glass') {
    return (
      <div className={`card-design--card-glass ${containerClasses}`} onClick={onClick} style={{ borderColor: currentAccent.border }}>
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
          {item.highlight && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--gold, #C9A968)',
              background: 'rgba(201, 169, 104, 0.15)',
              padding: '3px 8px',
              borderRadius: '12px'
            }}>
              ★ Phare
            </span>
          )}
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
