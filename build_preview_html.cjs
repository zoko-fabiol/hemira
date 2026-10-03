const fs = require('fs');

function extractMain(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const match = html.match(/<main id="main">([\s\S]*?)<\/main>/);
  return match ? match[1] : '';
}

const mainHome = extractMain('index_live.html');
const mainAbout = extractMain('about_live.html');
const mainServices = extractMain('services_live.html');
const mainCaseStudies = extractMain('case_studies_live.html');
const mainContact = extractMain('contact_live.html');

const headerHtml = `
<header class="site-header">
  <div class="wrap header-inner">
    <a href="#" onclick="navigateTo('home'); return false;" class="brand">
      <img src="/assets/img/uploads/logo-hemira-full.png" alt="HEMIRA Travel & Services" class="brand-logo">
    </a>

    <nav class="main-nav" id="main-nav">
      <a href="#" onclick="navigateTo('home'); return false;" id="nav-home" class="active">Accueil</a>
      <a href="#" onclick="navigateTo('about'); return false;" id="nav-about">À propos</a>
      <a href="#" onclick="navigateTo('services'); return false;" id="nav-services">Services</a>
      <a href="#" onclick="navigateTo('case-studies'); return false;" id="nav-case-studies">Nos réalisations</a>
      <a href="#" onclick="navigateTo('contact'); return false;" id="nav-contact">Contact</a>
    </nav>

    <div class="header-actions">
      <div class="lang-switch" role="group" aria-label="Language">
        <a href="#" class="active">FR</a>
        <span aria-hidden="true">/</span>
        <a href="#">EN</a>
      </div>
      <a href="#" onclick="navigateTo('contact'); return false;" class="btn btn-primary btn-sm header-cta">Travaillons ensemble</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Menu" onclick="toggleNav()">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
`;

const footerHtml = `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/assets/img/uploads/logo-hemira-white.png" alt="HEMIRA Travel & Services" class="footer-logo">
        <p class="footer-tagline">Agence de voyage à Douala : billets d'avion, assistance visa, hôtels, tourisme et voyages d'affaires.</p>
        <div class="mosaic-mini" aria-hidden="true">
          <span class="sq coral"></span><span class="sq gold"></span><span class="sq teal"></span><span class="sq gold"></span>
        </div>
      </div>
      <div class="footer-col">
        <h4>Navigation</h4>
        <a href="#" onclick="navigateTo('home'); return false;">Accueil</a>
        <a href="#" onclick="navigateTo('about'); return false;">À propos</a>
        <a href="#" onclick="navigateTo('services'); return false;">Services</a>
        <a href="#" onclick="navigateTo('case-studies'); return false;">Nos réalisations</a>
        <a href="#" onclick="navigateTo('contact'); return false;">Contact</a>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <a href="mailto:contact@hemiraservices.com">contact@hemiraservices.com</a>
        <a href="tel:+237699976258">Jeanne Helene Epée Nsome — 699 976 258</a>
        <a href="tel:+237699430256">Miriam Nguemdo Nouzeda — 699 430 256</a>
        <span class="footer-address">Akwa — 101 Rue du Bruix, Douala, Cameroun</span>
      </div>
      <div class="footer-col footer-extra">
        <h4>À propos</h4>
        <p style="font-size:13px; color:rgba(255,255,255,0.5); line-height:1.5;">Tout commence ici !</p>
        <p style="font-size:12px; color:rgba(255,255,255,0.3); margin-top:6px;">© 2026 HEMIRA Travel & Services — Des voyages, de plus belles histoires.</p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 HEMIRA Travel & Services. Tous droits réservés.</span>
      <span>Akwa — 101 Rue du Bruix, Douala</span>
    </div>
  </div>
</footer>
`;

const chatbotHtml = `
<div id="chatbot-widget">
  <button id="chatbot-toggle" aria-label="Ouvrir le chat" onclick="toggleChat()">
    <span class="chat-icon">💬</span>
    <span class="close-icon" style="display:none;">✕</span>
  </button>
</div>

<div id="chatbot-window" style="display:none;">
  <div id="chatbot-header">
    <span id="chatbot-title">🧭 Assistant HEMIRA</span>
    <button id="chatbot-minimize" onclick="toggleChat()">✕</button>
  </div>
  <div id="chatbot-messages">
    <div class="bot-message">
      Bonjour et bienvenue chez <strong>HEMIRA Travel & Services</strong> ! Je suis votre assistant virtuel.<br><br>Que puis-je faire pour votre voyage aujourd'hui ?
    </div>
    <div class="bot-options" id="chat-quick-options">
      <button class="bot-option-btn" onclick="sendBotQuery('billetterie')">✈️ Billets d'avion</button>
      <button class="bot-option-btn" onclick="sendBotQuery('visa')">🛂 Assistance visa</button>
      <button class="bot-option-btn" onclick="sendBotQuery('hotels')">🏨 Hôtels & Séjours</button>
      <button class="bot-option-btn" onclick="sendBotQuery('contact')">📞 Joindre Jeanne / Miriam</button>
      <button class="bot-option-btn" onclick="sendBotQuery('adresse')">📍 Adresse à Douala</button>
    </div>
  </div>
  <form id="chatbot-input-area" onsubmit="handleChatSubmit(event)">
    <input type="text" id="chatbot-input" placeholder="Écrivez votre message..." autocomplete="off">
    <button type="submit" id="chatbot-send">➤</button>
  </form>
</div>

<!-- Bouton retour en haut -->
<button class="back-top" aria-label="Retour en haut" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })">
  ↑
</button>
`;

const scriptHtml = `
<script>
  function navigateTo(page) {
    document.querySelectorAll('.page-view').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + page);
    if (target) target.style.display = 'block';

    document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
    const nav = document.getElementById('nav-' + page);
    if (nav) nav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mobileNav = document.getElementById('main-nav');
    if (mobileNav) mobileNav.classList.remove('open');
  }

  function toggleNav() {
    const nav = document.getElementById('main-nav');
    if (nav) nav.classList.toggle('open');
  }

  function toggleChat() {
    const w = document.getElementById('chatbot-window');
    const btn = document.getElementById('chatbot-toggle');
    const chatIcon = btn.querySelector('.chat-icon');
    const closeIcon = btn.querySelector('.close-icon');
    const isOpen = w.style.display !== 'none';
    w.style.display = isOpen ? 'none' : 'flex';
    chatIcon.style.display = isOpen ? 'inline' : 'none';
    closeIcon.style.display = isOpen ? 'none' : 'inline';
    document.body.classList.toggle('chatbot-open', !isOpen);
  }

  const responses = {
    billetterie: "✈️ <strong>Billetterie Aérienne</strong><br><br>Nous trouvons et émettons vos billets d'avion nationaux et internationaux sur toutes les compagnies IATA partenaires au meilleur tarif. Urgences traitées 7j/7 !",
    visa: "🛂 <strong>Assistance Visa & Formalités</strong><br><br>Audit et constitution de dossiers consulaires pour l'Espace Schengen, le Canada, les USA et Dubaï (visas express 72h).",
    hotels: "🏨 <strong>Réservation d'Hôtels & Séjours</strong><br><br>Sélection d'établissements vérifiés, confortables et sécurisés selon votre budget.",
    contact: "📞 <strong>Fondatrices de l'Agence</strong><br><br>• Jeanne Helene Epée Nsome : +237 699 976 258<br>• Miriam J. Nguemdo Nouzeda : +237 699 430 256<br>Email : contact@hemiraservices.com",
    adresse: "📍 <strong>Adresse Géographique</strong><br><br>Akwa — 101 Rue du Bruix, Douala, Cameroun.<br>Ouvert du Lundi au Vendredi de 08h à 18h et Samedi de 09h à 14h."
  };

  function sendBotQuery(key) {
    const msg = document.getElementById('chatbot-messages');
    msg.innerHTML += '<div class="user-message">' + key + '</div>';
    const rep = responses[key] || "Merci pour votre message ! Un conseiller HEMIRA à Douala traite votre demande.";
    setTimeout(() => {
      msg.innerHTML += '<div class="bot-message">' + rep + '</div>';
      msg.scrollTop = msg.scrollHeight;
    }, 300);
  }

  function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chatbot-input');
    const val = input.value.trim();
    if (!val) return;
    const msg = document.getElementById('chatbot-messages');
    msg.innerHTML += '<div class="user-message">' + val + '</div>';
    input.value = '';
    let found = "Merci pour votre message ! Un conseiller HEMIRA à Douala Akwa traite votre demande (+237 699 976 258).";
    const q = val.toLowerCase();
    if (q.includes('vol') || q.includes('billet') || q.includes('avion')) found = responses.billetterie;
    else if (q.includes('visa') || q.includes('passeport') || q.includes('consul')) found = responses.visa;
    else if (q.includes('hotel') || q.includes('hôtel')) found = responses.hotels;
    else if (q.includes('contact') || q.includes('phone') || q.includes('numero') || q.includes('appel')) found = responses.contact;
    else if (q.includes('adresse') || q.includes('ou') || q.includes('douala') || q.includes('bureau')) found = responses.adresse;

    setTimeout(() => {
      msg.innerHTML += '<div class="bot-message">' + found + '</div>';
      msg.scrollTop = msg.scrollHeight;
    }, 400);
  }

  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    const backBtn = document.querySelector('.back-top');
    if (backBtn) {
      if (window.scrollY > 500) backBtn.classList.add('visible');
      else backBtn.classList.remove('visible');
    }
  });

  // Remplacer les liens internes href="/xxx.php" par navigateTo
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href="/contact.php"], a[href="contact.php"]').forEach(a => {
      a.onclick = (e) => { e.preventDefault(); navigateTo('contact'); };
    });
    document.querySelectorAll('a[href="/services.php"], a[href="services.php"]').forEach(a => {
      a.onclick = (e) => { e.preventDefault(); navigateTo('services'); };
    });
    document.querySelectorAll('a[href="/about.php"], a[href="about.php"]').forEach(a => {
      a.onclick = (e) => { e.preventDefault(); navigateTo('about'); };
    });
    document.querySelectorAll('a[href="/case-studies.php"], a[href="case-studies.php"]').forEach(a => {
      a.onclick = (e) => { e.preventDefault(); navigateTo('case-studies'); };
    });
    document.querySelectorAll('a[href="/index.php"], a[href="index.php"]').forEach(a => {
      a.onclick = (e) => { e.preventDefault(); navigateTo('home'); };
    });
  });
</script>
`;

const previewContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HEMIRA Travel & Services — Reproduction 100% Officielle</title>
  <meta name="description" content="HEMIRA Travel & Services est une agence de voyage basée à Akwa, Douala : billets d'avion, assistance visa, réservation d'hôtels, tourisme local et international, voyages d'affaires et services divers.">
  <link rel="icon" type="image/png" href="/assets/img/uploads/logo-hemira-mark.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  ${headerHtml}

  <main id="main">
    <div id="page-home" class="page-view">${mainHome}</div>
    <div id="page-about" class="page-view" style="display:none;">${mainAbout}</div>
    <div id="page-services" class="page-view" style="display:none;">${mainServices}</div>
    <div id="page-case-studies" class="page-view" style="display:none;">${mainCaseStudies}</div>
    <div id="page-contact" class="page-view" style="display:none;">${mainContact}</div>
  </main>

  ${footerHtml}
  ${chatbotHtml}
  ${scriptHtml}
</body>
</html>
`;

fs.writeFileSync('preview.html', previewContent, 'utf8');
console.log('preview.html updated with 100% live site pages!');
