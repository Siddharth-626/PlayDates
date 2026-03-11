## 2025-05-14 - Standardizing Form Submission and Loading States

**Learning:** This app frequently uses debounced buttons for submission, which lack visual feedback. A better pattern for this design system is to use semantic <form> elements with reactive isLoading states, disabling interactive elements and showing a Loader2 spinner during async operations. This improves both accessibility (Enter key support) and UX (clear progress indicator).

**Action:** Wrap auth and data entry fields in <form> elements, use a centralized isLoading state, and replace debouncing with explicit loading indicators and disabled button states.
