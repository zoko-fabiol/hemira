import React, { useState, useEffect } from 'react';
import { PhoneCall, Save, MessageSquare } from 'lucide-react';
import { saveSettings, saveContent } from '../services/cmsService';

export default function ContactTab({ settings, contentFr, contentEn, showToast }) {
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [botGreetingFr, setBotGreetingFr] = useState('');
  const [botGreetingEn, setBotGreetingEn] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setPhone1(settings.phone1 || '+237 671 28 35 34');
      setPhone2(settings.phone2 || '+237 691 64 63 94');
      setEmail(settings.email || 'contact@hemiraservices.com');
      setAddress(settings.address || 'Akwa — 101 Rue du Bruix, Douala, Cameroun');
    }
    setBotGreetingFr(contentFr?.chatbot?.welcome || "Bonjour ! Je suis l'assistant virtuel d'HEMIRA Travel & Services. Comment puis-je vous aider aujourd'hui ?");
    setBotGreetingEn(contentEn?.chatbot?.welcome || "Hello! I am the virtual assistant for HEMIRA Travel & Services. How can I help you today?");
  }, [settings, contentFr, contentEn]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save settings
      await saveSettings({
        ...settings,
        phone1,
        phone2,
        email,
        address
      });

      // Save chatbot welcome
      const updatedFr = {
        ...contentFr,
        chatbot: { ...contentFr?.chatbot, welcome: botGreetingFr }
      };
      const updatedEn = {
        ...contentEn,
        chatbot: { ...contentEn?.chatbot, welcome: botGreetingEn }
      };

      await saveContent('fr', updatedFr);
      await saveContent('en', updatedEn);

      showToast("Coordonnées et Chatbot enregistrés dans Firebase !");
    } catch (err) {
      console.error("Save contact error:", err);
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
              <PhoneCall size={20} color="var(--admin-accent)" />
              Coordonnées de Contact & Chatbot
            </h3>
            <p className="admin-card-desc">
              Gérez les numéros de téléphone WhatsApp/Appels, l'email officiel et le message d'accueil du Chatbot.
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

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '24px' }}>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px' }}>Coordonnées de l'Agence</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Téléphone 1 (Jeanne Helene)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={phone1} 
                  onChange={(e) => setPhone1(e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Téléphone 2 (Miriam)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={phone2} 
                  onChange={(e) => setPhone2(e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Email de Contact</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div className="form-field">
                <label>Adresse physique (Douala)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '14px', color: 'var(--admin-text-main)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--admin-accent)" />
              Message de Bienvenue du Chatbot
            </h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Message en Français</label>
                <textarea 
                  className="form-textarea" 
                  value={botGreetingFr} 
                  onChange={(e) => setBotGreetingFr(e.target.value)} 
                  rows={3}
                />
              </div>

              <div className="form-field">
                <label>Message en Anglais</label>
                <textarea 
                  className="form-textarea" 
                  value={botGreetingEn} 
                  onChange={(e) => setBotGreetingEn(e.target.value)} 
                  rows={3}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
