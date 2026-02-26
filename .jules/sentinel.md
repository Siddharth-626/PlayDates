## 2025-05-15 - Permissive Collection Group Rules Overriding Specific Path Restrictions
**Vulnerability:** A collection group rule `match /{documentPath=**}/profile/{profileId}` allowed any authenticated user to write to any document in a `profile` collection, bypassing more restrictive rules defined at specific paths like `users/{userId}/profile/{profileId}`.
**Learning:** Firestore rules grant access if *any* matching rule allows it. Collection group rules can inadvertently grant broad access to documents that were intended to be restricted by more specific path rules.
**Prevention:** Avoid using `allow write` in collection group rules unless they are restricted to admins or use strict identity verification. Always prioritize specific path rules for user-owned data.
