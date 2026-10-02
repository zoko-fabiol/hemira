import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { t } from '../translations';

export default function ContactPage({ lang = 'fr', content, settings }) {
  const c = content?.contact || t[lang].contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow on-dark">{c.eyebrow}</div>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
      </section>

      <section className="bg-light" style={{ padding: '80px 0' }}>
        <div className="wrap contact-layout">
          {/* Colonne gauche : coordonnées */}
          <div className="contact-info-card">
            <h3>{settings?.siteTitle || "HEMIRA Travel & Services"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '32px' }}>
              {c.listening}
            </p>

            <div className="contact-info-row">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2"/>
                  <path d="M4 6.5l8 6 8-6"/>
                </svg>
              </div>
              <div>
                <div className="lbl">{c.emailLabel}</div>
                <a href={`mailto:${settings?.email || "contact@hemiraservices.com"}`}>
                  {settings?.email || "contact@hemiraservices.com"}
                </a>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 006 6l1.5-2L21 15v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>
                </svg>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="lbl">Jeanne Helene Epée Nsome</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', alignItems: 'center' }}>
                  <a href="tel:+237699976258">699 976 258</a>
                  <span style={{ opacity: 0.4 }}>/</span>
                  <a href="tel:+237677119086">677 119 086</a>
                </div>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 006 6l1.5-2L21 15v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>
                </svg>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="lbl">Miriam Nguemdo Nouzeda</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', alignItems: 'center' }}>
                  <a href="tel:+237699430256">699 430 256</a>
                  <span style={{ opacity: 0.4 }}>/</span>
                  <a href="tel:+237675732338">675 732 338</a>
                </div>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s7-6.6 7-11.5A7 7 0 105 9.5C5 14.4 12 21 12 21z"/>
                  <circle cx="12" cy="9.5" r="2.3"/>
                </svg>
              </div>
              <div>
                <div className="lbl">{c.addressLabel}</div>
                <span className="val">{c.addressVal}</span>
              </div>
            </div>

            <div className="mosaic-mini" aria-hidden="true" style={{ marginTop: '28px' }}>
              <span className="sq coral"></span>
              <span className="sq gold"></span>
              <span className="sq teal"></span>
              <span className="sq gold"></span>
              <span className="sq coral"></span>
            </div>
          </div>

          {/* Colonne droite : formulaire */}
          <div>
            {submitted ? (
              <div className="alert alert-success" style={{ padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', marginBottom: '8px', color: 'var(--navy)' }}>
                  {c.successTitle}
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: '15px' }}>
                  {c.successDesc}
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline-dark btn-sm"
                  style={{ marginTop: '16px' }}
                >
                  {c.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-grid" noValidate>
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="name">{c.nameLabel} <span className="required" style={{ color: 'var(--coral)' }}>*</span></label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={c.namePlaceholder} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{c.emailInputLabel} <span className="required" style={{ color: 'var(--coral)' }}>*</span></label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={c.emailPlaceholder} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="company">{c.companyLabel}</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={c.companyPlaceholder} 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">{c.messageLabel} <span className="required" style={{ color: 'var(--coral)' }}>*</span></label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={c.messagePlaceholder} 
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary btn-block" 
                  data-track="contact_form_submit"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                    <path d="M4 6.5l8 6 8-6"/>
                  </svg>
                  <span>{loading ? c.sending : c.sendBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
