// @ts-nocheck
import { SEED_CATEGORIES, MASTERY_SCALE } from '../data/seedTaxonomy';

export function getMasteryInfo(level: number | null | undefined) {
  return MASTERY_SCALE.find((m) => m.level === level) || MASTERY_SCALE[0];
}

export function getEvolutionStage(level: number | null | undefined) {
  if (level === null || level === undefined || level <= 1) {
    return {
      stage: 1,
      code: 'STAGE_1',
      badge:
        level === 1
          ? '🪨 Tahap I · Exposure Sandstone (Lv.1)'
          : '🪨 Tahap I · Batu Slate (—)',
      shortBadge: '🪨 I',
      desc:
        level === 1
          ? 'Podium Batu Sandstone Ochre 1 lapis dengan siluet artefak ekspedisi dasar (1 — Exposure).'
          : 'Podium Batu Slate Abu-abu 1 lapis (Unassessed — "—").',
    };
  } else if (level === 2) {
    return {
      stage: 2,
      code: 'STAGE_2',
      badge: '🌿 Tahap II · Foundation Giok (Lv.2)',
      shortBadge: '🌿 II',
      desc: 'Podium 2 lapis Batu Giok Hutan (Jade Serpentine) dengan 4 kristal Peridot-Emerald (2 — Foundation).',
    };
  } else if (level === 3) {
    return {
      stage: 3,
      code: 'STAGE_3',
      badge: '💎 Tahap III · Competence Lapis (Lv.3)',
      shortBadge: '💎 III',
      desc: 'Podium 3 lapis Batu Lapis Lazuli Biru Tua dengan 4 kristal Cyan-Aquamarine (3 — Competence).',
    };
  } else if (level === 4) {
    return {
      stage: 4,
      code: 'STAGE_4',
      badge: '💙 Tahap IV · Advanced Safir (Lv.4)',
      shortBadge: '💙 IV',
      desc: 'Podium 4 lapis Batu Porphyry Ungu Imperial dengan 6 permata Royal Sapphire & pilar cahaya (4 — Advanced).',
    };
  } else {
    return {
      stage: 5,
      code: 'STAGE_5',
      badge: '♦️ Tahap V · Mastery Obsidian Rubi (Lv.5)',
      shortBadge: '♦️ V',
      desc: 'Podium 5 lapis Batu Obsidian Vulkanik berurat magma merah dengan 8 permata Imperial Ruby & Berlian Cyan (5 — Mastery)!',
    };
  }
}

export function normalizeAccountEmail(email: string) {
  return String(email || 'explorer@backpack.atlas').trim().toLowerCase();
}

export function deriveUserIdFromEmail(email: string) {
  const norm = normalizeAccountEmail(email);
  const safeSlug = norm.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return 'usr-' + (safeSlug || 'explorer-01');
}

export function createDefaultNodeLevels(catSlug: string, fillLevel = 1) {
  const cat = SEED_CATEGORIES.find((c) => c.slug === catSlug);
  const effFill =
    typeof fillLevel === 'number' && fillLevel >= 1 && fillLevel <= 5
      ? fillLevel
      : 1;
  const map: Record<number, number | null> = {};
  if (cat && Array.isArray(cat.nodes)) {
    cat.nodes.forEach((n, idx) => {
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

export function createDefaultNodeChecklists(
  catSlug: string,
  nodeLevelsMap: Record<number, number | null> = {}
) {
  const cat = SEED_CATEGORIES.find((c) => c.slug === catSlug);
  const checks: Record<number, Record<number, boolean[]>> = {};
  if (cat && Array.isArray(cat.nodes)) {
    cat.nodes.forEach((n) => {
      const curLvl =
        nodeLevelsMap && typeof nodeLevelsMap[n.flatIdx] === 'number'
          ? (nodeLevelsMap[n.flatIdx] as number)
          : 1;
      checks[n.flatIdx] = {};
      for (let lv = 1; lv <= 5; lv++) {
        const done = lv < curLvl;
        checks[n.flatIdx][lv] = [done, done, done];
      }
    });
  }
  return checks;
}

export function ensureProfileNodeChecklists(prof: any, catSlug: string) {
  const cat = SEED_CATEGORIES.find((c) => c.slug === catSlug);
  if (!cat || !prof) return;
  if (!prof.nodeChecklists || typeof prof.nodeChecklists !== 'object') {
    prof.nodeChecklists = createDefaultNodeChecklists(catSlug, prof.nodeLevels);
  }
  cat.nodes.forEach((n) => {
    if (
      !prof.nodeChecklists[n.flatIdx] ||
      typeof prof.nodeChecklists[n.flatIdx] !== 'object'
    ) {
      prof.nodeChecklists[n.flatIdx] = {};
    }
    const curLvl =
      prof.nodeLevels && typeof prof.nodeLevels[n.flatIdx] === 'number'
        ? prof.nodeLevels[n.flatIdx]
        : 1;
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

export function getNodeLevelChecklistArray(
  prof: any,
  catSlug: string,
  flatIdx: number,
  levelNum: number
): boolean[] {
  ensureProfileNodeChecklists(prof, catSlug);
  const lv = Math.max(1, Math.min(5, levelNum || 1));
  return prof.nodeChecklists[flatIdx][lv] || [false, false, false];
}

export function isNodeLevelChecklistComplete(
  prof: any,
  catSlug: string,
  flatIdx: number,
  levelNum: number
): boolean {
  const arr = getNodeLevelChecklistArray(prof, catSlug, flatIdx, levelNum);
  return arr.length >= 3 && arr.every(Boolean);
}

export function canNodeAdvanceToTargetLevel(
  prof: any,
  catSlug: string,
  flatIdx: number,
  currentLvl: number,
  targetLvl: number
) {
  if (targetLvl <= currentLvl) {
    return { allowed: true, missingLevel: null, checkedCount: 3 };
  }
  for (let lv = currentLvl; lv < targetLvl; lv++) {
    const arr = getNodeLevelChecklistArray(prof, catSlug, flatIdx, lv);
    const cnt = arr.filter(Boolean).length;
    if (cnt < 3) {
      return { allowed: false, missingLevel: lv, checkedCount: cnt };
    }
  }
  return { allowed: true, missingLevel: null, checkedCount: 3 };
}

export function evaluateNodeUnlockGate(
  catSlug: string,
  flatIdx: number,
  nodeLevelsObj: Record<number, number | null>
) {
  const cat = SEED_CATEGORIES.find((c) => c.slug === catSlug);
  if (!cat || !cat.nodes[flatIdx]) {
    return {
      unlocked: true,
      statusCode: 'UNLOCKED',
      missingReasons: [],
      prereqItems: [],
      gateFormula: 'Terbuka sejak awal',
    };
  }
  const node = cat.nodes[flatIdx];
  const levels = nodeLevelsObj || {};

  if (node.tierIdx === 0) {
    return {
      unlocked: true,
      statusCode: 'UNLOCKED',
      missingReasons: [],
      prereqItems: [],
      gateFormula: 'Tier 1 · Basic terbuka sejak awal (Tanpa prasyarat)',
    };
  }

  const missingReasons: string[] = [];
  const reqParts: string[] = [];
  const prereqItems: any[] = [];

  if (node.tierIdx === 1) {
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
      type: 'branch',
    });
    if (!ok) {
      missingReasons.push(
        `${parentNode.title} (Tier 1 Basic) butuh skor ≥ 3/5 (progres saat ini: ${curNum}/3)`
      );
    }
  } else if (node.tierIdx === 2) {
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
      type: 'branch',
    });
    if (!ok) {
      missingReasons.push(
        `${parentT2Node.title} (Tier 2 Advanced) butuh Level ≥ 3/5 (progres saat ini: ${
          parentT2Gate.unlocked ? curNum + '/3' : 'Terkunci · buka Tier 2 dulu'
        })`
      );
    }
  }

  if (Array.isArray(node.crossPrereqs) && node.crossPrereqs.length > 0) {
    node.crossPrereqs.forEach((cp) => {
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
        type: 'cross',
      });
      if (!ok) {
        missingReasons.push(
          `Prasyarat lintas cabang ${targetNode.title} (${targetNode.branchName}) butuh ≥ ${cp.minScore}/5 (progres saat ini: ${curNum}/${cp.minScore})`
        );
      }
    });
  }

  return {
    unlocked: missingReasons.length === 0,
    statusCode: missingReasons.length === 0 ? 'UNLOCKED' : 'LOCKED_0',
    missingReasons,
    prereqItems,
    gateFormula: reqParts.join(' + '),
  };
}

export function getDownstreamNodesUnlockedBy(cat: any, flatIdx: number) {
  if (!cat || !Array.isArray(cat.nodes)) return [];
  const downstream: any[] = [];
  const srcNode = cat.nodes[flatIdx];
  if (!srcNode) return downstream;
  if (srcNode.tierIdx < 2) {
    const nextIdx = srcNode.branchIdx * 3 + (srcNode.tierIdx + 1);
    if (cat.nodes[nextIdx]) {
      downstream.push({
        targetFlatIdx: nextIdx,
        title: cat.nodes[nextIdx].title,
        branchName: cat.nodes[nextIdx].branchName,
        requiredScore: 3,
        type: 'branch',
      });
    }
  }
  cat.nodes.forEach((cand) => {
    if (Array.isArray(cand.crossPrereqs)) {
      cand.crossPrereqs.forEach((cp) => {
        if (cp.branchIdx * 3 + cp.tierIdx === flatIdx) {
          downstream.push({
            targetFlatIdx: cand.flatIdx,
            title: cand.title,
            branchName: cand.branchName,
            requiredScore: cp.minScore,
            type: 'cross',
          });
        }
      });
    }
  });
  return downstream;
}

export function enforceUnlockGatesOnMap(
  catSlug: string,
  nodeLevelsObj: Record<number, number | null>
) {
  const cat = SEED_CATEGORIES.find((c) => c.slug === catSlug);
  if (!cat || !nodeLevelsObj) return;
  cat.nodes
    .filter((n) => n.tierIdx === 0)
    .forEach((n) => {
      if (
        typeof nodeLevelsObj[n.flatIdx] !== 'number' ||
        (nodeLevelsObj[n.flatIdx] as number) < 1
      ) {
        nodeLevelsObj[n.flatIdx] = 1;
      }
    });
  [1, 2].forEach((tierIdx) => {
    cat.nodes
      .filter((n) => n.tierIdx === tierIdx)
      .forEach((n) => {
        const gate = evaluateNodeUnlockGate(catSlug, n.flatIdx, nodeLevelsObj);
        if (!gate.unlocked) {
          nodeLevelsObj[n.flatIdx] = null;
        } else if (
          typeof nodeLevelsObj[n.flatIdx] !== 'number' ||
          (nodeLevelsObj[n.flatIdx] as number) < 1
        ) {
          nodeLevelsObj[n.flatIdx] = 1;
        }
      });
  });
}

export function computeCoreLevelFromNodes(
  catSlug: string,
  nodeLevelsObj: Record<number, number | null>
) {
  const cat = SEED_CATEGORIES.find((c) => c.slug === catSlug);
  if (!cat || !nodeLevelsObj) {
    return {
      coreLevel: null,
      exactAvg: 0,
      unlockedCount: 0,
      openGateCount: 0,
      totalNodes: cat ? cat.nodes.length : 0,
    };
  }
  enforceUnlockGatesOnMap(catSlug, nodeLevelsObj);
  const totalNodes = cat.nodes.length;
  const vals: number[] = [];
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
    return {
      coreLevel: null,
      exactAvg: 0,
      unlockedCount: 0,
      openGateCount,
      totalNodes,
    };
  }
  const sum = vals.reduce((a, b) => a + b, 0);
  const exactAvg = sum / vals.length;
  const coreLevel = Math.max(1, Math.min(5, Math.round(exactAvg)));
  return {
    coreLevel,
    exactAvg,
    unlockedCount: vals.length,
    openGateCount,
    totalNodes,
  };
}

export function isStrictHttpsUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}
