## 2025-05-22 - Over-permissive Collection Group Rules
**Vulnerability:** Insecure collection group rule for `profile` documents allowed any authenticated user to write to any user's profile.
**Learning:** Collection group rules (`match /{documentPath=**}/profile/{profileId}`) match documents across the entire database hierarchy. If such a rule is too permissive, it can override more restrictive rules defined at specific paths.
**Prevention:** Avoid using permissive `allow write` in collection group rules. Instead, rely on specific path rules for writes and use collection group rules primarily for broad read access if necessary, or ensure they also include strict authorization checks.
