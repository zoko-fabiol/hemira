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
  ChevronUp
} from 'lucide-react';
import { saveContent } from '../services/cmsService';

export default function ServicesTab({ contentFr, contentEn, showToast }) {
  const [servicesFr, setServicesFr] = useState([]);
  const [servicesEn, setServicesEn] = useState([]);
  const [activeLang, setActiveLang] = useState('fr');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Services on home page or services page
    const listFr = contentFr?.services?.services || contentFr?.home?.services || [];
    const listEn = contentEn?.services?.services || contentEn?.home?.services || [];
    setServicesFr(listFr);
    setServicesEn(listEn);
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
      // Update both home.services and services.services in FR and EN
      const updatedContentFr = {
        ...contentFr,
        home: {
          ...contentFr?.home,
          services: servicesFr
        },
        services: {
          ...contentFr?.services,
          services: servicesFr
        }
      };

      const updatedContentEn = {
        ...contentEn,
        home: {
          ...contentEn?.home,
          services: servicesEn
        },
        services: {
          ...contentEn?.services,
          services: servicesEn
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
              Ajoutez de nouveaux services de voyage, modifiez chaque texte, numéro, description et options.
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

        {/* Language Tabs */}
        <div className="lang-tabs">
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
                          fontWeight: 700 
                        }}>
                          ★ Mis en avant
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
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
