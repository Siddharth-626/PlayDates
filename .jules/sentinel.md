## 2025-05-14 - Overly Permissive Collection Group Rules
**Vulnerability:** A collection group rule `match /{documentPath=**}/profile/{profileId}` allowed any authenticated user to write to any `profile` document in the database, overriding more specific path-based rules.
**Learning:** Firestore rules follow the principle that if any rule allows access, it is allowed. Collection group rules can inadvertently open up access to sensitive subcollections if not carefully restricted.
**Prevention:** Always restrict write access in collection group rules to the minimum necessary (e.g., `isAdmin()`), and rely on specific path rules for user-owned data.
