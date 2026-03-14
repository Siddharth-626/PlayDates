## 2025-05-15 - Firestore Rule IDOR and Overly Permissive Write

**Vulnerability:** Insecure Direct Object Reference (IDOR) and overly permissive collection group write access in Firestore rules. Specifically, the `matches` and `courts` collections allowed any authenticated user to `write` (update/delete) any document. Additionally, the `profile` collection group rule allowed any authenticated user to write to any user's profile.

**Learning:** Firestore's `allow write` is a shorthand for `create`, `update`, and `delete`. When used without specific ownership checks (like `resource.data.host.userUid == request.auth.uid`), it creates an IDOR vulnerability. Collection group rules can also accidentally grant broad permissions if not carefully restricted.

**Prevention:** Always decompose `write` into `create`, `update`, and `delete` when ownership matters. Use `resource.data` to check existing document fields and `request.resource.data` to validate incoming data. Avoid using permissive `allow write` in collection group rules; prefer specific path-based rules for write operations.
