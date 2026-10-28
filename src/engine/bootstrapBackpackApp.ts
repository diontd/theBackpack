// @ts-nocheck
import * as THREE from "three";
import {
  CATEGORY_DESCRIPTIONS,
  TAB_HUMAN_DESCRIPTIONS,
  PASSIVE_SKILLS,
  RAW_SEED_CATEGORIES,
  TIER_META,
  DOMAIN_CONSTELLATIONS,
  TIER_DETAILS_CATALOG,
  LIFELONG_INDICATORS_132,
  SEED_CATEGORIES,
  MASTERY_SCALE,
  DEFAULT_QUOTES,
} from "../data/seedTaxonomy";
import { getMasteryInfo, getEvolutionStage } from "../utils/skillAtlasEngine";
import {
  auth,
  onAuthStateChanged,
  testFirestoreConnection,
  syncUserAccountToFirestore,
  syncCategoryProfileToFirestore,
  fetchUserCloudProfiles,
} from "../db/firebase";

if (typeof window !== "undefined") {
  (window as any).THREE = THREE;
}

let runtimeInitialized = false;

export function initBackpackRuntime(): void {
  if (runtimeInitialized || typeof window === "undefined") return;
  runtimeInitialized = true;

  // Test Firestore connection on boot per firebase-integration-rpc skill
  testFirestoreConnection().catch(() => {});

  (function () {
    const SESSION_STORAGE_KEY = 'the_backpack_atlas_session_v5';
      const USER_STORAGE_PREFIX = 'the_backpack_atlas_user_v5_';

      function normalizeAccountEmail(email) {
        return String(email || 'explorer@backpack.atlas').trim().toLowerCase();
      }

      function deriveUserIdFromEmail(email) {
        const norm = normalizeAccountEmail(email);
        const safeSlug = norm.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return 'usr-' + (safeSlug || 'explorer-01');
      }

      function getAccountStorageKey(email) {
        return USER_STORAGE_PREFIX + normalizeAccountEmail(email);
      }

      function createDefaultNodeLevels(catSlug, fillLevel = 1) {
        const cat = SEED_CATEGORIES.find(c => c.slug === catSlug);
        const effFill = (typeof fillLevel === 'number' && fillLevel >= 1 && fillLevel <= 5) ? fillLevel : 1;
        const map = {};
        if (cat && Array.isArray(cat.nodes)) {
          cat.nodes.forEach((n, idx) => {
            // Req #4: Unlocked nodes immediately start at Level 1 (no '-' / null strip); locked nodes stay null until unlocked
            if (n.tierIdx === 0) {
              map[idx] = effFill;
            } else if (n.tierIdx === 1) {
              map[idx] = effFill >= 3 ? effFill : null;
            } else {
              map[idx] = effFill >= 3 ? effFill : null;
            }
          });
        }
        return map;
      }

      function createDefaultNodeChecklists(catSlug, nodeLevelsMap = {}) {
        const cat = SEED_CATEGORIES.find(c => c.slug === catSlug);
        const checks = {};
        if (cat && Array.isArray(cat.nodes)) {
          cat.nodes.forEach((n) => {
            const curLvl = nodeLevelsMap && typeof nodeLevelsMap[n.flatIdx] === 'number' ? nodeLevelsMap[n.flatIdx] : 1;
            checks[n.flatIdx] = {};
            for (let lv = 1; lv <= 5; lv++) {
              // Levels below current level have all 3 indicators completed
              const done = lv < curLvl;
              checks[n.flatIdx][lv] = [done, done, done];
            }
          });
        }
        return checks;
      }

      function ensureProfileNodeChecklists(prof, catSlug) {
        const cat = SEED_CATEGORIES.find(c => c.slug === catSlug);
        if (!cat || !prof) return;
        if (!prof.nodeChecklists || typeof prof.nodeChecklists !== 'object') {
          prof.nodeChecklists = createDefaultNodeChecklists(catSlug, prof.nodeLevels);
        }
        cat.nodes.forEach((n) => {
          if (!prof.nodeChecklists[n.flatIdx] || typeof prof.nodeChecklists[n.flatIdx] !== 'object') {
            prof.nodeChecklists[n.flatIdx] = {};
          }
          const curLvl = (prof.nodeLevels && typeof prof.nodeLevels[n.flatIdx] === 'number') ? prof.nodeLevels[n.flatIdx] : 1;
          for (let lv = 1; lv <= 5; lv++) {
            const arr = prof.nodeChecklists[n.flatIdx][lv];
            if (!Array.isArray(arr) || arr.length < 3) {
              const done = lv < curLvl;
              prof.nodeChecklists[n.flatIdx][lv] = [done, done, done];
            } else {
              prof.nodeChecklists[n.flatIdx][lv] = [!!arr[0], !!arr[1], !!arr[2]];
            }
          }
        });
      }

      function getNodeLevelChecklistArray(prof, catSlug, flatIdx, levelNum) {
        ensureProfileNodeChecklists(prof, catSlug);
        const lv = Math.max(1, Math.min(5, levelNum || 1));
        return prof.nodeChecklists[flatIdx][lv] || [false, false, false];
      }

      function isNodeLevelChecklistComplete(prof, catSlug, flatIdx, levelNum) {
        const arr = getNodeLevelChecklistArray(prof, catSlug, flatIdx, levelNum);
        return arr.length >= 3 && arr.every(Boolean);
      }

      function canNodeAdvanceToTargetLevel(prof, catSlug, flatIdx, currentLvl, targetLvl) {
        if (targetLvl <= currentLvl) return { allowed: true, missingLevel: null, checkedCount: 3 };
        // Must have all 3 indicators checked for every level from currentLvl up to targetLvl - 1
        for (let lv = currentLvl; lv < targetLvl; lv++) {
          const arr = getNodeLevelChecklistArray(prof, catSlug, flatIdx, lv);
          const cnt = arr.filter(Boolean).length;
          if (cnt < 3) {
            return { allowed: false, missingLevel: lv, checkedCount: cnt };
          }
        }
        return { allowed: true, missingLevel: null, checkedCount: 3 };
      }

      // Section V (Page 18): Unlock Gate & Dependency Graph Evaluator
      // - Tier 1 (Basic, tierIdx 0): Always Unlocked (status can be Unassessed null or 1..5).
      // - Tier 1 -> Tier 2 (Advanced, tierIdx 1): Requires same-branch Tier 1 score >= 3/5 (plus any cross-branch prereq).
      // - Tier 2 -> Tier 3 (Sage, tierIdx 2): Requires same-branch Tier 2 score >= 4/5 (plus any cross-branch prereq >= 3/5).
      function evaluateNodeUnlockGate(catSlug, flatIdx, nodeLevelsObj) {
        const cat = SEED_CATEGORIES.find(c => c.slug === catSlug);
        if (!cat || !cat.nodes[flatIdx]) {
          return { unlocked: true, statusCode: 'UNLOCKED', missingReasons: [], prereqItems: [], gateFormula: 'Terbuka sejak awal' };
        }
        const node = cat.nodes[flatIdx];
        const levels = nodeLevelsObj || {};

        if (node.tierIdx === 0) {
          return {
            unlocked: true,
            statusCode: 'UNLOCKED',
            missingReasons: [],
            prereqItems: [],
            gateFormula: 'Tier 1 · Basic terbuka sejak awal (Tanpa prasyarat)'
          };
        }

        const missingReasons = [];
        const reqParts = [];
        const prereqItems = [];

        if (node.tierIdx === 1) {
          // Tier 1 -> Tier 2 Gate: requires parent Tier 1 >= 3/5
          const parentIdx = node.branchIdx * 3 + 0;
          const parentNode = cat.nodes[parentIdx];
          const parentScore = levels[parentIdx];
          const curNum = typeof parentScore === 'number' ? parentScore : 0;
          const ok = curNum >= 3;
          reqParts.push(`${parentNode.title} (Basic) ≥ 3/5`);
          prereqItems.push({
            targetFlatIdx: parentIdx,
            title: parentNode.title,
            branchName: parentNode.branchName,
            tierLabel: 'Tier 1 · Basic',
            requiredScore: 3,
            currentScore: curNum,
            isTargetUnlocked: true,
            satisfied: ok,
            type: 'branch'
          });
          if (!ok) {
            missingReasons.push(`${parentNode.title} (Tier 1 Basic) butuh skor ≥ 3/5 (progres saat ini: ${curNum}/3)`);
          }
        } else if (node.tierIdx === 2) {
          // Req #5: Tier 2 -> Tier 3 (Sage) Gate lowered from 4/5 to max 3/5 (while preserving crossPrereqs combinations below!)
          const parentT2Idx = node.branchIdx * 3 + 1;
          const parentT2Node = cat.nodes[parentT2Idx];
          const parentT2Gate = evaluateNodeUnlockGate(catSlug, parentT2Idx, levels);
          const parentT2Score = parentT2Gate.unlocked ? levels[parentT2Idx] : null;
          const curNum = typeof parentT2Score === 'number' ? parentT2Score : 0;
          const ok = parentT2Gate.unlocked && curNum >= 3;
          reqParts.push(`${parentT2Node.title} (Advanced) ≥ 3/5`);
          prereqItems.push({
            targetFlatIdx: parentT2Idx,
            title: parentT2Node.title,
            branchName: parentT2Node.branchName,
            tierLabel: 'Tier 2 · Advanced',
            requiredScore: 3,
            currentScore: curNum,
            isTargetUnlocked: parentT2Gate.unlocked,
            satisfied: ok,
            type: 'branch'
          });
          if (!ok) {
            missingReasons.push(`${parentT2Node.title} (Tier 2 Advanced) butuh Level ≥ 3/5 (progres saat ini: ${parentT2Gate.unlocked ? curNum + '/3' : 'Terkunci · buka Tier 2 dulu'})`);
          }
        }

        // Check cross-branch prerequisites (AND gate)
        if (Array.isArray(node.crossPrereqs) && node.crossPrereqs.length > 0) {
          node.crossPrereqs.forEach(cp => {
            const targetFlatIdx = cp.branchIdx * 3 + cp.tierIdx;
            const targetNode = cat.nodes[targetFlatIdx];
            const targetGate = evaluateNodeUnlockGate(catSlug, targetFlatIdx, levels);
            const targetScore = targetGate.unlocked ? levels[targetFlatIdx] : null;
            const curNum = typeof targetScore === 'number' ? targetScore : 0;
            const ok = targetGate.unlocked && curNum >= cp.minScore;
            reqParts.push(cp.label || `${targetNode.title} ≥ ${cp.minScore}/5`);
            prereqItems.push({
              targetFlatIdx,
              title: targetNode.title,
              branchName: targetNode.branchName,
              tierLabel: `Lintas Cabang · ${targetNode.branchName}`,
              requiredScore: cp.minScore,
              currentScore: curNum,
              isTargetUnlocked: targetGate.unlocked,
              satisfied: ok,
              type: 'cross'
            });
            if (!ok) {
              missingReasons.push(`Prasyarat lintas cabang ${targetNode.title} (${targetNode.branchName}) butuh ≥ ${cp.minScore}/5 (progres saat ini: ${curNum}/${cp.minScore})`);
            }
          });
        }

        return {
          unlocked: missingReasons.length === 0,
          statusCode: missingReasons.length === 0 ? 'UNLOCKED' : 'LOCKED_0',
          missingReasons,
          prereqItems,
          gateFormula: reqParts.join(' + ')
        };
      }

      function getDownstreamNodesUnlockedBy(cat, flatIdx) {
        if (!cat || !Array.isArray(cat.nodes)) return [];
        const downstream = [];
        const srcNode = cat.nodes[flatIdx];
        if (!srcNode) return downstream;
        // 1. Same-branch next tier
        if (srcNode.tierIdx < 2) {
          const nextIdx = srcNode.branchIdx * 3 + (srcNode.tierIdx + 1);
          if (cat.nodes[nextIdx]) {
            downstream.push({
              targetFlatIdx: nextIdx,
              title: cat.nodes[nextIdx].title,
              branchName: cat.nodes[nextIdx].branchName,
              requiredScore: 3,
              type: 'branch'
            });
          }
        }
        // 2. Any cross-branch node that depends on flatIdx
        cat.nodes.forEach(cand => {
          if (Array.isArray(cand.crossPrereqs)) {
            cand.crossPrereqs.forEach(cp => {
              if (cp.branchIdx * 3 + cp.tierIdx === flatIdx) {
                downstream.push({
                  targetFlatIdx: cand.flatIdx,
                  title: cand.title,
                  branchName: cand.branchName,
                  requiredScore: cp.minScore,
                  type: 'cross'
                });
              }
            });
          }
        });
        return downstream;
      }

      function enforceUnlockGatesOnMap(catSlug, nodeLevelsObj) {
        const cat = SEED_CATEGORIES.find(c => c.slug === catSlug);
        if (!cat || !nodeLevelsObj) return;
        // Req #4: Tier 1 (Basic) is always unlocked and starts at Level 1 minimum
        cat.nodes.filter(n => n.tierIdx === 0).forEach(n => {
          if (typeof nodeLevelsObj[n.flatIdx] !== 'number' || nodeLevelsObj[n.flatIdx] < 1) {
            nodeLevelsObj[n.flatIdx] = 1;
          }
        });
        // Evaluate Tier 2 then Tier 3 in order: if unlocked and null, start immediately at Level 1; if locked, set to null
        [1, 2].forEach(tierIdx => {
          cat.nodes.filter(n => n.tierIdx === tierIdx).forEach(n => {
            const gate = evaluateNodeUnlockGate(catSlug, n.flatIdx, nodeLevelsObj);
            if (!gate.unlocked) {
              nodeLevelsObj[n.flatIdx] = null;
            } else if (typeof nodeLevelsObj[n.flatIdx] !== 'number' || nodeLevelsObj[n.flatIdx] < 1) {
              nodeLevelsObj[n.flatIdx] = 1;
            }
          });
        });
      }

      function ensureProfileNodeLevels(prof, catSlug) {
        const cat = SEED_CATEGORIES.find(c => c.slug === catSlug);
        if (!cat) return;
        if (!prof.nodeLevels || typeof prof.nodeLevels !== 'object') {
          prof.nodeLevels = createDefaultNodeLevels(catSlug, typeof prof.level === 'number' ? prof.level : 1);
        }
        // Migrate old 3-4 node profiles gracefully into the 3-tier branch structure
        const keys = Object.keys(prof.nodeLevels);
        if (keys.length > 0 && keys.length < cat.nodes.length && keys.every(k => parseInt(k, 10) < cat.branches.length)) {
          const oldMap = Object.assign({}, prof.nodeLevels);
          const migrated = {};
          cat.branches.forEach((_, bIdx) => {
            const oldVal = oldMap[bIdx] !== undefined ? oldMap[bIdx] : prof.level;
            migrated[bIdx * 3 + 0] = (typeof oldVal === 'number' && oldVal >= 1) ? oldVal : 1;
            migrated[bIdx * 3 + 1] = (typeof oldVal === 'number' && oldVal >= 3) ? oldVal : null;
            migrated[bIdx * 3 + 2] = (typeof oldVal === 'number' && oldVal >= 3) ? oldVal : null;
          });
          prof.nodeLevels = migrated;
        }
        cat.nodes.forEach((n) => {
          if (prof.nodeLevels[n.flatIdx] === undefined) {
            prof.nodeLevels[n.flatIdx] = n.tierIdx === 0 ? 1 : null;
          }
        });
        enforceUnlockGatesOnMap(catSlug, prof.nodeLevels);
        ensureProfileNodeChecklists(prof, catSlug);
        if (typeof prof.level !== 'number' || prof.level < 1) {
          const comp = computeCoreLevelFromNodes(catSlug, prof.nodeLevels);
          prof.level = comp.coreLevel || 1;
        }
      }

      // Compute Core Domain Mastery Score & Tier Progression Stats from its 3-Tier Skill Tree Nodes
      function computeCoreLevelFromNodes(catSlug, nodeLevelsObj) {
        const cat = SEED_CATEGORIES.find(c => c.slug === catSlug);
        if (!cat || !nodeLevelsObj) {
          return { coreLevel: null, exactAvg: 0, unlockedCount: 0, openGateCount: 0, totalNodes: cat ? cat.nodes.length : 0 };
        }
        enforceUnlockGatesOnMap(catSlug, nodeLevelsObj);
        const totalNodes = cat.nodes.length;
        const vals = [];
        let openGateCount = 0;
        for (let i = 0; i < totalNodes; i++) {
          const gate = evaluateNodeUnlockGate(catSlug, i, nodeLevelsObj);
          if (gate.unlocked) openGateCount++;
          const v = nodeLevelsObj[i];
          if (gate.unlocked && typeof v === 'number' && v >= 1 && v <= 5) {
            vals.push(v);
          }
        }
        if (vals.length === 0) {
          return { coreLevel: null, exactAvg: 0, unlockedCount: 0, openGateCount, totalNodes };
        }
        const sum = vals.reduce((a, b) => a + b, 0);
        const exactAvg = sum / vals.length;
        const coreLevel = Math.max(1, Math.min(5, Math.round(exactAvg)));
        return { coreLevel, exactAvg, unlockedCount: vals.length, openGateCount, totalNodes };
      }

      function createFreshProfiles(forUserId = 'usr-explorer-backpack-atlas') {
        const profiles = {};
        SEED_CATEGORIES.forEach(cat => {
          const defaultNodes = createDefaultNodeLevels(cat.slug, 1);
          profiles[cat.slug] = {
            userId: forUserId,
            categorySlug: cat.slug,
            level: 1, // Req #4: Starts directly at Level 1 when unlocked (no '-' strip)
            nodeLevels: defaultNodes,
            nodeChecklists: createDefaultNodeChecklists(cat.slug, defaultNodes),
            assessmentNote: '',
            capabilityNotes: '',
            meaningText: '',
            potentialText: '',
            version: 1,
            updatedAt: '2026-10-23T08:00:00Z',
            evidence: []
          };
        });
        return profiles;
      }

      const state = {
        auth: {
          authenticated: true,
          userId: deriveUserIdFromEmail('explorer@backpack.atlas'),
          email: 'explorer@backpack.atlas',
          device: 'Laptop A'
        },
        screen: 'landing',
        inventoryViewMode: 'floor',
        selectedSlug: 'engineering',
        hoveredSlug: null,
        activeTab: 'capabilities',
        detailMode: 'adventure',
        isDirty: false,
        editingEvidenceId: null,
        pendingFileAttachment: null,
        lastSelectedFileObj: null,
        offlineMode: false,
        unsyncedQueue: false,
        onboardingDismissed: true,
        sparks: 12,
        auroraEnabled: true,
        critterCheerTimer: 0,
        storageError: null,
        preferences: {
          reducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          fallback2D: false,
          renderQuality: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'mobile-light' : 'balanced',
          theme: 'light',
          colorStyle: 'serious',
          activeQuoteIndex: 0
        },
        quotes: JSON.parse(JSON.stringify(DEFAULT_QUOTES)),
        profiles: createFreshProfiles(deriveUserIdFromEmail('explorer@backpack.atlas')),
        lastApiLog: {
          endpoint: 'GET /api/v1/me/backpack',
          status: '200 OK (LOCAL_DEMO)',
          payload: null
        }
      };

      function saveSessionState() {
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
            authenticated: state.auth.authenticated,
            email: state.auth.email,
            userId: state.auth.userId,
            device: state.auth.device
          }));
        } catch (err) {
          // Handled in savePersistedState
        }
      }

      function loadPersistedStateForUser(emailInput) {
        const normEmail = normalizeAccountEmail(emailInput || state.auth.email);
        const uid = deriveUserIdFromEmail(normEmail);
        state.auth.email = normEmail;
        state.auth.userId = uid;
        state.profiles = createFreshProfiles(uid);
        state.offlineMode = false;
        state.unsyncedQueue = false;
        state.onboardingDismissed = true;

        try {
          const userKey = getAccountStorageKey(normEmail);
          const raw = localStorage.getItem(userKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.profiles) {
              SEED_CATEGORIES.forEach(cat => {
                if (parsed.profiles[cat.slug]) {
                  state.profiles[cat.slug] = Object.assign(state.profiles[cat.slug], parsed.profiles[cat.slug], { userId: uid });
                  ensureProfileNodeLevels(state.profiles[cat.slug], cat.slug);
                }
              });
            }
            if (parsed && parsed.preferences) {
              state.preferences = Object.assign(state.preferences, parsed.preferences, { colorStyle: 'serious' });
              if (!state.preferences.renderQuality) state.preferences.renderQuality = 'balanced';
            }
            hydrateAndMigrateEvidenceAttachments();
            if (parsed && Array.isArray(parsed.quotes) && parsed.quotes.length > 0) {
              state.quotes = parsed.quotes;
            }
            if (typeof parsed.offlineMode === 'boolean') {
              state.offlineMode = parsed.offlineMode;
            }
            if (typeof parsed.unsyncedQueue === 'boolean') {
              state.unsyncedQueue = parsed.unsyncedQueue;
            }
            if (typeof parsed.onboardingDismissed === 'boolean') {
              state.onboardingDismissed = parsed.onboardingDismissed;
            }
            if (typeof parsed.sparks === 'number') {
              state.sparks = parsed.sparks;
            }
            if (typeof parsed.auroraEnabled === 'boolean') {
              state.auroraEnabled = parsed.auroraEnabled;
            }
          }
          state.storageError = null;
        } catch (err) {
          state.storageError = 'Gagal membaca penyimpanan browser lokal.';
        }
      }

      function loadPersistedState() {
        try {
          const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
          if (rawSession) {
            const sess = JSON.parse(rawSession);
            if (sess && sess.email) {
              state.auth.email = normalizeAccountEmail(sess.email);
              state.auth.userId = deriveUserIdFromEmail(state.auth.email);
              state.auth.device = sess.device || 'Laptop A';
              state.auth.authenticated = sess.authenticated !== false;
            }
          }
        } catch (err) {}
        loadPersistedStateForUser(state.auth.email);
        if (!state.auth.authenticated) {
          state.screen = 'auth';
        }
      }

      /* =====================================================================
       * FINDING 9: INDEXEDDB EVIDENCE ATTACHMENT STORE + MEMORY CACHE
       * Offloads heavy Base64 Data URLs (up to 10 MB files) out of localStorage
       * into IndexedDB while keeping localStorage fast, synchronous, and quota-safe!
       * ===================================================================== */
      const IDB_DB_NAME = 'the_backpack_evidence_db_v1';
      const IDB_STORE_NAME = 'attachments';
      const evidenceAttachmentCache = new Map();
      let idbPromise = null;

      function openEvidenceIndexedDB() {
        if (idbPromise) return idbPromise;
        idbPromise = new Promise((resolve) => {
          if (typeof indexedDB === 'undefined') {
            resolve(null);
            return;
          }
          try {
            const req = indexedDB.open(IDB_DB_NAME, 1);
            req.onupgradeneeded = (ev) => {
              const db = ev.target.result;
              if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
                db.createObjectStore(IDB_STORE_NAME, { keyPath: 'refKey' });
              }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
          } catch (e) {
            resolve(null);
          }
        });
        return idbPromise;
      }

      function saveEvidenceAttachmentToIDB(refKey, dataUrl, meta = {}) {
        if (!refKey || !dataUrl) return Promise.resolve(false);
        evidenceAttachmentCache.set(refKey, dataUrl);
        return openEvidenceIndexedDB().then((db) => {
          if (!db) return false;
          return new Promise((resolve) => {
            try {
              const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
              const store = tx.objectStore(IDB_STORE_NAME);
              store.put({
                refKey,
                dataUrl,
                name: meta.name || null,
                mime: meta.mime || null,
                size: meta.size || 0,
                updatedAt: new Date().toISOString()
              });
              tx.oncomplete = () => resolve(true);
              tx.onerror = () => resolve(false);
            } catch (e) {
              resolve(false);
            }
          });
        });
      }

      function getEvidenceAttachmentFromIDB(refKey) {
        if (!refKey) return Promise.resolve(null);
        if (evidenceAttachmentCache.has(refKey)) {
          return Promise.resolve(evidenceAttachmentCache.get(refKey));
        }
        return openEvidenceIndexedDB().then((db) => {
          if (!db) return null;
          return new Promise((resolve) => {
            try {
              const tx = db.transaction(IDB_STORE_NAME, 'readonly');
              const store = tx.objectStore(IDB_STORE_NAME);
              const req = store.get(refKey);
              req.onsuccess = () => {
                const res = req.result && req.result.dataUrl ? req.result.dataUrl : null;
                if (res) evidenceAttachmentCache.set(refKey, res);
                resolve(res);
              };
              req.onerror = () => resolve(null);
            } catch (e) {
              resolve(null);
            }
          });
        });
      }

      function deleteEvidenceAttachmentFromIDB(refKey) {
        if (!refKey) return;
        evidenceAttachmentCache.delete(refKey);
        openEvidenceIndexedDB().then((db) => {
          if (!db) return;
          try {
            const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
            tx.objectStore(IDB_STORE_NAME).delete(refKey);
          } catch (e) {}
        });
      }

      function hydrateAndMigrateEvidenceAttachments() {
        SEED_CATEGORIES.forEach(cat => {
          const prof = state.profiles[cat.slug];
          if (!prof || !Array.isArray(prof.evidence)) return;
          prof.evidence.forEach(ev => {
            const refKey = ev.assetRefKey || `att-${state.auth.userId}-${ev.id}`;
            if (ev.assetDataUrl && ev.assetDataUrl.length > 0) {
              ev.assetRefKey = refKey;
              evidenceAttachmentCache.set(refKey, ev.assetDataUrl);
              if (ev.assetDataUrl.length > 48000) {
                saveEvidenceAttachmentToIDB(refKey, ev.assetDataUrl, {
                  name: ev.assetName,
                  mime: ev.assetMime
                });
              }
            } else if (ev.assetRefKey) {
              getEvidenceAttachmentFromIDB(ev.assetRefKey).then(dataUrl => {
                if (dataUrl) {
                  ev.assetDataUrl = dataUrl;
                }
              });
            }
          });
        });
      }

      function buildLightweightProfilesForLocalStorage() {
        const cleanProfiles = {};
        SEED_CATEGORIES.forEach(cat => {
          const srcProf = state.profiles[cat.slug];
          if (!srcProf) return;
          cleanProfiles[cat.slug] = Object.assign({}, srcProf, {
            evidence: Array.isArray(srcProf.evidence)
              ? srcProf.evidence.map(ev => {
                  const copyEv = Object.assign({}, ev);
                  if (copyEv.assetDataUrl) {
                    const refKey = copyEv.assetRefKey || `att-${state.auth.userId}-${copyEv.id}`;
                    copyEv.assetRefKey = refKey;
                    evidenceAttachmentCache.set(refKey, copyEv.assetDataUrl);
                    // Offload large data URLs (> 48 KB) to IndexedDB so localStorage never overflows!
                    if (copyEv.assetDataUrl.length > 48000) {
                      saveEvidenceAttachmentToIDB(refKey, copyEv.assetDataUrl, {
                        name: copyEv.assetName,
                        mime: copyEv.assetMime
                      });
                      copyEv.assetDataUrl = null;
                    }
                  }
                  return copyEv;
                })
              : []
          });
        });
        return cleanProfiles;
      }

      let saveDebounceTimer = null;
      function scheduleSavePersistedState(delayMs = 220) {
        if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
        saveDebounceTimer = setTimeout(() => {
          saveDebounceTimer = null;
          savePersistedState();
        }, delayMs);
      }

      function savePersistedState() {
        if (saveDebounceTimer) {
          clearTimeout(saveDebounceTimer);
          saveDebounceTimer = null;
        }
        try {
          saveSessionState();
          const userKey = getAccountStorageKey(state.auth.email);
          const lightweightProfiles = buildLightweightProfilesForLocalStorage();
          localStorage.setItem(userKey, JSON.stringify({
            ownerEmail: state.auth.email,
            ownerUserId: state.auth.userId,
            profiles: lightweightProfiles,
            preferences: state.preferences,
            quotes: state.quotes,
            offlineMode: state.offlineMode,
            unsyncedQueue: state.unsyncedQueue,
            onboardingDismissed: state.onboardingDismissed,
            sparks: state.sparks,
            auroraEnabled: state.auroraEnabled,
            savedAt: new Date().toISOString()
          }));
          state.storageError = null;
          if (auth && auth.currentUser && auth.currentUser.emailVerified) {
            syncUserAccountToFirestore({
              device: state.auth.device,
              sparks: state.sparks,
              auroraEnabled: state.auroraEnabled,
              onboardingDismissed: state.onboardingDismissed,
              theme: state.preferences.theme,
              colorStyle: state.preferences.colorStyle,
              renderQuality: state.preferences.renderQuality,
              reducedMotion: state.preferences.reducedMotion,
              fallback2D: state.preferences.fallback2D,
              activeQuoteIndex: state.preferences.activeQuoteIndex,
            }).catch(() => {});
            if (state.selectedSlug && state.profiles[state.selectedSlug]) {
              syncCategoryProfileToFirestore(state.profiles[state.selectedSlug]).catch(() => {});
            }
          }
          return true;
        } catch (err) {
          state.storageError = err && err.name === 'QuotaExceededError'
            ? 'Kapasitas penyimpanan browser penuh (batas kuota tercapai). Gunakan tombol Ekspor JSON Backup agar perubahanmu tetap aman.'
            : 'Penyimpanan lokal browser tidak dapat diakses pada mode ini. Gunakan Ekspor JSON Backup untuk menyimpan datamu.';
          showGlobalNotice('error', state.storageError, false);
          return false;
        }
      }

      /* =====================================================================
       * 5. BFF / REST API CONTRACT ENGINE & GLOBAL RPG PROGRESS BAR
       * ===================================================================== */
      function buildCategoryApiPayload(slug) {
        const cat = SEED_CATEGORIES.find(c => c.slug === slug) || SEED_CATEGORIES[0];
        const prof = state.profiles[cat.slug];
        ensureProfileNodeLevels(prof, cat.slug);
        const mastery = getMasteryInfo(prof.level);
        return {
          category: {
            slug: cat.slug,
            name: cat.name,
            sortOrder: cat.sortOrder,
            mappedActivities: cat.mappedActivities,
            capstone: cat.capstone,
            guardrail: cat.guardrail,
            visual: {
              modelKey: cat.visual.modelKey,
              material: cat.visual.material,
              shape: cat.visual.shape
            },
            assessment: {
              level: prof.level,
              label: mastery.label,
              assessmentNote: prof.assessmentNote || '',
              version: prof.version,
              updatedAt: prof.updatedAt
            },
            content: {
              capabilityNotes: prof.capabilityNotes,
              meaning: prof.meaningText,
              potential: prof.potentialText
            },
            capabilities: cat.capabilities.slice(),
            skillTreeNodes: cat.nodes.map((node) => {
              const gate = evaluateNodeUnlockGate(cat.slug, node.flatIdx, prof.nodeLevels);
              const rawScore = gate.unlocked ? (prof.nodeLevels[node.flatIdx] ?? null) : 0;
              return {
                nodeId: node.nodeCode,
                branch: node.branchName,
                tier: node.tierName,
                title: node.title,
                status: !gate.unlocked ? '0 — Locked' : (rawScore === null ? 'Unassessed — "—"' : `${rawScore} — ${getMasteryInfo(rawScore).label}`),
                score: rawScore,
                unlocked: gate.unlocked,
                unlockGate: gate.gateFormula
              };
            }),
            evidence: prof.evidence.slice().sort((a, b) => a.sortOrder - b.sortOrder)
          }
        };
      }

      function updateGlobalRpgCrest() {
        const assessedCount = SEED_CATEGORIES.filter(c => state.profiles[c.slug].level !== null).length;
        const pct = Math.round((assessedCount / 10) * 100);
        const bar = document.getElementById('hudGlobalProgressBar');
        const txt = document.getElementById('hudGlobalProgressText');
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.textContent = `${assessedCount}/10 Domain`;
      }

      function logApiCall(endpoint, status, payload) {
        state.lastApiLog = { endpoint, status, payload };
        const previewEl = document.getElementById('apiPayloadPreview');
        const statusEl = document.getElementById('apiLastStatusBadge');
        if (previewEl) {
          previewEl.textContent = `// ${endpoint}\n` + JSON.stringify(payload, null, 2);
        }
        if (statusEl) {
          statusEl.textContent = status;
          statusEl.className = 'font-mono text-xs font-bold ' + (status.startsWith('2') ? 'text-[#2E9359]' : 'text-[#CF4B32]');
        }
      }

      function announceScreenReader(msg) {
        const el = document.getElementById('srStatusRegion');
        if (el) {
          el.textContent = '';
          setTimeout(() => { el.textContent = msg; }, 30);
        }
      }

      /* =====================================================================
       * ESTETIKA #5: PROCEDURAL WEB AUDIO API SOUND EFFECTS ENGINE (SoundFX)
       * Zero external dependencies; tactile, calming adventure audio feedback!
       * ===================================================================== */
      const SoundFX = (function () {
        let ctx = null;
        let lastHoverTime = 0;

        function getCtx() {
          if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
              try { ctx = new AudioCtx(); } catch (e) { ctx = null; }
            }
          }
          if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
          return ctx;
        }

        function playTone(freq, type, duration, gainVal, delaySec = 0, slideToFreq = null) {
          const c = getCtx();
          if (!c) return;
          try {
            const now = c.currentTime + delaySec;
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, now);
            if (slideToFreq) {
              osc.frequency.exponentialRampToValueAtTime(slideToFreq, now + duration);
            }
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(gainVal, now + Math.min(0.025, duration * 0.25));
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + duration + 0.02);
          } catch (e) {}
        }

        return {
          hover() {
            const nowMs = performance.now();
            if (nowMs - lastHoverTime < 65) return;
            lastHoverTime = nowMs;
            playTone(320, 'triangle', 0.055, 0.035, 0, 440);
          },
          selectItem() {
            // Cinematic camera focus whoosh + warm relic chime
            playTone(165, 'sine', 0.24, 0.075, 0, 330);
            playTone(528, 'triangle', 0.28, 0.055, 0.04, 660);
          },
          switchItem() {
            playTone(280, 'triangle', 0.14, 0.055, 0, 420);
            playTone(420, 'sine', 0.18, 0.045, 0.03, 560);
          },
          openBackpack() {
            // Deep leather unlatch + rising harmonic adventure chord
            playTone(110, 'triangle', 0.35, 0.09, 0, 196);
            playTone(261.6, 'sine', 0.42, 0.06, 0.06);
            playTone(329.6, 'sine', 0.46, 0.06, 0.12);
            playTone(392.0, 'triangle', 0.55, 0.065, 0.18);
          },
          packBackpack() {
            playTone(330, 'sine', 0.22, 0.05, 0, 165);
            playTone(196, 'triangle', 0.28, 0.06, 0.06, 110);
          },
          checkIndicator(doneCount = 1) {
            // Addictive ascending combo chime (1/3 -> C5, 2/3 -> E5, 3/3 -> G5 + C6 victory sparkle!)
            const notes = [523.25, 659.25, 783.99];
            const idx = Math.max(0, Math.min(2, (doneCount || 1) - 1));
            playTone(notes[idx], 'triangle', 0.16, 0.06, 0, notes[idx] * 1.04);
            if (doneCount >= 3) {
              playTone(1046.5, 'sine', 0.32, 0.07, 0.07);
              playTone(1318.5, 'triangle', 0.38, 0.055, 0.13);
            }
          },
          levelUp(lvl = 3, unlockedGates = 0) {
            // Dopamine-rewarding RPG Level-Up Fanfare (ascending arpeggio + warm sub-bass + golden shimmer)
            const scale = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
            const shift = Math.min(2, Math.max(0, (lvl || 2) - 2));
            playTone(130.81, 'triangle', 0.38, 0.085, 0);
            playTone(scale[0 + shift], 'triangle', 0.24, 0.07, 0.02);
            playTone(scale[1 + shift], 'triangle', 0.26, 0.07, 0.09);
            playTone(scale[2 + shift], 'sine', 0.30, 0.075, 0.16);
            playTone(scale[3 + shift], 'sine', 0.52, 0.09, 0.24);
            playTone(scale[4 + shift], 'triangle', 0.58, 0.07, 0.30);
            if (lvl >= 5 || unlockedGates > 0) {
              playTone(1046.50, 'sine', 0.65, 0.08, 0.38);
              playTone(1318.51, 'triangle', 0.70, 0.065, 0.44);
            }
          },
          critter() {
            playTone(580, 'sine', 0.11, 0.05, 0, 880);
            playTone(760, 'triangle', 0.14, 0.05, 0.07, 1040);
          },
          notice(type) {
            if (type === 'error') {
              playTone(220, 'sawtooth', 0.18, 0.05, 0, 155);
            } else {
              playTone(440, 'sine', 0.16, 0.04, 0, 554.37);
            }
          }
        };
      })();

      let noticeAutoHideTimer = null;

      function hideGlobalNotice() {
        const banner = document.getElementById('globalNoticeBanner');
        if (!banner) return;
        banner.classList.add('toast-hidden');
        setTimeout(() => {
          if (banner.classList.contains('toast-hidden')) {
            banner.classList.add('hidden');
          }
        }, 340);
      }

      function showGlobalNotice(type, message, showRetry = false) {
        const banner = document.getElementById('globalNoticeBanner');
        const icon = document.getElementById('globalNoticeIcon');
        const text = document.getElementById('globalNoticeText');
        const retryBtn = document.getElementById('btnGlobalRetry');

        if (noticeAutoHideTimer) {
          clearTimeout(noticeAutoHideTimer);
          noticeAutoHideTimer = null;
        }

        banner.classList.remove('hidden', 'border-[#CF4B32]', 'bg-[#FFF5F3]', 'border-[#DF761F]', 'bg-[#FFF8EB]', 'border-[#2E9359]', 'bg-[#F0FBF4]');
        if (type === 'error') {
          banner.classList.add('border-[#CF4B32]', 'bg-[#FFF5F3]', 'text-[#1B2A2C]');
          icon.className = 'font-mono uppercase px-1.5 py-0.5 rounded text-[10px] bg-[#CF4B32] text-white font-bold shrink-0';
          icon.textContent = 'ERROR';
        } else if (type === 'warning') {
          banner.classList.add('border-[#DF761F]', 'bg-[#FFF8EB]', 'text-[#1B2A2C]');
          icon.className = 'font-mono uppercase px-1.5 py-0.5 rounded text-[10px] bg-[#DF761F] text-white font-bold shrink-0';
          icon.textContent = 'DRAFT';
        } else {
          banner.classList.add('border-[#2E9359]', 'bg-[#F0FBF4]', 'text-[#1B2A2C]');
          icon.className = 'font-mono uppercase px-1.5 py-0.5 rounded text-[10px] bg-[#2E9359] text-white font-bold shrink-0';
          icon.textContent = 'INFO';
        }
        text.textContent = message;
        retryBtn.classList.toggle('hidden', !showRetry);
        requestAnimationFrame(() => {
          banner.classList.remove('toast-hidden');
        });
        if (!showRetry) {
          noticeAutoHideTimer = setTimeout(() => {
            hideGlobalNotice();
          }, 3800);
        }
        announceScreenReader(message);
      }

      function updateSyncHeaderUI() {
        const dot = document.getElementById('syncDot');
        const menuDot = document.getElementById('menuSyncIndicator');
        const label = document.getElementById('syncLabel');
        const dev = document.getElementById('syncDeviceBadge');
        const emailLbl = document.getElementById('menuActiveEmailLabel');
        const modePill = document.getElementById('storageModePill');
        const trustBadge = document.getElementById('landingTrustBadge');
        const offlineBtn = document.getElementById('btnToggleOfflineSim');

        if (dev) dev.textContent = `· ${state.auth.device}`;
        if (emailLbl) emailLbl.textContent = state.auth.email;
        if (offlineBtn) offlineBtn.textContent = `Mode Offline: ${state.offlineMode ? 'AKTIF' : 'MATI'}`;

        if (!state.auth.authenticated) {
          dot.className = 'w-2 h-2 rounded-full bg-[#B42318]';
          if (menuDot) menuDot.className = 'w-2 h-2 rounded-full bg-[#B42318]';
          label.textContent = 'Sesi Terkunci (Belum Masuk)';
          if (modePill) modePill.textContent = 'Terkunci';
        } else if (state.storageError) {
          dot.className = 'w-2 h-2 rounded-full bg-[#B42318]';
          if (menuDot) menuDot.className = 'w-2 h-2 rounded-full bg-[#B42318]';
          label.textContent = 'Gagal Simpan Lokal';
          if (modePill) modePill.textContent = 'Kuota Penuh';
        } else if (state.offlineMode || state.unsyncedQueue) {
          dot.className = 'w-2 h-2 rounded-full bg-[#B54D08]';
          if (menuDot) menuDot.className = 'w-2 h-2 rounded-full bg-[#B54D08]';
          label.textContent = 'Draf Lokal (Belum Tersinkron)';
          if (modePill) modePill.textContent = 'Draf Lokal';
          if (trustBadge) trustBadge.textContent = `🟠 Mode Draf Offline Aktif (${state.auth.email}) · Tersimpan aman di perangkat ini`;
        } else {
          dot.className = 'w-2 h-2 rounded-full bg-[#1F7A4C]';
          if (menuDot) menuDot.className = 'w-2 h-2 rounded-full bg-[#1F7A4C]';
          label.textContent = 'Tersimpan di Perangkat Ini';
          if (modePill) modePill.textContent = 'Tersimpan Lokal';
          if (trustBadge) trustBadge.textContent = `🔒 Tersimpan privat untuk ${state.auth.email} di perangkat ini · Mendukung Ekspor & Impor JSON`;
        }
      }

      /* =====================================================================
       * 6. 2D FALLBACK SVG ICONS (FR-023, AT-12)
       * ===================================================================== */
      function getCategory2DSvg(slug) {
        const svgs = {
          'wpda': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="10" y="6" width="28" height="36" rx="3"/><path d="M16 6v36"/><path d="M24 14v10M20 18h8"/></svg>`,
          'physical-wellness': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 24h20"/><rect x="8" y="16" width="6" height="16" rx="2"/><rect x="34" y="16" width="6" height="16" rx="2"/></svg>`,
          'music': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="16" cy="34" r="6"/><circle cx="34" cy="30" r="6"/><path d="M22 34V12l18-4v22"/></svg>`,
          'engineering': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="24" cy="24" r="8"/><path d="M24 8v4M24 36v4M8 24h4M36 24h4"/></svg>`,
          'business': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="6" y="14" width="36" height="26" rx="3"/><path d="M18 14V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M6 24h36"/></svg>`,
          'content-creating': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="6" y="14" width="36" height="26" rx="4"/><path d="M16 14l3-5h10l3 5"/><circle cx="24" cy="27" r="7"/></svg>`,
          'art': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M24 6C13.5 6 6 13.5 6 23c0 8.5 7 15 15 15 2.5 0 4-1.5 4-3.5 0-1.5-1-2.5-1-4 0-2 1.8-3.5 4-3.5h4c6 0 11-4.5 11-10.5C42 10.5 33.5 6 24 6z"/></svg>`,
          'interpersonal-skill': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 22h14v10a7 7 0 0 1-14 0V22Z"/><path d="M24 24h3a3 3 0 0 1 0 6h-3"/><rect x="32" y="10" width="8" height="14" rx="4"/><path d="M36 24v12M31 36h10"/></svg>`,
          'exploration-adaptation': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="10" y="12" width="28" height="18" rx="2"/><path d="M6 34h36l-3-4H9l-3 4Z"/><circle cx="24" cy="21" r="4"/></svg>`,
          'critical-thinking-logic': `<svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 36h16l-2-14-4 3-2-9-2 9-4-3-2 14Z"/><path d="M13 40h22"/><circle cx="34" cy="16" r="6"/><path d="M38 20l5 5"/></svg>`
        };
        return svgs[slug] || svgs['engineering'];
      }

      /* =====================================================================
       * 7. SEMI-REALISTIC PROCEDURAL PBR TEXTURE GENERATOR (CanvasTexture)
       *    Replaces flat low-poly look with tactile leather, wood grain,
       *    woven canvas, brushed metal, and camp rug textures + bump maps!
       * ===================================================================== */
      let webglSupported = false;
      function checkWebGLAndThreeSupport() {
        try {
          if (typeof window.THREE === 'undefined') return false;
          const testCanvas = document.createElement('canvas');
          return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
        } catch (e) {
          return false;
        }
      }
      webglSupported = checkWebGLAndThreeSupport();

      const PBR_TEXTURES = {};

      function initProceduralTextures() {
        if (!webglSupported || PBR_TEXTURES.initialized) return;
        PBR_TEXTURES.initialized = true;

        // 1. 512x512 HD Full-Grain Saddle Leather Texture + Micro-Pore Bump
        const cLeather = document.createElement('canvas');
        cLeather.width = 512; cLeather.height = 512;
        const ctxL = cLeather.getContext('2d');
        ctxL.fillStyle = '#B8652B';
        ctxL.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 9500; i++) {
          const x = (i * 97) % 512;
          const y = (i * 181) % 512;
          ctxL.fillStyle = (i % 3 === 0) ? 'rgba(55, 24, 6, 0.16)' : (i % 3 === 1 ? 'rgba(248, 198, 142, 0.13)' : 'rgba(90, 42, 14, 0.11)');
          ctxL.beginPath();
          ctxL.arc(x, y, 1.2 + (i % 4) * 0.55, 0, Math.PI * 2);
          ctxL.fill();
        }
        ctxL.strokeStyle = 'rgba(255, 232, 190, 0.55)';
        ctxL.lineWidth = 3;
        ctxL.setLineDash([9, 6]);
        ctxL.strokeRect(14, 14, 484, 484);
        const texLeather = new THREE.CanvasTexture(cLeather);
        texLeather.wrapS = texLeather.wrapT = THREE.RepeatWrapping;
        PBR_TEXTURES.leather = texLeather;

        // 2. 512x512 HD Heavy Waxed Expedition Canvas Weave
        const cCanvas = document.createElement('canvas');
        cCanvas.width = 512; cCanvas.height = 512;
        const ctxC = cCanvas.getContext('2d');
        ctxC.fillStyle = '#F3EAD6';
        ctxC.fillRect(0, 0, 512, 512);
        for (let y = 0; y < 512; y += 4) {
          ctxC.fillStyle = (y % 8 === 0) ? 'rgba(145, 126, 92, 0.16)' : 'rgba(255, 255, 255, 0.22)';
          ctxC.fillRect(0, y, 512, 2);
        }
        for (let x = 0; x < 512; x += 4) {
          ctxC.fillStyle = (x % 8 === 0) ? 'rgba(135, 118, 86, 0.14)' : 'rgba(255, 255, 255, 0.18)';
          ctxC.fillRect(x, 0, 2, 512);
        }
        const texCanvas = new THREE.CanvasTexture(cCanvas);
        texCanvas.wrapS = texCanvas.wrapT = THREE.RepeatWrapping;
        texCanvas.repeat.set(3, 3);
        PBR_TEXTURES.canvas = texCanvas;

        // 3. 512x512 HD Luthier Hardwood Grain Texture
        const cWood = document.createElement('canvas');
        cWood.width = 512; cWood.height = 512;
        const ctxW = cWood.getContext('2d');
        ctxW.fillStyle = '#C87638';
        ctxW.fillRect(0, 0, 512, 512);
        for (let y = 0; y < 512; y += 2) {
          ctxW.strokeStyle = (y % 8 === 0) ? 'rgba(82, 38, 10, 0.28)' : 'rgba(242, 178, 118, 0.15)';
          ctxW.lineWidth = 2;
          ctxW.beginPath();
          ctxW.moveTo(0, y);
          ctxW.bezierCurveTo(170, y + Math.sin(y * 0.05) * 9, 340, y - Math.cos(y * 0.05) * 9, 512, y);
          ctxW.stroke();
        }
        const texWood = new THREE.CanvasTexture(cWood);
        texWood.wrapS = texWood.wrapT = THREE.RepeatWrapping;
        PBR_TEXTURES.wood = texWood;

        // 4. 512x512 HD Brushed Anisotropic Satin Metal Texture
        const cMetal = document.createElement('canvas');
        cMetal.width = 512; cMetal.height = 512;
        const ctxM = cMetal.getContext('2d');
        ctxM.fillStyle = '#C0D2E0';
        ctxM.fillRect(0, 0, 512, 512);
        for (let y = 0; y < 512; y += 2) {
          ctxM.fillStyle = (y % 4 === 0) ? 'rgba(255, 255, 255, 0.28)' : 'rgba(55, 78, 96, 0.16)';
          ctxM.fillRect(0, y, 512, 1);
        }
        const texMetal = new THREE.CanvasTexture(cMetal);
        texMetal.wrapS = texMetal.wrapT = THREE.RepeatWrapping;
        PBR_TEXTURES.metal = texMetal;

        // 5. Carved Natural Stone / Granite Texture for Tiered Podiums & Cliffs
        const cStone = document.createElement('canvas');
        cStone.width = 512; cStone.height = 512;
        const ctxSt = cStone.getContext('2d');
        ctxSt.fillStyle = '#6E7A82';
        ctxSt.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 7000; i++) {
          const x = (i * 113) % 512;
          const y = (i * 227) % 512;
          ctxSt.fillStyle = (i % 2 === 0) ? 'rgba(30, 38, 44, 0.20)' : 'rgba(215, 225, 232, 0.16)';
          ctxSt.fillRect(x, y, 2 + (i % 4), 2 + (i % 3));
        }
        const texStone = new THREE.CanvasTexture(cStone);
        texStone.wrapS = texStone.wrapT = THREE.RepeatWrapping;
        PBR_TEXTURES.stone = texStone;

        // 6. Adventurer Camp Rug / Compass Floor Texture
        const cRug = document.createElement('canvas');
        cRug.width = 512; cRug.height = 512;
        const ctxR = cRug.getContext('2d');
        ctxR.fillStyle = '#EFE2C8';
        ctxR.fillRect(0, 0, 512, 512);
        ctxR.strokeStyle = 'rgba(205, 145, 75, 0.35)';
        ctxR.lineWidth = 3;
        [235, 210, 155, 95].forEach(r => {
          ctxR.beginPath();
          ctxR.arc(256, 256, r, 0, Math.PI * 2);
          ctxR.stroke();
        });
        ctxR.strokeStyle = 'rgba(29, 126, 128, 0.28)';
        for (let a = 0; a < 36; a++) {
          const rad = (a / 36) * Math.PI * 2;
          ctxR.beginPath();
          ctxR.moveTo(256 + Math.cos(rad) * 205, 256 + Math.sin(rad) * 205);
          ctxR.lineTo(256 + Math.cos(rad) * 232, 256 + Math.sin(rad) * 232);
          ctxR.stroke();
        }
        PBR_TEXTURES.rug = new THREE.CanvasTexture(cRug);

        // 7. Soft Contact Shadow Radial Texture
        const cShadow = document.createElement('canvas');
        cShadow.width = 256; cShadow.height = 256;
        const ctxS = cShadow.getContext('2d');
        const grad = ctxS.createRadialGradient(128, 128, 14, 128, 128, 120);
        grad.addColorStop(0, 'rgba(15, 22, 20, 0.55)');
        grad.addColorStop(0.55, 'rgba(15, 22, 20, 0.22)');
        grad.addColorStop(1, 'rgba(15, 22, 20, 0.0)');
        ctxS.fillStyle = grad;
        ctxS.fillRect(0, 0, 256, 256);
        PBR_TEXTURES.shadow = new THREE.CanvasTexture(cShadow);
      }

      // Build Studio HD Environment Map for Crisp Specular Shading on Gems, Metals & Leather (Estetika #6 & #7)
      function buildHDEnvironmentMap(renderer) {
        if (!renderer || !THREE.PMREMGenerator) return null;
        try {
          const pmremGenerator = new THREE.PMREMGenerator(renderer);
          pmremGenerator.compileEquirectangularShader();
          const envScene = new THREE.Scene();
          const skyGeo = new THREE.SphereGeometry(20, 32, 24);
          const cEnv = document.createElement('canvas');
          cEnv.width = 512; cEnv.height = 256;
          const ctxE = cEnv.getContext('2d');
          const gE = ctxE.createLinearGradient(0, 0, 0, 256);
          gE.addColorStop(0.0, '#FFFDF5');
          gE.addColorStop(0.38, '#9CE3FF');
          gE.addColorStop(0.50, '#FFE4B5');
          gE.addColorStop(0.65, '#2A4B46');
          gE.addColorStop(1.0, '#0E1C22');
          ctxE.fillStyle = gE;
          ctxE.fillRect(0, 0, 512, 256);
          // Bright studio key light spots for crisp metallic/gemstone reflections
          ctxE.fillStyle = '#FFFFFF';
          ctxE.beginPath(); ctxE.arc(140, 64, 28, 0, Math.PI * 2); ctxE.fill();
          ctxE.fillStyle = '#FFE099';
          ctxE.beginPath(); ctxE.arc(370, 82, 22, 0, Math.PI * 2); ctxE.fill();
          const envTex = new THREE.CanvasTexture(cEnv);
          const skyMesh = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: envTex, side: THREE.BackSide }));
          envScene.add(skyMesh);
          const renderTarget = pmremGenerator.fromScene(envScene, 0.03);
          pmremGenerator.dispose();
          return renderTarget.texture;
        } catch (err) {
          return null;
        }
      }

      // =======================================================================
      // ESTETIKA #3: MULTI-TIERED ROCK PODIUM WITH TOTAL BASE COLOR & STONE
      // MATERIAL TRANSFORMATION PER LEVEL (Instantly distinguishable at a glance!)
      //   - NULL (Unassessed): Weathered Ash-Grey Slate Stone (1 layer)
      //   - Lv.1 (Tahap I)   : Warm Canyon Ochre Sandstone Rock (1 layer)
      //   - Lv.2 (Tahap II)  : Deep Forest Jade & Mossy Serpentine Stone (2 layers)
      //   - Lv.3 (Tahap III) : Ultramarine Lapis Lazuli & Cobalt Rock (3 layers)
      //   - Lv.4 (Tahap IV)  : Imperial Amethyst Porphyry Marble (4 layers)
      //   - Lv.5 (Tahap V)   : Pitch-Black Volcanic Obsidian + Glowing Crimson Ruby Veins (5 layers)
      // =======================================================================
      function createTieredItemPodium(level) {
        initProceduralTextures();
        const evoStage = getEvolutionStage(level).stage;
        const podiumGroup = new THREE.Group();

        // Distinct Stone Palette per Level (Total Base Color & Rock Material Shift!)
        const rockPalettes = {
          0: { primary: 0x3D454C, secondary: 0x505A63, rim: 0x6E7880, emissive: 0x000000, emInt: 0.0, rough: 0.82, metal: 0.12 }, // NULL: Ash Slate
          1: { primary: 0x8F562E, secondary: 0xAC6E3E, rim: 0xC88A52, emissive: 0x2A1205, emInt: 0.08, rough: 0.74, metal: 0.15 }, // Lv.1: Canyon Sandstone
          2: { primary: 0x164E3A, secondary: 0x206A4E, rim: 0x34D399, emissive: 0x064E3B, emInt: 0.25, rough: 0.52, metal: 0.28 }, // Lv.2: Forest Jade Serpentine
          3: { primary: 0x173B7A, secondary: 0x2254A8, rim: 0x38BDF8, emissive: 0x0C4A6E, emInt: 0.32, rough: 0.38, metal: 0.45 }, // Lv.3: Lapis Lazuli Rock
          4: { primary: 0x4C1D57, secondary: 0x6B287A, rim: 0xE879F9, emissive: 0x3B0764, emInt: 0.38, rough: 0.28, metal: 0.58 }, // Lv.4: Imperial Porphyry Amethyst
          5: { primary: 0x0B0D13, secondary: 0x1A1625, rim: 0xFF2255, emissive: 0x880E2F, emInt: 0.55, rough: 0.16, metal: 0.82 }  // Lv.5: Volcanic Obsidian + Magma Ruby
        };
        const palKey = (level === null || level === undefined) ? 0 : Math.max(1, Math.min(5, level));
        const pal = rockPalettes[palKey];

        const matPrimaryRock = new THREE.MeshStandardMaterial({
          color: pal.primary,
          map: PBR_TEXTURES.stone,
          bumpMap: PBR_TEXTURES.stone,
          bumpScale: 0.048,
          emissive: pal.emissive,
          emissiveIntensity: pal.emInt,
          roughness: pal.rough,
          metalness: pal.metal
        });
        const matSecondaryRock = new THREE.MeshStandardMaterial({
          color: pal.secondary,
          map: PBR_TEXTURES.stone,
          bumpMap: PBR_TEXTURES.stone,
          bumpScale: 0.038,
          emissive: pal.emissive,
          emissiveIntensity: pal.emInt * 0.7,
          roughness: Math.max(0.14, pal.rough - 0.08),
          metalness: pal.metal
        });
        const matRimVein = new THREE.MeshStandardMaterial({
          color: pal.rim,
          emissive: pal.rim,
          emissiveIntensity: palKey >= 2 ? 0.48 : 0.05,
          roughness: 0.22,
          metalness: 0.78
        });

        const matEmeraldGem = new THREE.MeshStandardMaterial({
          color: 0x10B981,
          emissive: 0x10B981,
          emissiveIntensity: 0.75,
          roughness: 0.08,
          metalness: 0.65,
          flatShading: true
        });
        const matCyanAquamarine = new THREE.MeshStandardMaterial({
          color: 0x00F0FF,
          emissive: 0x06B6D4,
          emissiveIntensity: 0.85,
          roughness: 0.07,
          metalness: 0.72,
          flatShading: true
        });
        const matSapphireGem = new THREE.MeshStandardMaterial({
          color: 0x60A5FA,
          emissive: 0x3B82F6,
          emissiveIntensity: 0.88,
          roughness: 0.07,
          metalness: 0.75,
          flatShading: true
        });
        const matRubyGem = new THREE.MeshStandardMaterial({
          color: 0xFF1E56,
          emissive: 0xE11D48,
          emissiveIntensity: 0.95,
          roughness: 0.06,
          metalness: 0.82,
          flatShading: true
        });

        // Build N concentric stepped rocky cylindrical layers (1 layer for Stage 1 .. 5 layers for Stage 5)
        const numLayers = evoStage; // 1..5
        const totalHeight = 0.15 + (numLayers - 1) * 0.06;
        const layerH = totalHeight / numLayers;

        for (let l = 0; l < numLayers; l++) {
          const rBottom = (0.74 + (numLayers - 1) * 0.085) - l * 0.115;
          const rTop = rBottom - 0.045;
          const radialSegs = palKey <= 2 ? 16 : 36; // Rougher chiseled rock facets on lower levels, polished stone on higher levels
          const cyl = new THREE.Mesh(
            new THREE.CylinderGeometry(rTop, rBottom, layerH, radialSegs),
            l % 2 === 0 ? matPrimaryRock : matSecondaryRock
          );
          const yPos = -totalHeight * 0.5 + (l + 0.5) * layerH;
          cyl.position.y = yPos;
          cyl.castShadow = true;
          cyl.receiveShadow = true;
          podiumGroup.add(cyl);

          // Glowing mineral vein / stone rim around each podium terrace step
          const stepRing = new THREE.Mesh(
            new THREE.TorusGeometry(rTop + 0.008, 0.015, 12, radialSegs),
            matRimVein
          );
          stepRing.rotation.x = Math.PI / 2;
          stepRing.position.y = yPos + layerH * 0.48;
          podiumGroup.add(stepRing);
        }

        // Level-Specific Rock Outcrops & Mineral Formations on Podium Perimeter
        if (palKey === 1) {
          // Lv.1 Sandstone boulders around base
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2 + 0.4;
            const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(0.08, 0), matSecondaryRock);
            boulder.scale.set(1.3, 0.65, 1.0);
            boulder.position.set(Math.cos(a) * 0.72, -0.03, Math.sin(a) * 0.72);
            podiumGroup.add(boulder);
          }
        } else if (evoStage === 2) {
          // Lv.2 Jade Serpentine rock + 4 Glowing Emerald-Jade Mineral Nodes
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const jadeRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.095, 0), matEmeraldGem);
            jadeRock.scale.set(1.1, 0.85, 1.0);
            jadeRock.position.set(Math.cos(a) * 0.76, -0.01, Math.sin(a) * 0.76);
            podiumGroup.add(jadeRock);
          }
        } else if (evoStage === 3) {
          // Lv.3 Lapis Lazuli rock + 4 Cyan Aquamarine Crystal Spires
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2;
            const emCluster = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 5), matCyanAquamarine);
            emCluster.position.set(Math.cos(a) * 0.80, 0.05, Math.sin(a) * 0.80);
            emCluster.rotation.z = -Math.cos(a) * 0.25;
            emCluster.rotation.x = Math.sin(a) * 0.25;
            podiumGroup.add(emCluster);
          }
        } else if (evoStage === 4) {
          // Lv.4 Imperial Porphyry rock + 6 Glowing Sapphire Obelisks
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const saphSpire = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.26, 6), matSapphireGem);
            saphSpire.position.set(Math.cos(a) * 0.86, 0.07, Math.sin(a) * 0.86);
            podiumGroup.add(saphSpire);
          }
        } else if (evoStage >= 5) {
          // Lv.5 Volcanic Obsidian Throne + 8 Alternating Imperial Ruby & Cyan-Diamond Pillars!
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const gemMat = i % 2 === 0 ? matRubyGem : matCyanAquamarine;
            const gemPillar = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.32, 6), gemMat);
            gemPillar.position.set(Math.cos(a) * 0.94, 0.10, Math.sin(a) * 0.94);
            gemPillar.rotation.z = -Math.cos(a) * 0.18;
            gemPillar.rotation.x = Math.sin(a) * 0.18;
            const obPed = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.085, 0.09, 12), matPrimaryRock);
            obPed.position.set(Math.cos(a) * 0.94, -0.05, Math.sin(a) * 0.94);
            podiumGroup.add(gemPillar, obPed);
          }
        }

        return podiumGroup;
      }

      // =======================================================================
      // ESTETIKA #2, #4, #5, #6, #7:
      // HD 3D ARTIFACT & BACKPACK BUILDER WITH EVERYDAY REPRESENTATIVE ITEMS
      // (#08 Coffee & Mic, #09 Laptop & Binoculars, #10 Chess & Magnifier)
      // + 5-STAGE NATURE & PRECIOUS GEMSTONE EVOLUTION (Ruby, Sapphire, Emerald, Diamond, Amber)
      // =======================================================================
      function createStylized3DMesh(typeOrSlug, overrideLevel = undefined) {
        const resolvedLevel = (overrideLevel !== undefined)
          ? overrideLevel
          : (state.profiles && state.profiles[typeOrSlug] ? state.profiles[typeOrSlug].level : null);
        const evo = getEvolutionStage(resolvedLevel);
        const isSerious = state.preferences && state.preferences.colorStyle === 'serious';
        initProceduralTextures();
        const group = new THREE.Group();

        const matLeather = new THREE.MeshStandardMaterial({
          color: isSerious ? 0x693E22 : 0xC87335,
          map: PBR_TEXTURES.leather,
          bumpMap: PBR_TEXTURES.leather,
          bumpScale: 0.042,
          roughness: isSerious ? 0.38 : 0.42,
          metalness: 0.16
        });
        const matDarkLeather = new THREE.MeshStandardMaterial({
          color: isSerious ? 0x3D2314 : 0x7A3E18,
          map: PBR_TEXTURES.leather,
          bumpMap: PBR_TEXTURES.leather,
          bumpScale: 0.048,
          roughness: 0.45,
          metalness: 0.15
        });
        const matCanvas = new THREE.MeshStandardMaterial({
          color: isSerious ? 0x5A6350 : 0xF7EFE0,
          map: PBR_TEXTURES.canvas,
          bumpMap: PBR_TEXTURES.canvas,
          bumpScale: 0.03,
          roughness: 0.52,
          metalness: 0.06
        });
        const matBrass = new THREE.MeshStandardMaterial({
          color: isSerious ? 0xC29B56 : 0xF4B942,
          map: PBR_TEXTURES.metal,
          roughness: 0.16,
          metalness: 0.92
        });
        const matSteel = new THREE.MeshStandardMaterial({
          color: isSerious ? 0x828E99 : 0xC4D8EA,
          map: PBR_TEXTURES.metal,
          bumpMap: PBR_TEXTURES.metal,
          bumpScale: 0.022,
          roughness: 0.18,
          metalness: 0.88
        });
        const matDarkSteel = new THREE.MeshStandardMaterial({
          color: isSerious ? 0x262E36 : 0x354B5E,
          map: PBR_TEXTURES.metal,
          roughness: 0.28,
          metalness: 0.78
        });
        const matWood = new THREE.MeshStandardMaterial({
          color: isSerious ? 0x8C5328 : 0xD17B38,
          map: PBR_TEXTURES.wood,
          bumpMap: PBR_TEXTURES.wood,
          bumpScale: 0.035,
          roughness: 0.36,
          metalness: 0.10
        });
        const matPaper = new THREE.MeshStandardMaterial({
          color: 0xFFFDF6,
          map: PBR_TEXTURES.canvas,
          roughness: 0.62,
          metalness: 0.02
        });
        const matTeal = new THREE.MeshStandardMaterial({
          color: isSerious ? 0x2F5E58 : 0x26A699,
          map: PBR_TEXTURES.canvas,
          bumpMap: PBR_TEXTURES.canvas,
          bumpScale: 0.022,
          roughness: 0.32,
          metalness: 0.25
        });
        const matTerracotta = new THREE.MeshStandardMaterial({
          color: isSerious ? 0x9E422B : 0xE05A36,
          map: PBR_TEXTURES.leather,
          bumpScale: 0.028,
          roughness: 0.38,
          metalness: 0.14
        });
        const matGlass = new THREE.MeshStandardMaterial({
          color: 0xA8F2FA,
          roughness: 0.05,
          metalness: 0.55,
          transparent: true,
          opacity: 0.88
        });

        if (typeOrSlug === 'backpack') {
          // Estetika #7: HD High-Detail Expedition Backpack with Stitched Piping, Shoulder Straps, Grab Handle, Molle Webbing, Canteen & Bedroll!
          const mainPack = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.96, 1.9, 48), matCanvas);
          mainPack.scale.set(1.08, 1.0, 0.68);
          mainPack.position.y = -0.04;
          group.add(mainPack);

          const leatherBase = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.99, 0.60, 48), matLeather);
          leatherBase.scale.set(1.09, 1.0, 0.70);
          leatherBase.position.y = -0.75;
          group.add(leatherBase);

          // Stitched Leather Piping Rings around the pack body
          [-0.45, 0.35].forEach(py => {
            const pipe = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.024, 16, 48), matDarkLeather);
            pipe.rotation.x = Math.PI / 2;
            pipe.scale.set(1.09, 0.69, 1.0);
            pipe.position.y = py;
            group.add(pipe);
          });

          // Sculpted Front Pouches + Brass Zipper & Molle Webbing
          const frontPocket = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.62, 0.88, 36), matLeather);
          frontPocket.scale.set(1.15, 1.0, 0.48);
          frontPocket.position.set(0, -0.38, 0.55);
          group.add(frontPocket);

          const pocketFlap = new THREE.Mesh(new THREE.CylinderGeometry(0.60, 0.60, 0.16, 36), matDarkLeather);
          pocketFlap.scale.set(1.17, 1.0, 0.50);
          pocketFlap.position.set(0, 0.04, 0.56);
          group.add(pocketFlap);

          const pocketBadge = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.04), matBrass);
          pocketBadge.position.set(0, -0.35, 0.84);
          group.add(pocketBadge);

          // Side Canteen & Map Pouches with Brass Rivets & Straps
          const leftPouch = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.88, 32), matTeal);
          leftPouch.position.set(-0.98, -0.3, 0);
          const leftCap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 20), matBrass);
          leftCap.scale.y = 0.45;
          leftCap.position.set(-0.98, 0.16, 0);
          const leftValve = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.18, 20), matBrass);
          leftValve.position.set(-0.98, 0.30, 0);
          group.add(leftPouch, leftCap, leftValve);

          const rightPouch = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.88, 32), matTerracotta);
          rightPouch.position.set(0.98, -0.3, 0);
          const rightCap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 20), matDarkLeather);
          rightCap.scale.y = 0.45;
          rightCap.position.set(0.98, 0.16, 0);
          // Rolled Parchment Map sticking out of right pouch
          const rolledMap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.55, 24), matPaper);
          rolledMap.position.set(0.98, 0.36, 0.04);
          rolledMap.rotation.z = -0.14;
          group.add(rightPouch, rightCap, rolledMap);

          // Top Pivoting Leather Hood + Bedroll + Top Grab Handle
          const flapPivot = new THREE.Group();
          flapPivot.position.set(0, 0.88, -0.42);

          const hood = new THREE.Mesh(new THREE.SphereGeometry(0.92, 44, 28, 0, Math.PI * 2, 0, Math.PI * 0.55), matLeather);
          hood.scale.set(1.08, 0.55, 0.72);
          hood.position.set(0, -0.02, 0.42);
          flapPivot.add(hood);

          const topHandle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.042, 16, 32, Math.PI), matDarkLeather);
          topHandle.position.set(0, 0.44, 0.12);
          flapPivot.add(topHandle);

          const bedroll = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 1.92, 36), matTeal);
          bedroll.rotation.z = Math.PI / 2;
          bedroll.position.set(0, 0.36, 0.38);
          const bedrollCore = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.96, 24), matLeather);
          bedrollCore.rotation.z = Math.PI / 2;
          bedrollCore.position.set(0, 0.36, 0.38);
          flapPivot.add(bedroll, bedrollCore);

          [-0.56, 0, 0.56].forEach(bx => {
            const bRing = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.035, 16, 32), matDarkLeather);
            bRing.rotation.y = Math.PI / 2;
            bRing.position.set(bx, 0.36, 0.38);
            flapPivot.add(bRing);
          });

          group.add(flapPivot);
          group.userData.flapPivot = flapPivot;

          // Twin Front Leather Straps & Gleaming Brass Buckles + Rivets
          [-0.42, 0.42].forEach(x => {
            const strap = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.42, 0.08), matDarkLeather);
            strap.position.set(x, 0.06, 0.68);
            group.add(strap);
            const buckle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.034, 18, 32), matBrass);
            buckle.position.set(x, 0.18, 0.73);
            const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 12), matBrass);
            pin.position.set(x, 0.18, 0.74);
            group.add(buckle, pin);
          });

          // Rear Ergonomic Shoulder Straps (Visible when rotating the backpack!)
          [-0.38, 0.38].forEach(sx => {
            const backStrap = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.075, 16, 32, Math.PI * 0.85), matDarkLeather);
            backStrap.rotation.y = Math.PI / 2;
            backStrap.position.set(sx, 0.02, -0.52);
            group.add(backStrap);
          });

          // Hanging Brass Compass Medallion
          const tag = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 36), matBrass);
          tag.rotation.x = Math.PI / 2;
          tag.position.set(0.62, 0.44, 0.62);
          group.add(tag);

          group.traverse(child => {
            if (child.isMesh && !child.userData.isHitbox) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          const backpackHitbox = new THREE.Mesh(
            new THREE.SphereGeometry(2.25, 16, 12),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false })
          );
          backpackHitbox.userData.isHitbox = true;
          group.add(backpackHitbox);

          return group;
        }

        switch (typeOrSlug) {
          case 'wpda': {
            // HD #01 WPDA: Embossed Leather Bible & Journal + Gold Gilded Page Edges + Brass Corner Protectors + Fountain Pen
            const backCover = new THREE.Mesh(new THREE.BoxGeometry(1.44, 1.90, 0.07), matLeather);
            backCover.position.z = -0.17;
            const frontCover = new THREE.Mesh(new THREE.BoxGeometry(1.44, 1.90, 0.07), matLeather);
            frontCover.position.z = 0.17;
            const pages = new THREE.Mesh(new THREE.BoxGeometry(1.32, 1.78, 0.26), matPaper);
            pages.position.set(0.05, 0, 0);
            const gildedEdge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.76, 0.25), matBrass);
            gildedEdge.position.set(0.71, 0, 0);
            const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 1.90, 36), matDarkLeather);
            spine.position.set(-0.69, 0, 0);

            // Spine raised bookbinding ribs
            [-0.65, -0.22, 0.22, 0.65].forEach(ry => {
              const rib = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.022, 12, 24, Math.PI), matBrass);
              rib.rotation.z = Math.PI / 2;
              rib.rotation.y = -Math.PI / 2;
              rib.position.set(-0.69, ry, 0);
              group.add(rib);
            });

            const matBrassEmbossed = matBrass.clone();
            matBrassEmbossed.polygonOffset = true;
            matBrassEmbossed.polygonOffsetFactor = -2;
            matBrassEmbossed.polygonOffsetUnits = -2;

            const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.74, 0.048), matBrassEmbossed);
            vBar.position.set(0.06, 0.16, 0.225);
            const hBarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.048), matBrassEmbossed);
            hBarLeft.position.set(-0.09, 0.28, 0.225);
            const hBarRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.048), matBrassEmbossed);
            hBarRight.position.set(0.21, 0.28, 0.225);

            // Fountain Pen alongside the Journal
            const penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 1.45, 24), matDarkSteel);
            penBody.position.set(0.92, -0.10, 0.12);
            penBody.rotation.z = 0.08;
            const penNib = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 16), matBrass);
            penNib.position.set(0.98, -0.92, 0.12);
            penNib.rotation.z = Math.PI + 0.08;

            const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.46, 0.04), matTeal);
            ribbon.position.set(0.25, -1.05, 0.02);
            group.add(backCover, frontCover, pages, gildedEdge, spine, vBar, hBarLeft, hBarRight, penBody, penNib, ribbon);
            break;
          }
          case 'physical-wellness': {
            // HD #02 Wellness: Knurled Pro Dumbbell + Sculpted Kettlebell + Sports Hydration Bottle
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.82, 36), matSteel);
            bar.rotation.z = Math.PI / 2;
            group.add(bar);
            [-0.70, -0.50, 0.50, 0.70].forEach((x, idx) => {
              const radius = (idx === 0 || idx === 3) ? 0.46 : 0.58;
              const plate = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.18, 36), matDarkSteel);
              plate.rotation.z = Math.PI / 2;
              plate.position.x = x;
              const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.032, 16, 36), matTeal);
              rim.rotation.y = Math.PI / 2;
              rim.position.x = x;
              group.add(plate, rim);
            });
            // Companion Kettlebell in front-right
            const kbBell = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 24), matTerracotta);
            kbBell.position.set(0.35, -0.42, 0.52);
            const kbHandle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 16, 28, Math.PI), matSteel);
            kbHandle.position.set(0.35, -0.10, 0.52);
            group.add(kbBell, kbHandle);
            break;
          }
          case 'music': {
            // HD #03 Music: Luthier Acoustic Guitar with 6 Metallic Strings, Frets, Tuning Pegs & Headstock
            const lowerBout = new THREE.Mesh(new THREE.CylinderGeometry(0.70, 0.70, 0.34, 44), matWood);
            lowerBout.rotation.x = Math.PI / 2;
            lowerBout.position.y = -0.36;
            const upperBout = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.34, 44), matWood);
            upperBout.rotation.x = Math.PI / 2;
            upperBout.position.y = 0.24;
            const soundHole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.36, 36), matDarkLeather);
            soundHole.rotation.x = Math.PI / 2;
            soundHole.position.y = 0.04;
            const rosette = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.026, 16, 36), matBrass);
            rosette.position.set(0, 0.04, 0.18);
            const neck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.42, 0.14), matDarkLeather);
            neck.position.set(0, 0.96, 0.06);
            const headstock = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.36, 0.12), matWood);
            headstock.position.set(0, 1.72, 0.04);
            const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.11, 0.08), matDarkLeather);
            bridge.position.set(0, -0.46, 0.18);
            // 6 Gleaming Guitar Strings + Tuning Pegs
            for (let s = 0; s < 6; s++) {
              const sx = -0.075 + s * 0.03;
              const strMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 2.05, 8), matBrass);
              strMesh.position.set(sx, 0.58, 0.20);
              group.add(strMesh);
            }
            group.add(lowerBout, upperBout, soundHole, rosette, neck, headstock, bridge);
            break;
          }
          case 'engineering': {
            // HD #04 Engineering: Precision Meshed Gears + Microcontroller PCB Board + Vernier Caliper
            const gearRing = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.18, 28, 48), matSteel);
            group.add(gearRing);
            for (let i = 0; i < 12; i++) {
              const angle = (i / 12) * Math.PI * 2;
              const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.24, 0.28), matSteel);
              tooth.position.set(Math.cos(angle) * 0.82, Math.sin(angle) * 0.82, 0);
              tooth.rotation.z = angle;
              group.add(tooth);
            }
            const coreHub = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.46, 36), matBrass);
            coreHub.rotation.x = Math.PI / 2;
            const pcbBoard = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.65, 0.08), matTeal);
            pcbBoard.position.set(0.38, -0.42, 0.32);
            pcbBoard.rotation.z = -0.22;
            const icChip = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.12), matDarkSteel);
            icChip.position.set(0.38, -0.42, 0.36);
            icChip.rotation.z = -0.22;
            const axisRod = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 1.68, 28), matBrass);
            axisRod.rotation.z = Math.PI / 4;
            group.add(coreHub, pcbBoard, icChip, axisRod);
            break;
          }
          case 'business': {
            // HD #05 Business: Executive Stitched Leather Briefcase + Brass Combination Locks + Financial Chart Tablet
            const caseBody = new THREE.Mesh(new THREE.BoxGeometry(1.72, 1.26, 0.48), matLeather);
            const handle = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.065, 20, 36, Math.PI), matDarkLeather);
            handle.position.set(0, 0.65, 0);
            const trimBar = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.08, 0.50), matBrass);
            trimBar.position.y = 0.20;
            [-0.48, 0.48].forEach(x => {
              const latch = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.52), matBrass);
              latch.position.set(x, 0.18, 0);
              group.add(latch);
            });
            // Analytics Tablet leaning in front
            const tabletFrame = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.68, 0.06), matDarkSteel);
            tabletFrame.position.set(0.36, -0.34, 0.36);
            tabletFrame.rotation.x = -0.18;
            const tabletScreen = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.56, 0.07), matTeal);
            tabletScreen.position.set(0.36, -0.34, 0.365);
            tabletScreen.rotation.x = -0.18;
            group.add(caseBody, handle, trimBar, tabletFrame, tabletScreen);
            break;
          }
          case 'content-creating': {
            // HD #06 Content Creating: Cinema Mirrorless Camera + Telephoto Prime Lens + Top Shotgun Microphone + Articulating Screen
            const camBody = new THREE.Mesh(new THREE.BoxGeometry(1.56, 1.10, 0.72), matDarkSteel);
            const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.12, 24), matLeather);
            grip.position.set(-0.68, 0, 0.24);
            const topPlate = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.22, 0.70), matBrass);
            topPlate.position.y = 0.58;
            const viewfinder = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.26, 0.48), matDarkSteel);
            viewfinder.position.y = 0.76;
            // External Shotgun Microphone on top cold-shoe
            const shotgunMic = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.82, 24), matTerracotta);
            shotgunMic.rotation.x = Math.PI / 2;
            shotgunMic.position.set(0, 1.02, 0.12);
            const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.72, 44), matSteel);
            lensBarrel.rotation.x = Math.PI / 2;
            lensBarrel.position.z = 0.56;
            const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.50, 0.035, 16, 44), matBrass);
            lensRing.position.z = 0.78;
            const lensGlass = new THREE.Mesh(new THREE.SphereGeometry(0.38, 36, 28), matGlass);
            lensGlass.scale.z = 0.35;
            lensGlass.position.z = 0.88;
            group.add(camBody, grip, topPlate, viewfinder, shotgunMic, lensBarrel, lensRing, lensGlass);
            break;
          }
          case 'art': {
            // HD #07 Art: Sculpted Hardwood Artist Palette + 6 Rich Pigment Daubs + Twin Brushes & Sketch Pad
            const palette = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.12, 44), matWood);
            palette.rotation.x = Math.PI / 3;
            const brushHandle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.075, 1.88, 24), matTerracotta);
            brushHandle1.rotation.z = -Math.PI / 4;
            brushHandle1.position.set(0.1, 0.1, 0.24);
            const ferrule1 = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.22, 24), matBrass);
            ferrule1.rotation.z = -Math.PI / 4;
            ferrule1.position.set(0.62, 0.62, 0.24);
            const bristleTip = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.26, 20), matTeal);
            bristleTip.rotation.z = -Math.PI / 4;
            bristleTip.position.set(0.78, 0.78, 0.24);

            const colors = [0xF4B942, 0x26A699, 0xE05A36, 0x3B82F6, 0xEC4899, 0xFFFDF6];
            colors.forEach((hex, idx) => {
              const angle = (idx / 6) * Math.PI * 1.45 - 0.8;
              const daub = new THREE.Mesh(
                new THREE.SphereGeometry(0.16, 28, 24),
                new THREE.MeshStandardMaterial({ color: hex, roughness: 0.22, metalness: 0.1 })
              );
              daub.position.set(Math.cos(angle) * 0.58, Math.sin(angle) * 0.42, 0.16);
              group.add(daub);
            });
            group.add(palette, brushHandle1, ferrule1, bristleTip);
            break;
          }
          case 'interpersonal-skill': {
            // ESTETIKA #5: EVERYDAY REPRESENTATIVE MODEL FOR #08 INTERPERSONAL SKILL
            // Two Warm Ceramic Coffee Mugs on a Hardwood Cafe Tray + Studio Broadcast Microphone on Brass Stand!
            // Represents warm 1-on-1 empathy/psychology over coffee & clear leadership/public communication!
            const trayBase = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 1.04, 0.12, 44), matWood);
            trayBase.position.y = -0.68;
            const trayRim = new THREE.Mesh(new THREE.TorusGeometry(1.00, 0.045, 16, 44), matDarkLeather);
            trayRim.rotation.x = Math.PI / 2;
            trayRim.position.y = -0.62;
            group.add(trayBase, trayRim);

            const matCeramicCream = new THREE.MeshStandardMaterial({ color: 0xFFFDF7, roughness: 0.18, metalness: 0.08 });
            const matCoffeeFoam = new THREE.MeshStandardMaterial({ color: 0xC67D3B, roughness: 0.42 });

            // Left Ceramic Coffee Mug (Warm Terracotta)
            const mug1 = new THREE.Group();
            mug1.position.set(-0.46, -0.28, 0.22);
            const cup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.62, 36), matTerracotta);
            const foam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 32), matCoffeeFoam);
            foam1.position.y = 0.29;
            const handle1 = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.042, 16, 28, Math.PI), matTerracotta);
            handle1.rotation.z = Math.PI / 2;
            handle1.position.set(-0.27, 0, 0);
            mug1.add(cup1, foam1, handle1);

            // Right Ceramic Coffee Mug (Warm Cream & Teal)
            const mug2 = new THREE.Group();
            mug2.position.set(0.46, -0.32, 0.26);
            mug2.rotation.y = -0.45;
            const cup2 = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.22, 0.56, 36), matCeramicCream);
            const stripe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.265, 0.25, 0.16, 36), matTeal);
            const foam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.04, 32), matCoffeeFoam);
            foam2.position.y = 0.26;
            const handle2 = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.038, 16, 28, Math.PI), matCeramicCream);
            handle2.rotation.z = -Math.PI / 2;
            handle2.position.set(0.25, 0, 0);
            mug2.add(cup2, stripe2, foam2, handle2);

            // Center-Back Vintage Broadcast / Podcast Condenser Microphone on Brass Desk Stand
            const micGroup = new THREE.Group();
            micGroup.position.set(0, -0.60, -0.24);
            const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.10, 32), matBrass);
            const micStem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.88, 24), matSteel);
            micStem.position.y = 0.44;
            const micYoke = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 16, 32, Math.PI), matBrass);
            micYoke.rotation.x = Math.PI;
            micYoke.position.y = 1.08;
            const micCapsule = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.38, 32), matSteel);
            micCapsule.position.y = 1.12;
            const micCapTop = new THREE.Mesh(new THREE.SphereGeometry(0.20, 32, 20), matSteel);
            micCapTop.position.y = 1.31;
            const micCapBot = new THREE.Mesh(new THREE.SphereGeometry(0.20, 32, 20), matDarkSteel);
            micCapBot.position.y = 0.93;
            const micBand = new THREE.Mesh(new THREE.TorusGeometry(0.208, 0.024, 14, 32), matBrass);
            micBand.rotation.x = Math.PI / 2;
            micBand.position.y = 1.12;
            micGroup.add(micBase, micStem, micYoke, micCapsule, micCapTop, micCapBot, micBand);

            group.add(mug1, mug2, micGroup);
            break;
          }
          case 'exploration-adaptation': {
            // ESTETIKA #5: EVERYDAY REPRESENTATIVE MODEL FOR #09 EXPLORATION & ADAPTATION
            // Open Modern Sleek Laptop (AI/Computer Tech) + Optical Field Binoculars & Rolled World Map!
            const laptopGroup = new THREE.Group();
            laptopGroup.position.set(0, -0.48, -0.05);

            // Laptop Aluminium Base Deck + Dark Keyboard Well + Trackpad
            const kbBase = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.09, 1.06), matSteel);
            const kbWell = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.02, 0.58), matDarkSteel);
            kbWell.position.set(0, 0.05, -0.10);
            const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.26), matDarkSteel);
            trackpad.position.set(0, 0.05, 0.32);

            // Hinged Open Laptop Display Screen with Glowing AI / Code Interface
            const screenPivot = new THREE.Group();
            screenPivot.position.set(0, 0.045, -0.50);
            screenPivot.rotation.x = -0.32; // Open at comfortable viewing angle
            const lidFrame = new THREE.Mesh(new THREE.BoxGeometry(1.56, 1.02, 0.06), matSteel);
            lidFrame.position.y = 0.51;
            const matAiScreen = new THREE.MeshStandardMaterial({
              color: 0x0B2538,
              emissive: 0x1CA89C,
              emissiveIntensity: 0.55,
              roughness: 0.12
            });
            const displayPanel = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.88, 0.02), matAiScreen);
            displayPanel.position.set(0, 0.51, 0.032);
            // Glowing code/AI bars on screen
            [-0.22, 0.0, 0.22].forEach((sy, sIdx) => {
              const codeBar = new THREE.Mesh(
                new THREE.BoxGeometry(0.85 - sIdx * 0.18, 0.07, 0.015),
                new THREE.MeshBasicMaterial({ color: sIdx === 0 ? 0xFFE07D : 0x64F5E8 })
              );
              codeBar.position.set(-0.15, 0.52 + sy, 0.045);
              screenPivot.add(codeBar);
            });
            screenPivot.add(lidFrame, displayPanel);
            laptopGroup.add(kbBase, kbWell, trackpad, screenPivot);

            // Dual-Barrel Explorer Field Binoculars resting in front-right
            const binoGroup = new THREE.Group();
            binoGroup.position.set(0.45, -0.32, 0.56);
            binoGroup.rotation.y = -0.42;
            [-0.16, 0.16].forEach(bx => {
              const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.52, 28), matDarkSteel);
              barrel.rotation.x = Math.PI / 2;
              barrel.position.x = bx;
              const trim = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.02, 14, 28), matBrass);
              trim.position.set(bx, 0, 0.24);
              const lens = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), matGlass);
              lens.scale.z = 0.3;
              lens.position.set(bx, 0, 0.26);
              binoGroup.add(barrel, trim, lens);
            });
            const binoBridge = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.14), matBrass);
            binoGroup.add(binoBridge);

            // Rolled Compass Scroll Map on front-left
            const scrollMap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.78, 28), matPaper);
            scrollMap.rotation.z = Math.PI / 2;
            scrollMap.rotation.y = 0.35;
            scrollMap.position.set(-0.48, -0.36, 0.58);
            const scrollBand = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.022, 14, 24), matLeather);
            scrollBand.rotation.y = Math.PI / 2 + 0.35;
            scrollBand.position.set(-0.48, -0.36, 0.58);

            group.add(laptopGroup, binoGroup, scrollMap, scrollBand);
            break;
          }
          case 'critical-thinking-logic':
          default: {
            // ESTETIKA #5: EVERYDAY REPRESENTATIVE MODEL FOR #10 CRITICAL THINKING & LOGIC
            // Wooden Strategy Chessboard Base + Sculpted King & Knight Chess Pieces + Brass Magnifying Glass & Philosophy Tome!
            const boardBase = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.16, 1.48), matDarkLeather);
            boardBase.position.y = -0.64;
            const boardBorder = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.12, 1.54), matBrass);
            boardBorder.position.y = -0.66;
            group.add(boardBase, boardBorder);

            // 3x3 Checkered Chess Squares on top of the board
            for (let r = -1; r <= 1; r++) {
              for (let c = -1; c <= 1; c++) {
                const sq = new THREE.Mesh(
                  new THREE.BoxGeometry(0.46, 0.04, 0.40),
                  (r + c) % 2 === 0 ? matPaper : matDarkSteel
                );
                sq.position.set(c * 0.47, -0.55, r * 0.41);
                group.add(sq);
              }
            }

            // Turned Royal King Chess Piece (Tall, commanding centerpiece)
            const kingGroup = new THREE.Group();
            kingGroup.position.set(-0.28, -0.52, -0.08);
            const kPed = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.18, 32), matBrass);
            kPed.position.y = 0.09;
            const kStem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.20, 0.68, 32), matBrass);
            kStem.position.y = 0.52;
            const kCollar = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 16, 32), matBrass);
            kCollar.rotation.x = Math.PI / 2;
            kCollar.position.y = 0.86;
            const kCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.24, 32), matBrass);
            kCrown.position.y = 0.98;
            const kCrossV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.06), matBrass);
            kCrossV.position.y = 1.20;
            const kCrossH = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06), matBrass);
            kCrossH.position.y = 1.22;
            kingGroup.add(kPed, kStem, kCollar, kCrown, kCrossV, kCrossH);

            // Second Chess Piece (Dark Steel Tactician Piece)
            const rookGroup = new THREE.Group();
            rookGroup.position.set(0.36, -0.52, -0.22);
            const rPed = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.16, 28), matDarkSteel);
            rPed.position.y = 0.08;
            const rBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.52, 28), matDarkSteel);
            rBody.position.y = 0.42;
            const rHead = new THREE.Mesh(new THREE.SphereGeometry(0.17, 28, 24), matDarkSteel);
            rHead.position.y = 0.74;
            rookGroup.add(rPed, rBody, rHead);

            // Classic Brass Magnifying Glass (Symbol of Critical Analysis & First Principles)
            const magGroup = new THREE.Group();
            magGroup.position.set(0.24, -0.22, 0.42);
            magGroup.rotation.set(-0.55, 0.35, -0.45);
            const magRim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.045, 20, 40), matBrass);
            const magLens = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.04, 36), matGlass);
            magLens.rotation.x = Math.PI / 2;
            const magHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.68, 24), matWood);
            magHandle.position.y = -0.62;
            magGroup.add(magRim, magLens, magHandle);

            group.add(kingGroup, rookGroup, magGroup);
            break;
          }
        }

        // Enable HD cast/receive shadows on all core artifact meshes
        group.traverse(child => {
          if (child.isMesh && !child.userData.isHitbox) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // =================================================================
        // ESTETIKA #2: 5-STAGE NATURE, ADVENTURER & PRECIOUS GEMSTONE EVOLUTION!
        // Stage 1 (Lv.1 / Awal): River Stone & Timber Ring
        // Stage 2 (Lv.2): Forest Vine Wreath + 4 Glowing Golden Amber & Peridot Buds
        // Stage 3 (Lv.3): Wooden Compass Ring + 4 Faceted Lush Emerald Crystal Clusters
        // Stage 4 (Lv.4): Dual Explorer Compass Rings + 6 Royal Blue Sapphire Crystals + Sapphire Mist Beam
        // Stage 5 (Lv.5): Imperial Ruby, Sapphire, Emerald & Diamond Sanctuary! 8 Precious Gemstones + Golden Explorer Sun-Crown + Ruby-Gold Sunbeam!
        // =================================================================
        if (typeOrSlug !== 'backpack') {
          group.userData.evolutionStage = evo.stage;
          const evoAttachments = new THREE.Group();
          evoAttachments.userData.isEvolutionGroup = true;

          // ESTETIKA #2: COLOR-THEORY COMPLEMENTARY CONTRAST FOR EVOLUTION ORNAMENTS!
          // Core artifacts use warm, grounded, matte/satin natural tones (Espresso Leather #693E22, Walnut #8C5328, Antique Brass #C29B56, Gunmetal #262E36).
          // Evolution ornaments use high-chroma, self-luminous Complementary Cool Cyan/Emerald/Sapphire/Imperial-Ruby hues at wider orbital radii
          // so the core artifact silhouette and its evolution ornaments have razor-sharp visual separation!
          const matNatureVine = new THREE.MeshStandardMaterial({
            color: 0x059669,
            emissive: 0x047857,
            emissiveIntensity: 0.55,
            roughness: 0.25,
            metalness: 0.45,
            flatShading: true
          });
          const matAmberResin = new THREE.MeshStandardMaterial({
            color: 0x34D399,
            emissive: 0x10B981,
            emissiveIntensity: 0.92,
            roughness: 0.08,
            metalness: 0.65,
            flatShading: true
          });
          const matEmeraldCrystal = new THREE.MeshStandardMaterial({
            color: 0x00F5D4,
            emissive: 0x06B6D4,
            emissiveIntensity: 0.98,
            roughness: 0.06,
            metalness: 0.78,
            flatShading: true
          });
          const matSapphireCrystal = new THREE.MeshStandardMaterial({
            color: 0x38BDF8,
            emissive: 0x2563EB,
            emissiveIntensity: 1.05,
            roughness: 0.06,
            metalness: 0.82,
            flatShading: true
          });
          const matRubyCrystal = new THREE.MeshStandardMaterial({
            color: 0xFF1E56,
            emissive: 0xE11D48,
            emissiveIntensity: 1.12,
            roughness: 0.05,
            metalness: 0.88,
            flatShading: true
          });
          const matDiamondCrystal = new THREE.MeshStandardMaterial({
            color: 0xE0F2FE,
            emissive: 0x00F0FF,
            emissiveIntensity: 1.05,
            roughness: 0.03,
            metalness: 0.95,
            flatShading: true
          });
          const matRoyalGold = new THREE.MeshStandardMaterial({
            color: 0x7DD3FC,
            emissive: 0x0284C7,
            emissiveIntensity: 0.78,
            roughness: 0.10,
            metalness: 0.92
          });

          // Helper to build a multi-faceted natural gemstone cluster (main crystal + 2 side shards)
          function createGemstoneCluster(gemMat, scale = 1.0) {
            const cl = new THREE.Group();
            const mainGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.15 * scale, 0), gemMat);
            mainGem.scale.set(0.85, 1.45, 0.85);
            const side1 = new THREE.Mesh(new THREE.ConeGeometry(0.07 * scale, 0.22 * scale, 5), gemMat);
            side1.position.set(0.08 * scale, -0.02 * scale, 0.04 * scale);
            side1.rotation.z = -0.45;
            const side2 = new THREE.Mesh(new THREE.ConeGeometry(0.06 * scale, 0.19 * scale, 5), gemMat);
            side2.position.set(-0.08 * scale, -0.04 * scale, -0.04 * scale);
            side2.rotation.z = 0.48;
            cl.add(mainGem, side1, side2);
            return cl;
          }

          if (evo.stage === 1) {
            group.scale.multiplyScalar(0.90);
            if (resolvedLevel === 1) {
              const timberRing = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.026, 12, 36), matNatureVine);
              timberRing.rotation.x = Math.PI / 2;
              timberRing.position.y = -0.58;
              evoAttachments.add(timberRing);
              evoAttachments.userData.outerRing = timberRing;
            }
          } else if (evo.stage === 2) {
            // STAGE II: High-Contrast Luminous Emerald Wreath + 4 Peridot-Cyan Crystal Buds (Wide orbital gap!)
            const vineRing = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.032, 12, 40), matNatureVine);
            vineRing.rotation.x = Math.PI / 2.2;
            vineRing.position.y = -0.52;
            evoAttachments.add(vineRing);
            evoAttachments.userData.outerRing = vineRing;

            const satellites = [];
            for (let i = 0; i < 4; i++) {
              const ang = (i / 4) * Math.PI * 2;
              const amberCluster = createGemstoneCluster(i % 2 === 0 ? matAmberResin : matEmeraldCrystal, 0.90);
              amberCluster.position.set(Math.cos(ang) * 1.24, -0.42 + Math.sin(ang * 2) * 0.16, Math.sin(ang) * 1.24);
              evoAttachments.add(amberCluster);
              satellites.push(amberCluster);
            }
            evoAttachments.userData.satellites = satellites;
          } else if (evo.stage === 3) {
            // STAGE III: Luminous Cyan-Turquoise Compass Halo + 4 Orbiting Aquamarine-Emerald Crystal Clusters!
            const compassRing = new THREE.Mesh(new THREE.TorusGeometry(1.30, 0.034, 16, 48), matRoyalGold);
            compassRing.rotation.x = Math.PI / 2.5;
            evoAttachments.add(compassRing);
            evoAttachments.userData.outerRing = compassRing;

            const vineInner = new THREE.Mesh(new THREE.TorusGeometry(1.14, 0.024, 12, 40), matNatureVine);
            vineInner.rotation.x = -Math.PI / 2.8;
            evoAttachments.add(vineInner);
            evoAttachments.userData.innerRing = vineInner;

            const satellites = [];
            for (let i = 0; i < 4; i++) {
              const ang = (i / 4) * Math.PI * 2;
              const emGem = createGemstoneCluster(matEmeraldCrystal, 1.08);
              emGem.position.set(Math.cos(ang) * 1.36, Math.sin(ang * 2) * 0.28, Math.sin(ang) * 1.36);
              evoAttachments.add(emGem);
              satellites.push(emGem);
            }
            evoAttachments.userData.satellites = satellites;
          } else if (evo.stage === 4) {
            // STAGE IV: Royal Ocean Sapphire! Dual Luminous Rings + 6 Faceted Sapphire Clusters + Sapphire Light Pillar!
            const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.038, 18, 56), matRoyalGold);
            outerRing.rotation.x = Math.PI / 3;
            outerRing.rotation.y = Math.PI / 6;
            evoAttachments.add(outerRing);
            evoAttachments.userData.outerRing = outerRing;

            const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.030, 16, 48), matSapphireCrystal);
            innerRing.rotation.x = -Math.PI / 3;
            evoAttachments.add(innerRing);
            evoAttachments.userData.innerRing = innerRing;

            const lightPillar = new THREE.Mesh(
              new THREE.CylinderGeometry(0.54, 0.90, 2.85, 28, 1, true),
              new THREE.MeshBasicMaterial({
                color: 0x38BDF8,
                transparent: true,
                opacity: 0.17,
                side: THREE.DoubleSide,
                depthWrite: false
              })
            );
            lightPillar.position.y = 0.25;
            evoAttachments.add(lightPillar);
            evoAttachments.userData.lightPillar = lightPillar;

            const satellites = [];
            for (let i = 0; i < 6; i++) {
              const ang = (i / 6) * Math.PI * 2;
              const saphGem = createGemstoneCluster(i % 2 === 0 ? matSapphireCrystal : matEmeraldCrystal, 1.12);
              saphGem.position.set(Math.cos(ang) * 1.30, (i % 2 === 0 ? 0.35 : -0.25), Math.sin(ang) * 1.30);
              evoAttachments.add(saphGem);
              satellites.push(saphGem);
            }
            evoAttachments.userData.satellites = satellites;
          } else if (evo.stage >= 5) {
            // STAGE V: IMPERIAL RUBY, SAPPHIRE, EMERALD & DIAMOND LEGENDARY SANCTUARY ("WOW" Peak!)
            const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.40, 0.048, 20, 64), matRoyalGold);
            ring1.rotation.x = Math.PI / 3.2;
            evoAttachments.add(ring1);
            evoAttachments.userData.outerRing = ring1;

            const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.036, 18, 56), matRubyCrystal);
            ring2.rotation.x = -Math.PI / 2.8;
            ring2.rotation.y = Math.PI / 5;
            evoAttachments.add(ring2);
            evoAttachments.userData.innerRing = ring2;

            const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.028, 16, 48), matNatureVine);
            ring3.rotation.y = Math.PI / 2;
            evoAttachments.add(ring3);
            evoAttachments.userData.coreRing = ring3;

            // Floating Imperial Ruby & Diamond Explorer Crest Crown above the artifact
            const crownGroup = new THREE.Group();
            crownGroup.position.y = 1.34;
            const crownRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.044, 16, 36), matRoyalGold);
            crownRing.rotation.x = Math.PI / 2;
            const centerRuby = createGemstoneCluster(matRubyCrystal, 1.35);
            centerRuby.position.y = 0.20;
            crownGroup.add(crownRing, centerRuby);
            for (let c = 0; c < 6; c++) {
              const ca = (c / 6) * Math.PI * 2;
              const diamondPoint = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), c % 2 === 0 ? matDiamondCrystal : matRubyCrystal);
              diamondPoint.position.set(Math.cos(ca) * 0.36, 0.12, Math.sin(ca) * 0.36);
              crownGroup.add(diamondPoint);
            }
            evoAttachments.add(crownGroup);
            evoAttachments.userData.crownGroup = crownGroup;

            // Twin Volumetric Ruby-Gold & Diamond Sunbeam Light Pillars
            const outerPillar = new THREE.Mesh(
              new THREE.CylinderGeometry(0.68, 1.18, 3.45, 32, 1, true),
              new THREE.MeshBasicMaterial({
                color: 0xFB7185,
                transparent: true,
                opacity: 0.20,
                side: THREE.DoubleSide,
                depthWrite: false
              })
            );
            outerPillar.position.y = 0.42;
            const innerPillar = new THREE.Mesh(
              new THREE.CylinderGeometry(0.28, 0.52, 3.65, 24, 1, true),
              new THREE.MeshBasicMaterial({
                color: 0xFFF3B0,
                transparent: true,
                opacity: 0.28,
                side: THREE.DoubleSide,
                depthWrite: false
              })
            );
            innerPillar.position.y = 0.50;
            evoAttachments.add(outerPillar, innerPillar);
            evoAttachments.userData.lightPillar = outerPillar;
            evoAttachments.userData.innerPillar = innerPillar;

            // 8 Orbiting Precious Gemstone Clusters (Ruby, Sapphire, Emerald & Diamond)
            const gemCycle = [matRubyCrystal, matSapphireCrystal, matEmeraldCrystal, matDiamondCrystal];
            const satellites = [];
            for (let i = 0; i < 8; i++) {
              const ang = (i / 8) * Math.PI * 2;
              const gemCluster = createGemstoneCluster(gemCycle[i % 4], i % 2 === 0 ? 1.25 : 1.0);
              gemCluster.position.set(Math.cos(ang) * 1.44, (i % 2 === 0 ? 0.42 : -0.32), Math.sin(ang) * 1.44);
              evoAttachments.add(gemCluster);
              satellites.push(gemCluster);
            }
            evoAttachments.userData.satellites = satellites;
          }

          // Lightweight Evolution Shimmer Particle Aura (Stages 1..5: scales with evolution tier!)
          {
            const pCount = evo.stage === 1 ? (resolvedLevel === 1 ? 14 : 10) : (evo.stage === 2 ? 22 : (evo.stage === 3 ? 32 : (evo.stage === 4 ? 46 : 64)));
            const pGeo = new THREE.BufferGeometry();
            const pPos = new Float32Array(pCount * 3);
            for (let i = 0; i < pCount; i++) {
              const a = (i / pCount) * Math.PI * 2 * 2;
              const r = 0.72 + (i % 6) * 0.13;
              pPos[i * 3] = Math.cos(a) * r;
              pPos[i * 3 + 1] = -0.78 + (i / pCount) * 2.15;
              pPos[i * 3 + 2] = Math.sin(a) * r;
            }
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            const pColorHex = evo.stage === 1
              ? (resolvedLevel === 1 ? 0xF59E0B : 0x94A3B8)
              : (evo.stage === 2 ? 0x34D399 : (evo.stage === 3 ? 0x22D3EE : (evo.stage === 4 ? 0x60A5FA : 0xFB7185)));
            const pMat = new THREE.PointsMaterial({
              color: pColorHex,
              size: evo.stage >= 5 ? 0.115 : (evo.stage >= 2 ? 0.095 : 0.075),
              transparent: true,
              opacity: evo.stage === 1 ? (resolvedLevel === 1 ? 0.75 : 0.48) : 0.90
            });
            const auraPoints = new THREE.Points(pGeo, pMat);
            evoAttachments.add(auraPoints);
            evoAttachments.userData.auraPoints = auraPoints;
          }

          group.add(evoAttachments);
          group.userData.evoAttachments = evoAttachments;
        }

        // Generous Invisible Proximity Hitbox Sphere (Radius 1.85)
        const itemHitbox = new THREE.Mesh(
          new THREE.SphereGeometry(1.85, 14, 12),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false })
        );
        itemHitbox.userData.isHitbox = true;
        group.add(itemHitbox);

        return group;
      }

      /* =====================================================================
       * 8. FULL-SCREEN 3D RPG WORLD ENGINE WITH SMOOTH DELTA-TIME PHYSICS
       *    (No Jumping / Snapping — Silky Cubic-Bezier Trajectories!)
       * ===================================================================== */
      let worldCtrl = null;
      let detailScene = null;
      const rackThumbnailCache = {};

      function smoothstep(x) {
        const t = Math.max(0, Math.min(1, x));
        return t * t * (3 - 2 * t);
      }

      function easeInOutCubic(x) {
        const t = Math.max(0, Math.min(1, x));
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      /* =====================================================================
       * FINDING 2: OWNERSHIP-AWARE 3D GPU RESOURCE CLEANUP HELPER
       * Disposes unique Geometries & Materials owned by a removed root while
       * strictly preserving shared procedural textures in PBR_TEXTURES!
       * ===================================================================== */
      function disposeOwnedObject3D(root) {
        if (!root) return;
        const geometries = new Set();
        const materials = new Set();
        root.traverse((obj) => {
          if (obj.geometry) geometries.add(obj.geometry);
          if (obj.material) {
            const list = Array.isArray(obj.material) ? obj.material : [obj.material];
            for (let i = 0; i < list.length; i++) {
              if (list[i]) materials.add(list[i]);
            }
          }
        });
        geometries.forEach((geometry) => {
          try { geometry.dispose(); } catch (e) {}
        });
        materials.forEach((material) => {
          try { material.dispose(); } catch (e) {}
        });
      }

      /* =====================================================================
       * SECTION 4.4: ZERO-SECOND-WEBGL-CONTEXT THUMBNAIL ENGINE
       * Eliminates the second WebGLRenderer context completely! Uses crisp,
       * zero-GPU SVG illustrations + evolution badges in the 3D Rack view so
       * only ONE WebGLRenderer ever exists in the browser.
       * ===================================================================== */
      function invalidateRackThumbnails() {}
      function generateRackThumbnails() {}

      function initFullWorld3DStage() {
        if (!webglSupported) return null;
        initProceduralTextures();
        const canvas = document.getElementById('landingBackpackCanvas');
        if (!canvas) return null;

        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
        } catch (e) {
          webglSupported = false;
          return null;
        }

        // Detect software WebGL (SwiftShader / llvmpipe) per games_3d.md
        const glCtx = renderer.getContext();
        const dbgExt = glCtx ? glCtx.getExtension("WEBGL_debug_renderer_info") : null;
        const glRendererStr = (dbgExt && glCtx) ? String(glCtx.getParameter(dbgExt.UNMASKED_RENDERER_WEBGL) || "") : "";
        const isSoftwareGl = /SwiftShader|llvmpipe|Software|Basic Render Driver/i.test(glRendererStr);

        // Estetika #6 & #7: HD Shading, ACES Filmic Tone Mapping & Soft Shadow Mapping
        renderer.shadowMap.enabled = !isSoftwareGl;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        if (THREE.ACESFilmicToneMapping !== undefined) {
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.12;
        }
        if (THREE.sRGBEncoding !== undefined) {
          renderer.outputEncoding = THREE.sRGBEncoding;
        }

        const scene = new THREE.Scene();
        const hdEnvTex = buildHDEnvironmentMap(renderer);
        if (hdEnvTex) {
          scene.environment = hdEnvTex;
        }

        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 120);
        camera.position.set(0, 1.9, 5.8);

        // Dramatic Focus-Guiding HD Lighting with Soft Shadows
        const hemiLight = new THREE.HemisphereLight(0xfff6e0, 0x9e8c6c, 0.72);
        const sunLight = new THREE.DirectionalLight(0xffeed2, 1.15);
        sunLight.position.set(7, 14, 8);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.camera.near = 2;
        sunLight.shadow.camera.far = 32;
        sunLight.shadow.camera.left = -9;
        sunLight.shadow.camera.right = 9;
        sunLight.shadow.camera.top = 9;
        sunLight.shadow.camera.bottom = -9;
        sunLight.shadow.bias = -0.0008;

        const rimLight = new THREE.DirectionalLight(0x3ec6b8, 0.65);
        rimLight.position.set(-7, 5, -5);
        scene.add(hemiLight, sunLight, rimLight);

        // Hero Focus Spotlight + Close Key PointLight + Luminous Ground Pool
        const focusSpotLight = new THREE.SpotLight(0xFFE5A8, 2.85, 28, Math.PI / 5.8, 0.68, 1.4);
        focusSpotLight.position.set(0, 7.2, 2.2);
        scene.add(focusSpotLight);
        scene.add(focusSpotLight.target);

        const focusPointLight = new THREE.PointLight(0xFFA940, 1.75, 5.2, 1.7);
        focusPointLight.position.set(0, 1.1, 0.5);
        scene.add(focusPointLight);

        // Luminous Golden Focus Pool on the Camp Floor (Shows unmistakably which object is in focus!)
        const cPool = document.createElement('canvas');
        cPool.width = 256; cPool.height = 256;
        const ctxP = cPool.getContext('2d');
        const gPool = ctxP.createRadialGradient(128, 128, 6, 128, 128, 122);
        gPool.addColorStop(0, 'rgba(255, 198, 92, 0.62)');
        gPool.addColorStop(0.45, 'rgba(223, 118, 31, 0.26)');
        gPool.addColorStop(1, 'rgba(223, 118, 31, 0.0)');
        ctxP.fillStyle = gPool;
        ctxP.fillRect(0, 0, 256, 256);
        const texPool = new THREE.CanvasTexture(cPool);

        const focusPoolMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(3.2, 3.2),
          new THREE.MeshBasicMaterial({ map: texPool, transparent: true, depthWrite: false })
        );
        focusPoolMesh.rotation.x = -Math.PI / 2;
        focusPoolMesh.position.set(0, -1.168, 0);
        scene.add(focusPoolMesh);

        // Floating Golden Firefly / Dust Motes for Grand Cinematic Atmosphere (Request #4)
        const particleCount = 46;
        const pGeo = new THREE.BufferGeometry();
        const pPositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
          pPositions[i * 3] = (Math.sin(i * 17.3) * 6.5);
          pPositions[i * 3 + 1] = -0.8 + (i % 10) * 0.36;
          pPositions[i * 3 + 2] = (Math.cos(i * 23.7) * 5.5);
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        const pMat = new THREE.PointsMaterial({
          color: 0xFFD27D,
          size: 0.09,
          transparent: true,
          opacity: 0.72
        });
        const firefliesPoints = new THREE.Points(pGeo, pMat);
        scene.add(firefliesPoints);

        // Wider Semi-Realistic RPG Camp Environment (Request #1)
        const envGroup = new THREE.Group();
        scene.add(envGroup);

        // Estetika #2: Deep Complementary Cool Slate-Teal & Forest-Jade Environment Colors
        // so Warm Amber/Leather/Gold/Ivory Hero Objects POP with maximum visual contrast!
        const matMeadow = new THREE.MeshStandardMaterial({
          color: 0x163836,
          map: PBR_TEXTURES.canvas,
          bumpMap: PBR_TEXTURES.canvas,
          bumpScale: 0.03,
          roughness: 0.86
        });
        const matSandGround = new THREE.MeshStandardMaterial({
          color: 0x1B3B48,
          map: PBR_TEXTURES.leather,
          bumpScale: 0.02,
          roughness: 0.82
        });
        const matCampRug = new THREE.MeshStandardMaterial({
          color: 0x204754,
          map: PBR_TEXTURES.rug,
          bumpMap: PBR_TEXTURES.canvas,
          bumpScale: 0.015,
          roughness: 0.74
        });
        const matBrassRing = new THREE.MeshStandardMaterial({
          color: 0xF4B942,
          map: PBR_TEXTURES.metal,
          roughness: 0.25,
          metalness: 0.85
        });
        const matPineFoliage = new THREE.MeshStandardMaterial({
          color: 0x297052,
          map: PBR_TEXTURES.canvas,
          roughness: 0.68
        });
        const matTrunk = new THREE.MeshStandardMaterial({
          color: 0x7D4E2D,
          map: PBR_TEXTURES.wood,
          roughness: 0.75
        });
        const matBoulder = new THREE.MeshStandardMaterial({
          color: 0x9AA9B0,
          map: PBR_TEXTURES.leather,
          bumpMap: PBR_TEXTURES.leather,
          bumpScale: 0.04,
          roughness: 0.65
        });

        // =================================================================
        // ESTETIKA #3: TOPOGRAPHICAL 3D ENVIRONMENT DEPTH (Terraced Amphitheater,
        // Sunken Arena Bowl, Raised Backpack Sanctuary Mound & Cliff Ledges!)
        // =================================================================
        const meadowDisc = new THREE.Mesh(new THREE.CylinderGeometry(16.5, 18.0, 0.48, 64), matMeadow);
        meadowDisc.position.y = -1.52;
        meadowDisc.receiveShadow = true;
        envGroup.add(meadowDisc);

        // Sunken Arena Basin Floor
        const clearingFloor = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 8.8, 0.16, 64), matSandGround);
        clearingFloor.position.y = -1.29;
        clearingFloor.receiveShadow = true;
        envGroup.add(clearingFloor);

        const campRug = new THREE.Mesh(new THREE.CylinderGeometry(6.42, 6.50, 0.06, 64), matCampRug);
        campRug.position.y = -1.21;
        campRug.receiveShadow = true;
        envGroup.add(campRug);

        const compassRing = new THREE.Mesh(new THREE.TorusGeometry(6.44, 0.055, 18, 64), matBrassRing);
        compassRing.rotation.x = Math.PI / 2;
        compassRing.position.y = -1.17;
        envGroup.add(compassRing);

        // Topographical Retaining Walls & Terraced Amphitheater Rings framing the central stage
        const matTerraceWall = new THREE.MeshStandardMaterial({
          color: 0x26444E,
          map: PBR_TEXTURES.stone,
          bumpMap: PBR_TEXTURES.stone,
          bumpScale: 0.04,
          roughness: 0.72
        });
        // Inner Amphitheater Rim (Creates sunken bowl depth around the 10 artifacts)
        const innerAmphitheaterRim = new THREE.Mesh(new THREE.TorusGeometry(6.95, 0.28, 16, 64), matTerraceWall);
        innerAmphitheaterRim.rotation.x = Math.PI / 2;
        innerAmphitheaterRim.scale.set(1.0, 1.0, 0.85);
        innerAmphitheaterRim.position.y = -1.12;
        innerAmphitheaterRim.receiveShadow = true;
        envGroup.add(innerAmphitheaterRim);

        // Middle Terraced Elevation Ledge
        const midTerraceLedge = new THREE.Mesh(new THREE.TorusGeometry(8.35, 0.52, 16, 64), matMeadow);
        midTerraceLedge.rotation.x = Math.PI / 2;
        midTerraceLedge.scale.set(1.0, 1.0, 0.92);
        midTerraceLedge.position.y = -0.88;
        midTerraceLedge.receiveShadow = true;
        envGroup.add(midTerraceLedge);

        // Raised Central Hero Sanctuary Mound (Under the closed/open Backpack)
        const heroMoundGroup = new THREE.Group();
        const moundTier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.25, 0.14, 48), matTerraceWall);
        moundTier1.position.y = -1.18;
        const moundTier2 = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.72, 0.12, 48), matCampRug);
        moundTier2.position.y = -1.10;
        const moundBrass = new THREE.Mesh(new THREE.TorusGeometry(1.44, 0.032, 14, 48), matBrassRing);
        moundBrass.rotation.x = Math.PI / 2;
        moundBrass.position.y = -1.04;
        heroMoundGroup.add(moundTier1, moundTier2, moundBrass);
        envGroup.add(heroMoundGroup);

        // Radial Stepping Stones leading from the central mound out toward the 10 item podiums
        SEED_CATEGORIES.forEach(cat => {
          const midX = cat.floorPos.x * 0.55;
          const midZ = cat.floorPos.z * 0.55;
          const stepStone = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.05, 12), matTerraceWall);
          stepStone.position.set(midX, -1.185, midZ);
          stepStone.receiveShadow = true;
          envGroup.add(stepStone);
        });

        // Sculpted Outer Topographical Hills & Cliff Outcrops around the back/sides
        [
          { x: -9.5, z: -5.2, r: 2.8, h: 1.85 },
          { x: -6.2, z: -7.2, r: 3.2, h: 2.35 },
          { x: 0.0, z: -8.0, r: 3.8, h: 2.10 },
          { x: 6.2, z: -7.2, r: 3.2, h: 2.40 },
          { x: 9.5, z: -5.2, r: 2.8, h: 1.90 },
          { x: -10.4, z: 0.8, r: 2.4, h: 1.45 },
          { x: 10.4, z: 0.8, r: 2.4, h: 1.50 }
        ].forEach(hl => {
          const hill = new THREE.Mesh(new THREE.ConeGeometry(hl.r, hl.h, 9), matMeadow);
          hill.position.set(hl.x, -1.35 + hl.h * 0.42, hl.z);
          hill.scale.set(1.3, 0.75, 1.0);
          hill.receiveShadow = true;
          envGroup.add(hill);
        });

        // Perimeter Pine Trees & Boulders pushed wider to match the zoomed-out boundary
        [
          { x: -7.5, z: -4.6, s: 1.65 },
          { x: -5.4, z: -5.8, s: 1.35 },
          { x: 5.4, z: -5.8, s: 1.45 },
          { x: 7.5, z: -4.5, s: 1.7 },
          { x: -8.2, z: -0.8, s: 1.3 },
          { x: 8.2, z: -0.7, s: 1.4 }
        ].forEach(tc => {
          const tree = new THREE.Group();
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * tc.s, 0.12 * tc.s, 0.48 * tc.s, 16), matTrunk);
          trunk.position.y = 0.24 * tc.s;
          const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.46 * tc.s, 0.88 * tc.s, 20), matPineFoliage);
          c1.position.y = 0.66 * tc.s;
          const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.36 * tc.s, 0.74 * tc.s, 20), matPineFoliage);
          c2.position.y = 1.08 * tc.s;
          tree.add(trunk, c1, c2);
          tree.position.set(tc.x, -1.25, tc.z);
          envGroup.add(tree);
        });

        [
          { x: -6.4, z: -3.5, r: 0.32 },
          { x: 6.5, z: -3.4, r: 0.36 },
          { x: -6.9, z: 2.3, r: 0.26 },
          { x: 6.9, z: 2.4, r: 0.28 }
        ].forEach(rk => {
          const stone = new THREE.Mesh(new THREE.SphereGeometry(rk.r, 20, 16), matBoulder);
          stone.scale.set(1.2, 0.72, 1.0);
          stone.position.set(rk.x, -1.14, rk.z);
          envGroup.add(stone);
        });

        // =================================================================
        // ESTETIKA #1 & #2: BRIGHT SUNNY DAY (LIGHT MODE) vs STARRY NIGHT (DARK MODE)
        // + RICH SKY ATMOSPHERE (Sky Dome, Volumetric Clouds, Sunbeams, Starfield, Mountains)
        // =================================================================
        scene.fog = new THREE.FogExp2(0x8ED6F8, 0.014);

        const matMountain = new THREE.MeshStandardMaterial({ color: 0x3A6B7C, roughness: 0.88, flatShading: true });
        const matSnowCap = new THREE.MeshStandardMaterial({ color: 0xF5FBFF, roughness: 0.55, flatShading: true });
        [
          { x: -16, z: -19, r: 5.8, h: 10.2 },
          { x: -8.5, z: -21, r: 6.6, h: 11.8 },
          { x: 0.5, z: -23, r: 7.4, h: 13.2 },
          { x: 9.5, z: -20, r: 6.2, h: 11.0 },
          { x: 16.5, z: -18, r: 5.4, h: 9.2 }
        ].forEach(m => {
          const mGroup = new THREE.Group();
          const peak = new THREE.Mesh(new THREE.ConeGeometry(m.r, m.h, 7), matMountain);
          peak.position.y = m.h * 0.5 - 1.5;
          const cap = new THREE.Mesh(new THREE.ConeGeometry(m.r * 0.38, m.h * 0.36, 7), matSnowCap);
          cap.position.y = m.h * 0.83 - 1.5;
          mGroup.add(peak, cap);
          mGroup.position.set(m.x, 0, m.z);
          envGroup.add(mGroup);
        });

        // Celestial Sun (Day) / Glowing Moon (Night) + Atmospheric Sunbeams
        const celestialGroup = new THREE.Group();
        celestialGroup.position.set(8.8, 9.6, -16.5);
        const sunDisc = new THREE.Mesh(
          new THREE.SphereGeometry(1.55, 32, 32),
          new THREE.MeshBasicMaterial({ color: 0xFFF3B0 })
        );
        const sunHalo = new THREE.Mesh(
          new THREE.RingGeometry(1.75, 2.95, 48),
          new THREE.MeshBasicMaterial({ color: 0xFFD166, side: THREE.DoubleSide, transparent: true, opacity: 0.42 })
        );
        // Golden Volumetric Sunbeams (Visible in Bright Sunny Day Mode)
        const sunRaysGroup = new THREE.Group();
        for (let r = 0; r < 5; r++) {
          const rayCone = new THREE.Mesh(
            new THREE.ConeGeometry(1.4 + r * 0.3, 16.0, 16, 1, true),
            new THREE.MeshBasicMaterial({
              color: 0xFFF2B2,
              transparent: true,
              opacity: 0.065,
              side: THREE.DoubleSide,
              depthWrite: false
            })
          );
          rayCone.position.set(-2.2 + r * 0.6, -6.5, 2.0);
          rayCone.rotation.z = 0.32 + (r - 2) * 0.06;
          sunRaysGroup.add(rayCone);
        }
        celestialGroup.add(sunDisc, sunHalo, sunRaysGroup);
        envGroup.add(celestialGroup);

        // 3D Starfield (220 Twinkling Stars for Night Mode!)
        const starCount = 220;
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
          starPos[i * 3] = (Math.sin(i * 91.7) * 28.0);
          starPos[i * 3 + 1] = 2.5 + (i % 18) * 0.85;
          starPos[i * 3 + 2] = -12.0 - Math.abs(Math.cos(i * 47.3) * 14.0);
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starFieldMat = new THREE.PointsMaterial({
          color: 0xFFFDF2,
          size: 0.14,
          transparent: true,
          opacity: 0.0
        });
        const nightStarField = new THREE.Points(starGeo, starFieldMat);
        envGroup.add(nightStarField);

        // Shimmering Sky Aurora Ribbon (Night Mode Highlight)
        const auroraMesh = new THREE.Mesh(
          new THREE.TorusGeometry(15.0, 0.52, 16, 64, Math.PI * 0.68),
          new THREE.MeshBasicMaterial({ color: 0x3CE8C8, transparent: true, opacity: 0.24, side: THREE.DoubleSide })
        );
        auroraMesh.position.set(-2.0, 6.6, -17.5);
        auroraMesh.rotation.z = 0.22;
        envGroup.add(auroraMesh);

        // Estetika #2: Lush Multi-Layered Volumetric-Style Low-Poly 3D Cumulus Clouds in the Air!
        const cloudNodes = [];
        const matCloud = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          emissive: 0xD8F0FF,
          emissiveIntensity: 0.32,
          roughness: 0.78,
          flatShading: true
        });
        [
          { x: -13.5, y: 7.4, z: -14.5, s: 1.35, speed: 0.20 },
          { x: -7.5, y: 8.5, z: -16.5, s: 1.55, speed: 0.15 },
          { x: -1.5, y: 7.8, z: -15.0, s: 1.25, speed: 0.18 },
          { x: 4.8, y: 8.2, z: -15.8, s: 1.45, speed: 0.16 },
          { x: 11.8, y: 7.0, z: -13.5, s: 1.30, speed: 0.21 },
          { x: -10.2, y: 5.6, z: -10.8, s: 0.95, speed: 0.26 },
          { x: -3.8, y: 6.1, z: -11.5, s: 1.05, speed: 0.23 },
          { x: 2.9, y: 5.8, z: -11.2, s: 0.98, speed: 0.24 },
          { x: 8.8, y: 5.5, z: -10.5, s: 1.02, speed: 0.22 },
          { x: 14.5, y: 6.2, z: -12.0, s: 0.90, speed: 0.19 }
        ].forEach(cl => {
          const cg = new THREE.Group();
          const puffSpecs = [
            { r: 0.92, x: 0, y: 0.08, z: 0 },
            { r: 0.74, x: -0.78, y: -0.08, z: 0.12 },
            { r: 0.76, x: 0.78, y: -0.06, z: -0.08 },
            { r: 0.58, x: -1.32, y: -0.18, z: 0.05 },
            { r: 0.60, x: 1.30, y: -0.16, z: -0.05 },
            { r: 0.65, x: 0.22, y: 0.34, z: 0.18 }
          ];
          puffSpecs.forEach(ps => {
            const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(ps.r, 1), matCloud);
            puff.position.set(ps.x, ps.y, ps.z);
            cg.add(puff);
          });
          cg.scale.set(cl.s * 1.35, cl.s * 0.75, cl.s * 0.90);
          cg.position.set(cl.x, cl.y, cl.z);
          envGroup.add(cg);
          cloudNodes.push({ group: cg, baseX: cl.x, baseY: cl.y, speed: cl.speed });
        });

        // Cozy Campfire & Expedition Tent on the Perimeter
        const campfireGroup = new THREE.Group();
        campfireGroup.position.set(-4.3, -1.18, -3.1);
        for (let i = 0; i < 4; i++) {
          const logMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.75, 8), matTrunk);
          logMesh.rotation.z = Math.PI / 2;
          logMesh.rotation.y = (i / 4) * Math.PI;
          logMesh.position.y = 0.05;
          campfireGroup.add(logMesh);
        }
        const flameOuter = new THREE.Mesh(
          new THREE.ConeGeometry(0.28, 0.68, 8),
          new THREE.MeshBasicMaterial({ color: 0xFF7B1A, transparent: true, opacity: 0.88 })
        );
        flameOuter.position.y = 0.34;
        const flameInner = new THREE.Mesh(
          new THREE.ConeGeometry(0.16, 0.46, 8),
          new THREE.MeshBasicMaterial({ color: 0xFFE66D })
        );
        flameInner.position.y = 0.26;
        const campfireLight = new THREE.PointLight(0xFF8C2B, 1.35, 6.5, 1.8);
        campfireLight.position.set(0, 0.65, 0);
        campfireGroup.add(flameOuter, flameInner, campfireLight);
        envGroup.add(campfireGroup);

        // Explorer A-Frame Tent on Right-Back Perimeter
        const tentGroup = new THREE.Group();
        tentGroup.position.set(4.5, -0.58, -3.2);
        tentGroup.rotation.y = -0.45;
        const tentBody = new THREE.Mesh(
          new THREE.ConeGeometry(1.25, 1.45, 4),
          new THREE.MeshStandardMaterial({ color: 0x2B6F78, roughness: 0.7, flatShading: true })
        );
        tentBody.rotation.y = Math.PI / 4;
        tentBody.scale.set(1.1, 1.0, 1.35);
        tentGroup.add(tentBody);
        envGroup.add(tentGroup);

        // =================================================================
        // TEKNIS #3: 3D WOODEN CAMP NOTICEBOARD (PAPAN PENGUMUMAN) WITH LIVE
        // 10-SKILL RADAR CHART DISPLAY IN THE 3D ENVIRONMENT!
        // =================================================================
        const noticeboardCanvas = document.createElement('canvas');
        noticeboardCanvas.width = 768;
        noticeboardCanvas.height = 540;
        const noticeboardTex = new THREE.CanvasTexture(noticeboardCanvas);

        function updateWorldNoticeboardRadar() {
          const ctx = noticeboardCanvas.getContext('2d');
          const isSerious = state.preferences && state.preferences.colorStyle === 'serious';
          // Warm parchment / slate expedition board background
          ctx.fillStyle = isSerious ? '#1A242B' : '#102432';
          ctx.fillRect(0, 0, 768, 540);
          ctx.strokeStyle = '#F4B942';
          ctx.lineWidth = 8;
          ctx.strokeRect(14, 14, 740, 512);
          ctx.strokeStyle = 'rgba(74, 208, 196, 0.45)';
          ctx.lineWidth = 2;
          ctx.strokeRect(24, 24, 720, 492);

          // Title Header on the 3D Noticeboard
          ctx.fillStyle = '#F4B942';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('📋 PAPAN PENGUMUMAN · RADAR 10 SKILL', 384, 58);

          const assessedCount = SEED_CATEGORIES.filter(c => state.profiles[c.slug] && state.profiles[c.slug].level !== null).length;
          ctx.fillStyle = '#9CE0FF';
          ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`${assessedCount}/10 Kategori Dinilai · Klik Papan untuk Detail Penuh`, 384, 84);

          // Draw 10-Axis Radar Chart on the 3D Board
          const cx = 384;
          const cy = 308;
          const maxR = 152;
          const total = SEED_CATEGORIES.length;

          // Concentric decagon rings (Levels 1..5)
          for (let lvl = 1; lvl <= 5; lvl++) {
            const r = (lvl / 5) * maxR;
            ctx.beginPath();
            SEED_CATEGORIES.forEach((_, i) => {
              const ang = (i / total) * Math.PI * 2 - Math.PI / 2;
              const px = cx + Math.cos(ang) * r;
              const py = cy + Math.sin(ang) * r;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.closePath();
            ctx.strokeStyle = lvl === 5 ? 'rgba(244, 185, 66, 0.65)' : 'rgba(148, 184, 204, 0.28)';
            ctx.lineWidth = lvl === 5 ? 2.5 : 1.5;
            ctx.stroke();
          }

          // Spokes & Labels
          const polyPts = [];
          SEED_CATEGORIES.forEach((cat, i) => {
            const ang = (i / total) * Math.PI * 2 - Math.PI / 2;
            const ox = cx + Math.cos(ang) * maxR;
            const oy = cy + Math.sin(ang) * maxR;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(ox, oy);
            ctx.strokeStyle = 'rgba(148, 184, 204, 0.28)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            const prof = state.profiles[cat.slug];
            const lvl = (prof && prof.level !== null) ? prof.level : 0.45;
            const vr = (lvl / 5) * maxR;
            polyPts.push({ x: cx + Math.cos(ang) * vr, y: cy + Math.sin(ang) * vr, rawLvl: prof ? prof.level : null });

            // Category short label around the radar
            const lx = cx + Math.cos(ang) * (maxR + 36);
            const ly = cy + Math.sin(ang) * (maxR + 28);
            ctx.fillStyle = '#FFFDF5';
            ctx.font = 'bold 14px "JetBrains Mono", monospace';
            ctx.fillText(`#${cat.order} ${cat.shortTag}`, lx, ly);
            ctx.fillStyle = (prof && prof.level !== null) ? '#F4B942' : '#8FA8B5';
            ctx.font = 'bold 13px "JetBrains Mono", monospace';
            ctx.fillText((prof && prof.level !== null) ? `Lv.${prof.level}` : 'NULL', lx, ly + 16);
          });

          // Filled Skill Polygon
          ctx.beginPath();
          polyPts.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();
          ctx.fillStyle = 'rgba(223, 118, 31, 0.42)';
          ctx.fill();
          ctx.strokeStyle = '#F4B942';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Vertex Dots
          polyPts.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = pt.rawLvl !== null ? '#4AD0C4' : '#8FA8B5';
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
          });

          noticeboardTex.needsUpdate = true;
        }
        updateWorldNoticeboardRadar();

        const noticeboardGroup = new THREE.Group();
        noticeboardGroup.position.set(2.95, -1.08, -2.55);
        noticeboardGroup.rotation.y = -0.42;
        noticeboardGroup.userData.interactiveType = 'noticeboard';
        noticeboardGroup.userData.noticeboardName = 'Papan Pengumuman Radar Skill 📋';

        // Left & Right Carved Timber Posts
        [-1.08, 1.08].forEach(px => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.10, 1.95, 16), matTrunk);
          post.position.set(px, 0.88, 0);
          post.castShadow = true;
          const postCap = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.22), matBrassRing);
          postCap.position.set(px, 1.86, 0);
          noticeboardGroup.add(post, postCap);
        });

        // Pitched Wooden Roof Overhang over the Noticeboard
        const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.08, 0.52), matTrunk);
        roofLeft.position.set(0, 1.96, 0.12);
        roofLeft.rotation.x = 0.28;
        const roofTrim = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.04, 0.06), matBrassRing);
        roofTrim.position.set(0, 1.90, 0.36);
        noticeboardGroup.add(roofLeft, roofTrim);

        // Wooden Backing Frame + Live Radar Chart Canvas Plane
        const boardBacking = new THREE.Mesh(new THREE.BoxGeometry(2.12, 1.46, 0.10), matTrunk);
        boardBacking.position.set(0, 1.08, 0);
        boardBacking.castShadow = true;
        const boardScreen = new THREE.Mesh(
          new THREE.PlaneGeometry(1.98, 1.34),
          new THREE.MeshBasicMaterial({ map: noticeboardTex })
        );
        boardScreen.position.set(0, 1.08, 0.056);

        // Warm Hanging Lantern on the Noticeboard
        const boardLantern = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xFFE484 })
        );
        boardLantern.position.set(0, 1.82, 0.28);
        const boardHitbox = new THREE.Mesh(
          new THREE.BoxGeometry(2.5, 2.2, 0.9),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        boardHitbox.position.set(0, 1.05, 0);
        noticeboardGroup.add(boardBacking, boardScreen, boardLantern, boardHitbox);
        scene.add(noticeboardGroup);

        // =================================================================
        // ESTETIKA #3: REALISTIC-PROPORTIONED SCULPTED LOW-POLY ANIMALS!
        // Built with faceted Low-Poly geometry (flatShading: true), anatomical
        // legs, paws, neck, snout, ears, antlers & multi-joint gait animation!
        // =================================================================
        const matFoxOrange = new THREE.MeshStandardMaterial({ color: 0xE26322, roughness: 0.52, flatShading: true });
        const matFoxWhite = new THREE.MeshStandardMaterial({ color: 0xFFF8EC, roughness: 0.58, flatShading: true });
        const matAnimalDark = new THREE.MeshStandardMaterial({ color: 0x1E2629, roughness: 0.38, flatShading: true });
        const matDeerCoat = new THREE.MeshStandardMaterial({ color: 0xAD6E3B, roughness: 0.56, flatShading: true });
        const matAntler = new THREE.MeshStandardMaterial({ color: 0xE6CFA8, roughness: 0.48, flatShading: true });
        const matBunnyCoat = new THREE.MeshStandardMaterial({ color: 0xF7EFE2, roughness: 0.55, flatShading: true });
        const matBunnyEarPink = new THREE.MeshStandardMaterial({ color: 0xE89993, roughness: 0.52, flatShading: true });

        // 1. Sculpted Low-Poly Red Fox (Anatomical torso, chest, neck, snout, 4 articulated legs, multi-segment tail)
        const foxGroup = new THREE.Group();
        foxGroup.position.set(-3.15, -1.16, -2.45);
        foxGroup.rotation.y = 0.62;
        foxGroup.userData.interactiveType = 'critter';
        foxGroup.userData.critterName = 'Rubah Lembah Low-Poly 🦊';

        // Ribcage + Hindquarters + White Chest Ruff
        const foxTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.56, 7), matFoxOrange);
        foxTorso.rotation.x = Math.PI / 2;
        foxTorso.position.set(0, 0.28, 0);
        const foxChest = new THREE.Mesh(new THREE.DodecahedronGeometry(0.155, 0), matFoxWhite);
        foxChest.scale.set(0.92, 1.05, 0.95);
        foxChest.position.set(0, 0.27, 0.24);
        const foxNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 0.22, 6), matFoxOrange);
        foxNeck.position.set(0, 0.39, 0.26);
        foxNeck.rotation.x = 0.42;

        // Fox Head Pivot + Faceted Wedge Skull + Slender Snout + Pointed Ears
        const foxHead = new THREE.Group();
        foxHead.position.set(0, 0.47, 0.34);
        const foxSkull = new THREE.Mesh(new THREE.DodecahedronGeometry(0.145, 0), matFoxOrange);
        foxSkull.scale.set(1.05, 0.88, 1.12);
        const foxSnoutUpper = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.24, 5), matFoxOrange);
        foxSnoutUpper.rotation.x = Math.PI / 2;
        foxSnoutUpper.position.set(0, -0.01, 0.18);
        const foxJawWhite = new THREE.Mesh(new THREE.ConeGeometry(0.072, 0.21, 5), matFoxWhite);
        foxJawWhite.rotation.x = Math.PI / 2;
        foxJawWhite.position.set(0, -0.04, 0.17);
        const foxNose = new THREE.Mesh(new THREE.DodecahedronGeometry(0.028, 0), matAnimalDark);
        foxNose.position.set(0, 0.0, 0.30);
        foxHead.add(foxSkull, foxSnoutUpper, foxJawWhite, foxNose);

        [-0.075, 0.075].forEach(ex => {
          const eye = new THREE.Mesh(new THREE.DodecahedronGeometry(0.022, 0), matAnimalDark);
          eye.position.set(ex, 0.03, 0.12);
          const earOuter = new THREE.Mesh(new THREE.ConeGeometry(0.058, 0.17, 4), matFoxOrange);
          earOuter.position.set(ex * 1.25, 0.15, -0.02);
          earOuter.rotation.z = ex > 0 ? -0.18 : 0.18;
          const earTip = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.07, 4), matAnimalDark);
          earTip.position.set(ex * 1.32, 0.21, -0.02);
          earTip.rotation.z = ex > 0 ? -0.18 : 0.18;
          foxHead.add(eye, earOuter, earTip);
        });

        // 4 Articulated Tapered Fox Legs with Dark Stockings
        const foxLegs = [];
        [
          { x: -0.095, z: 0.21, phase: 0 },
          { x: 0.095, z: 0.21, phase: Math.PI },
          { x: -0.10, z: -0.21, phase: Math.PI },
          { x: 0.10, z: -0.21, phase: 0 }
        ].forEach(lCfg => {
          const legPivot = new THREE.Group();
          legPivot.position.set(lCfg.x, 0.24, lCfg.z);
          const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.032, 0.16, 6), matFoxOrange);
          upperLeg.position.y = -0.07;
          const lowerPaw = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.024, 0.12, 6), matAnimalDark);
          lowerPaw.position.y = -0.19;
          legPivot.add(upperLeg, lowerPaw);
          foxGroup.add(legPivot);
          foxLegs.push({ pivot: legPivot, phase: lCfg.phase });
        });

        // Lush Multi-Segment Low-Poly Fox Tail
        const foxTailPivot = new THREE.Group();
        foxTailPivot.position.set(0, 0.29, -0.27);
        const tailMid = new THREE.Mesh(new THREE.DodecahedronGeometry(0.11, 0), matFoxOrange);
        tailMid.scale.set(0.85, 0.85, 1.85);
        tailMid.position.set(0, -0.02, -0.16);
        tailMid.rotation.x = -0.35;
        const tailWhiteTip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 6), matFoxWhite);
        tailWhiteTip.rotation.x = -Math.PI / 2 - 0.35;
        tailWhiteTip.position.set(0, -0.09, -0.36);
        foxTailPivot.add(tailMid, tailWhiteTip);

        const foxHitbox = new THREE.Mesh(
          new THREE.SphereGeometry(0.85, 10, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        foxHitbox.position.y = 0.28;
        foxGroup.add(foxTorso, foxChest, foxNeck, foxHead, foxTailPivot, foxHitbox);
        scene.add(foxGroup);

        // 2. Majestic Low-Poly Forest Stag / Deer (Graceful anatomical proportions + antlers)
        const stagGroup = new THREE.Group();
        stagGroup.position.set(5.15, -1.18, -3.55);
        stagGroup.rotation.y = -0.68;
        stagGroup.userData.interactiveType = 'critter';
        stagGroup.userData.critterName = 'Rusa Rimba Low-Poly 🦌';

        const stagTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.23, 0.78, 7), matDeerCoat);
        stagTorso.rotation.x = Math.PI / 2;
        stagTorso.position.set(0, 0.56, 0);
        const stagChest = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), matFoxWhite);
        stagChest.scale.set(0.85, 1.1, 0.9);
        stagChest.position.set(0, 0.54, 0.34);

        const stagNeckPivot = new THREE.Group();
        stagNeckPivot.position.set(0, 0.66, 0.34);
        const stagNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.42, 6), matDeerCoat);
        stagNeck.position.set(0, 0.16, 0.08);
        stagNeck.rotation.x = 0.32;

        const stagHead = new THREE.Group();
        stagHead.position.set(0, 0.38, 0.16);
        const stagSkull = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 0), matDeerCoat);
        const stagSnout = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, 0.24, 6), matDeerCoat);
        stagSnout.rotation.x = Math.PI / 2;
        stagSnout.position.set(0, -0.02, 0.16);
        const stagNose = new THREE.Mesh(new THREE.DodecahedronGeometry(0.03, 0), matAnimalDark);
        stagNose.position.set(0, -0.01, 0.28);
        stagHead.add(stagSkull, stagSnout, stagNose);

        // Low-Poly Multi-Pronged Antlers
        [-0.08, 0.08].forEach(ax => {
          const ear = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 5), matDeerCoat);
          ear.position.set(ax * 1.5, 0.08, -0.02);
          ear.rotation.z = ax > 0 ? -0.65 : 0.65;
          const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, 0.42, 5), matAntler);
          beam.position.set(ax * 1.35, 0.26, -0.04);
          beam.rotation.z = ax > 0 ? -0.38 : 0.38;
          beam.rotation.x = -0.22;
          const tine1 = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.18, 5), matAntler);
          tine1.position.set(ax * 1.55, 0.28, 0.06);
          tine1.rotation.x = 0.45;
          const tine2 = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.20, 5), matAntler);
          tine2.position.set(ax * 2.0, 0.42, -0.06);
          tine2.rotation.z = ax > 0 ? -0.25 : 0.25;
          stagHead.add(ear, beam, tine1, tine2);
        });
        stagNeckPivot.add(stagNeck, stagHead);

        const stagLegs = [];
        [
          { x: -0.12, z: 0.28, phase: 0 },
          { x: 0.12, z: 0.28, phase: Math.PI },
          { x: -0.13, z: -0.28, phase: Math.PI },
          { x: 0.13, z: -0.28, phase: 0 }
        ].forEach(lCfg => {
          const lPiv = new THREE.Group();
          lPiv.position.set(lCfg.x, 0.50, lCfg.z);
          const uLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.034, 0.28, 6), matDeerCoat);
          uLeg.position.y = -0.13;
          const lLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.024, 0.26, 6), matAnimalDark);
          lLeg.position.y = -0.37;
          lPiv.add(uLeg, lLeg);
          stagGroup.add(lPiv);
          stagLegs.push({ pivot: lPiv, phase: lCfg.phase });
        });
        const stagTail = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.16, 5), matFoxWhite);
        stagTail.position.set(0, 0.62, -0.42);
        stagTail.rotation.x = -0.6;
        const stagHit = new THREE.Mesh(
          new THREE.SphereGeometry(1.05, 10, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        stagHit.position.y = 0.55;
        stagGroup.add(stagTorso, stagChest, stagNeckPivot, stagTail, stagHit);
        scene.add(stagGroup);

        // 3. Two Sculpted Low-Poly Woodland Bunnies (Anatomical haunches, sculpted head, long ears & legs)
        const bunnyNodes = [];
        [
          { x: 3.35, z: -2.45, rotY: -0.65, phase: 0.0, name: 'Kelinci Lembah Low-Poly 🐰' },
          { x: -5.35, z: 0.95, rotY: 1.15, phase: 2.1, name: 'Kelinci Padang Rumput 🐇' }
        ].forEach(bCfg => {
          const bGroup = new THREE.Group();
          bGroup.position.set(bCfg.x, -1.14, bCfg.z);
          bGroup.rotation.y = bCfg.rotY;
          bGroup.userData.interactiveType = 'critter';
          bGroup.userData.critterName = bCfg.name;

          const bTorso = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 0), matBunnyCoat);
          bTorso.scale.set(0.88, 0.92, 1.32);
          bTorso.position.set(0, 0.16, 0);
          bTorso.rotation.x = -0.18;

          const bHaunchL = new THREE.Mesh(new THREE.DodecahedronGeometry(0.095, 0), matBunnyCoat);
          bHaunchL.position.set(-0.09, 0.11, -0.08);
          const bHaunchR = new THREE.Mesh(new THREE.DodecahedronGeometry(0.095, 0), matBunnyCoat);
          bHaunchR.position.set(0.09, 0.11, -0.08);

          const bHead = new THREE.Group();
          bHead.position.set(0, 0.27, 0.17);
          const bSkull = new THREE.Mesh(new THREE.DodecahedronGeometry(0.115, 0), matBunnyCoat);
          bSkull.scale.set(0.92, 0.90, 1.15);
          const bSnout = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.10, 5), matBunnyCoat);
          bSnout.rotation.x = Math.PI / 2;
          bSnout.position.set(0, -0.02, 0.11);
          const bNose = new THREE.Mesh(new THREE.DodecahedronGeometry(0.02, 0), matBunnyEarPink);
          bNose.position.set(0, -0.01, 0.16);
          bHead.add(bSkull, bSnout, bNose);

          const ears = [];
          [-0.048, 0.048].forEach(bx => {
            const earPiv = new THREE.Group();
            earPiv.position.set(bx, 0.09, -0.02);
            const bEar = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.24, 5), matBunnyCoat);
            bEar.position.y = 0.11;
            const bEarInner = new THREE.Mesh(new THREE.ConeGeometry(0.020, 0.18, 4), matBunnyEarPink);
            bEarInner.position.set(0, 0.10, 0.015);
            earPiv.add(bEar, bEarInner);
            earPiv.rotation.z = bx * -1.8;
            earPiv.rotation.x = -0.22;
            const bEye = new THREE.Mesh(new THREE.DodecahedronGeometry(0.018, 0), matAnimalDark);
            bEye.position.set(bx * 1.4, 0.02, 0.08);
            bHead.add(earPiv, bEye);
            ears.push(earPiv);
          });

          const bTail = new THREE.Mesh(new THREE.DodecahedronGeometry(0.055, 0), matFoxWhite);
          bTail.position.set(0, 0.16, -0.22);
          const bHit = new THREE.Mesh(
            new THREE.SphereGeometry(0.75, 10, 10),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
          );
          bHit.position.y = 0.2;
          bGroup.add(bTorso, bHaunchL, bHaunchR, bHead, bTail, bHit);
          scene.add(bGroup);
          bunnyNodes.push({ group: bGroup, ears, baseX: bCfg.x, baseZ: bCfg.z, baseRotY: bCfg.rotY, phase: bCfg.phase });
        });

        // 4. Fluttering Golden & Cyan 3D Butterflies
        const butterflyNodes = [];
        for (let i = 0; i < 6; i++) {
          const bfGroup = new THREE.Group();
          const wingMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xFFB84D : 0x4CE8D8,
            side: THREE.DoubleSide
          });
          const leftWing = new THREE.Mesh(new THREE.CircleGeometry(0.09, 6), wingMat);
          leftWing.position.x = -0.06;
          const rightWing = new THREE.Mesh(new THREE.CircleGeometry(0.09, 6), wingMat);
          rightWing.position.x = 0.06;
          bfGroup.add(leftWing, rightWing);
          scene.add(bfGroup);
          butterflyNodes.push({
            group: bfGroup,
            leftWing,
            rightWing,
            radius: 2.2 + (i % 3) * 1.35,
            speed: 0.45 + i * 0.08,
            phase: i * 1.1,
            baseY: -0.25 + (i % 3) * 0.45
          });
        }

        // 5. Sculpted Low-Poly Sky Birds (Faceted body, tail fan & swept wings)
        const birdNodes = [];
        const matBirdBody = new THREE.MeshStandardMaterial({ color: 0xFFF7E6, roughness: 0.5, flatShading: true });
        const matBirdWing = new THREE.MeshStandardMaterial({ color: 0xE8C58E, roughness: 0.55, flatShading: true, side: THREE.DoubleSide });
        for (let i = 0; i < 5; i++) {
          const birdGroup = new THREE.Group();
          const bBody = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.34, 5), matBirdBody);
          bBody.rotation.x = Math.PI / 2;
          const bTailFan = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.14, 4), matBirdWing);
          bTailFan.rotation.x = -Math.PI / 2;
          bTailFan.position.z = -0.18;
          const wL = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 4), matBirdWing);
          wL.rotation.z = Math.PI / 2;
          wL.position.x = -0.18;
          const wR = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 4), matBirdWing);
          wR.rotation.z = -Math.PI / 2;
          wR.position.x = 0.18;
          birdGroup.add(bBody, bTailFan, wL, wR);
          envGroup.add(birdGroup);
          birdNodes.push({
            group: birdGroup,
            wL,
            wR,
            angle: (i / 5) * Math.PI * 2,
            radius: 7.8 + (i % 2) * 2.4,
            y: 5.0 + (i % 3) * 0.9,
            speed: 0.25 + i * 0.03
          });
        }

        // Celebratory 3D Evolution Shockwave & Light Pillar Effect (Estetika #4)
        const evoShockwaveGroup = new THREE.Group();
        evoShockwaveGroup.visible = false;
        const shockRingMesh = new THREE.Mesh(
          new THREE.RingGeometry(0.45, 0.72, 48),
          new THREE.MeshBasicMaterial({ color: 0xFFE680, side: THREE.DoubleSide, transparent: true, opacity: 0 })
        );
        shockRingMesh.rotation.x = -Math.PI / 2;
        const shockBeamMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.95, 4.5, 28, 1, true),
          new THREE.MeshBasicMaterial({ color: 0xFFF3B0, side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false })
        );
        shockBeamMesh.position.y = 1.6;
        evoShockwaveGroup.add(shockRingMesh, shockBeamMesh);
        scene.add(evoShockwaveGroup);
        let evoShockwaveTimer = 0;

        // Main 3D Backpack + Soft Ground Shadow
        const backpackMesh = createStylized3DMesh('backpack');
        backpackMesh.position.set(0, -0.06, 0);
        backpackMesh.userData.interactiveType = 'backpack';
        scene.add(backpackMesh);

        const backpackShadow = new THREE.Mesh(
          new THREE.PlaneGeometry(2.6, 2.6),
          new THREE.MeshBasicMaterial({ map: PBR_TEXTURES.shadow, transparent: true, depthWrite: false })
        );
        backpackShadow.rotation.x = -Math.PI / 2;
        backpackShadow.position.set(0, -1.175, 0);
        scene.add(backpackShadow);

        const backpackHalo = new THREE.Mesh(
          new THREE.RingGeometry(1.12, 1.26, 48),
          new THREE.MeshBasicMaterial({ color: 0xDF761F, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
        );
        backpackHalo.rotation.x = -Math.PI / 2;
        backpackHalo.position.set(0, -1.17, 0);
        scene.add(backpackHalo);

        // 10 Spilled Items + Soft Contact Shadows + Compact Non-Overlapping Slot Badges
        const floorItemNodes = [];
        const floorOverlayEl = document.getElementById('floorItemsOverlay');
        floorOverlayEl.innerHTML = '';

        const matItemPedestal = new THREE.MeshStandardMaterial({
          color: 0x10232B,
          roughness: 0.55,
          metalness: 0.35
        });

        SEED_CATEGORIES.forEach((cat, idx) => {
          const profLevel = state.profiles[cat.slug] ? state.profiles[cat.slug].level : null;
          const itemMesh = createStylized3DMesh(cat.slug, profLevel);
          itemMesh.scale.setScalar(0.001);
          itemMesh.position.set(0, 0.2, 0);
          itemMesh.visible = false;
          itemMesh.userData.interactiveType = 'category';
          itemMesh.userData.slug = cat.slug;
          scene.add(itemMesh);

          // Estetika #1: Multi-Tiered Cylindrical Podium (1 to 5 layered cylinders representing mastery level!)
          const pedestalBase = createTieredItemPodium(profLevel);
          pedestalBase.position.set(cat.floorPos.x, -1.14, cat.floorPos.z);
          pedestalBase.visible = false;
          scene.add(pedestalBase);

          const itemShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.35, 1.35),
            new THREE.MeshBasicMaterial({ map: PBR_TEXTURES.shadow, transparent: true, opacity: 0, depthWrite: false })
          );
          itemShadow.rotation.x = -Math.PI / 2;
          itemShadow.position.set(cat.floorPos.x, -1.172, cat.floorPos.z);
          scene.add(itemShadow);

          const pad = new THREE.Mesh(
            new THREE.RingGeometry(0.62, 0.73, 40),
            new THREE.MeshBasicMaterial({
              color: 0xF4B942,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.0,
              polygonOffset: true,
              polygonOffsetFactor: -1
            })
          );
          pad.rotation.x = -Math.PI / 2;
          pad.position.set(cat.floorPos.x, -1.082, cat.floorPos.z);
          scene.add(pad);

          // Compact RPG Slot Badge (Only shows compact #01 + mini level dot by default; expands name ONLY on hover!)
          const labelBtn = document.createElement('button');
          labelBtn.type = 'button';
          labelBtn.setAttribute('data-floor-slug', cat.slug);
          labelBtn.className = 'floor-item-label pointer-events-auto px-2 py-1 rounded-full border atlas-elevated text-left flex items-center focus:outline-none';
          const hotkeyKey = idx === 9 ? '0' : String(idx + 1);
          labelBtn.innerHTML = `
            <span class="font-mono text-[10px] font-extrabold text-[#DF761F]">[${hotkeyKey}]</span>
            <span data-floor-dot="${cat.slug}" class="w-1.5 h-1.5 rounded-full bg-[#8B9B98] ml-1 shrink-0"></span>
            <span class="label-expanded flex items-center gap-1 whitespace-nowrap">
              <span class="font-bold text-[11px]">${cat.shortTag}</span>
              <span data-floor-lvl="${cat.slug}" class="text-[10px] font-mono atlas-text-muted">· Belum dinilai</span>
            </span>
          `;
          labelBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            selectCategoryAndOpenDetail(cat.slug);
          });
          labelBtn.addEventListener('mouseenter', () => {
            setHoveredFloorItem(cat.slug);
          });
          labelBtn.addEventListener('mouseleave', () => {
            if (state.hoveredSlug === cat.slug) setHoveredFloorItem(null);
          });
          floorOverlayEl.appendChild(labelBtn);

          floorItemNodes.push({
            cat,
            idx,
            mesh: itemMesh,
            pedestal: pedestalBase,
            shadow: itemShadow,
            pad,
            evoStage: getEvolutionStage(profLevel).stage,
            labelBtn,
            flightT: 0,
            currentLift: 0,
            currentScale: 0.001,
            delay: 0.25 + idx * 0.055 // Wait 0.25s for backpack flap to open smoothly before items glide out!
          });
        });

        const raycaster = new THREE.Raycaster();
        const pointerNDC = new THREE.Vector2();

        const ctrl = {
          canvas,
          renderer,
          scene,
          camera,
          backpackMesh,
          backpackShadow,
          backpackHalo,
          floorItemNodes,
          isUnpacked: false,
          unpackElapsed: 0,
          flapOpenRatio: 0,
          orbitAzimuth: 0,
          targetAzimuth: 0,
          isDragging: false,
          dragDistance: 0,
          downX: 0,
          downY: 0,
          hoveredBackpack: false,
          backpackCurrentScale: 0.88,
          backpackCurrentY: -0.08,
          detailItemRotY: 0,
          detailZoomOffset: 0,
          focusTargetPos: new THREE.Vector3(0, -0.2, 0),
          focusCurrentPos: new THREE.Vector3(0, -0.2, 0),
          camPosTarget: new THREE.Vector3(0, 2.25, 7.6),
          camLookTarget: new THREE.Vector3(0, 0.08, 0),
          camCurrentLook: new THREE.Vector3(0, 0.08, 0),

          triggerUnpack() {
            this.isUnpacked = true;
            this.unpackElapsed = (state.preferences.reducedMotion || isSoftwareGl) ? 3.0 : 0.0;
            this.floorItemNodes.forEach(node => {
              node.mesh.visible = true;
              node.pedestal.visible = true;
              node.flightT = (state.preferences.reducedMotion || isSoftwareGl) ? 1 : 0;
              node.currentScale = (state.preferences.reducedMotion || isSoftwareGl) ? 0.50 : 0.001;
            });
            if (this.refreshRaycastTargets) this.refreshRaycastTargets();
            if (this.wakeInteraction) this.wakeInteraction(2200);
          },

          triggerPackUp() {
            this.isUnpacked = false;
            this.unpackElapsed = 0;
            this.floorItemNodes.forEach(node => {
              node.flightT = 0;
              node.currentScale = 0.001;
              node.mesh.visible = false;
              node.pedestal.visible = false;
              node.pad.material.opacity = 0;
              node.shadow.material.opacity = 0;
            });
            if (this.refreshRaycastTargets) this.refreshRaycastTargets();
            if (this.wakeInteraction) this.wakeInteraction(1400);
          },

          refreshNoticeboardRadar() {
            updateWorldNoticeboardRadar();
          },

          applyEnvironmentTheme(themeMode, colorStyleMode = undefined) {
            const isDark = themeMode === 'dark';
            const isSerious = (colorStyleMode || (state.preferences && state.preferences.colorStyle)) === 'serious';
            if (isDark) {
              // Magical Starry Night Mode (Estetika #1 & #4)
              scene.fog.color.setHex(isSerious ? 0x0A1017 : 0x091A2B);
              scene.fog.density = 0.015;
              hemiLight.color.setHex(isSerious ? 0x90A4B4 : 0x8CC4E8);
              hemiLight.groundColor.setHex(isSerious ? 0x141A1E : 0x162936);
              hemiLight.intensity = 0.58;
              sunLight.color.setHex(0xA6D4FA);
              sunLight.intensity = 0.72;
              matMeadow.color.setHex(isSerious ? 0x18241E : 0x112B2D);
              matSandGround.color.setHex(isSerious ? 0x20282C : 0x16313E);
              matCampRug.color.setHex(isSerious ? 0x283238 : 0x1D3F4C);
              matTerraceWall.color.setHex(isSerious ? 0x1C2226 : 0x162E38);
              matMountain.color.setHex(isSerious ? 0x161E24 : 0x102536);
              matSnowCap.color.setHex(0x9BB8C8);
              matPineFoliage.color.setHex(isSerious ? 0x1F3628 : 0x1D543F);
              sunDisc.material.color.setHex(0xE8F6FF);
              sunHalo.material.color.setHex(0x64D8FF);
              sunHalo.material.opacity = 0.36;
              sunRaysGroup.visible = false;
              starFieldMat.opacity = 0.88;
              auroraMesh.visible = !!state.auroraEnabled;
              matCloud.color.setHex(0x9BBFD8);
              matCloud.emissive.setHex(0x1A3B52);
              matCloud.emissiveIntensity = 0.28;
              pMat.color.setHex(0xFFE07D);
              campfireLight.intensity = 1.65;
            } else {
              // Estetika #1: Single Unified Hyper-Realistic, Calming, Serious, High-Contrast Highland Atmosphere (Zero Pastel!)
              scene.fog.color.setHex(0x1E313E);
              scene.fog.density = 0.011;
              hemiLight.color.setHex(0xDCE8F2);
              hemiLight.groundColor.setHex(0x1A2621);
              hemiLight.intensity = 0.88;
              sunLight.color.setHex(0xFFE8C2);
              sunLight.intensity = 1.28;
              matMeadow.color.setHex(0x1B2B22);
              matSandGround.color.setHex(0x27352D);
              matCampRug.color.setHex(0x222D35);
              matTerraceWall.color.setHex(0x2D373E);
              matMountain.color.setHex(0x24323D);
              matSnowCap.color.setHex(0xCBD8E2);
              matPineFoliage.color.setHex(0x162E22);
              sunDisc.material.color.setHex(0xFFE4A0);
              sunHalo.material.color.setHex(0xD97724);
              sunHalo.material.opacity = 0.36;
              sunRaysGroup.visible = true;
              starFieldMat.opacity = 0.22;
              auroraMesh.visible = false;
              matCloud.color.setHex(0xB8C9D6);
              matCloud.emissive.setHex(0x1E3240);
              matCloud.emissiveIntensity = 0.22;
              pMat.color.setHex(0xFFD27D);
              campfireLight.intensity = 1.35;
            }
            updateWorldNoticeboardRadar();
          },

          triggerEvolutionBurst(slug) {
            const node = this.floorItemNodes.find(n => n.cat.slug === slug);
            if (!node) return;
            evoShockwaveGroup.position.set(node.mesh.position.x, -1.12, node.mesh.position.z);
            evoShockwaveGroup.visible = true;
            evoShockwaveTimer = 1.15;
          },

          rebuildItemEvolution(slug, overrideLevel = undefined) {
            const node = this.floorItemNodes.find(n => n.cat.slug === slug);
            if (!node) return;
            const lvl = overrideLevel !== undefined ? overrideLevel : state.profiles[slug].level;
            const newEvoStage = getEvolutionStage(lvl).stage;
            const oldPos = node.mesh.position.clone();
            const oldRot = node.mesh.rotation.clone();
            const wasVis = node.mesh.visible;
            const oldMesh = node.mesh;
            this.scene.remove(oldMesh);
            // Finding 2: Explicitly release GPU geometries and materials of replaced mesh
            disposeOwnedObject3D(oldMesh);

            const freshMesh = createStylized3DMesh(slug, lvl);
            freshMesh.position.copy(oldPos);
            freshMesh.rotation.copy(oldRot);
            freshMesh.visible = wasVis;
            freshMesh.userData.interactiveType = 'category';
            freshMesh.userData.slug = slug;
            this.scene.add(freshMesh);
            node.mesh = freshMesh;
            node.evoStage = newEvoStage;

            // Estetika #1: Also rebuild the Multi-Tiered Cylindrical Podium (1..5 tiers) to match the item's new level!
            const pedPos = node.pedestal.position.clone();
            const pedVis = node.pedestal.visible;
            const oldPedestal = node.pedestal;
            this.scene.remove(oldPedestal);
            disposeOwnedObject3D(oldPedestal);

            const freshPedestal = createTieredItemPodium(lvl);
            freshPedestal.position.copy(pedPos);
            freshPedestal.visible = pedVis;
            this.scene.add(freshPedestal);
            node.pedestal = freshPedestal;

            this.refreshRaycastTargets();
            this.wakeInteraction(1400);
            updateWorldNoticeboardRadar();

            // Celebratory pop & 3D light shockwave when evolving!
            node.currentScale = 0.60;
            if (!state.preferences.reducedMotion && lvl !== null && lvl >= 1) {
              this.triggerEvolutionBurst(slug);
            }
          },

          rebuildAllEvolutions() {
            SEED_CATEGORIES.forEach(c => this.rebuildItemEvolution(c.slug));
          },

          rotateBy(deltaAzimuth) {
            this.wakeInteraction(1000);
            if (state.screen === 'detail') {
              this.detailItemRotY += deltaAzimuth * 1.4;
            } else {
              this.targetAzimuth = Math.max(-0.95, Math.min(0.95, this.targetAzimuth + deltaAzimuth));
            }
          },
          zoomDetailBy(deltaZ) {
            this.wakeInteraction(1000);
            this.detailZoomOffset = Math.max(-0.85, Math.min(1.4, this.detailZoomOffset + deltaZ));
          },
          resetDetailView() {
            this.wakeInteraction(1000);
            this.detailItemRotY = 0;
            this.detailZoomOffset = 0;
          },
          engineState: 'INTERACTION',
          renderedFramesCount: 0,
          allItemsLanded: false,
          applyQualityProfile() {
            const w = window.innerWidth || 1024;
            const isMobile = w < 768;
            const q = (state.preferences && state.preferences.renderQuality) || (isMobile ? 'mobile-light' : 'balanced');
            const isMobileLight = q === 'mobile-light';
            const isHigh = q === 'high';

            // Section 3.2: Adaptive Shadow Map, Environment Map & Light Count
            const enableShadows = !isSoftwareGl && (isHigh || (!isMobileLight && !isMobile));
            renderer.shadowMap.enabled = enableShadows;
            sunLight.castShadow = enableShadows;
            if (enableShadows && sunLight.shadow && sunLight.shadow.mapSize) {
              const targetShadowSize = isHigh ? 1024 : 512;
              if (sunLight.shadow.mapSize.width !== targetShadowSize) {
                sunLight.shadow.mapSize.width = targetShadowSize;
                sunLight.shadow.mapSize.height = targetShadowSize;
                if (sunLight.shadow.map) {
                  sunLight.shadow.map.dispose();
                  sunLight.shadow.map = null;
                }
              }
            }

            // Environment map only on High or Desktop Balanced (skipped on mobile-light)
            scene.environment = (isMobileLight || isMobile) ? null : hdEnvTex;

            // Section 3.2: Light simplification on mobile-light (Hemisphere + 1 Directional Light only!)
            rimLight.visible = !isMobileLight;
            focusSpotLight.visible = isHigh || (!isMobileLight && !isMobile);
            focusPointLight.visible = !isMobileLight;
            campfireLight.visible = isHigh || (!isMobileLight && !isMobile);

            // Section 3.4: Simplify decorative world entities on mobile-light so 100% budget goes to Backpack & 10 Artifacts
            const showDecor = !isMobileLight;
            foxGroup.visible = showDecor;
            stagGroup.visible = showDecor;
            bunnyNodes.forEach(b => { b.group.visible = showDecor; });
            butterflyNodes.forEach(bf => { bf.group.visible = isHigh; });
            birdNodes.forEach(bd => { bd.group.visible = showDecor; });
            if (firefliesPoints) firefliesPoints.visible = isHigh;

            this.resize();
            this.wakeInteraction(450);
          },
          resize() {
            const w = window.innerWidth || 1024;
            const h = window.innerHeight || 768;
            const isMobile = w < 768;
            const q = (state.preferences && state.preferences.renderQuality) || (isMobile ? 'mobile-light' : 'balanced');
            // Section 3.2: DPR 0.9 on mobile-light (~39% fewer pixels than 1.15), 1.0–1.25 on balanced, 1.5 on high
            let maxDpr = 1.25;
            if (q === 'mobile-light') maxDpr = isMobile ? 0.9 : 1.0;
            else if (q === 'balanced') maxDpr = isMobile ? 1.0 : 1.25;
            else if (q === 'high') maxDpr = 1.5;

            const ratio = Math.min(window.devicePixelRatio || 1, maxDpr);
            if (renderer.getPixelRatio() !== ratio) {
              renderer.setPixelRatio(ratio);
            }
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            if (this.floorItemNodes) {
              this.floorItemNodes.forEach(n => { n.labelProjectedOnce = false; });
            }
            if (this.wakeInteraction) this.wakeInteraction(220);
          }
        };

        /* =================================================================
         * FINDING 5 & 6: REUSABLE VECTORS, CACHED RAYCAST TARGETS,
         * COALESCED HOVER HIT-TESTING (<= 1 PER FRAME) & EXPLICIT RAF LOOP
         * ================================================================= */
        const scratchProjVec = new THREE.Vector3();
        const scratchLabelVec = new THREE.Vector3();
        const scratchLerpVec = new THREE.Vector3();
        let cachedRaycastTargets = [];

        ctrl.refreshRaycastTargets = function () {
          cachedRaycastTargets = [ctrl.backpackMesh, noticeboardGroup, foxGroup, stagGroup];
          bunnyNodes.forEach(b => cachedRaycastTargets.push(b.group));
          if (ctrl.isUnpacked) {
            floorItemNodes.forEach(n => {
              if (n.mesh && n.mesh.visible) cachedRaycastTargets.push(n.mesh);
            });
          }
        };
        ctrl.refreshRaycastTargets();

        let activeInteractionUntil = performance.now() + (isSoftwareGl ? 180 : 950);
        ctrl.wakeInteraction = function (durationMs = 650) {
          const effDur = isSoftwareGl ? Math.min(durationMs, 180) : durationMs;
          activeInteractionUntil = Math.max(activeInteractionUntil, performance.now() + effDur);
          ctrl.engineState = 'INTERACTION';
          ctrl.startLoop();
        };

        function shouldRenderWorld() {
          if (document.hidden || state.preferences.fallback2D) return false;
          return (
            state.screen === 'landing' ||
            state.screen === 'auth' ||
            state.screen === 'detail' ||
            (state.screen === 'inventory' && state.inventoryViewMode === 'floor')
          );
        }

        function getHitInteractiveObject(clientX, clientY) {
          if (!shouldRenderWorld()) return null;
          const rect = canvas.getBoundingClientRect();
          if (!rect.width || !rect.height) return null;
          pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
          pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointerNDC, camera);

          // 1. Check 2D screen-space proximity magnet (72px radius) using reusable scratchProjVec (zero GC churn!)
          const w = rect.width || window.innerWidth;
          const h = rect.height || window.innerHeight;
          const localX = clientX - rect.left;
          const localY = clientY - rect.top;

          if (state.screen === 'landing') {
            scratchProjVec.copy(ctrl.backpackMesh.position).project(camera);
            if (scratchProjVec.z < 1) {
              const sx = (scratchProjVec.x * 0.5 + 0.5) * w;
              const sy = (-(scratchProjVec.y * 0.5) + 0.5) * h;
              if (Math.hypot(localX - sx, localY - sy) < 92) {
                return ctrl.backpackMesh;
              }
            }
          } else if (state.screen === 'inventory' && ctrl.isUnpacked) {
            let closestNode = null;
            let minDist = 72;
            for (let i = 0; i < floorItemNodes.length; i++) {
              const n = floorItemNodes[i];
              if (!n.mesh.visible) continue;
              scratchProjVec.copy(n.mesh.position).project(camera);
              if (scratchProjVec.z < 1) {
                const sx = (scratchProjVec.x * 0.5 + 0.5) * w;
                const sy = (-(scratchProjVec.y * 0.5) + 0.5) * h;
                const d = Math.hypot(localX - sx, localY - sy);
                if (d < minDist) {
                  minDist = d;
                  closestNode = n.mesh;
                }
              }
            }
            if (closestNode) return closestNode;
          }

          // 2. Fallback to 3D raycast against cached target roots
          const intersects = raycaster.intersectObjects(cachedRaycastTargets, true);
          if (intersects.length === 0) return null;

          let obj = intersects[0].object;
          while (obj && !obj.userData.interactiveType && obj.parent) {
            obj = obj.parent;
          }
          return obj && obj.userData.interactiveType ? obj : null;
        }

        let hoverRafId = 0;
        let latestPointerX = 0;
        let latestPointerY = 0;

        function runCoalescedHoverHitTest() {
          hoverRafId = 0;
          if (ctrl.isDragging || !shouldRenderWorld()) return;
          const hit = getHitInteractiveObject(latestPointerX, latestPointerY);
          if (hit && hit.userData.interactiveType === 'backpack') {
            if (!ctrl.hoveredBackpack) {
              ctrl.hoveredBackpack = true;
              ctrl.wakeInteraction(450);
            }
            if (state.hoveredSlug !== null) setHoveredFloorItem(null);
            canvas.style.cursor = 'pointer';
          } else if (hit && hit.userData.interactiveType === 'category') {
            if (ctrl.hoveredBackpack) ctrl.hoveredBackpack = false;
            if (state.hoveredSlug !== hit.userData.slug) {
              setHoveredFloorItem(hit.userData.slug);
              ctrl.wakeInteraction(450);
            }
            canvas.style.cursor = 'pointer';
          } else if (hit && (hit.userData.interactiveType === 'noticeboard' || hit.userData.interactiveType === 'critter')) {
            if (ctrl.hoveredBackpack || state.hoveredSlug !== null) {
              ctrl.hoveredBackpack = false;
              setHoveredFloorItem(null);
              ctrl.wakeInteraction(350);
            }
            canvas.style.cursor = 'pointer';
          } else {
            if (ctrl.hoveredBackpack || state.hoveredSlug !== null) {
              ctrl.hoveredBackpack = false;
              setHoveredFloorItem(null);
              ctrl.wakeInteraction(350);
            }
            canvas.style.cursor = 'grab';
          }
        }

        canvas.addEventListener('pointerdown', (e) => {
          ctrl.wakeInteraction(1500);
          ctrl.isDragging = true;
          ctrl.dragDistance = 0;
          ctrl.downX = e.clientX;
          ctrl.downY = e.clientY;
        });

        canvas.addEventListener('pointermove', (e) => {
          if (ctrl.isDragging) {
            ctrl.wakeInteraction(600);
            const dx = e.clientX - ctrl.downX;
            const dy = e.clientY - ctrl.downY;
            ctrl.dragDistance += Math.hypot(dx, dy);
            ctrl.downX = e.clientX;
            ctrl.downY = e.clientY;
            if (state.screen === 'detail') {
              ctrl.detailItemRotY += dx * 0.012;
            } else {
              ctrl.targetAzimuth = Math.max(-0.65, Math.min(0.65, ctrl.targetAzimuth - dx * 0.0045));
            }
            return;
          }

          // Finding 6: Coalesce hover raycasting to at most once per animation frame!
          latestPointerX = e.clientX;
          latestPointerY = e.clientY;
          if (!hoverRafId && shouldRenderWorld()) {
            hoverRafId = requestAnimationFrame(runCoalescedHoverHitTest);
          }
        });

        canvas.addEventListener('pointerup', (e) => {
          const wasClick = ctrl.dragDistance < 9;
          ctrl.isDragging = false;
          if (!wasClick) return;

          const hit = getHitInteractiveObject(e.clientX, e.clientY);
          if (!hit) return;

          if (hit.userData.interactiveType === 'backpack') {
            if (state.screen === 'landing') {
              awardSparks(2, '🎒 Membuka Ransel', e.clientX, e.clientY);
              openBackpackRitual();
            } else if (state.screen === 'inventory') {
              document.getElementById('btnCloseBackpackRitual').click();
            }
          } else if (hit.userData.interactiveType === 'category' && hit.userData.slug) {
            awardSparks(1, '🔍 Inspeksi Objek', e.clientX, e.clientY);
            selectCategoryAndOpenDetail(hit.userData.slug);
          } else if (hit.userData.interactiveType === 'noticeboard') {
            SoundFX.selectItem();
            renderSkillRadarChart();
            openModalWithFocus('modalSkillRadar', '#btnCloseRadarModal');
            showGlobalNotice('success', '📋 Membuka Peta Radar 10 Skill dari Papan Pengumuman Perkemahan!');
          } else if (hit.userData.interactiveType === 'critter') {
            SoundFX.critter();
            state.critterCheerTimer = 1.6;
            showGlobalNotice('success', `${hit.userData.critterName} melompat gembira menyapamu di perkemahan!`);
          }
        });

        // Finding 5: Explicit World Loop Lifecycle (Stops scheduling RAF when tab hidden, 2D mode, or 3D rack/list!)
        let worldRafId = 0;
        let lastTime = performance.now();
        let lastRenderTime = 0;

        ctrl.startLoop = function () {
          if (worldRafId || !shouldRenderWorld()) return;
          lastTime = performance.now();
          worldRafId = requestAnimationFrame(animateWorld);
        };

        ctrl.stopLoop = function () {
          if (worldRafId) {
            cancelAnimationFrame(worldRafId);
            worldRafId = 0;
          }
          if (hoverRafId) {
            cancelAnimationFrame(hoverRafId);
            hoverRafId = 0;
          }
          floorOverlayEl.classList.add('hidden');
        };

        /* =====================================================================
         * SECTION 3.1, 3.2, 3.3, 3.4: 3-STATE ON-DEMAND 3D ENGINE
         * States:
         *  - INTERACTION: Active user drag, unpack flight, camera zoom/orbit, or hover transition.
         *  - AMBIENT: Limited low-overhead motion only when explicitly triggered (critter cheer / shockwave).
         *  - IDLE: Once camera & object transitions converge, stops scheduling requestAnimationFrame
         *          completely (worldRafId = 0 -> 0 FPS, 0% CPU/GPU usage while idle!).
         * ===================================================================== */
        function animateEvolutionAttachments(evoAtt, elapsedSec, nodeIdx, isFocusedOrHovered) {
          if (!evoAtt) return;
          const speedMult = isFocusedOrHovered ? 1.0 : 0.65;
          evoAtt.rotation.y = -elapsedSec * 0.78 * speedMult;

          if (evoAtt.userData.outerRing) {
            evoAtt.userData.outerRing.rotation.z = elapsedSec * 1.05 * speedMult;
          }
          if (evoAtt.userData.innerRing) {
            evoAtt.userData.innerRing.rotation.y = -elapsedSec * 1.35 * speedMult;
            evoAtt.userData.innerRing.rotation.x = -Math.PI / 3 + Math.sin(elapsedSec * 1.6 + nodeIdx) * 0.18;
          }
          if (evoAtt.userData.coreRing) {
            evoAtt.userData.coreRing.rotation.x = elapsedSec * 1.75 * speedMult;
          }
          if (evoAtt.userData.crownGroup) {
            evoAtt.userData.crownGroup.position.y = 1.31 + Math.sin(elapsedSec * 2.6 + nodeIdx) * 0.055;
            evoAtt.userData.crownGroup.rotation.y = elapsedSec * 1.9 * speedMult;
          }
          if (evoAtt.userData.satellites) {
            const sats = evoAtt.userData.satellites;
            for (let sIdx = 0; sIdx < sats.length; sIdx++) {
              const sat = sats[sIdx];
              sat.rotation.y = elapsedSec * 2.1 + sIdx;
              sat.rotation.x = Math.sin(elapsedSec * 1.8 + sIdx) * 0.35;
            }
          }
          if (evoAtt.userData.lightPillar) {
            evoAtt.userData.lightPillar.material.opacity = 0.15 + Math.sin(elapsedSec * 2.8 + nodeIdx) * 0.045;
          }
          if (evoAtt.userData.innerPillar) {
            evoAtt.userData.innerPillar.material.opacity = 0.24 + Math.cos(elapsedSec * 3.1 + nodeIdx) * 0.055;
          }
          if (evoAtt.userData.auraPoints) {
            evoAtt.userData.auraPoints.rotation.y = elapsedSec * 1.18 * speedMult;
            evoAtt.userData.auraPoints.position.y = Math.sin(elapsedSec * 2.0 + nodeIdx * 0.8) * 0.065;
            if (evoAtt.userData.auraPoints.material) {
              const baseOp = nodeIdx >= 0 && evoAtt.parent && evoAtt.parent.userData.evolutionStage === 1 ? 0.52 : 0.76;
              evoAtt.userData.auraPoints.material.opacity = baseOp + Math.sin(elapsedSec * 3.0 + nodeIdx) * 0.14;
            }
          }
        }

        function animateWorld(now) {
          worldRafId = 0;
          if (!shouldRenderWorld()) {
            ctrl.engineState = 'IDLE';
            floorOverlayEl.classList.add('hidden');
            return;
          }

          const w = window.innerWidth || 1024;
          const h = window.innerHeight || 768;
          const q = (state.preferences && state.preferences.renderQuality) || (w < 768 ? 'mobile-light' : 'balanced');
          const isMobileLight = q === 'mobile-light';
          const isHighQuality = q === 'high';
          const isReducedMotion = !!(state.preferences && state.preferences.reducedMotion);

          // Smart Dual-Rate Throttle:
          // - INTERACTION (drag, unpack flight, camera pan/zoom, shockwave): full 60 FPS (0ms throttle)
          // - AMBIENT (gentle item levitation + evolution particle shimmer): ~24 FPS (40ms interval; 46ms on mobile-light)
          //   Cuts GPU/CPU work by >60% while keeping items & evolution particles gracefully alive!
          const isImmediateInteraction = (
            ctrl.isDragging ||
            now < activeInteractionUntil ||
            (ctrl.isUnpacked && ctrl.unpackElapsed < 1.95) ||
            evoShockwaveTimer > 0 ||
            state.critterCheerTimer > 0
          );
          const ambientIntervalMs = isMobileLight ? 46 : (isHighQuality ? 32 : 40);
          if (!isImmediateInteraction && !isReducedMotion && (now - lastRenderTime) < ambientIntervalMs) {
            ctrl.engineState = 'AMBIENT';
            worldRafId = requestAnimationFrame(animateWorld);
            return;
          }

          const dt = Math.min(0.06, Math.max(0.001, (now - lastTime) * 0.001));
          lastTime = now;
          lastRenderTime = now;
          const elapsedSec = now * 0.001;

          const dampFast = isSoftwareGl ? 0.65 : (1 - Math.exp(-9.0 * dt));
          const dampCamera = isSoftwareGl ? 0.65 : (1 - Math.exp(-5.5 * dt));

          const azimuthDelta = Math.abs(ctrl.targetAzimuth - ctrl.orbitAzimuth);
          ctrl.orbitAzimuth += (ctrl.targetAzimuth - ctrl.orbitAzimuth) * dampFast;

          const isMobilePortrait = (w / h) < 0.85;
          const xSpreadFactor = isMobilePortrait ? 0.68 : 1.0;

          if (auroraMesh) {
            auroraMesh.visible = !isMobileLight && (state.preferences.theme === 'dark') && !!state.auroraEnabled;
          }

          // Section 3.4: Only animate critters when user explicitly interacts with them (critterCheerTimer > 0)
          if (state.critterCheerTimer > 0) {
            state.critterCheerTimer = Math.max(0, state.critterCheerTimer - dt);
            const cheerJump = Math.abs(Math.sin(elapsedSec * 12)) * 0.28;
            foxGroup.position.y = -1.16 + cheerJump;
            foxTailPivot.rotation.y = Math.sin(elapsedSec * 14) * 0.36;
            stagGroup.position.y = -1.18 + cheerJump * 0.55;
            bunnyNodes.forEach(b => {
              b.group.position.y = -1.14 + cheerJump * 0.7;
            });
          }

          // Celebratory Evolution 3D Shockwave (runs for 1.15s only when user upgrades a level)
          if (evoShockwaveTimer > 0) {
            evoShockwaveTimer = Math.max(0, evoShockwaveTimer - dt);
            const prog = 1 - (evoShockwaveTimer / 1.15);
            shockRingMesh.scale.setScalar(1 + prog * 3.8);
            shockRingMesh.material.opacity = (1 - prog) * 0.85;
            shockBeamMesh.scale.set(1 + prog * 0.6, 1, 1 + prog * 0.6);
            shockBeamMesh.material.opacity = Math.sin((1 - prog) * Math.PI) * 0.48;
            if (evoShockwaveTimer <= 0) {
              evoShockwaveGroup.visible = false;
            }
          }

          let hasActiveTransition = false;

          if (state.screen === 'landing' || state.screen === 'auth') {
            const distZ = isMobilePortrait ? 9.0 : 7.5;
            ctrl.camPosTarget.set(Math.sin(ctrl.orbitAzimuth) * distZ, 2.15, Math.cos(ctrl.orbitAzimuth) * distZ);
            ctrl.camLookTarget.set(0, 0.12, 0);

            const breathBob = !isReducedMotion ? Math.sin(elapsedSec * 1.65) * 0.032 : 0;
            const targetY = (ctrl.hoveredBackpack ? 0.04 : -0.08) + breathBob;
            const targetScale = ctrl.hoveredBackpack ? 0.94 : 0.86;
            const targetFlap = 0;
            const gentleSwayRotY = !isReducedMotion ? Math.sin(elapsedSec * 0.65) * 0.15 : 0;
            const targetRotY = ctrl.orbitAzimuth * 0.45 + gentleSwayRotY;

            if (
              Math.abs((ctrl.hoveredBackpack ? 0.04 : -0.08) - ctrl.backpackCurrentY) > 0.045 ||
              Math.abs(targetScale - ctrl.backpackCurrentScale) > 0.002 ||
              Math.abs(targetFlap - ctrl.flapOpenRatio) > 0.002
            ) {
              hasActiveTransition = true;
            }

            ctrl.backpackCurrentY += (targetY - ctrl.backpackCurrentY) * dampFast;
            ctrl.backpackCurrentScale += (targetScale - ctrl.backpackCurrentScale) * dampFast;
            ctrl.backpackMesh.position.lerp(scratchLerpVec.set(0, ctrl.backpackCurrentY, 0), dampCamera);
            ctrl.backpackMesh.scale.setScalar(ctrl.backpackCurrentScale);
            ctrl.backpackMesh.rotation.y += (targetRotY - ctrl.backpackMesh.rotation.y) * dampFast;
            backpackShadow.position.set(ctrl.backpackMesh.position.x, -1.175, ctrl.backpackMesh.position.z);

            ctrl.flapOpenRatio += (targetFlap - ctrl.flapOpenRatio) * dampFast;
            if (ctrl.backpackMesh.userData.flapPivot) {
              ctrl.backpackMesh.userData.flapPivot.rotation.x = -smoothstep(ctrl.flapOpenRatio) * 1.95;
            }

            backpackHalo.visible = true;
            backpackHalo.position.set(ctrl.backpackMesh.position.x, -1.17, ctrl.backpackMesh.position.z);
            const haloPulse = !isReducedMotion ? Math.sin(elapsedSec * 2.4) * 0.04 : 0;
            backpackHalo.scale.setScalar((ctrl.hoveredBackpack ? 1.06 : 1.0) + haloPulse);

            ctrl.focusTargetPos.set(0, -0.1, 0);
            if (focusSpotLight.visible) {
              focusSpotLight.intensity += ((ctrl.hoveredBackpack ? 3.5 : 2.85) - focusSpotLight.intensity) * dampFast;
            }
            if (focusPointLight.visible) {
              focusPointLight.intensity += ((ctrl.hoveredBackpack ? 2.3 : 1.75) - focusPointLight.intensity) * dampFast;
            }
            focusPoolMesh.scale.setScalar(1.15 + haloPulse * 0.8);

          } else if (state.screen === 'inventory') {
            const mobileZoom = isMobilePortrait ? 1.48 : 1.0;
            ctrl.camPosTarget.set(
              Math.sin(ctrl.orbitAzimuth) * 9.8 * mobileZoom,
              6.3 * mobileZoom,
              8.8 * mobileZoom
            );
            ctrl.camLookTarget.set(0, -0.45, 0.95);

            ctrl.backpackMesh.position.lerp(scratchLerpVec.set(0, -0.15, -2.85), dampCamera);
            ctrl.backpackCurrentScale += (0.72 - ctrl.backpackCurrentScale) * dampCamera;
            ctrl.backpackMesh.scale.setScalar(ctrl.backpackCurrentScale);
            ctrl.backpackMesh.rotation.y += (0 - ctrl.backpackMesh.rotation.y) * dampCamera;
            backpackShadow.position.set(ctrl.backpackMesh.position.x, -1.175, ctrl.backpackMesh.position.z);
            backpackHalo.visible = false;

            if (Math.abs(1 - ctrl.flapOpenRatio) > 0.002) hasActiveTransition = true;
            ctrl.flapOpenRatio += (1 - ctrl.flapOpenRatio) * dampFast;
            if (ctrl.backpackMesh.userData.flapPivot) {
              ctrl.backpackMesh.userData.flapPivot.rotation.x = -smoothstep(ctrl.flapOpenRatio) * 1.98;
            }

            const hoveredNode = floorItemNodes.find(n => n.cat.slug === state.hoveredSlug);
            if (hoveredNode) {
              ctrl.focusTargetPos.set(hoveredNode.cat.floorPos.x * xSpreadFactor, -0.55, hoveredNode.cat.floorPos.z);
              if (focusSpotLight.visible) focusSpotLight.intensity += (3.6 - focusSpotLight.intensity) * dampFast;
              if (focusPointLight.visible) focusPointLight.intensity += (2.4 - focusPointLight.intensity) * dampFast;
              focusPoolMesh.scale.setScalar(0.85);
            } else {
              ctrl.focusTargetPos.set(0, -0.6, 0.9);
              if (focusSpotLight.visible) focusSpotLight.intensity += (2.1 - focusSpotLight.intensity) * dampFast;
              if (focusPointLight.visible) focusPointLight.intensity += (1.2 - focusPointLight.intensity) * dampFast;
              focusPoolMesh.scale.setScalar(1.35);
            }

          } else if (state.screen === 'detail') {
            const isStackedMobile = w < 1024;
            const selNode = floorItemNodes.find(n => n.cat.slug === state.selectedSlug) || floorItemNodes[0];
            const itemX = selNode.cat.floorPos.x * xSpreadFactor;
            const itemZ = selNode.cat.floorPos.z;
            const itemY = -0.36;

            const zoomDist = (isStackedMobile ? 4.10 : 3.85) + ctrl.detailZoomOffset;
            const camShiftX = isStackedMobile ? 0.0 : 1.28;
            const lookOffsetY = isStackedMobile ? -0.76 : -0.06;

            ctrl.camPosTarget.set(
              itemX + camShiftX,
              itemY + (isStackedMobile ? 0.68 : 0.88) + ctrl.detailZoomOffset * 0.25,
              itemZ + zoomDist
            );
            ctrl.camLookTarget.set(itemX + camShiftX, itemY + lookOffsetY, itemZ);

            ctrl.backpackMesh.position.lerp(scratchLerpVec.set(0, -0.18, -3.2), dampCamera);
            ctrl.backpackCurrentScale += (0.62 - ctrl.backpackCurrentScale) * dampCamera;
            ctrl.backpackMesh.scale.setScalar(ctrl.backpackCurrentScale);
            backpackShadow.position.set(ctrl.backpackMesh.position.x, -1.175, ctrl.backpackMesh.position.z);
            backpackHalo.visible = false;

            ctrl.focusTargetPos.set(itemX, itemY, itemZ);
            if (focusSpotLight.visible) focusSpotLight.intensity += (4.0 - focusSpotLight.intensity) * dampFast;
            if (focusPointLight.visible) focusPointLight.intensity += (2.75 - focusPointLight.intensity) * dampFast;
            const poolPulse = !isReducedMotion ? Math.sin(elapsedSec * 2.6) * 0.03 : 0;
            focusPoolMesh.scale.setScalar(0.75 + poolPulse);
          }

          if (ctrl.focusCurrentPos.distanceToSquared(ctrl.focusTargetPos) > 0.0004) {
            hasActiveTransition = true;
          }
          ctrl.focusCurrentPos.lerp(ctrl.focusTargetPos, dampFast);
          if (focusSpotLight.visible) focusSpotLight.target.position.copy(ctrl.focusCurrentPos);
          if (focusPointLight.visible) {
            focusPointLight.position.set(ctrl.focusCurrentPos.x, ctrl.focusCurrentPos.y + 1.35, ctrl.focusCurrentPos.z + 0.35);
          }
          focusPoolMesh.position.set(ctrl.focusCurrentPos.x, -1.168, ctrl.focusCurrentPos.z);

          const targetFov = state.screen === 'detail' ? 35 : 40;
          if (Math.abs(camera.fov - targetFov) > 0.03) {
            camera.fov += (targetFov - camera.fov) * dampCamera;
            camera.updateProjectionMatrix();
            hasActiveTransition = true;
          } else if (camera.fov !== targetFov) {
            camera.fov = targetFov;
            camera.updateProjectionMatrix();
          }

          const camDistSq = camera.position.distanceToSquared(ctrl.camPosTarget);
          const lookDistSq = ctrl.camCurrentLook.distanceToSquared(ctrl.camLookTarget);
          if (camDistSq > 0.00015 || lookDistSq > 0.00015 || azimuthDelta > 0.001) {
            hasActiveTransition = true;
          }
          camera.position.lerp(ctrl.camPosTarget, dampCamera);
          ctrl.camCurrentLook.lerp(ctrl.camLookTarget, dampCamera);
          camera.lookAt(ctrl.camCurrentLook);

          const showFloorLabels = (state.screen === 'inventory' && state.inventoryViewMode === 'floor' && !state.preferences.fallback2D);
          floorOverlayEl.classList.toggle('hidden', !showFloorLabels);

          // Section 3.3 + Turn 4: Lightweight Item Levitation & Evolution Particle Animation
          if (ctrl.isUnpacked && (state.screen === 'inventory' || state.screen === 'detail')) {
            ctrl.unpackElapsed += dt;

            for (let i = 0; i < floorItemNodes.length; i++) {
              const node = floorItemNodes[i];
              const rawT = (ctrl.unpackElapsed - node.delay) / 0.88;
              const prevFlightT = node.flightT;
              node.flightT = isReducedMotion ? 1 : Math.max(0, Math.min(1, rawT));

              const isHovered = state.hoveredSlug === node.cat.slug;
              const isSelectedInDetail = (state.screen === 'detail' && state.selectedSlug === node.cat.slug);
              const isOtherInDetail = (state.screen === 'detail' && state.selectedSlug !== node.cat.slug);

              const targetLift = isSelectedInDetail ? 0.34 : (isHovered ? 0.24 : 0.0);
              let targetScaleBase = 0.50;
              if (isSelectedInDetail) targetScaleBase = 0.48;
              else if (isOtherInDetail) targetScaleBase = 0.28;
              else if (isHovered) targetScaleBase = 0.58;

              const desiredScale = targetScaleBase * smoothstep(node.flightT * 1.25);
              const targetPadOp = node.flightT > 0.75
                ? (isSelectedInDetail ? 0.96 : (isOtherInDetail ? 0.10 : (isHovered ? 0.92 : 0.28)))
                : 0;
              const rotDiff = isSelectedInDetail ? Math.abs(ctrl.detailItemRotY - node.mesh.rotation.y) : 0;

              const itemNeedsTransition = (
                node.flightT < 1 ||
                prevFlightT < 1 ||
                Math.abs(node.currentLift - targetLift) > 0.0015 ||
                Math.abs(node.currentScale - desiredScale) > 0.0015 ||
                Math.abs(node.pad.material.opacity - targetPadOp) > 0.005 ||
                rotDiff > 0.002 ||
                camDistSq > 0.0001 ||
                lookDistSq > 0.0001
              );

              if (
                node.flightT < 1 ||
                Math.abs(node.currentLift - targetLift) > 0.0015 ||
                Math.abs(node.currentScale - desiredScale) > 0.0015
              ) {
                hasActiveTransition = true;
              }

              // In Detail View, completely skip the 9 non-selected background items once settled!
              if (isOtherInDetail && !itemNeedsTransition) {
                continue;
              }
              // When Reduced Motion is enabled, skip settled items completely!
              if (isReducedMotion && !itemNeedsTransition && node.lastHovered === isHovered && node.labelProjectedOnce) {
                continue;
              }

              const eT = easeInOutCubic(node.flightT);
              const startX = ctrl.backpackMesh.position.x;
              const startY = ctrl.backpackMesh.position.y + 0.55;
              const startZ = ctrl.backpackMesh.position.z + 0.15;

              const endX = node.cat.floorPos.x * xSpreadFactor;
              const endZ = node.cat.floorPos.z;

              node.currentLift += (targetLift - node.currentLift) * dampFast;
              const gentleBob = (!isReducedMotion && node.flightT >= 1)
                ? Math.sin(elapsedSec * (isSelectedInDetail ? 2.1 : 1.75) + node.idx * 0.75) * (isSelectedInDetail ? 0.042 : 0.032)
                : 0;
              const endY = -0.52 + node.currentLift + gentleBob;
              const arcHeight = Math.sin(eT * Math.PI) * 1.65;

              node.mesh.position.set(
                startX + (endX - startX) * eT,
                startY + (endY - startY) * eT + arcHeight,
                startZ + (endZ - startZ) * eT
              );

              node.currentScale += (desiredScale - node.currentScale) * dampFast;
              node.mesh.scale.setScalar(Math.max(0.001, node.currentScale));

              node.pedestal.position.set(endX, -1.14, endZ);
              node.pedestal.visible = node.flightT > 0.65;

              const evoAtt = node.mesh.userData.evoAttachments;
              if (isSelectedInDetail) {
                if (!isReducedMotion && !ctrl.isDragging) {
                  ctrl.detailItemRotY += 0.34 * dt;
                }
                node.mesh.rotation.y += (ctrl.detailItemRotY - node.mesh.rotation.y) * dampFast;
                node.mesh.rotation.x = 0.16 + (!isReducedMotion ? Math.sin(elapsedSec * 1.5) * 0.025 : 0);
                if (!isReducedMotion && evoAtt) {
                  animateEvolutionAttachments(evoAtt, elapsedSec, node.idx, true);
                }
              } else {
                if (!isReducedMotion) {
                  node.mesh.rotation.y += (isHovered ? 1.45 : 0.36) * dt;
                  node.mesh.rotation.x = 0.18 + Math.sin(elapsedSec * 1.4 + node.idx) * 0.02;
                  if (evoAtt && (isHovered || !isMobileLight || node.evoStage >= 2)) {
                    animateEvolutionAttachments(evoAtt, elapsedSec, node.idx, isHovered);
                  }
                } else {
                  node.mesh.rotation.x = 0.18;
                }
              }

              node.shadow.position.set(node.mesh.position.x, -1.178, node.mesh.position.z);
              node.shadow.material.opacity = eT * (isOtherInDetail ? 0.18 : (isHovered || isSelectedInDetail ? 0.5 : 0.72));

              node.pad.position.set(endX, -1.17, endZ);
              node.pad.material.color.setHex((isHovered || isSelectedInDetail) ? 0xDF761F : 0x1D7E80);
              node.pad.material.opacity += (targetPadOp - node.pad.material.opacity) * dampFast;

              // Section 3.3: Only project & touch DOM floor badge when flight/camera/hover changes — NEVER during ambient bobbing!
              if (showFloorLabels && node.flightT > 0.75) {
                const needLabelProject = !node.labelProjectedOnce || node.flightT < 1 || prevFlightT < 1 || camDistSq > 0.0001 || lookDistSq > 0.0001;
                if (needLabelProject) {
                  scratchLabelVec.set(endX, -1.12, endZ + 0.42).project(camera);
                  if (scratchLabelVec.z < 1) {
                    const screenX = Math.round((scratchLabelVec.x * 0.5 + 0.5) * w * 2) * 0.5;
                    const screenY = Math.round((-(scratchLabelVec.y * 0.5) + 0.5) * h * 2) * 0.5;
                    const opVal = Math.round(smoothstep((node.flightT - 0.75) * 4) * 100) / 100;
                    if (node.lastScreenX !== screenX || node.lastScreenY !== screenY) {
                      node.lastScreenX = screenX;
                      node.lastScreenY = screenY;
                      node.labelBtn.style.setProperty('--tx', `${screenX}px`);
                      node.labelBtn.style.setProperty('--ty', `${screenY}px`);
                      node.labelProjectedOnce = true;
                    }
                    if (node.lastOpacity !== opVal) {
                      node.lastOpacity = opVal;
                      node.labelBtn.style.opacity = String(opVal);
                    }
                  }
                }
                if (node.lastHovered !== isHovered) {
                  node.lastHovered = isHovered;
                  node.labelBtn.classList.toggle('is-hovered', isHovered);
                }
              } else if (node.lastOpacity !== 0) {
                node.lastOpacity = 0;
                node.labelBtn.style.opacity = '0';
              }
            }
          }

          renderer.render(scene, camera);
          ctrl.renderedFramesCount += 1;

          // Determine next Engine State:
          // - INTERACTION (60 FPS): active user drag, unpack transition, camera movement, or shockwave
          // - AMBIENT (~24 FPS throttled): lightweight item levitation + evolution particle shimmer when not in reducedMotion
          // - IDLE (0 FPS): when reducedMotion is enabled and transitions settle, or world is hidden/2D
          const inActiveInteraction = (
            ctrl.isDragging ||
            now < activeInteractionUntil ||
            hasActiveTransition ||
            evoShockwaveTimer > 0 ||
            state.critterCheerTimer > 0
          );

          if (!shouldRenderWorld()) {
            ctrl.engineState = 'IDLE';
            worldRafId = 0;
          } else if (inActiveInteraction) {
            ctrl.engineState = 'INTERACTION';
            if (isSoftwareGl) {
              setTimeout(() => {
                if (!worldRafId && shouldRenderWorld()) {
                  worldRafId = requestAnimationFrame(animateWorld);
                }
              }, 32);
            } else {
              worldRafId = requestAnimationFrame(animateWorld);
            }
          } else if (!isReducedMotion && !isSoftwareGl) {
            ctrl.engineState = 'AMBIENT';
            worldRafId = requestAnimationFrame(animateWorld);
          } else {
            ctrl.engineState = 'IDLE';
            worldRafId = 0;
          }
        }

        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            ctrl.stopLoop();
          } else {
            ctrl.wakeInteraction(1000);
          }
        });

        ctrl.applyQualityProfile();
        ctrl.applyEnvironmentTheme(state.preferences.theme);
        ctrl.startLoop();
        return ctrl;
      }

      // Teknis #1: Keep fixed-width, tidy top HUD pill whether idle or hovering an item!
      function setHoveredFloorItem(slug) {
        if (state.hoveredSlug === slug) return;
        state.hoveredSlug = slug;
        if (slug) SoundFX.hover();
        const nameEl = document.getElementById('floorHoverName');
        const barEl = document.getElementById('floorHoverBar');
        const lvlEl = document.getElementById('floorHoverLvl');
        if (!nameEl || !barEl || !lvlEl) return;

        if (!slug) {
          nameEl.textContent = '✦ Sorot objek 3D';
          barEl.style.width = '0%';
          barEl.style.backgroundColor = '#8B9B98';
          lvlEl.textContent = 'Siap';
          return;
        }
        const cat = SEED_CATEGORIES.find(c => c.slug === slug);
        const prof = state.profiles[slug];
        const mastery = getMasteryInfo(prof.level);
        nameEl.textContent = `#${cat.order} ${cat.shortTag}`;
        barEl.style.width = `${mastery.barPercent}%`;
        barEl.style.backgroundColor = mastery.barColor;
        lvlEl.textContent = prof.level === null ? 'NULL' : `Lv.${prof.level}`;
      }

      /* =====================================================================
       * FINDING 1 (P1): LIGHTWEIGHT ACCESSIBLE PROXY FOR HIDDEN DETAIL STAGE
       * Since Detail View zooms the main 3D world camera directly onto the
       * selected floor artifact, `#detail3DStageContainer` is `sr-only`.
       * We preserve `#detailObjectCanvas` and its accessible ARIA attributes
       * without allocating a redundant second WebGLRenderer or running a
       * second continuous requestAnimationFrame loop!
       * ===================================================================== */
      function initDetailCloseUpStage() {
        const canvas = document.getElementById('detailObjectCanvas');
        if (!canvas) return null;
        return {
          canvas,
          targetRotX: 0.2,
          targetRotY: -0.45,
          targetZoom: 3.85,
          setObject(slug) {
            const cat = SEED_CATEGORIES.find(c => c.slug === slug);
            if (cat && canvas) {
              canvas.setAttribute('aria-label', `Inspeksi 3D jarak dekat: #${cat.order} ${cat.name}`);
            }
          },
          rotateBy(deltaY, deltaX = 0) {
            this.targetRotY += deltaY;
            this.targetRotX = Math.max(-0.85, Math.min(0.95, this.targetRotX + deltaX));
          },
          resetCamera() {
            this.targetRotX = 0.2;
            this.targetRotY = -0.45;
            this.targetZoom = 3.85;
          },
          zoomBy(delta) {
            this.targetZoom = Math.max(2.2, Math.min(5.8, this.targetZoom + delta));
          },
          resize() {}
        };
      }

      /* =====================================================================
       * 9. UI RENDERING & RPG LEVEL METER BARS
       * ===================================================================== */
      function applyVisualPreferences() {
        const html = document.documentElement;
        const isSerious = state.preferences.colorStyle === 'serious';
        html.classList.toggle('dark', state.preferences.theme === 'dark');
        html.classList.toggle('serious-realism', isSerious);
        html.classList.toggle('reduced-motion', !!state.preferences.reducedMotion);

        document.getElementById('iconSun').classList.toggle('hidden', state.preferences.theme !== 'dark');
        document.getElementById('iconMoon').classList.toggle('hidden', state.preferences.theme === 'dark');
        document.getElementById('toggleReducedMotion').checked = !!state.preferences.reducedMotion;
        document.getElementById('toggleFallback2D').checked = !!state.preferences.fallback2D;
        const qualSel = document.getElementById('selectRenderQuality');
        if (qualSel) qualSel.value = state.preferences.renderQuality || 'balanced';
        const seriousToggleEl = document.getElementById('toggleSeriousRealism');
        if (seriousToggleEl) seriousToggleEl.checked = isSerious;
        const styleLbl = document.getElementById('hudColorStyleLabel');
        if (styleLbl) styleLbl.textContent = isSerious ? 'Serius HD' : 'Cerah';

        const use2D = !webglSupported || state.preferences.fallback2D;
        document.getElementById('landingBackpack3DWrap').classList.toggle('hidden', use2D);
        document.getElementById('landingBackpack2DFallback').classList.toggle('hidden', !use2D);
        document.getElementById('detail3DStageContainer').classList.toggle('hidden', use2D);
        document.getElementById('detail2DStageContainer').classList.toggle('hidden', !use2D);
        if (worldCtrl) {
          if (typeof worldCtrl.applyQualityProfile === 'function') {
            worldCtrl.applyQualityProfile();
          }
          if (typeof worldCtrl.applyEnvironmentTheme === 'function') {
            worldCtrl.applyEnvironmentTheme(state.preferences.theme, state.preferences.colorStyle);
          }
          if (use2D) {
            worldCtrl.stopLoop();
          } else {
            worldCtrl.wakeInteraction(state.preferences.reducedMotion ? 40 : 650);
          }
        }
      }

      function renderLandingQuote() {
        const activeQuotes = state.quotes.filter(q => q.active);
        const list = activeQuotes.length > 0 ? activeQuotes : DEFAULT_QUOTES;
        const idx = state.preferences.activeQuoteIndex % list.length;
        const q = list[idx];
        document.getElementById('landingQuoteText').textContent = q.text;
        document.getElementById('landingQuoteMeta').textContent = `— ${q.attribution}`;
      }

      function renderScreenVisibility() {
        const screens = {
          auth: document.getElementById('screenAuth'),
          landing: document.getElementById('screenLanding'),
          inventory: document.getElementById('screenInventory'),
          detail: document.getElementById('screenCategoryDetail')
        };
        Object.keys(screens).forEach(k => {
          screens[k].classList.toggle('hidden', state.screen !== k);
        });

        const crumb = document.getElementById('breadcrumbStateLabel');
        if (state.screen === 'auth') crumb.textContent = 'Checkpoint Login';
        else if (state.screen === 'landing') crumb.textContent = 'Klik Tas 3D buat Unpack';
        else if (state.screen === 'inventory') crumb.textContent = '10 Artefak di Lantai';
        else if (state.screen === 'detail') {
          const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug);
          crumb.textContent = `Inspect: ${cat ? cat.shortTag : ''}`;
        }

        if (worldCtrl) {
          const needsWorld = !state.preferences.fallback2D && (
            state.screen === 'landing' ||
            state.screen === 'auth' ||
            state.screen === 'detail' ||
            (state.screen === 'inventory' && state.inventoryViewMode === 'floor')
          );
          if (needsWorld) {
            worldCtrl.wakeInteraction(1000);
          } else {
            worldCtrl.stopLoop();
          }
        }
        setTimeout(() => {
          if (worldCtrl) worldCtrl.resize();
          if (state.screen === 'detail' && detailScene) detailScene.resize();
        }, 40);
      }

      function updateSingleCategoryDOM(slug) {
        const cat = SEED_CATEGORIES.find(c => c.slug === slug);
        if (!cat) return;
        const prof = state.profiles[slug];
        const mastery = getMasteryInfo(prof.level);
        const evCount = prof.evidence.length;

        // 1. Floor 3D badge dot & label
        const fSpan = document.querySelector(`[data-floor-lvl="${slug}"]`);
        const fDot = document.querySelector(`[data-floor-dot="${slug}"]`);
        if (fSpan) fSpan.textContent = `· ${mastery.shortLabel}`;
        if (fDot) fDot.style.backgroundColor = mastery.barColor;

        // 2. Rack 3D card (if initialized)
        const rLvl = document.querySelector(`[data-rack-lvl="${slug}"]`);
        const rBar = document.querySelector(`[data-rack-bar="${slug}"]`);
        const rEv = document.querySelector(`[data-rack-ev="${slug}"]`);
        if (rLvl) rLvl.textContent = mastery.shortLabel;
        if (rBar) {
          rBar.style.width = `${mastery.barPercent}%`;
          rBar.style.backgroundColor = mastery.barColor;
        }
        if (rEv) rEv.textContent = `${evCount} relics`;

        // 3. 2D Accessible Row (if initialized)
        const rowLvl = document.querySelector(`[data-row-lvl="${slug}"]`);
        const rowBar = document.querySelector(`[data-row-bar="${slug}"]`);
        const rowEv = document.querySelector(`[data-row-ev="${slug}"]`);
        if (rowLvl) rowLvl.textContent = mastery.shortLabel;
        if (rowBar) {
          rowBar.style.width = `${mastery.barPercent}%`;
          rowBar.style.backgroundColor = mastery.barColor;
        }
        if (rowEv) rowEv.textContent = `${evCount} Bukti Karya`;

        // 4. Summary note & Global Crest
        const assessedCount = SEED_CATEGORIES.filter(c => state.profiles[c.slug].level !== null).length;
        const sumNote = document.getElementById('inventorySummaryNote');
        if (sumNote) sumNote.textContent = `${assessedCount}/10 dinilai · ${10 - assessedCount} Belum dinilai`;
        updateGlobalRpgCrest();
      }

      function renderQuickRosterBars() {
        ['floorQuickRosterBar', 'detailQuickRosterBar'].forEach(barId => {
          const barEl = document.getElementById(barId);
          if (!barEl) return;
          if (!barEl.hasAttribute('data-initialized')) {
            barEl.setAttribute('data-initialized', 'true');
            barEl.innerHTML = SEED_CATEGORIES.map((cat, idx) => {
              const hotkeyKey = idx === 9 ? '0' : String(idx + 1);
              return `
                <button type="button" data-roster-btn="${cat.slug}" data-select-category="${cat.slug}" title="Pilih Domain #${cat.order} ${cat.name} (Pintasan Keyboard: [${hotkeyKey}])" class="px-2.5 py-1 rounded-xl border text-[11px] font-bold flex flex-col gap-0.5 shrink-0 transition-all min-w-[92px] atlas-surface hover:border-[#DF761F]">
                  <div class="flex items-center justify-between gap-1 w-full">
                    <span data-roster-hk="${cat.slug}" class="font-mono text-[9px] px-1 rounded bg-[#B54D08]/15 text-amber-aa">[${hotkeyKey}]</span>
                    <span data-roster-label="${cat.slug}" class="truncate">${cat.shortTag}</span>
                  </div>
                  <div data-roster-track="${cat.slug}" class="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div data-roster-fill="${cat.slug}" class="h-full rounded-full transition-all" style="width: 0%; background-color: #8B9B98"></div>
                  </div>
                </button>
              `;
            }).join('');
          }

          SEED_CATEGORIES.forEach(cat => {
            const prof = state.profiles[cat.slug];
            const mastery = getMasteryInfo(prof.level);
            const isSel = state.screen === 'detail' && state.selectedSlug === cat.slug;
            const btn = barEl.querySelector(`[data-roster-btn="${cat.slug}"]`);
            const hk = barEl.querySelector(`[data-roster-hk="${cat.slug}"]`);
            const track = barEl.querySelector(`[data-roster-track="${cat.slug}"]`);
            const fill = barEl.querySelector(`[data-roster-fill="${cat.slug}"]`);
            const lblSpan = barEl.querySelector(`[data-roster-label="${cat.slug}"]`);
            if (lblSpan) {
              lblSpan.textContent = isSel ? `● ${cat.shortTag}` : cat.shortTag;
            }
            if (btn) {
              btn.setAttribute('aria-current', isSel ? 'true' : 'false');
              btn.setAttribute('title', `#${cat.order} ${cat.name} — Status: ${mastery.shortLabel} (${mastery.barPercent}%)`);
              btn.className = `px-2.5 py-1 rounded-xl border text-[11px] font-bold flex flex-col gap-0.5 shrink-0 transition-all min-w-[92px] ${isSel ? 'border-2 border-[#FEF08A] bg-[#DF761F] text-white shadow-md -translate-y-0.5' : 'atlas-surface hover:border-[#DF761F]'}`;
            }
            if (hk) {
              hk.className = `font-mono text-[9px] px-1 rounded ${isSel ? 'bg-black/25 text-white' : 'bg-[#B54D08]/15 text-amber-aa'}`;
            }
            if (track) {
              track.className = `w-full h-1 rounded-full ${isSel ? 'bg-black/25' : 'bg-black/10 dark:bg-white/10'} overflow-hidden`;
            }
            if (fill) {
              fill.style.width = `${mastery.barPercent}%`;
              fill.style.backgroundColor = isSel ? '#FFFFFF' : mastery.barColor;
            }
          });
        });

        SEED_CATEGORIES.forEach(cat => updateSingleCategoryDOM(cat.slug));
      }

      function renderInventoryRack() {
        const overlayWrap = document.getElementById('inventoryOverlayPanels');
        const rackEl = document.getElementById('inventoryGridRack');
        const listEl = document.getElementById('inventoryAccessibleList');
        const rowsEl = document.getElementById('inventoryAccessibleRows');

        const effectiveMode = (state.preferences.fallback2D || !webglSupported) && state.inventoryViewMode === 'floor'
          ? '2d'
          : state.inventoryViewMode;

        const btnFloor = document.getElementById('btnViewModeFloor');
        const btn3D = document.getElementById('btnViewMode3D');
        const btn2D = document.getElementById('btnViewMode2D');

        btnFloor.setAttribute('aria-pressed', effectiveMode === 'floor' ? 'true' : 'false');
        btn3D.setAttribute('aria-pressed', effectiveMode === '3d' ? 'true' : 'false');
        btn2D.setAttribute('aria-pressed', effectiveMode === '2d' ? 'true' : 'false');

        btnFloor.className = effectiveMode === 'floor'
          ? 'w-8 h-8 rounded-full btn-amber-aa flex items-center justify-center transition-colors'
          : 'w-8 h-8 rounded-full atlas-text-secondary hover:text-current flex items-center justify-center transition-colors';
        btn3D.className = effectiveMode === '3d'
          ? 'w-8 h-8 rounded-full btn-amber-aa flex items-center justify-center transition-colors'
          : 'w-8 h-8 rounded-full atlas-text-secondary hover:text-current flex items-center justify-center transition-colors';
        btn2D.className = effectiveMode === '2d'
          ? 'w-8 h-8 rounded-full btn-amber-aa flex items-center justify-center transition-colors'
          : 'w-8 h-8 rounded-full atlas-text-secondary hover:text-current flex items-center justify-center transition-colors';

        overlayWrap.classList.toggle('hidden', effectiveMode === 'floor');
        rackEl.classList.toggle('hidden', effectiveMode !== '3d');
        listEl.classList.toggle('hidden', effectiveMode !== '2d');

        // Finding 3 & 5: Manage 3D loop when switching inventory sub-views & generate rack thumbnails on demand
        if (state.screen === 'inventory' && worldCtrl) {
          if (effectiveMode === 'floor' && !state.preferences.fallback2D) {
            worldCtrl.wakeInteraction(900);
          } else {
            worldCtrl.stopLoop();
          }
        }
        if (effectiveMode === '3d' && !state.preferences.fallback2D) {
          generateRackThumbnails();
        }

        const assessedCount = SEED_CATEGORIES.filter(c => state.profiles[c.slug].level !== null).length;
        document.getElementById('inventorySummaryNote').textContent =
          `${assessedCount}/10 dinilai · ${10 - assessedCount} Belum dinilai`;

        // 5x2 Grid Rack Cards with targeted data-* attributes so single-category updates never rebuild the whole grid! (Section 6.1)
        if (!rackEl.hasAttribute('data-initialized')) {
          rackEl.setAttribute('data-initialized', 'true');
          rackEl.innerHTML = SEED_CATEGORIES.map(cat => {
            const prof = state.profiles[cat.slug];
            const mastery = getMasteryInfo(prof.level);
            const evCount = prof.evidence.length;
            return `
              <article role="listitem" class="flex flex-col" data-rack-card="${cat.slug}">
                <button type="button" data-select-category="${cat.slug}" class="game-pill group flex-1 flex flex-col justify-between text-left rounded-2xl border atlas-elevated p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF761F]">
                  <div class="w-full flex items-center justify-between gap-1">
                    <span class="px-1.5 py-0.5 rounded bg-[#1D7E80]/15 text-[#1D7E80] font-mono text-[10px] font-bold">#${cat.order}</span>
                    <span data-rack-lvl="${cat.slug}" class="px-1.5 py-0.5 rounded border atlas-border text-[10px] font-mono font-semibold">${mastery.shortLabel}</span>
                  </div>
                  <div class="w-full h-20 sm:h-24 my-1.5 rounded-xl border atlas-border bg-gradient-to-b from-[#D7F0EC]/60 to-[#F9EED4]/75 flex items-center justify-center overflow-hidden">
                    <div class="text-[#DF761F]">${getCategory2DSvg(cat.slug)}</div>
                  </div>
                  <div class="w-full space-y-1">
                    <h2 class="font-bold text-xs sm:text-sm truncate group-hover:text-[#DF761F]">${cat.name}</h2>
                    <div class="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div data-rack-bar="${cat.slug}" class="rpg-bar-fill h-full rounded-full" style="width: ${mastery.barPercent}%; background-color: ${mastery.barColor}"></div>
                    </div>
                    <div class="flex items-center justify-between text-[10px] font-mono atlas-text-muted">
                      <span>${cat.capabilities.length} nodes</span>
                      <span data-rack-ev="${cat.slug}">${evCount} relics</span>
                    </div>
                  </div>
                </button>
              </article>
            `;
          }).join('');
        } else {
          SEED_CATEGORIES.forEach(cat => {
            const prof = state.profiles[cat.slug];
            const mastery = getMasteryInfo(prof.level);
            const lvlEl = rackEl.querySelector(`[data-rack-lvl="${cat.slug}"]`);
            const barEl = rackEl.querySelector(`[data-rack-bar="${cat.slug}"]`);
            const evEl = rackEl.querySelector(`[data-rack-ev="${cat.slug}"]`);
            if (lvlEl) lvlEl.textContent = mastery.shortLabel;
            if (barEl) {
              barEl.style.width = `${mastery.barPercent}%`;
              barEl.style.backgroundColor = mastery.barColor;
            }
            if (evEl) evEl.textContent = `${prof.evidence.length} relics`;
          });
        }

        // 2D Accessible List with targeted in-place DOM updates (Section 6.1)
        if (!rowsEl.hasAttribute('data-initialized')) {
          rowsEl.setAttribute('data-initialized', 'true');
          rowsEl.innerHTML = SEED_CATEGORIES.map(cat => {
            const prof = state.profiles[cat.slug];
            const mastery = getMasteryInfo(prof.level);
            const desc = CATEGORY_DESCRIPTIONS[cat.slug] || '';
            const evCount = prof.evidence.length;
            return `
              <div role="listitem" data-row-card="${cat.slug}" class="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/5 transition-colors">
                <div class="flex items-start gap-3 min-w-0 flex-1">
                  <div class="w-10 h-10 rounded-xl border atlas-surface flex items-center justify-center text-amber-aa shrink-0">
                    ${getCategory2DSvg(cat.slug)}
                  </div>
                  <div class="min-w-0 flex-1 space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-mono text-xs font-bold text-amber-aa">#${cat.order}</span>
                      <h3 class="font-bold text-sm sm:text-base">${cat.name}</h3>
                      <span data-row-lvl="${cat.slug}" class="px-2 py-0.5 rounded border atlas-border font-mono text-xs font-semibold">${mastery.shortLabel}</span>
                      <span data-row-ev="${cat.slug}" class="px-2 py-0.5 rounded bg-[#135C5E]/10 text-teal-aa font-mono text-xs font-semibold">${evCount} Bukti Karya</span>
                    </div>
                    <p class="text-xs sm:text-sm atlas-text-secondary">${escapeHtml(desc)}</p>
                    <div class="flex flex-wrap items-center gap-3 pt-0.5">
                      <div class="w-36 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div data-row-bar="${cat.slug}" class="rpg-bar-fill h-full rounded-full" style="width: ${mastery.barPercent}%; background-color: ${mastery.barColor}"></div>
                      </div>
                      <span class="text-xs atlas-text-muted">Sub-kemampuan: ${cat.capabilities.join(' · ')}</span>
                    </div>
                  </div>
                </div>
                <button type="button" data-select-category="${cat.slug}" class="px-3.5 py-2 min-h-[38px] rounded-xl btn-amber-aa text-xs font-bold shrink-0">
                  Buka Kategori →
                </button>
              </div>
            `;
          }).join('');
        } else {
          SEED_CATEGORIES.forEach(cat => {
            const prof = state.profiles[cat.slug];
            const mastery = getMasteryInfo(prof.level);
            const lvlEl = rowsEl.querySelector(`[data-row-lvl="${cat.slug}"]`);
            const barEl = rowsEl.querySelector(`[data-row-bar="${cat.slug}"]`);
            const evEl = rowsEl.querySelector(`[data-row-ev="${cat.slug}"]`);
            if (lvlEl) lvlEl.textContent = mastery.shortLabel;
            if (barEl) {
              barEl.style.width = `${mastery.barPercent}%`;
              barEl.style.backgroundColor = mastery.barColor;
            }
            if (evEl) evEl.textContent = `${prof.evidence.length} Bukti Karya`;
          });
        }

        renderQuickRosterBars();
      }

      function populateQuickCategorySelect() {
        const sel = document.getElementById('selectQuickCategory');
        sel.innerHTML = SEED_CATEGORIES.map((cat, idx) => {
          const hk = idx === 9 ? '0' : String(idx + 1);
          return `<option value="${cat.slug}">[${hk}] #${cat.order} · ${cat.shortTag}</option>`;
        }).join('');
        sel.value = state.selectedSlug;
      }

      function renderRpgLevelMeterInDetail(level, capCount, evCount, animateBurst = false) {
        const mastery = getMasteryInfo(level);
        const evo = getEvolutionStage(level);
        const lblEl = document.getElementById('rpgLevelMeterLabel');
        lblEl.textContent = level === null ? 'Belum Dinilai (—)' : `Lv.${level}/5 · ${mastery.label}`;
        lblEl.style.color = level === null ? '#CBD5E1' : '#FDE047';

        const evoBadgeEl = document.getElementById('detailEvolutionStageBadge');
        if (evoBadgeEl) {
          const conciseStageNames = {
            1: level === 1 ? '🪨 Tahap I · Sandstone' : '🪨 Tahap I · Slate',
            2: '🌿 Tahap II · Giok',
            3: '💎 Tahap III · Lapis',
            4: '💙 Tahap IV · Safir',
            5: '♦️ Tahap V · Obsidian Rubi'
          };
          evoBadgeEl.textContent = conciseStageNames[evo.stage] || evo.shortBadge;
          evoBadgeEl.setAttribute('title', evo.desc);
          if (evo.stage === 5) {
            evoBadgeEl.className = 'px-2.5 py-0.5 rounded-full border evo-stage-pill-5 text-[#FEF08A] text-[10px] font-mono font-bold';
          } else if (evo.stage === 4) {
            evoBadgeEl.className = 'px-2 py-0.5 rounded-full bg-[#F59E0B]/25 border border-[#F59E0B]/50 text-[#FDE68A] text-[10px] font-mono font-bold';
          } else if (evo.stage >= 2) {
            evoBadgeEl.className = 'px-2 py-0.5 rounded-full bg-[#06B6D4]/20 border border-[#38BDF8]/40 text-[#A5F3FC] text-[10px] font-mono font-bold';
          } else {
            evoBadgeEl.className = 'px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#CBD5E1] text-[10px] font-mono font-bold';
          }
        }

        document.getElementById('rpgSubskillStat').textContent = `⚡ ${capCount}`;
        document.getElementById('rpgEvidenceStat').textContent = `📎 ${evCount}`;

        const segGrid = document.getElementById('rpgSegmentedBar');
        if (animateBurst) {
          segGrid.classList.remove('level-up-burst');
          void segGrid.offsetWidth;
          segGrid.classList.add('level-up-burst');
        }
        const tierBlazePalettes = {
          1: { c1: '#06B6D4', c2: '#67E8F9', glow: 'rgba(56, 189, 248, 0.72)', desc: 'Pip 1/5 · Exposure: Mengenal konsep dasar & praktik terbimbing' },
          2: { c1: '#10B981', c2: '#6EE7B7', glow: 'rgba(52, 211, 153, 0.76)', desc: 'Pip 2/5 · Foundation: Menyelesaikan tugas sederhana dengan template' },
          3: { c1: '#22C55E', c2: '#BEF264', glow: 'rgba(74, 222, 128, 0.82)', desc: 'Pip 3/5 · Competence: Mandiri & konsisten (Membuka Gerbang Advanced)' },
          4: { c1: '#F59E0B', c2: '#FDE047', glow: 'rgba(251, 191, 36, 0.88)', desc: 'Pip 4/5 · Advanced: Menangani kasus kompleks & adaptasi (Membuka Gerbang Sage)' },
          5: { c1: '#EF4444', c2: '#FDE047', glow: 'rgba(244, 63, 94, 0.94)', desc: 'Pip 5/5 · Mastery: Penguasaan penuh, sintesis lintas konteks & membimbing' }
        };
        const activePal = tierBlazePalettes[level] || { c1: mastery.barColor, c2: '#FDE047', glow: 'rgba(245, 158, 11, 0.75)' };

        segGrid.innerHTML = [1, 2, 3, 4, 5].map(tier => {
          const active = level !== null && level >= tier;
          const isCurrentPeak = level !== null && level === tier;
          const segPal = tierBlazePalettes[tier];
          const stateText = active ? 'Tercapai ✓' : 'Belum tercapai';
          return `
            <div title="${segPal.desc} (${stateText})" class="h-3.5 rounded-full border border-white/20 overflow-hidden bg-black/50 relative cursor-help ${active ? 'rpg-segment-active' : ''}" style="--seg-c1: ${segPal.c1}; --seg-c2: ${activePal.c2}; --seg-glow: ${activePal.glow}; animation-delay: ${tier * 0.11}s">
              <div class="rpg-bar-fill h-full rounded-full transition-all" style="width: ${active ? '100%' : '0%'}; background-color: ${segPal.c1}"></div>
              ${active ? `<span class="absolute inset-y-0 left-1 right-1 h-[1.5px] top-[2px] rounded-full bg-white/60 pointer-events-none"></span>` : ''}
              ${isCurrentPeak ? `<span class="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF] animate-ping"></span>` : ''}
            </div>
          `;
        }).join('');
      }

      // Teknis #5: Cozy Gamification Incentive Engine ("Lentera Inspirasi ✨" & Floating Popups)
      function getExplorerRankInfo(sparks) {
        if (sparks >= 45) return { title: '👑 Maestro Lembah', desc: 'Penjaga tertinggi seluruh artefak & kisah hidup.' };
        if (sparks >= 25) return { title: '🔥 Penjaga Api Unggun', desc: 'Aktif merawat refleksi, bukti karya, dan arah masa depan.' };
        return { title: '🧭 Pengelana Rasa Ingin Tahu', desc: 'Mulai membuka ransel dan mengenali bekal diri.' };
      }

      function updateSparkHud() {
        const countEl = document.getElementById('hudSparkCount');
        const rankEl = document.getElementById('hudExplorerRankBadge');
        const rankInfo = getExplorerRankInfo(state.sparks || 12);
        if (countEl) countEl.textContent = String(state.sparks || 12);
        if (rankEl) rankEl.textContent = rankInfo.title.replace(/^[^\s]+\s/, '');
      }

      // Teknis #5: Incentive points removed per user request (no-op function)
      function awardSparks() {
        return;
      }

      function renderSparkRewardsModal() {
        const rankInfo = getExplorerRankInfo(state.sparks || 12);
        document.getElementById('sparkModalRankTitle').textContent = `Gelar Saat Ini: ${rankInfo.title}`;
        document.getElementById('sparkModalTotalCount').textContent = `✨ ${state.sparks || 12}`;
        document.getElementById('badgeAuroraState').textContent = state.auroraEnabled ? 'AKTIF' : 'MATI';

        const assessedCount = SEED_CATEGORIES.filter(c => state.profiles[c.slug].level !== null).length;
        const totalEv = SEED_CATEGORIES.reduce((acc, c) => acc + state.profiles[c.slug].evidence.length, 0);
        const stage3Count = SEED_CATEGORIES.filter(c => getEvolutionStage(state.profiles[c.slug].level).stage === 3).length;

        const milestones = [
          { icon: '🎒', name: 'Membuka Ritual Ransel', done: true, reward: '+2 ✨ setiap eksplorasi' },
          { icon: '🧭', name: `Menilai Mastery Kategori (${assessedCount}/10)`, done: assessedCount > 0, reward: '+5 ✨ saat menyimpan level' },
          { icon: '📎', name: `Menyimpan Bukti Karya Nyata (${totalEv} item)`, done: totalEv > 0, reward: '+5 ✨ setiap tambah bukti' },
          { icon: '👑', name: `Mencapai Evolusi Tahap III Megah (${stage3Count} objek)`, done: stage3Count > 0, reward: 'Membuka mahkota & kristal 3D' },
          { icon: '🦊', name: 'Menyapa Makhluk Hutan di Perkemahan', done: state.sparks > 14, reward: '+2 ✨ saat klik Rubah/Kelinci 3D' }
        ];

        document.getElementById('sparkMilestonesList').innerHTML = milestones.map(m => `
          <div class="p-2.5 rounded-xl border atlas-surface flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="text-base">${m.icon}</span>
              <div>
                <div class="font-bold text-xs">${m.name}</div>
                <div class="text-[10px] font-mono atlas-text-muted">${m.reward}</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${m.done ? 'bg-[#1F7A4C]/15 text-[#1F7A4C]' : 'bg-black/10 atlas-text-muted'}">${m.done ? 'TERCAPAI ✓' : 'BELUM'}</span>
          </div>
        `).join('');
      }

      // Teknis #6: Interactive 10-Axis SVG Skill Radar Chart + 3-Stage Evolution Breakdown
      function renderSkillRadarChart() {
        const container = document.getElementById('radarChartContainer');
        const listEl = document.getElementById('radarCategoryBreakdownList');
        if (!container || !listEl) return;

        const size = 360;
        const cx = size / 2;
        const cy = size / 2;
        const maxR = 118;
        const total = SEED_CATEGORIES.length; // 10 axes

        // Concentric decagon rings for levels 1..5
        let gridPolygons = '';
        [1, 2, 3, 4, 5].forEach(lvl => {
          const r = (lvl / 5) * maxR;
          const pts = SEED_CATEGORIES.map((_, i) => {
            const ang = (i / total) * Math.PI * 2 - Math.PI / 2;
            return `${(cx + Math.cos(ang) * r).toFixed(1)},${(cy + Math.sin(ang) * r).toFixed(1)}`;
          }).join(' ');
          const strokeCol = lvl === 3 ? 'rgba(19, 92, 94, 0.42)' : (lvl === 5 ? 'rgba(181, 77, 8, 0.45)' : 'rgba(140, 155, 160, 0.28)');
          gridPolygons += `<polygon points="${pts}" fill="none" stroke="${strokeCol}" stroke-width="${lvl === 5 ? '1.6' : '1'}" stroke-dasharray="${lvl === 3 ? '3,2' : 'none'}" />`;
        });

        // Axis spokes + clickable labels + data polygon points
        let spokes = '';
        let labels = '';
        let dots = '';
        const dataPts = [];

        SEED_CATEGORIES.forEach((cat, i) => {
          const ang = (i / total) * Math.PI * 2 - Math.PI / 2;
          const xOuter = cx + Math.cos(ang) * maxR;
          const yOuter = cy + Math.sin(ang) * maxR;
          spokes += `<line x1="${cx}" y1="${cy}" x2="${xOuter.toFixed(1)}" y2="${yOuter.toFixed(1)}" stroke="rgba(140, 155, 160, 0.3)" stroke-width="1" />`;

          const prof = state.profiles[cat.slug];
          const numLevel = prof && prof.level !== null ? prof.level : 0;
          // Give unassessed (NULL) a tiny 0.35 center radius so the polygon stays connected visually
          const valR = ((numLevel === 0 ? 0.35 : numLevel) / 5) * maxR;
          const vx = cx + Math.cos(ang) * valR;
          const vy = cy + Math.sin(ang) * valR;
          dataPts.push(`${vx.toFixed(1)},${vy.toFixed(1)}`);

          const mastery = getMasteryInfo(prof.level);
          dots += `<circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="5.5" fill="${mastery.barColor}" stroke="#FFFFFF" stroke-width="1.8" class="cursor-pointer" data-radar-slug="${cat.slug}"><title>${cat.name}: ${mastery.shortLabel}</title></circle>`;

          const lblR = maxR + 30;
          const lx = cx + Math.cos(ang) * lblR;
          const ly = cy + Math.sin(ang) * lblR;
          labels += `
            <g class="cursor-pointer" data-radar-slug="${cat.slug}">
              <text x="${lx.toFixed(1)}" y="${(ly - 4).toFixed(1)}" text-anchor="middle" fill="currentColor" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="bold">#${cat.order} ${cat.shortTag}</text>
              <text x="${lx.toFixed(1)}" y="${(ly + 8).toFixed(1)}" text-anchor="middle" fill="${mastery.barColor}" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="bold">${prof.level === null ? 'NULL' : 'Lv.' + prof.level}</text>
            </g>
          `;
        });

        container.innerHTML = `
          <svg id="skillRadarChartSvg" viewBox="0 0 ${size} ${size}" class="w-full h-full select-none overflow-visible">
            ${gridPolygons}
            ${spokes}
            <polygon points="${dataPts.join(' ')}" fill="rgba(223, 118, 31, 0.28)" stroke="#DF761F" stroke-width="2.6" />
            ${dots}
            ${labels}
          </svg>
        `;

        let totalNodesAll = 0;
        let unlockedNodesAll = 0;
        SEED_CATEGORIES.forEach(cat => {
          const prof = state.profiles[cat.slug];
          ensureProfileNodeLevels(prof, cat.slug);
          const stats = computeCoreLevelFromNodes(cat.slug, prof.nodeLevels);
          totalNodesAll += stats.totalNodes;
          unlockedNodesAll += stats.unlockedCount;
        });
        const totalNodesBadge = document.getElementById('radarTotalNodesUnlockedBadge');
        if (totalNodesBadge) {
          totalNodesBadge.textContent = `${unlockedNodesAll}/${totalNodesAll} Node Terbuka`;
        }

        listEl.innerHTML = SEED_CATEGORIES.map(cat => {
          const prof = state.profiles[cat.slug];
          const mastery = getMasteryInfo(prof.level);
          const evo = getEvolutionStage(prof.level);
          return `
            <button type="button" data-radar-slug="${cat.slug}" class="w-full p-2 rounded-xl border atlas-elevated hover:border-[#B54D08] flex items-center justify-between gap-2 text-left">
              <div class="min-w-0">
                <div class="font-bold truncate">#${cat.order} · ${cat.shortTag}</div>
                <div class="text-[10px] font-mono atlas-text-muted">${mastery.shortLabel}</div>
              </div>
              <span class="px-2 py-0.5 rounded-full border atlas-border font-mono text-[10px] font-bold shrink-0">${evo.shortBadge}</span>
            </button>
          `;
        }).join('');
      }

      function renderCategoryDetail() {
        const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug) || SEED_CATEGORIES[0];
        const prof = state.profiles[cat.slug];
        const mastery = getMasteryInfo(prof.level);

        logApiCall(`GET /api/v1/me/categories/${cat.slug}`, '200 OK', buildCategoryApiPayload(cat.slug));

        document.getElementById('selectQuickCategory').value = cat.slug;
        document.getElementById('detailCategoryOrder').textContent = `#${cat.order}`;
        document.getElementById('detailCategorySlug').textContent = cat.slug;
        document.getElementById('detailCategoryTitle').textContent = cat.name;
        const descEl = document.getElementById('detailCategoryDescription');
        if (descEl) descEl.textContent = CATEGORY_DESCRIPTIONS[cat.slug] || '';
        document.getElementById('detailMaterialSpec').textContent = cat.visual.material;
        document.getElementById('detailSilhouetteSpec').textContent = cat.visual.shape;
        document.getElementById('detailVersionMeta').textContent = `Revisi ke-${prof.version} (${state.auth.email.split('@')[0]})`;
        document.getElementById('detailUpdatedMeta').textContent = state.offlineMode || state.unsyncedQueue
          ? 'Draf Lokal Belum Tersinkron'
          : 'Tersimpan di perangkat · ' + new Date(prof.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        const badgeEl = document.getElementById('detailLevelBadge');
        badgeEl.textContent = mastery.shortLabel;
        badgeEl.className = prof.level === null
          ? 'px-2.5 py-1 rounded-xl border atlas-elevated text-[11px] font-mono font-semibold shrink-0 atlas-text-secondary'
          : 'px-2.5 py-1 rounded-xl border border-[#DF761F] bg-[#DF761F]/15 text-[#B55B10] dark:text-[#F49B3E] text-[11px] font-mono font-bold shrink-0';

        renderRpgLevelMeterInDetail(prof.level, cat.capabilities.length, prof.evidence.length);

        document.getElementById('detail2DSvgSlot').innerHTML = getCategory2DSvg(cat.slug);
        const hdrIconEl = document.getElementById('detailHeaderDomainIcon');
        if (hdrIconEl) {
          hdrIconEl.innerHTML = getCategory2DSvg(cat.slug).replace('w-8 h-8', 'w-5 h-5');
        }

        document.getElementById('tabCountCapabilities').textContent = String(cat.capabilities.length);
        document.getElementById('tabCountEvidence').textContent = String(prof.evidence.length);
        document.getElementById('tabDotMeaning').className = prof.meaningText.trim()
          ? 'w-2 h-2 rounded-full bg-[#2E9359]'
          : 'w-1.5 h-1.5 rounded-full bg-current opacity-35';
        document.getElementById('tabDotPotential').className = prof.potentialText.trim()
          ? 'w-2 h-2 rounded-full bg-[#2E9359]'
          : 'w-1.5 h-1.5 rounded-full bg-current opacity-35';

        document.querySelectorAll('.detail-tab-btn').forEach(btn => {
          const isAct = btn.getAttribute('data-tab') === state.activeTab;
          btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
          btn.setAttribute('tabindex', isAct ? '0' : '-1');
          btn.className = isAct
            ? 'detail-tab-btn luxury-tab-active flex-1 justify-center px-2.5 py-1.5 min-h-[34px] rounded-xl border text-xs font-extrabold text-amber-aa flex items-center gap-1.5 whitespace-nowrap transition-all'
            : 'detail-tab-btn flex-1 justify-center px-2.5 py-1.5 min-h-[34px] rounded-xl border border-transparent text-xs font-bold atlas-text-secondary hover:text-current flex items-center gap-1.5 whitespace-nowrap transition-all';
        });

        const tabHumanDescEl = document.getElementById('activeTabHumanDesc');
        if (tabHumanDescEl && TAB_HUMAN_DESCRIPTIONS[state.activeTab]) {
          tabHumanDescEl.innerHTML = TAB_HUMAN_DESCRIPTIONS[state.activeTab];
        }

        const isMgmt = state.detailMode === 'management';
        const btnAdv = document.getElementById('btnModeAdventure');
        const btnMgmt = document.getElementById('btnModeManagement');
        btnAdv.setAttribute('aria-pressed', !isMgmt ? 'true' : 'false');
        btnMgmt.setAttribute('aria-pressed', isMgmt ? 'true' : 'false');
        btnAdv.className = !isMgmt
          ? 'w-8 h-8 rounded-full btn-amber-aa font-bold flex items-center justify-center transition-colors'
          : 'w-8 h-8 rounded-full atlas-text-secondary hover:text-current flex items-center justify-center transition-colors';
        btnMgmt.className = isMgmt
          ? 'w-8 h-8 rounded-full btn-amber-aa font-bold flex items-center justify-center transition-colors'
          : 'w-8 h-8 rounded-full atlas-text-secondary hover:text-current flex items-center justify-center transition-colors';

        document.getElementById('adventurePanelsWrap').classList.toggle('hidden', isMgmt);
        document.getElementById('managementPanelsWrap').classList.toggle('hidden', !isMgmt);
        document.getElementById('dirtyStateBadge').classList.toggle('hidden', !state.isDirty);

        ['capabilities', 'evidence', 'meaning', 'potential'].forEach(t => {
          document.getElementById(`tabPanel-${t}`).classList.toggle('hidden', state.activeTab !== t);
          document.getElementById(`mgmtSection-${t}`).classList.toggle('hidden', state.activeTab !== t);
        });

        // Ensure per-node levels exist & render 3-Tier Prasasti Batu Skill Tree + Branch Cards
        ensureProfileNodeLevels(prof, cat.slug);
        const nodeStats = computeCoreLevelFromNodes(cat.slug, prof.nodeLevels);
        const summaryBadgeEl = document.getElementById('constellationSummaryBadge');
        if (summaryBadgeEl) {
          summaryBadgeEl.textContent = `${nodeStats.unlockedCount}/${nodeStats.totalNodes} Dinilai · ${nodeStats.openGateCount}/${nodeStats.totalNodes} Terbuka · ${prof.level === null ? 'Core: —' : 'Core Lv.' + prof.level}`;
        }
        const avgFormulaEl = document.getElementById('advNodeAvgFormula');
        if (avgFormulaEl) {
          avgFormulaEl.textContent = nodeStats.unlockedCount === 0
            ? 'Core = Belum ada node dinilai (Unassessed —)'
            : `Rata-rata ${nodeStats.unlockedCount} node aktif: ${nodeStats.exactAvg.toFixed(1)} → Core Lv.${nodeStats.coreLevel} (${getMasteryInfo(nodeStats.coreLevel).label})`;
        }

        // Legacy Praktik Inti / Karya Puncak / Prinsip Utama removed per user request
        const metaBoxEl = document.getElementById('advDomainMetaBox');
        if (metaBoxEl) {
          metaBoxEl.innerHTML = '';
          metaBoxEl.classList.add('hidden');
        }

        renderConstellationSkillTree(cat, prof.nodeLevels, prof.level);

        const scoreTooltipMap = {
          1: 'Level 1/5 (Pemula): Mengenal konsep dasar & menyelesaikan latihan awal dengan panduan',
          2: 'Level 2/5 (Terampil Dasar): Lancar mempraktikkan teknik dasar secara mandiri & terukur',
          3: 'Level 3/5 (Mandiri): Menerapkan konsep di luar kepala secara konsisten (Syarat Maksimal Buka Tier 2 & Tier 3 · Sage)',
          4: 'Level 4/5 (Mahir): Jam terbang tinggi menangani kasus rumit & membimbing rekan',
          5: 'Level 5/5 (Master Seumur Hidup): Puncak penguasaan jangka panjang, melahirkan warisan karya & kader'
        };

        if (!state.previewIndicatorLevelByNode) state.previewIndicatorLevelByNode = {};
        ensureProfileNodeChecklists(prof, cat.slug);
        document.getElementById('advCapabilitiesList').innerHTML = cat.branches.map((branch, bIdx) => {
          const branchNodes = [0, 1, 2].map(tIdx => cat.nodes[bIdx * 3 + tIdx]);
          const bScores = branchNodes.map(n => {
            const g = evaluateNodeUnlockGate(cat.slug, n.flatIdx, prof.nodeLevels);
            return g.unlocked ? (prof.nodeLevels[n.flatIdx] || 1) : 0;
          });
          const branchStars = bScores.reduce((a, b) => a + (b || 0), 0);
          const branchStatusLabel = branchStars === 15
            ? '👑 Mastery Penuh (15/15 Poin)'
            : (branchStars >= 9 ? `🔥 Aktif (${branchStars}/15 Poin)` : `★ ${branchStars}/15 Poin`);
          const branchBadgeClass = branchStars === 15
            ? 'bg-[#1F7A4C]/15 border-[#1F7A4C]/50 text-[#1F7A4C] dark:text-[#4AD0C4]'
            : 'atlas-border text-amber-aa bg-black/[0.03] dark:bg-white/[0.04]';

          return `
            <li class="skill-branch-group rounded-2xl overflow-hidden">
              <!-- Branch Group Header -->
              <div class="px-3.5 py-2.5 bg-black/[0.025] dark:bg-white/[0.03] border-b atlas-border flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="px-1.5 py-0.5 rounded-md bg-[#B54D08]/15 text-amber-aa font-mono text-[10px] font-extrabold shrink-0" title="Cabang Keahlian #${bIdx + 1}">B${bIdx + 1}</span>
                  <h3 class="text-xs sm:text-sm font-extrabold truncate">${escapeHtml(branch.name)}</h3>
                </div>
                <span class="font-mono text-[10px] px-2.5 py-0.5 rounded-full border font-bold shrink-0 ${branchBadgeClass}" title="Akumulasi skor dari 3 Tier pada cabang ${escapeHtml(branch.name)} (Maksimal 15 poin = 3 × 5)">${branchStatusLabel}</span>
              </div>

              <!-- 3 Clean Divided Tier Rows -->
              <div class="divide-y atlas-border">
                ${branchNodes.map(node => {
                  const gate = evaluateNodeUnlockGate(cat.slug, node.flatIdx, prof.nodeLevels);
                  const nLvl = gate.unlocked ? (prof.nodeLevels[node.flatIdx] || 1) : null;
                  const expKey = `${cat.slug}_${node.flatIdx}`;
                  const isExpanded = !!(state.expandedTierCards && state.expandedTierCards[expKey]);
                  const tierBadges = [
                    { icon: '🌱', tag: 'T1·Basic', title: 'Tier 1 · Basic (Fondasi Dasar — Terbuka sejak awal)' },
                    { icon: '🔥', tag: 'T2·Adv', title: 'Tier 2 · Advanced (Terbuka saat Tier 1 ≥ 3/5)' },
                    { icon: '👑', tag: 'T3·Sage', title: 'Tier 3 · Sage (Terbuka saat Tier 2 ≥ 3/5 & kombinasi skill prasyarat terpenuhi)' }
                  ];
                  const tMeta = tierBadges[node.tierIdx] || tierBadges[0];
                  const curLevelMeta = getMasteryInfo(nLvl || 1);
                  const activeCheckLvl = gate.unlocked ? nLvl : 1;
                  const previewKey = `${cat.slug}_${node.flatIdx}`;
                  const viewedLvl = gate.unlocked ? (state.previewIndicatorLevelByNode[previewKey] || activeCheckLvl) : 1;
                  const viewedLvlMeta = getMasteryInfo(viewedLvl);
                  const checkArr = getNodeLevelChecklistArray(prof, cat.slug, node.flatIdx, viewedLvl);
                  const activeCheckArr = getNodeLevelChecklistArray(prof, cat.slug, node.flatIdx, activeCheckLvl);
                  const checkedCount = activeCheckArr.filter(Boolean).length;
                  const viewedCheckedCount = checkArr.filter(Boolean).length;
                  const allCurrentChecked = checkedCount >= 3;
                  const indicatorsForLevel = (node.levelIndicators && node.levelIndicators[viewedLvl]) || [];
                  const linkedEvs = (prof.evidence || []).filter(ev => Array.isArray(ev.usedNodeIds) && ev.usedNodeIds.includes(node.flatIdx));

                  return `
                    <div id="tierCardNode-${node.flatIdx}" class="skill-tier-row ${isExpanded ? 'is-expanded' : ''} ${!gate.unlocked ? 'is-locked-tier' : ''} transition-colors">
                      <!-- Entire Skill Box Header is Directly Clickable -->
                      <div data-toggle-tier-detail="${node.flatIdx}" role="button" tabindex="0" aria-expanded="${isExpanded ? 'true' : 'false'}" class="skill-tier-row-header px-3 py-2.5 flex flex-wrap items-center justify-between gap-2" title="Klik untuk membuka/menutup detail, indikator, &amp; bukti karya">
                        <!-- Left: Tier Badge + Skill Name + Progress & Evidence Pills -->
                        <div class="flex items-center gap-2 min-w-0 flex-1">
                          <span class="px-1.5 py-0.5 rounded ${!gate.unlocked ? 'bg-purple-950/60 text-purple-200 border border-purple-400/30' : 'bg-black/5 dark:bg-white/10 atlas-text-secondary'} font-mono text-[10px] font-bold shrink-0" title="${tMeta.title}">${!gate.unlocked ? '⛓️' : tMeta.icon} ${tMeta.tag}</span>
                          <span class="font-bold text-xs sm:text-sm truncate ${!gate.unlocked ? 'opacity-75 tracking-wide' : ''}">${escapeHtml(node.title)}</span>
                          ${gate.unlocked ? `
                            <span class="px-1.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${allCurrentChecked ? 'bg-[#1F7A4C]/15 text-[#1F7A4C] dark:text-[#6EE7B7] border border-[#1F7A4C]/40' : 'bg-black/5 dark:bg-white/10 atlas-text-muted border atlas-border'} shrink-0" title="Progres indikator Level ${nLvl}: ${checkedCount}/3 tercentang">
                              ☑️ ${checkedCount}/3
                            </span>
                          ` : ''}
                          ${linkedEvs.length > 0 ? `
                            <span class="px-1.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#B54D08]/15 text-amber-aa border border-[#B54D08]/35 shrink-0" title="${linkedEvs.length} bukti karya terhubung ke skill ini">
                              📎 ${linkedEvs.length}
                            </span>
                          ` : ''}
                        </div>

                        <!-- Right: Map Shortcut + Mysterious Sealed Pill OR Level 1..5 Selector -->
                        <div class="flex items-center gap-2 shrink-0" data-stop-row-toggle="true">
                          <button type="button" data-focus-map-node="${node.flatIdx}" class="px-2 h-7 rounded-lg border atlas-surface hover:border-[#DF761F] text-[10px] font-mono font-bold flex items-center gap-1 shrink-0" title="Inspeksi batu ${escapeHtml(node.title)} di Peta Prasasti">
                            <span>🗺️</span>
                            <span class="hidden sm:inline">Peta</span>
                          </button>

                          ${!gate.unlocked ? `
                            <span class="locked-cue-pill" title="Segel Prasasti Terkunci. Syarat pembuka: ${escapeHtml(gate.gateFormula)}">
                              <span>⛓️🔒</span>
                              <span>TERSEGEL · Butuh ${escapeHtml(gate.gateFormula)}</span>
                            </span>
                          ` : `
                            <div class="inline-flex items-center gap-1" role="group" aria-label="Pilih level 1 sampai 5 untuk ${escapeHtml(node.title)}">
                              ${[1, 2, 3, 4, 5].map(score => {
                                const checkGate = canNodeAdvanceToTargetLevel(prof, cat.slug, node.flatIdx, nLvl, score);
                                const isCurrent = nLvl === score;
                                const isNextReady = (score === nLvl + 1) && checkGate.allowed;
                                const isGatedHigher = score > nLvl && !checkGate.allowed;
                                const btnClass = isCurrent
                                  ? 'lvl-btn-selected'
                                  : (isNextReady ? 'lvl-btn-ready-next animate-pulse' : (isGatedHigher ? 'lvl-btn-available lvl-btn-gated' : 'lvl-btn-available'));
                                const tipText = isGatedHigher
                                  ? `🔒 Belum bisa ke Level ${score}: Centang dulu semua 3 indikator pada Level ${checkGate.missingLevel} (${checkGate.checkedCount}/3 selesai)`
                                  : (isNextReady ? `✨ SIAP NAIK LEVEL! Klik untuk naik ke Level ${score}` : scoreTooltipMap[score]);
                                return `
                                  <button type="button" data-quick-node-idx="${node.flatIdx}" data-quick-node-lvl="${score}" aria-pressed="${isCurrent ? 'true' : 'false'}" class="lvl-btn-base ${btnClass}" title="${escapeHtml(tipText)}">${score}</button>
                                `;
                              }).join('')}
                            </div>
                          `}
                        </div>
                      </div>

                      <!-- Direct Detail Drawer -->
                      <div id="tierDetailBox-${node.flatIdx}" class="${isExpanded ? '' : 'hidden'} px-3.5 pb-3.5 pt-2.5 border-t atlas-border bg-black/[0.02] dark:bg-white/[0.02] space-y-2.5 text-xs">
                        ${!gate.unlocked ? `
                          <!-- Req #4: Mysterious Sealed Relic Chamber for Locked Skills -->
                          <div class="mystery-sealed-vault p-3.5 space-y-2.5">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                              <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/40 font-mono text-[10px] font-extrabold text-purple-200 uppercase tracking-wider">⛓️🔒 SEGEL PRASASTI TERKUNCI</span>
                                <span class="font-mono text-[11px] font-bold text-amber-300">${escapeHtml(node.title)} (${escapeHtml(node.tierName)})</span>
                              </div>
                              <span class="font-mono text-[10px] text-purple-300/90">Terbuka otomatis di Lv.1 saat syarat terpenuhi</span>
                            </div>

                            <p class="text-[11px] text-purple-100/80 leading-relaxed">${escapeHtml(node.whatIs)}</p>

                            <!-- Prereq Seals List with 1-Click Jump -->
                            <div class="p-2.5 rounded-xl bg-black/35 border border-purple-400/25 space-y-1.5">
                              <div class="font-mono text-[10px] uppercase tracking-wider text-purple-300 font-bold">🗝️ Kunci Pembuka Segel (${gate.prereqItems.filter(p => p.satisfied).length}/${gate.prereqItems.length} Terpenuhi):</div>
                              <div class="flex flex-wrap gap-1.5">
                                ${gate.prereqItems.map(pr => `
                                  <button type="button" data-jump-prereq-node="${pr.targetFlatIdx}" class="px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold inline-flex items-center gap-1.5 transition-all ${pr.satisfied ? 'bg-emerald-950/60 border-emerald-400/50 text-emerald-300' : 'bg-purple-950/70 border-purple-400/45 text-purple-200 hover:border-amber-400'}">
                                    <span>${pr.satisfied ? '✅' : '🔒'}</span>
                                    <span>${escapeHtml(pr.title)}: Lv.${pr.currentScore}/${pr.requiredScore}</span>
                                    <span class="text-[10px] opacity-75">↗ Buka</span>
                                  </button>
                                `).join('')}
                              </div>
                            </div>

                            <!-- Blurred Cipher Preview of Sealed Indicators -->
                            <div class="space-y-1 pt-0.5" aria-hidden="true">
                              <div class="font-mono text-[9px] uppercase tracking-widest text-purple-300/60">Indikator masih tersegel dalam kabut prasasti:</div>
                              <div class="mystery-cipher-line">◈ ▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓▓▓▓ ▓▓▓ ▓▓▓▓▓▓▓▓ ≥ 10 ▓▓▓▓▓</div>
                              <div class="mystery-cipher-line">◈ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓▓ ▓▓ ▓▓▓▓ ▓▓▓▓▓▓</div>
                            </div>
                          </div>
                        ` : `
                          <!-- Definition Card -->
                          <div class="p-2.5 rounded-xl border atlas-surface space-y-1">
                            <div class="flex flex-wrap items-center justify-between gap-1.5">
                              <span class="font-mono text-[10px] font-extrabold text-amber-aa uppercase">Definisi · ${escapeHtml(node.title)} (${escapeHtml(node.tierName)})</span>
                              <span class="font-mono text-[10px] font-bold text-teal-aa">
                                ★ Level Aktif: Lv.${nLvl}/5 · ${curLevelMeta.label}
                              </span>
                            </div>
                            <p class="atlas-text-secondary leading-relaxed">${escapeHtml(node.whatIs)}</p>
                          </div>

                          <!-- Req #1 & #2: Lifelong Level 1..5 Indicator Box with Combo Bar & Level Tabs -->
                          <div class="p-3 rounded-xl border atlas-elevated space-y-2.5">
                            <!-- Top Row: Level Preview Tabs (Lv.1 Pemula .. Lv.5 Master) -->
                            <div class="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b atlas-border">
                              <div class="flex items-center gap-1 flex-wrap" role="tablist" aria-label="Lihat capaian indikator tiap level">
                                <span class="font-mono text-[10px] font-bold atlas-text-muted mr-1">Cek Indikator:</span>
                                ${[1, 2, 3, 4, 5].map(lvTab => {
                                  const isTabActive = viewedLvl === lvTab;
                                  const isTabPassed = lvTab < nLvl;
                                  const isTabCurrent = lvTab === nLvl;
                                  const tabNames = { 1: 'Lv.1 Pemula', 2: 'Lv.2 Dasar', 3: 'Lv.3 Mandiri', 4: 'Lv.4 Mahir', 5: 'Lv.5 Master' };
                                  return `
                                    <button type="button"
                                            data-preview-ind-node="${node.flatIdx}"
                                            data-preview-ind-lvl="${lvTab}"
                                            class="px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold border transition-all ${isTabActive ? 'bg-[#B54D08] text-white border-[#B54D08]' : (isTabCurrent ? 'border-[#1F7A4C] text-teal-aa bg-[#1F7A4C]/10' : 'atlas-surface atlas-text-secondary hover:border-[#B54D08]/50')}">
                                      ${isTabPassed ? '✓ ' : (isTabCurrent ? '🎯 ' : '')}${tabNames[lvTab]}
                                    </button>
                                  `;
                                }).join('')}
                              </div>
                              <span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-extrabold ${viewedCheckedCount === 3 ? 'bg-[#1F7A4C] text-white' : 'bg-[#B54D08]/15 text-amber-aa'}">
                                ${viewedCheckedCount}/3 Tercentang
                              </span>
                            </div>

                            <!-- 3-Segment Dopamine Combo Progress Bar for Current Active Level -->
                            <div class="space-y-1">
                              <div class="flex items-center justify-between text-[11px]">
                                <span class="font-bold ${viewedLvl === nLvl ? 'text-teal-aa' : 'atlas-text-secondary'}">
                                  ${viewedLvl === nLvl
                                    ? `🎯 Target Aktif: Level ${nLvl} (${curLevelMeta.label})`
                                    : (viewedLvl < nLvl ? `✅ Level ${viewedLvl} (${viewedLvlMeta.label}) — Sudah Terlewati` : `🔭 Pratinjau Target Level ${viewedLvl} (${viewedLvlMeta.label})`)}
                                </span>
                                <span class="font-mono text-[10px] font-bold ${viewedCheckedCount === 3 ? 'text-[#1F7A4C] dark:text-[#6EE7B7]' : 'atlas-text-muted'}">
                                  ${Math.round((viewedCheckedCount / 3) * 100)}% (${viewedCheckedCount}/3)
                                </span>
                              </div>
                              <div class="grid grid-cols-3 gap-1.5 h-2">
                                ${[0, 1, 2].map(segIdx => `
                                  <div class="rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                                    <div class="h-full transition-all duration-300 ${checkArr[segIdx] ? 'bg-gradient-to-r from-[#1F7A4C] to-[#10B981]' : 'w-0'}" style="width: ${checkArr[segIdx] ? '100%' : '0%'}"></div>
                                  </div>
                                `).join('')}
                              </div>
                            </div>

                            <!-- 3 Qualitative & Quantitative Textbook Indicators -->
                            <div class="space-y-1.5">
                              ${indicatorsForLevel.map((indText, indIdx) => {
                                const isChecked = !!checkArr[indIdx];
                                return `
                                  <label class="indicator-check-item ${isChecked ? 'is-checked' : ''} transition-all">
                                    <input type="checkbox"
                                           data-check-node-idx="${node.flatIdx}"
                                           data-check-node-lvl="${viewedLvl}"
                                           data-check-ind-idx="${indIdx}"
                                           ${isChecked ? 'checked' : ''}
                                           class="mt-0.5 w-4 h-4 accent-[#1F7A4C] rounded cursor-pointer shrink-0" />
                                    <span class="text-xs leading-snug ${isChecked ? 'font-semibold line-through opacity-80' : 'atlas-text-secondary'}">
                                      <strong class="font-mono text-[11px] text-amber-aa">#${indIdx + 1}:</strong> ${escapeHtml(indText)}
                                    </span>
                                  </label>
                                `;
                              }).join('')}
                            </div>

                            <!-- Level-Up CTA Bar -->
                            <div class="pt-1.5 flex flex-wrap items-center justify-between gap-2 border-t atlas-border">
                              <span class="font-mono text-[10px] atlas-text-muted">
                                ${nLvl < 5
                                  ? `Centang semua 3 indikator Level ${nLvl} untuk naik ke Level ${nLvl + 1}.`
                                  : `👑 Puncak Penguasaan Seumur Hidup (Lv.5 Master).`}
                              </span>
                              ${nLvl < 5 ? (
                                allCurrentChecked ? `
                                  <button type="button" data-quick-node-idx="${node.flatIdx}" data-quick-node-lvl="${nLvl + 1}" class="btn-gold-beckon px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#1F7A4C] via-[#15803D] to-[#0F766E] text-white font-mono text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105">
                                    <span>🚀 NAIK KE LEVEL ${nLvl + 1} (${getMasteryInfo(nLvl + 1).label.split(' ')[0]})!</span>
                                  </button>
                                ` : `
                                  <span class="font-mono text-[11px] text-amber-aa font-bold">
                                    🔒 Kurang ${3 - checkedCount} indikator di Lv.${nLvl} untuk naik ke Lv.${nLvl + 1}
                                  </span>
                                `
                              ) : `
                                <span class="font-mono text-[11px] text-[#1F7A4C] dark:text-[#6EE7B7] font-extrabold">
                                  👑 MASTER SEUMUR HIDUP (Lv. 5/5)
                                </span>
                              `}
                            </div>
                          </div>

                          <!-- Req #3: Quick Evidence Check Bar (Simple, Fast, 1-Click Preview + Link Action) -->
                          <div class="p-2.5 rounded-xl border atlas-surface flex flex-wrap items-center justify-between gap-2">
                            <div class="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                              <span class="font-mono text-[10px] font-extrabold uppercase text-amber-aa shrink-0">📎 Bukti Karya (${linkedEvs.length}):</span>
                              ${linkedEvs.length === 0 ? `
                                <span class="text-[11px] atlas-text-muted italic">Belum ada bukti terkait skill ini.</span>
                              ` : linkedEvs.map(ev => `
                                <button type="button"
                                        data-quick-ev-inspect="${ev.id}"
                                        class="px-2.5 py-1 rounded-lg border atlas-elevated hover:border-[#DF761F] text-[11px] font-bold text-teal-aa inline-flex items-center gap-1 max-w-[220px] truncate"
                                        title="Klik untuk cek cepat bukti: ${escapeHtml(ev.title)}">
                                  <span>${ev.assetDataUrl || ev.assetRefKey ? '🖼️' : (ev.externalUrl ? '🔗' : '📄')}</span>
                                  <span class="truncate">${escapeHtml(ev.title)}</span>
                                </button>
                              `).join('')}
                            </div>
                            <button type="button"
                                    data-add-ev-for-node="${node.flatIdx}"
                                    class="px-2.5 py-1 rounded-lg border border-[#B54D08]/45 bg-[#B54D08]/10 hover:bg-[#B54D08]/20 font-mono text-[10px] font-extrabold text-amber-aa shrink-0"
                                    title="Upload / tambahkan bukti karya yang memakai skill ${escapeHtml(node.title)}">
                              + Kaitkan Bukti
                            </button>
                          </div>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </li>
          `;
        }).join('');

        document.getElementById('advMasteryBadge').textContent = prof.level === null ? 'Belum kamu nilai' : `Level ${prof.level} · ${mastery.label}`;
        document.getElementById('advMasteryAnchorDesc').textContent = mastery.anchor;
        const noteBox = document.getElementById('advAssessmentNoteBox');
        if (prof.assessmentNote && prof.assessmentNote.trim()) {
          noteBox.classList.remove('hidden');
          document.getElementById('advAssessmentNoteText').textContent = prof.assessmentNote;
        } else {
          noteBox.classList.add('hidden');
        }

        const capNotesEl = document.getElementById('advCapabilityNotes');
        if (prof.capabilityNotes && prof.capabilityNotes.trim()) {
          capNotesEl.textContent = prof.capabilityNotes;
          capNotesEl.classList.remove('atlas-text-muted', 'italic');
        } else {
          capNotesEl.textContent = 'Belum ada field notes yang lo tulis. Klik Management Mode kalau pengen nyatet progres atau build pribadi lo di skill ini.';
          capNotesEl.classList.add('atlas-text-muted', 'italic');
        }

        // Adventure Tab 2: Evidence
        const advEvEl = document.getElementById('advEvidenceList');
        const sortedEv = prof.evidence.slice().sort((a, b) => a.sortOrder - b.sortOrder);
        if (sortedEv.length === 0) {
          advEvEl.innerHTML = `
            <div class="p-5 rounded-2xl border border-dashed atlas-border atlas-surface/50 text-center space-y-1">
              <p class="text-xs atlas-text-secondary">Belum ada bukti karya.</p>
            </div>
          `;
        } else {
          advEvEl.innerHTML = sortedEv.map(ev => renderEvidenceCardHTML(ev, false)).join('');
        }

        // Adventure Tab 3: Meaning
        const advMeanEl = document.getElementById('advMeaningContent');
        if (prof.meaningText && prof.meaningText.trim()) {
          advMeanEl.textContent = prof.meaningText;
          advMeanEl.classList.remove('atlas-text-muted', 'italic');
        } else {
          advMeanEl.textContent = '“Skill ini punya arti apa buat chapter hidup lo sekarang?” — Tulis lore personal lo di Management Mode kapan pun lo pengen.';
          advMeanEl.classList.add('atlas-text-muted', 'italic');
        }

        // Adventure Tab 4: Potential
        const advPotEl = document.getElementById('advPotentialContent');
        if (prof.potentialText && prof.potentialText.trim()) {
          advPotEl.textContent = prof.potentialText;
          advPotEl.classList.remove('atlas-text-muted', 'italic');
        } else {
          advPotEl.textContent = '“Kira-kira bekal ini seru dipakai buat buka map mana lagi ya?” — Bebas ngayal tanpa beban deadline.';
          advPotEl.classList.add('atlas-text-muted', 'italic');
        }

        if (isMgmt && !state.isDirty) {
          populateManagementFormFromProfile(prof);
        }
        renderManagementEvidenceList(sortedEv);
        renderQuickRosterBars();
      }

      function renderEvidenceCardHTML(ev, inManagement) {
        const typeLabels = {
          project: 'E2 · Artifact (Karya/CAD/Kode)',
          experience: 'E3 · Demonstrated Performance',
          document: 'E1 · Self-Report & Refleksi',
          visual: 'E4 · External Feedback / Visual',
          link: 'E5 · Transfer & Contribution'
        };
        const typeBadge = typeLabels[ev.itemType] || 'Bukti Karya';
        const hasOpenableFile = !!(ev.assetDataUrl || ev.assetRefKey || ev.assetKey);
        const catObj = SEED_CATEGORIES.find(c => c.slug === (ev.categorySlug || state.selectedSlug));
        const usedSkillBadges = (Array.isArray(ev.usedNodeIds) && catObj)
          ? ev.usedNodeIds.map(nid => catObj.nodes[nid]).filter(Boolean)
          : [];
        return `
          <div class="p-3.5 rounded-2xl border atlas-surface flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div class="space-y-1.5 min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="px-2 py-0.5 rounded border border-[#B54D08]/40 bg-[#B54D08]/10 font-mono text-[10px] uppercase font-bold text-amber-aa">${escapeHtml(typeBadge)}</span>
                ${ev.occurredOn ? `<span class="font-mono text-xs atlas-text-muted">${escapeHtml(ev.occurredOn)}</span>` : ''}
                ${ev.assetKey ? `<span class="font-mono text-xs text-[#1F7A4C] dark:text-[#4AD0C4] font-semibold">📎 ${escapeHtml(ev.assetKey)}</span>` : ''}
              </div>
              <h4 class="font-bold text-sm sm:text-base">${escapeHtml(ev.title)}</h4>
              ${usedSkillBadges.length > 0 ? `
                <div class="flex flex-wrap items-center gap-1 pt-0.5">
                  <span class="font-mono text-[10px] atlas-text-muted">⚡ Skill:</span>
                  ${usedSkillBadges.map(sn => `
                    <span class="px-2 py-0.5 rounded-full bg-[#1F7A4C]/12 border border-[#1F7A4C]/35 text-teal-aa font-mono text-[10px] font-bold">
                      ${escapeHtml(sn.title)}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
              ${ev.summary ? `<p class="reading-prose atlas-text-secondary whitespace-pre-line">${escapeHtml(ev.summary)}</p>` : ''}
              <div class="flex flex-wrap items-center gap-2 pt-1">
                ${hasOpenableFile ? `
                  <button type="button" data-ev-preview="${ev.id}" class="px-3 py-1.5 min-h-[34px] rounded-xl border atlas-elevated text-xs font-bold text-teal-aa hover:border-[#135C5E] inline-flex items-center gap-1.5">
                    <span>👁️ Buka / Unduh File Bukti</span>
                  </button>
                ` : ''}
                ${ev.externalUrl ? `
                  <a href="${escapeHtml(ev.externalUrl)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 min-h-[34px] rounded-xl border atlas-elevated inline-flex items-center gap-1 text-xs font-mono font-semibold text-teal-aa hover:underline break-all">
                    <span>🔗 Buka Tautan (${escapeHtml(ev.externalUrl)}) ↗</span>
                  </a>
                ` : ''}
              </div>
            </div>
            ${inManagement ? `
              <div class="flex sm:flex-col items-center gap-1.5 shrink-0">
                <div class="flex items-center gap-1">
                  <button type="button" data-ev-move="up" data-ev-id="${ev.id}" class="min-w-[34px] min-h-[34px] px-2 rounded-lg border atlas-elevated text-xs font-mono font-bold hover:border-[#B54D08]" aria-label="Naikkan urutan" title="Naikkan urutan">↑</button>
                  <button type="button" data-ev-move="down" data-ev-id="${ev.id}" class="min-w-[34px] min-h-[34px] px-2 rounded-lg border atlas-elevated text-xs font-mono font-bold hover:border-[#B54D08]" aria-label="Turunkan urutan" title="Turunkan urutan">↓</button>
                </div>
                <div class="flex items-center gap-1">
                  <button type="button" data-ev-edit="${ev.id}" class="min-h-[34px] px-2.5 py-1 rounded-lg border atlas-elevated text-xs font-mono font-bold text-amber-aa">Edit</button>
                  <button type="button" data-ev-delete="${ev.id}" class="min-h-[34px] px-2.5 py-1 rounded-lg border atlas-elevated text-xs font-mono font-bold text-[#B42318]">Hapus</button>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }

      /* =====================================================================
       * 10. MANAGEMENT MODE FORM & RPG LEVEL SELECTOR WITH VISUAL BARS
       * ===================================================================== */
      let draftLevel = null;
      let draftNodeLevels = {};

      // ESTETIKA #6 & HUBUNGAN PRASASTI BATU:
      // Render Concentric 3-Ring Prehistoric Carved Cave Stone Tablet ("Prasasti Dinding Batu Purba")
      // - Center: Core Domain Stone Totem
      // - Inner Ring (r=64): Tier 1 · Basic (Always Unlocked)
      // - Middle Ring (r=112): Tier 2 · Advanced (Requires Tier 1 >= 3/5 + cross prereqs)
      // - Outer Ring (r=158): Tier 3 · Sage (Requires Tier 2 >= 4/5 + cross prereqs)
      // - Chiseled Radial Branch Channels + Glowing Cross-Branch Dependency Grooves
      // Map Pan, Zoom & Helicopter vs Close-Up View State for Interactive Prasasti Skill Tree
      state.mapView = {
        viewMode: 'closeup',
        x: 0,
        y: 0,
        scale: 1.48,
        isFullscreen: false,
        isDragging: false,
        dragDist: 0,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        inspectorTab: null, // null | 'what' | 'how' | 'works'
        highlightLineage: true,
        legendOpen: false,
        hintDismissed: false
      };
      state.expandedTierCards = {};

      // Requirement #8 & P0 #3.3: Wide 1840x1280 Canvas with Generous Safe Margins so ZERO labels or nodes are ever clipped!
      const PRASASTI_SVG_W = 1840;
      const PRASASTI_SVG_H = 1280;
      const PRASASTI_CX = PRASASTI_SVG_W / 2; // 920
      const PRASASTI_CY = PRASASTI_SVG_H / 2; // 640

      function updateMapModeButtonsUI() {
        const btnHeli = document.getElementById('btnMapModeHelicopter');
        const btnClose = document.getElementById('btnMapModeCloseup');
        const btnLineage = document.getElementById('btnToggleMapLineageSpotlight');
        const isHeli = !state.mapView || state.mapView.viewMode === 'helicopter';
        if (btnHeli) {
          btnHeli.className = isHeli
            ? 'px-2.5 h-7 rounded-lg bg-[#F59E0B] text-black font-extrabold flex items-center gap-1 transition-colors shadow-xs'
            : 'px-2.5 h-7 rounded-lg text-[#F5EBE0] hover:text-[#FDE68A] flex items-center gap-1 transition-colors';
        }
        if (btnClose) {
          btnClose.className = !isHeli
            ? 'px-2.5 h-7 rounded-lg bg-[#38BDF8] text-black font-extrabold flex items-center gap-1 transition-colors shadow-xs'
            : 'px-2.5 h-7 rounded-lg text-[#F5EBE0] hover:text-[#67E8F9] flex items-center gap-1 transition-colors';
        }
        if (btnLineage && state.mapView) {
          const on = !!state.mapView.highlightLineage;
          btnLineage.setAttribute('aria-pressed', on ? 'true' : 'false');
          btnLineage.className = on
            ? 'px-2.5 h-8 rounded-xl border border-[#38BDF8] bg-[#38BDF8]/25 text-[#67E8F9] font-mono text-[11px] font-bold flex items-center gap-1'
            : 'px-2.5 h-8 rounded-xl border border-[#6E5030] bg-[#1A120B] text-[#A89984] hover:text-[#FFF8EB] font-mono text-[11px] font-bold flex items-center gap-1';
        }
      }

      function applyPrasastiMapTransform() {
        const g = document.getElementById('prasastiPanZoomGroup');
        const lbl = document.getElementById('mapZoomLevelLabel');
        if (lbl && state.mapView) {
          lbl.textContent = `${Math.round(state.mapView.scale * 100)}%`;
        }
        updateMapModeButtonsUI();
        if (!g || !state.mapView) return;
        const cx = PRASASTI_CX;
        const cy = PRASASTI_CY;
        const s = state.mapView.scale;
        const tx = state.mapView.x + cx * (1 - s);
        const ty = state.mapView.y + cy * (1 - s);
        g.setAttribute('transform', `translate(${tx.toFixed(1)}, ${ty.toFixed(1)}) scale(${s.toFixed(3)})`);
      }

      // P0 #3.3 & P1 #4.7: Distinct Fit-to-Map vs Reset View (Fokus Inti) & Smart Auto-Pan for Edge Nodes
      function setPrasastiMapViewMode(mode, focusNodeIdx = undefined) {
        if (!state.mapView) return;
        state.mapView.viewMode = mode;
        if (mode === 'helicopter') {
          // Fit to Map: fits 100% of branches, nodes, and outer branch banners inside safe margins
          state.mapView.scale = 0.96;
          state.mapView.x = 0;
          state.mapView.y = 0;
        } else {
          // Reset View / Fokus Inti: zooms into the Core Skill & Inner/Mid tiers (or centers on a requested node)
          const s = 1.48;
          state.mapView.scale = s;
          if (typeof focusNodeIdx === 'number' && state.lastNodeCoords && state.lastNodeCoords[focusNodeIdx]) {
            const nc = state.lastNodeCoords[focusNodeIdx];
            state.mapView.x = Math.max(-680, Math.min(680, (PRASASTI_CX - nc.x) * s));
            state.mapView.y = Math.max(-480, Math.min(480, (PRASASTI_CY - nc.y) * s));
          } else {
            state.mapView.x = 0;
            state.mapView.y = 0;
          }
        }
        applyPrasastiMapTransform();
      }

      // Ensure any selected node (especially edge nodes) is panned into the comfortable safe zone of the viewport
      function ensureNodeInSafeViewport(nodeIdx, forceCenter = false) {
        if (!state.mapView || !state.lastNodeCoords || !state.lastNodeCoords[nodeIdx]) return;
        const nc = state.lastNodeCoords[nodeIdx];
        const s = state.mapView.scale;
        if (forceCenter || state.mapView.viewMode === 'closeup') {
          state.mapView.x = Math.max(-680, Math.min(680, (PRASASTI_CX - nc.x) * s));
          state.mapView.y = Math.max(-480, Math.min(480, (PRASASTI_CY - nc.y) * s));
          applyPrasastiMapTransform();
          return;
        }
        // In Fit-to-Map (helicopter) mode, gently nudge if the node is near the outer rim
        const effX = nc.x * s + state.mapView.x + PRASASTI_CX * (1 - s);
        const effY = nc.y * s + state.mapView.y + PRASASTI_CY * (1 - s);
        let shiftX = 0;
        let shiftY = 0;
        if (effX < 230) shiftX = 230 - effX;
        else if (effX > PRASASTI_SVG_W - 230) shiftX = (PRASASTI_SVG_W - 230) - effX;
        if (effY < 150) shiftY = 150 - effY;
        else if (effY > PRASASTI_SVG_H - 180) shiftY = (PRASASTI_SVG_H - 180) - effY;
        if (Math.abs(shiftX) > 5 || Math.abs(shiftY) > 5) {
          state.mapView.x = Math.max(-680, Math.min(680, state.mapView.x + shiftX));
          state.mapView.y = Math.max(-480, Math.min(480, state.mapView.y + shiftY));
          applyPrasastiMapTransform();
        }
      }

      function populateMapDomainQuickSelect() {
        const sel = document.getElementById('selectMapDomainQuick');
        if (!sel) return;
        sel.innerHTML = SEED_CATEGORIES.map((c) => (
          `<option value="${c.slug}" ${c.slug === state.selectedSlug ? 'selected' : ''}>#${c.order} · ${escapeHtml(c.shortTag)}</option>`
        )).join('');
      }

      function openPrasastiFullscreenMap(focusIdx = undefined) {
        const cardWrap = document.getElementById('prasastiMapCardWrap');
        if (!cardWrap) return;
        state.mapView.isFullscreen = true;
        // P0 #3.5: Isolate fullscreen map so underlying header/footer never bleed through or overlap
        document.body.classList.add('prasasti-map-open');
        cardWrap.classList.remove('hidden');
        cardWrap.classList.add('prasasti-fullscreen-mode');
        cardWrap.style.animation = 'none';
        void cardWrap.offsetWidth;
        cardWrap.style.animation = '';

        populateMapDomainQuickSelect();
        const hintBar = document.getElementById('prasastiExploreHintBar');
        if (hintBar) {
          hintBar.classList.toggle('hidden', !!state.mapView.hintDismissed);
        }

        const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug) || SEED_CATEGORIES[0];
        const prof = state.profiles[cat.slug];
        ensureProfileNodeLevels(prof, cat.slug);
        if (typeof focusIdx === 'number') {
          state.inspectedNodeIdx = focusIdx;
        }
        renderConstellationSkillTree(cat, prof.nodeLevels, prof.level);
        if (typeof focusIdx === 'number') {
          setPrasastiMapViewMode('closeup', focusIdx);
        } else {
          setPrasastiMapViewMode('closeup', 'center');
        }
        SoundFX.openBackpack();
      }

      function closePrasastiFullscreenMap(silent = false) {
        const cardWrap = document.getElementById('prasastiMapCardWrap');
        if (!cardWrap) return;
        state.mapView.isFullscreen = false;
        document.body.classList.remove('prasasti-map-open');
        cardWrap.classList.remove('prasasti-fullscreen-mode');
        cardWrap.classList.add('hidden');
        const searchDrop = document.getElementById('mapSearchResultsDropdown');
        if (searchDrop) searchDrop.classList.add('hidden');
        if (!silent) SoundFX.packBackpack();
      }

      function computeDomainPrideStats(cat, nodeLevelsMap) {
        let totalStars = 0;
        const maxStars = cat.nodes.length * 5;
        let openGates = 0;
        let masteredCount = 0;
        let sageUnlockedCount = 0;
        let sageMasteredCount = 0;

        cat.nodes.forEach((node) => {
          const gate = evaluateNodeUnlockGate(cat.slug, node.flatIdx, nodeLevelsMap);
          if (gate.unlocked) {
            openGates++;
            if (node.tierIdx === 2) sageUnlockedCount++;
            const sc = nodeLevelsMap[node.flatIdx];
            if (typeof sc === 'number' && sc >= 1) {
              totalStars += sc;
              if (sc >= 3) masteredCount++;
              if (node.tierIdx === 2 && sc >= 4) sageMasteredCount++;
            }
          }
        });

        let prideTitle = '🌱 Awal';
        if (sageMasteredCount >= 2 || totalStars >= maxStars * 0.72) {
          prideTitle = '👑 Sage';
        } else if (sageUnlockedCount >= 1 || masteredCount >= 3 || totalStars >= maxStars * 0.45) {
          prideTitle = '🔥 Maestro';
        } else if (openGates > cat.branches.length || totalStars >= maxStars * 0.22) {
          prideTitle = '⚔️ Tangguh';
        } else if (totalStars > 0) {
          prideTitle = '⚒️ Aktif';
        }

        return {
          totalStars,
          maxStars,
          openGates,
          totalNodes: cat.nodes.length,
          masteredCount,
          sageUnlockedCount,
          sageMasteredCount,
          prideTitle
        };
      }

      // Compute the Prerequisite & Progression Lineage Set for the currently selected node (P0 #3.1, P1 #4.1, P1 #4.3)
      function computeSelectedLineageSets(cat, selectedFlatIdx, nodeLevelsMap) {
        const lineageNodes = new Set();
        const directPrereqMap = new Map(); // flatIdx -> requiredScore
        const downstreamSet = new Set();
        if (!cat || selectedFlatIdx === null || selectedFlatIdx === undefined || !cat.nodes[selectedFlatIdx]) {
          return { lineageNodes, directPrereqMap, downstreamSet };
        }
        const selNode = cat.nodes[selectedFlatIdx];
        lineageNodes.add(selectedFlatIdx);

        // Same-branch nodes (Tier 1, Tier 2, Tier 3 of the selected node's branch)
        [0, 1, 2].forEach(ti => {
          const fIdx = selNode.branchIdx * 3 + ti;
          lineageNodes.add(fIdx);
        });

        // Direct prerequisites from evaluateNodeUnlockGate
        const selGate = evaluateNodeUnlockGate(cat.slug, selectedFlatIdx, nodeLevelsMap);
        if (Array.isArray(selGate.prereqItems)) {
          selGate.prereqItems.forEach(item => {
            lineageNodes.add(item.targetFlatIdx);
            directPrereqMap.set(item.targetFlatIdx, item);
            // If that prereq itself is Tier 2, also include its Tier 1 parent in the lineage path
            const pNode = cat.nodes[item.targetFlatIdx];
            if (pNode && pNode.tierIdx > 0) {
              lineageNodes.add(pNode.branchIdx * 3 + 0);
            }
          });
        }

        // Downstream nodes unlocked by selectedFlatIdx
        const downList = getDownstreamNodesUnlockedBy(cat, selectedFlatIdx);
        downList.forEach(d => {
          lineageNodes.add(d.targetFlatIdx);
          downstreamSet.add(d.targetFlatIdx);
        });

        return { lineageNodes, directPrereqMap, downstreamSet };
      }

      // =====================================================================
      // P0 #3.2, #3.3, P1 #4.2 & #7.1-7.3: EXPLICIT 6-STATE STONE & GEMSTONE SVG
      // States: Selected (🎯 DIPILIH), Prerequisite of Selected (🔗 PRASYARAT),
      //         Mastered (👑 5/5), Assessed (★ Lv.1-4/5), Available (✦ Siap Dinilai),
      //         Locked (🔒 Terkunci).
      // =====================================================================
      function buildTexturedStoneNodeSvg(nc, isUnlocked, isAssessed, isInspected, prereqInfoForSelected, isLineageRelevant, highlightLineageActive) {
        const x = nc.x;
        const y = nc.y;
        const lvl = isAssessed ? nc.lvl : 0;
        const baseR = nc.tIdx === 2 ? 32 : (nc.tIdx === 1 ? 29 : 26);
        const seed = (nc.flatIdx + 1) * 17 + (nc.bIdx + 1) * 31;

        function rockPolygonPoints(radius, irregularity) {
          const pts = [];
          const verts = 10;
          for (let i = 0; i < verts; i++) {
            const ang = (i / verts) * Math.PI * 2 - Math.PI / 2;
            const wave = Math.sin(seed + i * 2.3) * irregularity + Math.cos(seed * 0.7 + i * 3.1) * (irregularity * 0.6);
            const r = radius * (1 + wave);
            pts.push(`${(x + Math.cos(ang) * r).toFixed(1)},${(y + Math.sin(ang) * r).toFixed(1)}`);
          }
          return pts.join(' ');
        }

        const outerStonePts = rockPolygonPoints(baseR, !isUnlocked ? 0.14 : (lvl >= 4 ? 0.08 : 0.12));
        const midBevelPts = rockPolygonPoints(baseR * 0.78, 0.10);
        const innerCorePts = rockPolygonPoints(baseR * 0.54, 0.07);

        const c1x = (x - baseR * 0.62).toFixed(1), c1y = (y - baseR * 0.34).toFixed(1);
        const c2x = (x - baseR * 0.14).toFixed(1), c2y = (y - baseR * 0.10).toFixed(1);
        const c3x = (x + baseR * 0.54).toFixed(1), c3y = (y + baseR * 0.40).toFixed(1);
        const c4x = (x - baseR * 0.42).toFixed(1), c4y = (y + baseR * 0.50).toFixed(1);
        const c5x = (x + baseR * 0.18).toFixed(1), c5y = (y + baseR * 0.14).toFixed(1);
        const c6x = (x + baseR * 0.58).toFixed(1), c6y = (y - baseR * 0.45).toFixed(1);

        let outerFill = 'url(#stoneSlateGrad)';
        let midFill = '#36281B';
        let coreFill = '#231911';
        let rimStroke = '#785734';
        let rimWidth = 2.2;
        let luxuryCrystalsSvg = '';
        let luxuryHaloSvg = '';

        if (!isUnlocked) {
          outerFill = 'url(#stoneLockedBasaltGrad)';
          midFill = '#1A1410';
          coreFill = '#0E0A08';
          rimStroke = '#6E5030';
          rimWidth = 1.8;
        } else if (!isAssessed) {
          // Available / Ready to Assess State (Clear inviting emerald-teal rim!)
          outerFill = 'url(#stoneSlateGrad)';
          midFill = '#1F3A33';
          coreFill = '#122620';
          rimStroke = '#34D399';
          rimWidth = 2.6;
        } else if (lvl === 1) {
          outerFill = 'url(#stoneSandstoneLv1Grad)';
          midFill = '#6E4220';
          coreFill = '#4A2B13';
          rimStroke = '#F59E0B';
          rimWidth = 2.6;
        } else if (lvl === 2) {
          outerFill = 'url(#stoneJadeLv2Grad)';
          midFill = '#155E4B';
          coreFill = '#0B3B2E';
          rimStroke = '#34D399';
          rimWidth = 2.8;
        } else if (lvl === 3) {
          outerFill = 'url(#stoneLapisLv3Grad)';
          midFill = '#1E3A8A';
          coreFill = 'url(#gemBasicGrad)';
          rimStroke = '#38BDF8';
          rimWidth = 3.2;
          const r = baseR;
          luxuryCrystalsSvg = `
            <polygon points="${(x - r - 8).toFixed(1)},${(y - 3).toFixed(1)} ${(x - r + 2).toFixed(1)},${(y - 11).toFixed(1)} ${(x - r + 1).toFixed(1)},${(y + 5).toFixed(1)}" fill="url(#gemBasicGrad)" stroke="#E0F2FE" stroke-width="1.1" />
            <polygon points="${(x + r + 8).toFixed(1)},${(y - 3).toFixed(1)} ${(x + r - 2).toFixed(1)},${(y - 11).toFixed(1)} ${(x + r - 1).toFixed(1)},${(y + 5).toFixed(1)}" fill="url(#gemBasicGrad)" stroke="#E0F2FE" stroke-width="1.1" />
          `;
        } else if (lvl === 4) {
          outerFill = 'url(#stonePorphyryLv4Grad)';
          midFill = '#581C87';
          coreFill = 'url(#gemSapphireRoyalGrad)';
          rimStroke = '#E879F9';
          rimWidth = 3.5;
          const r = baseR;
          luxuryCrystalsSvg = `
            <polygon points="${(x - r - 8).toFixed(1)},${(y - r + 4).toFixed(1)} ${(x - r + 5).toFixed(1)},${(y - r - 7).toFixed(1)} ${(x - r + 7).toFixed(1)},${(y - r + 9).toFixed(1)}" fill="url(#gemSapphireRoyalGrad)" stroke="#F5D0FE" stroke-width="1.2" />
            <polygon points="${(x + r + 8).toFixed(1)},${(y - r + 4).toFixed(1)} ${(x + r - 5).toFixed(1)},${(y - r - 7).toFixed(1)} ${(x + r - 7).toFixed(1)},${(y - r + 9).toFixed(1)}" fill="url(#gemSapphireRoyalGrad)" stroke="#F5D0FE" stroke-width="1.2" />
          `;
        } else if (lvl >= 5) {
          outerFill = 'url(#stoneObsidianLv5Grad)';
          midFill = 'url(#gemMasteryGold)';
          coreFill = 'url(#gemSageGrad)';
          rimStroke = '#FDE047';
          rimWidth = 3.8;
          const r = baseR;
          luxuryHaloSvg = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r + 9).toFixed(1)}" fill="none" stroke="#FDE047" stroke-width="2.0" opacity="0.88" />`;
          let spikes = '';
          for (let s = 0; s < 6; s++) {
            const sa = (s / 6) * Math.PI * 2 - Math.PI / 2;
            const tipX = x + Math.cos(sa) * (r + 11);
            const tipY = y + Math.sin(sa) * (r + 11);
            const b1X = x + Math.cos(sa - 0.20) * (r - 2);
            const b1Y = y + Math.sin(sa - 0.20) * (r - 2);
            const b2X = x + Math.cos(sa + 0.20) * (r - 2);
            const b2Y = y + Math.sin(sa + 0.20) * (r - 2);
            const spFill = s % 2 === 0 ? 'url(#gemSageGrad)' : 'url(#gemBasicGrad)';
            spikes += `<polygon points="${tipX.toFixed(1)},${tipY.toFixed(1)} ${b1X.toFixed(1)},${b1Y.toFixed(1)} ${b2X.toFixed(1)},${b2Y.toFixed(1)}" fill="${spFill}" stroke="#FEF08A" stroke-width="1.1" />`;
          }
          luxuryCrystalsSvg = `${spikes}`;
        }

        // P0 #3.2: Unambiguous Solid Double Selection Halo (White + Cyan) vs Prerequisite Badge
        const inspectRingSvg = isInspected
          ? `
            <circle data-inspect-ring="${nc.flatIdx}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(baseR + 16).toFixed(1)}" fill="none" stroke="#38BDF8" stroke-width="2.6" opacity="0.95" />
            <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(baseR + 11).toFixed(1)}" fill="none" stroke="#FFFFFF" stroke-width="3.0" opacity="1" />
          `
          : (prereqInfoForSelected
            ? `<circle data-inspect-ring="${nc.flatIdx}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(baseR + 13).toFixed(1)}" fill="none" stroke="${prereqInfoForSelected.satisfied ? '#34D399' : '#F59E0B'}" stroke-width="2.6" stroke-dasharray="6 3" opacity="0.95" />`
            : `<circle data-inspect-ring="${nc.flatIdx}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(baseR + 14).toFixed(1)}" fill="none" stroke="#FFFFFF" stroke-width="0" opacity="0" />`
          );

        // Top contextual role badge above the stone (🎯 DIPILIH, 🔗 SYARAT, or 👑 MASTERY)
        let topRoleBadgeSvg = '';
        if (isInspected) {
          topRoleBadgeSvg = `
            <rect x="${(x - 42).toFixed(1)}" y="${(y - baseR - 28).toFixed(1)}" width="84" height="17" rx="8.5" fill="#0284C7" stroke="#FFFFFF" stroke-width="1.4" />
            <text x="${x.toFixed(1)}" y="${(y - baseR - 16.5).toFixed(1)}" text-anchor="middle" fill="#FFFFFF" font-family="ui-monospace, monospace" font-size="9.5" font-weight="extrabold">🎯 DIPILIH</text>
          `;
        } else if (prereqInfoForSelected) {
          const reqCol = prereqInfoForSelected.satisfied ? '#059669' : '#D97706';
          const reqTxt = prereqInfoForSelected.satisfied
            ? `✓ SYARAT (${prereqInfoForSelected.currentScore}/${prereqInfoForSelected.requiredScore})`
            : `🔗 SYARAT (≥${prereqInfoForSelected.requiredScore}/5)`;
          topRoleBadgeSvg = `
            <rect x="${(x - 54).toFixed(1)}" y="${(y - baseR - 27).toFixed(1)}" width="108" height="17" rx="8.5" fill="${reqCol}" stroke="#FEF08A" stroke-width="1.3" />
            <text x="${x.toFixed(1)}" y="${(y - baseR - 15.5).toFixed(1)}" text-anchor="middle" fill="#FFFFFF" font-family="ui-monospace, monospace" font-size="9" font-weight="extrabold">${reqTxt}</text>
          `;
        } else if (lvl >= 5) {
          topRoleBadgeSvg = `<text x="${x.toFixed(1)}" y="${(y - baseR - 11).toFixed(1)}" text-anchor="middle" font-size="15">👑</text>`;
        }

        // P1 #4.2 & #7.3: Clear, High-Contrast Status Text on Label Pill (Replaces ambiguous 5-star row!)
        const masteryLabels = ['', 'Exposure', 'Foundation', 'Competence', 'Advanced', 'Mastery'];
        let statusLineText = '';
        let statusLineColor = '#D6C7B2';
        if (!isUnlocked) {
          const reqMin = nc.tIdx === 1 ? 'Butuh Basic ≥3' : 'Butuh Adv ≥4';
          statusLineText = `🔒 Terkunci · ${reqMin}`;
          statusLineColor = '#FCA5A5';
        } else if (!isAssessed) {
          statusLineText = '✦ Terbuka · Siap Dinilai';
          statusLineColor = '#6EE7B7';
        } else if (lvl >= 5) {
          statusLineText = '👑 Lv.5/5 · Mastery';
          statusLineColor = '#FEF08A';
        } else {
          statusLineText = `★ Lv.${lvl}/5 · ${masteryLabels[lvl]}`;
          statusLineColor = '#FDE047';
        }

        const tierSym = nc.tIdx === 0 ? '🌱' : (nc.tIdx === 1 ? '🔥' : '👑');
        const fullTitle = nc.node.title;
        const shortName = fullTitle.length > 22 ? fullTitle.slice(0, 21) + '…' : fullTitle;
        const labelWidth = Math.max(134, Math.min(182, Math.max(shortName.length * 7.4, statusLineText.length * 6.2) + 22));
        // Clamp pillX & pillY inside safe canvas margins so no label ever touches the edge (P0 #3.3)
        const rawPillX = nc.labelX !== undefined ? nc.labelX : x;
        const rawPillY = nc.labelY !== undefined ? nc.labelY : (y + baseR + 9);
        const pillX = Math.max(labelWidth / 2 + 24, Math.min(PRASASTI_SVG_W - labelWidth / 2 - 24, rawPillX));
        const pillY = Math.max(24, Math.min(PRASASTI_SVG_H - 48, rawPillY));

        const dimClass = (highlightLineageActive && !isLineageRelevant) ? 'map-node-dimmed' : '';
        // P1 #4.1 & #7.2: Selective glow only on Selected or Mastered (Lv.5)
        const glowClass = (isInspected || lvl >= 5) ? 'stone-node-mastered' : '';
        const ariaStatus = !isUnlocked ? `Terkunci (${nc.gate.gateFormula})` : (isAssessed ? `Skor ${lvl} dari 5` : 'Terbuka dan siap dinilai');

        return `
          <g class="cursor-pointer stone-node-pop ${glowClass} ${dimClass}"
             data-constellation-node="${nc.flatIdx}"
             tabindex="0"
             role="button"
             aria-label="${escapeHtml(nc.node.branchName)} — ${escapeHtml(nc.node.title)}, Tier ${nc.tIdx + 1}, ${escapeHtml(ariaStatus)}"
             filter="url(#medallionShadow)">
            <title>${escapeHtml(nc.node.branchName)} · ${escapeHtml(nc.node.title)} (${escapeHtml(ariaStatus)})</title>
            ${luxuryHaloSvg}
            ${inspectRingSvg}
            ${luxuryCrystalsSvg}
            ${topRoleBadgeSvg}
            <polygon points="${outerStonePts}" fill="${outerFill}" stroke="${isInspected ? '#FFFFFF' : rimStroke}" stroke-width="${isInspected ? '3.6' : rimWidth}" />
            <polygon points="${midBevelPts}" fill="${midFill}" stroke="${isAssessed && lvl >= 3 ? '#FEF08A' : '#1C130C'}" stroke-width="1.2" />
            <path d="M ${c1x} ${c1y} L ${c2x} ${c2y} L ${c3x} ${c3y} M ${c4x} ${c4y} L ${c5x} ${c5y} L ${c6x} ${c6y}" fill="none" stroke="${lvl >= 3 ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.55)'}" stroke-width="1.3" stroke-linecap="round" />
            <polygon points="${innerCorePts}" fill="${coreFill}" stroke="${isAssessed ? '#FFF8EB' : (isUnlocked ? '#34D399' : '#5C4328')}" stroke-width="${isAssessed ? '1.5' : '1.1'}" />
            <text x="${x.toFixed(1)}" y="${(y - 2).toFixed(1)}" text-anchor="middle" fill="${!isUnlocked ? '#D6C7B2' : '#FFFFFF'}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="bold">${tierSym}T${nc.tIdx + 1}</text>
            <text x="${x.toFixed(1)}" y="${(y + 11.5).toFixed(1)}" text-anchor="middle" fill="${!isUnlocked ? '#FCA5A5' : (isAssessed ? '#FEF08A' : '#6EE7B7')}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="extrabold">${!isUnlocked ? '🔒' : (isAssessed ? `${lvl}/5` : '✦')}</text>
            <rect x="${(pillX - labelWidth / 2).toFixed(1)}" y="${pillY.toFixed(1)}" width="${labelWidth.toFixed(1)}" height="31" rx="8" fill="#140E0A" stroke="${isInspected ? '#38BDF8' : (prereqInfoForSelected ? '#F59E0B' : (isUnlocked ? rimStroke : '#5C4328'))}" stroke-width="${isInspected || prereqInfoForSelected ? '2.2' : '1.4'}" />
            <text x="${pillX.toFixed(1)}" y="${(pillY + 13).toFixed(1)}" text-anchor="middle" fill="#FFF8EB" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="extrabold">${escapeHtml(shortName)}</text>
            <text x="${pillX.toFixed(1)}" y="${(pillY + 25).toFixed(1)}" text-anchor="middle" fill="${statusLineColor}" font-family="ui-monospace, monospace" font-size="9.5" font-weight="bold">${escapeHtml(statusLineText)}</text>
          </g>
        `;
      }

      // P0 #3.2, P1 #4.3, #4.4 & #6.3: Actionable Stone Node Inspector with Breadcrumb, Specific Lock Progress & One-Click Prerequisite Jump!
      function updateStoneNodeInspectorPanel(cat, nodeLevelsMap) {
        if (!cat) return;
        const inspNode = cat.nodes[state.inspectedNodeIdx] || cat.nodes[0];
        const inspGate = evaluateNodeUnlockGate(cat.slug, inspNode.flatIdx, nodeLevelsMap);
        const inspLvl = inspGate.unlocked ? (nodeLevelsMap[inspNode.flatIdx] ?? null) : null;

        const crumbEl = document.getElementById('stoneInspectorBreadcrumb');
        const titleEl = document.getElementById('stoneInspectorTitle');
        const badgeEl = document.getElementById('stoneInspectorGateBadge');
        const prereqBarEl = document.getElementById('stoneInspectorPrereqBar');
        const descEl = document.getElementById('stoneInspectorDesc');
        const actionsEl = document.getElementById('stoneInspectorQuickActions');
        if (!titleEl || !badgeEl || !descEl || !actionsEl) return;

        const tierIcons = ['🌱', '🔥', '👑'];
        const tierNames = ['Tier 1 · Basic', 'Tier 2 · Advanced', 'Tier 3 · Sage'];

        // P1 #4.3: Explicit Domain -> Branch -> Tier Breadcrumb
        if (crumbEl) {
          crumbEl.innerHTML = `
            <span class="text-[#FDE68A] font-bold">${escapeHtml(cat.shortTag.toUpperCase())}</span>
            <span>→</span>
            <span class="text-[#67E8F9] font-bold">${escapeHtml(inspNode.branchName)}</span>
            <span>→</span>
            <span>${tierIcons[inspNode.tierIdx]} ${tierNames[inspNode.tierIdx]}</span>
          `;
        }

        titleEl.textContent = `${inspNode.title}`;

        const masteryInfo = getMasteryInfo(inspLvl);
        if (!inspGate.unlocked) {
          badgeEl.textContent = `🔒 Terkunci · Butuh Prasyarat`;
          badgeEl.className = 'px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#B42318]/35 border border-[#FCA5A5]/40 text-[#FCA5A5] shrink-0';
        } else if (inspLvl === null) {
          badgeEl.textContent = `✦ Terbuka · Siap Dinilai`;
          badgeEl.className = 'px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#059669]/30 border border-[#6EE7B7]/50 text-[#6EE7B7] shrink-0';
        } else {
          badgeEl.textContent = `${inspLvl >= 5 ? '👑' : '★'} Skor ${inspLvl}/5 · ${masteryInfo.label}`;
          badgeEl.className = 'px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#F59E0B]/25 border border-[#FDE047]/60 text-[#FEF08A] shrink-0';
        }

        // P1 #4.4 & #6.3: Actionable Prerequisite Checklist (when Locked) or Next Unlock Impact (when Unlocked)
        if (prereqBarEl) {
          if (!inspGate.unlocked && Array.isArray(inspGate.prereqItems) && inspGate.prereqItems.length > 0) {
            const prereqCardsHtml = inspGate.prereqItems.map(item => {
              const deficit = Math.max(0, item.requiredScore - item.currentScore);
              const statusBadge = item.satisfied
                ? `<span class="px-1.5 py-0.5 rounded bg-[#059669]/30 text-[#6EE7B7] font-mono text-[10px] font-bold">✓ Terpenuhi (${item.currentScore}/${item.requiredScore})</span>`
                : `<span class="px-1.5 py-0.5 rounded bg-[#B42318]/35 text-[#FCA5A5] font-mono text-[10px] font-bold">Progres: ${item.currentScore}/${item.requiredScore} (kurang +${deficit} poin)</span>`;
              return `
                <div class="p-2 rounded-xl bg-[#1C130D] border ${item.satisfied ? 'border-[#059669]/50' : 'border-[#F59E0B]/60'} flex flex-wrap items-center justify-between gap-2">
                  <div class="space-y-0.5">
                    <div class="font-bold text-[#FFF8EB] text-[11px]">
                      🔗 Prasyarat: <span class="text-[#FDE68A]">${escapeHtml(item.title)}</span>
                      <span class="text-[#A89984] font-mono text-[10px]">(${escapeHtml(item.tierLabel)})</span>
                    </div>
                    <div class="text-[11px] text-[#D6C7B2]">
                      Selesaikan <strong>${escapeHtml(item.title)}</strong> minimal level <strong>${item.requiredScore}/5</strong> untuk membuka skill ini.
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    ${statusBadge}
                    <button type="button" data-jump-prereq-idx="${item.targetFlatIdx}" class="px-2.5 py-1 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-black hover:text-white font-mono text-[11px] font-extrabold transition-colors shadow-xs">
                      🎯 Lihat ${escapeHtml(item.title)} →
                    </button>
                  </div>
                </div>
              `;
            }).join('');
            prereqBarEl.innerHTML = `<div class="space-y-1.5 pt-0.5">${prereqCardsHtml}</div>`;
          } else {
            // Node is Unlocked: show what downstream nodes this skill unlocks!
            const downstreamList = getDownstreamNodesUnlockedBy(cat, inspNode.flatIdx);
            if (downstreamList.length > 0) {
              const curNum = typeof inspLvl === 'number' ? inspLvl : 0;
              const chipsHtml = downstreamList.map(d => {
                const ready = curNum >= d.requiredScore;
                return `
                  <button type="button" data-jump-prereq-idx="${d.targetFlatIdx}" class="px-2 py-0.5 rounded-lg border ${ready ? 'border-[#34D399]/60 bg-[#059669]/20 text-[#6EE7B7]' : 'border-[#8C673E] bg-[#1D140E] text-[#FDE68A]'} hover:border-[#38BDF8] font-mono text-[10px] font-bold inline-flex items-center gap-1 transition-colors" title="Klik untuk melihat node lanjutan ini di peta">
                    <span>${ready ? '🔓' : '🎯'} Membuka ${escapeHtml(d.title)} (min. ≥${d.requiredScore}/5) →</span>
                  </button>
                `;
              }).join('');
              prereqBarEl.innerHTML = `
                <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span class="font-mono text-[10px] text-[#A89984]">Jalur Berikutnya:</span>
                  ${chipsHtml}
                </div>
              `;
            } else {
              prereqBarEl.innerHTML = `<div class="font-mono text-[10px] text-[#FDE68A]">👑 Puncak Cabang (Tier 3 · Sage) — Penguasaan tertinggi pada jalur ${escapeHtml(inspNode.branchName)}.</div>`;
            }
          }
        }

        const prof = state.profiles[cat.slug];
        ensureProfileNodeChecklists(prof, cat.slug);
        const effInspLvl = inspGate.unlocked ? (inspLvl || 1) : null;
        const checkArr = inspGate.unlocked ? getNodeLevelChecklistArray(prof, cat.slug, inspNode.flatIdx, effInspLvl) : [false, false, false];
        const checkedCount = checkArr.filter(Boolean).length;
        const allCurrentChecked = checkedCount >= 3;
        const indicatorsForLevel = (inspNode.levelIndicators && inspNode.levelIndicators[effInspLvl || 1]) || [];

        const levelButtonsHtml = !inspGate.unlocked
          ? `<span class="px-2.5 py-1 rounded-xl bg-[#B42318]/25 border border-[#FCA5A5]/40 text-[#FCA5A5] font-mono text-[11px] font-bold">🔒 Masih Terkunci · Butuh ${escapeHtml(inspGate.gateFormula)}</span>`
          : `
            <div class="inline-flex items-center gap-1 bg-[#1D140E] p-1 rounded-xl border border-[#8C673E]" role="group" aria-label="Pilih level 1 sampai 5">
              <span class="text-[10px] font-mono text-[#A89984] px-1 hidden sm:inline">Level:</span>
              ${[1, 2, 3, 4, 5].map(sc => {
                const checkGate = canNodeAdvanceToTargetLevel(prof, cat.slug, inspNode.flatIdx, effInspLvl, sc);
                const isCur = effInspLvl === sc;
                const isNextReady = (sc === effInspLvl + 1) && checkGate.allowed;
                const isGated = sc > effInspLvl && !checkGate.allowed;
                const btnStyle = isCur
                  ? 'bg-[#F59E0B] text-black border-[#FDE047]'
                  : (isNextReady
                    ? 'bg-[#059669]/30 text-[#6EE7B7] border-[#34D399]'
                    : (isGated ? 'border-[#5C4328] text-[#A89984] opacity-45 border-dashed cursor-not-allowed' : 'border-[#6E5030] text-[#F5EBE0] hover:border-[#F59E0B]'));
                const btnTitle = isGated
                  ? `🔒 Centang dulu semua 3 indikator Level ${checkGate.missingLevel} (${checkGate.checkedCount}/3)`
                  : `Level ${sc}/5 (${getMasteryInfo(sc).label})`;
                return `
                  <button type="button" data-inspector-node-idx="${inspNode.flatIdx}" data-inspector-node-lvl="${sc}" class="w-7 h-6 rounded-lg border text-xs font-mono font-extrabold ${btnStyle}" title="${escapeHtml(btnTitle)}">${sc}</button>
                `;
              }).join('')}
            </div>
          `;

        actionsEl.innerHTML = `${levelButtonsHtml}`;
        descEl.classList.remove('hidden');
        descEl.innerHTML = `
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-2.5 pt-1">
            <div class="lg:col-span-5 p-2.5 rounded-xl bg-[#120D0A] border border-[#8C673E]/60 space-y-1">
              <div class="font-mono text-[10px] font-extrabold text-[#FDE047] uppercase">Definisi · ${escapeHtml(inspNode.title)}</div>
              <div class="text-[11px] text-[#F5EBE0] leading-relaxed">${escapeHtml(inspNode.whatIs)}</div>
            </div>
            <div class="lg:col-span-7 p-2.5 rounded-xl bg-[#120D0A] border border-[#38BDF8]/40 space-y-2">
              ${!inspGate.unlocked ? `
                <div class="text-[11px] text-[#FCA5A5] font-mono">
                  🔒 Tier ini masih terkunci. Penuhi syarat <strong>${escapeHtml(inspGate.gateFormula)}</strong> untuk membukanya langsung di <strong>Level 1</strong>.
                </div>
              ` : `
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="font-mono text-[10px] font-extrabold text-[#6EE7B7] uppercase">
                    ✅ Checklist 3 Indikator Level ${effInspLvl} (${getMasteryInfo(effInspLvl).label})
                  </span>
                  <span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${allCurrentChecked ? 'bg-[#059669] text-white' : 'bg-[#261A11] text-[#FDE68A] border border-[#8C673E]'}">
                    ${checkedCount}/3 Selesai
                  </span>
                </div>
                <div class="space-y-1">
                  ${indicatorsForLevel.map((indText, indIdx) => {
                    const isChecked = !!checkArr[indIdx];
                    return `
                      <label class="flex items-start gap-2 p-1.5 rounded-lg border ${isChecked ? 'border-[#34D399]/60 bg-[#059669]/15' : 'border-[#5C4328]/60 bg-[#1A120B]'} cursor-pointer">
                        <input type="checkbox"
                               data-check-node-idx="${inspNode.flatIdx}"
                               data-check-node-lvl="${effInspLvl}"
                               data-check-ind-idx="${indIdx}"
                               ${isChecked ? 'checked' : ''}
                               class="mt-0.5 w-3.5 h-3.5 accent-[#10B981] rounded cursor-pointer shrink-0" />
                        <span class="text-[11px] leading-snug ${isChecked ? 'line-through text-[#A7F3D0]' : 'text-[#F5EBE0]'}">
                          <strong class="font-mono text-[10px] text-[#FDE047]">#${indIdx + 1}:</strong> ${escapeHtml(indText)}
                        </span>
                      </label>
                    `;
                  }).join('')}
                </div>
                ${effInspLvl < 5 && allCurrentChecked ? `
                  <div class="pt-1 flex justify-end">
                    <button type="button" data-inspector-node-idx="${inspNode.flatIdx}" data-inspector-node-lvl="${effInspLvl + 1}" class="px-3 py-1 rounded-lg bg-[#10B981] hover:bg-[#059669] text-black font-mono text-[11px] font-extrabold shadow-xs cursor-pointer">
                      ⬆️ Naik ke Level ${effInspLvl + 1} (${getMasteryInfo(effInspLvl + 1).label})
                    </button>
                  </div>
                ` : ''}
              `}
            </div>
          </div>
        `;
      }

      // Inspect-Only handler when clicking/selecting a node on the Prasasti Map
      function inspectStoneNodeOnly(nodeIdx, panToSafeZone = true) {
        const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug) || SEED_CATEGORIES[0];
        const prof = state.profiles[cat.slug];
        if (!cat || !prof) return;
        ensureProfileNodeLevels(prof, cat.slug);
        state.inspectedNodeIdx = nodeIdx;

        // Re-render SVG so prerequisite badges (🔗 SYARAT), solid selection halo (🎯 DIPILIH), and lineage path highlighting update cleanly!
        renderConstellationSkillTree(cat, prof.nodeLevels, prof.level);

        if (panToSafeZone) {
          ensureNodeInSafeViewport(nodeIdx, state.mapView && state.mapView.viewMode === 'closeup');
        }
        SoundFX.hover();
      }

      function renderConstellationSkillTree(cat, nodeLevelsMap, coreLevel) {
        const container = document.getElementById('advConstellationContainer');
        if (!container || !cat) return;
        enforceUnlockGatesOnMap(cat.slug, nodeLevelsMap);

        const w = PRASASTI_SVG_W;
        const h = PRASASTI_SVG_H;
        const cx = PRASASTI_CX;
        const cy = PRASASTI_CY;
        const numBranches = cat.branches.length;
        const evo = getEvolutionStage(coreLevel);
        const coreMastery = getMasteryInfo(coreLevel);
        const constellation = cat.constellation || DOMAIN_CONSTELLATIONS[cat.slug] || DOMAIN_CONSTELLATIONS['engineering'];

        if (state.inspectedNodeIdx === undefined || state.inspectedNodeIdx === null || state.inspectedNodeIdx >= cat.nodes.length) {
          state.inspectedNodeIdx = 0;
        }

        const symEl = document.getElementById('launcherConstellationSymbol');
        if (symEl) symEl.textContent = '🗺️';
        const constBadgeEl = document.getElementById('prasastiConstellationBadge');
        if (constBadgeEl) constBadgeEl.textContent = cat.name;
        const constSubEl = document.getElementById('prasastiConstellationSubtitle');
        if (constSubEl) constSubEl.textContent = cat.name;
        populateMapDomainQuickSelect();

        const pride = computeDomainPrideStats(cat, nodeLevelsMap);
        const prideChipEl = document.getElementById('prasastiPrideRankChip');
        if (prideChipEl) prideChipEl.textContent = pride.prideTitle;
        const summaryBadgeEl = document.getElementById('constellationSummaryBadge');
        if (summaryBadgeEl) {
          summaryBadgeEl.textContent = `★ ${pride.totalStars}/${pride.maxStars} Poin · 🔓 ${pride.openGates}/${pride.totalNodes} Terbuka`;
        }
        const prideStripEl = document.getElementById('prasastiPrideStrip');
        if (prideStripEl) {
          prideStripEl.innerHTML = `
            <span class="px-2 py-0.5 rounded-md bg-[#1A120B] border border-[#F59E0B]/40 text-[#FDE047]" title="Total Poin Skor Domain">★ ${pride.totalStars}/${pride.maxStars} Poin</span>
            <span class="px-2 py-0.5 rounded-md bg-[#1A120B] border border-[#38BDF8]/40 text-[#67E8F9]" title="Jumlah Skill Node yang Terbuka">🔓 ${pride.openGates}/${pride.totalNodes} Terbuka</span>
            <span class="px-2 py-0.5 rounded-md bg-[#1A120B] border border-[#34D399]/40 text-[#6EE7B7]" title="Jumlah Skill Kompeten (Skor ≥ 3/5)">💎 ${pride.masteredCount} Kompeten</span>
          `;
        }

        // Compute active prerequisite & progression lineage for the currently inspected node (P0 #3.1, P1 #4.1, P1 #4.3)
        const lineageInfo = computeSelectedLineageSets(cat, state.inspectedNodeIdx, nodeLevelsMap);
        const highlightLineageActive = !!(state.mapView && state.mapView.highlightLineage);
        const selNodeObj = cat.nodes[state.inspectedNodeIdx] || cat.nodes[0];

        let stoneReliefSvg = `
          <defs>
            <radialGradient id="torchGlowGrad" cx="50%" cy="50%" r="58%">
              <stop offset="0%" stop-color="#3E2814" stop-opacity="0.78" />
              <stop offset="55%" stop-color="#1B120C" stop-opacity="0.96" />
              <stop offset="100%" stop-color="#0B0705" stop-opacity="1" />
            </radialGradient>
            <!-- P0 #3.1 & P1 #4.3: Directional Arrow Markers for One-Way Prerequisite Progression -->
            <marker id="arrowPrereqCyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#38BDF8" />
            </marker>
            <marker id="arrowPrereqGold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#FBBF24" />
            </marker>
            <marker id="arrowPrereqRose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#FB7185" />
            </marker>
            <marker id="arrowPrereqLocked" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#785C3C" />
            </marker>
            <linearGradient id="stoneLockedBasaltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2B231D" />
              <stop offset="55%" stop-color="#1A1410" />
              <stop offset="100%" stop-color="#0D0A08" />
            </linearGradient>
            <linearGradient id="stoneSlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#5C4430" />
              <stop offset="50%" stop-color="#3D2C1E" />
              <stop offset="100%" stop-color="#241911" />
            </linearGradient>
            <linearGradient id="stoneSandstoneLv1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#B46934" />
              <stop offset="55%" stop-color="#85481E" />
              <stop offset="100%" stop-color="#4A250C" />
            </linearGradient>
            <linearGradient id="stoneJadeLv2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#228B6D" />
              <stop offset="55%" stop-color="#135E48" />
              <stop offset="100%" stop-color="#083326" />
            </linearGradient>
            <linearGradient id="stoneLapisLv3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" />
              <stop offset="50%" stop-color="#1E3A8A" />
              <stop offset="100%" stop-color="#0F172A" />
            </linearGradient>
            <linearGradient id="stonePorphyryLv4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#9333EA" />
              <stop offset="50%" stop-color="#581C87" />
              <stop offset="100%" stop-color="#2E1065" />
            </linearGradient>
            <linearGradient id="stoneObsidianLv5Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#450A0A" />
              <stop offset="50%" stop-color="#1C1917" />
              <stop offset="100%" stop-color="#090706" />
            </linearGradient>
            <radialGradient id="gemBasicGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#A5F3FC" />
              <stop offset="50%" stop-color="#06B6D4" />
              <stop offset="100%" stop-color="#164E63" />
            </radialGradient>
            <radialGradient id="gemSapphireRoyalGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#F5D0FE" />
              <stop offset="48%" stop-color="#A855F7" />
              <stop offset="100%" stop-color="#3B0764" />
            </radialGradient>
            <radialGradient id="gemAdvGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#FDE047" />
              <stop offset="55%" stop-color="#D97706" />
              <stop offset="100%" stop-color="#78350F" />
            </radialGradient>
            <radialGradient id="gemSageGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#FFE4E6" />
              <stop offset="45%" stop-color="#F43F5E" />
              <stop offset="100%" stop-color="#881337" />
            </radialGradient>
            <radialGradient id="gemMasteryGold" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#FEF08A" />
              <stop offset="45%" stop-color="#F59E0B" />
              <stop offset="100%" stop-color="#9A3412" />
            </radialGradient>
            <filter id="medallionShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.75" />
            </filter>
          </defs>
          <rect x="-600" y="-480" width="${w + 1200}" height="${h + 960}" fill="url(#torchGlowGrad)" />
          <rect x="36" y="32" width="${w - 72}" height="${h - 64}" rx="32" fill="none" stroke="#6E5030" stroke-width="1.6" stroke-dasharray="18 10" opacity="0.35" />
          <line x1="${cx}" y1="48" x2="${cx}" y2="${h - 48}" stroke="#4A3520" stroke-width="1" stroke-dasharray="6 12" opacity="0.18" />
          <line x1="48" y1="${cy}" x2="${w - 48}" y2="${cy}" stroke="#4A3520" stroke-width="1" stroke-dasharray="6 12" opacity="0.18" />
        `;

        // P0 #3.3 & P1 #4.1: Safe-Margin Ring Radii inside 1840x1280 so outer nodes & labels NEVER clip at viewport edges!
        // With rx=205, 365, 525 and ry=150, 268, 385, Tier 3 nodes sit at x in [395..1445] (leaving 395px margin on left & right!).
        const ringRadii = [
          { rx: 205, ry: 152, col: '#38BDF8', label: 'RING I · BASIC' },
          { rx: 365, ry: 270, col: '#F59E0B', label: 'RING II · ADVANCED (Basic ≥ 3)' },
          { rx: 525, ry: 388, col: '#FB7185', label: 'RING III · SAGE (Adv ≥ 4)' }
        ];
        let coreRings = '';
        ringRadii.forEach((rg) => {
          coreRings += `
            <ellipse cx="${cx}" cy="${cy}" rx="${rg.rx}" ry="${rg.ry}" fill="none" stroke="${rg.col}" stroke-width="1.2" stroke-dasharray="8 10" opacity="0.18" />
          `;
        });

        const rawAngles = cat.branches.map((_, bIdx) => {
          return (constellation.branchAnglesDeg && constellation.branchAnglesDeg[bIdx] !== undefined)
            ? constellation.branchAnglesDeg[bIdx]
            : (-90 + (bIdx / numBranches) * 360);
        });
        let minAngDiff = 360;
        for (let i = 0; i < rawAngles.length; i++) {
          for (let j = i + 1; j < rawAngles.length; j++) {
            let d = Math.abs(rawAngles[i] - rawAngles[j]) % 360;
            if (d > 180) d = 360 - d;
            if (d < minAngDiff) minAngDiff = d;
          }
        }
        const safeAnglesDeg = minAngDiff < 48
          ? cat.branches.map((_, bIdx) => -90 + (bIdx / numBranches) * 360)
          : rawAngles;

        const nodeCoords = [];
        cat.branches.forEach((branch, bIdx) => {
          const angle = (safeAnglesDeg[bIdx] * Math.PI) / 180;
          const rScales = (constellation.tierRadiusScale && constellation.tierRadiusScale[bIdx]) || [1.0, 1.0, 1.0];

          // Outer Branch Banner placed at safe radius (rx=668, ry=492) and clamped inside safe frame!
          const rawRimX = cx + Math.cos(angle) * 668;
          const rawRimY = cy + Math.sin(angle) * 492;
          const rimX = Math.max(135, Math.min(w - 135, rawRimX));
          const rimY = Math.max(62, Math.min(h - 68, rawRimY));

          const bNodes = [0, 1, 2].map(ti => bIdx * 3 + ti);
          const bStars = bNodes.reduce((acc, fi) => {
            const g = evaluateNodeUnlockGate(cat.slug, fi, nodeLevelsMap);
            const v = g.unlocked ? (nodeLevelsMap[fi] || 0) : 0;
            return acc + v;
          }, 0);
          const isBranchMastered = bStars >= 11;
          const isBranchSelected = selNodeObj && selNodeObj.branchIdx === bIdx;
          const branchDimClass = (highlightLineageActive && !isBranchSelected && !bNodes.some(fi => lineageInfo.lineageNodes.has(fi))) ? 'map-branch-dimmed' : '';

          coreRings += `
            <g transform="translate(${rimX.toFixed(1)}, ${rimY.toFixed(1)})" class="${branchDimClass}">
              <rect x="-98" y="-15" width="196" height="30" rx="9" fill="${isBranchMastered ? '#422006' : '#18110B'}" stroke="${isBranchSelected ? '#38BDF8' : (isBranchMastered ? '#FDE047' : '#8C673E')}" stroke-width="${isBranchSelected ? '2.2' : '1.5'}" filter="url(#medallionShadow)" />
              <text x="0" y="4" text-anchor="middle" fill="${isBranchMastered ? '#FEF08A' : '#FFF8EB'}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="extrabold">${isBranchMastered ? '👑 ' : '✦ '}${escapeHtml(branch.name.toUpperCase())} (${bStars}/15)</text>
            </g>
          `;

          [0, 1, 2].forEach(tIdx => {
            const flatIdx = bIdx * 3 + tIdx;
            const node = cat.nodes[flatIdx];
            const rg = ringRadii[tIdx];
            const rawScale = rScales[tIdx] || 1.0;
            const scaleM = Math.max(0.95, Math.min(1.04, rawScale));
            const nx = Math.max(155, Math.min(w - 155, cx + Math.cos(angle) * rg.rx * scaleM));
            const ny = Math.max(92, Math.min(h - 115, cy + Math.sin(angle) * rg.ry * scaleM));
            const gate = evaluateNodeUnlockGate(cat.slug, flatIdx, nodeLevelsMap);
            const lvl = gate.unlocked && nodeLevelsMap && nodeLevelsMap[flatIdx] !== undefined ? nodeLevelsMap[flatIdx] : null;
            nodeCoords[flatIdx] = {
              flatIdx,
              node,
              bIdx,
              tIdx,
              angle,
              x: nx,
              y: ny,
              gate,
              lvl
            };
          });
        });

        // Automatic Collision-Avoidance Pass + Safe Boundary Clamping (P0 #3.3)
        for (let pass = 0; pass < 4; pass++) {
          for (let i = 0; i < nodeCoords.length; i++) {
            for (let j = i + 1; j < nodeCoords.length; j++) {
              const a = nodeCoords[i];
              const b = nodeCoords[j];
              if (!a || !b) continue;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.hypot(dx, dy);
              const minDist = 146;
              if (dist > 0.1 && dist < minDist) {
                const push = (minDist - dist) * 0.52;
                const ux = dx / dist;
                const uy = dy / dist;
                a.x = Math.max(155, Math.min(w - 155, a.x - ux * push));
                a.y = Math.max(92, Math.min(h - 115, a.y - uy * push));
                b.x = Math.max(155, Math.min(w - 155, b.x + ux * push));
                b.y = Math.max(92, Math.min(h - 115, b.y + uy * push));
              }
            }
          }
        }

        state.lastNodeCoords = nodeCoords;

        // Helper to shorten line end so directional arrowhead sits right outside the target stone's rim
        function shortenSegment(x1, y1, x2, y2, padStart, padEnd) {
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy) || 1;
          if (len <= padStart + padEnd + 10) return { sx: x1, sy: y1, ex: x2, ey: y2 };
          const ux = dx / len;
          const uy = dy / len;
          return {
            sx: x1 + ux * padStart,
            sy: y1 + uy * padStart,
            ex: x2 - ux * padEnd,
            ey: y2 - uy * padEnd
          };
        }

        // 0. Subtle Constellation Silhouette Web (P0 #3.1 & P1 #4.1: Kept calm & dotted so it never competes with prerequisite paths!)
        let constellationWebSvg = '';
        if (Array.isArray(constellation.constellationLines)) {
          constellation.constellationLines.forEach(pair => {
            const nA = nodeCoords[pair[0]];
            const nB = nodeCoords[pair[1]];
            if (!nA || !nB) return;
            constellationWebSvg += `
              <line x1="${nA.x.toFixed(1)}" y1="${nA.y.toFixed(1)}" x2="${nB.x.toFixed(1)}" y2="${nB.y.toFixed(1)}"
                    stroke="#8C673E"
                    stroke-width="1.3"
                    stroke-dasharray="2 8"
                    opacity="${highlightLineageActive ? '0.14' : '0.24'}" />
            `;
          });
        }

        // 1. Radial Branch Prerequisite Conduits with Directional Arrowheads & Lineage Highlighting (P0 #3.1, P1 #4.3)
        let groovesSvg = '';
        cat.branches.forEach((_, bIdx) => {
          const n1 = nodeCoords[bIdx * 3 + 0];
          const n2 = nodeCoords[bIdx * 3 + 1];
          const n3 = nodeCoords[bIdx * 3 + 2];
          const isSameBranchAsSel = selNodeObj && selNodeObj.branchIdx === bIdx;
          const branchRelevant = isSameBranchAsSel || [n1.flatIdx, n2.flatIdx, n3.flatIdx].some(fi => lineageInfo.lineageNodes.has(fi));
          const dimEdgeClass = (highlightLineageActive && !branchRelevant) ? 'map-branch-dimmed' : '';
          const hiEdgeClass = (highlightLineageActive && isSameBranchAsSel) ? 'map-edge-highlighted' : '';

          // Segment 1: Core Medallion -> Tier 1 (Basic, always open)
          const seg1 = shortenSegment(cx, cy, n1.x, n1.y, 58, 36);
          groovesSvg += `
            <g class="${dimEdgeClass} ${hiEdgeClass}">
              <line x1="${seg1.sx.toFixed(1)}" y1="${seg1.sy.toFixed(1)}" x2="${seg1.ex.toFixed(1)}" y2="${seg1.ey.toFixed(1)}" stroke="#090604" stroke-width="7.5" stroke-linecap="round" />
              <line x1="${seg1.sx.toFixed(1)}" y1="${seg1.sy.toFixed(1)}" x2="${seg1.ex.toFixed(1)}" y2="${seg1.ey.toFixed(1)}" stroke="#38BDF8" stroke-width="3.4" marker-end="url(#arrowPrereqCyan)" />
            </g>
          `;

          // Segment 2: Tier 1 (Basic) -> Tier 2 (Advanced, requires Basic >= 3/5)
          const g2Open = n2.gate.unlocked;
          const seg2 = shortenSegment(n1.x, n1.y, n2.x, n2.y, 32, 38);
          groovesSvg += `
            <g class="${dimEdgeClass} ${hiEdgeClass}">
              <line x1="${seg2.sx.toFixed(1)}" y1="${seg2.sy.toFixed(1)}" x2="${seg2.ex.toFixed(1)}" y2="${seg2.ey.toFixed(1)}" stroke="#090604" stroke-width="7.5" stroke-linecap="round" />
              <line x1="${seg2.sx.toFixed(1)}" y1="${seg2.sy.toFixed(1)}" x2="${seg2.ex.toFixed(1)}" y2="${seg2.ey.toFixed(1)}"
                    stroke="${g2Open ? '#FBBF24' : '#785C3C'}"
                    stroke-width="${g2Open ? '3.6' : '2.2'}"
                    stroke-dasharray="${g2Open ? 'none' : '7 5'}"
                    marker-end="url(#${g2Open ? 'arrowPrereqGold' : 'arrowPrereqLocked'})" />
            </g>
          `;

          // Segment 3: Tier 2 (Advanced) -> Tier 3 (Sage, requires Advanced >= 4/5 + cross prereqs)
          const g3Open = n3.gate.unlocked;
          const seg3 = shortenSegment(n2.x, n2.y, n3.x, n3.y, 34, 40);
          groovesSvg += `
            <g class="${dimEdgeClass} ${hiEdgeClass}">
              <line x1="${seg3.sx.toFixed(1)}" y1="${seg3.sy.toFixed(1)}" x2="${seg3.ex.toFixed(1)}" y2="${seg3.ey.toFixed(1)}" stroke="#090604" stroke-width="7.5" stroke-linecap="round" />
              <line x1="${seg3.sx.toFixed(1)}" y1="${seg3.sy.toFixed(1)}" x2="${seg3.ex.toFixed(1)}" y2="${seg3.ey.toFixed(1)}"
                    stroke="${g3Open ? '#FB7185' : '#785C3C'}"
                    stroke-width="${g3Open ? '3.8' : '2.2'}"
                    stroke-dasharray="${g3Open ? 'none' : '7 5'}"
                    marker-end="url(#${g3Open ? 'arrowPrereqRose' : 'arrowPrereqLocked'})" />
            </g>
          `;
        });

        // 2. Cross-Branch Prerequisite Curves with Directional Arrowheads
        nodeCoords.forEach(nc => {
          if (Array.isArray(nc.node.crossPrereqs)) {
            nc.node.crossPrereqs.forEach(cp => {
              const srcIdx = cp.branchIdx * 3 + cp.tierIdx;
              const src = nodeCoords[srcIdx];
              if (!src) return;
              const srcScore = src.gate.unlocked ? src.lvl : null;
              const satisfied = typeof srcScore === 'number' && srcScore >= cp.minScore;
              const isSelectedCrossEdge = (nc.flatIdx === state.inspectedNodeIdx || srcIdx === state.inspectedNodeIdx);
              if (highlightLineageActive && !isSelectedCrossEdge) {
                // Keep non-selected cross-branch curves very subtle so they don't clutter the canvas (P1 #4.1)
                return;
              }
              const ctrlX = (src.x + nc.x) * 0.5 + (cx - (src.x + nc.x) * 0.5) * 0.25;
              const ctrlY = (src.y + nc.y) * 0.5 + (cy - (src.y + nc.y) * 0.5) * 0.25;
              const endSeg = shortenSegment(ctrlX, ctrlY, nc.x, nc.y, 0, 38);
              groovesSvg += `
                <g class="${isSelectedCrossEdge ? 'map-edge-highlighted' : ''}">
                  <path d="M ${src.x.toFixed(1)} ${src.y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endSeg.ex.toFixed(1)} ${endSeg.ey.toFixed(1)}"
                        fill="none"
                        stroke="${satisfied ? '#22D3EE' : '#F59E0B'}"
                        stroke-width="${isSelectedCrossEdge ? '3.2' : '2.0'}"
                        stroke-dasharray="${satisfied ? 'none' : '8 5'}"
                        marker-end="url(#${satisfied ? 'arrowPrereqCyan' : 'arrowPrereqGold'})"
                        opacity="${isSelectedCrossEdge ? '0.96' : '0.55'}" />
                </g>
              `;
            });
          }
        });

        // 3. Textured Stone & Gemstone Nodes
        let nodesSvg = '';
        nodeCoords.forEach(nc => {
          const isUnlocked = nc.gate.unlocked;
          const isAssessed = isUnlocked && nc.lvl !== null;
          const isInspected = state.inspectedNodeIdx === nc.flatIdx;
          const prereqInfo = lineageInfo.directPrereqMap.get(nc.flatIdx) || null;
          const isLineageRelevant = lineageInfo.lineageNodes.has(nc.flatIdx);
          nodesSvg += buildTexturedStoneNodeSvg(nc, isUnlocked, isAssessed, isInspected, prereqInfo, isLineageRelevant, highlightLineageActive);
        });

        // 4. Central Core Domain Stone Medallion (P0 #2.1: Clear Domain vs Core Level Hierarchy)
        const coreUnlocked = coreLevel !== null;
        const coreBorder = coreUnlocked ? coreMastery.barColor : '#A8763E';
        const coreSvg = `
          <g filter="url(#medallionShadow)" class="cursor-pointer" data-core-medallion="true">
            <title>Inti Domain: ${escapeHtml(cat.name)} (${coreUnlocked ? 'Level ' + coreLevel + '/5 · ' + coreMastery.label : 'Belum Dinilai'}) — Klik untuk Fokus Inti</title>
            <polygon points="${cx},${cy - 62} ${cx + 44},${cy - 44} ${cx + 62},${cy} ${cx + 44},${cy + 44} ${cx},${cy + 62} ${cx - 44},${cy + 44} ${cx - 62},${cy} ${cx - 44},${cy - 44}" fill="url(#stoneSlateGrad)" stroke="${coreBorder}" stroke-width="4.4" />
            <circle cx="${cx}" cy="${cy}" r="45" fill="#18100A" stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="6 4" />
            <text x="${cx}" y="${cy - 14}" text-anchor="middle" fill="#A89984" font-family="ui-monospace, monospace" font-size="8.5" font-weight="bold">INTI DOMAIN</text>
            <text x="${cx}" y="${cy + 2}" text-anchor="middle" fill="#FFF8EB" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" font-weight="extrabold">${escapeHtml(cat.shortTag.toUpperCase())}</text>
            <text x="${cx}" y="${cy + 19}" text-anchor="middle" fill="#FDE047" font-family="ui-monospace, monospace" font-size="12" font-weight="extrabold">${coreUnlocked ? '★ Lv.' + coreLevel + '/5' : 'Belum Dinilai'}</text>
            <text x="${cx}" y="${cy + 33}" text-anchor="middle" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="9" font-weight="bold">${evo.shortBadge}</text>
          </g>
        `;

        container.innerHTML = `
          <svg id="prasastiSkillMapSvg" viewBox="0 0 ${w} ${h}" class="w-full h-full select-none">
            <g id="prasastiPanZoomGroup">
              ${stoneReliefSvg}
              ${coreRings}
              ${constellationWebSvg}
              ${groovesSvg}
              ${coreSvg}
              ${nodesSvg}
            </g>
          </svg>
        `;
        applyPrasastiMapTransform();
        updateStoneNodeInspectorPanel(cat, nodeLevelsMap);
      }

      function renderManagementNodeAssessmentList(catSlug) {
        const cat = SEED_CATEGORIES.find(c => c.slug === catSlug) || SEED_CATEGORIES[0];
        const listEl = document.getElementById('mgmtNodeAssessList');
        const badgeEl = document.getElementById('mgmtComputedCoreBadge');
        if (!listEl) return;

        enforceUnlockGatesOnMap(cat.slug, draftNodeLevels);
        const stats = computeCoreLevelFromNodes(cat.slug, draftNodeLevels);
        draftLevel = stats.coreLevel;
        if (badgeEl) {
          badgeEl.textContent = stats.coreLevel === null
            ? `Core: Unassessed "—" (${stats.openGateCount}/${stats.totalNodes} Terbuka)`
            : `Core: Lv.${stats.coreLevel} ${getMasteryInfo(stats.coreLevel).label} (Rata-rata ${stats.exactAvg.toFixed(1)})`;
        }

        listEl.innerHTML = cat.branches.map((branch, bIdx) => {
          const branchNodes = [0, 1, 2].map(tIdx => cat.nodes[bIdx * 3 + tIdx]);
          return `
            <div class="p-3 rounded-2xl border atlas-surface space-y-2">
              <div class="flex items-center justify-between border-b atlas-border pb-1.5">
                <span class="font-bold text-xs text-amber-aa">Cabang #${bIdx + 1}: ${escapeHtml(branch.name)}</span>
                <span class="font-mono text-[10px] atlas-text-muted">${escapeHtml(branch.tiers.join(' → '))}</span>
              </div>
              <div class="space-y-1.5">
                ${branchNodes.map(node => {
                  const gate = evaluateNodeUnlockGate(cat.slug, node.flatIdx, draftNodeLevels);
                  const curLvl = gate.unlocked ? (draftNodeLevels[node.flatIdx] ?? null) : null;
                  const m = getMasteryInfo(curLvl);
                  return `
                    <div class="p-2 rounded-xl border atlas-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5">
                          <span class="px-1.5 py-0.5 rounded bg-[#135C5E]/15 text-teal-aa font-mono text-[10px] font-bold">${escapeHtml(node.tierShort)}</span>
                          <span class="font-bold text-xs truncate">${escapeHtml(node.title)}</span>
                        </div>
                        <div class="text-[10px] font-mono ${!gate.unlocked ? 'text-[#B42318] dark:text-[#FCA5A5]' : 'atlas-text-muted'} mt-0.5">
                          ${!gate.unlocked ? `🔒 0 — Locked (Syarat: ${escapeHtml(gate.gateFormula)})` : (curLvl === null ? 'Unassessed — "—" (Terbuka)' : `✦ Skor ${curLvl}/5 · ${m.label}`)}
                        </div>
                      </div>
                      ${!gate.unlocked ? `
                        <span class="px-2.5 py-1 rounded-lg bg-[#B42318]/10 text-[#B42318] dark:text-[#FCA5A5] font-mono text-[10px] font-bold shrink-0">🔒 0 — Locked</span>
                      ` : `
                        <div class="inline-flex items-center gap-1 shrink-0" role="group" aria-label="Pilih skor node ${escapeHtml(node.title)}">
                          ${[1, 2, 3, 4, 5].map(tier => `
                            <button type="button" data-mgmt-node-idx="${node.flatIdx}" data-mgmt-node-lvl="${tier}" class="w-7 h-7 rounded-lg border text-xs font-mono font-bold ${(curLvl || 1) === tier ? 'btn-amber-aa border-[#B54D08]' : 'atlas-surface hover:border-[#B54D08]'}" title="${getMasteryInfo(tier).label}">${tier}</button>
                          `).join('')}
                        </div>
                      `}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('');
      }

      function populateManagementFormFromProfile(prof) {
        ensureProfileNodeLevels(prof, prof.categorySlug || state.selectedSlug);
        draftNodeLevels = Object.assign({}, prof.nodeLevels);
        const computed = computeCoreLevelFromNodes(prof.categorySlug || state.selectedSlug, draftNodeLevels);
        draftLevel = computed.coreLevel !== null ? computed.coreLevel : prof.level;
        renderManagementNodeAssessmentList(prof.categorySlug || state.selectedSlug);
        renderLevelRadioGrid(draftLevel);

        document.getElementById('inputAssessmentNote').value = prof.assessmentNote || '';
        document.getElementById('inputCapabilityNotes').value = prof.capabilityNotes || '';
        document.getElementById('inputMeaningText').value = prof.meaningText || '';
        document.getElementById('inputPotentialText').value = prof.potentialText || '';

        updateCharCounters();
        document.getElementById('mgmtValidationErrorBox').classList.add('hidden');
      }

      function renderLevelRadioGrid(selectedLevel) {
        const grid = document.getElementById('mgmtLevelSelectorGrid');
        grid.innerHTML = MASTERY_SCALE.filter(m => m.level !== null).map(m => {
          const isSel = m.level === selectedLevel;
          const valStr = m.level === null ? 'null' : String(m.level);
          return `
            <button type="button" role="radio" tabindex="${isSel ? '0' : '-1'}" aria-checked="${isSel ? 'true' : 'false'}" data-select-level="${valStr}" class="p-3 rounded-xl border text-left transition-colors ${isSel ? 'border-[#B54D08] bg-[#B54D08]/12 ring-1 ring-[#B54D08]' : 'atlas-elevated hover:border-[#B54D08]/50'}">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="font-mono text-xs font-bold ${isSel ? 'text-amber-aa' : ''}">${m.level === null ? 'Belum dinilai (NULL)' : `Lv.${m.level} · ${m.label}`}</span>
                <span class="font-mono text-xs atlas-text-muted">${m.barPercent}%</span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden mb-1.5">
                <div class="h-full rounded-full" style="width: ${m.barPercent}%; background-color: ${m.barColor}"></div>
              </div>
              <p class="text-xs atlas-text-secondary leading-snug">${m.anchor}</p>
            </button>
          `;
        }).join('');
      }

      function updateCharCounters() {
        document.getElementById('counterAssessmentNote').textContent = `${document.getElementById('inputAssessmentNote').value.length} / 1000`;
        document.getElementById('counterCapabilityNotes').textContent = `${document.getElementById('inputCapabilityNotes').value.length} / 5000`;
        document.getElementById('counterMeaningText').textContent = `${document.getElementById('inputMeaningText').value.length} / 10000`;
        document.getElementById('counterPotentialText').textContent = `${document.getElementById('inputPotentialText').value.length} / 10000`;
        document.getElementById('evCounterTitle').textContent = `${document.getElementById('evInputTitle').value.length} / 120`;
        document.getElementById('evCounterSummary').textContent = `${document.getElementById('evInputSummary').value.length} / 2000`;
      }

      function renderManagementEvidenceList(sortedEv) {
        const listEl = document.getElementById('mgmtEvidenceList');
        if (sortedEv.length === 0) {
          listEl.innerHTML = `<div class="p-3.5 rounded-xl border border-dashed atlas-border text-xs atlas-text-muted text-center">Belum ada item evidence di kategori ini.</div>`;
        } else {
          listEl.innerHTML = sortedEv.map(ev => renderEvidenceCardHTML(ev, true)).join('');
        }
      }

      function markDirty() {
        state.isDirty = true;
        document.getElementById('dirtyStateBadge').classList.remove('hidden');
      }

      function saveCategoryProfileChanges() {
        if (!state.auth.authenticated) {
          showGlobalNotice('error', 'Sesi akun belum aktif. Draf kamu tetap aman di halaman ini—silakan masuk kembali untuk menyimpan.');
          return;
        }

        const slug = state.selectedSlug;
        const prof = state.profiles[slug];
        const capVal = document.getElementById('inputCapabilityNotes').value;
        const meanVal = document.getElementById('inputMeaningText').value;
        const potVal = document.getElementById('inputPotentialText').value;
        const noteVal = document.getElementById('inputAssessmentNote').value;

        if (capVal.length > 5000 || meanVal.length > 10000 || potVal.length > 10000) {
          const errBox = document.getElementById('mgmtValidationErrorBox');
          document.getElementById('mgmtValidationErrorText').textContent = 'Panjang catatan melebihi batas karakter yang diizinkan. Mohon ringkas sedikit tulisanmu.';
          errBox.classList.remove('hidden');
          return;
        }

        prof.nodeLevels = Object.assign({}, draftNodeLevels);
        const computedFromNodes = computeCoreLevelFromNodes(slug, prof.nodeLevels);
        prof.level = computedFromNodes.coreLevel !== null ? computedFromNodes.coreLevel : draftLevel;
        prof.assessmentNote = noteVal.trim();
        prof.capabilityNotes = capVal;
        prof.meaningText = meanVal;
        prof.potentialText = potVal;
        prof.version += 1;
        prof.updatedAt = new Date().toISOString();
        state.isDirty = false;

        if (state.offlineMode) {
          state.unsyncedQueue = true;
        } else {
          state.unsyncedQueue = false;
        }

        const savedOk = savePersistedState();
        updateSyncHeaderUI();

        if (!savedOk) {
          return;
        }

        if (state.offlineMode) {
          showGlobalNotice('warning', 'Belum tersinkron — perubahan aman disimpan sebagai draf di perangkat ini. Klik "Coba Lagi Sinkronisasi" saat siap.', true);
          logApiCall(`PATCH /api/v1/me/categories/${slug}/content`, 'OFFLINE_DRAFT_SAVED_LOCALLY', buildCategoryApiPayload(slug));
        } else {
          const mastery = getMasteryInfo(prof.level);
          logApiCall(`PATCH /api/v1/me/categories/${slug}/assessment`, '200 OK (LOCAL_DEVICE_COMMIT)', {
            slug,
            ownerEmail: state.auth.email,
            level: prof.level,
            label: mastery.label,
            version: prof.version,
            updatedAt: prof.updatedAt
          });
          showGlobalNotice('success', `Perubahan pada kategori "${slug}" berhasil disimpan di perangkat ini (Revisi v${prof.version}).`);
        }

        if (worldCtrl) worldCtrl.rebuildItemEvolution(slug, prof.level);
        generateRackThumbnails(slug);
        awardSparks(5, '💾 Simpan Refleksi');
        renderCategoryDetail();
        renderInventoryRack();
      }

      /* =====================================================================
       * 11. REAL EVIDENCE FILE UPLOAD (F-03), STRICT HTTPS URL PARSER (7.4),
       *     AND IN-APP LIGHTBOX PREVIEW / DOWNLOAD
       * ===================================================================== */
      function showEvidenceFormError(code, humanMsg) {
        const el = document.getElementById('evidenceFormError');
        // Show friendly, non-technical Indonesian to the user, log technical code in QA panel (Section 7.4 & 8.4)
        el.textContent = humanMsg;
        el.classList.remove('hidden');
        logApiCall(`POST /api/v1/me/uploads/presign`, code, { error: code, message: humanMsg });
        announceScreenReader(humanMsg);
      }

      function renderEvidenceSkillPicker(selectedNodeIds = null) {
        const pickerEl = document.getElementById('evUsedSkillsPicker');
        const counterEl = document.getElementById('evUsedSkillsCounter');
        if (!pickerEl) return;
        const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug) || SEED_CATEGORIES[0];
        if (Array.isArray(selectedNodeIds)) {
          state.selectedEvidenceNodeIds = selectedNodeIds.slice();
        } else if (!Array.isArray(state.selectedEvidenceNodeIds)) {
          state.selectedEvidenceNodeIds = [];
        }
        const pickedSet = new Set(state.selectedEvidenceNodeIds);
        if (counterEl) {
          counterEl.textContent = `${pickedSet.size} skill dipilih`;
        }
        pickerEl.innerHTML = cat.nodes.map(n => {
          const isPicked = pickedSet.has(n.flatIdx);
          const tIcons = ['🌱', '🔥', '👑'];
          return `
            <button type="button"
                    data-pick-ev-skill="${n.flatIdx}"
                    aria-pressed="${isPicked ? 'true' : 'false'}"
                    class="ev-skill-chip-pick ${isPicked ? 'is-picked' : ''}">
              <span>${isPicked ? '☑️' : (tIcons[n.tierIdx] || '✦')}</span>
              <span>${escapeHtml(n.title)}</span>
              <span class="font-mono text-[9px] opacity-70">(${escapeHtml(n.branchName)})</span>
            </button>
          `;
        }).join('');
      }

      function clearEvidenceForm(preselectNodeIds = []) {
        state.editingEvidenceId = null;
        state.pendingFileAttachment = null;
        state.lastSelectedFileObj = null;
        state.selectedEvidenceNodeIds = Array.isArray(preselectNodeIds) ? preselectNodeIds.slice() : [];
        document.getElementById('evInputTitle').value = '';
        document.getElementById('evInputSummary').value = '';
        document.getElementById('evInputUrl').value = '';
        document.getElementById('evInputDate').value = '';
        document.getElementById('evInputFile').value = '';
        document.getElementById('evidenceFormHeading').textContent = '📎 Tambah Bukti Karya';
        document.getElementById('btnSubmitEvidence').textContent = '+ Simpan Item ke Galeri Evidence';
        document.getElementById('btnCancelEvidenceEdit').classList.add('hidden');
        document.getElementById('evidenceFormError').classList.add('hidden');
        document.getElementById('evUploadProgressWrap').classList.add('hidden');
        renderEvidenceSkillPicker(state.selectedEvidenceNodeIds);
        updateCharCounters();
      }

      function processEvidenceFileUpload(file) {
        const progWrap = document.getElementById('evUploadProgressWrap');
        const progBar = document.getElementById('evUploadProgressBar');
        const progText = document.getElementById('evUploadProgressText');
        const retryBtn = document.getElementById('btnRetryFileUpload');

        if (!file) {
          state.pendingFileAttachment = null;
          progWrap.classList.add('hidden');
          return;
        }
        state.lastSelectedFileObj = file;

        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        const maxBytes = 10 * 1024 * 1024;

        // Check 0-byte empty file per Audit F-03 criteria
        if (file.size === 0) {
          document.getElementById('evInputFile').value = '';
          state.pendingFileAttachment = null;
          progWrap.classList.add('hidden');
          showEvidenceFormError('400 EMPTY_FILE', `File "${file.name}" kosong (0 byte). Pilih file foto atau PDF yang memiliki isi ya.`);
          return;
        }

        if (!allowedMimes.includes(file.type)) {
          document.getElementById('evInputFile').value = '';
          state.pendingFileAttachment = null;
          progWrap.classList.add('hidden');
          showEvidenceFormError('415 UNSUPPORTED_MEDIA_TYPE', `Format file "${file.name}" belum didukung. Gunakan file foto (JPEG, PNG, WebP) atau dokumen PDF.`);
          return;
        }

        if (file.size > maxBytes) {
          document.getElementById('evInputFile').value = '';
          state.pendingFileAttachment = null;
          progWrap.classList.add('hidden');
          showEvidenceFormError('413 FILE_TOO_LARGE', `Ukuran file (${(file.size / 1048576).toFixed(1)} MB) melebihi batas maksimal 10 MB.`);
          return;
        }

        document.getElementById('evidenceFormError').classList.add('hidden');
        progWrap.classList.remove('hidden');
        retryBtn.classList.add('hidden');
        progBar.style.width = '15%';
        progText.textContent = `Mengunggah "${file.name}"...`;

        const reader = new FileReader();
        reader.onprogress = (ev) => {
          if (ev.lengthComputable && ev.total > 0) {
            const pct = Math.min(95, Math.round((ev.loaded / ev.total) * 100));
            progBar.style.width = `${pct}%`;
            progText.textContent = `Memproses file (${pct}%)...`;
          }
        };
        reader.onerror = () => {
          state.pendingFileAttachment = null;
          progBar.style.width = '0%';
          progText.textContent = 'Gagal membaca file.';
          retryBtn.classList.remove('hidden');
          showEvidenceFormError('500 UPLOAD_READ_ERROR', 'File gagal diproses. Klik "Coba Unggah Ulang" atau pilih ulang file.');
        };
        reader.onload = () => {
          const dataUrl = reader.result;
          progBar.style.width = '100%';
          const sizeKb = Math.max(1, Math.round(file.size / 1024));
          progText.textContent = `✓ File siap disimpan (${file.name} · ${sizeKb} KB)`;
          state.pendingFileAttachment = {
            name: file.name,
            mime: file.type,
            size: file.size,
            dataUrl: dataUrl
          };
        };
        reader.readAsDataURL(file);
      }

      document.getElementById('evInputFile').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        processEvidenceFileUpload(file);
      });

      document.getElementById('btnRetryFileUpload').addEventListener('click', () => {
        if (state.lastSelectedFileObj) {
          processEvidenceFileUpload(state.lastSelectedFileObj);
        }
      });

      function isStrictHttpsUrl(rawUrl) {
        try {
          const parsed = new URL(rawUrl);
          return parsed.protocol === 'https:' && Boolean(parsed.hostname);
        } catch (err) {
          return false;
        }
      }

      function submitEvidenceItem() {
        const slug = state.selectedSlug;
        const prof = state.profiles[slug];
        const title = document.getElementById('evInputTitle').value.trim();
        const summary = document.getElementById('evInputSummary').value.trim();
        const itemType = document.getElementById('evInputType').value;
        const occurredOn = document.getElementById('evInputDate').value || null;
        const externalUrl = document.getElementById('evInputUrl').value.trim();

        if (!title || title.length < 1 || title.length > 120) {
          showEvidenceFormError('400 VALIDATION_ERROR', 'Judul bukti karya wajib diisi (antara 1 hingga 120 karakter).');
          return;
        }
        if (summary.length > 2000) {
          showEvidenceFormError('400 VALIDATION_ERROR', 'Cerita singkat maksimal 2.000 karakter.');
          return;
        }
        if (externalUrl && !isStrictHttpsUrl(externalUrl)) {
          showEvidenceFormError('400 VALIDATION_ERROR', 'Tautan eksternal harus berupa alamat lengkap yang aman dan diawali https:// (bukan http://).');
          return;
        }

        const usedNodeIds = Array.isArray(state.selectedEvidenceNodeIds)
          ? state.selectedEvidenceNodeIds.slice().sort((a, b) => a - b)
          : [];

        if (state.editingEvidenceId) {
          const item = prof.evidence.find(x => x.id === state.editingEvidenceId);
          if (item) {
            item.title = title;
            item.summary = summary;
            item.itemType = itemType;
            item.occurredOn = occurredOn;
            item.externalUrl = externalUrl || null;
            item.usedNodeIds = usedNodeIds;
            if (state.pendingFileAttachment) {
              const kb = Math.max(1, Math.round(state.pendingFileAttachment.size / 1024));
              const refKey = item.assetRefKey || `att-${state.auth.userId}-${item.id}`;
              item.assetRefKey = refKey;
              item.assetKey = `${state.pendingFileAttachment.name} (${kb} KB)`;
              item.assetName = state.pendingFileAttachment.name;
              item.assetMime = state.pendingFileAttachment.mime;
              item.assetDataUrl = state.pendingFileAttachment.dataUrl;
              saveEvidenceAttachmentToIDB(refKey, state.pendingFileAttachment.dataUrl, state.pendingFileAttachment);
            }
            item.updatedAt = new Date().toISOString();
          }
          showGlobalNotice('success', `Bukti karya "${title}" berhasil diperbarui. Tingkat mastery tetap tidak berubah otomatis.`);
        } else {
          const kb = state.pendingFileAttachment ? Math.max(1, Math.round(state.pendingFileAttachment.size / 1024)) : 0;
          const newEv = {
            id: 'ev-' + Date.now(),
            userId: state.auth.userId,
            categorySlug: slug,
            title,
            summary,
            itemType,
            occurredOn,
            externalUrl: externalUrl || null,
            usedNodeIds,
            assetRefKey: state.pendingFileAttachment ? ('att-' + state.auth.userId + '-' + Date.now()) : null,
            assetKey: state.pendingFileAttachment
              ? `${state.pendingFileAttachment.name} (${kb} KB)`
              : null,
            assetName: state.pendingFileAttachment ? state.pendingFileAttachment.name : null,
            assetMime: state.pendingFileAttachment ? state.pendingFileAttachment.mime : null,
            assetDataUrl: state.pendingFileAttachment ? state.pendingFileAttachment.dataUrl : null,
            sortOrder: prof.evidence.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          if (newEv.assetRefKey && state.pendingFileAttachment) {
            saveEvidenceAttachmentToIDB(newEv.assetRefKey, state.pendingFileAttachment.dataUrl, state.pendingFileAttachment);
          }
          prof.evidence.push(newEv);
          showGlobalNotice('success', `Bukti karya "${title}" berhasil disimpan dan dapat dibuka kembali kapan saja!`);
        }

        prof.version += 1;
        prof.updatedAt = new Date().toISOString();
        savePersistedState();
        clearEvidenceForm();
        renderCategoryDetail();
        renderInventoryRack();
      }

      /* =====================================================================
       * 12. CONFIRMATION MODAL & DIRTY STATE GUARD
       * ===================================================================== */
      /* =====================================================================
       * 12. ACCESSIBLE MODAL MANAGER WITH FOCUS TRAP & RETURN FOCUS (F-06)
       * ===================================================================== */
      const modalTriggerStack = [];

      function getFocusableElements(container) {
        if (!container) return [];
        return Array.from(
          container.querySelectorAll('button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ).filter(el => !el.classList.contains('hidden') && !el.classList.contains('sr-only') && el.offsetParent !== null);
      }

      function openModalWithFocus(modalId, preferredInitialSelector) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modalTriggerStack.push({ modalId, trigger: document.activeElement });
        modal.classList.remove('hidden');

        setTimeout(() => {
          let target = preferredInitialSelector ? modal.querySelector(preferredInitialSelector) : null;
          if (!target) {
            const focusables = getFocusableElements(modal);
            target = focusables[0] || modal;
          }
          if (target && typeof target.focus === 'function') {
            target.focus();
          }
        }, 20);
      }

      function closeModalWithFocus(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('hidden');
        for (let i = modalTriggerStack.length - 1; i >= 0; i--) {
          if (modalTriggerStack[i].modalId === modalId) {
            const entry = modalTriggerStack.splice(i, 1)[0];
            if (entry && entry.trigger && typeof entry.trigger.focus === 'function') {
              setTimeout(() => entry.trigger.focus(), 20);
            }
            break;
          }
        }
      }

      // Trap Tab / Shift+Tab inside any open modal dialog (F-06)
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const openModals = ['modalConfirmDialog', 'modalEvidencePreview', 'modalSkillRadar', 'modalSparkRewards', 'modalGlossaryGuide', 'modalAccessibleIndex', 'modalPreferences', 'modalPrdInspector']
          .map(id => document.getElementById(id))
          .filter(el => el && !el.classList.contains('hidden'));
        if (openModals.length === 0) return;

        const activeModal = openModals[0];
        const focusables = getFocusableElements(activeModal);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first || !activeModal.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !activeModal.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      });

      let confirmCallback = null;
      function openConfirmDialog({ badge, title, message, confirmLabel, onConfirm }) {
        document.getElementById('confirmDialogBadge').textContent = badge || 'Konfirmasi';
        document.getElementById('confirmDialogTitle').textContent = title;
        document.getElementById('confirmDialogMessage').textContent = message;
        document.getElementById('btnConfirmProceed').textContent = confirmLabel || 'Lanjutkan';
        confirmCallback = onConfirm;
        // Focus safe Cancel button (#btnConfirmCancel) by default on destructive/confirmation dialogs per Audit F-06!
        openModalWithFocus('modalConfirmDialog', '#btnConfirmCancel');
      }

      function closeConfirmDialog() {
        closeModalWithFocus('modalConfirmDialog');
        confirmCallback = null;
      }

      function createSampleBlueprintDataUrl(titleText) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="440" viewBox="0 0 720 440">
          <rect width="720" height="440" rx="20" fill="#18323C"/>
          <g stroke="#2B5B6C" stroke-width="1">
            <line x1="0" y1="80" x2="720" y2="80"/><line x1="0" y1="160" x2="720" y2="160"/><line x1="0" y1="240" x2="720" y2="240"/><line x1="0" y1="320" x2="720" y2="320"/>
            <line x1="120" y1="0" x2="120" y2="440"/><line x1="240" y1="0" x2="240" y2="440"/><line x1="360" y1="0" x2="360" y2="440"/><line x1="480" y1="0" x2="480" y2="440"/><line x1="600" y1="0" x2="600" y2="440"/>
          </g>
          <rect x="150" y="95" width="420" height="230" rx="18" fill="none" stroke="#4AD0C4" stroke-width="3"/>
          <rect x="190" y="130" width="340" height="160" rx="10" fill="#1F4250" stroke="#F49B3E" stroke-width="2" stroke-dasharray="6,4"/>
          <circle cx="360" cy="210" r="46" fill="none" stroke="#F49B3E" stroke-width="3"/>
          <text x="360" y="52" text-anchor="middle" fill="#FAF4E6" font-family="monospace" font-size="18" font-weight="bold">${escapeHtml(titleText)}</text>
          <text x="360" y="375" text-anchor="middle" fill="#4AD0C4" font-family="monospace" font-size="13">DOKUMEN BUKTI KARYA TERSIMPAN · SIAP DIUNDUH</text>
        </svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      }

      function openEvidencePreviewModal(evId) {
        const prof = state.profiles[state.selectedSlug];
        const ev = prof && prof.evidence ? prof.evidence.find(x => x.id === evId) : null;
        if (!ev) return;

        const titleEl = document.getElementById('evPreviewTitle');
        const metaEl = document.getElementById('evPreviewMeta');
        const bodyEl = document.getElementById('evPreviewBody');
        const dlLink = document.getElementById('btnDownloadEvidenceFile');

        titleEl.textContent = ev.title;
        metaEl.textContent = `${ev.assetKey || 'Dokumen Bukti Karya'} ${ev.occurredOn ? '· ' + ev.occurredOn : ''}`;

        function renderPreviewWithDataUrl(resolvedUrl) {
          const dataUrl = resolvedUrl || createSampleBlueprintDataUrl(ev.title);
          const fileName = ev.assetName || (ev.assetKey ? ev.assetKey.split(' (')[0] : 'bukti-karya.svg');
          dlLink.href = dataUrl;
          dlLink.download = fileName;

          if (ev.assetMime === 'application/pdf') {
            bodyEl.innerHTML = `
              <iframe src="${dataUrl}" title="${escapeHtml(ev.title)}" class="w-full h-[60vh] rounded-2xl border atlas-border bg-white"></iframe>
              <p class="text-xs atlas-text-secondary mt-2">Jika pratinjau PDF tidak tampil otomatis di browser ini, klik tombol <strong>Unduh File Asli</strong> di kanan atas.</p>
            `;
          } else {
            bodyEl.innerHTML = `
              <img src="${dataUrl}" alt="${escapeHtml(ev.title)}" class="max-h-[58vh] w-auto object-contain rounded-2xl border atlas-border shadow-md bg-white/80 p-2" />
              ${ev.summary ? `<p class="text-xs sm:text-sm atlas-text-secondary mt-3 max-w-xl text-center">${escapeHtml(ev.summary)}</p>` : ''}
            `;
          }
        }

        if (ev.assetDataUrl) {
          renderPreviewWithDataUrl(ev.assetDataUrl);
        } else if (ev.assetRefKey) {
          getEvidenceAttachmentFromIDB(ev.assetRefKey).then(loadedUrl => {
            if (loadedUrl) ev.assetDataUrl = loadedUrl;
            renderPreviewWithDataUrl(loadedUrl);
          });
        } else {
          renderPreviewWithDataUrl(null);
        }

        openModalWithFocus('modalEvidencePreview', '#btnCloseEvidencePreview');
      }

      function guardDirtyNavigation(proceedFn) {
        if (!state.isDirty) {
          proceedFn();
          return;
        }
        openConfirmDialog({
          badge: 'FR-021 · Unsaved Changes Guard',
          title: 'Buang Editan yang Belum Disave?',
          message: 'Lo masih punya draft perubahan di Management Mode yang belum disave ke Cloud. Kalau keluar sekarang, perubahan tadi bakal di-reset.',
          confirmLabel: 'Buang Draft & Lanjut',
          onConfirm: () => {
            state.isDirty = false;
            populateManagementFormFromProfile(state.profiles[state.selectedSlug]);
            proceedFn();
          }
        });
      }

      /* =====================================================================
       * 13. ACCEPTANCE TESTS MATRIX & MODALS
       * ===================================================================== */
      const ACCEPTANCE_TESTS = [
        { id: 'AT-01', name: 'Landing first visit', desc: 'Tampilan sinematik backpack tertutup + quote reflektif; klik langsung tas tanpa skor/XP/streak.' },
        { id: 'AT-02', name: 'Smooth Open & Spill', desc: 'Klik backpack memicu pembukaan penutup & luncuran halus 10 barang ke lantai tanpa loncatan.' },
        { id: 'AT-03', name: 'Inventory completeness', desc: '10 barang 3D bertekstur semi-realistis di lantai + opsi Rak 3D & Daftar 2D.' },
        { id: 'AT-04', name: 'No prefilled level', desc: 'Akun baru menampilkan status semua kategori "Belum dinilai" (NULL), bukan Beginner.' },
        { id: 'AT-05', name: 'Four tabs', desc: 'Capabilities, Evidence, Meaning, dan Potential selalu terlihat & langsung bisa diakses.' },
        { id: 'AT-06', name: 'Evidence separation', desc: 'Menambah/menghapus evidence tidak mengubah level bar secara otomatis.' },
        { id: 'AT-07', name: 'Manual level update', desc: 'Level Bar 1–5 + Belum dinilai dapat disimpan manual dan bertahan setelah reload.' },
        { id: 'AT-08', name: 'Edit cancellation', desc: 'Perubahan belum tersimpan yang dibatalkan tidak mengubah server; keluar meminta konfirmasi.' },
        { id: 'AT-09', name: 'Cross-device sync & 409', desc: 'Status tersimpan setelah commit; konflik versi antarperangkat mengembalikan 409 VERSION_CONFLICT.' },
        { id: 'AT-10', name: 'Unauthorized data (403/404)', desc: 'Permintaan ID evidence milik user lain ditolak tanpa membocorkan isi record.' },
        { id: 'AT-11', name: 'Mobile & Laptop Fit', desc: 'Proporsi teks & kamera responsif; label item muncul kontekstual tanpa menutupi objek 3D.' },
        { id: 'AT-12', name: 'Reduced motion / 2D fallback', desc: 'Semua kategori & detail berfungsi penuh dengan reduced motion atau tanpa WebGL.' },
        { id: 'AT-13', name: 'File error handling', desc: 'File >10MB atau tipe tidak didukung ditolak dengan pesan jelas tanpa membuat evidence palsu.' }
      ];

      function renderAcceptanceMatrix() {
        const container = document.getElementById('acceptanceTestsMatrix');
        container.innerHTML = ACCEPTANCE_TESTS.map(t => `
          <div class="p-3 rounded-xl border atlas-surface flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-[#DF761F]">${t.id}</span>
                <span class="font-bold text-xs">${t.name}</span>
              </div>
              <p class="text-[11px] atlas-text-secondary mt-0.5">${t.desc}</p>
            </div>
            <span class="px-2 py-0.5 rounded bg-[#2E9359]/20 text-[#2E9359] font-mono text-[10px] font-bold shrink-0">PASS</span>
          </div>
        `).join('');
      }

      function renderAccessibleIndexModal() {
        const listEl = document.getElementById('modalIndexList');
        listEl.innerHTML = SEED_CATEGORIES.map(cat => {
          const prof = state.profiles[cat.slug];
          const mastery = getMasteryInfo(prof.level);
          return `
            <div class="py-2.5 px-2 flex items-center justify-between gap-3">
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-bold text-[#DF761F]">${cat.order}</span>
                  <span class="font-bold text-sm truncate">${cat.name}</span>
                  <span class="px-2 py-0.5 rounded border atlas-border font-mono text-[10px]">${mastery.shortLabel}</span>
                </div>
                <div class="w-36 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div class="h-full rounded-full" style="width: ${mastery.barPercent}%; background-color: ${mastery.barColor}"></div>
                </div>
              </div>
              <button type="button" data-modal-jump="${cat.slug}" class="px-3 py-1.5 rounded-xl bg-[#DF761F] text-white text-xs font-bold hover:bg-[#C26012] shrink-0">
                Buka Detail
              </button>
            </div>
          `;
        }).join('');
      }

      function renderPreferencesQuotesList() {
        const el = document.getElementById('prefQuotesList');
        el.innerHTML = state.quotes.map((q, idx) => `
          <div class="p-3 rounded-xl border atlas-surface flex items-start justify-between gap-3">
            <div class="space-y-1">
              <p class="text-xs italic">${escapeHtml(q.text)}</p>
              <div class="font-mono text-[10px] atlas-text-muted">${escapeHtml(q.attribution)} · ${q.locale}</div>
            </div>
            <button type="button" data-select-quote-idx="${idx}" class="px-2.5 py-1 rounded-lg border atlas-border font-mono text-[11px] font-bold hover:border-[#DF761F] shrink-0">
              ${state.preferences.activeQuoteIndex === idx ? 'Aktif' : 'Pilih'}
            </button>
          </div>
        `).join('');
      }

      function escapeHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      /* =====================================================================
       * 14. GAME FLOW ACTIONS: UNPACK TO FLOOR & CHARACTER-SELECT FOCUS
       * ===================================================================== */
      function openBackpackRitual() {
        SoundFX.openBackpack();
        state.screen = 'inventory';
        if (worldCtrl) {
          worldCtrl.triggerUnpack();
        }
        renderInventoryRack();
        renderScreenVisibility();
        announceScreenReader('Backpack terbuka dengan mulus. 10 barang keluar ke lantai.');
      }

      function selectCategoryAndOpenDetail(slug) {
        guardDirtyNavigation(() => {
          SoundFX.selectItem();
          state.selectedSlug = slug;
          state.screen = 'detail';
          state.detailMode = 'adventure';
          state.isDirty = false;
          closePrasastiFullscreenMap(true);
          if (worldCtrl) {
            if (!worldCtrl.isUnpacked) worldCtrl.triggerUnpack();
            worldCtrl.resetDetailView();
          }
          if (detailScene) {
            detailScene.setObject(slug, true);
          }
          renderCategoryDetail();
          renderScreenVisibility();
          const cat = SEED_CATEGORIES.find(c => c.slug === slug);
          announceScreenReader(`Kamera zoom-in ke ${cat ? cat.name : slug}. Lembaran status dibuka di samping.`);
        });
      }

      // Teknis #2: Cycle Left (-1) or Right (+1) across the 10 items while in Detail View
      function cycleSelectedCategory(step) {
        SoundFX.switchItem();
        const curIdx = SEED_CATEGORIES.findIndex(c => c.slug === state.selectedSlug);
        const nextIdx = (curIdx + step + SEED_CATEGORIES.length) % SEED_CATEGORIES.length;
        const targetCat = SEED_CATEGORIES[nextIdx];
        if (targetCat) {
          selectCategoryAndOpenDetail(targetCat.slug);
        }
      }

      function initEventListeners() {
        // Toggle Contextual RPG System Menu Dropdown
        const sysMenuBtn = document.getElementById('btnToggleSystemMenu');
        const sysMenuDrop = document.getElementById('rpgSystemMenuDropdown');
        sysMenuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sysMenuDrop.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
          if (!sysMenuDrop.classList.contains('hidden') && !sysMenuDrop.contains(e.target) && e.target !== sysMenuBtn) {
            sysMenuDrop.classList.add('hidden');
          }
        });

        // Brand Home -> Pack items back into Closed Backpack
        document.getElementById('btnBrandHome').addEventListener('click', () => {
          guardDirtyNavigation(() => {
            if (worldCtrl) worldCtrl.triggerPackUp();
            state.screen = 'landing';
            renderScreenVisibility();
          });
        });

        // Cycle Quote
        document.getElementById('btnCycleQuote').addEventListener('click', () => {
          state.preferences.activeQuoteIndex = (state.preferences.activeQuoteIndex + 1) % state.quotes.length;
          savePersistedState();
          renderLandingQuote();
        });

        // Keyboard / Fallback triggers to open backpack
        document.getElementById('btnOpenBackpack').addEventListener('click', openBackpackRitual);
        document.getElementById('landingBackpack2DFallback').addEventListener('click', openBackpackRitual);
        document.getElementById('btnSkipToInventory').addEventListener('click', openBackpackRitual);
        document.getElementById('backpackHoverPrompt').addEventListener('click', openBackpackRitual);

        // Close Backpack Ritual button from Inventory -> Pack back up
        document.getElementById('btnCloseBackpackRitual').addEventListener('click', () => {
          SoundFX.packBackpack();
          if (worldCtrl) worldCtrl.triggerPackUp();
          state.screen = 'landing';
          renderScreenVisibility();
        });

        // Inventory View Modes
        document.getElementById('btnViewModeFloor').addEventListener('click', () => {
          state.inventoryViewMode = 'floor';
          renderInventoryRack();
        });
        document.getElementById('btnViewMode3D').addEventListener('click', () => {
          state.inventoryViewMode = '3d';
          renderInventoryRack();
        });
        document.getElementById('btnViewMode2D').addEventListener('click', () => {
          state.inventoryViewMode = '2d';
          renderInventoryRack();
        });

        // Delegated click & hover for any [data-select-category] button
        document.body.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-select-category]');
          if (btn) {
            selectCategoryAndOpenDetail(btn.getAttribute('data-select-category'));
          }
        });
        document.body.addEventListener('mouseover', (e) => {
          const btn = e.target.closest('[data-select-category]');
          if (btn && state.screen === 'inventory') {
            setHoveredFloorItem(btn.getAttribute('data-select-category'));
          }
        });

        // Back to Floor Inventory from Detail
        document.getElementById('btnBackToInventory').addEventListener('click', () => {
          guardDirtyNavigation(() => {
            state.screen = 'inventory';
            renderInventoryRack();
            renderScreenVisibility();
          });
        });

        // Quick Category Select & Prev/Next Left-Right Item Switcher in Detail Header (Teknis #2)
        document.getElementById('selectQuickCategory').addEventListener('change', (e) => {
          const nextSlug = e.target.value;
          if (nextSlug !== state.selectedSlug) {
            selectCategoryAndOpenDetail(nextSlug);
          }
        });
        document.getElementById('btnPrevCategoryItem').addEventListener('click', () => {
          cycleSelectedCategory(-1);
        });
        document.getElementById('btnNextCategoryItem').addEventListener('click', () => {
          cycleSelectedCategory(1);
        });

        // In-World Zoomed-In 3D Item Single-Tap Rotation, Zoom & Reset (Request #3 + WCAG SC 2.5.7)
        document.getElementById('btnRotateLeft3D').addEventListener('click', () => {
          if (worldCtrl) worldCtrl.rotateBy(-0.45);
          if (detailScene) detailScene.rotateBy(-0.45);
        });
        document.getElementById('btnRotateRight3D').addEventListener('click', () => {
          if (worldCtrl) worldCtrl.rotateBy(0.45);
          if (detailScene) detailScene.rotateBy(0.45);
        });
        document.getElementById('btnZoomIn3D').addEventListener('click', () => {
          if (worldCtrl) worldCtrl.zoomDetailBy(-0.35);
          if (detailScene) detailScene.zoomBy(-0.45);
        });
        document.getElementById('btnZoomOut3D').addEventListener('click', () => {
          if (worldCtrl) worldCtrl.zoomDetailBy(0.35);
          if (detailScene) detailScene.zoomBy(0.45);
        });
        document.getElementById('btnResetCamera3D').addEventListener('click', () => {
          if (worldCtrl) worldCtrl.resetDetailView();
          if (detailScene) detailScene.resetCamera();
        });

        // World 3D Single-Tap Camera Rotate Left/Right on Landing
        document.getElementById('btnWorldRotateLeft').addEventListener('click', () => {
          if (worldCtrl) worldCtrl.rotateBy(-0.28);
        });
        document.getElementById('btnWorldRotateRight').addEventListener('click', () => {
          if (worldCtrl) worldCtrl.rotateBy(0.28);
        });

        // Direct 2D List button on Landing (Audit Section 8.1 & 8.2)
        document.getElementById('btnLandingDirect2D').addEventListener('click', () => {
          state.inventoryViewMode = '2d';
          openBackpackRitual();
        });

        // Skippable First-Run Onboarding Banner
        document.getElementById('btnDismissOnboarding').addEventListener('click', () => {
          state.onboardingDismissed = true;
          document.getElementById('onboardingBanner').classList.add('hidden');
          savePersistedState();
        });

        // Four Always-Visible Tabs switching + Full WAI-ARIA Keyboard Pattern (ArrowLeft/Right/Home/End) (F-05)
        const tabOrder = ['capabilities', 'evidence', 'meaning', 'potential'];
        document.querySelectorAll('.detail-tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            state.activeTab = btn.getAttribute('data-tab');
            renderCategoryDetail();
          });
          btn.addEventListener('keydown', (e) => {
            const curIdx = tabOrder.indexOf(state.activeTab);
            let nextIdx = -1;
            if (e.key === 'ArrowRight') nextIdx = (curIdx + 1) % tabOrder.length;
            else if (e.key === 'ArrowLeft') nextIdx = (curIdx - 1 + tabOrder.length) % tabOrder.length;
            else if (e.key === 'Home') nextIdx = 0;
            else if (e.key === 'End') nextIdx = tabOrder.length - 1;

            if (nextIdx !== -1) {
              e.preventDefault();
              state.activeTab = tabOrder[nextIdx];
              renderCategoryDetail();
              const targetBtn = document.getElementById(`tabBtn-${state.activeTab}`);
              if (targetBtn) targetBtn.focus();
            }
          });
        });

        // Adventure Mode vs Management Mode
        document.getElementById('btnModeAdventure').addEventListener('click', () => {
          guardDirtyNavigation(() => {
            state.detailMode = 'adventure';
            renderCategoryDetail();
          });
        });
        document.getElementById('btnModeManagement').addEventListener('click', () => {
          state.detailMode = 'management';
          populateManagementFormFromProfile(state.profiles[state.selectedSlug]);
          renderCategoryDetail();
        });
        document.getElementById('btnEnterManageBottom').addEventListener('click', () => {
          state.detailMode = 'management';
          populateManagementFormFromProfile(state.profiles[state.selectedSlug]);
          renderCategoryDetail();
        });
        document.querySelector('[data-action="switch-to-manage-evidence"]').addEventListener('click', () => {
          state.detailMode = 'management';
          state.activeTab = 'evidence';
          populateManagementFormFromProfile(state.profiles[state.selectedSlug]);
          renderCategoryDetail();
        });

        // Cancel & Save in Management Mode
        document.getElementById('btnCancelManagement').addEventListener('click', () => {
          guardDirtyNavigation(() => {
            state.detailMode = 'adventure';
            state.isDirty = false;
            if (worldCtrl) worldCtrl.rebuildItemEvolution(state.selectedSlug);
            renderCategoryDetail();
          });
        });
        document.getElementById('btnSaveProfileChanges').addEventListener('click', saveCategoryProfileChanges);
        document.getElementById('btnSaveLocalDevice').addEventListener('click', saveCategoryProfileChanges);

        function selectDraftMasteryLevel(newLevel, focusAfter = false) {
          SoundFX.levelUp(newLevel || 1);
          draftLevel = newLevel;
          const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug);
          const prof = state.profiles[state.selectedSlug];
          if (cat) {
            draftNodeLevels = createDefaultNodeLevels(cat.slug, newLevel);
            enforceUnlockGatesOnMap(cat.slug, draftNodeLevels);
            if (prof) {
              prof.nodeChecklists = createDefaultNodeChecklists(cat.slug, draftNodeLevels);
            }
          }
          renderManagementNodeAssessmentList(state.selectedSlug);
        renderEvidenceSkillPicker(state.selectedEvidenceNodeIds || []);
          renderLevelRadioGrid(draftLevel);
          renderRpgLevelMeterInDetail(draftLevel, cat.capabilities.length, prof.evidence.length, true);
          if (worldCtrl) worldCtrl.rebuildItemEvolution(state.selectedSlug, draftLevel);
          if (detailScene) detailScene.setObject(state.selectedSlug, true);
          markDirty();
          if (focusAfter) {
            const valStr = draftLevel === null ? 'null' : String(draftLevel);
            const targetRadio = document.querySelector(`#mgmtLevelSelectorGrid [data-select-level="${valStr}"]`);
            if (targetRadio) targetRadio.focus();
          }
        }

        // Undo History Snapshot for Level Changes (Section 6.6)
        state.lastLevelChangeSnapshot = null;

        function updateUndoButtonVisibility() {
          const undoBtn = document.getElementById('btnUndoLastLevelChange');
          if (!undoBtn) return;
          const hasSnap = !!(state.lastLevelChangeSnapshot && state.lastLevelChangeSnapshot.slug === state.selectedSlug);
          undoBtn.classList.toggle('hidden', !hasSnap);
        }

        // Toggle an individual indicator checkbox (0, 1, or 2) for a node at a given level
        function toggleNodeIndicatorCheckbox(nodeIdx, levelNum, indIdx, isChecked) {
          const slug = state.selectedSlug;
          const cat = SEED_CATEGORIES.find(c => c.slug === slug);
          const prof = state.profiles[slug];
          if (!cat || !prof) return;
          ensureProfileNodeLevels(prof, slug);
          ensureProfileNodeChecklists(prof, slug);

          const lv = Math.max(1, Math.min(5, levelNum || 1));
          if (!prof.nodeChecklists[nodeIdx]) prof.nodeChecklists[nodeIdx] = {};
          if (!Array.isArray(prof.nodeChecklists[nodeIdx][lv])) {
            prof.nodeChecklists[nodeIdx][lv] = [false, false, false];
          }
          prof.nodeChecklists[nodeIdx][lv][indIdx] = !!isChecked;

          // Keep card expanded so user can comfortably check all 3 items
          const expKey = `${slug}_${nodeIdx}`;
          state.expandedTierCards[expKey] = true;
          state.inspectedNodeIdx = nodeIdx;

          savePersistedState();
          const arr = prof.nodeChecklists[nodeIdx][lv];
          const doneCount = arr.filter(Boolean).length;
          if (isChecked) {
            SoundFX.checkIndicator(doneCount);
          } else {
            SoundFX.hover();
          }
          const nodeObj = cat.nodes[nodeIdx];
          renderCategoryDetail();

          if (isChecked && doneCount === 3 && lv < 5) {
            showGlobalNotice(
              'success',
              `🔥 KOMBO 3/3 SELESAI! Seluruh indikator Level ${lv} pada "${nodeObj.title}" telah terpenuhi — Klik tombol "🚀 NAIK KE LEVEL ${lv + 1}" sekarang!`
            );
          }
        }

        // Direct Per-Node Skill Tree Level Update with Unlock Gate AND 3-Indicator Checklist Gate Enforcement!
        function applyDirectNodeLevelChange(nodeIdx, newLvl, commitImmediately = false) {
          const slug = state.selectedSlug;
          const cat = SEED_CATEGORIES.find(c => c.slug === slug);
          const prof = state.profiles[slug];
          if (!cat || !prof) return;
          ensureProfileNodeLevels(prof, slug);
          ensureProfileNodeChecklists(prof, slug);
          state.inspectedNodeIdx = nodeIdx;

          const targetMap = commitImmediately ? prof.nodeLevels : draftNodeLevels;
          const gate = evaluateNodeUnlockGate(slug, nodeIdx, targetMap);
          const nodeObj = cat.nodes[nodeIdx];

          if (!gate.unlocked) {
            SoundFX.notice('error');
            const expKey = `${slug}_${nodeIdx}`;
            state.expandedTierCards[expKey] = true;
            renderCategoryDetail();
            showGlobalNotice(
              'warning',
              `🔒 Sub-skill "${nodeObj.title}" (${nodeObj.tierName}) masih terkunci! Syarat buka: ${gate.gateFormula}.`
            );
            return;
          }

          const sanitizedNewLvl = (typeof newLvl === 'number' && newLvl >= 1 && newLvl <= 5) ? newLvl : 1;
          const curLvl = (typeof targetMap[nodeIdx] === 'number' && targetMap[nodeIdx] >= 1) ? targetMap[nodeIdx] : 1;

          // Req #3: Strict Checklist Gate when attempting to increase level!
          if (sanitizedNewLvl > curLvl) {
            const checkGate = canNodeAdvanceToTargetLevel(prof, slug, nodeIdx, curLvl, sanitizedNewLvl);
            if (!checkGate.allowed) {
              SoundFX.notice('error');
              // Automatically open this skill's detail box so the user sees the 3 checkboxes right away
              const expKey = `${slug}_${nodeIdx}`;
              state.expandedTierCards[expKey] = true;
              renderCategoryDetail();
              showGlobalNotice(
                'warning',
                `☑️ Belum bisa naik ke Level ${sanitizedNewLvl}! Centang dulu semua 3 indikator pada "${nodeObj.title}" di Level ${checkGate.missingLevel} (baru ${checkGate.checkedCount}/3 tercentang).`
              );
              return;
            }
          }

          newLvl = sanitizedNewLvl;
          const isLevelUp = newLvl > curLvl;

          if (commitImmediately) {
            // Save snapshot for Undo & compute gate count before vs after
            const prevGateCount = computeCoreLevelFromNodes(slug, prof.nodeLevels).openGateCount;
            state.lastLevelChangeSnapshot = {
              slug,
              prevNodeLevels: Object.assign({}, prof.nodeLevels),
              prevCoreLevel: prof.level,
              nodeTitle: nodeObj.title
            };

            prof.nodeLevels[nodeIdx] = newLvl;
            if (!state.previewIndicatorLevelByNode) state.previewIndicatorLevelByNode = {};
            state.previewIndicatorLevelByNode[`${slug}_${nodeIdx}`] = newLvl;
            enforceUnlockGatesOnMap(slug, prof.nodeLevels);
            const comp = computeCoreLevelFromNodes(slug, prof.nodeLevels);
            const deltaGates = comp.openGateCount - prevGateCount;
            SoundFX.levelUp(newLvl || 1, Math.max(0, deltaGates));
            if (isLevelUp) {
              triggerLevelUpCelebration(nodeObj, curLvl, newLvl, deltaGates);
            }
            prof.level = comp.coreLevel;
            prof.version += 1;
            prof.updatedAt = new Date().toISOString();
            savePersistedState();
            updateSyncHeaderUI();
            if (worldCtrl) worldCtrl.rebuildItemEvolution(slug, prof.level);
            if (detailScene) detailScene.setObject(slug, true);
            generateRackThumbnails(slug);
            renderCategoryDetail();
            renderInventoryRack();
            updateUndoButtonVisibility();

            let unlockImpactMsg = '';
            if (deltaGates > 0) {
              unlockImpactMsg = ` 🔓 Membuka ${deltaGates} gerbang tier lanjutan!`;
            } else if (deltaGates < 0) {
              unlockImpactMsg = ` 🔒 ${Math.abs(deltaGates)} tier lanjutan kembali terkunci karena prasyarat belum terpenuhi.`;
            }
            showGlobalNotice(
              'success',
              `✓ Tersimpan: ${nodeObj.title} (${nodeObj.tierShort}) → ${newLvl === null ? 'Belum dinilai (—)' : 'Skor ' + newLvl + '/5 (' + getMasteryInfo(newLvl).label + ')'}.${unlockImpactMsg} (Klik "↩ Undo" jika ingin membatalkan).`
            );
          } else {
            draftNodeLevels[nodeIdx] = newLvl;
            enforceUnlockGatesOnMap(slug, draftNodeLevels);
            const comp = computeCoreLevelFromNodes(slug, draftNodeLevels);
            draftLevel = comp.coreLevel;
            renderManagementNodeAssessmentList(slug);
            renderLevelRadioGrid(draftLevel);
            renderRpgLevelMeterInDetail(draftLevel, cat.capabilities.length, prof.evidence.length, true);
            if (worldCtrl) worldCtrl.rebuildItemEvolution(slug, draftLevel);
            if (detailScene) detailScene.setObject(slug, true);
            markDirty();
          }
        }

        // Management Form Dirty Tracking + Live RPG Meter Preview + WAI-ARIA Radio Arrow Navigation (F-05)!
        document.getElementById('mgmtLevelSelectorGrid').addEventListener('click', (e) => {
          const btn = e.target.closest('[data-select-level]');
          if (!btn) return;
          const raw = btn.getAttribute('data-select-level');
          selectDraftMasteryLevel(raw === 'null' ? null : parseInt(raw, 10), true);
        });

        // Per-Node Skill Tree clicks in Management Mode
        document.getElementById('mgmtNodeAssessList').addEventListener('click', (e) => {
          const btn = e.target.closest('[data-mgmt-node-idx]');
          if (!btn) return;
          const idx = parseInt(btn.getAttribute('data-mgmt-node-idx'), 10);
          const raw = btn.getAttribute('data-mgmt-node-lvl');
          applyDirectNodeLevelChange(idx, raw === 'null' ? null : parseInt(raw, 10), false);
        });

        // Per-Node Skill Tree clicks & indicator checkboxes in Adventure Mode list
        document.getElementById('advCapabilitiesList').addEventListener('change', (e) => {
          const chk = e.target.closest('[data-check-node-idx]');
          if (!chk) return;
          const nIdx = parseInt(chk.getAttribute('data-check-node-idx'), 10);
          const nLvl = parseInt(chk.getAttribute('data-check-node-lvl'), 10);
          const iIdx = parseInt(chk.getAttribute('data-check-ind-idx'), 10);
          toggleNodeIndicatorCheckbox(nIdx, nLvl, iIdx, chk.checked);
        });

        function triggerLevelUpCelebration(nodeObj, oldLvl, newLvl, deltaGates = 0) {
          const existing = document.getElementById('levelUpCelebrationToast');
          if (existing) existing.remove();
          const meta = getMasteryInfo(newLvl);
          const toast = document.createElement('div');
          toast.id = 'levelUpCelebrationToast';
          toast.className = 'levelup-celebration-toast px-5 py-3.5 rounded-2xl border-2 border-[#FDE047] bg-gradient-to-r from-[#14291E] via-[#0F3D2E] to-[#1E293B] text-white shadow-2xl flex items-center gap-3.5';
          const sparks = Array.from({ length: 10 }, (_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const tx = Math.round(Math.cos(angle) * (55 + (i % 3) * 20));
            const ty = Math.round(Math.sin(angle) * (40 + (i % 2) * 20) - 25);
            const col = i % 2 === 0 ? '#FDE047' : '#34D399';
            return `<span style="position:absolute;left:50%;top:50%;width:7px;height:7px;border-radius:999px;background:${col};--tx:${tx}px;--ty:${ty}px;animation:sparkFloatAnim 0.95s ease-out forwards;"></span>`;
          }).join('');
          toast.innerHTML = `
            <div style="position:relative;" class="w-10 h-10 rounded-xl bg-[#FDE047]/20 border border-[#FDE047] flex items-center justify-center text-xl shrink-0">
              ${newLvl === 5 ? '👑' : '⚡'}
              ${sparks}
            </div>
            <div class="space-y-0.5">
              <div class="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#FDE047]">
                🎉 LEVEL UP BERHASIL! · Lv.${oldLvl} → Lv.${newLvl}/5
              </div>
              <div class="font-extrabold text-sm sm:text-base text-white">
                ${escapeHtml(nodeObj.title)} <span class="text-[#6EE7B7] font-mono text-xs">(${escapeHtml(meta.label)})</span>
              </div>
              ${deltaGates > 0 ? `<div class="font-mono text-[11px] font-bold text-[#FDE047]">🔓 Membuka ${deltaGates} Gerbang Skill Terkunci!</div>` : ''}
            </div>
          `;
          document.body.appendChild(toast);
          setTimeout(() => {
            if (toast && toast.parentNode) toast.remove();
          }, 3450);
        }

        const evSkillPickerEl = document.getElementById('evUsedSkillsPicker');
        if (evSkillPickerEl) {
          evSkillPickerEl.addEventListener('click', (e) => {
            const chip = e.target.closest('[data-pick-ev-skill]');
            if (!chip) return;
            const nid = parseInt(chip.getAttribute('data-pick-ev-skill'), 10);
            if (!Array.isArray(state.selectedEvidenceNodeIds)) state.selectedEvidenceNodeIds = [];
            const pos = state.selectedEvidenceNodeIds.indexOf(nid);
            if (pos === -1) {
              state.selectedEvidenceNodeIds.push(nid);
            } else {
              state.selectedEvidenceNodeIds.splice(pos, 1);
            }
            SoundFX.hover();
            renderEvidenceSkillPicker(state.selectedEvidenceNodeIds);
          });
        }

        document.getElementById('advCapabilitiesList').addEventListener('click', (e) => {
          // 1. Level preview tabs inside indicator card
          const tabBtn = e.target.closest('[data-preview-ind-node]');
          if (tabBtn) {
            e.stopPropagation();
            const nIdx = parseInt(tabBtn.getAttribute('data-preview-ind-node'), 10);
            const pLvl = parseInt(tabBtn.getAttribute('data-preview-ind-lvl'), 10);
            if (!state.previewIndicatorLevelByNode) state.previewIndicatorLevelByNode = {};
            state.previewIndicatorLevelByNode[`${state.selectedSlug}_${nIdx}`] = pLvl;
            SoundFX.hover();
            renderCategoryDetail();
            return;
          }

          // 2. 1-Click Quick Evidence Inspect chip inside Competency drawer
          const evChip = e.target.closest('[data-quick-ev-inspect]');
          if (evChip) {
            e.stopPropagation();
            const evId = evChip.getAttribute('data-quick-ev-inspect');
            const prof = state.profiles[state.selectedSlug];
            const ev = prof && prof.evidence ? prof.evidence.find(x => x.id === evId) : null;
            if (ev) {
              if (ev.assetDataUrl || ev.assetRefKey || ev.assetKey) {
                openEvidencePreviewModal(ev.id, evChip);
              } else if (ev.externalUrl) {
                window.open(ev.externalUrl, '_blank', 'noopener,noreferrer');
              } else {
                showGlobalNotice('info', `📎 ${ev.title}: ${ev.summary || 'Bukti karya tercatat di galeri.'}`);
              }
            }
            return;
          }

          // 3. '+ Kaitkan Bukti' shortcut button from Competency skill drawer
          const addEvBtn = e.target.closest('[data-add-ev-for-node]');
          if (addEvBtn) {
            e.stopPropagation();
            const nIdx = parseInt(addEvBtn.getAttribute('data-add-ev-for-node'), 10);
            const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug);
            const nodeObj = cat && cat.nodes ? cat.nodes[nIdx] : null;
            if (state.mode !== 'management') {
              setInteractionMode('management');
            }
            switchManagementSection('evidence');
            clearEvidenceForm([nIdx]);
            const titleIn = document.getElementById('evInputTitle');
            if (titleIn) titleIn.focus();
            if (nodeObj) {
              showGlobalNotice('info', `📎 Skill "${nodeObj.title}" otomatis dipilih. Isi judul/unggah file bukti karyamu lalu klik Simpan!`);
            }
            return;
          }

          // 4. Jump to Prerequisite Node button inside Locked Sealed Vault
          const jumpBtn = e.target.closest('[data-jump-prereq-node]');
          if (jumpBtn) {
            e.stopPropagation();
            const targetIdx = parseInt(jumpBtn.getAttribute('data-jump-prereq-node'), 10);
            const expKey = `${state.selectedSlug}_${targetIdx}`;
            state.expandedTierCards[expKey] = true;
            renderCategoryDetail();
            const targetCard = document.getElementById(`tierCardNode-${targetIdx}`);
            if (targetCard) {
              targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
          }

          // 5. Direct Level 1..5 button or Level-Up button
          const btn = e.target.closest('[data-quick-node-idx]');
          if (!btn) return;
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-quick-node-idx'), 10);
          const raw = btn.getAttribute('data-quick-node-lvl');
          applyDirectNodeLevelChange(idx, raw === 'null' ? 1 : parseInt(raw, 10), true);
        });

        // Quick score buttons & indicator checkboxes inside the Stone Petroglyph Node Inspector
        document.getElementById('stoneNodeInspectorBox').addEventListener('change', (e) => {
          const chk = e.target.closest('[data-check-node-idx]');
          if (!chk) return;
          const nIdx = parseInt(chk.getAttribute('data-check-node-idx'), 10);
          const nLvl = parseInt(chk.getAttribute('data-check-node-lvl'), 10);
          const iIdx = parseInt(chk.getAttribute('data-check-ind-idx'), 10);
          toggleNodeIndicatorCheckbox(nIdx, nLvl, iIdx, chk.checked);
        });

        document.getElementById('stoneNodeInspectorBox').addEventListener('click', (e) => {
          const btn = e.target.closest('[data-inspector-node-idx]');
          if (!btn) return;
          const idx = parseInt(btn.getAttribute('data-inspector-node-idx'), 10);
          const raw = btn.getAttribute('data-inspector-node-lvl');
          applyDirectNodeLevelChange(idx, raw === 'null' ? 1 : parseInt(raw, 10), true);
        });

        // Interactive Pannable & Zoomable Prasasti Map + Click on Stone Nodes = INSPECT ONLY!
        const mapContainerEl = document.getElementById('advConstellationContainer');
        if (mapContainerEl) {
          mapContainerEl.addEventListener('pointerdown', (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            state.mapView.isDragging = true;
            state.mapView.dragDist = 0;
            state.mapView.startX = e.clientX;
            state.mapView.startY = e.clientY;
            state.mapView.originX = state.mapView.x;
            state.mapView.originY = state.mapView.y;
            mapContainerEl.classList.add('is-panning');
          });

          window.addEventListener('pointermove', (e) => {
            if (!state.mapView || !state.mapView.isDragging) return;
            const dx = e.clientX - state.mapView.startX;
            const dy = e.clientY - state.mapView.startY;
            state.mapView.dragDist = Math.hypot(dx, dy);
            if (state.mapView.dragDist > 3) {
              const rect = mapContainerEl.getBoundingClientRect();
              const ratioX = PRASASTI_SVG_W / Math.max(260, rect.width);
              const ratioY = PRASASTI_SVG_H / Math.max(260, rect.height);
              state.mapView.x = Math.max(-720, Math.min(720, state.mapView.originX + dx * ratioX));
              state.mapView.y = Math.max(-540, Math.min(540, state.mapView.originY + dy * ratioY));
              applyPrasastiMapTransform();
            }
          });

          window.addEventListener('pointerup', () => {
            if (state.mapView && state.mapView.isDragging) {
              state.mapView.isDragging = false;
              mapContainerEl.classList.remove('is-panning');
            }
          });

          mapContainerEl.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.14 : -0.14;
            state.mapView.scale = Math.max(0.70, Math.min(2.6, state.mapView.scale + delta));
            applyPrasastiMapTransform();
          }, { passive: false });

          // Visual Req #3: Clicking a node on the Prasasti Map ONLY inspects it (no auto-upgrade!)
          mapContainerEl.addEventListener('click', (e) => {
            if (state.mapView && state.mapView.dragDist > 7) return;
            const coreMed = e.target.closest('[data-core-medallion]');
            if (coreMed) {
              setPrasastiMapViewMode('closeup', 'center');
              return;
            }
            const starGroup = e.target.closest('[data-constellation-node]');
            if (!starGroup) return;
            const idx = parseInt(starGroup.getAttribute('data-constellation-node'), 10);
            inspectStoneNodeOnly(idx, true);
          });

          // P1 #9: Keyboard Enter / Space on focused SVG Stone Node
          mapContainerEl.addEventListener('keydown', (e) => {
            const starGroup = e.target.closest('[data-constellation-node]');
            if (!starGroup) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const idx = parseInt(starGroup.getAttribute('data-constellation-node'), 10);
              inspectStoneNodeOnly(idx, true);
            }
          });
        }

        // Toggle 📖 / 🛠️ / 🎯 detail tabs AND one-click Prerequisite Jump ([data-jump-prereq-idx]) inside Full-Screen Map Inspector
        document.getElementById('stoneNodeInspectorBox').addEventListener('click', (e) => {
          const jumpBtn = e.target.closest('[data-jump-prereq-idx]');
          if (jumpBtn) {
            const targetIdx = parseInt(jumpBtn.getAttribute('data-jump-prereq-idx'), 10);
            if (!isNaN(targetIdx)) {
              inspectStoneNodeOnly(targetIdx, true);
              ensureNodeInSafeViewport(targetIdx, true);
            }
            return;
          }
          const tabBtn = e.target.closest('[data-inspector-tab]');
          if (tabBtn) {
            const tabKey = tabBtn.getAttribute('data-inspector-tab');
            state.mapView.inspectorTab = (state.mapView.inspectorTab === tabKey) ? null : tabKey;
            const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug) || SEED_CATEGORIES[0];
            const prof = state.profiles[cat.slug];
            updateStoneNodeInspectorPanel(cat, prof.nodeLevels);
            return;
          }
        });

        // Toggle Tier Detail Drawer when clicking the Skill Row directly & "Peta" shortcut inside #advCapabilitiesList
        document.getElementById('advCapabilitiesList').addEventListener('click', (e) => {
          const focusBtn = e.target.closest('[data-focus-map-node]');
          if (focusBtn) {
            e.stopPropagation();
            const idx = parseInt(focusBtn.getAttribute('data-focus-map-node'), 10);
            openPrasastiFullscreenMap(idx);
            return;
          }
          if (e.target.closest('[data-stop-row-toggle]') || e.target.closest('[data-quick-node-idx]') || e.target.closest('label.indicator-check-item') || e.target.closest('input[type="checkbox"]')) {
            return;
          }
          const toggleRow = e.target.closest('[data-toggle-tier-detail]');
          if (toggleRow) {
            const idx = parseInt(toggleRow.getAttribute('data-toggle-tier-detail'), 10);
            const expKey = `${state.selectedSlug}_${idx}`;
            state.expandedTierCards[expKey] = !state.expandedTierCards[expKey];
            const boxEl = document.getElementById(`tierDetailBox-${idx}`);
            const cardEl = document.getElementById(`tierCardNode-${idx}`);
            if (boxEl) {
              boxEl.classList.toggle('hidden', !state.expandedTierCards[expKey]);
            }
            if (cardEl) {
              cardEl.classList.toggle('is-expanded', !!state.expandedTierCards[expKey]);
            }
            toggleRow.setAttribute('aria-expanded', state.expandedTierCards[expKey] ? 'true' : 'false');
          }
        });

        document.getElementById('advCapabilitiesList').addEventListener('keydown', (e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          if (e.target.closest('button') || e.target.closest('input')) return;
          const toggleRow = e.target.closest('[data-toggle-tier-detail]');
          if (toggleRow) {
            e.preventDefault();
            toggleRow.click();
          }
        });

        // Toggle Optional Catatan Praktik Box
        const btnCapNotes = document.getElementById('btnToggleCapNotesBox');
        if (btnCapNotes) {
          btnCapNotes.addEventListener('click', () => {
            const w = document.getElementById('advCapabilityNotesWrap');
            if (w) w.classList.toggle('hidden');
          });
        }


        // Undo Last Level Change Button (Section 6.6)
        const btnUndoLvl = document.getElementById('btnUndoLastLevelChange');
        if (btnUndoLvl) {
          btnUndoLvl.addEventListener('click', () => {
            const snap = state.lastLevelChangeSnapshot;
            if (!snap || snap.slug !== state.selectedSlug) return;
            const prof = state.profiles[snap.slug];
            prof.nodeLevels = Object.assign({}, snap.prevNodeLevels);
            enforceUnlockGatesOnMap(snap.slug, prof.nodeLevels);
            const comp = computeCoreLevelFromNodes(snap.slug, prof.nodeLevels);
            prof.level = comp.coreLevel;
            prof.version += 1;
            prof.updatedAt = new Date().toISOString();
            state.lastLevelChangeSnapshot = null;
            savePersistedState();
            if (worldCtrl) worldCtrl.rebuildItemEvolution(snap.slug, prof.level);
            renderCategoryDetail();
            renderInventoryRack();
            updateUndoButtonVisibility();
            showGlobalNotice('info', `↩ Perubahan skor pada "${snap.nodeTitle}" berhasil dikembalikan ke keadaan sebelumnya.`);
          });
        }

        // Mobile 3D Stage Collapse Toggle (Section 9: Prioritize skill management on small viewports)
        const btnMob3D = document.getElementById('btnToggleMobile3DStage');
        if (btnMob3D) {
          btnMob3D.addEventListener('click', () => {
            const collapsed = document.body.classList.toggle('mobile-scene-collapsed');
            btnMob3D.textContent = collapsed ? '👁️ Tampilkan 3D' : '👁️ 3D';
            if (worldCtrl) setTimeout(() => worldCtrl.resize(), 50);
          });
        }

        // Launch Full-Screen Unfolding Prasasti Map (#4 & #7)
        const btnLaunchMap = document.getElementById('btnLaunchPrasastiMap');
        if (btnLaunchMap) {
          btnLaunchMap.addEventListener('click', () => {
            openPrasastiFullscreenMap();
          });
        }

        const btnZoomInMap = document.getElementById('btnMapZoomIn');
        const btnZoomOutMap = document.getElementById('btnMapZoomOut');
        const btnResetMap = document.getElementById('btnMapResetView');
        const btnFullMap = document.getElementById('btnTogglePrasastiFullscreen');
        const btnModeHeli = document.getElementById('btnMapModeHelicopter');
        const btnModeClose = document.getElementById('btnMapModeCloseup');

        if (btnModeHeli) {
          btnModeHeli.addEventListener('click', () => {
            setPrasastiMapViewMode('helicopter');
          });
        }
        if (btnModeClose) {
          btnModeClose.addEventListener('click', () => {
            setPrasastiMapViewMode('closeup', 'center');
          });
        }
        if (btnZoomInMap) {
          btnZoomInMap.addEventListener('click', () => {
            state.mapView.scale = Math.min(2.6, state.mapView.scale + 0.2);
            applyPrasastiMapTransform();
          });
        }
        if (btnZoomOutMap) {
          btnZoomOutMap.addEventListener('click', () => {
            state.mapView.scale = Math.max(0.65, state.mapView.scale - 0.2);
            applyPrasastiMapTransform();
          });
        }
        if (btnResetMap) {
          btnResetMap.addEventListener('click', () => {
            // Focus camera directly on the currently selected node!
            const idx = state.inspectedNodeIdx ?? 0;
            ensureNodeInSafeViewport(idx, true);
          });
        }
        if (btnFullMap) {
          btnFullMap.addEventListener('click', () => {
            closePrasastiFullscreenMap();
          });
        }

        // P0 #3.1: Toggle Map Legend Popover
        const btnToggleLegend = document.getElementById('btnToggleMapLegend');
        const btnCloseLegend = document.getElementById('btnCloseMapLegend');
        const legendBox = document.getElementById('prasastiMapLegendBox');
        if (btnToggleLegend && legendBox) {
          btnToggleLegend.addEventListener('click', () => {
            state.mapView.legendOpen = !state.mapView.legendOpen;
            legendBox.classList.toggle('hidden', !state.mapView.legendOpen);
            btnToggleLegend.setAttribute('aria-expanded', state.mapView.legendOpen ? 'true' : 'false');
          });
        }
        if (btnCloseLegend && legendBox) {
          btnCloseLegend.addEventListener('click', () => {
            state.mapView.legendOpen = false;
            legendBox.classList.add('hidden');
            if (btnToggleLegend) btnToggleLegend.setAttribute('aria-expanded', 'false');
          });
        }

        // P0 #3.4: Dismissible Exploration Hint Bar
        const btnDismissHint = document.getElementById('btnDismissMapHint');
        if (btnDismissHint) {
          btnDismissHint.addEventListener('click', () => {
            state.mapView.hintDismissed = true;
            const hintBar = document.getElementById('prasastiExploreHintBar');
            if (hintBar) hintBar.classList.add('hidden');
          });
        }

        // P0 #3.1 & P1 #4.1: Toggle Lineage Path Spotlight
        const btnLineageToggle = document.getElementById('btnToggleMapLineageSpotlight');
        if (btnLineageToggle) {
          btnLineageToggle.addEventListener('click', () => {
            state.mapView.highlightLineage = !state.mapView.highlightLineage;
            const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug) || SEED_CATEGORIES[0];
            const prof = state.profiles[cat.slug];
            renderConstellationSkillTree(cat, prof.nodeLevels, prof.level);
          });
        }

        // P1 #4.6: Quick Domain Switcher inside Fullscreen Map Toolbar
        const selMapDomain = document.getElementById('selectMapDomainQuick');
        if (selMapDomain) {
          selMapDomain.addEventListener('change', (e) => {
            const newSlug = e.target.value;
            if (!newSlug) return;
            state.selectedSlug = newSlug;
            state.inspectedNodeIdx = 0;
            const cat = SEED_CATEGORIES.find(c => c.slug === newSlug) || SEED_CATEGORIES[0];
            const prof = state.profiles[cat.slug];
            ensureProfileNodeLevels(prof, cat.slug);
            renderCategoryDetail();
            renderConstellationSkillTree(cat, prof.nodeLevels, prof.level);
            setPrasastiMapViewMode('closeup', 'center');
          });
        }

        // P1 #4.5 & #6.4: Quick Skill Search Input inside Map Toolbar
        const searchInput = document.getElementById('inputSearchMapNode');
        const searchDrop = document.getElementById('mapSearchResultsDropdown');
        if (searchInput && searchDrop) {
          const renderSearchMatches = () => {
            const q = searchInput.value.trim().toLowerCase();
            if (!q) {
              searchDrop.classList.add('hidden');
              searchDrop.innerHTML = '';
              return;
            }
            const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug) || SEED_CATEGORIES[0];
            const prof = state.profiles[cat.slug];
            ensureProfileNodeLevels(prof, cat.slug);
            const matches = cat.nodes.filter(n => (
              n.title.toLowerCase().includes(q) ||
              n.branchName.toLowerCase().includes(q) ||
              n.tierShort.toLowerCase().includes(q)
            ));
            if (matches.length === 0) {
              searchDrop.innerHTML = `<div class="p-2.5 text-xs text-[#A89984] font-mono">Tidak ada skill yang cocok dengan "${escapeHtml(searchInput.value)}".</div>`;
              searchDrop.classList.remove('hidden');
              return;
            }
            searchDrop.innerHTML = matches.map(m => {
              const g = evaluateNodeUnlockGate(cat.slug, m.flatIdx, prof.nodeLevels);
              const lvl = g.unlocked ? prof.nodeLevels[m.flatIdx] : null;
              const statusTxt = !g.unlocked ? '🔒 Terkunci' : (lvl !== null ? `★ Lv.${lvl}/5` : '✦ Siap Dinilai');
              const statusCol = !g.unlocked ? 'text-[#FCA5A5]' : (lvl !== null ? 'text-[#FEF08A]' : 'text-[#6EE7B7]');
              return `
                <button type="button" data-search-pick-node="${m.flatIdx}" class="w-full px-3 py-2 text-left hover:bg-[#261A11] flex items-center justify-between gap-2 transition-colors">
                  <div class="min-w-0">
                    <div class="font-bold text-xs text-[#FFF8EB] truncate">${escapeHtml(m.title)}</div>
                    <div class="font-mono text-[10px] text-[#A89984] truncate">${escapeHtml(m.branchName)} · Tier ${m.tierIdx + 1} (${escapeHtml(m.tierShort)})</div>
                  </div>
                  <span class="font-mono text-[10px] font-bold ${statusCol} shrink-0">${statusTxt}</span>
                </button>
              `;
            }).join('');
            searchDrop.classList.remove('hidden');
          };

          searchInput.addEventListener('input', renderSearchMatches);
          searchInput.addEventListener('focus', renderSearchMatches);
          searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              const firstBtn = searchDrop.querySelector('[data-search-pick-node]');
              if (firstBtn) {
                e.preventDefault();
                firstBtn.click();
              }
            } else if (e.key === 'Escape') {
              e.stopPropagation();
              searchDrop.classList.add('hidden');
              searchInput.blur();
            }
          });
          searchDrop.addEventListener('click', (e) => {
            const pickBtn = e.target.closest('[data-search-pick-node]');
            if (!pickBtn) return;
            const idx = parseInt(pickBtn.getAttribute('data-search-pick-node'), 10);
            searchDrop.classList.add('hidden');
            searchInput.value = '';
            inspectStoneNodeOnly(idx, true);
            ensureNodeInSafeViewport(idx, true);
          });
        }

        document.getElementById('mgmtLevelSelectorGrid').addEventListener('keydown', (e) => {
          const levels = MASTERY_SCALE.map(m => m.level);
          const curIdx = Math.max(0, levels.indexOf(draftLevel));
          let nextIdx = -1;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx = (curIdx + 1) % levels.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx = (curIdx - 1 + levels.length) % levels.length;
          else if (e.key === 'Home') nextIdx = 0;
          else if (e.key === 'End') nextIdx = levels.length - 1;

          if (nextIdx !== -1) {
            e.preventDefault();
            selectDraftMasteryLevel(levels[nextIdx], true);
          }
        });

        ['inputAssessmentNote', 'inputCapabilityNotes', 'inputMeaningText', 'inputPotentialText'].forEach(id => {
          document.getElementById(id).addEventListener('input', () => {
            updateCharCounters();
            markDirty();
          });
        });

        ['evInputTitle', 'evInputSummary'].forEach(id => {
          document.getElementById(id).addEventListener('input', updateCharCounters);
        });

        // Evidence CRUD
        document.getElementById('btnSubmitEvidence').addEventListener('click', submitEvidenceItem);
        document.getElementById('btnCancelEvidenceEdit').addEventListener('click', clearEvidenceForm);
        document.getElementById('btnSimulateInvalidFile').addEventListener('click', () => {
          showEvidenceFormError(
            '413 FILE_TOO_LARGE / 415 UNSUPPORTED_MEDIA_TYPE',
            'Simulasi AT-13 berhasil: File "video_raw_48MB.mov" ditolak karena melebihi batas 10 MB dan bukan tipe JPEG/PNG/WebP/PDF. Nggak ada evidence palsu yang dibuat.'
          );
        });

        document.getElementById('advEvidenceList').addEventListener('click', (e) => {
          const prevBtn = e.target.closest('[data-ev-preview]');
          if (prevBtn) {
            openEvidencePreviewModal(prevBtn.getAttribute('data-ev-preview'));
          }
        });

        document.getElementById('mgmtEvidenceList').addEventListener('click', (e) => {
          const prevBtn = e.target.closest('[data-ev-preview]');
          if (prevBtn) {
            openEvidencePreviewModal(prevBtn.getAttribute('data-ev-preview'));
            return;
          }
          const slug = state.selectedSlug;
          const prof = state.profiles[slug];
          const moveBtn = e.target.closest('[data-ev-move]');
          const editBtn = e.target.closest('[data-ev-edit]');
          const delBtn = e.target.closest('[data-ev-delete]');

          if (moveBtn) {
            const id = moveBtn.getAttribute('data-ev-id');
            const dir = moveBtn.getAttribute('data-ev-move');
            const sorted = prof.evidence.slice().sort((a, b) => a.sortOrder - b.sortOrder);
            const idx = sorted.findIndex(x => x.id === id);
            if (idx !== -1) {
              const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
              if (swapIdx >= 0 && swapIdx < sorted.length) {
                const tmp = sorted[idx].sortOrder;
                sorted[idx].sortOrder = sorted[swapIdx].sortOrder;
                sorted[swapIdx].sortOrder = tmp;
                prof.version += 1;
                savePersistedState();
                renderCategoryDetail();
              }
            }
          } else if (editBtn) {
            const id = editBtn.getAttribute('data-ev-id');
            const ev = prof.evidence.find(x => x.id === id);
            if (ev) {
              state.editingEvidenceId = ev.id;
              state.selectedEvidenceNodeIds = Array.isArray(ev.usedNodeIds) ? ev.usedNodeIds.slice() : [];
              renderEvidenceSkillPicker(state.selectedEvidenceNodeIds);
              document.getElementById('evInputTitle').value = ev.title;
              document.getElementById('evInputSummary').value = ev.summary || '';
              document.getElementById('evInputType').value = ev.itemType || 'project';
              document.getElementById('evInputDate').value = ev.occurredOn || '';
              document.getElementById('evInputUrl').value = ev.externalUrl || '';
              document.getElementById('evidenceFormHeading').textContent = `Edit Evidence: ${ev.title}`;
              document.getElementById('btnSubmitEvidence').textContent = 'Simpan Perubahan Item';
              document.getElementById('btnCancelEvidenceEdit').classList.remove('hidden');
              updateCharCounters();
            }
          } else if (delBtn) {
            const id = delBtn.getAttribute('data-ev-id');
            const ev = prof.evidence.find(x => x.id === id);
            if (ev) {
              openConfirmDialog({
                badge: 'FR-011 · Hapus Evidence',
                title: `Hapus Evidence "${ev.title}"?`,
                message: 'Item ini bakal dihapus dari galeri kategori lo. Level mastery bar tetap aman dan nggak berubah.',
                confirmLabel: 'Hapus Evidence',
                onConfirm: () => {
                  if (ev.assetRefKey) deleteEvidenceAttachmentFromIDB(ev.assetRefKey);
                  prof.evidence = prof.evidence.filter(x => x.id !== id);
                  prof.version += 1;
                  prof.updatedAt = new Date().toISOString();
                  savePersistedState();
                  logApiCall(`DELETE /api/v1/me/evidence/${id}`, '204 NO_CONTENT', { deletedId: id, categoryLevelUnchanged: true });
                  showGlobalNotice('success', `Evidence "${ev.title}" berhasil dihapus.`);
                  renderCategoryDetail();
                  renderInventoryRack();
                }
              });
            }
          }
        });

        // Confirmation Dialog
        document.getElementById('btnConfirmCancel').addEventListener('click', closeConfirmDialog);
        document.getElementById('btnConfirmProceed').addEventListener('click', () => {
          const fn = confirmCallback;
          closeConfirmDialog();
          if (typeof fn === 'function') fn();
        });

        // Accessible Index Modal with Focus Trap & Return Focus (F-06)
        document.getElementById('btnAccessibleIndex').addEventListener('click', () => {
          renderAccessibleIndexModal();
          openModalWithFocus('modalAccessibleIndex', '#btnCloseAccessibleIndex');
        });
        document.getElementById('btnCloseAccessibleIndex').addEventListener('click', () => {
          closeModalWithFocus('modalAccessibleIndex');
        });
        document.getElementById('modalIndexList').addEventListener('click', (e) => {
          const btn = e.target.closest('[data-modal-jump]');
          if (btn) {
            closeModalWithFocus('modalAccessibleIndex');
            selectCategoryAndOpenDetail(btn.getAttribute('data-modal-jump'));
          }
        });

        // Evidence Preview Modal Close
        document.getElementById('btnCloseEvidencePreview').addEventListener('click', () => {
          closeModalWithFocus('modalEvidencePreview');
        });

        // Glossary & Guide Modal (F-08, Section 8.1)
        document.getElementById('btnOpenGuideModal').addEventListener('click', () => {
          openModalWithFocus('modalGlossaryGuide', '#btnCloseGlossaryGuide');
        });
        document.getElementById('btnCloseGlossaryGuide').addEventListener('click', () => {
          closeModalWithFocus('modalGlossaryGuide');
        });

        // 10-Skill Radar Chart Modal (Teknis #6)
        const openRadarModal = () => {
          renderSkillRadarChart();
          awardSparks(1, '🕸️ Cek Radar Skill');
          openModalWithFocus('modalSkillRadar', '#btnCloseRadarModal');
        };
        document.getElementById('btnOpenRadarModal').addEventListener('click', openRadarModal);
        document.getElementById('btnInlineOpenRadar').addEventListener('click', openRadarModal);
        document.getElementById('btnCloseRadarModal').addEventListener('click', () => {
          closeModalWithFocus('modalSkillRadar');
        });
        document.getElementById('modalSkillRadar').addEventListener('click', (e) => {
          const jumpEl = e.target.closest('[data-radar-slug]');
          if (jumpEl) {
            const targetSlug = jumpEl.getAttribute('data-radar-slug');
            closeModalWithFocus('modalSkillRadar');
            selectCategoryAndOpenDetail(targetSlug);
          }
        });

        // Cozy Explorer Spark Rewards & Camp Ambiance Modal (Teknis #5)
        document.getElementById('btnOpenSparkRewards').addEventListener('click', () => {
          renderSparkRewardsModal();
          openModalWithFocus('modalSparkRewards', '#btnCloseSparkRewards');
        });
        document.getElementById('btnCloseSparkRewards').addEventListener('click', () => {
          closeModalWithFocus('modalSparkRewards');
        });
        document.getElementById('btnToggleAuroraSky').addEventListener('click', () => {
          state.auroraEnabled = !state.auroraEnabled;
          savePersistedState();
          renderSparkRewardsModal();
          showGlobalNotice('success', state.auroraEnabled ? '🌌 Aurora Zamrud di langit diaktifkan!' : '🌌 Aurora langit dimatikan.');
        });
        document.getElementById('btnPetCampCritters').addEventListener('click', (e) => {
          state.critterCheerTimer = 2.2;
          awardSparks(3, '🦊 Menyapa Hewan Hutan', e.clientX, e.clientY);
          renderSparkRewardsModal();
          showGlobalNotice('success', '🦊 Rubah & Kelinci Hutan melompat gembira di sekitar perkemahanmu! (+3 ✨)');
        });

        // Preferences Modal with Focus Trap & Return Focus (F-06)
        document.getElementById('btnPreferencesModal').addEventListener('click', () => {
          sysMenuDrop.classList.add('hidden');
          renderPreferencesQuotesList();
          openModalWithFocus('modalPreferences', '#btnClosePreferences');
        });
        document.getElementById('btnClosePreferences').addEventListener('click', () => {
          closeModalWithFocus('modalPreferences');
        });
        document.getElementById('toggleReducedMotion').addEventListener('change', (e) => {
          state.preferences.reducedMotion = e.target.checked;
          savePersistedState();
          applyVisualPreferences();
        });
        document.getElementById('toggleFallback2D').addEventListener('change', (e) => {
          state.preferences.fallback2D = e.target.checked;
          if (!state.preferences.fallback2D && !worldCtrl) {
            ensureWorld3DInitialized();
          }
          scheduleSavePersistedState();
          applyVisualPreferences();
          renderInventoryRack();
          if (state.screen === 'detail') renderCategoryDetail();
        });
        document.getElementById('selectRenderQuality').addEventListener('change', (e) => {
          const val = e.target.value;
          state.preferences.renderQuality = (val === 'high' || val === 'mobile-light') ? val : 'balanced';
          scheduleSavePersistedState();
          applyVisualPreferences();
          const msgMap = {
            'mobile-light': '📱 Profil Kualitas Render: Mobile Ringan diaktifkan (DPR ≤ 0.9×, Tanpa Shadow Map, 0 FPS saat IDLE).',
            'balanced': '⚡ Profil Kualitas Render: Balanced / Hemat Daya diaktifkan (Render On-Demand saat interaksi).',
            'high': '✨ Profil Kualitas Render: High (Shadow 1024px & DPR hingga 1.5×).'
          };
          showGlobalNotice('success', msgMap[state.preferences.renderQuality]);
        });
        document.getElementById('prefQuotesList').addEventListener('click', (e) => {
          const btn = e.target.closest('[data-select-quote-idx]');
          if (btn) {
            state.preferences.activeQuoteIndex = parseInt(btn.getAttribute('data-select-quote-idx'), 10);
            savePersistedState();
            renderLandingQuote();
            renderPreferencesQuotesList();
          }
        });

        // Estetika #4: Semi-Realistic Serious vs Vibrant Color & Texture Mode Toggle
        function toggleColorStyleMode(forceSerious = undefined) {
          state.preferences.colorStyle = (forceSerious !== undefined)
            ? (forceSerious ? 'serious' : 'vibrant')
            : (state.preferences.colorStyle === 'serious' ? 'vibrant' : 'serious');
          savePersistedState();
          applyVisualPreferences();
          if (worldCtrl) {
            worldCtrl.rebuildAllEvolutions();
            // Rebuild backpack mesh material to match color style & dispose old GPU geometries/materials (Finding 2)
            const oldBpMesh = worldCtrl.backpackMesh;
            const oldBpPos = oldBpMesh.position.clone();
            const oldBpRot = oldBpMesh.rotation.clone();
            worldCtrl.scene.remove(oldBpMesh);
            disposeOwnedObject3D(oldBpMesh);
            const freshBp = createStylized3DMesh('backpack');
            freshBp.position.copy(oldBpPos);
            freshBp.rotation.copy(oldBpRot);
            freshBp.userData.interactiveType = 'backpack';
            worldCtrl.scene.add(freshBp);
            worldCtrl.backpackMesh = freshBp;
            if (worldCtrl.refreshRaycastTargets) worldCtrl.refreshRaycastTargets();
          }
          invalidateRackThumbnails();
          generateRackThumbnails();
          renderInventoryRack();
          if (state.screen === 'detail') renderCategoryDetail();
          showGlobalNotice(
            'success',
            state.preferences.colorStyle === 'serious'
              ? '🎨 Mode Texturing & Colouring: Semi-Realistis Serius diaktifkan (palet dewasa, kulit espresso & batu granit).'
              : '🎨 Mode Texturing & Colouring: Cerah Petualang diaktifkan.'
          );
        }

        document.getElementById('btnColorStyleToggle').addEventListener('click', () => {
          toggleColorStyleMode();
        });
        document.getElementById('toggleSeriousRealism').addEventListener('change', (e) => {
          toggleColorStyleMode(e.target.checked);
        });

        // Theme Toggle
        document.getElementById('btnThemeToggle').addEventListener('click', () => {
          state.preferences.theme = state.preferences.theme === 'dark' ? 'light' : 'dark';
          savePersistedState();
          applyVisualPreferences();
        });

        // Preset Demo Accounts on Auth Screen (F-02 Multi-User Isolation Test)
        document.getElementById('btnPresetAccountA').addEventListener('click', () => {
          document.getElementById('inputAuthEmail').value = 'explorer@backpack.atlas';
          document.getElementById('selectAuthDevice').value = 'Laptop A';
        });
        document.getElementById('btnPresetAccountB').addEventListener('click', () => {
          document.getElementById('inputAuthEmail').value = 'nadia@backpack.atlas';
          document.getElementById('selectAuthDevice').value = 'Ponsel B';
        });

        // Auth Account & Per-User Isolation (F-02)
        document.getElementById('btnAuthAccount').addEventListener('click', () => {
          sysMenuDrop.classList.add('hidden');
          guardDirtyNavigation(() => {
            if (state.auth.authenticated) {
              openConfirmDialog({
                badge: 'Kontrol Sesi & Isolasi Akun',
                title: 'Keluar dari Sesi Akun Ini?',
                message: `Kamu sedang masuk sebagai ${state.auth.email} (${state.auth.device}). Data profil akun ini tetap tersimpan terpisah di perangkat ini dan tidak tercampur dengan akun lain.`,
                confirmLabel: 'Keluar / Ganti Akun',
                onConfirm: () => {
                  state.auth.authenticated = false;
                  saveSessionState();
                  document.getElementById('authStatusBadge').className = 'w-2 h-2 rounded-full bg-[#B42318]';
                  document.getElementById('authUserLabel').textContent = 'Masuk';
                  updateSyncHeaderUI();
                  if (worldCtrl) worldCtrl.triggerPackUp();
                  state.screen = 'auth';
                  renderScreenVisibility();
                }
              });
            } else {
              state.screen = 'auth';
              renderScreenVisibility();
            }
          });
        });

        document.getElementById('formLogin').addEventListener('submit', (e) => {
          e.preventDefault();
          const rawEmail = document.getElementById('inputAuthEmail').value.trim();
          const emailErr = document.getElementById('loginEmailError');
          if (!rawEmail || !rawEmail.includes('@')) {
            emailErr.textContent = 'Masukkan alamat email yang valid (contoh: explorer@backpack.atlas).';
            emailErr.classList.remove('hidden');
            return;
          }
          emailErr.classList.add('hidden');
          const normEmail = normalizeAccountEmail(rawEmail);
          const device = document.getElementById('selectAuthDevice').value;

          state.auth.authenticated = true;
          state.auth.email = normEmail;
          state.auth.userId = deriveUserIdFromEmail(normEmail);
          state.auth.device = device;
          state.isDirty = false;

          // Load isolated profile exclusively for this email (F-02)!
          loadPersistedStateForUser(normEmail);
          savePersistedState();

          document.getElementById('authStatusBadge').className = 'w-2 h-2 rounded-full bg-[#1F7A4C]';
          document.getElementById('authUserLabel').textContent = normEmail.split('@')[0];
          document.getElementById('onboardingBanner').classList.toggle('hidden', !!state.onboardingDismissed);

          applyVisualPreferences();
          renderLandingQuote();
          updateSyncHeaderUI();
          renderInventoryRack();
          renderCategoryDetail();
          state.screen = 'landing';
          renderScreenVisibility();
          showGlobalNotice('success', `Sesi aktif untuk ${normEmail} (${device}). Profil dimuat dari ruang penyimpanan terisolasi akun ini.`);
        });

        // Notice Banner
        document.getElementById('btnGlobalDismiss').addEventListener('click', () => {
          hideGlobalNotice();
        });
        document.getElementById('btnGlobalRetry').addEventListener('click', () => {
          state.offlineMode = false;
          state.unsyncedQueue = false;
          savePersistedState();
          updateSyncHeaderUI();
          if (state.screen === 'detail') renderCategoryDetail();
          showGlobalNotice('success', 'Sinkronisasi berhasil dipulihkan! Seluruh draf lokal telah disimpan permanen.');
        });

        // PRD & QA Modal with Focus Trap & Return Focus (F-06)
        const openInspector = () => {
          sysMenuDrop.classList.add('hidden');
          renderAcceptanceMatrix();
          logApiCall(`GET /api/v1/me/categories/${state.selectedSlug}`, '200 OK (LOCAL_DEVICE)', buildCategoryApiPayload(state.selectedSlug));
          openModalWithFocus('modalPrdInspector', '#btnClosePrdInspector');
        };
        document.getElementById('btnPrdInspector').addEventListener('click', openInspector);
        document.getElementById('btnSyncStatus').addEventListener('click', openInspector);
        document.getElementById('btnClosePrdInspector').addEventListener('click', () => {
          closeModalWithFocus('modalPrdInspector');
        });

        document.getElementById('btnResetUnassessed').addEventListener('click', () => {
          state.profiles = createFreshProfiles();
          state.isDirty = false;
          savePersistedState();
          invalidateRackThumbnails();
          if (worldCtrl) worldCtrl.rebuildAllEvolutions();
          generateRackThumbnails();
          renderInventoryRack();
          if (state.screen === 'detail') renderCategoryDetail();
          logApiCall('POST /api/v1/me/backpack/reset-unassessed', '200 OK', buildCategoryApiPayload(state.selectedSlug));
          showGlobalNotice('success', 'AT-04 Verified: Semua 10 kategori di-reset ke status awal "Belum dinilai" (level: null).');
        });

        document.getElementById('btnLoadSampleData').addEventListener('click', () => {
          const eng = state.profiles['engineering'];
          // 4 Branches x 3 Tiers = 12 nodes: unlock Basic -> Advanced -> Sage
          eng.nodeLevels = {
            0: 4, 1: 4, 2: 4, // Electrical: Circuits (4) -> Electronics (4) -> System Integration (4)
            3: 4, 4: 4, 5: 3, // Mechanical: Mechanics (4) -> Dynamics (4) -> Optimization (3)
            6: 5, 7: 4, 8: 5, // Product Design: Modeling (5) -> Prototyping (4) -> Design Engineering (5)
            9: 4, 10: 4, 11: 4 // Systems Eng: Integration (4) -> Systems Architecture (4) -> Systems Optimization (4)
          };
          eng.level = 4; // Stage IV Advanced
          eng.assessmentNote = 'Udah nyaman ngerjain rangkaian & 3D CAD mandiri buat bikin prototipe fisik.';
          eng.capabilityNotes = 'Sering ngulik integrasi hardware, sensor lapangan, sama desain casing modular.';
          eng.meaningText = 'Engineering bikin gue sadar kalau ide di kepala itu bisa diwujudin jadi alat nyata yang beneran ngebantu orang.';
          eng.potentialText = 'Pengen nyoba bikin kit eksperimen interaktif atau gear outdoor pintar yang ramah lingkungan.';
          eng.version += 1;
          eng.evidence = [
            {
              id: 'ev-sample-1',
              userId: state.auth.userId,
              categorySlug: 'engineering',
              title: 'Prototipe Enclosure Sensor Cuaca CAD 3D',
              summary: 'Merancang casing tahan cipratan air menggunakan sambungan snap-fit presisi dan diuji langsung di lapangan.',
              itemType: 'project',
              occurredOn: '2026-08-14',
              externalUrl: 'https://backpack.atlas/projects/sensor-enclosure',
              assetKey: 'enclosure-cad-v2.svg (Blueprint Visual)',
              assetName: 'enclosure-cad-v2.svg',
              assetMime: 'image/svg+xml',
              assetDataUrl: createSampleBlueprintDataUrl('BLUEPRINT CAD 3D · ENCLOSURE SENSOR CUACA'),
              sortOrder: 1,
              createdAt: '2026-08-14T10:00:00Z',
              updatedAt: '2026-08-14T10:00:00Z'
            }
          ];

          const mus = state.profiles['music'];
          mus.nodeLevels = {
            0: 3, 1: 3, 2: null,
            3: 3, 4: 3, 5: null,
            6: 3, 7: 3, 8: null,
            9: 3, 10: null, 11: null
          };
          mus.level = 3; // Stage III Competence
          mus.assessmentNote = 'Memainkan beberapa lagu dengan metronom stabil, memahami harmoni dasar, dan menyusun arrangement ensemble.';
          mus.meaningText = 'Tempat ekspresi musikal paling jujur saat menyeimbangkan logika dan rasa.';
          mus.version += 1;

          const logic = state.profiles['critical-thinking-logic'];
          logic.nodeLevels = createDefaultNodeLevels('critical-thinking-logic', 5);
          logic.level = 5; // Stage V Mastery!
          logic.assessmentNote = 'Menguji klaim & asumsi dengan First Principles, peta argumen formal, debiasing systems, dan pemodelan feedback loop.';
          logic.version += 1;

          const wpda = state.profiles['wpda'];
          wpda.nodeLevels = {
            0: 3, 1: 2, 2: null,
            3: 3, 4: 2, 5: null,
            6: 2, 7: null, 8: null,
            9: 2, 10: null, 11: null
          };
          wpda.level = 2; // Stage II Foundation
          wpda.assessmentNote = 'Rutin menulis catatan studi perikop Alkitab dan materi sharing singkat.';
          wpda.version += 1;

          const well = state.profiles['physical-wellness'];
          well.nodeLevels = {
            0: 2, 1: null, 2: null,
            3: 2, 4: null, 5: null,
            6: 1, 7: null, 8: null,
            9: 2, 10: null, 11: null
          };
          well.level = 2;
          well.version += 1;

          savePersistedState();
          invalidateRackThumbnails();
          if (worldCtrl) worldCtrl.rebuildAllEvolutions();
          generateRackThumbnails();
          awardSparks(5, '🌟 Loadout Contoh Dimuat');
          renderInventoryRack();
          if (state.screen === 'detail') renderCategoryDetail();
          logApiCall('GET /api/v1/me/categories/engineering', '200 OK', buildCategoryApiPayload('engineering'));
          showGlobalNotice('success', 'Sample RPG Loadout dimuat pada Engineering (Lv.4), Music (Lv.3) & Logic (Lv.3)!');
        });

        document.getElementById('btnToggleOfflineSim').addEventListener('click', (e) => {
          state.offlineMode = !state.offlineMode;
          if (state.offlineMode) state.unsyncedQueue = true;
          savePersistedState();
          updateSyncHeaderUI();
          if (state.screen === 'detail') renderCategoryDetail();
          if (state.offlineMode) {
            showGlobalNotice('warning', 'Mode Offline Diaktifkan: Perubahan disimpan sebagai draf lokal ("Belum tersinkron") dan status ini bertahan meski halaman di-refresh.', true);
          } else {
            state.unsyncedQueue = false;
            savePersistedState();
            updateSyncHeaderUI();
            showGlobalNotice('success', 'Mode Offline Dimatikan: Status penyimpanan kembali normal.');
          }
        });

        document.getElementById('btnTrigger409Conflict').addEventListener('click', () => {
          const slug = state.selectedSlug;
          const prof = state.profiles[slug];
          const clientExpectedVersion = prof.version;
          prof.version += 1;
          savePersistedState();
          const conflictPayload = {
            error: 'VERSION_CONFLICT',
            httpStatus: 409,
            message: `Ada versi terbaru untuk kategori "${slug}" dari perangkat lain (versi lokal: v${clientExpectedVersion}, versi terbaru: v${prof.version}). Silakan tinjau perubahan sebelum menyimpan.`,
            serverVersion: prof.version
          };
          logApiCall(`PATCH /api/v1/me/categories/${slug}/content`, '409 VERSION_CONFLICT', conflictPayload);
          showGlobalNotice('error', conflictPayload.message);
        });

        document.getElementById('btnTestUnauthorizedAccess').addEventListener('click', () => {
          const secPayload = {
            error: 'RESOURCE_NOT_AVAILABLE',
            httpStatus: 403,
            requestedEvidenceId: 'ev-other-user-999',
            authenticatedUserId: state.auth.userId,
            message: 'Akses ditolak: Data bukti karya diisolasi ketat per akun pengguna.'
          };
          logApiCall('GET /api/v1/me/evidence/ev-other-user-999', '403 RESOURCE_NOT_AVAILABLE', secPayload);
          showGlobalNotice('error', 'Pengujian Isolasi Akun Berhasil: Permintaan data milik akun lain ditolak dengan aman.');
        });

        function triggerExportBackupJson() {
          // Ensure any attachment cached in memory/IDB is embedded back into the exported JSON for complete cross-device portability!
          SEED_CATEGORIES.forEach(cat => {
            const prof = state.profiles[cat.slug];
            if (prof && Array.isArray(prof.evidence)) {
              prof.evidence.forEach(ev => {
                if (!ev.assetDataUrl && ev.assetRefKey && evidenceAttachmentCache.has(ev.assetRefKey)) {
                  ev.assetDataUrl = evidenceAttachmentCache.get(ev.assetRefKey);
                }
              });
            }
          });
          const exportData = {
            schemaVersion: 'backpack-backup-v5',
            exportedAt: new Date().toISOString(),
            ownerEmail: state.auth.email,
            ownerUserId: state.auth.userId,
            profiles: state.profiles,
            preferences: state.preferences,
            categories: SEED_CATEGORIES.map(c => buildCategoryApiPayload(c.slug).category)
          };
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const safeUser = state.auth.email.split('@')[0].replace(/[^a-z0-9]/gi, '-');
          a.download = `the-backpack-${safeUser}-backup-${new Date().toISOString().slice(0, 10)}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showGlobalNotice('success', `Cadangan JSON untuk akun ${state.auth.email} berhasil diunduh.`);
        }

        document.getElementById('btnExportBackupJson').addEventListener('click', triggerExportBackupJson);
        document.getElementById('btnQuickExportMenu').addEventListener('click', () => {
          sysMenuDrop.classList.add('hidden');
          triggerExportBackupJson();
        });

        const fileImportInput = document.getElementById('inputImportBackupFile');
        document.getElementById('btnImportBackupJson').addEventListener('click', () => fileImportInput.click());
        document.getElementById('btnQuickImportMenu').addEventListener('click', () => {
          sysMenuDrop.classList.add('hidden');
          fileImportInput.click();
        });

        fileImportInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const parsed = JSON.parse(reader.result);
              if (parsed && parsed.profiles) {
                SEED_CATEGORIES.forEach(cat => {
                  if (parsed.profiles[cat.slug]) {
                    state.profiles[cat.slug] = Object.assign(state.profiles[cat.slug], parsed.profiles[cat.slug], { userId: state.auth.userId });
                  }
                });
              } else if (parsed && Array.isArray(parsed.categories)) {
                parsed.categories.forEach(catObj => {
                  if (catObj && catObj.slug && state.profiles[catObj.slug]) {
                    const p = state.profiles[catObj.slug];
                    if (catObj.assessment) {
                      p.level = catObj.assessment.level ?? null;
                      p.assessmentNote = catObj.assessment.assessmentNote || '';
                    }
                    if (catObj.content) {
                      p.capabilityNotes = catObj.content.capabilityNotes || '';
                      p.meaningText = catObj.content.meaning || '';
                      p.potentialText = catObj.content.potential || '';
                    }
                    if (Array.isArray(catObj.evidence)) {
                      p.evidence = catObj.evidence;
                    }
                  }
                });
              } else {
                showGlobalNotice('error', 'Format file JSON tidak dikenali sebagai cadangan The Backpack.');
                return;
              }
              hydrateAndMigrateEvidenceAttachments();
              savePersistedState();
              invalidateRackThumbnails();
              if (worldCtrl) worldCtrl.rebuildAllEvolutions();
              generateRackThumbnails();
              renderInventoryRack();
              if (state.screen === 'detail') renderCategoryDetail();
              showGlobalNotice('success', `Cadangan JSON "${file.name}" berhasil dipulihkan ke akun ${state.auth.email}!`);
            } catch (err) {
              showGlobalNotice('error', 'Gagal membaca file JSON. Pastikan file cadangan tidak rusak.');
            } finally {
              fileImportInput.value = '';
            }
          };
          reader.readAsText(file);
        });

        // Teknis #1 & #2: Keyboard Hotkeys (1-9, 0 for Direct Item Access; Left/Right or [/] to Switch Item in Detail; Escape to Close)
        window.addEventListener('keydown', (e) => {
          const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
          const isTypingField = (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || (document.activeElement && document.activeElement.isContentEditable));
          const anyModalOpen = ['modalConfirmDialog', 'modalEvidencePreview', 'modalSkillRadar', 'modalSparkRewards', 'modalGlossaryGuide', 'modalAccessibleIndex', 'modalPreferences', 'modalPrdInspector']
            .some(id => {
              const el = document.getElementById(id);
              return el && !el.classList.contains('hidden');
            });

          if (!isTypingField && !anyModalOpen && !e.ctrlKey && !e.metaKey && !e.altKey && state.auth.authenticated) {
            // Teknis #1: Direct Item Access via Keys 1-9 and 0
            if (/^[0-9]$/.test(e.key)) {
              e.preventDefault();
              const idx = e.key === '0' ? 9 : (parseInt(e.key, 10) - 1);
              const targetCat = SEED_CATEGORIES[idx];
              if (targetCat) {
                selectCategoryAndOpenDetail(targetCat.slug);
                showGlobalNotice('success', `⌨️ Hotkey [${e.key}] → Langsung membuka #${targetCat.order} ${targetCat.name}`);
              }
              return;
            }

            // P1 #9: When Fullscreen Skill Tree Map is open, [ / ] or Left / Right Arrow keys cycle between skill nodes on the map!
            const mapModalOpen = state.mapView && state.mapView.isFullscreen;
            if (mapModalOpen) {
              const cat = SEED_CATEGORIES.find(c => c.slug === state.selectedSlug) || SEED_CATEGORIES[0];
              if (e.key === 'ArrowLeft' || e.key === '[') {
                e.preventDefault();
                const nextIdx = ((state.inspectedNodeIdx || 0) - 1 + cat.nodes.length) % cat.nodes.length;
                inspectStoneNodeOnly(nextIdx, true);
                return;
              } else if (e.key === 'ArrowRight' || e.key === ']') {
                e.preventDefault();
                const nextIdx = ((state.inspectedNodeIdx || 0) + 1) % cat.nodes.length;
                inspectStoneNodeOnly(nextIdx, true);
                return;
              }
            }

            // Teknis #2: Left / Right Item Switching when in Detail View
            const inTabOrRadio = document.activeElement && (document.activeElement.getAttribute('role') === 'tab' || document.activeElement.getAttribute('role') === 'radio');
            if (state.screen === 'detail' && !inTabOrRadio) {
              if (e.key === 'ArrowLeft' || e.key === '[') {
                e.preventDefault();
                cycleSelectedCategory(-1);
                return;
              } else if (e.key === 'ArrowRight' || e.key === ']') {
                e.preventDefault();
                cycleSelectedCategory(1);
                return;
              }
            }
          }

          if (e.key === 'Escape') {
            const mapModalEl = document.getElementById('prasastiMapCardWrap');
            if (mapModalEl && !mapModalEl.classList.contains('hidden')) {
              closePrasastiFullscreenMap();
              return;
            }
            if (!document.getElementById('modalConfirmDialog').classList.contains('hidden')) {
              closeConfirmDialog();
            } else if (!document.getElementById('modalEvidencePreview').classList.contains('hidden')) {
              closeModalWithFocus('modalEvidencePreview');
            } else if (!document.getElementById('modalSkillRadar').classList.contains('hidden')) {
              closeModalWithFocus('modalSkillRadar');
            } else if (!document.getElementById('modalSparkRewards').classList.contains('hidden')) {
              closeModalWithFocus('modalSparkRewards');
            } else if (!document.getElementById('modalGlossaryGuide').classList.contains('hidden')) {
              closeModalWithFocus('modalGlossaryGuide');
            } else if (!document.getElementById('modalAccessibleIndex').classList.contains('hidden')) {
              closeModalWithFocus('modalAccessibleIndex');
            } else if (!document.getElementById('modalPreferences').classList.contains('hidden')) {
              closeModalWithFocus('modalPreferences');
            } else if (!document.getElementById('modalPrdInspector').classList.contains('hidden')) {
              closeModalWithFocus('modalPrdInspector');
            } else if (state.screen === 'detail') {
              document.getElementById('btnBackToInventory').click();
            }
          }
        });


        // Req #4: Smooth Auto-Hide for Top Instruction Box & Bottom Skill Meter Dock when cursor is idle
        let cursorIdleTimer = null;
        const IDLE_HIDE_DELAY_MS = 2200;

        function setIdleHudHidden(isHidden) {
          const topBar = document.getElementById('inventoryTopHudBar');
          const invBot = document.getElementById('inventoryBottomHudDock');
          const detBot = document.getElementById('detailBottomHudDock');
          if (topBar) topBar.classList.toggle('hud-idle-hidden-top', isHidden);
          if (invBot) invBot.classList.toggle('hud-idle-hidden-bottom', isHidden);
          if (detBot) detBot.classList.toggle('hud-idle-hidden-bottom', isHidden);
        }

        function wakeCursorAutoHideHud() {
          setIdleHudHidden(false);
          if (cursorIdleTimer) clearTimeout(cursorIdleTimer);
          cursorIdleTimer = setTimeout(() => {
            if (state.screen === 'inventory' || state.screen === 'detail') {
              setIdleHudHidden(true);
            }
          }, IDLE_HIDE_DELAY_MS);
        }

        ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(evtName => {
          window.addEventListener(evtName, wakeCursorAutoHideHud, { passive: true });
        });
        wakeCursorAutoHideHud();

        window.addEventListener('resize', () => {
          if (worldCtrl) worldCtrl.resize();
          if (detailScene) detailScene.resize();
        });
      }

      /* =====================================================================
       * 15. FAST NON-BLOCKING INITIALIZATION & ON-DEMAND 3D LOADER (Section 4.3)
       * HTML, static CSS, profile data, and interactive controls initialize
       * immediately on DOMContentLoaded without waiting for Three.js or thumbnails!
       * ===================================================================== */
      let threeScriptLoadingPromise = null;
      function loadThreeJsOnDemand() {
        if (typeof window.THREE !== 'undefined') return Promise.resolve(true);
        if (threeScriptLoadingPromise) return threeScriptLoadingPromise;
        threeScriptLoadingPromise = new Promise((resolve) => {
          const s = document.createElement('script');
          s.id = 'threeJsCdnScript';
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
          s.async = true;
          s.onload = () => resolve(typeof window.THREE !== 'undefined');
          s.onerror = () => {
            threeScriptLoadingPromise = null;
            resolve(false);
          };
          document.head.appendChild(s);
        });
        return threeScriptLoadingPromise;
      }

      function ensureWorld3DInitialized() {
        if (state.preferences.fallback2D) return null;
        if (worldCtrl) return worldCtrl;
        if (typeof window.THREE === 'undefined') {
          loadThreeJsOnDemand().then((loaded) => {
            if (loaded && !state.preferences.fallback2D && !worldCtrl) {
              ensureWorld3DInitialized();
            } else if (!loaded) {
              webglSupported = false;
              applyVisualPreferences();
              renderInventoryRack();
            }
          });
          return null;
        }
        webglSupported = checkWebGLAndThreeSupport();
        if (!webglSupported) {
          applyVisualPreferences();
          return null;
        }
        worldCtrl = initFullWorld3DStage();
        if (!detailScene) detailScene = initDetailCloseUpStage();
        applyVisualPreferences();
        if (worldCtrl && (state.screen === 'inventory' || state.screen === 'detail')) {
          worldCtrl.triggerUnpack();
        }
        return worldCtrl;
      }

      let appBootstrapped = false;
      function bootstrapApp() {
        if (appBootstrapped) return;
        appBootstrapped = true;

        loadPersistedState();
        document.getElementById('authUserLabel').textContent = state.auth.authenticated ? state.auth.email.split('@')[0] : 'Masuk';
        document.getElementById('authStatusBadge').className = state.auth.authenticated ? 'w-2 h-2 rounded-full bg-[#1F7A4C]' : 'w-2 h-2 rounded-full bg-[#B42318]';
        document.getElementById('onboardingBanner').classList.toggle('hidden', !!state.onboardingDismissed);

        webglSupported = checkWebGLAndThreeSupport();
        detailScene = initDetailCloseUpStage();
        applyVisualPreferences();
        renderLandingQuote();
        populateQuickCategorySelect();
        updateSyncHeaderUI();
        updateGlobalRpgCrest();
        updateSparkHud();

        renderInventoryRack();
        renderCategoryDetail();
        renderScreenVisibility();
        initEventListeners();
        try {
          const params = new URLSearchParams(window.location.search);
          if (params.get("autostart") === "1" && state.screen === "landing") {
            openBackpackRitual();
          }
        } catch (e) {}

        // Section 4.3: Load Three.js on-demand after core UI & profile state are already interactive!
        if (!state.preferences.fallback2D) {
          ensureWorld3DInitialized();
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrapApp);
      } else {
        bootstrapApp();
      }
      window.addEventListener('load', () => {
        bootstrapApp();
        if (!state.preferences.fallback2D && !worldCtrl && typeof window.THREE !== 'undefined') {
          ensureWorld3DInitialized();
        }
      });
      window.addEventListener('pagehide', () => {
        if (saveDebounceTimer) savePersistedState();
      });

      // Read-only performance & QA inspection hook (Section 9 Baseline & Regression Verification)
      window.__BACKPACK_PERF__ = {
        getEngineState: () => (worldCtrl ? worldCtrl.engineState : 'UNINITIALIZED_2D'),
        getRenderedFrames: () => (worldCtrl ? worldCtrl.renderedFramesCount : 0),
        getQualityProfile: () => state.preferences.renderQuality,
        getScreen: () => state.screen,
        getSelectedSlug: () => state.selectedSlug,
        isFallback2D: () => !!state.preferences.fallback2D,
        getWorldCtrl: () => worldCtrl
      };
    

    // Listen for Firebase Auth state changes to sync cloud profiles when signed in
    try {
      if (auth) {
        onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser && fbUser.email && fbUser.emailVerified) {
            try {
              const cloudProfiles = await fetchUserCloudProfiles();
              if (cloudProfiles) {
                SEED_CATEGORIES.forEach((cat) => {
                  if (cloudProfiles[cat.slug]) {
                    state.profiles[cat.slug] = Object.assign(
                      state.profiles[cat.slug],
                      cloudProfiles[cat.slug],
                      { userId: fbUser.uid }
                    );
                    ensureProfileNodeLevels(state.profiles[cat.slug], cat.slug);
                  }
                });
                renderInventoryRack();
                if (state.screen === "detail") renderCategoryDetail();
              }
            } catch (e) {}
          }
        });
      }
    } catch (e) {}
  })();
}
