## 2025-05-15 - [Unified Authentication UX]
**Learning:** React fragments in the authentication flow (Login/Signup) lacked semantic `<form>` wrappers, preventing standard keyboard "Enter" submission and requiring manual mouse clicks.
**Action:** Always wrap input groups in a `<form>` element with an `onSubmit` handler to ensure full keyboard accessibility.

## 2025-05-15 - [Reactive Async States]
**Learning:** Debounced submission logic in authentication (Login/Signup) created a perceived lag and allowed for duplicate submissions before the debounce timer expired.
**Action:** Replace debounced submission with a reactive `isLoading` state that disables interactive elements and provides immediate visual feedback (spinners).
