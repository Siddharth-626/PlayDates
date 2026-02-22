## 2025-05-22 - Firestore Collection Group Vulnerability
**Vulnerability:** Permissive 'allow write' rules in collection group matches (e.g., `match /{documentPath=**}/profile/{id}`) can override specific path restrictions elsewhere in the rules, allowing any authenticated user to modify data they shouldn't have access to.
**Learning:** In Firestore, if any rule matches and allows an operation, it is allowed. Collection group rules often use recursive wildcards (`**`) which match many paths, making them dangerous if not strictly restricted.
**Prevention:** Always restrict collection group write access to the most privileged users (e.g., `isAdmin()`) and let specific path rules handle granular user permissions.
