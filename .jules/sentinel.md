## 2025-05-14 - Authorization Bypass in Firestore Collections
**Vulnerability:** Firestore rules for `matches` and `profile` collection groups were overly permissive, allowing any authenticated user to write (update/delete) any document.
**Learning:** Default "allow write: if request.auth != null" is a common but dangerous pattern that leads to IDOR (Insecure Direct Object Reference) vulnerabilities in multi-tenant or multi-user applications.
**Prevention:** Always restrict write access using document-level ownership checks (e.g., `request.auth.uid == resource.data.ownerId`) and use collection group rules sparingly with strict identity verification.
