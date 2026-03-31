# Palette UX Journal

## 2026-03-04 - Semantic Interactive Elements and Loading States
**Learning:** This app had several instances of using `div` with `onClick` handlers for navigation and actions (e.g., chat back button). This pattern breaks keyboard accessibility and screen reader support. Additionally, async actions like sending messages lacked feedback, leading to potential duplicate submissions and poor user perception of app responsiveness.
**Action:** Always refactor interactive `div` elements into semantic `<button>` elements with clear `aria-label` attributes. Implement reactive `isLoading` states and disable buttons during async operations to prevent double-submission and provide immediate visual feedback (e.g., using `Loader2` spinner).
