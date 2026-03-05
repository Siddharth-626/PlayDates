## 2025-05-15 - Broken Access Control in Firestore Rules
**Vulnerability:** Overly permissive Firestore security rules allowed any authenticated user to create, update, or delete documents in the `matches`, `courts`, and `profile` (collection group) collections.
**Learning:** Defaulting to `allow write: if request.auth != null` is a common but dangerous anti-pattern that grants excessive permissions. It fails to enforce ownership or role-based access control.
**Prevention:** Always use granular rules. For updates, use `request.resource.data.diff(resource.data).affectedKeys().hasOnly([...])` to restrict non-owners to specific fields (e.g., participants joining a match) and restrict full updates/deletes to owners or admins.
