/**
 * Database Schema & Validation Definitions for THE BACKPACK — Personal Skill Atlas RPG
 * Strictly synchronized with `/firebase-blueprint.json` and `/firestore.rules`.
 */

export const CANONICAL_CATEGORY_SLUGS = [
  'wpda',
  'physical-wellness',
  'music',
  'engineering',
  'business',
  'content-creating',
  'art',
  'interpersonal-skill',
  'exploration-adaptation',
  'critical-thinking-logic',
] as const;

export type CategorySlug = (typeof CANONICAL_CATEGORY_SLUGS)[number];

export const SCHEMA_LIMITS = {
  ID_MIN_LENGTH: 1,
  ID_MAX_LENGTH: 128,
  DEVICE_MAX_LENGTH: 64,
  EMAIL_MIN_LENGTH: 3,
  EMAIL_MAX_LENGTH: 254,
  ASSESSMENT_NOTE_MAX_LENGTH: 1000,
  CAPABILITY_NOTES_MAX_LENGTH: 5000,
  MEANING_TEXT_MAX_LENGTH: 10000,
  POTENTIAL_TEXT_MAX_LENGTH: 10000,
  EVIDENCE_TITLE_MIN_LENGTH: 1,
  EVIDENCE_TITLE_MAX_LENGTH: 120,
  EVIDENCE_SUMMARY_MAX_LENGTH: 2000,
  EXTERNAL_URL_MAX_LENGTH: 500,
  ASSET_META_MAX_LENGTH: 200,
  ASSET_MIME_MAX_LENGTH: 100,
  MAX_USED_NODE_IDS: 18,
  MAX_NODES_PER_CATEGORY: 24,
} as const;

export const SCHEMA_PATTERNS = {
  VALID_ID: /^[a-zA-Z0-9_\-]+$/,
  OPTIONAL_HTTPS_URL: /^(|https:\/\/.+)$/,
} as const;

export type ThemeMode = 'light' | 'dark';
export type ColorStyleMode = 'serious' | 'vibrant';
export type RenderQualityProfile = 'mobile-light' | 'balanced' | 'high';
export type EvidenceItemType = 'project' | 'experience' | 'document' | 'visual' | 'link';

export interface UserAccountDoc {
  userId: string;
  device: string;
  sparks: number;
  auroraEnabled: boolean;
  onboardingDismissed: boolean;
  theme: ThemeMode;
  colorStyle: ColorStyleMode;
  renderQuality: RenderQualityProfile;
  reducedMotion: boolean;
  fallback2D: boolean;
  activeQuoteIndex: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface UserPrivateInfoDoc {
  userId: string;
  email: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface CategoryProfileDoc {
  userId: string;
  categorySlug: CategorySlug;
  level: number | null;
  nodeLevels: Record<string, number | null>;
  nodeChecklists: Record<string, Record<string, boolean[]>>;
  assessmentNote: string;
  capabilityNotes: string;
  meaningText: string;
  potentialText: string;
  version: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface EvidenceItemDoc {
  id: string;
  userId: string;
  categorySlug: CategorySlug;
  title: string;
  summary: string;
  itemType: EvidenceItemType;
  occurredOn: string;
  externalUrl: string;
  usedNodeIds: number[];
  assetRefKey: string;
  assetKey: string;
  assetName: string;
  assetMime: string;
  sortOrder: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export function isValidDocumentId(id: unknown): id is string {
  return (
    typeof id === 'string' &&
    id.length >= SCHEMA_LIMITS.ID_MIN_LENGTH &&
    id.length <= SCHEMA_LIMITS.ID_MAX_LENGTH &&
    SCHEMA_PATTERNS.VALID_ID.test(id)
  );
}

export function isValidCategorySlug(slug: unknown): slug is CategorySlug {
  return (
    typeof slug === 'string' &&
    (CANONICAL_CATEGORY_SLUGS as readonly string[]).includes(slug)
  );
}

export function sanitizeCategoryProfileInput(input: {
  userId: string;
  categorySlug: string;
  level: number | null;
  nodeLevels: Record<string, number | null>;
  nodeChecklists: Record<string, Record<string, boolean[]>>;
  assessmentNote?: string;
  capabilityNotes?: string;
  meaningText?: string;
  potentialText?: string;
  version?: number;
}) {
  const safeLevel =
    typeof input.level === 'number' && input.level >= 1 && input.level <= 5
      ? Math.round(input.level)
      : null;

  return {
    userId: String(input.userId || '').slice(0, SCHEMA_LIMITS.ID_MAX_LENGTH),
    categorySlug: input.categorySlug as CategorySlug,
    level: safeLevel,
    nodeLevels: input.nodeLevels || {},
    nodeChecklists: input.nodeChecklists || {},
    assessmentNote: String(input.assessmentNote || '').slice(
      0,
      SCHEMA_LIMITS.ASSESSMENT_NOTE_MAX_LENGTH
    ),
    capabilityNotes: String(input.capabilityNotes || '').slice(
      0,
      SCHEMA_LIMITS.CAPABILITY_NOTES_MAX_LENGTH
    ),
    meaningText: String(input.meaningText || '').slice(
      0,
      SCHEMA_LIMITS.MEANING_TEXT_MAX_LENGTH
    ),
    potentialText: String(input.potentialText || '').slice(
      0,
      SCHEMA_LIMITS.POTENTIAL_TEXT_MAX_LENGTH
    ),
    version:
      typeof input.version === 'number' && input.version >= 1
        ? Math.round(input.version)
        : 1,
  };
}

export function sanitizeEvidenceItemInput(input: {
  id: string;
  userId: string;
  categorySlug: string;
  title: string;
  summary?: string;
  itemType?: string;
  occurredOn?: string | null;
  externalUrl?: string | null;
  usedNodeIds?: number[];
  assetRefKey?: string | null;
  assetKey?: string | null;
  assetName?: string | null;
  assetMime?: string | null;
  sortOrder?: number;
}) {
  const validTypes: EvidenceItemType[] = [
    'project',
    'experience',
    'document',
    'visual',
    'link',
  ];
  const rawType = (input.itemType || 'project') as EvidenceItemType;
  const safeType = validTypes.includes(rawType) ? rawType : 'project';

  const rawUrl = String(input.externalUrl || '').trim();
  const safeUrl =
    rawUrl.startsWith('https://') &&
    rawUrl.length <= SCHEMA_LIMITS.EXTERNAL_URL_MAX_LENGTH
      ? rawUrl
      : '';

  const safeUsedNodes = Array.isArray(input.usedNodeIds)
    ? input.usedNodeIds
        .filter((n) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 17)
        .slice(0, SCHEMA_LIMITS.MAX_USED_NODE_IDS)
    : [];

  return {
    id: String(input.id || '').replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, SCHEMA_LIMITS.ID_MAX_LENGTH),
    userId: String(input.userId || '').slice(0, SCHEMA_LIMITS.ID_MAX_LENGTH),
    categorySlug: input.categorySlug as CategorySlug,
    title: String(input.title || 'Bukti Karya').trim().slice(0, SCHEMA_LIMITS.EVIDENCE_TITLE_MAX_LENGTH),
    summary: String(input.summary || '').slice(0, SCHEMA_LIMITS.EVIDENCE_SUMMARY_MAX_LENGTH),
    itemType: safeType,
    occurredOn: String(input.occurredOn || '').slice(0, 32),
    externalUrl: safeUrl,
    usedNodeIds: safeUsedNodes,
    assetRefKey: String(input.assetRefKey || '').slice(0, SCHEMA_LIMITS.ASSET_META_MAX_LENGTH),
    assetKey: String(input.assetKey || '').slice(0, SCHEMA_LIMITS.ASSET_META_MAX_LENGTH),
    assetName: String(input.assetName || '').slice(0, SCHEMA_LIMITS.ASSET_META_MAX_LENGTH),
    assetMime: String(input.assetMime || '').slice(0, SCHEMA_LIMITS.ASSET_MIME_MAX_LENGTH),
    sortOrder:
      typeof input.sortOrder === 'number' && input.sortOrder >= 0
        ? Math.min(10000, Math.round(input.sortOrder))
        : 1,
  };
}
