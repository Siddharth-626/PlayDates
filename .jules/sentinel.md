## 2025-05-14 - Harden Firestore rules and fix data integrity bug
**Vulnerability:** Overly permissive Firestore security rules for 'courts', 'matches', and 'profile' collections allowed authenticated users to potentially overwrite entire documents or sensitive fields (e.g., match results or other users' profiles). Additionally, a utility function 'ChangeFieldInDb' had a hardcoded 'players' field, ignoring the intended dynamic field update, which could lead to data corruption.

**Learning:** Using `request.resource.data.diff(resource.data).affectedKeys()` in Firestore rules is a powerful way to implement the Principle of Least Privilege by allowing updates only to specific, non-sensitive fields. This prevents unauthorized users from modifying critical data while still enabling necessary application features like adding reviews or reporting scores.

**Prevention:** Always use fine-grained Firestore security rules that explicitly define which fields can be updated by whom. Avoid using generic 'allow write' rules. In application code, ensure utility functions correctly handle dynamic parameters and avoid hardcoding field names that are meant to be variable.
