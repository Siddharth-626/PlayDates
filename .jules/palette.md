## 2025-05-14 - Semantic Forms and Loading States in Auth
**Learning:** Using `div` containers with `onClick` handlers for authentication prevents keyboard submission (Enter key) and often leads to the use of `debounce` as a workaround for duplicate submissions. This pattern degrades accessibility and delays user feedback.
**Action:** Always wrap authentication inputs in a semantic `<form>` element and manage submission via `onSubmit`. Use reactive `isLoading` states to disable buttons and show visual feedback (spinners) instead of debouncing the submit handler.
