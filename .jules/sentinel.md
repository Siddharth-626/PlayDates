## 2025-05-22 - Insecure Collection Group Write Permissions
**Vulnerability:** Overly permissive `allow write: if request.auth != null` on the `profile` collection group.
**Learning:** This allowed any authenticated user to write to any user's profile document across the entire database, as collection group rules are evaluated in addition to path-specific rules.
**Prevention:** Always restrict collection group `write` access to the most limited role possible (e.g., `isAdmin()`), and rely on specific collection paths for user-owned data access.

## 2025-05-22 - Unsupported Lambda Macros in Firestore Rules
**Vulnerability:** Attempting to use `list.exists(var, condition)` in Firestore rules.
**Learning:** While some documentation suggests lambda-style macros for lists, they were found to be unsupported or caused syntax errors in this project's rule evaluation environment.
**Prevention:** Use simpler membership checks like `uid in list` or `list.hasAny([val])` when possible, and ensure a separate list of identifiers (like UIDs) exists if deep object property checking is needed.
