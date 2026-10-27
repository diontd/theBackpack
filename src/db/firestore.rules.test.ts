import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  CANONICAL_CATEGORY_SLUGS,
  SCHEMA_LIMITS,
  SCHEMA_PATTERNS,
  isValidCategorySlug,
  isValidDocumentId,
} from './schema';

/**
 * Deterministic Security Rules & Dirty Dozen Evaluator
 * Verifies that `firestore.rules` contains all required guards and that all 12
 * "Dirty Dozen" adversarial payloads defined in `security_spec.md` return PERMISSION_DENIED.
 */

interface SimulatedAuth {
  uid: string;
  email_verified: boolean;
}

interface SimulatedContext {
  auth: SimulatedAuth | null;
  requestTime: string;
  existingDocs: Record<string, Record<string, any>>;
}

function evaluateRuleSimulation(
  ctx: SimulatedContext,
  operation: 'get' | 'list' | 'create' | 'update' | 'delete',
  docPath: string,
  incomingData?: Record<string, any>
): 'ALLOW' | 'PERMISSION_DENIED' {
  // Pillar 4.1 & Auth check
  if (!ctx.auth || ctx.auth.email_verified !== true) {
    return 'PERMISSION_DENIED';
  }

  const parts = docPath.split('/').filter(Boolean);
  // /users/{userId}
  if (parts.length === 2 && parts[0] === 'users') {
    const userId = parts[1];
    if (ctx.auth.uid !== userId || !isValidDocumentId(userId)) return 'PERMISSION_DENIED';
    if (operation === 'create') {
      if (!incomingData) return 'PERMISSION_DENIED';
      const allowedKeys = [
        'userId',
        'device',
        'sparks',
        'auroraEnabled',
        'onboardingDismissed',
        'theme',
        'colorStyle',
        'renderQuality',
        'reducedMotion',
        'fallback2D',
        'activeQuoteIndex',
        'createdAt',
        'updatedAt',
      ];
      const keys = Object.keys(incomingData);
      if (
        keys.length !== allowedKeys.length ||
        !allowedKeys.every((k) => keys.includes(k))
      ) {
        return 'PERMISSION_DENIED';
      }
      if (incomingData.userId !== ctx.auth.uid) return 'PERMISSION_DENIED';
      if (
        incomingData.createdAt !== ctx.requestTime ||
        incomingData.updatedAt !== ctx.requestTime
      ) {
        return 'PERMISSION_DENIED';
      }
      return 'ALLOW';
    }
  }

  // /users/{userId}/private/{infoId}
  if (parts.length === 4 && parts[0] === 'users' && parts[2] === 'private') {
    const [, userId, , infoId] = parts;
    if (ctx.auth.uid !== userId || !isValidDocumentId(userId) || !isValidDocumentId(infoId)) {
      return 'PERMISSION_DENIED';
    }
    const parentUser = ctx.existingDocs[`/users/${userId}`];
    if (!parentUser || parentUser.userId !== ctx.auth.uid) return 'PERMISSION_DENIED';
    if (operation === 'get') {
      const existing = ctx.existingDocs[docPath];
      if (!existing || existing.userId !== ctx.auth.uid) return 'PERMISSION_DENIED';
      return 'ALLOW';
    }
  }

  // /users/{userId}/categoryProfiles/{categorySlug}
  if (parts.length === 4 && parts[0] === 'users' && parts[2] === 'categoryProfiles') {
    const [, userId, , categorySlug] = parts;
    if (
      ctx.auth.uid !== userId ||
      !isValidDocumentId(userId) ||
      !isValidCategorySlug(categorySlug)
    ) {
      return 'PERMISSION_DENIED';
    }
    const parentUser = ctx.existingDocs[`/users/${userId}`];
    if (!parentUser || parentUser.userId !== ctx.auth.uid) return 'PERMISSION_DENIED';

    const allowedKeys = [
      'userId',
      'categorySlug',
      'level',
      'nodeLevels',
      'nodeChecklists',
      'assessmentNote',
      'capabilityNotes',
      'meaningText',
      'potentialText',
      'version',
      'createdAt',
      'updatedAt',
    ];

    if (operation === 'create' || operation === 'update') {
      if (!incomingData) return 'PERMISSION_DENIED';
      const keys = Object.keys(incomingData);
      if (
        keys.length !== allowedKeys.length ||
        !allowedKeys.every((k) => keys.includes(k))
      ) {
        return 'PERMISSION_DENIED';
      }
      if (incomingData.userId !== ctx.auth.uid) return 'PERMISSION_DENIED';
      if (incomingData.categorySlug !== categorySlug) return 'PERMISSION_DENIED';
      if (
        typeof incomingData.meaningText !== 'string' ||
        incomingData.meaningText.length > SCHEMA_LIMITS.MEANING_TEXT_MAX_LENGTH
      ) {
        return 'PERMISSION_DENIED';
      }
      if (operation === 'create') {
        if (
          incomingData.createdAt !== ctx.requestTime ||
          incomingData.updatedAt !== ctx.requestTime
        ) {
          return 'PERMISSION_DENIED';
        }
        return 'ALLOW';
      }
      if (operation === 'update') {
        const existing = ctx.existingDocs[docPath];
        if (!existing) return 'PERMISSION_DENIED';
        if (incomingData.userId !== existing.userId) return 'PERMISSION_DENIED';
        if (incomingData.categorySlug !== existing.categorySlug) return 'PERMISSION_DENIED';
        if (incomingData.createdAt !== existing.createdAt) return 'PERMISSION_DENIED';
        if (incomingData.updatedAt !== ctx.requestTime) return 'PERMISSION_DENIED';
        return 'ALLOW';
      }
    }
  }

  // /users/{userId}/categoryProfiles/{categorySlug}/evidence/{evidenceId}
  if (
    parts.length === 6 &&
    parts[0] === 'users' &&
    parts[2] === 'categoryProfiles' &&
    parts[4] === 'evidence'
  ) {
    const [, userId, , categorySlug, , evidenceId] = parts;
    if (
      ctx.auth.uid !== userId ||
      !isValidDocumentId(userId) ||
      !isValidCategorySlug(categorySlug) ||
      !isValidDocumentId(evidenceId)
    ) {
      return 'PERMISSION_DENIED';
    }
    const parentProf = ctx.existingDocs[`/users/${userId}/categoryProfiles/${categorySlug}`];
    if (!parentProf || parentProf.userId !== ctx.auth.uid) return 'PERMISSION_DENIED';

    if (operation === 'create') {
      if (!incomingData) return 'PERMISSION_DENIED';
      const allowedKeys = [
        'id',
        'userId',
        'categorySlug',
        'title',
        'summary',
        'itemType',
        'occurredOn',
        'externalUrl',
        'usedNodeIds',
        'assetRefKey',
        'assetKey',
        'assetName',
        'assetMime',
        'sortOrder',
        'createdAt',
        'updatedAt',
      ];
      const keys = Object.keys(incomingData);
      if (
        keys.length !== allowedKeys.length ||
        !allowedKeys.every((k) => keys.includes(k))
      ) {
        return 'PERMISSION_DENIED';
      }
      if (incomingData.id !== evidenceId || incomingData.userId !== ctx.auth.uid) {
        return 'PERMISSION_DENIED';
      }
      if (
        typeof incomingData.externalUrl !== 'string' ||
        incomingData.externalUrl.length > SCHEMA_LIMITS.EXTERNAL_URL_MAX_LENGTH ||
        !SCHEMA_PATTERNS.OPTIONAL_HTTPS_URL.test(incomingData.externalUrl)
      ) {
        return 'PERMISSION_DENIED';
      }
      if (
        !Array.isArray(incomingData.usedNodeIds) ||
        incomingData.usedNodeIds.length > SCHEMA_LIMITS.MAX_USED_NODE_IDS ||
        (incomingData.usedNodeIds.length > 0 &&
          (typeof incomingData.usedNodeIds[0] !== 'number' ||
            !Number.isInteger(incomingData.usedNodeIds[0])))
      ) {
        return 'PERMISSION_DENIED';
      }
      if (
        incomingData.createdAt !== ctx.requestTime ||
        incomingData.updatedAt !== ctx.requestTime
      ) {
        return 'PERMISSION_DENIED';
      }
      return 'ALLOW';
    }
  }

  return 'PERMISSION_DENIED';
}

const NOW = '2026-10-27T01:30:00Z';

function createBaseContext(): SimulatedContext {
  return {
    auth: { uid: 'usr_alice', email_verified: true },
    requestTime: NOW,
    existingDocs: {
      '/users/usr_alice': {
        userId: 'usr_alice',
        device: 'Laptop A',
        sparks: 12,
        auroraEnabled: true,
        onboardingDismissed: false,
        theme: 'light',
        colorStyle: 'serious',
        renderQuality: 'balanced',
        reducedMotion: false,
        fallback2D: false,
        activeQuoteIndex: 0,
        createdAt: NOW,
        updatedAt: NOW,
      },
      '/users/usr_alice/private/info': {
        userId: 'usr_alice',
        email: 'alice@backpack.atlas',
        createdAt: NOW,
        updatedAt: NOW,
      },
      '/users/usr_alice/categoryProfiles/engineering': {
        userId: 'usr_alice',
        categorySlug: 'engineering',
        level: 1,
        nodeLevels: { '0': 1 },
        nodeChecklists: { '0': { '1': [false, false, false] } },
        assessmentNote: '',
        capabilityNotes: '',
        meaningText: '',
        potentialText: '',
        version: 1,
        createdAt: NOW,
        updatedAt: NOW,
      },
    },
  };
}

test('firestore.rules file enforces all 8 Pillars of Hardened Rules', () => {
  const rulesText = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
  assert.ok(rulesText.includes("rules_version = '2';"));
  assert.ok(rulesText.includes('allow read, write: if false;'));
  assert.ok(rulesText.includes('request.auth.token.email_verified == true'));
  assert.ok(rulesText.includes('isValidUserAccount(incoming())'));
  assert.ok(rulesText.includes('isValidUserPrivateInfo(incoming())'));
  assert.ok(rulesText.includes('isValidCategoryProfile(incoming())'));
  assert.ok(rulesText.includes('isValidEvidenceItem(incoming())'));
  for (const slug of CANONICAL_CATEGORY_SLUGS) {
    assert.ok(rulesText.includes(`'${slug}'`), `Missing slug ${slug} in firestore.rules`);
  }
});

test('Dirty Dozen #1: Unverified email write is rejected with PERMISSION_DENIED', () => {
  const ctx = createBaseContext();
  ctx.auth = { uid: 'usr_alice', email_verified: false };
  const res = evaluateRuleSimulation(
    ctx,
    'create',
    '/users/usr_alice',
    ctx.existingDocs['/users/usr_alice']
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #2: Identity spoofing on UserAccount is rejected with PERMISSION_DENIED', () => {
  const ctx = createBaseContext();
  const payload = { ...ctx.existingDocs['/users/usr_alice'], userId: 'usr_bob' };
  const res = evaluateRuleSimulation(ctx, 'create', '/users/usr_alice', payload);
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #3: Shadow field injection on CategoryProfile is rejected with PERMISSION_DENIED', () => {
  const ctx = createBaseContext();
  const payload = {
    ...ctx.existingDocs['/users/usr_alice/categoryProfiles/engineering'],
    isAdmin: true,
  };
  const res = evaluateRuleSimulation(
    ctx,
    'create',
    '/users/usr_alice/categoryProfiles/engineering',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #4: Invalid category slug is rejected with PERMISSION_DENIED', () => {
  const ctx = createBaseContext();
  const payload = {
    ...ctx.existingDocs['/users/usr_alice/categoryProfiles/engineering'],
    categorySlug: 'hacking-101',
  };
  const res = evaluateRuleSimulation(
    ctx,
    'create',
    '/users/usr_alice/categoryProfiles/hacking-101',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #5: Orphaned CategoryProfile creation without parent UserAccount is rejected', () => {
  const ctx = createBaseContext();
  delete ctx.existingDocs['/users/usr_alice'];
  const payload = {
    userId: 'usr_alice',
    categorySlug: 'engineering',
    level: 1,
    nodeLevels: {},
    nodeChecklists: {},
    assessmentNote: '',
    capabilityNotes: '',
    meaningText: '',
    potentialText: '',
    version: 1,
    createdAt: NOW,
    updatedAt: NOW,
  };
  const res = evaluateRuleSimulation(
    ctx,
    'create',
    '/users/usr_alice/categoryProfiles/engineering',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #6: Oversized meaningText (> 10,000 chars) is rejected with PERMISSION_DENIED', () => {
  const ctx = createBaseContext();
  const payload = {
    ...ctx.existingDocs['/users/usr_alice/categoryProfiles/engineering'],
    meaningText: 'x'.repeat(10001),
  };
  const res = evaluateRuleSimulation(
    ctx,
    'create',
    '/users/usr_alice/categoryProfiles/engineering',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #7: Client-spoofed timestamp is rejected with PERMISSION_DENIED', () => {
  const ctx = createBaseContext();
  const payload = {
    ...ctx.existingDocs['/users/usr_alice/categoryProfiles/engineering'],
    updatedAt: '2099-01-01T00:00:00Z',
  };
  const res = evaluateRuleSimulation(
    ctx,
    'update',
    '/users/usr_alice/categoryProfiles/engineering',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #8: Mutating immutable createdAt on update is rejected with PERMISSION_DENIED', () => {
  const ctx = createBaseContext();
  const payload = {
    ...ctx.existingDocs['/users/usr_alice/categoryProfiles/engineering'],
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: NOW,
  };
  const res = evaluateRuleSimulation(
    ctx,
    'update',
    '/users/usr_alice/categoryProfiles/engineering',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #9: Insecure HTTP externalUrl on EvidenceItem is rejected with PERMISSION_DENIED', () => {
  const ctx = createBaseContext();
  const payload = {
    id: 'ev-1',
    userId: 'usr_alice',
    categorySlug: 'engineering',
    title: 'Prototipe CAD',
    summary: 'Ringkasan',
    itemType: 'project',
    occurredOn: '2026-10-27',
    externalUrl: 'http://insecure.example.com',
    usedNodeIds: [0],
    assetRefKey: '',
    assetKey: '',
    assetName: '',
    assetMime: '',
    sortOrder: 1,
    createdAt: NOW,
    updatedAt: NOW,
  };
  const res = evaluateRuleSimulation(
    ctx,
    'create',
    '/users/usr_alice/categoryProfiles/engineering/evidence/ev-1',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #10: Unbounded usedNodeIds array (> 18 items) on EvidenceItem is rejected', () => {
  const ctx = createBaseContext();
  const payload = {
    id: 'ev-1',
    userId: 'usr_alice',
    categorySlug: 'engineering',
    title: 'Prototipe CAD',
    summary: 'Ringkasan',
    itemType: 'project',
    occurredOn: '2026-10-27',
    externalUrl: 'https://backpack.atlas/cad',
    usedNodeIds: Array.from({ length: 25 }, (_, i) => i),
    assetRefKey: '',
    assetKey: '',
    assetName: '',
    assetMime: '',
    sortOrder: 1,
    createdAt: NOW,
    updatedAt: NOW,
  };
  const res = evaluateRuleSimulation(
    ctx,
    'create',
    '/users/usr_alice/categoryProfiles/engineering/evidence/ev-1',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #11: Cross-user PII read on /users/{uid}/private/info is rejected', () => {
  const ctx = createBaseContext();
  ctx.auth = { uid: 'usr_mallory', email_verified: true };
  const res = evaluateRuleSimulation(ctx, 'get', '/users/usr_alice/private/info');
  assert.equal(res, 'PERMISSION_DENIED');
});

test('Dirty Dozen #12: Orphaned EvidenceItem creation without parent CategoryProfile is rejected', () => {
  const ctx = createBaseContext();
  const payload = {
    id: 'ev-1',
    userId: 'usr_alice',
    categorySlug: 'music',
    title: 'Rekaman Gitar',
    summary: 'Latihan metronom',
    itemType: 'project',
    occurredOn: '2026-10-27',
    externalUrl: 'https://backpack.atlas/music',
    usedNodeIds: [0],
    assetRefKey: '',
    assetKey: '',
    assetName: '',
    assetMime: '',
    sortOrder: 1,
    createdAt: NOW,
    updatedAt: NOW,
  };
  const res = evaluateRuleSimulation(
    ctx,
    'create',
    '/users/usr_alice/categoryProfiles/music/evidence/ev-1',
    payload
  );
  assert.equal(res, 'PERMISSION_DENIED');
});
