import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, getDocs, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Détection précise de l'OS et du modèle de l'appareil
 */
export function detectDevice() {
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  
  let device = 'Autre';
  let deviceCategory = 'Desktop';
  let deviceModel = 'Appareil inconnu';

  if (/Android/i.test(ua)) {
    device = 'Android';
    deviceCategory = /Mobile/i.test(ua) ? 'Mobile' : 'Tablette';
    
    // Essai d'extraction du modèle (ex: Samsung, Xiaomi, Pixel...)
    const modelMatch = ua.match(/Android[^;]+;\s*([^;)]+)\s*Build/i) || ua.match(/Android[^;]+;\s*([^;)]+)\)/i);
    deviceModel = modelMatch && modelMatch[1] ? `Android (${modelMatch[1].trim()})` : 'Smartphone Android';
  } else if (/iPhone/i.test(ua)) {
    device = 'iPhone';
    deviceCategory = 'Mobile';
    deviceModel = 'Apple iPhone';
  } else if (/iPad/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    device = 'iPad';
    deviceCategory = 'Tablette';
    deviceModel = 'Apple iPad';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    device = 'Mac';
    deviceCategory = 'Desktop';
    deviceModel = 'Apple Mac / macOS';
  } else if (/Windows NT 10.0/i.test(ua)) {
    device = 'Windows';
    deviceCategory = 'Desktop';
    deviceModel = 'Windows 10/11 PC';
  } else if (/Windows/i.test(ua)) {
    device = 'Windows';
    deviceCategory = 'Desktop';
    deviceModel = 'Windows PC';
  } else if (/Linux/i.test(ua)) {
    device = 'Linux';
    deviceCategory = 'Desktop';
    deviceModel = 'Linux Desktop';
  }

  // Détection du navigateur
  let browser = 'Autre';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';

  return { device, deviceCategory, deviceModel, browser };
}

/**
 * Géolocalisation automatique avec mise en cache locale (24h)
 * N'utilise aucune clé d'API, ultra-rapide avec timeout non-bloquant
 */
export async function getGeolocation() {
  const CACHE_KEY = 'hemira_geo_cache';
  const CACHE_TIME_KEY = 'hemira_geo_cache_time';
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (cached && cachedTime && (Date.now() - Number(cachedTime)) < ONE_DAY) {
      return JSON.parse(cached);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://get.geojs.io/v1/ip/geo.json', { 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const geoInfo = {
        country: data.country || 'Cameroun',
        countryCode: (data.country_code || 'CM').toUpperCase(),
        city: data.city || 'Douala',
        ip: data.ip || ''
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(geoInfo));
      localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      return geoInfo;
    }
  } catch {
    // Silencieux : fallback par défaut vers le Cameroun (siège social)
  }

  return {
    country: 'Cameroun',
    countryCode: 'CM',
    city: 'Douala',
    ip: ''
  };
}

/**
 * Récupère ou génère un ID visiteur persistant (localStorage)
 */
export function getOrCreateVisitorId() {
  let id = localStorage.getItem('hemira_visitor_id');
  if (!id) {
    const randPart = Math.random().toString(36).substring(2, 10);
    const timePart = Date.now().toString(36);
    id = `vis_${timePart}_${randPart}`;
    localStorage.setItem('hemira_visitor_id', id);
  }
  return id;
}

/**
 * Enregistre une visite et gère les revisites dans Firebase Firestore
 */
export async function trackVisitor() {
  try {
    const visitorId = getOrCreateVisitorId();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    
    // Détecter si nouvelle session (sessionStorage vidé à la fermeture du navigateur/onglet)
    const SESSION_KEY = 'hemira_session_active';
    const isNewSession = !sessionStorage.getItem(SESSION_KEY);
    sessionStorage.setItem(SESSION_KEY, 'true');

    const deviceInfo = detectDevice();
    const geoInfo = await getGeolocation();

    const visitorRef = doc(db, 'analytics_visitors', visitorId);
    const visitorSnap = await getDoc(visitorRef);

    let visitCount = 1;
    let todayVisitCount = 1;
    let isFirstVisitEver = true;
    let isFirstVisitToday = true;

    if (visitorSnap.exists()) {
      isFirstVisitEver = false;
      const data = visitorSnap.data();
      const lastVisitDate = data.lastVisitDate || '';
      const prevTotalVisits = Number(data.visitCount) || 1;
      const prevTodayVisits = Number(data.todayVisitCount) || 1;

      if (lastVisitDate !== today) {
        // Le lendemain (ou jour ultérieur) : compte comme une NOUVELLE VISITE du jour
        visitCount = prevTotalVisits + 1;
        todayVisitCount = 1;
        isFirstVisitToday = true;
      } else if (isNewSession) {
        // Même jour, mais l'utilisateur a quitté puis est revenu : revisite du jour (ex: visité 2 fois)
        visitCount = prevTotalVisits + 1;
        todayVisitCount = prevTodayVisits + 1;
        isFirstVisitToday = false;
      } else {
        // Même jour, même navigation continue sans avoir quitté
        visitCount = prevTotalVisits;
        todayVisitCount = prevTodayVisits;
        isFirstVisitToday = false;
      }
    }

    // 1. Sauvegarde dans analytics_visitors
    const visitorPayload = {
      visitorId,
      device: deviceInfo.device,
      deviceCategory: deviceInfo.deviceCategory,
      deviceModel: deviceInfo.deviceModel,
      browser: deviceInfo.browser,
      country: geoInfo.country,
      countryCode: geoInfo.countryCode,
      city: geoInfo.city,
      lastVisitDate: today,
      lastVisit: serverTimestamp(),
      visitCount,
      todayVisitCount,
      isOnline: true
    };

    if (isFirstVisitEver) {
      visitorPayload.firstVisit = serverTimestamp();
    }

    await setDoc(visitorRef, visitorPayload, { merge: true });

    // 2. Mise à jour des statistiques journalières (analytics_daily_stats)
    if (isNewSession || isFirstVisitToday) {
      const dailyRef = doc(db, 'analytics_daily_stats', today);
      const dailySnap = await getDoc(dailyRef);

      const deviceKey = `devices.${deviceInfo.device}`;
      const countryKey = `countries.${geoInfo.country}`;

      if (!dailySnap.exists()) {
        await setDoc(dailyRef, {
          date: today,
          uniqueVisitorsCount: 1,
          totalSessionsCount: 1,
          revisitsCount: 0,
          devices: { [deviceInfo.device]: 1 },
          countries: { [geoInfo.country]: 1 },
          updatedAt: serverTimestamp()
        });
      } else {
        const updateData = {
          totalSessionsCount: increment(1),
          [deviceKey]: increment(1),
          [countryKey]: increment(1),
          updatedAt: serverTimestamp()
        };

        if (isFirstVisitToday) {
          updateData.uniqueVisitorsCount = increment(1);
        } else {
          updateData.revisitsCount = increment(1);
        }

        await updateDoc(dailyRef, updateData);
      }
    }

    return {
      visitorId,
      visitCount,
      todayVisitCount,
      device: deviceInfo.device,
      country: geoInfo.country
    };
  } catch (err) {
    console.warn("Analytics tracking background warning:", err);
    return null;
  }
}

/**
 * Écoute en temps réel des visiteurs récents (pour l'admin)
 */
export function subscribeVisitors(callback) {
  const visitorsCol = collection(db, 'analytics_visitors');
  const q = query(visitorsCol, orderBy('lastVisit', 'desc'), limit(50));
  
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      lastVisit: d.data().lastVisit?.toDate ? d.data().lastVisit.toDate() : new Date()
    }));
    callback(list);
  }, (err) => {
    console.warn("Visitors subscription error:", err);
  });
}

/**
 * Écoute en temps réel des statistiques journalières
 */
export function subscribeDailyStats(callback) {
  const dailyCol = collection(db, 'analytics_daily_stats');
  const q = query(dailyCol, orderBy('date', 'desc'), limit(30));

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(list);
  }, (err) => {
    console.warn("Daily stats subscription error:", err);
  });
}
