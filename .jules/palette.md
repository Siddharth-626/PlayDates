## 2025-05-14 - [Improve Keyboard Accessibility and Loading Feedback in Signup]
**Learning:** Replacing debounced submission logic with reactive `isLoading` states and semantic `<form>` elements significantly improves both perceived performance (immediate feedback) and accessibility (Enter key support).
**Action:** Always prefer `<form onSubmit={...}>` with a typed `isLoading` state and disabled submission button over custom `onClick` handlers with debouncing for form-like interactions.
