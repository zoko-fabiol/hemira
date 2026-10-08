import React, { useState, useEffect } from 'react';
import { 
  FolderHeart, 
  Trash2, 
  Copy, 
  Check, 
  Maximize2, 
  Search, 
  Filter, 
  UploadCloud, 
  Sparkles, 
  FileCheck, 
  ExternalLink,
  Layers,
  HardDrive
} from 'lucide-react';
import FirestoreImageUploader from './FirestoreImageUploader';
import { subscribeMediaLibrary, deleteMediaItem } from '../services/cmsService';

export default function MediaLibraryTab({ showToast, onNavigateToSection }) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  useEffect(() => {
    const unsub = subscribeMediaLibrary((items) => {
      setMediaList(items || []);
      setLoading(false);
    });
    return () => unsub?.();
  }, []);

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    if (showToast) showToast("Lien de l'image copié dans le presse-papier !");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Supprimer définitivement l'image "${name || 'Sélection'}" de Firestore ?`)) {
      try {
        await deleteMediaItem(id);
        if (showToast) showToast("Image supprimée de la médiathèque Firestore.");
      } catch (err) {
        alert("Erreur lors de la suppression : " + err.message);
      }
    }
  };

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = !searchTerm || (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const formatBytes = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  };

  const totalBytes = mediaList.reduce((acc, m) => acc + (m.compressedSize || m.size || 0), 0);

  return (
    <div className="admin-tab-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,98,77,0.12) 0%, rgba(201,169,104,0.05) 70%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(201,169,104,0.15)', borderRadius: '20px', color: 'var(--admin-gold, #C9A968)', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
              <HardDrive size={13} />
              <span>Stockage Haute Vitesse Firestore & Firebase</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--admin-text-main, #0F172A)', margin: 0 }}>
              Médiathèque & Gestionnaire d'Images
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: 'var(--admin-text-muted, #64748B)' }}>
              Téléversez, organisez et diffusez vos images en direct sur le site public avec optimisation automatique WebP.
            </p>
          </div>

          {/* Metrics */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Fichiers Actifs</span>
              <strong style={{ fontSize: '20px', color: '#0F172A', fontWeight: 800 }}>{mediaList.length}</strong>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Poids Optimisé</span>
              <strong style={{ fontSize: '20px', color: 'var(--admin-coral, #F0624D)', fontWeight: 800 }}>{formatBytes(totalBytes)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bloc de Téléversement Direct Puissant */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UploadCloud size={18} color="var(--admin-coral, #F0624D)" />
          <span>Nouveau Téléversement Rapide</span>
        </h3>
        
        <FirestoreImageUploader 
          folder="general"
          label=""
          description="Glissez votre image ci-dessous : elle sera compressée sans perte et ajoutée instantanément au catalogue Firestore."
          onChange={(url, meta) => {
            if (url && showToast) {
              showToast("Image téléversée et enregistrée avec succès dans Firestore !");
            }
          }}
          showLibraryButton={false}
        />
      </div>

      {/* Filtres & Recherche */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '400px' }}>
            <Search size={15} style={{ position: 'absolute', top: '10px', left: '12px', color: '#94A3B8' }} />
            <input 
              type="text"
              className="form-input"
              placeholder="Rechercher par nom de fichier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Dossier :</span>
            {[
              { id: 'all', label: 'Tous' },
              { id: 'cases', label: 'Réalisations' },
              { id: 'services', label: 'Services' },
              { id: 'founders', label: 'Fondatrices' },
              { id: 'identity', label: 'Identité / Logo' },
              { id: 'general', label: 'Général' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                className={`admin-btn ${selectedFolder === f.id ? 'admin-btn-primary' : 'admin-btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '11.5px', height: '30px' }}
                onClick={() => setSelectedFolder(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Galerie des Médias Firestore */}
      <div className="admin-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderHeart size={18} color="var(--admin-gold, #C9A968)" />
          <span>Images Enregistrées dans Firestore ({filteredMedia.length})</span>
        </h3>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            Chargement de la médiathèque Firestore...
          </div>
        ) : filteredMedia.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
            <FolderHeart size={44} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', margin: 0 }}>Aucun fichier ne correspond à votre recherche.</p>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Téléversez une image ci-dessus pour débuter votre catalogue.</span>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {filteredMedia.map((item) => (
              <div 
                key={item.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.04)';
                }}
              >
                {/* Vignette */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '140px',
                  background: '#0B132B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={item.url} 
                    alt={item.name || ''} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  
                  {/* Tag dossier */}
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'rgba(11, 19, 43, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    {item.folder || 'général'}
                  </span>

                  {/* Bouton Loupe */}
                  <button
                    type="button"
                    onClick={() => setLightboxUrl(item.url)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(11, 19, 43, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#fff',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Voir en grand"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>

                {/* Métadonnées & Actions */}
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{
                      fontSize: '12.5px',
                      color: '#0F172A',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '4px'
                    }} title={item.name}>
                      {item.name || 'Image'}
                    </strong>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '11px', color: '#64748B' }}>
                      <span>{formatBytes(item.compressedSize || item.size)}</span>
                      {item.width && <span>• {item.width}x{item.height}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-outline"
                      style={{ padding: '3px 8px', fontSize: '11px', height: '26px' }}
                      onClick={() => handleCopy(item.id, item.url)}
                    >
                      {copiedId === item.id ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                      <span>{copiedId === item.id ? 'Copié !' : 'Copier'}</span>
                    </button>

                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '3px 8px', fontSize: '11px', height: '26px' }}
                      onClick={() => handleDelete(item.id, item.name)}
                      title="Supprimer définitivement"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX PLEIN ÉCRAN */}
      {lightboxUrl && (
        <div 
          onClick={() => setLightboxUrl(null)}
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
          <img 
            src={lightboxUrl} 
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
    </div>
  );
}
