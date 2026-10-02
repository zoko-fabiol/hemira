document.addEventListener('DOMContentLoaded', function () {
  // Menu mobile
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('open');
      });
    });
  }

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Back to top button
  const backBtn = document.createElement('button');
  backBtn.className = 'back-top';
  backBtn.innerHTML = '↑';
  backBtn.setAttribute('aria-label', 'Retour en haut');
  document.body.appendChild(backBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll reveal (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Animated counters (keep existing logic but enhance)
  const counters = document.querySelectorAll('[data-count-to]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const raw = el.getAttribute('data-count-to');
      const match = raw.match(/^(\D*)(\d+)(\D*)$/);
      if (!match) return;
      const prefix = match[1], target = parseInt(match[2], 10), suffix = match[3];
      const duration = 1200;
      let start = null;
      const step = (ts) => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = raw;
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }

  // ---------------------------------------------------------------
  // Suivi des clics (analytics HEMIRA) : tout élément portant un
  // attribut data-track="nom_evenement" envoie un signal léger et
  // silencieux vers track.php, sans jamais ralentir la navigation.
  // ---------------------------------------------------------------
  function sendTrackEvent(eventName) {
    if (!eventName) return;
    try {
      if (navigator.sendBeacon) {
        const data = new Blob(['event=' + encodeURIComponent(eventName)], { type: 'application/x-www-form-urlencoded' });
        navigator.sendBeacon('track.php', data);
      } else {
        fetch('track.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'event=' + encodeURIComponent(eventName),
          keepalive: true
        }).catch(function () {});
      }
    } catch (e) { /* le suivi ne doit jamais bloquer l'utilisateur */ }
  }
  window.hemiraTrack = sendTrackEvent;

  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      sendTrackEvent(el.getAttribute('data-track'));
    });
  });
});