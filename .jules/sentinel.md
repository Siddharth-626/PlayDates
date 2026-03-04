## 2026-03-04 - Overly Permissive Firestore Collection Group Rules
**Vulnerability:** Permissive 'allow write' on a collection group (e.g., `match /{documentPath=**}/profile/{id}`) can override more specific path-based rules, allowing unauthorized global access to documents.
**Learning:** Firestore evaluates all matching rules, and any rule that evaluates to true will allow the operation. A broad collection group rule can inadvertently grant access to documents intended to be restricted by specific path rules.
**Prevention:** Always restrict collection group write access to admins or use specific field-level validation and authentication checks. Prefer specific path rules for user-owned data.
