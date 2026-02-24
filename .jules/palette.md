
## 2025-05-14 - Login Page Accessibility & Loading States
**Learning:** Authentication flows often lack proper semantic <form> wrappers, preventing keyboard submission (Enter key). Also, debounced buttons without loading states lead to poor user feedback and potential duplicate submissions.
**Action:** Always wrap auth inputs in a <form>, use onSubmit, and replace debouncing with explicit isLoading states and disabled inputs during async operations.
