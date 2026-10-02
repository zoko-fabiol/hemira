import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, getDocs, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

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
      lastVisit: d.data().lastVisit?.toDate ? d.data().lastVisit.toDate() : new Date(),
      firstVisit: d.data().firstVisit?.toDate ? d.data().firstVisit.toDate() : null
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

/**
 * Détecter l'appareil courant
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
 * Initialise des données réalistes de départ si la base est vide
 */
export async function seedDemoAnalyticsIfEmpty() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const dailyRef = doc(db, 'analytics_daily_stats', today);
    const dailySnap = await getDoc(dailyRef);

    if (!dailySnap.exists()) {
      await setDoc(dailyRef, {
        date: today,
        uniqueVisitorsCount: 14,
        totalSessionsCount: 26,
        revisitsCount: 12,
        devices: {
          'Android': 15,
          'iPhone': 7,
          'Windows': 3,
          'Mac': 1
        },
        countries: {
          'Cameroun': 18,
          'France': 5,
          'Canada': 2,
          'Belgique': 1
        },
        updatedAt: serverTimestamp()
      });

      // Visiteurs d'exemple
      const sampleVisitors = [
        {
          id: 'vis_sample_01',
          device: 'Android',
          deviceCategory: 'Mobile',
          deviceModel: 'Samsung Galaxy S23',
          browser: 'Chrome',
          country: 'Cameroun',
          countryCode: 'CM',
          city: 'Douala (Akwa)',
          visitCount: 3,
          todayVisitCount: 3,
          lastVisitDate: today,
          lastVisit: serverTimestamp(),
          firstVisit: serverTimestamp()
        },
        {
          id: 'vis_sample_02',
          device: 'iPhone',
          deviceCategory: 'Mobile',
          deviceModel: 'Apple iPhone 15 Pro',
          browser: 'Safari',
          country: 'Cameroun',
          countryCode: 'CM',
          city: 'Yaoundé',
          visitCount: 2,
          todayVisitCount: 2,
          lastVisitDate: today,
          lastVisit: serverTimestamp(),
          firstVisit: serverTimestamp()
        },
        {
          id: 'vis_sample_03',
          device: 'Windows',
          deviceCategory: 'Desktop',
          deviceModel: 'Windows 11 PC',
          browser: 'Chrome',
          country: 'France',
          countryCode: 'FR',
          city: 'Paris',
          visitCount: 1,
          todayVisitCount: 1,
          lastVisitDate: today,
          lastVisit: serverTimestamp(),
          firstVisit: serverTimestamp()
        },
        {
          id: 'vis_sample_04',
          device: 'Android',
          deviceCategory: 'Mobile',
          deviceModel: 'Xiaomi Redmi Note 12',
          browser: 'Chrome',
          country: 'Cameroun',
          countryCode: 'CM',
          city: 'Douala (Bonanjo)',
          visitCount: 4,
          todayVisitCount: 2,
          lastVisitDate: today,
          lastVisit: serverTimestamp(),
          firstVisit: serverTimestamp()
        }
      ];

      for (const v of sampleVisitors) {
        await setDoc(doc(db, 'analytics_visitors', v.id), v, { merge: true });
      }
    }
  } catch (err) {
    console.warn("Seed demo analytics warning:", err);
  }
}
