## 2025-05-22 - [Auth UX Improvement]
**Learning:** Replacing debounced submission logic with reactive `isLoading` states, spinners (Loader2), and disabled interactive elements provides immediate feedback and prevents duplicate submissions. Standard `<form>` wrapping is essential for keyboard accessibility (Enter key support).
**Action:** Always wrap input fields in a `<form>` and use `isLoading` states for async operations.
