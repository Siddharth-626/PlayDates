## 2025-05-14 - [Authentication UX Patterns]
**Learning:** Common patterns in this app include debounced submission logic (e.g., 1000ms delay) and missing <form> wrappers in authentication flows. These patterns negatively impact UX by making the interface feel unresponsive and preventing standard keyboard submission (Enter key).
**Action:** Replace debounced submission with reactive 'isLoading' states, spinners (Loader2), and disabled interactive elements. Always wrap authentication inputs in a <form> element to support accessibility and keyboard navigation.
