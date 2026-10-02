import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Chatbot({ lang = 'fr', onNavigate, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const messagesEndRef = useRef(null);

  const initialOptions = {
    fr: [
      { label: "Billets d'avion", value: "billetterie" },
      { label: "Assistance visa", value: "visa" },
      { label: "Hôtels & Séjours", value: "hotels" },
      { label: "Voyages d'affaires", value: "corporate" },
      { label: "Tourisme & Circuits", value: "tourisme" },
      { label: "Parler à Jeanne ou Miriam", value: "contact" },
      { label: "Adresse à Douala", value: "adresse" }
    ],
    en: [
      { label: "Flight Tickets", value: "billetterie" },
      { label: "Visa Assistance", value: "visa" },
      { label: "Hotels & Stays", value: "hotels" },
      { label: "Business Travel", value: "corporate" },
      { label: "Guided Tours", value: "tourisme" },
      { label: "Contact Founders", value: "contact" },
      { label: "Douala Agency Address", value: "adresse" }
    ]
  };

  const knowledgeBase = {
    fr: {
      accueil: {
        reply: content?.chatbot?.welcome || "Bonjour et bienvenue chez <strong>HEMIRA Travel & Services</strong> ! Je suis votre assistant virtuel.<br><br>Que puis-je faire pour votre voyage aujourd'hui ?",
        options: [
          { label: "Billets d'avion", value: "billetterie" },
          { label: "Assistance visa", value: "visa" },
          { label: "Hôtels & Séjours", value: "hotels" },
          { label: "Contacter l'agence", value: "contact" },
          { label: "Adresse à Douala", value: "adresse" }
        ]
      },
      billetterie: {
        reply: "<strong>Billetterie Aérienne (Service Phare)</strong><br><br>Nous recherchons et émettons vos billets d'avion nationaux et internationaux sur toutes les compagnies agréées (Air France, Brussels Airlines, Ethiopian, Royal Air Maroc, etc.) aux meilleurs tarifs.<br><br>• Vols d'urgence traités en priorité 7j/7<br>• Gestion des bagages, modifications et surclassements.",
        options: [
          { label: "Demander un devis de vol", value: "devis" },
          { label: "Assistance visa", value: "visa" },
          { label: "Appeler Jeanne : 699 976 258", value: "contact" }
        ]
      },
      visa: {
        reply: "<strong>Assistance Visa & Formalités Consulaires</strong><br><br>Nous vous accompagnons avec rigueur dans la constitution, l'audit et le suivi de vos dossiers de visa :<br>• Espace Schengen (France, Allemagne, etc.)<br>• Canada (Permis d'études, Visiteur, Travail)<br>• Dubaï (e-Visas express en 72h)<br>• USA, Royaume-Uni, Chine et Afrique.<br><br>Chaque dossier est relu par nos fondatrices pour maximiser vos chances de délivrance.",
        options: [
          { label: "Faire auditer mon dossier", value: "devis" },
          { label: "Parler à Miriam : 699 430 256", value: "contact" },
          { label: "Billets d'avion", value: "billetterie" }
        ]
      },
      hotels: {
        reply: "<strong>Réservation d'Hôtels & Résidences</strong><br><br>Nous sélectionnons et réservons des hébergements confortables, sécurisés et adaptés à votre budget, partout dans le monde.<br>• Tarifs corporate négociés<br>• Confirmations immédiates pour vos dossiers de visa<br>• Chambres familiales et résidences privées.",
        options: [
          { label: "Réserver un hébergement", value: "devis" },
          { label: "Voyages d'affaires", value: "corporate" }
        ]
      },
      corporate: {
        reply: "<strong>Voyages d'Affaires & Entreprises</strong><br><br>Solutions complètes pour dirigeants, délégations et collaborateurs : billetterie flexible, hébergements proches de vos rendez-vous, transferts aéroport Douala et facturation consolidée.",
        options: [
          { label: "Ouvrir un compte entreprise", value: "contact" },
          { label: "Contact direct", value: "contact" }
        ]
      },
      tourisme: {
        reply: "<strong>Tourisme & Circuits sur-mesure</strong><br><br>Découvrez nos escapades au Cameroun (plages de Kribi, mont Cameroun à Limbe, parcs nationaux) ainsi que des forfaits touristiques internationaux complets.",
        options: [
          { label: "Organiser un circuit", value: "devis" },
          { label: "Hôtels & Séjours", value: "hotels" }
        ]
      },
      contact: {
        reply: "<strong>Coordonnées directes des Fondatrices</strong><br><br>• <strong>Jeanne Helene Epée Nsome</strong> : <a href='tel:+237699976258'>+237 699 976 258</a> / <a href='tel:+237677119086'>677 119 086</a><br>• <strong>Miriam J. Nguemdo Nouzeda</strong> : <a href='tel:+237699430256'>+237 699 430 256</a> / <a href='tel:+237675732338'>675 732 338</a><br>• <strong>Email</strong> : <a href='mailto:contact@hemiraservices.com'>contact@hemiraservices.com</a><br><br>Vous pouvez également nous joindre directement sur WhatsApp.",
        options: [
          { label: "Écrire à Jeanne sur WhatsApp", value: "wa_jeanne" },
          { label: "Écrire à Miriam sur WhatsApp", value: "wa_miriam" },
          { label: "Où se trouve l'agence ?", value: "adresse" }
        ]
      },
      adresse: {
        reply: "<strong>Adresse Géographique de l'Agence</strong><br><br>Nos bureaux vous accueillent au cœur du quartier des affaires de Douala :<br><strong>Akwa — 101 Rue du Bruix, Douala, Cameroun.</strong><br><br><strong>Horaires d'ouverture :</strong><br>• Lundi au Vendredi : 08h00 - 18h00<br>• Samedi : 09h00 - 14h00<br>• Urgences vols et billetterie : 7j/7.",
        options: [
          { label: "Appeler avant de passer", value: "contact" },
          { label: "Consulter les vols", value: "billetterie" }
        ]
      },
      devis: {
        reply: "<strong>Demande de Devis Express</strong><br><br>Vous pouvez remplir notre formulaire en ligne sur la page Contact ou nous transmettre directement votre destination, vos dates et le nombre de voyageurs par message !",
        options: [
          { label: "Aller sur la page Contact", value: "nav_contact" },
          { label: "Joindre une associée", value: "contact" }
        ]
      }
    },
    en: {
      accueil: {
        reply: "Hello and welcome to <strong>HEMIRA Travel & Services</strong>! I am your virtual travel assistant.<br><br>How may I assist your upcoming travels today?",
        options: [
          { label: "Flight Tickets", value: "billetterie" },
          { label: "Visa Assistance", value: "visa" },
          { label: "Hotels & Stays", value: "hotels" },
          { label: "Contact Agency", value: "contact" },
          { label: "Douala Office", value: "adresse" }
        ]
      },
      billetterie: {
        reply: "<strong>Flight Ticketing (Flagship Service)</strong><br><br>We issue domestic and international air tickets with all IATA airlines at optimal rates with flexible terms.<br>• 24/7 priority emergency handling<br>• Baggage management, route optimization and upgrades.",
        options: [
          { label: "Request flight quote", value: "devis" },
          { label: "Visa assistance", value: "visa" },
          { label: "Call Jeanne: +237 699 976 258", value: "contact" }
        ]
      },
      visa: {
        reply: "<strong>Visa & Consular Assistance</strong><br><br>We provide rigorous support for visa application files:<br>• Schengen Area (France, Germany, etc.)<br>• Canada (Study Permit, Visitor, Work)<br>• Dubai (Express e-visas in 72 hours)<br>• USA, UK, and Africa.",
        options: [
          { label: "Audit my application", value: "devis" },
          { label: "Speak with Miriam: +237 699 430 256", value: "contact" }
        ]
      },
      contact: {
        reply: "<strong>Founding Partners Direct Contact</strong><br><br>• <strong>Jeanne Helene Epée Nsome</strong>: +237 699 976 258<br>• <strong>Miriam J. Nguemdo Nouzeda</strong>: +237 699 430 256<br>• <strong>Email</strong>: contact@hemiraservices.com",
        options: [
          { label: "Where is the agency?", value: "adresse" },
          { label: "Flight tickets", value: "billetterie" }
        ]
      },
      adresse: {
        reply: "<strong>Agency Location</strong><br><br>Our physical office is located in Douala:<br><strong>Akwa — 101 Rue du Bruix, Douala, Cameroon.</strong><br><br>Monday to Friday: 08:00 - 18:00 | Saturday: 09:00 - 14:00 (Emergency support 24/7).",
        options: [
          { label: "Call us", value: "contact" },
          { label: "Request a quote", value: "devis" }
        ]
      }
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const l = lang === 'en' ? 'en' : 'fr';
      const welcome = knowledgeBase[l].accueil;
      setMessages([{ sender: 'bot', text: welcome.reply }]);
      setOptions(welcome.options || initialOptions[l]);
    }
  }, [isOpen, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleAction = async (val) => {
    if (val === 'wa_jeanne') {
      window.open('https://wa.me/237699976258?text=Bonjour%20Jeanne%20Helene,%20je%20vous%20contacte%20via%20Assistant%20HEMIRA', '_blank');
      return;
    }
    if (val === 'wa_miriam') {
      window.open('https://wa.me/237699430256?text=Bonjour%20Miriam,%20je%20vous%20contacte%20via%20Assistant%20HEMIRA', '_blank');
      return;
    }
    if (val === 'nav_contact') {
      onNavigate('contact');
      setIsOpen(false);
      return;
    }

    const l = lang === 'en' ? 'en' : 'fr';
    const kb = knowledgeBase[l] || knowledgeBase.fr;
    const item = kb[val];

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: val }]);
    setOptions([]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (item) {
        setMessages(prev => [...prev, { sender: 'bot', text: item.reply }]);
        setOptions(item.options || []);
      } else {
        const fallback = l === 'en' 
          ? "Thank you for your message! A HEMIRA travel advisor in Douala will assist you. You can also call us directly at +237 699 976 258."
          : "Merci pour votre message ! Un conseiller HEMIRA à Douala traite votre demande. Vous pouvez également nous joindre directement au +237 699 976 258.";
        setMessages(prev => [...prev, { sender: 'bot', text: fallback }]);
        setOptions(initialOptions[l]);
      }
    }, 450);
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInputVal('');
    setOptions([]);
    setIsTyping(true);

    // Save to Firestore
    try {
      await addDoc(collection(db, "chat_inquiries"), {
        message: query,
        lang,
        createdAt: serverTimestamp()
      });
    } catch {
      // offline fallback
    }

    setTimeout(() => {
      setIsTyping(false);
      const q = query.toLowerCase();
      let matchedKey = 'accueil';

      if (q.includes('vol') || q.includes('billet') || q.includes('avion') || q.includes('flight') || q.includes('ticket')) {
        matchedKey = 'billetterie';
      } else if (q.includes('visa') || q.includes('consul') || q.includes('passeport') || q.includes('schengen') || q.includes('canada')) {
        matchedKey = 'visa';
      } else if (q.includes('hotel') || q.includes('hôtel') || q.includes('logement') || q.includes('chambre')) {
        matchedKey = 'hotels';
      } else if (q.includes('contact') || q.includes('appel') || q.includes('tel') || q.includes('phone') || q.includes('numéro') || q.includes('numero') || q.includes('jeanne') || q.includes('miriam')) {
        matchedKey = 'contact';
      } else if (q.includes('adresse') || q.includes('akwa') || q.includes('douala') || q.includes('bruix') || q.includes('bureau') || q.includes('ou')) {
        matchedKey = 'adresse';
      } else if (q.includes('devis') || q.includes('tarif') || q.includes('prix') || q.includes('combien') || q.includes('cost')) {
        matchedKey = 'devis';
      }

      const l = lang === 'en' ? 'en' : 'fr';
      const kb = knowledgeBase[l] || knowledgeBase.fr;
      const resp = kb[matchedKey] || kb.accueil;

      setMessages(prev => [...prev, { sender: 'bot', text: resp.reply }]);
      setOptions(resp.options || initialOptions[l]);
    }, 500);
  };

  return (
    <div id="chatbot-widget">
      <button 
        id="chatbot-toggle" 
        className={isOpen ? 'open' : ''}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le chat"
      >
        <span className="chat-icon" style={{ display: isOpen ? 'none' : 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </span>
        <span className="close-icon" style={{ display: isOpen ? 'inline-flex' : 'none', alignItems: 'center', justifyContent: 'center' }}>✕</span>
      </button>

      {isOpen && (
        <div id="chatbot-window">
          <div id="chatbot-header">
            <span id="chatbot-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              <span>Assistant HEMIRA</span>
            </span>
            <button id="chatbot-minimize" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div id="chatbot-messages">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={m.sender === 'bot' ? 'bot-message' : 'user-message'}
                dangerouslySetInnerHTML={m.sender === 'bot' ? { __html: m.text } : undefined}
              >
                {m.sender === 'user' ? m.text : null}
              </div>
            ))}

            {isTyping && (
              <div className="bot-message typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            {options.length > 0 && !isTyping && (
              <div className="bot-options">
                {options.map((opt, i) => (
                  <button 
                    key={i} 
                    className="bot-option-btn"
                    onClick={() => handleAction(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form id="chatbot-input-area" onSubmit={handleInputSubmit}>
            <input 
              type="text" 
              id="chatbot-input" 
              placeholder={lang === 'en' ? "Write your message..." : "Écrivez votre message..."} 
              autoComplete="off"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" id="chatbot-send" aria-label="Envoyer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
