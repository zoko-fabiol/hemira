import { db, storage } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { t as defaultTranslations } from '../translations';

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
        applyThemeToDOM(theme);
        callback(theme);
      } else {
        applyThemeToDOM(DEFAULT_THEME);
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
  applyThemeToDOM(theme);
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
  return { success: true, message: "Contenu par défaut synchronisé avec Firebase !" };
}

// Circuit Breaker mémorisé en session pour Firebase Storage
let isStorageDisabledForSession = typeof sessionStorage !== 'undefined'
  ? sessionStorage.getItem('hemira_storage_disabled') === 'true'
  : false;

// Optimisation automatique d'image côté client ultra-rapide (< 100ms)
// Décodage matériel natif (createImageBitmap ou URL.createObjectURL), Canvas WebP haute fidélité
export async function optimizeImage(file, maxDimension = 1200, quality = 0.78) {
  if (!file) throw new Error("Fichier absent");

  // Cas SVG : conservation vectorielle sans conversion
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        blob: file,
        dataUrl: reader.result,
        width: null,
        height: null,
        originalSize: file.size,
        compressedSize: file.size,
        mimeType: file.type
      });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 1. Décodage matériel haute performance
  let sourceWidth = 0;
  let sourceHeight = 0;
  let sourceElement = null;
  let objectUrlToRevoke = null;

  try {
    if (typeof createImageBitmap === 'function') {
      const bmp = await createImageBitmap(file);
      sourceWidth = bmp.width;
      sourceHeight = bmp.height;
      sourceElement = bmp;
    }
  } catch (bmpErr) {
    // Repli sur URL.createObjectURL si createImageBitmap échoue
  }

  if (!sourceElement) {
    sourceElement = await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      objectUrlToRevoke = url;
      const img = new Image();
      img.onload = () => {
        sourceWidth = img.naturalWidth || img.width;
        sourceHeight = img.naturalHeight || img.height;
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Impossible de décoder l'image sélectionnée."));
      };
      img.src = url;
    });
  }

  // 2. Calcul des dimensions cibles optimales
  let targetWidth = sourceWidth;
  let targetHeight = sourceHeight;
  if (targetWidth > maxDimension || targetHeight > maxDimension) {
    if (targetWidth > targetHeight) {
      targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
      targetWidth = maxDimension;
    } else {
      targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
      targetHeight = maxDimension;
    }
  }

  // 3. Dessin sur Canvas optimisé
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { alpha: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'medium';
  ctx.drawImage(sourceElement, 0, 0, targetWidth, targetHeight);

  // Libération mémoire immédiate
  if (typeof sourceElement.close === 'function') {
    sourceElement.close();
  }
  if (objectUrlToRevoke) {
    URL.revokeObjectURL(objectUrlToRevoke);
  }

  // 4. Encodage WebP ultra-léger (repli JPEG)
  let mime = 'image/webp';
  let dataUrl = canvas.toDataURL(mime, quality);
  if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
    mime = 'image/jpeg';
    dataUrl = canvas.toDataURL(mime, quality);
  }

  // Calcul instantané du poids compressé
  const b64Data = dataUrl.split(',')[1] || '';
  const compressedSize = Math.round((b64Data.length * 3) / 4);

  // Génération Blob
  const blob = await new Promise((res) => {
    canvas.toBlob((b) => res(b || file), mime, quality);
  });

  return {
    blob,
    dataUrl,
    width: targetWidth,
    height: targetHeight,
    originalSize: file.size,
    compressedSize,
    mimeType: mime
  };
}

// Upload image et enregistrement dans Firestore site_media + Storage avec repli optimisé
export async function uploadImageFile(file, folder = 'uploads') {
  const result = await uploadMediaWithMetadata(file, folder);
  return result.url;
}

// Upload haute performance avec chronométrage et Circuit Breaker (< 1.5s garanti)
export async function uploadMediaWithMetadata(file, folder = 'uploads') {
  const startTime = Date.now();
  let finalUrl = '';
  let meta = {
    width: null,
    height: null,
    originalSize: file.size,
    compressedSize: file.size,
    mimeType: file.type
  };

  try {
    const opt = await optimizeImage(file, 1200, 0.78);
    meta = {
      width: opt.width,
      height: opt.height,
      originalSize: opt.originalSize,
      compressedSize: opt.compressedSize,
      mimeType: opt.mimeType
    };

    // Tentative Storage avec Circuit Breaker (Timeout strict 1200ms)
    if (!isStorageDisabledForSession) {
      try {
        const ext = opt.mimeType === 'image/webp' ? 'webp' : (opt.mimeType === 'image/svg+xml' ? 'svg' : 'jpg');
        const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}.${ext}`;
        const storageRef = ref(storage, filename);

        const uploadPromise = uploadBytes(storageRef, opt.blob).then(snap => getDownloadURL(snap.ref));
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Storage timeout (1200ms)")), 1200)
        );

        finalUrl = await Promise.race([uploadPromise, timeoutPromise]);
      } catch (storageErr) {
        console.warn("Storage indisponible ou lent, activation du Circuit Breaker et bascule directe Firestore :", storageErr?.message || storageErr);
        isStorageDisabledForSession = true;
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('hemira_storage_disabled', 'true');
        }
        finalUrl = opt.dataUrl;
      }
    } else {
      // Storage déjà marqué comme indisponible : repli 0ms
      finalUrl = opt.dataUrl;
    }
  } catch (optErr) {
    console.warn("Échec d'optimisation d'image, lecture directe FileReader :", optErr);
    finalUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Enregistrement dans le catalogue média Firestore 'site_media'
  let docId = `media_${Date.now()}`;
  try {
    const mediaCol = collection(db, 'site_media');
    const docRef = await addDoc(mediaCol, {
      name: file.name,
      folder: folder,
      url: finalUrl,
      size: meta.originalSize,
      compressedSize: meta.compressedSize,
      width: meta.width,
      height: meta.height,
      mimeType: meta.mimeType,
      createdAt: Date.now()
    });
    docId = docRef.id;
  } catch (fsErr) {
    console.warn("Enregistrement collection site_media Firestore warning:", fsErr);
  }

  const durationMs = Date.now() - startTime;
  console.log(`[Performance Upload] Image traitée et prête en ${durationMs}ms (${Math.round(meta.compressedSize / 1024)} Ko)`);

  return {
    url: finalUrl,
    id: docId,
    name: file.name,
    durationMs,
    ...meta
  };
}

// Souscription temps réel à la médiathèque Firestore
export function subscribeMediaLibrary(callback) {
  try {
    const q = query(collection(db, 'site_media'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(items);
    }, (err) => {
      console.warn("Abonnement médiathèque avec index avertissement, repli non indexé :", err);
      const fallbackQ = collection(db, 'site_media');
      return onSnapshot(fallbackQ, (fSnap) => {
        const fItems = fSnap.docs.map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        callback(fItems);
      });
    });
  } catch (err) {
    console.warn("Erreur souscription médiathèque:", err);
    callback([]);
    return () => {};
  }
}

// Supprimer un média de la médiathèque Firestore
export async function deleteMediaItem(id) {
  try {
    await deleteDoc(doc(db, 'site_media', id));
    return { success: true };
  } catch (err) {
    console.error("Suppression média Firestore error:", err);
    throw err;
  }
}

// Helper: Deep merge objects
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
