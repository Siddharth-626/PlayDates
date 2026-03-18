## 2025-05-21 - [Hardening Firestore Security Rules]
**Vulnerability:** Overly permissive Firestore rules allowed any authenticated user to write to court data, modify others' match data, and update any user's profile information.
**Learning:** Default rules in development often prioritize ease of use over security, leading to significant IDOR (Insecure Direct Object Reference) risks when collection group or top-level collection rules are too broad.
**Prevention:** Always implement strict ownership checks using `request.auth.uid` and use `affectedKeys()` to limit updates to specific allowed fields for non-owners. Ensure collection group rules are as restrictive as single collection rules.
