## 2026-02-20 - [Auth Flow Accessibility & Feedback]
**Learning:** Authentication forms often miss standard accessibility patterns like `<form>` wrappers, which prevents "Enter" key submission. Additionally, using `debounce` for submission buttons provides poor feedback compared to a proper `isLoading` state and disabled inputs.
**Action:** Always wrap auth inputs in a `<form>` and replace debounced submission with a reactive loading state and disabled button/inputs.
