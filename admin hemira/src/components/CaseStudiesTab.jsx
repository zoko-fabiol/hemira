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
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { saveContent, uploadImageFile } from '../services/cmsService';
import FirestoreImageUploader from './FirestoreImageUploader';

export default function CaseStudiesTab({ contentFr, contentEn, showToast, onOpenThemeModal }) {
  const [casesFr, setCasesFr] = useState([]);
  const [casesEn, setCasesEn] = useState([]);
  const [casesDesign, setCasesDesign] = useState('default');
  const [casesAnimation, setCasesAnimation] = useState('default');
  const [casesAccent, setCasesAccent] = useState('teal');
  const [activeLang, setActiveLang] = useState('fr');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const normalizeCase = (c) => {
    if (!c) return {};
    const contexte = c.contexte ?? c.context ?? '';
    const besoin = c.besoin ?? c.need ?? '';
    const intervention = c.intervention ?? c.response ?? '';
    const resultat = c.resultat ?? c.result ?? '';
    return {
      ...c,
      contexte,
      context: contexte,
      besoin,
      need: besoin,
      intervention,
      response: intervention,
      resultat,
      result: resultat,
      tag: c.tag || '',
      title: c.title || '',
      media: c.media || ''
    };
  };

  useEffect(() => {
    const listFr = (contentFr?.caseStudies?.cases || []).map(normalizeCase);
    const listEn = (contentEn?.caseStudies?.cases || []).map(normalizeCase);
    setCasesFr(listFr);
    setCasesEn(listEn);

    const des = contentFr?.caseStudies?.casesDesign || 'default';
    const anim = contentFr?.caseStudies?.casesAnimation || 'default';
    const acc = contentFr?.caseStudies?.casesAccent || 'teal';
    setCasesDesign(des);
    setCasesAnimation(anim);
    setCasesAccent(acc);
  }, [contentFr, contentEn]);

  const handleAddCase = () => {
    const newCaseFr = {
      tag: "Exemple de mission — Nouveau service",
      title: "Organisation complète d'un déplacement d'envergure",
      contexte: "Un client souhaitant organiser un déplacement dans les meilleures conditions.",
      context: "Un client souhaitant organiser un déplacement dans les meilleures conditions.",
      besoin: "Le client avait besoin d'une prise en charge rapide de son dossier.",
      need: "Le client avait besoin d'une prise en charge rapide de son dossier.",
      intervention: "HEMIRA Travel & Services a mobilisé son réseau de partenaires fiables.",
      response: "HEMIRA Travel & Services a mobilisé son réseau de partenaires fiables.",
      resultat: "Déplacement réussi sans encombre et gain de temps considérable.",
      result: "Déplacement réussi sans encombre et gain de temps considérable.",
      media: ""
    };

    const newCaseEn = {
      tag: "Mission example — New service",
      title: "Complete organization of a major trip",
      contexte: "A client needing urgent travel arrangements for their team.",
      context: "A client needing urgent travel arrangements for their team.",
      besoin: "The client needed urgent handling of their travel files.",
      need: "The client needed urgent handling of their travel files.",
      intervention: "HEMIRA Travel & Services mobilized its network of verified partners.",
      response: "HEMIRA Travel & Services mobilized its network of verified partners.",
      resultat: "Smooth travel completed on schedule with substantial time savings.",
      result: "Smooth travel completed on schedule with substantial time savings.",
      media: ""
    };

    setCasesFr([...casesFr, newCaseFr]);
    setCasesEn([...casesEn, newCaseEn]);
    setExpandedIndex(casesFr.length);
  };

  const handleUpdate = (index, field, value, lang) => {
    const updates = { [field]: value };
    if (field === 'contexte' || field === 'context') {
      updates.contexte = value;
      updates.context = value;
    } else if (field === 'besoin' || field === 'need') {
      updates.besoin = value;
      updates.need = value;
    } else if (field === 'intervention' || field === 'response') {
      updates.intervention = value;
      updates.response = value;
    } else if (field === 'resultat' || field === 'result') {
      updates.resultat = value;
      updates.result = value;
    }

    if (lang === 'fr') {
      setCasesFr(prev => {
        const next = [...prev];
        next[index] = { ...next[index], ...updates };
        return next;
      });
    } else {
      setCasesEn(prev => {
        const next = [...prev];
        next[index] = { ...next[index], ...updates };
        return next;
      });
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
      showToast("Image téléversée avec succès !");
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
      // Nettoyer les propriétés individuelles pour garantir l'uniformité du design et de l'animation
      const cleanCases = (list) => (list || []).map(c => {
        const copy = { ...c };
        delete copy.design;
        delete copy.animation;
        delete copy.accentColor;
        const con = copy.contexte ?? copy.context ?? '';
        const bes = copy.besoin ?? copy.need ?? '';
        const int = copy.intervention ?? copy.response ?? '';
        const res = copy.resultat ?? copy.result ?? '';
        copy.contexte = con;
        copy.context = con;
        copy.besoin = bes;
        copy.need = bes;
        copy.intervention = int;
        copy.response = int;
        copy.resultat = res;
        copy.result = res;
        return copy;
      });

      const updatedFr = {
        ...contentFr,
        caseStudies: {
          ...contentFr?.caseStudies,
          cases: cleanCases(casesFr),
          casesDesign,
          casesAnimation,
          casesAccent
        }
      };

      const updatedEn = {
        ...contentEn,
        caseStudies: {
          ...contentEn?.caseStudies,
          cases: cleanCases(casesEn),
          casesDesign,
          casesAnimation,
          casesAccent
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
  const isWithImg = true; // Toutes les réalisations intègrent obligatoirement des images de prestige

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
              Personnalisez l'apparence uniforme, l'animation et les images des études de cas de voyages.
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
            <strong>Gestion ergonomique séparée :</strong> Les variantes de mise en page des réalisations (Éditorial, Écrin Nuit VIP, Grille, Timeline) et leurs animations sont gérées dans l'onglet <strong>Apparence</strong>.
          </span>
        </div>

        {/* Language Tabs */}
        <div className="lang-tabs" style={{ marginTop: '20px' }}>
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

        {/* Cases List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {currentList.map((cs, index) => {
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
                    <span style={{ 
                      fontSize: '12px', 
                      fontFamily: 'Sora, sans-serif', 
                      fontWeight: 800, 
                      color: 'var(--admin-teal)',
                      background: 'rgba(111, 160, 208, 0.15)',
                      border: '1px solid rgba(111, 160, 208, 0.3)',
                      padding: '4px 10px', 
                      borderRadius: '8px'
                    }}>
                      #{index + 1}
                    </span>
                    <div>
                      <strong style={{ fontSize: '15.5px', color: 'var(--admin-text-main)', letterSpacing: '-0.01em' }}>
                        {cs.title || "Réalisation sans titre"}
                      </strong>
                      <span style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--admin-text-sub)' }}>
                        ({cs.tag})
                      </span>
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
                      title="Supprimer cette étude de cas"
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
                        <label>1. Le Contexte initial du client ({activeLang.toUpperCase()})</label>
                        <textarea 
                          className="form-textarea" 
                          value={cs.contexte ?? cs.context ?? ''} 
                          onChange={(e) => handleUpdate(index, 'contexte', e.target.value, activeLang)}
                          placeholder="Ex: Un client devant voyager à l'étranger sous peu de délai..."
                          rows={2}
                        />
                      </div>

                      <div className="form-field">
                        <label>2. Le Défi / Besoin initial du client ({activeLang.toUpperCase()})</label>
                        <textarea 
                          className="form-textarea" 
                          value={cs.besoin ?? cs.need ?? ''} 
                          onChange={(e) => handleUpdate(index, 'besoin', e.target.value, activeLang)}
                          placeholder="Ex: Trouver rapidement un vol disponible au meilleur tarif..."
                          rows={2}
                        />
                      </div>

                      <div className="form-field">
                        <label>3. L'Intervention & Réponse apportée par HEMIRA ({activeLang.toUpperCase()})</label>
                        <textarea 
                          className="form-textarea" 
                          value={cs.intervention ?? cs.response ?? ''} 
                          onChange={(e) => handleUpdate(index, 'intervention', e.target.value, activeLang)}
                          placeholder="Ex: HEMIRA a comparé plusieurs compagnies et émis le billet..."
                          rows={2}
                        />
                      </div>

                      <div className="form-field">
                        <label>4. Le Résultat concret obtenu ({activeLang.toUpperCase()})</label>
                        <textarea 
                          className="form-textarea" 
                          value={cs.resultat ?? cs.result ?? ''} 
                          onChange={(e) => handleUpdate(index, 'resultat', e.target.value, activeLang)}
                          placeholder="Ex: Un billet confirmé en quelques heures, sans démarche à effectuer..."
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Bloc puissant de téléversement d'image Firestore */}
                    <div style={{ marginTop: '14px' }}>
                      <FirestoreImageUploader 
                        value={cs.media || ''}
                        folder="cases"
                        label={`Photo de la réalisation #${index + 1}`}
                        description="Téléversez ou glissez une photo haute résolution. Compression automatique et stockage Firestore sécurisé."
                        aspectRatio="16/9"
                        onChange={(url) => {
                          handleUpdate(index, 'media', url, 'fr');
                          handleUpdate(index, 'media', url, 'en');
                        }}
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
