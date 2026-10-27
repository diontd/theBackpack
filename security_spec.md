# Security Specification — THE BACKPACK (Personal Skill Atlas RPG)

## 1. Data Invariants & Master Source of Truth

1. **Master Gate & Ownership Isolation**:
   - Every user owns a root document `/users/{userId}` where `userId == request.auth.uid` and `request.auth.token.email_verified == true`.
   - Subcollections `/users/{userId}/private/{infoId}`, `/users/{userId}/categoryProfiles/{categorySlug}`, and `/users/{userId}/categoryProfiles/{categorySlug}/evidence/{evidenceId}` MUST verify parent existence (`exists()`/`get()`) and confirm `get(...).data.userId == request.auth.uid` (Pillar 1 Master Gate).
2. **PII Isolation (Split Collection Strategy)**:
   - User email is stored exclusively in `/users/{userId}/private/{infoId}` and never exposed in public collections. Only the verified owner (`request.auth.uid == userId`) can read or write it.
3. **Strict Schema & Volumetric Boundaries**:
   - All string fields enforce explicit `.size()` bounds matching `firebase-blueprint.json` (`assessmentNote <= 1000`, `capabilityNotes <= 5000`, `meaningText <= 10000`, `potentialText <= 10000`, `title 1..120`, `summary <= 2000`, `externalUrl <= 500`).
   - All document IDs enforce `isValidId(id)` (`id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
   - `categorySlug` must belong to the 10 canonical Core Skill Domains.
4. **Temporal & Identity Immutability**:
   - `createdAt` must equal `request.time` on `create` and remain immutable (`incoming().createdAt == existing().createdAt`) on `update`.
   - `updatedAt` must equal `request.time` on both `create` and `update`.
   - `userId`, `categorySlug`, and `id` are immutable after creation.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Unverified Email Write**: Authenticated user with `email_verified: false` attempts to create `/users/{userId}`. -> `PERMISSION_DENIED`
2. **Identity Spoofing on UserAccount**: Authenticated user `uid_A` attempts to create `/users/uid_A` with payload `userId: "uid_B"`. -> `PERMISSION_DENIED`
3. **Shadow Field Injection on CategoryProfile**: User sends valid `CategoryProfile` payload plus extra field `"isAdmin": true`. -> `PERMISSION_DENIED`
4. **Invalid Category Slug**: User attempts to create `/users/{uid}/categoryProfiles/hacking-101` not in the 10 canonical slugs. -> `PERMISSION_DENIED`
5. **Orphaned CategoryProfile Creation**: User attempts to create `/users/{uid}/categoryProfiles/engineering` when `/users/{uid}` does not exist. -> `PERMISSION_DENIED`
6. **Oversized Meaning Text (Denial of Wallet)**: User submits `meaningText` with 10,001 characters (`maxLength: 10000`). -> `PERMISSION_DENIED`
7. **Client-Spoofed Timestamp**: User submits `createdAt` or `updatedAt` that does not match `request.time`. -> `PERMISSION_DENIED`
8. **Immutable Field Mutation on Update**: User attempts to update `createdAt` or `userId` on an existing `CategoryProfile`. -> `PERMISSION_DENIED`
9. **Insecure HTTP External URL on EvidenceItem**: User creates an `EvidenceItem` with `externalUrl: "http://malicious.example.com"`. -> `PERMISSION_DENIED`
10. **Unbounded Array Poisoning on EvidenceItem**: User creates an `EvidenceItem` with `usedNodeIds` containing 25 items (`max 18`) or non-integer first element. -> `PERMISSION_DENIED`
11. **Cross-User PII Read**: User `uid_B` attempts `get` or `list` on `/users/uid_A/private/info`. -> `PERMISSION_DENIED`
12. **Orphaned EvidenceItem Write**: User attempts to create `/users/{uid}/categoryProfiles/engineering/evidence/ev-1` when `/users/{uid}/categoryProfiles/engineering` does not exist. -> `PERMISSION_DENIED`
