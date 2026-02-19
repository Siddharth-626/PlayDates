# Sentinel Journal 🛡️

## 2025-05-15 - Insecure Firestore Rules
**Vulnerability:** Overly permissive write access in Firestore rules. Specifically, the `courts` and `matches` collections were writable by any authenticated user. Additionally, a collection group rule for `profile` allowed any authenticated user to write to any user's profile document.
**Learning:** Collection group rules in Firestore apply globally to any collection with the matching name. If not carefully scoped, they can easily bypass specific path-based rules. Also, using `allow write` is often too broad when only `update` or `create` is needed with specific conditions.
**Prevention:** Always use the principle of least privilege. Use specific `create`, `update`, and `delete` rules instead of a generic `write`. For collection group rules, strictly limit write access (usually to admins) and rely on path-specific rules for user-owned data. Always check that users can only modify documents they are involved in (e.g., as an owner or a participant).
