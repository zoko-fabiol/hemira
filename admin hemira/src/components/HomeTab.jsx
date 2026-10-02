import React, { useState, useEffect } from 'react';
import { Home, Save, Plus, Trash2 } from 'lucide-react';
import { saveContent } from '../services/cmsService';

export default function HomeTab({ contentFr, contentEn, showToast }) {
  const [activeLang, setActiveLang] = useState('fr');
  const [homeFr, setHomeFr] = useState({});
  const [homeEn, setHomeEn] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHomeFr(contentFr?.home || {});
    setHomeEn(contentEn?.home || {});
  }, [contentFr, contentEn]);

  const current = activeLang === 'fr' ? homeFr : homeEn;
  const setCurrent = activeLang === 'fr' ? setHomeFr : setHomeEn;

  const handleChange = (field, val) => {
    setCurrent(prev => ({ ...prev, [field]: val }));
  };

  // Stats Manager
  const handleStatChange = (index, field, val) => {
    const list = [...(current.stats || [])];
    list[index] = { ...list[index], [field]: val };
    handleChange('stats', list);
  };

  const handleAddStat = () => {
    const list = [...(current.stats || [])];
    list.push({ num: "100%", lbl: "Nouveau chiffre clé" });
    handleChange('stats', list);
  };

  const handleDeleteStat = (index) => {
    const list = (current.stats || []).filter((_, i) => i !== index);
    handleChange('stats', list);
  };

  // Commitments Manager (Pourquoi HEMIRA)
  const handleCommitmentChange = (index, field, val) => {
    const list = [...(current.commitments || [])];
    list[index] = { ...list[index], [field]: val };
    handleChange('commitments', list);
  };

  const handleAddCommitment = () => {
    const list = [...(current.commitments || [])];
    list.push({ title: "Nouvel engagement", desc: "Description du nouvel engagement pour vos voyages." });
    handleChange('commitments', list);
  };

  const handleDeleteCommitment = (index) => {
    const list = (current.commitments || []).filter((_, i) => i !== index);
    handleChange('commitments', list);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedFr = { ...contentFr, home: homeFr };
      const updatedEn = { ...contentEn, home: homeEn };
      await saveContent('fr', updatedFr);
      await saveContent('en', updatedEn);
      showToast("Page d'accueil et engagements enregistrés dans Firebase !");
    } catch (err) {
      console.error("Save home error:", err);
      alert("Erreur : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Home size={20} color="var(--admin-accent)" />
              Gestion de la Page d'Accueil & Engagements
            </h3>
            <p className="admin-card-desc">
              Modifiez le texte d'accroche (Hero), les chiffres clés et les engagements ("Pourquoi HEMIRA").
            </p>
          </div>
          <button 
            type="button" 
            className="admin-btn admin-btn-coral" 
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer dans Firebase'}</span>
          </button>
        </div>

        {/* Language Tabs */}
        <div className="lang-tabs">
          <button 
            type="button"
            className={`lang-tab-btn ${activeLang === 'fr' ? 'active' : ''}`}
            onClick={() => setActiveLang('fr')}
          >
            FR · Version Française
          </button>
          <button 
            type="button"
            className={`lang-tab-btn ${activeLang === 'en' ? 'active' : ''}`}
            onClick={() => setActiveLang('en')}
          >
            EN · Version Anglaise
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Hero Section */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>Section Hero (Haut de page)</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Badge de bienvenue</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.badge || ''} 
                  onChange={(e) => handleChange('badge', e.target.value)}
                  placeholder="Tout commence ici !" 
                />
              </div>

              <div className="form-field">
                <label>Grand Titre H1</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.title || ''} 
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Votre voyage commence ici" 
                />
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '16px' }}>
              <label>Paragraphe d'accroche (Lead)</label>
              <textarea 
                className="form-textarea" 
                value={current.lead || ''} 
                onChange={(e) => handleChange('lead', e.target.value)}
                placeholder="Billets d'avion, assistance visa, réservation d'hôtels..."
                rows={3}
              />
            </div>

            <div className="form-grid" style={{ marginTop: '16px' }}>
              <div className="form-field">
                <label>Bouton CTA Principal</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.ctaPrimary || ''} 
                  onChange={(e) => handleChange('ctaPrimary', e.target.value)}
                  placeholder="Discuter de votre besoin" 
                />
              </div>

              <div className="form-field">
                <label>Bouton CTA Secondaire</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={current.ctaSecondary || ''} 
                  onChange={(e) => handleChange('ctaSecondary', e.target.value)}
                  placeholder="Découvrir nos 6 services" 
                />
              </div>
            </div>
          </div>

          {/* Key Figures / Stats Section */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ color: 'var(--admin-text-main)', fontSize: '16px' }}>Les 4 Chiffres Clés (Statistiques)</h4>
              <button type="button" className="admin-btn admin-btn-outline" style={{ fontSize: '12px' }} onClick={handleAddStat}>
                <Plus size={14} /> Ajouter un chiffre
              </button>
            </div>

            <div className="form-grid">
              {(current.stats || []).map((stat, i) => (
                <div key={i} style={{ border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px', background: 'var(--admin-card-inner)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-gold)' }}>Chiffre #{i + 1}</span>
                    <button type="button" className="admin-btn admin-btn-danger" style={{ padding: '2px 6px' }} onClick={() => handleDeleteStat(i)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="form-field" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px' }}>Valeur (ex: 6, 2, 7j/7)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={stat.num || ''} 
                      onChange={(e) => handleStatChange(i, 'num', e.target.value)} 
                    />
                  </div>
                  <div className="form-field">
                    <label style={{ fontSize: '12px' }}>Libellé explicatif</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={stat.lbl || ''} 
                      onChange={(e) => handleStatChange(i, 'lbl', e.target.value)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commitments Section (Pourquoi HEMIRA) */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ color: 'var(--admin-text-main)', fontSize: '16px' }}>Nos Engagements ("Pourquoi HEMIRA")</h4>
                <p className="admin-card-desc">Ajoutez ou modifiez les engagements de confiance et de rapidité.</p>
              </div>
              <button type="button" className="admin-btn admin-btn-outline" style={{ fontSize: '12px' }} onClick={handleAddCommitment}>
                <Plus size={14} /> Nouvel engagement
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(current.commitments || []).map((com, i) => (
                <div key={i} style={{ border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px', background: 'var(--admin-card-inner)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--admin-text-main)' }}>Engagement #{i + 1}</strong>
                    <button type="button" className="admin-btn admin-btn-danger" style={{ padding: '2px 6px' }} onClick={() => handleDeleteCommitment(i)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="form-field" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px' }}>Titre de l'engagement</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={com.title || ''} 
                      onChange={(e) => handleCommitmentChange(i, 'title', e.target.value)} 
                    />
                  </div>
                  <div className="form-field">
                    <label style={{ fontSize: '12px' }}>Description</label>
                    <textarea 
                      className="form-textarea" 
                      value={com.desc || ''} 
                      onChange={(e) => handleCommitmentChange(i, 'desc', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
