import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  SCHEMA_LIMITS,
  sanitizeCategoryProfileInput,
  sanitizeEvidenceItemInput,
} from './schema';

let app: ReturnType<typeof initializeApp> | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;

try {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  authInstance = getAuth(app);
} catch (err) {
  console.warn('Firebase initialization skipped or offline:', err);
}

export const db = dbInstance as ReturnType<typeof getFirestore>;
export const auth = authInstance as ReturnType<typeof getAuth>;
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

export async function signInWithGooglePopup(): Promise<User | null> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFirebaseUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };

/**
 * Ensures the root `/users/{uid}` and `/users/{uid}/private/info` documents exist
 * and are kept in sync with the user's preferences.
 */
export async function syncUserAccountToFirestore(params: {
  device: string;
  sparks: number;
  auroraEnabled: boolean;
  onboardingDismissed: boolean;
  theme: 'light' | 'dark';
  colorStyle: 'serious' | 'vibrant';
  renderQuality: 'mobile-light' | 'balanced' | 'high';
  reducedMotion: boolean;
  fallback2D: boolean;
  activeQuoteIndex: number;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);

  const payloadBase = {
    userId: user.uid,
    device: String(params.device || 'Laptop A').slice(0, SCHEMA_LIMITS.DEVICE_MAX_LENGTH),
    sparks: Math.max(0, Math.min(1000000, Math.round(params.sparks || 12))),
    auroraEnabled: Boolean(params.auroraEnabled),
    onboardingDismissed: Boolean(params.onboardingDismissed),
    theme: params.theme === 'dark' ? 'dark' : 'light',
    colorStyle: params.colorStyle === 'vibrant' ? 'vibrant' : 'serious',
    renderQuality: ['mobile-light', 'balanced', 'high'].includes(params.renderQuality)
      ? params.renderQuality
      : 'balanced',
    reducedMotion: Boolean(params.reducedMotion),
    fallback2D: Boolean(params.fallback2D),
    activeQuoteIndex: Math.max(0, Math.min(100, Math.round(params.activeQuoteIndex || 0))),
  };

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        ...payloadBase,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        device: payloadBase.device,
        sparks: payloadBase.sparks,
        auroraEnabled: payloadBase.auroraEnabled,
        onboardingDismissed: payloadBase.onboardingDismissed,
        theme: payloadBase.theme,
        colorStyle: payloadBase.colorStyle,
        renderQuality: payloadBase.renderQuality,
        reducedMotion: payloadBase.reducedMotion,
        fallback2D: payloadBase.fallback2D,
        activeQuoteIndex: payloadBase.activeQuoteIndex,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }

  if (user.email) {
    const privPath = `users/${user.uid}/private/info`;
    const privRef = doc(db, 'users', user.uid, 'private', 'info');
    try {
      const privSnap = await getDoc(privRef);
      if (!privSnap.exists()) {
        await setDoc(privRef, {
          userId: user.uid,
          email: user.email.slice(0, SCHEMA_LIMITS.EMAIL_MAX_LENGTH),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(privRef, {
          email: user.email.slice(0, SCHEMA_LIMITS.EMAIL_MAX_LENGTH),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, privPath);
    }
  }
}

/**
 * Syncs a single Core Domain CategoryProfile to `/users/{uid}/categoryProfiles/{slug}`
 * and its evidence items to `/users/{uid}/categoryProfiles/{slug}/evidence/{evId}`.
 */
export async function syncCategoryProfileToFirestore(profile: {
  categorySlug: string;
  level: number | null;
  nodeLevels: Record<string, number | null>;
  nodeChecklists: Record<string, Record<string, boolean[]>>;
  assessmentNote?: string;
  capabilityNotes?: string;
  meaningText?: string;
  potentialText?: string;
  version?: number;
  evidence?: any[];
}): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const clean = sanitizeCategoryProfileInput({
    userId: user.uid,
    categorySlug: profile.categorySlug,
    level: profile.level,
    nodeLevels: profile.nodeLevels,
    nodeChecklists: profile.nodeChecklists,
    assessmentNote: profile.assessmentNote,
    capabilityNotes: profile.capabilityNotes,
    meaningText: profile.meaningText,
    potentialText: profile.potentialText,
    version: profile.version,
  });

  const profPath = `users/${user.uid}/categoryProfiles/${clean.categorySlug}`;
  const profRef = doc(db, 'users', user.uid, 'categoryProfiles', clean.categorySlug);

  try {
    const snap = await getDoc(profRef);
    if (!snap.exists()) {
      await setDoc(profRef, {
        ...clean,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(profRef, {
        level: clean.level,
        nodeLevels: clean.nodeLevels,
        nodeChecklists: clean.nodeChecklists,
        assessmentNote: clean.assessmentNote,
        capabilityNotes: clean.capabilityNotes,
        meaningText: clean.meaningText,
        potentialText: clean.potentialText,
        version: clean.version,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, profPath);
  }

  if (Array.isArray(profile.evidence)) {
    for (const ev of profile.evidence) {
      await syncEvidenceItemToFirestore(clean.categorySlug, ev);
    }
  }
}

export async function syncEvidenceItemToFirestore(
  categorySlug: string,
  evItem: any
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const cleanEv = sanitizeEvidenceItemInput({
    id: evItem.id,
    userId: user.uid,
    categorySlug,
    title: evItem.title,
    summary: evItem.summary,
    itemType: evItem.itemType,
    occurredOn: evItem.occurredOn,
    externalUrl: evItem.externalUrl,
    usedNodeIds: evItem.usedNodeIds,
    assetRefKey: evItem.assetRefKey,
    assetKey: evItem.assetKey,
    assetName: evItem.assetName,
    assetMime: evItem.assetMime,
    sortOrder: evItem.sortOrder,
  });

  const evPath = `users/${user.uid}/categoryProfiles/${categorySlug}/evidence/${cleanEv.id}`;
  const evRef = doc(
    db,
    'users',
    user.uid,
    'categoryProfiles',
    categorySlug,
    'evidence',
    cleanEv.id
  );

  try {
    const snap = await getDoc(evRef);
    if (!snap.exists()) {
      await setDoc(evRef, {
        ...cleanEv,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(evRef, {
        title: cleanEv.title,
        summary: cleanEv.summary,
        itemType: cleanEv.itemType,
        occurredOn: cleanEv.occurredOn,
        externalUrl: cleanEv.externalUrl,
        usedNodeIds: cleanEv.usedNodeIds,
        assetRefKey: cleanEv.assetRefKey,
        assetKey: cleanEv.assetKey,
        assetName: cleanEv.assetName,
        assetMime: cleanEv.assetMime,
        sortOrder: cleanEv.sortOrder,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, evPath);
  }
}

export async function deleteEvidenceItemFromFirestore(
  categorySlug: string,
  evidenceId: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const evPath = `users/${user.uid}/categoryProfiles/${categorySlug}/evidence/${evidenceId}`;
  const evRef = doc(
    db,
    'users',
    user.uid,
    'categoryProfiles',
    categorySlug,
    'evidence',
    evidenceId
  );
  try {
    await deleteDoc(evRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, evPath);
  }
}

export async function fetchUserCloudProfiles(): Promise<Record<string, any> | null> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return null;

  const colPath = `users/${user.uid}/categoryProfiles`;
  try {
    const q = query(
      collection(db, 'users', user.uid, 'categoryProfiles'),
      where('userId', '==', user.uid)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const profiles: Record<string, any> = {};
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const slug = data.categorySlug;
      const evQuery = query(
        collection(db, 'users', user.uid, 'categoryProfiles', slug, 'evidence'),
        where('userId', '==', user.uid)
      );
      const evSnap = await getDocs(evQuery);
      const evidenceList = evSnap.docs.map((d) => d.data());
      profiles[slug] = {
        ...data,
        evidence: evidenceList,
      };
    }
    return profiles;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}
