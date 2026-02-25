## 2025-05-15 - Improving Auth UX and Form Accessibility
**Learning:** React applications often miss standard HTML form wrappers, relying on debounced input or button clicks. This breaks standard keyboard accessibility (Enter key to submit) and results in poor UX during asynchronous operations without loading indicators.
**Action:** Always wrap input groups in a `<form>` element with an `onSubmit` handler. Replace debounced input states with reactive `isLoading` states and disabled button/input patterns during async actions to provide immediate visual feedback.
