import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const PRESET_STYLES = {
  signature: {
    id: 'signature',
    name: 'Signature HEMIRA',
    description: 'Marine profonde et bleu atlantique raffiné. Le design officiel.',
    palette: {
      primary: '#0E1F3D',
      accent: '#4A7FB8',
      gold: '#C9A968',
      surface: '#FFFFFF',
      surfaceAlt: '#F7F6F2',
      ink: '#16213A',
      border: '#E7E5DE'
    },
    typography: 'sora-inter',
    shape: 'rounded', // 16px
    density: 'comfortable',
    motion: 'subtle',
    sections: {
      'home.hero': { variant: 'split', tone: 'dark', visible: true },
      'home.commitments': { variant: 'default', tone: 'light', visible: true },
      'home.services': { variant: 'default', tone: 'alt', visible: true },
      'services.list': { variant: 'default', tone: 'light', visible: true },
      'cases.list': { variant: 'default', tone: 'light', visible: true },
      'about.founders': { variant: 'default', tone: 'light', visible: true }
    }
  },
  prestige: {
    id: 'prestige',
    name: 'Prestige Nuit & Or',
    description: 'Bleu nuit ténébreux, finitions or champagne et contrastes VIP.',
    palette: {
      primary: '#080E1A',
      accent: '#D4AF37',
      gold: '#D4AF37',
      surface: '#0E172A',
      surfaceAlt: '#142038',
      ink: '#F8FAFC',
      border: '#283652'
    },
    typography: 'playfair-sans',
    shape: 'soft', // 10px
    density: 'airy',
    motion: 'expressive',
    sections: {
      'home.hero': { variant: 'center', tone: 'dark', visible: true },
      'home.commitments': { variant: 'card-dark', tone: 'dark', visible: true },
      'home.services': { variant: 'card-dark', tone: 'dark', visible: true },
      'services.list': { variant: 'card-dark', tone: 'dark', visible: true },
      'cases.list': { variant: 'case-prestige-dark', tone: 'dark', visible: true },
      'about.founders': { variant: 'centered-vision', tone: 'dark', visible: true }
    }
  },
  editorial: {
    id: 'editorial',
    name: 'Lumière Éditoriale',
    description: 'Chaleur crème, typographie éditoriale haute couture et grand confort de lecture.',
    palette: {
      primary: '#242D35',
      accent: '#B85D43',
      gold: '#C9A968',
      surface: '#FAF8F5',
      surfaceAlt: '#F0ECE1',
      ink: '#1C2329',
      border: '#DDD6C9'
    },
    typography: 'playfair-sans',
    shape: 'soft', // 10px
    density: 'comfortable',
    motion: 'subtle',
    sections: {
      'home.hero': { variant: 'minimal', tone: 'dark', visible: true },
      'home.commitments': { variant: 'card-bordered', tone: 'alt', visible: true },
      'home.services': { variant: 'card-minimal', tone: 'light', visible: true },
      'services.list': { variant: 'card-minimal', tone: 'light', visible: true },
      'cases.list': { variant: 'case-editorial', tone: 'alt', visible: true },
      'about.founders': { variant: 'editorial-split', tone: 'light', visible: true }
    }
  },
  modern: {
    id: 'modern',
    name: 'Moderne Épuré',
    description: 'Lignes acérées, bleu cobalt vif, structure nette et aérée.',
    palette: {
      primary: '#0B132B',
      accent: '#2563EB',
      gold: '#38BDF8',
      surface: '#FFFFFF',
      surfaceAlt: '#F1F5F9',
      ink: '#0F172A',
      border: '#E2E8F0'
    },
    typography: 'sora-inter',
    shape: 'sharp', // 6px
    density: 'airy',
    motion: 'subtle',
    sections: {
      'home.hero': { variant: 'bento', tone: 'dark', visible: true },
      'home.commitments': { variant: 'card-elevated', tone: 'light', visible: true },
      'home.services': { variant: 'card-elevated', tone: 'alt', visible: true },
      'services.list': { variant: 'card-elevated', tone: 'light', visible: true },
      'cases.list': { variant: 'case-bento', tone: 'light', visible: true },
      'about.founders': { variant: 'default', tone: 'light', visible: true }
    }
  }
};

export const DEFAULT_APPEARANCE = PRESET_STYLES.signature;

export const SHAPE_RADIUS = {
  sharp: '6px',
  soft: '10px',
  rounded: '16px',
  pill: '24px'
};

export const MOTION_DURATIONS = {
  none: '0ms',
  subtle: '300ms',
  expressive: '500ms'
};

export const TYPOGRAPHY_CONFIGS = {
  'sora-inter': {
    name: 'Sora & Inter (Moderne)',
    heading: "'Sora', sans-serif",
    body: "'Inter', sans-serif"
  },
  'playfair-sans': {
    name: 'Playfair & Inter (Prestige & Luxe)',
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', sans-serif"
  },
  'plus-jakarta': {
    name: 'Plus Jakarta (Tech & Dynamique)',
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'Inter', sans-serif"
  }
};

/**
 * Applique l'apparence aux variables CSS du DOM
 */
export function applyAppearanceToDOM(appearance) {
  if (!appearance || typeof document === 'undefined') return;
  const root = document.documentElement;
  const p = appearance.palette || DEFAULT_APPEARANCE.palette;

  if (p.primary) {
    root.style.setProperty('--navy', p.primary);
    root.style.setProperty('--theme-primary', p.primary);
  }
  if (p.accent) {
    root.style.setProperty('--coral', p.accent);
    root.style.setProperty('--theme-accent', p.accent);
  }
  if (p.gold) {
    root.style.setProperty('--gold', p.gold);
    root.style.setProperty('--theme-gold', p.gold);
  }
  if (p.surfaceAlt || p.surface) {
    const sAlt = p.surfaceAlt || p.surface;
    root.style.setProperty('--bg-light', sAlt);
    root.style.setProperty('--theme-surface-alt', sAlt);
  }
  if (p.surface) {
    root.style.setProperty('--theme-surface', p.surface);
  }
  if (p.ink) {
    root.style.setProperty('--ink', p.ink);
    root.style.setProperty('--theme-ink', p.ink);
  }
  if (p.border) {
    root.style.setProperty('--border', p.border);
    root.style.setProperty('--theme-border', p.border);
  }

  const radius = SHAPE_RADIUS[appearance.shape] || SHAPE_RADIUS.rounded;
  root.style.setProperty('--radius', radius);
  root.style.setProperty('--theme-radius', radius);

  const motion = MOTION_DURATIONS[appearance.motion] || MOTION_DURATIONS.subtle;
  root.style.setProperty('--theme-motion-duration', motion);
  if (appearance.motion === 'none') {
    root.style.setProperty('--transition', 'none');
  } else if (appearance.motion === 'expressive') {
    root.style.setProperty('--transition', '0.5s cubic-bezier(0.16, 1, 0.3, 1)');
  } else {
    root.style.setProperty('--transition', '0.35s cubic-bezier(0.22, 1, 0.36, 1)');
  }

  const typo = TYPOGRAPHY_CONFIGS[appearance.typography] || TYPOGRAPHY_CONFIGS['sora-inter'];
  root.style.setProperty('--theme-font-heading', typo.heading);
  root.style.setProperty('--theme-font-body', typo.body);

  root.setAttribute('data-appearance-style', appearance.style || 'signature');
  root.setAttribute('data-appearance-shape', appearance.shape || 'rounded');
  root.setAttribute('data-appearance-density', appearance.density || 'comfortable');
  root.setAttribute('data-appearance-motion', appearance.motion || 'subtle');
}

/**
 * Souscription temps réel à l'apparence publiée (Live)
 */
export function subscribeAppearance(callback) {
  try {
    const docRef = doc(db, 'site_settings', 'appearance');
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const live = { ...DEFAULT_APPEARANCE, ...snap.data() };
        callback(live);
      } else {
        callback(DEFAULT_APPEARANCE);
      }
    }, (err) => {
      console.warn("Firestore appearance live subscribe warning:", err);
      callback(DEFAULT_APPEARANCE);
    });
  } catch (err) {
    console.warn("Appearance live listener error:", err);
    callback(DEFAULT_APPEARANCE);
    return () => {};
  }
}

/**
 * Souscription temps réel à l'apparence brouillon (Draft)
 */
export function subscribeAppearanceDraft(callback) {
  try {
    const docRef = doc(db, 'site_settings', 'appearance_draft');
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback({ ...DEFAULT_APPEARANCE, ...snap.data() });
      } else {
        callback(DEFAULT_APPEARANCE);
      }
    }, (err) => {
      console.warn("Firestore appearance draft subscribe warning:", err);
      callback(DEFAULT_APPEARANCE);
    });
  } catch (err) {
    console.warn("Appearance draft listener error:", err);
    callback(DEFAULT_APPEARANCE);
    return () => {};
  }
}

/**
 * Sauvegarder en brouillon
 */
export async function saveAppearanceDraft(appearance) {
  const docRef = doc(db, 'site_settings', 'appearance_draft');
  await setDoc(docRef, appearance, { merge: true });
}

/**
 * Publier en direct sur le site
 */
export async function saveAppearanceLive(appearance) {
  const liveRef = doc(db, 'site_settings', 'appearance');
  const draftRef = doc(db, 'site_settings', 'appearance_draft');
  await setDoc(liveRef, appearance, { merge: true });
  await setDoc(draftRef, appearance, { merge: true });
}
