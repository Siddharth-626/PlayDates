## 2025-06-25 - Overly Permissive Collection Group Rules
**Vulnerability:** The Firestore security rules had a collection group rule `match /{documentPath=**}/profile/{profileId}` that allowed any authenticated user to write to any profile document in the database, regardless of ownership.
**Learning:** Collection group rules match documents across the entire database. If not carefully restricted (e.g., by checking `request.auth.uid`), they can unintentionally grant broad access that overrides more specific path-based rules.
**Prevention:** Always use `isAdmin()` or strict ownership checks (like `request.auth.uid == userId`) in collection group rules. Favor specific path matches over collection group matches for sensitive user data.
