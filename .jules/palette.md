## 2025-03-12 - Interactive elements semantics
**Learning:** Found a pattern of using `div` elements with `onClick` handlers for interactive actions (chat buttons, back buttons). This prevents keyboard navigation and screen reader accessibility.
**Action:** Always use semantic `<button>` elements for interactive actions, and ensure they have descriptive `aria-label` attributes if they are icon-only.
