import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  X, 
  Link as LinkIcon, 
  FolderHeart, 
  Sparkles,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { uploadMediaWithMetadata, subscribeMediaLibrary } from '../services/cmsService';

/**
 * Bloc puissant et complet de téléversement d'image / média avec stockage Firestore
 * - Drag & Drop avec état visuel interactif
 * - Compression & optimisation Canvas WebP côté client (fichiers ultra légers sans saturer Firestore)
 * - Double stockage : Firebase Storage avec repli direct sécurisé dans Firestore
 * - Enregistrement automatique dans la collection 'site_media' de Firestore
 * - Prévisualisation instantanée, zoom plein écran (lightbox), outil de copie de lien
 * - Possibilité de choisir directement depuis la Médiathèque Firestore
 * - Saisie manuelle d'URL alternative
 */
export default function FirestoreImageUploader({
  value = '',
  onChange,
  folder = 'uploads',
  label = "Image & Média",
  description = "PNG, JPG, WebP ou SVG. Optimisation automatique.",
  aspectRatio = 'auto', // 'auto' | '16/9' | '1/1' | '4/3'
  showLibraryButton = true,
  disabled = false,
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showLibModal, setShowLibModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [objectFit, setObjectFit] = useState('cover'); // 'cover' | 'contain'
  const [libraryItems, setLibraryItems] = useState([]);
  const [mediaMeta, setMediaMeta] = useState(null);
  const [optimisticPreview, setOptimisticPreview] = useState(null);
  const [uploadStats, setUploadStats] = useState(null);

  const fileInputRef = useRef(null);

  // Écoute de la médiathèque Firestore quand le modal est ouvert
  useEffect(() => {
    if (showLibModal) {
      const unsub = subscribeMediaLibrary((items) => {
        setLibraryItems(items || []);
      });
      return () => unsub?.();
    }
  }, [showLibModal]);

  const processFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP, SVG).");
      return;
    }

    // 1. Aperçu optimiste immédiat (0 ms de latence perçue)
    let tempBlobUrl = null;
    try {
      tempBlobUrl = URL.createObjectURL(file);
      setOptimisticPreview(tempBlobUrl);
    } catch (e) {
      // Ignorer si URL.createObjectURL n'est pas dispo
    }

    setErrorMsg('');
    setIsUploading(true);
    setUploadProgress(25);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress(p => (p < 90 ? p + 25 : p));
      }, 70);

      const result = await uploadMediaWithMetadata(file, folder);
      clearInterval(progressTimer);
      setUploadProgress(100);

      const sec = result.durationMs ? (result.durationMs / 1000).toFixed(1) : '0.8';
      const kb = Math.round((result.compressedSize || result.size) / 1024);
      setUploadStats({ durationSeconds: sec, sizeKb: kb });

      setMediaMeta({
        name: result.name || file.name,
        size: result.compressedSize || result.size,
        dimensions: result.width ? `${result.width}x${result.height}` : null
      });

      if (onChange) {
        onChange(result.url, result);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Erreur lors du téléversement : " + (err.message || "Échec"));
      setOptimisticPreview(null);
    } finally {
      if (tempBlobUrl) {
        setTimeout(() => URL.revokeObjectURL(tempBlobUrl), 2000);
      }
      setTimeout(() => {
        setOptimisticPreview(null);
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) processFileUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0];
    if (file) processFileUpload(file);
    if (e.target) e.target.value = '';
  };

  const handleRemove = (e) => {
    e?.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir retirer cette image ?")) {
      if (onChange) onChange('', null);
      setMediaMeta(null);
    }
  };

  const handleCopyLink = (e) => {
    e?.stopPropagation();
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      if (onChange) onChange(inputUrl.trim(), { url: inputUrl.trim(), name: 'Lien externe' });
      setShowUrlModal(false);
      setInputUrl('');
    }
  };

  const handleSelectFromLibrary = (item) => {
    if (onChange) onChange(item.url, item);
    setMediaMeta({
      name: item.name,
      size: item.compressedSize || item.size,
      dimensions: item.width ? `${item.width}x${item.height}` : null
    });
    setShowLibModal(false);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  };

  return (
    <div className={`firestore-uploader-root ${className}`} style={{ marginBottom: '14px' }}>
      {/* Label & Description */}
      {(label || description) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
          <div>
            {label && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: 'var(--admin-text-main, #0F172A)', margin: 0 }}>
                <Sparkles size={13} color="var(--admin-coral, #F0624D)" />
                <span>{label}</span>
              </label>
            )}
            {description && (
              <span style={{ fontSize: '11px', color: 'var(--admin-text-muted, #64748B)', display: 'block', marginTop: '2px' }}>
                {description}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {showLibraryButton && (
              <button
                type="button"
                className="admin-btn admin-btn-outline"
                style={{ padding: '3px 8px', fontSize: '11px', height: '26px' }}
                onClick={() => setShowLibModal(true)}
                title="Choisir une image existante dans Firestore"
              >
                <FolderHeart size={12} color="var(--admin-gold, #C9A968)" />
                <span>Médiathèque</span>
              </button>
            )}
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              style={{ padding: '3px 8px', fontSize: '11px', height: '26px' }}
              onClick={() => setShowUrlModal(true)}
              title="Coller une URL web"
            >
              <LinkIcon size={12} />
              <span>URL</span>
            </button>
          </div>
        </div>
      )}

      {/* Input de fichier caché */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* 1. ÉTAT CHARGEMENT INITIAL SANS APERÇU OPTIMISTE */}
      {isUploading && !optimisticPreview && !value && (
        <div style={{
          padding: '24px',
          background: 'rgba(240, 98, 77, 0.04)',
          border: '2px dashed var(--admin-coral, #F0624D)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            <RefreshCw size={18} className="spin" color="var(--admin-coral, #F0624D)" />
            <strong style={{ fontSize: '13px', color: 'var(--admin-text-main, #0F172A)' }}>
              Optimisation & Stockage Firestore ultra-rapide... {uploadProgress}%
            </strong>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#E2E8F0',
            borderRadius: '999px',
            overflow: 'hidden',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--admin-coral, #F0624D), var(--admin-gold, #C9A968))',
              transition: 'width 0.2s ease'
            }} />
          </div>
        </div>
      )}

      {/* 2. ÉTAT AVEC IMAGE ACTIVE OU APERÇU OPTIMISTE IMMÉDIAT (0ms) */}
      {(optimisticPreview || value) && (
        <div style={{
          position: 'relative',
          background: 'var(--admin-card-bg, #FFFFFF)',
          border: '1px solid var(--admin-border, #E2E8F0)',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* Cadre Visuel */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: aspectRatio === '16/9' ? '180px' : (aspectRatio === '1/1' ? '140px' : '150px'),
            background: '#0B132B',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <img 
              src={optimisticPreview || value} 
              alt="Média actif" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: objectFit,
                transition: 'transform 0.3s ease',
                opacity: isUploading ? 0.8 : 1
              }}
            />

            {/* Barre de chargement intégrée sur aperçu optimiste */}
            {isUploading && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'rgba(0,0,0,0.4)'
              }}>
                <div style={{
                  height: '100%',
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                  transition: 'width 0.2s ease'
                }} />
              </div>
            )}

            {/* Badge source */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '20px',
              background: 'rgba(11, 19, 43, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#F8FAFC'
            }}>
              <FileCheck size={11} color="var(--admin-teal, #6FA0D0)" />
              <span>{isUploading ? 'Traitement ⚡' : ((optimisticPreview || value).startsWith('data:') ? 'Firestore WebP' : 'En Ligne')}</span>
            </div>

            {/* Bouton Agrandir */}
            <button
              type="button"
              onClick={() => setShowLightbox(true)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(11, 19, 43, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#fff',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Agrandir en plein écran"
            >
              <Maximize2 size={13} />
            </button>

            {/* Toggle Cover / Contain */}
            <button
              type="button"
              onClick={() => setObjectFit(o => o === 'cover' ? 'contain' : 'cover')}
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(11, 19, 43, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#CBD5E1',
                padding: '2px 8px',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Changer le cadrage"
            >
              {objectFit === 'cover' ? 'Remplir (Cover)' : 'Ajuster (Contain)'}
            </button>
          </div>

          {/* Barre d'actions & Infos */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {uploadStats?.durationSeconds && (
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  color: '#059669', 
                  background: 'rgba(16, 185, 129, 0.12)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)', 
                  padding: '2px 8px', 
                  borderRadius: '12px' 
                }}>
                  ⚡ Prêt en {uploadStats.durationSeconds}s ({uploadStats.sizeKb} Ko)
                </span>
              )}
              {mediaMeta?.size && !uploadStats && (
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted, #64748B)', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                  {formatFileSize(mediaMeta.size)}
                </span>
              )}
              {mediaMeta?.dimensions && (
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted, #64748B)', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                  {mediaMeta.dimensions} px
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className="admin-btn admin-btn-outline"
                style={{ padding: '4px 10px', fontSize: '11.5px', height: '28px' }}
                onClick={() => fileInputRef.current?.click()}
                title="Téléverser une autre image"
              >
                <RefreshCw size={12} />
                <span>Remplacer</span>
              </button>

              <button
                type="button"
                className="admin-btn admin-btn-outline"
                style={{ padding: '4px 8px', fontSize: '11.5px', height: '28px' }}
                onClick={handleCopyLink}
                title="Copier le lien direct de l'image"
              >
                {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>

              <button
                type="button"
                className="admin-btn admin-btn-danger"
                style={{ padding: '4px 8px', fontSize: '11.5px', height: '28px' }}
                onClick={handleRemove}
                title="Retirer cette image"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ÉTAT VIDE (ZONE DE GLISSER-DÉPOSER INTERACTIVE) */}
      {!isUploading && !value && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{
            position: 'relative',
            padding: '28px 20px',
            background: isDragging ? 'rgba(240, 98, 77, 0.08)' : 'var(--admin-surface, #F8FAFC)',
            border: isDragging ? '2px dashed var(--admin-coral, #F0624D)' : '2px dashed var(--admin-border, #CBD5E1)',
            borderRadius: '12px',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: isDragging ? 'rgba(240, 98, 77, 0.15)' : 'rgba(14, 31, 61, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDragging ? 'var(--admin-coral, #F0624D)' : 'var(--admin-navy, #0E1F3D)'
          }}>
            <Upload size={20} />
          </div>

          <div>
            <strong style={{ fontSize: '13px', color: 'var(--admin-text-main, #0F172A)', display: 'block' }}>
              {isDragging ? 'Déposez votre image ici...' : 'Glissez-déposez une image ou cliquez pour parcourir'}
            </strong>
            <span style={{ fontSize: '11.5px', color: 'var(--admin-text-muted, #64748B)', marginTop: '3px', display: 'block' }}>
              Stockage direct & haute performance dans Firestore
            </span>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn-outline"
            style={{ marginTop: '4px', fontSize: '12px', padding: '5px 14px' }}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <ImageIcon size={13} />
            <span>Sélectionner un fichier</span>
          </button>
        </div>
      )}

      {/* Message d'erreur */}
      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* MODAL LIGHTBOX ZOOM */}
      {showLightbox && (
        <div 
          onClick={() => setShowLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 14, 26, 0.92)',
            backdropFilter: 'blur(10px)',
            zIndex: 10005,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
          <img 
            src={value} 
            alt="Plein écran" 
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
            }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* MODAL SAISIE URL */}
      {showUrlModal && (
        <div 
          onClick={() => setShowUrlModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 14, 26, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 10004,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <strong style={{ fontSize: '15px', color: '#0F172A' }}>Coller une adresse d'image (URL)</strong>
              <button 
                type="button" 
                onClick={() => setShowUrlModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleApplyUrl}>
              <input 
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/... ou URL du média"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                autoFocus
                style={{ marginBottom: '14px', width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="admin-btn admin-btn-outline" 
                  onClick={() => setShowUrlModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-primary"
                  disabled={!inputUrl.trim()}
                >
                  Appliquer l'image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MÉDIATHÈQUE FIRESTORE */}
      {showLibModal && (
        <div 
          onClick={() => setShowLibModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 14, 26, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10004,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '24px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderHeart size={18} color="var(--admin-gold, #C9A968)" />
                <strong style={{ fontSize: '16px', color: '#0F172A' }}>Médiathèque Firestore (Images Sauvegardées)</strong>
              </div>
              <button 
                type="button" 
                onClick={() => setShowLibModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Grille d'images */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
              padding: '4px'
            }}>
              {libraryItems.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
                  <ImageIcon size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '13px' }}>Aucune image n'a encore été enregistrée dans la médiathèque.</p>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Téléversez une image pour l'ajouter automatiquement ici.</span>
                </div>
              ) : (
                libraryItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectFromLibrary(item)}
                    style={{
                      position: 'relative',
                      height: '110px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      background: '#0B132B',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--admin-coral, #F0624D)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    title={item.name || 'Image'}
                  >
                    <img 
                      src={item.url} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      insetInline: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      padding: '4px 6px',
                      fontSize: '10px',
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name || 'Image'}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
              <button 
                type="button" 
                className="admin-btn admin-btn-outline" 
                onClick={() => setShowLibModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
