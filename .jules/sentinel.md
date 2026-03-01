## 2025-03-01 - Overly Permissive Collection Group Rules
**Vulnerability:** A collection group rule for `profile` was found that allowed any authenticated user to write to any document in any collection or subcollection named `profile`. This could lead to unauthorized modification of user profiles across the entire database.
**Learning:** Collection group rules match all collections with the specified ID, regardless of their path in the database hierarchy. If not carefully restricted, they can bypass more specific security rules defined on individual paths.
**Prevention:** Avoid using permissive `allow write` in collection group rules. Instead, prefer path-specific rules or use `allow write: if false;` for the collection group if specific paths already have their own access controls.
