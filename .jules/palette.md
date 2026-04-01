## 2025-05-14 - Semantic Interactive Elements
**Learning:** Using `div` with `onClick` for interactive elements is an accessibility anti-pattern that prevents keyboard navigation and screen reader recognition. Semantic `<button>` elements should be used instead.
**Action:** Always prefer `<button>` for clickable actions and ensure they have `aria-label` when icon-only, along with proper `focus-visible` styles.
