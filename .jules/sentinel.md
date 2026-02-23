## 2025-05-15 - [Insecure Firestore Collection Group Rules]
**Vulnerability:** A collection group rule `match /{documentPath=**}/profile/{profileId}` was allowing any authenticated user to write to any document ending in `profile/{profileId}`.
**Learning:** Collection group rules match documents globally across the database. If they are more permissive than specific path rules, they can create a "backdoor" to sensitive documents (like user profiles).
**Prevention:** Always restrict collection group write access to admins or use extremely strict identity checks that verify ownership even without the full path context.

## 2025-05-15 - [Firestore Security Rules List Macros Syntax]
**Vulnerability:** Incorrect syntax in Firestore security rules can cause deployment failures and lead to unpatched vulnerabilities.
**Learning:** Firestore rules use Common Expression Language (CEL). Macros like `.exists()` and `.all()` use the `(var, expression)` syntax (e.g., `list.exists(p, p.uid == auth.uid)`), not JavaScript arrow functions `(p => ...)`.
**Prevention:** Always use correct CEL syntax for Firestore rules macros and verify rules against official documentation or using the Firebase emulator suite.
