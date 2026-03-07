## 2025-03-07 - Add Loading States to Async Auth
**Learning:** In Firebase-based applications, async authentication actions (like Google Login) often lack default UI feedback, leading to multiple submissions or user confusion. Adding an 'isLoading' state with visual spinners (Loader2) and disabling the button significantly improves perceived performance and prevents duplicate operations.
**Action:** Always wrap async auth logic in try/finally blocks to manage 'isLoading' state and provide visual feedback on the triggering element.
