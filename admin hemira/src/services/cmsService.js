import { db, storage } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { t as defaultTranslations } from '../data/defaultTranslations';

export const DEFAULT_THEME = {
  navy: "#0E1F3D",
  navyLight: "#1B3A63",
  coral: "#4A7FB8",
  gold: "#C9A968",
  teal: "#6FA0D0",
  ink: "#16213A",
  slate: "#5B6B7C",
  bgLight: "#F7F6F2",
  border: "#E7E5DE"
};

export const DEFAULT_SETTINGS = {
  siteTitle: "HEMIRA Travel & Services",
  siteTagline: "Agence de voyage à Douala : billets d'avion, assistance visa, hôtels, tourisme et voyages d'affaires.",
  logoUrl: "/assets/img/uploads/logo-hemira-full.png",
  logoMarkUrl: "/assets/img/uploads/logo-hemira-mark.png",
  phone1: "+237 671 28 35 34",
  phone2: "+237 691 64 63 94",
  email: "contact@hemiraservices.com",
  address: "Akwa — 101 Rue du Bruix, Douala, Cameroun"
};

// Apply dynamic colors to :root
export function applyThemeToDOM(theme) {
  if (!theme || typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme.navy) root.style.setProperty('--navy', theme.navy);
  if (theme.navyLight) root.style.setProperty('--navy-light', theme.navyLight);
  if (theme.coral) root.style.setProperty('--coral', theme.coral);
  if (theme.gold) root.style.setProperty('--gold', theme.gold);
  if (theme.teal) root.style.setProperty('--teal', theme.teal);
  if (theme.ink) root.style.setProperty('--ink', theme.ink);
  if (theme.slate) root.style.setProperty('--slate', theme.slate);
  if (theme.bgLight) root.style.setProperty('--bg-light', theme.bgLight);
  if (theme.border) root.style.setProperty('--border', theme.border);
}

// Subscribe to Theme in real-time
export function subscribeTheme(callback) {
  try {
    const docRef = doc(db, 'site_settings', 'theme');
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const theme = { ...DEFAULT_THEME, ...snap.data() };
        callback(theme);
      } else {
        callback(DEFAULT_THEME);
      }
    }, (error) => {
      console.warn("Firestore theme subscribe warning:", error);
      callback(DEFAULT_THEME);
    });
  } catch (err) {
    console.warn("Theme listener initialization error:", err);
    callback(DEFAULT_THEME);
    return () => {};
  }
}

// Subscribe to General Settings in real-time
export function subscribeSettings(callback) {
  try {
    const docRef = doc(db, 'site_settings', 'general');
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback({ ...DEFAULT_SETTINGS, ...snap.data() });
      } else {
        callback(DEFAULT_SETTINGS);
      }
    }, (error) => {
      console.warn("Firestore settings subscribe warning:", error);
      callback(DEFAULT_SETTINGS);
    });
  } catch (err) {
    console.warn("Settings listener error:", err);
    callback(DEFAULT_SETTINGS);
    return () => {};
  }
}

// Subscribe to Site Content (by lang: 'fr' or 'en')
export function subscribeContent(lang, callback) {
  try {
    const docRef = doc(db, 'site_content', lang);
    return onSnapshot(docRef, (snap) => {
      const fallback = defaultTranslations[lang] || defaultTranslations.fr;
      if (snap.exists()) {
        callback(deepMerge(fallback, snap.data()));
      } else {
        callback(fallback);
      }
    }, (error) => {
      console.warn(`Firestore content subscribe warning (${lang}):`, error);
      callback(defaultTranslations[lang] || defaultTranslations.fr);
    });
  } catch (err) {
    console.warn(`Content listener error (${lang}):`, err);
    callback(defaultTranslations[lang] || defaultTranslations.fr);
    return () => {};
  }
}

// Save Theme
export async function saveTheme(theme) {
  const docRef = doc(db, 'site_settings', 'theme');
  await setDoc(docRef, theme, { merge: true });
}

// Save General Settings
export async function saveSettings(settings) {
  const docRef = doc(db, 'site_settings', 'general');
  await setDoc(docRef, settings, { merge: true });
}

// Save Content for a language
export async function saveContent(lang, content) {
  const docRef = doc(db, 'site_content', lang);
  await setDoc(docRef, content, { merge: true });
}

// Initialize / Seed Defaults into Firestore
export async function seedAllDefaults() {
  await saveTheme(DEFAULT_THEME);
  await saveSettings(DEFAULT_SETTINGS);
  await saveContent('fr', defaultTranslations.fr);
  await saveContent('en', defaultTranslations.en);
  return { success: true, message: "Contenu officiel synchronisé avec succès dans Firebase !" };
}

// Upload image (Firebase Storage with base64 fallback)
export async function uploadImageFile(file, folder = 'uploads') {
  try {
    const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storageRef = ref(storage, filename);
    const snap = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snap.ref);
    return url;
  } catch (err) {
    console.warn("Storage upload failed, falling back to base64 data URL:", err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}

function deepMerge(target, source) {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key]) && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
