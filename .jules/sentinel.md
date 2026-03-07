## 2025-05-15 - Firestore Rules Over-permissiveness
**Vulnerability:** Permissive Firestore security rules allowed any authenticated user to create, update, or delete any document in the `matches` and `courts` collections, and any profile in the `profile` collection group.
**Learning:** Defaulting to `allow write: if request.auth != null` is a common but dangerous pattern that bypasses document ownership and field-level validation.
**Prevention:** Always use `resource.data` to check for ownership (e.g., `request.auth.uid == resource.data.host.userUid`) and `request.resource.data.diff(resource.data).affectedKeys()` to restrict updates to specific fields for non-owners.
