import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  ChevronUp, 
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { saveContent, uploadImageFile } from '../services/cmsService';

export default function CaseStudiesTab({ contentFr, contentEn, showToast }) {
  const [casesFr, setCasesFr] = useState([]);
  const [casesEn, setCasesEn] = useState([]);
  const [activeLang, setActiveLang] = useState('fr');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    const listFr = contentFr?.caseStudies?.cases || [];
    const listEn = contentEn?.caseStudies?.cases || [];
    setCasesFr(listFr);
    setCasesEn(listEn);
  }, [contentFr, contentEn]);

  const handleAddCase = () => {
    const newCaseFr = {
      tag: "Exemple de mission — Nouveau service",
      title: "Organisation complète d'un déplacement d'envergure",
      need: "Le client avait besoin d'une prise en charge rapide de son dossier.",
      response: "HEMIRA Travel & Services a mobilisé son réseau de partenaires fiables.",
      result: "Déplacement réussi sans encombre et gain de temps considérable.",
      media: "/assets/img/uploads/hemira-hero-illustration.png"
    };

    const newCaseEn = {
      tag: "Mission example — New service",
      title: "Complete organization of a major trip",
      need: "The client needed urgent handling of their travel files.",
      response: "HEMIRA Travel & Services mobilized its network of verified partners.",
      result: "Smooth travel completed on schedule with substantial time savings.",
      media: "/assets/img/uploads/hemira-hero-illustration.png"
    };

    setCasesFr([...casesFr, newCaseFr]);
    setCasesEn([...casesEn, newCaseEn]);
    setExpandedIndex(casesFr.length);
  };

  const handleUpdate = (index, field, value, lang) => {
    if (lang === 'fr') {
      const updated = [...casesFr];
      updated[index] = { ...updated[index], [field]: value };
      setCasesFr(updated);
    } else {
      const updated = [...casesEn];
      updated[index] = { ...updated[index], [field]: value };
      setCasesEn(updated);
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const url = await uploadImageFile(file, 'cases');
      handleUpdate(index, 'media', url, 'fr');
      handleUpdate(index, 'media', url, 'en');
      showToast("Image téléversée avec succès ! N'oubliez pas d'enregistrer.");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Erreur lors de l'envoi de l'image : " + err.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réalisation ?")) {
      setCasesFr(casesFr.filter((_, i) => i !== index));
      setCasesEn(casesEn.filter((_, i) => i !== index));
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= casesFr.length) return;

    const swap = (arr) => {
      const res = [...arr];
      const temp = res[index];
      res[index] = res[targetIndex];
      res[targetIndex] = temp;
      return res;
    };

    setCasesFr(swap(casesFr));
    setCasesEn(swap(casesEn));
    setExpandedIndex(targetIndex);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updatedFr = {
        ...contentFr,
        caseStudies: {
          ...contentFr?.caseStudies,
          cases: casesFr
        }
      };

      const updatedEn = {
        ...contentEn,
        caseStudies: {
          ...contentEn?.caseStudies,
          cases: casesEn
        }
      };

      await saveContent('fr', updatedFr);
      await saveContent('en', updatedEn);
      showToast("Toutes les réalisations ont été enregistrées avec succès dans Firebase !");
    } catch (err) {
      console.error("Save cases error:", err);
      alert("Erreur lors de l'enregistrement : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentList = activeLang === 'fr' ? casesFr : casesEn;

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Award size={20} color="var(--admin-accent)" />
              Gestion de "Nos Réalisations" ({currentList.length})
            </h3>
            <p className="admin-card-desc">
              Modifiez chaque mission, défi, solution et résultat concret, et ajoutez de nouvelles réalisations.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="admin-btn admin-btn-outline"
              onClick={handleAddCase}
            >
              <Plus size={16} />
              <span>Nouvelle réalisation</span>
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
            FR · Version Française ({casesFr.length})
          </button>
          <button 
            type="button"
            className={`lang-tab-btn ${activeLang === 'en' ? 'active' : ''}`}
            onClick={() => setActiveLang('en')}
          >
            EN · Version Anglaise ({casesEn.length})
          </button>
        </div>

        {/* Case Studies List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentList.map((cs, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={index} 
                style={{ 
                  border: isExpanded ? '1px solid var(--admin-accent)' : '1px solid var(--admin-border)',
                  borderRadius: '14px',
                  background: isExpanded ? 'var(--admin-card-bg)' : 'var(--admin-card-inner)',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isExpanded ? 'var(--admin-shadow)' : 'none'
                }}
              >
                {/* Header Row */}
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
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '10px', 
                      background: 'var(--admin-card-inner)', 
                      border: '1px solid var(--admin-border)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {cs.media ? (
                        <img src={cs.media} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Award size={20} color="var(--admin-gold)" />
                      )}
                    </div>
                    <div>
                      <span style={{ fontSize: '11.5px', color: 'var(--admin-coral)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                        {cs.tag || "Catégorie de mission"}
                      </span>
                      <strong style={{ fontSize: '15.5px', color: 'var(--admin-text-main)' }}>
                        {cs.title || "Réalisation sans titre"}
                      </strong>
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
                      title="Supprimer"
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

                {/* Body Form */}
                {isExpanded && (
                  <div style={{ padding: '24px', borderTop: '1px solid var(--admin-border)' }}>
                    <div className="form-grid" style={{ marginBottom: '16px' }}>
                      <div className="form-field">
                        <label>Tag / Catégorie de la mission ({activeLang.toUpperCase()})</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={cs.tag || ''} 
                          onChange={(e) => handleUpdate(index, 'tag', e.target.value, activeLang)}
                          placeholder="Exemple de mission — Billets d'avion"
                        />
                      </div>

                      <div className="form-field">
                        <label>Titre de la Réalisation ({activeLang.toUpperCase()})</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={cs.title || ''} 
                          onChange={(e) => handleUpdate(index, 'title', e.target.value, activeLang)}
                          placeholder="Titre de la mission..."
                        />
                      </div>
                    </div>

                    <div className="form-grid-1" style={{ marginBottom: '16px' }}>
                      <div className="form-field">
                        <label>1. Le Défi / Besoin initial du client ({activeLang.toUpperCase()})</label>
                        <textarea 
                          className="form-textarea" 
                          value={cs.need || ''} 
                          onChange={(e) => handleUpdate(index, 'need', e.target.value, activeLang)}
                          rows={2}
                        />
                      </div>

                      <div className="form-field">
                        <label>2. La Réponse apportée par HEMIRA ({activeLang.toUpperCase()})</label>
                        <textarea 
                          className="form-textarea" 
                          value={cs.response || ''} 
                          onChange={(e) => handleUpdate(index, 'response', e.target.value, activeLang)}
                          rows={2}
                        />
                      </div>

                      <div className="form-field">
                        <label>3. Le Résultat concret obtenu ({activeLang.toUpperCase()})</label>
                        <textarea 
                          className="form-textarea" 
                          value={cs.result || ''} 
                          onChange={(e) => handleUpdate(index, 'result', e.target.value, activeLang)}
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Image / Media */}
                    <div style={{ border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px', background: 'var(--admin-card-inner)' }}>
                      <label style={{ fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--admin-text-main)' }}>
                        Image de la réalisation
                      </label>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                        <div className="image-preview-wrap">
                          <img src={cs.media || '/assets/img/uploads/hemira-hero-illustration.png'} alt="Preview" />
                        </div>
                        <div>
                          <label className="admin-btn admin-btn-outline" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                            <Upload size={14} />
                            <span>{uploadingIndex === index ? 'Téléversement...' : 'Changer l\'image'}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={(e) => handleImageUpload(e, index)}
                            />
                          </label>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={cs.media || ''} 
                        onChange={(e) => {
                          handleUpdate(index, 'media', e.target.value, 'fr');
                          handleUpdate(index, 'media', e.target.value, 'en');
                        }}
                        placeholder="URL de l'image..."
                      />
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
