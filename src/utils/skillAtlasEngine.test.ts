import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_CATEGORIES } from '../data/seedTaxonomy';
import {
  createDefaultNodeLevels,
  createDefaultNodeChecklists,
  evaluateNodeUnlockGate,
  computeCoreLevelFromNodes,
  canNodeAdvanceToTargetLevel,
  getEvolutionStage,
  isStrictHttpsUrl,
} from './skillAtlasEngine';

test('Taxonomy contains all 10 Core Domains and 132 Skill Tree Nodes', () => {
  assert.equal(SEED_CATEGORIES.length, 10);
  const totalNodes = SEED_CATEGORIES.reduce((acc, c) => acc + c.nodes.length, 0);
  assert.equal(totalNodes, 132);
});

test('Tier 1 Basic nodes start unlocked at Level 1 while Tier 2/3 start locked', () => {
  const levels = createDefaultNodeLevels('engineering', 1);
  const gateT1 = evaluateNodeUnlockGate('engineering', 0, levels);
  const gateT2 = evaluateNodeUnlockGate('engineering', 1, levels);
  const gateT3 = evaluateNodeUnlockGate('engineering', 2, levels);

  assert.equal(gateT1.unlocked, true);
  assert.equal(gateT2.unlocked, false);
  assert.equal(gateT3.unlocked, false);
});

test('Unlocking Tier 1 to Level 3 opens Tier 2 Advanced gate automatically', () => {
  const levels = createDefaultNodeLevels('engineering', 1);
  levels[0] = 3; // Circuits (Basic) -> 3/5
  const stats = computeCoreLevelFromNodes('engineering', levels);
  const gateT2 = evaluateNodeUnlockGate('engineering', 1, levels);

  assert.equal(gateT2.unlocked, true);
  assert.equal(levels[1], 1); // Newly unlocked Tier 2 starts at Level 1
  assert.equal(stats.openGateCount, 5); // 4 Basic + 1 newly unlocked Advanced
});

test('3-Indicator Checklist Gate blocks level up until all 3 indicators are checked', () => {
  const levels = createDefaultNodeLevels('engineering', 1);
  const prof = {
    nodeLevels: levels,
    nodeChecklists: createDefaultNodeChecklists('engineering', levels),
  };

  // Initially 0/3 checked for node 0 at level 1
  const blocked = canNodeAdvanceToTargetLevel(prof, 'engineering', 0, 1, 2);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.missingLevel, 1);
  assert.equal(blocked.checkedCount, 0);

  // Check all 3 indicators on level 1
  prof.nodeChecklists[0][1] = [true, true, true];
  const allowed = canNodeAdvanceToTargetLevel(prof, 'engineering', 0, 1, 2);
  assert.equal(allowed.allowed, true);
});

test('Evolution stages map accurately across levels 1 to 5', () => {
  assert.equal(getEvolutionStage(1).stage, 1);
  assert.equal(getEvolutionStage(2).stage, 2);
  assert.equal(getEvolutionStage(3).stage, 3);
  assert.equal(getEvolutionStage(4).stage, 4);
  assert.equal(getEvolutionStage(5).stage, 5);
});

test('isStrictHttpsUrl validates only HTTPS URLs', () => {
  assert.equal(isStrictHttpsUrl('https://backpack.atlas/proyek'), true);
  assert.equal(isStrictHttpsUrl('http://backpack.atlas/proyek'), false);
  assert.equal(isStrictHttpsUrl('not-a-url'), false);
});
