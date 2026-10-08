import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Image as ImageIcon,
  Upload,
  Star
} from 'lucide-react';
import { saveContent, uploadImageFile } from '../services/cmsService';

export default function ServicesTab({ contentFr, contentEn, showToast, onOpenThemeModal }) {
  const [servicesFr, setServicesFr] = useState([]);
  const [servicesEn, setServicesEn] = useState([]);
  const [servicesDesign, setServicesDesign] = useState('default');
  const [servicesAnimation, setServicesAnimation] = useState('default');
  const [activeLang, setActiveLang] = useState('fr');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    // Services on home page or services page
    const listFr = contentFr?.services?.services || contentFr?.home?.services || [];
    const listEn = contentEn?.services?.services || contentEn?.home?.services || [];
    setServicesFr(listFr);
    setServicesEn(listEn);

    const des = contentFr?.services?.servicesDesign || contentFr?.home?.servicesDesign || 'default';
    const anim = contentFr?.services?.servicesAnimation || contentFr?.home?.servicesAnimation || 'default';
    setServicesDesign(des);
    setServicesAnimation(anim);
  }, [contentFr, contentEn]);

  const handleAddService = () => {
    const nextNum = String(servicesFr.length + 1).padStart(2, '0');
    const newServiceFr = {
      num: nextNum,
      title: "Nouveau service de voyage",
      desc: "Description complète du service proposé par HEMIRA Travel & Services.",
      highlight: false,
      items: ["Prestation 1", "Prestation 2", "Assistance dédiée"]
    };
    const newServiceEn = {
      num: nextNum,
      title: "New travel service",
      desc: "Full description of this service provided by HEMIRA Travel & Services.",
      highlight: false,
      items: ["Feature 1", "Feature 2", "Dedicated support"]
    };

    setServicesFr([...servicesFr, newServiceFr]);
    setServicesEn([...servicesEn, newServiceEn]);
    setExpandedIndex(servicesFr.length);
  };

  const handleUpdate = (index, field, value, lang) => {
    if (lang === 'fr') {
      const updated = [...servicesFr];
      updated[index] = { ...updated[index], [field]: value };
      setServicesFr(updated);
    } else {
      const updated = [...servicesEn];
      updated[index] = { ...updated[index], [field]: value };
      setServicesEn(updated);
    }
  };

  const handleServiceImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const url = await uploadImageFile(file, 'services');
      handleUpdate(index, 'media', url, 'fr');
      handleUpdate(index, 'media', url, 'en');
      showToast("Image du service téléversée avec succès !");
    } catch (err) {
      alert("Erreur upload image : " + err.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      setServicesFr(servicesFr.filter((_, i) => i !== index));
      setServicesEn(servicesEn.filter((_, i) => i !== index));
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= servicesFr.length) return;

    const swap = (arr) => {
      const res = [...arr];
      const temp = res[index];
      res[index] = res[targetIndex];
      res[targetIndex] = temp;
      return res;
    };

    setServicesFr(swap(servicesFr));
    setServicesEn(swap(servicesEn));
    setExpandedIndex(targetIndex);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Nettoyer les propriétés individuelles pour garantir l'uniformité du design et de l'animation
      const cleanServices = (list) => (list || []).map(s => {
        const copy = { ...s };
        delete copy.design;
        delete copy.animation;
        delete copy.accentColor;
        return copy;
      });

      const updatedContentFr = {
        ...contentFr,
        home: {
          ...contentFr?.home,
          services: cleanServices(servicesFr),
          servicesDesign,
          servicesAnimation
        },
        services: {
          ...contentFr?.services,
          services: cleanServices(servicesFr),
          servicesDesign,
          servicesAnimation
        }
      };

      const updatedContentEn = {
        ...contentEn,
        home: {
          ...contentEn?.home,
          services: cleanServices(servicesEn),
          servicesDesign,
          servicesAnimation
        },
        services: {
          ...contentEn?.services,
          services: cleanServices(servicesEn),
          servicesDesign,
          servicesAnimation
        }
      };

      await saveContent('fr', updatedContentFr);
      await saveContent('en', updatedContentEn);
      showToast("Tous les services ont été enregistrés avec succès dans Firebase !");
    } catch (err) {
      console.error("Save services error:", err);
      alert("Erreur lors de l'enregistrement : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentList = activeLang === 'fr' ? servicesFr : servicesEn;
  const isWithImg = servicesDesign && servicesDesign.startsWith('with-img-');

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Briefcase size={20} color="var(--admin-accent)" />
              Gestion des Services de Voyage ({currentList.length})
            </h3>
            <p className="admin-card-desc">
              Personnalisez l'apparence uniforme, l'animation et les images de l'ensemble de la section Services.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="admin-btn admin-btn-outline"
              onClick={handleAddService}
            >
              <Plus size={16} />
              <span>Nouveau service</span>
            </button>
            <button 
              type="button" 
              className="admin-btn admin-btn-coral" 
              onClick={handleSaveAll}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Enregistrement...' : 'Enregistrer dans Firebase'}</span>
            </button>
          </div>
        </div>

        {/* Bannière de séparation claire Contenu / Apparence */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          background: 'rgba(240, 98, 77, 0.08)',
          border: '1px solid rgba(240, 98, 77, 0.2)',
          borderRadius: '10px',
          margin: '16px 0 10px',
          fontSize: '12.5px',
          color: 'var(--admin-text-main)'
        }}>
          <Sparkles size={16} color="var(--admin-coral, #F0624D)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Gestion ergonomique séparée :</strong> Les variantes des cartes de services et leurs animations sont gérées dans l'onglet <strong>Apparence</strong>.
          </span>
        </div>

        {/* Language Tabs */}
        <div className="lang-tabs" style={{ marginTop: '20px' }}>
          <button 
            type="button"
            className={`lang-tab-btn ${activeLang === 'fr' ? 'active' : ''}`}
            onClick={() => setActiveLang('fr')}
          >
            FR · Version Française ({servicesFr.length})
          </button>
          <button 
            type="button"
            className={`lang-tab-btn ${activeLang === 'en' ? 'active' : ''}`}
            onClick={() => setActiveLang('en')}
          >
            EN · Version Anglaise ({servicesEn.length})
          </button>
        </div>

        {/* Services List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {currentList.map((service, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={index} 
                style={{ 
                  border: isExpanded ? '1px solid var(--admin-accent)' : '1px solid var(--admin-border)',
                  borderRadius: '14px',
                  background: isExpanded ? 'var(--admin-card-inner)' : 'var(--admin-card-bg)',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isExpanded ? 'var(--admin-shadow)' : 'none'
                }}
              >
                {/* Service Header Row */}
                <div 
                  style={{ 
                    padding: '16px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(74, 127, 184, 0.08)' : 'transparent',
                    borderBottom: isExpanded ? '1px solid var(--admin-border)' : 'none'
                  }}
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ 
                      fontSize: '13px', 
                      fontFamily: 'Sora, sans-serif', 
                      fontWeight: 800, 
                      color: 'var(--admin-coral)',
                      background: 'rgba(240, 98, 77, 0.12)',
                      border: '1px solid rgba(240, 98, 77, 0.25)',
                      padding: '4px 10px', 
                      borderRadius: '8px'
                    }}>
                      {service.num || `0${index + 1}`}
                    </span>
                    <div>
                      <strong style={{ fontSize: '15.5px', color: 'var(--admin-text-main)', letterSpacing: '-0.01em' }}>
                        {service.title || "Service sans titre"}
                      </strong>
                      {service.highlight && (
                        <span style={{ 
                          marginLeft: '10px', 
                          fontSize: '11px', 
                          background: 'rgba(201, 169, 104, 0.18)', 
                          color: 'var(--admin-gold)', 
                          border: '1px solid rgba(201, 169, 104, 0.35)',
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Star size={11} fill="currentColor" /> Mis en avant
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button" 
                      className="admin-btn admin-btn-outline" 
                      style={{ padding: '4px 8px' }}
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      title="Monter"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="admin-btn admin-btn-outline" 
                      style={{ padding: '4px 8px' }}
                      disabled={index === currentList.length - 1}
                      onClick={() => handleMove(index, 1)}
                      title="Descendre"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="admin-btn admin-btn-danger" 
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleDelete(index)}
                      title="Supprimer ce service"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="admin-btn admin-btn-outline" 
                      style={{ padding: '4px 8px' }}
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Service Edit Form Body */}
                {isExpanded && (
                  <div style={{ padding: '20px', borderTop: '1px solid var(--admin-border)' }}>
                    <div className="form-grid" style={{ marginBottom: '16px' }}>
                      <div className="form-field" style={{ maxWidth: '120px' }}>
                        <label>Numéro (ex: 01)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={service.num || ''} 
                          onChange={(e) => {
                            handleUpdate(index, 'num', e.target.value, 'fr');
                            handleUpdate(index, 'num', e.target.value, 'en');
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label>Titre du Service ({activeLang.toUpperCase()})</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={service.title || ''} 
                          onChange={(e) => handleUpdate(index, 'title', e.target.value, activeLang)}
                        />
                      </div>
                    </div>

                    <div className="form-field" style={{ marginBottom: '16px' }}>
                      <label>Description du Service ({activeLang.toUpperCase()})</label>
                      <textarea 
                        className="form-textarea" 
                        value={service.desc || ''} 
                        onChange={(e) => handleUpdate(index, 'desc', e.target.value, activeLang)}
                        rows={3}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', marginBottom: '16px' }}>
                      <input 
                        type="checkbox" 
                        id={`highlight-${index}`}
                        checked={!!service.highlight}
                        onChange={(e) => {
                          handleUpdate(index, 'highlight', e.target.checked, 'fr');
                          handleUpdate(index, 'highlight', e.target.checked, 'en');
                        }}
                      />
                      <label htmlFor={`highlight-${index}`} style={{ fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
                        Mettre ce service en surbrillance dorée (Highlight) sur l'accueil
                      </label>
                    </div>

                    {/* Image pour ce service individuel */}
                    <div style={{
                      padding: '12px 14px',
                      background: '#FFFFFF',
                      border: '1px solid var(--admin-border, #E2E8F0)',
                      borderRadius: '10px',
                      marginTop: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-main, #0F172A)', margin: 0 }}>
                          Image du service #{service.num || index + 1}
                        </label>
                        {isWithImg && (
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#C9A968', background: 'rgba(201,169,104,0.15)', padding: '2px 8px', borderRadius: '10px' }}>
                            Active dans le design sélectionné
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{
                          width: '70px',
                          height: '54px',
                          borderRadius: '8px',
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {service.media ? (
                            <img src={service.media} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={22} color="#94A3B8" />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <label 
                              className="admin-btn admin-btn-outline" 
                              style={{ cursor: 'pointer', fontSize: '12px', padding: '5px 12px' }}
                            >
                              <Upload size={13} />
                              <span>{uploadingIndex === index ? 'Téléversement...' : 'Importer une image'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleServiceImageUpload(e, index)}
                              />
                            </label>
                            {service.media && (
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger"
                                style={{ fontSize: '12px', padding: '5px 8px' }}
                                onClick={() => {
                                  handleUpdate(index, 'media', '', 'fr');
                                  handleUpdate(index, 'media', '', 'en');
                                }}
                              >
                                <Trash2 size={13} /> Retirer
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Ou collez l'URL d'une image (ex: /assets/img/...)"
                            className="form-input"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                            value={service.media || ''}
                            onChange={(e) => {
                              handleUpdate(index, 'media', e.target.value, 'fr');
                              handleUpdate(index, 'media', e.target.value, 'en');
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
